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

const features = [
  { icon: Shield, title: "Industry-Relevant Training", description: "Courses designed with input from African cybersecurity leaders and aligned with international standards." },
  { icon: Users, title: "Expert African Instructors", description: "Learn from certified professionals who understand the unique challenges facing organizations across Africa." },
  { icon: BookOpen, title: "Hands-On Learning", description: "Practice in realistic lab environments with real-world scenarios and practical exercises." },
  { icon: Award, title: "Recognized Certifications", description: "Prepare for globally recognized certifications that advance your career anywhere in the world." },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--accent)/0.1),transparent_50%)]" />
        
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
              <Shield className="w-3 h-3 mr-1" /> Africa's Premier Cybersecurity Academy
            </Badge>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Securing Africa's{" "}
              <span className="text-gradient">Digital Future</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl">
              Master cybersecurity with practical, industry-relevant training designed for Africa's digital economy. 
              Join thousands of professionals protecting organizations across the continent.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" asChild>
                <Link to="/courses">
                  Explore Courses <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-border hover:bg-secondary">
                <Play className="w-4 h-4" /> Watch Demo
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>5,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>50+ Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>15+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose Cyber Defend Africa?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're building the next generation of African cybersecurity professionals with training that matters.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border-border card-hover">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Featured Courses
              </h2>
              <p className="text-muted-foreground">Start your cybersecurity journey with our most popular programs</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/courses">View All Courses <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.slice(0, 6).map((course) => (
              <Card key={course.id} className="bg-card border-border overflow-hidden card-hover group">
                <div className="relative overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge className="absolute top-3 left-3 bg-background/90 text-foreground">
                    {levelLabels[course.level]}
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <Badge variant="outline" className="mb-3 text-xs">
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
                    <span className="font-semibold text-primary">${course.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-4xl sm:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Success Stories from Across Africa
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from professionals who've transformed their careers with our training
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial) => (
              <Card key={testimonial.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.country}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Secure Your Future?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of professionals advancing their cybersecurity careers with Cyber Defend Africa Academy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}