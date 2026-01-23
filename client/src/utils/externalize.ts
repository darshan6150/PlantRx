import { normalizeHref } from './links';

// Function to normalize all links for seamless navigation
export function externalizeExternalAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;

    try {
      const url = new URL(href, window.location.origin);
      const isExternal = url.origin !== window.location.origin;
      
      if (isExternal) {
        // For external links, ensure they navigate in the same window with URL bar update
        // Remove target="_blank" to prevent new tab opening and allow URL bar update
        a.removeAttribute('target');
        // Don't override onclick - let browser handle navigation naturally
        // This allows the URL bar to update properly
        if (a.onclick) {
          a.onclick = null;
        }
        // Ensure the href is the original external URL
        a.href = href;
      } else {
        a.href = normalizeHref(href);
      }
    } catch (error) {
      // If URL parsing fails, check if it looks like an external URL
      if (href.startsWith('http://') || href.startsWith('https://')) {
        // Treat as external link
        a.removeAttribute('target');
        if (a.onclick) {
          a.onclick = null;
        }
        a.href = href;
      }
    }
  });
}