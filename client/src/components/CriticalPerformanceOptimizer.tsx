import { useEffect } from 'react';

export function CriticalPerformanceOptimizer() {
  useEffect(() => {
    // Safe resource preloading without format assumptions
    const preloadCriticalResources = () => {
      const heroImages = document.querySelectorAll('img[data-hero="true"], .hero img, .banner img');
      heroImages.forEach((img) => {
        if (img instanceof HTMLImageElement && img.src && !document.querySelector(`link[href="${img.src}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = img.src;
          link.as = 'image';
          link.fetchPriority = 'high';
          document.head.appendChild(link);
        }
      });

      // Add proper preconnect for Google Fonts
      if (!document.querySelector('link[href="https://fonts.googleapis.com"]')) {
        const preconnect1 = document.createElement('link');
        preconnect1.rel = 'preconnect';
        preconnect1.href = 'https://fonts.googleapis.com';
        document.head.appendChild(preconnect1);

        const preconnect2 = document.createElement('link');
        preconnect2.rel = 'preconnect';
        preconnect2.href = 'https://fonts.gstatic.com';
        preconnect2.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect2);
      }
    };

    // Enhanced image optimization with intersection observer
    const optimizeImages = () => {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            
            // Set optimization attributes
            img.loading = 'eager';
            img.decoding = 'async';
            
            // Add fetchpriority for above-the-fold images
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
              img.fetchPriority = 'high';
            }

            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });

      document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
      });
    };

    // Bundle size optimization - defer non-critical scripts
    const deferNonCriticalScripts = () => {
      const nonCriticalScripts = [
        'script[src*="analytics"]',
        'script[src*="gtm"]', 
        'script[src*="ads"]',
        'script[src*="social"]'
      ];

      nonCriticalScripts.forEach(selector => {
        document.querySelectorAll(selector).forEach(script => {
          if (script instanceof HTMLScriptElement && !script.defer) {
            script.defer = true;
          }
        });
      });
    };

    // Safe CSS optimization without deferral risks
    const optimizeCSSDelivery = () => {
      // Add minimal critical CSS without breaking existing styles
      const criticalCSS = `
        .performance-optimized img { max-width: 100%; height: auto; }
        .performance-optimized .hero { contain: layout; }
      `;

      if (!document.querySelector('#safe-critical-css')) {
        const style = document.createElement('style');
        style.id = 'safe-critical-css';
        style.textContent = criticalCSS;
        document.head.appendChild(style);
        document.body.classList.add('performance-optimized');
      }
    };

    // Resource cleanup and garbage collection
    const scheduleCleanup = () => {
      setTimeout(() => {
        // Remove unused preload links
        document.querySelectorAll('link[rel="preload"]').forEach(link => {
          if (link instanceof HTMLLinkElement) {
            const age = Date.now() - parseInt(link.dataset.loadTime || '0');
            if (age > 30000) { // Remove after 30 seconds
              link.remove();
            }
          }
        });

        // Trigger garbage collection if available
        if (window.gc) {
          window.gc();
        }
      }, 5000);
    };

    // Prefetch likely navigation targets
    const prefetchNextPages = () => {
      setTimeout(() => {
        const likelyPages = ['/remedies', '/smart-tools', '/experts', '/store'];
        likelyPages.forEach(page => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = page;
          document.head.appendChild(link);
        });
      }, 3000);
    };

    // Execute optimizations
    preloadCriticalResources();
    optimizeImages();
    deferNonCriticalScripts();
    optimizeCSSDelivery();
    scheduleCleanup();
    prefetchNextPages();

    // Continuous optimization with mutation observer
    const mutationObserver = new MutationObserver(() => {
      optimizeImages();
      deferNonCriticalScripts();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}