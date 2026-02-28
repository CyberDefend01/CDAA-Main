import { motion } from "framer-motion";
import { Monitor, Award, TrendingUp } from "lucide-react";

const highlights = [
  { icon: Monitor, label: "Hands-On Training" },
  { icon: Award, label: "Industry Certifications" },
  { icon: TrendingUp, label: "Career Advancement" },
];

export function HeroHighlights() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
      {highlights.map((h, i) => (
        <motion.div
          key={h.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 + i * 0.15 }}
          className="flex items-center gap-2 text-white/80"
        >
          <h.icon className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">{h.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
