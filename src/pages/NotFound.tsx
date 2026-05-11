import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { CyberGrid } from "@/components/ui/CyberGrid";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="relative min-h-[70vh] flex items-center justify-center">
        <CyberGrid />
        <div className="text-center relative z-10 px-4">
          <Shield className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse-glow" />
          <h1 className="text-7xl font-display font-bold text-primary text-glow mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-2">Access Denied</p>
          <p className="text-sm text-muted-foreground mb-8 font-mono">
            Route <code className="text-primary">{location.pathname}</code> not found
          </p>
          <Link to="/">
            <Button className="gradient-primary text-primary-foreground font-semibold">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Return to Base
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
