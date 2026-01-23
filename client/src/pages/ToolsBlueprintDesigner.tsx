import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  FileText, 
  Sparkles, 
  Download, 
  Utensils, 
  Dumbbell, 
  Heart, 
  Leaf, 
  CheckCircle, 
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  Users,
  Shield,
  Zap,
  Target,
  MessageSquare,
  Star,
  Send
} from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";
import { UpgradeInterstitial } from "@/components/FeatureLock";
import { Feature } from "@shared/subscriptionFeatures";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import PlanRxCreator from "@/components/PlanRxCreator";

const blueprintTypes = [
  {
    icon: Utensils,
    title: "Custom Diet Plans",
    description: "Personalized nutrition blueprints based on your goals and dietary preferences.",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    planType: "diet" as const
  },
  {
    icon: Dumbbell,
    title: "Fitness Routines",
    description: "Tailored workout plans for strength, cardio, or weight management.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    planType: "workout" as const
  },
  {
    icon: Heart,
    title: "Skincare Regimens",
    description: "Complete skincare routines with product recommendations.",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    planType: "skincare" as const
  },
  {
    icon: Leaf,
    title: "Wellness Programs",
    description: "Holistic health blueprints for mind, body, and soul.",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    planType: "wellness" as const
  }
];

const features = [
  { icon: Shield, title: "Expert-Verified", description: "Reviewed by certified health professionals" },
  { icon: Zap, title: "Instant Generation", description: "Get your plan in under 5 minutes" },
  { icon: Target, title: "Goal-Oriented", description: "Aligned with your specific goals" },
  { icon: Users, title: "Community Tested", description: "Used by thousands of members" },
  { icon: Download, title: "Beautiful PDFs", description: "Print-ready documents" },
  { icon: Heart, title: "100% Personalized", description: "Tailored just for you" }
];

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

