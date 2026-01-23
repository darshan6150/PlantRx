import { useEffect, useMemo, useState } from "react";
import { TRUST_POPUP_CFG as CFG } from "@/lib/trustPopupConfig";
import { eligibleToShowNow, markShown, markVotedOrDismissed, recordVoteIfEnabled } from "@/lib/trustPopup";
import { X } from "lucide-react";

const COPY = {
  A: {
    title: "Why Thousands Trust PlantRx",
    body:
      "PlantRx is the world's most trusted natural health platform with 166+ expert-verified plant remedies. Every remedy is scientifically backed, safety-tested, and written by certified herbalists. No synthetic chemicals, no side effects — just pure plant medicine that actually works. Over 50,000 people have transformed their health naturally with our guidance. Your privacy is sacred: we never sell your data or track your personal information.",
  },
  B: {
    title: "The Natural Health Revolution",
    body:
      "Join 50,000+ people who chose PlantRx over expensive pharmaceuticals. Our 166+ expert-verified remedies combine ancient wisdom with modern science. Every solution is plant-based, safety-tested, and proven effective. Free forever, privacy-first, and trusted by health professionals worldwide. Transform your health naturally — the way nature intended.",
  },
  C: {
    title: "Expert-Verified Plant Medicine",
    body:
      "PlantRx = 166+ scientifically-proven plant remedies, zero synthetic chemicals. Expert-verified by certified herbalists, safety-tested, and trusted by 50,000+ users. Free platform, complete privacy protection, real results from pure plant medicine. Your natural health journey starts here.",
  },
};

function isReturnerPV(): boolean {
  const pv = Number(localStorage.getItem("plrx_pv") || "0"); // shared with your auth-gate
  return pv >= CFG.returnerPV;
}

