import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRIES = [
  "Nigeria", "United States", "United Kingdom", "Canada", "Ghana", 
  "South Africa", "Kenya", "India", "Germany", "France", "Australia",
  "Brazil", "Egypt", "Saudi Arabia", "UAE", "Other"
];

interface ProfileSetupModalProps {
  isOpen: boolean;
  onComplete: () => void;
  userId: string;
}

export const ProfileSetupModal = ({ isOpen, onComplete, userId }: ProfileSetupModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    country: "",
    avatar_url: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, bio, country, avatar_url")
        .eq("user_id", userId)
        .single();
      
      if (data) {
        setFormData({
          full_name: data.full_name || "",
          bio: data.bio || "",
          country: data.country || "",
          avatar_url: data.avatar_url || "",
        });
      }
    };

    if (isOpen && userId) {
      fetchProfile();
    }
  }, [isOpen, userId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload an image under 2MB", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: urlData.publicUrl }));
      toast({ title: "Image uploaded successfully" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name.trim(),
          bio: formData.bio.trim() || null,
          country: formData.country || null,
          avatar_url: formData.avatar_url || null,
        })
        .eq("user_id", userId);

      if (error) throw error;

      toast({ title: "Profile setup complete!" });
      onComplete();
    } catch (error: any) {
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md glass-heavy border-border/60 rounded-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="mb-1">
          <DialogTitle className="font-display font-bold text-xl tracking-display">Complete Your Profile</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in your details to personalise your learning experience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-20 w-20 ring-2 ring-border/60 ring-offset-2 ring-offset-background">
              <AvatarImage src={formData.avatar_url} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-cyan text-white">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {isUploading ? "Uploading…" : "Upload Photo"}
              </div>
            </Label>
            <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="full_name" className="text-sm font-semibold">Full Name *</Label>
            <Input id="full_name" value={formData.full_name} onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))} placeholder="Abubakar Ibrahim" className="h-11 rounded-xl bg-surface border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-sm" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-sm font-semibold">Bio <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea id="bio" value={formData.bio} onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))} placeholder="Tell us about your goals and interests…" rows={3} className="rounded-xl bg-surface border-border/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/10 text-sm resize-none" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="country" className="text-sm font-semibold">Country</Label>
            <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
              <SelectTrigger className="h-11 rounded-xl bg-surface border-border/60 text-sm">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full btn-cyber h-11 text-white font-bold rounded-xl shadow-neon-cyan" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : "Complete Setup"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
