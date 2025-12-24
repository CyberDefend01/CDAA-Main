import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, Users, Star, BookOpen, Award, CheckCircle, Play, FileText, HelpCircle, ArrowLeft } from "lucide-react";
import { getCourseBySlug } from "@/data/courses";
import { categoryLabels, levelLabels } from "@/types";

const lessonIcons = { video: Play, quiz: HelpCircle, lab: BookOpen, reading: FileText };

export default function CourseDetail() {
  const { slug } = useParams();
  const course = getCourseBySlug(slug || "");

  if (!course) {
    return (
      <Layout>
        <div className="container-custom section-padding text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course not found</h1>
          <Button asChild><Link to="/courses">Back to Courses</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-12">
        <div className="container-custom">
          <Link to="/courses" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
          </Link>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{categoryLabels[course.category]}</Badge>
                <Badge className="bg-primary/20 text-primary">{levelLabels[course.level]}</Badge>
              </div>
              
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <img src={course.instructor.avatar} alt={course.instructor.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="text-foreground font-medium">{course.instructor.name}</div>
                    <div className="text-muted-foreground text-xs">{course.instructor.title}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="w-4 h-4 text-accent fill-accent" /> {course.rating} rating
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" /> {course.studentsCount.toLocaleString()} students
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <Card className="bg-card border-border">
              <div className="relative">
                <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover rounded-t-lg" />
              </div>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-foreground mb-4">${course.price}</div>
                <Button className="w-full mb-4 bg-primary hover:bg-primary/90" size="lg">
                  Enroll Now
                </Button>
                <p className="text-center text-sm text-muted-foreground mb-6">14-day money-back guarantee</p>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-4 h-4" /> <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <BookOpen className="w-4 h-4" /> <span>{course.lessonsCount} lessons</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Award className="w-4 h-4" /> <span>Certificate of completion</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* What You'll Learn */}
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">What You'll Learn</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.objectives.map((objective, index) => (
                    <div key={index} className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum */}
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Course Curriculum</h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {course.curriculum.map((section, index) => (
                    <AccordionItem key={index} value={`section-${index}`} className="border border-border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground">{section.title}</span>
                          <Badge variant="outline" className="text-xs">{section.lessons.length} lessons</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pb-2">
                          {section.lessons.map((lesson, lessonIndex) => {
                            const Icon = lessonIcons[lesson.type];
                            return (
                              <div key={lessonIndex} className="flex items-center justify-between py-2 text-sm">
                                <div className="flex items-center gap-3">
                                  <Icon className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{lesson.title}</span>
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
              </div>

              {/* Requirements */}
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructor */}
            <div>
              <Card className="bg-card border-border sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Your Instructor</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={course.instructor.avatar} alt={course.instructor.name} className="w-16 h-16 rounded-full" />
                    <div>
                      <div className="font-semibold text-foreground">{course.instructor.name}</div>
                      <div className="text-sm text-muted-foreground">{course.instructor.title}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{course.instructor.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {course.instructor.expertise.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}