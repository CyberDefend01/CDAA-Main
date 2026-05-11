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
import { Pencil, Save, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  useAcademyDiplomaPhases,
  useAcademyDiplomaMeta,
  type AcademyDiplomaPhase,
} from "@/hooks/useAcademyPrograms";
import { useQueryClient } from "@tanstack/react-query";

export function DiplomaCRUD() {
  const queryClient = useQueryClient();
  const { data: phases, isLoading: phasesLoading } = useAcademyDiplomaPhases();
  const { data: meta, isLoading: metaLoading } = useAcademyDiplomaMeta();

  const outcomes = meta?.filter(m => m.meta_type === "outcome") || [];
  const includes = meta?.filter(m => m.meta_type === "includes") || [];

  const [saving, setSaving] = useState(false);

  // Phase add/edit
  const [phaseModal, setPhaseModal] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [phaseForm, setPhaseForm] = useState({ title: "", months: "", phase_number: "" });
  const [deletePhaseId, setDeletePhaseId] = useState<string | null>(null);

  // Module add
  const [moduleModal, setModuleModal] = useState(false);
  const [moduleParentPhaseId, setModuleParentPhaseId] = useState("");
  const [moduleForm, setModuleForm] = useState({ title: "", topics: "" });
  const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null);

  // Meta add
  const [metaModal, setMetaModal] = useState(false);
  const [metaType, setMetaType] = useState<"outcome" | "includes">("outcome");
  const [metaForm, setMetaForm] = useState({ title: "" });
  const [deleteMetaId, setDeleteMetaId] = useState<string | null>(null);

  const invalidatePhases = () => queryClient.invalidateQueries({ queryKey: ["academy-diploma-phases"] });
  const invalidateMeta = () => queryClient.invalidateQueries({ queryKey: ["academy-diploma-meta"] });

  // Phase handlers
  const openAddPhase = () => {
    setEditingPhaseId(null);
    setPhaseForm({ title: "", months: "", phase_number: String((phases?.length || 0) + 1) });
    setPhaseModal(true);
  };
  const openEditPhase = (phase: AcademyDiplomaPhase) => {
    setEditingPhaseId(phase.id);
    setPhaseForm({ title: phase.title, months: phase.months, phase_number: String(phase.phase_number) });
    setPhaseModal(true);
  };
  const handleSavePhase = async () => {
    if (!phaseForm.title.trim()) { toast.error("Title required"); return; }
    setSaving(true);
    try {
      const payload = { title: phaseForm.title, months: phaseForm.months, phase_number: Number(phaseForm.phase_number) || 1 };
      if (editingPhaseId) {
        const { error } = await supabase.from("academy_diploma_phases").update(payload).eq("id", editingPhaseId);
        if (error) throw error;
        toast.success("Phase updated");
      } else {
        const { error } = await supabase.from("academy_diploma_phases").insert(payload);
        if (error) throw error;
        toast.success("Phase added");
      }
      invalidatePhases(); setPhaseModal(false);
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };
  const handleDeletePhase = async () => {
    if (!deletePhaseId) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("academy_diploma_phases").delete().eq("id", deletePhaseId);
      if (error) throw error;
      toast.success("Phase deleted"); invalidatePhases();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); setDeletePhaseId(null); }
  };

  // Module handlers
  const openAddModule = (phaseId: string) => {
    setModuleParentPhaseId(phaseId);
    setModuleForm({ title: "", topics: "" });
    setModuleModal(true);
  };
  const handleAddModule = async () => {
    if (!moduleForm.title.trim()) { toast.error("Title required"); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from("academy_diploma_modules").insert({
        phase_id: moduleParentPhaseId, title: moduleForm.title,
        topics: moduleForm.topics.split(",").map(s => s.trim()).filter(Boolean),
      });
      if (error) throw error;
      toast.success("Module added"); invalidatePhases(); setModuleModal(false);
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };
  const handleDeleteModule = async () => {
    if (!deleteModuleId) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("academy_diploma_modules").delete().eq("id", deleteModuleId);
      if (error) throw error;
      toast.success("Module deleted"); invalidatePhases();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); setDeleteModuleId(null); }
  };

  // Meta handlers
  const openAddMeta = (type: "outcome" | "includes") => {
    setMetaType(type);
    setMetaForm({ title: "" });
    setMetaModal(true);
  };
  const handleAddMeta = async () => {
    if (!metaForm.title.trim()) { toast.error("Title required"); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from("academy_diploma_meta").insert({ meta_type: metaType, title: metaForm.title });
      if (error) throw error;
      toast.success("Item added"); invalidateMeta(); setMetaModal(false);
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };
  const handleDeleteMeta = async () => {
    if (!deleteMetaId) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("academy_diploma_meta").delete().eq("id", deleteMetaId);
      if (error) throw error;
      toast.success("Item deleted"); invalidateMeta();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); setDeleteMetaId(null); }
  };

  return (
    <>
      {/* Phases */}
      {phasesLoading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}</div>
      ) : (
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Diploma Phases</CardTitle>
            <Button size="sm" onClick={openAddPhase}><Plus className="w-4 h-4 mr-1" /> Add Phase</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {phases?.map(phase => (
              <div key={phase.id} className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">Phase {phase.phase_number} — {phase.title}</h4>
                    <p className="text-sm text-muted-foreground">{phase.months}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditPhase(phase)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeletePhaseId(phase.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {phase.modules.map(m => (
                    <div key={m.id} className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">{m.title}</Badge>
                      <button onClick={() => setDeleteModuleId(m.id)} className="text-destructive/60 hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={() => openAddModule(phase.id)}><Plus className="w-3 h-3 mr-1" /> Add Module</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Meta: Outcomes + Includes */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Career Outcomes</CardTitle>
            <Button variant="outline" size="sm" onClick={() => openAddMeta("outcome")}><Plus className="w-3 h-3 mr-1" /> Add</Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {outcomes.map(o => (
                <li key={o.id} className="text-sm text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> {o.title}</span>
                  <button onClick={() => setDeleteMetaId(o.id)} className="text-destructive/60 hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Diploma Includes</CardTitle>
            <Button variant="outline" size="sm" onClick={() => openAddMeta("includes")}><Plus className="w-3 h-3 mr-1" /> Add</Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {includes.map(i => (
                <li key={i.id} className="text-sm text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> {i.title}</span>
                  <button onClick={() => setDeleteMetaId(i.id)} className="text-destructive/60 hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Phase Modal */}
      <Dialog open={phaseModal} onOpenChange={setPhaseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingPhaseId ? "Edit" : "Add"} Diploma Phase</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Phase Number</Label><Input type="number" value={phaseForm.phase_number} onChange={e => setPhaseForm({ ...phaseForm, phase_number: e.target.value })} /></div>
            <div><Label>Phase Title</Label><Input value={phaseForm.title} onChange={e => setPhaseForm({ ...phaseForm, title: e.target.value })} /></div>
            <div><Label>Duration</Label><Input value={phaseForm.months} onChange={e => setPhaseForm({ ...phaseForm, months: e.target.value })} placeholder="e.g. Months 1-4" /></div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPhaseModal(false)}>Cancel</Button>
              <Button onClick={handleSavePhase} disabled={saving}><Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Module Modal */}
      <Dialog open={moduleModal} onOpenChange={setModuleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Module</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Module Title</Label><Input value={moduleForm.title} onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })} /></div>
            <div><Label>Topics (comma-separated)</Label><Textarea value={moduleForm.topics} onChange={e => setModuleForm({ ...moduleForm, topics: e.target.value })} rows={3} /></div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setModuleModal(false)}>Cancel</Button>
              <Button onClick={handleAddModule} disabled={saving}>{saving ? "Saving..." : "Add Module"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Meta Modal */}
      <Dialog open={metaModal} onOpenChange={setMetaModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add {metaType === "outcome" ? "Career Outcome" : "Diploma Includes"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={metaForm.title} onChange={e => setMetaForm({ ...metaForm, title: e.target.value })} /></div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setMetaModal(false)}>Cancel</Button>
              <Button onClick={handleAddMeta} disabled={saving}>{saving ? "Saving..." : "Add"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirms */}
      <AlertDialog open={!!deletePhaseId} onOpenChange={() => setDeletePhaseId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Phase?</AlertDialogTitle><AlertDialogDescription>This will also delete all modules in this phase.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeletePhase} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!deleteModuleId} onOpenChange={() => setDeleteModuleId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Module?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteModule} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!deleteMetaId} onOpenChange={() => setDeleteMetaId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Item?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteMeta} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
