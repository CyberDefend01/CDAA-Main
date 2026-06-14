// ─────────────────────────────────────────────────────────────
// send-smtp-email
// Sends HUMAN-authored mail (admission / registration decisions,
// support replies) via Zoho SMTP — separate from automated Resend mail.
//
// Required Supabase secrets:
//   ZOHO_SMTP_HOST      e.g. smtp.zoho.com   (or smtp.zoho.eu / .in)
//   ZOHO_SMTP_PORT      465
//   ZOHO_SMTP_USER      the full mailbox address that authenticates,
//                       e.g. admissions@cyberdefendafrica.org
//   ZOHO_SMTP_PASSWORD  Zoho app-specific password (NOT the login password)
//
// Only admins may call this function.
// ─────────────────────────────────────────────────────────────
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { renderEmail, type Accent } from "../_shared/email-template.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BRAND = "Cyber Defend Africa";

type EmailKind = "admission" | "registration" | "support" | "custom";

interface SmtpEmailRequest {
  kind: EmailKind;
  to: string;
  toName?: string;
  subject: string;
  // Either pass raw `bodyHtml`, or pass `message` (plain paragraphs) to wrap in the brand layout
  message?: string;
  bodyHtml?: string;
  fromAddress?: string; // optional override, must be a Zoho mailbox you own
  fromName?: string;
}

// Branded wrapper for plain-text messages, via the shared design system.
// Splits the admin's plain text into paragraphs and renders the brand template.
function wrapLayout(kind: EmailKind, message: string, subject: string): string {
  const accent: Accent =
    kind === "admission" ? "emerald" :
    kind === "registration" ? "sky" :
    "cobalt";

  const eyebrow =
    kind === "admission" ? "Admissions" :
    kind === "registration" ? "Registration" :
    kind === "support" ? "Support" : undefined;

  // Each blank-line-separated chunk becomes a paragraph; single newlines become <br>.
  const blocks = message
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => ({ type: "text" as const, html: p.replace(/\n/g, "<br>") }));

  return renderEmail({
    accent,
    preheader: subject,
    eyebrow,
    title: subject,
    blocks,
    signoff: `Warm regards,<br/><strong>The Cyber Defend Africa Team</strong>`,
  });
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  try {
    // ── Auth: require an admin caller ──
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const anonClient = createClient(supabaseUrl, anonKey);
    const { data: { user: caller }, error: authError } =
      await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Verify admin role
    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: isAdmin } = await adminClient.rpc("has_role", {
      _user_id: caller.id, _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden — admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Parse + validate ──
    const body: SmtpEmailRequest = await req.json();
    const { kind, to, toName, subject, message, bodyHtml, fromAddress, fromName } = body;

    if (!to || !subject || (!message && !bodyHtml)) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, and message or bodyHtml" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    // Basic email + header-injection guard
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(to)) {
      return new Response(JSON.stringify({ error: "Invalid recipient email" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const safeSubject = subject.replace(/[\r\n]/g, " ").slice(0, 200);

    // ── SMTP config ──
    const host = Deno.env.get("ZOHO_SMTP_HOST") ?? "smtp.zoho.com";
    const port = Number(Deno.env.get("ZOHO_SMTP_PORT") ?? "465");
    const user = Deno.env.get("ZOHO_SMTP_USER") ?? "";
    const pass = Deno.env.get("ZOHO_SMTP_PASSWORD") ?? "";

    if (!user || !pass) {
      return new Response(
        JSON.stringify({ error: "SMTP not configured. Set ZOHO_SMTP_USER and ZOHO_SMTP_PASSWORD secrets." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // From must be a mailbox the SMTP account is allowed to send as.
    // Default to the authenticating user; allow override only within the same domain.
    let fromAddr = user;
    if (fromAddress && emailRe.test(fromAddress)) {
      const userDomain = user.split("@")[1]?.toLowerCase();
      const overrideDomain = fromAddress.split("@")[1]?.toLowerCase();
      if (userDomain && overrideDomain === userDomain) fromAddr = fromAddress;
    }
    const fromDisplay = `${fromName || BRAND} <${fromAddr}>`;

    const html = bodyHtml ?? wrapLayout(kind || "custom", message || "", safeSubject);

    // ── Send via SMTP ──
    const client = new SMTPClient({
      connection: {
        hostname: host,
        port,
        tls: true,
        auth: { username: user, password: pass },
      },
    });

    await client.send({
      from: fromDisplay,
      to: toName ? `${toName} <${to}>` : to,
      subject: safeSubject,
      content: "auto",
      html,
    });
    await client.close();

    // ── Log to email_logs (best-effort) ──
    try {
      await adminClient.from("email_logs").insert({
        recipient: to,
        email_type: `smtp-${kind || "custom"}`,
        subject: safeSubject,
        status: "sent",
        priority: "normal",
        tags: ["smtp", "human", kind || "custom"],
        sent_at: new Date().toISOString(),
        metadata: { sent_by: caller.email, from: fromAddr },
      });
    } catch (_) { /* logging is non-critical */ }

    return new Response(
      JSON.stringify({ success: true, from: fromAddr, to }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("SMTP send error:", msg);
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
};

serve(handler);
