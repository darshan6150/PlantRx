import { BackButton } from "@/components/BackButton";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Leaf, Sun, Moon, Clock, Coffee, Heart, ArrowRight, CheckSquare } from "lucide-react";

export default function HerbalRoutineGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title="Guide: Building Your Own Herbal Routine for Optimal Health | PlantRx"
        description="Learn how to create a personalized herbal routine that fits your lifestyle. Expert guide on timing, dosages, herb combinations, and building sustainable natural health habits."
        keywords="herbal routine guide, how to take herbs, herbal supplement schedule, natural remedy routine, herb timing, herbal wellness routine"
        canonical="https://plantrxapp.com/learn/herbal-routine-guide"
        ogType="article"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        
        <article className="mt-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-yellow-600 rounded-full mb-6">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              Building Your Own Herbal Routine
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              A complete guide to creating a sustainable, effective herbal wellness routine that works with your unique lifestyle and health goals
            </p>
          </div>

          {/* Introduction */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-lg">
                Creating an herbal routine isn't about taking every supplement you find—it's about strategically choosing herbs that address your specific needs and integrating them into your life in a sustainable way. The most effective herbal routine is one you'll actually stick with.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                This guide will help you build a personalized herbal protocol that maximizes benefits while fitting seamlessly into your daily life.
              </p>
            </CardContent>
          </Card>

          {/* Step 1 */}
          <Card className="mb-6 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <CheckSquare className="w-7 h-7 text-green-600 mr-3" />
                Step 1: Identify Your Health Goals
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Before selecting herbs, get clear on what you want to achieve. Be specific. Instead of "better health," aim for concrete goals like "reduce stress and improve sleep quality" or "support digestion and boost energy levels."
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Common Health Goals & Herb Categories:</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>Energy & Focus:</strong> Adaptogens, B-vitamins, green tea</li>
                  <li>• <strong>Stress & Anxiety:</strong> Ashwagandha, Holy Basil, Lemon Balm</li>
                  <li>• <strong>Sleep:</strong> Chamomile, Valerian, Passionflower</li>
                  <li>• <strong>Immunity:</strong> Echinacea, Elderberry, Astragalus</li>
                  <li>• <strong>Digestion:</strong> Ginger, Peppermint, Fennel</li>
                  <li>• <strong>Inflammation:</strong> Turmeric, Boswellia, Ginger</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <CheckSquare className="w-7 h-7 text-blue-600 mr-3" />
                Step 2: Choose Your Core Herbs (3-5 Maximum)
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Start with 3-5 herbs that directly address your primary goals. More isn't better—it's harder to track what works and increases the risk of interactions. Build your foundation first, then adjust.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Example Core Stack for Stress & Energy:</h3>
                <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>1. <strong>Ashwagandha:</strong> Primary adaptogen for stress (morning)</li>
                  <li>2. <strong>Rhodiola:</strong> Energy and mental clarity (morning)</li>
                  <li>3. <strong>Magnesium Glycinate:</strong> Relaxation and sleep (evening)</li>
                  <li>4. <strong>Holy Basil:</strong> Stress support throughout day (split dose)</li>
                </ol>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                Pro Tip: Choose one primary herb for each goal, rather than multiple herbs targeting the same issue.
              </p>
            </CardContent>
          </Card>

          {/* Timing Schedule */}
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Optimal Timing for Maximum Benefits</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-0">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Sun className="w-8 h-8 text-orange-500 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Morning (6-9 AM)</h3>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>✓ Adaptogens (Ashwagandha, Rhodiola)</li>
                  <li>✓ Energy herbs (Ginseng, Maca)</li>
                  <li>✓ Cognitive support (Lion's Mane, Bacopa)</li>
                  <li>✓ Vitamin D (if supplementing)</li>
                  <li>✓ Probiotics (empty stomach)</li>
                </ul>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  <strong>Why:</strong> Cortisol naturally peaks in morning; adaptogens work best with this rhythm
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Coffee className="w-8 h-8 text-purple-500 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Midday (12-3 PM)</h3>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>✓ Digestive enzymes (with meals)</li>
                  <li>✓ Turmeric/anti-inflammatories</li>
                  <li>✓ B-complex vitamins</li>
                  <li>✓ Iron (separate from calcium)</li>
                  <li>✓ Holy Basil (stress support)</li>
                </ul>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  <strong>Why:</strong> Peak digestive capacity; good time for nutrients needing absorption
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-0">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Moon className="w-8 h-8 text-indigo-500 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Evening (6-10 PM)</h3>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>✓ Sleep herbs (Chamomile, Valerian)</li>
                  <li>✓ Magnesium (relaxation)</li>
                  <li>✓ Calcium (evening best)</li>
                  <li>✓ Melatonin (if needed, 1-2h before bed)</li>
                  <li>✓ Passionflower, L-theanine</li>
                </ul>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  <strong>Why:</strong> Supports natural wind-down; prepares body for restorative sleep
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Combination Rules */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Smart Herb Combinations & What to Avoid</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">✓ Synergistic Pairs</h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Turmeric + Black Pepper (2000% better absorption)</li>
                    <li>• Ashwagandha + Rhodiola (complementary stress support)</li>
                    <li>• Elderberry + Echinacea (enhanced immunity)</li>
                    <li>• Magnesium + Vitamin D (bone health)</li>
                    <li>• Ginger + Turmeric (anti-inflammatory boost)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-3">✗ Avoid Combining</h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Stimulating herbs at night (ginseng, rhodiola)</li>
                    <li>• Sedatives in morning (valerian, kava)</li>
                    <li>• Calcium + Iron (compete for absorption)</li>
                    <li>• Multiple blood thinners (garlic + ginkgo)</li>
                    <li>• St. John's Wort + most medications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Routines */}
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Sample Daily Routines</h2>

          <div className="space-y-6 mb-8">
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Stress & Energy Routine</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>7:00 AM:</strong> Ashwagandha (300mg) + Rhodiola (200mg) + B-Complex</p>
                  <p><strong>12:00 PM:</strong> Holy Basil tea + Turmeric (500mg with black pepper)</p>
                  <p><strong>3:00 PM:</strong> L-Theanine (200mg) for afternoon calm</p>
                  <p><strong>9:00 PM:</strong> Magnesium Glycinate (400mg) + Chamomile tea</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Immunity & Gut Health Routine</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>7:00 AM:</strong> Probiotics (empty stomach) + Vitamin D</p>
                  <p><strong>8:00 AM (with breakfast):</strong> Elderberry + Astragalus</p>
                  <p><strong>12:00 PM (with lunch):</strong> Digestive enzymes + Ginger</p>
                  <p><strong>6:00 PM (with dinner):</strong> Turmeric + Quercetin</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tracking & Adjustment */}
          <Card className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Track Progress & Adjust</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Give each herb at least 2-4 weeks before evaluating effectiveness. Some adaptogens take 6-8 weeks for full benefits. Keep a simple journal tracking:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 ml-6">
                <li>• Energy levels (1-10 scale, AM and PM)</li>
                <li>• Sleep quality and duration</li>
                <li>• Stress/anxiety levels</li>
                <li>• Digestive comfort</li>
                <li>• Any side effects or changes</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Adjust dosages or timing based on your response. If an herb isn't working after 6-8 weeks, consider replacing it.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Start Your Personalized Herbal Journey</h2>
              <p className="mb-6 text-green-50">
                Use our Smart Tools to get a customized herbal protocol based on your specific health goals and lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/smart-tools">
                  <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-green-50">
                    Get Custom Protocol
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/remedies">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                    Browse All Remedies
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