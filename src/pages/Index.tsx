import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CyberGrid } from "@/components/ui/CyberGrid";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Zap,
  Globe,
  Headphones,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { FeatureCards } from "@/components/home/FeatureCards";

/* ─── Brand colour tokens ─── */
const HERO_NAVY       = "#111f45";
const HERO_BLUE_BLOCK = "#1f4aad";
const HERO_GREEN      = "#2db84e";

/* ─── Lucide icon component type ─── */
type LucideIcon = React.ComponentType<{ className?: string }>;

const Index = () => {
  const [stats, setStats] = useState<
    { label: string; stat_value: string; icon: string | null }[]
  >([]);
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [testimonials, setTestimonials]       = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("platform_stats")
      .select("label, stat_value, icon")
      .order("sort_order")
      .then(({ data }) => { if (data) setStats(data); });

    supabase
      .from("courses")
      .select(
        "id,title,slug,short_description,thumbnail,price,original_price,level,category,rating,students_count,instructor_name"
      )
      .eq("is_published", true)
      .eq("is_featured", true)
      .limit(6)
      .then(({ data }) => { if (data) setFeaturedCourses(data); });

    supabase
      .from("testimonials")
      .select("*")
      .eq("is_featured", true)
      .limit(3)
      .then(({ data }) => { if (data) setTestimonials(data); });
  }, []);

  /* ─── Static data arrays ─── */
  const highlights: { icon: LucideIcon; label: string; sub: string }[] = [
    { icon: CheckCircle, label: "Industry Certified",  sub: "Globally recognised"  },
    { icon: Zap,         label: "Hands-on Labs",       sub: "Real environments"    },
    { icon: Globe,       label: "Africa Focused",      sub: "32+ countries served" },
  ];

  const whyCards: { icon: LucideIcon; title: string; desc: string }[] = [
    { icon: CheckCircle, title: "Industry Certified",  desc: "Courses aligned with globally recognised certifications"      },
    { icon: Zap,         title: "Hands-on Labs",       desc: "Practice in real-world environments with guided exercises"    },
    { icon: Globe,       title: "Africa Focused",      desc: "Content tailored to address Africa's unique cyber challenges" },
    { icon: Headphones,  title: "Expert Support",      desc: "Get help from certified cybersecurity professionals"          },
  ];

  const avatarColors = [HERO_NAVY, HERO_BLUE_BLOCK, HERO_GREEN];
  const stripColors  = [HERO_BLUE_BLOCK, HERO_GREEN, HERO_NAVY];

  return (
    <Layout>

      {/* ══════════════════════════════════════════
          HERO — split layout, image on right half
          ══════════════════════════════════════════ */}
      <section
        className="relative -mt-20 flex min-h-[88vh] overflow-hidden"
        style={{ backgroundColor: HERO_NAVY }}
      >
        {/* Left content panel */}
        <div className="relative z-10 flex w-full flex-col justify-center px-8 py-28 md:w-[54%] md:px-16 lg:px-24">

          {/* Dot-grid texture */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
          >
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
              Africa's Premier Cybersecurity Academy
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative z-10"
          >
            <h1
              className="mb-6 font-display font-extrabold leading-[1.07] text-white"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
            >
              Securing Africa's
              <br />
              <span className="mt-2 inline-flex flex-wrap items-center gap-x-3 gap-y-2">
                <span
                  className="inline-block px-3 py-1"
                  style={{ backgroundColor: HERO_BLUE_BLOCK }}
                >
                  Digital
                </span>
                <span
                  className="inline-block px-3 py-1"
                  style={{ backgroundColor: HERO_GREEN }}
                >
                  Future.
                </span>
              </span>
            </h1>

            <p className="mb-3 font-display text-lg font-semibold italic text-white/75">
              Train with the Best in the Industry
            </p>

            <p className="mb-10 max-w-xl text-base leading-relaxed text-white/60">
              Master cybersecurity with practical, industry-relevant training
              designed for Africa's digital economy. Join thousands of
              professionals protecting organisations across the continent.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="gap-2 px-8 text-base font-bold text-white hover:opacity-90"
                  style={{ backgroundColor: HERO_GREEN, border: "none" }}
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
                >
                  View Courses
                </Button>
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-12 flex flex-wrap gap-6 border-t border-white/10 pt-8">
              {highlights.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  >
                    <Icon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{label}</p>
                    <p className="text-xs text-white/45">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right panel — hero image */}
        <div className="absolute inset-y-0 right-0 hidden w-[50%] md:block">
          <div
            className="absolute inset-y-0 left-0 z-10 w-36"
            style={{
              background: `linear-gradient(to right, ${HERO_NAVY}, transparent)`,
            }}
          />
          <img
            src="/images/hero-bg.jpeg"
            alt="Cybersecurity professionals at work"
            className="h-full w-full object-cover object-center"
            style={{ filter: "brightness(0.78) saturate(1.1)" }}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS BAND
          ══════════════════════════════════════════ */}
      {stats.length > 0 && (
        <section className="border-b border-border bg-secondary/20 py-14">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <p className="mb-1 font-display text-5xl font-extrabold text-primary">
                    {stat.stat_value}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          PARTNERS MARQUEE
          ══════════════════════════════════════════ */}
      <PartnersMarquee />

      {/* ══════════════════════════════════════════
          EMPOWERING HEADER
          ══════════════════════════════════════════ */}
      <section className="pb-4 pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-primary">
              Why CDAA
            </span>
            <h2 className="font-display text-3xl font-extrabold md:text-4xl">
              Empowering the Next Generation of{" "}
              <span className="text-primary">Cyber Defenders</span>
            </h2>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURE CARDS
          ══════════════════════════════════════════ */}
      <FeatureCards />

      {/* ══════════════════════════════════════════
          FEATURED COURSES
          ══════════════════════════════════════════ */}
      {featuredCourses.length > 0 && (
        <section className="bg-secondary/20 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
                Popular Programs
              </p>
              <h2 className="mb-4 font-display text-3xl font-extrabold md:text-4xl">
                Featured <span className="text-primary">Courses</span>
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Start your cybersecurity career with our most popular training programmes
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/courses/${course.slug}`}>
                    <div className="glass-card group overflow-hidden rounded-xl transition-all duration-300 hover:border-primary/50">
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="absolute left-3 top-3">
                          <span className="rounded bg-primary/90 px-2 py-1 text-xs font-medium text-primary-foreground">
                            {course.level}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="mb-2 line-clamp-2 font-display text-sm font-semibold transition-colors group-hover:text-primary">
                          {course.title}
                        </h3>
                        <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                          {course.short_description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {course.instructor_name}
                          </span>
                          <span className="text-xs font-medium text-primary">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link to="/courses">
                <Button variant="outline" size="lg" className="border-primary/30">
                  View All Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          WHY CHOOSE US
          ══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-extrabold md:text-4xl">
              Why Choose <span className="text-primary">CDAA</span>?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We provide world-class cybersecurity education tailored for Africa's digital landscape
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl p-6 text-center transition-all hover:border-primary/50"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-sm font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS — ice-blue Blackboard style
          ══════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="bg-secondary/15 py-20">
          <div className="container mx-auto px-4">

            <div className="mb-14 text-center">
              <span
                className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white"
                style={{ backgroundColor: HERO_BLUE_BLOCK }}
              >
                Testimonials
              </span>
              <h2 className="mb-4 font-display text-3xl font-extrabold md:text-5xl">
                Success Stories from{" "}
                <span className="text-primary">Across Africa</span>
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Hear from professionals who've transformed their careers with our training
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-2xl"
                  style={{
                    backgroundColor: "#dce9f9",
                    borderBottom: `4px solid ${HERO_NAVY}`,
                  }}
                >
                  {/* Coloured top strip */}
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: stripColors[i % stripColors.length] }}
                  />

                  <div className="p-7">
                    {/* Stars */}
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: t.rating ?? 5 }).map((_, idx) => (
                        <span key={idx} style={{ color: "#f59e0b", fontSize: "15px" }}>
                          ★
                        </span>
                      ))}
                    </div>

                    {/* Quote */}
                    <p
                      className="mb-6 text-sm italic leading-relaxed"
                      style={{ color: "#2d3a52" }}
                    >
                      "{t.content}"
                    </p>

                    {/* Author row */}
                    <div
                      className="flex items-center gap-4 border-t pt-5"
                      style={{ borderColor: "rgba(26,45,90,0.15)" }}
                    >
                      <div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-white"
                        style={{ backgroundColor: avatarColors[i % avatarColors.length] }}
                      >
                        {t.avatar ? (
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>{t.name?.charAt(0) ?? "?"}</span>
                        )}
                      </div>
                      <div>
                        <p
                          className="font-display text-sm font-extrabold"
                          style={{ color: HERO_NAVY }}
                        >
                          {t.name}
                        </p>
                        <p className="text-xs" style={{ color: "#5a6e8a" }}>
                          {t.role}
                          {t.country
                            ? `, ${t.country}`
                            : t.company
                            ? ` at ${t.company}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA banner pair */}
            <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Ice-blue community card */}
              <div
                className="relative flex min-h-[260px] overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: "#dce9f9",
                  borderBottom: `4px solid ${HERO_NAVY}`,
                }}
              >
                <div className="relative z-10 flex flex-col justify-center p-10 md:w-3/5">
                  <h3
                    className="mb-4 font-display text-2xl font-extrabold leading-tight"
                    style={{ color: HERO_NAVY }}
                  >
                    Join Our Learner Community!
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed" style={{ color: "#4a5e7a" }}>
                    Connect, collaborate, share ideas, and exchange best practices —
                    the Community is your space to grow your skills and impact.
                  </p>
                  <Link to="/community">
                    <button
                      className="inline-flex w-fit items-center gap-2 rounded px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: HERO_GREEN }}
                    >
                      Explore the Community
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
                <div
                  className="absolute inset-y-0 right-0 w-2/5 opacity-25"
                  style={{
                    background: `linear-gradient(135deg, ${HERO_BLUE_BLOCK}, ${HERO_GREEN})`,
                  }}
                />
              </div>

              {/* Dark navy enrol card */}
              <div
                className="relative flex min-h-[260px] overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: HERO_NAVY,
                  borderBottom: `4px solid ${HERO_GREEN}`,
                }}
              >
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-10"
                  style={{ border: `48px solid ${HERO_GREEN}` }}
                />
                <div className="relative z-10 flex flex-col justify-center p-10">
                  <h3 className="mb-4 font-display text-2xl font-extrabold leading-tight text-white">
                    Ready to Start Your Cyber Career?
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-white/60">
                    Enrol today and earn globally recognised certifications designed
                    for Africa's growing digital economy.
                  </p>
                  <Link to="/auth">
                    <button
                      className="inline-flex w-fit items-center gap-2 rounded px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: HERO_GREEN }}
                    >
                      Get Started Now
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-24">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(135deg, ${HERO_BLUE_BLOCK}, ${HERO_GREEN})`,
          }}
        />
        <CyberGrid />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="mb-4 font-display text-3xl font-extrabold md:text-4xl">
            Ready to Defend the Digital World?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Join thousands of cybersecurity professionals trained by CDAA Academy.
            Start your journey today.
          </p>
          <Link to="/auth">
            <Button
              size="lg"
              className="px-10 text-base font-bold text-white hover:opacity-90"
              style={{ backgroundColor: HERO_GREEN, border: "none" }}
            >
              Start Learning Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

    </Layout>
  );
};

export default Index;
