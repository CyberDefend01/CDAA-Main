// ─────────────────────────────────────────────────────────────
// SHARED EMAIL DESIGN SYSTEM
// Light, professional, human brand templates for all CDAA mail.
// Inline styles only (email clients strip <style>/classes unreliably),
// table-based layout for Outlook, max 600px, system font stack.
// ─────────────────────────────────────────────────────────────

export const BRAND = "Cyber Defend Africa";
export const SITE = "https://cyberdefendafrica.org";
export const LOGO_URL = "https://cyberdefendafrica.org/logo.png";

// Brand palette (matches the website)
const C = {
  ink: "#0f1c33",        // deep navy text
  body: "#33425b",       // body text
  muted: "#6b7a93",      // secondary text
  faint: "#9aa7bd",      // tertiary
  line: "#e6ebf2",       // borders
  bg: "#eef2f8",         // page background
  card: "#ffffff",       // card surface
  soft: "#f5f8fc",       // soft fill
  cobalt: "#2563f0",
  sky: "#1fa3f0",
  emerald: "#10b981",
  amber: "#f5a623",
  red: "#ef4444",
  indigo: "#5b6ef5",
};

export type Accent = "cobalt" | "emerald" | "amber" | "sky" | "indigo" | "red";

const ACCENTS: Record<Accent, { main: string; soft: string; grad: string }> = {
  cobalt:  { main: C.cobalt,  soft: "#eef3ff", grad: "linear-gradient(135deg,#2563f0,#1fa3f0)" },
  sky:     { main: C.sky,     soft: "#e9f6ff", grad: "linear-gradient(135deg,#1fa3f0,#22d3ee)" },
  emerald: { main: C.emerald, soft: "#e9faf3", grad: "linear-gradient(135deg,#10b981,#06b6d4)" },
  amber:   { main: C.amber,   soft: "#fff6e6", grad: "linear-gradient(135deg,#f5a623,#f97316)" },
  indigo:  { main: C.indigo,  soft: "#eef0ff", grad: "linear-gradient(135deg,#5b6ef5,#2563f0)" },
  red:     { main: C.red,     soft: "#fdeced", grad: "linear-gradient(135deg,#ef4444,#f5a623)" },
};

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export interface Block {
  type: "text" | "detail" | "stat" | "note" | "list" | "divider";
  // text
  html?: string;
  // detail / stat
  label?: string;
  value?: string;
  sub?: string;
  // note
  tone?: "info" | "warn";
  // list
  items?: string[];
}

export interface EmailOptions {
  accent: Accent;
  preheader: string;       // hidden inbox-preview line
  eyebrow?: string;        // small label above title (e.g. "ADMISSIONS")
  title: string;
  greeting?: string;       // "Hi Amara,"
  intro?: string;          // lead paragraph
  blocks?: Block[];        // flexible body content
  ctaText?: string;
  ctaUrl?: string;
  secondaryNote?: string;  // small muted line under CTA
  signoff?: string;        // defaults to a warm team signoff
}

