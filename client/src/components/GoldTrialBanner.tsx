import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, Clock, X, ArrowRight, Star, Zap, Loader2, Copy, Check, Tag } from "lucide-react";
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

function TrialLoadingScreen({ isRedirectingToSignup = false }: { isRedirectingToSignup?: boolean }) {
  const [dots, setDots] = useState("");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-full blur-3xl opacity-40 animate-pulse" 
               style={{ width: '200px', height: '200px', margin: '-50px' }} />
          
          <div className="relative bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 p-8 rounded-3xl shadow-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="w-16 h-16 text-white drop-shadow-lg" />
            </motion.div>
          </div>
          
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -left-3"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <Star className="w-6 h-6 text-amber-300" />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl font-bold text-white mb-3 text-center"
        >
          {isRedirectingToSignup 
            ? `Setting Up Your Trial${dots}` 
            : `Activating Your Gold Trial${dots}`}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 text-center text-lg mb-8 max-w-md"
        >
          {isRedirectingToSignup 
            ? "Create a free account to unlock your 24-hour Gold access" 
            : "Unlocking 24 hours of premium PlantRx features"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3"
        >
          <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
          <span className="text-amber-400 font-medium">Please wait</span>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 2, ease: "easeInOut" }}
          className="mt-8 h-1 w-64 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full origin-left"
        />
      </div>
    </motion.div>
  );
}

interface TrialStatus {
  trialActive: boolean;
  trialUsed: boolean;
  canStartTrial: boolean;
  trialExpired?: boolean;
  remainingMs?: number;
  remainingHours?: number;
  remainingMinutes?: number;
  remainingSeconds?: number;
  authenticated: boolean;
  message?: string;
  subscriptionTier?: string;
  hasPaidSubscription?: boolean;
  hasEverPaidSubscription?: boolean;
}

