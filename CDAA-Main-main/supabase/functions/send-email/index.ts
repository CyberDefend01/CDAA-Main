import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SENDER = "Cyber Defend Africa <noreply@admin.cyberdefendafrica.org>";
const LOGO_URL = "https://cyberdefendafrica.org/logo.png";
const MAX_RETRIES = 3;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10; // per recipient per minute

// ─── In-memory rate limiter (per cold-start) ───
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(recipient: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(recipient);
  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(recipient, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) return false;
  bucket.count++;
  return true;
}

// ─── Email type definitions ───
type EmailType =
  | "welcome"
  | "email-verification"
  | "password-reset"
  | "security-alert"
  | "admin-new-user"
  | "account-activity"
  | "system-alert"
  | "course-completed"
  | "quiz-passed"
  | "certificate-earned";

interface EmailRequest {
  type: EmailType;
  to: string;
  variables: Record<string, string>;
  priority?: "low" | "normal" | "high";
  tags?: string[];
}

// ─── Shared HTML layout ───
function layout(
  headerGradient: string,
  icon: string,
  title: string,
  bodyHtml: string,
  ctaUrl?: string,
  ctaText?: string,
  ctaColor?: string,
): string {
  const cta =
    ctaUrl && ctaText
      ? `<div style="text-align:center;margin:32px 0">
           <a href="${ctaUrl}" style="display:inline-block;background:${ctaColor || "#06b6d4"};border-radius:8px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;padding:14px 32px;box-shadow:0 4px 14px rgba(6,182,212,0.4)">${ctaText}</a>
         </div>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:20px 0;background-color:#0a0a0f}
.wrap{max-width:600px;margin:0 auto;background:#12121a;border-radius:12px;overflow:hidden;border:1px solid #1e1e2e;position:relative}
.header{background:${headerGradient};padding:28px 40px;text-align:center}
.logo-text{color:#fff;font-size:22px;font-weight:bold;margin:0;text-shadow:0 2px 4px rgba(0,0,0,.2)}
.body{padding:40px;position:relative}
.watermark{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:.03;width:200px;pointer-events:none}
.icon{font-size:56px;text-align:center;margin-bottom:12px}
h1{color:#fff;font-size:26px;font-weight:bold;margin:0 0 20px;text-align:center}
p{color:#e0e0e0;font-size:15px;line-height:1.7;margin:0 0 14px}
.muted{color:#888;font-size:13px;text-align:center}
.card{background:#1e1e2e;border-radius:10px;padding:20px;margin:20px 0;border:1px solid #2e2e3e;text-align:center}
.card-label{color:#06b6d4;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px}
.card-value{color:#fff;font-size:22px;font-weight:bold;margin:0}
.divider{border:none;border-top:1px solid #1e1e2e;margin:0}
.footer{padding:24px 40px;text-align:center}
.footer p{color:#888;font-size:13px;margin:0 0 8px}
.footer a{color:#06b6d4;text-decoration:none}
.footer .copy{color:#555;font-size:11px}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <img src="${LOGO_URL}" alt="CDA" width="40" height="40" style="vertical-align:middle;margin-right:10px;border-radius:8px" onerror="this.style.display='none'">
    <span class="logo-text">Cyber Defend Africa</span>
  </div>
  <div class="body">
    <img src="${LOGO_URL}" class="watermark" alt="" onerror="this.style.display='none'">
    <div class="icon">${icon}</div>
    <h1>${title}</h1>
    ${bodyHtml}
    ${cta}
  </div>
  <hr class="divider">
  <div class="footer">
    <p><strong>Cyber Defend Africa Academy</strong><br>Your gateway to cybersecurity excellence</p>
    <p><a href="https://cyberdefendafrica.com">Website</a> &bull; <a href="https://cyberdefendafrica.com/courses">Courses</a> &bull; <a href="https://cyberdefendafrica.com/contact">Support</a></p>
    <p class="copy">&copy; ${new Date().getFullYear()} Cyber Defend Africa. All rights reserved.</p>
  </div>
</div>
</body>
</html>`;
}

