import { useEffect, useState, createContext, useContext, useCallback, useRef } from "react";
import { useLocation } from "wouter";

interface LuxuryLoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
  triggerNavigation: () => void;
}

const LuxuryLoaderContext = createContext<LuxuryLoaderContextType | null>(null);

export function useLuxuryLoader() {
  const context = useContext(LuxuryLoaderContext);
  if (!context) {
    throw new Error("useLuxuryLoader must be used within LuxuryLoaderProvider");
  }
  return context;
}

// Ultra-fast simple loader - CSS only, no framer-motion
const SimpleLoader = ({ isVisible, onComplete }: { isVisible: boolean; onComplete: () => void }) => {
  useEffect(() => {
    if (isVisible) {
      // Complete after minimal delay - just enough to show something
      const timer = setTimeout(onComplete, 150);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-stone-50 to-emerald-50/30 dark:from-neutral-950 dark:to-neutral-950"
      style={{ 
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease-out'
      }}
    >
      <div className="flex flex-col items-center">
        {/* Simple Logo - No animations */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-2">
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
              <path
                d="M20 5C12 5 8 12 10 20C12 28 18 35 20 35C22 35 28 28 30 20C32 12 28 5 20 5Z"
                className="fill-emerald-600 dark:fill-emerald-500/70"
              />
              <path
                d="M20 8L20 32M14 15C16 18 18 22 20 28M26 15C24 18 22 22 20 28"
                className="stroke-emerald-800/60 dark:stroke-emerald-300/30"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-serif tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-emerald-700 dark:text-emerald-500">Plant</span>
            <span className="text-amber-600 dark:text-amber-500 font-bold">Rx</span>
          </h1>
        </div>

        {/* Simple progress indicator */}
        <div className="mt-4 w-32">
          <div className="h-1 bg-emerald-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-emerald-500 dark:bg-emerald-600 animate-loader-progress"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loader-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-loader-progress {
          animation: loader-progress 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export function LuxuryLoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const isInitialLoad = useRef(true);

  const showLoader = useCallback(() => {
    // Only show loader on initial load, not navigation
    if (isInitialLoad.current) {
      setIsLoading(true);
      setAnimationComplete(false);
    }
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  const triggerNavigation = useCallback(() => {
    // Disabled - don't show loader on navigation for faster perceived performance
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
  }, []);

  useEffect(() => {
    if (animationComplete) {
      setIsLoading(false);
      isInitialLoad.current = false;
    }
  }, [animationComplete]);

  // Skip loader entirely if page loads fast enough (content already visible)
  useEffect(() => {
    // Auto-complete after a short time even if animation hasn't finished
    const maxTimeout = setTimeout(() => {
      setIsLoading(false);
      setAnimationComplete(true);
      isInitialLoad.current = false;
    }, 300);
    
    return () => clearTimeout(maxTimeout);
  }, []);

  const showOverlay = isLoading && isInitialLoad.current;

  return (
    <LuxuryLoaderContext.Provider value={{ isLoading, showLoader, hideLoader, triggerNavigation }}>
      {showOverlay && <SimpleLoader isVisible={showOverlay} onComplete={handleAnimationComplete} />}
      <div
        style={{
          opacity: showOverlay ? 0 : 1,
          transition: 'opacity 0.1s ease-out',
        }}
      >
        {children}
      </div>
    </LuxuryLoaderContext.Provider>
  );
}

// Export for backward compatibility
const LoaderOverlay = SimpleLoader;
export { LoaderOverlay };
