// Design Snapshot v2
// Site DNA: Paystack × Linear × Vercel — vibrant sky-blue SaaS, Afro-futurist confidence
// Font Pairing: Bricolage Grotesque (display) + Geist (body/UI)
// Color Personality: Deep navy hero + White canvas + Electric Cobalt + Sky-blue + Amber spark
// The One Thing: Dark cinematic hero with shield visual + light airy content sections
import { useRef, memo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Play, CheckCircle2, Star, Quote, Zap, ShieldCheck,
  Terminal, Cloud, Bug, Network, Fingerprint, Brain,
  GraduationCap, UserPlus, Award, Sparkles, ArrowUpRight, Lock, Globe,
  Clock, BookOpen, CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { Layout } from "@/components/layout/Layout";
import { blogPosts } from "@/data/blog";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── DATA ────────────────────────────────────────────────── */
const stats = [
  { end: 5200, suffix: "+", label: "Students Trained" },
  { end: 47,   suffix: "",  label: "Expert Courses" },
  { end: 93,   suffix: "%", label: "Completion Rate" },
  { end: 15,   suffix: "+", label: "Countries Reached" },
];

const features = [
  { icon: Terminal,    title: "Penetration Testing", desc: "Find vulnerabilities before attackers do, using the same tools the pros use.", span: "lg", accent: "222 89% 55%" },
  { icon: ShieldCheck, title: "Security Operations", desc: "Master SOC workflows, SIEM tooling and real-time threat monitoring.",          span: "md", accent: "204 94% 60%" },
  { icon: Cloud,       title: "Cloud Security",      desc: "Secure AWS, Azure & GCP with hands-on IAM, encryption and compliance labs.",   span: "md", accent: "199 92% 52%" },
  { icon: Bug,         title: "Malware Analysis",    desc: "Reverse-engineer real samples to understand attacks.",                          span: "sm", accent: "330 80% 60%" },
  { icon: Network,     title: "Network Defence",     desc: "Firewalls, IDS/IPS and segmentation strategy.",                                 span: "sm", accent: "243 75% 59%" },
  { icon: Fingerprint, title: "Digital Forensics",   desc: "Recover evidence and document incidents.",                                      span: "sm", accent: "38 95% 56%" },
  { icon: Brain,       title: "Threat Intelligence", desc: "Track TTPs with MITRE ATT&CK frameworks.",                                      span: "sm", accent: "152 70% 44%" },
];

const steps = [
  { icon: UserPlus, num: "01", title: "Create Your Account", desc: "Sign up in under a minute. No credit card, no commitment — just your email and you're in." },
  { icon: Terminal, num: "02", title: "Learn with Real Labs", desc: "Practise in live virtual environments with expert-led sessions, not just video lectures." },
  { icon: Award,    num: "03", title: "Get Certified",        desc: "Earn globally recognised certifications and get career placement support across Africa." },
];

const testimonials = [
  {
    name: "Amara Osei", role: "SOC Analyst", company: "Stanbic Bank", country: "Ghana",
    quote: "CDAA transformed my career. Within 6 months of completing the SOC analyst track, I landed my first cybersecurity role at one of Ghana's top banks. The hands-on labs made all the difference.",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Fatima Al-Hassan", role: "Penetration Tester", company: "CyberForge", country: "Nigeria",
    quote: "The ethical hacking course is incredibly thorough. Real labs, real tools, real scenarios — not just theory slides. I went from IT support to pentesting in under a year.",
    photo: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Kwame Asante", role: "Cloud Security Engineer", company: "Safaricom", country: "Kenya",
    quote: "From zero cybersecurity experience to AWS Security certified in 10 months. The community and mentorship here are unmatched anywhere on the continent.",
    photo: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&h=200&fit=crop&crop=face",
  },
];

/* ─── HERO SHIELD VISUAL ──────────────────────────────────── */
const HeroShield = memo(function HeroShield() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <div className="absolute w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full border border-cyan-400/20" />
      <div className="absolute w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full border border-cyan-400/10" />
      <div className="absolute w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full bg-cyan-400/[0.04] animate-pulse" style={{ animationDuration: "4s" }} />

      {/* Shield SVG */}
      <motion.svg
        viewBox="0 0 200 240" className="w-48 h-56 md:w-56 md:h-64 relative z-10"
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(222 89% 55%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(199 92% 52%)" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path
          d="M100 10 L180 50 L180 120 C180 170 145 210 100 230 C55 210 20 170 20 120 L20 50 Z"
          fill="url(#shieldGrad)" stroke="hsl(199 92% 65%)" strokeWidth="1.5" opacity="0.3"
        />
        <path
          d="M100 30 L165 62 L165 118 C165 158 137 193 100 210 C63 193 35 158 35 118 L35 62 Z"
          fill="none" stroke="hsl(199 92% 60%)" strokeWidth="1" opacity="0.5"
        />
        {/* Lock icon inside shield */}
        <rect x="80" y="95" width="40" height="32" rx="4" fill="none" stroke="hsl(0 0% 100%)" strokeWidth="2.5" opacity="0.8" />
        <path d="M88 95 V82 A12 12 0 0 1 112 82 V95" fill="none" stroke="hsl(0 0% 100%)" strokeWidth="2.5" opacity="0.8" />
        <circle cx="100" cy="112" r="4" fill="white" opacity="0.9" />
      </motion.svg>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, ease: EASE }}
        className="absolute -left-4 top-1/4 flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-2"
      >
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-semibold text-white/80">CEH Certified</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.0, ease: EASE }}
        className="absolute -right-4 bottom-1/4 flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-2"
      >
        <Award className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-semibold text-white/80">47 Courses</span>
      </motion.div>
    </div>
  );
});

