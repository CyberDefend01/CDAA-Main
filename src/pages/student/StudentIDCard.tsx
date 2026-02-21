import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Eye, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useState } from "react";

const LOGO_URL = "https://jasebalftkngpbcnonxr.supabase.co/storage/v1/object/public/academy-assets/logo.png";

function parseDurationToMonths(duration: string | null): number {
  if (!duration) return 6;
  const lower = duration.toLowerCase();
  const numMatch = lower.match(/(\d+)/);
  const num = numMatch ? parseInt(numMatch[1]) : 6;
  if (lower.includes("week")) return Math.max(1, Math.ceil(num / 4));
  if (lower.includes("month")) return num;
  if (lower.includes("year")) return num * 12;
  if (lower.includes("hour")) return Math.max(1, Math.ceil(num / 40));
  return 6;
}

function getExpiryDate(enrolledAt: string, duration: string | null): Date {
  const start = new Date(enrolledAt);
  const months = parseDurationToMonths(duration);
  start.setMonth(start.getMonth() + months);
  return start;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function generateIDCardHTML(card: {
  studentName: string;
  email: string;
  studentId: string;
  avatarUrl: string | null;
  country: string;
  courseName: string;
  enrolledAt: string;
  expiryDate: Date;
  isExpired: boolean;
}): string {
  const enrollDate = formatDate(new Date(card.enrolledAt));
  const expiry = formatDate(card.expiryDate);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Student ID Card - ${card.studentName}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#f1f5f9;-webkit-print-color-adjust:exact;print-color-adjust:exact;display:flex;justify-content:center;align-items:center;min-height:100vh;flex-direction:column;gap:20px;}
.no-print{display:flex;gap:12px;margin-bottom:8px;}
.no-print button{padding:10px 24px;font-size:13px;font-weight:600;border:none;border-radius:8px;cursor:pointer;}
.btn-print{background:#1a365d;color:#fff;}.btn-close{background:#e2e8f0;color:#0f172a;}

.id-card{width:420px;height:260px;border-radius:16px;overflow:hidden;position:relative;background:#fff;box-shadow:0 20px 40px rgba(0,0,0,0.15);}
.id-card-back{width:420px;height:260px;border-radius:16px;overflow:hidden;position:relative;background:#fff;box-shadow:0 20px 40px rgba(0,0,0,0.15);}

/* Front */
.card-header{background:linear-gradient(135deg,#0c1929 0%,#1e3a5f 60%,#0c4a6e 100%);padding:14px 20px;display:flex;align-items:center;gap:12px;}
.card-header img{width:40px;height:40px;object-fit:contain;}
.card-header-text{color:#fff;}
.card-header-text h2{font-size:13px;font-weight:800;letter-spacing:0.5px;}
.card-header-text p{font-size:8px;opacity:0.7;letter-spacing:1.5px;text-transform:uppercase;}
.card-body{display:flex;padding:16px 20px;gap:16px;height:calc(100% - 68px);}
.avatar-col{display:flex;flex-direction:column;align-items:center;gap:6px;}
.avatar{width:80px;height:80px;border-radius:10px;background:linear-gradient(135deg,#1e3a5f,#06b6d4);display:flex;align-items:center;justify-content:center;overflow:hidden;border:2px solid #c9a84c;}
.avatar img{width:100%;height:100%;object-fit:cover;}
.avatar span{font-size:32px;font-weight:800;color:#fff;}
.student-id-badge{font-size:8px;font-weight:700;color:#fff;background:#1a365d;padding:2px 8px;border-radius:4px;letter-spacing:0.5px;}
.info-col{flex:1;display:flex;flex-direction:column;justify-content:center;gap:6px;}
.info-row label{font-size:8px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;display:block;}
.info-row p{font-size:12px;font-weight:600;color:#0f172a;margin-top:1px;}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
.card-strip{position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#1a365d,#2563eb,#06b6d4,#c9a84c);}
.status-badge{position:absolute;top:14px;right:16px;font-size:8px;font-weight:800;padding:3px 10px;border-radius:10px;text-transform:uppercase;letter-spacing:0.5px;}
.status-active{background:#dcfce7;color:#16a34a;}
.status-expired{background:#fee2e2;color:#dc2626;}

/* Back */
.back-header{background:linear-gradient(135deg,#0c1929,#1e3a5f);padding:16px 20px;text-align:center;color:#fff;}
.back-header h3{font-size:12px;font-weight:800;letter-spacing:1px;}
.back-header p{font-size:9px;opacity:0.7;margin-top:4px;}
.back-body{padding:16px 20px;text-align:center;}
.barcode{font-family:monospace;font-size:14px;letter-spacing:4px;color:#0f172a;margin:12px 0;padding:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;}
.terms{font-size:8px;color:#94a3b8;line-height:1.6;margin-top:10px;text-align:left;}
.terms li{margin-bottom:3px;}

@media print{body{background:#fff;}.no-print{display:none!important;}.id-card,.id-card-back{box-shadow:none;page-break-after:always;}}
</style>
</head>
<body>
<div class="no-print">
  <button class="btn-print" onclick="window.print()">🖨️ Print ID Card</button>
  <button class="btn-close" onclick="window.close()">Close</button>
</div>

<!-- FRONT -->
<div class="id-card">
  <div class="card-header">
    <img src="${LOGO_URL}" alt="CDAA" />
    <div class="card-header-text">
      <h2>CYBER DEFEND ACADEMY AFRICA</h2>
      <p>Student Identification Card</p>
    </div>
  </div>
  <span class="status-badge ${card.isExpired ? "status-expired" : "status-active"}">${card.isExpired ? "Expired" : "Active"}</span>
  <div class="card-body">
    <div class="avatar-col">
      <div class="avatar">
        ${card.avatarUrl
          ? `<img src="${card.avatarUrl}" alt="${card.studentName}" />`
          : `<span>${card.studentName.charAt(0)}</span>`
        }
      </div>
      <span class="student-id-badge">${card.studentId}</span>
    </div>
    <div class="info-col">
      <div class="info-row">
        <label>Full Name</label>
        <p>${card.studentName}</p>
      </div>
      <div class="info-row">
        <label>Program</label>
        <p style="font-size:11px;">${card.courseName}</p>
      </div>
      <div class="info-grid">
        <div class="info-row">
          <label>Enrolled</label>
          <p style="font-size:10px;">${enrollDate}</p>
        </div>
        <div class="info-row">
          <label>Valid Until</label>
          <p style="font-size:10px;color:${card.isExpired ? "#dc2626" : "#0f172a"}">${expiry}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="card-strip"></div>
</div>

<!-- BACK -->
<div class="id-card-back">
  <div class="back-header">
    <h3>CYBER DEFEND ACADEMY AFRICA</h3>
    <p>Securing Africa's Digital Future</p>
  </div>
  <div class="back-body">
    <div class="barcode">${card.studentId}</div>
    <p style="font-size:9px;color:#64748b;margin-bottom:8px;">If found, please return to Cyber Defend Academy Africa</p>
    <ul class="terms">
      <li>• This card is the property of CDAA and must be returned upon request.</li>
      <li>• The card is non-transferable and must be presented for identification.</li>
      <li>• Report lost or stolen cards immediately to the academy office.</li>
      <li>• Card is valid only for the duration specified on the front.</li>
    </ul>
  </div>
  <div class="card-strip"></div>
</div>
</body>
</html>`;
}

export default function StudentIDCard() {
  const { user } = useUserRole();
  const [previewCard, setPreviewCard] = useState<any>(null);

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["student-id-cards", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data: enrollData, error: enrollErr } = await supabase
        .from("enrollments")
        .select("*, course:courses(*)")
        .eq("user_id", user.id);
      if (enrollErr) throw enrollErr;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      return (enrollData || []).map((e: any) => {
        const expiryDate = getExpiryDate(e.created_at, e.course?.duration);
        const isExpired = expiryDate < new Date();
        return {
          id: e.id,
          studentName: profile?.full_name || "Student",
          email: user?.email || "",
          studentId: `CDAA-${user!.id.slice(0, 8).toUpperCase()}`,
          avatarUrl: profile?.avatar_url,
          country: profile?.country || "N/A",
          courseName: e.course?.title || "Unknown Course",
          enrolledAt: e.created_at,
          expiryDate,
          isExpired,
          duration: e.course?.duration || "N/A",
        };
      });
    },
    enabled: !!user?.id,
  });

  const handleViewPrint = (card: any) => {
    const html = generateIDCardHTML(card);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  return (
    <DashboardLayout type="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Student ID Cards</h1>
          <p className="text-muted-foreground mt-1">
            Your auto-generated ID cards based on course enrollment
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : !enrollments?.length ? (
          <Card className="bg-card border-border">
            <CardContent className="py-16 text-center">
              <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No ID Cards Available</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enroll in a course to automatically generate your student ID card.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {enrollments.map((card: any) => (
              <Card key={card.id} className="bg-card border-border overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-[#1a365d] via-[#2563eb] to-[#06b6d4]" />
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{card.courseName}</h3>
                        <p className="text-xs text-muted-foreground">ID: {card.studentId}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={card.isExpired
                        ? "bg-destructive/10 text-destructive border-destructive/30"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                      }
                    >
                      {card.isExpired ? "Expired" : "Active"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Student</p>
                      <p className="font-medium text-foreground text-xs">{card.studentName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium text-foreground text-xs">{card.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Expires</p>
                      <p className={`font-medium text-xs ${card.isExpired ? "text-destructive" : "text-foreground"}`}>
                        {formatDate(card.expiryDate)}
                      </p>
                    </div>
                  </div>

                  {card.isExpired && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/5 border border-destructive/20">
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                      <p className="text-xs text-destructive">This ID card has expired. Re-enroll to renew.</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button className="flex-1" variant="outline" size="sm" onClick={() => setPreviewCard(card)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button className="flex-1" variant="outline" size="sm" onClick={() => handleViewPrint(card)}>
                      <Download className="h-4 w-4 mr-2" />
                      View & Print
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ID Card Preview Dialog */}
      <Dialog open={!!previewCard} onOpenChange={() => setPreviewCard(null)}>
        <DialogContent className="max-w-[500px] p-0 overflow-hidden">
          {previewCard && (
            <div className="bg-muted p-6">
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-display font-bold text-foreground">ID Card Preview</h3>
                <Button size="sm" onClick={() => handleViewPrint(previewCard)} className="gap-2">
                  <Download className="h-4 w-4" /> Print
                </Button>
              </div>
              <div
                className="mx-auto overflow-hidden rounded-2xl shadow-xl"
                style={{ width: 420, height: 560, transform: "scale(0.9)", transformOrigin: "top center" }}
              >
                <iframe
                  srcDoc={generateIDCardHTML(previewCard)}
                  className="w-full h-full border-0"
                  title="ID Card Preview"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
