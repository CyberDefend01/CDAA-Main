

# Wire Up Email System and Ensure It Works End-to-End

## Current Status

The email infrastructure is built (edge function `send-email`, client helpers in `emailService.ts`, `email_logs` table, Resend API key configured), but there are two problems preventing it from working:

1. **No emails are actually triggered** -- The helper functions (`sendWelcomeEmail`, `sendAdminNewUserNotification`, `sendSecurityAlertEmail`, etc.) exist but are never called from the app. Only `sendQuizPassedEmail` is imported in `StudentQuizTake.tsx`.

2. **CORS headers are incomplete** -- The edge function's `Access-Control-Allow-Headers` is missing the extra Supabase client headers (`x-supabase-client-platform`, etc.), which can cause browser preflight failures.

## Plan

### 1. Fix CORS headers in `send-email` edge function

Update `corsHeaders` in `supabase/functions/send-email/index.ts` to include all required headers:

```text
authorization, x-client-info, apikey, content-type,
x-supabase-client-platform, x-supabase-client-platform-version,
x-supabase-client-runtime, x-supabase-client-runtime-version
```

### 2. Wire up email triggers in `Auth.tsx`

**On successful sign-up (line ~252):**
- Call `sendWelcomeEmail({ email, name: fullName })` (fire-and-forget)
- Call `sendAdminNewUserNotification({ email, name: fullName })` (fire-and-forget)

**On successful sign-in (line ~296):**
- No email needed (standard behavior)

**On password reset request:**
- Supabase handles the reset email natively, no custom trigger needed here

### 3. Wire up course completion and certificate emails

Search for where course completion and certificate issuance happen and add the corresponding email calls. Currently:
- `sendCourseCompletedEmail` -- not called anywhere
- `sendCertificateEarnedEmail` -- not called anywhere
- `sendQuizPassedEmail` -- already wired in `StudentQuizTake.tsx`

I will find the course completion logic and certificate issuance logic and add the email triggers there.

### 4. Test the edge function

After deploying, send a test email via the edge function to verify Resend delivers successfully and the `email_logs` table records it.

## Files to Edit

1. **`supabase/functions/send-email/index.ts`** -- Fix CORS headers
2. **`src/pages/Auth.tsx`** -- Add welcome + admin notification email calls on signup
3. **`src/pages/student/CourseLearning.tsx`** or relevant completion handler -- Add `sendCourseCompletedEmail` call
4. **Certificate issuance handler** (edge function or page) -- Add `sendCertificateEarnedEmail` call

## What This Achieves

After these changes:
- Every new user signup triggers a welcome email to the user and a notification to the admin
- Quiz passes send congratulation emails (already working)
- Course completions and certificate awards will trigger emails
- All emails are logged in `email_logs` with status, retry count, and timestamps
- Rate limiting and retry logic are already built in

