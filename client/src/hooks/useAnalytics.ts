import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackPageView, trackPageWithMetadata } from '../utils/analytics';

// Hook to automatically track page views on route changes
export function usePageTracking() {
  const [location] = useLocation();

  useEffect(() => {
    // Track page view with a slight delay to ensure title is updated
    const timer = setTimeout(() => {
      trackPageView(location);
      
      // Additional tracking through GTM dataLayer
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'enhanced_page_view',
          page_path: location,
          page_title: document.title,
          content_group1: getContentGroup(location),
          content_group2: getSiteSection(location)
        });
        console.log(`🎯 Enhanced page tracking: ${location} | Group: ${getContentGroup(location)} | Section: ${getSiteSection(location)}`);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);
}

function getContentGroup(path: string) {
  if (path.includes('/remedies')) return 'remedies';
  if (path.includes('/blog')) return 'blog';
  if (path.includes('/community')) return 'community';
  if (path.includes('/experts')) return 'experts';
  if (path.includes('/workouts')) return 'workouts';
  if (path.includes('/store')) return 'store';
  if (path === '/about') return 'about';
  if (path === '/contact') return 'contact';
  return 'other';
}

function getSiteSection(path: string) {
  if (path === '/') return 'homepage';
  if (path.startsWith('/remedies')) return 'health_content';
  if (path.startsWith('/blog')) return 'blog_content';
  if (path.startsWith('/community')) return 'community';
  if (path.startsWith('/experts')) return 'experts';
  return 'general';
}

// Hook for enhanced tracking with page metadata
export function useEnhancedPageTracking(pageType: string, contentId?: string) {
  const [location] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      trackPageWithMetadata(pageType, contentId);
    }, 100);

    return () => clearTimeout(timer);
  }, [location, pageType, contentId]);
}