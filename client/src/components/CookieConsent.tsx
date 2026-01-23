import { useState, useEffect } from 'react';
import { X, Cookie, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const COOKIE_CONSENT_KEY = 'plantrx_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'plantrx_cookie_preferences';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
  timestamp: number;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    advertising: false,
    timestamp: Date.now()
  });

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1500);
    } else {
      // Load saved preferences and reinitialize services
      const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPrefs) {
        try {
          const prefs = JSON.parse(savedPrefs);
          setPreferences(prefs);
          
          // Reinitialize services for returning users who previously consented
          if (prefs.analytics) {
            initializeGoogleAnalytics();
            initializeMetricool();
          }
          if (prefs.advertising) {
            initializeAdSense();
          }
        } catch (e) {
          console.error('Failed to parse cookie preferences');
        }
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const newPrefs = {
      necessary: true,
      analytics: true,
      advertising: true,
      timestamp: Date.now()
    };
    savePreferences(newPrefs);
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    const newPrefs = {
      necessary: true,
      analytics: false,
      advertising: false,
      timestamp: Date.now()
    };
    savePreferences(newPrefs);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    savePreferences({
      ...preferences,
      timestamp: Date.now()
    });
    setShowBanner(false);
    setShowDetails(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);

    // Initialize services based on preferences
    if (prefs.analytics) {
      initializeGoogleAnalytics();
      initializeMetricool();
    }

    if (prefs.advertising) {
      initializeAdSense();
    }
  };

  const initializeGoogleAnalytics = () => {
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    const gtmId = import.meta.env.VITE_GTM_ID || 'GTM-MLKLVC58'; // Fallback to hardcoded GTM ID
    
    // Initialize GTM first (includes GA)
    if (gtmId && !(window as any).google_tag_manager) {
      // Load GTM script ONLY after user consent
      const gtmScript = document.createElement('script');
      gtmScript.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;
      document.head.appendChild(gtmScript);
      
      console.log('✅ GTM initialized after consent:', gtmId);
    }

    // Also initialize standalone GA if configured
    if (gaId && !document.querySelector(`script[src*="${gaId}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      // Initialize dataLayer
      (window as any).dataLayer = (window as any).dataLayer || [];
      const gtag = (...args: any[]) => {
        (window as any).dataLayer.push(args);
      };
      (window as any).gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', gaId, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure'
      });
    }
  };

  const initializeMetricool = () => {
    // Load Metricool tracking script
    if (document.querySelector('script[src*="metricool"]')) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://tracker.metricool.com/resources/be.js';
    document.head.appendChild(script);
  };

  const initializeAdSense = () => {
    // Load AdSense script dynamically
    if (document.querySelector('script[src*="adsbygoogle"]')) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5245165544457327';
    script.crossOrigin = 'anonymous';
    
    // Auto ads will initialize automatically once script loads - no manual push needed
    document.head.appendChild(script);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[10000] p-4 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
        <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 shadow-2xl pointer-events-auto">
          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Your Privacy Matters
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We care about your data and privacy
                  </p>
                </div>
              </div>
              <button
                onClick={handleAcceptNecessary}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close"
                data-testid="button-close-cookie-banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            {!showDetails ? (
              <>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  We use cookies to improve your experience, analyze site traffic, and serve personalized content. 
                  By clicking "Accept All", you consent to our use of cookies. You can customize your preferences 
                  or decline non-essential cookies.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-green-600 hover:bg-green-700 text-white min-h-[44px]"
                    data-testid="button-accept-all-cookies"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept All Cookies
                  </Button>
                  <Button
                    onClick={handleAcceptNecessary}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white min-h-[44px]"
                    data-testid="button-necessary-only-cookies"
                  >
                    Necessary Only
                  </Button>
                  <Button
                    onClick={() => setShowDetails(true)}
                    variant="ghost"
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 min-h-[44px]"
                    data-testid="button-customize-cookies"
                  >
                    Customize Preferences
                  </Button>
                </div>
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Read our{' '}
                  <a href="/privacy" className="text-green-600 hover:underline dark:text-green-400">
                    Privacy Policy
                  </a>
                  {' '}and{' '}
                  <a href="/cookie-policy" className="text-green-600 hover:underline dark:text-green-400">
                    Cookie Policy
                  </a>
                </div>
              </>
            ) : (
              <>
                {/* Detailed Cookie Preferences */}
                <div className="space-y-4 mb-4">
                  {/* Necessary Cookies */}
                  <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-green-600" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Necessary Cookies
                        </h4>
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                          Always Active
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Essential for the website to function properly. These cannot be disabled.
                      </p>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1 pr-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Analytics Cookies
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Help us understand how visitors use our site through Google Analytics.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                        className="sr-only peer"
                        data-testid="toggle-analytics-cookies"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  {/* Advertising Cookies */}
                  <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1 pr-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Advertising Cookies
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Used to show you relevant ads through Google AdSense. Help support our free platform.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.advertising}
                        onChange={(e) => setPreferences({...preferences, advertising: e.target.checked})}
                        className="sr-only peer"
                        data-testid="toggle-advertising-cookies"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleSavePreferences}
                    className="bg-green-600 hover:bg-green-700 text-white min-h-[44px]"
                    data-testid="button-save-cookie-preferences"
                  >
                    Save Preferences
                  </Button>
                  <Button
                    onClick={() => setShowDetails(false)}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white min-h-[44px]"
                    data-testid="button-back-cookie-settings"
                  >
                    Back
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
