import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Users, Star, BookOpen, Award, CheckCircle, Play, FileText, HelpCircle, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { categoryLabels, levelLabels, CourseCategory, CourseLevel } from "@/types";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { EnrollmentPaymentModal } from "@/components/enrollment/EnrollmentPaymentModal";
import { EnrollmentSuccessAnimation } from "@/components/enrollment/EnrollmentSuccessAnimation";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { CyberGrid } from "@/components/ui/CyberGrid";

const lessonIcons: Record<string, typeof Play> = {
  video:   Play,
  quiz:    HelpCircle,
  lab:     BookOpen,
  reading: FileText,
};

const lessonTypeColors: Record<string, string> = {
  video:   "text-cyan-400",
  quiz:    "text-amber-400",
  lab:     "text-violet-400",
  reading: "text-emerald-400",
};

interface CourseData {
  id: string; title: string; slug: string; description: string;
  short_description: string | null; thumbnail: string | null;
  price: number; original_price: number | null; duration: string | null;
  lessons_count: number | null; students_count: number | null;
  rating: number | null; level: string; category: string;
  instructor_name: string; instructor_title: string | null;
  instructor_avatar: string | null; is_published: boolean;
}

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course-detail", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase.from("courses").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
      if (error) throw error;
      return data as CourseData | null;
    },
    enabled: !!slug,
  });

  const { data: objectives = [] } = useQuery({
    queryKey: ["course-objectives", course?.id],
    queryFn: async () => {
      if (!course?.id) return [];
      const { data, error } = await supabase.from("course_objectives").select("*").eq("course_id", course.id).order("sort_order");
      if (error) throw error;
      return data || [];
    },
    enabled: !!course?.id,
  });

  const { data: requirements = [] } = useQuery({
    queryKey: ["course-requirements", course?.id],
    queryFn: async () => {
      if (!course?.id) return [];
      const { data, error } = await supabase.from("course_requirements").select("*").eq("course_id", course.id).order("sort_order");
      if (error) throw error;
      return data || [];
    },
    enabled: !!course?.id,
  });

  const { data: curriculum = [] } = useQuery({
    queryKey: ["course-curriculum", course?.id],
    queryFn: async () => {
      if (!course?.id) return [];
      const { data: sections, error } = await supabase.from("course_curriculum").select(`*, curriculum_lessons(*)`).eq("course_id", course.id).order("sort_order");
      if (error) throw error;
      return sections || [];
    },
    enabled: !!course?.id,
  });

  useEffect(() => { checkUserAndEnrollment(); }, [course?.id]);

  const checkUserAndEnrollment = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user && course?.id) {
        const { data: enrollment } = await supabase.from("enrollments").select("id").eq("user_id", user.id).eq("course_id", course.id).single();
        setIsEnrolled(!!enrollment);
      }
    } catch {}
    finally { setCheckingEnrollment(false); }
  };

  const handleEnrollClick = () => {
    if (!user) { toast.error("Please sign in to enroll"); navigate("/auth"); return; }
    if (!course) { toast.error("Course not available for enrollment"); return; }
    setPaymentModalOpen(true);
  };

  const handleEnrollmentSuccess = () => { setPaymentModalOpen(false); setShowSuccess(true); setIsEnrolled(true); };
  const handleSuccessContinue  = () => { setShowSuccess(false); navigate("/student"); };

  if (courseLoading) {
    return (
      <Layout>
        <section className="section-padding relative overflow-hidden gradient-dark-hero -mt-20 pt-20">
          <div className="container-custom pt-24">
            <Skeleton className="h-5 w-28 mb-8 rounded-lg" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-7 w-48 rounded-lg" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
              <Skeleton className="h-72 w-full rounded-2xl" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container-custom section-padding text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Course not found</h1>
          <Button className="btn-cyber text-white" asChild>
            <Link to="/courses">Back to Courses</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const discount = course.original_price && course.original_price > course.price
    ? Math.round((1 - course.price / course.original_price) * 100)
    : null;

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden gradient-dark-hero -mt-20 pt-20">
        <CyberGrid />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] ambient-blob ambient-blob-cyan opacity-15 pointer-events-none" />

        <motion.div
          className="relative z-10 container-custom pt-24 pb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Left: Course info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="badge-cyber text-xs">{categoryLabels[course.category as CourseCategory]}</span>
                <span className="badge-neon text-xs">{levelLabels[course.level as CourseLevel]}</span>
              </div>

              <h1 className="font-display font-extrabold text-fluid-3xl text-white tracking-display text-balance mb-5 leading-tight">
                {course.title}
              </h1>

              <p className="text-white/55 text-fluid-base leading-relaxed mb-8 max-w-2xl text-pretty">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2.5">
                  <img
                    src={course.instructor_avatar || "/placeholder.svg"}
                    alt={course.instructor_name}
                    className="w-10 h-10 rounded-full ring-2 ring-white/20 object-cover"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">{course.instructor_name}</p>
                    <p className="text-white/40 text-xs">{course.instructor_title || "Instructor"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-white/50">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white/70 font-medium">{course.rating || 0}</span>
                  <span className="text-white/40">rating</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/50">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>{(course.students_count || 0).toLocaleString()} students</span>
                </div>
              </div>
            </div>

            {/* Right: Enrollment Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:row-span-2"
            >
              <div className="card-neon sticky top-24 overflow-hidden">
                {course.thumbnail ? (
                  <div className="relative overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  </div>
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-primary/20 to-cyan/10 flex items-center justify-center">
                    <ShieldCheck className="w-16 h-16 text-primary/30" />
                  </div>
                )}

                <div className="p-6 space-y-5">
                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-display font-extrabold text-3xl gradient-text">
                        {course.price === 0 ? "Free" : `₦${course.price.toLocaleString()}`}
                      </span>
                      {course.original_price && course.original_price > course.price && (
                        <span className="text-muted-foreground line-through text-base">
                          ₦{course.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {discount && (
                      <span className="badge-success text-xs mt-1 inline-flex">{discount}% off</span>
                    )}
                  </div>

                  {/* Enroll Button */}
                  {checkingEnrollment ? (
                    <Button className="w-full h-11" disabled>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />Checking…
                    </Button>
                  ) : isEnrolled ? (
                    <Button
                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2"
                      onClick={() => navigate("/student/courses")}
                    >
                      <CheckCircle className="w-4 h-4" />Continue Learning
                    </Button>
                  ) : (
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full h-11 btn-cyber text-white font-bold shadow-neon-cyan"
                        onClick={handleEnrollClick}
                      >
                        Enroll Now
                      </Button>
                    </motion.div>
                  )}

                  <p className="text-center text-xs text-muted-foreground">14-day money-back guarantee</p>

                  {/* Course Meta */}
                  <div className="divider-cyber" />
                  <div className="space-y-3 text-sm">
                    {[
                      { icon: Clock,    color: "text-cyan-400",    label: course.duration || "Self-paced" },
                      { icon: BookOpen, color: "text-violet-400",  label: `${course.lessons_count || 0} lessons` },
                      { icon: Award,    color: "text-amber-400",   label: "Certificate of completion" },
                    ].map(({ icon: Icon, color, label }) => (
                      <div key={label} className="flex items-center gap-3 text-muted-foreground">
                        <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Instructor mini-card */}
                  <div className="divider-cyber" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Your Instructor</p>
                    <div className="flex items-center gap-3">
                      <img
                        src={course.instructor_avatar || "/placeholder.svg"}
                        alt={course.instructor_name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-border/50"
                      />
                      <div>
                        <p className="font-semibold text-sm">{course.instructor_name}</p>
                        <p className="text-xs text-muted-foreground">{course.instructor_title || "Instructor"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ── Course Content ── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2 space-y-14">

              {/* What You'll Learn */}
              {objectives.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="font-display font-bold text-fluid-xl tracking-display mb-6">
                    What You'll <span className="gradient-text">Learn</span>
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {objectives.map((obj, i) => (
                      <motion.div
                        key={obj.id}
                        className="flex gap-3 group"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">{obj.objective}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Curriculum */}
              {curriculum.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="font-display font-bold text-fluid-xl tracking-display mb-6">
                    Course <span className="gradient-text">Curriculum</span>
                  </h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {curriculum.map((section: any, i: number) => (
                      <AccordionItem
                        key={section.id}
                        value={`section-${i}`}
                        className="card-neon px-0 overflow-hidden border-none"
                      >
                        <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/20 transition-colors group/trig">
                          <div className="flex items-center gap-3 text-left">
                            <span className="font-semibold text-sm text-foreground group-hover/trig:text-primary transition-colors">
                              {section.section_title}
                            </span>
                            <span className="badge-cyber text-xs shrink-0">
                              {section.curriculum_lessons?.length || 0} lessons
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-1 px-3 pb-3">
                            {section.curriculum_lessons?.map((lesson: any) => {
                              const Icon  = lessonIcons[lesson.lesson_type]  || Play;
                              const color = lessonTypeColors[lesson.lesson_type] || "text-cyan-400";
                              return (
                                <div key={lesson.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-muted/40 transition-colors text-sm group/lesson">
                                  <div className="flex items-center gap-3">
                                    <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                                    <span className="text-muted-foreground group-hover/lesson:text-foreground transition-colors">
                                      {lesson.title}
                                    </span>
                                  </div>
                                  {lesson.duration && (
                                    <span className="text-xs text-muted-foreground shrink-0">{lesson.duration}</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="font-display font-bold text-fluid-xl tracking-display mb-6">Requirements</h2>
                  <ul className="space-y-3">
                    {requirements.map((req) => (
                      <li key={req.id} className="flex items-start gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {req.requirement}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {course && (
        <EnrollmentPaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          course={{ id: course.id, title: course.title, price: course.price, original_price: course.original_price || undefined }}
          onSuccess={handleEnrollmentSuccess}
        />
      )}
      <EnrollmentSuccessAnimation show={showSuccess} courseName={course.title} onContinue={handleSuccessContinue} />
    </Layout>
  );
}
