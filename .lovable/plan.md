

# Assignment File Upload, Image Upload Components, Diploma Course Weights, and Curriculum Management

## Overview

This plan addresses four interconnected improvements:
1. File upload/download for student assignments
2. Replace all "Thumbnail URL" text inputs with image upload components
3. Diploma course weight management
4. Instructor course curriculum/section management (similar to quiz editor)

---

## 1. Assignment File Upload and Download

**Current state:** Students can only submit text and a URL link. Instructors create assignments with text descriptions only -- no way to attach files (PDFs, documents) for students to download, and no way for students to upload their work as files.

**Changes:**

**Database:**
- Add `file_url` (text, nullable) column to `assignments` table -- for instructor-attached assignment files (instructions, templates)
- Add `submission_file_url` (text, nullable) column to `assignment_submissions` table -- for student-uploaded submission files

**Storage:**
- Create a new `assignments` storage bucket (public: false) with RLS policies allowing:
  - Instructors to upload to their own folder
  - Students to upload to their own folder
  - Authenticated users to read files they have access to

**Instructor side (`InstructorAssignments.tsx`):**
- Add a file upload input in the "Create Assignment" dialog so instructors can attach a file (PDF, DOCX, etc.)
- Upload the file to `assignments/{instructor_id}/{filename}` in the storage bucket
- Save the public URL in the `file_url` column
- Show a download link on each assignment card

**Student side (`StudentAssignments.tsx`):**
- Show a "Download Assignment" button on each assignment card if `file_url` exists
- Add a file upload input in the "Submit Assignment" dialog alongside the existing text/URL fields
- Upload to `assignments/submissions/{student_id}/{filename}`
- Save the URL in `submission_file_url`

---

## 2. Replace Thumbnail URL Inputs with Image Upload

**Current state:** Three pages use plain text inputs labeled "Thumbnail URL" requiring users to paste external image links: `AdminCourseEditor.tsx`, `InstructorCourseEditor.tsx`, `AdminLearningPaths.tsx`. The admin course editor also has "Instructor Avatar URL" as a text input.

**Changes:**

**Create a reusable `ImageUpload` component** (`src/components/ui/ImageUpload.tsx`):
- Accepts `bucket`, `folder`, `value`, `onUpload` props
- Shows a clickable area with current image preview (if value exists) or upload placeholder
- On click, opens file picker (accept image types)
- Uploads to the specified Supabase storage bucket/folder
- Returns the public URL via `onUpload` callback
- Shows upload progress indicator

**Replace in these files:**
- `AdminCourseEditor.tsx` -- Thumbnail URL input and Instructor Avatar URL input
- `InstructorCourseEditor.tsx` -- Thumbnail URL input
- `AdminLearningPaths.tsx` -- Thumbnail URL input

All uploads will go to the existing `academy-assets` bucket (already public).

---

## 3. Diploma Course Weight

**Current state:** The `academy_cert_courses` table represents courses within the diploma program but has no `weight` column. There is no way for admins to specify how much each course contributes to the overall diploma grade.

**Changes:**

**Database:**
- Add `weight` (integer, nullable, default 1) column to `academy_cert_courses` table

**Admin UI (`CertificationsCRUD.tsx`):**
- Add a "Weight" number input in the Add/Edit course dialogs
- Display the weight value on each course card
- The weight represents the relative contribution of each course to the diploma grade

---

## 4. Instructor Curriculum/Section Management

**Current state:** The `course_curriculum` and `curriculum_lessons` tables exist and the student-facing `CourseLearning.tsx` page renders them. However, there is NO instructor-facing UI to manage curriculum sections and lessons -- instructors have no way to add, edit, or remove sections/lessons for their courses.

**Changes:**

**Create `InstructorCurriculumEditor.tsx`** -- a new page accessible from the instructor course editor or courses list. Similar in pattern to `InstructorQuizEditor.tsx`:

- Select a course (from instructor's courses)
- Display existing sections with their lessons in an expandable accordion
- "Add Section" button -- creates a new `course_curriculum` row
- Within each section: "Add Lesson" button -- creates a new `curriculum_lessons` row
- Each section has: title (editable), sort order, delete button
- Each lesson has: title, lesson type (video/quiz/lab/reading), duration, video URL, text content, sort order, delete button
- Drag or arrow-based reordering for sections and lessons
- Save all changes (upsert sections and lessons, delete removed ones)

**Route:** Add `/instructor/curriculum` or integrate as a tab within the existing course editor

**Navigation:** Add a "Manage Curriculum" link in the instructor sidebar/navigation

---

## Technical Details

### Migration SQL

```sql
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
```

### New Files
- `src/components/ui/ImageUpload.tsx` -- Reusable image upload component
- `src/pages/instructor/InstructorCurriculumEditor.tsx` -- Curriculum management page

### Files to Edit
- `src/pages/student/StudentAssignments.tsx` -- Add file download + upload
- `src/pages/instructor/InstructorAssignments.tsx` -- Add file upload for assignment creation + download display
- `src/pages/admin/AdminCourseEditor.tsx` -- Replace thumbnail/avatar URL inputs with ImageUpload
- `src/pages/instructor/InstructorCourseEditor.tsx` -- Replace thumbnail URL input with ImageUpload
- `src/pages/admin/AdminLearningPaths.tsx` -- Replace thumbnail URL input with ImageUpload
- `src/components/admin/academy/CertificationsCRUD.tsx` -- Add weight field
- `src/App.tsx` -- Add route for curriculum editor
- `src/components/dashboard/DashboardLayout.tsx` -- Add curriculum nav link for instructors

