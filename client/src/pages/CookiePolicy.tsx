import Header from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Cookie, 
  Settings, 
  BarChart3, 
  Megaphone, 
  Shield, 
  Lock, 
  ExternalLink, 
  Mail, 
  CheckCircle,
  FileText,
  MessageCircle
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0.92, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.35, ease: "easeOut" }
};

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEOHead 
        title="Cookie Policy - How We Use Cookies | PlantRx"
        description="Learn how PlantRx uses cookies and similar technologies to improve your experience, provide analytics, and deliver personalized content."
        keywords="cookie policy, cookies, tracking technologies, privacy, GDPR, PlantRx cookies"
        canonical="https://plantrxapp.com/cookie-policy"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <BackButton />
          
          <motion.div 
            className="text-center mt-8"
            {...fadeInUp}
          >
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Cookie className="w-4 h-4" />
              Privacy & Cookies
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Cookie Policy
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Understanding how we use cookies to improve your experience on PlantRx.
            </p>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              Last updated: November 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Are Cookies Banner */}
      <section className="py-8 bg-orange-50 dark:bg-gray-900 border-y border-orange-200 dark:border-orange-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left"
            {...fadeInUp}
          >
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">What Are Cookies?</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Cookies are small text files stored on your device when you visit websites. They help us remember your preferences, understand how you use our site, and deliver relevant content.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Cookie Types Grid */}
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Types of Cookies We Use</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              
              {/* Essential */}
              <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
                <div className="h-2 bg-emerald-500" />
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Essential Cookies</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Required for the website to function. These enable core functionality like security, network management, and accessibility.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Always Active
                  </div>
                </CardContent>
              </Card>

              {/* Authentication */}
              <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
                <div className="h-2 bg-blue-500" />
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Authentication</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Used to keep you logged in securely and manage your session. Essential for accessing your account and personalized features.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                    Firebase
                  </div>
                </CardContent>
              </Card>

              {/* Analytics */}
              <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
                <div className="h-2 bg-purple-500" />
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Help us understand how visitors interact with our website by collecting anonymous statistics about page visits and traffic.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                    Google Analytics 4
                  </div>
                </CardContent>
              </Card>

              {/* Advertising */}
              <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
                <div className="h-2 bg-amber-500" />
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Megaphone className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Advertising</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Used to deliver personalized advertisements based on your browsing history and interests across websites.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-medium">
                    Google AdSense
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
                <div className="h-2 bg-teal-500" />
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Preferences</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Remember your settings like theme (light/dark mode), language preferences, and other customizations.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-xs font-medium">
                    Local Storage
                  </div>
                </CardContent>
              </Card>

              {/* Payments */}
              <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
                <div className="h-2 bg-indigo-500" />
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Payment Security</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Stripe uses cookies to process payments securely and prevent fraud on transactions.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-medium">
                    Stripe
                  </div>
                </CardContent>
              </Card>

            </div>
          </motion.div>

          {/* Two Column Layout */}
          <motion.div 
            className="grid lg:grid-cols-2 gap-6 mb-6"
            {...fadeInUp}
          >
            {/* Managing Cookies */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Managing Cookies</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  You can control and manage cookies in several ways:
                </p>
                
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Browser Settings</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Most browsers allow you to block or delete cookies through their settings.</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Opt-Out Tools</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Use Google Ad Settings or DAA opt-out tools to manage advertising cookies.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GDPR Compliance */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">GDPR Compliance</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  Under UK GDPR and ePrivacy regulations:
                </p>
                
                <div className="space-y-3">
                  {[
                    "We display a cookie consent banner on first visit",
                    "You can accept or reject non-essential cookies",
                    "You can change your preferences at any time",
                    "We respect 'Do Not Track' browser signals"
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

          {/* Third-Party Services - Full Width */}
          <motion.div className="mb-6" {...fadeInUp}>
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden">
              <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Third-Party Services</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  We use services from third parties that may place cookies on your device. Click to view their privacy policies:
                </p>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: "Google Analytics", desc: "Traffic analysis", url: "https://policies.google.com/privacy" },
                    { name: "Google AdSense", desc: "Advertising", url: "https://policies.google.com/technologies/ads" },
                    { name: "Firebase", desc: "Authentication", url: "https://firebase.google.com/support/privacy" },
                    { name: "Stripe", desc: "Payments", url: "https://stripe.com/privacy" }
                  ].map((service, i) => (
                    <a key={i} href={service.url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{service.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{service.desc}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Section */}
          <motion.div {...fadeInUp}>
            <Card className="bg-gradient-to-r from-orange-500 to-amber-500 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 text-white">
                    <Mail className="w-10 h-10" />
                    <div>
                      <h3 className="text-xl font-bold">Questions About Cookies?</h3>
                      <p className="text-white/90">Contact us at support@plantrxapp.com</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:support@plantrxapp.com" 
                    className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Contact Support
                  </a>
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
            <Link href="/privacy-policy" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </Link>
            <Link href="/terms" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              <FileText className="w-4 h-4" />
              Terms & Conditions
            </Link>
            <Link href="/disclaimer" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              <Shield className="w-4 h-4" />
              Medical Disclaimer
            </Link>
            <Link href="/contact" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
