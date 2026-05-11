import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GraduationCap, Clock, Monitor, Award, BookOpen, Target, ChevronRight, Briefcase, ArrowRight } from "lucide-react";
import { useAcademyDiplomaPhases, useAcademyDiplomaMeta } from "@/hooks/useAcademyPrograms";
import { Link } from "react-router-dom";
import { CouponVerificationModal } from "./CouponVerificationModal";
import { Skeleton } from "@/components/ui/skeleton";

const phaseAccents = [
  { border: "border-l-blue-500",    bg: "bg-blue-500/10",    text: "text-blue-400",    num: "bg-blue-500/15 text-blue-400" },
  { border: "border-l-cyan-500",    bg: "bg-cyan-500/10",    text: "text-cyan-400",    num: "bg-cyan-500/15 text-cyan-400" },
  { border: "border-l-amber-500",   bg: "bg-amber-500/10",   text: "text-amber-400",   num: "bg-amber-500/15 text-amber-400" },
  { border: "border-l-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-400", num: "bg-emerald-500/15 text-emerald-400" },
];

export function DiplomaSection() {
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const { data: phases,  isLoading: phasesLoading } = useAcademyDiplomaPhases();
  const { data: meta,    isLoading: metaLoading   } = useAcademyDiplomaMeta();

  const outcomes        = meta?.filter((m) => m.meta_type === "outcome")       || [];
  const includes        = meta?.filter((m) => m.meta_type === "includes")      || [];
  const specializations = meta?.filter((m) => m.meta_type === "specialization") || [];
  const isLoading = phasesLoading || metaLoading;

  return (
    <section className="section-padding">
      <div className="container-custom">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-start gap-4 mb-5">
            <div className="w-13 h-13 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 p-3">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="badge-neon mb-3 inline-flex text-xs">Flagship Programme</span>
              <h2 className="font-display font-extrabold text-fluid-2xl tracking-display text-balance">
                Cybersecurity Professional Diploma
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl text-fluid-base leading-relaxed">
            A comprehensive 18-month programme designed to transform beginners into industry-ready
            cybersecurity professionals through structured, phased learning.
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-3 mt-6">
            {[
              { icon: Clock,    label: "18 Months" },
              { icon: BookOpen, label: "Beginner to Advanced" },
              { icon: Monitor,  label: "100% Online + Virtual Labs" },
              { icon: Target,   label: "Industry-Ready Graduate" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <item.icon className="w-4 h-4 text-primary/70 shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : (
          <>
            {/* Phases */}
            <div className="space-y-3 mb-14">
              {phases?.map((phase, idx) => {
                const accent = phaseAccents[idx % phaseAccents.length];
                return (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <Accordion type="single" collapsible>
                      <AccordionItem value={`phase-${phase.phase_number}`} className="border-none">
                        <div className={`card-neon border-l-4 ${accent.border} overflow-hidden transition-all`}>
                          <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/20 transition-colors [&[data-state=open]]:bg-muted/10">
                            <div className="flex items-center gap-4 text-left">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-sm ${accent.num}`}>
                                {phase.phase_number}
                              </div>
                              <div>
                                <h3 className="font-display font-bold text-base text-foreground">
                                  Phase {phase.phase_number} — {phase.title}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">{phase.months}</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="grid sm:grid-cols-2 gap-3 pt-2">
                              {phase.modules.map((mod) => (
                                <div key={mod.id} className={`rounded-xl p-4 ${accent.bg} border border-current/10`}>
                                  <h4 className="font-semibold text-sm text-foreground mb-3">{mod.title}</h4>
                                  <div className="flex flex-wrap gap-1.5">
                                    {mod.topics.map((topic) => (
                                      <span key={topic} className="text-xs bg-background/60 text-muted-foreground px-2 py-0.5 rounded-md border border-border/40">
                                        {topic}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </div>
                      </AccordionItem>
                    </Accordion>
                  </motion.div>
                );
              })}
            </div>

            {/* Specialization Tracks */}
            {specializations.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
                <h3 className="font-display font-bold text-xl tracking-display mb-6">Specialization Tracks</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  {specializations.map((track) => (
                    <div key={track.id} className="card-neon p-6 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{track.icon}</span>
                        <h4 className="font-display font-bold text-base">{track.title}</h4>
                      </div>
                      <ul className="space-y-2">
                        {track.topics.map((topic) => (
                          <li key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Outcomes & Includes */}
            <div className="grid md:grid-cols-2 gap-5 mb-10">
              {[
                { icon: Award,    title: "Diploma Completion Includes", items: includes  },
                { icon: Briefcase, title: "Career Outcomes",             items: outcomes },
              ].map(({ icon: Icon, title, items }, gi) => (
                <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: gi * 0.08 }}>
                  <div className="card-neon p-6 h-full">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <h4 className="font-display font-bold text-base">{title}</h4>
                    </div>
                    <ul className="space-y-3">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {item.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Enroll CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-gradient-to-r from-primary/8 to-cyan/5 border border-primary/15 text-center"
        >
          <h3 className="font-display font-bold text-xl mb-3">Ready to Start the Professional Diploma?</h3>
          <p className="text-muted-foreground mb-7 max-w-xl mx-auto text-sm leading-relaxed">
            Begin your 18-month journey to becoming an industry-ready cybersecurity professional.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="btn-cyber text-white font-bold gap-2" asChild>
              <Link to="/auth">Apply Now <ArrowRight className="w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="font-semibold border-primary/30 hover:border-primary/60" asChild>
              <Link to="/contact">Request Access</Link>
            </Button>
            <Button size="lg" variant="ghost" className="font-semibold text-muted-foreground hover:text-foreground" onClick={() => setCouponModalOpen(true)}>
              Enter Access Coupon
            </Button>
          </div>
        </motion.div>
      </div>

      <CouponVerificationModal open={couponModalOpen} onOpenChange={setCouponModalOpen} />
    </section>
  );
}
