import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Award, Clock, BarChart3, Wrench, CheckCircle2, ArrowRight } from "lucide-react";
import { useAcademyCertCategories } from "@/hooks/useAcademyPrograms";
import { Link } from "react-router-dom";
import { CouponVerificationModal } from "./CouponVerificationModal";
import { Skeleton } from "@/components/ui/skeleton";

const levelStyles: Record<string, string> = {
  Beginner:     "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Intermediate: "bg-amber-500/10  text-amber-500  border-amber-500/20",
  Advanced:     "bg-red-500/10    text-red-500    border-red-500/20",
};

export function CertificationCourses() {
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const { data: categories, isLoading } = useAcademyCertCategories();

  return (
    <section className="section-padding bg-surface/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-start gap-4 mb-5">
            <div className="w-13 h-13 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 p-3">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="badge-cyber mb-3 inline-flex text-xs">Professional Certifications</span>
              <h2 className="font-display font-extrabold text-fluid-2xl tracking-display text-balance">
                Cybersecurity Certification Courses
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl text-fluid-base leading-relaxed">
            Short professional courses (4–12 weeks) aligned with globally recognised certification standards,
            including CEH, CompTIA, CISSP, and more.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-64 rounded-lg" />
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[1, 2, 3].map((j) => <Skeleton key={j} className="h-52 rounded-xl" />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-14">
            {categories?.map((category, catIdx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIdx * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="font-display font-bold text-lg">{category.title}</h3>
                  <span className="badge-cyber text-xs">
                    Aligned: {category.alignment}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {category.courses.map((course, courseIdx) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: courseIdx * 0.06 }}
                      className="group"
                    >
                      <div className="card-neon p-6 flex flex-col h-full hover:border-primary/30 transition-all">
                        {/* Top */}
                        <div className="mb-4">
                          <h4 className="font-display font-bold text-[15px] text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                            {course.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${levelStyles[course.level] || "bg-muted text-muted-foreground"}`}>
                              {course.level}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" /> {course.duration}
                            </span>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-4">
                          <div className="flex items-center gap-1.5 mb-2">
                            <BarChart3 className="w-3.5 h-3.5 text-primary/70" />
                            <span className="text-xs font-semibold text-foreground">Skills</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {course.skills.map((skill) => (
                              <span key={skill} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Tools */}
                        <div className="mb-4">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Wrench className="w-3.5 h-3.5 text-primary/70" />
                            <span className="text-xs font-semibold text-foreground">Tools</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {course.tools.map((tool) => (
                              <span key={tool} className="text-xs text-cyan-500 bg-cyan/5 border border-cyan/15 px-2 py-0.5 rounded-md font-medium">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-4 border-t border-border/50 space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              Prepares for{" "}
                              <span className="font-semibold text-foreground">{course.certification}</span>
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 text-xs btn-cyber text-white font-semibold" asChild>
                              <Link to="/auth">Apply Now</Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs border-border/60 hover:border-primary/40"
                              onClick={() => setCouponModalOpen(true)}
                            >
                              Access Coupon
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <CouponVerificationModal open={couponModalOpen} onOpenChange={setCouponModalOpen} />
    </section>
  );
}
