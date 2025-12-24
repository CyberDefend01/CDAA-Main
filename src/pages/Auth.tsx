import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { motion } from "framer-motion";
import { CyberGrid } from "@/components/ui/CyberGrid";
import academyLogo from "@/assets/logo.png";

export default function Auth() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [inlineError, setInlineError] = useState<string | null>(null);

  const checkAdminAndRedirect = async (userId: string) => {
    try {
      const { data: isAdmin } = await supabase.rpc('has_role', { 
        _user_id: userId, 
        _role: 'admin' 
      });
      navigate(isAdmin ? "/admin" : "/");
    } catch {
      navigate("/");
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setTimeout(() => checkAdminAndRedirect(session.user.id), 0);
      }
    });

    (async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (session?.user) {
          checkAdminAndRedirect(session.user.id);
        }
      } catch {
        setInlineError(
          "Authentication service is unavailable. Please refresh and try again.",
        );
        toast.error("Authentication service is unavailable.");
      }
    })();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const emailSchema = z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(255, "Email is too long");

  const passwordSchema = z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password is too long");

  const phoneSchema = z
    .string()
    .trim()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(/^[0-9+\-().\s]+$/, "Enter a valid phone number");

  const signInSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });

  const signUpSchema = z
    .object({
      fullName: z
        .string()
        .trim()
        .min(1, "Full name is required")
        .max(100, "Full name is too long"),
      phone: phoneSchema,
      email: emailSchema,
      password: passwordSchema,
      confirmPassword: z.string(),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Passwords do not match",
        });
      }
    });

  const clearSensitiveFields = () => {
    setPassword("");
    setConfirmPassword("");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);

    const parsed = signUpSchema.safeParse({
      fullName,
      phone,
      email,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Invalid sign up details";
      setInlineError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: parsed.data.fullName,
            phone: parsed.data.phone,
          },
        },
      });

      if (error) {
        const msg = error.message.toLowerCase().includes("already")
          ? "This email is already registered. Please sign in instead."
          : error.message;
        setInlineError(msg);
        toast.error(msg);
        return;
      }

      toast.success("Account created. Please verify your email, then sign in.");
      setTab("signin");
      clearSensitiveFields();
    } catch {
      const msg = "Sign up failed. Please try again.";
      setInlineError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Invalid sign in details";
      setInlineError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (error) {
        const lower = error.message.toLowerCase();
        const msg = lower.includes("invalid login credentials")
          ? "Invalid email or password. Please try again."
          : lower.includes("email") && lower.includes("confirm")
            ? "Please verify your email first (check your inbox), then sign in."
            : error.message;
        setInlineError(msg);
        toast.error(msg);
        return;
      }

      toast.success("Welcome back!");
      // Redirect is handled by onAuthStateChange
    } catch {
      const msg = "Sign in failed. Please try again.";
      setInlineError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="relative min-h-[80vh] flex items-center justify-center py-20 overflow-hidden">
        <CyberGrid />

        <motion.div
          className="relative z-10 w-full max-w-md px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <img
              src={academyLogo}
              alt="Cyber Defend Africa Academy"
              className="w-24 h-24 mx-auto mb-4 object-contain"
              loading="lazy"
            />
            <h1 className="font-display text-2xl font-bold text-foreground">
              Cyber Defend Africa
            </h1>
            <p className="text-muted-foreground mt-2">
              Your gateway to cybersecurity excellence
            </p>
          </div>

          <Card className="glass-card gradient-border">
            {inlineError ? (
              <div className="px-6 pt-6">
                <Alert variant="destructive" className="bg-destructive/10">
                  <AlertDescription>{inlineError}</AlertDescription>
                </Alert>
              </div>
            ) : null}

            <Tabs
              value={tab}
              onValueChange={(v) => {
                setTab(v as "signin" | "signup");
                setInlineError(null);
                clearSensitiveFields();
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Welcome back</CardTitle>
                  <CardDescription>
                    Sign in after you’ve verified your email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form noValidate onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-cyan hover:from-primary/90 hover:to-cyan/90"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Sign In
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>

              <TabsContent value="signup">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Create an account</CardTitle>
                  <CardDescription>
                    We’ll email you a verification link after signup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form noValidate onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="+234 800 000 0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Min. 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          minLength={6}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-confirm-password"
                          type="password"
                          placeholder="Re-enter password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-cyan hover:from-primary/90 hover:to-cyan/90"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Create Account
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </section>
    </Layout>
  );
}

