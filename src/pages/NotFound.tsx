import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 animate-in-fade">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground/90">404</h1>
        <p className="text-xl text-muted-foreground">Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
