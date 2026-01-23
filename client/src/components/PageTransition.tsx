import { useEffect, useState } from "react";
import { LoadingScreen } from "./LoadingScreen";

interface PageTransitionProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export function PageTransition({ children, isLoading = false }: PageTransitionProps) {
  const [showLoading, setShowLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
      setMounted(false);
    } else {
      // Small delay to show smooth transition
      const timer = setTimeout(() => {
        setShowLoading(false);
        setMounted(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (showLoading) {
    return <LoadingScreen message="Loading page..." />;
  }

  return (
    <div 
      className={`transition-all duration-300 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {children}
    </div>
  );
}

// Hook for route transitions
export function usePageTransition() {
  const [isLoading, setIsLoading] = useState(false);

  const startTransition = () => setIsLoading(true);
  const endTransition = () => setIsLoading(false);

  return { isLoading, startTransition, endTransition };
}