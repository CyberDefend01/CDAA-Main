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

import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Award, 
  Lock, 
  CheckCircle, 
  Zap, 
  Globe, 
  Headphones,
  Play,
  ChevronDown,
  Sparkles,
  Target,
  TrendingUp,
  BadgeCheck,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

// Animated counter component
const AnimatedCounter = ({ value, suffix = "" }: { value: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const numericValue = parseInt(value.replace(/\D/g, "")) || 0;
  
  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [isInView, numericValue]);
  
  const formattedValue = value.replace(/\d+/, count.toString());
  return <span ref={ref}>{formattedValue}{suffix}</span>;
};

// Glass card component
const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500">
      {children}
    </div>
  </div>
);

const Index = () => {
  const [stats, setStats] = useState<{ label: string; stat_value: string; icon: string | null }[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    supabase.from("platform_stats").select("label, stat_value, icon").order("sort_order").then(({ data }) => { 
      if (data) setStats(data); 
    });
    supabase.from("courses").select("id, title, slug, short_description, thumbnail, price, original_price, level, category, rating, students_count, instructor_name").eq("is_published", true).eq("is_featured", true).limit(6).then(({ data }) => { 
      if (data) setFeaturedCourses(data); 
    });
    supabase.from("testimonials").select("*").eq("is_featured", true).limit(3).then(({ data }) => { 
      if (data) setTestimonials(data); 
    });
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % (testimonials.length || 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const statIcons: Record<string, React.ReactNode> = {
    users: <Users className="w-6 h-6" />,
    courses: <BookOpen className="w-6 h-6" />,
    certificates: <Award className="w-6 h-6" />,
    security: <Lock className="w-6 h-6" />,
  };

  return (
    <Layout>
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-20" />
        
        {/* Floating Orbs */}
        <motion.div 
          style={{ x: mouseX, y: mouseY }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px]"
        />
        <motion.div 
          style={{ x: useTransform(mouseX, v => -v * 1.5), y: useTransform(mouseY, v => -v * 1.5) }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]"
        />

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="container relative z-10 mx-auto px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-white/90">Africa's Premier Cybersecurity Academy</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">NEW</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6"
            >
              <motion.span 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="block text-white"
              >
                Securing Africa's
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="block bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
              >
                Digital Future
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/60 mb-4 font-light italic"
            >
              "Train with the Best in the Industry"
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base md:text-lg text-white/40 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Master cybersecurity with practical, industry-relevant training designed for Africa's digital economy. Join thousands of professionals protecting organizations across the continent.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center mb-16"
            >
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base px-8 h-14 rounded-full shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10 h-14 px-8 rounded-full"
                >
                  <Play className="mr-2 w-5 h-5" />
                  View Courses
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-8 text-white/40 text-sm"
            >
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-blue-500" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span>95% Placement Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>24/7 Lab Access</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-white/40"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      {stats.length > 0 && (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="group"
                >
                  <GlassCard className="h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                        <div className="text-blue-500">
                          {statIcons[stat.icon || "users"] || <TrendingUp className="w-6 h-6" />}
                        </div>
                      </div>
                      <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                        <AnimatedCounter value={stat.stat_value} />
                      </p>
                      <p className="text-sm text-white/50 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Partners Section */}
      <section className="py-16 bg-slate-950 border-y border-white/5">
        <div className="container mx-auto px-4 mb-8">
          <p className="text-center text-sm text-white/40 uppercase tracking-widest">Trusted by leading organizations across Africa</p>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />
          
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 items-center"
          >
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-32 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white/20 font-semibold">
                Partner {i + 1}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-32 bg-slate-950 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Why Choose CDAA
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Built for <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Security Professionals</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              World-class cybersecurity education tailored for Africa's unique digital landscape
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Large Feature Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 md:row-span-2"
            >
              <GlassCard className="h-full">
                <div className="h-full flex flex-col justify-between min-h-[400px]">
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center mb-6">
                      <CheckCircle className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Industry Certified Curriculum</h3>
                    <p className="text-white/60 text-lg leading-relaxed">
                      Our courses are aligned with globally recognized certifications including CISSP, CEH, CompTIA Security+, and ISO 27001. Get certified and recognized worldwide.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-8">
                    {["CISSP", "CEH", "Security+", "ISO 27001"].map((cert) => (
                      <span key={cert} className="px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-semibold">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Small Cards */}
            {[
              { icon: Zap, title: "Hands-on Labs", desc: "Practice in real-world environments with guided exercises and live threat simulations." },
              { icon: Globe, title: "Africa Focused", desc: "Content tailored to address Africa's unique cyber challenges and compliance requirements." },
              { icon: Headphones, title: "Expert Support", desc: "Get 24/7 help from certified cybersecurity professionals with industry experience." }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <GlassCard className="h-full">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-32 bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-blue-500/5" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-16"
            >
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                  <BookOpen className="w-4 h-4" />
                  Featured Programs
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  Start Your <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Journey</span>
                </h2>
              </div>
              <Link to="/courses" className="mt-6 md:mt-0">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full">
                  View All Courses <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <Link to={`/courses/${course.slug}`}>
                    <div className="group relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500">
                        <div className="aspect-video relative overflow-hidden">
                          {course.thumbnail ? (
                            <img 
                              src={course.thumbnail} 
                              alt={course.title} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                              loading="lazy" 
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-white/20" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full bg-blue-500/90 text-white text-xs font-semibold">
                              {course.level}
                            </span>
                          </div>
                          {course.original_price && (
                            <div className="absolute top-4 right-4">
                              <span className="px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-semibold">
                                Sale
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 text-white/40 text-xs mb-3">
                            <span>{course.category}</span>
                            <span>•</span>
                            <span>{course.students_count?.toLocaleString()} students</span>
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-white/50 text-sm mb-4 line-clamp-2">{course.short_description}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-semibold">
                                {course.instructor_name?.charAt(0)}
                              </div>
                              <span className="text-sm text-white/60">{course.instructor_name}</span>
                            </div>
                            <div className="text-right">
                              {course.original_price && (
                                <span className="text-sm text-white/40 line-through mr-2">${course.original_price}</span>
                              )}
                              <span className="text-lg font-bold text-blue-400">${course.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-32 bg-slate-950 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                Success Stories
              </span>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Trusted Across <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Africa</span>
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {testimonials.map((t, index) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: activeTestimonial === index ? 1 : 0,
                      scale: activeTestimonial === index ? 1 : 0.9,
                      display: activeTestimonial === index ? "block" : "none"
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <GlassCard>
                      <div className="text-center py-8">
                        <div className="flex justify-center gap-1 mb-6">
                          {[...Array(t.rating || 5)].map((_, idx) => (
                            <Star key={idx} className="w-6 h-6 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-2xl md:text-3xl text-white/90 font-light italic leading-relaxed mb-8">
                          "{t.content}"
                        </p>
                        <div className="flex items-center justify-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-blue-400 text-xl font-bold">
                            {t.avatar ? (
                              <img src={t.avatar} alt={t.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              t.name?.charAt(0)
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-lg font-semibold text-white">{t.name}</p>
                            <p className="text-white/50">
                              {t.role}{t.country ? `, ${t.country}` : t.company ? ` at ${t.company}` : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}

                {/* Navigation */}
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button 
                    onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${activeTestimonial === index ? "bg-blue-500 w-8" : "bg-white/20 w-2 hover:bg-white/40"}`}
                      />
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-32 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 mb-8"
            >
              <Shield className="w-10 h-10 text-blue-500" />
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Defend the <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Digital World?</span>
            </h2>
            <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto">
              Join thousands of cybersecurity professionals trained by CDAA Academy. Your journey to becoming a security expert starts here.
            </p>
            
            <Link to="/auth">
              <Button 
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg px-12 h-16 rounded-full shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
              >
                Start Learning Now <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>

            <p className="mt-8 text-white/30 text-sm">
              No credit card required • Free trial available • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
