import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEOHead } from "@/components/SEOHead";
import { BackButton } from "@/components/BackButton";
import { ScrollReveal } from "@/components/ScrollReveal";
import { 
  Search, 
  Leaf, 
  Heart, 
  Brain, 
  Dumbbell, 
  Apple, 
  Sparkles, 
  ArrowRight,
  Clock,
  User,
  BookOpen,
  TrendingUp,
  FlaskConical
} from "lucide-react";
import { format } from "date-fns";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  authorName: string;
  publishedAt: string;
  readingTime?: number;
  featuredImage?: string;
  tags?: string[];
};

const categories = [
  {
    id: "nutrition",
    name: "Nutrition",
    description: "Science-backed dietary guidance for optimal health and disease prevention",
    icon: Apple,
    color: "from-green-500 to-emerald-600",
    bgLight: "bg-green-50",
    bgDark: "dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-400",
    href: "/articles/nutrition"
  },
  {
    id: "herbs-remedies",
    name: "Herbs & Remedies",
    description: "Traditional herbal medicine meets modern clinical research",
    icon: Leaf,
    color: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    textColor: "text-emerald-700 dark:text-emerald-400",
    href: "/articles/herbs-remedies"
  },
  {
    id: "wellness",
    name: "Wellness",
    description: "Holistic approaches to mind-body balance and self-care practices",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    bgLight: "bg-rose-50",
    bgDark: "dark:bg-rose-900/20",
    borderColor: "border-rose-200 dark:border-rose-800",
    textColor: "text-rose-700 dark:text-rose-400",
    href: "/articles/wellness"
  },
  {
    id: "fitness",
    name: "Fitness & Body",
    description: "Natural training methods, recovery techniques, and athletic performance",
    icon: Dumbbell,
    color: "from-orange-500 to-amber-600",
    bgLight: "bg-orange-50",
    bgDark: "dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    textColor: "text-orange-700 dark:text-orange-400",
    href: "/articles/fitness"
  },
  {
    id: "healthy-foods",
    name: "Healthy Foods",
    description: "Superfoods, meal planning, and nutritional powerhouses for vitality",
    icon: Apple,
    color: "from-lime-500 to-green-600",
    bgLight: "bg-lime-50",
    bgDark: "dark:bg-lime-900/20",
    borderColor: "border-lime-200 dark:border-lime-800",
    textColor: "text-lime-700 dark:text-lime-400",
    href: "/articles/healthy-foods"
  },
  {
    id: "mental-health",
    name: "Mental Health",
    description: "Natural approaches to stress, anxiety, focus, and emotional wellness",
    icon: Brain,
    color: "from-purple-500 to-violet-600",
    bgLight: "bg-purple-50",
    bgDark: "dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-400",
    href: "/articles/mental-health"
  },
  {
    id: "skin-beauty",
    name: "Skin & Beauty",
    description: "Natural skincare routines and plant-based beauty solutions",
    icon: Sparkles,
    color: "from-pink-500 to-rose-600",
    bgLight: "bg-pink-50",
    bgDark: "dark:bg-pink-900/20",
    borderColor: "border-pink-200 dark:border-pink-800",
    textColor: "text-pink-700 dark:text-pink-400",
    href: "/articles/skin-beauty"
  },
  {
    id: "science",
    name: "Science",
    description: "Latest research and clinical studies in natural medicine",
    icon: FlaskConical,
    color: "from-cyan-500 to-blue-600",
    bgLight: "bg-cyan-50",
    bgDark: "dark:bg-cyan-900/20",
    borderColor: "border-cyan-200 dark:border-cyan-800",
    textColor: "text-cyan-700 dark:text-cyan-400",
    href: "/articles/science"
  }
];

