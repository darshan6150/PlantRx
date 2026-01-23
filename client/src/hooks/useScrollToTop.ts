import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function useScrollToTop(behavior: 'smooth' | 'instant' = 'instant') {
  const [location] = useLocation();

  useEffect(() => {
    // Immediate scroll to top when location changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: behavior
    });
    
    // Additional scroll to top after a short delay for complex pages
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: behavior
      });
    }, 50);
    
    return () => clearTimeout(timer);
  }, [location, behavior]);
}

// Utility function for manual scroll to top
export function scrollToTop(behavior: 'smooth' | 'instant' = 'smooth') {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: behavior
  });
}

export default useScrollToTop;