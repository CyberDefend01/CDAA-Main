import { Shield, Info } from "lucide-react";
import { motion } from "framer-motion";

export function AccessNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-xl border border-primary/20 bg-primary/5 p-6 flex items-start gap-4"
    >
      <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Shield className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2 mb-1">
          <Info className="w-4 h-4 text-primary" />
          Access-Controlled Enrollment
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This academy operates on a verified Access Token system. Enrollment is granted via approved access coupon only.
          To begin your journey, apply for access or enter your verified coupon code.
        </p>
      </div>
    </motion.div>
  );
}
