import { ReactNode } from 'react';
import { Feature } from '@shared/subscriptionFeatures';

interface FeatureLockProps {
  feature: Feature;
  children: ReactNode;
  fallback?: ReactNode;
  showPreview?: boolean;
}

/**
 * FeatureLock Component
 * TEMPORARILY DISABLED - All features are accessible
 * To re-enable locks, restore the full implementation from git history
 */
export function FeatureLock({ children }: FeatureLockProps) {
  return <>{children}</>;
}

/**
 * UpgradeInterstitial Component
 * TEMPORARILY DISABLED - All features are accessible
 * To re-enable locks, restore the full implementation from git history
 */
interface UpgradeInterstitialProps {
  feature: Feature;
  children?: ReactNode;
}

export function UpgradeInterstitial({ children }: UpgradeInterstitialProps) {
  return <>{children}</>;
}