// ─── Template registry ───
function buildEmail(
  type: EmailType,
  v: Record<string, string>,
): { subject: string; html: string } {
  const name = v.user_name || "User";
  const dashUrl = v.dashboard_link || "https://cyberdefendafrica.com";

  switch (type) {
    case "welcome":
      return {
        subject: "Welcome to Cyber Defend Africa Academy! 🎉",
        html: layout(
          "linear-gradient(135deg,#10b981,#06b6d4)",
          "🎉",
          "Welcome to the Academy!",
          `<p>Hi <strong>${name}</strong>,</p>
           <p>Your account is ready! You now have access to world-class cybersecurity courses, certifications, and a thriving community of cyber defenders.</p>
           <div class="card">
             <p class="card-label">What's Next</p>
             <p style="color:#e0e0e0;font-size:14px;margin:0">Browse courses &rarr; Enroll &rarr; Learn &rarr; Get certified</p>
           </div>`,
          `${dashUrl}/student/courses`,
          "Explore Courses",
          "#10b981",
        ),
      };

    case "email-verification":
      return {
        subject: "Verify your email — Cyber Defend Africa",
        html: layout(
          "linear-gradient(135deg,#06b6d4,#8b5cf6)",
          "✉️",
          "Verify Your Email",
          `<p>Hi <strong>${name}</strong>,</p>
           <p>Please verify your email address to activate your account and start your cybersecurity journey.</p>`,
          v.verification_link || "#",
          "Verify Email Address",
          "#06b6d4",
        ),
      };

    case "password-reset":
      return {
        subject: "Reset your password — Cyber Defend Africa",
        html: layout(
          "linear-gradient(135deg,#f59e0b,#ef4444)",
          "🔐",
          "Reset Your Password",
          `<p>Hi <strong>${name}</strong>,</p>
           <p>We received a request to reset the password for your account. Click below to create a new password.</p>
           <div class="card" style="border-color:rgba(245,158,11,.3);background:rgba(245,158,11,.05)">
             <p style="color:#f59e0b;font-size:13px;margin:0">⚠️ If you didn't request this, please ignore this email or contact support.</p>
           </div>
           <p class="muted">This link expires in 1 hour.</p>`,
          v.reset_link || "#",
          "Reset Password",
          "#f59e0b",
        ),
      };

    case "security-alert":
      return {
        subject: "🚨 Security Alert — Cyber Defend Africa",
        html: layout(
          "linear-gradient(135deg,#ef4444,#f59e0b)",
          "🚨",
          "Security Alert",
          `<p>Hi <strong>${name}</strong>,</p>
           <p>We detected a new login to your account from an unrecognized device or location.</p>
           <div class="card" style="border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.05);text-align:left">
             <p style="color:#e0e0e0;font-size:14px;margin:0 0 8px"><strong>Device:</strong> ${v.device || "Unknown"}</p>
             <p style="color:#e0e0e0;font-size:14px;margin:0 0 8px"><strong>Location:</strong> ${v.location || "Unknown"}</p>
             <p style="color:#e0e0e0;font-size:14px;margin:0 0 8px"><strong>Time:</strong> ${v.time || new Date().toISOString()}</p>
             <p style="color:#e0e0e0;font-size:14px;margin:0"><strong>IP:</strong> ${v.ip_address || "Unknown"}</p>
           </div>
           <p>If this was you, no action is needed. If not, please secure your account immediately.</p>`,
          `${dashUrl}/student/settings`,
          "Secure My Account",
          "#ef4444",
        ),
      };

    case "admin-new-user":
      return {
        subject: `New User Registration: ${name}`,
        html: layout(
          "linear-gradient(135deg,#8b5cf6,#06b6d4)",
          "👤",
          "New User Registered",
          `<p>A new user has registered on the platform.</p>
           <div class="card">
             <p class="card-label">User Details</p>
             <p class="card-value">${name}</p>
             <p style="color:#888;font-size:13px;margin:6px 0 0">${v.user_email || ""}</p>
           </div>`,
          `${dashUrl}/admin/users`,
          "View in Admin Panel",
          "#8b5cf6",
        ),
      };

    case "account-activity":
      return {
        subject: "Account Activity Notice — Cyber Defend Africa",
        html: layout(
          "linear-gradient(135deg,#06b6d4,#10b981)",
          "📋",
          "Account Activity",
          `<p>Hi <strong>${name}</strong>,</p>
           <p>The following activity was recorded on your account:</p>
           <div class="card">
             <p class="card-label">Activity</p>
             <p style="color:#e0e0e0;font-size:14px;margin:0">${v.activity || "Account update"}</p>
             <p style="color:#888;font-size:12px;margin:6px 0 0">${v.time || new Date().toISOString()}</p>
           </div>`,
          `${dashUrl}/student/settings`,
          "View Account",
        ),
      };

    case "system-alert":
      return {
        subject: "⚙️ System Alert — Cyber Defend Africa",
        html: layout(
          "linear-gradient(135deg,#64748b,#475569)",
          "⚙️",
          "System Alert",
          `<p>${v.message || "A system event requires your attention."}</p>
           <div class="card">
             <p class="card-label">Alert Details</p>
             <p style="color:#e0e0e0;font-size:14px;margin:0">${v.activity || v.message || "N/A"}</p>
             <p style="color:#888;font-size:12px;margin:6px 0 0">${v.time || new Date().toISOString()}</p>
           </div>`,
          dashUrl,
          "Open Dashboard",
          "#64748b",
        ),
      };

    case "course-completed":
      return {
        subject: `🎓 Course Completed: ${v.course_name || "Course"}`,
        html: layout(
          "linear-gradient(135deg,#10b981,#06b6d4)",
          "🎓",
          "Course Completed!",
          `<p>Congratulations, <strong>${name}</strong>!</p>
           <p>You have successfully completed:</p>
           <div class="card">
             <p class="card-label">Course</p>
             <p class="card-value">${v.course_name || "Course"}</p>
           </div>
           <p>Your dedication to cybersecurity excellence is commendable. Keep learning!</p>`,
          `${dashUrl}/student/courses`,
          "View Progress",
          "#10b981",
        ),
      };

    case "quiz-passed":
      return {
        subject: `🏆 Quiz Passed: ${v.quiz_name || "Quiz"}`,
        html: layout(
          "linear-gradient(135deg,#8b5cf6,#06b6d4)",
          "🏆",
          "Quiz Passed!",
          `<p>Outstanding work, <strong>${name}</strong>!</p>
           <p>You passed the quiz:</p>
           <div class="card">
             <p class="card-label">Quiz</p>
             <p class="card-value">${v.quiz_name || "Quiz"}</p>
             <p style="color:#888;font-size:13px;margin:6px 0 0">From: ${v.course_name || ""}</p>
           </div>
           <div style="text-align:center;margin:16px 0">
             <span style="display:inline-block;background:linear-gradient(135deg,#10b981,#06b6d4);border-radius:50px;color:#fff;font-size:28px;font-weight:bold;padding:14px 28px">${v.score || "0"}%</span>
           </div>`,
          `${dashUrl}/student/quizzes`,
          "View Quizzes",
        ),
      };

    case "certificate-earned":
      return {
        subject: `🏅 Certificate Earned: ${v.course_name || "Course"}`,
        html: layout(
          "linear-gradient(135deg,#f59e0b,#10b981)",
          "🏅",
          "Certificate Earned!",
          `<p>Congratulations, <strong>${name}</strong>!</p>
           <p>You earned a certificate for:</p>
           <div class="card" style="border-color:rgba(245,158,11,.3);background:linear-gradient(135deg,rgba(245,158,11,.08),rgba(16,185,129,.08))">
             <p style="color:#f59e0b;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px">Certificate of Completion</p>
             <p class="card-value">${v.course_name || "Course"}</p>
             <p style="color:#f59e0b;font-size:11px;font-family:monospace;margin:8px 0 0">ID: ${v.certificate_id || "N/A"}</p>
           </div>`,
          `${dashUrl}/student/certificates`,
          "View Certificate",
          "#f59e0b",
        ),
      };

    default:
      throw new Error(`Unknown email type: ${type}`);
  }
}