export default function TrustPopup() {
  const [open, setOpen] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [mounted, setMounted] = useState(false);
  const variant = useMemo(() => COPY[CFG.variant], []);

  // Ensure component is mounted before running effects
  useEffect(() => {
    setMounted(true);
  }, []);

  // Overlap defer (check every 2s)
  useEffect(() => {
    if (!mounted) return;
    
    const id = window.setInterval(() => {
      if ((window as any).PLANT_RX_MODAL_ACTIVE && open) {
        // If some other modal opened, close and try later
        setOpen(false);
        setTimeout(() => maybeOpen(), CFG.overlapDelayMs);
      }
    }, 2000);
    return () => clearInterval(id);
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    // schedule by time/scroll for first session, or pageviews for returners
    if (!eligibleToShowNow()) return;

    const onTimer = () => {
      if (!eligibleToShowNow()) return;
      if ((window as any).PLANT_RX_MODAL_ACTIVE) {
        setTimeout(onTimer, CFG.overlapDelayMs);
        return;
      }

      const returner = isReturnerPV();
      const scrolledPct =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      const scrolledEnough = scrolledPct >= CFG.minScrollPct;

      if ((returner && !open) || (!returner && scrolledEnough && !open)) {
        maybeOpen();
      }
    };

    const timer = window.setTimeout(onTimer, CFG.delayMs);

    // Exit intent (desktop only)
    const onMouseOut = (e: MouseEvent) => {
      if (open) return;
      if (!eligibleToShowNow()) return;
      if (e.clientY <= 0 || e.clientY < 10) {
        maybeOpen();
        document.removeEventListener("mouseout", onMouseOut);
      }
    };
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [mounted]);

  const maybeOpen = () => {
    if ((window as any).PLANT_RX_MODAL_ACTIVE) {
      setTimeout(maybeOpen, CFG.overlapDelayMs);
      return;
    }
    markShown();
    setOpen(true);
  };

  const vote = async (score: 0 | 1 | 2 | 3) => {
    await recordVoteIfEnabled(score);
    setThanks(true);
    // Don't auto-close after voting - let user close manually with X button
  };

  const close = () => {
    markVotedOrDismissed();
    setOpen(false);
  };

  if (!mounted || !open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
      <div className="relative w-[85%] max-w-[240px] sm:max-w-md mx-auto rounded-lg sm:rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 p-2 sm:p-5 animate-in fade-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 sm:p-2"
          onClick={close}
          aria-label="Close"
          data-testid="button-close-popup"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="text-center">
          {/* Main logo */}
          <div className="mx-auto mb-1 sm:mb-3 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
            <span className="text-sm sm:text-xl">🌿</span>
          </div>
          
          {/* Trust headline */}
          <h3 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
            Trusted by Thousands
          </h3>
          <h4 className="text-[10px] sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
            {variant.title}
          </h4>
          
          {/* Main content */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-1.5 sm:p-4 mb-1 sm:mb-3">
            <p className="text-[8px] sm:text-xs text-gray-700 dark:text-gray-300 leading-tight">
              {variant.body}
            </p>
          </div>
          
          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-0.5 sm:gap-2 mb-1 sm:mb-3">
            <div className="text-center">
              <div className="text-xs sm:text-lg mb-0.5">🎯</div>
              <div className="text-[7px] sm:text-[10px] font-medium text-gray-700 dark:text-gray-300">1M+ Goal</div>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-lg mb-0.5">🔒</div>
              <div className="text-[7px] sm:text-[10px] font-medium text-gray-700 dark:text-gray-300">Privacy First</div>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-lg mb-0.5">✅</div>
              <div className="text-[7px] sm:text-[10px] font-medium text-gray-700 dark:text-gray-300">Expert Reviewed</div>
            </div>
          </div>

          {/* Feedback section */}
          <div className="mb-1 sm:mb-3">
            <p className="text-[8px] sm:text-xs font-medium text-gray-900 dark:text-white mb-0.5 sm:mb-1">
              How are we doing?
            </p>
            <div className="flex justify-center items-center gap-0.5 sm:gap-2 text-sm sm:text-xl">
              {thanks ? (
                <span className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">✅ Thanks!</span>
              ) : (
                <>
                  <button 
                    aria-label="Bad" 
                    onClick={() => vote(0)}
                    className="hover:scale-110 transition-transform duration-200 p-0.5 sm:p-1"
                    data-testid="feedback-bad"
                  >
                    😞
                  </button>
                  <button 
                    aria-label="Okay" 
                    onClick={() => vote(1)}
                    className="hover:scale-110 transition-transform duration-200 p-0.5 sm:p-1"
                    data-testid="feedback-okay"
                  >
                    😐
                  </button>
                  <button 
                    aria-label="Good" 
                    onClick={() => vote(2)}
                    className="hover:scale-110 transition-transform duration-200 p-0.5 sm:p-1"
                    data-testid="feedback-good"
                  >
                    🙂
                  </button>
                  <button 
                    aria-label="Great" 
                    onClick={() => vote(3)}
                    className="hover:scale-110 transition-transform duration-200 p-0.5 sm:p-1"
                    data-testid="feedback-great"
                  >
                    😍
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="flex justify-center items-center gap-0.5 sm:gap-2 text-[7px] sm:text-xs mb-1 sm:mb-3">
            <a 
              href="/about#mission" 
              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 underline transition-colors"
              data-testid="link-mission"
            >
              See our mission
            </a>
            <span className="text-gray-400">•</span>
            <a 
              href="/privacy" 
              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 underline transition-colors"
              data-testid="link-privacy"
            >
              Privacy
            </a>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center items-center gap-0.5 text-[7px] sm:text-[10px] text-gray-500 dark:text-gray-400 mb-1 sm:mb-3">
          <span>Plant-only</span>
          <span>•</span>
          <span>Community-reviewed</span>
          <span>•</span>
          <span>Privacy-first</span>
        </div>

        {/* Donation section */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-1 sm:pt-2 text-center">
          <p className="mb-0.5 sm:mb-1 text-[7px] sm:text-xs text-gray-700 dark:text-gray-300 font-medium">
            Support children in crisis
          </p>
          <a
            href="https://www.unicef.org/emergencies/children-gaza-need-lifesaving-support"
            onClick={(e) => { e.preventDefault(); window.open('https://www.unicef.org/emergencies/children-gaza-need-lifesaving-support', '_blank', 'noopener,noreferrer'); }}
            className="inline-flex items-center justify-center px-1.5 py-0.5 sm:px-3 sm:py-1 bg-blue-600 hover:bg-blue-700 text-white rounded sm:rounded-md font-medium transition-colors shadow-sm text-[7px] sm:text-xs cursor-pointer"
            data-testid="link-unicef-donation"
          >
            UNICEF Gaza Children Appeal
          </a>
        </div>
      </div>
    </div>
  );
}