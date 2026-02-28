import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CheckCircle2, ShieldCheck, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface CouponVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CouponVerificationModal({ open, onOpenChange }: CouponVerificationModalProps) {
  const [couponCode, setCouponCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter an access coupon code");
      return;
    }

    setVerifying(true);
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in first to use an access coupon");
        onOpenChange(false);
        navigate("/auth");
        return;
      }

      // Validate coupon
      const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !coupon) {
        toast.error("Invalid or expired access coupon");
        return;
      }

      if (coupon.max_uses && (coupon.current_uses || 0) >= coupon.max_uses) {
        toast.error("This coupon has reached its usage limit");
        return;
      }

      if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
        toast.error("This coupon has expired");
        return;
      }

      // Find applicable course
      const applicableCourses = coupon.applicable_courses;
      let courseId: string | null = null;

      if (applicableCourses && applicableCourses.length > 0) {
        courseId = applicableCourses[0];
      } else {
        // General coupon — get first published course not yet enrolled
        const { data: courses } = await supabase
          .from("courses")
          .select("id")
          .eq("is_published", true)
          .limit(1);
        if (courses && courses.length > 0) {
          courseId = courses[0].id;
        }
      }

      if (!courseId) {
        toast.error("No course found for this coupon");
        return;
      }

      // Check if already enrolled
      const { data: existing } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      if (existing) {
        toast.info("You are already enrolled in this course");
        setVerified(true);
        setTimeout(() => {
          onOpenChange(false);
          navigate("/student");
        }, 1500);
        return;
      }

      // Create payment record
      await supabase.from("payments").insert({
        user_id: user.id,
        course_id: courseId,
        amount: 0,
        original_amount: 0,
        discount_amount: 0,
        coupon_id: coupon.id,
        payment_status: "completed",
        payment_gateway: "coupon",
      });

      // Record coupon usage
      await supabase.from("coupon_usages").insert({
        coupon_id: coupon.id,
        user_id: user.id,
        course_id: courseId,
        discount_applied: 0,
      });

      // Increment coupon uses
      await supabase
        .from("coupons")
        .update({ current_uses: (coupon.current_uses || 0) + 1 })
        .eq("id", coupon.id);

      // Create enrollment
      const { error: enrollError } = await supabase.from("enrollments").insert({
        user_id: user.id,
        course_id: courseId,
        progress: 0,
      });

      if (enrollError) throw enrollError;

      setVerified(true);
      toast.success("Access granted! Redirecting to your dashboard...");

      setTimeout(() => {
        onOpenChange(false);
        navigate("/student");
      }, 2000);
    } catch (error: any) {
      console.error("Coupon verification error:", error);
      toast.error(error.message || "Failed to verify coupon");
    } finally {
      setVerifying(false);
    }
  };

  const handleClose = (val: boolean) => {
    if (!verifying) {
      onOpenChange(val);
      if (!val) {
        setCouponCode("");
        setVerified(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Access Coupon Verification
          </DialogTitle>
          <DialogDescription>
            Enter your access coupon code to unlock course enrollment.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          <AnimatePresence mode="wait">
            {verified ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </motion.div>
                <p className="font-semibold text-foreground">Access Granted!</p>
                <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
              </motion.div>
            ) : (
              <motion.div key="form" className="space-y-4">
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="ENTER ACCESS CODE"
                    className="pl-10 uppercase tracking-widest font-mono text-center h-12 text-base border-primary/20 focus-visible:ring-primary/30"
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    disabled={verifying}
                  />
                </div>

                <Button
                  className="w-full h-11"
                  size="lg"
                  onClick={handleVerify}
                  disabled={verifying || !couponCode.trim()}
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Enroll"
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Access coupons are provided by authorized administrators only.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
