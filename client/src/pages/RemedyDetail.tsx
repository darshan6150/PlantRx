import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnhancedPageTracking } from '../hooks/useAnalytics';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Star, Heart, CheckCircle, AlertTriangle, Leaf, ShoppingCart, Package, ExternalLink, Clock, Users, Beaker, BookOpen, Microscope, ArrowLeft, Shield, Pill, Baby, FileText, Award, FlaskConical, Share2, Sparkles, Target, Lightbulb } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { RemedyImage } from "@/lib/remedyImageGenerator";
import { SEOHead } from "@/components/SEOHead";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { InternalLinkingWidget } from "@/components/InternalLinkingWidget";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { trackRemedyView } from "@/utils/analytics";
import { requireAuthForAction } from "@/lib/authGate";

const STORE_PRODUCTS = [
  "Raw Manuka Honey", "Whole Psyllium Husks", "Tea Tree Oil", "Maca Root Powder",
  "Gotu Kola Extract Drops", "Bacopa Monnieri", "Green Tea Extract Liquid Drops",
  "Astragalus Liquid Extract", "Elderberry Extract", "Colloidal Oatmeal",
  "Peppermint Oil", "Castor Oil", "Organic Rosemary Oil", "Raw Aloe Repair Gel",
  "Turmeric Root Powder", "Cat's Claw Herbal Tincture", "St. John's Wort Drops",
  "Saw Palmetto Berry Drops", "Rhodiola Rosea Drops", "Schisandra Berry Extract",
  "Ashwagandha Root Powder", "Fenugreek Powder", "Tribulus Extract",
  "Shatavari Root Powder", "Ginkgo Biloba", "Milk Thistle Extract", "Spirulina",
  "Echinacea Boost", "Holy Basil", "GlowRoot", "Reishi Root Elixir", "Passionflower Extract"
];

const isIngredientInStore = (ingredient: string): boolean => {
  const ingredientLower = ingredient.toLowerCase();
  return STORE_PRODUCTS.some(product => {
    const productLower = product.toLowerCase();
    return ingredientLower.includes(productLower) || productLower.includes(ingredientLower);
  });
};

