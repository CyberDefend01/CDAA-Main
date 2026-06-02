import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-muted-foreground font-medium">{message}</p>
    </div>
  );
}

export default LoadingScreen;