// ─── Retry wrapper ───
async function sendWithRetry(
  to: string,
  subject: string,
  html: string,
  maxRetries: number,
): Promise<{ success: boolean; data?: unknown; error?: string; retries: number }> {
  let lastError = "";
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await resend.emails.send({
        from: SENDER,
        to: [to],
        subject,
        html,
      });
      if (res.error) {
        throw new Error(res.error.message || JSON.stringify(res.error));
      }
      return { success: true, data: res.data, retries: attempt };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`Send attempt ${attempt + 1} failed: ${lastError}`);
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  return { success: false, error: lastError, retries: maxRetries };
}

// ─── Main handler ───
const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // Auth check – allow service role calls (from other edge functions) or authenticated users
    const authHeader = req.headers.get("Authorization");
    const isServiceCall = req.headers.get("x-service-call") === "true";

    if (!isServiceCall) {
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
      const anonClient = createClient(supabaseUrl, anonKey);
      const {
        data: { user: caller },
        error: authError,
      } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));

      if (authError || !caller) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const body: EmailRequest = await req.json();
    const { type, to, variables, priority, tags } = body;

    if (!type || !to) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: type, to" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Rate limit
    if (!checkRateLimit(to)) {
      // Log rate-limited
      await adminClient.from("email_logs").insert({
        recipient: to,
        email_type: type,
        status: "rate_limited",
        priority: priority || "normal",
        tags: tags || [],
        error_message: "Rate limit exceeded",
      });
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Build email
    const { subject, html } = buildEmail(type, variables);

    // Create log entry (queued)
    const { data: logEntry } = await adminClient
      .from("email_logs")
      .insert({
        recipient: to,
        email_type: type,
        subject,
        status: "queued",
        priority: priority || "normal",
        tags: tags || [],
        metadata: variables,
      })
      .select("id")
      .single();

    // Send with retry
    const result = await sendWithRetry(to, subject, html, MAX_RETRIES);

    // Update log
    if (logEntry?.id) {
      await adminClient
        .from("email_logs")
        .update({
          status: result.success ? "sent" : "failed",
          error_message: result.error || null,
          retry_count: result.retries,
          sent_at: result.success ? new Date().toISOString() : null,
        })
        .eq("id", logEntry.id);
    }

    if (!result.success) {
      console.error(`Email failed after ${result.retries} retries: ${result.error}`);
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log(`Email [${type}] sent to ${to} (retries: ${result.retries})`);
    return new Response(
      JSON.stringify({ success: true, data: result.data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Email handler error:", msg);
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
};

serve(handler);
