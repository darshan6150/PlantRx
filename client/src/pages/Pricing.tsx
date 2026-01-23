import { SEOHead } from "@/components/SEOHead";
import { ArrowLeft, Sparkles, Check, Shield, Crown, X, HelpCircle, Clock, ArrowRight, Gift, Leaf } from "lucide-react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "@/auth";
import { useToast } from "@/hooks/use-toast";
import type { User } from "firebase/auth";
import Header from "@/components/Header";
import { useClickAuthPrompt } from "@/hooks/useClickAuthPrompt";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { useNavigate } from "@/components/NavLink";

interface TrialStatus {
  isTrialActive: boolean;
  hasUsedTrial: boolean;
  remainingTime?: number;
  expiresAt?: string;
}

const pricingTiers = [
  {
    name: "Bronze",
    monthlyPrice: "Free",
    yearlyPrice: "Free",
    description: "For anyone starting their natural health journey",
    features: [
      "Remedy Library (Popular)",
      "Book Expert Consultations (coming soon)",
      "PlantRx Community Lounge",
      "PlantRx Wellness Shop"
    ],
    tier: "bronze",
    icon: Shield,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    buttonStyle: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/30",
    rank: 3
  },
  {
    name: "Gold",
    monthlyPrice: "£12.99",
    yearlyPrice: "£109.00",
    yearlySavings: "Save £47",
    monthlyPaymentLink: "https://buy.stripe.com/4gMbJ30DqgxWf0Yb96cAo04",
    yearlyPaymentLink: "https://buy.stripe.com/4gMaEZdqcgxW7yw0uscAo03",
    description: "Unlock full AI features, deeper insights & advanced healing tools",
    features: [
      "Everything in Silver ✅",
      "Wellness Blueprint Designer (Popular)",
      "AI Symptom Finder",
      "Smart Remedy Builder (Popular)"
    ],
    tier: "gold",
    icon: Crown,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950/30 dark:to-amber-950/30",
    borderColor: "border-yellow-300 dark:border-yellow-700",
    buttonStyle: "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white shadow-lg shadow-yellow-500/40",
    isPopular: true,
    rank: 1
  },
  {
    name: "Silver",
    monthlyPrice: "£6.99",
    yearlyPrice: "£59.00",
    yearlySavings: "Save £25",
    monthlyPaymentLink: "https://buy.stripe.com/cNifZj1Hu0yYf0Y0uscAo01",
    yearlyPaymentLink: "https://buy.stripe.com/9B6dRb2LyftS8CA1ywcAo00",
    description: "Unlock tracking, community tools & personalized remedies",
    features: [
      "Interactive Muscle Trainer (Popular)",
      "Health Insight Dashboard",
      "Premium Community Features"
    ],
    tier: "silver",
    icon: Sparkles,
    color: "text-gray-600 dark:text-gray-300",
    bgColor: "bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900/80 dark:to-slate-900/80",
    borderColor: "border-gray-300 dark:border-gray-700",
    buttonStyle: "bg-gradient-to-r from-gray-700 to-slate-700 hover:from-gray-800 hover:to-slate-800 dark:from-gray-600 dark:to-slate-600 dark:hover:from-gray-700 dark:hover:to-slate-700 text-white shadow-lg shadow-gray-500/30",
    rank: 2
  }
];

