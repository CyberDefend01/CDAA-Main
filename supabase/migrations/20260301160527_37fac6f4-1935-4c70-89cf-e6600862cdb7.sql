
-- Assignment file support
ALTER TABLE public.assignments ADD COLUMN file_url text;
ALTER TABLE public.assignment_submissions ADD COLUMN submission_file_url text;

-- Diploma course weight
ALTER TABLE public.academy_cert_courses ADD COLUMN weight integer DEFAULT 1;

-- Storage bucket for assignment files
INSERT INTO storage.buckets (id, name, public) VALUES ('assignments', 'assignments', false);

-- Storage policies for assignments bucket
CREATE POLICY "Instructors upload assignment files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'assignments' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated users read assignment files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'assignments');

CREATE POLICY "Students upload submissions"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'assignments' AND (storage.foldername(name))[1] = 'submissions');
