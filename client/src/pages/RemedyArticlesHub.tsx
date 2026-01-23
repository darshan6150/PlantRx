import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Coffee, Sparkles, Heart, Moon, Sun, Shield, Activity, Zap,
  Clock, User, Search, ArrowRight, BookOpen, ChevronRight
} from "lucide-react";
import { remedyArticles, remedyCategories, getArticlesByCategory } from "@/data/remedyArticles";
import { format } from "date-fns";
import { useState } from "react";

const iconMap: Record<string, any> = {
  Coffee, Sparkles, Heart, Moon, Sun, Shield, Activity, Zap
};

export default function RemedyArticlesHub() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredArticles = searchQuery 
    ? remedyArticles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : remedyArticles;

  const featuredArticles = remedyArticles.slice(0, 3);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Natural Remedy Articles - PlantRx",
    "description": "Expert-written articles on natural remedies, herbal teas, and plant-based health solutions. Evidence-based guides for wellness.",
    "url": "https://plantrxapp.com/remedies/articles",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": remedyArticles.slice(0, 10).map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://plantrxapp.com/remedies/${article.slug}`
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title="Natural Remedy Articles: Expert Guides to Plant-Based Health | PlantRx"
        description="Explore 30+ in-depth articles on natural remedies, herbal teas, and evidence-based plant medicine. Expert-written guides for digestion, stress, sleep, immunity, and more."
        keywords="natural remedies articles, herbal medicine guides, plant-based health, natural health articles, herbal tea benefits, home remedies"
        canonical="https://plantrxapp.com/remedies/articles"
        schema={schemaData}
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-none mb-4 px-4 py-1">
              <BookOpen className="w-4 h-4 mr-2 inline" />
              {remedyArticles.length}+ Expert Articles
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Natural Remedy Articles
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Evidence-based guides to plant-based health written by wellness experts. 
              Discover the science behind natural remedies.
            </p>
            
            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles by topic, remedy, or health concern..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-xl border-0 bg-white dark:bg-gray-800 shadow-lg"
                data-testid="search-articles-input"
              />
            </div>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-green-600 dark:hover:text-green-400">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white">Remedy Articles</span>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Category Navigation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {remedyCategories.map(category => {
                const IconComponent = iconMap[category.icon];
                const articleCount = getArticlesByCategory(category.id).length;
                return (
                  <Link key={category.id} href={`/remedies/category/${category.id}`}>
                    <Card className={`bg-gradient-to-br ${category.color} border-none cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group`}>
                      <CardContent className="p-5 text-center">
                        {IconComponent && (
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                        <p className="text-sm text-white/80">{articleCount} articles</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Featured Articles */}
          {!searchQuery && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Featured Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredArticles.map(article => {
                  const category = remedyCategories.find(c => c.id === article.category);
                  return (
                    <Link key={article.id} href={`/remedies/${article.slug}`}>
                      <Card className="h-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer group overflow-hidden">
                        <div className={`h-3 bg-gradient-to-r ${category?.color || 'from-green-500 to-emerald-600'}`} />
                        <CardContent className="p-6">
                          <Badge className={`mb-3 bg-gradient-to-r ${category?.color || 'from-green-500 to-emerald-600'} text-white border-none`}>
                            {category?.name}
                          </Badge>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors mb-3 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {article.readingTime} min read
                            </span>
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform">
                              Read More <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* All Articles */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {searchQuery ? `Search Results (${filteredArticles.length})` : 'All Articles'}
              </h2>
            </div>
            
            {filteredArticles.length === 0 ? (
              <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No articles found</h3>
                  <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => {
                  const category = remedyCategories.find(c => c.id === article.category);
                  return (
                    <Link key={article.id} href={`/remedies/${article.slug}`}>
                      <Card className="h-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer group">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-xs">
                              {category?.name}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.readingTime} min
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {article.authorName.split(' ').slice(0, 2).join(' ')}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* CTA Section */}
          <Card className="mt-16 bg-gradient-to-r from-amber-500 to-orange-500 border-none overflow-hidden">
            <CardContent className="p-8 md:p-12 relative">
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
              <div className="relative text-center max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Ready to Try Natural Remedies?
                </h3>
                <p className="text-amber-100 mb-6">
                  Browse our complete library of 131 verified plant-based remedies with step-by-step preparation instructions.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/remedies">
                    <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50">
                      Explore Remedies
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/smart-tools">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Get Personalized Advice
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
