import { useEffect, useRef } from 'react';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  style?: {
    display?: string;
    width?: string;
    height?: string;
  };
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdSenseAd({ 
  adSlot, 
  adFormat = 'auto', 
  style = { display: 'block' },
  className = ''
}: AdSenseAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current) {
        // Only push if this ad hasn't been initialized yet
        const adElement = adRef.current.querySelector('.adsbygoogle');
        if (adElement && !adElement.getAttribute('data-adsbygoogle-status')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

// Common ad configurations
export const AdConfigs = {
  // Large rectangle ad for desktop
  rectangle: {
    style: { display: 'block', width: '336px', height: '280px' },
    adFormat: 'rectangle' as const
  },
  
  // Responsive banner
  banner: {
    style: { display: 'block' },
    adFormat: 'auto' as const
  },
  
  // Mobile-friendly ad
  mobile: {
    style: { display: 'block' },
    adFormat: 'auto' as const
  },
  
  // Sidebar ad
  sidebar: {
    style: { display: 'block', width: '300px', height: '600px' },
    adFormat: 'vertical' as const
  }
};