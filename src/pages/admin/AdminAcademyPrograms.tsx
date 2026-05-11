import { AdminLayout } from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, GraduationCap } from "lucide-react";
import { CertificationsCRUD } from "@/components/admin/academy/CertificationsCRUD";
import { DiplomaCRUD } from "@/components/admin/academy/DiplomaCRUD";

export default function AdminAcademyPrograms() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Academy Programs</h1>
          <p className="text-muted-foreground mt-1">Manage certification courses and diploma program details</p>
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

          <TabsContent value="certifications" className="mt-6 space-y-6">
            <CertificationsCRUD />
          </TabsContent>

          <TabsContent value="diploma" className="mt-6 space-y-6">
            <DiplomaCRUD />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
