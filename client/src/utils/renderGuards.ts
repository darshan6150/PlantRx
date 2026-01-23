import { useRef, useCallback } from 'react';

/**
 * Guard for URL/state updates to prevent infinite loops
 */
export function useUpdateGuard() {
  const updating = useRef(false);
  
  const guardedUpdate = useCallback(async (updateFn: () => Promise<void> | void) => {
    if (updating.current) return;
    
    updating.current = true;
    try {
      await updateFn();
    } finally {
      updating.current = false;
    }
  }, []);
  
  return { guardedUpdate, isUpdating: updating.current };
}

/**
 * Guard for router navigation to prevent duplicate navigations
 */
export function useNavigationGuard() {
  const navigating = useRef(false);
  
  const guardedNavigate = useCallback((navigateFn: () => void) => {
    if (navigating.current) return;
    
    navigating.current = true;
    // Reset after navigation completes
    try {
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => {
          navigating.current = false;
        });
      } else {
        // Fallback for environments without requestAnimationFrame
        setTimeout(() => {
          navigating.current = false;
        }, 16); // ~60fps
      }
    } catch (error) {
      console.warn('Error with requestAnimationFrame, using setTimeout fallback:', error);
      setTimeout(() => {
        navigating.current = false;
      }, 16);
    }
    
    navigateFn();
  }, []);
  
  return { guardedNavigate, isNavigating: navigating.current };
}

/**
 * Defer non-critical work to avoid blocking the main thread
 */
export function deferWork(callback: () => void, priority: 'idle' | 'timeout' = 'idle') {
  if (typeof window === 'undefined') {
    // Server-side rendering - execute immediately
    callback();
    return;
  }
  
  try {
    if (priority === 'idle' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(callback, { timeout: 1000 });
    } else {
      setTimeout(callback, 0);
    }
  } catch (error) {
    // Fallback to immediate execution if there's an error
    console.warn('Error in deferWork, executing immediately:', error);
    callback();
  }
}

/**
 * Break up long tasks into smaller chunks
 */
export function processInChunks<T>(
  items: T[],
  processor: (item: T, index: number) => void,
  chunkSize: number = 50
): Promise<void> {
  return new Promise((resolve) => {
    let index = 0;
    
    function processChunk() {
      const endIndex = Math.min(index + chunkSize, items.length);
      
      while (index < endIndex) {
        processor(items[index], index);
        index++;
      }
      
      if (index < items.length) {
        // Use setTimeout to yield control back to browser
        setTimeout(processChunk, 0);
      } else {
        resolve();
      }
    }
    
    processChunk();
  });
}