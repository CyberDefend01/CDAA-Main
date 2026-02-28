import { motion } from "framer-motion";
import { Shield, Terminal, Cloud, Server, Bug, Fingerprint, Brain, Network } from "lucide-react";

const features = [
  {
    icon: Terminal,
    title: "Penetration Testing",
    desc: "Learn ethical hacking techniques used by security professionals to identify vulnerabilities before attackers do.",
  },
  {
    icon: Shield,
    title: "Security Operations",
    desc: "Master SOC operations, SIEM tools, and real-time threat monitoring to defend enterprise networks.",
  },
  {
    icon: Cloud,
    title: "Cloud Security",
    desc: "Secure AWS, Azure, and GCP environments with hands-on labs covering IAM, encryption, and compliance.",
  },
  {
    icon: Bug,
    title: "Malware Analysis",
    desc: "Reverse-engineer malware samples and understand attack patterns to build stronger defences.",
  },
  {
    icon: Network,
    title: "Network Defence",
    desc: "Configure firewalls, IDS/IPS systems, and network segmentation strategies for enterprise protection.",
  },
  {
    icon: Fingerprint,
    title: "Digital Forensics",
    desc: "Investigate cyber incidents, recover digital evidence, and document findings for legal proceedings.",
  },
  {
    icon: Brain,
    title: "Threat Intelligence",
    desc: "Analyze threat actors, track TTPs using MITRE ATT&CK, and produce actionable intelligence reports.",
  },
  {
    icon: Server,
    title: "Incident Response",
    desc: "Develop and execute incident response plans to contain, eradicate, and recover from breaches.",
  },
];

export function FeatureCards() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-primary uppercase tracking-widest mb-3"
          >
            What You'll Learn
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold mb-4"
          >
            Industry-Ready <span className="text-primary">Cyber Skills</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our curriculum is designed by industry experts and aligned with globally recognized certifications
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              viewport={{ once: true }}
              className="group glass-card rounded-xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-sm font-semibold mb-2 group-hover:text-primary transition-colors">
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
