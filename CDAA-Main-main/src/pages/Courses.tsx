import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, GraduationCap, Award, Rocket, KeyRound, Send } from "lucide-react";
import { DiplomaSection } from "@/components/courses/DiplomaSection";
import { CertificationCourses } from "@/components/courses/CertificationCourses";
import { AccessNotice } from "@/components/courses/AccessNotice";
import { CTASection } from "@/components/courses/CTASection";

export default function Courses() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge variant="outline" className="mb-4 text-xs border-primary/30 text-primary">
              WORLD-CLASS CYBERSECURITY EDUCATION
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight">
              Academy of <span className="text-primary">Cybersecurity</span> Excellence
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
              Two distinct pathways to launch or advance your cybersecurity career — from a comprehensive 18-month professional diploma to targeted certification preparation courses.
            </p>

            {/* Pathway Quick Links */}
            <div className="flex flex-wrap gap-4 mb-8">
              <a href="#diploma">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  <GraduationCap className="w-4 h-4 mr-2" /> Professional Diploma
                </Button>
              </a>
              <a href="#certifications">
                <Button size="lg" variant="outline" className="font-semibold">
                  <Award className="w-4 h-4 mr-2" /> Certification Courses
                </Button>
              </a>
            </div>

            <AccessNotice />
          </motion.div>
        </div>
      </section>

      {/* Diploma Section */}
      <div id="diploma">
        <DiplomaSection />
      </div>

      {/* Certification Section */}
      <div id="certifications">
        <CertificationCourses />
      </div>

      {/* CTA */}
      <CTASection />
    </Layout>
  );
}
