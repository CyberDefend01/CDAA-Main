import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GraduationCap, Clock, Monitor, Award, BookOpen, Target, ChevronRight, Briefcase, Rocket, KeyRound, Send } from "lucide-react";
import { diplomaPhases, specializationTracks, diplomaOutcomes, diplomaIncludes } from "@/data/academyPrograms";
import { Link } from "react-router-dom";

const phaseColors = [
  "border-l-blue-500",
  "border-l-cyan",
  "border-l-amber-500",
  "border-l-emerald-500",
];

export function DiplomaSection() {
  return (
    <section className="py-20">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <Badge variant="outline" className="mb-1 text-xs border-primary/30 text-primary">
                FLAGSHIP PROGRAM
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                Cybersecurity Professional Diploma
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
            A comprehensive 18-month program designed to transform beginners into industry-ready cybersecurity professionals through structured, phased learning.
          </p>

          {/* Key Info */}
          <div className="flex flex-wrap gap-6 mt-6">
            {[
              { icon: Clock, label: "18 Months" },
              { icon: BookOpen, label: "Beginner to Advanced" },
              { icon: Monitor, label: "100% Online + Virtual Labs" },
              { icon: Target, label: "Industry-Ready Professional" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <item.icon className="w-4 h-4 text-primary" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Phases */}
        <div className="space-y-4 mb-12">
          {diplomaPhases.map((phase, idx) => (
            <motion.div
              key={phase.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Accordion type="single" collapsible>
                <AccordionItem value={`phase-${phase.number}`} className="border-none">
                  <Card className={`bg-card border border-border ${phaseColors[idx]} border-l-4 overflow-hidden`}>
                    <AccordionTrigger className="px-6 py-5 hover:no-underline">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <span className="font-display font-bold text-foreground">{phase.number}</span>
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-lg text-foreground">
                            Phase {phase.number} — {phase.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{phase.months}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="grid sm:grid-cols-2 gap-3 pt-2">
                        {phase.modules.map((mod) => (
                          <div key={mod.title} className="rounded-lg bg-secondary/50 p-4">
                            <h4 className="font-medium text-foreground mb-2 text-sm">{mod.title}</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {mod.topics.map((topic) => (
                                <Badge key={topic} variant="secondary" className="text-xs font-normal">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              </Accordion>
            </motion.div>
          ))}
        </div>

        {/* Specialization Tracks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">
            Specialization Tracks
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {specializationTracks.map((track) => (
              <Card key={track.title} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{track.icon}</span>
                    <h4 className="font-display font-semibold text-lg text-foreground">{track.title}</h4>
                  </div>
                  <ul className="space-y-2">
                    {track.topics.map((topic) => (
                      <li key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Completion & Careers */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-border h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-5 h-5 text-primary" />
                  <h4 className="font-display font-semibold text-lg text-foreground">Diploma Completion Includes</h4>
                </div>
                <ul className="space-y-3">
                  {diplomaIncludes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border-border h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <h4 className="font-display font-semibold text-lg text-foreground">Career Outcomes</h4>
                </div>
                <ul className="space-y-3">
                  {diplomaOutcomes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enroll CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-cyan/10 border border-primary/20 text-center"
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-3">
            Enroll in the Professional Diploma
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Begin your 18-month journey to becoming an industry-ready cybersecurity professional.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="font-semibold px-8">
                <Rocket className="w-4 h-4 mr-2" /> Apply Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="font-semibold px-8">
                <Send className="w-4 h-4 mr-2" /> Request Access
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="font-semibold px-8">
                <KeyRound className="w-4 h-4 mr-2" /> Enter Access Coupon
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