// ── Block renderers ──
function renderBlock(b: Block, a: { main: string; soft: string }): string {
  switch (b.type) {
    case "text":
      return `<p style="margin:0 0 16px;color:${C.body};font-size:15px;line-height:1.7">${b.html || ""}</p>`;

    case "detail":
      return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
        <tr><td style="background:${C.soft};border:1px solid ${C.line};border-radius:12px;padding:18px 22px">
          <p style="margin:0 0 4px;color:${a.main};font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase">${b.label || ""}</p>
          <p style="margin:0;color:${C.ink};font-size:19px;font-weight:700;line-height:1.3">${b.value || ""}</p>
          ${b.sub ? `<p style="margin:6px 0 0;color:${C.muted};font-size:13px">${b.sub}</p>` : ""}
        </td></tr>
      </table>`;

    case "stat":
      return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px"><tr><td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${a.soft};border-radius:14px;padding:18px 34px;text-align:center">
          <p style="margin:0 0 2px;color:${C.muted};font-size:12px;font-weight:600;letter-spacing:.5px;text-transform:uppercase">${b.label || ""}</p>
          <p style="margin:0;color:${a.main};font-size:40px;font-weight:800;line-height:1">${b.value || ""}</p>
        </td></tr></table>
      </td></tr></table>`;

    case "note": {
      const warn = b.tone === "warn";
      const col = warn ? C.amber : a.main;
      const bg = warn ? "#fff8ee" : a.soft;
      return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
        <tr><td style="background:${bg};border-left:3px solid ${col};border-radius:8px;padding:14px 18px">
          <p style="margin:0;color:${C.body};font-size:13px;line-height:1.6">${b.html || ""}</p>
        </td></tr>
      </table>`;
    }

    case "list":
      return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
        ${(b.items || []).map((it) => `
        <tr><td style="padding:6px 0;vertical-align:top;width:26px">
          <span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:${a.soft};color:${a.main};font-size:12px;font-weight:700;text-align:center;line-height:18px">&#10003;</span>
        </td><td style="padding:6px 0;color:${C.body};font-size:15px;line-height:1.5">${it}</td></tr>`).join("")}
      </table>`;

    case "divider":
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid ${C.line};padding:10px 0"></td></tr></table>`;

    default:
      return "";
  }
}

// ── Master layout ──
export function renderEmail(o: EmailOptions): string {
  const a = ACCENTS[o.accent];
  const year = new Date().getFullYear();

  const cta = o.ctaText && o.ctaUrl
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px auto 6px"><tr>
        <td style="border-radius:10px;background:${a.main}">
          <a href="${o.ctaUrl}" style="display:inline-block;padding:14px 34px;font-family:${FONT};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px">${o.ctaText}</a>
        </td></tr></table>`
    : "";

  const blocksHtml = (o.blocks || []).map((b) => renderBlock(b, a)).join("");

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta name="color-scheme" content="light"/>
<meta name="supported-color-schemes" content="light"/>
<title>${o.title}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};font-family:${FONT};-webkit-font-smoothing:antialiased">
<!-- preheader -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.bg};font-size:1px;line-height:1px">${o.preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}"><tr><td align="center" style="padding:28px 12px">

  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:${C.card};border-radius:16px;overflow:hidden;border:1px solid ${C.line};box-shadow:0 8px 30px rgba(15,28,51,0.06)">

    <!-- accent bar -->
    <tr><td style="height:4px;background:${a.grad};font-size:0;line-height:0">&nbsp;</td></tr>

    <!-- header -->
    <tr><td style="padding:26px 40px 18px">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle">
          <img src="${LOGO_URL}" width="38" height="38" alt="${BRAND}" style="display:block;border-radius:9px" />
        </td>
        <td style="vertical-align:middle;padding-left:12px">
          <p style="margin:0;color:${C.ink};font-size:16px;font-weight:800;letter-spacing:-0.2px">${BRAND}</p>
          <p style="margin:0;color:${C.faint};font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Academy</p>
        </td>
      </tr></table>
    </td></tr>

    <tr><td style="border-top:1px solid ${C.line};font-size:0;line-height:0">&nbsp;</td></tr>

    <!-- body -->
    <tr><td style="padding:34px 40px 12px">
      ${o.eyebrow ? `<p style="margin:0 0 10px;color:${a.main};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">${o.eyebrow}</p>` : ""}
      <h1 style="margin:0 0 18px;color:${C.ink};font-size:26px;font-weight:800;line-height:1.2;letter-spacing:-0.4px">${o.title}</h1>
      ${o.greeting ? `<p style="margin:0 0 14px;color:${C.body};font-size:15px;line-height:1.7">${o.greeting}</p>` : ""}
      ${o.intro ? `<p style="margin:0 0 20px;color:${C.body};font-size:15px;line-height:1.7">${o.intro}</p>` : ""}
      ${blocksHtml}
      ${cta ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:4px 0 6px">${cta}</td></tr></table>` : ""}
      ${o.secondaryNote ? `<p style="margin:8px 0 0;color:${C.faint};font-size:13px;line-height:1.6;text-align:center">${o.secondaryNote}</p>` : ""}
    </td></tr>

    <!-- signoff -->
    <tr><td style="padding:18px 40px 30px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid ${C.line};padding-top:18px">
        <p style="margin:0;color:${C.muted};font-size:14px;line-height:1.6">${o.signoff || `Warm regards,<br/><strong style="color:${C.ink}">The ${BRAND} Team</strong>`}</p>
      </td></tr></table>
    </td></tr>

  </table>

  <!-- footer -->
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px"><tr><td style="padding:22px 40px;text-align:center">
    <p style="margin:0 0 8px;color:${C.muted};font-size:13px;font-weight:600">${BRAND} Academy</p>
    <p style="margin:0 0 10px;color:${C.faint};font-size:12px;line-height:1.6">Lagos, Nigeria &bull; Nairobi, Kenya</p>
    <p style="margin:0 0 12px">
      <a href="${SITE}" style="color:${a.main};font-size:12px;text-decoration:none;font-weight:600">Website</a>
      <span style="color:${C.line}">&nbsp;|&nbsp;</span>
      <a href="${SITE}/courses" style="color:${a.main};font-size:12px;text-decoration:none;font-weight:600">Courses</a>
      <span style="color:${C.line}">&nbsp;|&nbsp;</span>
      <a href="${SITE}/contact" style="color:${a.main};font-size:12px;text-decoration:none;font-weight:600">Support</a>
    </p>
    <p style="margin:0;color:${C.faint};font-size:11px;line-height:1.6">&copy; ${year} ${BRAND}. All rights reserved.</p>
  </td></tr></table>

</td></tr></table>
</body>
</html>`;
}
