import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Heart, Target, Users, Shield, CheckCircle, ChevronRight, Sparkles, Leaf, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0.4 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0.4, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export default function OurMission() {
  const whatWeProvide = [
    { text: "Clear explanations", icon: "📖" },
    { text: "Natural remedies that make sense", icon: "🌿" },
    { text: "Evidence-based insights", icon: "🔬" },
    { text: "Culturally rooted wellness practices", icon: "🌍" },
    { text: "A safe space to explore natural healing", icon: "🏡" },
    { text: "A clean platform built for people, not algorithms", icon: "💚" }
  ];

  const problems = [
    { text: "Overwhelmed", icon: "😰" },
    { text: "Under-informed", icon: "❓" },
    { text: "Misled by poor-quality content", icon: "⚠️" },
    { text: "Searching for answers that actually work", icon: "🔍" }
  ];

  const howWeHelp = [
    { text: "Understand their symptoms", icon: "🩺" },
    { text: "Explore safe natural options", icon: "🌱" },
    { text: "Learn from verified knowledge", icon: "✅" },
    { text: "Improve daily wellness", icon: "💪" },
    { text: "Build healthier habits", icon: "🎯" }
  ];

  const promises = [
    { text: "Stay natural", icon: "🌿", color: "from-green-500 to-emerald-600" },
    { text: "Stay transparent", icon: "🔍", color: "from-blue-500 to-indigo-600" },
    { text: "Stay educational", icon: "📚", color: "from-purple-500 to-pink-600" },
    { text: "Stay focused on helping people", icon: "❤️", color: "from-rose-500 to-pink-600" },
    { text: "Stay committed to accurate and responsible content", icon: "✓", color: "from-amber-500 to-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title="Our Mission - Making Natural Wellness Easy | PlantRx"
        description="Our mission is simple: Make natural wellness easy for everyone. PlantRx provides clear explanations, natural remedies, and evidence-based insights."
        keywords="PlantRx mission, natural wellness, health mission, wellness platform purpose"
        canonical="https://plantrxapp.com/about/mission"
      />
      
      {/* Mobile-optimized main container with generous padding */}
      <main className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16 relative">
        {/* Floating Background Elements - hidden on mobile for performance */}
        <div className="hidden sm:block fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[5%] w-32 h-32 bg-gradient-to-br from-rose-400/10 to-pink-500/10 dark:from-rose-400/5 dark:to-pink-500/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 right-[10%] w-40 h-40 bg-gradient-to-br from-purple-400/10 to-indigo-500/10 dark:from-purple-400/5 dark:to-indigo-500/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-40 left-[15%] w-36 h-36 bg-gradient-to-br from-green-400/10 to-emerald-500/10 dark:from-green-400/5 dark:to-emerald-500/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 18, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-20 right-[20%] w-28 h-28 bg-gradient-to-br from-amber-400/10 to-orange-500/10 dark:from-amber-400/5 dark:to-orange-500/5 rounded-full blur-3xl"
          />
        </div>

        {/* Content wrapper with vertical spacing */}
        <div className="space-y-5 sm:space-y-12 lg:space-y-16">
          
          {/* Breadcrumb - Mobile optimized with wrapping */}
          <motion.nav 
            initial={{ opacity: 0.4, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm text-gray-600 dark:text-gray-400 relative z-10" 
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 min-h-[44px] flex items-center px-1 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link href="/about" className="hover:text-green-600 dark:hover:text-green-400 min-h-[44px] flex items-center px-1 transition-colors">About</Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="text-gray-900 dark:text-white font-medium px-1">Our Mission</span>
          </motion.nav>

          {/* Back Button - Touch friendly */}
          <motion.div
            initial={{ opacity: 0.4, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10"
          >
            <Link href="/">
              <Button 
                variant="outline" 
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[48px] px-5 text-base active:scale-95 transition-transform"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Hero Section - Mobile centered with proper spacing */}
          <motion.div 
            initial={{ opacity: 0.4, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center relative z-10 py-2 sm:py-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
              className="w-14 h-14 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-rose-500/20"
            >
              <Heart className="w-7 h-7 sm:w-12 sm:h-12 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0.4, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-2 sm:mb-5"
            >
              <Badge className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 dark:from-rose-900/40 dark:to-pink-900/40 dark:text-rose-300 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 inline" />
                Our Purpose
              </Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0.4, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-6 tracking-tight"
            >
              <span className="bg-gradient-to-r from-gray-900 via-rose-800 to-pink-900 dark:from-white dark:via-rose-200 dark:to-pink-200 bg-clip-text text-transparent">
                Our Mission
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0.4, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-base sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto font-medium leading-relaxed px-2"
            >
              Make natural wellness easy for everyone.
            </motion.p>
          </motion.div>

          {/* Main Problem Statement Card */}
          <motion.div
            initial={{ opacity: 0.4, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative z-10"
          >
            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200 dark:border-rose-800 overflow-hidden shadow-lg">
              <CardContent className="p-4 sm:p-8 lg:p-12 text-center">
                <p className="text-sm sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-8 max-w-3xl mx-auto">
                  The world is overwhelmed by conflicting health advice, long medical explanations, and misinformation. People want natural solutions — but the internet makes it hard to trust anything.
                </p>
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-4 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-full font-bold text-sm sm:text-lg lg:text-xl shadow-lg shadow-rose-500/30"
                >
                  <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
                  <span>PlantRx solves that problem.</span>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* What We Provide Section */}
          <motion.div
            initial={{ opacity: 0.4, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative z-10"
          >
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
              <motion.div 
                className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-600"
                initial={{ scaleX: 0.3 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ transformOrigin: "left" }}
              />
              <CardContent className="p-4 sm:p-8 lg:p-10">
                {/* Section Header - Stacked on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CheckCircle className="w-5 h-5 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">We Provide</h2>
                </div>
                
                {/* Grid with proper mobile spacing */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-5"
                >
                  {whatWeProvide.map((item, index) => (
                    <motion.div 
                      key={index} 
                      variants={itemVariants}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-5 bg-green-50 dark:bg-green-900/20 rounded-lg sm:rounded-xl border border-green-100 dark:border-green-800/50 active:bg-green-100 dark:active:bg-green-900/30 transition-colors min-h-[48px] sm:min-h-[64px]"
                    >
                      <span className="text-lg sm:text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                      <span className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* The Problem Section */}
          <motion.div
            initial={{ opacity: 0.4, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative z-10"
          >
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
              <motion.div 
                className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-600"
                initial={{ scaleX: 0.3 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ transformOrigin: "left" }}
              />
              <CardContent className="p-4 sm:p-8 lg:p-10">
                {/* Section Header - Stacked on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-amber-100 dark:bg-amber-900/30 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Target className="w-5 h-5 sm:w-8 sm:h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">The Problem We're Solving</h2>
                </div>
                
                <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 mb-3 sm:mb-6 leading-relaxed">
                  People today are:
                </p>
                
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-4 mb-4 sm:mb-8"
                >
                  {problems.map((problem, index) => (
                    <motion.div 
                      key={index} 
                      variants={itemVariants}
                      className="flex items-center gap-2 sm:gap-4 p-2.5 sm:p-5 bg-amber-50 dark:bg-amber-900/20 rounded-lg sm:rounded-xl border border-amber-200 dark:border-amber-800 active:bg-amber-100 dark:active:bg-amber-900/30 transition-colors min-h-[44px] sm:min-h-[56px]"
                    >
                      <span className="text-lg sm:text-2xl flex-shrink-0">{problem.icon}</span>
                      <span className="text-xs sm:text-lg text-gray-700 dark:text-gray-300 font-medium">{problem.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
                
                <div className="p-3 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 rounded-lg sm:rounded-xl border border-amber-200 dark:border-amber-700">
                  <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 font-medium text-center leading-relaxed">
                    PlantRx cuts through the noise by focusing on{" "}
                    <span className="text-amber-600 dark:text-amber-400 font-bold">clarity</span>,{" "}
                    <span className="text-amber-600 dark:text-amber-400 font-bold">education</span>, and{" "}
                    <span className="text-amber-600 dark:text-amber-400 font-bold">usability</span>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How We Serve Section */}
          <motion.div
            initial={{ opacity: 0.4, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative z-10"
          >
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
              <motion.div 
                className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"
                initial={{ scaleX: 0.3 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ transformOrigin: "left" }}
              />
              <CardContent className="p-4 sm:p-8 lg:p-10">
                {/* Section Header - Stacked on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Users className="w-5 h-5 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">How We Serve the Community</h2>
                </div>
                
                <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 mb-3 sm:mb-6 leading-relaxed">
                  We help users:
                </p>
                
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-2.5 sm:space-y-4 mb-4 sm:mb-8"
                >
                  {howWeHelp.map((item, index) => (
                    <motion.div 
                      key={index} 
                      variants={itemVariants}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl border border-blue-100 dark:border-blue-800/50 active:bg-blue-100 dark:active:bg-blue-900/30 transition-colors min-h-[44px] sm:min-h-[56px]"
                    >
                      <span className="text-lg sm:text-2xl flex-shrink-0">{item.icon}</span>
                      <span className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
                
                <div className="p-3 sm:p-5 bg-amber-50 dark:bg-amber-900/20 rounded-lg sm:rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-2 sm:gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-base text-amber-800 dark:text-amber-300 leading-relaxed">
                    We do this without claiming to diagnose or treat any condition and always encourage professional medical support when needed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Our Promise Section */}
          <motion.div
            initial={{ opacity: 0.4, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative z-10"
          >
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
              <motion.div 
                className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-600"
                initial={{ scaleX: 0.3 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ transformOrigin: "left" }}
              />
              <CardContent className="p-4 sm:p-8 lg:p-10">
                {/* Section Header - Stacked on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Shield className="w-5 h-5 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Our Promise</h2>
                </div>
                
                <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 mb-3 sm:mb-8 leading-relaxed">
                  We promise to:
                </p>
                
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-2.5 sm:space-y-5 mb-4 sm:mb-10"
                >
                  {promises.map((promise, index) => (
                    <motion.div 
                      key={index} 
                      variants={itemVariants}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-5 bg-purple-50 dark:bg-purple-900/20 rounded-lg sm:rounded-xl border border-purple-100 dark:border-purple-800/50 active:bg-purple-100 dark:active:bg-purple-900/30 transition-colors min-h-[48px] sm:min-h-[64px]"
                    >
                      <div className={`w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-r ${promise.color} rounded-lg flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                        <span className="text-base sm:text-xl">{promise.icon}</span>
                      </div>
                      <span className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 font-semibold leading-snug">{promise.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
                
                <div className="text-center p-4 sm:p-8 bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-rose-900/30 rounded-xl sm:rounded-2xl">
                  <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-relaxed">
                    PlantRx exists to <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">empower people</span> — not confuse them.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation Cards - Touch optimized, side-by-side on mobile */}
          <motion.div
            initial={{ opacity: 0.4, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="grid grid-cols-2 gap-2.5 sm:gap-6 relative z-10 pb-4"
          >
            <Link href="/about/me">
              <motion.div whileTap={{ scale: 0.98 }}>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 hover:shadow-xl active:shadow-lg transition-all cursor-pointer group overflow-hidden min-h-[90px] sm:min-h-[120px]">
                  <CardContent className="p-2.5 sm:p-6 flex flex-col items-center justify-center text-center relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <div className="w-8 h-8 sm:w-14 sm:h-14 bg-blue-100 dark:bg-blue-900/50 rounded-lg sm:rounded-xl flex items-center justify-center mb-1.5 sm:mb-3">
                      <Sparkles className="w-4 h-4 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-xs sm:text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-0.5 sm:mb-1">The Creator</h3>
                    <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400">Meet the founder</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
            <Link href="/about/plantrx">
              <motion.div whileTap={{ scale: 0.98 }}>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 hover:shadow-xl active:shadow-lg transition-all cursor-pointer group overflow-hidden min-h-[90px] sm:min-h-[120px]">
                  <CardContent className="p-2.5 sm:p-6 flex flex-col items-center justify-center text-center relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <div className="w-8 h-8 sm:w-14 sm:h-14 bg-green-100 dark:bg-green-900/50 rounded-lg sm:rounded-xl flex items-center justify-center mb-1.5 sm:mb-3">
                      <Leaf className="w-4 h-4 sm:w-7 sm:h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-xs sm:text-lg text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors mb-0.5 sm:mb-1">About PlantRx</h3>
                    <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400">Learn about our platform</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
