// Re-export everything from the new centralized email service
// This file exists for backward compatibility with existing imports
export {
  sendCourseCompletedEmail,
  sendQuizPassedEmail,
  sendCertificateEarnedEmail,
} from "@/lib/emailService";
