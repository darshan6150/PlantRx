import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// Legacy component removed for optimization

// Google Search Console Verification
export function GoogleSearchConsole() {
  return (
    <Helmet>
      <meta name="google-site-verification" content={import.meta.env.VITE_GOOGLE_SITE_VERIFICATION || ""} />
      <meta name="msvalidate.01" content={import.meta.env.VITE_BING_VERIFICATION || ""} />
      <meta name="yandex-verification" content={import.meta.env.VITE_YANDEX_VERIFICATION || ""} />
      <meta name="p:domain_verify" content={import.meta.env.VITE_PINTEREST_VERIFICATION || ""} />
      {/* Google AdSense Account Verification - Required for all pages */}
      <meta name="google-adsense-account" content="ca-pub-5245165544457327" />
    </Helmet>
  );
}

// Core Web Vitals Optimization
export function CoreWebVitalsOptimization() {
  useEffect(() => {
    // Remove font preloads that cause warnings - fonts are loaded via Google Fonts in HTML
    // This prevents "resource not used within a few seconds" warnings

    // Optimize images with lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));

    // DNS prefetch hints are already in HTML head, no need to duplicate here

    return () => {
      imageObserver.disconnect();
    };
  }, []);

  return null;
}

// Advanced SEO Tracking and Monitoring
export function SEOMonitoring() {
  useEffect(() => {
    // Track page view timing
    if (typeof performance !== 'undefined' && performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log('Page Load Time:', loadTime);
      
      // Track page load time with GTM
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'page_load_time',
          event_category: 'Performance',
          event_label: window.location.pathname,
          value: Math.round(loadTime)
        });
      }
    }
  }, []);

  return null;
}

// Site-wide GTM Component - All tracking through GTM
export function SiteWideAnalytics() {
  return null; // GTM handles all tracking now
}