export default function Articles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const { data: allArticles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/blog/posts"],
    staleTime: 0, // Always refetch to ensure fresh data
    refetchOnMount: 'always', // Force refetch when component mounts
  });

  const filteredArticles = useMemo(() => {
    let articles = allArticles;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt?.toLowerCase().includes(query) ||
        article.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        article.category?.toLowerCase().includes(query)
      );
    }
    
    if (activeCategory) {
      articles = articles.filter(article => 
        article.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    // Sort alphabetically by title
    return [...articles].sort((a, b) => 
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
  }, [allArticles, searchQuery, activeCategory]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEOHead 
        title="Health Articles - Expert Wellness Guides & Natural Remedies | PlantRx"
        description="Explore expert-curated health articles covering nutrition, herbal remedies, wellness, fitness, mental health, and natural skincare. Science-backed guides updated weekly."
        keywords="health articles, natural remedies, nutrition guides, wellness tips, herbal medicine, mental health, skincare, PlantRx"
        canonical="https://plantrxapp.com/articles"
        ogType="website"
      />

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <BackButton />
          </div>
        </div>
      </div>

      {/* Hero Section - Clean & Minimal */}
      <section className="relative py-6 sm:py-10 lg:py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 sm:mb-5 lg:mb-6 shadow-lg shadow-emerald-500/25">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            
            {/* Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-6 leading-tight tracking-tight">
              Health & Wellness Articles
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 lg:mb-10 leading-relaxed max-w-2xl mx-auto">
              Expert-curated guides on natural health, backed by science and traditional wisdom. Discover evidence-based approaches to wellness.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-4 sm:mb-6 lg:mb-8">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles, topics, or remedies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 h-11 sm:h-12 lg:h-14 text-sm sm:text-base rounded-lg sm:rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
                  data-testid="articles-search-input"
                />
                {searchQuery && (
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="min-h-[44px] absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </form>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-gray-500 dark:text-gray-500">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                Updated Weekly
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                {allArticles.length}+ Articles
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                Expert Authors
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      {searchQuery && (
        <section className="py-6 sm:py-10 lg:py-12 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Search Results for "{searchQuery}"
            </h2>
            
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-10 lg:py-12">
                <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400">
                  No articles found. Try different keywords.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories Grid - Premium Animated Section */}
      {!searchQuery && (
        <section className="py-6 sm:py-10 lg:py-16 bg-white dark:bg-gray-950 relative">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-3xl -z-10"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Animated Header */}
            <ScrollReveal variant="fadeUp" delay={0.1}>
              <div className="text-center mb-8 sm:mb-10 lg:mb-14">
                {/* Animated icon */}
                <div className="inline-flex items-center justify-center mb-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-green-400/30 to-teal-400/30 rounded-2xl blur-xl animate-pulse-slow"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
                      <Leaf className="w-8 h-8 text-white animate-float-slow" />
                    </div>
                    {/* Orbiting dot */}
                    <div className="absolute w-2.5 h-2.5 bg-white/80 rounded-full animate-orbit shadow-lg"></div>
                  </div>
                </div>
                
                {/* Title with gradient */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4">
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                    Browse by 
                  </span>
                  <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                    {" "}Category
                  </span>
                </h2>
                
                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent dark:via-emerald-600"></div>
                  <div className="w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent dark:via-emerald-600"></div>
                </div>
                
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                  Explore our collection of expert-written articles organized by health topic
                </p>
              </div>
            </ScrollReveal>

            {/* Animated Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 40, scale: 0.92 }}
                    whileInView={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                    }}
                    viewport={{ once: true, margin: "-60px", amount: 0.2 }}
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      damping: 18,
                      delay: index * 0.06,
                    }}
                    whileHover={{ 
                      y: -12,
                      scale: 1.03,
                      transition: { type: "spring", stiffness: 400, damping: 25 }
                    }}
                    className="group/cat relative"
                  >
                    {/* Animated glow effect on hover */}
                    <motion.div 
                      className="absolute -inset-3 rounded-3xl blur-xl -z-10"
                      initial={{ opacity: 0 }}
                      whileHover={{ 
                        opacity: 1,
                        background: `linear-gradient(135deg, ${category.id === 'nutrition' ? 'rgba(34, 197, 94, 0.3)' : category.id === 'herbs-remedies' ? 'rgba(16, 185, 129, 0.3)' : category.id === 'wellness' ? 'rgba(168, 85, 247, 0.3)' : category.id === 'fitness-body' ? 'rgba(249, 115, 22, 0.3)' : category.id === 'healthy-foods' ? 'rgba(234, 179, 8, 0.3)' : category.id === 'mental-health' ? 'rgba(139, 92, 246, 0.3)' : category.id === 'skin-beauty' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(6, 182, 212, 0.3)'} 0%, transparent 100%)`
                      }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10">
                      <div className="absolute inset-0 opacity-0 group-hover/cat:opacity-100 transition-opacity duration-500">
                        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover/cat:animate-shine"></div>
                      </div>
                    </div>
                    
                    <Link href={category.href}>
                      <Card 
                        className={`h-full cursor-pointer overflow-hidden border-2 ${category.borderColor} ${category.bgLight} ${category.bgDark} hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300`}
                        data-testid={`category-card-${category.id}`}
                      >
                        <CardContent className="p-3 sm:p-4 lg:p-6 relative">
                          {/* Icon with animated background */}
                          <div className="relative mb-3 sm:mb-4">
                            <div className={`absolute inset-0 w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br ${category.color} rounded-lg sm:rounded-xl blur-md opacity-40 group-hover/cat:opacity-60 transition-opacity`}></div>
                            <div className={`relative w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover/cat:scale-110 group-hover/cat:rotate-3 transition-all duration-300`}>
                              <IconComponent className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                            </div>
                          </div>
                          
                          {/* Title */}
                          <h3 className={`text-sm sm:text-base lg:text-lg font-bold ${category.textColor} mb-1 sm:mb-2 group-hover/cat:underline underline-offset-2`}>
                            {category.name}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2 sm:mb-3 lg:mb-4 line-clamp-2">
                            {category.description}
                          </p>
                          
                          {/* Arrow with animation */}
                          <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${category.textColor} group-hover/cat:gap-2.5 transition-all duration-300`}>
                            <span>View Articles</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/cat:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Bottom decoration */}
            <ScrollReveal variant="fadeUp" delay={0.4}>
              <div className="flex items-center justify-center gap-3 mt-10 sm:mt-14">
                <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent dark:via-emerald-700"></div>
                <div className="flex items-center gap-1.5">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="w-2 h-2 bg-emerald-500 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                  />
                </div>
                <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent dark:via-emerald-700"></div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* All Articles Section */}
      {!searchQuery && allArticles.length > 0 && (
        <section className="py-6 sm:py-10 lg:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header with Scroll Animation */}
            <ScrollReveal variant="fadeUp" delay={0.1}>
              <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-lg animate-pulse-slow"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  All Articles
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Explore our complete collection of {allArticles.length} expert-written health articles
                </p>
              </div>
            </ScrollReveal>

            {/* Category Filter Tabs with Animation */}
            <ScrollReveal variant="fadeUp" delay={0.15}>
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 lg:mb-10">
                <Button
                  variant={activeCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setActiveCategory(null); setVisibleCount(12); }}
                  className={`min-h-[44px] text-xs sm:text-sm ${activeCategory === null 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  data-testid="filter-all"
                >
                  All ({allArticles.length})
                </Button>
                {categories.map((category) => {
                  const count = allArticles.filter(a => a.category?.toLowerCase() === category.id).length;
                  return (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => { setActiveCategory(category.id); setVisibleCount(12); }}
                      className={`min-h-[44px] text-xs sm:text-sm ${activeCategory === category.id 
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      data-testid={`filter-${category.id}`}
                    >
                      {category.name} ({count})
                    </Button>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* Premium Results Header */}
            <ScrollReveal variant="fadeUp" delay={0.2}>
              <div className="relative mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 via-transparent to-teal-50/50 dark:from-emerald-950/20 dark:via-transparent dark:to-teal-950/20 rounded-2xl -z-10"></div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 px-5 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400/20 rounded-xl blur-md animate-pulse-slow"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Sparkles className="w-6 h-6 text-white animate-float-slow" />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                          {visibleArticles.length}
                        </span>
                        <span className="text-lg text-gray-600 dark:text-gray-400">of</span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {filteredArticles.length}
                        </span>
                        <span className="text-lg text-gray-600 dark:text-gray-400">articles</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {activeCategory ? (
                          <>Filtered by <span className="text-emerald-600 dark:text-emerald-400 font-medium capitalize">{activeCategory.replace('-', ' ')}</span></>
                        ) : (
                          "Browse our expert wellness content"
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {activeCategory ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setActiveCategory(null); setVisibleCount(12); }}
                      className="min-h-[44px] text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Clear filter
                    </Button>
                  ) : (
                    <div className="hidden sm:flex items-center gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
                          className={`w-2 h-2 rounded-full ${
                            i < 3 
                              ? 'bg-gradient-to-r from-emerald-400 to-teal-400' 
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <Card className="overflow-hidden relative">
                      <div className="h-48 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
                      </div>
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3 w-20" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : filteredArticles.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="text-center py-10 sm:py-12 lg:py-16"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mb-4 sm:mb-5 shadow-lg"
                >
                  <BookOpen className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-gray-400" />
                </motion.div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">No articles found</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                  No articles match your current filter. Try selecting a different category.
                </p>
                <Button
                  variant="outline"
                  onClick={() => { setActiveCategory(null); setVisibleCount(12); }}
                  className="min-h-[44px] border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  View all articles
                </Button>
              </motion.div>
            ) : (
              <>
                {/* Articles Grid - Each card animates on scroll */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
                  {visibleArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 40, scale: 0.92 }}
                      whileInView={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                      }}
                      viewport={{ once: true, margin: "-80px", amount: 0.15 }}
                      transition={{
                        type: "spring",
                        stiffness: 80,
                        damping: 18,
                        delay: (index % 3) * 0.08,
                      }}
                      whileHover={{ 
                        y: -10,
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 400, damping: 25 }
                      }}
                      className="group/card relative"
                    >
                      {/* Animated glow effect on hover */}
                      <motion.div 
                        className="absolute -inset-3 rounded-3xl blur-xl -z-10"
                        initial={{ opacity: 0 }}
                        whileHover={{ 
                          opacity: 1,
                          background: "linear-gradient(135deg, rgba(52, 211, 153, 0.25) 0%, rgba(16, 185, 129, 0.2) 50%, rgba(20, 184, 166, 0.25) 100%)"
                        }}
                        transition={{ duration: 0.4 }}
                      />
                      {/* Shine effect on card */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10">
                        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover/card:animate-shine"></div>
                        </div>
                      </div>
                      <ArticleCard article={article} />
                    </motion.div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <ScrollReveal variant="fadeUp" delay={0.2}>
                    <div className="mt-8 sm:mt-10 lg:mt-12 text-center">
                      <Button
                        onClick={loadMore}
                        size="lg"
                        className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all"
                        data-testid="load-more-articles"
                      >
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Load More Articles
                        <span className="ml-2 text-emerald-200 text-xs sm:text-sm">
                          ({filteredArticles.length - visibleCount} remaining)
                        </span>
                      </Button>
                    </div>
                  </ScrollReveal>
                )}

                {/* Show "You've seen all" message */}
                {!hasMore && visibleArticles.length > 12 && (
                  <ScrollReveal variant="scale" delay={0.2}>
                    <div className="mt-8 sm:mt-10 lg:mt-12 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm sm:text-base text-emerald-700 dark:text-emerald-300 font-medium">
                          You've explored all {filteredArticles.length} articles!
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* Bottom decoration */}
                <ScrollReveal variant="fadeUp" delay={0.3}>
                  <div className="flex items-center justify-center gap-3 mt-10 sm:mt-14">
                    <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent dark:via-emerald-700"></div>
                    <div className="flex items-center gap-1.5">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                        className="w-2 h-2 bg-emerald-500 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                        className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                      />
                    </div>
                    <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent dark:via-emerald-700"></div>
                  </div>
                </ScrollReveal>
              </>
            )}
          </div>
        </section>
      )}

    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const categoryInfo = categories.find(c => c.id === article.category?.toLowerCase()) || categories[0];
  
  return (
    <Link href={`/blog/${article.slug}`}>
      <div 
        className="group h-[320px] sm:h-[400px] lg:h-[450px] cursor-pointer"
        data-testid={`article-card-${article.id}`}
      >
        <div className="relative w-full h-full overflow-hidden rounded-lg sm:rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 group-hover:scale-[1.02]">
          {/* Front Panel - Image and Basic Info */}
          <div className="absolute inset-0 transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
            {/* Thumbnail */}
            <div className="relative h-24 sm:h-40 lg:h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              {article.featuredImage ? (
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${categoryInfo.color} flex items-center justify-center`}>
                  <categoryInfo.icon className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white/50" />
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                <Badge className={`text-[10px] sm:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1 ${categoryInfo.bgLight} ${categoryInfo.bgDark} ${categoryInfo.textColor} border ${categoryInfo.borderColor} font-medium`}>
                  {article.category || "Wellness"}
                </Badge>
              </div>
            </div>

            <div className="p-2 sm:p-4 lg:p-6">
              {/* Title */}
              <h3 className="text-[11px] sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-3 line-clamp-2 leading-tight">
                {article.title}
              </h3>
              
              {/* Excerpt - hidden on mobile */}
              <p className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 mb-3 lg:mb-4 line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
              
              {/* Meta Info */}
              <div className="flex items-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mb-1 sm:mb-3 lg:mb-4">
                <div className="flex items-center gap-1 sm:gap-3">
                  {article.readingTime && (
                    <span className="flex items-center gap-0.5 sm:gap-1">
                      <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                      {article.readingTime} min
                    </span>
                  )}
                </div>
              </div>
              
              {/* Read More */}
              <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <span>READ</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>

          {/* Back Panel - Summary/What Article Talks About */}
          <div className="absolute inset-0 p-2 sm:p-4 lg:p-6 translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0 bg-gradient-to-br from-white via-gray-50 to-emerald-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20 flex flex-col">
            {/* Header */}
            <div className="mb-1 sm:mb-3 lg:mb-4 pb-1 sm:pb-3 border-b border-gray-200 dark:border-gray-700">
              <Badge className={`text-[10px] sm:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1 ${categoryInfo.bgLight} ${categoryInfo.bgDark} ${categoryInfo.textColor} border ${categoryInfo.borderColor} font-medium mb-1`}>
                {article.category || "Wellness"}
              </Badge>
              <h3 className="text-[11px] sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {article.title}
              </h3>
            </div>

            {/* Summary/What This Article Covers */}
            <div className="flex-1 overflow-hidden">
              <h4 className="hidden sm:flex text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2 items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                What You'll Learn
              </h4>
              <p className="text-[10px] sm:text-sm text-gray-700 dark:text-gray-300 leading-snug line-clamp-3 sm:line-clamp-4 mb-1 sm:mb-3 lg:mb-4">
                {article.excerpt}
              </p>
              
              {/* Quick Info - hidden on mobile */}
              <div className="hidden sm:block space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium text-gray-900 dark:text-white truncate">{article.authorName || "PlantRx Team"}</span>
                </div>
                {article.readingTime && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{article.readingTime} min read</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-1 sm:mt-3 lg:mt-4 pt-1 sm:pt-3 lg:pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-end sm:justify-between">
                <span className="hidden sm:inline text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Click to read full article
                </span>
                <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all duration-300">
                  <span>READ</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
