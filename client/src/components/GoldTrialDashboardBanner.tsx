import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Crown, Sparkles, Clock, Star, Zap, Gift, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/queryClient";

interface TrialStatus {
  trialActive: boolean;
  trialUsed: boolean;
  canStartTrial: boolean;
  trialExpired?: boolean;
  remainingMs?: number;
  remainingHours?: number;
  remainingMinutes?: number;
  remainingSeconds?: number;
  trialEndTime?: string;
  authenticated: boolean;
  message?: string;
}

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export function GoldTrialDashboardBanner() {
  const [, setLocation] = useLocation();
  const [countdown, setCountdown] = useState<CountdownTime>({ hours: 0, minutes: 0, seconds: 0 });
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  // Fetch trial status with frequent updates
  const { data: trialStatus, isLoading } = useQuery<TrialStatus>({
    queryKey: ["/api/trial/status"],
    refetchInterval: 5000, // Refetch every 5 seconds for accurate countdown
  });

  // Update countdown timer
  useEffect(() => {
    if (!trialStatus?.trialActive || !trialStatus?.trialEndTime) return;

    const updateCountdown = () => {
      const endTime = new Date(trialStatus.trialEndTime!).getTime();
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);

      if (remaining <= 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
        // Trial has expired - refresh status and show modal
        queryClient.invalidateQueries({ queryKey: ["/api/trial/status"] });
        setShowExpiredModal(true);
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setCountdown({ hours, minutes, seconds });
    };

    // Initial update
    updateCountdown();

    // Update every second for accurate countdown
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [trialStatus?.trialActive, trialStatus?.trialEndTime]);

  // Format number with leading zero
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  // Don't render if loading or trial not active
  if (isLoading || !trialStatus?.trialActive) return null;

  // Check if trial is about to expire (less than 1 hour)
  const isUrgent = countdown.hours === 0 && countdown.minutes < 60;
  const isCritical = countdown.hours === 0 && countdown.minutes < 10;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full mb-6 overflow-hidden rounded-2xl shadow-2xl"
        data-testid="gold-trial-dashboard-banner"
      >
        {/* Premium Gold Gradient Background */}
        <div className={`relative ${
          isCritical 
            ? 'bg-gradient-to-r from-red-600 via-orange-500 to-red-600' 
            : isUrgent 
              ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500'
              : 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600'
        } dark:from-amber-700 dark:via-yellow-600 dark:to-amber-700`}>
          
          {/* Animated Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-4 left-[8%]"
            >
              <Star className="w-6 h-6 text-white/40" />
            </motion.div>
            <motion.div
              animate={{ y: [10, -15, 10], rotate: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute top-6 right-[12%]"
            >
              <Sparkles className="w-5 h-5 text-white/50" />
            </motion.div>
            <motion.div
              animate={{ y: [-5, 12, -5] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute bottom-6 left-[20%]"
            >
              <Zap className="w-4 h-4 text-white/30" />
            </motion.div>
            <motion.div
              animate={{ y: [8, -8, 8], x: [-3, 3, -3] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.8 }}
              className="absolute top-8 left-[70%]"
            >
              <Gift className="w-5 h-5 text-white/40" />
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="relative px-3 sm:px-6 py-4 sm:py-6 lg:py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
              
              {/* Left: Icon + Title */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Animated Crown - Smaller on mobile */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="relative flex-shrink-0"
                >
                  <div className="absolute inset-0 bg-white/30 rounded-xl sm:rounded-2xl blur-xl scale-150" />
                  <div className="relative bg-white/20 backdrop-blur-sm p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-white/40 shadow-2xl">
                    <Crown className="w-6 h-6 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
                  </div>
                </motion.div>

                <div className="text-left">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                    <span className="text-lg sm:text-2xl">🌟</span>
                    <h2 className="text-sm sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg leading-tight">
                      <span className="sm:hidden">Gold Trial Active</span>
                      <span className="hidden sm:inline">Your Free 24-Hour Gold Trial Is Active</span>
                    </h2>
                  </div>
                  <p className="text-white/90 text-xs sm:text-base lg:text-lg">
                    <span className="sm:hidden">Full premium access</span>
                    <span className="hidden sm:inline">Enjoy full access to every PlantRx premium tool.</span>
                  </p>
                </div>
              </div>

              {/* Center: Countdown Timer */}
              <div className="flex flex-col items-center w-full sm:w-auto">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Clock className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${isCritical ? 'text-white animate-pulse' : 'text-white/80'}`} />
                  <span className="text-white/80 text-[10px] sm:text-sm font-medium uppercase tracking-wider">
                    Time Remaining
                  </span>
                </div>
                
                {/* Countdown Display - Compact on mobile */}
                <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                  {/* Hours */}
                  <motion.div
                    key={countdown.hours}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg sm:rounded-xl px-2 sm:px-4 py-1.5 sm:py-3 min-w-[44px] sm:min-w-[70px] ${
                      isCritical ? 'ring-2 ring-white/50 animate-pulse' : ''
                    }`}>
                      <span className="text-xl sm:text-3xl lg:text-4xl font-bold text-white font-mono tracking-tight">
                        {formatNumber(countdown.hours)}
                      </span>
                    </div>
                    <span className="text-white/70 text-[9px] sm:text-xs mt-0.5 sm:mt-1 uppercase">Hrs</span>
                  </motion.div>

                  <span className="text-white/80 text-lg sm:text-2xl font-bold">:</span>

                  {/* Minutes */}
                  <motion.div
                    key={countdown.minutes}
                    initial={{ scale: 1.1, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg sm:rounded-xl px-2 sm:px-4 py-1.5 sm:py-3 min-w-[44px] sm:min-w-[70px] ${
                      isCritical ? 'ring-2 ring-white/50 animate-pulse' : ''
                    }`}>
                      <span className="text-xl sm:text-3xl lg:text-4xl font-bold text-white font-mono tracking-tight">
                        {formatNumber(countdown.minutes)}
                      </span>
                    </div>
                    <span className="text-white/70 text-[9px] sm:text-xs mt-0.5 sm:mt-1 uppercase">Min</span>
                  </motion.div>

                  <span className="text-white/80 text-lg sm:text-2xl font-bold">:</span>

                  {/* Seconds */}
                  <motion.div
                    key={countdown.seconds}
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg sm:rounded-xl px-2 sm:px-4 py-1.5 sm:py-3 min-w-[44px] sm:min-w-[70px] ${
                      isCritical ? 'ring-2 ring-white/50' : ''
                    }`}>
                      <span className="text-xl sm:text-3xl lg:text-4xl font-bold text-white font-mono tracking-tight">
                        {formatNumber(countdown.seconds)}
                      </span>
                    </div>
                    <span className="text-white/70 text-[9px] sm:text-xs mt-0.5 sm:mt-1 uppercase">Sec</span>
                  </motion.div>
                </div>
              </div>

              {/* Right: Upgrade CTA */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Button
                  onClick={() => setLocation("/pricing")}
                  className="w-full sm:w-auto bg-white hover:bg-gray-50 text-amber-700 font-bold px-4 sm:px-6 py-2.5 sm:py-3 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all group text-sm sm:text-base"
                  data-testid="upgrade-from-trial-button"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="sm:hidden">Upgrade to Gold</span>
                    <span className="hidden sm:inline">Keep Gold Forever</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
            </div>

            {/* Urgency Message */}
            {isUrgent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center"
              >
                <p className={`text-sm font-medium ${isCritical ? 'text-white' : 'text-white/90'}`}>
                  {isCritical 
                    ? "⚡ Your trial ends very soon! Upgrade now to keep all premium features."
                    : "⏰ Less than an hour left! Consider upgrading to keep your premium access."}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className={`h-1 ${
          isCritical 
            ? 'bg-gradient-to-r from-red-400 via-orange-300 to-red-400' 
            : 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400'
        }`} />
      </motion.div>

      {/* Trial Expired Modal */}
      {showExpiredModal && <TrialExpiredModal onClose={() => setShowExpiredModal(false)} />}
    </>
  );
}

// Trial Expired Modal Component
function TrialExpiredModal({ onClose }: { onClose: () => void }) {
  const [, setLocation] = useLocation();
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('GOLD');
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold Header */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 px-6 py-8 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Crown className="w-16 h-16 mx-auto text-white drop-shadow-lg mb-3" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white">
            Your Free Gold Trial Has Ended
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            We hope you enjoyed your 24-hour Gold experience! Upgrade now to continue using all premium PlantRx tools.
          </p>

          {/* Special Discount Code */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border-2 border-amber-300 dark:border-amber-600 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                Special Trial User Discount
              </span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-amber-400 rounded-lg px-6 py-3">
                <span className="text-2xl font-bold text-amber-700 dark:text-amber-300 tracking-widest font-mono">
                  GOLD
                </span>
              </div>
              <Button
                onClick={handleCopyCode}
                size="sm"
                variant="outline"
                className="border-amber-400 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                data-testid="copy-gold-code-button"
              >
                {codeCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="text-center text-sm text-amber-700 dark:text-amber-400 mt-2">
              Use this code at checkout for a special discount!
            </p>
          </div>

          {/* Features Lost Preview */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
              Premium Features You'll Miss
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                AI Symptom Finder
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Smart Remedy Builder
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Wellness Blueprint Designer
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Full Workout Library
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                onClose();
                setLocation("/pricing");
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-3 h-auto rounded-xl shadow-lg"
              data-testid="upgrade-after-trial-button"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade Now with Code "GOLD"
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              data-testid="close-expired-modal-button"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Expired Trial Banner with Discount Code - shows persistently on dashboard
export function ExpiredTrialDiscountBanner() {
  const [, setLocation] = useLocation();
  const [codeCopied, setCodeCopied] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if banner was dismissed in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('plantrx-trial-discount-dismissed');
    if (dismissed) setIsDismissed(true);
  }, []);

  // Fetch trial status
  const { data: trialStatus, isLoading } = useQuery<TrialStatus>({
    queryKey: ["/api/trial/status"],
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText('GOLD');
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('plantrx-trial-discount-dismissed', 'true');
  };

  // Only show if trial has been used (expired) and not dismissed
  if (isLoading || !trialStatus?.trialUsed || isDismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative w-full mb-6 overflow-hidden rounded-2xl shadow-xl border-2 border-amber-300 dark:border-amber-600"
      data-testid="expired-trial-discount-banner"
    >
      {/* Gradient Background */}
      <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-amber-900/20">
        <div className="relative px-6 py-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Left: Message */}
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-3 rounded-xl shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Thanks for trying Gold! Here's a special offer:
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Use your exclusive discount code when you upgrade
                </p>
              </div>
            </div>

            {/* Center: Discount Code */}
            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-amber-400 rounded-lg px-6 py-2 shadow-inner">
                <span className="text-xl font-bold text-amber-700 dark:text-amber-300 tracking-widest font-mono">
                  GOLD
                </span>
              </div>
              <Button
                onClick={handleCopyCode}
                size="sm"
                variant="outline"
                className="border-amber-400 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                data-testid="copy-discount-code-button"
              >
                {codeCopied ? "✓ Copied!" : "Copy Code"}
              </Button>
            </div>

            {/* Right: CTA */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setLocation("/pricing")}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg"
                data-testid="upgrade-with-discount-button"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
              <button
                onClick={handleDismiss}
                className="p-2 rounded-full hover:bg-amber-200/50 dark:hover:bg-amber-800/50 transition-colors"
                aria-label="Dismiss banner"
                data-testid="dismiss-discount-banner"
              >
                <span className="text-amber-600 dark:text-amber-400 text-xl">×</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
