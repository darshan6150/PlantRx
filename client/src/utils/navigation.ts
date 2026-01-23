// Navigation helper for seamless routing
export function navigateTo(path: string) {
  if (typeof window !== 'undefined') {
    try {
      // Check if it's an external URL
      const url = new URL(path, window.location.origin);
      const isExternal = url.origin !== window.location.origin;
      
      if (isExternal) {
        // For external URLs, navigate directly to update URL bar
        window.location.href = path;
      } else {
        // For internal paths, use href for seamless navigation
        window.location.href = path;
      }
    } catch (error) {
      // If URL parsing fails, assume it's a path and navigate anyway
      window.location.href = path;
    }
  }
}