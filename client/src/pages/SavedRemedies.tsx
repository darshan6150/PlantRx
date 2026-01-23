import { useQuery } from "@tanstack/react-query";
import { Bookmark, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";

export default function SavedRemedies() {
  const { data: savedRemedies = [], isLoading } = useQuery<any[], any, any[], any>({
    queryKey: ["/api/saved-remedies"],
  });

  return (
    <>
      <SEOHead
        title="Saved Remedies - PlantRx"
        description="View and manage your saved natural remedies collection on PlantRx."
        keywords="saved remedies, favorites, natural remedies, plantrx"
        noindex={true}
      />
      
      <Header />
      
      <div className="min-h-screen luxury-gradient-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8 lg:mb-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Bookmark className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  Saved Remedies
                </h1>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300">
                Your personal collection of favorite natural remedies
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  Loading your saved remedies...
                </p>
              </div>
            ) : savedRemedies.length === 0 ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-6 lg:p-8 text-center">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-4">
                  No saved remedies yet. Explore remedies and save your favorites!
                </p>
                <Link href="/remedies">
                  <button className="px-4 sm:px-6 py-2 sm:py-3 min-h-[44px] bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg transition-all text-sm sm:text-base">
                    Browse Remedies
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {(savedRemedies as any[]).map((remedy: any) => (
                  <Link key={remedy.id} href={`/remedy/${remedy.slug}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer luxury-border">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {remedy.name}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-2">
                        {remedy.description}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {remedy.category && (
                          <span className="px-2 sm:px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs sm:text-sm rounded-full">
                            {remedy.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
