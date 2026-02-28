

# Rebuild CDAA Academy in Lovable

Since Lovable cannot import from GitHub, I'll recreate your full Cyber Defence Academy application directly in Lovable using your existing codebase as the exact source. Your Supabase database (38 tables, RLS policies, edge functions) is already connected and ready.

## Scope

Your academy includes ~100+ files across these areas:

### Phase 1: Foundation (Core layout, auth, routing)
- App.tsx with all routes (React Router)
- ThemeProvider, Header, Footer, Layout components
- Auth page (login/signup with Supabase Auth)
- ProtectedRoute and AdminProtectedRoute guards
- DashboardLayout (shared sidebar/nav for student, instructor, admin)
- Hooks: useUserRole, useAdminCheck, useEnrollmentCheck, useProfileSetup, useSessionTimeout

### Phase 2: Public Pages
- Index (landing/home page with hero, stats, courses preview)
- Courses listing and CourseDetail pages
- About, Contact, Blog, BlogPost pages
- NotFound page

### Phase 3: Student Dashboard & Pages
- StudentDashboard with stats, progress, notifications
- StudentCourses, CourseLearning (video player, lesson progress)
- StudentQuizzes, StudentQuizTake, StudentQuizResults
- StudentAssignments, StudentCertificates, StudentIDCard
- StudentComplaints, StudentResources, StudentPaths, StudentTranscripts
- StudentSettings, StudentAnnouncements
- ProfileSetupModal, EnrollmentPaymentModal, EnrollmentSuccessAnimation

### Phase 4: Instructor Dashboard & Pages
- InstructorDashboard, InstructorCourses, InstructorCourseEditor
- InstructorQuizzes, InstructorQuizEditor
- InstructorStudents, InstructorAssignments, InstructorResources
- InstructorAnnouncements, InstructorAnalytics, InstructorSettings

### Phase 5: Admin Dashboard & Pages
- AdminDashboard, AdminCourses, AdminCourseEditor
- AdminUsers, AdminPaymentSettings, AdminPlatformSettings
- AdminCertificates, AdminCoupons, AdminCategories
- AdminBlogPosts, AdminBlogEditor, AdminLearningPaths
- AdminComplaints, AdminMessages, AdminTestimonials
- AdminTranscripts, AdminIDCards, AdminAuditLogs, AdminSettings

### Phase 6: Utilities & Edge Functions
- UI components (CountdownTimer, AnimatedCounter, CyberGrid, LoadingScreen, etc.)
- Utility libraries (auditLogger, idCardUtils, notificationService, logoBase64)
- Data files (courses, instructors, testimonials, blog, team)
- Edge Functions (generate-transcript, issue-certificate, send-auth-email, send-notification-email)
- Static assets and images

## Technical Details

- **Database**: Already connected -- 38 tables with RLS policies, `has_role()` function, `handle_new_user()` trigger, audit logging
- **Storage**: `avatars` and `academy-assets` buckets already exist
- **Edge Functions**: 4 functions to recreate (generate-transcript, issue-certificate, send-auth-email, send-notification-email)
- **Auth**: Supabase Auth with role-based access (admin, instructor, student) via `user_roles` table
- **Secrets**: RESEND_API_KEY and service role key already configured

## Approach

I will recreate each file using your existing code as the exact blueprint, preserving your UI design, component structure, and all Supabase integrations. No database changes needed -- everything is already set up.

This is a large rebuild (~100 files). I recommend approving this plan and I'll start with Phase 1 (foundation), then proceed through each phase systematically.

