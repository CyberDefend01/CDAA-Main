// Design Snapshot v3
// Site DNA: Premium Afro-futurist SaaS — claymorphism + liquid glass, balanced & professional
// Font Pairing: Bricolage Grotesque (display) + Geist (body/UI)
// Aesthetic: Soft tactile clay surfaces + translucent liquid-glass floating elements
// The One Thing: Dark cinematic hero with a liquid-glass dashboard floating over clay depth
import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Play, CheckCircle2, Star, Zap, ShieldCheck,
  Terminal, Cloud, Bug, Network, Fingerprint, Brain,
  GraduationCap, UserPlus, Award, Sparkles, Lock, Globe,
  Clock, CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { Layout } from "@/components/layout/Layout";
import { blogPosts } from "@/data/blog";

const EASE = [0.32, 0.72, 0, 1] as const;

const stats = [
  { end: 5200, suffix: "+", label: "Students Trained" },
  { end: 47,   suffix: "",  label: "Expert Courses" },
  { end: 93,   suffix: "%", label: "Completion Rate" },
  { end: 15,   suffix: "+", label: "Countries Reached" },
];

const features = [
  { icon: Terminal,    title: "Penetration Testing", desc: "Find vulnerabilities before attackers do, using the same tools the pros use.", span: "lg", accent: "222 89% 55%" },
  { icon: ShieldCheck, title: "Security Operations", desc: "Master SOC workflows, SIEM tooling and real-time threat monitoring.",          span: "md", accent: "204 94% 55%" },
  { icon: Cloud,       title: "Cloud Security",      desc: "Secure AWS, Azure & GCP with hands-on IAM and compliance labs.",              span: "md", accent: "199 92% 50%" },
  { icon: Bug,         title: "Malware Analysis",    desc: "Reverse-engineer real samples to understand attacks.",                          span: "sm", accent: "330 80% 58%" },
  { icon: Network,     title: "Network Defence",     desc: "Firewalls, IDS/IPS and segmentation strategy.",                                 span: "sm", accent: "243 75% 60%" },
  { icon: Fingerprint, title: "Digital Forensics",   desc: "Recover evidence and document incidents.",                                      span: "sm", accent: "38 92% 52%" },
  { icon: Brain,       title: "Threat Intelligence", desc: "Track TTPs with MITRE ATT&CK frameworks.",                                      span: "sm", accent: "152 65% 42%" },
];

const steps = [
  { icon: UserPlus, num: "01", title: "Create Your Account", desc: "Sign up in under a minute. No credit card, no commitment — just your email." },
  { icon: Terminal, num: "02", title: "Learn with Real Labs", desc: "Practise in live virtual environments with expert-led mentorship." },
  { icon: Award,    num: "03", title: "Get Certified",        desc: "Earn globally recognised certifications and career placement support." },
];