function ParallaxSection({ children, offset = 50 }: { children: React.ReactNode; offset?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}

function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.92, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.92, y: 24 }}
      transition={{ 
        duration: 0.35, 
        delay,
        ease: "easeOut"
      }}
      style={{ willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FloatingElement({ children, duration = 4 }: { children: React.ReactNode; duration?: number }) {
  return (
    <motion.div
      className="will-change-transform"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Let us know how you'd rate this feature.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Thank you for your feedback!",
      description: "Your input helps us improve PlantRx."
    });
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Thank You!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your feedback has been submitted successfully.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Star Rating */}
      <div className="text-center">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          How would you rate the Blueprint Designer?
        </label>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
              data-testid={`rating-star-${star}`}
            >
              <Star
                className={`w-10 h-10 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            </motion.button>
          ))}
        </div>
        {rating > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-purple-600 dark:text-purple-400 mt-2"
          >
            {rating === 5 ? "Excellent!" : rating === 4 ? "Great!" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Needs work"}
          </motion.p>
        )}
      </div>

      {/* Feedback Text */}
      <div>
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Share your thoughts (optional)
        </label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What do you like? What could be improved? Any feature requests?"
          className="w-full h-32 resize-none rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          data-testid="feedback-textarea"
        />
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="submit-feedback-btn"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Feedback
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}

export default function ToolsBlueprintDesigner() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const blueprintTypesRef = useRef<HTMLDivElement>(null);
  const [showCtaOptions, setShowCtaOptions] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<'diet' | 'workout' | 'skincare' | 'wellness' | 'healing' | undefined>(undefined);
  
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const scrollToNext = () => {
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  };

  const scrollToBlueprintTypes = () => {
    blueprintTypesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectBlueprintType = (planType: 'diet' | 'workout' | 'skincare' | 'wellness' | 'healing') => {
    setSelectedPlanType(planType);
    setShowCreator(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDesigner = () => {
    setShowCreator(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (showCreator) {
    return (
      <UpgradeInterstitial feature={Feature.WELLNESS_BLUEPRINT_DESIGNER}>
        <Helmet>
          <title>Create Your Blueprint | PlantRx</title>
          <meta name="description" content="Answer a few questions to create your personalized wellness blueprint." />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <motion.button
              onClick={handleBackToDesigner}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Blueprint Designer
            </motion.button>
          </div>
          
          <PlanRxCreator user={null} onAuthRequired={() => {}} initialPlanType={selectedPlanType} />
        </div>
      </UpgradeInterstitial>
    );
  }

  return (
    <UpgradeInterstitial feature={Feature.WELLNESS_BLUEPRINT_DESIGNER}>
      <Helmet>
        <title>Blueprint Designer - Wellness Plans | PlantRx</title>
        <meta name="description" content="Design comprehensive wellness blueprints and health plans with the PlantRx Blueprint Designer." />
      </Helmet>

      <ScrollProgress />

      <div ref={containerRef} className="overflow-x-hidden">
        
        {/* Hero Section - Full viewport with scroll indicator */}
        <section className="min-h-[70vh] sm:min-h-[90vh] relative flex flex-col items-center justify-center py-10 sm:py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
          {/* Animated background elements - GPU accelerated */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl will-change-transform"
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl will-change-transform"
              animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-300/10 dark:bg-pink-500/5 rounded-full blur-3xl will-change-transform"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeInSection>
              <FloatingElement duration={4}>
                <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl mx-auto mb-4 sm:mb-8 flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white" />
                </div>
              </FloatingElement>
            </FadeInSection>
            
            <FadeInSection delay={0.2}>
              <h1 className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-6 lg:mb-8 leading-tight">
                {t('home.planrx.title', 'Wellness Blueprint Designer')}
              </h1>
            </FadeInSection>
            
            <FadeInSection delay={0.4}>
              <p className="text-sm sm:text-xl lg:text-2xl xl:text-3xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2">
                Transform your health journey with personalized plans created in minutes
              </p>
            </FadeInSection>
            
            <FadeInSection delay={0.6}>
              <motion.div
                onClick={scrollToBlueprintTypes}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 sm:gap-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 sm:px-10 sm:py-5 lg:px-14 lg:py-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg lg:text-xl shadow-2xl cursor-pointer"
              >
                <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
                <span>Start Creating Now</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7" />
                </motion.div>
              </motion.div>
            </FadeInSection>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 sm:py-24 lg:py-32 bg-white dark:bg-gray-900 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection className="text-center mb-8 sm:mb-16">
              <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-4 block">Simple Process</span>
              <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
                How It Works
              </h2>
              <p className="text-sm sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Create your personalized blueprint in three simple steps
              </p>
            </FadeInSection>

            {/* Timeline connector */}
            <div className="hidden md:block absolute left-1/2 top-[280px] w-px h-[200px] bg-gradient-to-b from-purple-500 to-pink-500 opacity-30" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 lg:gap-12">
              {[
                { step: 1, icon: Target, title: "Choose Your Blueprint", description: "Select from diet, fitness, skincare, or wellness plans tailored to your needs." },
                { step: 2, icon: FileText, title: "Answer Questions", description: "Tell us about your goals, preferences, and lifestyle in our guided questionnaire." },
                { step: 3, icon: Download, title: "Get Your Plan", description: "Receive a beautifully designed PDF blueprint instantly, ready to follow." }
              ].map((item, index) => (
                <FadeInSection key={item.step} delay={index * 0.2} className="h-full">
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="h-full text-center p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center"
                  >
                    <div className="relative inline-block mb-3 sm:mb-6">
                      <motion.div 
                        className={`w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl`}
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
                      </motion.div>
                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-900 border-2 sm:border-4 border-purple-500 flex items-center justify-center text-xs sm:text-lg font-bold text-purple-600 dark:text-purple-400 shadow-lg">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-3">{item.title}</h3>
                    <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">{item.description}</p>
                  </motion.div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Blueprint Types Section */}
        <section ref={blueprintTypesRef} className="py-12 sm:py-24 lg:py-32 bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900 dark:to-purple-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection className="text-center mb-6 sm:mb-16">
              <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-4 block">Categories</span>
              <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
                Choose Your Blueprint
              </h2>
              <p className="text-sm sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Four specialized categories designed to transform your wellness journey
              </p>
            </FadeInSection>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {blueprintTypes.map((type, index) => (
                <FadeInSection key={type.title} delay={index * 0.1}>
                  <motion.div
                    onClick={() => handleSelectBlueprintType(type.planType)}
                    whileHover={{ y: -15, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="cursor-pointer h-full"
                  >
                    <Card className="h-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                      <div className={`h-1 sm:h-2 bg-gradient-to-r ${type.color}`} />
                      <CardContent className="p-3 sm:p-8 pt-3 sm:pt-6 text-center flex flex-col items-center h-full">
                        <motion.div 
                          className={`w-10 h-10 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${type.color} mb-3 sm:mb-6 mt-1 sm:mt-2 flex items-center justify-center shadow-xl`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <type.icon className="w-5 h-5 sm:w-10 sm:h-10 text-white" />
                        </motion.div>
                        <h3 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-3">{type.title}</h3>
                        <p className="text-[10px] sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed flex-grow line-clamp-2 sm:line-clamp-none">{type.description}</p>
                        <div className="mt-3 sm:mt-6 pt-2 sm:pt-4 border-t border-gray-100 dark:border-gray-700 w-full">
                          <span className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400 flex items-center justify-center gap-1 sm:gap-2 group-hover:gap-4 transition-all">
                            Get Started
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Main CTA Section with Parallax */}
        <section className="py-12 sm:py-24 lg:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          {/* Animated background patterns */}
          <div className="absolute inset-0 opacity-20">
            <motion.div 
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
                backgroundSize: '60px 60px'
              }}
              animate={{ y: [0, -60] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <ParallaxSection offset={30}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <FadeInSection>
                <FloatingElement duration={3}>
                  <Sparkles className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-8 text-yellow-300" />
                </FloatingElement>
              </FadeInSection>
              
              <FadeInSection delay={0.2}>
                <h2 className="text-xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-6">
                  Ready to Transform Your Health?
                </h2>
              </FadeInSection>
              
              <FadeInSection delay={0.4}>
                <p className="text-sm sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-10 max-w-2xl mx-auto px-2">
                  Join thousands who have created personalized wellness blueprints. Your journey to better health starts here.
                </p>
              </FadeInSection>
              
              <FadeInSection delay={0.6}>
                <motion.div
                  onClick={() => setShowCtaOptions(!showCtaOptions)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 sm:gap-4 bg-white text-purple-700 px-6 py-3 sm:px-10 sm:py-5 lg:px-14 lg:py-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg lg:text-xl shadow-2xl cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-5 h-5 sm:w-7 sm:h-7" />
                  <span>Create My Blueprint Now</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7" />
                  </motion.div>
                </motion.div>
              </FadeInSection>

              {/* Inline Blueprint Type Options */}
              <motion.div
                initial={false}
                animate={{ 
                  height: showCtaOptions ? "auto" : 0,
                  opacity: showCtaOptions ? 1 : 0,
                  marginTop: showCtaOptions ? 40 : 0
                }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden w-full max-w-5xl mx-auto"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={showCtaOptions ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-white/90 text-lg mb-6 font-medium"
                >
                  Choose your blueprint type to get started:
                </motion.p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 px-4">
                  {blueprintTypes.map((type, index) => (
                    <motion.div
                      key={type.title}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={showCtaOptions ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
                      transition={{ delay: 0.1 + index * 0.1, duration: 0.4, ease: "easeOut" }}
                      onClick={() => handleSelectBlueprintType(type.planType)}
                    >
                      <motion.div 
                        whileHover={{ y: -6, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden cursor-pointer group h-full shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        {/* Top gradient accent bar */}
                        <div className={`h-1.5 bg-gradient-to-r ${type.color}`} />
                        
                        <div className="p-6 pt-5">
                          {/* Icon with gradient fill */}
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} mb-5 flex items-center justify-center shadow-lg mx-auto group-hover:scale-110 transition-transform duration-300`}>
                            <type.icon className="w-8 h-8 text-white" />
                          </div>
                          
                          {/* Title */}
                          <h4 className="text-gray-900 dark:text-white font-bold text-lg text-center mb-2">{type.title}</h4>
                          
                          {/* Description */}
                          <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-5 leading-relaxed line-clamp-2">{type.description}</p>
                          
                          {/* CTA Button */}
                          <div className={`w-full py-3 rounded-xl bg-gradient-to-r ${type.color} text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg group-hover:shadow-xl transition-all`}>
                            Get Started
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                        
                        {/* Subtle corner decoration */}
                        <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${type.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <FadeInSection delay={0.8}>
                <div className="mt-6 sm:mt-12 flex flex-wrap justify-center gap-3 sm:gap-8 text-white/80">
                  <span className="flex items-center gap-1 sm:gap-2 text-xs sm:text-lg">
                    <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-300" />
                    Expert-designed
                  </span>
                  <span className="flex items-center gap-1 sm:gap-2 text-xs sm:text-lg">
                    <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-300" />
                    Ready in 5 minutes
                  </span>
                  <span className="flex items-center gap-1 sm:gap-2 text-xs sm:text-lg">
                    <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-300" />
                    Beautiful PDFs
                  </span>
                </div>
              </FadeInSection>
            </div>
          </ParallaxSection>
        </section>

        {/* Features Grid */}
        <section className="py-12 sm:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection className="text-center mb-6 sm:mb-16">
              <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-4 block">Benefits</span>
              <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
                Why Choose Our Blueprints?
              </h2>
            </FadeInSection>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <FadeInSection key={feature.title} delay={index * 0.1} className="h-full">
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="h-full"
                  >
                    <Card className="h-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all">
                      <CardContent className="p-3 sm:p-8 pt-3 sm:pt-6 h-full flex flex-col">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                          className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mt-1 sm:mt-2 mb-3 sm:mb-5 shadow-lg"
                        >
                          <feature.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                        </motion.div>
                        <h3 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">{feature.title}</h3>
                        <p className="text-[10px] sm:text-base text-gray-600 dark:text-gray-400 flex-grow">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="py-12 sm:py-24 lg:py-32 bg-gradient-to-br from-gray-50 to-purple-50/50 dark:from-gray-900 dark:to-purple-900/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
                <CardContent className="p-4 sm:p-8 lg:p-12">
                  <div className="text-center mb-4 sm:mb-8">
                    <motion.div
                      className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl mx-auto mb-3 sm:mb-6 flex items-center justify-center shadow-lg"
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </motion.div>
                    <h2 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                      We'd Love Your Feedback
                    </h2>
                    <p className="text-xs sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                      Help us improve the Blueprint Designer. Share your thoughts, suggestions, or ideas!
                    </p>
                  </div>
                  
                  <FeedbackForm />
                </CardContent>
              </Card>
            </FadeInSection>
          </div>
        </section>

      </div>
    </UpgradeInterstitial>
  );
}
