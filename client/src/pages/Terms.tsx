import Header from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { BackButton } from "@/components/BackButton";
import { ScrollReveal } from "@/components/ScrollReveal";
import { FileText, Building2, CheckCircle, AlertTriangle, Heart, User, CreditCard, ShoppingBag, RotateCcw, Ban, Copyright, Sparkles, Scale, Gavel, Split, FileCheck, Bell, Mail, ExternalLink, Type, Cookie, Link2, Globe, Shield, MessageSquare, Frame, Trash2, BookOpen, AlertCircle } from "lucide-react";
import { useTextSize } from "@/contexts/TextSizeContext";

export default function Terms() {
  const { textSize, setTextSize } = useTextSize();
  
  const textSizeOptions = [
    { id: "small" as const, label: "Small" },
    { id: "medium" as const, label: "Medium" },
    { id: "large" as const, label: "Large" },
    { id: "xl" as const, label: "Extra Large" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead 
        title="Terms & Conditions - PlantRx Natural Health Platform"
        description="Read PlantRx's terms and conditions, including subscription tiers, store policies, health disclaimers, and user responsibilities for our natural health platform."
        keywords="PlantRx terms, conditions, legal information, user agreement, natural health platform, subscription terms, health disclaimer"
        canonical="https://plantrxapp.com/terms"
      />
      <Header />
      
      {/* Hero Section */}
      <ScrollReveal variant="fadeUp">
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 dark:from-indigo-800 dark:via-purple-800 dark:to-violet-800 py-8 sm:py-12 lg:py-20 mb-8 sm:mb-10 lg:mb-16">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <BackButton />
            <div className="text-center mt-6 sm:mt-8 lg:mt-10">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-white/20 backdrop-blur-sm mb-4 sm:mb-6 lg:mb-8">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">Terms & Conditions</h1>
              <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Welcome to plantrxapp.com! These terms and conditions outline the rules and regulations for the use of PlantRx Website.
              </p>
              <p className="text-sm sm:text-base text-white/70 mt-3 sm:mt-4 lg:mt-6">Last updated: December 19, 2025</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pb-12 sm:pb-16 lg:pb-32">
        
        {/* Quick Summary Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 mb-12 sm:mb-16 lg:mb-20 border border-indigo-100 dark:border-indigo-800 shadow-lg">
          <div className="flex items-start gap-6 sm:gap-8 lg:gap-10">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5 lg:mb-6">Agreement Overview</h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                By accessing this website we assume you accept these terms and conditions. Do not continue to use plantrxapp.com if you do not agree to take all of the terms and conditions stated on this page. PlantRx is an educational platform about natural remedies — we are NOT a medical service and do NOT provide medical advice.
              </p>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white">Terminology:</strong> "Client", "You" and "Your" refers to you, the person accessing this website. "The Company", "Ourselves", "We", "Our" and "Us" refers to PlantRx Ltd. "Party", "Parties", or "Us" refers to both the Client and ourselves.
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-14">
          
          {/* Main Content Column */}
          <div className="lg:col-span-4 space-y-8 sm:space-y-12 lg:space-y-16">
            
            {/* Section 1: About PlantRx */}
            <section id="section-1" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Building2 className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">1. About PlantRx</h2>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10">
                PlantRx ("the Service", "we", "our", "us") is a natural health and wellness platform operated by PlantRx Ltd, a company registered in England and Wales with its registered office in London, United Kingdom.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mt-8 sm:mt-10">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                  <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-3 sm:mb-4 text-lg sm:text-xl lg:text-2xl">Our Purpose</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg lg:text-xl leading-relaxed">
                    Educational content about natural remedies, plant-based wellness, traditional herbal medicine, 130+ verified remedies, AI-powered assistance (Remy), and an integrated wellness store.
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                  <h4 className="font-bold text-red-700 dark:text-red-300 mb-3 sm:mb-4 text-lg sm:text-xl lg:text-2xl">What We Are NOT</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg lg:text-xl leading-relaxed">
                    NOT a medical service. Does NOT provide medical advice, diagnosis, or treatment. Does NOT replace professional healthcare.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Acceptance of Terms */}
            <section id="section-2" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">2. Acceptance of Terms</h2>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8">
                By accessing or using PlantRx, creating an account, making a purchase, or subscribing to our services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                These terms constitute a legally binding agreement between you and PlantRx Ltd. We may update these terms at any time, and continued use of the Service after changes constitutes acceptance of the updated terms. This Agreement shall begin on the date hereof.
              </p>
            </section>

            {/* Section 3: Cookies */}
            <section id="section-3" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Cookie className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">3. Cookies</h2>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-6 sm:p-8 lg:p-10 rounded-r-xl mb-8 sm:mb-10">
                <p className="text-orange-800 dark:text-orange-200 font-semibold text-lg sm:text-xl lg:text-2xl">
                  We employ the use of cookies. By accessing plantrxapp.com, you agreed to use cookies in agreement with the PlantRx Privacy Policy.
                </p>
              </div>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10">
                Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[
                  { icon: "🔐", title: "Essential Cookies", desc: "Required for website functionality" },
                  { icon: "🔑", title: "Authentication", desc: "Keep you logged in securely" },
                  { icon: "📊", title: "Analytics", desc: "Understand site usage patterns" },
                  { icon: "📢", title: "Advertising", desc: "Deliver relevant advertisements" },
                  { icon: "⚙️", title: "Preferences", desc: "Remember your settings" },
                  { icon: "🛒", title: "Shopping", desc: "Track cart and purchases" }
                ].map((item, i) => (
                  <div key={i} className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 sm:p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl sm:text-4xl">{item.icon}</span>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl lg:text-2xl">{item.title}</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg lg:text-xl">{item.desc}</p>
                  </div>
                ))}
              </div>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mt-8 sm:mt-10">
                For detailed information, see our <a href="/cookie-policy" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium underline">Cookie Policy</a>.
              </p>
            </section>

            {/* Section 4: Age Restrictions */}
            <section id="section-4" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">4. Age Restrictions</h2>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-6 sm:p-8 lg:p-10 rounded-r-xl mb-8 sm:mb-10">
                <p className="text-amber-800 dark:text-amber-200 font-bold text-xl sm:text-2xl lg:text-3xl">
                  You must be at least 16 years old to use PlantRx.
                </p>
              </div>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                By using this Service, you represent and warrant that you are at least 16 years of age. If you are under 16, you may not use our Service under any circumstances. Parents and guardians should supervise their children's online activities and consult with pediatric healthcare providers for children's health concerns.
              </p>
            </section>

            {/* Section 5: License / Intellectual Property */}
            <section id="section-5" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Copyright className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">5. License & Intellectual Property</h2>
              </div>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10">
                Unless otherwise stated, PlantRx and/or its licensors own the intellectual property rights for all material on plantrxapp.com. All intellectual property rights are reserved. You may access this from plantrxapp.com for your own personal use subjected to restrictions set in these terms and conditions.
              </p>
              
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">You Must NOT:</h3>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  {[
                    "Republish material from plantrxapp.com",
                    "Sell, rent or sub-license material from plantrxapp.com",
                    "Reproduce, duplicate or copy material from plantrxapp.com",
                    "Redistribute content from plantrxapp.com",
                    "Use our branding for commercial purposes",
                    "Copy, modify, distribute, sell, or lease any part without permission"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-6">
                      <Ban className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 sm:p-8 lg:p-10">
                <p className="text-emerald-800 dark:text-emerald-200 text-base sm:text-lg lg:text-xl">
                  <strong>User-Generated Content:</strong> Content you create remains yours, but you grant PlantRx a non-exclusive license to use, reproduce, edit, and authorize others to use your content in any forms, formats, or media.
                </p>
              </div>
            </section>

            {/* Section 6: User Comments & Content */}
            <section id="section-6" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">6. User Comments & Content</h2>
              </div>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10">
                Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. PlantRx does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of PlantRx, its agents and/or affiliates.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">You Warrant and Represent That:</h3>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    "You are entitled to post the Comments on our website and have all necessary licenses and consents to do so",
                    "The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party",
                    "The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy",
                    "The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-6">
                      <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-6 sm:p-8 lg:p-10 rounded-r-xl">
                <p className="text-amber-800 dark:text-amber-200 text-base sm:text-lg lg:text-xl">
                  <strong>Moderation Notice:</strong> PlantRx reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.
                </p>
              </div>
            </section>

            {/* Section 7: Health Disclaimer */}
            <section id="section-7" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">7. Health Disclaimer - IMPORTANT</h2>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl mb-8 sm:mb-10">
                <p className="text-red-800 dark:text-red-200 font-bold text-xl sm:text-2xl lg:text-3xl text-center">
                  ⚠️ CRITICAL: PlantRx is for EDUCATIONAL PURPOSES ONLY
                </p>
              </div>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10">
                The information provided on PlantRx, including remedy information, health articles, AI-generated content, and expert opinions:
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
                {[
                  { icon: "❌", text: "Is NOT medical advice. Always consult a qualified healthcare provider." },
                  { icon: "❌", text: "Does NOT replace professional medical diagnosis or treatment." },
                  { icon: "❌", text: "Has NOT been evaluated by FDA, MHRA, or other health agencies." },
                  { icon: "⚠️", text: "May cause adverse effects. Natural remedies can interact with medications." },
                  { icon: "❌", text: "Is not intended to diagnose, treat, cure, or prevent any disease." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 sm:p-6 lg:p-8">
                    <span className="text-2xl sm:text-3xl lg:text-4xl">{item.icon}</span>
                    <span className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-red-100 dark:bg-red-900/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <p className="text-red-800 dark:text-red-200 font-semibold text-center text-lg sm:text-xl lg:text-2xl">
                  🚨 In case of medical emergency, call 999 (UK), 911 (US), or 112 (EU) immediately.
                </p>
              </div>
            </section>

            {/* Section 8: Hyperlinking to Our Content */}
            <section id="section-8" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Link2 className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">8. Hyperlinking to Our Content</h2>
              </div>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10">
                The following organizations may link to our Website without prior written approval:
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                {[
                  "Government agencies",
                  "Search engines",
                  "News organizations",
                  "Online directory distributors",
                  "System wide Accredited Businesses",
                  "Educational institutions"
                ].map((org, i) => (
                  <div key={i} className="flex items-center gap-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-5 sm:p-6">
                    <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                    <span className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300">{org}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Link Requirements</h3>
                <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  These organizations may link to our home page, to publications or to other Website information so long as the link:
                </p>
                <ul className="mt-6 space-y-4">
                  {[
                    "Is not in any way deceptive",
                    "Does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services",
                    "Fits within the context of the linking party's site"
                  ].map((req, i) => (
                    <li key={i} className="flex items-start gap-4 text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300">
                      <span className="text-cyan-500 mt-1 text-xl">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 sm:p-8 lg:p-10">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl">Approved Link Methods</h4>
                <ul className="space-y-3 sm:space-y-4 text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300">
                  <li>• By use of our corporate name</li>
                  <li>• By use of the uniform resource locator being linked to</li>
                  <li>• By use of any other description of our Website that makes sense within the context</li>
                </ul>
                <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-400 italic">
                  No use of PlantRx's logo or other artwork will be allowed for linking absent a trademark license agreement.
                </p>
              </div>
            </section>

            {/* Section 9: iFrames */}
            <section id="section-9" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Frame className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">9. iFrames</h2>
              </div>
              
              <div className="bg-pink-50 dark:bg-pink-900/20 border-l-4 border-pink-500 p-6 sm:p-8 lg:p-10 rounded-r-xl">
                <p className="text-lg sm:text-xl lg:text-2xl text-pink-800 dark:text-pink-200 font-medium">
                  Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.
                </p>
              </div>
            </section>

            {/* Section 10: Content Liability */}
            <section id="section-10" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Shield className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">10. Content Liability</h2>
              </div>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10">
                We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that arise on your Website.
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-900/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
                </p>
              </div>
            </section>

            {/* Section 11: Reservation of Rights */}
            <section id="section-11" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">11. Reservation of Rights</h2>
              </div>
              
              <div className="space-y-6 sm:space-y-8">
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request.
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  We also reserve the right to amend these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
                </p>
              </div>
            </section>

            {/* Section 12: Removal of Links */}
            <section id="section-12" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Trash2 className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">12. Removal of Links from Our Website</h2>
              </div>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10">
                If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to do so or to respond to you directly.
              </p>
              
              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-6 sm:p-8 lg:p-10">
                <p className="text-rose-800 dark:text-rose-200 text-base sm:text-lg lg:text-xl">
                  <strong>Important:</strong> We do not ensure that the information on this website is correct. We do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
                </p>
              </div>
            </section>

            {/* Section 13: User Accounts */}
            <section id="section-13" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">13. User Accounts</h2>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10">
                To access certain features of PlantRx, you must create an account using Firebase Authentication (Google sign-in or email/password).
              </p>
              
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white mb-6 sm:mb-8">Your Responsibilities:</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  "Provide accurate registration information",
                  "Maintain the security of your credentials",
                  "Notify us of unauthorized access",
                  "Accept responsibility for all account activities",
                  "Not share your account with others"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 sm:p-6 lg:p-8">
                    <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 14: Subscription Tiers */}
            <section id="section-14" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <CreditCard className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">14. Subscription Tiers</h2>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10">
                PlantRx offers the following subscription tiers:
              </p>
              
              <div className="grid gap-6 sm:gap-8 mb-8 sm:mb-10">
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-200 dark:border-amber-700">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <h4 className="font-bold text-xl sm:text-2xl lg:text-3xl text-amber-800 dark:text-amber-200">🥉 Bronze</h4>
                      <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mt-3">Basic access to remedy database, limited AI chat, community features</p>
                    </div>
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-700 dark:text-amber-300">Free</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-700/50 dark:to-slate-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-300 dark:border-gray-600">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <h4 className="font-bold text-xl sm:text-2xl lg:text-3xl text-gray-700 dark:text-gray-200">🥈 Silver</h4>
                      <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mt-3">Unlimited AI chat, personalized recommendations, advanced features</p>
                    </div>
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-700 dark:text-gray-200">£6.99<span className="text-base sm:text-lg font-normal">/mo</span></span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-yellow-400 dark:border-yellow-600">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <h4 className="font-bold text-xl sm:text-2xl lg:text-3xl text-yellow-700 dark:text-yellow-300">🥇 Gold</h4>
                      <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mt-3">All Silver features + exclusive content, priority support, premium benefits</p>
                    </div>
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-700 dark:text-yellow-300">£12.99<span className="text-base sm:text-lg font-normal">/mo</span></span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white mb-6 sm:mb-8">Subscription Terms:</h3>
              <ul className="space-y-4 sm:space-y-5 text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300">
                {[
                  "Subscriptions are billed monthly via Stripe",
                  "Auto-renew unless cancelled before the next billing date",
                  "Cancel anytime; access continues until the end of billing period",
                  "Prices may change with 30 days' notice",
                  "Promotional trials (e.g., 24-hour Gold trial) are one-time offers"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-yellow-500 mt-1 text-xl">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 15: Store & Products */}
            <section id="section-15" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">15. Store & Product Purchases</h2>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10">
                PlantRx operates an online store through Shopify integration, offering wellness and health-related products.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-green-700 dark:text-green-300 mb-4 sm:mb-6">Purchase Terms</h3>
                  <ul className="space-y-3 sm:space-y-4 text-gray-600 dark:text-gray-400 text-base sm:text-lg lg:text-xl">
                    <li className="flex items-start gap-3"><span className="text-green-500 text-xl">•</span> Prices displayed in GBP (£)</li>
                    <li className="flex items-start gap-3"><span className="text-green-500 text-xl">•</span> Secure payment via Stripe</li>
                    <li className="flex items-start gap-3"><span className="text-green-500 text-xl">•</span> Fulfilled via dropshipping partners</li>
                    <li className="flex items-start gap-3"><span className="text-green-500 text-xl">•</span> Shipping varies by location</li>
                    <li className="flex items-start gap-3"><span className="text-green-500 text-xl">•</span> You provide accurate shipping info</li>
                  </ul>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-orange-700 dark:text-orange-300 mb-4 sm:mb-6">Product Disclaimer</h3>
                  <ul className="space-y-3 sm:space-y-4 text-gray-600 dark:text-gray-400 text-base sm:text-lg lg:text-xl">
                    <li className="flex items-start gap-3"><span className="text-orange-500 text-xl">•</span> For general wellness purposes only</li>
                    <li className="flex items-start gap-3"><span className="text-orange-500 text-xl">•</span> Not intended to treat or prevent disease</li>
                    <li className="flex items-start gap-3"><span className="text-orange-500 text-xl">•</span> Consult healthcare provider before use</li>
                    <li className="flex items-start gap-3"><span className="text-orange-500 text-xl">•</span> Check ingredients for allergens</li>
                    <li className="flex items-start gap-3"><span className="text-orange-500 text-xl">•</span> Not responsible for adverse reactions</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 16: Refunds */}
            <section id="section-16" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <RotateCcw className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">16. Refund & Return Policy</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-teal-700 dark:text-teal-300 mb-4 sm:mb-6">Subscription Refunds</h3>
                  <ul className="space-y-3 sm:space-y-4 text-gray-600 dark:text-gray-400 text-base sm:text-lg lg:text-xl">
                    <li className="flex items-start gap-3"><span className="text-teal-500 text-xl">•</span> Cancel anytime; no partial refunds for unused time</li>
                    <li className="flex items-start gap-3"><span className="text-teal-500 text-xl">•</span> Technical issues may qualify for prorated refund</li>
                  </ul>
                </div>
                <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-700 dark:text-cyan-300 mb-4 sm:mb-6">Product Refunds</h3>
                  <ul className="space-y-3 sm:space-y-4 text-gray-600 dark:text-gray-400 text-base sm:text-lg lg:text-xl">
                    <li className="flex items-start gap-3"><span className="text-cyan-500 text-xl">•</span> Damaged products: return within 14 days</li>
                    <li className="flex items-start gap-3"><span className="text-cyan-500 text-xl">•</span> Contact support@plantrxapp.com with details</li>
                    <li className="flex items-start gap-3"><span className="text-cyan-500 text-xl">•</span> Refunds processed within 14 days</li>
                    <li className="flex items-start gap-3"><span className="text-cyan-500 text-xl">•</span> Opened consumables cannot be returned</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mt-8 sm:mt-10">
                For full details, see our <a href="/refunds" className="text-teal-600 hover:text-teal-700 dark:text-teal-400 font-medium underline">Refund Policy</a> page.
              </p>
            </section>

            {/* Section 17: Prohibited Uses */}
            <section id="section-17" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Ban className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">17. Prohibited Uses</h2>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10">
                You agree NOT to use PlantRx to:
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  "Provide medical advice or pose as a medical professional",
                  "Upload unlawful, harmful, or defamatory content",
                  "Impersonate any person or entity",
                  "Upload spam or unsolicited advertising",
                  "Interfere with or disrupt the Service",
                  "Attempt unauthorized access",
                  "Scrape or harvest user data",
                  "Use for any illegal purpose",
                  "Violate applicable laws",
                  "Promote harmful health practices"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl p-5 sm:p-6 lg:p-8">
                    <Ban className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 18: AI Content (Remy) */}
            <section id="section-18" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">18. AI-Generated Content (Remy)</h2>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10">
                PlantRx features "Remy," an AI-powered assistant that provides information about natural remedies and wellness.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { icon: "🤖", text: "Remy's responses are AI-generated and may not always be accurate" },
                  { icon: "📚", text: "AI content is for educational purposes only — NOT medical advice" },
                  { icon: "✅", text: "Verify information before acting on it" },
                  { icon: "⚖️", text: "We are not liable for decisions based on AI content" },
                  { icon: "👁️", text: "AI responses may be monitored to improve the Service" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 sm:gap-5 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 sm:p-6 lg:p-8">
                    <span className="text-2xl sm:text-3xl lg:text-4xl">{item.icon}</span>
                    <span className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 19: Disclaimer */}
            <section id="section-19" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">19. Disclaimer</h2>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10">
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
                </p>
                
                <ul className="space-y-4 sm:space-y-5 text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-4">
                    <span className="text-gray-500 text-xl">•</span>
                    <span>Limit or exclude our or your liability for death or personal injury</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-gray-500 text-xl">•</span>
                    <span>Limit or exclude our or your liability for fraud or fraudulent misrepresentation</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-gray-500 text-xl">•</span>
                    <span>Limit any of our or your liabilities in any way that is not permitted under applicable law</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-gray-500 text-xl">•</span>
                    <span>Exclude any of our or your liabilities that may not be excluded under applicable law</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
              </p>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-6 sm:p-8 lg:p-10 rounded-r-xl mt-8 sm:mt-10">
                <p className="text-amber-800 dark:text-amber-200 text-base sm:text-lg lg:text-xl">
                  <strong>Free Services Notice:</strong> As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
                </p>
              </div>
            </section>

            {/* Section 20: Limitation of Liability */}
            <section id="section-20" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Scale className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">20. Limitation of Liability</h2>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-6 sm:p-8 lg:p-10 rounded-r-xl mb-8 sm:mb-10">
                <p className="text-lg sm:text-xl lg:text-2xl text-orange-800 dark:text-orange-200 font-semibold">
                  To the fullest extent permitted by law, PlantRx Ltd disclaims all liability for any loss, damage, or injury arising from the use of our Service.
                </p>
              </div>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">PlantRx Ltd shall not be liable for:</p>
              <ul className="space-y-4 sm:space-y-5 text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300">
                {[
                  "Any adverse health effects from using natural remedies or our information",
                  "Any indirect, incidental, special, consequential, or punitive damages",
                  "Loss of profits, data, use, goodwill, or other intangible losses",
                  "Any damages exceeding amounts paid in the 12 months prior to the claim",
                  "Actions or inactions of third-party service providers",
                  "Service interruptions, errors, or security breaches"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-orange-500 mt-1 text-xl">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 21: Indemnification */}
            <section id="section-21" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Gavel className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">21. Indemnification</h2>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                You agree to indemnify, defend, and hold harmless PlantRx Ltd, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service, your violation of these Terms, or your violation of any rights of a third party.
              </p>
            </section>

            {/* Section 22: Governing Law */}
            <section id="section-22" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Globe className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">22. Governing Law & Jurisdiction</h2>
              </div>
              <div className="bg-sky-50 dark:bg-sky-900/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the <strong className="text-sky-700 dark:text-sky-300">laws of England and Wales</strong>, without regard to conflict of law principles. Any disputes shall be subject to the exclusive jurisdiction of the <strong className="text-sky-700 dark:text-sky-300">courts of London, United Kingdom</strong>.
                </p>
              </div>
            </section>

            {/* Section 23: Severability */}
            <section id="section-23" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Split className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">23. Severability</h2>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            {/* Section 24: Entire Agreement */}
            <section id="section-24" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FileCheck className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">24. Entire Agreement</h2>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                These Terms, together with our Privacy Policy, Cookie Policy, and any other legal notices published on the Service, constitute the entire agreement between you and PlantRx Ltd concerning the Service.
              </p>
            </section>

            {/* Section 25: Changes to Terms */}
            <section id="section-25" className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 lg:p-14 xl:p-16 shadow-lg border border-gray-100 dark:border-gray-700 scroll-mt-24">
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bell className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white">25. Changes to Terms</h2>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. Material changes will be notified via email or prominent notice on our website. Continued use of the Service after changes constitutes acceptance of the updated Terms.
              </p>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Text Size Selector */}
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Type className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">Text Size</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {textSizeOptions.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setTextSize(size.id)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        textSize === size.id
                          ? 'bg-indigo-500 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quick Navigation */}
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-4">Quick Navigation</h3>
                <nav className="space-y-1 hidden lg:block max-h-96 overflow-y-auto">
                  {[
                    "About PlantRx",
                    "Acceptance of Terms",
                    "Cookies",
                    "Age Restrictions",
                    "License & IP",
                    "User Comments",
                    "Health Disclaimer",
                    "Hyperlinking",
                    "iFrames",
                    "Content Liability",
                    "Reservation of Rights",
                    "Removal of Links",
                    "User Accounts",
                    "Subscription Tiers",
                    "Store & Products",
                    "Refunds",
                    "Prohibited Uses",
                    "AI Content (Remy)",
                    "Disclaimer",
                    "Liability",
                    "Indemnification",
                    "Governing Law",
                    "Severability",
                    "Entire Agreement",
                    "Changes to Terms"
                  ].map((item, i) => (
                    <a key={i} href={`#section-${i+1}`}
                       onClick={(e) => {
                         e.preventDefault();
                         document.getElementById(`section-${i+1}`)?.scrollIntoView({ behavior: 'smooth' });
                       }}
                       className="block text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1.5 cursor-pointer">
                      {i+1}. {item}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6" />
                  <h3 className="font-bold text-base sm:text-lg">26. Contact Information</h3>
                </div>
                <p className="text-white/90 text-sm sm:text-base mb-4">
                  Questions about these Terms & Conditions?
                </p>
                <div className="space-y-2 text-sm sm:text-base">
                  <p><strong>Email:</strong> support@plantrxapp.com</p>
                  <p><strong>Address:</strong> PlantRx Ltd, London, UK</p>
                  <p><strong>Jurisdiction:</strong> England and Wales</p>
                </div>
                <a href="mailto:support@plantrxapp.com" 
                   className="mt-4 block w-full bg-white text-indigo-600 rounded-lg py-3 px-4 text-center font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base">
                  Contact Us
                </a>
              </div>

              {/* Related Policies */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-4">Related Policies</h3>
                <div className="space-y-2">
                  {[
                    { name: "Privacy Policy", url: "/privacy-policy" },
                    { name: "Cookie Policy", url: "/cookie-policy" },
                    { name: "Refund Policy", url: "/refunds" },
                    { name: "Medical Disclaimer", url: "/disclaimer" }
                  ].map((link, i) => (
                    <a key={i} href={link.url}
                       className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm sm:text-base transition-colors py-2">
                      <ExternalLink className="w-4 h-4" />
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
