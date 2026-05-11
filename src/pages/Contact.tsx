import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MapPin, Send, MessageSquare, Zap, ArrowRight } from "lucide-react";
import { faqs } from "@/data/team";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CyberGrid } from "@/components/ui/CyberGrid";

const contactCards = [
  { icon: Mail,    title: "Email Us",   lines: ["info@cyberdefendafrica.com", "support@cyberdefendafrica.com"], color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "hover:border-cyan-500/25" },
  { icon: Phone,   title: "Call Us",    lines: ["+2347088304612", "+2348060602100"],                           color: "text-violet-400", bg: "bg-violet-500/10",  border: "hover:border-violet-500/25" },
  { icon: MapPin,  title: "Visit Us",   lines: ["Victoria Island, Lagos, Nigeria", "(By appointment only)"],   color: "text-emerald-400",bg: "bg-emerald-500/10", border: "hover:border-emerald-500/25" },
];

const inputCls = "bg-surface border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/10 rounded-xl h-11 text-sm transition-all";

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
  };

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden gradient-dark-hero -mt-20 pt-20">
        <CyberGrid />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] ambient-blob ambient-blob-cyan opacity-15 pointer-events-none -translate-y-1/2" />

        <motion.div
          className="relative z-10 container-custom pt-28 pb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge-neon mb-5 inline-flex"><Zap className="w-3 h-3" />Contact Us</span>
          <h1 className="font-display font-extrabold text-fluid-4xl text-white tracking-display text-balance mb-5 leading-[1.06]">
            Get in <span className="gradient-text-neon text-glow-cyan">Touch</span>
          </h1>
          <p className="text-fluid-base text-white/55 max-w-2xl leading-relaxed text-pretty">
            Have questions about our courses or need help choosing the right programme? We're here to help.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ── Contact Section ── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-7">

            {/* Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card-neon p-8">
                <h2 className="font-display font-bold text-xl mb-7">
                  Send us a <span className="gradient-text">message</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">Full Name</label>
                      <Input placeholder="Abubakar Ibrahim" className={inputCls} required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">Email Address</label>
                      <Input type="email" placeholder="abubakar@example.com" className={inputCls} required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Subject</label>
                    <Input placeholder="How can we help?" className={inputCls} required />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Message</label>
                    <Textarea
                      placeholder="Tell us more about your enquiry…"
                      className="bg-surface border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/10 rounded-xl text-sm min-h-[140px] transition-all resize-none"
                      required
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" size="lg" className="btn-cyber h-12 px-8 text-white font-bold gap-2 shadow-neon-cyan">
                      <Send className="w-4 h-4" />Send Message
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>

            {/* Info cards */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {contactCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className={`card-neon p-5 group ${card.border} transition-all`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <card.icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1.5 group-hover:text-primary transition-colors">{card.title}</h3>
                      {card.lines.map((line, j) => (
                        <p key={j} className="text-xs text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Response time note */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 text-center">
                <p className="text-sm font-semibold text-primary">Typical response</p>
                <p className="text-xs text-muted-foreground mt-1">Within 24 business hours</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding bg-surface/30 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="badge-cyber mb-4 inline-flex">FAQ</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display font-extrabold text-fluid-2xl tracking-display mb-3 text-balance">
              Frequently Asked <span className="gradient-text">Questions</span>
            </motion.h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Find answers to common questions about our courses, certifications, and enrolment process.
            </p>
          </div>

          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <AccordionItem value={`faq-${i}`} className="card-neon px-0 border-none overflow-hidden">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/20 transition-colors group/q text-left">
                      <span className="font-semibold text-sm text-foreground group-hover/q:text-primary transition-colors">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
