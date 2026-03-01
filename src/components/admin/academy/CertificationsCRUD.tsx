import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Pencil, Save, Trash2, Plus, Link } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  useAcademyCertCategories,
  type AcademyCertCourse,
  type AcademyCertCategory,
} from "@/hooks/useAcademyPrograms";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function CertificationsCRUD() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading: catsLoading } = useAcademyCertCategories();
  const { data: lmsCourses } = useQuery({
    queryKey: ["lms-courses-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("id, title").order("title");
      if (error) throw error;
      return data || [];
    },
  });

  const [saving, setSaving] = useState(false);

  // Category add
  const [addCatModal, setAddCatModal] = useState(false);
  const [catForm, setCatForm] = useState({ title: "", alignment: "" });

  // Category delete
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);

  // Course add/edit
  const [courseModal, setCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseParentCatId, setCourseParentCatId] = useState("");
  const [courseForm, setCourseForm] = useState({
    title: "", duration: "", level: "Beginner", skills: "", tools: "", certification: "", linked_course_id: "",
  });

  // Course delete
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["academy-cert-categories"] });

  const handleAddCategory = async () => {
    if (!catForm.title.trim()) { toast.error("Title required"); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from("academy_cert_categories").insert({ title: catForm.title, alignment: catForm.alignment });
      if (error) throw error;
      toast.success("Category added"); invalidate(); setAddCatModal(false); setCatForm({ title: "", alignment: "" });
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCatId) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("academy_cert_categories").delete().eq("id", deleteCatId);
      if (error) throw error;
      toast.success("Category deleted"); invalidate();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); setDeleteCatId(null); }
  };

  const openAddCourse = (categoryId: string) => {
    setEditingCourseId(null);
    setCourseParentCatId(categoryId);
    setCourseForm({ title: "", duration: "", level: "Beginner", skills: "", tools: "", certification: "", linked_course_id: "" });
    setCourseModal(true);
  };

  const openEditCourse = (course: AcademyCertCourse) => {
    setEditingCourseId(course.id);
    setCourseParentCatId(course.category_id);
    setCourseForm({
      title: course.title, duration: course.duration, level: course.level,
      skills: course.skills.join(", "), tools: course.tools.join(", "),
      certification: course.certification, linked_course_id: course.linked_course_id || "",
    });
    setCourseModal(true);
  };

  const handleSaveCourse = async () => {
    if (!courseForm.title.trim()) { toast.error("Title required"); return; }
    setSaving(true);
    const payload = {
      title: courseForm.title, duration: courseForm.duration, level: courseForm.level,
      skills: courseForm.skills.split(",").map(s => s.trim()).filter(Boolean),
      tools: courseForm.tools.split(",").map(s => s.trim()).filter(Boolean),
      certification: courseForm.certification,
      linked_course_id: courseForm.linked_course_id || null,
    };
    try {
      if (editingCourseId) {
        const { error } = await supabase.from("academy_cert_courses").update(payload).eq("id", editingCourseId);
        if (error) throw error;
        toast.success("Course updated");
      } else {
        const { error } = await supabase.from("academy_cert_courses").insert({ ...payload, category_id: courseParentCatId });
        if (error) throw error;
        toast.success("Course added");
      }
      invalidate(); setCourseModal(false);
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  const handleDeleteCourse = async () => {
    if (!deleteCourseId) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("academy_cert_courses").delete().eq("id", deleteCourseId);
      if (error) throw error;
      toast.success("Course deleted"); invalidate();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); setDeleteCourseId(null); }
  };

  if (catsLoading) return <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}</div>;

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setAddCatModal(true)}><Plus className="w-4 h-4 mr-2" /> Add Category</Button>
      </div>

      <div className="space-y-8">
        {categories?.map(category => (
          <Card key={category.id} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <span className="text-lg">{category.title}</span>
                <Badge variant="secondary" className="text-xs">{category.alignment}</Badge>
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openAddCourse(category.id)}><Plus className="w-4 h-4 mr-1" /> Add Course</Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteCatId(category.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.courses.map(course => {
                const linkedName = lmsCourses?.find(c => c.id === course.linked_course_id)?.title;
                return (
                  <div key={course.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{course.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>{course.duration}</span><span>•</span>
                        <span>{course.level}</span><span>•</span>
                        <span>{course.certification}</span>
                      </div>
                      {linkedName && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-primary">
                          <Link className="w-3 h-3" /> Linked to: {linkedName}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {course.skills.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditCourse(course)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteCourseId(course.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                );
              })}
              {category.courses.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No courses yet. Click "Add Course" to create one.</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Category Modal */}
      <Dialog open={addCatModal} onOpenChange={setAddCatModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={catForm.title} onChange={e => setCatForm({ ...catForm, title: e.target.value })} placeholder="e.g. Network Security" /></div>
            <div><Label>Alignment</Label><Input value={catForm.alignment} onChange={e => setCatForm({ ...catForm, alignment: e.target.value })} placeholder="e.g. CompTIA, EC-Council" /></div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setAddCatModal(false)}>Cancel</Button>
              <Button onClick={handleAddCategory} disabled={saving}>{saving ? "Saving..." : "Add Category"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Course Modal */}
      <Dialog open={courseModal} onOpenChange={setCourseModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingCourseId ? "Edit" : "Add"} Certification Course</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Course Title</Label><Input value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Duration</Label><Input value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} placeholder="e.g. 6 weeks" /></div>
              <div><Label>Level</Label>
                <Select value={courseForm.level} onValueChange={v => setCourseForm({ ...courseForm, level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Skills (comma-separated)</Label><Textarea value={courseForm.skills} onChange={e => setCourseForm({ ...courseForm, skills: e.target.value })} rows={2} /></div>
            <div><Label>Tools (comma-separated)</Label><Textarea value={courseForm.tools} onChange={e => setCourseForm({ ...courseForm, tools: e.target.value })} rows={2} /></div>
            <div><Label>Certification Alignment</Label><Input value={courseForm.certification} onChange={e => setCourseForm({ ...courseForm, certification: e.target.value })} /></div>
            <div>
              <Label>Link to LMS Course (optional)</Label>
              <Select value={courseForm.linked_course_id} onValueChange={v => setCourseForm({ ...courseForm, linked_course_id: v === "none" ? "" : v })}>
                <SelectTrigger><SelectValue placeholder="No linked course" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No linked course</SelectItem>
                  {lmsCourses?.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setCourseModal(false)}>Cancel</Button>
              <Button onClick={handleSaveCourse} disabled={saving}>
                <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirm */}
      <AlertDialog open={!!deleteCatId} onOpenChange={() => setDeleteCatId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>This will also delete all courses in this category. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Course Confirm */}
      <AlertDialog open={!!deleteCourseId} onOpenChange={() => setDeleteCourseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
