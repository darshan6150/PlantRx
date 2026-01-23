import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  schema?: object;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
  articleTags?: string[];
  locale?: string;
  priority?: string;
  changefreq?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://plantrxapp.com/plantrx-logo.png',
  ogType = 'website',
  noindex = false,
  schema,
  author = 'PlantRx',
  publishedTime,
  modifiedTime,
  articleSection,
  articleTags = [],
  locale = 'en_US',
  priority = '0.8',
  changefreq = 'weekly',
  breadcrumbs = []
}: SEOHeadProps) {
  const fullTitle = title.includes('PlantRx') ? title : `${title} | PlantRx`;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? 
    (window.location.origin + window.location.pathname).replace(/\/$/, '') || window.location.origin : 
    'https://plantrxapp.com');
  
  // PlantRx-optimized keywords for maximum search visibility
  const enhancedKeywords = keywords ? 
    `natural remedies, plant based health, herbal medicine, organic supplements, PlantRx, ${keywords}` : 
    'natural remedies, plant based health, herbal medicine, organic supplements, PlantRx, holistic health, wellness';
  
  // Optimize meta description - keep clean and within 160 chars
  const optimizedDescription = description.length > 160 ? 
    description.slice(0, 157) + '...' : description;

  // Organization schema with logo for Google Search results
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PlantRx",
    "url": "https://plantrxapp.com",
    "logo": "https://plantrxapp.com/plantrx-logo.png",
    "description": "PlantRx - Expert Natural Health Platform with 131+ verified plant-based remedies",
    "sameAs": [
      "https://www.facebook.com/plantrx",
      "https://www.twitter.com/plantrx",
      "https://www.instagram.com/plantrx"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@plantrxapp.com"
    }
  };

  return (
    <Helmet>
      {/* Google Tag Manager - Now loaded ONLY via CookieConsent.tsx after user consent */}
      {/* GTM ID: GTM-MLKLVC58 */}
      
      {/* Metricool Analytics - Now loaded ONLY via CookieConsent.tsx after user consent */}
      
      {/* Google AdSense - Now loaded ONLY via CookieConsent.tsx after user consent */}
      
      {/* Organization Schema with Logo for Google Search Results */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {/* Base href for reliable relative links */}
      <base href="/" />
      
      {/* Core SEO Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={enhancedKeywords} />
      <meta name="author" content="PlantRx" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Google AdSense Account Verification */}
      {import.meta.env.VITE_ADSENSE_CLIENT_ID && (
        <meta name="google-adsense-account" content={import.meta.env.VITE_ADSENSE_CLIENT_ID} />
      )}
      
      {/* PlantRx Brand Authority */}
      <meta name="application-name" content="PlantRx" />
      <meta name="generator" content="PlantRx - Expert Natural Health Remedies" />
      <meta name="subject" content="Natural Health Remedies and Herbal Medicine" />
      <meta name="copyright" content="PlantRx" />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* OpenGraph for Social */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="PlantRx" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="PlantRx - Expert Natural Health Solutions" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@PlantRx" />
      
      {/* Article-specific Open Graph tags */}
      {ogType === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {articleSection && <meta property="article:section" content={articleSection} />}
          {articleTags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Locale and Language Optimization */}
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content="en_GB" />
      <meta property="og:locale:alternate" content="en_CA" />
      <meta property="og:locale:alternate" content="en_AU" />
      
      {/* Search Engine Verification */}
      {/* Site verification meta tags - Replace with actual verification codes */}
      <meta name="google-site-verification" content={import.meta.env.VITE_GOOGLE_SITE_VERIFICATION || ""} />
      <meta name="msvalidate.01" content={import.meta.env.VITE_BING_VERIFICATION || ""} />
      

      {/* Additional Meta Tags */}
      <meta name="author" content={author} />
      <meta name="publisher" content="PlantRx" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Advanced SEO Meta Tags */}
      <meta name="theme-color" content="#22c55e" />
      <meta name="msapplication-TileColor" content="#22c55e" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-touch-fullscreen" content="yes" />
      
      {/* SEO Priority Hints */}
      <meta name="priority" content={priority} />
      <meta name="changefreq" content={changefreq} />
      <meta name="revisit-after" content="7 days" />
      
      {/* Rich Snippets Enhancement */}
      <meta name="thumbnail" content={ogImage} />
      <meta name="medium" content="website" />
      <meta name="syndication-source" content={canonicalUrl} />
      <meta name="original-source" content={canonicalUrl} />
      
      {/* Enhanced Brand Signals */}
      <meta property="business:contact_data:street_address" content="Global Platform" />
      <meta property="business:contact_data:locality" content="Worldwide" />
      <meta property="business:contact_data:region" content="Global" />
      <meta property="business:contact_data:postal_code" content="" />
      <meta property="business:contact_data:country_name" content="Worldwide" />
      <meta name="revisit-after" content="3 days" />
      <meta name="theme-color" content="#22c55e" />
      <meta name="msapplication-TileColor" content="#22c55e" />
      <meta name="msapplication-navbutton-color" content="#22c55e" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      
      {/* Preconnect for Performance - Only allowed domains */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://tracker.metricool.com" />
      <link rel="dns-prefetch" href="https://plantrxapp.com" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" crossOrigin="anonymous" />
      
      {/* Organization Schema - Critical for Brand Authority */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "PlantRx",
          "alternateName": ["PlantRx App", "PlantRx Natural Health Platform", "PlantRx Remedies"],
          "url": "https://plantrxapp.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://plantrxapp.com/plantrx-logo.png",
            "width": 1024,
            "height": 1024
          },
          "sameAs": [
            "https://www.instagram.com/plantrxapp",
            "https://twitter.com/plantrxapp", 
            "https://www.facebook.com/plantrxapp",
            "https://www.linkedin.com/company/plantrxapp",
            "https://www.youtube.com/c/plantrxapp"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "url": "https://plantrxapp.com/contact"
          },
          "description": "PlantRx is the leading natural health platform offering 166+ expert-verified remedies, advanced symptom analysis, and personalized natural health solutions for holistic wellness.",
          "foundingDate": "2024",
          "slogan": "Your Natural Health Journey Starts Here",
          "knowsAbout": [
            "Natural Remedies",
            "Herbal Medicine", 
            "Plant-Based Medicine",
            "Alternative Medicine",
            "Holistic Health",
            "Wellness",
            "Health Technology",
            "Symptom Analysis",
            "Personalized Health",
            "Expert-Verified Remedies"
          ],
          "areaServed": "Worldwide",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Natural Health Remedies",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Natural Remedy Database",
                  "description": "Access to 166+ expert-verified natural remedies"
                }
              }
            ]
          }
        })}
      </script>
      
      {/* Website Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "PlantRx",
          "alternateName": "PlantRx Natural Health Platform",
          "url": "https://plantrxapp.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://plantrxapp.com/remedies?search={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "PlantRx"
          }
        })}
      </script>

      {/* Enhanced Product Schema - Google Recommended Structure */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": "Natural Plant-Based Remedies",
          "description": "166+ expert-verified natural remedies",
          "offers": {
            "@type": "Offer",
            "url": "https://plantrxapp.com",
            "priceCurrency": "USD",
            "price": "0.00",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "256"
          }
        })}
      </script>
      <meta name="apple-mobile-web-app-title" content="PlantRx" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Schema.org Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      
      {/* Default Website Schema if none provided */}
      {!schema && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "PlantRx",
            "url": canonicalUrl,
            "description": description,
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://plantrxapp.com/remedies?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      )}
      
      {/* Breadcrumb Schema for Navigation */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": crumb.name,
              "item": `https://plantrxapp.com${crumb.url}`
            }))
          })}
        </script>
      )}
      
      {/* Article Schema for Blog Posts */}
      {ogType === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": optimizedDescription,
            "image": ogImage,
            "author": {
              "@type": "Organization",
              "name": author || "PlantRx"
            },
            "publisher": {
              "@type": "Organization",
              "name": "PlantRx",
              "logo": {
                "@type": "ImageObject",
                "url": "https://plantrxapp.com/plantrx-logo.png"
              }
            },
            "datePublished": publishedTime,
            "dateModified": modifiedTime || publishedTime,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            },
            "articleSection": articleSection,
            "keywords": articleTags.join(", ")
          })}
        </script>
      )}
    </Helmet>
  );
}