const testimonials = [
  { name: "Amara Osei", role: "SOC Analyst", company: "Stanbic Bank", country: "Ghana",
    quote: "CDAA transformed my career. Within 6 months I landed my first cybersecurity role at one of Ghana's top banks. The hands-on labs made all the difference.",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face" },
  { name: "Fatima Al-Hassan", role: "Penetration Tester", company: "CyberForge", country: "Nigeria",
    quote: "The ethical hacking course is incredibly thorough. Real labs, real tools — not just theory. I went from IT support to pentesting in under a year.",
    photo: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&h=200&fit=crop&crop=face" },
  { name: "Kwame Asante", role: "Cloud Security Engineer", company: "Safaricom", country: "Kenya",
    quote: "From zero to AWS Security certified in 10 months. The community and mentorship here are unmatched anywhere on the continent.",
    photo: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&h=200&fit=crop&crop=face" },
];

/* ─── HERO LIQUID-GLASS DASHBOARD ─────────────────────────── */
const HeroGlass = memo(function HeroGlass() {
  const modules = [
    { name: "Network Fundamentals", done: true },
    { name: "Threat Detection",     done: true },
    { name: "Incident Response",    done: true },
    { name: "Live: SIEM Analysis",  done: false },
  ];
  return (
    <div className="relative">
      {/* clay glow base */}
      <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-tr from-primary/30 via-sky-400/20 to-cyan-300/20 blur-3xl" />
      {/* liquid glass panel */}
      <div className="relative liquid-glass-dark glass-sheen r-squircle p-5 animate-float-card">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 font-mono-cyber text-xs text-white/40 tracking-wide">soc-analyst-track</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live
          </span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <p className="font-display font-bold text-base text-white">SOC Analyst Track</p>
          <span className="text-xs font-semibold text-cyan-300">67%</span>
        </div>
        <p className="text-xs text-white/40 mb-4">3 of 4 modules complete</p>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-5">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400"
            initial={{ width: 0 }} whileInView={{ width: "67%" }} viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.3 }} />
        </div>
        <div className="space-y-2">
          {modules.map((m, i) => (
            <motion.div key={m.name}
              initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.06, ease: EASE }}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${m.done ? "bg-white/[0.04]" : "bg-primary/15 ring-1 ring-primary/30"}`}>
              {m.done ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                : <span className="live-dot w-2 h-2 rounded-full bg-cyan-300 shrink-0" />}
              <span className={m.done ? "text-white/50" : "font-semibold text-white"}>{m.name}</span>
              {!m.done && <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-cyan-300">Now</span>}
            </motion.div>
          ))}
        </div>
        <button className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl clay-accent text-white font-semibold text-sm h-11 transition-transform duration-300 hover:scale-[1.02] active:scale-95">
          Continue Learning <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {/* floating clay badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.9, ease: EASE }}
        className="absolute -left-5 bottom-12 hidden sm:flex items-center gap-2 clay-sm bg-white px-3 py-2">
        <Award className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-semibold text-foreground">Certificate earned</span>
      </motion.div>
    </div>
  );
});

/* ─── SECTION HEADER ──────────────────────────────────────── */
function SectionHeader({ badge, title, accent, sub, center = false }: {
  badge: string; title: string; accent?: string; sub?: string; center?: boolean;
}) {
  return (
    <div className={`mb-14 ${center ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}`}>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.15em] bg-primary/10 text-primary mb-5">
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

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative -mt-20 pt-20 bg-[hsl(224,32%,7%)] overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[420px] bg-[hsl(222,89%,55%/0.14)] rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-[hsl(199,92%,52%/0.08)] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-[hsl(243,75%,60%/0.08)] rounded-full blur-[90px] pointer-events-none" />

          <div className="container-custom relative z-10 pt-16 pb-24 lg:pt-20 lg:pb-32">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-10 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-dark mb-7">
                  <span className="live-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-white/70">Africa's Premier Cybersecurity Academy</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 22, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
                  className="font-display font-extrabold text-fluid-5xl tracking-display leading-[1.02] text-balance text-white">
                  Defend the{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(199,92%,62%)] to-[hsl(222,89%,68%)]">Digital Frontier</span>
                  <br />of Africa
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
                  className="text-fluid-lg text-white/50 max-w-xl leading-relaxed mt-6 text-pretty">
                  World-class cybersecurity training built for Africa's next generation of
                  security professionals. Hands-on labs, real mentorship, globally recognised certifications.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-9">
                  <Button size="lg" asChild className="group h-13 px-2 pl-7 pr-2 text-base font-bold rounded-full clay-accent text-white border-0 hover:scale-[1.02] active:scale-95 transition-transform duration-300">
                    <Link to="/auth" className="flex items-center gap-3">
                      Start Learning Free
                      <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="h-13 px-7 text-base font-semibold rounded-full border-white/20 text-white bg-white/[0.04] hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all duration-300">
                    <Link to="/courses"><Play className="w-4 h-4 mr-1.5 fill-current" /> Explore Courses</Link>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
                  className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-9">
                  {["Hands-on virtual labs", "Industry certifications", "Expert mentors", "Career support"].map((p, i) => (
                    <motion.span key={p}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.06 }}
                      className="inline-flex items-center gap-1.5 text-sm text-white/40 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> {p}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                className="relative lg:pl-4">
                <HeroGlass />
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* ── STATS (clay tray) ────────────────────────────── */}
        <section className="relative -mt-10 z-20">
          <div className="container-custom">
            <div className="clay p-2">
              <div className="grid grid-cols-2 lg:grid-cols-4 rounded-[1.4rem] overflow-hidden">
                {stats.map((s, i) => (
                  <motion.div key={s.label}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06, ease: EASE }}
                    className="px-6 py-7 text-center">
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

        <PartnersMarquee />

        {/* ── FEATURES (clay bento) ────────────────────────── */}
        <section className="section-padding">
          <div className="container-custom">
            <SectionHeader badge="Curriculum" title="Industry-Ready" accent="Cyber Skills"
              sub="Built by practitioners and aligned with globally recognised certifications including CEH, CompTIA Security+ and CISSP." />
            <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[155px] gap-5">
              {features.map((f, i) => {
                const spanCls = f.span === "lg" ? "col-span-2 row-span-2" : f.span === "md" ? "col-span-2 lg:col-span-1 row-span-2" : "col-span-1 row-span-1";
                const isLarge = f.span === "lg";
                return (
                  <motion.div key={f.title}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.05, ease: EASE }}
                    className={`group relative ${spanCls} clay-sm bg-white p-5 overflow-hidden transition-transform duration-500 hover:-translate-y-1.5`}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 clay-sm transition-transform duration-500 group-hover:scale-110"
                      style={{ background: `linear-gradient(145deg, hsl(${f.accent} / 0.14), hsl(${f.accent} / 0.06))`, color: `hsl(${f.accent})` }}>
                      <f.icon className="w-5 h-5" />
                    </div>
                    <h3 className={`font-display font-bold mb-1.5 ${isLarge ? "text-xl" : "text-[15px]"}`}>{f.title}</h3>
                    <p className={`text-muted-foreground leading-relaxed ${isLarge ? "text-sm max-w-sm" : "text-[13px]"}`}>{f.desc}</p>
                    {isLarge && (
                      <div className="absolute bottom-5 left-5 right-5 clay-inset rounded-xl text-emerald-600 font-mono-cyber text-xs px-4 py-3 overflow-hidden">
                        <span className="text-muted-foreground">$ </span>
                        <span className="inline-block overflow-hidden whitespace-nowrap align-bottom group-hover:animate-typewriter" style={{ maxWidth: "100%" }}>
                          nmap -sV --script vuln 10.0.0.0/24
                        </span>
                        <span className="inline-block w-1.5 h-3.5 bg-emerald-500 ml-0.5 align-middle animate-blink" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── PATHWAYS (dark + liquid glass) ───────────────── */}
        <section className="section-padding relative overflow-hidden bg-[hsl(224,32%,7%)] text-white">
          <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-[hsl(222,89%,55%/0.1)] rounded-full blur-[120px] pointer-events-none" />
          <div className="container-custom relative z-10">
            <div className="mb-14 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.15em] bg-white/10 text-cyan-300 mb-5">
                <Sparkles className="w-3 h-3" /> Your Path Forward
              </span>
              <h2 className="font-display font-extrabold text-fluid-3xl tracking-display leading-[1.08] text-balance">
                Two Ways to Build Your <span className="text-cyan-300">Career</span>
              </h2>
            </div>
            <div className="grid lg:grid-cols-5 gap-5">
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ease: EASE }}
                className="lg:col-span-3 relative liquid-glass-dark glass-sheen r-squircle p-8 overflow-hidden">
                <span className="absolute top-6 right-6 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider clay-amber text-amber-950">Most Popular</span>
                <div className="w-13 h-13 rounded-2xl clay-amber flex items-center justify-center mb-5 p-3.5"><GraduationCap className="w-6 h-6 text-amber-950" /></div>
                <h3 className="font-display font-extrabold text-2xl mb-1">Professional Diploma</h3>
                <p className="text-cyan-300/80 text-sm font-medium mb-5">18 months · Beginner to Advanced</p>
                <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-md">Our flagship programme. A structured, phased journey that transforms beginners into industry-ready cybersecurity professionals.</p>
                <ul className="grid sm:grid-cols-2 gap-2.5 mb-8">
                  {["6 core modules", "Live mentorship", "Industry projects", "Job placement support"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/70"><CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" /> {f}</li>
                  ))}
                </ul>
                <Button asChild className="group h-12 pl-6 pr-2 font-bold rounded-full clay-amber text-amber-950 border-0 hover:scale-[1.02] active:scale-95 transition-transform duration-300">
                  <Link to="/courses#diploma" className="flex items-center gap-3">Explore the Diploma
                    <span className="w-8 h-8 rounded-full bg-amber-950/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-300"><ArrowRight className="w-4 h-4" /></span>
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08, ease: EASE }}
                className="lg:col-span-2 relative liquid-glass-dark r-squircle p-8 flex flex-col">
                <div className="w-13 h-13 rounded-2xl bg-cyan-400/15 flex items-center justify-center mb-5 p-3.5"><Award className="w-6 h-6 text-cyan-300" /></div>
                <h3 className="font-display font-extrabold text-2xl mb-1">Certifications</h3>
                <p className="text-cyan-300/80 text-sm font-medium mb-5">3–6 months each · Flexible</p>
                <p className="text-white/50 text-sm leading-relaxed mb-6">Targeted tracks aligned with CEH, CompTIA Security+ and CISSP — learn at your own pace.</p>
                <ul className="space-y-2.5 mb-8">
                  {["Self-paced modules", "Exam preparation", "Practice labs"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/70"><CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" /> {f}</li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-auto h-12 px-6 font-semibold rounded-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all duration-300">
                  <Link to="/courses#certifications">Browse Certifications <ArrowUpRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS (clay cards) ────────────────────── */}
        <section className="section-padding">
          <div className="container-custom">
            <SectionHeader center badge="How It Works" title="From Curious to" accent="Certified" sub="Three simple steps to launch your cybersecurity career." />
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {steps.map((s, i) => (
                <motion.div key={s.title}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, ease: EASE }}
                  className="group relative clay bg-white p-7 text-center transition-transform duration-500 hover:-translate-y-1.5">
                  <span className="absolute top-4 right-6 font-display font-extrabold text-5xl text-primary/[0.07] select-none">{s.num}</span>
                  <div className="w-16 h-16 rounded-2xl clay-accent flex items-center justify-center mx-auto mb-5 p-4 transition-transform duration-500 group-hover:scale-110">
                    <s.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS (clay cards + photos) ───────────── */}
        <section className="section-padding bg-surface/50 relative overflow-hidden">
          <div className="container-custom relative z-10">
            <SectionHeader center badge="Student Stories" title="Real Results," accent="Real Careers" sub="Hear from graduates who launched cybersecurity careers across Africa." />
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((t, i) => (
                <motion.div key={t.name}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08, ease: EASE }}
                  className="relative clay bg-white p-7 flex flex-col gap-5 transition-transform duration-500 hover:-translate-y-1.5">
                  <div className="flex items-center gap-3.5">
                    <div className="clay-sm p-1 rounded-full">
                      <img src={t.photo} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                      <p className="text-xs text-muted-foreground">{t.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm text-foreground/75 leading-relaxed flex-1">"{t.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LATEST NEWS (clay cards) ─────────────────────── */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-14">
              <SectionHeader badge="Latest News" title="Insights &" accent="Updates" sub="Stay ahead with the latest cybersecurity trends, career advice, and academy news." />
              <Link to="/blog" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline shrink-0 mb-14">
                View all articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {latestNews.map((post, i) => (
                <motion.div key={post.id}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08, ease: EASE }}>
                  <Link to={`/blog/${post.slug}`} className="group block clay bg-white overflow-hidden transition-transform duration-500 hover:-translate-y-1.5 p-2">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-[1.3rem] bg-secondary">
                      {post.thumbnail && <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg liquid-glass-dark text-white text-[11px] font-bold uppercase tracking-wider">{post.category.replace("-", " ")}</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="inline-flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {post.publishedAt}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      </div>
                      <h3 className="font-display font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary">Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA (clay tray + glass) ────────────────── */}
        <section className="section-padding-sm">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ease: EASE }}
              className="relative r-squircle overflow-hidden bg-[hsl(224,32%,7%)] text-white px-8 py-16 md:px-16 md:py-20 text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[300px] rounded-full bg-[hsl(222,89%,55%/0.18)] blur-[100px] pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.15em] bg-white/10 text-cyan-300 mb-6"><Zap className="w-3 h-3" /> Join 5,200+ Students</span>
                <h2 className="font-display font-extrabold text-fluid-4xl tracking-display leading-[1.05] text-balance mb-5">
                  Start Your <span className="text-amber-300">Cybersecurity Career</span> Today
                </h2>
                <p className="text-white/50 text-fluid-base max-w-xl mx-auto mb-9 text-pretty">Join thousands of African professionals securing the continent's digital future. Free to start — enrol in your first course today.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                  <Button size="lg" asChild className="group h-13 pl-7 pr-2 font-bold rounded-full clay-accent text-white border-0 hover:scale-[1.02] active:scale-95 transition-transform duration-300">
                    <Link to="/auth" className="flex items-center gap-3">Create Free Account
                      <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"><ArrowRight className="w-4 h-4" /></span>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="h-13 px-8 font-semibold rounded-full bg-white/[0.04] border-white/20 text-white hover:bg-white/10 hover:scale-[1.02] active:scale-95 transition-all duration-300">
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
