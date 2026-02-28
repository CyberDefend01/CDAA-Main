import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Clock, BarChart3, Wrench, CheckCircle2 } from "lucide-react";
import { useAcademyCertCategories } from "@/hooks/useAcademyPrograms";
import { Link } from "react-router-dom";
import { CouponVerificationModal } from "./CouponVerificationModal";
import { Skeleton } from "@/components/ui/skeleton";

const levelColor: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export function CertificationCourses() {
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const { data: categories, isLoading } = useAcademyCertCategories();

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <Badge variant="outline" className="mb-1 text-xs border-primary/30 text-primary">
                PROFESSIONAL CERTIFICATIONS
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                Cybersecurity Certification Courses
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
            Short professional courses (4–12 weeks) aligned with globally recognized certification standards.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {categories?.map((category, catIdx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIdx * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="font-display text-xl font-bold text-foreground">{category.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    Aligned with {category.alignment}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {category.courses.map((course, courseIdx) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: courseIdx * 0.08 }}
                      whileHover={{ y: -4 }}
                    >
                      <Card className="bg-card border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group h-full">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="mb-4">
                            <h4 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {course.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={levelColor[course.level] || ""}>
                                {course.level}
                              </Badge>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" /> {course.duration}
                              </span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center gap-1.5 mb-2">
                              <BarChart3 className="w-3.5 h-3.5 text-primary" />
                              <span className="text-xs font-medium text-foreground">Skills Gained</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {course.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs font-normal">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Wrench className="w-3.5 h-3.5 text-primary" />
                              <span className="text-xs font-medium text-foreground">Tools Covered</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {course.tools.map((tool) => (
                                <span key={tool} className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-auto pt-4 border-t border-border space-y-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                              <span className="text-xs text-muted-foreground">
                                Prepares for <span className="font-medium text-foreground">{course.certification}</span>
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Link to="/auth" className="flex-1">
                                <Button size="sm" className="w-full text-xs" variant="default">
                                  Apply Now
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                className="flex-1 text-xs"
                                variant="outline"
                                onClick={() => setCouponModalOpen(true)}
                              >
                                Access Coupon
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
