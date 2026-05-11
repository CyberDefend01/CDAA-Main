import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut, ChevronDown, Shield, BookOpen, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import logo from "@/assets/logo.png";

const navigation = [
  { name: "Home",    href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "About",   href: "/about" },
  { name: "Blog",    href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const courseCategories = [
  { name: "Cybersecurity Fundamentals", icon: Shield,         desc: "Core concepts for beginners" },
  { name: "Ethical Hacking",            icon: BookOpen,       desc: "Penetration testing & exploitation" },
  { name: "SOC Analyst Training",       icon: GraduationCap,  desc: "Security operations center" },
  { name: "Cloud Security",             icon: Users,          desc: "AWS, Azure & GCP security" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen]       = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [user, setUser]     = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' })
            .then(({ data }) => setIsAdmin(data === true));
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' })
          .then(({ data }) => setIsAdmin(data === true));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-2xl border-b border-border/60 shadow-sm"
            : "bg-transparent"
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <nav className="container-custom flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-cyan/20 blur-md group-hover:blur-lg transition-all duration-300" />
              <img
                src={logo}
                alt="CDAA"
                className="relative h-10 w-10 rounded-full object-cover ring-2 ring-border/40 group-hover:ring-cyan/40 transition-all duration-300"
              />
            </motion.div>
            <div className="hidden sm:block">
              <p className="font-display font-bold text-[15px] leading-none text-foreground group-hover:text-primary transition-colors duration-200">
                Cyber Defend Africa
              </p>
              <p className="text-[11px] text-muted-foreground font-medium tracking-widest uppercase mt-0.5">
                Academy
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item, i) => (
              item.name === "Courses" ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setCoursesOpen(true)}
                  onMouseLeave={() => setCoursesOpen(false)}
                >
                  <motion.button
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                      location.pathname.startsWith("/courses")
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    {item.name}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${coursesOpen ? "rotate-180" : ""}`} />
                  </motion.button>

                  <AnimatePresence>
                    {coursesOpen && (
                      <motion.div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 glass-heavy rounded-2xl overflow-hidden shadow-xl ring-1 ring-border/40"
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      >
                        <div className="p-2">
                          <div className="px-3 py-2 mb-1">
                            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Explore Courses</p>
                          </div>
                          {courseCategories.map((cat) => (
                            <Link
                              key={cat.name}
                              to="/courses"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors group/item"
                            >
                              <div className="w-8 h-8 rounded-lg icon-container icon-container-cyan flex-shrink-0 flex items-center justify-center">
                                <cat.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">{cat.name}</p>
                                <p className="text-xs text-muted-foreground">{cat.desc}</p>
                              </div>
                            </Link>
                          ))}
                          <div className="divider-cyber my-2 mx-3" />
                          <Link to="/courses" className="flex items-center justify-center gap-2 mx-3 mb-2 py-2.5 rounded-xl text-sm font-semibold btn-cyber">
                            View All Courses
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    to={item.href}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 block ${
                      location.pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {item.name}
                    {location.pathname === item.href && (
                      <motion.div
                        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-primary to-cyan"
                        layoutId="activeNav"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />

            {isAdmin && (
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-2" asChild>
                <Link to="/admin">
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              </Button>
            )}

            {user ? (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-2" asChild>
                  <Link to="/student/dashboard">Dashboard</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="sm"
                    className="btn-cyber text-white text-sm px-5 h-9 shadow-neon-cyan"
                    asChild
                  >
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <motion.button
              type="button"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-16 left-0 right-0 z-50 lg:hidden glass-heavy border-b border-border/60 shadow-xl overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="container-custom py-5 space-y-1">
                {navigation.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center py-3 px-4 rounded-xl text-base font-medium transition-all ${
                        location.pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {item.name}
                      {location.pathname === item.href && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  </motion.div>
                ))}

                <div className="divider-cyber my-3" />

                <motion.div
                  className="space-y-2 pt-1 pb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                >
                  {user ? (
                    <>
                      <Button variant="outline" className="w-full justify-start gap-2" asChild>
                        <Link to="/student/dashboard"><LayoutDashboard className="w-4 h-4" />Dashboard</Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive" onClick={handleLogout}>
                        <LogOut className="w-4 h-4" />Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/auth">Sign In</Link>
                      </Button>
                      <Button className="w-full btn-cyber shadow-neon-cyan" asChild>
                        <Link to="/auth">Get Started Free</Link>
                      </Button>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
