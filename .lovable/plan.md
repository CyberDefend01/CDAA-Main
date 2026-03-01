

# Fix Course Enrollment Conflict + Academy Programs CRUD

## Problem Summary

There are two disconnected course systems causing confusion:

1. **`courses` table** -- the real LMS courses (with enrollments, lessons, quizzes, progress)
2. **`academy_cert_courses` table** -- a separate display-only catalog of certification programs

The "Browse Courses" page shows academy programs but enrollment happens against the `courses` table. A student sees "Network Security Fundamentals" in the academy catalog, enters a coupon, and gets enrolled in whatever the first published course is -- completely unrelated.

## Solution: Link Academy Programs to LMS Courses

Rather than merging the tables (which serve different purposes), add an optional `linked_course_id` column to `academy_cert_courses`. This lets admins link an academy program to an actual LMS course, so when a student enrolls via coupon from a specific academy course card, the system knows which real course to enroll them in.

## Plan

### 1. Database Migration -- Add `linked_course_id` to `academy_cert_courses`

Add a nullable `linked_course_id` (uuid) column to `academy_cert_courses` that references the `courses` table. This creates the bridge between the two systems without breaking existing data.

### 2. Admin Academy Programs -- Full CRUD (Add + Delete)

Currently the admin page only supports editing. Add:

**Certification Courses tab:**
- "Add Category" button -- creates a new `academy_cert_categories` row
- "Add Course" button inside each category -- creates a new `academy_cert_courses` row
- Delete button (with confirmation) on each course and category
- "Link to LMS Course" dropdown in the course edit/add modal (selects from `courses` table)

**Diploma tab:**
- "Add Phase" button -- creates a new `academy_diploma_phases` row
- "Add Module" button inside each phase -- creates a new `academy_diploma_modules` row  
- Delete buttons with confirmation dialogs
- "Add Outcome" and "Add Includes" buttons for diploma meta

### 3. Update `verify-coupon` Edge Function

Currently the function finds a course via `coupon.applicable_courses[0]` or falls back to the first published course (unreliable). No changes needed here -- coupons already reference specific `courses` by ID. The fix is on the display side.

### 4. Update Browse Courses Page (Student)

When a student clicks "Enter Access Coupon" on a specific academy course card, if that academy course has a `linked_course_id`, pre-fill or display which LMS course they will be enrolling in. This gives clarity to the student about what they are actually enrolling in.

## Technical Details

### Migration SQL

```sql
ALTER TABLE public.academy_cert_courses 
ADD COLUMN linked_course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL;
```

### Files to Edit

1. **`supabase/migrations/[new].sql`** -- Add `linked_course_id` column
2. **`src/pages/admin/AdminAcademyPrograms.tsx`** -- Major rewrite:
   - Add "Add Category" dialog with title + alignment fields
   - Add "Add Course" dialog with all fields + linked_course_id dropdown
   - Add "Add Phase" dialog with phase_number, title, months
   - Add "Add Module" dialog with title + topics
   - Add "Add Meta" (outcome/includes) buttons
   - Delete handlers with confirmation for categories, courses, phases, modules, meta items
   - Fetch `courses` list for the linked_course_id dropdown
3. **`src/hooks/useAcademyPrograms.ts`** -- Add `linked_course_id` to `AcademyCertCourse` interface
4. **`src/pages/student/StudentBrowseCourses.tsx`** -- Show linked course info on cards when available

### Admin UI Layout (Certifications Tab)

```text
+------------------------------------------+
| [+ Add Category]                         |
+------------------------------------------+
| Category: Network Security (CompTIA)     |
|   [+ Add Course]                         |
|   +------------------------------------+ |
|   | Course Title        [Edit] [Delete]| |
|   | Duration | Level | Cert            | |
|   | Linked: "Network Security 101"     | |
|   +------------------------------------+ |
+------------------------------------------+
```

### Admin UI Layout (Diploma Tab)

```text
+------------------------------------------+
| Diploma Phases          [+ Add Phase]    |
+------------------------------------------+
| Phase 1 -- Foundations  [Edit] [Delete]  |
|   Modules: ...          [+ Add Module]   |
+------------------------------------------+
| Career Outcomes         [+ Add]          |
|   - Item 1              [Delete]         |
+------------------------------------------+
| Diploma Includes        [+ Add]          |
|   - Item 1              [Delete]         |
+------------------------------------------+
```

