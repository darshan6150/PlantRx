import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  SubscriptionTier,
  SubscriptionStatus,
  Feature,
  canAccessFeature,
  hasFeature,
  getRequiredTier,
  getTierDisplayName,
  FEATURE_METADATA,
} from '@shared/subscriptionFeatures';

interface SubscriptionContextType {
  tier: SubscriptionTier | null;
  status: SubscriptionStatus | null;
  isLoading: boolean;
  checkFeatureAccess: (feature: Feature) => boolean;
  getRequiredTierFor: (feature: Feature) => SubscriptionTier;
  getTierName: () => string;
  isAuthenticated: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier | null>(null);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [localBootstrapComplete, setLocalBootstrapComplete] = useState(false);

  // Bootstrap from localStorage first (fast paint)
  useEffect(() => {
    const savedUser = localStorage.getItem('plantrx-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.isAuthenticated) {
          setIsAuthenticated(true);
          // Set default tier if not specified
          const userTier = userData.subscriptionTier || 'bronze';
          const userStatus = userData.subscriptionStatus || 'active';
          setTier(userTier as SubscriptionTier);
          setStatus(userStatus as SubscriptionStatus);
        }
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
      }
    }
    setLocalBootstrapComplete(true);
  }, []);

  // Revalidate with backend (authoritative source)
  const { data: currentUser, isLoading: isUserLoading } = useQuery<any>({
    queryKey: ['/api/user/me'],
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    retry: false,
  });

  // Update tier/status from backend response
  useEffect(() => {
    if (currentUser) {
      const backendTier = (currentUser.subscriptionTier || 'bronze') as SubscriptionTier;
      const backendStatus = (currentUser.subscriptionStatus || 'active') as SubscriptionStatus;
      
      setTier(backendTier);
      setStatus(backendStatus);
      
      // Update localStorage to keep in sync
      const savedUser = localStorage.getItem('plantrx-user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          userData.subscriptionTier = backendTier;
          userData.subscriptionStatus = backendStatus;
          localStorage.setItem('plantrx-user', JSON.stringify(userData));
        } catch (error) {
          console.error('Failed to update localStorage with subscription data:', error);
        }
      }
    }
  }, [currentUser]);

  // Check if user has access to a specific feature
  const checkFeatureAccess = (feature: Feature): boolean => {
    return canAccessFeature(tier, status, feature);
  };

  // Get required tier for a feature
  const getRequiredTierFor = (feature: Feature): SubscriptionTier => {
    return getRequiredTier(feature);
  };

  // Get current tier display name
  const getTierName = (): string => {
    return tier ? getTierDisplayName(tier) : 'Guest';
  };

  const value: SubscriptionContextType = {
    tier,
    status,
    isLoading: !localBootstrapComplete || isUserLoading,
    checkFeatureAccess,
    getRequiredTierFor,
    getTierName,
    isAuthenticated,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

/**
 * Hook to access subscription context
 */
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

/**
 * Hook to check access to a specific feature
 */
export function useFeatureAccess(feature: Feature) {
  const { checkFeatureAccess, getRequiredTierFor, tier } = useSubscription();
  
  const hasAccess = checkFeatureAccess(feature);
  const requiredTier = getRequiredTierFor(feature);
  const featureInfo = FEATURE_METADATA[feature];
  
  return {
    hasAccess,
    requiredTier,
    currentTier: tier,
    featureName: featureInfo.name,
    featureDescription: featureInfo.description,
  };
}
