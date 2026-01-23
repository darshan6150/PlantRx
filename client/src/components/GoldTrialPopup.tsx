import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, X, ArrowRight, Star, Gift, Check, Users, Shield, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

interface TrialStatus {
  trialActive: boolean;
  trialUsed: boolean;
  canStartTrial: boolean;
  authenticated: boolean;
}

const POPUP_STORAGE_KEY = 'plantrx-trial-popup-shown';
const POPUP_DELAY_MS = 3000; // Show after 3 seconds

export function GoldTrialPopup() {
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Fetch trial status - includes authentication state from backend
  const { data: trialStatus } = useQuery<TrialStatus>({
    queryKey: ["/api/trial/status"],
  });

  // Use backend authentication status (more reliable than localStorage)
  const isAuthenticated = trialStatus?.authenticated === true;

  // Start trial mutation
  const startTrialMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/trial/start", "POST");
    },
    onSuccess: () => {
      toast({
        title: "🎉 Gold Trial Activated!",
        description: "You now have 24-hour access to all premium features. Enjoy!",
      });
      // Invalidate both trial status AND user data to refresh subscription tier
      queryClient.invalidateQueries({ queryKey: ["/api/trial/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/me"] });
      setIsVisible(false);
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Could not start trial",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Show popup logic
  useEffect(() => {
    // Don't show if already shown in this session
    const hasBeenShown = sessionStorage.getItem(POPUP_STORAGE_KEY);
    if (hasBeenShown) return;

    // Don't show if trial is already active or used
    if (trialStatus?.trialActive || trialStatus?.trialUsed) return;

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem(POPUP_STORAGE_KEY, 'true');
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [trialStatus]);

  const handleStartTrial = () => {
    if (!isAuthenticated) {
      // Store intent to start trial after signup (use both localStorage for auth.ts and URL param for Signup.tsx)
      localStorage.setItem('plantrx-trial-intent', 'true');
      toast({
        title: "Sign up to start your trial",
        description: "Create a free account to unlock 24 hours of Gold access!",
      });
      setIsVisible(false);
      // Pass trial intent via URL parameter as well for Signup.tsx to catch
      setLocation("/signup?trial=gold");
    } else {
      startTrialMutation.mutate();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  // Mobile: Show as a notification bar below the header
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-16 left-0 right-0 z-40 safe-area-inset-top"
          data-testid="gold-trial-notification"
        >
          <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 px-3 py-2.5 shadow-lg">
            <div className="flex items-center gap-2">
              {/* Crown Icon */}
              <div className="flex-shrink-0 bg-white/20 backdrop-blur-sm p-1.5 rounded-lg">
                <Crown className="w-4 h-4 text-white" />
              </div>
              
              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-white truncate">
                  Free 24-Hour Gold Access
                </h3>
                <p className="text-[10px] text-white/90 truncate flex items-center gap-1">
                  <Users className="w-3 h-3 inline" />
                  2,500+ members love it
                </p>
              </div>

              {/* CTA Button - Green for better conversion */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStartTrial();
                }}
                disabled={startTrialMutation.isPending}
                className="flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold px-3 py-1.5 h-auto rounded-lg shadow-md text-xs touch-manipulation"
                data-testid="notification-start-trial-button"
              >
                {startTrialMutation.isPending ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {isAuthenticated ? "Try Now" : "Sign Up"}
                  </span>
                )}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDismiss();
                }}
                className="flex-shrink-0 p-1.5 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors touch-manipulation"
                aria-label="Close notification"
                data-testid="close-trial-notification"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Desktop: Show as a centered popup modal
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleDismiss}
        data-testid="gold-trial-popup-overlay"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          data-testid="gold-trial-popup"
        >
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
            aria-label="Close popup"
            data-testid="close-trial-popup"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Premium Gold Header */}
          <div className="relative bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-600 px-6 py-8 text-center overflow-hidden">
            {/* Animated Background - z-0 to stay behind content */}
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
              <motion.div
                animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-4 left-[10%]"
              >
                <Star className="w-6 h-6 text-amber-300/40" />
              </motion.div>
              <motion.div
                animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                className="absolute top-8 right-[15%]"
              >
                <Sparkles className="w-5 h-5 text-yellow-300/50" />
              </motion.div>
              <motion.div
                animate={{ y: [-15, 25, -15] }}
                transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                className="absolute bottom-6 left-[25%]"
              >
                <Gift className="w-7 h-7 text-amber-300/35" />
              </motion.div>
            </div>

            {/* Urgency Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-lg"
            >
              <Clock className="w-3 h-3" />
              Limited Time Offer
            </motion.div>

            {/* Crown Icon - z-10 to stay above animated background */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative z-10 inline-block mb-3"
            >
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl scale-150" />
              <div className="relative bg-amber-900/40 backdrop-blur-sm p-4 rounded-2xl border border-yellow-300/40 shadow-xl inline-block">
                <Crown className="w-10 h-10 text-yellow-300 drop-shadow-lg" />
              </div>
            </motion.div>

            <h2 className="relative z-10 text-2xl sm:text-3xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Unlock Your Full Wellness Potential
            </h2>
            <p className="relative z-10 text-amber-100 text-base font-medium mb-3">
              Join thousands experiencing premium natural health guidance
            </p>
            
            {/* Social Proof */}
            <div className="relative z-10 flex items-center justify-center gap-4 text-amber-100 text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="font-semibold">2,500+</span>
                <span>members</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <span className="font-semibold">4.9</span>
                <span>rating</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Benefits Grid - 2 columns for compact layout */}
            <div className="mb-5">
              <div className="grid grid-cols-2 gap-2">
                <BenefitItem icon={<Zap className="w-4 h-4" />} text="AI Symptom Analysis" />
                <BenefitItem icon={<Sparkles className="w-4 h-4" />} text="Smart Remedy Builder" />
                <BenefitItem icon={<Gift className="w-4 h-4" />} text="Wellness Blueprints" />
                <BenefitItem icon={<Star className="w-4 h-4" />} text="Priority Support" />
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 mb-5 border border-emerald-200/50 dark:border-emerald-700/30">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                  SM
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    "The AI recommendations changed how I approach my health. Worth every moment!"
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                    Sarah M. — Gold Member
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button - Green gradient for better conversion */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleStartTrial}
                disabled={startTrialMutation.isPending}
                className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-600 text-white font-bold py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all text-lg group"
                data-testid="popup-start-trial-button"
              >
                {startTrialMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Starting Trial...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Crown className="w-5 h-5" />
                    {isAuthenticated ? "Activate Gold Trial Now" : "Sign Up & Start Free Trial"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400 dark:text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>No card required</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Benefit item component with icon support
function BenefitItem({ icon, text }: { icon?: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white">
        {icon || <Check className="w-3.5 h-3.5" />}
      </div>
      <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{text}</span>
    </div>
  );
}
