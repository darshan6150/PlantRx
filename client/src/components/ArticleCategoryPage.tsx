import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { BackButton } from "@/components/BackButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Clock, User, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { LucideIcon } from "lucide-react";

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

interface CategoryConfig {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: LucideIcon;
  color: string;
  lightBg: string;
  darkBg: string;
  accentColor: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

interface ArticleCategoryPageProps {
  category: CategoryConfig;
  relatedCategories?: Array<{
    name: string;
    href: string;
    color: string;
  }>;
}

export function ArticleCategoryPage({ category, relatedCategories = [] }: ArticleCategoryPageProps) {
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: [`/api/blog/category/${category.id}`],
  });

  const IconComponent = category.icon;

  const SkeletonCard = () => (
    <Card className="overflow-hidden bg-white dark:bg-gray-900">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <CardContent className="p-6">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEOHead 
        title={category.metaTitle}
        description={category.metaDescription}
        keywords={category.keywords}
        canonical={`https://plantrxapp.com/articles/${category.id}`}
        ogType="website"
      />

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <BackButton customText="Back to Articles" />
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className={`relative py-16 sm:py-24 bg-gradient-to-br ${category.color}`}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.15\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }} />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mb-6 border border-white/30">
            <IconComponent className="w-10 h-10 text-white" />
          </div>
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {category.name}
          </h1>
          
          {/* Description */}
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {category.longDescription}
          </p>
          
          {/* Article Count */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium">
            <BookOpen className="w-4 h-4" />
            {articles.length} {articles.length === 1 ? 'Article' : 'Articles'}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {articles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  accentColor={category.accentColor}
                  categoryIcon={IconComponent}
                  categoryColor={category.color}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} mb-6`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                We're working on expert content for this category. Check back soon for new articles!
              </p>
              <Link href="/articles">
                <Button variant="outline" className={`border-2 ${category.accentColor}`}>
                  Browse Other Categories
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      {relatedCategories.length > 0 && (
        <section className="py-12 sm:py-16 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Explore More Topics
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {relatedCategories.map((cat) => (
                <Link key={cat.href} href={cat.href}>
                  <Button 
                    variant="outline" 
                    className={`${cat.color} hover:opacity-80 transition-opacity`}
                    data-testid={`related-category-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {cat.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className={`py-12 sm:py-16 bg-gradient-to-br ${category.color}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Explore All Health Topics
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Discover more expert-curated articles across all wellness categories
          </p>
          <Link href="/articles">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
              data-testid="browse-all-articles-button"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Browse All Articles
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

interface ArticleCardProps {
  article: Article;
  accentColor: string;
  categoryIcon: LucideIcon;
  categoryColor: string;
}

function ArticleCard({ article, accentColor, categoryIcon: Icon, categoryColor }: ArticleCardProps) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <Card 
        className="group h-full cursor-pointer overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1"
        data-testid={`article-card-${article.id}`}
      >
        {/* Thumbnail */}
        <div className="relative h-52 overflow-hidden">
          {article.featuredImage ? (
            <img 
              src={article.featuredImage} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${categoryColor} flex items-center justify-center`}>
              <Icon className="w-20 h-20 text-white/30" />
            </div>
          )}
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white font-medium shadow-sm">
              {article.category || "Wellness"}
            </Badge>
          </div>
          
          {/* Reading Time Badge */}
          {article.readingTime && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-black/50 text-white backdrop-blur-sm border-0">
                <Clock className="w-3 h-3 mr-1" />
                {article.readingTime} min
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          {/* Title - 2 lines max */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
            {article.title}
          </h3>
          
          {/* Excerpt - 2-3 lines */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
          
          {/* Author & Date */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {article.authorName || "PlantRx Team"}
            </span>
            <span>
              {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
            </span>
          </div>
          
          {/* Read More Button */}
          <div className={`inline-flex items-center gap-2 text-sm font-bold ${accentColor} group-hover:gap-3 transition-all duration-300`}>
            <span>READ MORE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ArticleCategoryPage;
