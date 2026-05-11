import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen, Award, Clock, TrendingUp, PlayCircle, ArrowRight,
  GraduationCap, Trophy, Target, FileText, Bell, Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

function NotificationDot({ type }: { type: string }) {
  const color = type === "success" ? "bg-emerald-400" : type === "warning" ? "bg-amber-400" : "bg-primary";
  return <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${color}`} />;
}

function RecentNotifications({ userId }: { userId?: string }) {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["recent-notifications", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("notifications").select("*").eq("user_id", userId)
        .order("created_at", { ascending: false }).limit(5);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    refetchInterval: 30000,
  });

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;
  if (isLoading) return <Skeleton className="h-36 w-full rounded-2xl" />;
  if (!notifications?.length) return null;

  return (
    <div className="card-neon p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-display font-bold text-base">Notifications</h3>
          {unreadCount > 0 && (
            <span className="badge-cyber text-xs">{unreadCount} new</span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`flex items-start gap-3 p-3 rounded-xl transition-colors text-sm ${
              !notif.is_read ? "bg-primary/5 border border-primary/10" : "hover:bg-muted/40"
            }`}
          >
            <NotificationDot type={notif.type} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm leading-snug">{notif.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{notif.message}</p>
            </div>
            {!notif.is_read && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useUserRole();

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["student-enrollments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("enrollments").select(`*, course:courses(*)`).eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: certificates, isLoading: certificatesLoading } = useQuery({
    queryKey: ["student-certificates", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("certificates").select("*").eq("user_id", user.id)
        .is("revoked_at", null).order("issued_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: assignments } = useQuery({
    queryKey: ["student-course-assignments", user?.id],
    queryFn: async () => {
      if (!user?.id || !enrollments?.length) return [];
      const courseIds = enrollments.map((e) => e.course_id).filter(Boolean);
      if (!courseIds.length) return [];
      const { data, error } = await supabase
        .from("assignments").select("*").in("course_id", courseIds).order("due_date", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && !!enrollments?.length,
  });

  const { data: submissions } = useQuery({
    queryKey: ["student-all-submissions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase.from("assignment_submissions").select("*").eq("student_id", user.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const upcomingAssignments = assignments?.filter((a) => {
    const hasDeadline  = a.due_date && new Date(a.due_date) > new Date();
    const notSubmitted = !submissions?.find((s) => s.assignment_id === a.id);
    return hasDeadline && notSubmitted;
  }).slice(0, 3) || [];

  const inProgressCourses = enrollments?.filter((e) => !e.completed_at) || [];
  const completedCourses  = enrollments?.filter((e) =>  e.completed_at) || [];
  const totalProgress     = enrollments?.length
    ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length)
    : 0;

  const firstName = profile?.full_name?.split(" ")[0] || "Student";

  const statCards = [
    { title: "Enrolled",   value: enrollments?.length || 0,  icon: BookOpen,    from: "from-blue-500/20",    to: "to-blue-600/10",    text: "text-blue-400",    border: "hover:border-blue-500/30" },
    { title: "In Progress",value: inProgressCourses.length,  icon: Clock,       from: "from-cyan-500/20",    to: "to-cyan-600/10",    text: "text-cyan-400",    border: "hover:border-cyan-500/30" },
    { title: "Completed",  value: completedCourses.length,   icon: Trophy,      from: "from-emerald-500/20", to: "to-emerald-600/10", text: "text-emerald-400", border: "hover:border-emerald-500/30" },
    { title: "Certificates",value: certificates?.length || 0, icon: Award,      from: "from-amber-500/20",   to: "to-amber-600/10",   text: "text-amber-400",   border: "hover:border-amber-500/30" },
  ];

  return (
    <DashboardLayout type="student">
      <div className="space-y-7 max-w-7xl">

        {/* ── Welcome Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-2xl overflow-hidden p-6 md:p-8"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.12), hsl(var(--cyan)/0.08))" }}
        >
          <div className="absolute inset-0 cyber-dots opacity-30 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 ambient-blob ambient-blob-cyan opacity-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-cyber text-xs"><Zap className="w-3 h-3" />Learning Mode</span>
              </div>
              <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-display">
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-muted-foreground mt-1.5 text-sm">
                {inProgressCourses.length > 0
                  ? `You have ${inProgressCourses.length} course${inProgressCourses.length > 1 ? "s" : ""} in progress.`
                  : "Browse courses to start your cybersecurity journey."}
              </p>
            </div>

            {/* Overall progress ring */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="32" fill="none"
                    stroke="url(#progressGrad)" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - totalProgress / 100)}`}
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--cyan))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display font-extrabold text-lg leading-none">{totalProgress}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">Overall Progress</p>
                <p className="text-xs text-muted-foreground">Across all courses</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`stat-card ${stat.border} transition-all`}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.from} ${stat.to} opacity-0 hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${stat.from} ${stat.to}`}>
                  <stat.icon className={`w-5 h-5 ${stat.text}`} />
                </div>
                <p className="font-display font-extrabold text-2xl mb-0.5">
                  <AnimatedCounter end={stat.value} duration={1.5} />
                </p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Course Progress Analytics ── */}
        {inProgressCourses.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Course Progress
              </h2>
              <Link to="/student/courses">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressCourses.slice(0, 3).map((enrollment) => {
                const courseAssignments = assignments?.filter((a) => a.course_id === enrollment.course_id) || [];
                const courseSubmissions = submissions?.filter((s) => courseAssignments.some((a) => a.id === s.assignment_id)) || [];
                return (
                  <CourseProgressCard
                    key={enrollment.id}
                    courseName={enrollment.course?.title || "Unknown Course"}
                    totalPoints={enrollment.course?.total_points || 100}
                    assignments={courseAssignments}
                    submissions={courseSubmissions}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ── Upcoming Deadlines ── */}
        {upcomingAssignments.length > 0 && (
          <div className="card-neon p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-amber-400" />
                </div>
                <h3 className="font-display font-bold text-base">Upcoming Deadlines</h3>
              </div>
              <Link to="/student/assignments">
                <Button variant="ghost" size="sm" className="text-xs gap-1">View All <ArrowRight className="h-3.5 w-3.5" /></Button>
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm leading-snug">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground">{assignment.max_score} pts</p>
                    </div>
                  </div>
                  <CountdownTimer targetDate={assignment.due_date} compact />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-5">
          {/* ── Continue Learning ── */}
          <div className="card-neon p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <PlayCircle className="h-4 w-4 text-cyan-400" />
                </div>
                <h3 className="font-display font-bold text-base">Continue Learning</h3>
              </div>
              <Link to="/student/courses">
                <Button variant="ghost" size="sm" className="text-xs gap-1">View All <ArrowRight className="h-3.5 w-3.5" /></Button>
              </Link>
            </div>

            {enrollmentsLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
              </div>
            ) : inProgressCourses.length === 0 ? (
              <div className="text-center py-10">
                <GraduationCap className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">No courses in progress yet.</p>
                <Button className="btn-cyber text-white text-xs" asChild>
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {inProgressCourses.slice(0, 3).map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      {enrollment.course?.thumbnail ? (
                        <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{enrollment.course?.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="progress-cyber flex-1">
                          <div className="progress-cyber-fill" style={{ width: `${enrollment.progress || 0}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{enrollment.progress || 0}%</span>
                      </div>
                    </div>
                    <Link to={`/courses/${enrollment.course?.slug}`}>
                      <Button size="sm" variant="ghost" className="text-xs h-7 px-3 hover:text-primary">
                        Continue <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Certificates ── */}
          <div className="card-neon p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Award className="h-4 w-4 text-amber-400" />
                </div>
                <h3 className="font-display font-bold text-base">Certificates</h3>
              </div>
              <Link to="/student/certificates">
                <Button variant="ghost" size="sm" className="text-xs gap-1">View All <ArrowRight className="h-3.5 w-3.5" /></Button>
              </Link>
            </div>

            {certificatesLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
              </div>
            ) : !certificates?.length ? (
              <div className="text-center py-10">
                <Award className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Complete courses to earn certificates.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {certificates.slice(0, 3).map((cert) => (
                  <div key={cert.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Award className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{cert.course_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(cert.issued_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span className="badge-success text-xs">#{cert.verification_id.slice(0, 6)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Notifications ── */}
        <RecentNotifications userId={user?.id} />
      </div>
    </DashboardLayout>
  );
}
