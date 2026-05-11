import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, Star, Quote, Zap, BookOpen, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { FeatureCards } from "@/components/home/FeatureCards";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { CyberGrid } from "@/components/ui/CyberGrid";
import { Layout } from "@/components/layout/Layout";
import logo from "@/assets/logo.png";

const stats = [
  { end: 5000,  suffix: "+", label: "Students Trained",    icon: BookOpen },
  { end: 50,    suffix: "+", label: "Expert Courses",       icon: Award },
  { end: 95,    suffix: "%", label: "Completion Rate",      icon: TrendingUp },
  { end: 30,    suffix: "+", label: "Certifications",       icon: Zap },
];

const highlights = [
  "Hands-on virtual labs",
  "Industry-recognized certifications",
  "Expert-led live sessions",
  "Career placement support",
];

const testimonials = [
  {
    name: "Amara Osei",
    role: "SOC Analyst · Ghana",
    quote: "CDAA transformed my career. Within 6 months I landed my first cybersecurity role at a top bank.",
    rating: 5,
    avatar: "AO",
    color: "from-cyan-500 to-blue-600",
  },
  {
    name: "Fatima Al-Hassan",
    role: "Penetration Tester · Nigeria",
    quote: "The ethical hacking course is incredibly thorough. Real labs, real tools — not just theory. Worth every naira.",
    rating: 5,
    avatar: "FA",
    color: "from-purple-500 to-pink-600",
  },
  {
    name: "Kwame Asante",
    role: "Cloud Security Engineer · Kenya",
    quote: "From zero to certified in under a year. The community and mentorship here are unmatched in Africa.",
    rating: 5,
    avatar: "KA",
    color: "from-emerald-500 to-teal-600",
  },
];

const pathways = [
  {
    title: "Diploma Programme",
    duration: "18 months",
    tag: "Most Popular",
    tagColor: "badge-neon",
    description: "Comprehensive professional diploma covering the full spectrum of cybersecurity disciplines.",
    features: ["6 core modules", "Live mentorship", "Industry projects", "Job placement"],
    cta: "/courses#diploma",
    accentClass: "from-primary/20 to-cyan/10",
    borderClass: "hover:border-cyan/30",
  },
  {
    title: "Professional Certifications",
    duration: "3–6 months each",
    tag: "Flexible",
    tagColor: "badge-cyber",
    description: "Targeted certification tracks aligned with CEH, CompTIA Security+, CISSP and more.",
    features: ["Self-paced modules", "Exam prep", "Practice labs", "Certificate on completion"],
    cta: "/courses#certifications",
    accentClass: "from-accent/15 to-magenta/5",
    borderClass: "hover:border-accent/30",
  },
];

export default function Home() {
  return (
    <Layout>
    <div className="overflow-hidden">

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center gradient-dark-hero -mt-20">
        <CyberGrid />

        {/* Ambient orbs */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] ambient-blob ambient-blob-cyan opacity-25 pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] ambient-blob ambient-blob-magenta opacity-15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] ambient-blob ambient-blob-blue opacity-10 pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 container-custom pt-24 pb-16 lg:pt-32 lg:pb-24">
          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <span className="badge-neon">
                <Zap className="w-3 h-3" />
                Africa's Premier Cybersecurity Academy
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-extrabold text-fluid-5xl text-white tracking-display text-balance leading-[1.05] mb-6"
            >
              Defend the{" "}
              <span className="gradient-text-neon text-glow-cyan">Digital Frontier</span>
              {" "}of Africa
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-fluid-lg text-white/60 max-w-2xl mx-auto leading-relaxed mb-10 text-pretty"
            >
              World-class cybersecurity education built for Africa's next generation of security professionals.
              Hands-on labs, real mentorship, globally recognised certifications.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="btn-cyber h-12 px-8 text-base font-bold text-white shadow-neon-cyan gap-2"
                  asChild
                >
                  <Link to="/auth">
                    Start Learning Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="ghost"
                  className="btn-ghost-neon h-12 px-8 text-base font-semibold gap-2"
                  asChild
                >
                  <Link to="/courses">
                    <Play className="w-4 h-4 fill-current" />
                    Explore Courses
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Highlights checklist */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
            >
              {highlights.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.1 }}
                  className="flex items-center gap-2 text-white/55 text-sm font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-dark rounded-2xl p-5 text-center border border-white/10"
              >
                <div className="flex justify-center mb-2">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
                <p className="font-display font-extrabold text-2xl text-white">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} duration={2.2} />
                </p>
                <p className="text-xs text-white/45 font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ── PARTNERS ─────────────────────────────────────────── */}
      <PartnersMarquee />

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <FeatureCards />

      {/* ── LEARNING PATHWAYS ────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden bg-surface/40">
        <div className="absolute inset-0 cyber-dots opacity-30 pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="badge-cyber mb-4 inline-flex"
            >
              Learning Pathways
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-extrabold text-fluid-3xl tracking-display mb-4 text-balance"
            >
              Choose Your <span className="gradient-text">Learning Path</span>
            </motion.h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-fluid-base">
              Whether you're starting from scratch or advancing your career, we have a structured programme for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {pathways.map((path, i) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`card-neon p-8 ${path.borderClass} transition-all duration-300 group`}
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${path.accentClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <span className={`${path.tagColor} mb-3 inline-flex text-xs`}>{path.tag}</span>
                      <h3 className="font-display font-bold text-xl">{path.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{path.duration}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{path.description}</p>
                  <ul className="space-y-2 mb-7">
                    {path.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="btn-cyber w-full text-white font-semibold"
                    asChild
                  >
                    <Link to={path.cta}>Explore Programme <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="badge-success mb-4 inline-flex"
            >
              Student Stories
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-extrabold text-fluid-3xl tracking-display mb-4 text-balance"
            >
              Real Results, <span className="gradient-text">Real Careers</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-neon p-6 flex flex-col gap-5"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-7 h-7 text-primary/30" />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="section-padding-sm relative overflow-hidden">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden gradient-dark-hero border border-white/10 p-12 md:p-16 text-center"
          >
            <CyberGrid />
            <div className="absolute top-0 left-1/2 w-[600px] h-[300px] -translate-x-1/2 -translate-y-1/2 ambient-blob ambient-blob-cyan opacity-20 pointer-events-none" />

            <div className="relative z-10">
              <span className="badge-neon mb-6 inline-flex">
                <Zap className="w-3 h-3" />
                Join 5,000+ Students
              </span>
              <h2 className="font-display font-extrabold text-fluid-4xl text-white tracking-display mb-5 text-balance">
                Start Your Cybersecurity
                <br />
                <span className="gradient-text-neon text-glow-cyan">Career Today</span>
              </h2>
              <p className="text-white/55 text-fluid-base max-w-xl mx-auto mb-10 text-pretty">
                Join thousands of African professionals securing the continent's digital future.
                Free to start — enrol in your first course today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="btn-cyber h-12 px-10 text-base font-bold text-white shadow-neon-cyan gap-2"
                    asChild
                  >
                    <Link to="/auth">
                      Create Free Account
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </motion.div>
                <Button
                  size="lg"
                  variant="ghost"
                  className="btn-ghost-neon h-12 px-8 text-base"
                  asChild
                >
                  <Link to="/courses">Browse All Courses</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
    </Layout>
  );
}
