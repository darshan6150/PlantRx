/**
 * Global Animation Configuration System
 * Normalizes animation speeds across Replit Preview and external environments
 */

import React from 'react';

// Detect if running in iframe (Replit Preview)
const isInIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch {
    return true; // Assume iframe if we can't check
  }
};

// Global timing configuration
export const ANIMATION_CONFIG = {
  // Base timing scale - unified across all devices
  EXTERNAL_SCALE: 1.6,
  PREVIEW_SCALE: 1.6, // Same speed on all devices
  
  // Minimum durations (in seconds) - aligned with UX requirements
  MIN_TRANSITION: 0.8,
  MIN_MICRO_MOTION: 0.5,
  MIN_PAGE_ENTRANCE: 1.0,
  
  // Maximum durations (in seconds) - to keep within target ranges
  MAX_TRANSITION: 2.0,
  MAX_PAGE_ENTRANCE: 3.0,
  
  // Current environment
  IS_PREVIEW: isInIframe(),
  
  // Calculate actual duration based on environment
  getDuration: (baseDuration: number): number => {
    const scale = ANIMATION_CONFIG.IS_PREVIEW ? ANIMATION_CONFIG.PREVIEW_SCALE : ANIMATION_CONFIG.EXTERNAL_SCALE;
    const scaledDuration = baseDuration * scale; // Scale > 1.0 = longer duration = slower animation
    
    // Enforce minimums and maximums based on animation type
    if (baseDuration >= 0.6) {
      const clamped = Math.max(scaledDuration, ANIMATION_CONFIG.MIN_PAGE_ENTRANCE);
      return Math.min(clamped, ANIMATION_CONFIG.MAX_PAGE_ENTRANCE);
    } else if (baseDuration >= 0.3) {
      const clamped = Math.max(scaledDuration, ANIMATION_CONFIG.MIN_TRANSITION);
      return Math.min(clamped, ANIMATION_CONFIG.MAX_TRANSITION);
    } else {
      return Math.max(scaledDuration, ANIMATION_CONFIG.MIN_MICRO_MOTION);
    }
  },
  
  // Get CSS duration string
  getCSSTransition: (property: string = 'all', baseDuration: number = 0.5, easing: string = 'ease-in-out'): string => {
    const duration = ANIMATION_CONFIG.getDuration(baseDuration);
    return `${property} ${duration}s ${easing}`;
  },
  
  // Get Tailwind duration class
  getTailwindDuration: (baseDuration: number = 0.5): string => {
    const duration = ANIMATION_CONFIG.getDuration(baseDuration);
    const durationMs = Math.round(duration * 1000);
    
    // Map to closest Tailwind duration class
    if (durationMs <= 150) return 'duration-150';
    if (durationMs <= 200) return 'duration-200';
    if (durationMs <= 300) return 'duration-300';
    if (durationMs <= 500) return 'duration-500';
    if (durationMs <= 700) return 'duration-700';
    if (durationMs <= 1000) return 'duration-1000';
    return 'duration-1000';
  },
  
  // Frame-accurate animation loop helper
  createAnimationLoop: (callback: (deltaTime: number, totalTime: number) => boolean) => {
    let startTime: number | null = null;
    let lastTime = 0;
    let animationId: number | null = null;
    let isRunning = false;
    
    const loop = (timestamp: number) => {
      if (!isRunning) return;
      
      if (!startTime) startTime = timestamp;
      const totalTime = (timestamp - startTime) / 1000; // Convert to seconds
      const deltaTime = (timestamp - lastTime) / 1000;
      lastTime = timestamp;
      
      // Call callback with delta time, continue if it returns true
      const shouldContinue = callback(deltaTime, totalTime);
      
      if (shouldContinue && isRunning) {
        animationId = requestAnimationFrame(loop);
      } else {
        isRunning = false;
        animationId = null;
      }
    };
    
    return {
      start: () => {
        if (!isRunning) {
          isRunning = true;
          startTime = null;
          lastTime = 0;
          animationId = requestAnimationFrame(loop);
        }
      },
      stop: () => {
        isRunning = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      },
      isRunning: () => isRunning
    };
  }
};

// React StrictMode guard for animations
export const useAnimationGuard = () => {
  const mountedRef = React.useRef(false);
  const cleanupRef = React.useRef<(() => void)[]>([]);
  
  React.useEffect(() => {
    if (mountedRef.current) return; // Prevent double execution in StrictMode
    mountedRef.current = true;
    
    return () => {
      // Cleanup all animations on unmount
      cleanupRef.current.forEach(cleanup => cleanup());
      cleanupRef.current = [];
      mountedRef.current = false;
    };
  }, []);
  
  const registerCleanup = React.useCallback((cleanup: () => void) => {
    cleanupRef.current.push(cleanup);
  }, []);
  
  return { 
    isMounted: () => mountedRef.current,
    registerCleanup 
  };
};

// Export for debugging
if (typeof window !== 'undefined') {
  (window as any).__ANIMATION_CONFIG = ANIMATION_CONFIG;
  console.log('🎬 Animation Config:', {
    environment: ANIMATION_CONFIG.IS_PREVIEW ? 'Preview' : 'External',
    scale: ANIMATION_CONFIG.IS_PREVIEW ? ANIMATION_CONFIG.PREVIEW_SCALE : ANIMATION_CONFIG.EXTERNAL_SCALE,
    sampleDurations: {
      micro: ANIMATION_CONFIG.getDuration(0.2),
      transition: ANIMATION_CONFIG.getDuration(0.5),
      entrance: ANIMATION_CONFIG.getDuration(0.8)
    }
  });
}