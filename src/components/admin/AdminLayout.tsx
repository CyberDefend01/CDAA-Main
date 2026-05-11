import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, BookOpen, Users, MessageSquare, Star, Settings, LogOut,
  Shield, ChevronLeft, FolderOpen, Route, Award, FileText, ClipboardList,
  Wrench, CreditCard, Ticket, GraduationCap, MessageSquareWarning, Menu, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import logo from "@/assets/logo.png";

interface AdminLayoutProps { children: ReactNode; }

const navGroups = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard",   path: "/admin" },
    ],
  },
  {
    label: "Content",
    items: [
      { icon: BookOpen,       label: "Courses",         path: "/admin/courses" },
      { icon: FolderOpen,     label: "Categories",      path: "/admin/categories" },
      { icon: Route,          label: "Learning Paths",  path: "/admin/learning-paths" },
      { icon: GraduationCap,  label: "Academy Programs",path: "/admin/academy-programs" },
      { icon: FileText,       label: "Blog Posts",      path: "/admin/blog" },
    ],
  },
  {
    label: "Students",
    items: [
      { icon: Users,              label: "Users",         path: "/admin/users" },
      { icon: Award,              label: "Certificates",  path: "/admin/certificates" },
      { icon: FileText,           label: "Transcripts",   path: "/admin/transcripts" },
      { icon: CreditCard,         label: "ID Cards",      path: "/admin/id-cards" },
    ],
  },
  {
    label: "Support",
    items: [
      { icon: MessageSquare,         label: "Messages",      path: "/admin/messages" },
      { icon: MessageSquareWarning,  label: "Complaints",    path: "/admin/complaints" },
      { icon: Star,                  label: "Testimonials",  path: "/admin/testimonials" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: ClipboardList, label: "Audit Logs",        path: "/admin/audit-logs" },
      { icon: CreditCard,    label: "Payment Settings",  path: "/admin/payment-settings" },
      { icon: Ticket,        label: "Coupons",           path: "/admin/coupons" },
      { icon: Wrench,        label: "Platform Settings", path: "/admin/platform-settings" },
    ],
  },
];

function SidebarContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error("Error signing out");
    else { toast.success("Signed out successfully"); navigate("/"); }
  };

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-cyan/20 blur-md group-hover:blur-lg transition-all" />
            <img src={logo} alt="CDAA" className="relative h-9 w-9 rounded-full object-cover ring-2 ring-sidebar-border group-hover:ring-primary/30 transition-all" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-sidebar-foreground leading-none">Admin Panel</p>
            <p className="text-[10px] text-sidebar-foreground/40 font-medium tracking-widest uppercase mt-0.5">Cyber Defend Africa</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="sidebar-group-label mb-1">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn("sidebar-item text-[13px]", isActive && "active")}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-1">
        <div className="flex items-center gap-2 px-2 py-1">
          <Shield className="w-3.5 h-3.5 text-primary/60" />
          <span className="text-xs text-muted-foreground font-semibold">Administrator</span>
          <div className="ml-auto"><ThemeToggle /></div>
        </div>
        <Link to="/">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground h-8">
            <ChevronLeft className="w-3.5 h-3.5" />Back to Site
          </Button>
        </Link>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-8" onClick={handleLogout}>
          <LogOut className="w-3.5 h-3.5" />Sign Out
        </Button>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 xl:w-64 flex-col border-r border-sidebar-border shrink-0 fixed top-0 bottom-0 left-0 z-30">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col lg:ml-60 xl:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 h-14 border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-60 border-sidebar-border">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="capitalize">{location.pathname.split("/").filter(Boolean).join(" › ")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline badge-neon text-xs">Admin Mode</span>
            <div className="lg:hidden"><ThemeToggle /></div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
