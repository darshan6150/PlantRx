import { Request, Response, NextFunction } from 'express';

// HTTPS Redirect Middleware - Disabled for Replit compatibility
export function httpsRedirect(req: Request, res: Response, next: NextFunction) {
  // Skip all HTTPS redirects - let Replit handle this
  next();
}

// Security Headers Middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  const DEV = process.env.NODE_ENV !== 'production';
  
  // Enhanced CSP for Google APIs, Analytics, GTM Gateway, Metricool, Firebase Auth, AdSense, Shopify, Stripe, and Tawk.to
  const CSP = `default-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' data: https://www.google-analytics.com https://www.googletagmanager.com https://gtm.plantrxapp.com https://analytics.google.com https://tracker.metricool.com https://*.google.com https://*.googleapis.com https://www.gstatic.com https://*.firebaseapp.com https://sdks.shopifycdn.com https://static.cloudflareinsights.com https://*.doubleclick.net https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google https://js.stripe.com https://m.stripe.com https://m.stripe.network https://embed.tawk.to https://*.tawk.to; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://gtm.plantrxapp.com https://analytics.google.com https://fonts.googleapis.com https://fonts.gstatic.com https://tracker.metricool.com https://*.google.com https://*.googleapis.com https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://0yx2kn-wu.myshopify.com https://cdn.shopify.com https://sdks.shopifycdn.com https://monorail-edge.shopifysvc.com https://*.doubleclick.net https://stats.g.doubleclick.net https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google https://*.stripe.com https://m.stripe.com https://m.stripe.network https://api.stripe.com https://*.tawk.to wss://*.tawk.to; img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://tracker.metricool.com https://lh3.googleusercontent.com https://cdn.shopify.com https://*.shopifycdn.com https://*.googleusercontent.com https://*.doubleclick.net https://*.google.com.sa https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google https://*.tawk.to; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://m.stripe.com https://m.stripe.network https://embed.tawk.to https://*.tawk.to; font-src 'self' data: https://fonts.gstatic.com https://embed.tawk.to https://*.tawk.to; frame-src 'self' https://www.google.com https://www.googletagmanager.com https://*.firebaseapp.com https://accounts.google.com https://checkout.shopify.com https://*.myshopify.com https://cdn.shopify.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://*.adtrafficquality.google https://*.stripe.com https://js.stripe.com https://m.stripe.com https://m.stripe.network https://*.tawk.to; frame-ancestors 'self' https://replit.com https://*.replit.com; worker-src 'self'; media-src 'self' https://*.tawk.to blob: data:`;

  res.setHeader('Content-Security-Policy', CSP);
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Permissions Policy to allow payment features for Stripe
  res.setHeader('Permissions-Policy', 'payment=*, geolocation=(self)');
  // CORS for Replit domains
  const origin = req.get('Origin');
  if (origin && (origin.match(/\.repl\.co$/) || origin === 'https://replit.com' || origin.match(/\.replit\.com$/))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  // NO X-Frame-Options header - let CSP frame-ancestors control it
  
  next();
}

// Enhanced Bot Detection Middleware - SEO Hardened
export function botFilter(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.get('User-Agent') || '';
  const path = req.path;
  const isCriticalPath = ['/', '/robots.txt', '/sitemap.xml', '/ads.txt', '/__health'].includes(path);
  
  // Enhanced legitimate bots list including Google Mobile-Friendly Test and Search Console
  const legitimateBots = [
    /Googlebot/i,
    /Googlebot-Mobile/i,
    /Googlebot-Image/i,
    /Googlebot-News/i,
    /Googlebot-Video/i,
    /Google-InspectionTool/i,        // Google Search Console URL Inspection
    /Google-PageSpeed/i,             // PageSpeed Insights
    /Google-Site-Verification/i,     // Site verification
    /Google-Read-Aloud/i,           // Accessibility
    /Google-Structured-Data-Testing-Tool/i,
    /Bingbot/i,
    /Yahoo!/i,
    /DuckDuckBot/i,
    /Baiduspider/i,
    /YandexBot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /WhatsApp/i,
    /Slackbot/i,
    /TelegramBot/i,
    /Applebot/i,
    /SemrushBot/i,
    /AhrefsBot/i,
    /MJ12bot/i,
    /DotBot/i
  ];
  
  const isLegitimateBot = legitimateBots.some(pattern => pattern.test(userAgent));
  
  // ALWAYS allow legitimate bots, especially on critical paths
  if (isLegitimateBot || isCriticalPath) {
    console.log(`✅ ALLOWED BOT: ${userAgent.substring(0, 50)} accessing ${path}`);
    return next();
  }
  
  // Only filter obviously malicious patterns
  const maliciousBotPatterns = [
    /^$/,  // Empty user agent
    /wget/i,
    /curl/i,
    /python-requests/i,
    /python-urllib/i,
    /java/i,
    /phantom/i,
    /selenium/i,
    /scraper/i,
    /harvester/i,
    /extractor/i,
    /downloader/i
  ];
  
  const isMaliciousBot = maliciousBotPatterns.some(pattern => pattern.test(userAgent));
  
  if (isMaliciousBot) {
    console.log(`🚫 BLOCKED MALICIOUS BOT: ${userAgent.substring(0, 50)} accessing ${path}`);
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Allow all other traffic including unknown bots to avoid blocking legitimate crawlers
  next();
}
