import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { Award, Plus, Search, XCircle, FileText, Eye } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Certificate {
  id: string;
  verification_id: string;
  student_name: string;
  course_name: string;
  issued_at: string;
  revoked_at: string | null;
  revocation_reason: string | null;
}

interface Template {
  id: string;
  name: string;
  description: string | null;
  template_html: string;
  is_default: boolean;
  is_active: boolean;
}

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateForm, setTemplateForm] = useState({ 
    name: "", description: "", template_html: "", is_default: false, is_active: true 
  });

  const fetchData = async () => {
    setLoading(true);
    const [certRes, tempRes] = await Promise.all([
      supabase.from("certificates").select("*").order("issued_at", { ascending: false }),
      supabase.from("certificate_templates").select("*").order("created_at"),
    ]);
    if (!certRes.error) setCertificates(certRes.data || []);
    if (!tempRes.error) setTemplates(tempRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const revokeCertificate = async (id: string) => {
    const reason = prompt("Reason for revocation:");
    if (!reason) return;
    
    const { error } = await supabase.from("certificates").update({
      revoked_at: new Date().toISOString(),
      revocation_reason: reason,
    }).eq("id", id);
    
    if (error) toast.error("Failed to revoke");
    else { toast.success("Certificate revoked"); fetchData(); }
  };

  const createTemplate = async () => {
    if (!templateForm.name || !templateForm.template_html) {
      return toast.error("Name and HTML template are required");
    }
    
    const { error } = await supabase.from("certificate_templates").insert([templateForm]);
    if (error) toast.error("Failed to create template");
    else { 
      toast.success("Template created"); 
      setTemplateDialogOpen(false);
      setTemplateForm({ name: "", description: "", template_html: "", is_default: false, is_active: true });
      fetchData(); 
    }
  };

  const filteredCerts = certificates.filter(c => 
    c.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.verification_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Certificates</h1>
          <p className="text-muted-foreground mt-1">Manage certificate templates and issued certificates</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{certificates.length}</p>
                <p className="text-sm text-muted-foreground">Total Issued</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{certificates.filter(c => !c.revoked_at).length}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{certificates.filter(c => c.revoked_at).length}</p>
                <p className="text-sm text-muted-foreground">Revoked</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="certificates">
          <TabsList>
            <TabsTrigger value="certificates">Issued Certificates</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="certificates" className="space-y-4">
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student, course, or verification ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Certificates ({filteredCerts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-center py-8 text-muted-foreground">Loading...</p>
                  ) : filteredCerts.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No certificates found</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Verification ID</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Issued</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCerts.map((cert) => (
                          <TableRow key={cert.id}>
                            <TableCell className="font-mono text-sm">{cert.verification_id}</TableCell>
                            <TableCell className="font-medium">{cert.student_name}</TableCell>
                            <TableCell>{cert.course_name}</TableCell>
                            <TableCell>{new Date(cert.issued_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cert.revoked_at ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}>
                                {cert.revoked_at ? "Revoked" : "Active"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {!cert.revoked_at && (
                                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => revokeCertificate(cert.id)}>
                                  Revoke
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-cyan">
                    <Plus className="w-4 h-4 mr-2" />Add Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Certificate Template</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input value={templateForm.name} onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input value={templateForm.description} onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>HTML Template *</Label>
                      <Textarea 
                        value={templateForm.template_html} 
                        onChange={(e) => setTemplateForm({ ...templateForm, template_html: e.target.value })}
                        rows={10}
                        placeholder="Use {{student_name}}, {{course_name}}, {{date}}, {{verification_id}} as placeholders"
                      />
                    </div>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <Switch checked={templateForm.is_default} onCheckedChange={(c) => setTemplateForm({ ...templateForm, is_default: c })} />
                        <Label>Default Template</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={templateForm.is_active} onCheckedChange={(c) => setTemplateForm({ ...templateForm, is_active: c })} />
                        <Label>Active</Label>
                      </div>
                    </div>
                    <Button onClick={createTemplate} className="w-full bg-gradient-to-r from-primary to-cyan">
                      Create Template
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Templates ({templates.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {templates.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No templates yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Default</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {templates.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.name}</TableCell>
                          <TableCell className="text-muted-foreground">{t.description || "—"}</TableCell>
                          <TableCell>
                            {t.is_default && <Badge variant="outline" className="bg-primary/10 text-primary">Default</Badge>}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={t.is_active ? "bg-emerald-500/10 text-emerald-500" : ""}>
                              {t.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
