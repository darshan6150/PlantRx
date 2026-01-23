import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sparkles, Search, Leaf, Star, Wand2, AlertTriangle, CheckCircle, Heart, Package, Clock, Calendar, BookOpen, User, ChevronDown, HelpCircle, ArrowRight, ExternalLink, Eye, TrendingUp, ThumbsUp, Zap, Shield, Users } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import RemedyCard from "@/components/RemedyCard";
import Header from "@/components/Header";
import { FileText, Download } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";
import { SEOHead } from "@/components/SEOHead";
import { navigateTo } from "@/utils/navigation";
import { AdSenseAd, AdConfigs } from "@/components/AdSenseAd";
import { FAQ } from "@/components/FAQ";
import { showSignInModal } from "@/lib/showSignInModal";
import { onAuthStateChanged } from "@/auth";
import affiliateBannerImage from "@assets/affiliate members at plantrx_1764168333359.jpeg";
import { GoldTrialBanner } from "@/components/GoldTrialBanner";
import { ArticleCarousel } from "@/components/ArticleCarousel";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [remedyNeed, setRemedyNeed] = useState("");
  const [preferences, setPreferences] = useState("");
  const [generatedRemedy, setGeneratedRemedy] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // No premium features - all features are free

  // Fetch featured remedies with faster loading
  const { data: featuredRemedies = [], isLoading: isLoadingFeatured } = useQuery({
    queryKey: ["/api/remedies/featured"],
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    gcTime: 30 * 60 * 1000, // 30 minutes in memory
  });
  
  // Type-safe access to remedies
  const remedies = Array.isArray(featuredRemedies) ? featuredRemedies : [];
  
  // Set content ready after initial data loads
  useEffect(() => {
    if (!isLoadingFeatured && remedies.length >= 0) {
      const timer = setTimeout(() => {
        setContentReady(true);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoadingFeatured, remedies.length]);

  // Fetch most clicked articles (sorted by views)
  const { data: mostClickedData = [], isLoading: isLoadingClicked } = useQuery({
    queryKey: ["/api/blog/most-clicked"],
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 15 * 60 * 1000,
  });
  
  // Type-safe access to articles
  const mostClicked = Array.isArray(mostClickedData) ? mostClickedData : [];
  const blogPosts = mostClicked;

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Please enter a search query",
        description: "Describe what you're experiencing or what you need help with.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      // Simple client-side search through featured remedies
      const filtered = remedies.filter((remedy: any) => 
        remedy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        remedy.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        remedy.ingredients?.some((ing: string) => ing.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(filtered);
      
      if (filtered.length === 0) {
        toast({
          title: "No results found",
          description: "Try rephrasing your search or use different keywords.",
        });
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Unable to search remedies at this time. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRemedyGeneration = async () => {
    // Check authentication first
    if (!user) {
      showSignInModal({
        hard: false,
        onDismiss: () => {
          // Optional: You can add any behavior when user dismisses the modal
        }
      });
      return;
    }

    if (!remedyNeed.trim()) {
      toast({
        title: "Please describe what you need help with",
        description: "Enter your health concern to generate a custom remedy.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log("🤖 Generating AI-powered remedy...");
      
      const response = await fetch('/api/generate-remedy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          healthConcern: remedyNeed,
          preferences: preferences
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate remedy');
      }

      const remedy = await response.json();
      
      setGeneratedRemedy(remedy);
      setIsSaved(false); // Reset saved state for new remedy
      toast({
        title: "🌿 Expert Remedy Generated!",
        description: "Your personalized natural remedy has been crafted by our AI health experts.",
      });
      
      console.log("✅ Remedy generated successfully:", remedy.name);
    } catch (error: any) {
      console.error("❌ Remedy generation error:", error);
      
      let errorTitle = "Generation Failed";
      let errorDescription = "Unable to generate remedy at this time. Please try again.";
      
      if (error.message?.includes("only provide guidance on health")) {
        errorTitle = "Health Topic Required";
        errorDescription = "I can only provide guidance on health and wellness topics. Please ask about natural remedies, nutrition, fitness, or other health concerns.";
      } else if (error.message?.includes("temporarily unavailable")) {
        errorDescription = "Our AI health experts are temporarily unavailable. Please try again in a few moments.";
      } else if (error.message?.includes("Incomplete remedy")) {
        errorDescription = "Please try rephrasing your health concern for better results.";
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRemedy = async () => {
    if (!generatedRemedy) return;

    setIsSaving(true);
    try {
      // Check authentication status
      const authCheck = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (!authCheck.ok) {
        toast({
          title: "Authentication required",
          description: "Please log in to save custom remedies.",
          variant: "destructive"
        });
        // Redirect to login page
        navigateTo('/login');
        return;
      }

      // Save to custom remedies
      const customRemedyData = {
        name: generatedRemedy.name,
        description: `Custom remedy generated for: ${remedyNeed}`,
        ingredients: generatedRemedy.ingredients || [],
        benefits: generatedRemedy.benefits || [],
        instructions: generatedRemedy.instructions || '',
        form: generatedRemedy.form || 'custom',
        category: 'custom',
        symptoms: [remedyNeed],
        generatedFrom: 'Custom Remedy Generator'
      };

      await apiRequest('/api/custom-remedies', 'POST', customRemedyData);

      setIsSaved(true); // Mark as saved
      toast({
        title: "Remedy saved successfully!",
        description: "Redirecting to your dashboard...",
      });

      // Invalidate queries to refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ['/api/custom-remedies'] });

      // Redirect to dashboard after successful save
      setTimeout(() => {
        navigateTo('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Save remedy error:', error);
      toast({
        title: "Failed to save remedy",
        description: "Unable to save remedy at this time. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen luxury-gradient-bg">
      <SEOHead 
        title="PlantRx — Expert Natural Remedies & Herbal Health Platform | 166+ Verified Solutions"
        description="Discover 166+ verified plant-based remedies, backed by experts. Get personalized natural solutions for better health. Free symptom checker & expert chat included!"
        keywords="PlantRx, PlantRx app, PlantRx natural health, natural remedies, herbal medicine, plant based medicine, alternative medicine, holistic health, natural healing, herbal remedies, wellness platform, health technology, symptom checker, remedy finder, natural health app, plant medicine, organic remedies, traditional medicine, integrative health, preventive medicine"
        canonical="https://plantrxapp.com/"
        ogType="website"
        schema={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": "PlantRx - Natural Health Platform",
          "url": "https://plantrxapp.com/",
          "description": "PlantRx is the leading natural health platform offering 166+ expert-verified remedies, advanced symptom analysis, and personalized natural health solutions.",
          "mainEntity": {
            "@type": "Organization",
            "name": "PlantRx",
            "alternateName": ["PlantRx App", "PlantRx Natural Health Platform"],
            "description": "World's #1 natural health platform with expert-verified remedies"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://plantrxapp.com/remedies?search={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog", 
            "name": "Natural Remedies",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": "Natural Plant-Based Remedies",
                  "description": "166+ expert-verified natural remedies"
                }
              }
            ]
          }
        }}
      />
      <Header />
      
      {/* Gold Trial Promotional Banner */}
      <GoldTrialBanner />
      
      {/* Interactive Animated Hero Section */}
      <section className="relative py-10 sm:py-16 lg:py-28 mobile-safe-area ios-safe-area-top min-h-[85vh] sm:min-h-[90vh] flex items-center">
        {/* Animated gradient background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-white to-amber-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30"></div>
        
        {/* Animated mesh gradient */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(217, 119, 6, 0.12) 0%, transparent 50%)",
              "radial-gradient(ellipse 80% 50% at 40% 30%, rgba(16, 185, 129, 0.18) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 60% 70%, rgba(217, 119, 6, 0.15) 0%, transparent 50%)",
              "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(217, 119, 6, 0.12) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating botanical icons - decorative layer positioned around edges */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Edge-positioned floating icons - avoiding center content */}
          {[
            { left: '3%', top: '15%', icon: 'leaf' },
            { left: '5%', top: '45%', icon: 'sparkle' },
            { left: '8%', top: '75%', icon: 'heart' },
            { left: '92%', top: '12%', icon: 'sparkle' },
            { left: '88%', top: '38%', icon: 'leaf' },
            { left: '94%', top: '65%', icon: 'sparkle' },
            { left: '90%', top: '85%', icon: 'heart' },
            { left: '12%', top: '8%', icon: 'sparkle' },
            { left: '85%', top: '22%', icon: 'sparkle' },
            { left: '6%', top: '88%', icon: 'sparkle' },
            { left: '15%', top: '92%', icon: 'leaf' },
            { left: '82%', top: '92%', icon: 'sparkle' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: item.left,
                top: item.top,
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, i % 2 === 0 ? 8 : -8, 0],
                rotate: [0, i % 2 === 0 ? 8 : -8, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.25,
              }}
            >
              <div className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-sm ${
                item.icon === 'leaf' 
                  ? 'bg-emerald-500/15 dark:bg-emerald-400/15' 
                  : item.icon === 'sparkle' 
                    ? 'bg-amber-500/15 dark:bg-amber-400/15' 
                    : 'bg-rose-500/10 dark:bg-rose-400/10'
              }`}>
                {item.icon === 'leaf' && <Leaf className="w-3 h-3 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />}
                {item.icon === 'sparkle' && <Sparkles className="w-3 h-3 sm:w-5 sm:h-5 text-amber-500 dark:text-amber-400" />}
                {item.icon === 'heart' && <Heart className="w-3 h-3 sm:w-5 sm:h-5 text-rose-500 dark:text-rose-400" />}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Animated orbs with glow */}
        <motion.div
          className="absolute top-20 left-[5%] w-40 h-40 sm:w-72 sm:h-72 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-[5%] w-48 h-48 sm:w-80 sm:h-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(217, 119, 6, 0.25) 0%, transparent 70%)" }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.8, 0.5],
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        
        {/* Center glow pulse */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full"
          style={{ 
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(217, 119, 6, 0.1) 40%, transparent 70%)",
            filter: "blur(60px)"
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Main content */}
        <div className="max-w-6xl mx-auto text-center relative z-10 px-4 w-full">
          {/* Animated trust badge */}
          <motion.div
            initial={{ opacity: 0.92, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="mb-6 sm:mb-8"
          >
            <motion.div 
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-full border border-emerald-300/50 dark:border-emerald-600/30 shadow-lg shadow-emerald-500/10"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.3)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <span className="flex h-2.5 w-2.5 sm:h-3 sm:w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300 tracking-wide">131+ Verified Natural Remedies</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </motion.div>
          </motion.div>
          
          {/* Animated PlantRx Title with Split Text Effect */}
          <motion.div
            initial={{ opacity: 0.92, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="mb-4 sm:mb-6"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
              <span
                className="text-gray-800 dark:text-white block sm:inline"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Welcome to{" "}
              </span>
              <span className="relative">
                <span
                  className="text-emerald-600 dark:text-emerald-400"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Plant
                </span>
                <span
                  className="text-amber-500 dark:text-amber-400 font-black"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  R
                </span>
                <span
                  className="text-emerald-600 dark:text-emerald-400 font-black"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  x
                </span>
                {/* Decorative leaf - hidden on mobile to prevent overlap */}
                <motion.div
                  className="absolute -top-6 -right-6 hidden sm:block"
                  animate={{ rotate: [-5, 5, -5], y: [0, -3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Leaf className="w-8 h-8 text-emerald-500 dark:text-emerald-400 drop-shadow-lg" />
                </motion.div>
              </span>
            </h1>
          </motion.div>
          
          {/* Animated subtitle */}
          <motion.p
            initial={{ opacity: 0.92, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto font-['Playfair_Display'] leading-relaxed"
          >
            {t('home.hero.subtitle', 'Expert natural remedies that work. No chemicals. No side effects. Real results.')}
          </motion.p>
          
          {/* CTA Buttons with hover effects */}
          <motion.div
            initial={{ opacity: 0.92, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => navigateTo('/remedies')}
                className="group relative px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl shadow-xl shadow-emerald-500/30 overflow-hidden"
                data-testid="hero-explore-remedies"
              >
                <span className="relative flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  Explore Remedies
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => navigateTo('/smart-tools')}
                variant="outline"
                className="group px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-bold border-2 border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-2xl backdrop-blur-sm"
                data-testid="hero-symptom-finder"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Symptom Finder
                  <Sparkles className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Quick links row - Enhanced with icons and modern styling */}
          <motion.div
            initial={{ opacity: 0.92, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="mt-8 sm:mt-12"
          >
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {[
                { href: '/store', label: 'Shop Store', icon: 'store', external: false },
                { href: '/blog', label: 'Read Articles', icon: 'book', external: false },
                { href: '/about/plantrx', label: 'About PlantRx', icon: 'info', external: false },
                { href: 'https://af.uppromote.com/0yx2kn-wu/register', label: 'Become an Affiliate', icon: 'affiliate', external: true },
              ].map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={link.external ? (e) => { e.preventDefault(); window.open(link.href, '_blank', 'noopener,noreferrer'); } : (e) => { e.preventDefault(); navigateTo(link.href); }}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-300 cursor-pointer font-medium text-sm sm:text-base shadow-sm hover:shadow-md"
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.icon === 'store' && (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  )}
                  {link.icon === 'book' && (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                  {link.icon === 'info' && (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {link.icon === 'affiliate' && (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span>{link.label}</span>
                  {link.external ? (
                    <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Research backing */}
          <motion.div
            initial={{ opacity: 0.92, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: 0.25, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="mt-8 sm:mt-10 flex flex-col items-center text-center"
          >
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mb-2 max-w-lg">
              {t('home.hero.research', 'All remedies backed by scientific research.')}
            </p>
            <a 
              href="https://www.ncbi.nlm.nih.gov/pubmed"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.preventDefault(); window.open('https://www.ncbi.nlm.nih.gov/pubmed', '_blank', 'noopener,noreferrer'); }}
              className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-medium cursor-pointer hover:translate-x-1 transition-transform"
            >
              View scientific studies <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Premium Articles Section - Most Clicked & Most Liked Carousels */}
      <section className="py-8 sm:py-20 lg:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Clean and minimal on mobile */}
          <motion.div 
            initial={{ opacity: 0.92, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="text-center mb-6 sm:mb-14 lg:mb-18"
          >
            {/* Mobile: Simple text only | Desktop: Badge with icon */}
            <div className="hidden sm:inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 rounded-full px-4 py-2 mb-5">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 tracking-wide uppercase">
                {t('home.articles.badge', 'Expert Insights')}
              </span>
            </div>
            <h2 className="text-xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-5 tracking-tight leading-tight">
              {t('home.articles.title', 'Popular Articles')}
            </h2>
            <p className="text-xs sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              {t('home.articles.subtitle', 'Discover our most popular wellness guides loved by thousands of readers')}
            </p>
          </motion.div>

          {/* Two Premium Carousels - Tighter spacing on mobile */}
          <div className="space-y-8 sm:space-y-20 lg:space-y-24">
            {/* Most Clicked Articles Carousel */}
            <motion.div
              initial={{ opacity: 0.92, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
            >
              <ArticleCarousel
                articles={mostClicked as any[]}
                variant="clicked"
                title="Most Clicked Articles"
                subtitle="Trending reads from our community"
                isLoading={isLoadingClicked}
              />
            </motion.div>
          </div>

          {/* View All Articles CTA - Compact on mobile */}
          {blogPosts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0.92, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
              className="text-center mt-8 sm:mt-18 lg:mt-20"
            >
              <Link href="/blog">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 sm:px-12 py-3 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-md sm:shadow-lg active:scale-[0.98] transition-all duration-200">
                  <span className="flex items-center gap-2">
                    {t('home.articles.view_all', 'View All Articles')}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* How PlantRx Develops Every Remedy - Scientific Process Section */}
      <section className="py-8 sm:py-16 lg:py-24 bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0.92, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="text-center mb-6 sm:mb-12 lg:mb-16"
          >
            <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700 mb-2 sm:mb-4 text-[10px] sm:text-xs px-2.5 sm:px-4 py-1 sm:py-2 font-semibold tracking-wide">
              OUR METHODOLOGY
            </Badge>
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 tracking-tight">
              How PlantRx Develops Every Remedy
            </h2>
            <p className="text-xs sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-2">
              A rigorous 4-step scientific process ensuring every remedy meets the highest standards of efficacy and safety
            </p>
          </motion.div>

          {/* 4-Step Process Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {/* Step 1: Deep Theoretical & Historical Analysis */}
            <motion.div
              initial={{ opacity: 0.92, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: 0, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
            >
              <div className="group relative h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/30 to-green-600/30 dark:from-emerald-400/20 dark:to-green-500/20 rounded-xl sm:rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.15)] dark:shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.25)] dark:hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.2)] transition-all duration-500 border border-emerald-100/80 dark:border-emerald-900/50 h-full">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 group-hover:scale-105 transition-all duration-300">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="inline-flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <span className="text-[8px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">STEP 01</span>
                  </div>
                  <h3 className="text-xs sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 leading-tight">
                    Deep Theoretical & Historical Analysis
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-4 sm:line-clamp-none">
                    Every remedy begins long before it is created. We study how different cultures used the ingredient, what traditional medicine believed about it, and whether those beliefs were consistent across history.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 2: Scientific Research & Evidence Review */}
            <motion.div
              initial={{ opacity: 0.92, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: 0.06, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
            >
              <div className="group relative h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/30 to-green-600/30 dark:from-emerald-400/20 dark:to-green-500/20 rounded-xl sm:rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.15)] dark:shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.25)] dark:hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.2)] transition-all duration-500 border border-emerald-100/80 dark:border-emerald-900/50 h-full">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 group-hover:scale-105 transition-all duration-300">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="inline-flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <span className="text-[8px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">STEP 02</span>
                  </div>
                  <h3 className="text-xs sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 leading-tight">
                    Scientific Research & Evidence Review
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-4 sm:line-clamp-none">
                    Once a remedy passes the historical filter, we examine modern scientific literature: clinical studies, biochemical effects, safety reports, and peer-reviewed herbal data.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 3: Expert Evaluation & Safety Screening */}
            <motion.div
              initial={{ opacity: 0.92, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: 0.12, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
            >
              <div className="group relative h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/30 to-green-600/30 dark:from-emerald-400/20 dark:to-green-500/20 rounded-xl sm:rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.15)] dark:shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.25)] dark:hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.2)] transition-all duration-500 border border-emerald-100/80 dark:border-emerald-900/50 h-full">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 group-hover:scale-105 transition-all duration-300">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="inline-flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <span className="text-[8px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">STEP 03</span>
                  </div>
                  <h3 className="text-xs sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 leading-tight">
                    Expert Evaluation & Safety Screening
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-4 sm:line-clamp-none">
                    The remedy is then shared with experienced herbalists and wellness experts who provide professional feedback on effectiveness and safety.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 4: Real-World Testing & Final Selection */}
            <motion.div
              initial={{ opacity: 0.92, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: 0.18, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
            >
              <div className="group relative h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/30 to-green-600/30 dark:from-emerald-400/20 dark:to-green-500/20 rounded-xl sm:rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.15)] dark:shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.25)] dark:hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.2)] transition-all duration-500 border border-emerald-100/80 dark:border-emerald-900/50 h-full">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 group-hover:scale-105 transition-all duration-300">
                    <Leaf className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="inline-flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <span className="text-[8px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">STEP 04</span>
                  </div>
                  <h3 className="text-xs sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 leading-tight">
                    Real-World Testing & Final Selection
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-4 sm:line-clamp-none">
                    After expert approval, each remedy undergoes practical testing and side-effect assessment. Only remedies with the highest benefit and lowest risk are selected.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Remedies Section */}
      <section className="py-10 sm:py-10 lg:py-14 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0.92, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="text-center mb-6 sm:mb-8"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-3">Explore Remedies</h2>
            <p className="text-sm sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-['Playfair_Display'] leading-relaxed px-3">
              Discover our most trusted, expert-verified plant-based solutions including <a href="/remedy/turmeric-formula-2" className="text-green-600 dark:text-green-400 hover:underline">turmeric for inflammation</a> and <a href="/remedy/ginger-formula-1" className="text-green-600 dark:text-green-400 hover:underline">ginger for digestion</a>
            </p>
          </motion.div>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 auto-rows-fr">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 auto-rows-fr">
              {(featuredRemedies as any[]).slice(0, 3).map((remedy: any, index: number) => (
                <motion.div 
                  key={remedy.id}
                  initial={{ opacity: 0.92, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
                  style={{ willChange: "transform, opacity" }}
                  className="hover-lift h-full"
                >
                  <RemedyCard remedy={remedy} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0.92, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="text-center mt-8 sm:mt-10"
          >
            <Link href="/remedies">
              <Button className="bg-gradient-to-r from-green-600 to-green-800 text-white px-5 py-2 sm:px-8 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl hover:shadow-lg transition-all font-semibold animate-glow">
                See All Remedies
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Affiliate Banner Section */}
      <section className="py-10 sm:py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0.92, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
          >
            <div 
              className="group relative bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_20px_50px_rgb(0,0,0,0.4)] transition-all duration-500 border border-gray-100 dark:border-gray-800"
              data-testid="affiliate-banner"
            >
              {/* Desktop: Horizontal Layout | Mobile: Vertical Stacked */}
              <div className="flex flex-col md:flex-row items-center">
                {/* Image Container */}
                <div className="w-full md:w-1/2 p-4 sm:p-6">
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                    <img 
                      src={affiliateBannerImage}
                      alt="PlantRx Affiliate Partners - Trusted Natural Health Team"
                      className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                      data-testid="affiliate-banner-image"
                      loading="lazy"
                    />
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center text-center md:text-left">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 mb-4 justify-center md:justify-start">
                    <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full">
                      Affiliate Program
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    Partner with PlantRx
                  </h3>

                  {/* Subtitle */}
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed max-w-md mx-auto md:mx-0">
                    Join our affiliate program and earn commissions by sharing natural health solutions with your audience.
                  </p>

                  {/* CTA Button */}
                  <div className="flex justify-center md:justify-start">
                    <button
                      onClick={() => window.open('https://af.uppromote.com/0yx2kn-wu/register', '_blank', 'noopener,noreferrer')}
                      className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group/btn cursor-pointer"
                      data-testid="affiliate-cta-button"
                    >
                      <span>Become an Affiliate</span>
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                    </button>
                  </div>

                  {/* Trust indicators */}
                  <div className="flex items-center gap-4 mt-6 text-sm text-gray-500 dark:text-gray-500 justify-center md:justify-start">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Earn Commissions
                    </span>
                    <span className="flex items-center gap-1">
                      <Leaf className="w-4 h-4 text-emerald-500" />
                      Free to Join
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW: Understanding Clinical Herbal Medicine Section - 350+ Words - COLLAPSIBLE */}
      <section className="py-8 sm:py-12 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between gap-4 sm:gap-6 p-4 sm:p-6 min-h-[80px] sm:min-h-[96px] rounded-2xl border-[3px] border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-gray-900 transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-left flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                    <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                      What is Clinical Herbal Medicine?
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Click to learn about our approach</p>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 transition-transform group-data-[state=open]:rotate-180 flex-shrink-0" />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-6">
              <div className="prose prose-lg max-w-none dark:prose-invert p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Clinical herbal medicine is the professional practice of using plant-based remedies to prevent and treat health conditions, grounded in both traditional knowledge systems and contemporary scientific research. Unlike casual herbal use, clinical herbalism requires rigorous training in plant identification, pharmacology, drug interactions, proper dosing, and contraindications. At PlantRx, we apply these clinical standards to every remedy in our database, ensuring you receive professional-grade guidance backed by peer-reviewed research and centuries of documented use.
            </p>

            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Our platform represents a new generation of natural health resources that combines the best of three worlds: traditional herbal wisdom from systems like Ayurveda and Traditional Chinese Medicine, cutting-edge phytochemical research from modern laboratories, and clinical experience from practicing herbalists treating real patients. This comprehensive approach means you're not just getting old folk remedies or unproven "natural" claims – you're accessing remedies that have been validated through multiple lenses of evidence and refined over generations of use.
            </p>

            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Each remedy undergoes a thorough verification process where we examine historical documentation, review published clinical trials, assess safety profiles, identify potential drug interactions, and confirm proper preparation methods. We don't include every plant that's ever been used medicinally – only those with substantial evidence of both efficacy and safety. This means our collection of 166+ remedies represents the most reliable natural treatments available, suitable for addressing common health concerns from digestive issues and sleep problems to pain management and immune support.
            </p>

            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Whether you're new to natural medicine or an experienced practitioner, PlantRx provides the depth of information needed to make informed decisions. Every remedy includes detailed preparation instructions with specific measurements, recommended dosing schedules, expected timelines for results, important safety warnings, and guidance on when professional medical care is necessary. We believe natural medicine should be both accessible and professional – making it easy to get started while maintaining the highest standards of safety and effectiveness.
            </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>

      {/* SEO Enhancement - FAQ Section */}
      <section className="py-6 sm:py-12 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: Compact FAQ with limited items */}
          <motion.div 
            initial={{ opacity: 0.92, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="sm:hidden"
          >
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400 transition-all mb-4"
                >
                  <div className="flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Frequently Asked Questions
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 transition-transform" />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <FAQ
                  title=""
                  className="border-0 shadow-none"
                  items={[
                    {
                      question: "What's the best natural remedy for better sleep?",
                      answer: "Valerian root, chamomile tea, and passionflower are proven sleep aids. Our most effective remedy combines magnesium-rich herbs with calming nervines taken 30-60 minutes before bed. Results typically appear within 3-5 days of consistent use."
                    },
                    {
                      question: "How can I boost my immune system naturally?",
                      answer: "Elderberry, echinacea, and medicinal mushrooms like reishi strengthen immunity. Our immune support protocol combines vitamin C-rich herbs with adaptogenic mushrooms for both prevention and active immune defense during cold/flu season."
                    },
                    {
                      question: "What helps with chronic inflammation and joint pain?",
                      answer: "Turmeric (curcumin) with black pepper is our top anti-inflammatory remedy. Clinical doses of 500-1000mg daily reduce inflammation markers within 2-4 weeks. Ginger and boswellia also provide powerful natural pain relief without stomach side effects."
                    }
                  ]}
                />
              </CollapsibleContent>
            </Collapsible>
          </motion.div>

          {/* Desktop: Full FAQ */}
          <motion.div 
            initial={{ opacity: 0.92, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="hidden sm:block"
          >
            <FAQ
                title="Frequently Asked Questions"
                items={[
                  {
                    question: "What's the best natural remedy for better sleep?",
                    answer: "Valerian root, chamomile tea, and passionflower are proven sleep aids backed by clinical research. Our most effective remedy combines magnesium-rich herbs with calming nervines taken 30-60 minutes before bed. Most users report improved sleep quality within 3-5 days of consistent use. For chronic insomnia, we recommend pairing herbal support with sleep hygiene improvements."
                  },
                  {
                    question: "How can I boost my immune system naturally?",
                    answer: "Elderberry syrup, echinacea, and medicinal mushrooms like reishi and turkey tail are scientifically proven immune boosters. Our immune support protocol combines vitamin C-rich herbs with adaptogenic mushrooms for both prevention and active defense. Take daily during cold/flu season or at first signs of illness. Studies show elderberry can reduce cold duration by 2-4 days."
                  },
                  {
                    question: "What helps with chronic inflammation and joint pain?",
                    answer: "Turmeric (curcumin) with black pepper is our top anti-inflammatory remedy, with over 10,000 published studies supporting its efficacy. Clinical doses of 500-1000mg curcumin daily reduce inflammatory markers like C-reactive protein within 2-4 weeks. Ginger, boswellia, and omega-3 rich herbs also provide powerful natural pain relief without the stomach issues of NSAIDs."
                  },
                  {
                    question: "Are natural remedies safe to use with my medications?",
                    answer: "Many herbs are safe, but some interact with medications. St. John's Wort affects birth control and antidepressants. Ginkgo and garlic increase bleeding risk with blood thinners. Each remedy page includes detailed drug interaction warnings. Always consult your doctor or pharmacist before combining herbs with prescription medications, especially blood thinners, diabetes drugs, or antidepressants."
                  },
                  {
                    question: "How do I know if a remedy is actually working?",
                    answer: "Track specific symptoms before starting (pain level 1-10, sleep hours, energy rating). Most acute remedies work within hours to days (ginger for nausea, peppermint for headaches). Chronic condition remedies need 2-8 weeks of consistent use. Each remedy page lists expected timelines. If no improvement after the stated period at proper dosing, the remedy may not suit your body chemistry."
                  },
                  {
                    question: "What's better: fresh herbs, teas, or supplements?",
                    answer: "It depends on the herb and condition. Fresh ginger and garlic retain volatile oils best. Standardized extracts (like 95% curcumin or 0.8% valerenic acid) ensure consistent therapeutic doses for chronic conditions. Teas work well for gentle daily support but may lack clinical-strength concentrations. We specify the most effective form for each remedy based on research and traditional use."
                  },
                  {
                    question: "Can pregnant or breastfeeding women use these remedies?",
                    answer: "Some herbs are safe during pregnancy (ginger for morning sickness, red raspberry leaf in third trimester), but many are contraindicated. Never use: dong quai, black cohosh, pennyroyal, or high-dose herbs without medical supervision. Each remedy includes clear pregnancy/nursing safety information. When in doubt, consult a certified herbalist or midwife experienced in botanical medicine during pregnancy."
                  }
                ]}
              />
          </motion.div>
        </div>
      </section>


    </div>
  );
}
