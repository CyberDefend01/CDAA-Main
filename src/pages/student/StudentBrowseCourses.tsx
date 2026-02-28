import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Award,
  Clock,
  BarChart3,
  Wrench,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Monitor,
  Target,
  ChevronRight,
  Briefcase,
  KeyRound,
  ShieldCheck,
  Loader2,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAcademyCertCategories,
  useAcademyDiplomaPhases,
  useAcademyDiplomaMeta,
} from "@/hooks/useAcademyPrograms";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const levelColor: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

const phaseColors = [
  "border-l-blue-500",
  "border-l-cyan",
  "border-l-amber-500",
  "border-l-emerald-500",
];

export default function StudentBrowseCourses() {
  const { user } = useUserRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: categories, isLoading: catsLoading } = useAcademyCertCategories();
  const { data: phases, isLoading: phasesLoading } = useAcademyDiplomaPhases();
  const { data: meta, isLoading: metaLoading } = useAcademyDiplomaMeta();

  const outcomes = meta?.filter((m) => m.meta_type === "outcome") || [];
  const includes = meta?.filter((m) => m.meta_type === "includes") || [];
  const specializations = meta?.filter((m) => m.meta_type === "specialization") || [];

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [enrolledCourseName, setEnrolledCourseName] = useState("");

  const handleVerifyCoupon = async () => {
    if (!couponCode.trim()) { toast.error("Please enter an access coupon code"); return; }
    if (!user) { toast.error("Session error. Please refresh."); return; }

    setVerifying(true);
    try {
      const { data: coupon, error } = await supabase
        .from("coupons").select("*").eq("code", couponCode.toUpperCase()).eq("is_active", true).single();
      if (error || !coupon) { toast.error("Invalid or expired access coupon"); return; }
      if (coupon.max_uses && (coupon.current_uses || 0) >= coupon.max_uses) { toast.error("This coupon has reached its usage limit"); return; }
      if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) { toast.error("This coupon has expired"); return; }

      const applicableCourses = coupon.applicable_courses;
      let courseId: string | null = null;
      let courseName = "";

      if (applicableCourses && applicableCourses.length > 0) {
        courseId = applicableCourses[0];
        const { data: courseData } = await supabase.from("courses").select("title").eq("id", courseId).single();
        courseName = courseData?.title || "your course";
      } else {
        const { data: courses } = await supabase.from("courses").select("id, title").eq("is_published", true).limit(1);
        if (courses && courses.length > 0) { courseId = courses[0].id; courseName = courses[0].title; }
      }

      if (!courseId) { toast.error("No course found for this coupon"); return; }

      const { data: existing } = await supabase.from("enrollments").select("id").eq("user_id", user.id).eq("course_id", courseId).maybeSingle();
      if (existing) { toast.info("You are already enrolled in this course"); setEnrolledCourseName(courseName); setVerified(true); return; }

      await supabase.from("payments").insert({ user_id: user.id, course_id: courseId, amount: 0, original_amount: 0, discount_amount: 0, coupon_id: coupon.id, payment_status: "completed", payment_gateway: "coupon" });
      await supabase.from("coupon_usages").insert({ coupon_id: coupon.id, user_id: user.id, course_id: courseId, discount_applied: 0 });
      await supabase.from("coupons").update({ current_uses: (coupon.current_uses || 0) + 1 }).eq("id", coupon.id);

      const { error: enrollError } = await supabase.from("enrollments").insert({ user_id: user.id, course_id: courseId, progress: 0 });
      if (enrollError) throw enrollError;

      setEnrolledCourseName(courseName);
      setVerified(true);
      queryClient.invalidateQueries({ queryKey: ["student-enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment-check"] });
    } catch (error: any) {
      console.error("Coupon verification error:", error);
      toast.error(error.message || "Failed to verify coupon");
    } finally {
      setVerifying(false);
    }
  };

  const handleCouponModalClose = (val: boolean) => {
    if (!verifying) {
      setCouponModalOpen(val);
      if (!val && verified) navigate("/student/courses");
      if (!val) { setCouponCode(""); setVerified(false); setEnrolledCourseName(""); }
    }
  };

  return (
    <DashboardLayout type="student">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Browse Courses</h1>
            <p className="text-muted-foreground mt-1">Explore our cybersecurity programs and enroll with your access coupon</p>
          </div>
          <Button size="lg" onClick={() => setCouponModalOpen(true)} className="font-semibold">
            <KeyRound className="w-4 h-4 mr-2" /> Enter Access Coupon
          </Button>
        </div>

        <Tabs defaultValue="certifications" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="certifications" className="flex items-center gap-2"><Award className="w-4 h-4" /> Certifications</TabsTrigger>
            <TabsTrigger value="diploma" className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Professional Diploma</TabsTrigger>
          </TabsList>

          <TabsContent value="certifications" className="mt-6 space-y-10">
            {catsLoading ? (
              <div className="space-y-6">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}</div>
            ) : (
              categories?.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-5">
                    <h3 className="font-display text-xl font-bold text-foreground">{category.title}</h3>
                    <Badge variant="secondary" className="text-xs">Aligned with {category.alignment}</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {category.courses.map((course, courseIdx) => (
                      <motion.div key={course.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: courseIdx * 0.05 }} whileHover={{ y: -4 }}>
                        <Card className="bg-card border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group h-full">
                          <CardContent className="p-6 flex flex-col h-full">
                            <div className="mb-4">
                              <h4 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{course.title}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={levelColor[course.level] || ""}>{course.level}</Badge>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                              </div>
                            </div>
                            <div className="mb-4">
                              <div className="flex items-center gap-1.5 mb-2"><BarChart3 className="w-3.5 h-3.5 text-primary" /><span className="text-xs font-medium text-foreground">Skills Gained</span></div>
                              <div className="flex flex-wrap gap-1.5">{course.skills.map((skill) => (<Badge key={skill} variant="secondary" className="text-xs font-normal">{skill}</Badge>))}</div>
                            </div>
                            <div className="mb-4">
                              <div className="flex items-center gap-1.5 mb-2"><Wrench className="w-3.5 h-3.5 text-primary" /><span className="text-xs font-medium text-foreground">Tools Covered</span></div>
                              <div className="flex flex-wrap gap-1.5">{course.tools.map((tool) => (<span key={tool} className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">{tool}</span>))}</div>
                            </div>
                            <div className="mt-auto pt-4 border-t border-border space-y-3">
                              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /><span className="text-xs text-muted-foreground">Prepares for <span className="font-medium text-foreground">{course.certification}</span></span></div>
                              <Button size="sm" className="w-full text-xs" onClick={() => setCouponModalOpen(true)}>Enter Access Coupon</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="diploma" className="mt-6 space-y-8">
            {phasesLoading ? (
              <div className="space-y-4">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}</div>
            ) : (
              <>
                <div className="flex flex-wrap gap-6">
                  {[{ icon: Clock, label: "18 Months" }, { icon: BookOpen, label: "Beginner to Advanced" }, { icon: Monitor, label: "100% Online + Virtual Labs" }, { icon: Target, label: "Industry-Ready Professional" }].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground"><item.icon className="w-4 h-4 text-primary" /><span>{item.label}</span></div>
                  ))}
                </div>
                <div className="space-y-4">
                  {phases?.map((phase, idx) => (
                    <Accordion key={phase.id} type="single" collapsible>
                      <AccordionItem value={`phase-${phase.phase_number}`} className="border-none">
                        <Card className={`bg-card border border-border ${phaseColors[idx] || ""} border-l-4 overflow-hidden`}>
                          <AccordionTrigger className="px-6 py-5 hover:no-underline">
                            <div className="flex items-center gap-4 text-left">
                              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0"><span className="font-display font-bold text-foreground">{phase.phase_number}</span></div>
                              <div><h3 className="font-display font-semibold text-lg text-foreground">Phase {phase.phase_number} — {phase.title}</h3><p className="text-sm text-muted-foreground">{phase.months}</p></div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="grid sm:grid-cols-2 gap-3 pt-2">
                              {phase.modules.map((mod) => (
                                <div key={mod.id} className="rounded-lg bg-secondary/50 p-4">
                                  <h4 className="font-medium text-foreground mb-2 text-sm">{mod.title}</h4>
                                  <div className="flex flex-wrap gap-1.5">{mod.topics.map((topic) => (<Badge key={topic} variant="secondary" className="text-xs font-normal">{topic}</Badge>))}</div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </Card>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-card border-border"><CardContent className="p-6"><div className="flex items-center gap-3 mb-4"><Award className="w-5 h-5 text-primary" /><h4 className="font-display font-semibold text-lg text-foreground">Completion Includes</h4></div><ul className="space-y-3">{includes.map((item) => (<li key={item.id} className="flex items-center gap-2 text-sm text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{item.title}</li>))}</ul></CardContent></Card>
                  <Card className="bg-card border-border"><CardContent className="p-6"><div className="flex items-center gap-3 mb-4"><Briefcase className="w-5 h-5 text-primary" /><h4 className="font-display font-semibold text-lg text-foreground">Career Outcomes</h4></div><ul className="space-y-3">{outcomes.map((item) => (<li key={item.id} className="flex items-center gap-2 text-sm text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{item.title}</li>))}</ul></CardContent></Card>
                </div>
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">Ready to Enroll?</h3>
                  <p className="text-muted-foreground mb-4 text-sm">Use your access coupon to enroll in the Professional Diploma program.</p>
                  <Button size="lg" onClick={() => setCouponModalOpen(true)}><KeyRound className="w-4 h-4 mr-2" /> Enter Access Coupon</Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Coupon Verification Modal */}
      <Dialog open={couponModalOpen} onOpenChange={handleCouponModalClose}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {verified ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-12 px-8 gap-5">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 8, stiffness: 100 }} className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <PartyPopper className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center space-y-2">
                  <h3 className="font-display text-2xl font-bold text-foreground">🎉 Congratulations!</h3>
                  <p className="text-muted-foreground">You have been successfully enrolled in</p>
                  <p className="font-semibold text-primary text-lg">{enrolledCourseName}</p>
                  <p className="text-sm text-muted-foreground">All course features are now unlocked!</p>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <Button size="lg" onClick={() => { handleCouponModalClose(false); navigate("/student/courses"); }} className="mt-2">
                    <Sparkles className="w-4 h-4 mr-2" /> Go to My Courses
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key="form" className="p-6 space-y-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="w-5 h-5 text-primary" /> Access Coupon Verification</DialogTitle>
                  <DialogDescription>Enter your access coupon code to unlock course enrollment.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="ENTER ACCESS CODE" className="pl-10 uppercase tracking-widest font-mono text-center h-12 text-base border-primary/20 focus-visible:ring-primary/30" onKeyDown={(e) => e.key === "Enter" && handleVerifyCoupon()} disabled={verifying} />
                  </div>
                  <Button className="w-full h-11" size="lg" onClick={handleVerifyCoupon} disabled={verifying || !couponCode.trim()}>
                    {verifying ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>) : "Verify & Enroll"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">Access coupons are provided by authorized administrators only.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
