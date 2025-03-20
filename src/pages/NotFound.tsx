
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="glass-card p-8 max-w-md w-full text-center animate-fade-in">
        <h1 className="text-6xl font-bold mb-6">404</h1>
        <p className="text-xl text-foreground/80 mb-8">This page doesn't exist</p>
        <Button 
          size="lg" 
          onClick={() => navigate('/')}
          className="transition-all duration-300 hover:scale-105"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
