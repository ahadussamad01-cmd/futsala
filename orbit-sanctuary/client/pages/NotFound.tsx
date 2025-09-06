import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="py-24">
      <div className="mx-auto w-full max-w-3xl px-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight mb-4">404</h1>
        <p className="text-base text-muted-foreground mb-6">Page not found</p>
        <a href="/" className="inline-flex items-center border border-foreground px-4 py-2">go home</a>
      </div>
    </div>
  );
};

export default NotFound;
