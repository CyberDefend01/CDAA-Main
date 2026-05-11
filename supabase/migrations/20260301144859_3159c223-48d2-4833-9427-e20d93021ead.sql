ALTER TABLE public.academy_cert_courses 
ADD COLUMN linked_course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL;