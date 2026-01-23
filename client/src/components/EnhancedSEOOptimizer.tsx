import { useEffect } from 'react';

export function EnhancedSEOOptimizer() {
  useEffect(() => {
    // Optimize meta generation speed
    const optimizeMetaTags = () => {
      // Remove duplicate or unnecessary meta tags
      const metaTags = document.querySelectorAll('meta[name], meta[property]');
      const seen = new Set<string>();
      
      metaTags.forEach(tag => {
        const key = tag.getAttribute('name') || tag.getAttribute('property');
        if (key && seen.has(key)) {
          tag.remove();
        } else if (key) {
          seen.add(key);
        }
      });
    };

    // Enhanced structured data with faster generation
    const addEnhancedStructuredData = () => {
      const existingScript = document.querySelector('#enhanced-structured-data');
      if (existingScript) return;

      const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://plantrxapp.com/#organization",
            "name": "PlantRx",
            "url": "https://plantrxapp.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://plantrxapp.com/plantrx-logo.png",
              "width": 1024,
              "height": 1024
            },
            "description": "Expert natural remedies platform with plant-based solutions for health and wellness",
            "foundingDate": "2024",
            "specialty": ["Natural Health", "Plant Medicine", "Herbal Remedies", "Wellness"]
          },
          {
            "@type": "WebSite",
            "@id": "https://plantrxapp.com/#website",
            "url": "https://plantrxapp.com",
            "name": "PlantRx - Natural Health Platform",
            "description": "Discover expert-verified plant-based remedies for your health concerns",
            "publisher": { "@id": "https://plantrxapp.com/#organization" },
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://plantrxapp.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@type": "WebApplication",
            "name": "PlantRx Health Assistant",
            "url": "https://plantrxapp.com/smart-tools",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web Browser",
            "description": "AI-powered natural health consultation and remedy recommendation system"
          }
        ]
      };

      const script = document.createElement('script');
      script.id = 'enhanced-structured-data';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    };

    // Fast page performance tracking
    const trackPagePerformance = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const paint = performance.getEntriesByType('paint');
          
          const metrics = {
            fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            lcp: 0, // Would be measured by PerformanceObserver
            ttfb: navigation.responseStart - navigation.requestStart,
            domComplete: navigation.domComplete - navigation.navigationStart
          };

          // Push to analytics
          if (window.dataLayer) {
            window.dataLayer.push({
              event: 'page_performance_metrics',
              fcp: Math.round(metrics.fcp),
              ttfb: Math.round(metrics.ttfb),
              domComplete: Math.round(metrics.domComplete),
              page: window.location.pathname
            });
          }
        }, 1000);
      }
    };

    // Execute optimizations
    optimizeMetaTags();
    addEnhancedStructuredData();
    trackPagePerformance();

  }, []);

  // Add meta tags directly to head instead of using Helmet
  useEffect(() => {
    const addMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      if (!document.querySelector(`meta[${attr}="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    // Enhanced SEO meta tags
    addMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large');
    addMetaTag('theme-color', '#16a34a');
    addMetaTag('og:site_name', 'PlantRx - Natural Health Platform', true);
    addMetaTag('og:image', 'https://plantrxapp.com/plantrx-logo.png', true);
    addMetaTag('og:image:width', '1024', true);
    addMetaTag('og:image:height', '1024', true);
    addMetaTag('og:image:alt', 'PlantRx Yellow Leaf Logo - Expert Natural Health Platform', true);
    addMetaTag('twitter:card', 'summary_large_image');
    addMetaTag('twitter:image', 'https://plantrxapp.com/plantrx-logo.png', true);
  }, []);

  return null;
}

export default EnhancedSEOOptimizer;