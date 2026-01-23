import path from "path";
import { fileURLToPath } from "url";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import pg from "pg";
import Stripe from "stripe";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import {
  httpsRedirect,
  securityHeaders,
  botFilter,
} from "./middleware/security";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// Extend the session interface
declare module "express-session" {
  interface SessionData {
    userId?: number;
    userEmail?: string;
    languageCode?: string;
  }
}

const app = express();

// Add HEAD method support for all routes
app.use((req, res, next) => {
  if (req.method === "HEAD") {
    // Convert HEAD to GET and remove body from response
    req.method = "GET";
    const originalSend = res.send;
    res.send = function (body) {
      res.removeHeader("content-length");
      return originalSend.call(this, "");
    };
    const originalJson = res.json;
    res.json = function (obj) {
      res.removeHeader("content-length");
      return originalSend.call(this, "");
    };
  }
  next();
});

// SEO: Remove X-Powered-By header for security and SEO
app.disable("x-powered-by");

// Trust proxy (behind Cloudflare)
app.enable("trust proxy");

// Fix MIME type for JavaScript files - Google requirement
app.use((req, res, next) => {
  if (req.url.endsWith(".js")) {
    res.setHeader("Content-Type", "application/javascript");
  } else if (req.url.endsWith(".mjs")) {
    res.setHeader("Content-Type", "application/javascript");
  } else if (req.url.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css");
  }
  next();
});

// Performance: Add caching headers for static assets
app.use((req, res, next) => {
  const url = req.url.toLowerCase();

  // Aggressive caching for immutable assets (Vite adds hashes to filenames)
  if (
    url.includes("/assets/") ||
    url.match(
      /\.[a-f0-9]{8}\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp|avif|ico)$/
    )
  ) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
  // Long-term caching for fonts
  else if (url.match(/\.(woff2?|ttf|eot|otf)$/)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
  // Medium caching for images
  else if (url.match(/\.(png|jpg|jpeg|gif|webp|avif|ico|svg)$/)) {
    res.setHeader(
      "Cache-Control",
      "public, max-age=604800, stale-while-revalidate=86400"
    );
  }
  // Short caching for HTML to allow updates
  else if (url.endsWith(".html") || url === "/" || !url.includes(".")) {
    res.setHeader(
      "Cache-Control",
      "public, max-age=3600, stale-while-revalidate=86400"
    );
  }

  next();
});

// Apply security middleware first
// app.use(httpsRedirect);
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Clear-Site-Data only for logout, not for static assets
app.post("/api/logout", (req, res, next) => {
  res.setHeader("Clear-Site-Data", '"cache", "storage", "cookies"');
  next();
});

app.use(securityHeaders);
// Enhanced bot filter - now allows all legitimate crawlers
app.use(botFilter);

// SEO Redirects - www to non-www for ranking consolidation
app.use((req, res, next) => {
  if (req.headers.host?.startsWith("www.")) {
    const redirectUrl = `https://${req.headers.host.slice(4)}${req.url}`;
    return res.redirect(301, redirectUrl);
  }
  next();
});

// Stripe webhook - must be BEFORE express.json() to receive raw body for signature verification
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-10-29.clover",
    })
  : null;

