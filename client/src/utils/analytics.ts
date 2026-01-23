// Google Tag Manager tracking utility - All analytics through GTM
// GTM Container: GTM-MLKLVC58
// GA4 Property: Configured via VITE_GA_MEASUREMENT_ID environment variable

declare global {
  interface Window {
    dataLayer: any[];
  }
}

// Initialize GTM dataLayer for custom events
export function initializeGTM() {
  if (typeof window === 'undefined') return;
  
  // Ensure dataLayer exists for GTM
  window.dataLayer = window.dataLayer || [];
  
  console.log('✅ GTM dataLayer initialized - all tracking through GTM');
}

// Track page views for SPA navigation (GTM style)
export function trackPageView(path?: string) {
  if (typeof window === 'undefined') return;
  
  const currentPath = path || window.location.pathname + window.location.search;
  
  // Push page view event to dataLayer for GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    page_path: currentPath,
    page_title: document.title,
    page_location: window.location.origin + currentPath
  });
  
  console.log(`📊 GTM Pageview tracked: ${currentPath} - ${document.title}`);
}

// Track custom events (GTM style)
export function trackEvent(action: string, category?: string, label?: string, value?: number) {
  if (typeof window === 'undefined') return;
  
  // Push custom event to dataLayer for GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: action,
    event_category: category || 'engagement',
    event_label: label,
    value: value
  });
}

// Enhanced page tracking with additional metadata (GTM style)
export function trackPageWithMetadata(pageType: string, contentId?: string) {
  if (typeof window === 'undefined') return;
  
  // Push enhanced page view to dataLayer for GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'enhanced_page_view',
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
    page_location: window.location.href,
    content_group1: pageType,
    content_group2: contentId || 'unknown'
  });
  
  // Also send a standard page_view event to ensure GA4 captures it
  window.dataLayer.push({
    event: 'page_view',
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
    page_location: window.location.href,
    content_group: pageType
  });
  
  console.log(`📊 Enhanced tracking: ${pageType}${contentId ? ` - ${contentId}` : ''} at ${window.location.pathname}`);
}

// Track remedy page views with custom events
export function trackRemedyView(remedyName: string, remedyId?: string) {
  if (typeof window === 'undefined') return;
  
  // Push remedy view event to dataLayer for GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'remedy_view',
    remedy_name: remedyName,
    remedy_id: remedyId,
    page_url: window.location.pathname,
    event_category: 'remedies'
  });
  
  console.log(`🌿 Remedy View tracked: ${remedyName}`);
}

// Track PDF downloads with custom events
export function trackPDFDownload(fileName: string, planType?: string) {
  if (typeof window === 'undefined') return;
  
  // Push PDF download event to dataLayer for GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'pdf_download',
    file_name: fileName,
    plan_type: planType,
    page_url: window.location.pathname,
    event_category: 'downloads'
  });
  
  console.log(`📄 PDF Download tracked: ${fileName}`);
}

// Track product/store page views
export function trackProductView(productName: string, productId?: string, price?: number) {
  if (typeof window === 'undefined') return;
  
  // Push product view event to dataLayer for GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'view_item',
    currency: 'GBP',
    value: price || 0,
    items: [{
      item_id: productId,
      item_name: productName,
      category: 'products',
      price: price || 0
    }]
  });
  
  console.log(`🛒 Product View tracked: ${productName}`);
}

// Push custom data to GTM dataLayer
export function pushToDataLayer(data: Record<string, any>) {
  if (typeof window === 'undefined') return;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}