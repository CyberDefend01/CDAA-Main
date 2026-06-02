// Design Snapshot
// Site DNA: Paystack × Linear × Vercel — vibrant light sky-blue SaaS
// Font Pairing: Bricolage Grotesque (display) + Geist (body/UI)
// Color Personality: White canvas + Electric Cobalt + bright Sky-blue, warm Amber spark
// The One Thing: Split hero with a live, self-animating course-dashboard mockup card
import { useEffect, useRef, useState, memo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Play, CheckCircle2, Star, Quote, Zap, ShieldCheck,
  Terminal, Cloud, Bug, Network, Fingerprint, Brain, Server,
  GraduationCap, UserPlus, Award, Sparkles, ArrowUpRight, Lock, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { Layout } from "@/components/layout/Layout";

/* ─────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as const;

const stats = [
  { end: 5200, suffix: "+", label: "Students Trained" },
  { end: 47,   suffix: "",  label: "Expert Courses" },
  { end: 93,   suffix: "%", label: "Completion Rate" },
  { end: 15,   suffix: "+", label: "Countries Reached" },
];

const trustPills = [
  "Hands-on virtual labs",
  "Industry certifications",
  "Expert mentors",
  "Career support",
];

const features = [
  { icon: Terminal,    title: "Penetration Testing", desc: "Find vulnerabilities before attackers do, using the same tools the pros use.", span: "lg", accent: "var(--cobalt)" },
  { icon: ShieldCheck, title: "Security Operations", desc: "Master SOC workflows, SIEM tooling and real-time threat monitoring.",          span: "md", accent: "var(--sky)" },
  { icon: Cloud,       title: "Cloud Security",      desc: "Secure AWS, Azure & GCP with hands-on IAM, encryption and compliance labs.",   span: "md", accent: "var(--cyan)" },
  { icon: Bug,         title: "Malware Analysis",    desc: "Reverse-engineer real samples to understand attacks.",                          span: "sm", accent: "var(--magenta)" },
  { icon: Network,     title: "Network Defence",     desc: "Firewalls, IDS/IPS and segmentation strategy.",                                 span: "sm", accent: "var(--indigo)" },
  { icon: Fingerprint, title: "Digital Forensics",   desc: "Recover evidence and document incidents.",                                      span: "sm", accent: "var(--amber)" },
  { icon: Brain,       title: "Threat Intelligence", desc: "Track TTPs with MITRE ATT&CK frameworks.",                                      span: "sm", accent: "var(--lime)" },
];

const steps = [
  { icon: UserPlus, title: "Enrol",            desc: "Create a free account and pick a learning path in minutes." },
  { icon: Terminal, title: "Learn with Labs",  desc: "Practise in real virtual environments with expert mentorship." },
  { icon: Award,    title: "Get Certified",    desc: "Earn industry-recognised certifications and land the role." },
];

const testimonials = [
  { name: "Amara Osei",       role: "SOC Analyst · Ghana",              quote: "CDAA transformed my career. Within 6 months I landed my first cybersecurity role at a top bank.",     avatar: "AO", grad: "from-blue-500 to-cyan-500" },
  { name: "Fatima Al-Hassan", role: "Penetration Tester · Nigeria",     quote: "The ethical hacking course is incredibly thorough. Real labs, real tools — not just theory.",        avatar: "FA", grad: "from-indigo-500 to-blue-600" },
  { name: "Kwame Asante",     role: "Cloud Security Engineer · Kenya",  quote: "From zero to certified in under a year. The community and mentorship here are unmatched in Africa.",  avatar: "KA", grad: "from-sky-500 to-cyan-600" },
];

/* ─────────────────────────────────────────────────────────────
   HERO DASHBOARD MOCKUP (self-animating, transform/opacity only)
   ───────────────────────────────────────────────────────────── */
const HeroDashboard = memo(function HeroDashboard() {
  const modules = [
    { name: "Network Fundamentals", done: true },
    { name: "Threat Detection",     done: true },
    { name: "Incident Response",    done: true },
    { name: "Live: SIEM Analysis",  done: false },
  ];
  return (
    <div className="relative animate-float-card">
      {/* glow behind card */}
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/25 via-sky-400/20 to-cyan-300/20 blur-2xl" />
      <div className="relative rounded-2xl border border-border/70 bg-card shadow-[0_24px_70px_-20px_hsl(222_89%_55%/0.35)] overflow-hidden">
        {/* window bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-secondary/50">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 font-mono-cyber text-xs text-muted-foreground tracking-wide">cdaa — soc-analyst-track</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="font-display font-bold text-base">SOC Analyst Track</p>
            <span className="text-xs font-semibold text-primary">67%</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">3 of 4 modules complete</p>

          {/* progress */}
          <div className="h-2 rounded-full bg-secondary overflow-hidden mb-5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400"
              initial={{ width: 0 }}
              whileInView={{ width: "67%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
            />
          </div>

          {/* module list */}
          <div className="space-y-2">
            {modules.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.06, ease: EASE }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                  m.done ? "bg-secondary/40" : "bg-primary/5 ring-1 ring-primary/20"
                }`}
              >
                {m.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <span className="live-dot w-2 h-2 rounded-full bg-primary shrink-0" />
                )}
                <span className={m.done ? "text-muted-foreground" : "font-semibold text-foreground"}>{m.name}</span>
                {!m.done && <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-primary">Now</span>}
              </motion.div>
            ))}
          </div>

          <button className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm h-11 transition-transform hover:scale-[1.02] active:scale-95">
            Continue Learning <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* floating mini-badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, ease: EASE }}
        className="absolute -left-6 bottom-10 hidden sm:flex items-center gap-2 rounded-xl bg-card border border-border/70 shadow-lg px-3 py-2"
      >
        <Award className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold">Certificate earned</span>
      </motion.div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────
   SECTION HEADER
   ───────────────────────────────────────────────────────────── */
function SectionHeader({ badge, title, accent, sub, center = false }: {
  badge: string; title: string; accent?: string; sub?: string; center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}`}>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
        <Sparkles className="w-3 h-3" /> {badge}
      </span>
      <h2 className="font-display font-extrabold text-fluid-3xl tracking-display text-balance leading-[1.08]">
        {title} {accent && <span className="text-primary">{accent}</span>}
      </h2>
      {sub && <p className="text-muted-foreground mt-4 text-fluid-base leading-relaxed text-pretty">{sub}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOW-IT-WORKS arrow that draws itself in view
   ───────────────────────────────────────────────────────────── */
function DrawArrow() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <svg ref={ref} width="80" height="24" viewBox="0 0 80 24" fill="none"
      className="hidden md:block shrink-0 text-primary/40">
      <path
        d="M2 12 H68 M60 5 L70 12 L60 19"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ ["--len" as string]: "120" }}
        className={inView ? "animate-draw" : ""}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <Layout>
      <div className="overflow-hidden">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative gradient-sky-hero -mt-20 pt-20">
          <div className="absolute inset-0 bg-grid-soft pointer-events-none" />
          <div className="container-custom relative z-10 pt-16 pb-20 lg:pt-24 lg:pb-28">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-10 items-center">

              {/* LEFT — copy */}
              <div className="text-left">
                <motion.div
                  initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border/70 shadow-sm mb-7"
                >
                  <span className="live-dot w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-semibold text-foreground">Africa's Premier Cybersecurity Academy</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
                  className="font-display font-extrabold text-fluid-5xl tracking-display leading-[1.02] text-balance"
                >
                  Defend the <span className="text-primary">Digital Frontier</span> of Africa
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
                  className="text-fluid-lg text-muted-foreground max-w-xl leading-relaxed mt-6 text-pretty"
                >
                  World-class cybersecurity training built for Africa's next generation of
                  security professionals. Hands-on labs, real mentorship, globally recognised
                  certifications.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-9"
                >
                  <Button size="lg" asChild className="h-12 px-7 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_12px_30px_-8px_hsl(222_89%_55%/0.5)] hover:scale-[1.02] active:scale-95 transition-transform">
                    <Link to="/auth">Start Learning Free <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="h-12 px-7 text-base font-semibold border-border bg-card/60 backdrop-blur hover:bg-card hover:scale-[1.02] active:scale-95 transition-transform">
                    <Link to="/courses"><Play className="w-4 h-4 mr-1 fill-current" /> Explore Courses</Link>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-9"
                >
                  {trustPills.map((p, i) => (
                    <motion.span
                      key={p}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.06 }}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {p}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              {/* RIGHT — dashboard */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                className="relative lg:pl-6"
              >
                <HeroDashboard />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR (dark inset strip) ─────────────────── */}
        <section className="relative">
          <div className="container-custom">
            <div className="relative -mt-2 rounded-3xl bg-[hsl(var(--ink))] text-white overflow-hidden shadow-[0_30px_80px_-30px_hsl(222_89%_30%/0.5)]">
              <div className="absolute inset-0 mesh-aurora opacity-60 pointer-events-none" />
              <div className="relative grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06, ease: EASE }}
                    className="px-6 py-8 text-center"
                  >
                    <p className="font-display font-extrabold text-4xl tracking-tight">
                      <AnimatedCounter end={s.end} suffix={s.suffix} duration={2} />
                    </p>
                    <p className="text-sm text-white/55 mt-1 font-medium">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PARTNERS ─────────────────────────────────────── */}
        <PartnersMarquee />

        {/* ── FEATURES (BENTO) ─────────────────────────────── */}
        <section className="section-padding">
          <div className="container-custom">
            <SectionHeader
              badge="Curriculum"
              title="Industry-Ready"
              accent="Cyber Skills"
              sub="Built by practitioners and aligned with globally recognised certifications including CEH, CompTIA Security+ and CISSP."
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[150px] gap-4">
              {features.map((f, i) => {
                const spanCls =
                  f.span === "lg" ? "col-span-2 row-span-2" :
                  f.span === "md" ? "col-span-2 lg:col-span-1 row-span-2" :
                  "col-span-1 row-span-1";
                const isLarge = f.span === "lg";
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.05, ease: EASE }}
                    className={`group relative ${spanCls} rounded-2xl border border-border bg-card p-5 overflow-hidden hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_hsl(222_60%_40%/0.3)] transition-all duration-300`}
                    style={{ ["--fa" as string]: `hsl(${f.accent})` }}
                  >
                    <div className="absolute top-0 left-5 right-5 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                      style={{ background: "var(--fa)" }} />
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: "color-mix(in oklab, var(--fa) 12%, transparent)", color: "var(--fa)" }}>
                      <f.icon className="w-5 h-5" />
                    </div>
                    <h3 className={`font-display font-bold mb-1.5 ${isLarge ? "text-xl" : "text-[15px]"}`}>{f.title}</h3>
                    <p className={`text-muted-foreground leading-relaxed ${isLarge ? "text-sm max-w-sm" : "text-[13px]"}`}>{f.desc}</p>
                    {isLarge && (
                      <div className="absolute bottom-5 left-5 right-5 rounded-xl bg-[hsl(var(--ink))] text-emerald-300 font-mono-cyber text-xs px-4 py-3 overflow-hidden">
                        <span className="text-white/40">$ </span>
                        <span className="inline-block overflow-hidden whitespace-nowrap align-bottom group-hover:animate-typewriter" style={{ maxWidth: "100%" }}>
                          nmap -sV --script vuln 10.0.0.0/24
                        </span>
                        <span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-0.5 align-middle animate-blink" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── LEARNING PATHWAYS (asymmetric, dark) ─────────── */}
        <section className="section-padding relative overflow-hidden bg-[hsl(var(--ink))] text-white">
          <div className="absolute inset-0 mesh-aurora opacity-40 pointer-events-none" />
          <div className="absolute inset-0 cyber-dots opacity-[0.15] pointer-events-none" />
          <div className="container-custom relative z-10">
            <div className="mb-12 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-300 mb-4">
                <Sparkles className="w-3 h-3" /> Your Path Forward
              </span>
              <h2 className="font-display font-extrabold text-fluid-3xl tracking-display leading-[1.08] text-balance">
                Two Ways to Build Your <span className="text-cyan-300">Career</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-5 gap-5">
              {/* Diploma — 3/5 */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ ease: EASE }}
                className="lg:col-span-3 relative rounded-2xl p-8 bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 overflow-hidden"
              >
                <span className="absolute top-6 right-6 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950">
                  Most Popular
                </span>
                <div className="w-12 h-12 rounded-2xl bg-amber-400/15 flex items-center justify-center mb-5">
                  <GraduationCap className="w-6 h-6 text-amber-300" />
                </div>
                <h3 className="font-display font-extrabold text-2xl mb-1">Professional Diploma</h3>
                <p className="text-cyan-300/80 text-sm font-medium mb-5">18 months · Beginner to Advanced</p>
                <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-md">
                  Our flagship programme. A structured, phased journey that transforms beginners
                  into industry-ready cybersecurity professionals.
                </p>
                <ul className="grid sm:grid-cols-2 gap-2.5 mb-8">
                  {["6 core modules", "Live mentorship", "Industry projects", "Job placement support"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="h-11 px-6 font-bold bg-amber-400 hover:bg-amber-300 text-amber-950 hover:scale-[1.02] active:scale-95 transition-transform">
                  <Link to="/courses#diploma">Explore the Diploma <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </motion.div>

              {/* Certifications — 2/5 */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.08, ease: EASE }}
                className="lg:col-span-2 relative rounded-2xl p-8 bg-white/[0.04] border border-white/10 overflow-hidden flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-5">
                  <Award className="w-6 h-6 text-cyan-300" />
                </div>
                <h3 className="font-display font-extrabold text-2xl mb-1">Certifications</h3>
                <p className="text-cyan-300/80 text-sm font-medium mb-5">3–6 months each · Flexible</p>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Targeted tracks aligned with CEH, CompTIA Security+ and CISSP — learn at your own pace.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {["Self-paced modules", "Exam preparation", "Practice labs"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                      <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-auto h-11 px-6 font-semibold bg-transparent border-white/25 text-white hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-transform">
                  <Link to="/courses#certifications">Browse Certifications <ArrowUpRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────── */}
        <section className="section-padding">
          <div className="container-custom">
            <SectionHeader center badge="How It Works" title="From Curious to" accent="Certified" sub="Three simple steps to launch your cybersecurity career." />
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-6 md:gap-2">
              {steps.map((s, i) => (
                <div key={s.title} className="contents">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.12, ease: EASE }}
                    className="relative flex-1 max-w-xs mx-auto rounded-2xl border border-border bg-card p-7 text-center"
                  >
                    <span className="absolute top-4 right-5 font-display font-extrabold text-5xl text-primary/10 select-none">{i + 1}</span>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                      <s.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </motion.div>
                  {i < steps.length - 1 && <DrawArrow />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────── */}
        <section className="section-padding bg-surface/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-soft opacity-50 pointer-events-none" />
          <div className="container-custom relative z-10">
            <SectionHeader center badge="Student Stories" title="Real Results," accent="Real Careers" />
            <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08, ease: EASE }}
                  className="relative rounded-2xl bg-card border border-border border-l-[3px] border-l-primary p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_hsl(222_60%_40%/0.25)] transition-all duration-300"
                >
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-primary/20" />
                  <p className="text-sm text-foreground/80 leading-relaxed flex-1">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-1">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
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

        {/* ── FINAL CTA ────────────────────────────────────── */}
        <section className="section-padding-sm">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ ease: EASE }}
              className="relative rounded-3xl overflow-hidden bg-[hsl(var(--ink))] text-white px-8 py-14 md:px-16 md:py-20 text-center"
            >
              <div className="absolute inset-0 mesh-aurora opacity-60 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[300px] rounded-full bg-primary/30 blur-[100px] pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-300 mb-6">
                  <Zap className="w-3 h-3" /> Join 5,200+ Students
                </span>
                <h2 className="font-display font-extrabold text-fluid-4xl tracking-display leading-[1.05] text-balance mb-5">
                  Start Your <span className="text-amber-300">Cybersecurity Career</span> Today
                </h2>
                <p className="text-white/60 text-fluid-base max-w-xl mx-auto mb-9 text-pretty">
                  Join thousands of African professionals securing the continent's digital future.
                  Free to start — enrol in your first course today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                  <Button size="lg" asChild className="h-12 px-8 font-bold bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-[1.02] active:scale-95 transition-transform">
                    <Link to="/auth">Create Free Account <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="h-12 px-8 font-semibold bg-transparent border-white/25 text-white hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-transform">
                    <Link to="/courses">Browse All Courses</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/55">
                  <span className="inline-flex items-center gap-1.5"><Lock className="w-4 h-4 text-cyan-300" /> No credit card required</span>
                  <span className="inline-flex items-center gap-1.5"><Zap className="w-4 h-4 text-cyan-300" /> Instant access</span>
                  <span className="inline-flex items-center gap-1.5"><Globe className="w-4 h-4 text-cyan-300" /> Pan-African community</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
