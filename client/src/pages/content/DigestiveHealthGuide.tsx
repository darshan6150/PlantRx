import { BackButton } from "@/components/BackButton";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Leaf, Heart, Shield, Sparkles, ArrowRight, Activity } from "lucide-react";

export default function DigestiveHealthGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title="Digestive Health Guide: Plant-Based Solutions for Gut Wellness | PlantRx"
        description="Comprehensive guide to improving digestive health naturally. Learn about herbs, supplements, and lifestyle changes for bloating, IBS, acid reflux, and optimal gut health."
        keywords="digestive health herbs, gut health remedies, natural digestion support, bloating remedies, IBS natural treatment, gut healing herbs"
        canonical="https://plantrxapp.com/learn/digestive-health-guide"
        ogType="article"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        
        <article className="mt-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full mb-6">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Complete Guide to Digestive Health
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Plant-based solutions for optimal gut health, from bloating and IBS to acid reflux and complete digestive wellness
            </p>
          </div>

          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Why Gut Health Matters</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Your digestive system isn't just about breaking down food—it's the foundation of your overall health. The gut houses 70% of your immune system, produces 90% of your serotonin (the "happy" neurotransmitter), and contains trillions of bacteria that influence everything from mood to metabolism.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                When digestion is impaired, you may experience bloating, gas, constipation, diarrhea, acid reflux, food sensitivities, brain fog, skin issues, and weakened immunity. The good news? Natural remedies can heal and optimize your digestive system effectively and safely.
              </p>
            </CardContent>
          </Card>

          {/* Core Digestive Herbs */}
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Essential Herbs for Digestive Health</h2>

          <Card className="mb-6 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">1. Ginger - The Digestive Powerhouse</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Benefits:</strong> Ginger is one of the most effective natural remedies for nausea, bloating, and indigestion. It stimulates digestive enzymes, speeds up stomach emptying, and reduces inflammation in the GI tract.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Science:</strong> Studies show ginger accelerates gastric emptying by 25%, reducing feelings of fullness and bloating. It's particularly effective for nausea—reducing symptoms by 75% in some studies.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Usage:</strong> 1-2g fresh ginger before meals, or 250mg extract 2-3 times daily. For nausea, sip ginger tea throughout the day.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">2. Peppermint - IBS Relief Specialist</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Benefits:</strong> Peppermint oil relaxes the smooth muscles of the GI tract, reducing cramping, bloating, and gas. It's especially effective for IBS (Irritable Bowel Syndrome).
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Science:</strong> Multiple clinical trials show enteric-coated peppermint oil reduces IBS symptoms by 40-50%, including abdominal pain, bloating, and bowel irregularity.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Usage:</strong> 200mg enteric-coated peppermint oil capsules 2-3 times daily between meals. Use enteric coating to prevent heartburn.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">3. Fennel Seeds - Bloating & Gas Fighter</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Benefits:</strong> Fennel has been used for centuries to relieve gas, bloating, and cramping. It relaxes intestinal muscles and helps expel trapped gas naturally.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                <strong>Science:</strong> Fennel contains anethole, which has antispasmodic properties. Studies show it reduces bloating and improves overall digestive comfort within 1-2 hours.
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p className="text-sm"><strong>Usage:</strong> Chew 1 tsp fennel seeds after meals, or drink fennel tea 2-3 times daily. Works quickly for acute bloating.</p>
              </div>
            </CardContent>
          </Card>

          {/* Gut Healing Section */}
          <Card className="mb-8 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Gut Healing & Microbiome Support</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">4. L-Glutamine - Intestinal Repair</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    The primary fuel for intestinal cells. Heals "leaky gut" by strengthening tight junctions between intestinal cells. Essential for anyone with chronic digestive issues or food sensitivities.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2"><strong>Dosage:</strong> 5-10g powder daily on empty stomach</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">5. Probiotics - Microbiome Balance</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Beneficial bacteria that restore gut balance, improve digestion, boost immunity, and produce essential vitamins. Choose strains like Lactobacillus and Bifidobacterium.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2"><strong>Dosage:</strong> 10-50 billion CFU daily, diverse strains, refrigerated</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">6. Slippery Elm - Soothing Mucilage</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Forms a soothing gel that coats and protects the digestive tract. Excellent for acid reflux, gastritis, and inflammatory bowel conditions. Reduces irritation and inflammation.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2"><strong>Dosage:</strong> 400-500mg capsules or 1-2 tsp powder mixed in water, 2-3 times daily</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specific Conditions */}
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Solutions for Common Digestive Issues</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white flex items-center">
                  <Heart className="w-6 h-6 text-red-500 mr-2" />
                  Acid Reflux / GERD
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>Aloe Vera Juice:</strong> Soothes esophageal inflammation (2-4 oz before meals)</li>
                  <li>• <strong>DGL Licorice:</strong> Heals stomach lining without raising blood pressure (380mg 3x daily)</li>
                  <li>• <strong>Apple Cider Vinegar:</strong> Improves stomach acid (1 tbsp in water before meals)</li>
                  <li>• <strong>Digestive Enzymes:</strong> Reduce reflux by improving digestion</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white flex items-center">
                  <Shield className="w-6 h-6 text-blue-500 mr-2" />
                  Constipation
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>Magnesium Citrate:</strong> Draws water into bowels (400-600mg evening)</li>
                  <li>• <strong>Psyllium Husk:</strong> Soluble fiber that adds bulk (1 tsp 2x daily with water)</li>
                  <li>• <strong>Triphala:</strong> Ayurvedic formula that gently stimulates motility (500mg-1g at bedtime)</li>
                  <li>• <strong>Vitamin C:</strong> High doses have laxative effect (2-4g daily)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white flex items-center">
                  <Sparkles className="w-6 h-6 text-purple-500 mr-2" />
                  IBS (Irritable Bowel)
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>Peppermint Oil:</strong> First-line treatment for IBS cramping (200mg 3x daily)</li>
                  <li>• <strong>Iberogast:</strong> 9-herb formula proven for IBS (20 drops 3x daily)</li>
                  <li>• <strong>Low-FODMAP Diet:</strong> Reduce fermentable carbs for 4-6 weeks</li>
                  <li>• <strong>Stress Management:</strong> IBS strongly linked to stress (adaptogens help)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white flex items-center">
                  <Leaf className="w-6 h-6 text-green-500 mr-2" />
                  Leaky Gut
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>L-Glutamine:</strong> Repairs intestinal lining (5-10g daily)</li>
                  <li>• <strong>Collagen Peptides:</strong> Provides amino acids for gut repair (10-20g daily)</li>
                  <li>• <strong>Zinc Carnosine:</strong> Heals gut barrier (75mg twice daily)</li>
                  <li>• <strong>Probiotics + Prebiotics:</strong> Restore healthy microbiome balance</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Comprehensive Protocol */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Complete Gut Healing Protocol (8-12 Weeks)</h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="font-bold mb-2">Phase 1: Remove Triggers (Weeks 1-2)</h3>
                  <p className="text-gray-700 dark:text-gray-300">Eliminate inflammatory foods (gluten, dairy, sugar, alcohol). Start food journal to identify personal triggers.</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-bold mb-2">Phase 2: Repair & Heal (Weeks 3-8)</h3>
                  <p className="text-gray-700 dark:text-gray-300">L-Glutamine (5g 2x daily) + Collagen (15g daily) + Zinc Carnosine (75mg 2x daily) + Slippery Elm (as needed for symptoms)</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h3 className="font-bold mb-2">Phase 3: Restore Microbiome (Weeks 4-12)</h3>
                  <p className="text-gray-700 dark:text-gray-300">High-quality probiotics (25-50 billion CFU) + Prebiotic fiber (inulin, psyllium) + Fermented foods (sauerkraut, kimchi, kefir)</p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <h3 className="font-bold mb-2">Ongoing: Optimize Digestion</h3>
                  <p className="text-gray-700 dark:text-gray-300">Digestive enzymes with meals + Ginger or fennel tea + Stress management (gut-brain axis is real!)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-br from-orange-600 to-yellow-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Heal Your Gut, Transform Your Health</h2>
              <p className="mb-6 text-orange-50">
                Get personalized digestive health protocols and expert guidance from our comprehensive remedy database.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/smart-tools">
                  <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50">
                    Get Custom Gut Protocol
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