

# Fix Email Sender Domain to Match Verified Resend Domain

## Problem

The Resend-verified domain is **`admin.cyberdefendafrica.org`** (confirmed from the screenshot), but the edge function sends from `noreply@cyberdefendafrica.org` (root domain -- NOT verified). Resend rejects all emails from unverified domains.

Additionally, the `sendWithRetry` function has a bug: the Resend SDK returns errors in `res.error` instead of throwing, so failed sends are incorrectly reported as successful.

## Changes

### 1. Update sender address in `send-email` edge function

In `supabase/functions/send-email/index.ts`, change:

```
"Cyber Defend Africa <noreply@cyberdefendafrica.org>"
```

to:

```
"Cyber Defend Africa <noreply@admin.cyberdefendafrica.org>"
```

### 2. Fix Resend error detection in `sendWithRetry`

The Resend SDK does not throw on API errors -- it returns `{ data, error }`. Update the retry wrapper to check `res.error`:

```typescript
const res = await resend.emails.send({ from: SENDER, to: [to], subject, html });
if (res.error) {
  throw new Error(res.error.message || JSON.stringify(res.error));
}
return { success: true, data: res.data, retries: attempt };
```

### 3. Redeploy the edge function

Deploy `send-email` after the changes so they take effect immediately.

### 4. Test end-to-end

Call the edge function with a test email to confirm delivery works with the verified domain.

## Files to Edit

- `supabase/functions/send-email/index.ts` -- Change sender domain + fix error handling

## What This Fixes

After this change, all emails will send from `noreply@admin.cyberdefendafrica.org` which matches the verified Resend domain, and delivery will work. The error handling fix ensures failures are properly logged and retried.