app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }

      const sig = req.headers["stripe-signature"];
      if (!sig) {
        return res.status(400).json({ message: "Missing stripe signature" });
      }

      let event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET || ""
        );
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return res
          .status(400)
          .json({ message: "Webhook signature verification failed" });
      }

      // Handle the checkout.session.completed event
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const tier = session.metadata?.tier;

        if (userId && tier && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Activate subscription and clear pending state
          // Also mark user as having paid (for GOLD10 discount code logic)
          await storage.updateUser(parseInt(userId), {
            subscriptionTier: tier,
            subscriptionStatus: "active",
            stripeSubscriptionId: session.subscription as string,
            subscriptionPeriodEnd: new Date(
              (subscription as any).current_period_end * 1000
            ),
            pendingTier: null,
            pendingCheckoutSessionId: null,
            hasEverPaidSubscription: true, // Track that user has paid
          });

          console.log(
            `Subscription activated for user ${userId}: ${tier} (hasEverPaidSubscription: true)`
          );
        }
      }

      // Handle subscription updates
      if (event.type === "customer.subscription.updated") {
        const subscription = event.data.object as any;
        const customer = await stripe.customers.retrieve(subscription.customer);

        if (customer && !customer.deleted && customer.metadata?.userId) {
          const userId = parseInt(customer.metadata.userId);
          await storage.updateUser(userId, {
            subscriptionStatus: subscription.status,
            subscriptionPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          });
        }
      }

      // Handle subscription deletion/cancellation
      if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as any;
        const customer = await stripe.customers.retrieve(subscription.customer);

        if (customer && !customer.deleted && customer.metadata?.userId) {
          const userId = parseInt(customer.metadata.userId);
          await storage.updateUser(userId, {
            subscriptionStatus: "canceled",
            subscriptionTier: "bronze", // Revert to free plan
          });
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Increase file upload limits for profile pictures and other uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// Configure session middleware with PostgreSQL store
const PgSession = ConnectPgSimple(session);

// Create connection pool for sessions
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      tableName: "sessions",
      createTableIfMissing: false, // We already created the table
    }),
    secret:
      process.env.SESSION_SECRET ||
      require("crypto").randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Enhanced sitemap.xml with error handling
app.get("/sitemap.xml", (req, res) => {
  try {
    const userAgent = req.get("User-Agent") || "";
    console.log("🗺️ Sitemap.xml request from:", userAgent);

    const baseUrl = "https://plantrxapp.com";
    const currentDate = new Date().toISOString();

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${baseUrl}/sitemap-pages.xml</loc><lastmod>${currentDate}</lastmod></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-remedies.xml</loc><lastmod>${currentDate}</lastmod></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-store.xml</loc><lastmod>${currentDate}</lastmod></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-blog.xml</loc><lastmod>${currentDate}</lastmod></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-experts.xml</loc><lastmod>${currentDate}</lastmod></sitemap>
</sitemapindex>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).send(sitemapIndex);
  } catch (error) {
    console.error("❌ Error serving sitemap.xml:", error);
    res
      .status(200)
      .type("application/xml")
      .send(
        '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://plantrxapp.com/</loc></url></urlset>'
      );
  }
});

// Sitemap Pages - Main site pages
app.get("/sitemap-pages.xml", (req, res) => {
  const baseUrl = "https://plantrxapp.com";
  const currentDate = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/remedies</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/store</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/experts</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/blog</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/about</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/contact</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/privacy-policy</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/terms</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/disclaimer</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/smart-tools</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/community</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/workouts</loc><lastmod>${currentDate}</lastmod></url>
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(sitemap);
});

