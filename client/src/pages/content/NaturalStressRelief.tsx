import { BackButton } from "@/components/BackButton";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Brain, Heart, Leaf, Sparkles, Coffee, Moon, ArrowRight, Check } from "lucide-react";

export default function NaturalStressRelief() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title="Natural Stress Relief: 7 Proven Herbal Solutions That Work | PlantRx"
        description="Discover 7 scientifically-backed natural stress relief remedies. Learn how herbs like Ashwagandha, Holy Basil, and Rhodiola reduce cortisol and calm anxiety naturally."
        keywords="natural stress relief, herbs for stress, anxiety natural remedies, stress reduction herbs, cortisol lowering herbs, natural anxiety relief"
        canonical="https://plantrxapp.com/learn/natural-stress-relief"
        ogType="article"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        
        <article className="mt-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Natural Stress Relief: 7 Proven Herbal Solutions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Science-backed herbs that reduce cortisol, calm anxiety, and help you manage stress naturally without prescription medications
            </p>
          </div>

          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Understanding Stress and the Body</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Chronic stress isn't just uncomfortable—it's damaging. When you're stressed, your body releases cortisol and adrenaline, triggering the fight-or-flight response. While this is helpful in short bursts, prolonged activation leads to inflammation, weakened immunity, digestive issues, anxiety, insomnia, and increased disease risk.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Natural stress relief herbs work differently than prescription anti-anxiety medications. Rather than suppressing symptoms, they help regulate your stress response system at its source—the hypothalamic-pituitary-adrenal (HPA) axis. These herbs are called adaptogens, and they help your body adapt to stress more effectively.
              </p>
            </CardContent>
          </Card>

          {/* Remedy 1 */}
          <Card className="mb-6 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">1. Ashwagandha - The Stress Destroyer</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Ashwagandha (Withania somnifera) is one of the most studied adaptogens. It reduces cortisol levels by up to 30%, regulates the HPA axis, and increases GABA activity in the brain—the neurotransmitter responsible for calming neural activity.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Clinical evidence:</strong> A 2019 study of chronically stressed adults found that 600mg of ashwagandha daily for 8 weeks significantly reduced stress levels, anxiety scores, and cortisol. Participants also reported better sleep and improved quality of life.
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 300-600mg standardized extract (5% withanolides) once or twice daily. Take with food. Effects typically noticed within 2-4 weeks.</p>
              </div>
            </CardContent>
          </Card>

          {/* Remedy 2 */}
          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">2. Holy Basil (Tulsi) - The Adaptogenic Healer</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Holy Basil contains ursolic acid and rosmarinic acid that lower cortisol and reduce oxidative stress. It also balances neurotransmitters including serotonin and dopamine, improving mood alongside stress reduction.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Clinical evidence:</strong> Research shows Holy Basil reduces anxiety by 39% and stress by 32% after 60 days of use. It's particularly effective for stress-related symptoms like forgetfulness, exhaustion, and sleep disturbances.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 300-600mg standardized extract daily, or 2-3 cups of tulsi tea. Can be taken long-term safely.</p>
              </div>
            </CardContent>
          </Card>

          {/* Remedy 3 */}
          <Card className="mb-6 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">3. Rhodiola Rosea - Energy Without Anxiety</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Unlike many calming herbs, Rhodiola reduces stress while boosting energy and mental clarity. It works by optimizing neurotransmitter levels and protecting cells from stress-induced damage. Rhodiola is ideal for people experiencing burnout and fatigue.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Clinical evidence:</strong> Studies show Rhodiola improves stress symptoms, fatigue, and cognitive function within just 3 days to 2 weeks. It's particularly effective for stress-related exhaustion and concentration problems.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 200-400mg standardized extract (3% rosavins, 1% salidroside) in the morning. Avoid taking in evening as it can be energizing.</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference for 4-7 */}
          <Card className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">4 More Powerful Stress-Relief Herbs</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">4. L-Theanine (from Green Tea)</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">Promotes alpha brain waves that induce relaxation without drowsiness. Reduces stress and anxiety within 30-40 minutes. Perfect for acute stress situations.</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Dosage:</strong> 200-400mg as needed, or 2-3 cups of green tea daily</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">5. Lemon Balm</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">Binds to GABA receptors, producing immediate calming effects. Reduces anxiety and nervousness while improving mood. Also helps with stress-related digestive issues.</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Dosage:</strong> 300-600mg extract or tea 2-3 times daily</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">6. Magnesium Glycinate</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">Essential mineral that regulates stress response. 75% of people are deficient. Calms the nervous system, reduces muscle tension, and improves sleep quality.</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Dosage:</strong> 300-400mg in evening for relaxation and sleep support</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">7. Passionflower</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">Increases GABA in the brain, reducing anxiety and racing thoughts. Clinical studies show it's as effective as benzodiazepines for anxiety but without dependency or side effects.</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Dosage:</strong> 500mg extract or 1 cup of tea 1-3 times daily</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Creating Your Stress Protocol */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Creating Your Personal Stress-Relief Protocol</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white flex items-center">
                    <Coffee className="w-6 h-6 text-green-600 mr-2" />
                    For Daytime Stress & Anxiety
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span><strong>Morning:</strong> Ashwagandha (300mg) + Rhodiola (200mg)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span><strong>Midday:</strong> Holy Basil tea + L-Theanine (200mg as needed)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span><strong>Afternoon:</strong> Lemon Balm (300mg) if anxiety persists</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white flex items-center">
                    <Moon className="w-6 h-6 text-indigo-600 mr-2" />
                    For Evening Relaxation & Sleep
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span><strong>6-7 PM:</strong> Passionflower tea or extract (500mg)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span><strong>8-9 PM:</strong> Magnesium Glycinate (400mg) + Lemon Balm</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span><strong>Before bed:</strong> Chamomile tea for final wind-down</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border-l-4 border-yellow-400">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Important:</strong> Start with one herb and add others gradually. Give each herb 2-4 weeks to assess effectiveness. Combine herbs strategically—adaptogens in morning, calming herbs in evening.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle Integration */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Maximize Results: Combine with Lifestyle Changes</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Herbs work best when combined with stress-reducing lifestyle practices:
              </p>
              <ul className="grid md:grid-cols-2 gap-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <Sparkles className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Deep breathing:</strong> 5-10 minutes daily activates parasympathetic nervous system</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Regular exercise:</strong> 30 minutes most days reduces cortisol by 25%</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Quality sleep:</strong> 7-9 hours nightly is essential for stress recovery</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>Limit caffeine:</strong> Excess caffeine elevates cortisol and anxiety</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Start Managing Stress Naturally Today</h2>
              <p className="mb-6 text-purple-50">
                Explore our complete stress relief remedy database with personalized recommendations based on your symptoms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/remedies">
                  <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-purple-50">
                    Find Your Stress Solution
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