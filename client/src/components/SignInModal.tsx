"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Loader2, ArrowLeft, Sparkles, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { auth } from "@/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { StripePricingTable } from "@/components/StripePricingTable";
import bronzeOreImg from "@assets/bronze ore_1762728600650.jpg";
import silverOreImg from "@assets/silver ore_1762728609981.jpg";
import goldOreImg from "@assets/gold ore_1762728600651.jpg";

export interface SignInModalProps {
  hard?: boolean;
  onClose?: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ hard, onClose }) => {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  // Set modal active flag for trust popup coordination & prevent body scroll
  React.useEffect(() => {
    (window as any).PLANT_RX_MODAL_ACTIVE = true;
    
    // Prevent body scroll when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    // Handle ESC key to close modal
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      (window as any).PLANT_RX_MODAL_ACTIVE = false;
      document.body.style.overflow = originalStyle;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleSubscribe = async (plan: string) => {
    try {
      setLoading(plan);

      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        // Store selected plan in sessionStorage to resume after login
        sessionStorage.setItem('selectedPlan', plan);
        toast({
          title: "Sign in required",
          description: "Please sign in or create an account to continue",
        });
        setLocation('/signup');
        return;
      }

      // Bronze is free - just redirect to welcome
      if (plan === 'bronze') {
        setLocation('/welcome');
        onClose?.();
        return;
      }

      // Call backend to create Stripe checkout session
      const response = await apiRequest('/api/create-checkout-session', 'POST', {
        plan
      });

      if (response.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.url;
      } else if (response.redirectUrl) {
        // For bronze, redirect to welcome page
        setLocation(response.redirectUrl);
        onClose?.();
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      style={{ pointerEvents: 'auto' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div className="w-full max-w-6xl my-4 relative" onClick={(e) => e.stopPropagation()}>
        {/* Back Button */}
        <button
          onClick={onClose}
          data-testid="button-close-subscription-modal"
          className="absolute -top-3 left-0 bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-full px-4 py-2 shadow-lg transition-all duration-300 flex items-center gap-2 font-semibold text-sm z-10 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close subscription modal"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center mb-6 mt-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Choose Your Plan
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-base">
            Start your natural healing journey today
          </p>
        </div>

        {/* Stripe Pricing Table */}
        <StripePricingTable />
      </div>
    </div>
  );
};
