import Header from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Copyright, 
  FileWarning, 
  Send, 
  Shield, 
  AlertTriangle, 
  Scale, 
  Mail, 
  FileText,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Gavel
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0.92, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.35, ease: "easeOut" }
};

export default function DMCAPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEOHead 
        title="DMCA Policy - Copyright Infringement | PlantRx"
        description="PlantRx DMCA policy for copyright infringement reporting. Learn how to submit takedown notices and counter-notifications for copyrighted content."
        keywords="DMCA policy, copyright infringement, takedown notice, intellectual property, copyright claim, PlantRx DMCA"
        canonical="https://plantrxapp.com/dmca"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <BackButton />
          
          <motion.div 
            className="text-center mt-8"
            {...fadeInUp}
          >
            <div className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Copyright className="w-4 h-4" />
              Intellectual Property
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              DMCA Policy
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our commitment to respecting intellectual property rights and handling copyright claims under the Digital Millennium Copyright Act.
            </p>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              Last updated: November 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Important Notice Banner */}
      <section className="py-8 bg-slate-100 dark:bg-gray-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left"
            {...fadeInUp}
          >
            <div className="w-16 h-16 bg-slate-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Digital Millennium Copyright Act (17 U.S.C. § 512)</h2>
              <p className="text-gray-700 dark:text-gray-300">
                PlantRx Ltd respects intellectual property rights and complies with the DMCA. We respond promptly to valid copyright infringement notices and have procedures for counter-notifications.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* DMCA Notice Requirements - Full Width */}
          <motion.div className="mb-8" {...fadeInUp}>
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <FileWarning className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filing a DMCA Takedown Notice</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Required elements under 17 U.S.C. § 512(c)(3)</p>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  If you believe your copyrighted work has been copied in a way that constitutes copyright infringement, your DMCA notice must contain the following elements:
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { num: 1, title: "Signature", desc: "A physical or electronic signature of the copyright owner or authorized agent" },
                    { num: 2, title: "Identification of Work", desc: "Identification of the copyrighted work claimed to have been infringed" },
                    { num: 3, title: "Infringing Material Location", desc: "The exact URL or specific location where the infringing material is located on PlantRx" },
                    { num: 4, title: "Contact Information", desc: "Your full legal name, mailing address, telephone number, and email address" },
                    { num: 5, title: "Good Faith Statement", desc: "A statement that you have a good faith belief that use of the material is not authorized by the copyright owner" },
                    { num: 6, title: "Accuracy Under Penalty of Perjury", desc: "A statement under penalty of perjury that the information is accurate and you are the copyright owner or authorized agent" }
                  ].map((item) => (
                    <div key={item.num} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{item.num}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Designated Agent + Response Process */}
          <motion.div 
            className="grid lg:grid-cols-2 gap-6 mb-6"
            {...fadeInUp}
          >
            {/* Designated Agent */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Designated DMCA Agent</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  Send your DMCA takedown notice to our designated copyright agent:
                </p>
                
                <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-5 border border-blue-200 dark:border-blue-700 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 dark:text-white w-20">Agent:</span>
                    <span className="text-gray-700 dark:text-gray-300">PlantRx Ltd Legal Department</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 dark:text-white w-20">Email:</span>
                    <a href="mailto:legal@plantrxapp.com" className="text-blue-600 dark:text-blue-400 hover:underline">legal@plantrxapp.com</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 dark:text-white w-20">Subject:</span>
                    <span className="text-gray-700 dark:text-gray-300">DMCA Takedown Notice</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-gray-900 dark:text-white w-20">Address:</span>
                    <span className="text-gray-700 dark:text-gray-300">PlantRx Ltd, London, United Kingdom</span>
                  </div>
                </div>
                
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 italic">
                  Include "DMCA Takedown Notice" in the subject line for faster processing.
                </p>
              </CardContent>
            </Card>

            {/* Response Timeline */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Our Response Process</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  Upon receiving a valid DMCA notice:
                </p>
                
                <div className="space-y-3">
                  {[
                    "Promptly remove or disable access to the alleged infringing content",
                    "Notify the content provider/user who posted the material",
                    "Inform them of their right to file a counter-notification",
                    "Maintain records of the notice and our response",
                    "Forward counter-notifications to the original complainant"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-gray-800 rounded-lg border border-emerald-200 dark:border-emerald-700">
                      <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Counter-Notification - Full Width */}
          <motion.div className="mb-6" {...fadeInUp}>
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <Scale className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Counter-Notification Procedure</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Under 17 U.S.C. § 512(g)</p>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  If you believe your content was wrongly removed due to mistake or misidentification, you may submit a counter-notification containing:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    "Your physical or electronic signature",
                    "Identification of the removed material and its prior location",
                    "A statement under penalty of perjury that you believe the material was removed by mistake",
                    "Your full legal name, address, and telephone number",
                    "Consent to jurisdiction of federal court in your district (or where PlantRx is located if outside US)",
                    "Agreement to accept service of process from the original complainant"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-700">
                      <span className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i+1}</span>
                      <span className="text-gray-900 dark:text-white text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 dark:bg-gray-800 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <p className="text-gray-900 dark:text-white font-medium text-sm">
                    <strong>Restoration Timeline:</strong> If the original complainant does not file a court action within 10-14 business days of receiving the counter-notification, we may restore the removed content.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Repeat Infringers + Misrepresentation Warning */}
          <motion.div 
            className="grid lg:grid-cols-2 gap-6 mb-6"
            {...fadeInUp}
          >
            {/* Repeat Infringers */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Repeat Infringer Policy</h2>
              </div>
              <CardContent className="p-6">
                <div className="bg-rose-50 dark:bg-gray-800 border-l-4 border-rose-500 p-4 rounded-r-lg mb-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    PlantRx maintains a policy of terminating accounts of users who are repeat infringers in appropriate circumstances.
                  </p>
                </div>
                
                <div className="space-y-3">
                  {[
                    "First offense: Content removal and warning",
                    "Second offense: Temporary account suspension",
                    "Third offense: Permanent account termination"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Misrepresentation Warning */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Misrepresentation Warning</h2>
              </div>
              <CardContent className="p-6">
                <div className="bg-purple-50 dark:bg-gray-800 border-l-4 border-purple-500 p-4 rounded-r-lg mb-4">
                  <p className="text-gray-900 dark:text-white font-medium text-sm">
                    Under Section 512(f) of the DMCA, knowingly materially misrepresenting that material is infringing may result in liability.
                  </p>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">You may be liable for damages including:</p>
                
                <div className="space-y-2">
                  {[
                    "Costs and attorney's fees incurred by the alleged infringer",
                    "Costs incurred by the copyright owner or licensee",
                    "Costs incurred by the service provider (PlantRx)"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Safe Harbor + Good Faith */}
          <motion.div 
            className="grid lg:grid-cols-2 gap-6 mb-6"
            {...fadeInUp}
          >
            {/* Safe Harbor */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Safe Harbor Provisions</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  As a service provider under the DMCA, PlantRx qualifies for safe harbor protection when we:
                </p>
                
                <div className="space-y-3">
                  {[
                    "Do not have actual knowledge of infringing material",
                    "Are not aware of facts indicating infringement is apparent",
                    "Act expeditiously to remove content upon notification",
                    "Do not receive financial benefit directly from infringement"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <CheckCircle className="w-5 h-5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Good Faith Actions */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Good Faith Actions</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  PlantRx will not be liable to any user for good faith removal of material in response to a valid DMCA notice, including:
                </p>
                
                <div className="space-y-3">
                  {[
                    "Content removal based on a valid takedown notice",
                    "Account warnings or suspensions for infringement",
                    "Forwarding of counter-notifications to complainants",
                    "Restoration of content after valid counter-notification"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-teal-50 dark:bg-gray-800 rounded-lg border border-teal-200 dark:border-teal-700">
                      <CheckCircle className="w-5 h-5 text-teal-500 dark:text-teal-400 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white text-sm">{item}</span>
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
            <Link href="/terms" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
              <FileText className="w-4 h-4" />
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </Link>
            <Link href="/liability" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
              <Scale className="w-4 h-4" />
              Liability Waiver
            </Link>
            <Link href="/contact" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
