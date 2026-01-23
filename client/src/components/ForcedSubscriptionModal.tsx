import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Crown, Shield, Check, Sparkles } from "lucide-react";

interface ForcedSubscriptionModalProps {
  isOpen: boolean;
  onSubscriptionComplete: () => void;
}

const subscriptionTiers = [
  {
    name: "Bronze",
    price: "Free",
    description: "Perfect for getting started with natural health",
    features: [
      "Remedy Library (100% free access)",
      "Book Expert Consultations",
      "Muscle Map (Basic version)",
      "Business Map (entrepreneur tools)",
      "Product Store"
    ],
    tier: "bronze",
    icon: Shield,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    borderColor: "border-amber-300 dark:border-amber-700",
    buttonStyle: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg",
  },
  {
    name: "Gold",
    price: "£12.99/mo",
    description: "Full access to AI features & premium tools",
    features: [
      "Everything in Silver ✅",
      "PlantRx Creator",
      "AI Symptom Finder",
      "AI Insight Dashboard",
      "Muscle Map (Full Access)"
    ],
    tier: "gold",
    icon: Crown,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950/30 dark:to-amber-950/30",
    borderColor: "border-yellow-400 dark:border-yellow-600",
    buttonStyle: "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white shadow-lg shadow-yellow-500/40",
    isPopular: true,
    monthlyPaymentLink: "https://buy.stripe.com/4gMbJ30DqgxWf0Yb96cAo04"
  }
];

export function ForcedSubscriptionModal({ isOpen, onSubscriptionComplete }: ForcedSubscriptionModalProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Prevent ESC key from closing the modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen]);

  const handleTierSelection = async (tier: typeof subscriptionTiers[0]) => {
    setSelectedTier(tier.tier);
    setIsProcessing(true);

    try {
      if (tier.tier === 'bronze') {
        // Activate Bronze tier directly
        const response = await fetch('/api/user/subscription', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subscriptionTier: 'bronze' }),
          credentials: 'include'
        });

        if (!response.ok) {
          // Inspect the response to understand the error
          const errorData = await response.json().catch(() => null);
          console.log('[ForcedSubscriptionModal] Bronze activation failed:', response.status, errorData);
          
          // Handle different error cases
          if (response.status === 400) {
            // Check if this is a "user already has subscription" scenario
            // by verifying with /api/auth/me
            const meResponse = await fetch('/api/auth/me', { credentials: 'include' });
            if (meResponse.ok) {
              const userData = await meResponse.json();
              if (userData.user && userData.user.subscriptionTier === 'bronze') {
                console.log('[ForcedSubscriptionModal] User already has Bronze (verified), completing flow');
                toast({
                  title: "Welcome to PlantRx! 🎉",
                  description: "Your Bronze membership is already active. Enjoy exploring!",
                  variant: "default"
                });
                onSubscriptionComplete();
                return;
              }
            }
            
            // If user doesn't have Bronze, this is a real validation error - show it
            throw new Error(errorData?.message || 'Invalid subscription data');
          } else if (response.status === 403) {
            // 403 = Premium tier requires payment (should not happen in normal flow)
            console.error('[ForcedSubscriptionModal] 403 error - premium tier requires payment');
            throw new Error('Premium tiers require payment verification. Please use the payment link.');
          }
          
          // Other error codes - show the actual error message
          throw new Error(errorData?.message || 'Failed to activate Bronze membership');
        }

        toast({
          title: "Welcome to PlantRx! 🎉",
          description: "Your Bronze membership is now active. Enjoy exploring!",
          variant: "default"
        });

        // Mark flow as complete
        onSubscriptionComplete();
      } else {
        // Mark flow complete BEFORE redirecting to Stripe
        onSubscriptionComplete();
        
        toast({
          title: "Redirecting to Checkout...",
          description: "You'll be taken to our secure payment page",
          variant: "default"
        });

        // Small delay to ensure localStorage is updated before redirect
        setTimeout(() => {
          window.location.href = tier.monthlyPaymentLink!;
        }, 100);
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      
      // Show specific error message from the error object
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to process your subscription. Please try again.",
        variant: "destructive"
      });
      
      setIsProcessing(false);
      setSelectedTier(null);
    }
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogContent
        className="max-w-5xl bg-white dark:bg-gray-900 p-6 sm:p-10 border-2 border-yellow-500 dark:border-yellow-600 shadow-2xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        hideCloseButton={true}
      >
        <VisuallyHidden>
          <DialogTitle>Choose Your Subscription Plan</DialogTitle>
        </VisuallyHidden>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Select a membership tier to start your natural health journey
          </p>
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
              ⚡ Required: Choose a plan to continue
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {subscriptionTiers.map((tier) => {
            const Icon = tier.icon;
            const isSelected = selectedTier === tier.tier;
            
            return (
              <Card
                key={tier.tier}
                className={`relative p-6 ${tier.bgColor} ${tier.borderColor} border-2 transition-all duration-300 cursor-pointer ${
                  isSelected ? 'ring-4 ring-yellow-400 dark:ring-yellow-500 shadow-2xl scale-105' : 'hover:shadow-xl hover:scale-102'
                } ${tier.isPopular ? 'ring-2 ring-yellow-300 dark:ring-yellow-600' : ''}`}
                onClick={() => !isProcessing && handleTierSelection(tier)}
                data-testid={`subscription-tier-${tier.tier}`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-xl">
                      ⭐ Recommended
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-white dark:bg-gray-800 shadow-lg">
                    <Icon className={`w-8 h-8 ${tier.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  <div className="mb-3">
                    <span className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {tier.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-4"></div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400 font-bold" />
                        </div>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  disabled={isProcessing}
                  className={`w-full ${tier.buttonStyle} font-bold py-6 text-lg rounded-xl transition-all duration-300 ${
                    !isProcessing ? 'transform hover:scale-105 active:scale-95' : ''
                  }`}
                  data-testid={`button-select-${tier.tier}`}
                >
                  {isProcessing && isSelected 
                    ? "Processing..." 
                    : `Choose ${tier.name}`
                  }
                </Button>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          You can upgrade or downgrade your plan anytime from your dashboard
        </p>
      </DialogContent>
    </Dialog>
  );
}