/* ─── SECTION HEADER ──────────────────────────────────────── */
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

/* ─── PAGE ────────────────────────────────────────────────── */
export default function Home() {
  const latestNews = blogPosts.slice(0, 3);

  return (
    <Layout>
      <div className="overflow-hidden">

        {/* ── HERO (dark cinematic) ────────────────────────── */}
        <section className="relative -mt-20 pt-20 bg-[hsl(224,32%,7%)] overflow-hidden">
          {/* Ambient effects */}
          <div className="absolute inset-0 bg-grid-soft opacity-30 pointer-events-none" style={{ filter: "invert(1)", opacity: 0.06 }} />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[hsl(222,89%,55%/0.12)] rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-[hsl(199,92%,52%/0.08)] rounded-full blur-[100px] pointer-events-none" />

          <div className="container-custom relative z-10 pt-16 pb-20 lg:pt-20 lg:pb-28">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-8 items-center">

              {/* LEFT — copy */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 mb-7"
                >
                  <span className="live-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-white/70">Africa's Premier Cybersecurity Academy</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
                  className="font-display font-extrabold text-fluid-5xl tracking-display leading-[1.02] text-balance text-white"
                >
                  Defend the{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(199,92%,62%)] to-[hsl(222,89%,68%)]">
                    Digital Frontier
                  </span>
                  <br />of Africa
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
                  className="text-fluid-lg text-white/50 max-w-xl leading-relaxed mt-6 text-pretty"
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
                  <Button size="lg" asChild className="h-12 px-7 text-base font-bold bg-[hsl(222,89%,55%)] hover:bg-[hsl(222,89%,60%)] text-white hover:scale-[1.02] active:scale-95 transition-all duration-200">
                    <Link to="/auth">Start Learning Free <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="h-12 px-7 text-base font-semibold border-white/20 text-white bg-transparent hover:bg-white/5 hover:scale-[1.02] active:scale-95 transition-all duration-200">
                    <Link to="/courses"><Play className="w-4 h-4 mr-1 fill-current" /> Explore Courses</Link>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-9"
                >
                  {["Hands-on virtual labs", "Industry certifications", "Expert mentors", "Career support"].map((p, i) => (
                    <motion.span
                      key={p}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.06 }}
                      className="inline-flex items-center gap-1.5 text-sm text-white/40 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> {p}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              {/* RIGHT — shield visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                className="hidden lg:flex items-center justify-center"
              >
                <HeroShield />
              </motion.div>
            </div>
          </div>

          {/* Bottom gradient fade to white */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* ── STATS BAR ────────────────────────────────────── */}
        <section className="relative -mt-8 z-20">
          <div className="container-custom">
            <div className="rounded-2xl bg-card border border-border shadow-[0_20px_60px_-20px_hsl(222_60%_40%/0.15)] overflow-hidden">
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06, ease: EASE }}
                    className="px-6 py-7 text-center"
                  >
                    <p className="font-display font-extrabold text-3xl tracking-tight text-primary">
                      <AnimatedCounter end={s.end} suffix={s.suffix} duration={2} />
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">{s.label}</p>
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
                    className={`group relative ${spanCls} rounded-2xl border border-border bg-card p-5 overflow-hidden hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_hsl(222_60%_40%/0.2)] transition-all duration-300`}
                  >
                    <div className="absolute top-0 left-5 right-5 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                      style={{ background: `hsl(${f.accent})` }} />
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `hsl(${f.accent} / 0.1)`, color: `hsl(${f.accent})` }}>
                      <f.icon className="w-5 h-5" />
                    </div>
                    <h3 className={`font-display font-bold mb-1.5 ${isLarge ? "text-xl" : "text-[15px]"}`}>{f.title}</h3>
                    <p className={`text-muted-foreground leading-relaxed ${isLarge ? "text-sm max-w-sm" : "text-[13px]"}`}>{f.desc}</p>
                    {isLarge && (
                      <div className="absolute bottom-5 left-5 right-5 rounded-xl bg-[hsl(224,32%,9%)] text-emerald-300 font-mono-cyber text-xs px-4 py-3 overflow-hidden">
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

        {/* ── LEARNING PATHWAYS ─────────────────────────────── */}
        <section className="section-padding relative overflow-hidden bg-[hsl(224,32%,7%)] text-white">
          <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-[hsl(222,89%,55%/0.1)] rounded-full blur-[120px] pointer-events-none" />
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
                className="lg:col-span-3 relative rounded-2xl p-8 bg-white/[0.05] border border-white/10 overflow-hidden"
              >
                <span className="absolute top-6 right-6 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950">
                  Most Popular
                </span>
                <div className="w-12 h-12 rounded-2xl bg-amber-400/15 flex items-center justify-center mb-5">
                  <GraduationCap className="w-6 h-6 text-amber-300" />
                </div>
                <h3 className="font-display font-extrabold text-2xl mb-1">Professional Diploma</h3>
                <p className="text-cyan-300/80 text-sm font-medium mb-5">18 months · Beginner to Advanced</p>
                <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-md">
                  Our flagship programme. A structured, phased journey that transforms beginners
                  into industry-ready cybersecurity professionals.
                </p>
                <ul className="grid sm:grid-cols-2 gap-2.5 mb-8">
                  {["6 core modules", "Live mentorship", "Industry projects", "Job placement support"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                      <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="h-11 px-6 font-bold bg-amber-400 hover:bg-amber-300 text-amber-950 hover:scale-[1.02] active:scale-95 transition-all">
                  <Link to="/courses#diploma">Explore the Diploma <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </motion.div>

              {/* Certifications — 2/5 */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.08, ease: EASE }}
                className="lg:col-span-2 relative rounded-2xl p-8 bg-white/[0.03] border border-white/10 flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-400/15 flex items-center justify-center mb-5">
                  <Award className="w-6 h-6 text-cyan-300" />
                </div>
                <h3 className="font-display font-extrabold text-2xl mb-1">Certifications</h3>
                <p className="text-cyan-300/80 text-sm font-medium mb-5">3–6 months each · Flexible</p>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  Targeted tracks aligned with CEH, CompTIA Security+ and CISSP — learn at your own pace.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {["Self-paced modules", "Exam preparation", "Practice labs"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                      <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-auto h-11 px-6 font-semibold bg-transparent border-white/20 text-white hover:bg-white/5 hover:scale-[1.02] active:scale-95 transition-all">
                  <Link to="/courses#certifications">Browse Certifications <ArrowUpRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS (dark card style) ────────────────── */}
        <section className="section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ ease: EASE }}
              className="relative rounded-3xl overflow-hidden bg-[hsl(224,32%,7%)] text-white px-6 py-14 md:px-12 lg:px-16 md:py-16"
            >
              <div className="absolute top-0 right-1/4 w-[500px] h-[250px] bg-[hsl(222,89%,55%/0.1)] rounded-full blur-[100px] pointer-events-none" />
              <div className="relative z-10">
                <div className="text-center mb-12">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-300 mb-4">
                    <Sparkles className="w-3 h-3" /> How It Works
                  </span>
                  <h2 className="font-display font-extrabold text-fluid-3xl tracking-display leading-[1.08]">
                    From Curious to <span className="text-cyan-300">Certified</span>
                  </h2>
                  <p className="text-white/45 mt-3 text-fluid-base max-w-lg mx-auto">Three simple steps to launch your cybersecurity career.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {steps.map((s, i) => (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.1, ease: EASE }}
                      className="relative rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 text-center group hover:bg-white/[0.06] transition-colors duration-300"
                    >
                      <span className="absolute top-3 right-4 font-display font-extrabold text-4xl text-white/[0.06] select-none">{s.num}</span>
                      <div className="w-14 h-14 rounded-2xl bg-[hsl(222,89%,55%/0.15)] text-cyan-300 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                        <s.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
                      <p className="text-sm text-white/45 leading-relaxed">{s.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────── */}
        <section className="section-padding bg-surface/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-soft opacity-40 pointer-events-none" />
          <div className="container-custom relative z-10">
            <SectionHeader center badge="Student Stories" title="Real Results," accent="Real Careers" sub="Hear from graduates who launched cybersecurity careers across Africa." />
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08, ease: EASE }}
                  className="relative rounded-2xl bg-card border border-border p-7 flex flex-col gap-5 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_hsl(222_60%_40%/0.15)] transition-all duration-300"
                >
                  {/* Header: photo + info */}
                  <div className="flex items-center gap-3.5">
                    <img
                      src={t.photo} alt={t.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
                    />
                    <div>
                      <p className="font-display font-bold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                      <p className="text-xs text-muted-foreground">{t.country}</p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-foreground/75 leading-relaxed flex-1">"{t.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LATEST NEWS ──────────────────────────────────── */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-12">
              <SectionHeader badge="Latest News" title="Insights &" accent="Updates" sub="Stay ahead with the latest cybersecurity trends, career advice, and academy news." />
              <Link to="/blog" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline shrink-0 mb-12">
                View all articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {latestNews.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08, ease: EASE }}
                >
                  <Link to={`/blog/${post.slug}`} className="group block rounded-2xl border border-border bg-card overflow-hidden hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_hsl(222_60%_40%/0.15)] transition-all duration-300">
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                      {post.thumbnail && (
                        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-primary/90 text-white text-[11px] font-bold uppercase tracking-wider">
                        {post.category.replace("-", " ")}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="inline-flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {post.publishedAt}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      </div>
                      <h3 className="font-display font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary">
                        Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <Link to="/blog" className="sm:hidden flex items-center justify-center gap-1.5 mt-8 text-sm font-semibold text-primary">
              View all articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────── */}
        <section className="section-padding-sm">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ ease: EASE }}
              className="relative rounded-3xl overflow-hidden bg-[hsl(224,32%,7%)] text-white px-8 py-14 md:px-16 md:py-20 text-center"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[300px] rounded-full bg-[hsl(222,89%,55%/0.15)] blur-[100px] pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-300 mb-6">
                  <Zap className="w-3 h-3" /> Join 5,200+ Students
                </span>
                <h2 className="font-display font-extrabold text-fluid-4xl tracking-display leading-[1.05] text-balance mb-5">
                  Start Your <span className="text-amber-300">Cybersecurity Career</span> Today
                </h2>
                <p className="text-white/50 text-fluid-base max-w-xl mx-auto mb-9 text-pretty">
                  Join thousands of African professionals securing the continent's digital future.
                  Free to start — enrol in your first course today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                  <Button size="lg" asChild className="h-12 px-8 font-bold bg-[hsl(222,89%,55%)] hover:bg-[hsl(222,89%,60%)] text-white hover:scale-[1.02] active:scale-95 transition-all duration-200">
                    <Link to="/auth">Create Free Account <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="h-12 px-8 font-semibold bg-transparent border-white/20 text-white hover:bg-white/5 hover:scale-[1.02] active:scale-95 transition-all duration-200">
                    <Link to="/courses">Browse All Courses</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/40">
                  <span className="inline-flex items-center gap-1.5"><Lock className="w-4 h-4 text-cyan-400" /> No credit card required</span>
                  <span className="inline-flex items-center gap-1.5"><Zap className="w-4 h-4 text-cyan-400" /> Instant access</span>
                  <span className="inline-flex items-center gap-1.5"><Globe className="w-4 h-4 text-cyan-400" /> Pan-African community</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
