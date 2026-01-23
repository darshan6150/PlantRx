import { BackButton } from "@/components/BackButton";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Flame, Shield, Heart, Leaf, Activity, ArrowRight, Check } from "lucide-react";

export default function AntiInflammatoryHerbs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title="Anti-Inflammatory Herbs: Complete Guide to Natural Inflammation Relief | PlantRx"
        description="Comprehensive guide to anti-inflammatory herbs. Learn how Turmeric, Ginger, Boswellia, and other natural remedies reduce chronic inflammation effectively."
        keywords="anti-inflammatory herbs, natural inflammation remedies, reduce inflammation naturally, turmeric benefits, ginger anti-inflammatory, chronic inflammation herbs"
        canonical="https://plantrxapp.com/learn/anti-inflammatory-herbs"
        ogType="article"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        
        <article className="mt-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mb-6">
              <Flame className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Anti-Inflammatory Herbs: Complete Guide
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Science-backed herbs that naturally reduce chronic inflammation—the root cause of arthritis, heart disease, diabetes, and accelerated aging
            </p>
          </div>

          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Why Chronic Inflammation Matters</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Chronic inflammation is the silent killer behind most modern diseases. Unlike acute inflammation (which helps you heal from injuries), chronic low-grade inflammation slowly damages tissues, leading to arthritis, cardiovascular disease, diabetes, Alzheimer's, cancer, and premature aging.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The good news? Natural anti-inflammatory herbs can be as effective as prescription NSAIDs (like ibuprofen) without the side effects of stomach ulcers, liver damage, or cardiovascular risks. These herbs work by blocking inflammatory enzymes (COX-2, LOX) and reducing inflammatory molecules (cytokines, prostaglandins).
              </p>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">The Most Powerful Anti-Inflammatory Herbs</h2>

          <Card className="mb-6 border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">1. Turmeric (Curcumin) - The Golden Standard</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Curcumin blocks NF-kappa B, the master switch that activates inflammatory genes. It inhibits COX-2 and LOX enzymes (like NSAIDs do) and reduces inflammatory cytokines including TNF-alpha and IL-6.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> Over 12,000 studies confirm curcumin's anti-inflammatory power. Clinical trials show it's as effective as ibuprofen for arthritis pain, but without gastric side effects. It reduces inflammation markers by 40-60% in most studies.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 500-1000mg standardized extract (95% curcuminoids) 2-3 times daily WITH black pepper (piperine) or fat for absorption. Needs 4-8 weeks for full effects.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">2. Ginger - Fast-Acting Pain Relief</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Gingerols and shogaols inhibit both COX and LOX pathways (dual-action like advanced NSAIDs). This makes ginger effective for both pain and swelling. It also reduces oxidative stress that amplifies inflammation.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> Studies show ginger reduces muscle pain by 25%, arthritis pain by 40%, and inflammatory markers (C-reactive protein) by 28%. Works within hours for acute inflammation, weeks for chronic conditions.
              </p>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 1-2g fresh ginger daily (in tea or food), or 500mg extract 2-3 times daily. For acute pain, take 1g every 4-6 hours.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">3. Boswellia (Frankincense) - Joint Inflammation Specialist</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Boswellic acids block 5-LOX enzyme, reducing leukotriene production (inflammatory molecules that cause swelling and pain). Particularly effective for inflammatory bowel disease and arthritis.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> Clinical trials show Boswellia reduces arthritis pain by 50-65% and improves joint function within 4-8 weeks. It's also effective for Crohn's disease and ulcerative colitis, matching prescription medications.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 300-500mg standardized extract (60-65% boswellic acids) 2-3 times daily. Take with food for better absorption.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">More Powerful Anti-Inflammatory Herbs</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">4. Green Tea (EGCG)</h3>
                    <p className="text-gray-700 dark:text-gray-300">Epigallocatechin gallate reduces inflammatory cytokines and oxidative stress. 3-5 cups daily or 400-800mg EGCG extract provides cardioprotective and anti-aging benefits.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Heart className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">5. Omega-3 Fatty Acids (EPA/DHA)</h3>
                    <p className="text-gray-700 dark:text-gray-300">Convert into anti-inflammatory molecules (resolvins, protectins). 2000-3000mg combined EPA/DHA daily reduces joint pain, improves heart health, and lowers inflammatory markers by 30-40%.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Leaf className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">6. Quercetin</h3>
                    <p className="text-gray-700 dark:text-gray-300">Flavonoid that inhibits histamine release and inflammatory pathways. Excellent for allergies and exercise-induced inflammation. 500-1000mg daily with bromelain for enhanced absorption.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Activity className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">7. Resveratrol</h3>
                    <p className="text-gray-700 dark:text-gray-300">Polyphenol from grapes that activates longevity genes and reduces inflammation. 200-500mg daily improves cardiovascular health and reduces inflammatory markers.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Flame className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">8. Bromelain</h3>
                    <p className="text-gray-700 dark:text-gray-300">Enzyme from pineapple that breaks down inflammatory proteins. Effective for post-workout soreness, sinusitis, and injury recovery. 500-1000mg between meals for anti-inflammatory effect.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Condition-Specific Anti-Inflammatory Protocols</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Arthritis & Joint Pain</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>Turmeric:</strong> 1000mg 2x daily (with black pepper)</li>
                  <li>• <strong>Boswellia:</strong> 400mg 3x daily</li>
                  <li>• <strong>Omega-3:</strong> 2000mg EPA/DHA daily</li>
                  <li>• <strong>Ginger:</strong> 500mg 2x daily</li>
                  <li>• <strong>Collagen:</strong> 10g daily for joint repair</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Cardiovascular Inflammation</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>Omega-3:</strong> 3000mg EPA/DHA daily</li>
                  <li>• <strong>Resveratrol:</strong> 250mg daily</li>
                  <li>• <strong>Green Tea Extract:</strong> 500mg EGCG</li>
                  <li>• <strong>Garlic:</strong> 600mg aged garlic extract</li>
                  <li>• <strong>Turmeric:</strong> 500mg 2x daily</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Gut Inflammation (IBD/IBS)</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>Boswellia:</strong> 400mg 3x daily</li>
                  <li>• <strong>Turmeric:</strong> 500mg 3x daily</li>
                  <li>• <strong>Aloe Vera:</strong> 100-200ml juice daily</li>
                  <li>• <strong>Slippery Elm:</strong> 500mg 3x daily</li>
                  <li>• <strong>L-Glutamine:</strong> 5g 2x daily for healing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Chronic Pain & Muscle Soreness</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>Ginger:</strong> 1000mg 3x daily</li>
                  <li>• <strong>Turmeric:</strong> 1000mg 2x daily</li>
                  <li>• <strong>Bromelain:</strong> 500mg 3x between meals</li>
                  <li>• <strong>Quercetin:</strong> 500mg 2x daily</li>
                  <li>• <strong>Magnesium:</strong> 400mg for muscle relaxation</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Maximize Anti-Inflammatory Benefits</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Take with fat:</strong>
                    <p className="text-gray-700 dark:text-gray-300">Curcumin and other fat-soluble compounds absorb 2000% better with healthy fats (olive oil, avocado, nuts).</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Add black pepper:</strong>
                    <p className="text-gray-700 dark:text-gray-300">Piperine increases curcumin absorption by 2000%. Look for supplements that include it.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Combine herbs:</strong>
                    <p className="text-gray-700 dark:text-gray-300">Synergistic combinations (turmeric + ginger + black pepper) work better than single herbs.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Be consistent:</strong>
                    <p className="text-gray-700 dark:text-gray-300">Anti-inflammatory herbs work cumulatively. Take daily for 4-8 weeks for maximum benefits.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Anti-inflammatory diet:</strong>
                    <p className="text-gray-700 dark:text-gray-300">Herbs work best with diet rich in omega-3s, vegetables, berries. Avoid sugar, processed foods, trans fats.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-600 to-orange-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Reduce Inflammation, Transform Your Health</h2>
              <p className="mb-6 text-red-50">
                Get a personalized anti-inflammatory protocol based on your specific condition and symptoms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/smart-tools">
                  <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-red-50">
                    Get Custom Protocol
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