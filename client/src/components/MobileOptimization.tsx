import { useEffect } from 'react';

export function MobileOptimization() {
  useEffect(() => {
    // Enhanced viewport meta tag optimization
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, shrink-to-fit=no, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover');
    }

    // Safe touch optimization without global disable
    const touchOptimizations = {
      '-webkit-tap-highlight-color': 'transparent',
      '-webkit-overflow-scrolling': 'touch'
    };

    Object.entries(touchOptimizations).forEach(([prop, value]) => {
      document.documentElement.style.setProperty(prop, value);
    });
    
    // Enhanced iOS input focus handling
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const handleFocus = () => {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          (input as HTMLElement).style.fontSize = '16px';
          // Prevent zoom by temporarily adjusting viewport
          const viewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement;
          if (viewport) {
            const originalContent = viewport.content;
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            
            setTimeout(() => {
              viewport.content = originalContent;
            }, 100);
          }
        }
      };

      input.addEventListener('focus', handleFocus, { passive: true });
    });

    // Enhanced mobile detection and device-specific optimizations
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);

    if (isMobile) {
      document.body.classList.add('mobile-device');
      
      if (isIOS) {
        document.body.classList.add('ios-device');
        // iOS-specific optimizations
        document.documentElement.style.setProperty('-webkit-transform', 'translate3d(0,0,0)');
      }
      
      if (isAndroid) {
        document.body.classList.add('android-device');
        // Android-specific optimizations
        document.documentElement.style.setProperty('transform', 'translateZ(0)');
      }
    }

    // Performance optimizations for mobile
    const enableMobilePerformance = () => {
      // Reduce motion for better performance on low-end devices
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      }

      // Optimize scroll performance
      const scrollElements = document.querySelectorAll('[data-scroll]');
      scrollElements.forEach(element => {
        (element as HTMLElement).style.willChange = 'transform';
      });

      // Battery optimization
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          if (battery.level < 0.2) {
            document.body.classList.add('low-battery-mode');
            // Disable non-essential animations and effects
            document.documentElement.style.setProperty('--reduce-animations', '1');
          }
        });
      }
    };

    enableMobilePerformance();

    // Note: Removed double-tap prevention code as it was blocking scroll on mobile
    // The viewport meta tag already handles zoom prevention adequately

    // Cleanup function
    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
}