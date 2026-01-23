import { BackButton } from "@/components/BackButton";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Shield, Zap, Leaf, ArrowRight, Check, AlertCircle } from "lucide-react";

export default function NaturalPainRelief() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title="Natural Pain Relief: Herbal Alternatives to Prescription Painkillers | PlantRx"
        description="Discover effective natural pain relief remedies. Learn how herbs like White Willow Bark, CBD, and Capsaicin provide safe alternatives to NSAIDs and opioids."
        keywords="natural pain relief, herbal pain remedies, alternatives to ibuprofen, natural painkillers, chronic pain herbs, pain management natural"
        canonical="https://plantrxapp.com/learn/natural-pain-relief"
        ogType="article"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        
        <article className="mt-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full mb-6">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Natural Pain Relief: Herbal Alternatives
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Evidence-based herbal remedies that provide effective pain relief without the risks of NSAIDs, acetaminophen, or opioid medications
            </p>
          </div>

          <Card className="mb-8 border-0 shadow-lg bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Important: The Pain Medication Crisis</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Over 100,000 Americans are hospitalized yearly from NSAID complications (stomach ulcers, kidney damage, heart problems). Acetaminophen is the leading cause of acute liver failure. Opioids have created a devastating addiction epidemic. Natural alternatives offer real pain relief without these serious risks.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">How Natural Pain Relief Works</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Pain is your body's alarm system, but chronic pain serves no protective purpose—it's simply suffering. Natural pain relievers work through multiple mechanisms: blocking pain-causing enzymes (COX-2, LOX), reducing inflammatory molecules, modulating pain receptors, and supporting the body's own endorphin production.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Unlike prescription painkillers that merely mask symptoms, many natural remedies address root causes of pain like inflammation, nerve damage, or tissue injury while providing symptomatic relief.
              </p>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Most Effective Natural Pain Relievers</h2>

          <Card className="mb-6 border-l-4 border-l-teal-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">1. White Willow Bark - Nature's Aspirin</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Contains salicin, which converts to salicylic acid (same as aspirin) in the body. Blocks COX enzymes to reduce pain and inflammation. Used for over 2,400 years for pain relief.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> Studies show white willow bark is as effective as aspirin for back pain, osteoarthritis, and headaches. It works more slowly (1-2 hours) but lasts longer and causes fewer stomach issues than aspirin.
              </p>
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 240-480mg standardized extract (15% salicin) 2-3 times daily. For acute pain, take 480mg every 4-6 hours. Avoid if allergic to aspirin.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">2. CBD (Cannabidiol) - Multi-Mechanism Pain Fighter</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> CBD activates serotonin receptors (reducing pain perception), binds to TRPV1 receptors (blocking pain signals), and reduces inflammatory molecules. Works for both neuropathic and inflammatory pain.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> Clinical trials show CBD reduces chronic pain by 30-50%, improves sleep quality, and works especially well for nerve pain, arthritis, and fibromyalgia. No addiction potential or serious side effects.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> Start with 20-40mg CBD daily, increase by 5-10mg every 3 days until pain relief achieved. Typical effective dose: 40-160mg daily. Use full-spectrum CBD oil for best results.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">3. Turmeric (Curcumin) - Inflammation & Pain Reducer</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>How it works:</strong> Blocks inflammatory pathways (NF-kappa B, COX-2, LOX) and reduces pain-causing cytokines. Particularly effective for arthritis, joint pain, and post-surgical pain.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Research:</strong> Multiple studies show curcumin is as effective as ibuprofen for arthritis pain (reducing pain by 50-58%) but without gastric side effects. Also reduces muscle soreness and accelerates recovery.
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Dosage:</strong> 500-1000mg curcumin (95% curcuminoids) 2-3 times daily with black pepper and fat. Higher doses (up to 2000mg 3x daily) used for severe pain.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">More Proven Pain Relief Herbs</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">4. Capsaicin (from Chili Peppers)</h3>
                    <p className="text-gray-700 dark:text-gray-300">Depletes Substance P (pain neurotransmitter) from nerve endings. Highly effective for neuropathic pain, arthritis, and shingles. Use 0.025-0.075% topical cream 3-4 times daily.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Heart className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">5. Boswellia (Frankincense)</h3>
                    <p className="text-gray-700 dark:text-gray-300">Blocks inflammatory leukotrienes. Excellent for arthritis pain—reduces pain by 65% in studies. 300-500mg standardized extract 2-3 times daily.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Leaf className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">6. Devil's Claw</h3>
                    <p className="text-gray-700 dark:text-gray-300">Traditional African remedy for back pain and arthritis. Studies show similar effectiveness to NSAIDs. 600-2400mg daily (50-100mg harpagoside per dose).</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Zap className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">7. Arnica Montana</h3>
                    <p className="text-gray-700 dark:text-gray-300">Topical remedy for bruising, sprains, and muscle pain. Reduces pain and swelling by 50% faster than placebo. Apply gel/cream 3-4 times daily.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">8. PEA (Palmitoylethanolamide)</h3>
                    <p className="text-gray-700 dark:text-gray-300">Body's own anti-inflammatory lipid. Excellent for nerve pain and chronic pain conditions. 300-600mg 2x daily. Takes 4-6 weeks for full effects.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Pain-Specific Natural Protocols</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Headaches & Migraines</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>Feverfew:</strong> 100-150mg daily (prevents migraines)</li>
                  <li>• <strong>Ginger:</strong> 500mg at first sign (as effective as sumatriptan)</li>
                  <li>• <strong>Magnesium:</strong> 400-600mg daily (reduces frequency 41%)</li>
                  <li>• <strong>Peppermint oil:</strong> Apply topically to temples</li>
                  <li>• <strong>Riboflavin (B2):</strong> 400mg daily for prevention</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Arthritis & Joint Pain</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>Turmeric:</strong> 1000mg 3x daily</li>
                  <li>• <strong>Boswellia:</strong> 400mg 3x daily</li>
                  <li>• <strong>CBD:</strong> 40-80mg daily</li>
                  <li>• <strong>Glucosamine + Chondroitin:</strong> 1500mg/1200mg daily</li>
                  <li>• <strong>Omega-3:</strong> 2000mg EPA/DHA for inflammation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Nerve Pain (Neuropathy)</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>CBD:</strong> 80-160mg daily</li>
                  <li>• <strong>Alpha-Lipoic Acid:</strong> 600mg daily</li>
                  <li>• <strong>Capsaicin cream:</strong> 0.075% 4x daily</li>
                  <li>• <strong>PEA:</strong> 600mg 2x daily</li>
                  <li>• <strong>B-Complex:</strong> High-dose (especially B12, B6)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Muscle Pain & Fibromyalgia</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>Magnesium Glycinate:</strong> 400-600mg daily</li>
                  <li>• <strong>CBD:</strong> 40-120mg daily</li>
                  <li>• <strong>D-Ribose:</strong> 5g 3x daily (energy & pain)</li>
                  <li>• <strong>5-HTP:</strong> 100-300mg (improves pain tolerance)</li>
                  <li>• <strong>Turmeric:</strong> 1000mg 2x daily</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Combining Natural Pain Relievers Safely</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Synergistic combinations work best:</strong>
                    <p className="text-gray-700 dark:text-gray-300">Example: Turmeric + Ginger + Black Pepper provides multi-pathway pain relief more effective than any single herb.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Layer acute and chronic remedies:</strong>
                    <p className="text-gray-700 dark:text-gray-300">Use fast-acting remedies (ginger, white willow) for flare-ups alongside daily anti-inflammatory herbs (turmeric, omega-3).</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Give herbs time to work:</strong>
                    <p className="text-gray-700 dark:text-gray-300">Some work within hours (ginger, CBD), others need 4-8 weeks for full effects (turmeric, boswellia). Be patient and consistent.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Address root causes:</strong>
                    <p className="text-gray-700 dark:text-gray-300">Pain is often inflammation, poor circulation, or nutrient deficiency. Fix underlying issues, not just symptoms.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Monitor and adjust:</strong>
                    <p className="text-gray-700 dark:text-gray-300">Track pain levels (1-10 scale) and functional improvement. Adjust dosages and combinations based on response.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-600 to-cyan-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Find Your Natural Pain Solution</h2>
              <p className="mb-6 text-teal-50">
                Get a personalized pain relief protocol based on your specific pain type and medical history.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/smart-tools">
                  <Button size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-teal-50">
                    Get Pain Relief Protocol
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