import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, BookOpen, Globe, TrendingUp, CheckCircle, Star, ArrowRight, Play, Award, Clock, ChevronRight } from "lucide-react";
import { featuredCourses } from "@/data/courses";
import { testimonials } from "@/data/testimonials";
import { stats } from "@/data/team";
import { categoryLabels, levelLabels } from "@/types";
import { motion } from "framer-motion";

const features = [
  { icon: Shield, title: "Industry-Relevant Training", description: "Courses designed with input from African cybersecurity leaders and aligned with international standards." },
  { icon: Users, title: "Expert African Instructors", description: "Learn from certified professionals who understand the unique challenges facing organizations across Africa." },
  { icon: BookOpen, title: "Hands-On Learning", description: "Practice in realistic lab environments with real-world scenarios and practical exercises." },
  { icon: Award, title: "Recognized Certifications", description: "Prepare for globally recognized certifications that advance your career anywhere in the world." },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--accent)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--cyan)/0.05),transparent_40%)]" />
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-r from-primary/20 to-cyan/20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-gradient-to-r from-accent/20 to-magenta/10 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <div className="container-custom relative z-10 py-20">
          <motion.div 
            className="max-w-3xl"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 bg-gradient-to-r from-primary/20 to-cyan/20 text-cyan border-cyan/30 hover:bg-cyan/30 transition-all duration-300">
                <Shield className="w-3 h-3 mr-1" /> Africa's Premier Cybersecurity Academy
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
              variants={fadeInUp}
            >
              Securing Africa's{" "}
              <span className="bg-gradient-to-r from-primary via-cyan to-accent bg-clip-text text-transparent">Digital Future</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl"
              variants={fadeInUp}
            >
              Master cybersecurity with practical, industry-relevant training designed for Africa's digital economy. 
              Join thousands of professionals protecting organizations across the continent.
            </motion.p>
            
            <motion.div className="flex flex-wrap gap-4" variants={fadeInUp}>
              <Button size="lg" className="bg-gradient-to-r from-primary to-cyan hover:from-primary/90 hover:to-cyan/90 text-primary-foreground gap-2 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-cyan/30 hover:scale-105" asChild>
                <Link to="/courses">
                  Explore Courses <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-border hover:bg-secondary hover:border-cyan/50 transition-all duration-300 hover:scale-105 group">
                <Play className="w-4 h-4 group-hover:text-cyan transition-colors" /> Watch Demo
              </Button>
            </motion.div>

            <motion.div 
              className="mt-12 flex flex-wrap items-center gap-8 text-sm text-muted-foreground"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-lime" />
                <span>5,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan" />
                <span>50+ Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>15+ Countries</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose <span className="text-cyan">Cyber Defend Africa?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're building the next generation of African cybersecurity professionals with training that matters.
            </p>
          </motion.div>

          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-card border-border card-hover group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-cyan/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:from-primary/30 group-hover:to-cyan/30 transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-cyan group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-cyan transition-colors">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div 
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Featured <span className="text-accent">Courses</span>
              </h2>
              <p className="text-muted-foreground">Start your cybersecurity journey with our most popular programs</p>
            </div>
            <Button variant="outline" className="hover:border-accent/50 hover:text-accent transition-all duration-300 group" asChild>
              <Link to="/courses">View All Courses <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </motion.div>

          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {featuredCourses.slice(0, 6).map((course, index) => (
              <motion.div key={course.id} variants={fadeInUp}>
                <Link to={`/courses/${course.slug}`}>
                  <Card className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 h-full">
                    <div className="relative overflow-hidden">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Badge className="absolute top-3 left-3 bg-background/90 text-foreground">
                        {levelLabels[course.level]}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <Badge variant="outline" className="mb-3 text-xs border-accent/50 text-accent">
                        {categoryLabels[course.category]}
                      </Badge>
                      <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.shortDescription}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-accent fill-accent" /> {course.rating}
                          </span>
                        </div>
                        <span className="font-semibold text-cyan">${course.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-primary/10 via-cyan/5 to-accent/10">
        <div className="container-custom">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                <div className="font-display text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-cyan to-accent bg-clip-text text-transparent mb-2 group-hover:from-cyan group-hover:to-lime transition-all duration-300">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Success Stories from <span className="text-lime">Across Africa</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from professionals who've transformed their careers with our training
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {testimonials.slice(0, 3).map((testimonial) => (
              <motion.div key={testimonial.id} variants={fadeInUp}>
                <Card className="bg-card border-border hover:border-accent/30 transition-all duration-300 group h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-accent fill-accent group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }} />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-accent/50 transition-all" />
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-accent transition-colors">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.country}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="section-padding bg-gradient-to-r from-primary/20 via-cyan/10 to-accent/20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--cyan)/0.1),transparent_60%)]" />
        <div className="container-custom text-center relative z-10">
          <motion.h2 
            className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to <span className="bg-gradient-to-r from-cyan to-accent bg-clip-text text-transparent">Secure Your Future?</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join thousands of professionals advancing their cybersecurity careers with Cyber Defend Africa Academy.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button size="lg" className="bg-gradient-to-r from-primary to-cyan hover:from-primary/90 hover:to-cyan/90 shadow-lg shadow-primary/25 hover:shadow-cyan/30 hover:scale-105 transition-all duration-300" asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
            <Button size="lg" variant="outline" className="hover:border-accent/50 hover:scale-105 transition-all duration-300" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  );
}
