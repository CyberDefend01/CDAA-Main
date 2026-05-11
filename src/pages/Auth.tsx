import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lock, Mail, Phone, User, ArrowLeft, Shield, CheckCircle2, Zap, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CyberGrid } from "@/components/ui/CyberGrid";
import academyLogo from "@/assets/logo.png";
import { sendWelcomeEmail, sendAdminNewUserNotification } from "@/lib/emailService";

type Tab = "signin" | "signup" | "forgot";

const brandFeatures = [
  "Hands-on virtual cyber labs",
  "Industry-recognised certifications",
  "Expert-led live sessions",
  "Career placement support",
  "Lifetime access to resources",
];

export default function Auth() {
  const navigate = useNavigate();

  const [loading, setLoading]                 = useState(false);
  const [tab, setTab]                         = useState<Tab>("signin");
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName]               = useState("");
  const [phone, setPhone]                     = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [inlineError, setInlineError]         = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent]   = useState(false);
  const [isRecoveryMode, setIsRecoveryMode]   = useState(false);
  const [newPassword, setNewPassword]         = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const checkRoleAndRedirect = async (userId: string) => {
    try {
      const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
      if (isAdmin) { navigate("/admin"); return; }
      const { data: isInstructor } = await supabase.rpc('has_role', { _user_id: userId, _role: 'instructor' });
      if (isInstructor) { navigate("/instructor"); return; }
      navigate("/student");
    } catch {
      navigate("/student");
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const type         = params.get('type');
      const accessToken  = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(({ data, error }) => {
            window.history.replaceState(null, '', window.location.pathname);
            if (error) { setInlineError('Email confirmation failed. Please try again.'); return; }
            if (type === 'recovery') {
              toast.success('Email verified! Please set your new password.');
              setTab('forgot'); setResetEmailSent(false); setIsRecoveryMode(true);
            } else {
              toast.success('Email verified! Welcome.');
              if (data.session?.user) checkRoleAndRedirect(data.session.user.id);
            }
          });
        return;
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') { setTab('forgot'); setIsRecoveryMode(true); return; }
      if (session?.user) setTimeout(() => checkRoleAndRedirect(session.user.id), 0);
    });

    (async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session?.user) checkRoleAndRedirect(session.user.id);
      } catch {
        setInlineError("Authentication service unavailable. Please refresh.");
      }
    })();

    return () => subscription.unsubscribe();
  }, [navigate]);

  // ── Validation schemas ──────────────────────────────────────
  const emailSchema    = z.string().trim().email("Enter a valid email").max(255);
  const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(72);
  const signInSchema   = z.object({ email: emailSchema, password: passwordSchema });
  const signUpSchema   = z.object({
    fullName: z.string().trim().min(1, "Full name is required").max(100),
    phone: z.string().trim().min(7, "Phone too short").max(20).regex(/^[0-9+\-().\s]+$/, "Invalid phone number"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  }).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) ctx.addIssue({ code: "custom", path: ["confirmPassword"], message: "Passwords do not match" });
  });

  const clearSensitive = () => { setPassword(""); setConfirmPassword(""); };

  // ── Handlers ────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); setInlineError(null);
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) { const m = parsed.error.issues[0]?.message ?? "Invalid details"; setInlineError(m); toast.error(m); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
      if (error) {
        const lower = error.message.toLowerCase();
        const m = lower.includes("invalid login credentials") ? "Invalid email or password."
          : lower.includes("email") && lower.includes("confirm") ? "Please verify your email first."
          : error.message;
        setInlineError(m); toast.error(m); return;
      }
      toast.success("Welcome back!");
    } catch { const m = "Sign in failed. Please try again."; setInlineError(m); toast.error(m);
    } finally { setLoading(false); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); setInlineError(null);
    const parsed = signUpSchema.safeParse({ fullName, phone, email, password, confirmPassword });
    if (!parsed.success) { const m = parsed.error.issues[0]?.message ?? "Invalid details"; setInlineError(m); toast.error(m); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email, password: parsed.data.password,
        options: { emailRedirectTo: `${window.location.origin}/auth`, data: { full_name: parsed.data.fullName, phone: parsed.data.phone } },
      });
      if (error) { const m = error.message.toLowerCase().includes("already") ? "Email already registered. Sign in instead." : error.message; setInlineError(m); toast.error(m); return; }
      toast.success("Account created! Please verify your email, then sign in.");
      sendWelcomeEmail({ email: parsed.data.email, name: parsed.data.fullName }).catch(() => {});
      sendAdminNewUserNotification({ email: parsed.data.email, name: parsed.data.fullName }).catch(() => {});
      setTab("signin"); clearSensitive();
    } catch { const m = "Sign up failed. Please try again."; setInlineError(m); toast.error(m);
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setInlineError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) { const m = parsed.error.issues[0]?.message ?? "Enter a valid email"; setInlineError(m); toast.error(m); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` });
      if (error) { setInlineError(error.message); toast.error(error.message); return; }
      try { await supabase.functions.invoke('send-auth-email', { body: { type: 'password-reset', email, name: 'Student', redirectUrl: `${window.location.origin}/auth` } }); } catch {}
      setResetEmailSent(true); toast.success("Reset link sent! Check your inbox.");
    } catch { const m = "Failed to send reset email."; setInlineError(m); toast.error(m);
    } finally { setLoading(false); }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setInlineError(null);
    if (newPassword.length < 6) { setInlineError("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmNewPassword) { setInlineError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) { setInlineError(error.message); toast.error(error.message); return; }
      toast.success("Password updated! Redirecting…");
      setIsRecoveryMode(false); setNewPassword(""); setConfirmNewPassword("");
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) checkRoleAndRedirect(session.user.id); else setTab("signin");
    } catch { setInlineError("Failed to update password. Please try again.");
    } finally { setLoading(false); }
  };

  const switchTab = (next: Tab) => { setTab(next); setInlineError(null); setResetEmailSent(false); clearSensitive(); };

  // ── Shared input class ──────────────────────────────────────
  const inputCls = "pl-10 h-11 bg-surface border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/10 rounded-xl text-sm transition-all";

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT BRAND PANEL ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative flex-col justify-between p-12 gradient-dark-hero overflow-hidden">
        <CyberGrid />
        <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] ambient-blob ambient-blob-cyan opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[350px] h-[350px] ambient-blob ambient-blob-magenta opacity-10 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-cyan/30 blur-md" />
            <img src={academyLogo} alt="CDAA" className="relative h-10 w-10 rounded-full object-cover ring-2 ring-white/20" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-white leading-none">Cyber Defend Africa</p>
            <p className="text-[10px] text-white/40 font-semibold tracking-widest uppercase mt-0.5">Academy</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 space-y-8">
          <div>
            <p className="badge-neon mb-5 inline-flex"><Zap className="w-3 h-3" />Africa's #1 Cyber Academy</p>
            <h1 className="font-display font-extrabold text-4xl xl:text-5xl text-white tracking-display leading-[1.08] text-balance">
              Defend the Digital
              <br />
              <span className="gradient-text-neon text-glow-cyan">Frontier of Africa</span>
            </h1>
            <p className="mt-5 text-white/50 text-base leading-relaxed max-w-sm text-pretty">
              Join thousands of African professionals building the skills to secure our continent's digital future.
            </p>
          </div>

          <ul className="space-y-3">
            {brandFeatures.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-white/60">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom trust */}
        <div className="relative z-10 flex items-center gap-3 pt-4">
          <div className="flex -space-x-2">
            {["AO","FK","KA","JO","MH"].map((init, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-background">
                {init}
              </div>
            ))}
          </div>
          <p className="text-xs text-white/40"><span className="text-white/70 font-semibold">5,000+</span> students already enrolled</p>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 bg-background relative overflow-y-auto">
        {/* Mobile logo */}
        <Link to="/" className="flex lg:hidden items-center gap-2 mb-10 self-start">
          <img src={academyLogo} alt="CDAA" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-display font-bold text-sm text-foreground">Cyber Defend Africa Academy</span>
        </Link>

        <div className="w-full max-w-[420px]">

          {/* Error */}
          <AnimatePresence>
            {inlineError && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-5">
                <Alert variant="destructive" className="bg-destructive/8 border-destructive/30 rounded-xl">
                  <AlertDescription className="text-sm">{inlineError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* ── SIGN IN ── */}
            {tab === "signin" && (
              <motion.div key="signin" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
                <div className="mb-8">
                  <h2 className="font-display font-extrabold text-2xl tracking-display mb-1">Welcome back</h2>
                  <p className="text-sm text-muted-foreground">Sign in to continue your learning journey.</p>
                </div>

                <form noValidate onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="signin-email" className="text-sm font-semibold">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input id="signin-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signin-password" className="text-sm font-semibold">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input id="signin-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} pr-10`} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="button" onClick={() => switchTab("forgot")} className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                      Forgot password?
                    </button>
                  </div>

                  <Button type="submit" className="w-full btn-cyber h-11 text-white font-bold rounded-xl text-sm shadow-neon-cyan" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Sign In
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Don't have an account?{" "}
                  <button onClick={() => switchTab("signup")} className="text-primary font-semibold hover:underline">Create one free</button>
                </p>
              </motion.div>
            )}

            {/* ── SIGN UP ── */}
            {tab === "signup" && (
              <motion.div key="signup" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
                <div className="mb-8">
                  <h2 className="font-display font-extrabold text-2xl tracking-display mb-1">Create your account</h2>
                  <p className="text-sm text-muted-foreground">We'll send you a verification email after signup.</p>
                </div>

                <form noValidate onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name" className="text-sm font-semibold">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input id="signup-name" type="text" placeholder="Abubakar Ibrahim" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-phone" className="text-sm font-semibold">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input id="signup-phone" type="tel" placeholder="+234 800 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-sm font-semibold">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password" className="text-sm font-semibold">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                        <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Min. 6 chars" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} pr-8`} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground">
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-confirm" className="text-sm font-semibold">Confirm</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                        <Input id="signup-confirm" type={showConfirm ? "text" : "password"} placeholder="Re-enter" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputCls} pr-8`} required />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground">
                          {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password strength */}
                  {password.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1,2,3,4].map((level) => (
                          <div key={level} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            password.length >= level * 3
                              ? level <= 1 ? "bg-red-400" : level <= 2 ? "bg-yellow-400" : level <= 3 ? "bg-blue-400" : "bg-emerald-400"
                              : "bg-muted"
                          }`} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {password.length < 4 ? "Too short" : password.length < 7 ? "Weak" : password.length < 10 ? "Good" : "Strong"}
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full btn-cyber h-11 text-white font-bold rounded-xl text-sm shadow-neon-cyan" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Create Account
                  </Button>

                  <p className="text-[11px] text-muted-foreground text-center">
                    By signing up you agree to our{" "}
                    <Link to="#" className="underline hover:text-primary">Terms</Link> and{" "}
                    <Link to="#" className="underline hover:text-primary">Privacy Policy</Link>.
                  </p>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-5">
                  Already have an account?{" "}
                  <button onClick={() => switchTab("signin")} className="text-primary font-semibold hover:underline">Sign in</button>
                </p>
              </motion.div>
            )}

            {/* ── FORGOT / RECOVERY ── */}
            {tab === "forgot" && (
              <motion.div key="forgot" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
                {isRecoveryMode ? (
                  <>
                    <div className="mb-8">
                      <h2 className="font-display font-extrabold text-2xl tracking-display mb-1">Set New Password</h2>
                      <p className="text-sm text-muted-foreground">Choose a strong new password for your account.</p>
                    </div>
                    <form noValidate onSubmit={handleUpdatePassword} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold">New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                          <Input type="password" placeholder="Min. 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} required />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold">Confirm New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                          <Input type="password" placeholder="Re-enter password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className={inputCls} required />
                        </div>
                      </div>
                      <Button type="submit" className="w-full btn-cyber h-11 text-white font-bold rounded-xl shadow-neon-cyan" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Update Password
                      </Button>
                    </form>
                  </>
                ) : resetEmailSent ? (
                  <motion.div className="text-center space-y-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display font-extrabold text-xl mb-2">Check your inbox!</h2>
                      <p className="text-sm text-muted-foreground">
                        We sent a reset link to <span className="font-semibold text-foreground">{email}</span>
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => switchTab("signin")} className="gap-2">
                      <ArrowLeft className="w-4 h-4" /> Back to Sign In
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-8">
                      <button onClick={() => switchTab("signin")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                      </button>
                      <h2 className="font-display font-extrabold text-2xl tracking-display mb-1">Reset Password</h2>
                      <p className="text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
                    </div>
                    <form noValidate onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="forgot-email" className="text-sm font-semibold">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                          <Input id="forgot-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
                        </div>
                      </div>
                      <Button type="submit" className="w-full btn-cyber h-11 text-white font-bold rounded-xl shadow-neon-cyan" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Send Reset Link
                      </Button>
                    </form>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back link on mobile */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1">
              <ArrowLeft className="w-3 h-3" />Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
