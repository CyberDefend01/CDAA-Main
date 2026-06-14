// ─────────────────────────────────────────────────────────────
// CENTRAL SENDER CONFIG
// All automated (Resend) email "From" addresses MUST be on the
// verified domain. Reply-To can be ANY address (your Zoho mailbox).
//
// VERIFIED in Resend:  admin.cyberdefendafrica.org
// Human inboxes (Zoho): cyberdefendafrica.org
//
// To later use prettier addresses (e.g. welcome@cyberdefendafrica.org),
// verify the root domain in Resend and change SEND_DOMAIN below.
// ─────────────────────────────────────────────────────────────

export const SEND_DOMAIN  = "cyberdefendafrica.org";  // Resend-verified (From)
export const REPLY_DOMAIN = "cyberdefendafrica.org";        // Zoho mailboxes (Reply-To)
export const BRAND        = "Cyber Defend Africa";

export interface SenderConfig {
  from: string;       // full "Name <addr@domain>"
  replyTo?: string;   // bare address; omit for no-reply mail
}

// Reply-To inboxes you should create in Zoho (real mailboxes a human reads)
export const INBOX = {
  support:      `support@${REPLY_DOMAIN}`,
  admissions:   `admissions@${REPLY_DOMAIN}`,
  registration: `registration@${REPLY_DOMAIN}`,
  hello:        `hello@${REPLY_DOMAIN}`,
};

// Map every automated email type to its sender identity
export const SENDERS: Record<string, SenderConfig> = {
  // ── Onboarding / account ──
  "welcome":             { from: `${BRAND} <welcome@${SEND_DOMAIN}>`,        replyTo: INBOX.support },
  "email-verification":  { from: `${BRAND} <no-reply@${SEND_DOMAIN}>` },
  "verification":        { from: `${BRAND} <no-reply@${SEND_DOMAIN}>` }, // alias used by send-auth-email
  "password-reset":      { from: `${BRAND} <no-reply@${SEND_DOMAIN}>` },
  "account-activity":    { from: `${BRAND} <no-reply@${SEND_DOMAIN}>` },

  // ── Security ──
  "security-alert":      { from: `CDA Security <security@${SEND_DOMAIN}>`,    replyTo: INBOX.support },

  // ── Learning / achievements ──
  "course-completed":    { from: `CDA Learning <learning@${SEND_DOMAIN}>`,    replyTo: INBOX.support },
  "quiz-passed":         { from: `CDA Learning <learning@${SEND_DOMAIN}>`,    replyTo: INBOX.support },
  "certificate-earned":  { from: `CDA Certifications <certificates@${SEND_DOMAIN}>`, replyTo: INBOX.support },
  "notification":        { from: `CDA Learning <learning@${SEND_DOMAIN}>`,    replyTo: INBOX.support },

  // ── Admissions / registration (automated confirmations) ──
  "admission":           { from: `CDA Admissions <admissions@${SEND_DOMAIN}>`,   replyTo: INBOX.admissions },
  "registration":        { from: `CDA Registration <registration@${SEND_DOMAIN}>`, replyTo: INBOX.registration },

  // ── Internal / admin ──
  "admin-new-user":      { from: `CDA System <no-reply@${SEND_DOMAIN}>` },
  "system-alert":        { from: `CDA System <system@${SEND_DOMAIN}>` },
};

// Safe lookup with a sensible default
export function getSender(type: string): SenderConfig {
  return SENDERS[type] ?? { from: `${BRAND} <no-reply@${SEND_DOMAIN}>`, replyTo: INBOX.support };
}

// Build a Resend payload fragment for reply-to that works across SDK
// versions by setting the raw MIME header directly. Spread into emails.send().
// Using the header (not the reply_to field) avoids snake/camel SDK naming
// issues and never produces a duplicate Reply-To header.
export function replyToFields(replyTo?: string): Record<string, unknown> {
  if (!replyTo) return {};
  return { headers: { "Reply-To": replyTo } };
}
