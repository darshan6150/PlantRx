import Header from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Shield,
  FileText,
  MessageCircle,
  Camera,
  AlertCircle,
  RefreshCcw
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0.92, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.35, ease: "easeOut" }
};

export default function Refunds() {
  const handleEmailRefund = () => {
    window.location.href = "mailto:billing@plantrxapp.com";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEOHead 
        title="Refund Policy | PlantRx"
        description="PlantRx refund and return policy. Returns accepted for damaged or incorrect items within 7 days. Learn how to request a refund."
        keywords="refund policy, returns, money back, PlantRx refunds, damaged items"
        canonical="https://plantrxapp.com/refunds"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <BackButton />
          
          <motion.div 
            className="text-center mt-8"
            {...fadeInUp}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Refund Policy
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Returns & Refunds
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We want you to be satisfied, but due to the nature of our products, please review our policy below.
            </p>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              Last updated: December 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Quick Summary Cards */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mb-10"
            {...fadeInUp}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">7 Days</p>
              <p className="text-gray-600 dark:text-gray-400">Return Window</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCcw className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">5–10 Days</p>
              <p className="text-gray-600 dark:text-gray-400">Refund Processing</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">billing@plantrxapp.com</p>
              <p className="text-gray-600 dark:text-gray-400">Contact for Refunds</p>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-6">
              
              {/* Returns Policy */}
              <motion.div {...fadeInUp}>
                <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
                  <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Returns Policy</h2>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                      We want you to be completely satisfied with your purchase. If something isn't right, we're here to help.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Damaged Items</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Products that arrived broken or damaged</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Incorrect Items</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Products that don't match your order</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Non-Returnable */}
              <motion.div {...fadeInUp}>
                <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
                  <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Non-Returnable Items</h2>
                  </div>
                  <CardContent className="p-6">
                    <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-5 border border-red-200 dark:border-red-800">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white mb-2">Opened Products</p>
                          <p className="text-gray-700 dark:text-gray-300">
                            For hygiene and safety reasons, we cannot accept returns on supplements or remedies that have been opened or used.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">

              {/* Refund Process */}
              <motion.div {...fadeInUp}>
                <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
                  <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <RefreshCcw className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Refund Process</h2>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        { step: "1", title: "Submit Request", desc: "Email us with your order details" },
                        { step: "2", title: "Review", desc: "We'll review your request within 48 hours" },
                        { step: "3", title: "Approval", desc: "If approved, we'll confirm next steps" },
                        { step: "4", title: "Refund", desc: "Processed within 5–10 business days" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{item.step}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* How to Request */}
              <motion.div {...fadeInUp}>
                <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg overflow-hidden h-full">
                  <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Request a Refund</h2>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                      Please include the following in your email:
                    </p>
                    
                    <div className="grid grid-cols-1 gap-3 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-white">Order number</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-white">Reason for return</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Camera className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-white">Photos of damage (if applicable)</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleEmailRefund}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 text-lg font-medium rounded-xl"
                      data-testid="button-request-refund"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Email billing@plantrxapp.com
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </div>

        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <FileText className="w-4 h-4" />
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </Link>
            <Link href="/contact" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
