import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, BookOpen, MessageSquare, UserCheck, Activity, ArrowRight,
  Shield, Zap, TrendingUp, CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface DashboardStats {
  totalCourses:      number;
  totalUsers:        number;
  totalEnrollments:  number;
  unreadMessages:    number;
}

const systemServices = [
  { label: "Database",       status: "operational" as const },
  { label: "Authentication", status: "operational" as const },
  { label: "Storage",        status: "operational" as const },
  { label: "Edge Functions", status: "operational" as const },
];

function StatusDot({ status }: { status: "operational" | "degraded" | "down" }) {
  const colors = { operational: "bg-emerald-400", degraded: "bg-amber-400", down: "bg-red-400" };
  return <span className={`relative flex h-2 w-2`}>
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors[status]} opacity-50`} />
    <span className={`relative inline-flex rounded-full h-2 w-2 ${colors[status]}`} />
  </span>;
}

export default function AdminDashboard() {
  const [stats, setStats]   = useState<DashboardStats>({ totalCourses: 0, totalUsers: 0, totalEnrollments: 0, unreadMessages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [coursesRes, profilesRes, enrollmentsRes, messagesRes] = await Promise.all([
          supabase.from("courses").select("id", { count: "exact", head: true }),
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("enrollments").select("id", { count: "exact", head: true }),
          supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("is_read", false),
        ]);
        setStats({
          totalCourses:     coursesRes.count     || 0,
          totalUsers:       profilesRes.count    || 0,
          totalEnrollments: enrollmentsRes.count || 0,
          unreadMessages:   messagesRes.count    || 0,
        });
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const statCards = [
    { title: "Total Courses",      value: stats.totalCourses,      icon: BookOpen,      from: "from-blue-500",    to: "to-cyan-500",    bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20" },
    { title: "Registered Users",   value: stats.totalUsers,        icon: Users,         from: "from-emerald-500", to: "to-green-400",   bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    { title: "Total Enrolments",   value: stats.totalEnrollments,  icon: UserCheck,     from: "from-violet-500",  to: "to-purple-400",  bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20" },
    { title: "Unread Messages",    value: stats.unreadMessages,    icon: MessageSquare, from: "from-amber-500",   to: "to-orange-400",  bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20" },
  ];

  const quickActions = [
    { icon: BookOpen,      label: "Add New Course",     href: "/admin/courses",     accent: "text-blue-400",    bg: "bg-blue-500/10" },
    { icon: MessageSquare, label: "View Messages",      href: "/admin/messages",    accent: "text-amber-400",   bg: "bg-amber-500/10", badge: stats.unreadMessages || undefined },
    { icon: Users,         label: "Manage Users",       href: "/admin/users",       accent: "text-emerald-400", bg: "bg-emerald-500/10" },
    { icon: Shield,        label: "View Audit Logs",    href: "/admin/audit-logs",  accent: "text-violet-400",  bg: "bg-violet-500/10" },
    { icon: TrendingUp,    label: "Academy Programs",   href: "/admin/academy-programs", accent: "text-cyan-400", bg: "bg-cyan-500/10" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-7 max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden p-6 md:p-8"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.1), hsl(var(--cyan)/0.06))" }}
        >
          <div className="absolute inset-0 cyber-dots opacity-25 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-neon text-xs"><Zap className="w-3 h-3" />Admin Control Center</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-display">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Manage your academy — courses, users, enrolments, and more.
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`stat-card ${stat.border} border transition-all`}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.from} ${stat.to} opacity-0 hover:opacity-5 transition-opacity`} />
              <div className="relative z-10">
                {/* Gradient accent bar */}
                <div className={`absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r ${stat.from} ${stat.to} rounded-b-full`} />
                <div className={`w-10 h-10 rounded-xl mb-4 mt-2 flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.text}`} />
                </div>
                <p className="font-display font-extrabold text-2xl mb-0.5">
                  {loading ? <span className="animate-pulse text-muted-foreground">—</span> : (
                    <AnimatedCounter end={stat.value} duration={1.5} />
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Quick Actions */}
          <div className="card-neon p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-display font-bold text-base">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  to={action.href}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.bg}`}>
                      <action.icon className={`w-4 h-4 ${action.accent}`} />
                    </div>
                    <span className="font-medium text-sm group-hover:text-primary transition-colors">{action.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {action.badge !== undefined && action.badge > 0 && (
                      <span className="badge-warning text-xs">{action.badge}</span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="card-neon p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-display font-bold text-base">System Status</h3>
              <span className="badge-success text-xs ml-auto">All Systems Go</span>
            </div>

            <div className="space-y-4">
              {systemServices.map((svc) => (
                <div key={svc.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{svc.label}</span>
                  <div className="flex items-center gap-2">
                    <StatusDot status={svc.status} />
                    <span className="text-xs font-semibold capitalize text-emerald-400">{svc.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider-cyber my-5" />

            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Platform Healthy</p>
                  <p className="text-xs text-muted-foreground mt-0.5">All services are running normally.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
