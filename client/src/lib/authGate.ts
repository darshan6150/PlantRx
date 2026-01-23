// src/lib/authGate.ts
import { showSignInModal } from "@/lib/showSignInModal";
import { AUTH_GATE_CFG as CFG } from "@/lib/authGateConfig";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/auth";

const LS = {
  pv: 'plrx_pv',
  firstAt: 'plrx_first_at',
  lastPromptAt: 'plrx_last_prompt_at',
  dismissed: 'plrx_prompt_dismissed',
  visits: 'plrx_visit_timestamps',
};

const SS = {
  intentCount: 'plrx_intent_count',
};

const now = () => Date.now();

function getJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { 
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback; 
  }
  catch { return fallback; }
}

function setJSON(key: string, value: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function withinHours(ts: number, hours: number) {
  return (now() - ts) < hours * 3600_000;
}

function shouldCooldown(): boolean {
  if (typeof window === 'undefined') return true;
  const last = Number(localStorage.getItem(LS.lastPromptAt) || 0);
  const dismissed = localStorage.getItem(LS.dismissed) === '1';
  return (dismissed && withinHours(last, CFG.coolDownHours));
}

function recordVisit() {
  if (typeof window === 'undefined') return;
  const visits = getJSON<number[]>(LS.visits, []);
  visits.push(now());
  // keep last 20
  setJSON(LS.visits, visits.slice(-20));
}

function countVisitsInDays(days: number) {
  const visits = getJSON<number[]>(LS.visits, []);
  const cutoff = now() - days * 24 * 3600_000;
  return visits.filter(t => t >= cutoff).length;
}

let currentUser: any = null;

// Listen to auth state changes
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
  });
}

export function initAuthGate() {
  if (typeof window === 'undefined') return; // SSR safety
  
  // Bot detection - don't show prompts to crawlers
  const userAgent = navigator.userAgent.toLowerCase();
  const isBot = /bot|crawl|spider|scrape|facebook|whatsapp|google/i.test(userAgent);
  if (isBot) return;

  // init counters
  if (!localStorage.getItem(LS.pv)) localStorage.setItem(LS.pv, '0');
  if (!localStorage.getItem(LS.firstAt)) localStorage.setItem(LS.firstAt, String(now()));
  if (!sessionStorage.getItem(SS.intentCount)) sessionStorage.setItem(SS.intentCount, '0');

  // pageview++
  localStorage.setItem(LS.pv, String(Number(localStorage.getItem(LS.pv)) + 1));
  recordVisit();

  const pv = Number(localStorage.getItem(LS.pv));
  const firstAt = Number(localStorage.getItem(LS.firstAt));
  const secondsOnSite = Math.floor((now() - firstAt) / 1000);

  // soft by PV/time
  const scheduleSoft = () => {
    if (shouldCooldown() || currentUser) return;
    localStorage.setItem(LS.lastPromptAt, String(now()));
    showSignInModal({ 
      hard: false, 
      onDismiss: () => {
        localStorage.setItem(LS.dismissed, '1');
      }
    });
  };

  // Automatic prompts disabled - only trigger on intent actions
  // Users should only see sign-in prompts when they try to save/download/book
}

export function requireAuthForAction<T extends (...args:any)=>any>(fn: T) {
  return async (...args: Parameters<T>) => {
    if (typeof window === 'undefined') return;
    
    // Check if user is signed in
    if (currentUser) return fn(...args);

    const count = Number(sessionStorage.getItem(SS.intentCount) || '0');
    sessionStorage.setItem(SS.intentCount, String(count + 1));

    if (count === 0) {
      // First intent → soft prompt
      if (!shouldCooldown()) {
        localStorage.setItem(LS.lastPromptAt, String(now()));
        showSignInModal({ 
          hard: false, 
          onDismiss: () => {
            localStorage.setItem(LS.dismissed, '1');
          }
        });
      }
      return;
    }

    // Second intent → hard wall
    localStorage.setItem(LS.lastPromptAt, String(now()));
    showSignInModal({ hard: true });
    return; // block until sign-in
  };
}