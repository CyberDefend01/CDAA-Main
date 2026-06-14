import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Send, Loader2, UserCheck, ClipboardCheck, LifeBuoy, FileText, Eye, X } from "lucide-react";

type Kind = "admission" | "registration" | "support" | "custom";

interface Profile { id: string; user_id: string; full_name: string | null; email: string | null; }

const KINDS: { key: Kind; label: string; icon: typeof Mail; from: string; hint: string }[] = [
  { key: "admission",    label: "Admission",    icon: UserCheck,      from: "admissions@cyberdefendafrica.org",   hint: "Acceptance / decision letters" },
  { key: "registration", label: "Registration", icon: ClipboardCheck, from: "registration@cyberdefendafrica.org", hint: "Enrolment confirmations" },
  { key: "support",      label: "Support",      icon: LifeBuoy,       from: "support@cyberdefendafrica.org",      hint: "General replies" },
  { key: "custom",       label: "Custom",       icon: FileText,       from: "support@cyberdefendafrica.org",      hint: "Free-form message" },
];

const TEMPLATES: Record<Kind, { subject: string; body: string }> = {
  admission: {
    subject: "Your Admission to Cyber Defend Africa Academy",
    body: `Dear {{name}},

Congratulations! We are delighted to offer you admission into the Professional Diploma in Cybersecurity at Cyber Defend Africa Academy.

Your application stood out, and we are confident you will thrive in our hands-on, mentorship-driven programme.

Next steps:
1. Confirm your place by replying to this email.
2. Complete your registration and payment within 7 days.
3. Join our orientation session — details to follow.

We look forward to welcoming you to the academy.`,
  },
  registration: {
    subject: "Registration Confirmed — Cyber Defend Africa Academy",
    body: `Dear {{name}},

Your registration is now complete. Welcome aboard!

You now have full access to your student dashboard, course materials, and virtual labs. Your cohort begins shortly, and your mentor will reach out with onboarding details.

If you have any questions before then, simply reply to this email — a real person on our team will help you.`,
  },
  support: {
    subject: "Re: Your enquiry — Cyber Defend Africa Academy",
    body: `Hi {{name}},

Thank you for reaching out to us.

`,
  },
  custom: { subject: "", body: "" },
};

