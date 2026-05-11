import { Layout } from "@/components/layout/Layout";
import { Shield, Target, Eye, Heart, Users, Award, Globe, Linkedin, Twitter, Zap } from "lucide-react";
import { teamMembers, stats } from "@/data/team";
import { motion } from "framer-motion";
import { CyberGrid } from "@/components/ui/CyberGrid";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const values = [
  { icon: Award,  title: "Excellence",      description: "We deliver world-class training that meets international standards while addressing African contexts.", color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "hover:border-cyan-500/25" },
  { icon: Users,  title: "Accessibility",   description: "Quality cybersecurity education should be available to everyone, regardless of background.",          color: "text-violet-400", bg: "bg-violet-500/10",  border: "hover:border-violet-500/25" },
  { icon: Target, title: "Practical Skills",description: "Theory alone isn't enough. Our hands-on approach prepares you for real-world challenges.",            color: "text-emerald-400",bg: "bg-emerald-500/10", border: "hover:border-emerald-500/25" },
  { icon: Heart,  title: "Community",       description: "We're building a network of African cybersecurity professionals who support each other.",             color: "text-rose-400",   bg: "bg-rose-500/10",    border: "hover:border-rose-500/25" },
];

const statItems = [
  { value: 5000, suffix: "+", label: "Students Trained" },
  { value: 50,   suffix: "+", label: "Expert Courses" },
  { value: 30,   suffix: "+", label: "Certifications" },
  { value: 95,   suffix: "%", label: "Completion Rate" },
];

export default function About() {
  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden gradient-dark-hero -mt-20 pt-20">
        <CyberGrid />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] ambient-blob ambient-blob-cyan opacity-15 pointer-events-none -translate-y-1/2" />

        <motion.div
          className="relative z-10 container-custom pt-28 pb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge-neon mb-5 inline-flex"><Zap className="w-3 h-3" />About Us</span>
          <h1 className="font-display font-extrabold text-fluid-4xl text-white tracking-display text-balance mb-6 leading-[1.06]">
            Securing Africa's{" "}
            <span className="gradient-text-neon text-glow-cyan">Digital Future</span>
          </h1>
          <p className="text-fluid-base text-white/55 max-w-3xl leading-relaxed text-pretty">
            Cyber Defend Africa Academy was founded with a singular mission: to bridge the cybersecurity
            skills gap across the African continent and empower the next generation of security professionals.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ── Mission & Vision ── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Target, title: "Our Mission", color: "text-cyan-400",   bg: "bg-cyan-500/10",   text: "Provide accessible, practical, and industry-relevant cybersecurity training that empowers individuals and organisations across Africa to protect their digital assets and thrive in the global digital economy." },
              { icon: Eye,    title: "Our Vision",  color: "text-violet-400", bg: "bg-violet-500/10", text: "To be Africa's leading cybersecurity academy, producing world-class security professionals who protect organisations locally and contribute to global cybersecurity excellence." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-neon p-8 group hover:border-primary/30 transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h2 className="font-display font-bold text-xl mb-4 group-hover:text-primary transition-colors">{item.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="section-padding bg-surface/40 relative overflow-hidden">
        <div className="absolute inset-0 cyber-dots opacity-25 pointer-events-none" />
        <motion.div
          className="container-custom relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge-cyber mb-5 inline-flex">Our Story</span>
            <h2 className="font-display font-extrabold text-fluid-2xl tracking-display mb-8 text-balance">
              Why We Built <span className="gradient-text">CDAA</span>
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed text-sm text-left">
              <p>Africa's digital transformation is accelerating at an unprecedented pace. From mobile banking to e-government, millions of Africans are coming online every year. But with this growth comes increased exposure to cyber threats.</p>
              <p>We recognised a critical gap: while the demand for cybersecurity professionals was skyrocketing, quality training programmes tailored to African contexts were scarce. Most available certifications were expensive, foreign, and didn't address the unique challenges facing African organisations.</p>
              <p>Cyber Defend Africa Academy was born to fill this gap. We combine international best practices with deep understanding of African business environments, creating training that's both world-class and locally relevant.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Values ── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="badge-cyber mb-4 inline-flex">Core Values</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display font-extrabold text-fluid-2xl tracking-display text-balance">
              What Drives <span className="gradient-text">Everything We Do</span>
            </motion.h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`card-neon p-6 text-center group ${v.border} transition-all`}
              >
                <div className={`w-12 h-12 rounded-2xl ${v.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                  <v.icon className={`w-6 h-6 ${v.color}`} />
                </div>
                <h3 className="font-display font-bold text-sm mb-2 group-hover:text-primary transition-colors">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section-padding-sm bg-surface/30 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {statItems.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <p className="font-display font-extrabold text-3xl gradient-text">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2} />
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="badge-cyber mb-4 inline-flex">The Team</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display font-extrabold text-fluid-2xl tracking-display text-balance">
              Meet Our <span className="gradient-text">Leadership</span>
            </motion.h2>
            <p className="text-muted-foreground mt-3 text-sm max-w-xl mx-auto">Our team brings decades of combined experience in cybersecurity and education.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card-neon overflow-hidden group hover:border-primary/30 transition-all"
              >
                <div className="relative overflow-hidden h-56">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-sm group-hover:text-primary transition-colors">{member.name}</h3>
                  <p className="text-xs text-primary/80 font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{member.bio}</p>
                  <div className="flex gap-2">
                    {member.linkedin && (
                      <a href={member.linkedin} className="p-2 rounded-lg bg-muted hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] transition-all text-muted-foreground">
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-all text-muted-foreground">
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
