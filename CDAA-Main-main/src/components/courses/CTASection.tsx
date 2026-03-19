import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Rocket, KeyRound, Send } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Start Your Cybersecurity Career Journey
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join a global community of cybersecurity professionals. Apply for access to our world-class training programs.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8">
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
