import { useCallback } from 'react';
import { auth } from '@/auth';

const STORAGE_KEYS = {
  remedyClicks: 'plantrx_remedy_clicks',
  articleClicks: 'plantrx_article_clicks',
  returnState: 'plantrx_auth_return_state',
};

const REMEDY_THRESHOLD = 3;
const ARTICLE_THRESHOLD = 3;

export interface ReturnState {
  path: string;
  scrollY: number;
  timestamp: number;
}

function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check Firebase auth state first (most reliable)
  if (auth.currentUser) {
    return true;
  }
  
  // Fallback to localStorage check (for persistent session)
  try {
    const storedUser = localStorage.getItem('plantrx-user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      return userData.isAuthenticated === true;
    }
  } catch {
    // Ignore parsing errors
  }
  return false;
}

function getCount(key: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

function setCount(key: string, value: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value.toString());
  } catch {
    // Ignore storage errors
  }
}

function saveReturnState(): void {
  if (typeof window === 'undefined') return;
  try {
    const state: ReturnState = {
      path: window.location.pathname + window.location.search + window.location.hash,
      scrollY: window.scrollY,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(STORAGE_KEYS.returnState, JSON.stringify(state));
    console.log('[ContentAuthGate] Saved return state:', state);
  } catch (error) {
    console.error('[ContentAuthGate] Failed to save return state:', error);
  }
}

export function getReturnState(): ReturnState | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEYS.returnState);
    if (stored) {
      const state = JSON.parse(stored) as ReturnState;
      // Only use if saved within last 30 minutes
      if (Date.now() - state.timestamp < 30 * 60 * 1000) {
        return state;
      }
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
}

export function clearReturnState(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEYS.returnState);
  } catch {
    // Ignore errors
  }
}

export function restoreScrollPosition(scrollY: number): void {
  if (typeof window === 'undefined') return;
  
  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    // Wait a bit for content to load
    setTimeout(() => {
      window.scrollTo({ top: scrollY, behavior: 'instant' });
      console.log('[ContentAuthGate] Restored scroll position to:', scrollY);
    }, 100);
  });
}

export function resetContentCounts(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.remedyClicks);
    localStorage.removeItem(STORAGE_KEYS.articleClicks);
    console.log('[ContentAuthGate] Reset all content counts');
  } catch {
    // Ignore errors
  }
}

export function useContentAuthGate() {
  const trackRemedyClick = useCallback((onProceed: () => void): void => {
    // If authenticated, just proceed
    if (isAuthenticated()) {
      onProceed();
      return;
    }

    const currentCount = getCount(STORAGE_KEYS.remedyClicks);
    const newCount = currentCount + 1;
    setCount(STORAGE_KEYS.remedyClicks, newCount);
    
    console.log(`[ContentAuthGate] Remedy click ${newCount}/${REMEDY_THRESHOLD}`);

    // Check if threshold reached
    if (newCount >= REMEDY_THRESHOLD) {
      console.log('[ContentAuthGate] Remedy threshold reached - redirecting to signup');
      saveReturnState();
      setCount(STORAGE_KEYS.remedyClicks, 0); // Reset for next time
      window.location.href = '/signup';
      return;
    }

    // Proceed with action
    onProceed();
  }, []);

  const trackArticleClick = useCallback((onProceed: () => void): void => {
    // If authenticated, just proceed
    if (isAuthenticated()) {
      onProceed();
      return;
    }

    const currentCount = getCount(STORAGE_KEYS.articleClicks);
    const newCount = currentCount + 1;
    setCount(STORAGE_KEYS.articleClicks, newCount);
    
    console.log(`[ContentAuthGate] Article click ${newCount}/${ARTICLE_THRESHOLD}`);

    // Check if threshold reached
    if (newCount >= ARTICLE_THRESHOLD) {
      console.log('[ContentAuthGate] Article threshold reached - redirecting to signup');
      saveReturnState();
      setCount(STORAGE_KEYS.articleClicks, 0); // Reset for next time
      window.location.href = '/signup';
      return;
    }

    // Proceed with action
    onProceed();
  }, []);

  const getRemedyClickCount = useCallback((): number => {
    return getCount(STORAGE_KEYS.remedyClicks);
  }, []);

  const getArticleClickCount = useCallback((): number => {
    return getCount(STORAGE_KEYS.articleClicks);
  }, []);

  return {
    trackRemedyClick,
    trackArticleClick,
    getRemedyClickCount,
    getArticleClickCount,
    resetContentCounts,
  };
}
