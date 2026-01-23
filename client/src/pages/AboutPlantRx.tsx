import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Leaf, Database, Bot, Users, ShoppingBag, BookOpen, ChevronRight, Sparkles, Award, Check, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "framer-motion";

const fadeInVariants = {
  hidden: { opacity: 0.3, y: 24 },
  visible: { opacity: 1, y: 0 }
};

function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const features = [
  {
    icon: Database,
    title: "131 Plant Remedies",
    subtitle: "Searchable database",
    description: "Each remedy includes preparation instructions, traditional uses, safety notes, and scientific references where available. You can search by symptom, plant name, or browse by category.",
    gradient: "from-emerald-500 to-green-600",
    bgLight: "bg-emerald-100",
    bgDark: "dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400"
  },
  {
    icon: Bot,
    title: "AI Health Assistant",
    subtitle: '"Remy" - powered by ChatGPT & Gemini',
    description: "Ask questions about natural remedies, symptoms, or wellness topics. Remy draws from our remedy database and general health knowledge to give personalized responses. Available on Silver and Gold subscriptions.",
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-100",
    bgDark: "dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: Users,
    title: "Community",
    subtitle: "Share and discuss",
    description: "A space where members can share their experiences with natural remedies, ask questions, and connect with others interested in plant-based health. You can post, comment, and follow other members.",
    gradient: "from-purple-500 to-pink-600",
    bgLight: "bg-purple-100",
    bgDark: "dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400"
  },
  {
    icon: ShoppingBag,
    title: "Store",
    subtitle: "Curated products",
    description: "A selection of herbal products, supplements, and wellness items. We partner with suppliers who meet our quality standards. Products link directly to our Shopify store for checkout.",
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-100",
    bgDark: "dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400"
  }
];

const tiers = [
  { name: "Bronze", label: "Free", features: ["Browse remedies", "Read articles", "Join community"], color: "from-amber-600 to-amber-700" },
  { name: "Silver", label: "$9/mo", features: ["AI assistant access", "Save remedies", "Advanced search"], color: "from-gray-400 to-gray-500" },
  { name: "Gold", label: "$19/mo", features: ["Full AI access", "Priority support", "Exclusive content"], color: "from-yellow-400 to-amber-500" }
];

