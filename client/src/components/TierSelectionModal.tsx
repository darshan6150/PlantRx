import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Crown, Star, Sparkles, Check, Leaf, Zap, Heart, Shield, Gem, Trophy, Clock, Gift, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import Confetti from 'react-confetti';

interface TierSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const tiers = [
  {
    id: 'bronze',
    name: 'Bronze',
    price: 'FREE',
    priceDetail: 'Forever',
    color: 'from-amber-600 via-amber-500 to-yellow-600',
    borderColor: 'border-amber-500',
    bgGlow: 'shadow-amber-500/30',
    icon: Leaf,
    iconColor: 'text-amber-100',
    features: [
      '131+ Verified Remedies',
      'Basic Search',
      'Community Access',
      'Health Articles'
    ],
    popular: false
  },
  {
    id: 'silver',
    name: 'Silver',
    price: '£6.99',
    priceDetail: '/month',
    color: 'from-slate-400 via-gray-300 to-slate-500',
    borderColor: 'border-slate-400',
    bgGlow: 'shadow-slate-400/30',
    icon: Star,
    iconColor: 'text-slate-100',
    features: [
      'Everything in Bronze',
      'Advanced Filters',
      'Save Favorites',
      'Expert Tips',
      'Priority Support'
    ],
    popular: false
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '£12.99',
    priceDetail: '/month',
    color: 'from-yellow-400 via-amber-400 to-yellow-500',
    borderColor: 'border-yellow-400',
    bgGlow: 'shadow-yellow-400/50',
    icon: Crown,
    iconColor: 'text-yellow-100',
    features: [
      'Everything in Silver',
      'Remy AI Expert Chat',
      'Personalized Plans',
      'Exclusive Content',
      'Priority Consultations',
      'VIP Benefits'
    ],
    popular: true
  }
];

