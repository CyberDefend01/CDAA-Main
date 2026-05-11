import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Save, Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface Lesson {
  id?: string;
  title: string;
  lesson_type: string;
  duration: string;
  video_url: string;
  content: string;
  sort_order: number;
}

interface Section {
  id?: string;
  section_title: string;
  sort_order: number;
  lessons: Lesson[];
}

export default function InstructorCurriculumEditor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [courseId, setCourseId] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [originalSections, setOriginalSections] = useState<Section[]>([]);

  const { data: courses } = useQuery({
    queryKey: ["instructor-courses-for-curriculum"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("courses")
        .select("id, title")
        .eq("instructor_id", user.id)
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["curriculum", courseId],
    queryFn: async () => {
      if (!courseId) return null;
      const { data: secs, error: secErr } = await supabase
        .from("course_curriculum")
        .select("*")
        .eq("course_id", courseId)
        .order("sort_order");
      if (secErr) throw secErr;

      const { data: lessons, error: lesErr } = await supabase
        .from("curriculum_lessons")
        .select("*")
        .in("curriculum_id", (secs || []).map((s: any) => s.id))
        .order("sort_order");
      if (lesErr) throw lesErr;

      return (secs || []).map((s: any) => ({
        id: s.id,
        section_title: s.section_title,
        sort_order: s.sort_order || 0,
        lessons: (lessons || [])
          .filter((l: any) => l.curriculum_id === s.id)
          .map((l: any) => ({
            id: l.id,
            title: l.title,
            lesson_type: l.lesson_type || "video",
            duration: l.duration || "",
            video_url: l.video_url || "",
            content: l.content || "",
            sort_order: l.sort_order || 0,
          })),
      })) as Section[];
    },
    enabled: !!courseId,
  });

  useEffect(() => {
    if (existingData) {
      setSections(existingData);
      setOriginalSections(existingData);
    }
  }, [existingData]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!courseId) throw new Error("Select a course");

      // Delete removed sections
      const origIds = originalSections.map(s => s.id).filter(Boolean);
      const currIds = sections.filter(s => s.id).map(s => s.id);
      const deletedSectionIds = origIds.filter(id => !currIds.includes(id));
      
      if (deletedSectionIds.length > 0) {
        // Delete lessons first
        await supabase.from("curriculum_lessons").delete().in("curriculum_id", deletedSectionIds as string[]);
        await supabase.from("course_curriculum").delete().in("id", deletedSectionIds as string[]);
      }

      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        let sectionId = sec.id;

        if (sec.id) {
          const { error } = await supabase
            .from("course_curriculum")
            .update({ section_title: sec.section_title, sort_order: i })
            .eq("id", sec.id);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from("course_curriculum")
            .insert({ course_id: courseId, section_title: sec.section_title, sort_order: i })
            .select("id")
            .single();
          if (error) throw error;
          sectionId = data.id;
        }

        // Handle deleted lessons
        const origSection = originalSections.find(os => os.id === sec.id);
        if (origSection) {
          const origLessonIds = origSection.lessons.map(l => l.id).filter(Boolean);
          const currLessonIds = sec.lessons.filter(l => l.id).map(l => l.id);
          const deletedLessonIds = origLessonIds.filter(id => !currLessonIds.includes(id));
          if (deletedLessonIds.length > 0) {
            await supabase.from("curriculum_lessons").delete().in("id", deletedLessonIds as string[]);
          }
        }

        // Upsert lessons
        for (let j = 0; j < sec.lessons.length; j++) {
          const lesson = sec.lessons[j];
          if (lesson.id) {
            const { error } = await supabase
              .from("curriculum_lessons")
              .update({
                title: lesson.title,
                lesson_type: lesson.lesson_type,
                duration: lesson.duration || null,
                video_url: lesson.video_url || null,
                content: lesson.content || null,
                sort_order: j,
              })
              .eq("id", lesson.id);
            if (error) throw error;
          } else {
            const { error } = await supabase
              .from("curriculum_lessons")
              .insert({
                curriculum_id: sectionId,
                title: lesson.title,
                lesson_type: lesson.lesson_type,
                duration: lesson.duration || null,
                video_url: lesson.video_url || null,
                content: lesson.content || null,
                sort_order: j,
              });
            if (error) throw error;
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculum", courseId] });
      toast.success("Curriculum saved!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to save");
    },
  });

  const addSection = () => {
    setSections([...sections, { section_title: "", sort_order: sections.length, lessons: [] }]);
  };

  const removeSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const updateSection = (idx: number, field: string, value: string) => {
    const updated = [...sections];
    (updated[idx] as any)[field] = value;
    setSections(updated);
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const updated = [...sections];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    setSections(updated);
  };

  const addLesson = (sectionIdx: number) => {
    const updated = [...sections];
    updated[sectionIdx].lessons.push({
      title: "", lesson_type: "video", duration: "", video_url: "", content: "", sort_order: updated[sectionIdx].lessons.length,
    });
    setSections(updated);
  };

  const removeLesson = (sectionIdx: number, lessonIdx: number) => {
    const updated = [...sections];
    updated[sectionIdx].lessons = updated[sectionIdx].lessons.filter((_, i) => i !== lessonIdx);
    setSections(updated);
  };

  const updateLesson = (sectionIdx: number, lessonIdx: number, field: string, value: string) => {
    const updated = [...sections];
    (updated[sectionIdx].lessons[lessonIdx] as any)[field] = value;
    setSections(updated);
  };

  const moveLesson = (sectionIdx: number, lessonIdx: number, dir: -1 | 1) => {
    const newIdx = lessonIdx + dir;
    const lessons = sections[sectionIdx].lessons;
    if (newIdx < 0 || newIdx >= lessons.length) return;
    const updated = [...sections];
    const arr = [...updated[sectionIdx].lessons];
    [arr[lessonIdx], arr[newIdx]] = [arr[newIdx], arr[lessonIdx]];
    updated[sectionIdx].lessons = arr;
    setSections(updated);
  };

  return (
    <DashboardLayout type="instructor">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/instructor/courses")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Curriculum Editor</h1>
            <p className="text-muted-foreground">Manage course sections and lessons</p>
          </div>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !courseId}>
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Curriculum"}
          </Button>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label>Select Course *</Label>
              <Select value={courseId} onValueChange={(v) => { setCourseId(v); setSections([]); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {courseId && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Sections ({sections.length})</h2>
              <Button onClick={addSection}>
                <Plus className="h-4 w-4 mr-2" /> Add Section
              </Button>
            </div>

            {sections.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No sections yet. Add your first section!</p>
                  <Button onClick={addSection}><Plus className="h-4 w-4 mr-2" /> Add Section</Button>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="multiple" className="space-y-4">
                {sections.map((section, sIdx) => (
                  <AccordionItem key={sIdx} value={`section-${sIdx}`} className="border border-border rounded-lg bg-card">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-3 flex-1">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">
                          {section.section_title || `Section ${sIdx + 1}`}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({section.lessons.length} lessons)
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 space-y-4">
                      <div className="flex items-end gap-3">
                        <div className="flex-1 space-y-2">
                          <Label>Section Title</Label>
                          <Input
                            value={section.section_title}
                            onChange={(e) => updateSection(sIdx, "section_title", e.target.value)}
                            placeholder="e.g. Introduction"
                          />
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => moveSection(sIdx, -1)} disabled={sIdx === 0}>
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => moveSection(sIdx, 1)} disabled={sIdx === sections.length - 1}>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeSection(sIdx)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Lessons */}
                      <div className="space-y-3 pl-4 border-l-2 border-border">
                        {section.lessons.map((lesson, lIdx) => (
                          <Card key={lIdx} className="bg-secondary/30 border-border">
                            <CardContent className="pt-4 space-y-3">
                              <div className="flex items-start gap-2">
                                <div className="flex-1 grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <Label className="text-xs">Title</Label>
                                    <Input
                                      value={lesson.title}
                                      onChange={(e) => updateLesson(sIdx, lIdx, "title", e.target.value)}
                                      placeholder="Lesson title"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Type</Label>
                                    <Select value={lesson.lesson_type} onValueChange={(v) => updateLesson(sIdx, lIdx, "lesson_type", v)}>
                                      <SelectTrigger><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="reading">Reading</SelectItem>
                                        <SelectItem value="quiz">Quiz</SelectItem>
                                        <SelectItem value="lab">Lab</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Duration</Label>
                                    <Input
                                      value={lesson.duration}
                                      onChange={(e) => updateLesson(sIdx, lIdx, "duration", e.target.value)}
                                      placeholder="e.g. 15 min"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Video URL</Label>
                                    <Input
                                      value={lesson.video_url}
                                      onChange={(e) => updateLesson(sIdx, lIdx, "video_url", e.target.value)}
                                      placeholder="https://..."
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1 pt-5">
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveLesson(sIdx, lIdx, -1)} disabled={lIdx === 0}>
                                    <ChevronUp className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveLesson(sIdx, lIdx, 1)} disabled={lIdx === section.lessons.length - 1}>
                                    <ChevronDown className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeLesson(sIdx, lIdx)}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              {(lesson.lesson_type === "reading" || lesson.lesson_type === "lab") && (
                                <div className="space-y-1">
                                  <Label className="text-xs">Content</Label>
                                  <Textarea
                                    value={lesson.content}
                                    onChange={(e) => updateLesson(sIdx, lIdx, "content", e.target.value)}
                                    placeholder="Lesson content..."
                                    rows={3}
                                  />
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => addLesson(sIdx)}>
                          <Plus className="h-3 w-3 mr-1" /> Add Lesson
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
