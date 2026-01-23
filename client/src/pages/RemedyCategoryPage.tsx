import { useParams, Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Clock, User, ChevronRight, ArrowRight, BookOpen,
  Coffee, Sparkles, Heart, Moon, Sun, Shield, Activity, Zap
} from "lucide-react";
import { remedyCategories, getArticlesByCategory, remedyArticles } from "@/data/remedyArticles";
import { format } from "date-fns";

const iconMap: Record<string, any> = {
  Coffee, Sparkles, Heart, Moon, Sun, Shield, Activity, Zap
};

export default function RemedyCategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  
  const category = remedyCategories.find(c => c.id === categoryId);
  const articles = getArticlesByCategory(categoryId);
  const otherCategories = remedyCategories.filter(c => c.id !== categoryId);

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Category Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">The category you're looking for doesn't exist.</p>
          <Link href="/remedies/articles">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Browse All Articles
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent = iconMap[category.icon];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} - Natural Remedy Articles | PlantRx`,
    "description": category.description,
    "url": `https://plantrxapp.com/remedies/category/${category.id}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": articles.map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://plantrxapp.com/remedies/${article.slug}`
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title={`${category.name} Articles: Natural ${category.name} Remedies | PlantRx`}
        description={`Expert articles on ${category.name.toLowerCase()}. ${category.description}. Evidence-based guides to natural health solutions.`}
        keywords={`${category.name.toLowerCase()}, natural remedies, herbal medicine, plant-based health, ${category.name.toLowerCase()} remedies`}
        canonical={`https://plantrxapp.com/remedies/category/${category.id}`}
        schema={schemaData}
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className={`bg-gradient-to-r ${category.color} py-16 px-4`}>
          <div className="max-w-6xl mx-auto text-center">
            {IconComponent && (
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <IconComponent className="w-10 h-10 text-white" />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {category.name}
            </h1>
            <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
              {category.description}
            </p>
            <Badge className="bg-white/20 text-white border-none px-4 py-1">
              <BookOpen className="w-4 h-4 mr-2 inline" />
              {articles.length} Articles
            </Badge>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-green-600 dark:hover:text-green-400">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/remedies/articles" className="hover:text-green-600 dark:hover:text-green-400">Remedy Articles</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white">{category.name}</span>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Link href="/remedies/articles">
            <Button variant="outline" className="mb-8 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Articles
            </Button>
          </Link>

          {/* Articles Grid */}
          {articles.length === 0 ? (
            <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No articles yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">We're working on adding articles to this category.</p>
                <Link href="/remedies/articles">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Browse All Articles
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <Link key={article.id} href={`/remedies/${article.slug}`}>
                  <Card className="h-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer group overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                    <CardContent className="p-5">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readingTime} min
                          </span>
                          <span className="text-xs">
                            {format(new Date(article.publishedAt), 'MMM d')}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform">
                          Read <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Other Categories */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Explore Other Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otherCategories.map(cat => {
                const CatIcon = iconMap[cat.icon];
                const articleCount = getArticlesByCategory(cat.id).length;
                return (
                  <Link key={cat.id} href={`/remedies/category/${cat.id}`}>
                    <Card className={`bg-gradient-to-br ${cat.color} border-none cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]`}>
                      <CardContent className="p-4 text-center">
                        {CatIcon && (
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <CatIcon className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <h3 className="font-medium text-white text-sm">{cat.name}</h3>
                        <p className="text-xs text-white/80">{articleCount} articles</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <Card className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 border-none">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-3">
                Try Our Natural Remedies
              </h3>
              <p className="text-green-100 mb-6 max-w-xl mx-auto">
                Explore our library of 131 verified remedies with detailed preparation instructions.
              </p>
              <Link href="/remedies">
                <Button size="lg" className="bg-white text-green-700 hover:bg-green-50">
                  Browse Remedies
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
