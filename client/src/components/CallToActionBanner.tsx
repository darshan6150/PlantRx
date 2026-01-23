import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Gift } from "lucide-react";
import { Link } from "wouter";

interface CallToActionBannerProps {
  variant?: "primary" | "secondary" | "urgent";
  className?: string;
}

export function CallToActionBanner({ variant = "primary", className = "" }: CallToActionBannerProps) {
  const variants = {
    primary: {
      bg: "bg-gradient-to-r from-green-600 via-green-700 to-green-800",
      text: "text-white",
      title: "Start Your Natural Health Journey Today",
      subtitle: "Join 50,000+ users discovering the power of expert-verified plant-based remedies",
      buttonText: "Explore Remedies Now",
      buttonHref: "/remedies",
      icon: Sparkles
    },
    secondary: {
      bg: "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800",
      text: "text-white",
      title: "Get Personalized Health Insights",
      subtitle: "Try our AI-powered symptom analysis and custom remedy generator",
      buttonText: "Try Smart Tools",
      buttonHref: "/smart-tools",
      icon: Sparkles
    },
    urgent: {
      bg: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500",
      text: "text-white",
      title: "Limited Time: Free Expert Consultation",
      subtitle: "Connect with verified natural health experts - completely free this month!",
      buttonText: "Claim Free Consultation",
      buttonHref: "/experts",
      icon: Gift
    }
  };

  const config = variants[variant];
  const IconComponent = config.icon;

  return (
    <section className={`py-12 sm:py-16 ${config.bg} ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <IconComponent className="w-8 h-8 text-white mr-3" />
          {variant === "urgent" && (
            <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              LIMITED TIME
            </span>
          )}
        </div>
        
        <h2 className={`text-3xl sm:text-4xl font-bold ${config.text} mb-4`}>
          {config.title}
        </h2>
        
        <p className={`text-lg sm:text-xl ${config.text} opacity-90 mb-8 max-w-2xl mx-auto`}>
          {config.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={config.buttonHref}>
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all group"
              data-testid={`cta-${variant}-button`}
            >
              {config.buttonText}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          {variant === "primary" && (
            <div className="flex items-center text-white text-sm opacity-75">
              <span>✓ No credit card required</span>
              <span className="mx-2">•</span>
              <span>✓ Instant access</span>
            </div>
          )}
        </div>
        
        {variant === "urgent" && (
          <div className="mt-6 text-white text-sm opacity-75">
            <p>⏰ Offer expires in 7 days | Limited spots available</p>
          </div>
        )}
      </div>
    </section>
  );
}