export function GoldTrialBanner() {
  const [, setLocation] = useLocation();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [isRedirectingToSignup, setIsRedirectingToSignup] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Check if this is the user's first visit to show dramatic entrance animation
  useEffect(() => {
    const hasSeenBanner = sessionStorage.getItem('plantrx-banner-seen');
    if (!hasSeenBanner) {
      setIsFirstVisit(true);
      // Mark as seen after animation completes
      const timer = setTimeout(() => {
        sessionStorage.setItem('plantrx-banner-seen', 'true');
        setHasAnimated(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setHasAnimated(true);
    }
  }, []);

  // Fetch trial status - includes authentication state from backend
  const { data: trialStatus, isLoading } = useQuery<TrialStatus>({
    queryKey: ["/api/trial/status"],
    refetchInterval: 60000, // Refetch every minute
  });

  // Use backend authentication status (more reliable than localStorage)
  const isAuthenticated = trialStatus?.authenticated === true;
  
  // Check if user should see discount code instead of trial
  const showDiscountCode = trialStatus?.trialUsed && !trialStatus?.hasEverPaidSubscription && !trialStatus?.hasPaidSubscription;

  // Handle copying discount code
  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText("GOLD10");
    setCodeCopied(true);
    toast({
      title: "Code Copied!",
      description: "GOLD10 has been copied to your clipboard. Use it at checkout!",
    });
    setTimeout(() => setCodeCopied(false), 3000);
  }, [toast]);

  // Start trial mutation
  const startTrialMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/trial/start", "POST");
    },
    onSuccess: (data: any) => {
      toast({
        title: "🎉 Gold Trial Activated!",
        description: "You now have 24-hour access to all premium features. Enjoy!",
      });
      // Invalidate both trial status AND user data to refresh subscription tier
      queryClient.invalidateQueries({ queryKey: ["/api/trial/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/me"] });
      // Keep loading screen while redirecting
      setTimeout(() => {
        setLocation("/dashboard");
      }, 500);
    },
    onError: (error: any) => {
      setShowLoadingScreen(false);
      if (error.message?.includes("already used")) {
        toast({
          title: "Trial Already Used",
          description: "You've already enjoyed your free trial. Upgrade to continue!",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Could not start trial",
          description: error.message || "Please try again later.",
          variant: "destructive",
        });
      }
    },
  });

  const handleStartTrial = useCallback(async () => {
    // Show loading screen immediately
    setShowLoadingScreen(true);
    
    if (!isAuthenticated) {
      // Set flag so loading screen shows appropriate message
      setIsRedirectingToSignup(true);
      // Store intent to start FREE 24-hour Gold trial after signup
      localStorage.setItem('plantrx-trial-intent', 'true');
      // Redirect to signup with trial parameter (loading screen stays visible during navigation)
      setTimeout(() => {
        setLocation("/signup?trial=gold");
      }, 800); // Brief delay to show loading animation
    } else {
      // User is authenticated - start the free trial directly
      setIsRedirectingToSignup(false);
      startTrialMutation.mutate();
    }
  }, [isAuthenticated, setLocation, startTrialMutation]);

  // Don't show banner if:
  // - On mobile (too big for mobile screens)
  // - Dismissed
  // - Still loading
  // - Trial is already active
  // - User has a paid subscription (silver or gold)
  // - User has ever paid for a subscription
  if (isMobile || isDismissed || isLoading) return null;
  
  // Don't show if trial is active (show countdown banner instead)
  if (trialStatus?.trialActive) return null;
  
  // Don't show if user has paid subscription or has ever paid
  if (trialStatus?.hasPaidSubscription || trialStatus?.hasEverPaidSubscription) return null;

  return (
    <>
      {/* Full-screen loading overlay */}
      <AnimatePresence>
        {showLoadingScreen && <TrialLoadingScreen isRedirectingToSignup={isRedirectingToSignup} />}
      </AnimatePresence>
      
      <AnimatePresence>
      <motion.div
        key="gold-trial-banner"
        initial={{ opacity: 0, y: -100, scaleY: 0.8 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scaleY: 1,
          transition: {
            type: "spring",
            stiffness: isFirstVisit ? 80 : 150,
            damping: isFirstVisit ? 12 : 20,
            mass: isFirstVisit ? 1.2 : 0.8,
            delay: isFirstVisit ? 0.3 : 0,
          }
        }}
        exit={{ 
          opacity: 0, 
          y: -50, 
          scaleY: 0.9,
          transition: { duration: 0.3, ease: "easeIn" }
        }}
        className="relative w-full overflow-hidden origin-top"
        data-testid="gold-trial-banner"
      >
        {/* Premium Gold Gradient Background */}
        <div className="relative bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-700 dark:via-yellow-600 dark:to-amber-700">
          {/* Initial flash effect for first visit */}
          {isFirstVisit && !hasAnimated && (
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute inset-0 bg-white pointer-events-none"
            />
          )}
          
          {/* Animated Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
               style={{ backgroundSize: '200% 100%', animation: 'shimmer 3s ease-in-out infinite' }} />
          
          {/* Floating Sparkles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ y: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-2 left-[10%]"
            >
              <Sparkles className="w-4 h-4 text-white/60" />
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              className="absolute top-4 right-[15%]"
            >
              <Star className="w-3 h-3 text-white/50" />
            </motion.div>
            <motion.div
              animate={{ y: [-5, 15, -5], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute bottom-3 left-[25%]"
            >
              <Zap className="w-3 h-3 text-white/40" />
            </motion.div>
            <motion.div
              animate={{ y: [5, -15, 5], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.8 }}
              className="absolute top-3 left-[60%]"
            >
              <Sparkles className="w-5 h-5 text-white/50" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="relative px-4 py-4 sm:py-5 lg:py-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
                {/* Icon + Text */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
                  {/* Icon with Glow */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-white/30 rounded-full blur-xl" />
                    <div className="relative bg-white/20 backdrop-blur-sm p-3 rounded-2xl border border-white/30 shadow-lg">
                      {showDiscountCode ? (
                        <Tag className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                      ) : (
                        <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                      )}
                    </div>
                  </motion.div>

                  {/* Text Content */}
                  <div className="flex flex-col">
                    {showDiscountCode ? (
                      <>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                          <span className="text-xl sm:text-2xl">🏷️</span>
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                            Exclusive: Get 10% Off Gold Subscription!
                          </h3>
                        </div>
                        <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium">
                          Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded">GOLD10</span> at checkout for your discount.
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <span className="text-xl sm:text-2xl">🌿</span>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                              Join 10,000+ Happy PlantRx Members Today!
                            </h3>
                          </div>
                          <p className="text-white/90 text-sm sm:text-base font-medium mb-2">
                            Sign up FREE and get <span className="font-bold underline decoration-2">24 hours of Gold access</span> — no credit card needed.
                          </p>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm">
                            <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                              <span>🤖</span> AI Health Expert
                            </span>
                            <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                              <span>🌱</span> 130+ Remedies
                            </span>
                            <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                              <span>⭐</span> 4.9/5 Rating
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* CTA Button + Dismiss */}
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {showDiscountCode ? (
                      <Button
                        onClick={handleCopyCode}
                        className="relative bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 text-amber-800 dark:text-amber-300 font-bold px-6 py-3 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-amber-300 dark:border-amber-600"
                        data-testid="copy-discount-code-button"
                      >
                        <span className="relative flex items-center gap-2">
                          {codeCopied ? (
                            <>
                              <Check className="w-5 h-5 text-green-600" />
                              <span className="text-sm sm:text-base">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-5 h-5" />
                              <span className="text-sm sm:text-base">Copy Code: GOLD10</span>
                            </>
                          )}
                        </span>
                      </Button>
                    ) : (
                      <Button
                        onClick={handleStartTrial}
                        disabled={startTrialMutation.isPending}
                        className="relative bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 h-auto rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group border-2 border-white/30"
                        data-testid="start-trial-button"
                      >
                        <span className="relative flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                          {startTrialMutation.isPending ? (
                            <>
                              <Clock className="w-5 h-5 animate-spin" />
                              <span>Starting...</span>
                            </>
                          ) : (
                            <>
                              <span className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                <span className="text-sm sm:text-base font-bold">Sign Up Free Now</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </span>
                              <span className="text-xs text-white/80 hidden sm:block">No credit card required</span>
                            </>
                          )}
                        </span>
                      </Button>
                    )}
                  </motion.div>

                  {/* Dismiss Button */}
                  <button
                    onClick={() => setIsDismissed(true)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    aria-label="Dismiss banner"
                    data-testid="dismiss-trial-banner"
                  >
                    <X className="w-5 h-5 text-white/80 hover:text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gold Accent Line */}
        <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />
      </motion.div>
      </AnimatePresence>

      {/* CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
          background-size: 200% 100%;
        }
      `}</style>
    </>
  );
}
