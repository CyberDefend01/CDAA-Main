import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CyberGrid } from "@/components/ui/CyberGrid";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, BookOpen, Users, Award, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const Index = () => {
  const [stats, setStats] = useState<{ label: string; stat_value: string; icon: string | null }[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("platform_stats")
      .select("label, stat_value, icon")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setStats(data);
      });

    supabase
      .from("courses")
      .select("id, title, slug, short_description, thumbnail, price, original_price, level, category, rating, students_count, instructor_name")
      .eq("is_published", true)
      .eq("is_featured", true)
      .limit(6)
      .then(({ data }) => {
        if (data) setFeaturedCourses(data);
      });
  }, []);

  const statIcons: Record<string, React.ReactNode> = {
    users: <Users className="w-6 h-6" />,
    courses: <BookOpen className="w-6 h-6" />,
    certificates: <Award className="w-6 h-6" />,
    security: <Lock className="w-6 h-6" />,
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <CyberGrid />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/images/hero-bg.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-primary">Cyber Defence Academy Africa</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
              Master{" "}
              <span className="text-primary text-glow">Cybersecurity</span>{" "}
              with Expert Training
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Africa's premier cybersecurity training academy. Learn penetration testing, 
              network security, incident response, and more from industry experts.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/courses">
                <Button size="lg" className="gradient-primary text-primary-foreground font-semibold text-base px-8">
                  Explore Courses
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-primary/30 text-base px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {stats.length > 0 && (
        <section className="py-16 border-y border-border/50">
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
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {statIcons[stat.icon || "security"] || <Shield className="w-6 h-6" />}
                  </div>
                  <p className="text-3xl font-display font-bold text-foreground">{stat.stat_value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
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
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 text-xs font-medium rounded bg-primary/90 text-primary-foreground">
                            {course.level}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-sm font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {course.short_description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{course.instructor_name}</span>
                          <div className="flex items-center gap-2">
                            {course.original_price && course.original_price > course.price && (
                              <span className="text-xs text-muted-foreground line-through">
                                ${course.original_price}
                              </span>
                            )}
                            <span className="text-sm font-bold text-primary">
                              {course.price === 0 ? "Free" : `$${course.price}`}
                            </span>
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
                  View All Courses
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
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
            Join thousands of cybersecurity professionals trained by CDAA Academy.
            Start your journey today.
          </p>
          <Link to="/auth">
            <Button size="lg" className="gradient-primary text-primary-foreground font-semibold text-base px-10">
              Start Learning Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
