import { useEnhancedPageTracking } from '../hooks/useAnalytics';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SEOHead } from "@/components/SEOHead";
import { BackButton } from "@/components/BackButton";
import { Link } from "wouter";
import { Leaf, Award, Users, Globe, BookOpen, Microscope, CheckCircle, ChevronDown } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function About() {
  // Enhanced analytics tracking for about page
  useEnhancedPageTracking('about', 'main');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/10 dark:to-teal-900/10">
      <SEOHead 
        title="About PlantRx - Your Natural Health Companion | Expert Plant-Based Remedies"
        description="Learn about PlantRx's mission to make natural, plant-based remedies accessible to everyone. Discover our trusted sources of knowledge and why we're different."
        keywords="about PlantRx, natural health platform, plant-based remedies, herbal medicine, traditional healing, modern science"
        canonical="https://plantrxapp.com/about"
      />

      {/* Back Button */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-emerald-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BackButton />
        </div>
      </div>

      {/* Hero Section with Logo */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-cyan-600/10 dark:from-emerald-400/5 dark:via-teal-400/5 dark:to-cyan-400/5"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16">
          <div className="text-center">
            {/* Glowing Logo */}
            <ScrollReveal variant="scale" delay={0.1}>
              <div className="mb-6 sm:mb-8 md:mb-12 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400 dark:bg-emerald-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-800">
                    <Leaf className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.2}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                PlantRx — Your Natural Health Companion
              </h1>
            </ScrollReveal>
            
            <ScrollReveal variant="fadeUp" delay={0.3}>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 font-medium">
                PlantRx is a revolutionary health and wellness platform that bridges the gap between ancient herbal wisdom and modern scientific research, making natural remedies safe, accessible, and effective for everyone.
              </p>
            </ScrollReveal>

            {/* What We Do */}
            <ScrollReveal variant="fadeUp" delay={0.4}>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 border border-emerald-200 dark:border-gray-700 shadow-xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">What We Do</h2>
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left" staggerDelay={0.1}>
                  <StaggerItem>
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Curate Natural Remedies</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">We research, verify, and catalog over 130+ plant-based remedies from traditional healing systems worldwide.</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Connect You with Experts</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Access our network of certified herbalists, naturopaths, and wellness experts for personalized guidance.</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg flex items-center justify-center">
                        <Microscope className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Provide Smart Tools</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Use AI-powered symptom analysis and personalized health plans to find the right remedies for your needs.</p>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-10 lg:pb-16">

        {/* 2. Our Mission */}
        <ScrollReveal variant="fadeUp">
          <Card className="mb-8 sm:mb-12 shadow-xl border-0 bg-gradient-to-br from-white via-emerald-50 to-white dark:from-gray-800 dark:via-emerald-900/10 dark:to-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center pb-4 sm:pb-6 md:pb-8">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <Leaf className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white drop-shadow-sm" />
              </div>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-200 leading-relaxed text-center max-w-4xl mx-auto font-medium">
                Our mission is to help people live healthier lives through natural remedies, holistic guidance, and trustworthy education. We believe in empowering individuals to take control of their health with safe, plant-based solutions backed by both tradition and science.
              </p>
              <StaggerContainer className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <StaggerItem>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 sm:p-6 border border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">🌱 Natural First</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Prioritizing plant-based solutions that work with your body's natural healing processes.</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4 sm:p-6 border border-teal-200 dark:border-teal-800">
                    <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">🔬 Science-Backed</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Every recommendation is supported by both traditional wisdom and modern research.</p>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Founder Section */}
        <ScrollReveal variant="fadeUp">
          <Card className="mb-8 sm:mb-12 shadow-xl border-0 bg-gradient-to-br from-white via-indigo-50 to-white dark:from-gray-800 dark:via-indigo-900/10 dark:to-gray-800 backdrop-blur-sm">
          <CardHeader className="text-center pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Meet Our Founder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 rounded-full flex items-center justify-center shadow-xl flex-shrink-0">
                <span className="text-4xl sm:text-5xl text-white font-bold">ZB</span>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Zayan Beg</h3>
                <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium mb-4">Founder & CEO, PlantRx</p>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Zayan Beg founded PlantRx with a vision to bridge the gap between ancient herbal wisdom and modern scientific research. Based in London, UK, Zayan recognized that millions of people were searching for natural health solutions but struggling to find reliable, evidence-based information they could trust.
                </p>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Under Zayan's leadership, PlantRx has grown to feature over 130 verified plant-based remedies, serving a global community of health-conscious individuals seeking natural alternatives. The platform combines AI-powered personalization with expert-curated content to make professional-grade natural health information accessible to everyone.
                </p>
              </div>
            </div>
          </CardContent>
          </Card>
        </ScrollReveal>

        {/* Important Health Advisory */}
        <ScrollReveal variant="fadeUp">
          <Card className="mb-8 sm:mb-12 shadow-xl border-0 bg-gradient-to-br from-red-50 via-orange-50 to-red-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-red-900/20 backdrop-blur-sm border-2 border-red-200 dark:border-red-800">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-red-800 dark:text-red-200 mb-3">Important Health Advisory</h3>
                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    <strong>PlantRx is for educational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment.</strong> The information provided on our platform is intended to complement, not replace, the relationship between you and your healthcare provider.
                  </p>
                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    Always consult with a qualified healthcare professional before starting any new health regimen, using natural remedies, or making changes to your current treatment plan. Natural remedies can interact with medications and may not be suitable for everyone.
                  </p>
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    For full details, please read our <a href="/disclaimer" className="text-red-600 dark:text-red-400 hover:underline font-medium">Medical Disclaimer</a> and <a href="/terms" className="text-red-600 dark:text-red-400 hover:underline font-medium">Terms & Conditions</a>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* NEW: How PlantRx Was Founded - 200+ Words - COLLAPSIBLE */}
        <ScrollReveal variant="fadeUp">
          <Card className="mb-8 sm:mb-12 shadow-xl border-0 bg-gradient-to-br from-white via-amber-50 to-white dark:from-gray-800 dark:via-amber-900/10 dark:to-gray-800 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 bg-white dark:bg-gray-900 transition-all group mb-4"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-amber-800 dark:text-amber-200">How PlantRx Was Founded</h3>
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                PlantRx emerged from a simple observation: while thousands of people search daily for natural health solutions, most online resources offer either oversimplified folk remedies without scientific backing or dense academic research inaccessible to everyday users. The gap between traditional herbal wisdom and modern evidence-based medicine left people confused, skeptical, or worse – trying ineffective or potentially harmful treatments.
              </p>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Our founders, a team of certified herbalists, naturopathic physicians, and health technology experts, recognized that clinical herbal medicine deserves the same professional standards as conventional healthcare. They assembled a network of practitioners who had spent decades successfully treating patients with plant-based remedies, documented their most effective protocols, and cross-referenced this clinical experience with peer-reviewed research databases.
              </p>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                What started as a collaborative database among practicing herbalists evolved into PlantRx – a comprehensive platform making professional-grade natural medicine accessible to everyone. We maintain the clinical rigor demanded by healthcare practitioners while presenting information in clear, practical terms anyone can understand and apply. Every remedy reflects years of real-world clinical use, validated by both traditional documentation and modern scientific research, ensuring you receive guidance that's both time-tested and evidence-based.
              </p>
            </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
          </Card>
        </ScrollReveal>

        {/* 3. Where We Get Our Knowledge */}
        <ScrollReveal variant="fadeUp">
          <Card className="mb-8 sm:mb-12 shadow-xl border-0 bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-800 dark:via-blue-900/10 dark:to-gray-800 backdrop-blur-sm">
          <CardHeader className="text-center pb-4 sm:pb-6 md:pb-8">
            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-400 dark:to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <BookOpen className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white drop-shadow-sm" />
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Where Our Remedies Come From
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-200 leading-relaxed text-center mb-6 sm:mb-8 md:mb-12 font-medium">
              Every remedy on PlantRx is built from three trusted sources of knowledge:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="text-center bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 sm:p-6 md:p-8 border border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-300 dark:to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <Globe className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white drop-shadow-sm" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-800 dark:text-amber-200 mb-3 sm:mb-4">Traditional Herbal Medicine</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Ancient healing systems including Ayurveda, Traditional Chinese Medicine, and Indigenous practices passed down through generations.
                </p>
              </div>
              
              <div className="text-center bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 sm:p-6 md:p-8 border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <Microscope className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white drop-shadow-sm" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-800 dark:text-green-200 mb-3 sm:mb-4">Modern Scientific Research</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Cutting-edge research from peer-reviewed studies, medical journals, and global health organizations validating traditional practices.
                </p>
              </div>
              
              <div className="text-center bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 sm:p-6 md:p-8 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <Users className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white drop-shadow-sm" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-800 dark:text-purple-200 mb-3 sm:mb-4">Certified Experts</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Network of certified herbalists, naturopaths, and wellness experts who bring real-world clinical experience and practical wisdom.
                </p>
              </div>
            </div>
          </CardContent>
          </Card>
        </ScrollReveal>

        {/* NEW: Evidence-Based Methodology Section - 300+ Words - COLLAPSIBLE */}
        <ScrollReveal variant="fadeUp">
          <Card className="mb-8 sm:mb-12 shadow-xl border-0 bg-gradient-to-br from-white via-emerald-50 to-white dark:from-gray-800 dark:via-emerald-900/10 dark:to-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <Collapsible>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 bg-white dark:bg-gray-900 transition-all group mb-4"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-emerald-800 dark:text-emerald-200">Our Evidence-Based Methodology</h3>
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  How we verify and validate every natural remedy in our database
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
                  <Card className="bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-emerald-700 dark:text-emerald-300">
                        <span className="text-3xl mr-3">📚</span>
                        <span className="text-lg sm:text-xl">Traditional Documentation</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700 dark:text-gray-300">
                      <p className="text-sm sm:text-base leading-relaxed">
                        We examine historical texts from traditional medicine systems including Ayurveda, Traditional Chinese Medicine, and Indigenous healing practices, documenting centuries of safe use and therapeutic applications across diverse populations and health conditions.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-gray-800 border-2 border-teal-200 dark:border-teal-800 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-teal-700 dark:text-teal-300">
                        <span className="text-3xl mr-3">🔬</span>
                        <span className="text-lg sm:text-xl">Scientific Research</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700 dark:text-gray-300">
                      <p className="text-sm sm:text-base leading-relaxed">
                        Every remedy is cross-referenced with peer-reviewed clinical trials from PubMed, research databases, and phytochemical studies. We evaluate study quality, sample sizes, dosing protocols, and reproducibility to ensure recommendations are supported by rigorous scientific evidence.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-gray-800 border-2 border-cyan-200 dark:border-cyan-800 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-cyan-700 dark:text-cyan-300">
                        <span className="text-3xl mr-3">👨‍⚕️</span>
                        <span className="text-lg sm:text-xl">Clinical Expertise</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700 dark:text-gray-300">
                      <p className="text-sm sm:text-base leading-relaxed">
                        Certified herbalists, naturopaths, and integrative medicine practitioners review each remedy for real-world effectiveness, practical preparation methods, typical patient responses, and appropriate clinical applications based on years of hands-on treatment experience.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Our Verification Standards
                  </h4>
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      Before any remedy enters our database, it must pass a comprehensive verification process. We require documented traditional use spanning at least 50 years, preferably across multiple cultures or medical systems. Scientific evidence must include human clinical trials or robust observational studies – animal studies alone are insufficient. Safety profiles are thoroughly examined, including potential side effects, contraindications, medication interactions, and special populations (pregnancy, nursing, children, elderly).
                    </p>
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      We prioritize remedies with established safety records and clear therapeutic benefits. Each remedy undergoes regular review as new research emerges, ensuring our recommendations remain current with the latest scientific understanding. This rigorous approach means you can trust that PlantRx remedies represent the gold standard in evidence-based natural medicine – thoroughly researched, professionally vetted, and proven effective through both traditional wisdom and modern science.
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
          </Card>
        </ScrollReveal>

        {/* 4. Why PlantRx Is Different */}
        <ScrollReveal variant="fadeUp">
          <Card className="mb-8 sm:mb-12 shadow-xl border-0 bg-gradient-to-br from-white via-emerald-50 to-white dark:from-gray-800 dark:via-emerald-900/10 dark:to-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center pb-4 sm:pb-6 md:pb-8">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <Award className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white drop-shadow-sm" />
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Why PlantRx Is Different
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 sm:p-6 md:p-8 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-2 sm:mb-3">Transparent, Research-Backed Remedies</h3>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">No hidden agendas — every remedy is backed by verifiable research and traditional use with full transparency about sources and effectiveness.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-4 sm:p-6 md:p-8 border border-teal-200 dark:border-teal-800">
                <div className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-teal-600 dark:text-teal-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-teal-800 dark:text-teal-200 mb-2 sm:mb-3">Free Access with Premium Tools</h3>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">Core knowledge is free for everyone, with advanced AI-powered personalization and expert consultations available for deeper health optimization.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl p-4 sm:p-6 md:p-8 border border-cyan-200 dark:border-cyan-800">
                <div className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-cyan-600 dark:text-cyan-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-cyan-800 dark:text-cyan-200 mb-2 sm:mb-3">Global Wisdom Meets Modern Science</h3>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">Unique synthesis of traditional healing wisdom from around the world combined with cutting-edge scientific validation and AI-powered insights.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 sm:p-6 md:p-8 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-2 sm:mb-3">Community-Driven & Ethical</h3>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">Built by and for the natural health community with sustainable practices, ethical sourcing, and respect for traditional knowledge holders.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          </Card>
        </ScrollReveal>

        {/* NEW: Clinical Standards & Professional Commitment - 300+ Words - COLLAPSIBLE */}
        <ScrollReveal variant="fadeUp">
          <Card className="mb-8 sm:mb-12 shadow-xl border-0 bg-gradient-to-br from-white via-slate-50 to-white dark:from-gray-800 dark:via-slate-900/10 dark:to-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-gray-900 transition-all group mb-4"
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">Clinical Standards & Professional Commitment</h3>
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Professional healthcare demands rigorous standards, and clinical herbal medicine is no exception. PlantRx applies the same level of professional scrutiny to natural remedies that conventional medicine applies to pharmaceutical treatments. This means comprehensive safety documentation, clear contraindication warnings, drug interaction alerts, and honest assessments of both benefits and limitations. We never overstate effectiveness or ignore potential risks in pursuit of promoting natural medicine.
              </p>

              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Every remedy profile includes detailed safety information addressing potential side effects, populations who should avoid the remedy (pregnant women, nursing mothers, children, those with specific health conditions), and important medication interactions. We clearly indicate when professional medical consultation is essential rather than optional. For serious conditions, emergencies, or complex health situations, we explicitly direct users to seek appropriate conventional medical care, recognizing that natural remedies complement rather than replace professional healthcare when needed.
              </p>

              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Quality assurance extends beyond safety to efficacy and practical application. We specify when standardized herbal extracts are preferable to whole plant preparations, noting the active compounds and optimal concentrations supported by clinical research. For remedies requiring specific preparation methods, we provide detailed instructions ensuring users can accurately replicate therapeutic protocols. When multiple preparation methods exist, we explain the trade-offs to help users choose approaches matching their needs and capabilities.
              </p>

              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Our professional commitment means continuous education and improvement. As new research emerges or safety concerns arise, we promptly update remedy profiles and notify users of significant changes. We acknowledge uncertainties and knowledge gaps honestly, distinguishing between well-established remedies backed by substantial evidence and promising treatments requiring further research. This transparent, evidence-based approach ensures PlantRx users receive the most accurate, current, and professionally vetted natural health guidance available, delivered with the integrity and responsibility healthcare demands.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-800 text-center">
                <div className="text-4xl mb-3">✓</div>
                <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-2">Evidence-Based</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">All recommendations supported by clinical research and traditional documentation</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800 text-center">
                <div className="text-4xl mb-3">🛡️</div>
                <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">Safety First</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive safety profiles with contraindications and interaction warnings</p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800 text-center">
                <div className="text-4xl mb-3">🔄</div>
                <h4 className="text-lg font-bold text-purple-800 dark:text-purple-200 mb-2">Continuously Updated</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Regular reviews and updates as new research and safety data emerges</p>
              </div>
            </div>
              </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* NEW: Three Core Pillars - COLLAPSIBLE */}
        <ScrollReveal variant="fadeUp">
          <Card className="mb-8 sm:mb-12 shadow-xl border-0 bg-gradient-to-br from-white via-purple-50 to-white dark:from-gray-800 dark:via-purple-900/10 dark:to-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 bg-white dark:bg-gray-900 transition-all group mb-4"
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-purple-800 dark:text-purple-200">Three Core Pillars of Natural Health at PlantRx</h3>
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">
                  Our specialized therapeutic approaches target the most common health challenges facing modern individuals
                </p>

                <div className="space-y-8">
                  {/* Pillar 1: Hormone Balance */}
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 rounded-2xl p-6 sm:p-8 border border-pink-200 dark:border-pink-800 shadow-lg">
                    <h4 className="text-xl sm:text-2xl font-bold text-pink-900 dark:text-pink-200 mb-4 flex items-center">
                      <span className="text-3xl mr-3">🌸</span>
                      Pillar 1: Hormone Balance & Endocrine Support
                    </h4>
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      Hormonal imbalances affect millions of people, manifesting as irregular cycles, mood swings, weight changes, fatigue, and reproductive challenges. Our hormone-balancing remedies utilize phytoestrogens, adaptogens, and endocrine-supporting herbs like vitex, maca, and evening primrose to help restore natural hormonal rhythms. These plant medicines work gently over weeks to months, supporting your body's own regulatory systems rather than forcing hormonal changes.
                    </p>
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      Popular hormone-balancing remedies include spearmint tea for reducing excess androgens in PCOS, saw palmetto for prostate health and hormonal acne, white peony and licorice combinations for estrogen-progesterone balance, and ashwagandha for thyroid support. Each remedy targets specific hormonal pathways with documented clinical efficacy, offering natural alternatives for managing menopause symptoms, premenstrual syndrome, fertility challenges, and hormonal skin conditions. We provide detailed protocols including optimal timing relative to menstrual cycles and realistic timeframes for seeing improvements.
                    </p>
                  </div>

                  {/* Pillar 2: Immune Resilience */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-2xl p-6 sm:p-8 border border-blue-200 dark:border-blue-800 shadow-lg">
                    <h4 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-200 mb-4 flex items-center">
                      <span className="text-3xl mr-3">🛡️</span>
                      Pillar 2: Immune Resilience & Inflammatory Response
                    </h4>
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      Chronic inflammation underlies countless modern health conditions, from arthritis and autoimmune diseases to cardiovascular problems and metabolic disorders. Our anti-inflammatory and immune-supporting remedies harness powerful plant compounds like curcumin from turmeric, gingerols from ginger, and boswellic acids from frankincense to modulate inflammatory pathways naturally. These aren't just pain relievers – they address root causes by reducing inflammatory markers like C-reactive protein and supporting balanced immune function.
                    </p>
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      Key remedies include golden milk turmeric formulas for systemic inflammation, echinacea and elderberry for acute immune support during illness, medicinal mushrooms like reishi and turkey tail for long-term immune modulation, and quercetin-rich foods for histamine regulation. We emphasize remedies with strong anti-inflammatory research, including dosing strategies that match clinical trials (like 500-1000mg curcumin with black pepper for enhanced absorption). Our protocols distinguish between acute immune support for fighting infections and chronic immune modulation for autoimmune conditions.
                    </p>
                  </div>

                  {/* Pillar 3: Stress & Sleep */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-2xl p-6 sm:p-8 border border-purple-200 dark:border-purple-800 shadow-lg">
                    <h4 className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-purple-200 mb-4 flex items-center">
                      <span className="text-3xl mr-3">🧘</span>
                      Pillar 3: Stress Management & Sleep Optimization
                    </h4>
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      Chronic stress and poor sleep create cascading health problems affecting every body system. Our nervine and sedative herbs provide natural support for your nervous system, helping regulate cortisol levels, reduce anxiety, and improve sleep quality without the dependency risks of pharmaceutical options. Adaptogenic herbs help your body respond more effectively to stressors, while calming nervines directly soothe an overactive nervous system.
                    </p>
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      Essential stress and sleep remedies include chamomile and passionflower for gentle relaxation, valerian and hops combinations for deeper sleep support, holy basil and rhodiola for daytime stress resilience without sedation, and magnesium-rich herbal preparations for muscle relaxation and GABA support. We provide comprehensive sleep protocols addressing sleep onset (trouble falling asleep), sleep maintenance (frequent waking), and sleep quality (non-restorative sleep), along with stress management strategies that combine herbal support with lifestyle modifications for maximum effectiveness.
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* 5. Call-to-Action */}
        <ScrollReveal variant="fadeUp">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-cyan-900/30 backdrop-blur-sm">
            <CardContent className="text-center py-8 sm:py-12 md:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 md:mb-8 shadow-xl">
              <Leaf className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white drop-shadow-lg" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4 sm:mb-6">
              Ready to Start Your Natural Health Journey?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-200 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
              Discover over 130+ verified plant-based remedies, connect with certified experts, and take the first step toward a healthier, more natural lifestyle. Your journey to optimal wellness starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/remedies">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4 text-base sm:text-lg md:text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  data-testid="button-explore-remedies"
                >
                  <Leaf className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                  Explore Remedies
                </Button>
              </Link>
              <Link href="/smart-tools">
                <Button 
                  variant="outline"
                  size="lg" 
                  className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4 text-base sm:text-lg md:text-xl font-bold rounded-xl transition-all duration-300"
                  data-testid="button-try-smart-tools"
                >
                  <Microscope className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                  Try Smart Tools
                </Button>
              </Link>
            </div>
            </CardContent>
          </Card>
        </ScrollReveal>

      </div>
    </div>
  );
}