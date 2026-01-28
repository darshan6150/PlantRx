import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ThemeProvider";
import { TranslationProvider } from "./contexts/TranslationContext";
import { AnimationProvider } from "./components/AnimationProvider";
import { CartProvider } from "./contexts/CartContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { LuxuryLoaderProvider } from "./components/LuxuryLoader";
import { TextSizeProvider } from "./contexts/TextSizeContext";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { useEffect, Suspense, lazy, useState } from "react";
import { useScrollToTop } from "./hooks/useScrollToTop";
import { ScrollToTopButton } from "./components/ScrollToTop";
import { usePageTracking } from "./hooks/useAnalytics";
import { initializeGTM } from "./utils/analytics";
import { externalizeExternalAnchors } from "./utils/externalize";
import { isReplit } from "./utils/links";
import { useLocation } from "wouter";
import { initAuthGate } from "./lib/authGate";
import { useClickAuthPrompt } from "./hooks/useClickAuthPrompt";
import { SuspenseFallback } from "./components/SuspenseFallback";
import NotFound from "@/pages/not-found";
import Footer from "@/components/Footer";
import EssentialOils from "./pages/EssentialOils";

// Lazy load analytics/SEO components - these are non-critical for initial render
const SiteWideAnalytics = lazy(() =>
  import("@/components/SEOEnhancements").then((m) => ({
    default: m.SiteWideAnalytics,
  }))
);
const GoogleSearchConsole = lazy(() =>
  import("@/components/SEOEnhancements").then((m) => ({
    default: m.GoogleSearchConsole,
  }))
);
const CoreWebVitalsOptimization = lazy(() =>
  import("@/components/SEOEnhancements").then((m) => ({
    default: m.CoreWebVitalsOptimization,
  }))
);
const WebVitalsTracker = lazy(() =>
  import("@/components/WebVitalsTracker").then((m) => ({
    default: m.WebVitalsTracker,
  }))
);
const MobileOptimization = lazy(() =>
  import("@/components/MobileOptimization").then((m) => ({
    default: m.MobileOptimization,
  }))
);

// Lazy load pages including Home for faster initial bundle
const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));
const Welcome = lazy(() => import("@/pages/Welcome"));
const CookieConsent = lazy(() =>
  import("@/components/CookieConsent").then((m) => ({
    default: m.CookieConsent,
  }))
);