export function TierSelectionModal({ isOpen, onClose, userName }: TierSelectionModalProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [animationPhase, setAnimationPhase] = useState<'welcome' | 'trial' | 'tiers'>('welcome');

  useEffect(() => {
    if (isOpen) {
      setShowCards(false);
      setSelectedTier(null);
      setShowCelebration(false);
      setAnimationPhase('welcome');
      
      // Sequence the animations
      setTimeout(() => setAnimationPhase('trial'), 1500);
      setTimeout(() => {
        setAnimationPhase('tiers');
        setShowCards(true);
      }, 3000);
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleStartTrial = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/trial/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to start trial');
      }

      setShowCelebration(true);
      
      setTimeout(() => {
        toast({
          title: "Gold Trial Activated! 👑",
          description: "Enjoy 24 hours of full Gold access - explore everything PlantRx has to offer!",
        });
        onClose();
        setLocation('/dashboard?trial=started');
      }, 2500);
    } catch (error) {
      console.error('Trial activation error:', error);
      toast({
        title: "Activation Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handleSelectTier = async (tierId: string) => {
    setSelectedTier(tierId);
    setIsProcessing(true);

    if (tierId === 'bronze') {
      try {
        const response = await fetch('/api/user/subscription', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            subscriptionTier: 'bronze',
            subscriptionStatus: 'active'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to activate Bronze tier');
        }

        setShowCelebration(true);
        
        setTimeout(() => {
          toast({
            title: "Welcome to PlantRx Bronze! 🌿",
            description: "You now have access to 131+ verified plant-based remedies!",
          });
          onClose();
          setLocation('/dashboard');
        }, 2500);
      } catch (error) {
        console.error('Bronze activation error:', error);
        toast({
          title: "Activation Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
        setIsProcessing(false);
        setSelectedTier(null);
      }
    } else {
      try {
        const response = await fetch('/api/subscription/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ tier: tierId })
        });

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const { url } = await response.json();
        if (url) {
          window.location.href = url;
        }
      } catch (error) {
        console.error('Checkout error:', error);
        toast({
          title: "Checkout Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
        setIsProcessing(false);
        setSelectedTier(null);
      }
    }
  };

  const skipToTiers = () => {
    setAnimationPhase('tiers');
    setShowCards(true);
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.8,
      rotateX: -15
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }),
    hover: {
      y: -12,
      scale: 1.05,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    selected: {
      scale: 1.15,
      y: -20,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      y: 50,
      transition: { duration: 0.3 }
    }
  };

  const celebrationVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Select Your Membership Tier</DialogTitle>
        </VisuallyHidden>
        {showCelebration && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
            colors={['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#78350f']}
          />
        )}
        
        <div className="relative p-4 sm:p-6 md:p-10">
          <AnimatePresence mode="wait">
            {showCelebration ? (
              <motion.div
                key="celebration"
                variants={celebrationVariants}
                initial="hidden"
                animate="visible"
                className="py-12 sm:py-16 text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 0.8, repeat: 2 }}
                  className="mb-6 sm:mb-8"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-2xl shadow-amber-500/50">
                    <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4"
                >
                  You're All Set! 🌟
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8"
                >
                  Welcome to your natural wellness journey
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-center gap-3 sm:gap-4"
                >
                  {[Heart, Shield, Zap].map((Icon, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center"
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : animationPhase === 'welcome' ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, y: -50 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="py-12 sm:py-16 md:py-20 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/50">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    </motion.div>
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3"
                >
                  Welcome{userName ? `, ${userName}` : ''}! 🎉
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg sm:text-xl text-gray-300"
                >
                  You've joined the PlantRx community!
                </motion.p>
              </motion.div>
            ) : animationPhase === 'trial' ? (
              <motion.div
                key="trial"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="py-8 sm:py-12 md:py-16 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <motion.div 
                    className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/50 relative"
                    animate={{ 
                      boxShadow: [
                        "0 0 30px rgba(251, 191, 36, 0.5)",
                        "0 0 60px rgba(251, 191, 36, 0.8)",
                        "0 0 30px rgba(251, 191, 36, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="w-14 h-14 sm:w-18 sm:h-18 text-white" />
                    <motion.div
                      className="absolute -top-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      FREE
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4"
                >
                  <span className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full border border-yellow-400/30">
                    <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold text-sm sm:text-base">Special New Member Offer</span>
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3"
                >
                  24-Hour Gold Trial
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-base sm:text-lg text-gray-300 mb-6 max-w-md mx-auto px-4"
                >
                  Experience everything PlantRx Gold has to offer - completely free for 24 hours!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 px-4"
                >
                  {['Remy AI Chat', 'Personalized Plans', 'VIP Benefits', 'Priority Support'].map((feature, i) => (
                    <motion.span
                      key={feature}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-white text-xs sm:text-sm"
                    >
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      {feature}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
                >
                  <Button
                    onClick={handleStartTrial}
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 hover:from-yellow-500 hover:via-amber-500 hover:to-orange-600 text-black rounded-xl shadow-lg shadow-amber-500/30 transition-all duration-300"
                    data-testid="start-gold-trial-btn"
                  >
                    {isProcessing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 mr-2" />
                        Start Free 24h Trial
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={skipToTiers}
                    variant="ghost"
                    className="w-full sm:w-auto px-4 sm:px-6 py-4 sm:py-6 text-sm sm:text-base text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                    data-testid="skip-trial-btn"
                  >
                    View All Plans
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="tiers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-center mb-6 sm:mb-8"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.1, 1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="inline-block mb-3 sm:mb-4"
                  >
                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400" />
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
                    Choose Your Plan
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-lg max-w-2xl mx-auto px-4">
                    Start free or unlock premium features for the full experience.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 perspective-1000">
                  {showCards && tiers.map((tier, index) => {
                    const IconComponent = tier.icon;
                    const isSelected = selectedTier === tier.id;
                    const isOtherSelected = selectedTier && selectedTier !== tier.id;

                    return (
                      <motion.div
                        key={tier.id}
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        animate={isSelected ? "selected" : isOtherSelected ? "exit" : "visible"}
                        whileHover={!selectedTier ? "hover" : undefined}
                        className={`relative cursor-pointer ${isOtherSelected ? 'pointer-events-none' : ''}`}
                        onClick={() => !isProcessing && handleSelectTier(tier.id)}
                        data-testid={`tier-card-${tier.id}`}
                      >
                        {tier.popular && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.15 }}
                            className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
                          >
                            <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs sm:text-sm font-bold rounded-full shadow-lg flex items-center gap-1">
                              <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                              MOST POPULAR
                            </span>
                          </motion.div>
                        )}

                        <div className={`
                          relative overflow-hidden rounded-2xl p-4 sm:p-6 md:p-8
                          bg-gradient-to-br ${tier.color}
                          border-2 ${tier.borderColor}
                          shadow-2xl ${tier.bgGlow}
                          transform-gpu
                        `}>
                          <motion.div
                            className="absolute inset-0 opacity-30"
                            animate={{
                              background: [
                                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                                'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)'
                              ]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          />

                          <div className="relative z-10">
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="mb-3 sm:mb-4"
                            >
                              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto">
                                <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 ${tier.iconColor}`} />
                              </div>
                            </motion.div>

                            <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-1 sm:mb-2">
                              {tier.name}
                            </h3>

                            <div className="text-center mb-4 sm:mb-6">
                              <span className="text-2xl sm:text-4xl font-bold text-white">{tier.price}</span>
                              <span className="text-white/80 ml-1 text-sm sm:text-base">{tier.priceDetail}</span>
                            </div>

                            <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                              {tier.features.map((feature, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.4 + index * 0.15 + i * 0.08 }}
                                  className="flex items-center gap-2 text-white/90"
                                >
                                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                                  <span className="text-xs sm:text-sm">{feature}</span>
                                </motion.li>
                              ))}
                            </ul>

                            <Button
                              className={`
                                w-full py-4 sm:py-6 text-sm sm:text-lg font-bold rounded-xl
                                ${tier.id === 'gold' 
                                  ? 'bg-black/30 hover:bg-black/40 text-white border-2 border-white/30' 
                                  : 'bg-white/20 hover:bg-white/30 text-white border-2 border-white/20'
                                }
                                transition-all duration-300
                              `}
                              disabled={isProcessing}
                              data-testid={`select-tier-${tier.id}`}
                            >
                              {isSelected && isProcessing ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <Sparkles className="w-5 h-5" />
                                </motion.div>
                              ) : tier.id === 'bronze' ? (
                                'Start Free'
                              ) : (
                                'Choose Plan'
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
