import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { CyberGrid } from "@/components/ui/CyberGrid";

export function CTASection() {
  return (
    <section className="section-padding-sm">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden gradient-dark-hero border border-white/10 p-10 md:p-16 text-center"
        >
          <CyberGrid />
          <div className="absolute top-0 left-1/2 w-[500px] h-[300px] -translate-x-1/2 -translate-y-1/2 ambient-blob ambient-blob-cyan opacity-20 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="badge-neon mb-6 inline-flex">
              <Zap className="w-3 h-3" />
              Start Your Journey
            </span>
            <h2 className="font-display font-extrabold text-fluid-3xl text-white tracking-display mb-5 text-balance">
              Ready to Defend
              <br />
              <span className="gradient-text-neon text-glow-cyan">Africa's Digital Future?</span>
            </h2>
            <p className="text-white/50 text-fluid-base mb-10 leading-relaxed text-pretty">
              Apply now and join thousands of professionals building careers in cybersecurity across Africa.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="btn-cyber h-12 px-10 text-base font-bold text-white shadow-neon-cyan gap-2" asChild>
                  <Link to="/auth">Apply Now <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </motion.div>
              <Button size="lg" className="btn-ghost-neon h-12 px-8 text-base font-semibold" asChild>
                <Link to="/contact">Request Access Info</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