export default function AboutPlantRx() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title="About PlantRx - Natural Health Information Platform"
        description="PlantRx is a natural health platform with 131 verified plant remedies, AI-powered guidance, and a growing wellness community."
        keywords="PlantRx, natural remedies, herbal medicine, plant-based health"
        canonical="https://plantrxapp.com/about/plantrx"
      />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 relative z-10">
        {/* Floating Background Elements - using CSS animations for smoother performance */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 left-[5%] w-32 h-32 bg-gradient-to-br from-green-400/8 to-emerald-500/8 dark:from-green-400/4 dark:to-emerald-500/4 rounded-full blur-2xl animate-float-slow" />
          <div className="absolute top-40 right-[10%] w-40 h-40 bg-gradient-to-br from-blue-400/8 to-indigo-500/8 dark:from-blue-400/4 dark:to-indigo-500/4 rounded-full blur-2xl animate-float-slower" />
          <div className="absolute bottom-40 left-[15%] w-36 h-36 bg-gradient-to-br from-purple-400/8 to-pink-500/8 dark:from-purple-400/4 dark:to-pink-500/4 rounded-full blur-2xl animate-float-medium" />
          <div className="absolute bottom-20 right-[20%] w-28 h-28 bg-gradient-to-br from-amber-400/8 to-orange-500/8 dark:from-amber-400/4 dark:to-orange-500/4 rounded-full blur-2xl animate-float-slow" />
        </div>

        {/* Breadcrumb */}
        <FadeInSection>
          <nav 
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6" 
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 min-h-[44px] flex items-center transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/about" className="hover:text-green-600 dark:hover:text-green-400 min-h-[44px] flex items-center transition-colors">About</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white font-medium">About PlantRx</span>
          </nav>
        </FadeInSection>

        {/* Back Button */}
        <FadeInSection delay={0.05}>
          <Link href="/">
            <Button variant="outline" className="mb-8 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>
        </FadeInSection>

        {/* Hero Section */}
        <FadeInSection delay={0.1} className="text-center mb-16 sm:mb-20 relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/20">
            <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          
          <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/40 dark:to-emerald-900/40 dark:text-green-300 mb-4 px-4 py-1.5 text-sm">
            <Sparkles className="w-3 h-3 mr-1.5 inline" />
            Natural Health Platform
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 dark:from-white dark:via-green-200 dark:to-emerald-200 bg-clip-text text-transparent">
              What is PlantRx?
            </span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            PlantRx is a natural health information platform. We organize plant-based remedies, health articles, and wellness tools into one place so you can find what you need without digging through dozens of websites.
          </p>
        </FadeInSection>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {features.map((feature, i) => (
            <FadeInSection key={feature.title} delay={i * 0.08}>
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                <div className={`h-1.5 bg-gradient-to-r ${feature.gradient}`} />
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 ${feature.bgLight} ${feature.bgDark} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <feature.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{feature.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </FadeInSection>
          ))}
        </div>

        {/* How Content is Made Section */}
        <FadeInSection className="mb-16 sm:mb-20">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
            <div className="h-1.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">How the content is made</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 sm:gap-10">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-base sm:text-lg flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Remedy information comes from:
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Traditional herbal medicine texts and practices",
                      "Published research studies (linked where available)",
                      "Herbalist and naturopath knowledge"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-base sm:text-lg flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500" />
                    What we don't do:
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Claim to diagnose or treat diseases",
                      "Replace professional medical advice",
                      "Make exaggerated health claims"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 p-4 sm:p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 dark:text-amber-300 text-sm sm:text-base">
                  PlantRx is for educational purposes. Always consult a healthcare provider before starting any new health regimen, especially if you have existing conditions or take medications.
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeInSection>

        {/* Subscription Tiers */}
        <FadeInSection className="mb-16 sm:mb-20">
          <div className="text-center mb-10">
            <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 dark:from-emerald-900/40 dark:to-green-900/40 dark:text-emerald-300 mb-4 px-4 py-1.5">
              <Award className="w-3 h-3 mr-1.5 inline" />
              Membership
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Subscription Tiers
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {tiers.map((tier) => (
              <Card key={tier.name} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                <div className={`h-1.5 sm:h-2 bg-gradient-to-r ${tier.color}`} />
                <CardContent className="p-2 sm:p-6">
                  <div className="text-center mb-2 sm:mb-4">
                    <h3 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white mb-0.5 sm:mb-1">{tier.name}</h3>
                    <span className={`inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm font-medium bg-gradient-to-r ${tier.color} text-white`}>
                      {tier.label}
                    </span>
                  </div>
                  <ul className="space-y-1.5 sm:space-y-3">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-gray-700 dark:text-gray-300">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <Sparkles className="w-4 h-4 inline mr-1 text-amber-500" />
            New members get a <span className="text-amber-600 dark:text-amber-400 font-medium">24-hour Gold trial</span> to explore premium features.
          </p>
        </FadeInSection>

        {/* Navigation Cards - Side by side on mobile, smaller size */}
        <FadeInSection className="grid grid-cols-2 gap-3 sm:gap-6">
          <Link href="/about/me">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 hover:shadow-xl hover:-translate-y-1 active:scale-98 transition-all cursor-pointer group overflow-hidden h-full">
              <CardContent className="p-3 sm:p-6 flex flex-col items-center justify-center text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-0.5 sm:mb-1">The Creator</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Who built this and why</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/about/mission">
            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200 dark:border-rose-800 hover:shadow-xl hover:-translate-y-1 active:scale-98 transition-all cursor-pointer group overflow-hidden h-full">
              <CardContent className="p-3 sm:p-6 flex flex-col items-center justify-center text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/5 to-rose-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-100 dark:bg-rose-900/50 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors mb-0.5 sm:mb-1">Our Mission</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">What we're trying to accomplish</p>
              </CardContent>
            </Card>
          </Link>
        </FadeInSection>
      </main>
    </div>
  );
}
