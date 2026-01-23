import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import InteractiveMuscleMap from "@/components/InteractiveMuscleMap";
import { Dumbbell, Target, Flame, Heart, Activity, TrendingUp, BookOpen, Clock, ArrowRight, ArrowDown, Zap, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { FeatureLock } from "@/components/FeatureLock";
import { Feature } from "@shared/subscriptionFeatures";
import { motion, useScroll, useInView } from "framer-motion";

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  readingTime?: number;
  authorName?: string;
}

const muscleCategories = [
  { name: "Arms", href: "/fitness/arms", color: "from-yellow-500 to-yellow-600", icon: Dumbbell },
  { name: "Shoulders", href: "/fitness/shoulders", color: "from-orange-500 to-orange-600", icon: Target },
  { name: "Chest", href: "/fitness/chest", color: "from-red-500 to-red-600", icon: Flame },
  { name: "Back", href: "/fitness/back", color: "from-green-500 to-green-600", icon: Activity },
  { name: "Legs", href: "/fitness/legs", color: "from-purple-500 to-purple-600", icon: TrendingUp },
  { name: "Abs", href: "/fitness/abs", color: "from-cyan-500 to-cyan-600", icon: Heart },
];

const benefits = [
  { icon: Zap, title: "Track Progress", description: "Monitor your gains with detailed workout history" },
  { icon: Target, title: "Targeted Training", description: "Focus on specific muscle groups for balanced development" },
  { icon: Trophy, title: "Achievement System", description: "Unlock badges as you complete workout milestones" },
];

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.92, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.92, y: 24 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
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
      animate={{ y: [0, -8, 0] }} 
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}

