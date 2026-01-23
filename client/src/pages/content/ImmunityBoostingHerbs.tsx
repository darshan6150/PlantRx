import { BackButton } from "@/components/BackButton";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, Leaf, Star, Heart, Sparkles, ArrowRight, Check } from "lucide-react";

export default function ImmunityBoostingHerbs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title="10 Herbal Ingredients That Boost Immunity Naturally | PlantRx Expert Guide"
        description="Discover 10 powerful herbal ingredients scientifically proven to strengthen your immune system. Learn dosages, benefits, and how to use these natural immunity boosters effectively."
        keywords="immune boosting herbs, natural immunity boosters, herbal supplements for immunity, strengthen immune system naturally, immune system herbs, natural defense herbs"
        canonical="https://plantrxapp.com/learn/immunity-boosting-herbs"
        ogType="article"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        
        <article className="mt-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              10 Herbal Ingredients That Boost Immunity
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Science-backed herbs that strengthen your body's natural defenses and help you stay healthy year-round
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-lg">
                Your immune system is your body's defense force, constantly working to protect you from viruses, bacteria, and other pathogens. While lifestyle factors like sleep, exercise, and nutrition form the foundation of immunity, certain herbs have been scientifically proven to provide powerful immune support.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                These 10 herbal ingredients have stood the test of time and modern scientific scrutiny, offering safe and effective ways to strengthen your natural defenses.
              </p>
            </CardContent>
          </Card>

          {/* Herb #1 */}
          <Card className="mb-6 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <span className="text-3xl font-bold text-purple-600 mr-3">1</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Echinacea (Purple Coneflower)</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                <strong>How it works:</strong> Echinacea contains compounds called alkamides and polysaccharides that stimulate white blood cell production and activity. It increases the number and activity of immune cells including macrophages, natural killer cells, and T-cells.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                <strong>Research support:</strong> A meta-analysis of 14 studies found that echinacea reduced the risk of catching colds by 58% and shortened cold duration by 1-4 days. It's most effective when taken at the first sign of illness.
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Dosage:</strong> 900-1,500 mg daily of dried echinacea root, or 2-3 ml of tincture 3 times daily. Take for 7-10 days when fighting infection.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Herb #2 */}
          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <span className="text-3xl font-bold text-blue-600 mr-3">2</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Elderberry (Sambucus nigra)</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                <strong>How it works:</strong> Elderberry is packed with anthocyanins that have antiviral properties. These compounds prevent viruses from entering cells and replicating, while also reducing inflammation in the respiratory system.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                <strong>Research support:</strong> A 2016 study found that air travelers taking elderberry experienced shorter and less severe colds. Another study showed it reduced flu symptoms by 4 days when taken within 48 hours of symptom onset.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Dosage:</strong> 15 ml of elderberry syrup 4 times daily for 5 days during infection, or 500 mg daily as prevention during cold season.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Herb #3 */}
          <Card className="mb-6 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <span className="text-3xl font-bold text-green-600 mr-3">3</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Astragalus Root</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                <strong>How it works:</strong> This traditional Chinese herb contains polysaccharides that activate immune cells and increase interferon production—proteins that prevent viral replication. It also helps regulate the immune response, making it beneficial for both underactive and overactive immunity.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                <strong>Research support:</strong> Studies show astragalus increases white blood cell count and enhances immune function in both healthy individuals and those with compromised immunity. It's particularly effective for preventing respiratory infections.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Dosage:</strong> 500-1,000 mg twice daily as a preventive measure. Can be taken long-term during flu season.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Herb #4 */}
          <Card className="mb-6 border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <span className="text-3xl font-bold text-orange-600 mr-3">4</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reishi Mushroom</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                <strong>How it works:</strong> Reishi contains beta-glucans that activate macrophages and natural killer cells, your immune system's first responders. It also has adaptogenic properties that help the body respond to stress, which can suppress immunity.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                <strong>Research support:</strong> Research shows reishi mushroom extract increases white blood cell count and improves lymphocyte function. One study found it enhanced immune response in athletes exposed to stress.
              </p>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Dosage:</strong> 1-1.5 grams of dried mushroom powder daily, or 1-2 ml of tincture 2-3 times daily.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Herb #5 */}
          <Card className="mb-6 border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <span className="text-3xl font-bold text-red-600 mr-3">5</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ginger Root</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                <strong>How it works:</strong> Gingerol and shogaol, ginger's active compounds, have powerful anti-inflammatory and antioxidant effects. They inhibit the production of pro-inflammatory cytokines and help regulate immune responses.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                <strong>Research support:</strong> Studies demonstrate ginger's antimicrobial effects against various pathogens. It's particularly effective for respiratory infections and can help reduce inflammation in the airways.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Dosage:</strong> 1-2 grams of fresh ginger daily, or 250 mg of ginger extract 2-4 times daily. Can be taken as tea, capsules, or fresh.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Herbs 6-10 Summary */}
          <Card className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">5 More Powerful Immunity Herbs</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">6. Garlic</h3>
                    <p className="text-gray-700 dark:text-gray-300">Contains allicin with powerful antimicrobial properties. 2-3 raw cloves daily or 600-900 mg aged garlic extract.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">7. Turmeric (Curcumin)</h3>
                    <p className="text-gray-700 dark:text-gray-300">Anti-inflammatory powerhouse that modulates immune response. 500-1,000 mg with black pepper for absorption.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">8. Andrographis</h3>
                    <p className="text-gray-700 dark:text-gray-300">Reduces cold duration and severity by up to 50%. 400 mg standardized extract 3 times daily.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">9. Olive Leaf Extract</h3>
                    <p className="text-gray-700 dark:text-gray-300">Contains oleuropein with antiviral and antibacterial properties. 500 mg twice daily.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">10. Cat's Claw</h3>
                    <p className="text-gray-700 dark:text-gray-300">Amazonian herb that boosts white blood cells and reduces inflammation. 250-350 mg daily.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Guidelines */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">How to Use Immunity Herbs Effectively</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Check className="w-6 h-6 text-emerald-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Timing Matters:</strong>
                    <p className="text-gray-700 dark:text-gray-300">Take preventive herbs daily during cold season. Use acute herbs like echinacea at first sign of illness.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="w-6 h-6 text-emerald-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Combine Strategically:</strong>
                    <p className="text-gray-700 dark:text-gray-300">Pair 2-3 herbs with different mechanisms for synergistic effects. Example: Elderberry + Echinacea + Vitamin C.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="w-6 h-6 text-emerald-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Quality Counts:</strong>
                    <p className="text-gray-700 dark:text-gray-300">Choose standardized extracts from reputable brands. Look for third-party testing and organic certification.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Build Your Immunity Naturally</h2>
              <p className="mb-6 text-blue-50">
                Explore our full database of immune-boosting remedies with detailed protocols and expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/remedies">
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                    Find Your Remedy
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}