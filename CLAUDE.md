# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cyber Defend Africa Academy (CDAA)** is a full-stack cybersecurity training platform built with React 18 + TypeScript + Vite, Tailwind CSS + shadcn-ui, TanStack React Query, React Router v6, and Supabase (PostgreSQL + Auth + Edge Functions). Email is handled via Resend API through a Supabase Edge Function. Deployment targets Vercel.

## Commands

```bash
npm install        # install dependencies (bun install also works)
npm run dev        # dev server at http://localhost:8080
npm run build      # production build to dist/
npm run build:dev  # non-minified build
npm run preview    # preview production build locally
npm run lint       # ESLint (TypeScript + React Hooks rules)
```

There are no test files; linting and Vite's type-check at build time are the primary quality gates.

## Architecture

### Authentication & RBAC

- Supabase Auth with JWT stored in localStorage (auto-refresh enabled)
- Roles stored in `user_roles` table: `admin`, `instructor`, `student`, `moderator`, `user`
- `src/hooks/useUserRole.ts` — fetches roles and exposes `isAdmin`, `isInstructor`, `isStudent`, `isModerator` helpers
- `src/components/dashboard/ProtectedRoute.tsx` — wraps routes; redirects to `/auth` if the user lacks the required role

### Data Flow

React Router (57 routes) → TanStack React Query (caching layer) → Supabase JS client → PostgreSQL. Custom hooks (`useEnrollmentCheck`, `useAcademyPrograms`, etc.) encapsulate query logic. Supabase Edge Functions handle async work: email delivery, certificate/transcript PDF generation, coupon verification.

### Page Organization

`src/pages/` is divided by role:
- **Public:** `Index`, `Courses`, `CourseDetail`, `Auth`, `Blog`, `About`, `Contact`
- **`admin/`** — 14+ pages: courses, users, settings, audit logs, categories, learning paths, certificates, blog, coupons, complaints, transcripts, ID cards, academy programs
- **`student/`** — 11+ pages: dashboard, enrolled courses, quizzes, certificates, transcripts, learning paths, assignments, resources, announcements, complaints, course browser
- **`instructor/`** — 9+ pages: dashboard, course list, course editor, curriculum editor, students, analytics, settings, quizzes, announcements

### Key Utilities (`src/lib/`)

| File | Purpose |
|---|---|
| `emailService.ts` | Calls `send-email` Edge Function via Supabase (welcome, password-reset, certificate-earned, quiz-passed, etc.) |
| `auditLogger.ts` | Writes to `audit_logs` table for compliance tracking |
| `idCardUtils.ts` | Generates student ID card images via HTML Canvas |
| `notificationService.ts` | In-app toast notifications (Sonner) |

### Supabase Backend

Edge Functions in `supabase/functions/`: `send-email`, `issue-certificate`, `generate-transcript`, `verify-coupon`, `send-auth-email`, `send-notification-email`, `get-user-emails`.

14 SQL migrations cover: users/profiles/roles, courses/lessons/curriculum, quizzes/questions/attempts, enrollments/certificates/transcripts, academy programs, coupons, complaints, announcements, resources, audit logs.

Auto-generated TypeScript types live in `src/integrations/supabase/types.ts` — do not edit manually; regenerate with `supabase gen types typescript`.

### Styling

Custom Tailwind theme in `tailwind.config.ts`: colors (cyan, magenta, lime, sidebar palette), fonts (Plus Jakarta Sans for display, Inter for body), dark mode via `next-themes` (class strategy). shadcn-ui components are in `src/components/ui/`.

### Path Aliases

`@` maps to `src/` (configured in `vite.config.ts` and `tsconfig.json`).
