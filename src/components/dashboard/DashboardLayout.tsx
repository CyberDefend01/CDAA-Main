import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BookOpen, GraduationCap, Award, BarChart3, Settings, LogOut, Menu, Home,
  Users, PlusCircle, ClipboardList, FolderOpen, Bell, MessageSquare,
  Megaphone, Lock, FileText, CreditCard, Search, ChevronRight, MapPin,
  Shield,
} from "lucide-react";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { useUserRole } from "@/hooks/useUserRole";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useEnrollmentCheck } from "@/hooks/useEnrollmentCheck";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

interface NavItem {
  title: string;
  href:  string;
  icon:  React.ElementType;
  requiresEnrollment?: boolean;
}

interface NavGroup {
  label:  string;
  items:  NavItem[];
}

interface DashboardLayoutProps {
  children: ReactNode;
  type: "student" | "instructor";
}

const studentNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard",      href: "/student",        icon: Home },
      { title: "Browse Courses", href: "/student/browse", icon: Search },
      { title: "My Courses",     href: "/student/courses", icon: BookOpen },
    ],
  },
  {
    label: "Learning",
    items: [
      { title: "Quizzes",        href: "/student/quizzes",       icon: ClipboardList, requiresEnrollment: true },
      { title: "Assignments",    href: "/student/assignments",    icon: ClipboardList, requiresEnrollment: true },
      { title: "Resources",      href: "/student/resources",      icon: FolderOpen,    requiresEnrollment: true },
      { title: "Learning Paths", href: "/student/paths",          icon: GraduationCap, requiresEnrollment: true },
      { title: "Announcements",  href: "/student/announcements",  icon: Bell,          requiresEnrollment: true },
    ],
  },
  {
    label: "Credentials",
    items: [
      { title: "Certificates", href: "/student/certificates", icon: Award,      requiresEnrollment: true },
      { title: "Transcripts",  href: "/student/transcripts",  icon: FileText,   requiresEnrollment: true },
      { title: "ID Card",      href: "/student/id-card",      icon: CreditCard, requiresEnrollment: true },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Complaints", href: "/student/complaints", icon: MessageSquare, requiresEnrollment: true },
      { title: "Settings",   href: "/student/settings",   icon: Settings },
    ],
  },
];

const instructorNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard",  href: "/instructor",          icon: Home },
      { title: "Students",   href: "/instructor/students", icon: Users },
      { title: "Analytics",  href: "/instructor/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "My Courses",   href: "/instructor/courses",         icon: BookOpen },
      { title: "Create Course",href: "/instructor/courses/new",     icon: PlusCircle },
      { title: "Curriculum",   href: "/instructor/curriculum",      icon: BookOpen },
      { title: "Quizzes",      href: "/instructor/quizzes",         icon: ClipboardList },
      { title: "Assignments",  href: "/instructor/assignments",     icon: ClipboardList },
      { title: "Resources",    href: "/instructor/resources",       icon: FolderOpen },
      { title: "Announcements",href: "/instructor/announcements",   icon: Megaphone },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Settings", href: "/instructor/settings", icon: Settings },
    ],
  },
];

export function DashboardLayout({ children, type }: DashboardLayoutProps) {
  const location   = useLocation();
  const navigate   = useNavigate();
  const { user }   = useUserRole();
  const { isEnrolled, isLoading: enrollmentLoading } = useEnrollmentCheck();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navGroups    = type === "student" ? studentNavGroups : instructorNavGroups;
  const dashboardTitle = type === "student" ? "Student Portal" : "Instructor Portal";

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate("/"); };

  const displayName    = profile?.full_name || user?.email?.split("@")[0] || "User";
  const initials       = displayName.slice(0, 2).toUpperCase();
  const roleLabel      = type === "student" ? "Student" : "Instructor";
  const roleBadgeClass = type === "student" ? "badge-cyber" : "badge-neon";

  const NavContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full bg-sidebar">

      {/* Brand */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-cyan/20 blur-md group-hover:blur-lg transition-all" />
            <img src={logo} alt="CDAA" className="relative h-9 w-9 rounded-full object-cover ring-2 ring-sidebar-border group-hover:ring-primary/30 transition-all" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-sidebar-foreground leading-none group-hover:text-sidebar-primary transition-colors">
              Cyber Defend Africa
            </p>
            <p className="text-[10px] text-sidebar-foreground/40 font-medium tracking-widest uppercase mt-0.5">
              {dashboardTitle}
            </p>
          </div>
        </Link>
      </div>

      {/* Enrollment nudge */}
      {type === "student" && !enrollmentLoading && !isEnrolled && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-400">No active enrolment</p>
              <p className="text-[11px] text-amber-400/70 mt-0.5">Enrol in a course to unlock all features.</p>
            </div>
          </div>
          <Link to="/courses" className="mt-2.5 block">
            <Button size="sm" className="w-full text-xs h-7 btn-cyber text-white">Browse Courses</Button>
          </Link>
        </div>
      )}

      {/* Nav groups */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="sidebar-group-label mb-1">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  const isLocked = type === "student" && item.requiresEnrollment && !isEnrolled;

                  if (isLocked) {
                    return (
                      <div
                        key={item.href}
                        title="Enrol in a course to unlock"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/30 cursor-not-allowed select-none"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 text-[13px]">{item.title}</span>
                        <Lock className="h-3 w-3" />
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => mobile && setMobileOpen(false)}
                      className={cn(
                        "sidebar-item text-[13px]",
                        isActive && "active"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                      <span className="flex-1">{item.title}</span>
                      {isActive && <ChevronRight className="h-3.5 w-3.5 text-primary" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        {/* User info */}
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-sidebar-accent transition-colors cursor-default">
          <Avatar className="h-9 w-9 ring-2 ring-sidebar-border shrink-0">
            <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-cyan text-white text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{displayName}</p>
            <p className="text-[11px] text-sidebar-foreground/40 truncate">{user?.email}</p>
          </div>
          <span className={`${roleBadgeClass} text-[10px] shrink-0`}>{roleLabel}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <NotificationBell />
          <ThemeToggle />
          <Link to="/" className="flex-1">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent h-8">
              <Home className="h-3.5 w-3.5" />Back to Site
            </Button>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-8"
          onClick={handleSignOut}
        >
          <LogOut className="h-3.5 w-3.5" />Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-68 flex-col border-r border-sidebar-border shrink-0 fixed top-0 bottom-0 left-0 z-30">
        <NavContent />
      </aside>

      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-68">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-border bg-background/90 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="CDAA" className="h-7 w-7 rounded-full object-cover" />
            <span className="font-display font-bold text-sm">CDA Academy</span>
          </Link>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-sidebar-border">
                <NavContent mobile />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden lg:flex sticky top-0 z-20 items-center justify-between px-8 h-14 border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="capitalize">{location.pathname.split("/").filter(Boolean).join(" › ")}</span>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <ThemeToggle />
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <Avatar className="h-7 w-7">
                <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-cyan text-white text-[10px] font-bold">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{displayName}</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <motion.main
          className="flex-1 p-5 lg:p-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
