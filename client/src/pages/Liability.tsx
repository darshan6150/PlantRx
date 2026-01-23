import Header from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Scale, 
  AlertTriangle, 
  ShieldX, 
  CheckCircle, 
  FileWarning, 
  Gavel, 
  Mail, 
  Shield,
  FileText,
  MessageCircle,
  XCircle
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0.92, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.35, ease: "easeOut" }
};

export default function Liability() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEOHead 
        title="Liability Waiver - Terms of Use | PlantRx"
        description="Liability waiver and terms for using PlantRx. Understand your responsibilities and our limitations when using our natural health information platform."
        keywords="liability waiver, terms of use, disclaimer, risk assumption, PlantRx liability"
        canonical="https://plantrxapp.com/liability"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <BackButton />
          
          <motion.div 
            className="text-center mt-8"
            {...fadeInUp}
          >
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Scale className="w-4 h-4" />
              Legal Information
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Liability Waiver
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Understanding your responsibilities and our limitations when using PlantRx.
            </p>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              Last updated: November 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Important Notice Banner */}
      <section className="py-8 bg-amber-50 dark:bg-gray-900 border-y border-amber-200 dark:border-amber-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left"
            {...fadeInUp}
          >
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Important Legal Notice</h2>
              <p className="text-gray-700 dark:text-gray-300">
                By using PlantRx, you acknowledge that you have read, understood, and agree to this liability waiver. If you do not agree to these terms, please do not use our platform.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Row - Two Cards */}
          <motion.div 
            className="grid lg:grid-cols-2 gap-6 mb-6"
            {...fadeInUp}
          >
            {/* Assumption of Risk */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Assumption of Risk</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  By accessing PlantRx, you expressly acknowledge and agree that:
                </p>
                
                <div className="space-y-3">
                  {[
                    "All content is for educational purposes only",
                    "Information may not be suitable for everyone",
                    "Individual results may vary",
                    "You use information at your own risk",
                    "You are responsible for your health decisions"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-700">
                      <span className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i+1}</span>
                      <span className="text-gray-900 dark:text-white text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Release of Claims */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <ShieldX className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. Release of Claims</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  You hereby release, waive, and forever discharge:
                </p>
                
                <div className="space-y-3">
                  {[
                    "PlantRx Ltd and its subsidiaries",
                    "Officers, directors, and employees",
                    "Content contributors and advisors",
                    "Third-party service providers"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700">
                      <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
                  From any claims arising from your use of PlantRx or any products purchased through our platform.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Limitation of Liability - Full Width */}
          <motion.div className="mb-6" {...fadeInUp}>
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <Scale className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. Limitation of Liability</h2>
              </div>
              <CardContent className="p-6">
                <div className="bg-orange-50 dark:bg-gray-800 border-l-4 border-orange-500 p-4 rounded-r-lg mb-6">
                  <p className="text-gray-900 dark:text-white font-medium">
                    To the maximum extent permitted by law, PlantRx Ltd shall not be liable for any damages whatsoever arising from your use of our platform.
                  </p>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">This includes but is not limited to:</p>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    "Direct or indirect damages",
                    "Consequential damages",
                    "Incidental damages",
                    "Loss of profits or data",
                    "Personal injury or health issues",
                    "Property or financial losses"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <span className="text-orange-500 text-lg">⊘</span>
                      <span className="text-gray-900 dark:text-white text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Second Row - Your Responsibilities + No Warranties */}
          <motion.div 
            className="grid lg:grid-cols-2 gap-6 mb-6"
            {...fadeInUp}
          >
            {/* Your Responsibilities */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">4. Your Responsibilities</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  By using PlantRx, you agree to:
                </p>
                
                <div className="space-y-3">
                  {[
                    "Consult healthcare professionals before acting",
                    "Disclose natural remedy use to your doctors",
                    "Verify information with medical sources",
                    "Monitor your health for adverse effects",
                    "Follow all safety guidelines"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-gray-800 rounded-lg border border-emerald-200 dark:border-emerald-700">
                      <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* No Warranties */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                  <FileWarning className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">5. No Warranties</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  PlantRx is provided "as is" without warranties including:
                </p>
                
                <div className="space-y-3">
                  {[
                    "Merchantability or fitness for purpose",
                    "Accuracy or completeness of content",
                    "Reliability of information provided",
                    "Uninterrupted or error-free operation",
                    "Results from using our platform"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="w-2 h-2 bg-slate-400 rounded-full flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bottom Row - Indemnification + Acknowledgment */}
          <motion.div 
            className="grid lg:grid-cols-2 gap-6"
            {...fadeInUp}
          >
            {/* Indemnification */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">6. Indemnification</h2>
              </div>
              <CardContent className="p-6">
                <div className="bg-indigo-50 dark:bg-gray-800 rounded-xl p-5 border border-indigo-200 dark:border-indigo-700">
                  <p className="text-gray-900 dark:text-white leading-relaxed">
                    You agree to indemnify, defend, and hold harmless PlantRx Ltd and its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, costs, and expenses (including legal fees) arising from your use of the platform or violation of these terms.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Acknowledgment */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">7. Acknowledgment</h2>
              </div>
              <CardContent className="p-6">
                <div className="bg-violet-50 dark:bg-gray-800 rounded-xl p-5 border border-violet-200 dark:border-violet-700">
                  <p className="text-gray-900 dark:text-white leading-relaxed">
                    By using PlantRx, you acknowledge that you have carefully read this liability waiver, understand its contents, and agree to be bound by its terms. You confirm that you are voluntarily using our platform with full knowledge of the associated risks.
                  </p>
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
            <Link href="/terms" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <FileText className="w-4 h-4" />
              Terms & Conditions
            </Link>
            <Link href="/disclaimer" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <Shield className="w-4 h-4" />
              Medical Disclaimer
            </Link>
            <Link href="/privacy-policy" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </Link>
            <Link href="/contact" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
