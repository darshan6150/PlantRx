import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function WebVitalsTracker() {
  useEffect(() => {
    // Dynamically import web-vitals to avoid including it in main bundle
    import('web-vitals').then((webVitals) => {
      const { onCLS, onFCP, onLCP, onTTFB, onINP } = webVitals;
      // Track Core Web Vitals and send to GTM dataLayer
      const sendToGTM = (metric: any) => {
        // Push Web Vitals data to GTM dataLayer
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'web_vital',
          metric_name: metric.name,
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
          metric_rating: metric.rating
        });
        
        // Log to console in development
        if (import.meta.env.DEV) {
          console.log(`[Web Vitals] ${metric.name}:`, {
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id
          });
        }
      };

      // Track all Core Web Vitals
      onCLS(sendToGTM);
      onFCP(sendToGTM);
      onLCP(sendToGTM);
      onTTFB(sendToGTM);
      onINP(sendToGTM);
    }).catch(error => {
      console.warn('Failed to load web-vitals:', error);
    });
  }, []);

  return null;
}