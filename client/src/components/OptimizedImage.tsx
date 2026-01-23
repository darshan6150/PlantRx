import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'sync' | 'async' | 'auto';
  sizes?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  sizes,
  fallback,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate WebP and fallback sources
  const generateSources = (originalSrc: string) => {
    const ext = originalSrc.split('.').pop()?.toLowerCase();
    const baseSrc = originalSrc.replace(/\.[^/.]+$/, '');
    
    return {
      webp: ext !== 'webp' ? `${baseSrc}.webp` : originalSrc,
      avif: ext !== 'avif' ? `${baseSrc}.avif` : originalSrc,
      original: originalSrc
    };
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (!hasError && fallback) {
      setHasError(true);
      setImageSrc(fallback);
      return;
    }
    setHasError(true);
    onError?.();
  };

  const sources = generateSources(src);
  
  // Determine CSS aspect ratio if width and height are provided
  const aspectRatioStyle = width && height ? {
    aspectRatio: `${width}/${height}`
  } : {};

  return (
    <picture className={className}>
      {/* AVIF format for best compression */}
      <source srcSet={sources.avif} type="image/avif" sizes={sizes} />
      
      {/* WebP format for better compression */}
      <source srcSet={sources.webp} type="image/webp" sizes={sizes} />
      
      {/* Fallback to original format */}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{
          ...aspectRatioStyle,
          objectFit: 'cover'
        }}
      />
    </picture>
  );
}

// High-priority hero image component
export function HeroImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  );
}