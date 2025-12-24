import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, Users, Star, BookOpen, Award, CheckCircle, Play, FileText, HelpCircle, ArrowLeft } from "lucide-react";
import { getCourseBySlug } from "@/data/courses";
import { categoryLabels, levelLabels } from "@/types";
import { motion } from "framer-motion";

const lessonIcons = { video: Play, quiz: HelpCircle, lab: BookOpen, reading: FileText };

export default function CourseDetail() {
  const { slug } = useParams();
  const course = getCourseBySlug(slug || "");

  if (!course) {
    return (
      <Layout>
        <div className="container-custom section-padding text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course not found</h1>
          <Button asChild className="bg-gradient-to-r from-primary to-cyan"><Link to="/courses">Back to Courses</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--cyan)/0.1),transparent_50%)]" />
        <motion.div 
          className="container-custom relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/courses" className="inline-flex items-center text-muted-foreground hover:text-cyan mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Courses
          </Link>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="border-accent/50 text-accent">{categoryLabels[course.category]}</Badge>
                <Badge className="bg-gradient-to-r from-primary/20 to-cyan/20 text-cyan border-cyan/30">{levelLabels[course.level]}</Badge>
              </div>
              
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <img src={course.instructor.avatar} alt={course.instructor.name} className="w-10 h-10 rounded-full ring-2 ring-cyan/30" />
                  <div>
                    <div className="text-foreground font-medium">{course.instructor.name}</div>
                    <div className="text-muted-foreground text-xs">{course.instructor.title}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="w-4 h-4 text-accent fill-accent" /> {course.rating} rating
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4 text-cyan" /> {course.studentsCount.toLocaleString()} students
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card border-border hover:border-cyan/50 transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover rounded-t-lg" />
                </div>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan to-accent bg-clip-text text-transparent mb-4">${course.price}</div>
                  <Button className="w-full mb-4 bg-gradient-to-r from-primary to-cyan hover:from-primary/90 hover:to-cyan/90 shadow-lg shadow-primary/25 hover:shadow-cyan/30 hover:scale-105 transition-all duration-300" size="lg">
                    Enroll Now
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mb-6">14-day money-back guarantee</p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="w-4 h-4 text-cyan" /> <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <BookOpen className="w-4 h-4 text-accent" /> <span>{course.lessonsCount} lessons</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Award className="w-4 h-4 text-lime" /> <span>Certificate of completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* What You'll Learn */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">What You'll <span className="text-lime">Learn</span></h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.objectives.map((objective, index) => (
                    <motion.div 
                      key={index} 
                      className="flex gap-3 group"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CheckCircle className="w-5 h-5 text-lime shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{objective}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Curriculum */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Course <span className="text-cyan">Curriculum</span></h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {course.curriculum.map((section, index) => (
                    <AccordionItem key={index} value={`section-${index}`} className="border border-border rounded-lg px-4 hover:border-cyan/30 transition-all duration-300">
                      <AccordionTrigger className="hover:no-underline group">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground group-hover:text-cyan transition-colors">{section.title}</span>
                          <Badge variant="outline" className="text-xs border-accent/50 text-accent">{section.lessons.length} lessons</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pb-2">
                          {section.lessons.map((lesson, lessonIndex) => {
                            const Icon = lessonIcons[lesson.type];
                            return (
                              <div key={lessonIndex} className="flex items-center justify-between py-2 text-sm group/lesson hover:bg-secondary/30 px-2 rounded transition-colors">
                                <div className="flex items-center gap-3">
                                  <Icon className="w-4 h-4 text-cyan" />
                                  <span className="text-muted-foreground group-hover/lesson:text-foreground transition-colors">{lesson.title}</span>
                                </div>
                                <span className="text-muted-foreground">{lesson.duration}</span>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                      {req}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Instructor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card border-border sticky top-24 hover:border-accent/50 transition-all duration-300 group">
                <CardContent className="p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Your <span className="text-accent">Instructor</span></h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={course.instructor.avatar} alt={course.instructor.name} className="w-16 h-16 rounded-full ring-2 ring-accent/30 group-hover:ring-accent/50 transition-all" />
                    <div>
                      <div className="font-semibold text-foreground group-hover:text-accent transition-colors">{course.instructor.name}</div>
                      <div className="text-sm text-muted-foreground">{course.instructor.title}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{course.instructor.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {course.instructor.expertise.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs border-cyan/50 text-cyan hover:bg-cyan/10 transition-colors">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
