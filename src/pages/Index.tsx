import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CyberGrid } from "@/components/ui/CyberGrid";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, BookOpen, Users, Award, Lock, CheckCircle, Zap, Globe, Headphones } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { FeatureCards } from "@/components/home/FeatureCards";
import { HeroHighlights } from "@/components/home/HeroHighlights";

const Index = () => {
  const [stats, setStats] = useState<{ label: string; stat_value: string; icon: string | null }[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("platform_stats").select("label, stat_value, icon").order("sort_order").then(({ data }) => { if (data) setStats(data); });
    supabase.from("courses").select("id, title, slug, short_description, thumbnail, price, original_price, level, category, rating, students_count, instructor_name").eq("is_published", true).eq("is_featured", true).limit(6).then(({ data }) => { if (data) setFeaturedCourses(data); });
    supabase.from("testimonials").select("*").eq("is_featured", true).limit(3).then(({ data }) => { if (data) setTestimonials(data); });
  }, []);

  const statIcons: Record<string, React.ReactNode> = {
    users: <Users className="w-6 h-6" />,
    courses: <BookOpen className="w-6 h-6" />,
    certificates: <Award className="w-6 h-6" />,
    security: <Lock className="w-6 h-6" />,
  };

  return (
    <Layout>
      {/* Hero Section — starts at top of viewport, image visible below header */}
      <section className="relative min-h-[92vh] -mt-20 pt-20 flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero-bg.jpeg')",
            filter: "brightness(0.55) contrast(1.05) saturate(1.3)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-background" />

        <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-8"
            >
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white/90">Africa's Premier Cybersecurity Academy</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6 text-white">
              Securing Africa's{" "}
              <span className="text-primary">Digital Future</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 italic mb-3 font-body">
              Train with the Best in the Industry
            </p>

            <p className="text-base md:text-lg text-white/60 mb-10 max-w-2xl leading-relaxed font-body">
              Master cybersecurity with practical, industry-relevant training designed for Africa's digital 
              economy. Join thousands of professionals protecting organizations across the continent.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-destructive hover:bg-destructive/90 text-white font-semibold text-base px-8 shadow-lg">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 text-base px-8">
                  View Courses
                </Button>
              </Link>
            </div>

            <HeroHighlights />
          </motion.div>
        </div>
      </section>

      {/* Stats Section — clean, large numbers like reference */}
      {stats.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <p className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">{stat.stat_value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners Marquee */}
      <PartnersMarquee />

      {/* Empowering Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              Empowering the Next Generation of <span className="text-primary">Cyber Defenders</span>
            </h2>
          </div>
        </div>
      </section>

      {/* Feature Cards — Industry-Ready Skills */}
      <FeatureCards />

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Popular Programs</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Featured <span className="text-primary">Courses</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Start your cybersecurity career with our most popular training programs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/courses/${course.slug}`}>
                    <div className="group glass-card rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-12 h-12 text-muted-foreground/30" /></div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 text-xs font-medium rounded bg-primary/90 text-primary-foreground">{course.level}</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-sm font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.short_description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{course.instructor_name}</span>
                          <div className="flex items-center gap-2">
                            {course.original_price && course.original_price > course.price && (
                              <span className="text-xs text-muted-foreground line-through">${course.original_price}</span>
                            )}
                            <span className="text-sm font-bold text-primary">{course.price === 0 ? "Free" : `$${course.price}`}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/courses">
                <Button variant="outline" size="lg" className="border-primary/30">
                  View All Courses <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Why Choose <span className="text-primary">CDAA</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide world-class cybersecurity education tailored for Africa's digital landscape
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle, title: "Industry Certified", desc: "Courses aligned with globally recognized certifications" },
              { icon: Zap, title: "Hands-on Labs", desc: "Practice in real-world environments with guided exercises" },
              { icon: Globe, title: "Africa Focused", desc: "Content tailored to address Africa's unique cyber challenges" },
              { icon: Headphones, title: "Expert Support", desc: "Get help from certified cybersecurity professionals" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl text-center hover:border-primary/50 transition-all"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-sm font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — Success Stories */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold mb-4">
                Success Stories from <span className="text-primary">Across Africa</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from professionals who've transformed their careers with our training
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-2xl p-7 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-1 mb-5">
                    {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                      <span key={idx} className="text-amber-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 italic leading-relaxed">
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base">
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        t.name?.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.role}{t.country ? `, ${t.country}` : t.company ? ` at ${t.company}` : ""}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <CyberGrid />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Defend the Digital World?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of cybersecurity professionals trained by CDAA Academy. Start your journey today.
          </p>
          <Link to="/auth">
            <Button size="lg" className="gradient-primary text-primary-foreground font-semibold text-base px-10">
              Start Learning Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
