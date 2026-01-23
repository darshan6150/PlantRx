import { BackButton } from "@/components/BackButton";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, Star, Heart, Sparkles, Sun, ArrowRight, Check } from "lucide-react";

export default function ImmuneSystemBoost() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title="Boost Your Immune System Naturally: Complete Guide to Immunity | PlantRx"
        description="Comprehensive guide to strengthening your immune system naturally. Learn about herbs, vitamins, lifestyle changes, and proven protocols for optimal immunity."
        keywords="boost immune system, strengthen immunity naturally, immune support herbs, immunity boosting vitamins, natural immune system, how to boost immunity"
        canonical="https://plantrxapp.com/learn/boost-immune-system"
        ogType="article"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        
        <article className="mt-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Boost Your Immune System Naturally
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Complete evidence-based guide to strengthening your body's defenses through herbs, nutrition, lifestyle, and proven immune-boosting protocols
            </p>
          </div>

          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Understanding Your Immune System</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Your immune system is your body's sophisticated defense network, comprising white blood cells, antibodies, lymph nodes, bone marrow, and specialized organs. It has two main branches: innate immunity (immediate response) and adaptive immunity (targeted, long-lasting protection).
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                A strong immune system doesn't just fight infections—it prevents chronic disease, supports faster recovery, reduces inflammation, and even slows aging. The key to robust immunity is supporting your immune cells through proper nutrition, targeted herbs, quality sleep, stress management, and healthy lifestyle habits.
              </p>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Essential Immune-Boosting Nutrients</h2>

          <Card className="mb-6 border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">1. Vitamin D - The Immune Regulator</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Vitamin D activates T-cells (immune system warriors), increases antimicrobial peptides, and modulates inflammatory response. Deficiency dramatically increases infection risk and autoimmune disease.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> Studies show adequate vitamin D reduces respiratory infections by 50%, flu risk by 40%, and severe COVID-19 outcomes by 80%. 75% of people are deficient.
              </p>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 2000-5000 IU daily (test levels—aim for 50-80 ng/mL). Take with fat for absorption. Higher doses (10,000 IU) during illness.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">2. Vitamin C - Antioxidant Powerhouse</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Vitamin C stimulates white blood cell production, enhances their function, acts as powerful antioxidant protecting immune cells, and helps produce interferons (antiviral proteins).
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> High-dose vitamin C reduces cold duration by 14-18%, prevents colds in people under physical stress by 50%, and supports faster recovery from respiratory infections.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 1000-2000mg daily (split doses for better absorption). During illness: 1000mg every 2-3 hours up to 6000mg daily.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">3. Zinc - Immune Cell Activator</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Zinc is required for immune cell development and function. It activates T-cells, supports antibody production, and has direct antiviral properties by blocking viral replication.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> Zinc reduces cold duration by 33%, decreases infection severity, and supports faster wound healing. Deficiency impairs all aspects of immunity.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 30-40mg daily for maintenance. During illness: 75-100mg daily for 5-7 days. Take with food to avoid nausea. Add 2-3mg copper for long-term use.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">More Critical Immune Nutrients</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">4. Selenium</h3>
                    <p className="text-gray-700 dark:text-gray-300">Essential for T-cell function and natural killer cell activity. 200mcg daily. Deficiency linked to increased viral mutations and severity.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">5. Vitamin A (Retinol)</h3>
                    <p className="text-gray-700 dark:text-gray-300">Maintains mucosal barriers (first line of defense). 5000-10,000 IU daily or get from liver, eggs, dairy. Beta-carotene doesn't convert well for many people.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">6. Probiotics</h3>
                    <p className="text-gray-700 dark:text-gray-300">70% of immune system is in the gut. Probiotics train immune cells and reduce infections by 20-40%. 25-50 billion CFU daily with diverse strains.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">7. Omega-3 Fatty Acids</h3>
                    <p className="text-gray-700 dark:text-gray-300">Resolve inflammation and support immune cell membranes. 2000-3000mg EPA/DHA daily. Essential for balanced immunity.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Top Immune-Boosting Herbs (Already Covered in Detail)</h2>
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We've covered the most powerful immune-boosting herbs in detail in our dedicated article. Here's a quick reference:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">• <strong>Echinacea:</strong> 900-1500mg during illness</p>
                  <p className="text-gray-700 dark:text-gray-300">• <strong>Elderberry:</strong> 15ml syrup 4x daily</p>
                  <p className="text-gray-700 dark:text-gray-300">• <strong>Astragalus:</strong> 500-1000mg 2x daily</p>
                  <p className="text-gray-700 dark:text-gray-300">• <strong>Reishi Mushroom:</strong> 1-1.5g daily</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">• <strong>Ginger:</strong> 1-2g fresh daily</p>
                  <p className="text-gray-700 dark:text-gray-300">• <strong>Garlic:</strong> 2-3 raw cloves or 600mg aged extract</p>
                  <p className="text-gray-700 dark:text-gray-300">• <strong>Turmeric:</strong> 500-1000mg with black pepper</p>
                  <p className="text-gray-700 dark:text-gray-300">• <strong>Cat's Claw:</strong> 250-350mg daily</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/learn/immunity-boosting-herbs">
                  <Button variant="outline" size="sm">
                    Read Full Herb Guide
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Complete Immune-Boosting Protocols</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                  <Shield className="w-6 h-6 text-green-600 mr-2" />
                  Daily Prevention Protocol
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Morning:</strong> Vitamin D (5000 IU) + Vitamin C (1000mg) + Probiotics</p>
                  <p><strong>With meals:</strong> Zinc (30mg) + Omega-3 (2000mg)</p>
                  <p><strong>Evening:</strong> Vitamin C (1000mg) + Astragalus (500mg)</p>
                  <p><strong>Daily:</strong> 7-9 hours sleep, 30min exercise, stress management</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                  <Star className="w-6 h-6 text-red-600 mr-2" />
                  Acute Infection Protocol
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>First 24-48h:</strong> Vitamin C (1000mg every 2h) + Zinc (75mg) + Elderberry (4x daily)</p>
                  <p><strong>Day 1-7:</strong> Echinacea (1500mg) + Vitamin D (10,000 IU) + Quercetin (1000mg)</p>
                  <p><strong>Throughout:</strong> Rest, hydrate (3L+ water), bone broth, garlic</p>
                  <p><strong>Recovery:</strong> Continue probiotics, lower doses 2 more weeks</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                <Sun className="w-8 h-8 text-yellow-500 mr-3" />
                Lifestyle Factors That Strengthen Immunity
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Quality Sleep (7-9 hours):</strong>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Sleep deprivation reduces T-cells by 70%. Each hour of sleep lost increases cold risk by 30%.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Regular Exercise (30min daily):</strong>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Moderate exercise boosts immune function. Intense exercise temporarily suppresses it—balance is key.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Stress Management:</strong>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Chronic stress elevates cortisol, suppressing immunity. Practice meditation, breathing exercises, or adaptogens.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Nutrient-Dense Diet:</strong>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Colorful vegetables, berries, mushrooms, garlic, ginger. Avoid sugar (suppresses white blood cells for 5+ hours).</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Sunlight Exposure:</strong>
                      <p className="text-sm text-gray-700 dark:text-gray-300">15-30 minutes daily for vitamin D production. Essential for T-cell activation and antimicrobial peptides.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-cyan-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-900 dark:text-white">Cold Exposure:</strong>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Cold showers or ice baths increase white blood cells and activate brown fat. Start slow—30 seconds cold water.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Special Considerations</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold mb-1 text-gray-900 dark:text-white">Autoimmune Conditions:</h3>
                  <p className="text-gray-700 dark:text-gray-300">Focus on immune-modulating herbs (astragalus, medicinal mushrooms) rather than stimulating ones (echinacea). Prioritize gut health and vitamin D.</p>
                </div>
                <div>
                  <h3 className="font-bold mb-1 text-gray-900 dark:text-white">Elderly (65+):</h3>
                  <p className="text-gray-700 dark:text-gray-300">Higher doses of vitamin D (5000 IU), zinc (40mg), and vitamin C (2000mg) daily. Immune function naturally declines—supplementation critical.</p>
                </div>
                <div>
                  <h3 className="font-bold mb-1 text-gray-900 dark:text-white">Athletes & High Stress:</h3>
                  <p className="text-gray-700 dark:text-gray-300">Add adaptogens (ashwagandha, rhodiola), increase vitamin C (3000mg), and prioritize recovery. Intense training temporarily suppresses immunity.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Build Unshakeable Immunity</h2>
              <p className="mb-6 text-cyan-50">
                Get a personalized immune-boosting protocol tailored to your health status and lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/smart-tools">
                  <Button size="lg" variant="secondary" className="bg-white text-cyan-600 hover:bg-cyan-50">
                    Get Custom Immune Protocol
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