// Lazy load heavy components
const Remedies = lazy(() => import("@/pages/Remedies"));
const RemedyDetail = lazy(() => import("@/pages/RemedyDetail"));
const SmartTools = lazy(() => import("@/pages/SmartTools"));
const Workouts = lazy(() => import("@/pages/WorkoutsNew"));
const Community = lazy(() => import("@/pages/Community"));
const Experts = lazy(() => import("@/pages/Experts"));
const Store = lazy(() => import("@/pages/Store"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Admin = lazy(() => import("@/pages/Admin"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Terms = lazy(() => import("@/pages/Terms"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("@/pages/CookiePolicy"));
const Disclaimer = lazy(() => import("@/pages/Disclaimer"));
const Refunds = lazy(() => import("@/pages/Refunds"));
const Liability = lazy(() => import("@/pages/Liability"));
const DMCAPolicy = lazy(() => import("@/pages/DMCAPolicy"));
const Contact = lazy(() => import("@/pages/Contact"));
const About = lazy(() => import("@/pages/About"));
const AboutMe = lazy(() => import("@/pages/AboutMe"));
const AboutPlantRx = lazy(() => import("@/pages/AboutPlantRx"));
const OurMission = lazy(() => import("@/pages/OurMission"));
const SafetyStandards = lazy(() => import("@/pages/SafetyStandards"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const PlanRxCreator = lazy(() => import("@/components/PlanRxCreator"));
const Settings = lazy(() => import("@/pages/Settings"));
const AuthDiagnostic = lazy(() => import("@/pages/AuthDiagnostic"));
const OrderDetails = lazy(() => import("@/pages/OrderDetails"));
const Header = lazy(() => import("@/components/Header"));
const Strips = lazy(() => import("@/pages/Strips"));

// High-Value SEO Content Pages
const HowNaturalRemediesHeal = lazy(
  () => import("@/pages/content/HowNaturalRemediesHeal")
);
const ImmunityBoostingHerbs = lazy(
  () => import("@/pages/content/ImmunityBoostingHerbs")
);
const HerbalRoutineGuide = lazy(
  () => import("@/pages/content/HerbalRoutineGuide")
);
const NaturalStressRelief = lazy(
  () => import("@/pages/content/NaturalStressRelief")
);
const DigestiveHealthGuide = lazy(
  () => import("@/pages/content/DigestiveHealthGuide")
);
const NaturalSleepRemedies = lazy(
  () => import("@/pages/content/NaturalSleepRemedies")
);
const NaturalSkinCare = lazy(() => import("@/pages/content/NaturalSkinCare"));
const AntiInflammatoryHerbs = lazy(
  () => import("@/pages/content/AntiInflammatoryHerbs")
);
const NaturalPainRelief = lazy(
  () => import("@/pages/content/NaturalPainRelief")
);
const ImmuneSystemBoost = lazy(
  () => import("@/pages/content/ImmuneSystemBoost")
);

// New Navigation Pages
const SavedRemedies = lazy(() => import("@/pages/SavedRemedies"));
const Articles = lazy(() => import("@/pages/Articles"));
const ArticlesFitness = lazy(() => import("@/pages/ArticlesFitness"));
const ArticlesScience = lazy(() => import("@/pages/ArticlesScience"));
const ArticlesNutrition = lazy(() => import("@/pages/ArticlesNutrition"));
const ArticlesWellness = lazy(() => import("@/pages/ArticlesWellness"));
const ArticlesHerbsRemedies = lazy(
  () => import("@/pages/ArticlesHerbsRemedies")
);
const ArticlesHealthyFoods = lazy(() => import("@/pages/ArticlesHealthyFoods"));
const ArticlesMentalHealth = lazy(() => import("@/pages/ArticlesMentalHealth"));
const ArticlesSkinBeauty = lazy(() => import("@/pages/ArticlesSkinBeauty"));
const Fitness = lazy(() => import("@/pages/Fitness"));
const FitnessArms = lazy(() => import("@/pages/FitnessArms"));
const FitnessShoulders = lazy(() => import("@/pages/FitnessShoulders"));
const FitnessChest = lazy(() => import("@/pages/FitnessChest"));
const FitnessBack = lazy(() => import("@/pages/FitnessBack"));
const FitnessLegs = lazy(() => import("@/pages/FitnessLegs"));
const FitnessAbs = lazy(() => import("@/pages/FitnessAbs"));
const ToolsSymptomFinder = lazy(() => import("@/pages/ToolsSymptomFinder"));
const ToolsRemedyBuilder = lazy(() => import("@/pages/ToolsRemedyBuilder"));
const ToolsBlueprintDesigner = lazy(
  () => import("@/pages/ToolsBlueprintDesigner")
);
const ToolsHealthCalculators = lazy(
  () => import("@/pages/ToolsHealthCalculators")
);

// Remedy Articles for AdSense (30+ high-quality articles)
const RemedyArticlesHub = lazy(() => import("@/pages/RemedyArticlesHub"));
const RemedyArticlePage = lazy(() => import("@/pages/RemedyArticlePage"));
const RemedyCategoryPage = lazy(() => import("@/pages/RemedyCategoryPage"));

function Router() {
  const [, setLocation] = useLocation();

  // Enable comprehensive page tracking for ALL pages
  usePageTracking();

  // Automatically scroll to top on route change (instant for better UX)
  useScrollToTop("instant");

  // Initialize click tracking for authentication prompts (SINGLE CALL ONLY)
  useClickAuthPrompt();

  // Initialize authentication gate on page load
  useEffect(() => {
    initAuthGate();
  }, []);

  // Set up external link handling for Replit preview
  useEffect(() => {
    // Run externalization on mount and whenever content updates
    externalizeExternalAnchors();

    // Set up a mutation observer to handle dynamically added links
    const observer = new MutationObserver(() => {
      externalizeExternalAnchors();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen luxury-gradient-bg">
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      <div className="lg:pt-20 sm:pt-16 pt-14">
        {/* Defer analytics components - render after initial paint */}
        <Suspense fallback={null}>
          <SiteWideAnalytics />
          <GoogleSearchConsole />
          <CoreWebVitalsOptimization />
          <WebVitalsTracker />
          <MobileOptimization />
        </Suspense>

        <div id="google_translate_element" style={{ display: "none" }}></div>

        <Suspense fallback={<SuspenseFallback />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/remedies" component={Remedies} />
            <Route path="/remedies/articles" component={RemedyArticlesHub} />
            <Route
              path="/strips"
              component={Strips}
            />
            <Route
              path="/essential-oils"
              component={EssentialOils}
            />
            <Route
              path="/remedies/category/:category"
              component={RemedyCategoryPage}
            />
            <Route path="/remedies/saved" component={SavedRemedies} />
            <Route path="/remedy/:slug" component={RemedyDetail} />
            <Route path="/remedies/:slug" component={RemedyArticlePage} />
            <Route path="/smart-tools" component={SmartTools} />
            <Route path="/workouts" component={Workouts} />
            <Route path="/community" component={Community} />
            <Route path="/experts" component={Experts} />
            <Route path="/store/:handle" component={ProductDetail} />
            <Route path="/store" component={Store} />
            <Route
              path="/collections/Products"
              component={() => {
                window.location.replace("/store");
                return null;
              }}
            />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/orders/:id" component={OrderDetails} />
            <Route path="/settings" component={Settings} />
            <Route path="/checkout" component={Checkout} />
            <Route
              path="/planrx-creator"
              component={() => (
                <PlanRxCreator user={null} onAuthRequired={() => {}} />
              )}
            />
            <Route path="/admin" component={Admin} />

            <Route path="/articles" component={Articles} />
            <Route path="/articles/fitness" component={ArticlesFitness} />
            <Route path="/articles/science" component={ArticlesScience} />
            <Route path="/articles/nutrition" component={ArticlesNutrition} />
            <Route path="/articles/wellness" component={ArticlesWellness} />
            <Route
              path="/articles/herbs-remedies"
              component={ArticlesHerbsRemedies}
            />
            <Route
              path="/articles/healthy-foods"
              component={ArticlesHealthyFoods}
            />
            <Route
              path="/articles/mental-health"
              component={ArticlesMentalHealth}
            />
            <Route
              path="/articles/skin-beauty"
              component={ArticlesSkinBeauty}
            />

            <Route path="/fitness" component={Fitness} />
            <Route path="/fitness/arms" component={FitnessArms} />
            <Route path="/fitness/shoulders" component={FitnessShoulders} />
            <Route path="/fitness/chest" component={FitnessChest} />
            <Route path="/fitness/back" component={FitnessBack} />
            <Route path="/fitness/legs" component={FitnessLegs} />
            <Route path="/fitness/abs" component={FitnessAbs} />

            <Route
              path="/tools/symptom-finder"
              component={ToolsSymptomFinder}
            />
            <Route
              path="/tools/remedy-builder"
              component={ToolsRemedyBuilder}
            />
            <Route
              path="/tools/blueprint-designer"
              component={ToolsBlueprintDesigner}
            />
            <Route
              path="/tools/health-calculators"
              component={ToolsHealthCalculators}
            />

            <Route path="/terms" component={Terms} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/cookie-policy" component={CookiePolicy} />
            <Route path="/disclaimer" component={Disclaimer} />
            <Route path="/refunds" component={Refunds} />
            <Route path="/liability" component={Liability} />
            <Route path="/dmca-policy" component={DMCAPolicy} />
            <Route path="/contact" component={Contact} />
            <Route path="/about" component={About} />
            <Route path="/about-us" component={About} />
            <Route path="/about/me" component={AboutMe} />
            <Route path="/about/plantrx" component={AboutPlantRx} />
            <Route path="/about/mission" component={OurMission} />
            <Route path="/safety-standards" component={SafetyStandards} />

            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/welcome" component={Welcome} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/auth-diagnostic" component={AuthDiagnostic} />

            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogPost} />

            <Route
              path="/learn/how-natural-remedies-heal"
              component={HowNaturalRemediesHeal}
            />
            <Route
              path="/learn/immunity-boosting-herbs"
              component={ImmunityBoostingHerbs}
            />
            <Route
              path="/learn/herbal-routine-guide"
              component={HerbalRoutineGuide}
            />
            <Route
              path="/learn/natural-stress-relief"
              component={NaturalStressRelief}
            />
            <Route
              path="/learn/digestive-health-guide"
              component={DigestiveHealthGuide}
            />
            <Route
              path="/learn/natural-sleep-remedies"
              component={NaturalSleepRemedies}
            />
            <Route
              path="/learn/natural-skin-care"
              component={NaturalSkinCare}
            />
            <Route
              path="/learn/anti-inflammatory-herbs"
              component={AntiInflammatoryHerbs}
            />
            <Route
              path="/learn/natural-pain-relief"
              component={NaturalPainRelief}
            />
            <Route
              path="/learn/boost-immune-system"
              component={ImmuneSystemBoost}
            />
            

            <Route component={NotFound} />
          </Switch>
        </Suspense>

        <Footer />
        <ScrollToTopButton />
      </div>
    </div>
  );
}

function App() {
  // GTM initialization moved to CookieConsent component (GDPR compliance)
  useEffect(() => {
    // Force HTTPS redirect for production
    if (
      typeof window !== "undefined" &&
      location.protocol !== "https:" &&
      location.hostname === "plantrxapp.com"
    ) {
      location.replace(
        `https:${location.href.substring(location.protocol.length)}`
      );
    }
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SubscriptionProvider>
          <ThemeProvider defaultTheme="light" storageKey="plantrx-ui-theme">
            <TextSizeProvider>
              <LuxuryLoaderProvider>
                <AnimationProvider>
                  <TranslationProvider>
                    <CartProvider>
                      <TooltipProvider>
                        <Toaster />
                        <CookieConsent />
                        <Router />
                      </TooltipProvider>
                    </CartProvider>
                  </TranslationProvider>
                </AnimationProvider>
              </LuxuryLoaderProvider>
            </TextSizeProvider>
          </ThemeProvider>
        </SubscriptionProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