export default function Pricing() {
  const [, setLocation] = useLocation();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const { markNotNowClicked, hasPricingRedirected } = useClickAuthPrompt();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Trial status query
  const { data: trialStatus } = useQuery<TrialStatus>({
    queryKey: ['/api/trial/status'],
    enabled: !!user,
  });

  // Start trial mutation
  const startTrialMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/trial/start', 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trial/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: "Gold Trial Activated! 🎉",
        description: "Enjoy 24 hours of full Gold access. Explore all premium features!",
      });
      setLocation('/dashboard');
    },
    onError: (error: Error) => {
      toast({
        title: "Unable to Start Trial",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    }
  });

  const handleStartTrial = () => {
    if (!user) {
      localStorage.setItem('goldTrialIntent', 'true');
      setLocation('/signup');
    } else {
      startTrialMutation.mutate();
    }
  };

  // Check if trial can be shown (not used and not currently active)
  const canShowTrial = !trialStatus?.hasUsedTrial && !trialStatus?.isTrialActive;

  const handleNotNow = () => {
    markNotNowClicked();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <SEOHead
        title="Pricing Plans - PlantRx"
        description="Choose the perfect plan for your natural healing journey. Access expert-curated remedies, personalized wellness support, and premium features."
        canonical="/pricing"
      />
      
      <div className="pt-24 pb-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Not Now Button - Only show if user was redirected from click tracking */}
        {hasPricingRedirected() && !user && (
          <div className="mb-8">
            <Button
              onClick={handleNotNow}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl transition-all duration-300"
              data-testid="button-not-now"
            >
              <X className="w-5 h-5" />
              Not Now, I'll Browse First
            </Button>
          </div>
        )}

        {/* Header Section with Premium Animations */}
        <motion.div 
          className="text-center mb-12 relative overflow-visible"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Floating Decorative Elements - Hidden on mobile for cleaner look */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
            <motion.div
              className="absolute top-0 left-1/4 w-3 h-3 bg-yellow-400/40 rounded-full"
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-10 right-1/4 w-2 h-2 bg-emerald-400/50 rounded-full"
              animate={{ 
                y: [0, -15, 0],
                opacity: [0.5, 0.9, 0.5]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div
              className="absolute top-20 left-1/3 w-4 h-4 bg-amber-300/30 rounded-full"
              animate={{ 
                y: [0, -25, 0],
                x: [0, 10, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              className="absolute -top-4 right-1/3"
              animate={{ 
                rotate: [0, 360],
                y: [0, -10, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Leaf className="w-5 h-5 text-emerald-400/40" />
            </motion.div>
          </div>

          {/* Badge Animation */}
          <motion.div 
            className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 dark:text-yellow-400" />
            </motion.div>
            <span className="text-xs sm:text-sm font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">
              Premium Membership
            </span>
            <motion.div
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 dark:text-yellow-400" />
            </motion.div>
          </motion.div>
          
          {/* Main Title with Gradient Animation */}
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 luxury-heading relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
          >
            Choose Your{" "}
            <motion.span 
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                Plan
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
              />
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
          >
            Start your natural healing journey today with expert-curated remedies and personalized wellness support
          </motion.p>

          {/* Billing Period Toggle with Animation */}
          <motion.div 
            className="inline-flex items-center gap-2 sm:gap-3 bg-gray-100 dark:bg-gray-800 p-1 sm:p-1.5 pt-3 sm:pt-4 pr-3 sm:pr-4 rounded-full shadow-lg relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
            whileHover={{ boxShadow: "0 10px 40px rgba(234, 179, 8, 0.2)" }}
          >
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
              />
            </div>
            <motion.button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 relative z-10 ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              data-testid="toggle-monthly"
              whileTap={{ scale: 0.95 }}
            >
              Monthly
            </motion.button>
            <motion.button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 relative z-10 ${
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              data-testid="toggle-yearly"
              whileTap={{ scale: 0.95 }}
            >
              Yearly
              <motion.span 
                className="absolute -top-2.5 -right-2 sm:-top-3 sm:-right-3 bg-green-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold shadow-md"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Save
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Gold Trial Promotion Card - Different style from homepage */}
        {(!user || canShowTrial) && (
          <ScrollReveal>
            <div className="max-w-3xl mx-auto mb-8 sm:mb-12">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-amber-300 dark:border-amber-600 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-950/40 dark:via-yellow-950/40 dark:to-amber-950/40 p-5 sm:p-8 md:p-10 shadow-xl group hover:shadow-2xl transition-all duration-300">
                {/* Subtle shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent -translate-x-full animate-shimmer" />
                
                <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-xl">
                      <Gift className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white relative z-10" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Try Before You Buy
                      </h3>
                      <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs sm:text-sm font-bold">
                        FREE
                      </span>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
                      Experience all Gold features free for 24 hours. No credit card required.
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <Button
                      onClick={handleStartTrial}
                      disabled={startTrialMutation.isPending}
                      className="w-full sm:w-auto bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 text-amber-800 dark:text-amber-300 font-bold px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 border-2 border-amber-300 dark:border-amber-600"
                      data-testid="pricing-start-trial-button"
                    >
                      {startTrialMutation.isPending ? (
                        <>
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          <span>Starting...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Start Free Trial</span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Pricing Cards Grid */}
        <ScrollReveal>
          <div className="horizontal-scroll-container flex overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide md:flex-row items-stretch justify-start md:justify-center gap-4 md:gap-8 max-w-7xl mx-auto mb-16 px-4 md:px-0 -mx-4 md:mx-0 overscroll-x-contain pt-6 md:pt-8">
            {pricingTiers.map((tier) => {
              const Icon = tier.icon;
              
              return (
                <div
                  key={tier.tier}
                  className="flex-shrink-0 w-[300px] md:w-auto md:flex-1 max-w-sm transform hover:-translate-y-3 hover:scale-[1.02] transition-all duration-300"
                >
                  <Card
                    className={`relative p-5 md:p-8 ${tier.bgColor} ${tier.borderColor} border-2 hover:shadow-2xl transition-all duration-500 flex flex-col snap-center h-full group ${
                      tier.isPopular ? 'ring-2 ring-yellow-400 dark:ring-yellow-500 shadow-2xl' : ''
                    }`}
                    data-testid={`pricing-tier-${tier.tier}`}
                  >
                    {/* Shine sweep effect on hover */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                    
                    {tier.isPopular && (
                      <div className="absolute -top-2 md:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-1.5 py-0.5 md:px-6 md:py-2 rounded-full text-[10px] md:text-sm font-bold shadow-xl inline-flex items-center gap-1">
                          ⭐ Popular
                        </span>
                      </div>
                    )}

                {/* Header */}
                <div className="text-center mb-3 md:mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl mb-2 md:mb-4 bg-white dark:bg-gray-800 shadow-lg">
                    <Icon className={`w-6 h-6 md:w-8 md:h-8 ${tier.color}`} />
                  </div>
                  <h3 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
                    {tier.name}
                  </h3>
                  <div className="mb-2 md:mb-4">
                    <span className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {billingPeriod === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}
                    </span>
                    {tier.monthlyPrice !== "Free" && (
                      <span className="text-gray-600 dark:text-gray-400 text-sm md:text-lg ml-1">
                        /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    )}
                  </div>
                  {billingPeriod === 'yearly' && tier.yearlySavings && (
                    <div className="mb-2 md:mb-3">
                      <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold">
                        {tier.yearlySavings} 🎉
                      </span>
                    </div>
                  )}
                  <p className="text-xs md:text-base text-gray-600 dark:text-gray-300 leading-snug md:leading-relaxed px-1 md:px-2">
                    {tier.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-3 md:mb-6"></div>

                {/* Features Checklist - Show all on mobile now */}
                <ul className="space-y-2 md:space-y-4 mb-4 md:mb-8 flex-grow">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 md:gap-3">
                      <div className="flex-shrink-0 mt-0.5 md:mt-1">
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-green-600 dark:text-green-400 font-bold" />
                        </div>
                      </div>
                      <span className="text-sm md:text-sm text-gray-700 dark:text-gray-300 leading-snug md:leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Subscribe Button */}
                <Button
                  onClick={async () => {
                    if (tier.monthlyPrice === "Free") {
                      // Bronze tier logic
                      if (user) {
                        // User is already logged in, activate Bronze directly
                        try {
                          const response = await fetch('/api/user/subscription', {
                            method: 'PATCH',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                              subscriptionTier: 'bronze',
                              subscriptionStatus: 'active'
                            })
                          });

                          if (!response.ok) {
                            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                            throw new Error(errorData.message || `Bronze activation failed: ${response.statusText}`);
                          }

                          toast({
                            title: "Welcome to PlantRx Bronze! 🎉",
                            description: `You're all set with FREE access to 131+ verified plant-based remedies!`,
                          });
                          setLocation('/dashboard');
                        } catch (error) {
                          console.error('Bronze activation error:', error);
                          toast({
                            title: "Bronze Activation Error",
                            description: "Failed to activate Bronze membership. Please try again.",
                            variant: "destructive"
                          });
                        }
                      } else {
                        // User not logged in, send to sign up
                        localStorage.setItem('pendingBronzeSignup', 'true');
                        setLocation('/signup');
                      }
                    } else {
                      // Open Stripe payment link in new tab based on billing period
                      const paymentLink = billingPeriod === 'monthly' 
                        ? (tier as any).monthlyPaymentLink 
                        : (tier as any).yearlyPaymentLink;
                      if (paymentLink) {
                        // Open Stripe checkout in new tab
                        window.open(paymentLink, '_blank');
                      } else {
                        setLocation('/signup');
                      }
                    }
                  }}
                  className={`w-full ${tier.buttonStyle} font-bold py-4 md:py-7 text-base md:text-lg rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95`}
                  data-testid={`button-subscribe-${tier.tier}`}
                >
                    {tier.monthlyPrice === "Free" ? "Get Free" : `Get ${tier.name}`}
                  </Button>
                  </Card>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Trust Indicators */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-8 mb-16">
            {[
              { icon: Shield, text: "Secure Payment", color: "text-green-600 dark:text-green-400" },
              { icon: Check, text: "Cancel Anytime", color: "text-green-600 dark:text-green-400" },
              { icon: Sparkles, text: "Instant Access", color: "text-yellow-500 dark:text-yellow-400" }
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 hover:scale-110 transition-transform duration-200"
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Membership FAQs Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-12 relative">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 dark:text-yellow-400" />
                <span className="text-xs sm:text-sm font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">
                  Got Questions?
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Membership{" "}
                <span className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                  FAQs
                </span>
              </h2>
              
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-4">
                Everything you need to know about PlantRx membership plans
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="w-full space-y-3 sm:space-y-4">
            {/* Question 1 */}
            <StaggerItem>
              <motion.div
                whileHover={{ scale: 1.01, x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl px-4 sm:px-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <AccordionTrigger className="text-left font-semibold text-sm sm:text-base text-gray-900 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 py-4 sm:py-5">
                      What's the difference between Bronze, Silver, and Gold plans?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-gray-600 dark:text-gray-300 pb-4 sm:pb-5">
                      <p className="mb-2 sm:mb-3"><strong className="text-gray-900 dark:text-white">Bronze (Free):</strong> Perfect for beginners! Get full access to our Remedy Library with 131+ verified plant-based remedies, browse our Wellness Shop, and join our Community Lounge.</p>
                      <p className="mb-2 sm:mb-3"><strong className="text-gray-900 dark:text-white">Silver (£6.99/month):</strong> Take your wellness to the next level with the Interactive Muscle Trainer for targeted workouts, premium community features, and priority access to expert consultations.</p>
                      <p><strong className="text-gray-900 dark:text-white">Gold (£12.99/month):</strong> Unlock everything! Get AI-powered tools like the Wellness Blueprint Designer, Smart Remedy Builder, and AI Symptom Finder for personalized health insights and comprehensive wellness planning.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </StaggerItem>

            {/* Question 2 */}
            <StaggerItem>
              <motion.div whileHover={{ scale: 1.01, x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-2" className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl px-4 sm:px-6 shadow-sm hover:shadow-lg transition-all duration-300">
                    <AccordionTrigger className="text-left font-semibold text-sm sm:text-base text-gray-900 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 py-4 sm:py-5">
                      Can I upgrade or downgrade my plan anytime?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-gray-600 dark:text-gray-300 pb-4 sm:pb-5">
                      <p>Absolutely! You can upgrade or downgrade your membership at any time. When you upgrade, you'll gain immediate access to new features. If you downgrade, changes take effect at the end of your current billing period, so you won't lose any paid time. Simply visit your Dashboard and manage your subscription settings.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </StaggerItem>

            {/* Question 3 */}
            <StaggerItem>
              <motion.div whileHover={{ scale: 1.01, x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-3" className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl px-4 sm:px-6 shadow-sm hover:shadow-lg transition-all duration-300">
                    <AccordionTrigger className="text-left font-semibold text-sm sm:text-base text-gray-900 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 py-4 sm:py-5">
                      How do I cancel my subscription?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-gray-600 dark:text-gray-300 pb-4 sm:pb-5">
                      <p className="mb-2 sm:mb-3">Canceling is simple and hassle-free. Go to your Dashboard, click on "Subscription Settings," and select "Cancel Subscription." You'll retain access to all premium features until the end of your current billing period.</p>
                      <p className="italic text-xs sm:text-sm">We're sorry to see you go, but there are no cancellation fees or penalties. You can always rejoin anytime!</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </StaggerItem>

            {/* Question 4 */}
            <StaggerItem>
              <motion.div whileHover={{ scale: 1.01, x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-5" className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl px-4 sm:px-6 shadow-sm hover:shadow-lg transition-all duration-300">
                    <AccordionTrigger className="text-left font-semibold text-sm sm:text-base text-gray-900 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 py-4 sm:py-5">
                      Do you offer refunds?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-gray-600 dark:text-gray-300 pb-4 sm:pb-5">
                      <p className="mb-2 sm:mb-3">We want you to be 100% satisfied with PlantRx. If you're not happy with your paid membership within the first 7 days, contact our support team at <a href="mailto:support@plantrxapp.com" className="text-yellow-600 dark:text-yellow-400 hover:underline">support@plantrxapp.com</a> for a full refund, no questions asked.</p>
                      <p className="text-xs sm:text-sm">After 7 days, refunds are handled on a case-by-case basis. See our <a href="/refunds" className="text-yellow-600 dark:text-yellow-400 hover:underline">Refund Policy</a> for full details.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </StaggerItem>

            {/* Question 6 */}
            <StaggerItem>
              <motion.div whileHover={{ scale: 1.01, x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-6" className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl px-4 sm:px-6 shadow-sm hover:shadow-lg transition-all duration-300">
                    <AccordionTrigger className="text-left font-semibold text-sm sm:text-base text-gray-900 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 py-4 sm:py-5">
                      Is there a free trial for Silver or Gold plans?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-gray-600 dark:text-gray-300 pb-4 sm:pb-5">
                      <p className="mb-2 sm:mb-3"><strong className="text-yellow-600 dark:text-yellow-400">Yes!</strong> We offer a <strong className="text-gray-900 dark:text-white">free 24-hour Gold trial</strong> so you can experience all premium features before committing. No credit card required - just sign up and activate your trial to unlock AI-powered tools like the Wellness Blueprint Designer, Smart Remedy Builder, and AI Symptom Finder.</p>
                      <p>After your trial ends, you can upgrade to Gold or Silver, or continue with our Bronze (Free) plan which includes 131+ remedies and community access.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </StaggerItem>

            {/* Question 7 */}
            <StaggerItem>
              <motion.div whileHover={{ scale: 1.01, x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-8" className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl px-4 sm:px-6 shadow-sm hover:shadow-lg transition-all duration-300">
                    <AccordionTrigger className="text-left font-semibold text-sm sm:text-base text-gray-900 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 py-4 sm:py-5">
                      What happens to my data if I cancel?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-gray-600 dark:text-gray-300 pb-4 sm:pb-5">
                      <p className="mb-2 sm:mb-3">Your account remains active with all your saved remedies, preferences, and chat history preserved. You'll be downgraded to Bronze (Free) tier, which means you'll lose access to premium features like AI tools and advanced workouts, but your core account data stays intact.</p>
                      <p>You can reactivate your subscription anytime to regain full access to premium features.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </StaggerItem>

            {/* Question 9 */}
            <StaggerItem>
              <motion.div whileHover={{ scale: 1.01, x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-9" className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl px-4 sm:px-6 shadow-sm hover:shadow-lg transition-all duration-300">
                    <AccordionTrigger className="text-left font-semibold text-sm sm:text-base text-gray-900 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 py-4 sm:py-5">
                      Do I need a credit card for the Bronze (Free) plan?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-gray-600 dark:text-gray-300 pb-4 sm:pb-5">
                      <p>No! The Bronze plan is completely free with no credit card required. Simply create an account and you'll have instant access to 131+ verified remedies, our Wellness Shop, and Community Lounge. No payment information needed unless you decide to upgrade to Silver or Gold.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </StaggerItem>

            {/* Question 10 */}
            <StaggerItem>
              <motion.div whileHover={{ scale: 1.01, x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-10" className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl px-4 sm:px-6 shadow-sm hover:shadow-lg transition-all duration-300">
                    <AccordionTrigger className="text-left font-semibold text-sm sm:text-base text-gray-900 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 py-4 sm:py-5">
                      Is my payment information secure?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-gray-600 dark:text-gray-300 pb-4 sm:pb-5">
                      <p className="mb-2 sm:mb-3">Absolutely! We use Stripe, one of the world's most trusted payment processors, to handle all transactions. Your payment information is encrypted with bank-level security and is never stored on our servers.</p>
                      <p className="flex items-center gap-2 text-xs sm:text-sm">
                        <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>PCI-DSS compliant • SSL encrypted • GDPR compliant</span>
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>

          {/* Still have questions CTA */}
          <ScrollReveal>
            <div className="mt-8 sm:mt-12 text-center bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl sm:rounded-2xl p-5 sm:p-8 border-2 border-yellow-200 dark:border-yellow-800 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 relative">
                Still have questions?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 relative">
                Our friendly support team is here to help you choose the perfect plan
              </p>
              <Button
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all relative"
              >
                Contact Support
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
      </div>
    </div>
  );
}
