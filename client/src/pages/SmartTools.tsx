import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Sparkles } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { UpgradeInterstitial } from "@/components/FeatureLock";
import { Feature } from "@shared/subscriptionFeatures";

import HealthChat from "@/components/HealthChat";

export default function SmartTools() {
  // Force scroll to top when component mounts - Smart Tools specific fix  
  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Additional scroll to top after a short delay to ensure all content is rendered
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-wrapper luxury-gradient-bg">
      <SEOHead 
        title="Smart Remedy Builder - AI Natural Health Tool | PlantRx Smart Tools"
        description="Get instant personalized natural remedies with our FREE Smart Remedy Builder. Expert-guided health solutions tailored to your needs. Try our smart health analysis now!"
        keywords="smart remedy builder, AI natural remedies, health assessment tool, PlantRx smart tools, personalized wellness, remedy builder, natural health AI"
        canonical="https://plantrxapp.com/smart-tools"
        ogType="website"
      />
      <Header />
      
      <UpgradeInterstitial feature={Feature.AI_SYMPTOM_FINDER}>
      
      {/* Mobile-first container with consistent spacing */}
      <div className="page-content">
        {/* Header section */}
        <div className="text-center mb-6 sm:mb-10 lg:mb-16">
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700/50 mb-4 sm:mb-6 text-xs sm:text-sm px-4 py-2 sm:px-6 sm:py-3 font-semibold tracking-wide min-h-[44px] inline-flex items-center">
            ✨ Expert-Powered Remedy Creation
          </Badge>
          <h1 className="text-xl sm:text-2xl lg:text-3xl luxury-heading text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-6">
            Smart Tools
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto luxury-body leading-relaxed">
            Advanced symptom analysis tools to help you find the perfect natural solutions for your health concerns
          </p>
        </div>

        <div className="w-full space-y-6 sm:space-y-8 lg:space-y-12">
          {/* AI Health Chat */}
          <div className="w-full h-[550px] sm:h-[650px] lg:h-[700px]">
            <HealthChat />
          </div>
        </div>

        {/* Trending Health Topics */}
        <div className="w-full max-w-5xl mx-auto mt-8 sm:mt-12 lg:mt-16">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white text-center mb-2 sm:mb-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
            Trending This Week
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
          </h2>
          <p className="text-orange-600 dark:text-orange-400 font-medium text-center mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base lg:text-lg">What's hot in natural health this week</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Link href="/blog/glp1-agonists-vs-natural-weight-loss-plant-alternatives">
              <Card className="group hover:shadow-xl transition-all duration-300 luxury-glass luxury-border rounded-xl cursor-pointer overflow-hidden h-full min-h-[44px]">
                <CardContent className="p-4 sm:p-5 lg:p-6 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center text-lg sm:text-xl lg:text-2xl shadow-lg group-hover:scale-110 transition-transform">
                      🧬
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2 text-sm sm:text-base lg:text-lg">
                      GLP-1 Alternatives
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm lg:text-base">
                      Natural weight loss without Ozempic
                    </p>
                  </div>
                  <div className="w-10 sm:w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/blog/longevity-secrets-blue-zones-plants-add-years-life">
              <Card className="group hover:shadow-xl transition-all duration-300 luxury-glass luxury-border rounded-xl cursor-pointer overflow-hidden h-full min-h-[44px]">
                <CardContent className="p-4 sm:p-5 lg:p-6 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center text-lg sm:text-xl lg:text-2xl shadow-lg group-hover:scale-110 transition-transform">
                      🏝️
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2 text-sm sm:text-base lg:text-lg">
                      Blue Zone Secrets
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm lg:text-base">
                      Plants that help you live to 100+
                    </p>
                  </div>
                  <div className="w-10 sm:w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/blog/ai-powered-personalized-nutrition-future-plant-medicine">
              <Card className="group hover:shadow-xl transition-all duration-300 luxury-glass luxury-border rounded-xl cursor-pointer overflow-hidden h-full min-h-[44px]">
                <CardContent className="p-4 sm:p-5 lg:p-6 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center text-lg sm:text-xl lg:text-2xl shadow-lg group-hover:scale-110 transition-transform">
                      🤖
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2 text-sm sm:text-base lg:text-lg">
                      AI Nutrition
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm lg:text-base">
                      Personalized medicine revolution
                    </p>
                  </div>
                  <div className="w-10 sm:w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/blog/cold-therapy-revolution-ice-baths-cryotherapy-natural-exposure">
              <Card className="group hover:shadow-xl transition-all duration-300 luxury-glass luxury-border rounded-xl cursor-pointer overflow-hidden h-full min-h-[44px]">
                <CardContent className="p-4 sm:p-5 lg:p-6 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center text-lg sm:text-xl lg:text-2xl shadow-lg group-hover:scale-110 transition-transform">
                      ❄️
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2 text-sm sm:text-base lg:text-lg">
                      Cold Therapy
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm lg:text-base">
                      Ice baths & Wim Hof method
                    </p>
                  </div>
                  <div className="w-10 sm:w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* Comprehensive Introduction to AI Smart Tools - COLLAPSIBLE */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/10 dark:via-teal-900/10 dark:to-cyan-900/10 py-6 sm:py-10 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border-2 border-teal-200 dark:border-teal-800 hover:border-teal-400 dark:hover:border-teal-600 bg-white dark:bg-gray-900 transition-all group min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                      AI-Powered Natural Health Analysis
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Smart Tools for Personalized Wellness</p>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform group-data-[state=open]:rotate-180 flex-shrink-0" />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4 sm:mt-6">
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert p-4 sm:p-5 lg:p-6 bg-white dark:bg-gray-800/50 rounded-xl sm:rounded-2xl">
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
              PlantRx Smart Tools represent the convergence of artificial intelligence technology and clinical herbal medicine expertise, creating an unprecedented resource for personalized natural health guidance. Our AI symptom analyzer processes your health concerns through sophisticated algorithms trained on thousands of documented remedy applications, cross-referenced with clinical research databases and traditional herbal medicine knowledge spanning centuries. This intelligent system delivers customized remedy recommendations matched precisely to your specific symptoms, health history, and individual circumstances – capabilities impossible through manual remedy browsing alone.
            </p>

            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 mt-6 sm:mt-8">How AI Symptom Analysis Works</h3>
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              The technology underlying PlantRx Smart Tools combines natural language processing, machine learning pattern recognition, and comprehensive symptom classification systems to understand your health concerns as precisely as a skilled practitioner. When you describe symptoms in conversational language, our AI parses this input to identify key indicators including symptom location, intensity, duration, timing patterns, aggravating factors, and relieving conditions. This detailed symptom profile then queries our extensive remedy database to identify botanical treatments with documented efficacy for your specific presentation rather than generic condition categories.
            </p>

            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
              Beyond simple keyword matching, the AI recognizes symptom combinations and patterns that indicate specific therapeutic needs. For example, headaches accompanied by digestive upset, light sensitivity, and stress triggers receive different remedy recommendations than headaches occurring with neck tension and computer use. This pattern recognition capability mirrors the differential diagnosis process healthcare practitioners use, ensuring recommendations address your unique manifestation of health concerns rather than offering one-size-fits-all solutions. The system continuously learns from user interactions and emerging research, refining recommendation accuracy over time.
            </p>

            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 mt-6 sm:mt-8">Benefits of AI-Powered Remedy Matching</h3>
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Traditional remedy discovery requires extensive reading, cross-referencing multiple sources, and interpreting often contradictory information – a time-consuming process that frequently leads to suboptimal choices or analysis paralysis. AI symptom analysis eliminates this friction, delivering targeted recommendations within minutes based on comprehensive data analysis humans cannot match for speed or scope. You receive not just single remedies but prioritized treatment protocols accounting for remedy synergies, preparation preferences, and your specific symptom patterns.
            </p>

            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
              Personalization represents the AI system's greatest advantage over generic remedy lists or condition-based searching. The technology considers your complete health picture including concurrent symptoms, existing health conditions, current medications, lifestyle factors, and treatment preferences to customize recommendations perfectly suited to your situation. This individualized approach acknowledges that identical symptoms in different people often require different therapeutic strategies based on underlying causes, constitutional factors, and personal circumstances affecting treatment response and safety.
            </p>

            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 mt-6 sm:mt-8">How to Use Smart Tools Effectively</h3>
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Achieving optimal results from AI health analysis requires providing detailed, accurate symptom information rather than vague general descriptions. Describe symptoms specifically including exact locations, quality (sharp, dull, throbbing, burning), intensity on a 1-10 scale, timing (constant, intermittent, time-of-day patterns), duration (hours, days, weeks, months), and what makes symptoms better or worse. The more comprehensive your input, the more precisely the AI can match remedies to your needs.
            </p>

            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Include relevant health history including chronic conditions, current medications, allergies, pregnancy or nursing status, and previous remedy experiences whether successful or unsuccessful. This contextual information helps the AI avoid contraindicated remedies and prioritize options most likely to work effectively and safely for you. Don't hesitate to ask follow-up questions or request clarification about recommended remedies – the system provides detailed information about preparation methods, dosing, expected timeframes for results, and safety considerations for each suggestion.
            </p>

            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
              Use Smart Tools as a starting point for remedy exploration rather than definitive medical diagnosis. While the AI delivers evidence-based suggestions grounded in clinical herbal medicine knowledge, it cannot replace comprehensive assessment by qualified healthcare practitioners for serious, persistent, or worsening health concerns. The system explicitly indicates when symptoms suggest professional medical evaluation is warranted, ensuring you receive appropriate care for conditions requiring conventional medical attention beyond natural remedy support.
            </p>

            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 mt-6 sm:mt-8">The Science Behind AI Health Intelligence</h3>
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              PlantRx AI training draws on multiple authoritative data sources including peer-reviewed clinical trials of herbal medicines, traditional medicine texts documenting centuries of therapeutic use, phytochemical research identifying active plant compounds and their mechanisms of action, and clinical case reports from practicing herbalists and naturopaths. This multi-dimensional dataset ensures recommendations reflect both historical wisdom validated through generations of use and modern scientific understanding of how plant medicines affect human physiology.
            </p>

            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
              Machine learning algorithms identify patterns in this vast evidence base that human practitioners might miss, recognizing subtle correlations between symptom presentations and successful remedy applications. For instance, the AI might recognize that patients describing fatigue with specific characteristics respond better to adaptogenic herbs than those with different fatigue profiles, even when conventional medicine categorizes both as general exhaustion. This nuanced pattern recognition enhances treatment precision beyond broad categorical recommendations.
            </p>

            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 mt-6 sm:mt-8">Privacy, Security & Data Protection</h3>
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
              We understand health information represents highly sensitive personal data requiring robust protection. PlantRx Smart Tools implement enterprise-grade security measures including end-to-end encryption for all symptom data, secure cloud storage with regular backups, and strict access controls limiting data visibility to essential system functions only. Your symptom descriptions and health information remain confidential, never shared with third parties for marketing or sold to external organizations.
            </p>

            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
              The AI system processes your queries anonymously, separating identifying information from symptom data to enhance privacy protection. Aggregated anonymized data may improve AI training and remedy recommendations over time, but individual user information remains private and secure. You maintain full control over your data including options to delete conversation history, export personal information, or request complete account deletion at any time through privacy settings.
            </p>

            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 mt-6 sm:mt-8">When to Use AI Tools vs Seeing a Practitioner</h3>
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
              AI symptom analysis excels for common, self-limiting health concerns where natural remedies offer safe, effective relief: occasional headaches, minor digestive upset, stress management, sleep difficulties, skin irritations, seasonal allergies, and similar everyday wellness challenges. For these situations, Smart Tools provide convenient, immediate guidance helping you identify appropriate remedies without scheduling appointments or waiting for practitioner availability. The technology also serves excellently for educational purposes, helping you learn about herbal medicine and understand connections between symptoms and natural treatments.
            </p>

            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              However, certain situations absolutely require professional medical evaluation rather than AI recommendations alone. Seek conventional medical care immediately for emergencies including severe pain, difficulty breathing, chest pain, serious injuries, sudden severe symptoms, or rapidly worsening conditions. For chronic health issues, complex multi-system problems, conditions requiring prescription medications, pregnancy complications, or situations where symptoms persist despite natural remedy use, consult qualified healthcare practitioners knowledgeable in both conventional and integrative medicine. Use Smart Tools to complement professional care rather than replacing it, combining AI-powered remedy discovery with practitioner expertise for optimal health outcomes.
            </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      
      </UpgradeInterstitial>
    </div>
  );
}
