import { motion } from "framer-motion";
import { Shield, Terminal, Cloud, Server, Bug, Fingerprint, Brain, Network } from "lucide-react";

const features = [
  {
    icon: Terminal,
    title: "Penetration Testing",
    desc: "Learn ethical hacking techniques used by professionals to find vulnerabilities before attackers do.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "hover:border-cyan-500/30",
  },
  {
    icon: Shield,
    title: "Security Operations",
    desc: "Master SOC operations, SIEM tools, and real-time threat monitoring to defend enterprise networks.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-500/30",
  },
  {
    icon: Cloud,
    title: "Cloud Security",
    desc: "Secure AWS, Azure, and GCP with hands-on labs covering IAM, encryption, and compliance.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "hover:border-sky-500/30",
  },
  {
    icon: Bug,
    title: "Malware Analysis",
    desc: "Reverse-engineer malware samples and understand attack patterns to build stronger defences.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "hover:border-rose-500/30",
  },
  {
    icon: Network,
    title: "Network Defence",
    desc: "Configure firewalls, IDS/IPS, and network segmentation strategies for enterprise protection.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "hover:border-violet-500/30",
  },
  {
    icon: Fingerprint,
    title: "Digital Forensics",
    desc: "Investigate cyber incidents, recover digital evidence, and document findings for legal proceedings.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "hover:border-amber-500/30",
  },
  {
    icon: Brain,
    title: "Threat Intelligence",
    desc: "Analyse threat actors, track TTPs using MITRE ATT&CK, and produce actionable intelligence reports.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "hover:border-emerald-500/30",
  },
  {
    icon: Server,
    title: "Incident Response",
    desc: "Develop and execute incident response plans to contain, eradicate, and recover from breaches.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "hover:border-pink-500/30",
  },
];

export function FeatureCards() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="badge-cyber mb-4 inline-flex"
          >
            Curriculum
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-extrabold text-fluid-3xl tracking-display mb-4 text-balance"
          >
            Industry-Ready <span className="gradient-text">Cyber Skills</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto text-fluid-base text-pretty"
          >
            Our curriculum is built by industry experts and aligned with globally recognised certifications
            including CEH, CompTIA, CISSP, and more.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.055 }}
              viewport={{ once: true }}
              className={`group relative card-neon p-6 cursor-default transition-all duration-300 ${feature.border}`}
            >
              {/* Top accent line on hover */}
              <div className={`absolute top-0 left-6 right-6 h-px ${feature.bg} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />

              <div className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>

              <h3 className="font-display font-bold text-[15px] mb-2 group-hover:text-primary transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