export default function Fitness() {
  const { data: fitnessArticles = [], isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/blog/posts', 'fitness'],
    queryFn: async () => {
      const response = await fetch('/api/blog/posts?category=fitness&limit=6');
      if (!response.ok) throw new Error('Failed to fetch articles');
      return response.json();
    }
  });

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; };
  }, []);

  const scrollToMap = () => {
    const mapSection = document.getElementById('muscle-map');
    mapSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Fitness & Workouts - Interactive Training | PlantRx</title>
        <meta name="description" content="Explore our interactive fitness training with targeted muscle group workouts. Build strength, improve flexibility, and track your progress." />
      </Helmet>

      <ScrollProgress />
      
      <div className="min-h-screen overflow-x-hidden">
        {/* Hero Section */}
        <section className="min-h-[75vh] sm:min-h-[85vh] relative flex flex-col items-center justify-center py-12 sm:py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-orange-900/10 dark:to-gray-900">
          {/* Optimized decorative elements - no blur for 60fps performance */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-gradient-to-br from-yellow-200/30 to-orange-200/20 dark:from-yellow-600/15 dark:to-orange-600/10 rounded-full opacity-60" />
            <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-br from-orange-200/25 to-red-200/20 dark:from-orange-600/10 dark:to-red-600/10 rounded-full opacity-50" />
            <div className="absolute top-1/3 right-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-yellow-300/40 to-orange-300/30 dark:from-yellow-500/20 dark:to-orange-500/15 rounded-full" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeInSection>
              <Badge className="bg-gradient-to-r from-yellow-100 to-orange-200 dark:from-yellow-900/50 dark:to-orange-800/50 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700/50 mb-6 sm:mb-8 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 font-semibold tracking-wide">
                💪 Interactive Training
              </Badge>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <FloatingElement duration={4}>
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-3xl mx-auto mb-6 sm:mb-8 flex items-center justify-center shadow-2xl">
                  <Dumbbell className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
                </div>
              </FloatingElement>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
                Fitness & Training
              </h1>
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed">
                Click on the body to target specific muscle groups, or choose a category below
              </p>
            </FadeInSection>

            <FadeInSection delay={0.4}>
              <button 
                onClick={scrollToMap} 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-8 py-4 sm:px-12 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl shadow-2xl cursor-pointer hover:shadow-[0_15px_40px_-10px_rgba(249,115,22,0.5)] hover:scale-105 active:scale-98 transition-all duration-200 ease-out"
                data-testid="button-start-training"
              >
                <Target className="w-6 h-6" />
                <span>Start Training</span>
                <ArrowDown className="w-6 h-6 animate-bounce" />
              </button>
            </FadeInSection>
          </div>
        </section>

        {/* Muscle Categories Section */}
        <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection className="text-center mb-10">
              <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm uppercase tracking-wider mb-4 block">Quick Access</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Focus
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Select a muscle group to view targeted workouts
              </p>
            </FadeInSection>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-12">
              {muscleCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <FadeInSection key={category.name} delay={index * 0.05}>
                    <Link href={category.href}>
                      <Card className="cursor-pointer border-2 border-gray-100 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 shadow-md hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-200 ease-out group active:scale-95" data-testid={`fitness-category-${category.name.toLowerCase()}`}>
                        <CardContent className="p-3 sm:p-4 text-center">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{category.name}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </FadeInSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-orange-50/30 dark:from-gray-800 dark:to-orange-900/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection className="text-center mb-12">
              <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm uppercase tracking-wider mb-4 block">Why Train With Us</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Built for Results
              </h2>
            </FadeInSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {benefits.map((benefit, index) => (
                <FadeInSection key={benefit.title} delay={index * 0.1}>
                  <Card className="h-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-200 ease-out group active:scale-98">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-3 sm:mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Muscle Map Section */}
        <section id="muscle-map" className="py-12 sm:py-20 lg:py-28 relative">
          {/* Premium background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-orange-50/40 to-amber-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-100/30 via-transparent to-transparent dark:from-orange-900/10" />
          
          {/* Decorative accents */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-40 sm:w-72 h-40 sm:h-72 bg-gradient-to-br from-yellow-200/20 to-transparent dark:from-yellow-800/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-tl from-orange-200/25 to-transparent dark:from-orange-800/10 rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
          
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
            {/* Premium Section Header */}
            <FadeInSection className="text-center mb-8 sm:mb-12 lg:mb-16">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-200/50 dark:border-orange-700/30 mb-4 sm:mb-6">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-xs sm:text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wider">Premium Feature</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 sm:mb-4">
                Interactive <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">Muscle Map</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
                Click on any muscle group to discover expert-designed workouts tailored to your training goals
              </p>
            </FadeInSection>

            <FadeInSection delay={0.15}>
              <FeatureLock feature={Feature.INTERACTIVE_MUSCLE_TRAINER}>
                <div className="max-w-5xl mx-auto">
                  {/* Clean card container with generous spacing */}
                  <div className="relative bg-white dark:bg-gray-800 shadow-xl sm:shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl overflow-hidden">
                    {/* Top accent bar */}
                    <div className="h-1 sm:h-1.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />
                    
                    {/* Content area - The interactive map with generous padding */}
                    <div className="p-3 sm:p-6 md:p-8 lg:p-10">
                      <InteractiveMuscleMap />
                    </div>
                    
                    {/* Bottom accent bar */}
                    <div className="h-1 sm:h-1.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />
                  </div>
                </div>
              </FeatureLock>
            </FadeInSection>
            
            {/* Trust indicators below the card */}
            <FadeInSection delay={0.25} className="mt-8 sm:mt-12 lg:mt-16">
              <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">50+</span>
                  <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">Workouts</span>
                </div>
                <div className="w-px h-8 sm:h-10 bg-gray-200 dark:bg-gray-700" />
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">6</span>
                  <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">Muscle Groups</span>
                </div>
                <div className="w-px h-8 sm:h-10 bg-gray-200 dark:bg-gray-700" />
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Pro</span>
                  <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">Quality</span>
                </div>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Fitness Articles Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-orange-50/30 dark:from-gray-800 dark:to-orange-900/10">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      Fitness Articles
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                      Expert guides for training, recovery & performance
                    </p>
                  </div>
                </div>
                <Link href="/articles/fitness">
                  <button className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors hover:gap-3 duration-200 text-sm sm:text-base">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </FadeInSection>

            {articlesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 h-40 sm:h-48 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : fitnessArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {fitnessArticles.slice(0, 6).map((article, index) => (
                  <FadeInSection key={article.id} delay={index * 0.08}>
                    <Link href={`/blog/${article.slug}`}>
                      <Card className="h-full cursor-pointer transition-all duration-200 ease-out border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 rounded-xl group active:scale-98" data-testid={`fitness-article-${article.id}`}>
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-sm text-xs">
                              <Dumbbell className="w-3 h-3 mr-1" />
                              Fitness
                            </Badge>
                            {article.readingTime && (
                              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {article.readingTime} min
                              </span>
                            )}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed">
                            {article.excerpt}
                          </p>
                          {article.authorName && (
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-2 sm:mt-3 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              {article.authorName}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  </FadeInSection>
                ))}
              </div>
            ) : (
              <FadeInSection>
                <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed rounded-xl">
                  <CardContent className="py-12 text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No fitness articles available yet. Check back soon!
                    </p>
                  </CardContent>
                </Card>
              </FadeInSection>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
