import { useParams, Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Calendar, Share2, BookOpen, AlertTriangle, ChevronRight } from "lucide-react";
import { getArticleBySlug, getRelatedArticles, remedyCategories } from "@/data/remedyArticles";
import { format } from "date-fns";

export default function RemedyArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const article = getArticleBySlug(slug);
  const relatedArticles = article ? getRelatedArticles(slug, 3) : [];
  const category = article ? remedyCategories.find(c => c.id === article.category) : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">The remedy article you're looking for doesn't exist.</p>
          <Link href="/remedies/articles">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Browse All Remedy Articles
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.metaDescription,
    "image": `https://plantrxapp.com${article.featuredImage}`,
    "author": {
      "@type": "Organization",
      "name": article.authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "PlantRx",
      "logo": {
        "@type": "ImageObject",
        "url": "https://plantrxapp.com/logo.png"
      }
    },
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://plantrxapp.com/remedies/${article.slug}`
    },
    "keywords": article.keywords
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title={article.metaTitle}
        description={article.metaDescription}
        keywords={article.keywords}
        canonical={`https://plantrxapp.com/remedies/${article.slug}`}
        ogType="article"
        ogImage={`https://plantrxapp.com${article.featuredImage}`}
        schema={schemaData}
      />
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-green-600 dark:hover:text-green-400">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/remedies/articles" className="hover:text-green-600 dark:hover:text-green-400">Remedy Articles</Link>
          <ChevronRight className="w-4 h-4" />
          {category && (
            <>
              <Link href={`/remedies/category/${category.id}`} className="hover:text-green-600 dark:hover:text-green-400">
                {category.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-gray-900 dark:text-white truncate">{article.title.substring(0, 30)}...</span>
        </nav>

        {/* Back Button */}
        <Link href="/remedies/articles">
          <Button variant="outline" className="mb-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Remedy Articles
          </Button>
        </Link>

        <article className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Article Header */}
          <div className={`bg-gradient-to-r ${category?.color || 'from-green-500 to-emerald-600'} px-8 py-12`}>
            <div className="flex flex-wrap gap-2 mb-4">
              {category && (
                <Badge className="bg-white/20 text-white border-none">
                  {category.name}
                </Badge>
              )}
              {article.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="border-white/30 text-white">
                  #{tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h1>
            <p className="text-xl text-white/90 mb-6">
              {article.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.authorName}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.readingTime} min read
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShare}
                className="text-white hover:bg-white/20"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-8 py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Medical Disclaimer</p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  This article is for informational purposes only and is not intended as medical advice. 
                  Always consult with a qualified healthcare provider before starting any new health regimen.
                </p>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="px-8 py-8">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2
                prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ul:my-4
                prose-ol:text-gray-700 dark:prose-ol:text-gray-300 prose-ol:my-4
                prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-1
                prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-a:text-green-600 dark:prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ 
                __html: article.content
                  .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
                  .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
                  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>')
                  .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
                  .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/^([^<].+)$/gm, '<p>$1</p>')
              }}
            />
          </div>

          {/* Related Remedies */}
          {article.relatedRemedies.length > 0 && (
            <div className="px-8 py-6 bg-green-50 dark:bg-green-900/20 border-t border-green-100 dark:border-green-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                Try These Related Remedies
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.relatedRemedies.map(slug => (
                  <Link key={slug} href={`/remedies/${slug}`}>
                    <Badge className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-3 py-1">
                      {slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map(related => (
                <Link key={related.id} href={`/remedies/${related.slug}`}>
                  <Card className="h-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-5">
                      <Badge className={`mb-3 bg-gradient-to-r ${remedyCategories.find(c => c.id === related.category)?.color || 'from-green-500 to-emerald-600'} text-white border-none`}>
                        {remedyCategories.find(c => c.id === related.category)?.name}
                      </Badge>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2 mb-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {related.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {related.readingTime} min
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              Explore More Natural Remedies
            </h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Discover our complete library of 131 verified plant-based remedies with detailed preparation instructions and expert guidance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/remedies">
                <Button size="lg" className="bg-white text-green-700 hover:bg-green-50">
                  Browse All Remedies
                </Button>
              </Link>
              <Link href="/smart-tools">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Ask Remy for Advice
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
