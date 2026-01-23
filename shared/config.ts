// Unified Configuration System with Zod Validation
// Centralizes all environment variables and provides runtime validation
import { z } from 'zod';

// Client-side configuration schema (VITE_ prefixed variables)
const clientConfigSchema = z.object({
  // Firebase Configuration
  firebase: z.object({
    apiKey: z.string().min(1, 'Firebase API key is required'),
    projectId: z.string().min(1, 'Firebase project ID is required'), 
    messagingSenderId: z.string().min(1, 'Firebase messaging sender ID is required'),
    appId: z.string().min(1, 'Firebase app ID is required'),
    authDomain: z.string().optional(),
    storageBucket: z.string().optional(),
    measurementId: z.string().optional(),
  }),

  // Analytics Configuration  
  analytics: z.object({
    gtmId: z.string().optional(),
    gaMeasurementId: z.string().optional(),
    adsenseClientId: z.string().optional(), 
    metricoolHash: z.string().optional(),
  }),

  // SEO Configuration
  seo: z.object({
    googleSiteVerification: z.string().optional(),
    bingVerification: z.string().optional(),
  }),

  // Environment
  environment: z.enum(['development', 'preview', 'production']).default('development'),
  isDevelopment: z.boolean().default(false),
  isProduction: z.boolean().default(false),
});

// Server-side configuration schema
const serverConfigSchema = z.object({
  // Database
  databaseUrl: z.string().url('Valid database URL is required'),
  
  // External APIs
  shopifyStorefrontUrl: z.string().url().optional(),
  shopifyAccessToken: z.string().optional(),
  openaiApiKey: z.string().optional(),
  
  // Port configuration
  port: z.number().int().min(1024).max(65535).default(5000),
  
  // Session configuration
  sessionSecret: z.string().min(32, 'Session secret must be at least 32 characters').refine((val) => {
    if (process.env.NODE_ENV === 'production' && val === 'dev-session-secret-change-in-production') {
      return false;
    }
    return true;
  }, 'Production session secret cannot be default value'),
  
  // Environment
  nodeEnv: z.enum(['development', 'test', 'production']).default('development'),
});

export type ClientConfig = z.infer<typeof clientConfigSchema>;
export type ServerConfig = z.infer<typeof serverConfigSchema>;

// Load and validate client configuration
export function loadClientConfig(): ClientConfig {
  if (typeof window === 'undefined') {
    throw new Error('Client config can only be loaded in browser environment');
  }

  const rawConfig = {
    firebase: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    },
    analytics: {
      gtmId: import.meta.env.VITE_GTM_ID,
      gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
      adsenseClientId: import.meta.env.VITE_ADSENSE_CLIENT_ID,
      metricoolHash: import.meta.env.VITE_METRICOOL_HASH,
    },
    seo: {
      googleSiteVerification: import.meta.env.VITE_GOOGLE_SITE_VERIFICATION,
      bingVerification: import.meta.env.VITE_BING_VERIFICATION,
    },
    environment: import.meta.env.MODE as 'development' | 'preview' | 'production',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  };

  try {
    return clientConfigSchema.parse(rawConfig);
  } catch (error) {
    console.error('❌ Client configuration validation failed:', error);
    throw new Error(`Invalid client configuration: ${error}`);
  }
}

// Load and validate server configuration
export function loadServerConfig(): ServerConfig {
  if (typeof window !== 'undefined') {
    throw new Error('Server config cannot be loaded in browser environment');
  }

  const rawConfig = {
    databaseUrl: process.env.DATABASE_URL,
    shopifyStorefrontUrl: process.env.SHOPIFY_STOREFRONT_URL,
    shopifyAccessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    openaiApiKey: process.env.OPENAI_API_KEY,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
    sessionSecret: process.env.SESSION_SECRET,
    nodeEnv: process.env.NODE_ENV as 'development' | 'test' | 'production',
  };

  try {
    return serverConfigSchema.parse(rawConfig);
  } catch (error) {
    console.error('❌ Server configuration validation failed:', error);
    throw new Error(`Invalid server configuration: ${error}`);
  }
}

// Cached configuration instances
let clientConfigCache: ClientConfig | null = null;
let serverConfigCache: ServerConfig | null = null;

// Get cached client config
export function getClientConfig(): ClientConfig {
  if (!clientConfigCache) {
    clientConfigCache = loadClientConfig();
  }
  return clientConfigCache;
}

// Get cached server config
export function getServerConfig(): ServerConfig {
  if (!serverConfigCache) {
    serverConfigCache = loadServerConfig();
  }
  return serverConfigCache;
}

// Utility functions for common checks
export function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const config = getClientConfig();
  return !!(config.analytics.gtmId || config.analytics.gaMeasurementId);
}

export function isFirebaseEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const config = getClientConfig();
  return !!(config.firebase.apiKey && config.firebase.projectId);
}

// Reset cache (useful for testing)
export function resetConfigCache(): void {
  clientConfigCache = null;
  serverConfigCache = null;
}