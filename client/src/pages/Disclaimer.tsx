import Header from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  AlertTriangle, 
  Heart, 
  Pill, 
  Stethoscope, 
  Phone, 
  Sparkles, 
  Shield, 
  FileText,
  MessageCircle,
  XCircle,
  CheckCircle
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0.92, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.35, ease: "easeOut" }
};

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEOHead 
        title="Medical Disclaimer - Important Health Information | PlantRx"
        description="Important medical disclaimer for PlantRx. Our natural remedy information is for educational purposes only and is not a substitute for professional medical advice."
        keywords="medical disclaimer, health disclaimer, natural remedies disclaimer, educational information, PlantRx disclaimer"
        canonical="https://plantrxapp.com/disclaimer"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <BackButton />
          
          <motion.div 
            className="text-center mt-8"
            {...fadeInUp}
          >
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <AlertTriangle className="w-4 h-4" />
              Important Notice
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Medical Disclaimer
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Important information about the nature of our content and your health decisions.
            </p>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              Last updated: December 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Critical Warning Banner */}
      <section className="py-6 bg-red-600 dark:bg-red-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex items-center justify-center gap-3 text-white text-center"
            {...fadeInUp}
          >
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <p className="font-medium">
              PlantRx is for <strong>EDUCATIONAL PURPOSES ONLY</strong> — Not a substitute for professional medical advice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Row - Two Cards Side by Side */}
          <motion.div 
            className="grid md:grid-cols-2 gap-6 mb-6"
            {...fadeInUp}
          >
            {/* Not Medical Advice */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Not Medical Advice</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  The content on PlantRx is for general informational and educational purposes only.
                </p>
                
                <div className="space-y-3">
                  {[
                    "NOT medical advice",
                    "NOT for self-diagnosis",
                    "NOT for self-treatment",
                    "NOT a replacement for healthcare"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700">
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Natural Remedies Warning */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <Pill className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Natural ≠ Risk-Free</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  "Natural" does not mean safe for everyone or free of side effects.
                </p>
                
                <div className="bg-amber-50 dark:bg-gray-800 rounded-xl p-5 border border-amber-200 dark:border-amber-600">
                  <p className="font-semibold text-amber-800 dark:text-amber-300 mb-3">Natural remedies can:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      "Interact with medications",
                      "Cause allergic reactions",
                      "Be unsafe during pregnancy",
                      "Harm children or elderly"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-white">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Second Row - Consult Professional (Full Width) */}
          <motion.div className="mb-6" {...fadeInUp}>
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Always Consult a Healthcare Professional</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  Before starting any new health regimen, herbal supplement, or natural remedy:
                </p>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    "Consult with your doctor",
                    "Discuss medication interactions",
                    "Get proper diagnosis",
                    "Consider your medical history",
                    "Account for allergies",
                    "Seek advice if pregnant"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Third Row - Emergency + AI Side by Side */}
          <motion.div 
            className="grid md:grid-cols-2 gap-6 mb-6"
            {...fadeInUp}
          >
            {/* Emergency Situations */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Medical Emergencies</h2>
              </div>
              <CardContent className="p-6">
                <div className="bg-rose-50 dark:bg-gray-800 rounded-xl p-5 text-center mb-5 border border-rose-200 dark:border-rose-600">
                  <p className="text-rose-800 dark:text-rose-300 font-bold text-lg mb-2">
                    DO NOT use PlantRx for emergencies
                  </p>
                  <p className="text-rose-700 dark:text-rose-400">
                    Call emergency services immediately
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { number: "999", country: "UK" },
                    { number: "911", country: "US" },
                    { number: "112", country: "EU" }
                  ].map((item, i) => (
                    <div key={i} className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{item.number}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.country}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Content Disclaimer */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Content (Remy)</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  PlantRx features "Remy," an AI-powered assistant. Please be aware:
                </p>
                
                <div className="space-y-3">
                  {[
                    "AI responses may contain inaccuracies",
                    "NOT reviewed by medical professionals",
                    "Always verify with healthcare providers",
                    "We are not liable for AI-based actions"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                      <AlertTriangle className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bottom Row - Assumption of Risk (Full Width) */}
          <motion.div {...fadeInUp}>
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assumption of Risk</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  By using PlantRx, you acknowledge and agree that:
                </p>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: AlertTriangle, text: "You use all information at your own risk" },
                    { icon: Heart, text: "You are solely responsible for your health decisions" },
                    { icon: Shield, text: "PlantRx Ltd is not liable for any adverse effects" },
                    { icon: Stethoscope, text: "You will seek professional medical advice when needed" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-5 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                      <item.icon className="w-8 h-8 text-slate-600 dark:text-slate-400 mb-3" />
                      <span className="text-gray-900 dark:text-white text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              <FileText className="w-4 h-4" />
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </Link>
            <Link href="/liability" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              <AlertTriangle className="w-4 h-4" />
              Liability Waiver
            </Link>
            <Link href="/contact" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
