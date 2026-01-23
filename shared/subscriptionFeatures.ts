/**
 * Centralized subscription feature access control system
 * Defines which features are available at each subscription tier
 */

export type SubscriptionTier = 'bronze' | 'silver' | 'gold';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trial';

/**
 * Feature identifiers used across the platform
 */
export enum Feature {
  // Bronze (Free) - Base features
  REMEDY_LIBRARY = 'remedy_library',
  COMMUNITY_LOUNGE = 'community_lounge',
  WELLNESS_SHOP = 'wellness_shop',
  EXPERT_CONSULTATIONS_PREVIEW = 'expert_consultations_preview',
  
  // Silver - Mid-tier features
  EXPERT_CONSULTATIONS = 'expert_consultations',
  INTERACTIVE_MUSCLE_TRAINER = 'interactive_muscle_trainer',
  HEALTH_INSIGHT_DASHBOARD = 'health_insight_dashboard',
  COMMUNITY_FORUM = 'community_forum',
  
  // Gold - Premium features
  WELLNESS_BLUEPRINT_DESIGNER = 'wellness_blueprint_designer', // Creator/PlanRx
  AI_SYMPTOM_FINDER = 'ai_symptom_finder', // Smart Tools
  SMART_REMEDY_BUILDER = 'smart_remedy_builder',
  
  // Advanced filters/sections
  REMEDY_ADVANCED_FILTERS = 'remedy_advanced_filters',
  WORKOUT_LIBRARY_FULL = 'workout_library_full',
  MUSCLE_MAP_FULL = 'muscle_map_full',
  DASHBOARD_ADVANCED_INSIGHTS = 'dashboard_advanced_insights',
}

/**
 * Tier-to-feature mapping matrix
 * Defines which features are included in each tier
 */
export const TIER_FEATURES: Record<SubscriptionTier, Feature[]> = {
  bronze: [
    Feature.REMEDY_LIBRARY,
    Feature.COMMUNITY_LOUNGE,
    Feature.WELLNESS_SHOP,
    Feature.EXPERT_CONSULTATIONS_PREVIEW,
  ],
  silver: [
    // Includes all Bronze features
    Feature.REMEDY_LIBRARY,
    Feature.COMMUNITY_LOUNGE,
    Feature.WELLNESS_SHOP,
    Feature.EXPERT_CONSULTATIONS_PREVIEW,
    // Plus Silver features
    Feature.EXPERT_CONSULTATIONS,
    Feature.INTERACTIVE_MUSCLE_TRAINER,
    Feature.HEALTH_INSIGHT_DASHBOARD,
    Feature.COMMUNITY_FORUM,
    Feature.REMEDY_ADVANCED_FILTERS,
  ],
  gold: [
    // Includes all Bronze + Silver features
    Feature.REMEDY_LIBRARY,
    Feature.COMMUNITY_LOUNGE,
    Feature.WELLNESS_SHOP,
    Feature.EXPERT_CONSULTATIONS_PREVIEW,
    Feature.EXPERT_CONSULTATIONS,
    Feature.INTERACTIVE_MUSCLE_TRAINER,
    Feature.HEALTH_INSIGHT_DASHBOARD,
    Feature.COMMUNITY_FORUM,
    Feature.REMEDY_ADVANCED_FILTERS,
    // Plus Gold features
    Feature.WELLNESS_BLUEPRINT_DESIGNER,
    Feature.AI_SYMPTOM_FINDER,
    Feature.SMART_REMEDY_BUILDER,
    Feature.WORKOUT_LIBRARY_FULL,
    Feature.MUSCLE_MAP_FULL,
    Feature.DASHBOARD_ADVANCED_INSIGHTS,
  ],
};

/**
 * Feature metadata for UI display
 */
