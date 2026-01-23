import { BackButton } from "@/components/BackButton";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Sparkles, Heart, Leaf, Sun, Moon, ArrowRight, Check } from "lucide-react";

export default function NaturalSkinCare() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title="Skin Care Secrets: Natural Remedies for Glowing, Healthy Skin | PlantRx"
        description="Discover natural skin care remedies for acne, anti-aging, hyperpigmentation, and radiant skin. Science-backed herbs, supplements, and routines for every skin type."
        keywords="natural skin care, herbal skin remedies, acne natural treatment, anti-aging herbs, skin care routine, natural skin glow"
        canonical="https://plantrxapp.com/learn/natural-skin-care"
        ogType="article"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        
        <article className="mt-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Natural Skin Care Secrets for Radiant Skin
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Evidence-based natural remedies for acne, anti-aging, hydration, and achieving your healthiest, most radiant skin from within
            </p>
          </div>

          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">The Truth About Skin Health</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Your skin is your largest organ and a direct reflection of internal health. While topical products can help, truly radiant skin starts from within—proper nutrition, balanced hormones, gut health, and targeted herbal remedies address root causes rather than just masking symptoms.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Natural skin care works by supporting the body's own regeneration processes, reducing inflammation, balancing sebum production, and protecting against oxidative damage. The result? Clear, glowing skin without harsh chemicals or side effects.
              </p>
            </CardContent>
          </Card>

          {/* Acne Solutions */}
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Natural Acne Solutions That Work</h2>

          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">1. Zinc - The Acne Fighter</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Zinc regulates oil production, reduces inflammation, kills acne-causing bacteria, and supports skin healing. It's often more effective than topical treatments because it addresses internal causes.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> Studies show 30mg of zinc daily reduces inflammatory acne by 50% within 3 months. It's particularly effective for hormonal acne in women and inflammatory acne in men.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 30-40mg zinc picolinate or citrate daily with food. Take with copper (2-3mg) for long-term use to prevent deficiency.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">2. Spearmint Tea - Hormonal Acne Remedy</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Spearmint has anti-androgenic properties, meaning it reduces testosterone levels that trigger excess oil production and hormonal breakouts, especially along the jawline and chin.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> Clinical trials show 2 cups of spearmint tea daily reduces androgens by 30% and significantly improves hormonal acne in women within 30 days.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 2 cups organic spearmint tea daily (morning and evening). Takes 30-60 days for full effects.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">3. Probiotics - Gut-Skin Axis Healer</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> The gut-skin axis is real. Gut dysbiosis causes systemic inflammation that manifests as acne, rosacea, and eczema. Probiotics reduce inflammation and support skin barrier function.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> Studies show specific probiotic strains (Lactobacillus and Bifidobacterium) reduce acne lesions by 40-80% over 12 weeks by modulating inflammation and immune response.
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 10-25 billion CFU with diverse strains including L. acidophilus, L. rhamnosus, B. bifidum. Take daily on empty stomach.</p>
              </div>
            </CardContent>
          </Card>

          {/* Anti-Aging Section */}
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Anti-Aging & Skin Rejuvenation</h2>

          <Card className="mb-8 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-0">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white flex items-center">
                    <Sparkles className="w-6 h-6 text-pink-600 mr-2" />
                    4. Collagen Peptides - Wrinkle Reducer
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Boosts skin elasticity, reduces wrinkles by 20% in 8 weeks, and increases hydration. Your body's collagen production drops 1% yearly after age 25.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Dosage:</strong> 10-15g hydrolyzed collagen daily, ideally with vitamin C for absorption</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white flex items-center">
                    <Heart className="w-6 h-6 text-red-600 mr-2" />
                    5. Astaxanthin - "Internal Sunscreen"
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Powerful antioxidant that protects skin from UV damage, reduces fine lines, and improves skin moisture and elasticity. 6000x stronger than vitamin C.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Dosage:</strong> 4-12mg daily with fatty meal. Takes 4-6 weeks for visible anti-aging effects</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white flex items-center">
                    <Leaf className="w-6 h-6 text-green-600 mr-2" />
                    6. Gotu Kola - Collagen Synthesizer
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Increases collagen production, speeds wound healing, reduces scarring, and improves skin firmness. Traditional Ayurvedic anti-aging herb.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Dosage:</strong> 500-1000mg extract or 2-3 cups tea daily. Effects visible in 2-3 months</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white flex items-center">
                    <Sun className="w-6 h-6 text-yellow-600 mr-2" />
                    7. Vitamin C (Ascorbic Acid)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Essential for collagen synthesis, brightens skin, reduces hyperpigmentation, and protects against free radical damage. Works synergistically with collagen.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Dosage:</strong> 1000-2000mg daily, split doses. Topical vitamin C serum (10-20%) amplifies effects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skin Type Routines */}
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Personalized Routines by Skin Concern</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Acne-Prone Skin Protocol</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Morning:</strong> Zinc (30mg) + Probiotics</p>
                  <p><strong>Throughout Day:</strong> 2 cups spearmint tea</p>
                  <p><strong>Evening:</strong> Omega-3 (1000mg EPA/DHA)</p>
                  <p><strong>Topical:</strong> Tea tree oil (diluted) or niacinamide serum</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 italic">Add: Low-glycemic diet, eliminate dairy for 4 weeks trial</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Anti-Aging Protocol</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Morning:</strong> Vitamin C (1000mg) + Astaxanthin (6mg)</p>
                  <p><strong>Anytime:</strong> Collagen (10-15g in smoothie/coffee)</p>
                  <p><strong>Evening:</strong> Gotu Kola (500mg) + Resveratrol (200mg)</p>
                  <p><strong>Topical:</strong> Retinol or bakuchiol serum + vitamin C</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 italic">Add: Daily sunscreen (SPF 30+), increase antioxidant-rich foods</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Dry/Dehydrated Skin Protocol</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Morning:</strong> Hyaluronic acid (100-200mg)</p>
                  <p><strong>Daily:</strong> Collagen (15g) + Omega-3 (2000mg)</p>
                  <p><strong>Evening:</strong> Evening Primrose Oil (1000mg)</p>
                  <p><strong>Topical:</strong> Hyaluronic acid serum + rich moisturizer</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 italic">Add: Drink 2-3L water daily, use humidifier in dry climates</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Hyperpigmentation Protocol</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Morning:</strong> Vitamin C (2000mg split dose)</p>
                  <p><strong>Daily:</strong> Glutathione (500mg) + Alpha Lipoic Acid (300mg)</p>
                  <p><strong>Evening:</strong> Turmeric (500mg) + Niacinamide (500mg)</p>
                  <p><strong>Topical:</strong> Vitamin C serum + niacinamide + SPF</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 italic">Critical: Daily broad-spectrum SPF 50, avoid sun exposure</p>
              </CardContent>
            </Card>
          </div>

          {/* Lifestyle Factors */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Essential Lifestyle Factors for Radiant Skin</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-pink-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Hydration:</strong>
                      <p className="text-sm text-gray-700 dark:text-gray-300">2-3L water daily, more if exercising. Add lemon for vitamin C.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-pink-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Sleep:</strong>
                      <p className="text-sm text-gray-700 dark:text-gray-300">7-9 hours nightly. Skin repairs and regenerates during deep sleep.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-pink-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Anti-Inflammatory Diet:</strong>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Rich in omega-3s, colorful vegetables, berries. Limit sugar and dairy.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-pink-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Sun Protection:</strong>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Daily SPF 30-50, reapply every 2 hours. UV damage is #1 skin ager.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-pink-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Stress Management:</strong>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Chronic stress elevates cortisol, triggering breakouts and accelerating aging.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-pink-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Gentle Skincare:</strong>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Avoid harsh scrubs, over-washing. Double cleanse, moisturize, protect.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-br from-pink-600 to-rose-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Unlock Your Skin's Natural Radiance</h2>
              <p className="mb-6 text-pink-50">
                Get a personalized skin care protocol tailored to your specific skin type and concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/smart-tools">
                  <Button size="lg" variant="secondary" className="bg-white text-pink-600 hover:bg-pink-50">
                    Get Custom Skin Protocol
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