export default function AdminAdmissions() {
  const [kind, setKind] = useState<Kind>("admission");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [toName, setToName] = useState("");
  const [subject, setSubject] = useState(TEMPLATES.admission.subject);
  const [message, setMessage] = useState(TEMPLATES.admission.body);
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, email")
        .order("created_at", { ascending: false })
        .limit(500);
      setProfiles(data || []);
    })();
  }, []);

  const applyTemplate = (k: Kind) => {
    setKind(k);
    setSubject(TEMPLATES[k].subject);
    setMessage(TEMPLATES[k].body);
  };

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return profiles
      .filter((p) => (p.full_name || "").toLowerCase().includes(q) || (p.email || "").toLowerCase().includes(q))
      .slice(0, 6);
  }, [search, profiles]);

  const selectRecipient = (p: Profile) => {
    setToEmail(p.email || "");
    setToName(p.full_name || "");
    setSearch(`${p.full_name || "Unknown"} · ${p.email || ""}`);
  };

  // Render preview with {{name}} substituted
  const rendered = useMemo(
    () => message.replace(/\{\{name\}\}/g, toName || "there"),
    [message, toName],
  );

  const activeKind = KINDS.find((k) => k.key === kind)!;

  const handleSend = async () => {
    if (!toEmail) { toast.error("Please choose or enter a recipient email"); return; }
    if (!subject.trim()) { toast.error("Subject is required"); return; }
    if (!message.trim()) { toast.error("Message is required"); return; }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-smtp-email", {
        body: {
          kind,
          to: toEmail,
          toName: toName || undefined,
          subject,
          message: rendered,
          fromAddress: activeKind.from,
        },
      });
      if (error) throw new Error(error.message);
      if (data && data.success === false) throw new Error(data.error || "Send failed");
      toast.success(`Email sent to ${toEmail}`);
      // reset message but keep template + kind
      if (kind === "support" || kind === "custom") setMessage(TEMPLATES[kind].body);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send email";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight">Admissions & Mail</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Send human, personally-reviewed emails via Zoho. Replies land in your Zoho inbox.
          </p>
        </div>

        {/* Kind selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {KINDS.map((k) => {
            const active = k.key === kind;
            return (
              <button
                key={k.key}
                onClick={() => applyTemplate(k.key)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  active ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-primary/40"
                }`}
              >
                <k.icon className={`w-5 h-5 mb-2 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <p className="font-semibold text-sm">{k.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{k.hint}</p>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Composer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="w-4 h-4 text-primary" /> Compose
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* From (read-only) */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">From</Label>
                <div className="flex items-center gap-2 h-10 px-3 rounded-lg bg-muted text-sm text-muted-foreground">
                  <Badge variant="secondary" className="font-normal">{activeKind.from}</Badge>
                  <span className="text-xs">(Zoho)</span>
                </div>
              </div>

              {/* Recipient */}
              <div className="space-y-1.5 relative">
                <Label className="text-sm font-semibold">Recipient</Label>
                <Input
                  placeholder="Search students by name or email…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setToEmail(e.target.value.includes("@") ? e.target.value.trim() : toEmail); }}
                />
                {matches.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                    {matches.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => selectRecipient(p)}
                        className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                      >
                        <p className="text-sm font-medium">{p.full_name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{p.email}</p>
                      </button>
                    ))}
                  </div>
                )}
                {toEmail && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                    <UserCheck className="w-3 h-3 text-emerald-500" />
                    Sending to <span className="font-medium text-foreground">{toEmail}</span>
                  </p>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Subject</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject" />
              </div>

              {/* Body */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold flex items-center justify-between">
                  Message
                  <span className="text-xs font-normal text-muted-foreground">{"Use {{name}} for the recipient's name"}</span>
                </Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={12}
                  className="resize-y font-body text-sm leading-relaxed"
                  placeholder="Write your message…"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button onClick={handleSend} disabled={sending} className="flex-1 font-bold">
                  {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  {sending ? "Sending…" : "Send Email"}
                </Button>
                <Button variant="outline" onClick={() => setShowPreview(true)} className="lg:hidden">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live preview (desktop) */}
          <Card className="hidden lg:block">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="w-4 h-4 text-primary" /> Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PreviewCard kind={kind} subject={subject} body={rendered} from={activeKind.from} toName={toName} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end lg:hidden" onClick={() => setShowPreview(false)}>
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }}
            className="bg-background rounded-t-2xl w-full max-h-[85vh] overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">Preview</p>
              <button onClick={() => setShowPreview(false)}><X className="w-5 h-5" /></button>
            </div>
            <PreviewCard kind={kind} subject={subject} body={rendered} from={activeKind.from} toName={toName} />
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}

function PreviewCard({ kind, subject, body, from, toName }: {
  kind: Kind; subject: string; body: string; from: string; toName: string;
}) {
  const accent =
    kind === "admission" ? "#10b981" :
    kind === "registration" ? "#06b6d4" :
    "#3b6df6";
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-white text-slate-800">
      <div style={{ background: accent }} className="px-5 py-3 text-white text-sm font-bold">
        Cyber Defend Africa
      </div>
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
        <p><span className="font-semibold">From:</span> {from}</p>
        <p><span className="font-semibold">To:</span> {toName || "Recipient"}</p>
        <p><span className="font-semibold">Subject:</span> {subject || "(no subject)"}</p>
      </div>
      <div className="p-5 text-sm leading-relaxed whitespace-pre-wrap min-h-[200px]">
        {body || "Your message preview will appear here…"}
        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
          Warm regards,<br /><strong>The Cyber Defend Africa Team</strong>
        </div>
      </div>
    </div>
  );
}
