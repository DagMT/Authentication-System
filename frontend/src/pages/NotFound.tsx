import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-glow opacity-20" />
      <div className="text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 group justify-center">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Go<span className="text-gradient">Auth</span></span>
        </Link>
        <h1 className="text-8xl font-bold text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="hero" size="lg" asChild>
            <Link to="/"><Home className="h-5 w-5 mr-2" />Go Home</Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5 mr-2" />Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
