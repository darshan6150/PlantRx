import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { RemedyImage } from "@/lib/remedyImageGenerator"; 
import { trackEvent, trackRemedyView } from "@/utils/analytics";
import { useTranslation } from "@/contexts/TranslationContext";
import { useContentAuthGate } from "@/hooks/useContentAuthGate";
import { useIsMobile } from "@/hooks/use-mobile";

type Remedy = {
  id: number;
  name: string;
  description?: string;
  slug: string;
  averageRating?: number;
  reviewCount?: number;
  confidence?: number;
  isGenerated?: boolean;
  ingredients?: string[];
  benefits?: string[];
  instructions?: string;
  form?: string;
};

interface RemedyCardProps {
  remedy: Remedy;
  onSave?: () => void;
  isSaved?: boolean;
}

export default function RemedyCard({ remedy, onSave, isSaved }: RemedyCardProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { trackRemedyClick } = useContentAuthGate();
  const isMobile = useIsMobile();
  
  const handleRemedyClick = () => {
    // Use auth gate to track clicks - will redirect to signup after 3 clicks if not authenticated
    trackRemedyClick(() => {
      // Track remedy card click and remedy view
      trackEvent('remedy_click', 'remedies', remedy.name);
      trackRemedyView(remedy.name, remedy.id.toString());
      
      // Use client-side navigation (fast, no reload)
      setLocation(`/remedy/${remedy.slug}`);
    });
  };
  
  // Get translated remedy content
  const getTranslatedContent = () => {
    // Try to get translated benefits from database first
    const translatedBenefitsStr = t(`remedy.${remedy.id}.benefits`, '');
    let translatedBenefits: string[] = [];
    
    if (translatedBenefitsStr) {
      try {
        translatedBenefits = JSON.parse(translatedBenefitsStr);
      } catch {
        // Fallback to original benefits with individual translation attempts
        translatedBenefits = remedy.benefits?.map(benefit => {
          const benefitKey = benefit.toLowerCase().replace(/[^a-z0-9]/g, '_');
          return t(`benefit.${benefitKey}`, benefit);
        }) || [];
      }
    } else {
      // Fallback to original benefits with individual translation attempts
      translatedBenefits = remedy.benefits?.map(benefit => {
        const benefitKey = benefit.toLowerCase().replace(/[^a-z0-9]/g, '_');
        return t(`benefit.${benefitKey}`, benefit);
      }) || [];
    }

    return {
      name: t(`remedy.${remedy.id}.name`, remedy.name),
      description: t(`remedy.${remedy.id}.description`, remedy.description || 'Natural remedy for healing and wellness'),
      benefits: translatedBenefits
    };
  };

  const translatedContent = getTranslatedContent();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  const getDifficultyLevel = () => {
    const ingredients = remedy.ingredients?.length || 0;
    const instructionLength = remedy.instructions?.length || 0;
    
    if (ingredients <= 3 && instructionLength <= 100) return { level: "easy", color: "bg-green-500", icon: "🟢" };
    if (ingredients <= 6 && instructionLength <= 300) return { level: "medium", color: "bg-yellow-500", icon: "🟡" };
    return { level: "advanced", color: "bg-red-500", icon: "🔴" };
  };

  const getPreparationTime = () => {
    const form = remedy.form?.toLowerCase();
    const instructions = remedy.instructions?.toLowerCase() || "";
    
    if (form === "raw" || instructions.includes("immediately") || instructions.includes("instant")) 
      return { time: "instant", icon: "⚡" };
    if (form === "tea" || instructions.includes("5 min") || instructions.includes("steep")) 
      return { time: "5min", icon: "🚀" };
    if (form === "drink" || instructions.includes("mix") || instructions.includes("blend")) 
      return { time: "10min", icon: "⏰" };
    return { time: "30min", icon: "🕐" };
  };

  const difficulty = getDifficultyLevel();
  const prepTime = getPreparationTime();

  // Prefetch remedy data on hover for instant loading
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ["/api/remedies", remedy.slug],
      staleTime: 10 * 60 * 1000,
    });
  };

  // MOBILE LAYOUT - Interactive card with hover effect matching desktop
  if (isMobile) {
    return (
      <div 
        onClick={handleRemedyClick}
        onMouseEnter={handleMouseEnter}
        className="block w-full h-[220px] cursor-pointer group active:scale-[0.98] transition-transform"
        data-testid={`mobile-remedy-card-${remedy.id}`}
      >
        <div className="relative w-full h-full overflow-hidden rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
          {/* Front Panel - Image and Title */}
          <div className="absolute inset-0 transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
            {/* Image Section */}
            <div className="relative h-[140px] overflow-hidden">
              <RemedyImage 
                remedy={remedy}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              
              {/* Difficulty indicator - top left */}
              <div className="absolute top-1.5 left-1.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium">
                  {difficulty.icon}
                </span>
              </div>
              
              {/* Rating - bottom right on image */}
              {remedy.averageRating && remedy.averageRating > 0 && (
                <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/60 text-white">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-[10px] font-medium">{remedy.averageRating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            {/* Title Section */}
            <div className="p-2 h-[80px] flex flex-col justify-center bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                {translatedContent.name}
              </h3>
              {translatedContent.benefits && translatedContent.benefits.length > 0 && (
                <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                  {translatedContent.benefits[0]}
                </p>
              )}
            </div>
          </div>
          
          {/* Back Panel - Details (revealed on hover) */}
          <div className="absolute inset-0 p-2 translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0 bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
            {/* Header - Compact */}
            <div className="mb-1 pb-1 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-yellow-600 dark:text-yellow-400 line-clamp-1 flex-1">
                {translatedContent.name}
              </h3>
              {remedy.averageRating && remedy.averageRating > 0 && (
                <div className="flex items-center gap-0.5 ml-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">
                    {remedy.averageRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Description - Compact */}
            <p className="text-gray-600 dark:text-gray-400 text-[9px] mb-1.5 leading-snug line-clamp-2">
              {translatedContent.description}
            </p>
            
            {/* Key Benefits - Compact */}
            {translatedContent.benefits && translatedContent.benefits.length > 0 && (
              <div className="flex-1 overflow-hidden">
                <ul className="space-y-0.5">
                  {translatedContent.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1 h-1 bg-yellow-500 rounded-full mr-1 flex-shrink-0"></span>
                      <span className="text-[9px] text-gray-700 dark:text-gray-300 line-clamp-1">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Tap prompt */}
            <p className="text-[8px] text-yellow-600 dark:text-yellow-400 font-medium mt-auto pt-1 text-center">
              Tap to view details →
            </p>
          </div>
        </div>
      </div>
    );
  }

  // DESKTOP LAYOUT - Full interactive card with hover effects
  return (
    <div 
      onClick={handleRemedyClick}
      onMouseEnter={handleMouseEnter}
      className="block w-full max-w-[165px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[360px] h-[220px] sm:h-[340px] md:h-[400px] lg:h-[440px] mx-auto group cursor-pointer"
    >
      <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out cursor-pointer bg-white dark:bg-gray-800 transform group-hover:scale-[1.02] hover:z-10 border border-gray-200 dark:border-gray-700 hover-lift">
        {/* Front Panel - Image and Title */}
        <div className="absolute inset-0 transition-transform duration-800 ease-in-out group-hover:-translate-y-full">
          {/* Image with Advanced Animations */}
          <div className="relative h-3/5 overflow-hidden">
            {/* Static Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-blue-400/20 to-purple-400/20 opacity-30"></div>
            
            {/* Main Image with Enhanced Animations */}
            <RemedyImage 
              remedy={remedy}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 filter group-hover:brightness-110 relative z-10"
            />
            
            {/* Animated Overlay Effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Static Overlay - No Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 rounded-lg"></div>
            {onSave && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSave && onSave()}
                className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 z-10"
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-current text-red-500" : "text-gray-600 dark:text-gray-400"}`} />
              </Button>
            )}
            {/* Difficulty and Time Indicators */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {remedy.confidence && (
                <Badge className="bg-sage text-white text-xs px-2 py-1">
                  {remedy.confidence}%
                </Badge>
              )}
              <div className="flex gap-1">
                <Badge className="bg-black/70 text-white text-xs px-2 py-1 flex items-center gap-1">
                  <span>{difficulty.icon}</span>
                  <span className="capitalize">{t(`difficulty.${difficulty.level}`, difficulty.level)}</span>
                </Badge>
                <Badge className="bg-black/70 text-white text-xs px-2 py-1 flex items-center gap-1">
                  <span>{prepTime.icon}</span>
                  <span>{prepTime.time === "instant" ? t('time.instant', 'Instant') : prepTime.time === "5min" ? "5min" : prepTime.time === "10min" ? "10min" : "30min+"}</span>
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Enhanced Title Section with Animation */}
          <div className="h-2/5 p-2 sm:p-3 lg:p-4 flex flex-col items-center justify-center bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 dark:from-green-800 dark:via-blue-800 dark:to-purple-800 animate-pulse"></div>
              <div className="absolute top-2 left-2 w-3 h-3 bg-green-300/30 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
              <div className="absolute bottom-2 right-2 w-2 h-2 bg-blue-300/30 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 right-3 w-1.5 h-1.5 bg-yellow-300/30 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
            </div>
            
            {/* Moving Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 group-hover:animate-pulse"></div>
            
            <h3 className="text-[11px] sm:text-sm lg:text-lg font-bold luxury-heading text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 text-center line-clamp-2 sm:line-clamp-3 leading-tight transition-all duration-500 relative z-10 group-hover:scale-105 group-hover:drop-shadow-lg">
              {translatedContent.name}
            </h3>
          </div>
        </div>

        {/* Back Panel - Details */}
        <div className="absolute inset-0 p-2 sm:p-3 lg:p-4 translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0 bg-white dark:bg-gray-800 flex flex-col">
          {/* Header with remedy name and click indicator */}
          <div className="mb-1 sm:mb-2 pb-1 sm:pb-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-[10px] sm:text-xs lg:text-sm font-bold luxury-heading text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2">
              {translatedContent.name}
            </h3>
            
            {/* Star Rating Display - Also on back panel for visibility */}
            {remedy.averageRating && remedy.averageRating > 0 && (
              <div className="flex items-center gap-1 mt-1.5" data-testid={`rating-back-${remedy.id}`}>
                <div className="flex gap-0.5">
                  {renderStars(remedy.averageRating)}
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  {remedy.averageRating.toFixed(1)}
                </span>
                {remedy.reviewCount && remedy.reviewCount > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({remedy.reviewCount} {t('ui.reviews', 'reviews')})
                  </span>
                )}
              </div>
            )}
            
            <p className="text-[9px] sm:text-[10px] text-yellow-600 dark:text-yellow-400 font-medium mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {t('ui.click_details', 'Click to view details →')}
            </p>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-hidden">
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-[9px] sm:text-xs lg:text-sm mb-2 sm:mb-3 luxury-body leading-relaxed line-clamp-3 sm:line-clamp-5 lg:line-clamp-6">
              {translatedContent.description}
            </p>
            
            {/* Key Benefits */}
            {translatedContent.benefits && translatedContent.benefits.length > 0 && (
              <div className="mb-2 sm:mb-3">
                <h4 className="text-[10px] sm:text-xs lg:text-sm font-semibold luxury-subheading text-gray-800 dark:text-gray-200 mb-1 sm:mb-1.5">{t('ui.key_benefits', 'Key Benefits')}</h4>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 sm:space-y-1.5">
                  {translatedContent.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mr-1.5 sm:mr-2 mt-1 flex-shrink-0"></span>
                      <span className="text-[9px] sm:text-xs lg:text-sm leading-tight text-gray-700 dark:text-gray-300 line-clamp-2">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Premium Ingredients - Shown on larger screens */}
            {remedy.ingredients && Array.isArray(remedy.ingredients) && (
              <div className="mb-2 hidden sm:block">
                <h4 className="text-xs lg:text-sm font-semibold luxury-subheading text-gray-800 dark:text-gray-200 mb-1.5">{t('ui.ingredients', 'Ingredients')}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(remedy.ingredients as string[]).slice(0, 4).map((ingredient, index) => (
                    <span key={index} className="text-[10px] sm:text-xs px-2 py-1 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700/50 text-yellow-800 dark:text-yellow-200 rounded-full">
                      {String(ingredient).replace(' Extract', '').replace(' Oil', '')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom gradient to indicate more content */}
          <div className="h-4 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}