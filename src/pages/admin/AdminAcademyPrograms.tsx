import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Award, GraduationCap, Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  useAcademyCertCategories,
  useAcademyDiplomaPhases,
  useAcademyDiplomaMeta,
  type AcademyCertCourse,
  type AcademyDiplomaPhase,
} from "@/hooks/useAcademyPrograms";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminAcademyPrograms() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading: catsLoading } = useAcademyCertCategories();
  const { data: phases, isLoading: phasesLoading } = useAcademyDiplomaPhases();
  const { data: meta, isLoading: metaLoading } = useAcademyDiplomaMeta();

  const outcomes = meta?.filter((m) => m.meta_type === "outcome") || [];
  const includes = meta?.filter((m) => m.meta_type === "includes") || [];

  const [editCourseModal, setEditCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState("");
  const [courseForm, setCourseForm] = useState({
    title: "", duration: "", level: "Beginner", skills: "", tools: "", certification: "",
  });
  const [saving, setSaving] = useState(false);

  const [editPhaseModal, setEditPhaseModal] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState("");
  const [phaseForm, setPhaseForm] = useState({ title: "", months: "" });

  const handleEditCourse = (course: AcademyCertCourse) => {
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title,
      duration: course.duration,
      level: course.level,
      skills: course.skills.join(", "),
      tools: course.tools.join(", "),
      certification: course.certification,
    });
    setEditCourseModal(true);
  };

  const handleSaveCourse = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("academy_cert_courses")
        .update({
          title: courseForm.title,
          duration: courseForm.duration,
          level: courseForm.level,
          skills: courseForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
          tools: courseForm.tools.split(",").map((s) => s.trim()).filter(Boolean),
          certification: courseForm.certification,
        })
        .eq("id", editingCourseId);
      if (error) throw error;
      toast.success("Course updated successfully");
      queryClient.invalidateQueries({ queryKey: ["academy-cert-categories"] });
      setEditCourseModal(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  const handleEditPhase = (phase: AcademyDiplomaPhase) => {
    setEditingPhaseId(phase.id);
    setPhaseForm({ title: phase.title, months: phase.months });
    setEditPhaseModal(true);
  };

  const handleSavePhase = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("academy_diploma_phases")
        .update({ title: phaseForm.title, months: phaseForm.months })
        .eq("id", editingPhaseId);
      if (error) throw error;
      toast.success("Phase updated successfully");
      queryClient.invalidateQueries({ queryKey: ["academy-diploma-phases"] });
      setEditPhaseModal(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to update phase");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Academy Programs</h1>
          <p className="text-muted-foreground mt-1">Edit certification courses and diploma program details</p>
        </div>

        <Tabs defaultValue="certifications" className="w-full">
          <TabsList>
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <Award className="w-4 h-4" /> Certification Courses
            </TabsTrigger>
            <TabsTrigger value="diploma" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Professional Diploma
            </TabsTrigger>
          </TabsList>

          <TabsContent value="certifications" className="mt-6 space-y-8">
            {catsLoading ? (
              <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}</div>
            ) : (
              categories?.map((category) => (
                <Card key={category.id} className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-lg">{category.title}</span>
                      <Badge variant="secondary" className="text-xs">{category.alignment}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {category.courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{course.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span>{course.duration}</span><span>•</span>
                            <span>{course.level}</span><span>•</span>
                            <span>{course.certification}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {course.skills.map((s) => (
                              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleEditCourse(course)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="diploma" className="mt-6 space-y-6">
            {phasesLoading ? (
              <div className="space-y-4">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}</div>
            ) : (
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Diploma Phases</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {phases?.map((phase) => (
                    <div key={phase.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                      <div>
                        <h4 className="font-semibold text-foreground">Phase {phase.phase_number} — {phase.title}</h4>
                        <p className="text-sm text-muted-foreground">{phase.months}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {phase.modules.map((m) => (
                            <Badge key={m.id} variant="outline" className="text-xs">{m.title}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleEditPhase(phase)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader><CardTitle className="text-base">Career Outcomes</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {outcomes.map((o) => (
                      <li key={o.id} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {o.title}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader><CardTitle className="text-base">Diploma Includes</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {includes.map((i) => (
                      <li key={i.id} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {i.title}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Course Modal */}
      <Dialog open={editCourseModal} onOpenChange={setEditCourseModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Certification Course</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Course Title</Label><Input value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Duration</Label><Input value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} /></div>
              <div><Label>Level</Label>
                <Select value={courseForm.level} onValueChange={(v) => setCourseForm({ ...courseForm, level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Skills (comma-separated)</Label><Textarea value={courseForm.skills} onChange={(e) => setCourseForm({ ...courseForm, skills: e.target.value })} rows={2} /></div>
            <div><Label>Tools (comma-separated)</Label><Textarea value={courseForm.tools} onChange={(e) => setCourseForm({ ...courseForm, tools: e.target.value })} rows={2} /></div>
            <div><Label>Certification Alignment</Label><Input value={courseForm.certification} onChange={(e) => setCourseForm({ ...courseForm, certification: e.target.value })} /></div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditCourseModal(false)}>Cancel</Button>
              <Button onClick={handleSaveCourse} disabled={saving}>
                <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Phase Modal */}
      <Dialog open={editPhaseModal} onOpenChange={setEditPhaseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Diploma Phase</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Phase Title</Label><Input value={phaseForm.title} onChange={(e) => setPhaseForm({ ...phaseForm, title: e.target.value })} /></div>
            <div><Label>Duration</Label><Input value={phaseForm.months} onChange={(e) => setPhaseForm({ ...phaseForm, months: e.target.value })} /></div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditPhaseModal(false)}>Cancel</Button>
              <Button onClick={handleSavePhase} disabled={saving}>
                <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
