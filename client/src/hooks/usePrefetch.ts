import { useEffect } from 'react';
import { queryClient } from '@/lib/queryClient';

// Prefetch common API calls on hover/focus
export function usePrefetch() {
  const prefetchRemedies = () => {
    queryClient.prefetchQuery({
      queryKey: ['/api/remedies'],
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const prefetchFeaturedRemedies = () => {
    queryClient.prefetchQuery({
      queryKey: ['/api/remedies/featured'],
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchLanguages = () => {
    queryClient.prefetchQuery({
      queryKey: ['/api/languages'],
      staleTime: 10 * 60 * 1000, // 10 minutes - languages rarely change
    });
  };

  return {
    prefetchRemedies,
    prefetchFeaturedRemedies,
    prefetchLanguages,
  };
}

// Hook to prefetch on component mount (for critical pages)
export function useCriticalPrefetch() {
  const { prefetchFeaturedRemedies, prefetchLanguages } = usePrefetch();

  useEffect(() => {
    // Prefetch critical data immediately
    prefetchFeaturedRemedies();
    prefetchLanguages();
  }, [prefetchFeaturedRemedies, prefetchLanguages]);
}