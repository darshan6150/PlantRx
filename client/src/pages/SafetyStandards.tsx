import { useEnhancedPageTracking } from '../hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import { BackButton } from "@/components/BackButton";
import { CheckCircle, ShieldCheck } from "lucide-react";

export default function SafetyStandards() {
  useEnhancedPageTracking('safety-standards', 'main');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/10">
      <SEOHead 
        title="Safety, Quality & Professional Standards | PlantRx"
        description="Learn about PlantRx's rigorous safety standards, quality control measures, and professional commitment to evidence-based natural medicine. Your health and safety are our top priorities."
        keywords="herbal safety, quality standards, professional herbalism, natural medicine safety, clinical standards, verified remedies"
        canonical="https://plantrxapp.com/safety-standards"
      />

      {/* Back Button */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-emerald-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BackButton />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-cyan-600/10 dark:from-emerald-400/5 dark:via-teal-400/5 dark:to-cyan-400/5"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 dark:bg-emerald-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-800">
                  <ShieldCheck className="h-12 w-12 sm:h-16 sm:w-16 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Safety, Quality & Professional Standards
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed font-medium">
              Your health and safety are our top priorities in every recommendation
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Main Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
          <Card className="mb-8 shadow-xl border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-8 sm:p-12">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Professional herbal medicine requires the same rigorous safety standards as conventional medicine. Every PlantRx remedy includes comprehensive safety information covering potential side effects, contraindications, drug interactions, and special population considerations. We clearly indicate when professional medical consultation is essential – our remedies complement rather than replace qualified healthcare. For conditions requiring immediate medical attention, serious chronic illnesses, or situations involving pregnancy, nursing, or complex medication regimens, we always direct users to seek appropriate professional care.
              </p>

              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Quality matters enormously in herbal medicine. Active compound concentrations vary based on plant species, growing conditions, harvest timing, processing methods, and storage. We provide specific guidance on selecting quality herbal products, including standardization markers to look for, reputable suppliers, and appropriate dosage ranges. When standardized extracts are preferable to whole herbs, we explain why and specify optimal concentrations. For remedies you prepare at home, we include proper identification, sourcing, and storage instructions to ensure safety and efficacy.
              </p>

              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Our commitment to professional standards means continuous education and updates. As new research emerges or safety concerns arise, we promptly update remedy profiles. We acknowledge limitations of herbal medicine – clearly stating when conventional treatment is more appropriate and which conditions require integrated care combining natural and pharmaceutical approaches. This honest, evidence-based approach builds trust and ensures you receive the safest, most effective natural health guidance available. PlantRx represents clinical herbalism at its finest: scientifically validated, professionally vetted, and genuinely dedicated to improving your health through the power of plants.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-300 dark:border-emerald-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-emerald-900 dark:text-emerald-200 text-xl flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-emerald-600 dark:text-emerald-400" />
                Expert-Verified Remedies
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p className="text-sm sm:text-base leading-relaxed">
                Every remedy reviewed by certified herbalists, naturopaths, and integrative medicine practitioners with years of clinical experience treating real patients.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-300 dark:border-blue-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-200 text-xl flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
                Research-Backed Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p className="text-sm sm:text-base leading-relaxed">
                All recommendations supported by peer-reviewed clinical trials, phytochemical research, and documented traditional use spanning decades or centuries.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-2 border-purple-300 dark:border-purple-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-purple-900 dark:text-purple-200 text-xl flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" />
                Comprehensive Safety Profiles
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p className="text-sm sm:text-base leading-relaxed">
                Detailed information on side effects, contraindications, drug interactions, and appropriate use during pregnancy, nursing, and for children.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-300 dark:border-orange-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-orange-900 dark:text-orange-200 text-xl flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-orange-600 dark:text-orange-400" />
                Practical Application Guidance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p className="text-sm sm:text-base leading-relaxed">
                Step-by-step preparation instructions, exact measurements, dosing schedules, and realistic timeframes for seeing results from each natural remedy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
