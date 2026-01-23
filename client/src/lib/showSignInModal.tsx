// src/lib/showSignInModal.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { SignInModal } from "@/components/SignInModal";

let root: ReturnType<typeof createRoot> | null = null;
let host: HTMLElement | null = null;

export function showSignInModal(opts: { hard?: boolean; onDismiss?: ()=>void } = {}) {
  if (typeof window === 'undefined') return; // SSR safety
  
  if (!host) {
    host = document.createElement("div");
    host.id = "plrx-signin-host";
    host.style.position = "fixed";
    host.style.inset = "0";
    host.style.zIndex = "9999";
    host.style.pointerEvents = "none";
    document.body.appendChild(host);
    root = createRoot(host);
  }
  
  const close = () => {
    if (!root || !host) return;
    root.render(<></>);
    opts.onDismiss?.();
  };
  
  // Modal is now always mandatory (hard mode) - no close option
  root!.render(<SignInModal hard={true} onClose={undefined} />);
}