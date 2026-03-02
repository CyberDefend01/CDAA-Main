import { supabase } from "@/integrations/supabase/client";

// ─── Types ───
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

interface SendEmailParams {
  type: EmailType;
  to: string;
  variables: Record<string, string>;
  priority?: "low" | "normal" | "high";
  tags?: string[];
}

interface EmailResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

// ─── Core send function ───
async function sendEmail(params: SendEmailParams): Promise<EmailResult> {
  try {
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: params,
    });

    if (error) {
      console.error(`[Email] Failed to send ${params.type}:`, error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Email] Exception sending ${params.type}:`, msg);
    return { success: false, error: msg };
  }
}

// ─── Helper: get base dashboard URL ───
const getDashboardUrl = () => window.location.origin;

// ─── Convenience helpers ───

export async function sendWelcomeEmail(user: {
  email: string;
  name: string;
}): Promise<EmailResult> {
  return sendEmail({
    type: "welcome",
    to: user.email,
    variables: {
      user_name: user.name,
      dashboard_link: getDashboardUrl(),
    },
    tags: ["welcome", "onboarding"],
  });
}

export async function sendVerificationEmail(
  user: { email: string; name: string },
  verificationLink: string,
): Promise<EmailResult> {
  return sendEmail({
    type: "email-verification",
    to: user.email,
    variables: {
      user_name: user.name,
      verification_link: verificationLink,
    },
    priority: "high",
    tags: ["verification", "auth"],
  });
}

export async function sendPasswordResetEmail(
  user: { email: string; name: string },
  resetLink: string,
): Promise<EmailResult> {
  return sendEmail({
    type: "password-reset",
    to: user.email,
    variables: {
      user_name: user.name,
      reset_link: resetLink,
    },
    priority: "high",
    tags: ["password-reset", "auth"],
  });
}

export async function sendSecurityAlertEmail(
  user: { email: string; name: string },
  details: { device?: string; location?: string; time?: string; ip_address?: string },
): Promise<EmailResult> {
  return sendEmail({
    type: "security-alert",
    to: user.email,
    variables: {
      user_name: user.name,
      dashboard_link: getDashboardUrl(),
      device: details.device || "Unknown",
      location: details.location || "Unknown",
      time: details.time || new Date().toLocaleString(),
      ip_address: details.ip_address || "Unknown",
    },
    priority: "high",
    tags: ["security", "alert"],
  });
}

export async function sendAdminNewUserNotification(user: {
  email: string;
  name: string;
}): Promise<EmailResult> {
  const adminEmail = "abubakarsadiqibrahim4321@gmail.com";
  return sendEmail({
    type: "admin-new-user",
    to: adminEmail,
    variables: {
      user_name: user.name,
      user_email: user.email,
      dashboard_link: getDashboardUrl(),
    },
    tags: ["admin", "new-user"],
  });
}

export async function sendAccountActivityEmail(
  user: { email: string; name: string },
  activity: string,
): Promise<EmailResult> {
  return sendEmail({
    type: "account-activity",
    to: user.email,
    variables: {
      user_name: user.name,
      activity,
      time: new Date().toLocaleString(),
      dashboard_link: getDashboardUrl(),
    },
    tags: ["activity"],
  });
}

export async function sendSystemAlertEmail(
  adminEmail: string,
  message: string,
): Promise<EmailResult> {
  return sendEmail({
    type: "system-alert",
    to: adminEmail,
    variables: {
      message,
      time: new Date().toLocaleString(),
      dashboard_link: getDashboardUrl(),
    },
    priority: "high",
    tags: ["system", "alert"],
  });
}

export async function sendCourseCompletedEmail(payload: {
  email: string;
  name: string;
  courseName: string;
}): Promise<EmailResult> {
  return sendEmail({
    type: "course-completed",
    to: payload.email,
    variables: {
      user_name: payload.name,
      course_name: payload.courseName,
      dashboard_link: getDashboardUrl(),
    },
    tags: ["course", "completion"],
  });
}

export async function sendQuizPassedEmail(payload: {
  email: string;
  name: string;
  quizName: string;
  courseName: string;
  score: number;
}): Promise<EmailResult> {
  return sendEmail({
    type: "quiz-passed",
    to: payload.email,
    variables: {
      user_name: payload.name,
      quiz_name: payload.quizName,
      course_name: payload.courseName,
      score: payload.score.toFixed(0),
      dashboard_link: getDashboardUrl(),
    },
    tags: ["quiz", "passed"],
  });
}

export async function sendCertificateEarnedEmail(payload: {
  email: string;
  name: string;
  courseName: string;
  certificateId: string;
}): Promise<EmailResult> {
  return sendEmail({
    type: "certificate-earned",
    to: payload.email,
    variables: {
      user_name: payload.name,
      course_name: payload.courseName,
      certificate_id: payload.certificateId,
      dashboard_link: getDashboardUrl(),
    },
    tags: ["certificate"],
  });
}

// Re-export for backward compatibility
export { sendEmail };
export type { EmailType, SendEmailParams, EmailResult };
