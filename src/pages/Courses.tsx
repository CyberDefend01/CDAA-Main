import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Clock, Star, Users, Filter } from "lucide-react";
import { courses } from "@/data/courses";
import { categoryLabels, levelLabels, CourseCategory, CourseLevel } from "@/types";

const categories = Object.entries(categoryLabels);
const levels = Object.entries(levelLabels);

export default function Courses() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | "all">("all");
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | "all">("all");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="container-custom">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Explore Our Courses
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            From fundamentals to advanced techniques, find the perfect course to advance your cybersecurity career.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                  />
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Categories
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === "all" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory("all")}
                    >
                      All Categories
                    </Button>
                    {categories.map(([key, label]) => (
                      <Button
                        key={key}
                        variant={selectedCategory === key ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => setSelectedCategory(key as CourseCategory)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Levels */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Level</h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedLevel === "all" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedLevel("all")}
                    >
                      All Levels
                    </Button>
                    {levels.map(([key, label]) => (
                      <Button
                        key={key}
                        variant={selectedLevel === key ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedLevel(key as CourseLevel)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Course Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="text-foreground font-medium">{filteredCourses.length}</span> courses
                </p>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Link key={course.id} to={`/courses/${course.slug}`}>
                    <Card className="bg-card border-border overflow-hidden card-hover group h-full">
                      <div className="relative overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
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

                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" /> {course.studentsCount.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-accent fill-accent" />
                            <span className="font-medium text-foreground">{course.rating}</span>
                          </div>
                          <span className="font-bold text-primary text-lg">${course.price}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No courses found matching your criteria.</p>
                  <Button variant="link" onClick={() => { setSearch(""); setSelectedCategory("all"); setSelectedLevel("all"); }}>
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}