export default function RemedyDetail() {
  const params = useParams();
  const remedySlug = params.slug;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  
  // Enhanced analytics tracking for remedy pages
  useEnhancedPageTracking('remedy', remedySlug);
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Save state
  const [isSaved, setIsSaved] = useState(false);
  const [pendingSaveRemedyId, setPendingSaveRemedyId] = useState<number | null>(null);

  // Check authentication state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('plantrx-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Check for pending save intent after sign-in
    const pendingSave = sessionStorage.getItem('plantrx-pending-save-remedy');
    if (pendingSave && savedUser) {
      const remedyId = parseInt(pendingSave);
      if (!isNaN(remedyId)) {
        setPendingSaveRemedyId(remedyId);
        sessionStorage.removeItem('plantrx-pending-save-remedy');
      }
    }
  }, []);

  const handleBackClick = () => {
    // Check if user came from a specific page (referrer or state)
    if (document.referrer && document.referrer.includes('/remedies')) {
      window.history.back();
    } else {
      // Default to remedies page
      setLocation('/remedies');
    }
  };

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string; remedyId: number }) => {
      return apiRequest(`/api/remedies/${reviewData.remedyId}/reviews`, 'POST', reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/remedies/${remedy?.id}/reviews`] });
      queryClient.invalidateQueries({ queryKey: ["/api/remedies", remedySlug] }); // Also refresh remedy to update star count
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback. Your review has been posted successfully.",
      });
      setIsReviewDialogOpen(false);
      setReviewRating(0);
      setReviewComment("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle review submission
  const handleSubmitReview = () => {
    if (!reviewRating) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting your review.",
        variant: "destructive",
      });
      return;
    }

    if (!reviewComment.trim()) {
      toast({
        title: "Comment Required", 
        description: "Please write a comment about your experience with this remedy.",
        variant: "destructive",
      });
      return;
    }

    submitReviewMutation.mutate({
      rating: reviewRating,
      comment: reviewComment.trim(),
      remedyId: remedy.id,
    });
  };

  // Handle opening review dialog with authentication check
  const handleOpenReviewDialog = requireAuthForAction(() => {
    setIsReviewDialogOpen(true);
  });

  // Star rating component
  const StarRating = ({ 
    rating, 
    onRatingChange, 
    onHoverChange, 
    hoverRating, 
    size = "w-8 h-8", 
    interactive = false 
  }: {
    rating: number;
    onRatingChange?: (rating: number) => void;
    onHoverChange?: (rating: number) => void;
    hoverRating?: number;
    size?: string;
    interactive?: boolean;
  }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${size} ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all`}
            onClick={() => interactive && onRatingChange?.(star)}
            onMouseEnter={() => interactive && onHoverChange?.(star)}
            onMouseLeave={() => interactive && onHoverChange?.(0)}
            disabled={!interactive}
          >
            <Star
              className={`${size} ${
                star <= (hoverRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Common household ingredients that most people have
  const commonIngredients = [
    'honey', 'lemon', 'ginger', 'garlic', 'salt', 'water', 'olive oil', 'apple cider vinegar',
    'baking soda', 'coconut oil', 'tea', 'sugar', 'onion', 'mint', 'cinnamon', 'black pepper'
  ];

  const handleAddToCart = (ingredient: string) => {
    toast({
      title: "Added to Cart!",
      description: `${ingredient} has been added to your shopping cart.`,
      duration: 3000,
    });
  };

  const isCommonIngredient = (ingredient: string, productLinks: any[]) => {
    // If ingredient is available in store, it's NOT a common ingredient - it's specialty
    const hasProductLink = productLinks.some((link: any) => link.ingredient === ingredient);
    if (hasProductLink) {
      return false;
    }
    
    // Only truly basic household items are common
    return commonIngredients.some(common => 
      ingredient.toLowerCase().includes(common.toLowerCase())
    );
  };

  const { data: remedy, isLoading } = useQuery({
    queryKey: ["/api/remedies", remedySlug],
    enabled: !!remedySlug,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    gcTime: 30 * 60 * 1000, // 30 minutes in memory
  }) as { data: any; isLoading: boolean };

  const { data: reviews = [] } = useQuery({
    queryKey: [`/api/remedies/${remedy?.id}/reviews`],
    enabled: !!remedy?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes cache for reviews
    gcTime: 15 * 60 * 1000, // 15 minutes in memory
  }) as { data: any[]; };

  // Fetch product links for ingredients - with optimized caching
  const { data: productLinks = [] } = useQuery({
    queryKey: ["/api/remedies", remedy?.id, "product-links"],
    enabled: !!remedy?.id,
    staleTime: 15 * 60 * 1000, // 15 minutes cache for product links
    gcTime: 60 * 60 * 1000, // 1 hour in memory
  }) as { data: any[]; };

  // Fetch unlinked ingredients - with optimized caching
  const { data: unlinkedIngredients = [] } = useQuery({
    queryKey: ["/api/remedies", remedy?.id, "unlinked-ingredients"], 
    enabled: !!remedy?.id,
    staleTime: 15 * 60 * 1000, // 15 minutes cache
    gcTime: 60 * 60 * 1000, // 1 hour in memory
  }) as { data: string[]; };

  // Check if remedy is saved - with optimized caching
  const { data: savedRemedies = [] } = useQuery({
    queryKey: ["/api/saved-remedies"],
    staleTime: 2 * 60 * 1000, // 2 minutes cache for saved remedies
    gcTime: 10 * 60 * 1000, // 10 minutes in memory
  }) as { data: any[]; };

  // Save/unsave remedy mutation
  const saveRemedyMutation = useMutation({
    mutationFn: async (remedyId: number) => {
      return apiRequest('/api/saved-remedies', 'POST', { remedyId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-remedies"] });
      setIsSaved(true);
      toast({
        title: "Remedy Saved!",
        description: "This remedy has been added to your saved collection.",
      });
    },
    onError: (error) => {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save remedy. Please try again.",
        variant: "destructive",
      });
    },
  });

  const unsaveRemedyMutation = useMutation({
    mutationFn: async (remedyId: number) => {
      return apiRequest(`/api/saved-remedies/${remedyId}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-remedies"] });
      setIsSaved(false);
      toast({
        title: "Remedy Removed",
        description: "This remedy has been removed from your saved collection.",
      });
    },
    onError: (error) => {
      console.error("Unsave error:", error);
      toast({
        title: "Error",
        description: "Failed to remove remedy. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Check if current remedy is saved
  const isRemedySaved = remedy?.id && savedRemedies.some((saved: any) => saved.id === remedy.id);

  // Execute pending save after sign-in
  useEffect(() => {
    if (pendingSaveRemedyId && user && remedy?.id === pendingSaveRemedyId && !isRemedySaved) {
      saveRemedyMutation.mutate(pendingSaveRemedyId);
      setPendingSaveRemedyId(null);
    }
  }, [pendingSaveRemedyId, user, remedy?.id, isRemedySaved]);

  // Handle save/unsave with authentication gate and intent storage
  const handleSaveToggle = () => {
    if (!remedy?.id) return;
    
    // If user is logged in, perform the action directly
    if (user) {
      if (isRemedySaved) {
        unsaveRemedyMutation.mutate(remedy.id);
      } else {
        saveRemedyMutation.mutate(remedy.id);
      }
      return;
    }
    
    // Store the save intent for after sign-in
    sessionStorage.setItem('plantrx-pending-save-remedy', remedy.id.toString());
    
    // Redirect to sign-up page
    window.location.href = '/signup';
  };

  // Track remedy view when remedy is loaded
  useEffect(() => {
    if (remedy && remedy.name && remedy.id) {
      trackRemedyView(remedy.name, remedy.id.toString());
    }
  }, [remedy]);

  // Generate comprehensive SEO data for the remedy with advanced schema markup
  const generateSEOData = (remedy: any) => {
    if (!remedy) return null;

    // Create comprehensive schema markup following Phase 1 requirements
    const schema = {
      "@context": "https://schema.org",
      "@type": "HealthTopicContent",
      "name": remedy.name,
      "description": remedy.description || `Learn about ${remedy.name}, a natural remedy with expert-verified benefits and usage instructions.`,
      "url": `https://plantrxapp.com/remedy/${remedy.slug}`,
      "image": `https://plantrxapp.com/api/remedy-image/${remedy.slug}`,
      "author": {
        "@type": "Organization",
        "name": "PlantRx",
        "url": "https://plantrxapp.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "PlantRx",
        "url": "https://plantrxapp.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://plantrxapp.com/favicon.png"
        }
      },
      "mainEntity": {
        "@type": "MedicalCondition",
        "name": remedy.category || "Natural Health Condition",
        "description": remedy.condition || `Health condition treated by ${remedy.name}`
      },
      "about": {
        "@type": "MedicalTherapy",
        "name": remedy.name,
        "description": remedy.description,
        "preparation": remedy.instructions
      },
      "isPartOf": {
        "@type": "WebSite",
        "name": "PlantRx",
        "url": "https://plantrxapp.com"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://plantrxapp.com"
          },
          {
            "@type": "ListItem", 
            "position": 2,
            "name": "Natural Remedies",
            "item": "https://plantrxapp.com/remedies"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": remedy.name,
            "item": `https://plantrxapp.com/remedy/${remedy.slug}`
          }
        ]
      }
    };

    // Add FAQ schema if remedy has FAQs
    if (remedy.faqs && remedy.faqs.length > 0) {
      (schema as any)["mainEntity"] = {
        "@type": "FAQPage",
        "mainEntity": remedy.faqs.map((faq: any, index: number) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };
    }

    return schema;
  };

  // SEO optimized title and meta description following Phase 2 requirements
  const seoTitle = (remedy && remedy.name) ? `${remedy.name} – Natural Remedy Benefits & Usage | PlantRx` : 'Natural Remedy Details | PlantRx';
  const seoDescription = (remedy && remedy.name) ? 
    `Discover ${remedy.name} natural remedy. ${remedy.benefits?.[0] || 'Expert-verified benefits'}, usage instructions, and scientific backing. ${remedy.instructions ? 'Learn proper preparation methods.' : ''}`.substring(0, 160) :
    'Explore expert-verified natural remedies with detailed benefits, usage instructions, and scientific backing.';

  const seoKeywords = (remedy && remedy.name) ? 
    `${remedy.name}, natural remedy, ${remedy.category || 'herbal medicine'}, ${remedy.benefits?.slice(0, 3).join(', ') || 'natural healing'}, plant medicine` :
    'natural remedies, herbal medicine, plant medicine';

  if (isLoading) {
    return (
      <div className="min-h-screen luxury-gradient-bg">
        <SEOHead 
          title="Loading Remedy – PlantRx"
          description="Loading natural remedy information from PlantRx, your trusted platform for expert-backed plant-based health solutions."
        />
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              onClick={handleBackClick}
              variant="outline"
              className="luxury-button-secondary inline-flex items-center space-x-2 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Remedies</span>
            </Button>
          </div>
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!remedy || !remedy.name) {
    return (
      <div className="min-h-screen luxury-gradient-bg">
        <SEOHead 
          title="Remedy Not Found – PlantRx"
          description="The natural remedy you're looking for was not found. Explore PlantRx's comprehensive collection of expert-backed plant-based health solutions."
          noindex={true}
        />
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              onClick={handleBackClick}
              variant="outline"
              className="luxury-button-secondary inline-flex items-center space-x-2 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Remedies</span>
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Remedy Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300">The remedy you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen luxury-gradient-bg">
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={`https://plantrxapp.com/remedy/${remedy.slug}`}
        ogImage={`https://plantrxapp.com/api/remedy-image/${remedy.slug}`}
        ogType="article"
        schema={generateSEOData(remedy) || undefined}
      />
      <Header />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12">
        {/* Breadcrumb Navigation for SEO */}
        <div className="mb-3 sm:mb-8">
          <BreadcrumbNavigation 
            items={[
              { label: "Natural Remedies", href: "/remedies" },
              { label: remedy.name }
            ]}
            className="mb-2 sm:mb-4 text-[10px] sm:text-sm"
          />
          <Button
            onClick={handleBackClick}
            variant="outline"
            size="sm"
            className="luxury-button-secondary inline-flex items-center space-x-1 sm:space-x-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-xs sm:text-sm h-7 sm:h-10 px-2 sm:px-4"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back to Remedies</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        <div className="w-full">
          {/* Main Content */}
          <div className="space-y-4 sm:space-y-8">
            {/* Header - Enhanced Hero Section */}
            <div className="group bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-500 animate-fade-in-up">
              {/* Image Container with Overlay Effects */}
              <div className="relative w-full h-44 sm:h-80 lg:h-96 bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-blue-900/30 overflow-hidden">
                <RemedyImage 
                  remedy={remedy}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Category Badge - Floating */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 animate-fade-in-down" style={{ animationDelay: '200ms' }}>
                  <Badge className="bg-white/95 dark:bg-gray-800/95 text-green-700 dark:text-green-400 border-0 shadow-lg backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wide">
                    <Leaf className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                    {remedy.category?.replace('-', ' ')}
                  </Badge>
                </div>

                {/* Form Badge - Floating */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 animate-fade-in-down" style={{ animationDelay: '300ms' }}>
                  <Badge className="bg-emerald-600/95 dark:bg-emerald-700/95 text-white border-0 shadow-lg backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold capitalize">
                    {remedy.form}
                  </Badge>
                </div>

                {/* Verified Badge */}
                {remedy.isExpertVerified && (
                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <Badge className="bg-blue-600/95 dark:bg-blue-700/95 text-white border-0 shadow-lg backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span className="hidden sm:inline">Expert Verified</span>
                      <span className="sm:hidden">Verified</span>
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4 sm:p-10 lg:p-12">
                {/* Title & Actions Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-6 mb-4 sm:mb-8">
                  <div className="flex-1 min-w-0 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                    <h1 className="text-lg sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 leading-tight tracking-tight">
                      {remedy.name}
                    </h1>
                    
                    {/* Rating Section - Enhanced */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 rounded-full px-2 py-1 sm:px-4 sm:py-2 border border-yellow-200 dark:border-yellow-800/50">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 sm:w-5 sm:h-5 transition-all duration-300 ${
                                i < Math.floor(remedy.averageRating || 0)
                                  ? "text-yellow-500 fill-yellow-500 drop-shadow-sm"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                              style={{ animationDelay: `${i * 50}ms` }}
                            />
                          ))}
                        </div>
                        <span className="ml-1.5 sm:ml-2.5 text-xs sm:text-base font-bold text-yellow-700 dark:text-yellow-400">
                          {(remedy.averageRating || 0).toFixed(1)}
                        </span>
                      </div>
                      <button 
                        onClick={() => document.querySelector('[data-value="reviews"]')?.dispatchEvent(new Event('click', { bubbles: true }))}
                        className="text-xs sm:text-base text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 underline-offset-2 hover:underline"
                      >
                        ({remedy.reviewCount || 0} reviews)
                      </button>
                    </div>
                  </div>

                  {/* Save Button - Enhanced */}
                  <div className="flex items-center gap-2 self-start animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSaveToggle}
                      disabled={saveRemedyMutation.isPending || unsaveRemedyMutation.isPending}
                      className={`group/save h-8 sm:h-11 px-2 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 active:scale-95 ${
                        isRemedySaved 
                          ? 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40' 
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-600 hover:text-green-600 dark:hover:text-green-400'
                      }`}
                      data-testid="save-remedy-button"
                    >
                      <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                        isRemedySaved 
                          ? 'fill-red-500 text-red-500 scale-110' 
                          : 'group-hover/save:scale-110 group-hover/save:text-green-500'
                      }`} />
                      <span className="ml-1 sm:ml-2 text-xs sm:text-base font-medium">
                        {isRemedySaved ? 'Saved' : 'Save'}
                      </span>
                    </Button>

                    {/* Share Button */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: remedy.name,
                            text: remedy.description,
                            url: window.location.href
                          });
                        }
                      }}
                      className="h-8 sm:h-11 px-2 sm:px-4 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 active:scale-95"
                      data-testid="share-remedy-button"
                    >
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Description - Consistent readable size */}
                <div className="animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-lg leading-relaxed">
                    {remedy.description}
                  </p>
                </div>

                {/* Quick Info Pills - Enhanced with more details */}
                <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-10 pt-4 sm:pt-10 border-t border-gray-100 dark:border-gray-800 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  <div className="flex flex-col items-center gap-1 sm:gap-3 p-2 sm:p-6 bg-green-50 dark:bg-green-900/20 rounded-xl sm:rounded-2xl text-center border border-green-200 dark:border-green-800">
                    <Clock className="w-5 h-5 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
                    <span className="text-[10px] sm:text-lg font-semibold text-green-700 dark:text-green-400">5-10m</span>
                    <span className="text-[9px] sm:text-base text-gray-600 dark:text-gray-400 hidden sm:block">Prep Time</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 sm:gap-3 p-2 sm:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl sm:rounded-2xl text-center border border-blue-200 dark:border-blue-800">
                    <Package className="w-5 h-5 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] sm:text-lg font-semibold text-blue-700 dark:text-blue-400">{(remedy.ingredients as string[])?.length || 0}</span>
                    <span className="text-[9px] sm:text-base text-gray-600 dark:text-gray-400 hidden sm:block">Ingredients</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 sm:gap-3 p-2 sm:p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl sm:rounded-2xl text-center border border-purple-200 dark:border-purple-800">
                    <Microscope className="w-5 h-5 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
                    <span className="text-[10px] sm:text-lg font-semibold text-purple-700 dark:text-purple-400 capitalize truncate w-full">{remedy.evidenceLevel?.replace('-', ' ') || 'Trad.'}</span>
                    <span className="text-[9px] sm:text-base text-gray-600 dark:text-gray-400 hidden sm:block">Evidence</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 sm:gap-3 p-2 sm:p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl sm:rounded-2xl text-center border border-amber-200 dark:border-amber-800">
                    <Leaf className="w-5 h-5 sm:w-8 sm:h-8 text-amber-600 dark:text-amber-400" />
                    <span className="text-[10px] sm:text-lg font-semibold text-amber-700 dark:text-amber-400 capitalize">{remedy.form}</span>
                    <span className="text-[9px] sm:text-base text-gray-600 dark:text-gray-400 hidden sm:block">Form</span>
                  </div>
                </div>

                {/* Why This Remedy Works - NEW SECTION */}
                <div className="mt-4 sm:mt-10 p-3 sm:p-8 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl sm:rounded-2xl border border-emerald-200 dark:border-emerald-800 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
                  <h3 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-500" />
                    Why This Remedy Works
                  </h3>
                  <p className="text-xs sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-6">
                    {remedy.category === 'sleep' && 'This time-tested remedy combines natural compounds that work together to calm your nervous system and prepare your body for restful sleep. The ingredients naturally boost melatonin production and reduce cortisol levels.'}
                    {remedy.category === 'digestive' && 'This remedy supports your digestive system by promoting healthy gut bacteria, soothing inflammation, and enhancing nutrient absorption. The natural compounds work synergistically to restore digestive balance.'}
                    {remedy.category === 'anti-inflammatory' && 'The active compounds in this remedy target inflammation at its source, helping to reduce swelling, ease discomfort, and support your body\'s natural healing processes without harsh chemicals.'}
                    {remedy.category === 'immune-support' && 'This remedy strengthens your immune defenses by providing essential nutrients and antioxidants that support white blood cell function and help your body fight off infections naturally.'}
                    {remedy.category === 'skin-care' && 'The natural compounds in this remedy work to nourish, protect, and heal your skin from within. They promote collagen production, fight free radicals, and support cellular regeneration.'}
                    {remedy.category === 'pain-relief' && 'This remedy provides natural pain relief by blocking pain signals and reducing inflammation at the source. The active compounds work quickly to bring comfort without synthetic chemicals.'}
                    {!['sleep', 'digestive', 'anti-inflammatory', 'immune-support', 'skin-care', 'pain-relief'].includes(remedy.category) && 'This natural remedy harnesses the power of traditional ingredients backed by modern research. The carefully selected components work together to support your body\'s natural healing abilities.'}
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <span className="inline-flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 bg-white dark:bg-gray-800 rounded-full text-[10px] sm:text-base text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700">
                      <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5" /> Natural
                    </span>
                    <span className="inline-flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 bg-white dark:bg-gray-800 rounded-full text-[10px] sm:text-base text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700">
                      <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5" /> Safe
                    </span>
                    <span className="inline-flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 bg-white dark:bg-gray-800 rounded-full text-[10px] sm:text-base text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700">
                      <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5" /> Easy
                    </span>
                  </div>
                </div>

                {/* Best Used For - NEW SECTION */}
                <div className="mt-3 sm:mt-8 p-3 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-800 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                  <h3 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <Target className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500" />
                    Best Used For
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    {(remedy.benefits as string[])?.slice(0, 4).map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-blue-100 dark:border-blue-800">
                        <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs sm:text-lg font-bold text-blue-600 dark:text-blue-400">{idx + 1}</span>
                        </div>
                        <span className="text-[11px] sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed pt-0.5 sm:pt-2">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Tips - NEW SECTION - Hidden on mobile for brevity */}
                <div className="hidden sm:block mt-8 p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 animate-fade-in-up" style={{ animationDelay: '450ms' }}>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-amber-500" />
                    Pro Tips for Best Results
                  </h3>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-4">
                      <span className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">1</span>
                      </span>
                      <span className="text-base text-gray-700 dark:text-gray-300 leading-relaxed pt-1">Use fresh, high-quality ingredients for maximum effectiveness</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">2</span>
                      </span>
                      <span className="text-base text-gray-700 dark:text-gray-300 leading-relaxed pt-1">Consistency is key - use this remedy regularly for best results</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">3</span>
                      </span>
                      <span className="text-base text-gray-700 dark:text-gray-300 leading-relaxed pt-1">Store any leftovers properly to maintain potency</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tabs - Premium Animated Section */}
            <ScrollReveal variant="fadeUp" delay={0.1}>
              <Tabs defaultValue="overview" className="space-y-8">
                {/* Animated Tab Header */}
                <div className="relative">
                  {/* Decorative glow behind tabs */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 via-green-100/30 to-teal-100/50 dark:from-emerald-900/20 dark:via-green-900/10 dark:to-teal-900/20 rounded-xl blur-lg -z-10"></div>
                  
                  {/* Mobile: 5-column grid that fits | Desktop: Same grid layout */}
                  <TabsList className="
                    grid grid-cols-5
                    w-full
                    bg-gradient-to-r from-gray-100/90 via-white/80 to-gray-100/90 dark:from-gray-800/90 dark:via-gray-700/80 dark:to-gray-800/90 backdrop-blur-sm
                    p-2 rounded-xl
                    h-auto min-h-[3.25rem] sm:min-h-[3.5rem]
                    gap-1 sm:gap-1.5
                    border border-gray-200/50 dark:border-gray-700/50
                    shadow-lg shadow-gray-200/30 dark:shadow-gray-900/30
                  ">
                <TabsTrigger 
                  value="overview" 
                  className="
                    px-2 sm:px-3 py-2.5 sm:py-3
                    rounded-lg
                    text-xs sm:text-base font-semibold
                    text-gray-600 dark:text-gray-400
                    data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
                    data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400
                    data-[state=active]:shadow-md
                    transition-all duration-200
                    active:scale-[0.97] sm:active:scale-100
                  "
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="ingredients" 
                  className="
                    px-2 sm:px-3 py-2.5 sm:py-3
                    rounded-lg
                    text-xs sm:text-base font-semibold
                    text-gray-600 dark:text-gray-400
                    data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
                    data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400
                    data-[state=active]:shadow-md
                    transition-all duration-200
                    active:scale-[0.97] sm:active:scale-100
                  "
                >
                  <span className="hidden sm:inline">Ingredients</span>
                  <span className="sm:hidden">Ingred.</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="usage" 
                  className="
                    px-2 sm:px-3 py-2.5 sm:py-3
                    rounded-lg
                    text-xs sm:text-base font-semibold
                    text-gray-600 dark:text-gray-400
                    data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
                    data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400
                    data-[state=active]:shadow-md
                    transition-all duration-200
                    active:scale-[0.97] sm:active:scale-100
                  "
                >
                  <span className="hidden sm:inline">How to Use</span>
                  <span className="sm:hidden">Usage</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="science" 
                  className="
                    px-2 sm:px-3 py-2.5 sm:py-3
                    rounded-lg
                    text-xs sm:text-base font-semibold
                    text-gray-600 dark:text-gray-400
                    data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
                    data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400
                    data-[state=active]:shadow-md
                    transition-all duration-200
                    active:scale-[0.97] sm:active:scale-100
                    flex items-center justify-center gap-1
                  "
                >
                  <FlaskConical className="w-3.5 h-3.5 hidden sm:inline" />
                  Science
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="
                    px-2 sm:px-3 py-2.5 sm:py-3
                    rounded-lg
                    text-xs sm:text-base font-semibold
                    text-gray-600 dark:text-gray-400
                    data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
                    data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400
                    data-[state=active]:shadow-md
                    transition-all duration-200
                    active:scale-[0.97] sm:active:scale-100
                    flex items-center justify-center gap-1 sm:gap-2
                  "
                >
                  Reviews
                  {reviews.length > 0 && (
                    <span className="inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-xs font-bold bg-green-600 text-white rounded-full min-w-[16px] sm:min-w-[20px]">
                      {reviews.length}
                    </span>
                  )}
                </TabsTrigger>
                  </TabsList>
                </div>

              {/* Overview Tab Content with Scroll Animations */}
              <TabsContent value="overview" className="mt-8">
                <StaggerContainer staggerDelay={0.08} className="space-y-8">
                  {/* Scientific Background */}
                  <StaggerItem>
                    <motion.div
                      whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                      className="group/card relative"
                    >
                      {/* Hover glow effect */}
                      <motion.div 
                        className="absolute -inset-2 rounded-2xl blur-xl -z-10"
                        initial={{ opacity: 0 }}
                        whileHover={{ 
                          opacity: 1,
                          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)"
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <Card className="overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 group-hover/card:shadow-xl transition-shadow duration-300">
                        <CardHeader className="relative">
                          {/* Decorative gradient line */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
                          <CardTitle className="flex items-center text-gray-900 dark:text-white pt-2">
                            <div className="relative mr-3">
                              <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-md"></div>
                              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Microscope className="w-5 h-5 text-white" />
                              </div>
                            </div>
                            Scientific Background
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-13">
                            Research-backed natural medicine with proven therapeutic properties
                          </p>
                        </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center">
                          <Beaker className="w-4 h-4 mr-2" />
                          Active Compounds
                        </h4>
                        <p className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed">
                          {remedy.category === 'anti-inflammatory' && 'Contains natural anti-inflammatory compounds like curcumin, gingerol, and salicin that work by inhibiting inflammatory pathways and reducing cytokine production.'}
                          {remedy.category === 'digestive' && 'Rich in digestive enzymes, fiber, and probiotics that support healthy gut microbiome and improve nutrient absorption while reducing digestive discomfort.'}
                          {remedy.category === 'skin-care' && 'Contains antimicrobial peptides, antioxidants, and healing compounds that promote cellular regeneration and protect against environmental damage.'}
                          {remedy.category === 'sleep' && 'Contains natural sedative compounds like valerenic acid and apigenin that interact with GABA receptors to promote relaxation and improve sleep quality.'}
                          {remedy.category === 'pain-relief' && 'Natural analgesic compounds that work by blocking pain receptors and reducing inflammation at the source of discomfort.'}
                          {remedy.category === 'immune-support' && 'Immunomodulating compounds that enhance white blood cell activity and strengthen the body\'s natural defense mechanisms.'}
                          {remedy.category === 'brain-health' && 'Contains neuroprotective compounds like ginsenosides, flavonoids, and antioxidants that enhance cognitive function, memory formation, and protect against age-related cognitive decline.'}
                          {remedy.category === 'throat-health' && 'Rich in antimicrobial compounds, mucilage, and anti-inflammatory agents that coat and soothe irritated throat tissues while fighting infection.'}
                          {remedy.category === 'kidney-health' && 'Contains diuretic compounds and antioxidants that support healthy kidney function, promote toxin elimination, and may help prevent kidney stone formation.'}
                          {remedy.category === 'liver-health' && 'Features hepatoprotective compounds like silymarin and curcumin that protect liver cells from oxidative damage and support natural detoxification processes.'}
                          {!['anti-inflammatory', 'digestive', 'skin-care', 'sleep', 'pain-relief', 'immune-support', 'brain-health', 'throat-health', 'kidney-health', 'liver-health'].includes(remedy.category) && 
                           'This natural remedy contains bioactive compounds that have been used in traditional medicine for centuries and are now supported by modern research.'}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2 flex items-center">
                          <BookOpen className="w-4 h-4 mr-2" />
                          How It Works
                        </h4>
                        <p className="text-green-800 dark:text-green-300 text-sm leading-relaxed">
                          {remedy.category === 'anti-inflammatory' && 'Reduces inflammation by modulating immune response and blocking inflammatory mediators, providing natural relief without synthetic side effects.'}
                          {remedy.category === 'digestive' && 'Supports digestive health by enhancing enzyme production, promoting beneficial bacteria growth, and strengthening the intestinal barrier.'}
                          {remedy.category === 'skin-care' && 'Promotes skin healing through antimicrobial action, collagen synthesis stimulation, and antioxidant protection against free radical damage.'}
                          {remedy.category === 'sleep' && 'Naturally regulates sleep-wake cycles by calming the nervous system and promoting the production of sleep-inducing neurotransmitters.'}
                          {remedy.category === 'pain-relief' && 'Provides natural pain relief by blocking pain signals and reducing inflammation at the cellular level.'}
                          {remedy.category === 'immune-support' && 'Strengthens immune function by supporting lymphocyte activity and enhancing the body\'s ability to fight infections.'}
                          {!['anti-inflammatory', 'digestive', 'skin-care', 'sleep', 'pain-relief', 'immune-support'].includes(remedy.category) && 
                           'Works synergistically with the body\'s natural healing processes to restore balance and promote optimal health.'}
                        </p>
                      </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>

                  {/* Benefits & Effects */}
                  <StaggerItem>
                    <motion.div
                      whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                      className="group/card relative"
                    >
                      <motion.div 
                        className="absolute -inset-2 rounded-2xl blur-xl -z-10"
                        initial={{ opacity: 0 }}
                        whileHover={{ 
                          opacity: 1,
                          background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%)"
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <Card className="overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 group-hover/card:shadow-xl transition-shadow duration-300">
                        <CardHeader className="relative">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600"></div>
                          <CardTitle className="flex items-center text-gray-900 dark:text-white pt-2">
                            <div className="relative mr-3">
                              <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-md"></div>
                              <div className="relative w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Leaf className="w-5 h-5 text-white" />
                              </div>
                            </div>
                            Benefits
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-13">
                            Proven health benefits backed by traditional use and research
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 gap-3 lg:gap-4">
                            {(remedy.benefits as string[]).map((benefit, index) => (
                              <motion.div 
                                key={index} 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                                className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                              >
                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">{benefit}</span>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>

                  {/* Limitations & Considerations */}
                  {remedy.cons && (remedy.cons as string[]).length > 0 && (
                    <StaggerItem>
                      <motion.div
                        whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                        className="group/card relative"
                      >
                        <motion.div 
                          className="absolute -inset-2 rounded-2xl blur-xl -z-10"
                          initial={{ opacity: 0 }}
                          whileHover={{ 
                            opacity: 1,
                            background: "linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.1) 100%)"
                          }}
                          transition={{ duration: 0.3 }}
                        />
                        <Card className="overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 group-hover/card:shadow-xl transition-shadow duration-300">
                          <CardHeader className="relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500"></div>
                            <CardTitle className="flex items-center text-gray-900 dark:text-white pt-2">
                              <div className="relative mr-3">
                                <div className="absolute inset-0 bg-orange-400/20 rounded-lg blur-md"></div>
                                <div className="relative w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                                  <AlertTriangle className="w-5 h-5 text-white" />
                                </div>
                              </div>
                              Things to Consider
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-13">
                              Important limitations and practical considerations for this remedy
                            </p>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 gap-3 lg:gap-4">
                              {(remedy.cons as string[]).map((con, index) => (
                                <motion.div 
                                  key={index} 
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                                  className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                                >
                                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">{con}</span>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </StaggerItem>
                  )}
                </StaggerContainer>
              </TabsContent>

              <TabsContent value="ingredients">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="group/card relative"
                >
                  <motion.div 
                    className="absolute -inset-2 rounded-2xl blur-xl -z-10"
                    initial={{ opacity: 0 }}
                    whileHover={{ 
                      opacity: 1,
                      background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)"
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <Card className="overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
                    <CardHeader className="relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
                      <CardTitle className="flex items-center text-gray-900 dark:text-white pt-2">
                        <div className="relative mr-3">
                          <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-md"></div>
                          <div className="relative w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        Natural Ingredients & Sourcing
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-13">
                        All ingredients with clear sourcing information and availability
                      </p>
                    </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(remedy.ingredients as string[]).map((ingredient, index) => {
                        const productLink = productLinks.find((link: any) => link.ingredient === ingredient);
                        const isLinked = !!productLink;
                        const isCommon = isCommonIngredient(ingredient, productLinks);
                        
                        return (
                          <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-sm transition-shadow space-y-3 sm:space-y-0">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">{ingredient}</h4>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:space-x-2">
                              {!isCommon && isLinked && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(productLink.buyLink, '_blank')}
                                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 text-xs sm:text-sm"
                                  >
                                    <ShoppingCart className="w-4 h-4 mr-1" />
                                    Buy {productLink.price}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open('/store', '_blank')}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm"
                                  >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    View in Store
                                  </Button>
                                </>
                              )}
                              {!isCommon && !isLinked && isIngredientInStore(ingredient) && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddToCart(ingredient)}
                                    className="hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 text-xs sm:text-sm"
                                  >
                                    <ShoppingCart className="w-4 h-4 mr-1" />
                                    Add to Cart
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open('/store', '_blank')}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm"
                                  >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    Find in Store
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-1">Need Help Finding Ingredients?</h4>
                          <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                            Specialty ingredients can be sourced from our verified partner stores or online suppliers.
                          </p>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Browse Our Store
                          </Button>
                        </div>
                      </div>
                    </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="usage">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="group/card relative"
                >
                  <motion.div 
                    className="absolute -inset-2 rounded-2xl blur-xl -z-10"
                    initial={{ opacity: 0 }}
                    whileHover={{ 
                      opacity: 1,
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)"
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <Card className="overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
                    <CardHeader className="relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
                      <CardTitle className="flex items-center text-gray-900 dark:text-white pt-2">
                        <div className="relative mr-3">
                          <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-md"></div>
                          <div className="relative w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        Complete Usage Instructions
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-13">
                        Step-by-step preparation and usage guide
                      </p>
                    </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Step-by-Step Preparation */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span className="w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                        Step-by-Step Preparation
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
                          <h4 className="font-semibold text-green-900 dark:text-green-200 mb-3 flex items-center">
                            <Beaker className="w-4 h-4 mr-2" />
                            Detailed Instructions
                          </h4>
                          <div className="text-green-800 dark:text-green-300 text-sm leading-relaxed">
                            {remedy.instructions ? (
                              <p className="whitespace-pre-line">{remedy.instructions}</p>
                            ) : (
                              <p>Complete preparation instructions will be provided with your remedy.</p>
                            )}
                          </div>
                        </div>

                        {/* Equipment Needed */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            Equipment Needed
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {['Clean mixing bowl', 'Measuring spoons', 'Strainer (if needed)', 'Clean storage container'].map((item, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 text-xs font-medium">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Preparation Time */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                          <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2 flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Time Requirements
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                            <div>
                              <span className="text-purple-700 dark:text-purple-300">Prep Time: </span>
                              <span className="font-medium text-purple-900 dark:text-purple-200">5-10 minutes</span>
                            </div>
                            <div>
                              <span className="text-purple-700 dark:text-purple-300">Ready to Use: </span>
                              <span className="font-medium text-purple-900 dark:text-purple-200">Immediately</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Usage Guidelines */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                        How to Use
                      </h3>
                      <div className="grid gap-3 sm:gap-4">
                        <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-200">Frequency</h4>
                            <p className="text-blue-700 dark:text-blue-300 text-sm">Use 2-3 times daily, or as needed for symptoms</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <Users className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-900 dark:text-green-200">Duration</h4>
                            <p className="text-green-700 dark:text-green-300 text-sm">Continue use for 7-14 days or until symptoms improve</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <Heart className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-purple-900 dark:text-purple-200">Best Results</h4>
                            <p className="text-purple-700 dark:text-purple-300 text-sm">Take consistently at the same times each day for optimal effectiveness</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Storage Instructions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                        Storage & Shelf Life
                      </h3>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 sm:p-4">
                        <p className="text-purple-700 dark:text-purple-300 text-sm">
                          Store prepared remedy in refrigerator for up to 3-5 days. Always use clean utensils and containers to maintain freshness and prevent contamination.
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Important Safety Information</h4>
                          <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                            Consult with a healthcare provider before starting any new remedy, especially if you're pregnant, nursing, or have existing health conditions. Discontinue use if any adverse reactions occur.
                          </p>
                        </div>
                      </div>
                    </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Science & Safety Tab */}
              <TabsContent value="science">
                <StaggerContainer staggerDelay={0.08} className="space-y-6">
                  {/* Evidence Level Badge */}
                  <StaggerItem>
                    <motion.div
                      whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                      className="group/card relative"
                    >
                      <motion.div 
                        className="absolute -inset-2 rounded-2xl blur-xl -z-10"
                        initial={{ opacity: 0 }}
                        whileHover={{ 
                          opacity: 1,
                          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)"
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <Card className="overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 group-hover/card:shadow-xl transition-shadow duration-300 border-2 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <CardTitle className="flex items-center text-gray-900 dark:text-white">
                          <Award className="w-5 h-5 mr-2 text-blue-600" />
                          Evidence Level
                        </CardTitle>
                        <Badge 
                          className={`text-sm px-3 py-1 ${
                            remedy.evidenceLevel === 'well-established' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700' 
                              : remedy.evidenceLevel === 'clinical'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                              : remedy.evidenceLevel === 'preliminary'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-300 dark:border-gray-700'
                          }`}
                        >
                          {remedy.evidenceLevel === 'well-established' && '✓ Well-Established'}
                          {remedy.evidenceLevel === 'clinical' && '◉ Clinical Studies'}
                          {remedy.evidenceLevel === 'preliminary' && '○ Preliminary Research'}
                          {(!remedy.evidenceLevel || remedy.evidenceLevel === 'traditional') && '◇ Traditional Use'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {remedy.evidenceLevel === 'well-established' && 'This remedy has extensive clinical research support with multiple high-quality studies demonstrating safety and efficacy.'}
                        {remedy.evidenceLevel === 'clinical' && 'This remedy has been studied in clinical trials with positive results, though more research may strengthen conclusions.'}
                        {remedy.evidenceLevel === 'preliminary' && 'Early research shows promise, but more clinical studies are needed to fully establish effectiveness.'}
                        {(!remedy.evidenceLevel || remedy.evidenceLevel === 'traditional') && 'This remedy is based on traditional use spanning generations. While historically valued, modern clinical research is limited.'}
                      </p>
                      {remedy.isExpertVerified && (
                        <div className="mt-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">Expert Verified</span>
                        </div>
                      )}
                      </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>

                  {/* Scientific Sources */}
                  {remedy.scientificSources && (remedy.scientificSources as any[]).length > 0 && (
                    <StaggerItem>
                      <motion.div
                        whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                        className="group/card relative"
                      >
                        <motion.div 
                          className="absolute -inset-2 rounded-2xl blur-xl -z-10"
                          initial={{ opacity: 0 }}
                          whileHover={{ 
                            opacity: 1,
                            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)"
                          }}
                          transition={{ duration: 0.3 }}
                        />
                        <Card className="overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 group-hover/card:shadow-xl transition-shadow duration-300">
                          <CardHeader className="relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-purple-500 to-violet-600"></div>
                            <CardTitle className="flex items-center text-gray-900 dark:text-white pt-2">
                              <div className="relative mr-3">
                                <div className="absolute inset-0 bg-purple-400/20 rounded-lg blur-md"></div>
                                <div className="relative w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-600 rounded-lg flex items-center justify-center shadow-lg">
                                  <FileText className="w-5 h-5 text-white" />
                                </div>
                              </div>
                              Scientific References
                            </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Peer-reviewed research supporting this remedy
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {(remedy.scientificSources as any[]).map((source: any, index: number) => (
                            <div key={index} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                              <h4 className="font-medium text-purple-900 dark:text-purple-200 text-sm mb-1">
                                {source.title}
                              </h4>
                              <p className="text-purple-700 dark:text-purple-300 text-xs mb-2">
                                {source.authors} • {source.journal} ({source.year})
                              </p>
                              {source.finding && (
                                <p className="text-purple-600 dark:text-purple-400 text-sm italic">
                                  "{source.finding}"
                                </p>
                              )}
                              <div className="flex gap-3 mt-2">
                                {source.pmid && (
                                  <a 
                                    href={`https://pubmed.ncbi.nlm.nih.gov/${source.pmid}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    PubMed: {source.pmid}
                                  </a>
                                )}
                                {source.doi && (
                                  <a 
                                    href={`https://doi.org/${source.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    DOI
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        </CardContent>
                        </Card>
                      </motion.div>
                    </StaggerItem>
                  )}

                  {/* Safety Information */}
                  <StaggerItem>
                    <motion.div
                      whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                      className="group/card relative"
                    >
                      <motion.div 
                        className="absolute -inset-2 rounded-2xl blur-xl -z-10"
                        initial={{ opacity: 0 }}
                        whileHover={{ 
                          opacity: 1,
                          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)"
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      <Card className="overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 group-hover/card:shadow-xl transition-shadow duration-300 border-2 border-red-200 dark:border-red-800">
                        <CardHeader className="relative">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-red-500 to-rose-500"></div>
                          <CardTitle className="flex items-center text-gray-900 dark:text-white pt-2">
                            <div className="relative mr-3">
                              <div className="absolute inset-0 bg-red-400/20 rounded-lg blur-md"></div>
                              <div className="relative w-10 h-10 bg-gradient-to-br from-red-400 to-rose-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Shield className="w-5 h-5 text-white" />
                              </div>
                            </div>
                            Safety Information
                          </CardTitle>
                        </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Contraindications */}
                      {remedy.contraindications && (remedy.contraindications as string[]).length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                          <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Who Should NOT Use This Remedy
                          </h4>
                          <ul className="space-y-1">
                            {(remedy.contraindications as string[]).map((contra: string, index: number) => (
                              <li key={index} className="text-red-700 dark:text-red-300 text-sm flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                {contra}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Drug Interactions */}
                      {remedy.drugInteractions && (remedy.drugInteractions as string[]).length > 0 && (
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                          <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-2 flex items-center">
                            <Pill className="w-4 h-4 mr-2" />
                            Drug Interactions
                          </h4>
                          <ul className="space-y-1">
                            {(remedy.drugInteractions as string[]).map((interaction: string, index: number) => (
                              <li key={index} className="text-orange-700 dark:text-orange-300 text-sm flex items-start gap-2">
                                <span className="text-orange-500 mt-1">•</span>
                                {interaction}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Pregnancy Warning */}
                      {remedy.pregnancyWarning && (
                        <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4 border border-pink-200 dark:border-pink-800">
                          <h4 className="font-semibold text-pink-900 dark:text-pink-200 mb-2 flex items-center">
                            <Baby className="w-4 h-4 mr-2" />
                            Pregnancy & Nursing
                          </h4>
                          <p className="text-pink-700 dark:text-pink-300 text-sm">
                            {remedy.pregnancyWarning}
                          </p>
                        </div>
                      )}

                      {/* Maximum Dosage */}
                      {remedy.maxDosage && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center">
                            <Beaker className="w-4 h-4 mr-2" />
                            Maximum Safe Dosage
                          </h4>
                          <p className="text-blue-700 dark:text-blue-300 text-sm">
                            {remedy.maxDosage}
                          </p>
                        </div>
                      )}

                      {/* Default safety note if no specific data */}
                      {(!remedy.contraindications || (remedy.contraindications as string[]).length === 0) &&
                       (!remedy.drugInteractions || (remedy.drugInteractions as string[]).length === 0) &&
                       !remedy.pregnancyWarning && !remedy.maxDosage && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                            While this remedy is generally considered safe for most adults, always consult with a healthcare provider before starting any new treatment, especially if you are pregnant, nursing, taking medications, or have underlying health conditions.
                          </p>
                        </div>
                      )}
                      </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>

                  {/* Medical Disclaimer */}
                  <StaggerItem>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                      <Card className="bg-gradient-to-r from-gray-50 via-gray-100/50 to-gray-50 dark:from-gray-800/50 dark:via-gray-700/30 dark:to-gray-800/50 border-0 shadow-md">
                        <CardContent className="py-4">
                          <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                            <strong>Medical Disclaimer:</strong> The information provided is for educational purposes only and is not intended as medical advice. PlantRx does not diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before using any natural remedy. Individual results may vary. If you experience any adverse reactions, discontinue use immediately and seek medical attention.
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </StaggerItem>
                </StaggerContainer>
              </TabsContent>

              <TabsContent value="reviews">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="group/card relative"
                >
                  <motion.div 
                    className="absolute -inset-2 rounded-2xl blur-xl -z-10"
                    initial={{ opacity: 0 }}
                    whileHover={{ 
                      opacity: 1,
                      background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%)"
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <Card className="overflow-hidden border-0 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50">
                    <CardHeader className="relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
                      <CardTitle className="text-gray-900 dark:text-white pt-2 flex items-center">
                        <div className="relative mr-3">
                          <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-md"></div>
                          <div className="relative w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        Customer Reviews
                      </CardTitle>
                    </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <Button 
                        onClick={handleOpenReviewDialog}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        data-testid="button-write-review"
                      >
                        Write a Review
                      </Button>
                      
                      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl">
                          <DialogHeader className="border-b border-gray-100 dark:border-gray-700 pb-4">
                            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Write a Review</DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-300">
                              Share your experience with this remedy to help others make informed decisions.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6 pt-4">
                            {/* Star Rating */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                                Your Rating
                              </label>
                              <div className="flex items-center gap-4">
                                <StarRating
                                  rating={reviewRating}
                                  hoverRating={hoverRating}
                                  onRatingChange={setReviewRating}
                                  onHoverChange={setHoverRating}
                                  interactive={true}
                                  size="w-8 h-8"
                                />
                                {reviewRating > 0 && (
                                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                    {reviewRating === 1 && "Poor"}
                                    {reviewRating === 2 && "Fair"}
                                    {reviewRating === 3 && "Good"}
                                    {reviewRating === 4 && "Very Good"}
                                    {reviewRating === 5 && "Excellent"}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Comment */}
                            <div>
                              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Your Review
                              </label>
                              <Textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Share your experience with this remedy. How effective was it? Any tips for others?"
                                className="min-h-[120px] resize-none border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                maxLength={500}
                              />
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                                <span>Be specific about effectiveness, side effects, and usage tips</span>
                                <span className="font-medium">{reviewComment.length}/500</span>
                              </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                              <Button
                                onClick={handleSubmitReview}
                                disabled={submitReviewMutation.isPending || !reviewRating || !reviewComment.trim()}
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {submitReviewMutation.isPending ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Submitting...
                                  </>
                                ) : (
                                  "Submit Review"
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setIsReviewDialogOpen(false)}
                                disabled={submitReviewMutation.isPending}
                                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    {reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this remedy!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review: any) => (
                          <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <StarRating 
                                  rating={review.rating} 
                                  size="w-4 h-4" 
                                  interactive={false}
                                />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {review.username || 'Anonymous User'}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              </Tabs>
            </ScrollReveal>
          </div>

        </div>
      </div>

    </div>
  );
}