// Sitemap Remedies - All individual remedy pages with real data
app.get("/sitemap-remedies.xml", (req, res) => {
  const baseUrl = "https://plantrxapp.com";
  const currentDate = new Date().toISOString();

  // Use the real remedy slugs from your database (sample from earlier query)
  const remedySlugs = [
    "acupressure-headache-points",
    "aloe-formula-110",
    "aloe-formula-123",
    "aloe-formula-19",
    "aloe-formula-32",
    "aloe-formula-45",
    "aloe-formula-58",
    "aloe-formula-6",
    "aloe-formula-71",
    "aloe-formula-84",
    "aloe-formula-97",
    "apple-cider-vinegar-digestive",
    "bacopa-learning-enhancement",
    "baking-soda-headache-drink",
    "baking-soda-heartburn-relief",
    "banana-potassium-cramp-relief",
    "butterbur-migraine-prevention",
    "calendula-formula-103",
    "calendula-formula-116",
    "calendula-formula-12",
    "calendula-formula-129",
    "calendula-formula-25",
    "calendula-formula-38",
    "calendula-formula-51",
    "calendula-formula-64",
    "calendula-formula-77",
    "calendula-formula-90",
    "chamomile-formula-108",
    "chamomile-formula-121",
    "chamomile-formula-17",
    "chamomile-formula-30",
    "chamomile-formula-4",
    "chamomile-formula-43",
    "chamomile-formula-56",
    "chamomile-formula-69",
    "chamomile-formula-82",
    "chamomile-formula-95",
    "chamomile-tea-sleep-aid",
    "chanca-piedra-stone-breaker",
    "coffee-headache-treatment",
    "cold-heat-headache-therapy",
    "cooling-peppermint-temple-balm",
    "corn-silk-kidney-support",
    "cucumber-eye-compress",
    "dandelion-liver-detox-tea",
    "dandelion-nettle-kidney-cleanse",
    "deep-breathing-headache-relief",
    "digestive-support-tea",
    "echinacea-formula-111",
    "echinacea-formula-124",
    "echinacea-formula-20",
    "echinacea-formula-33",
    "echinacea-formula-46",
    "echinacea-formula-59",
    "echinacea-formula-7",
    "echinacea-formula-72",
    "echinacea-formula-85",
    "echinacea-formula-98",
    "echinacea-throat-support",
    "epsom-salt-foot-soak",
    "feverfew-migraine-prevention",
    "garlic-formula-10",
    "garlic-formula-101",
    "garlic-formula-114",
    "garlic-formula-127",
    "garlic-formula-23",
    "garlic-formula-36",
    "garlic-formula-49",
    "garlic-formula-62",
    "garlic-formula-75",
    "garlic-formula-88",
    "garlic-immune-booster",
    "ginger-formula-1",
    "ginger-formula-105",
    "ginger-formula-118",
    "ginger-formula-131",
    "ginger-formula-14",
    "ginger-formula-27",
    "ginger-formula-40",
    "ginger-formula-53",
    "ginger-formula-66",
    "ginger-formula-79",
    "ginger-formula-92",
    "ginger-nausea-tea",
    "ginger-turmeric-headache-tea",
    "ginkgo-memory-enhancement",
    "green-tea-formula-100",
    "green-tea-formula-113",
    "green-tea-formula-126",
    "green-tea-formula-22",
    "green-tea-formula-35",
    "green-tea-formula-48",
    "green-tea-formula-61",
    "green-tea-formula-74",
    "green-tea-formula-87",
    "green-tea-formula-9",
    "honey-formula-107",
    "honey-formula-120",
    "honey-formula-133",
    "honey-formula-16",
    "honey-formula-29",
    "honey-formula-3",
    "honey-formula-42",
    "honey-formula-55",
    "honey-formula-68",
    "honey-formula-81",
    "honey-formula-94",
    "honey-ginger-throat-soother",
    "honey-lemon-cough-syrup",
    "hydration-electrolyte-headache",
    "ice-pack-towel-therapy",
    "juniper-kidney-detox",
    "lavender-chamomile-headache-relief",
    "lavender-formula-112",
    "lavender-formula-125",
    "lavender-formula-21",
    "lavender-formula-34",
    "lavender-formula-47",
    "lavender-formula-60",
    "lavender-formula-73",
    "lavender-formula-8",
    "lavender-formula-86",
    "lavender-formula-99",
    "lions-mane-brain-tonic",
    "magnesium-b-complex-support",
    "marshmallow-root-throat-tea",
    "milk-thistle-liver-protection",
    "neck-shoulder-headache-stretches",
    "oatmeal-soothing-skin-mask",
    "panax-ginseng-cognitive-tea",
    "peppermint-formula-109",
    "peppermint-formula-122",
    "peppermint-formula-18",
    "peppermint-formula-31",
    "peppermint-formula-44",
    "peppermint-formula-5",
    "peppermint-formula-57",
    "peppermint-formula-70",
    "peppermint-formula-83",
    "peppermint-formula-96",
    "rice-water-hair-treatment",
    "sage-throat-gargle",
    "salt-water-headache-relief",
    "schisandra-liver-regeneration",
    "soothing-herbal-balm-for-rough-skin",
    "soothing-herbal-skin-balm",
    "test-ginger-honey-remedy",
    "turmeric-formula-106",
    "turmeric-formula-119",
    "turmeric-formula-132",
    "turmeric-formula-15",
    "turmeric-formula-2",
    "turmeric-formula-28",
    "turmeric-formula-41",
    "turmeric-formula-54",
    "turmeric-formula-67",
    "turmeric-formula-80",
    "turmeric-formula-93",
    "turmeric-golden-milk",
    "turmeric-liver-support",
    "valerian-formula-104",
    "valerian-formula-117",
    "valerian-formula-13",
    "valerian-formula-130",
    "valerian-formula-26",
    "valerian-formula-39",
    "valerian-formula-52",
    "valerian-formula-65",
    "valerian-formula-78",
    "valerian-formula-91",
    "willow-bark-headache-remedy",
    "willow-formula-102",
    "willow-formula-11",
    "willow-formula-115",
    "willow-formula-128",
    "willow-formula-24",
    "willow-formula-37",
    "willow-formula-50",
    "willow-formula-63",
    "willow-formula-76",
    "willow-formula-89",
  ];

  const remedyUrls = remedySlugs
    .map(
      (slug) =>
        `  <url><loc>${baseUrl}/remedies/${slug}</loc><lastmod>${currentDate}</lastmod></url>`
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${remedyUrls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(sitemap);
});

// Sitemap Store - Product pages
app.get("/sitemap-store.xml", (req, res) => {
  const baseUrl = "https://plantrxapp.com";
  const currentDate = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/store/spirulina-powder-organic</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/store/echinacea-drops</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/store/holy-basil-tincture</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/store/turmeric-curcumin-capsules</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/store/ashwagandha-root-extract</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/store/reishi-mushroom-powder</loc><lastmod>${currentDate}</lastmod></url>
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(sitemap);
});

// Sitemap Blog - Blog posts
app.get("/sitemap-blog.xml", (req, res) => {
  const baseUrl = "https://plantrxapp.com";

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/blog/herbal-remedies-for-colds</loc><lastmod>2025-08-20T12:00:00+00:00</lastmod></url>
  <url><loc>${baseUrl}/blog/plant-based-skin-care-basics</loc><lastmod>2025-08-14T12:00:00+00:00</lastmod></url>
  <url><loc>${baseUrl}/blog/natural-anxiety-remedies</loc><lastmod>2025-08-12T12:00:00+00:00</lastmod></url>
  <url><loc>${baseUrl}/blog/digestive-health-herbs</loc><lastmod>2025-08-10T12:00:00+00:00</lastmod></url>
  <url><loc>${baseUrl}/blog/immune-boosting-plants</loc><lastmod>2025-08-08T12:00:00+00:00</lastmod></url>
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(sitemap);
});

// Sitemap Experts - Expert profile pages
app.get("/sitemap-experts.xml", (req, res) => {
  const baseUrl = "https://plantrxapp.com";
  const currentDate = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/experts/sage-herbwell-naturopath</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/experts/nature-wise-herbalist</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/experts/botanical-healer-expert</loc><lastmod>${currentDate}</lastmod></url>
  <url><loc>${baseUrl}/experts/plant-medicine-specialist</loc><lastmod>${currentDate}</lastmod></url>
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(sitemap);
});

// Enhanced robots.txt with error handling
app.get("/robots.txt", (req, res) => {
  try {
    const userAgent = req.get("User-Agent") || "";
    console.log("🤖 Robots.txt request from:", userAgent);

    const robots = `User-agent: *
Allow: /

# Disallow only truly private/sensitive areas
Disallow: /api/admin/
Disallow: /api/auth/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /checkout/
Disallow: /settings/
Disallow: /api/generate-pdf

# Allow all public content
Allow: /remedies/
Allow: /store/
Allow: /collections/
Allow: /experts/
Allow: /blog/
Allow: /workouts/
Allow: /community/
Allow: /smart-tools/
Allow: /about
Allow: /contact
Allow: /terms
Allow: /privacy-policy
Allow: /cookie-policy
Allow: /disclaimer
Allow: /refunds
Allow: /liability

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

Sitemap: https://plantrxapp.com/sitemap.xml`;

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.status(200).send(robots);
  } catch (error) {
    console.error("❌ Error serving robots.txt:", error);
    res
      .status(200)
      .type("text/plain")
      .send(
        "User-agent: *\nAllow: /\nSitemap: https://plantrxapp.com/sitemap.xml"
      );
  }
});

// AdSense ads.txt route - Critical for ad monetization
app.get("/ads.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send("google.com, pub-5245165544457327, DIRECT, f08c47fec0942fa0");
});

// Enhanced logging middleware with bot detection
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const userAgent = req.get("User-Agent") || "";
  const isBot =
    /bot|crawler|spider|googlebot|bingbot|facebookexternalhit/i.test(userAgent);
  const isCriticalPath = [
    "/",
    "/robots.txt",
    "/sitemap.xml",
    "/__health",
  ].includes(path);
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

    // Enhanced logging for bots and critical paths
    if (isBot || isCriticalPath || res.statusCode >= 400) {
      console.log(
        `🔍 ${
          isBot ? "🤖 BOT" : "👤 USER"
        } ${logLine} | UA: ${userAgent.substring(0, 50)}`
      );

      // Alert on non-200 responses to critical paths
      if (isCriticalPath && res.statusCode !== 200) {
        console.error(
          `🚨 CRITICAL: Non-200 response to ${path}: ${res.statusCode}`
        );
      }
    }

    if (path.startsWith("/api")) {
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Serve static files from remedy_images subdirectory only (security: don't expose entire attached_assets)
const remedyImagesPath = path.resolve(
  import.meta.dirname,
  "..",
  "attached_assets",
  "remedy_images"
);
app.use(
  "/attached_assets/remedy_images",
  express.static(remedyImagesPath, {
    maxAge: "1d", // Cache images for 1 day
    index: false, // Disable directory listing
    dotfiles: "deny", // Deny access to dotfiles
  })
);

(async () => {
  const server = await registerRoutes(app);

  // Initialize currency rates system (non-blocking to ensure server starts)
  (async () => {
    try {
      const { initializeCurrencyRates, scheduleCurrencyUpdates } = await import(
        "./currency-service"
      );
      await initializeCurrencyRates();
      scheduleCurrencyUpdates();
    } catch (error) {
      console.error("❌ Failed to initialize currency system:", error);
    }
  })().catch((err) => console.log("Currency system will retry later"));

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Global error handler - Critical for SEO: Never send 5xx to crawlers
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const userAgent = req.get("User-Agent") || "";
    const isBot =
      /bot|crawler|spider|googlebot|bingbot|facebookexternalhit/i.test(
        userAgent
      );
    const isCriticalPath = [
      "/",
      "/robots.txt",
      "/sitemap.xml",
      "/__health",
    ].includes(req.path);

    // Log all errors with detailed context
    console.error("❌ Server Error:", {
      path: req.path,
      method: req.method,
      userAgent: userAgent,
      isBot: isBot,
      isCriticalPath: isCriticalPath,
      error: err.message,
      stack: err.stack,
    });

    // For bots on critical paths, ALWAYS return 200 with minimal content
    //     if (isBot && isCriticalPath) {
    //       if (req.path === '/') {
    //         return res.status(200).send(`<!DOCTYPE html>
    // <html><head><title>PlantRx - Natural Health Platform</title></head>
    // <body><h1>PlantRx</h1><p>Natural health remedies and expert guidance.</p></body></html>`);
    //       } else if (req.path === '/robots.txt') {
    //         return res.status(200).type('text/plain').send('User-agent: *\nAllow: /\nSitemap: https://plantrxapp.com/sitemap.xml');
    //       } else if (req.path === '/sitemap.xml') {
    //         return res.status(200).type('application/xml').send('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://plantrxapp.com/</loc></url></urlset>');
    //       } else if (req.path === '/__health') {
    //         return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    //       }
    //     }
    if (!res.headersSent) {
      res.status(500).send("Internal Server Error");
    }

    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  // Add health check endpoint for monitoring
  app.get("/__health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
    });
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const PORT = parseInt(process.env.PORT || "5000", 10);
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on http://0.0.0.0:${PORT}`);
  });
})();
