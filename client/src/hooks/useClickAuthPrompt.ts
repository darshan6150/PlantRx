import { useEffect, useCallback } from 'react';
import { onAuthStateChanged } from '@/auth';

const STORAGE_KEYS = {
  clickCount: 'plantrx_click_count',
  lastShown: 'plantrx_auth_prompt_last_shown',
  dismissed: 'plantrx_auth_prompt_dismissed',
  pricingRedirected: 'plantrx_pricing_redirected',
  notNowClicked: 'plantrx_not_now_clicked',
  postNotNowClicks: 'plantrx_post_not_now_clicks',
  hasCompletedFlow: 'plantrx_completed_flow',
};

const CLICK_THRESHOLD = 3; // Changed from 4 to 3
const POST_NOT_NOW_THRESHOLD = 2; // 2 clicks after "Not Now"
const COOLDOWN_HOURS = 24; // 24 hours between prompts
const DISMISS_COOLDOWN_HOURS = 72; // 72 hours after user dismisses

export function useClickAuthPrompt() {
  const getStoredNumber = (key: string, defaultValue: number = 0): number => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? parseInt(stored, 10) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const setStoredNumber = (key: string, value: number): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value.toString());
    } catch {
      // Ignore storage errors
    }
  };

  const getStoredBoolean = (key: string, defaultValue: boolean = false): boolean => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored === 'true';
    } catch {
      return defaultValue;
    }
  };

  const setStoredBoolean = (key: string, value: boolean): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value.toString());
    } catch {
      // Ignore storage errors
    }
  };

  const isWithinCooldown = (lastShownTime: number, hours: number): boolean => {
    const now = Date.now();
    const cooldownMs = hours * 60 * 60 * 1000;
    return (now - lastShownTime) < cooldownMs;
  };

  const shouldShowPrompt = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;

    // Check if user is already authenticated - don't show popup if signed in
    try {
      const storedUser = localStorage.getItem('plantrx-user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.isAuthenticated) {
          console.log('[ClickAuthPrompt] User already authenticated - not showing modal');
          return false;
        }
      }
    } catch (error) {
      // Ignore parsing errors
    }

    // Check if user dismissed recently
    const dismissed = getStoredBoolean(STORAGE_KEYS.dismissed);
    const lastShown = getStoredNumber(STORAGE_KEYS.lastShown);
    
    if (dismissed && lastShown && isWithinCooldown(lastShown, DISMISS_COOLDOWN_HOURS)) {
      console.log('[ClickAuthPrompt] Within dismiss cooldown');
      return false;
    }

    // Check regular cooldown
    if (lastShown && isWithinCooldown(lastShown, COOLDOWN_HOURS)) {
      console.log('[ClickAuthPrompt] Within regular cooldown');
      return false;
    }

    // Don't check click count here - let the caller handle it
    return true;
  }, []);

  const handleClick = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Check if user has completed the flow already
    const hasCompleted = getStoredBoolean(STORAGE_KEYS.hasCompletedFlow);
    if (hasCompleted) return;

    // Check if "Not Now" was clicked on pricing page
    const notNowClicked = getStoredBoolean(STORAGE_KEYS.notNowClicked);
    
    if (notNowClicked) {
      // Track post-"Not Now" clicks
      const postCount = getStoredNumber(STORAGE_KEYS.postNotNowClicks);
      const newPostCount = postCount + 1;
      setStoredNumber(STORAGE_KEYS.postNotNowClicks, newPostCount);
      
      console.log(`[ClickAuthPrompt] Post-NotNow Click ${newPostCount}/${POST_NOT_NOW_THRESHOLD}`);
      
      // After 2 more clicks, redirect to signup page
      if (newPostCount >= POST_NOT_NOW_THRESHOLD) {
        console.log('[ClickAuthPrompt] Redirecting to forced signup page');
        // Set lastShown timestamp NOW (not earlier at pricing redirect)
        setStoredNumber(STORAGE_KEYS.lastShown, Date.now());
        // Mark that user is in forced flow
        setStoredBoolean('plantrx_forced_flow_active', true);
        // Reset the post-not-now clicks
        setStoredNumber(STORAGE_KEYS.postNotNowClicks, 0);
        // Redirect to signup page
        window.location.href = '/signup';
      }
    } else {
      // Track initial clicks before pricing redirect
      const currentCount = getStoredNumber(STORAGE_KEYS.clickCount);
      const newCount = currentCount + 1;
      setStoredNumber(STORAGE_KEYS.clickCount, newCount);

      console.log(`[ClickAuthPrompt] Click ${newCount}/${CLICK_THRESHOLD}`);

      // Check if we should redirect to pricing
      if (newCount >= CLICK_THRESHOLD) {
        const canShow = shouldShowPrompt();
        console.log(`[ClickAuthPrompt] Threshold reached. Can show:`, canShow);
        
        if (canShow) {
          console.log('[ClickAuthPrompt] Redirecting to pricing page');
          // Mark that we've redirected to pricing
          setStoredBoolean(STORAGE_KEYS.pricingRedirected, true);
          setStoredNumber(STORAGE_KEYS.clickCount, 0);
          // DON'T set lastShown here - only set it when forced signup modal actually appears
          setStoredBoolean(STORAGE_KEYS.dismissed, false);

          // Redirect to pricing page
          window.location.href = '/pricing';
        }
      }
    }
  }, [shouldShowPrompt]);

  const resetClickCount = useCallback(() => {
    if (typeof window === 'undefined') return;
    setStoredNumber(STORAGE_KEYS.clickCount, 0);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // DISABLED: Global click tracking is now replaced by targeted content auth gate
    // (useContentAuthGate hook tracks remedy and article clicks separately)
    // Keeping this hook for utility functions used by Signup/Login pages
    console.log('[ClickAuthPrompt] Global click tracking disabled - using targeted auth gate');

    // Listen for auth state changes to reset count when user logs in
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        resetClickCount();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [resetClickCount]);

  const markNotNowClicked = useCallback(() => {
    if (typeof window === 'undefined') return;
    setStoredBoolean(STORAGE_KEYS.notNowClicked, true);
    setStoredNumber(STORAGE_KEYS.postNotNowClicks, 0);
    console.log('[ClickAuthPrompt] "Not Now" clicked - starting post-pricing click tracking');
  }, []);

  const markFlowCompleted = useCallback(() => {
    if (typeof window === 'undefined') return;
    setStoredBoolean(STORAGE_KEYS.hasCompletedFlow, true);
    console.log('[ClickAuthPrompt] Flow completed - disabling click tracking');
  }, []);

  const resetFlow = useCallback(() => {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore errors
      }
    });
    console.log('[ClickAuthPrompt] Flow reset');
  }, []);

  return {
    getCurrentClickCount: () => getStoredNumber(STORAGE_KEYS.clickCount),
    getPostNotNowClickCount: () => getStoredNumber(STORAGE_KEYS.postNotNowClicks),
    hasCompletedFlow: () => getStoredBoolean(STORAGE_KEYS.hasCompletedFlow),
    hasPricingRedirected: () => getStoredBoolean(STORAGE_KEYS.pricingRedirected),
    hasNotNowClicked: () => getStoredBoolean(STORAGE_KEYS.notNowClicked),
    resetClickCount,
    markNotNowClicked,
    markFlowCompleted,
    resetFlow,
  };
}