import { TRUST_POPUP_CFG as CFG } from "@/lib/trustPopupConfig";

export const TRUST_LS = {
  lastShownAt: "plrx_trust_last_shown_at",
  lastVotedAt: "plrx_trust_last_voted_at",
};

function daysSince(ts: number) {
  return (Date.now() - ts) / (24 * 3600_000);
}

export function eligibleToShowNow(): boolean {
  if ((window as any).PLANT_RX_MODAL_ACTIVE) return false;
  const lastShown = Number(localStorage.getItem(TRUST_LS.lastShownAt) || 0);
  const lastVoted = Number(localStorage.getItem(TRUST_LS.lastVotedAt) || 0);
  const cooled =
    (!lastShown || daysSince(lastShown) >= CFG.cooldownDays) &&
    (!lastVoted || daysSince(lastVoted) >= CFG.cooldownDays);
  return cooled;
}

export function markShown() {
  localStorage.setItem(TRUST_LS.lastShownAt, String(Date.now()));
}

export function markVotedOrDismissed() {
  localStorage.setItem(TRUST_LS.lastVotedAt, String(Date.now()));
}

export async function recordVoteIfEnabled(score: 0 | 1 | 2 | 3) {
  if (!CFG.firestoreEnabled) return;
  try {
    // Example Firestore write (fill with your initialized db if you enable later):
    // const col = collection(db, "trustFeedback");
    // await addDoc(col, {
    //   score,
    //   ts: Date.now(),
    //   path: location.pathname,
    //   ua: navigator.userAgent,
    // });
  } catch {}
}