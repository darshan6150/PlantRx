import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Clock, ChevronLeft, ChevronRight, BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContentAuthGate } from "@/hooks/useContentAuthGate";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  readingTime?: number;
  viewsCount?: number;
  likesCount?: number;
}

interface ArticleCarouselProps {
  articles: Article[];
  variant: "clicked" | "liked";
  title: string;
  subtitle: string;
  isLoading?: boolean;
}

export function ArticleCarousel({
  articles,
  variant,
  title,
  subtitle,
  isLoading = false,
}: ArticleCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [, setLocation] = useLocation();
  const { trackArticleClick } = useContentAuthGate();
  const isMobile = useMediaQuery('(max-width: 639px)');
  
  const displayedArticles = articles.slice(0, 10);
  const mobileArticles = articles.slice(0, 5);
  const cardWidth = 340;
  const gap = 24;

  const handleArticleClick = useCallback((slug: string) => {
    trackArticleClick(() => {
      setLocation(`/blog/${slug}`);
    });
  }, [trackArticleClick, setLocation]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    const activeIndex = Math.round(scrollLeft / (cardWidth + gap));
    setSelectedIndex(Math.min(activeIndex, displayedArticles.length - 1));
    
    setCanScrollPrev(scrollLeft > 10);
    setCanScrollNext(scrollLeft < maxScroll - 10);
  }, [displayedArticles.length]);

  const scrollPrev = useCallback(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
  }, []);

  const scrollNext = useCallback(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
  }, []);

  const scrollTo = useCallback((index: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Mobile scroll tracking for indicator dots
  const handleMobileScroll = useCallback(() => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidthWithGap = 280 + 12; // card width + gap
    const activeIndex = Math.round(scrollLeft / cardWidthWithGap);
    setMobileActiveIndex(Math.min(activeIndex, mobileArticles.length - 1));
  }, [mobileArticles.length]);

  useEffect(() => {
    const container = mobileScrollRef.current;
    if (!container || !isMobile) return;
    
    container.addEventListener('scroll', handleMobileScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleMobileScroll);
  }, [handleMobileScroll, isMobile]);

  const themeColors = useMemo(() => {
    if (variant === "clicked") {
      return {
        iconBg: "from-blue-500 to-indigo-600",
        badge: "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
        hoverText: "group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400",
        arrowHover: "hover:bg-blue-500 hover:text-white hover:border-blue-500",
        dotActive: "bg-blue-500",
        countIcon: Eye,
        gradientBg: "from-blue-400 to-indigo-500",
      };
    }
    return {
      iconBg: "from-rose-500 to-pink-600",
      badge: "text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800",
      hoverText: "group-hover/card:text-rose-600 dark:group-hover/card:text-rose-400",
      arrowHover: "hover:bg-rose-500 hover:text-white hover:border-rose-500",
      dotActive: "bg-rose-500",
      countIcon: Heart,
      gradientBg: "from-rose-400 to-pink-500",
    };
  }, [variant]);

  const CountIcon = themeColors.countIcon;

  const generateCount = useCallback(
    (article: Article, index: number) => {
      // Use actual counts if available, otherwise generate descending values
      // so that first articles (most viewed) show highest numbers
      if (variant === "clicked") {
        if (article.viewsCount) return article.viewsCount;
        // Generate descending view counts: first article ~8K-12K, decreasing by position
        const baseViews = 12000 - (index * 800);
        const variation = ((article.slug || '').length % 500) - 250;
        return Math.max(1500, baseViews + variation);
      }
      if (article.likesCount) return article.likesCount;
      // Generate descending like counts: first article ~700-900, decreasing by position
      const baseLikes = 900 - (index * 60);
      const variation = ((article.slug || '').length % 100) - 50;
      return Math.max(100, baseLikes + variation);
    },
    [variant]
  );

  if (isLoading) {
    // Mobile loading skeleton - horizontal scroll style
    if (isMobile) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-5 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="overflow-hidden -mx-4 px-4">
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
                  <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-1.5 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={cn(
                "rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse",
                i === 0 ? "w-4 h-1.5" : "w-1.5 h-1.5"
              )} />
            ))}
          </div>
        </div>
      );
    }
    
    // Desktop loading skeleton
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-7 w-52 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80">
              <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-700 rounded-t-2xl animate-pulse" />
              <div className="p-5 space-y-3 bg-gray-100 dark:bg-gray-800 rounded-b-2xl">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No articles available</p>
      </div>
    );
  }

  // MOBILE LAYOUT - Full-width vertical cards
  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Mobile Header - Clean and compact */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-md",
              themeColors.iconBg
            )}
          >
            <CountIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              {title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Mobile Cards - Horizontal scroll with smooth animations */}
        <div 
          ref={mobileScrollRef}
          className="overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory -mx-4 px-4 pb-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-3 py-1">
            {mobileArticles.map((article, index) => {
              const count = generateCount(article, index);
              const excerpt = article.excerpt?.split(" ").slice(0, 12).join(" ") + "..." || "";
              
              return (
                <div
                  key={article.id || index}
                  onClick={() => handleArticleClick(article.slug)}
                  className={cn(
                    "flex-shrink-0 w-[280px] snap-start cursor-pointer",
                    "transform transition-all duration-300 ease-out",
                    "hover:scale-[1.02] active:scale-[0.98]"
                  )}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                  data-testid={`article-card-mobile-${variant}-${article.id}`}
                >
                  <div className={cn(
                    "relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden h-[280px] flex flex-col",
                    "transition-all duration-300 ease-out",
                    variant === "clicked" 
                      ? "hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800/50"
                      : "hover:shadow-rose-200/50 dark:hover:shadow-rose-900/30 hover:border-rose-200 dark:hover:border-rose-800/50"
                  )}>
                    {/* Image with overlay */}
                    <div className={cn(
                      "relative h-[140px] flex-shrink-0 overflow-hidden bg-gradient-to-br",
                      themeColors.gradientBg
                    )}>
                      {article.featuredImage ? (
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-white/30" />
                        </div>
                      )}
                      
                      {/* Count badge */}
                      <div className={cn(
                        "absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"
                      )}>
                        <CountIcon className={cn(
                          "w-3 h-3",
                          variant === "liked" && "fill-rose-400 text-rose-400"
                        )} />
                        {count.toLocaleString()}
                      </div>
                      
                      {/* Category tag */}
                      {article.category && (
                        <div className="absolute bottom-2 left-2">
                          <span className={cn(
                            "text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full",
                            themeColors.badge
                          )}>
                            {article.tags?.[0] || article.category}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-3 flex flex-col flex-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug mb-1.5">
                        {article.title}
                      </h4>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
                        {excerpt}
                      </p>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{article.readingTime || 5} min</span>
                        </div>
                        <span className={cn(
                          "text-[10px] font-semibold flex items-center gap-0.5",
                          variant === "clicked" ? "text-blue-500" : "text-rose-500"
                        )}>
                          Read
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Scroll indicator dots - updates as you swipe */}
        <div className="flex justify-center gap-1.5 pt-3">
          {mobileArticles.map((_, index) => (
            <div
              key={index}
              className={cn(
                "rounded-full transition-all duration-300 ease-out",
                index === mobileActiveIndex 
                  ? cn("w-4 h-1.5", themeColors.dotActive)
                  : "w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  // DESKTOP LAYOUT - Horizontal carousel (unchanged)
  return (
    <div className="space-y-8">
      {/* Desktop Header with nav */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-lg",
              themeColors.iconBg
            )}
          >
            <CountIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
              {title}
            </h3>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={cn(
              "w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 disabled:opacity-40",
              themeColors.arrowHover
            )}
            data-testid={`carousel-prev-${variant}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={cn(
              "w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 disabled:opacity-40",
              themeColors.arrowHover
            )}
            data-testid={`carousel-next-${variant}`}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Desktop Carousel scroll container */}
      <div 
        ref={scrollRef}
        className="overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent scroll-smooth snap-x snap-mandatory overscroll-x-contain -mx-3 px-3"
      >
        <div className="flex gap-6 pt-3 pb-4">
          {displayedArticles.map((article, index) => {
            const preview =
              article.excerpt?.split(" ").slice(0, 18).join(" ") + "..." ||
              "Discover expert insights and wellness tips...";
            const count = generateCount(article, index);

            return (
              <div
                key={article.id || index}
                className="flex-shrink-0 w-[320px] lg:w-[340px] select-none snap-start cursor-pointer group/wrapper"
                onClick={() => handleArticleClick(article.slug)}
              >
                {/* Hover glow effect */}
                <div className="relative">
                  <div className={cn(
                    "absolute -inset-1 rounded-3xl opacity-0 group-hover/wrapper:opacity-100 blur-xl transition-all duration-700 ease-out",
                    variant === "clicked" 
                      ? "bg-gradient-to-br from-blue-400/30 via-cyan-400/20 to-blue-500/30" 
                      : "bg-gradient-to-br from-rose-400/30 via-pink-400/20 to-rose-500/30"
                  )} />
                  
                  <Card
                    className={cn(
                      "group/card relative h-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl lg:rounded-3xl transition-all duration-500 ease-out",
                      "border border-gray-100 dark:border-gray-800",
                      "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)]",
                      "group-hover/wrapper:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] dark:group-hover/wrapper:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]",
                      "group-hover/wrapper:-translate-y-2 group-hover/wrapper:scale-[1.02]",
                      variant === "clicked" 
                        ? "group-hover/wrapper:border-blue-200 dark:group-hover/wrapper:border-blue-800/50" 
                        : "group-hover/wrapper:border-rose-200 dark:group-hover/wrapper:border-rose-800/50"
                    )}
                    data-testid={`article-card-${variant}-${article.id}`}
                  >
                    {/* Image area */}
                    <div
                      className={cn(
                        "relative aspect-[16/10] overflow-hidden bg-gradient-to-br",
                        themeColors.gradientBg
                      )}
                    >
                      {article.featuredImage ? (
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover/wrapper:scale-110 group-hover/wrapper:brightness-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-14 h-14 text-white/25" />
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 group-hover/wrapper:opacity-100 transition-all duration-500 ease-out" />
                      
                      {/* View count badge */}
                      <div className={cn(
                        "absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md",
                        variant === "liked" && "group-hover/wrapper:bg-rose-900/80"
                      )}>
                        <CountIcon
                          className={cn(
                            "w-3.5 h-3.5",
                            variant === "liked" && "fill-rose-400 text-rose-400"
                          )}
                        />
                        {count.toLocaleString()}
                      </div>

                      {/* Category badge */}
                      {article.category && (
                        <div className="absolute bottom-3 left-3">
                          <Badge
                            className={cn(
                              "text-xs font-bold uppercase tracking-wider",
                              themeColors.badge
                            )}
                          >
                            {article.tags?.[0] || article.category}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Card content */}
                    <CardContent className="p-5 lg:p-6 flex flex-col space-y-3">
                      <h4
                        className={cn(
                          "text-lg lg:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug",
                          themeColors.hoverText
                        )}
                      >
                        {article.title}
                      </h4>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
                        {preview}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{article.readingTime || 5} min read</span>
                        </div>
                        <span
                          className={cn(
                            "text-xs font-semibold opacity-0 group-hover/wrapper:opacity-100 transition-opacity",
                            variant === "clicked"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-rose-600 dark:text-rose-400"
                          )}
                        >
                          Read More →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination dots (desktop only) */}
      {displayedArticles.length > 1 && displayedArticles.length <= 8 && (
        <div className="flex justify-center gap-2 pt-4">
          {displayedArticles.slice(0, -2).map((_: Article, index: number) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-200 hover:scale-125",
                index === selectedIndex
                  ? cn("scale-125", themeColors.dotActive)
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              )}
              aria-label={`Go to slide ${index + 1}`}
              data-testid={`carousel-dot-${variant}-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ArticleCarousel;
