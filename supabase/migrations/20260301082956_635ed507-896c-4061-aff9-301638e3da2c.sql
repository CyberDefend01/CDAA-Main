
-- Fix academy_cert_categories: drop restrictive SELECT, create permissive one
DROP POLICY IF EXISTS "Academy cert categories viewable by everyone" ON public.academy_cert_categories;
CREATE POLICY "Academy cert categories viewable by everyone" ON public.academy_cert_categories FOR SELECT USING (true);

-- Fix academy_cert_courses
DROP POLICY IF EXISTS "Academy cert courses viewable by everyone" ON public.academy_cert_courses;
CREATE POLICY "Academy cert courses viewable by everyone" ON public.academy_cert_courses FOR SELECT USING (true);

-- Fix academy_diploma_phases
DROP POLICY IF EXISTS "Academy diploma phases viewable by everyone" ON public.academy_diploma_phases;
CREATE POLICY "Academy diploma phases viewable by everyone" ON public.academy_diploma_phases FOR SELECT USING (true);

-- Fix academy_diploma_modules
DROP POLICY IF EXISTS "Academy diploma modules viewable by everyone" ON public.academy_diploma_modules;
CREATE POLICY "Academy diploma modules viewable by everyone" ON public.academy_diploma_modules FOR SELECT USING (true);

-- Fix academy_diploma_meta
DROP POLICY IF EXISTS "Academy diploma meta viewable by everyone" ON public.academy_diploma_meta;
CREATE POLICY "Academy diploma meta viewable by everyone" ON public.academy_diploma_meta FOR SELECT USING (true);

-- Also fix admin ALL policies to be permissive
DROP POLICY IF EXISTS "Admins manage cert categories" ON public.academy_cert_categories;
CREATE POLICY "Admins manage cert categories" ON public.academy_cert_categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage cert courses" ON public.academy_cert_courses;
CREATE POLICY "Admins manage cert courses" ON public.academy_cert_courses FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage diploma phases" ON public.academy_diploma_phases;
CREATE POLICY "Admins manage diploma phases" ON public.academy_diploma_phases FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage diploma modules" ON public.academy_diploma_modules;
CREATE POLICY "Admins manage diploma modules" ON public.academy_diploma_modules FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage diploma meta" ON public.academy_diploma_meta;
CREATE POLICY "Admins manage diploma meta" ON public.academy_diploma_meta FOR ALL USING (public.has_role(auth.uid(), 'admin'));
