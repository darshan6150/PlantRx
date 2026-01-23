import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { useEnhancedPageTracking } from '../hooks/useAnalytics';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, ArrowRight, ArrowLeft, BookOpen, Mail, Shield, Users, Star, TrendingUp, Globe } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { BackButton } from "@/components/BackButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/contexts/TranslationContext";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

import { format } from "date-fns";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  authorName: string;
  publishedAt: string;
  readingTime?: number;
  tags?: string[];
};

export default function Blog() {
  // Enhanced analytics tracking for blog pages  
  useEnhancedPageTracking('blog', 'listing');
  
  const { language, setLanguage, t } = useTranslation();
  
  // Get languages from database
  const { data: languagesData } = useQuery<Language[]>({
    queryKey: ["/api/languages"],
  });

  const languages = languagesData || [];
  
  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
  };
  
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  const SkeletonCard = () => (
    <Card className="group overflow-hidden">
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <CardContent className="p-6">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 w-3/4"></div>
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/10 dark:to-teal-900/10">
      <SEOHead 
        title="Natural Health Articles - Expert Wellness Tips & Remedy Guides | PlantRx"
        description="Get expert natural health advice, proven remedy guides & wellness tips. Learn plant-based medicine secrets from health experts. Free guides & tips updated weekly!"
        keywords="PlantRx articles, natural health articles, herbal remedies, wellness tips, plant medicine, holistic health, natural healing"
        canonical="https://plantrxapp.com/blog"
        ogType="website"
      />

      {/* Header with Back Button, Theme Toggle & Language Selector */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <BackButton />
            
            {/* Right Side Controls */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-500"
                    data-testid="language-selector-blog"
                  >
                    <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`flex items-center space-x-3 px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        language === lang.code 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                      data-testid={`language-option-${lang.code}`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.nativeName || lang.name}</span>
                      {language === lang.code && (
                        <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative py-6 sm:py-10 lg:py-16 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }}></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal variant="scale" delay={0.1}>
            <div className="relative mb-4 sm:mb-6 lg:mb-8">
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl animate-pulse"></div>
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl sm:rounded-3xl mx-auto flex items-center justify-center border-2 border-white/30 backdrop-blur-sm">
                <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white drop-shadow-lg" />
              </div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent drop-shadow-lg">
                {t('blog.title', 'PlantRx Health Articles')}
              </span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal variant="fadeUp" delay={0.3}>
            <p className="text-sm sm:text-base lg:text-lg text-emerald-100 max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-10 leading-relaxed font-medium">
              {t('blog.subtitle', 'Weekly insights from leading health experts • Trending natural remedies • Evidence-based wellness strategies')}
            </p>
          </ScrollReveal>
          
          <ScrollReveal variant="fadeUp" delay={0.4}>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 max-w-4xl mx-auto mb-4 sm:mb-6 lg:mb-8 border border-white/20">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
                <Badge className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 text-white bg-emerald-500/30 border-emerald-300/50 text-xs sm:text-sm lg:text-base font-medium hover:bg-emerald-500/40 transition-all">
                  🌿 {t('blog.topic.natural_remedies', 'Natural Remedies')}
                </Badge>
                <Badge className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 text-white bg-teal-500/30 border-teal-300/50 text-xs sm:text-sm lg:text-base font-medium hover:bg-teal-500/40 transition-all">
                  🧬 {t('blog.topic.latest_research', 'Latest Research')}
                </Badge>
                <Badge className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 text-white bg-cyan-500/30 border-cyan-300/50 text-xs sm:text-sm lg:text-base font-medium hover:bg-cyan-500/40 transition-all">
                  💡 {t('blog.topic.wellness_tips', 'Wellness Tips')}
                </Badge>
                <Badge className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 text-white bg-blue-500/30 border-blue-300/50 text-xs sm:text-sm lg:text-base font-medium hover:bg-blue-500/40 transition-all">
                  🌱 {t('blog.topic.plant_medicine', 'Plant Medicine')}
                </Badge>
              </div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal variant="fadeIn" delay={0.5}>
            <div className="text-emerald-200 text-xs sm:text-sm font-medium">
              ✨ {t('blog.updated_weekly', 'Updated weekly with trending health topics • Expert-reviewed content')}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-6 sm:py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('blog.browse_articles', 'Browse Our Expert Articles')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                {t('blog.expert_content', 'Explore our collection of 16+ expert-written articles on natural health, herbal remedies, and evidence-based wellness strategies.')}
              </p>
            </div>
          ) : (
            <>
            {/* Enhanced Featured Article */}
            {posts.length > 0 && (
              <ScrollReveal variant="fadeUp">
                <div className="mb-8 sm:mb-12 lg:mb-16">
                  <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
                      {t('blog.weekly_featured', 'Weekly Featured')}
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-pulse"></div>
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-emerald-600 dark:text-emerald-400 font-medium">{t('blog.most_trending', 'Most trending health topic this week')}</p>
                  </div>
                
                <Card className="group hover:shadow-2xl transition-all duration-700 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 dark:from-gray-800 dark:via-emerald-900/10 dark:to-teal-900/10 border-0 shadow-xl hover:scale-[1.02] overflow-hidden">
                  <div className="relative">
                    <div className="aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"80\" height=\"80\" viewBox=\"0 0 80 80\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.15\"%3E%3Cpath d=\"M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
                      }}></div>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="relative mb-6">
                            <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-white/30 to-white/10 rounded-full mx-auto flex items-center justify-center backdrop-blur-sm border-2 border-white/40">
                              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-lg" />
                            </div>
                          </div>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold opacity-95 drop-shadow-lg">
                            <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                              {t('blog.most_read_week', 'Most Read This Week')}
                            </span>
                          </h2>
                        </div>
                      </div>
                      
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 border-0 shadow-lg animate-pulse">
                          🔥 {t('blog.trending', 'TRENDING')}
                        </Badge>
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm font-semibold text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2">
                          {t('blog.number_one_featured', '#1 Featured')}
                        </Badge>
                      </div>
                      
                      <Badge className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 bg-emerald-500 text-white border-0 font-bold text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 shadow-lg">
                        ✨ {t('blog.expert_pick', 'EXPERT PICK')}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4 sm:p-6 md:p-10 lg:p-12">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mb-4 sm:mb-6 md:mb-8">
                        <div className="flex items-center gap-2 sm:gap-3 text-emerald-600 dark:text-emerald-400">
                          <CalendarDays className="w-4 h-4 sm:w-5 h-5 md:w-6 md:h-6" />
                          <span className="font-bold text-sm sm:text-base md:text-lg">
                            {format(new Date(posts[0].publishedAt), 'MMMM dd, yyyy')}
                          </span>
                        </div>
                        {posts[0].readingTime && (
                          <>
                            <span className="text-gray-300 text-sm sm:text-base md:text-xl">•</span>
                            <div className="flex items-center gap-2 sm:gap-3 text-teal-600 dark:text-teal-400">
                              <Clock className="w-4 h-4 sm:w-5 h-5 md:w-6 md:h-6" />
                              <span className="font-bold text-sm sm:text-base md:text-lg">{posts[0].readingTime} min read</span>
                            </div>
                          </>
                        )}
                        <Badge className="text-emerald-700 border-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-600 px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 text-xs sm:text-sm md:text-lg font-bold">
                          {t('blog.most_popular', 'MOST POPULAR')}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {posts[0].title}
                      </h3>
                      
                      <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 md:mb-10 leading-relaxed font-medium">
                        {posts[0].excerpt}
                      </p>
                      
                      {posts[0].tags && posts[0].tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-10">
                          {posts[0].tags.slice(0, 4).map((tag: string) => (
                            <Badge key={tag} className="text-xs sm:text-sm md:text-lg px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600 hover:from-emerald-200 hover:to-teal-200 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all font-semibold">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t-2 border-gray-100 dark:border-gray-700">
                        <div className="text-gray-600 dark:text-gray-400">
                          <span className="font-bold text-sm sm:text-base lg:text-lg">{t('blog.by_author', 'By')} {posts[0].authorName}</span>
                        </div>
                        <Link href={`/blog/${posts[0].slug}`}>
                          <Button 
                            size="lg"
                            className="min-h-[44px] bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all group/btn text-sm sm:text-base lg:text-lg"
                            data-testid={`button-read-featured-${posts[0].id}`}
                          >
                            {t('blog.read_full_article', 'Read Full Article')}
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </Card>
                </div>
              </ScrollReveal>
            )}

            {/* Trending Weekly Topics Section */}
            <ScrollReveal variant="fadeUp">
              <div className="mb-8 sm:mb-12 lg:mb-16">
                <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
                    {t('blog.trending_health_topics', 'Trending Health Topics')}
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-orange-600 dark:text-orange-400 font-medium">{t('blog.whats_hot', 'What\'s hot in natural health this week')}</p>
                </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
                {[
                  { 
                    icon: "🧬", 
                    title: "GLP-1 Alternatives", 
                    color: "from-emerald-500 to-teal-500",
                    slug: "glp1-agonists-vs-natural-weight-loss-plant-alternatives",
                    description: "Natural weight loss without Ozempic"
                  },
                  { 
                    icon: "🏝️", 
                    title: "Blue Zone Secrets", 
                    color: "from-blue-500 to-cyan-500",
                    slug: "longevity-secrets-blue-zones-plants-add-years-life",
                    description: "Plants that help you live to 100+"
                  },
                  { 
                    icon: "🤖", 
                    title: "AI Nutrition", 
                    color: "from-purple-500 to-indigo-500",
                    slug: "ai-powered-personalized-nutrition-future-plant-medicine",
                    description: "Personalized medicine revolution"
                  },
                  { 
                    icon: "❄️", 
                    title: "Cold Therapy", 
                    color: "from-cyan-400 to-blue-500",
                    slug: "cold-therapy-revolution-ice-baths-cryotherapy-natural-exposure",
                    description: "Ice baths & Wim Hof method"
                  }
                ].map((trend, index) => (
                  <Link key={index} href={`/blog/${trend.slug}`}>
                    <Card className="group hover:shadow-xl transition-all duration-500 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:scale-105 overflow-hidden cursor-pointer h-full">
                      <CardContent className="p-3 sm:p-4 lg:p-6 text-center h-full flex flex-col justify-between">
                        <div>
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br ${trend.color} rounded-xl sm:rounded-2xl mx-auto mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center text-lg sm:text-xl lg:text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                            {trend.icon}
                          </div>
                          <h4 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1 sm:mb-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center">
                            {trend.title}
                          </h4>
                          <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center">
                            {trend.description}
                          </p>
                        </div>
                        <div className="w-8 sm:w-10 lg:w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-2 sm:mt-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Recent Articles Grid */}
            {posts.length > 1 && (
              <ScrollReveal variant="fadeUp">
                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-6 flex items-center justify-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                    {t('blog.latest_expert_articles', 'Latest Expert Articles')}
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
                  </h3>
                  <p className="text-center text-sm sm:text-base lg:text-lg text-blue-600 dark:text-blue-400 font-medium mb-4 sm:mb-6 lg:mb-8">{t('blog.fresh_insights', 'Fresh insights from health professionals')}</p>
                </div>
              </ScrollReveal>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {posts.slice(1).map((post: BlogPost, index: number) => {
                const gradients = [
                  'from-emerald-400 to-teal-500',
                  'from-blue-400 to-cyan-500',
                  'from-purple-400 to-indigo-500',
                  'from-amber-400 to-orange-500',
                  'from-pink-400 to-rose-500',
                  'from-green-400 to-emerald-500'
                ];
                const gradient = gradients[index % gradients.length];
                
                return (
                  <Card key={post.id} className="group hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 overflow-hidden hover:-translate-y-2 hover:scale-105 flex flex-col h-full">
                    <div className={`aspect-video bg-gradient-to-br ${gradient} relative overflow-hidden flex-shrink-0`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-90 drop-shadow-lg" />
                          <div className="text-sm font-semibold opacity-95">{t('blog.expert_content', 'Expert Content')}</div>
                        </div>
                      </div>
                      <Badge className="absolute top-4 left-4 bg-white/20 text-white border-white/30 backdrop-blur-sm font-semibold">
                        #{index + 2}
                      </Badge>
                      <Badge className="absolute top-4 right-4 bg-emerald-500 text-white border-0 font-semibold animate-pulse">
                        {t('blog.new', 'NEW')}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-xs sm:text-sm font-semibold">
                            {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        {post.readingTime && (
                          <>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="text-xs sm:text-sm font-semibold">
                                {post.readingTime} {t('blog.min_read', 'min read')}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 line-clamp-3 leading-relaxed text-sm sm:text-base md:text-lg flex-1">
                        {post.excerpt}
                      </p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                          {post.tags.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-end pt-3 sm:pt-4 lg:pt-6 border-t border-gray-100 dark:border-gray-700 mt-auto">
                        <Link href={`/blog/${post.slug}`}>
                          <Button 
                            className="min-h-[44px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 sm:px-5 sm:py-2 lg:px-6 lg:py-2 rounded-lg text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all group/btn"
                            data-testid={`button-read-${post.id}`}
                          >
                            {t('blog.read_article', 'Read Article')}
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            </>
          )}
        </div>
      </section>

      {/* Enhanced Newsletter CTA */}
      <section className="py-6 sm:py-10 lg:py-16 bg-gradient-to-r from-green-600 via-green-700 to-green-800 dark:from-gray-800 dark:via-gray-900 dark:to-black relative">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }}></div>
        <ScrollReveal variant="fadeUp">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white dark:text-gray-100 relative">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 dark:bg-gray-700/50 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 lg:mb-6">
              <Mail className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white dark:text-gray-200" />
            </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 lg:mb-6">
            {t('blog.newsletter.title', 'Transform Your Health Journey')}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-green-100 dark:text-gray-300 mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('blog.newsletter.description', 'Join thousands of health enthusiasts receiving weekly insights on natural remedies, wellness strategies, and breakthrough research from our expert team.')}
          </p>
          
          {/* Enhanced subscription form */}
          <div className="max-w-md mx-auto mb-4 sm:mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input 
                type="email" 
                placeholder={t('blog.newsletter.email_placeholder', 'Enter your email address')}
                className="flex-1 px-4 py-3 sm:px-5 sm:py-3.5 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl text-gray-900 dark:text-gray-100 dark:bg-gray-700 border-0 focus:ring-4 focus:ring-white/30 dark:focus:ring-gray-500/30 shadow-lg placeholder-gray-500 dark:placeholder-gray-400 text-center sm:text-left text-sm sm:text-base"
              />
              <Button className="min-h-[44px] bg-white dark:bg-gray-200 text-green-600 dark:text-green-700 hover:bg-green-50 dark:hover:bg-gray-100 px-6 py-3 sm:px-7 sm:py-3.5 lg:px-8 lg:py-4 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base">
                {t('blog.newsletter.get_started', 'Get Started')}
              </Button>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-6 text-green-200 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">{t('blog.newsletter.privacy', '100% Privacy Guaranteed')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{t('blog.newsletter.subscribers', '25,000+ Subscribers')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span className="text-sm">{t('blog.newsletter.expert_curated', 'Expert-Curated Content')}</span>
            </div>
          </div>
          
          <p className="text-xs text-green-200 dark:text-gray-400">
            {t('blog.newsletter.no_spam', 'No spam ever. Unsubscribe with one click anytime.')}
          </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}