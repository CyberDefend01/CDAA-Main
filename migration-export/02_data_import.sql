-- ============================================================
-- CYBER DEFEND AFRICA ACADEMY - DATA IMPORT SCRIPT
-- Run this AFTER 01_combined_schema.sql
-- Run this AFTER creating your admin user in Authentication
-- ============================================================

-- ========================================
-- COURSES (7 courses)
-- ========================================

INSERT INTO public.courses (id, title, slug, description, short_description, thumbnail, category, level, duration, lessons_count, price, original_price, instructor_name, instructor_title, instructor_avatar, instructor_id, is_featured, is_published, rating, students_count, status, total_points, created_at, updated_at) VALUES
('5fe4b331-1a22-40a9-960a-ffd60ef8e5d2', 'Ethical Hacking Fundamentals', 'ethical-hacking-fundamentals', 'Master the core concepts of ethical hacking and penetration testing. Learn to identify vulnerabilities and secure systems against cyber threats.', 'Learn ethical hacking from scratch with hands-on labs and real-world scenarios.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', 'penetration-testing', 'beginner', '40 hours', 85, 199.00, 299.00, 'Dr. Amara Okonkwo', 'Chief Security Researcher', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', NULL, true, true, 4.9, 2847, 'draft', 100, '2025-12-24 10:28:41.987306+00', '2025-12-24 10:28:41.987306+00'),
('1bf40c75-1a1d-481c-9160-2d7b72d0d587', 'Incident Response & Forensics', 'incident-response-forensics', 'Learn to detect, respond to, and investigate security incidents. Master digital forensics techniques used by professionals.', 'Handle security incidents like a pro with forensics skills.', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800', 'incident-response', 'intermediate', '45 hours', 92, 279.00, 399.00, 'Dr. Fatima Diallo', 'Forensics Expert', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', NULL, true, true, 4.7, 987, 'draft', 100, '2025-12-24 10:28:41.987306+00', '2025-12-24 10:28:41.987306+00'),
('337b04fe-2772-437c-b425-48259f698a56', 'Cloud Security Essentials', 'cloud-security-essentials', 'Secure cloud infrastructure on AWS, Azure, and GCP. Learn cloud-native security tools and best practices.', 'Protect your cloud infrastructure with proven strategies.', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800', 'cloud-security', 'intermediate', '35 hours', 78, 249.00, 349.00, 'Chidi Obi', 'Cloud Security Engineer', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', NULL, true, true, 4.6, 1245, 'draft', 100, '2025-12-24 10:28:41.987306+00', '2025-12-24 10:28:41.987306+00'),
('15e15863-899e-49ea-b1df-e9f08da16bde', 'Malware Analysis Masterclass', 'malware-analysis-masterclass', 'Reverse engineer malware and understand attack patterns. Build skills to analyze and neutralize threats.', 'Become an expert at dissecting and understanding malware.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800', 'malware-analysis', 'advanced', '55 hours', 95, 399.00, 599.00, 'Dr. Ngozi Eze', 'Malware Research Lead', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', NULL, false, true, 4.9, 678, 'draft', 100, '2025-12-24 10:28:41.987306+00', '2025-12-24 10:28:41.987306+00'),
('d8d1aadd-0bd9-4466-80a0-bf94793a188f', 'Security Fundamentals Bootcamp', 'security-fundamentals-bootcamp', 'Start your cybersecurity journey with comprehensive fundamentals. Perfect for beginners entering the field.', 'Your first step into the world of cybersecurity.', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800', 'security-fundamentals', 'beginner', '25 hours', 48, 99.00, 149.00, 'Amara Okonkwo', 'Security Instructor', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', NULL, false, true, 4.5, 4521, 'draft', 100, '2025-12-24 10:28:41.987306+00', '2025-12-24 10:28:41.987306+00');

-- NOTE: The instructor-created course below references instructor_id '05e4034f-f501-484a-bdca-ffad800e2a66'
-- You will need to create this user first in Authentication, then update the UUID below
-- For now, inserting with instructor_id as NULL (update after creating users)

INSERT INTO public.courses (id, title, slug, description, short_description, thumbnail, category, level, duration, lessons_count, price, original_price, instructor_name, instructor_title, instructor_avatar, instructor_id, is_featured, is_published, rating, students_count, status, submitted_at, approved_at, total_points, created_at, updated_at) VALUES
('0221f451-5f40-4a82-80e8-64b111514087', 'Introduction to Digital Forensic', 'introduction-to-digital-forensic', 'Introduction to Digital Forensic', 'Introduction to Digital Forensic', NULL, 'security-fundamentals', 'beginner', '40 hours', 10, 100000.00, NULL, 'Abdulhakeem Umar Aliyu Umar', NULL, NULL, NULL, false, true, 0.0, 0, 'approved', '2025-12-28 03:44:34.113+00', '2026-01-01 01:55:05.386+00', 100, '2025-12-28 03:44:37.074348+00', '2026-01-01 01:55:05.214847+00');

-- ========================================
-- TESTIMONIALS (5 testimonials)
-- ========================================

INSERT INTO public.testimonials (id, name, role, company, country, content, avatar, course_title, rating, is_featured, created_at) VALUES
('9455ddf6-a09a-4152-a46b-963fbd6e5874', 'Adaeze Nwachukwu', 'Security Analyst', 'First Bank Nigeria', 'Nigeria', 'The Ethical Hacking course transformed my career. I went from a junior IT role to leading security assessments for one of Africa''s largest banks. The practical labs were incredible!', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150', 'Ethical Hacking Fundamentals', 5, true, '2025-12-24 10:28:41.987306+00'),
('4e39acf2-a1d9-45e7-be10-de11f3200bf6', 'Kofi Mensah', 'SOC Manager', 'MTN Ghana', 'Ghana', 'Cyber Defend Africa provided the skills I needed to build and lead a Security Operations Center. The instructors understand African business contexts perfectly.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Advanced Network Security', 5, true, '2025-12-24 10:28:41.987306+00'),
('97ca0ef9-e0cc-4351-a67b-afbb4a0b681e', 'Fatou Diop', 'CISO', 'Sonatel', 'Senegal', 'As a woman in tech, finding quality cybersecurity training in Africa was challenging. CDA not only provided world-class education but also a supportive community.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'Incident Response & Forensics', 5, true, '2025-12-24 10:28:41.987306+00'),
('5a3b0eef-63c0-4516-928b-f486b3ea9f35', 'David Oyelaran', 'Penetration Tester', 'Interswitch', 'Nigeria', 'The hands-on approach to learning made all the difference. I can now confidently conduct penetration tests for major fintech companies across Africa.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'Ethical Hacking Fundamentals', 4, false, '2025-12-24 10:28:41.987306+00'),
('a356a893-2117-4a8c-a812-9f3d7df2ab17', 'Amina Hassan', 'Cloud Security Engineer', 'Safaricom', 'Kenya', 'The Cloud Security course was exactly what I needed. Now I''m securing critical infrastructure for millions of users across East Africa.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Cloud Security Essentials', 5, true, '2025-12-24 10:28:41.987306+00');

-- ========================================
-- PLATFORM SETTINGS (update payment_settings)
-- ========================================

INSERT INTO public.platform_settings (key, value) VALUES
  ('payment_settings', '{"currency":"NGN","customInstructions":"","gateway":"paystack","publicKey":"","secretKey":"","testMode":true,"webhookUrl":""}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ========================================
-- COUPONS
-- ========================================

INSERT INTO public.coupons (id, code, description, discount_type, discount_value, max_uses, current_uses, min_purchase_amount, valid_from, valid_until, is_active, applicable_courses, created_at, updated_at) VALUES
('a4fbf269-d8b6-4e63-b9bf-8482048fb408', 'VJANFI5Q', NULL, 'full', 100, NULL, 0, 0, '2025-12-26 08:20:59.732648+00', NULL, true, NULL, '2025-12-26 08:20:59.732648+00', '2025-12-26 08:20:59.732648+00');

-- ========================================
-- LEARNING PATHS
-- ========================================

INSERT INTO public.learning_paths (id, name, slug, description, level, thumbnail, is_active, sort_order, created_at, updated_at) VALUES
('238e3338-b16a-4b30-ba95-a8325b3e1337', 'Cybersecurity Foundations Path', 'cybersecurity-foundations-path', 'A comprehensive learning path to master the fundamentals of cybersecurity. Start from ethical hacking basics, advance through incident response, and finish with cloud security essentials.', 'beginner', NULL, true, 1, '2026-01-02 05:10:31.787486+00', '2026-01-02 05:10:31.787486+00'),
('79378c71-553a-4a83-a772-9cfe23425d1a', 'Digital Forensics Path', 'digital-forensics-path', 'Master the art of digital forensics, from evidence collection to malware analysis. Learn incident response techniques and become proficient in investigating cyber incidents.', 'intermediate', NULL, true, 2, '2026-01-05 22:47:38.16956+00', '2026-01-05 22:47:38.16956+00'),
('49e609e1-70c1-4cfb-820d-e13ae76f6377', 'Digital Forensics Fundamentals', 'digital-forensics-fundamentals', 'A comprehensive learning path covering digital forensics investigation techniques, evidence handling, and forensic analysis tools.', 'beginner', NULL, true, 1, '2026-02-21 00:13:19.948586+00', '2026-02-21 00:13:19.948586+00');

-- ========================================
-- LEARNING PATH COURSES
-- ========================================

INSERT INTO public.learning_path_courses (id, learning_path_id, course_id, sort_order, created_at) VALUES
('b4b93f31-02f2-43b9-9c97-50e1581a6ca1', '238e3338-b16a-4b30-ba95-a8325b3e1337', '5fe4b331-1a22-40a9-960a-ffd60ef8e5d2', 1, '2026-01-02 05:10:31.787486+00'),
('12ee46d1-e6eb-4647-9a69-68ab9f80d9bb', '238e3338-b16a-4b30-ba95-a8325b3e1337', '1bf40c75-1a1d-481c-9160-2d7b72d0d587', 2, '2026-01-02 05:10:31.787486+00'),
('48c8cde7-e342-4fbe-934d-e1ff4efaea3f', '238e3338-b16a-4b30-ba95-a8325b3e1337', '337b04fe-2772-437c-b425-48259f698a56', 3, '2026-01-02 05:10:31.787486+00'),
('5d4a9045-64c0-4b58-985b-12eab81f65d9', '79378c71-553a-4a83-a772-9cfe23425d1a', '0221f451-5f40-4a82-80e8-64b111514087', 1, '2026-01-05 22:47:38.16956+00'),
('2099197a-27be-4fd7-a7c9-d4c21cd5bbeb', '79378c71-553a-4a83-a772-9cfe23425d1a', '1bf40c75-1a1d-481c-9160-2d7b72d0d587', 2, '2026-01-05 22:47:38.16956+00'),
('6d437797-d15e-43f5-97cb-19c74ac996ac', '79378c71-553a-4a83-a772-9cfe23425d1a', '15e15863-899e-49ea-b1df-e9f08da16bde', 3, '2026-01-05 22:47:38.16956+00');

-- ========================================
-- ANNOUNCEMENTS
-- ========================================
-- NOTE: instructor_id references will need to be updated to match new user UUIDs

-- ========================================
-- ASSIGNMENTS
-- ========================================
-- NOTE: instructor_id references will need to be updated to match new user UUIDs

-- ========================================
-- RESOURCES
-- ========================================
-- NOTE: instructor_id references will need to be updated to match new user UUIDs

-- ========================================
-- CERTIFICATE TEMPLATES
-- NOTE: The template_html contains a logo URL that needs updating
-- Replace YOUR_NEW_PROJECT_ID with your new Supabase project ID
-- ========================================

-- You'll need to insert this manually due to the large HTML content
-- Go to your Supabase dashboard > Table Editor > certificate_templates
-- And create a new row with the template HTML from your current project

-- ============================================================
-- IMPORTANT NOTES FOR USER-SPECIFIC DATA:
-- ============================================================
-- 
-- The following data is tied to specific user UUIDs and CANNOT be 
-- imported directly because user UUIDs will be different in your 
-- new Supabase project:
--
-- 1. PROFILES - Created automatically when users sign up
-- 2. USER_ROLES - Created automatically (student role on signup)
--    You'll need to manually assign admin/instructor roles
-- 3. ENROLLMENTS - Users will need to re-enroll
-- 4. PAYMENTS - Historical payment records (optional to recreate)
-- 5. QUIZ_ATTEMPTS & RESPONSES - Student quiz history
-- 6. CERTIFICATES - Will need to be re-issued
-- 7. COMPLAINTS - Student support tickets
-- 8. NOTIFICATIONS - User notifications
-- 9. TRANSCRIPT_REQUESTS - Student transcript requests
-- 10. COUPON_USAGES - Coupon usage history
-- 11. AUDIT_LOGS - Admin activity logs
--
-- AFTER creating your admin user:
-- 1. Go to Authentication > Users > Add User
-- 2. Create the admin account
-- 3. Copy the user UUID
-- 4. Run: INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR_ADMIN_UUID', 'admin');
--
-- For instructor accounts:
-- 1. Create the instructor user account
-- 2. Run: INSERT INTO public.user_roles (user_id, role) VALUES ('INSTRUCTOR_UUID', 'instructor');
-- 3. Update the courses table: UPDATE public.courses SET instructor_id = 'INSTRUCTOR_UUID' WHERE slug = 'introduction-to-digital-forensic';
--
-- ============================================================
