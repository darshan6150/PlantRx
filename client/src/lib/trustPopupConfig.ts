export const TRUST_POPUP_CFG = {
  delayMs: 20000,            // ~20s before first check
  minScrollPct: 25,          // first session must scroll ≥25%
  returnerPV: 2,             // show to returners after 2 PV in 7d (or on exit intent)
  cooldownDays: 7,           // don't re-show for 7 days after interact
  overlapDelayMs: 30000,     // if another modal active/scheduled, defer 30s
  variant: "A" as "A" | "B" | "C",
  firestoreEnabled: false,   // set true only if Firestore collection is configured
};