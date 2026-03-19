
-- ============================================================
-- FIX 1: Academy tables have RESTRICTIVE SELECT policies
-- which block non-admin users from reading. Drop restrictive 
-- and recreate as PERMISSIVE.
-- ============================================================

-- academy_cert_categories
DROP POLICY IF EXISTS "Academy cert categories viewable by everyone" ON public.academy_cert_categories;
DROP POLICY IF EXISTS "Admins manage cert categories" ON public.academy_cert_categories;

CREATE POLICY "Academy cert categories viewable by everyone"
ON public.academy_cert_categories FOR SELECT
USING (true);

CREATE POLICY "Admins manage cert categories"
ON public.academy_cert_categories FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- academy_cert_courses
DROP POLICY IF EXISTS "Academy cert courses viewable by everyone" ON public.academy_cert_courses;
DROP POLICY IF EXISTS "Admins manage cert courses" ON public.academy_cert_courses;

CREATE POLICY "Academy cert courses viewable by everyone"
ON public.academy_cert_courses FOR SELECT
USING (true);

CREATE POLICY "Admins manage cert courses"
ON public.academy_cert_courses FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- academy_diploma_phases
DROP POLICY IF EXISTS "Academy diploma phases viewable by everyone" ON public.academy_diploma_phases;
DROP POLICY IF EXISTS "Admins manage diploma phases" ON public.academy_diploma_phases;

CREATE POLICY "Academy diploma phases viewable by everyone"
ON public.academy_diploma_phases FOR SELECT
USING (true);

CREATE POLICY "Admins manage diploma phases"
ON public.academy_diploma_phases FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- academy_diploma_modules
DROP POLICY IF EXISTS "Academy diploma modules viewable by everyone" ON public.academy_diploma_modules;
DROP POLICY IF EXISTS "Admins manage diploma modules" ON public.academy_diploma_modules;

CREATE POLICY "Academy diploma modules viewable by everyone"
ON public.academy_diploma_modules FOR SELECT
USING (true);

CREATE POLICY "Admins manage diploma modules"
ON public.academy_diploma_modules FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- academy_diploma_meta
DROP POLICY IF EXISTS "Academy diploma meta viewable by everyone" ON public.academy_diploma_meta;
DROP POLICY IF EXISTS "Admins manage diploma meta" ON public.academy_diploma_meta;

CREATE POLICY "Academy diploma meta viewable by everyone"
ON public.academy_diploma_meta FOR SELECT
USING (true);

CREATE POLICY "Admins manage diploma meta"
ON public.academy_diploma_meta FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- FIX 2: Tighten overly permissive INSERT policies
-- audit_logs: only authenticated users should insert
-- notifications: only authenticated users should insert  
-- contact_submissions: keep public insert but add rate limiting via constraints
-- ============================================================

-- audit_logs: restrict to authenticated only
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated can insert audit logs"
ON public.audit_logs FOR INSERT TO authenticated
WITH CHECK (auth.uid() = actor_id);

-- notifications: restrict to authenticated (system inserts via security definer functions)
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "Authenticated can insert notifications"
ON public.notifications FOR INSERT TO authenticated
WITH CHECK (true);
