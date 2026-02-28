import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CreditCard, Search, Eye, Ban, Users, Plus, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { getExpiryDate, formatDate, generateIDCardHTML, type IDCardData } from "@/lib/idCardUtils";

const STAFF_POSITIONS = [
  "General Manager",
  "Chief Operating Officer (COO)",
  "Chief Technology Officer (CTO)",
  "Security Analyst",
  "Lead Instructor",
  "Program Director",
  "IT Administrator",
  "Operations Manager",
  "Marketing Director",
  "Finance Manager",
  "Human Resources Manager",
  "Research Lead",
];

export default function AdminIDCards() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    fullName: "",
    position: "",
    department: "",
    email: "",
  });

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["admin-id-cards"],
    queryFn: async () => {
      const { data: enrollData, error: enrollErr } = await supabase
        .from("enrollments")
        .select("*, course:courses(title, duration)")
        .order("created_at", { ascending: false });
      if (enrollErr) throw enrollErr;

      const userIds = [...new Set((enrollData || []).map((e: any) => e.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url, country")
        .in("user_id", userIds);

      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));
      const roleMap = new Map((roles || []).map((r: any) => [r.user_id, r.role]));

      return (enrollData || []).map((e: any) => {
        const profile = profileMap.get(e.user_id);
        const role = roleMap.get(e.user_id) || "student";
        const expiryDate = getExpiryDate(e.created_at, e.course?.duration);
        const isExpired = expiryDate < new Date();
        const positionLabel = role === "instructor" ? "Instructor" : role === "admin" ? "Administrator" : "Student";
        return {
          id: e.id,
          userId: e.user_id,
          studentName: profile?.full_name || "Unknown",
          email: "",
          studentId: `CDAA-${e.user_id.slice(0, 8).toUpperCase()}`,
          avatarUrl: profile?.avatar_url,
          country: profile?.country || "N/A",
          courseName: e.course?.title || "Unknown",
          enrolledAt: e.created_at,
          expiryDate,
          isExpired,
          duration: e.course?.duration || "N/A",
          position: positionLabel,
        };
      });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (enrollmentId: string) => {
      const { error } = await supabase
        .from("enrollments")
        .delete()
        .eq("id", enrollmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-id-cards"] });
      toast.success("Student ID card revoked (enrollment removed)");
    },
    onError: () => {
      toast.error("Failed to revoke ID card");
    },
  });

  const handleViewCard = async (card: any) => {
    const html = await generateIDCardHTML(card as IDCardData);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  const handleCreateStaffCard = async () => {
    if (!staffForm.fullName.trim() || !staffForm.position) {
      toast.error("Please fill in name and position");
      return;
    }

    const staffCard: IDCardData = {
      id: crypto.randomUUID(),
      studentName: staffForm.fullName,
      email: staffForm.email,
      studentId: `CDAA-STF-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      avatarUrl: null,
      country: "N/A",
      courseName: staffForm.department || "Cyber Defend Academy Africa",
      enrolledAt: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      isExpired: false,
      duration: "1 Year",
      position: staffForm.position,
    };

    const html = await generateIDCardHTML(staffCard);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
    setShowStaffModal(false);
    setStaffForm({ fullName: "", position: "", department: "", email: "" });
    toast.success("Staff ID card generated!");
  };

  const filtered = (enrollments || []).filter((e: any) =>
    e.studentName.toLowerCase().includes(search.toLowerCase()) ||
    e.studentId.toLowerCase().includes(search.toLowerCase()) ||
    e.courseName.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = (enrollments || []).filter((e: any) => !e.isExpired).length;
  const expiredCount = (enrollments || []).filter((e: any) => e.isExpired).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">ID Cards</h1>
            <p className="text-muted-foreground mt-1">Manage student and staff identification cards</p>
          </div>
          <Button onClick={() => setShowStaffModal(true)} className="gap-2">
            <UserPlus className="h-4 w-4" /> Create Staff ID Card
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
              <div><p className="text-2xl font-bold text-foreground">{enrollments?.length || 0}</p><p className="text-xs text-muted-foreground">Total ID Cards</p></div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10"><CreditCard className="h-5 w-5 text-emerald-500" /></div>
              <div><p className="text-2xl font-bold text-foreground">{activeCount}</p><p className="text-xs text-muted-foreground">Active</p></div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10"><Ban className="h-5 w-5 text-destructive" /></div>
              <div><p className="text-2xl font-bold text-foreground">{expiredCount}</p><p className="text-xs text-muted-foreground">Expired</p></div>
            </CardContent>
          </Card>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No ID cards found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((card: any) => (
                      <TableRow key={card.id}>
                        <TableCell className="font-medium text-foreground">{card.studentName}</TableCell>
                        <TableCell className="font-mono text-xs">{card.studentId}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{card.position}</Badge>
                        </TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate">{card.courseName}</TableCell>
                        <TableCell className="text-sm">{formatDate(new Date(card.enrolledAt))}</TableCell>
                        <TableCell className="text-sm">{formatDate(card.expiryDate)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={card.isExpired
                            ? "bg-destructive/10 text-destructive border-destructive/30"
                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                          }>
                            {card.isExpired ? "Expired" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => handleViewCard(card)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Ban className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Revoke ID Card</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will revoke {card.studentName}'s ID card for "{card.courseName}" by removing their enrollment. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => revokeMutation.mutate(card.id)}
                                  >
                                    Revoke
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Staff ID Card Creation Modal */}
      <Dialog open={showStaffModal} onOpenChange={setShowStaffModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Staff ID Card</DialogTitle>
            <DialogDescription>
              Generate a custom ID card for staff members who don't use the dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={staffForm.fullName}
                onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Position / Title *</Label>
              <Select
                value={staffForm.position}
                onValueChange={(v) => setStaffForm({ ...staffForm, position: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {STAFF_POSITIONS.map((pos) => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department / Program</Label>
              <Input
                value={staffForm.department}
                onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                placeholder="e.g. Cybersecurity Operations"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={staffForm.email}
                onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                placeholder="e.g. john@cyberdefendafrica.com"
              />
            </div>
            <Button className="w-full" onClick={handleCreateStaffCard}>
              <CreditCard className="h-4 w-4 mr-2" /> Generate Staff ID Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
