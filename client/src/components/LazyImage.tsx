import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  placeholderColor?: string;
  priority?: boolean;
}

export function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  placeholderColor = 'bg-gray-200 dark:bg-gray-700',
  priority = false
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        !isLoaded && placeholderColor,
        className
      )}
      style={{ width, height }}
    >
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          style={{ width, height }}
        />
      )}
      {!isLoaded && (
        <div
          ref={!isInView ? imgRef : undefined}
          className={cn(
            'absolute inset-0 animate-pulse',
            placeholderColor
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '100vw',
  priority = false
}: LazyImageProps & { sizes?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <picture className={cn('block', className)}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          !isLoaded && 'bg-gray-200 dark:bg-gray-700'
        )}
        style={{ width, height }}
        sizes={sizes}
      />
    </picture>
  );
}
