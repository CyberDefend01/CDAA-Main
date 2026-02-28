import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Award,
  GraduationCap,
  Pencil,
  Plus,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  certificationCategories,
  diplomaPhases,
  diplomaOutcomes,
  diplomaIncludes,
  specializationTracks,
  type CertificationCategory,
  type CertificationCourse,
  type DiplomaPhase,
} from "@/data/academyPrograms";

// Note: This page edits in-memory data from academyPrograms.ts.
// For production, this should be stored in the database.
// For now, we show the current data and allow editing the static file values.

export default function AdminAcademyPrograms() {
  const [editCourseModal, setEditCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CertificationCourse | null>(null);
  const [editingCatIdx, setEditingCatIdx] = useState(0);
  const [editingCourseIdx, setEditingCourseIdx] = useState(0);

  // Local state copies for editing
  const [courseForm, setCourseForm] = useState({
    title: "",
    duration: "",
    level: "Beginner",
    skills: "",
    tools: "",
    certification: "",
  });

  const [editPhaseModal, setEditPhaseModal] = useState(false);
  const [editingPhase, setEditingPhase] = useState<DiplomaPhase | null>(null);
  const [phaseForm, setPhaseForm] = useState({
    title: "",
    months: "",
  });

  const handleEditCourse = (catIdx: number, courseIdx: number) => {
    const course = certificationCategories[catIdx].courses[courseIdx];
    setEditingCourse(course);
    setEditingCatIdx(catIdx);
    setEditingCourseIdx(courseIdx);
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

  const handleSaveCourse = () => {
    // Update the static data in memory
    const updated: CertificationCourse = {
      title: courseForm.title,
      duration: courseForm.duration,
      level: courseForm.level,
      skills: courseForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
      tools: courseForm.tools.split(",").map((s) => s.trim()).filter(Boolean),
      certification: courseForm.certification,
    };
    certificationCategories[editingCatIdx].courses[editingCourseIdx] = updated;
    toast.success("Course details updated successfully");
    setEditCourseModal(false);
  };

  const handleEditPhase = (idx: number) => {
    const phase = diplomaPhases[idx];
    setEditingPhase(phase);
    setPhaseForm({ title: phase.title, months: phase.months });
    setEditPhaseModal(true);
  };

  const handleSavePhase = () => {
    if (editingPhase) {
      const idx = diplomaPhases.findIndex((p) => p.number === editingPhase.number);
      if (idx >= 0) {
        diplomaPhases[idx].title = phaseForm.title;
        diplomaPhases[idx].months = phaseForm.months;
      }
    }
    toast.success("Phase details updated");
    setEditPhaseModal(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Academy Programs</h1>
          <p className="text-muted-foreground mt-1">
            Edit certification courses and diploma program details
          </p>
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

          {/* Certification Courses */}
          <TabsContent value="certifications" className="mt-6 space-y-8">
            {certificationCategories.map((category, catIdx) => (
              <Card key={category.title} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <span className="text-lg">{category.title}</span>
                      <Badge variant="secondary" className="ml-3 text-xs">
                        {category.alignment}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.courses.map((course, courseIdx) => (
                      <div
                        key={course.title}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{course.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span>{course.duration}</span>
                            <span>•</span>
                            <span>{course.level}</span>
                            <span>•</span>
                            <span>{course.certification}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {course.skills.map((s) => (
                              <Badge key={s} variant="outline" className="text-xs">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCourse(catIdx, courseIdx)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Diploma Program */}
          <TabsContent value="diploma" className="mt-6 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Diploma Phases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {diplomaPhases.map((phase, idx) => (
                  <div
                    key={phase.number}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Phase {phase.number} — {phase.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{phase.months}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {phase.modules.map((m) => (
                          <Badge key={m.title} variant="outline" className="text-xs">
                            {m.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleEditPhase(idx)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Career Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {diplomaOutcomes.map((o) => (
                      <li key={o} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {o}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Diploma Includes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {diplomaIncludes.map((i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {i}
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
          <DialogHeader>
            <DialogTitle>Edit Certification Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Course Title</Label>
              <Input
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration</Label>
                <Input
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                />
              </div>
              <div>
                <Label>Level</Label>
                <Select
                  value={courseForm.level}
                  onValueChange={(v) => setCourseForm({ ...courseForm, level: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Skills (comma-separated)</Label>
              <Textarea
                value={courseForm.skills}
                onChange={(e) => setCourseForm({ ...courseForm, skills: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label>Tools (comma-separated)</Label>
              <Textarea
                value={courseForm.tools}
                onChange={(e) => setCourseForm({ ...courseForm, tools: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label>Certification Alignment</Label>
              <Input
                value={courseForm.certification}
                onChange={(e) => setCourseForm({ ...courseForm, certification: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditCourseModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCourse}>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Phase Modal */}
      <Dialog open={editPhaseModal} onOpenChange={setEditPhaseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Diploma Phase</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Phase Title</Label>
              <Input
                value={phaseForm.title}
                onChange={(e) => setPhaseForm({ ...phaseForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Duration</Label>
              <Input
                value={phaseForm.months}
                onChange={(e) => setPhaseForm({ ...phaseForm, months: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditPhaseModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePhase}>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