export const FEATURE_METADATA: Record<Feature, {
  name: string;
  description: string;
  requiredTier: SubscriptionTier;
}> = {
  [Feature.REMEDY_LIBRARY]: {
    name: 'Remedy Library',
    description: 'Access to 131+ verified plant-based remedies',
    requiredTier: 'bronze',
  },
  [Feature.COMMUNITY_LOUNGE]: {
    name: 'Community Lounge',
    description: 'Connect with other natural health enthusiasts',
    requiredTier: 'bronze',
  },
  [Feature.WELLNESS_SHOP]: {
    name: 'Wellness Shop',
    description: 'Shop premium natural health products',
    requiredTier: 'bronze',
  },
  [Feature.EXPERT_CONSULTATIONS_PREVIEW]: {
    name: 'Expert Consultations Preview',
    description: 'Preview expert consultation services',
    requiredTier: 'bronze',
  },
  [Feature.EXPERT_CONSULTATIONS]: {
    name: 'Book Expert Consultations',
    description: 'Schedule 1-on-1 consultations with verified health experts',
    requiredTier: 'silver',
  },
  [Feature.INTERACTIVE_MUSCLE_TRAINER]: {
    name: 'Interactive Muscle Trainer',
    description: 'Personalized workout plans and muscle targeting',
    requiredTier: 'silver',
  },
  [Feature.HEALTH_INSIGHT_DASHBOARD]: {
    name: 'Health Insight Dashboard',
    description: 'Track your progress with detailed analytics',
    requiredTier: 'silver',
  },
  [Feature.COMMUNITY_FORUM]: {
    name: 'Community Forum',
    description: 'Full access to community discussions and posts',
    requiredTier: 'silver',
  },
  [Feature.REMEDY_ADVANCED_FILTERS]: {
    name: 'Advanced Remedy Filters',
    description: 'Filter remedies by difficulty, time, and form',
    requiredTier: 'silver',
  },
  [Feature.WELLNESS_BLUEPRINT_DESIGNER]: {
    name: 'Wellness Blueprint Designer',
    description: 'Create personalized health plans with AI assistance',
    requiredTier: 'gold',
  },
  [Feature.AI_SYMPTOM_FINDER]: {
    name: 'AI Symptom Finder',
    description: 'Advanced AI-powered symptom analysis and recommendations',
    requiredTier: 'gold',
  },
  [Feature.SMART_REMEDY_BUILDER]: {
    name: 'Smart Remedy Builder',
    description: 'Build custom remedies tailored to your needs',
    requiredTier: 'gold',
  },
  [Feature.WORKOUT_LIBRARY_FULL]: {
    name: 'Full Workout Library',
    description: 'Access to complete workout collection',
    requiredTier: 'gold',
  },
  [Feature.MUSCLE_MAP_FULL]: {
    name: 'Complete Muscle Map',
    description: 'Full interactive muscle mapping and targeting',
    requiredTier: 'gold',
  },
  [Feature.DASHBOARD_ADVANCED_INSIGHTS]: {
    name: 'Advanced Dashboard Insights',
    description: 'Detailed analytics and AI-powered recommendations',
    requiredTier: 'gold',
  },
};

/**
 * Helper function to check if a tier has access to a feature
 */
export function hasFeature(tier: SubscriptionTier | null | undefined, feature: Feature): boolean {
  if (!tier) return false;
  return TIER_FEATURES[tier]?.includes(feature) || false;
}

/**
 * Helper function to check if subscription status allows feature access
 */
export function canAccessFeature(
  tier: SubscriptionTier | null | undefined,
  status: SubscriptionStatus | null | undefined,
  feature: Feature
): boolean {
  // Must have active or trial status
  if (status !== 'active' && status !== 'trial') return false;
  
  // Check tier access
  return hasFeature(tier, feature);
}

/**
 * Get the minimum required tier for a feature
 */
export function getRequiredTier(feature: Feature): SubscriptionTier {
  return FEATURE_METADATA[feature].requiredTier;
}

/**
 * Get all features available for a tier
 */
export function getTierFeatures(tier: SubscriptionTier): Feature[] {
  return TIER_FEATURES[tier] || [];
}

/**
 * Get tier display name
 */
export function getTierDisplayName(tier: SubscriptionTier): string {
  const names: Record<SubscriptionTier, string> = {
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
  };
  return names[tier];
}

/**
 * Get tier pricing
 */
export function getTierPricing(tier: SubscriptionTier): { monthly: string; yearly: string } {
  const pricing: Record<SubscriptionTier, { monthly: string; yearly: string }> = {
    bronze: { monthly: 'Free', yearly: 'Free' },
    silver: { monthly: '£6.99', yearly: '£59.00' },
    gold: { monthly: '£12.99', yearly: '£109.00' },
  };
  return pricing[tier];
}
