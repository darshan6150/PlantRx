import { BackButton } from "@/components/BackButton";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Moon, Star, Sun, Brain, Heart, ArrowRight, Check } from "lucide-react";

export default function NaturalSleepRemedies() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title="Sleep Better Naturally: Herbal Sleep Remedies That Actually Work | PlantRx"
        description="Discover natural sleep remedies backed by science. Learn how herbs like Valerian, Magnesium, and Chamomile improve sleep quality without prescription sleep aids."
        keywords="natural sleep remedies, herbs for sleep, insomnia natural treatment, sleep better naturally, herbal sleep aids, natural sleeping pills"
        canonical="https://plantrxapp.com/learn/natural-sleep-remedies"
        ogType="article"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        
        <article className="mt-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6">
              <Moon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Sleep Better Naturally: Herbal Sleep Remedies
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Science-backed natural solutions to fall asleep faster, sleep deeper, and wake up refreshed without prescription medications
            </p>
          </div>

          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">The Sleep Crisis & Why Natural Remedies Work</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Over 50 million Americans struggle with sleep disorders, yet prescription sleep medications come with serious risks: dependency, next-day drowsiness, impaired memory, and dangerous behaviors like sleep-walking. Natural sleep remedies offer a safer alternative that works with your body's own sleep mechanisms.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Quality sleep isn't a luxury—it's essential for immune function, cognitive performance, emotional regulation, and metabolic health. These evidence-based herbal remedies help restore healthy sleep patterns naturally.
              </p>
            </CardContent>
          </Card>

          {/* Top Sleep Herbs */}
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Most Effective Natural Sleep Remedies</h2>

          <Card className="mb-6 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">1. Magnesium Glycinate - The Relaxation Mineral</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Magnesium activates GABA receptors in the brain (the same ones targeted by sleep medications), promotes relaxation, and regulates melatonin. 75% of people are deficient, making this often the single most effective sleep aid.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> Studies show 500mg of magnesium taken before bed improves sleep quality, reduces time to fall asleep, and decreases nighttime waking. Glycinate form is best absorbed and least likely to cause digestive upset.
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 300-500mg magnesium glycinate 1-2 hours before bed. Start with 200mg and increase as needed. Effects improve over 2-4 weeks.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-l-4 border-l-indigo-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">2. L-Theanine - Calm Mind, Deep Sleep</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> This amino acid from green tea promotes alpha brain waves associated with relaxed alertness during the day and deeper sleep stages at night. It reduces racing thoughts without sedation.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> Clinical trials show 200mg of L-Theanine improves sleep quality scores by 35%, increases time in REM and deep sleep, and reduces sleep disturbances. Works synergistically with GABA and magnesium.
              </p>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 200-400mg 30-60 minutes before bed. Can also take 100mg during day for stress-related sleep issues.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">3. Valerian Root - Nature's Sedative</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Valerian increases GABA levels in the brain, producing calming effects similar to benzodiazepines but without dependency. It's particularly effective for stress-related insomnia and difficulty falling asleep.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> Meta-analysis of 18 studies found valerian significantly improves sleep quality and reduces time to fall asleep. Most effective when used consistently for 2-4 weeks.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 400-900mg standardized extract 30-120 minutes before bed. Works best with consistent use. Note: 10% of people experience stimulation rather than sedation.</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference Herbs */}
          <Card className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">More Proven Sleep Herbs</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">4. Chamomile</h3>
                    <p className="text-gray-700 dark:text-gray-300">Gentle GABA enhancer, reduces anxiety. Best as tea (2-3 cups before bed) or 400mg extract.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">5. Passionflower</h3>
                    <p className="text-gray-700 dark:text-gray-300">Increases sleep efficiency and reduces nighttime waking. 500mg extract or tea 1 hour before bed.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">6. Ashwagandha</h3>
                    <p className="text-gray-700 dark:text-gray-300">Reduces stress-related insomnia by lowering cortisol. 300mg in evening for stress-induced sleep problems.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">7. Lavender</h3>
                    <p className="text-gray-700 dark:text-gray-300">Aromatherapy or oral capsules reduce anxiety and improve sleep. 80-160mg lavender oil or diffuse essential oil.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">8. Melatonin (Natural Hormone)</h3>
                    <p className="text-gray-700 dark:text-gray-300">Regulates sleep-wake cycle. 0.5-3mg 1-2 hours before bed. Less is often more—start low.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sleep Stacks */}
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Optimized Sleep Supplement Stacks</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                  <Moon className="w-6 h-6 text-indigo-600 mr-2" />
                  Beginner Stack (Start Here)
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>8:00 PM:</strong> Magnesium Glycinate (400mg)</p>
                  <p><strong>9:00 PM:</strong> L-Theanine (200mg)</p>
                  <p><strong>9:30 PM:</strong> Chamomile tea</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 italic">
                  Safe, gentle, works for most people within 1-2 weeks
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                  <Star className="w-6 h-6 text-purple-600 mr-2" />
                  Advanced Stack (Chronic Insomnia)
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>7:00 PM:</strong> Ashwagandha (300mg)</p>
                  <p><strong>8:30 PM:</strong> Magnesium + L-Theanine</p>
                  <p><strong>9:00 PM:</strong> Valerian (600mg) + Passionflower (500mg)</p>
                  <p><strong>9:30 PM:</strong> Melatonin (1-3mg)</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 italic">
                  For severe sleep issues, combine multiple mechanisms
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sleep Hygiene */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                <Sun className="w-8 h-8 text-yellow-500 mr-3" />
                Amplify Results: Essential Sleep Hygiene
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Supplements work best when combined with proper sleep habits:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300"><strong>Consistent schedule:</strong> Same bedtime/wake time daily</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300"><strong>Cool temperature:</strong> 65-68°F optimal for sleep</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300"><strong>Complete darkness:</strong> Blackout curtains, no LED lights</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300"><strong>No screens 1-2 hours:</strong> Blue light blocks melatonin</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300"><strong>No caffeine after 2 PM:</strong> Half-life is 5-6 hours</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300"><strong>Light exercise:</strong> 30 min daily, but not within 3 hours of bed</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300"><strong>Wind-down routine:</strong> Same pre-bed ritual nightly</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300"><strong>Manage stress:</strong> Meditation, breathing exercises</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Troubleshooting Common Sleep Issues</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Can't Fall Asleep (Sleep Onset Insomnia)</h3>
                  <p className="text-gray-700 dark:text-gray-300">Best herbs: Melatonin, Valerian, Passionflower, L-Theanine. Take 1-2 hours before bed.</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Wake Up During Night (Sleep Maintenance Insomnia)</h3>
                  <p className="text-gray-700 dark:text-gray-300">Best herbs: Magnesium Glycinate, Ashwagandha, L-Theanine. Also check blood sugar (eat protein before bed).</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Early Morning Waking</h3>
                  <p className="text-gray-700 dark:text-gray-300">Often cortisol-related. Ashwagandha + Magnesium in evening. Get morning sunlight to reset circadian rhythm.</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Racing Thoughts</h3>
                  <p className="text-gray-700 dark:text-gray-300">L-Theanine (400mg) + Passionflower + meditation/breathing exercises 1 hour before bed.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Transform Your Sleep Tonight</h2>
              <p className="mb-6 text-indigo-50">
                Get a personalized sleep protocol based on your specific sleep issues and lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/smart-tools">
                  <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-indigo-50">
                    Get Sleep Protocol
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