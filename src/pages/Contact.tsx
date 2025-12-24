import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { faqs } from "@/data/team";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-16">
        <div className="container-custom">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Contact Us</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Have questions about our courses or need help choosing the right program? We're here to help.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <CardContent className="p-8">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                        <Input placeholder="John Doe" className="bg-secondary border-border" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                        <Input type="email" placeholder="john@example.com" className="bg-secondary border-border" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                      <Input placeholder="How can we help?" className="bg-secondary border-border" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                      <Textarea placeholder="Tell us more about your inquiry..." className="bg-secondary border-border min-h-[150px]" required />
                    </div>
                    <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90">
                      <Send className="w-4 h-4 mr-2" /> Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                      <p className="text-muted-foreground text-sm">info@cyberdefendafrica.com</p>
                      <p className="text-muted-foreground text-sm">support@cyberdefendafrica.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
                      <p className="text-muted-foreground text-sm">+234 800 123 4567</p>
                      <p className="text-muted-foreground text-sm">Mon-Fri, 9am-5pm WAT</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Visit Us</h3>
                      <p className="text-muted-foreground text-sm">Victoria Island, Lagos, Nigeria</p>
                      <p className="text-muted-foreground text-sm">(By appointment only)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <MessageSquare className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our courses, certifications, and enrollment process.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="border border-border rounded-lg px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline text-left">
                    <span className="font-medium text-foreground">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground pb-2">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </Layout>
  );
}