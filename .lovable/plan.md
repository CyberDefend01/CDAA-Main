# Fix Plan: Student Browse Courses + Coupon Verification + Security

## Issues Found

1. **Coupon `current_uses` update fails silently** -- Students cannot UPDATE the `coupons` table (only admins can). The line `await supabase.from("coupons").update(...)` silently fails, meaning coupon usage limits are never enforced.
  &nbsp;
2. `**useUserRole` race condition** -- `getSession()` and `onAuthStateChange` both set state independently. If `getSession()` returns null briefly before `onAuthStateChange` fires with a valid session, the ProtectedRoute redirects to `/auth`.
3. **Coupon verification lacks atomicity** -- Multiple DB calls (insert payment, insert coupon_usage, update coupon, insert enrollment) are not wrapped in a transaction. If one fails mid-way, data is left in an inconsistent state.

## Plan

### 1. Create a server-side `verify-coupon` edge function

Move all coupon verification logic to a Supabase Edge Function that:

- Validates the coupon (active, not expired, not maxed out)
- Checks if user is already enrolled
- In a single flow: creates payment, records coupon usage, increments `current_uses` (using service role key which bypasses RLS), creates enrollment
- Returns the enrolled course name on success
- This eliminates the RLS issue with updating `coupons.current_uses` and makes the operation atomic



### 3. Fix `useUserRole` race condition

- Ensure `isLoading` only becomes `false` after both `getSession()` completes AND the initial auth state is resolved
- Prevent the brief `user=null` flash that triggers redirects

### 4. Update `StudentBrowseCourses.tsx`

- Replace inline Supabase calls with a single call to the new `verify-coupon` edge function
- Simplify error handling since the edge function handles all validation

## Technical Details

### New file: `supabase/functions/verify-coupon/index.ts`

- Accepts POST with `{ coupon_code: string }`
- Extracts user from Authorization header
- Uses `supabaseAdmin` (service role) to:
  - Query coupon, validate it
  - Check existing enrollment
  - Insert payment, coupon_usage, update coupon uses, insert enrollment
- Returns `{ success: true, course_name: string }` or error

### Edit: `src/hooks/useSessionTimeout.ts`

- `INACTIVITY_TIMEOUT`: 5min -> 30min
- `TAB_AWAY_TIMEOUT`: 2min -> 10min

### Edit: `src/hooks/useUserRole.ts`

- Add a flag to prevent `isLoading=false` until initial session check completes
- Ensure `onAuthStateChange` doesn't cause a brief null user state

### Edit: `src/pages/student/StudentBrowseCourses.tsx`

- Replace `handleVerifyCoupon` with a fetch call to the `verify-coupon` edge function
- Remove all direct Supabase table operations for coupon flow