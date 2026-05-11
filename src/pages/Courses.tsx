import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, Award, Zap, ArrowRight } from "lucide-react";
import { DiplomaSection } from "@/components/courses/DiplomaSection";
import { CertificationCourses } from "@/components/courses/CertificationCourses";
import { AccessNotice } from "@/components/courses/AccessNotice";
import { CTASection } from "@/components/courses/CTASection";
import { CyberGrid } from "@/components/ui/CyberGrid";

export default function Courses() {
  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden gradient-dark-hero -mt-20 pt-20">
        <CyberGrid />
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] ambient-blob ambient-blob-cyan opacity-15 pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] ambient-blob ambient-blob-magenta opacity-10 pointer-events-none -translate-y-1/2" />

        <div className="relative z-10 container-custom pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-6"
            >
              <span className="badge-neon">
                <Zap className="w-3 h-3" />
                World-Class Cybersecurity Education
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="font-display font-extrabold text-fluid-4xl text-white tracking-display leading-[1.06] text-balance mb-6"
            >
              Academy of{" "}
              <span className="gradient-text-neon text-glow-cyan">Cybersecurity</span>{" "}
              Excellence
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="text-fluid-lg text-white/55 max-w-2xl leading-relaxed mb-10 text-pretty"
            >
              Two distinct pathways to launch or advance your career — a comprehensive 18-month
              Professional Diploma or targeted short Certification courses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.24 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a href="#diploma">
                  <Button size="lg" className="btn-cyber h-12 px-8 text-base font-bold text-white shadow-neon-cyan gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Professional Diploma
                  </Button>
                </a>
              </motion.div>
              <a href="#certifications">
                <Button size="lg" className="btn-ghost-neon h-12 px-8 text-base font-semibold gap-2">
                  <Award className="w-4 h-4" />
                  Certification Courses
                </Button>
              </a>
            </motion.div>

            <AccessNotice />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ── Diploma Section ── */}
      <div id="diploma">
        <DiplomaSection />
      </div>

      {/* ── Certification Section ── */}
      <div id="certifications">
        <CertificationCourses />
      </div>

      {/* ── CTA ── */}
      <CTASection />
    </Layout>
  );
}
