import React, { useState, useEffect, useRef } from 'react';
import { Skeleton } from './Skeleton';
import { Image as ImageIcon } from 'lucide-react';
import { isImagePreloaded, markImageAsLoaded } from '../utils/imagePreloader';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
  aspectRatio?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  priority = false,
  aspectRatio,
  ...props
}) => {
  // Synchronously initialize isLoaded if already preloaded or in browser memory cache
  const [isLoaded, setIsLoaded] = useState<boolean>(() => isImagePreloaded(src));
  const [hasError, setHasError] = useState<boolean>(false);
  const [inViewportRange, setInViewportRange] = useState<boolean>(() => priority || isImagePreloaded(src));

  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Sync state whenever src prop changes (e.g. project switcher tabs)
  useEffect(() => {
    if (isImagePreloaded(src)) {
      setIsLoaded(true);
      setHasError(false);
      setInViewportRange(true);
    } else {
      setIsLoaded(false);
      setHasError(false);
      if (priority) {
        setInViewportRange(true);
      }
    }
  }, [src, priority]);

  // Proactive IntersectionObserver with expansive 1200px rootMargin
  // This triggers downloading of images well BEFORE the user reaches the section
  useEffect(() => {
    if (inViewportRange || priority || isLoaded) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setInViewportRange(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && (entry.isIntersecting || entry.intersectionRatio > 0)) {
          setInViewportRange(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '1200px 0px 1200px 0px', // Fetch when within 1200px of viewport
        threshold: 0,
      }
    );

    const el = wrapperRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [inViewportRange, priority, isLoaded]);

  // Synchronous check if browser already completed the image
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      markImageAsLoaded(src);
      setIsLoaded(true);
    }
  }, [inViewportRange, src]);

  const handleImageLoad = () => {
    markImageAsLoaded(src);
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden ${aspectRatio || ''} ${wrapperClassName}`}
    >
      {/* Skeleton placeholder shown while image is loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0">
          <Skeleton className="w-full h-full rounded-[inherit]" variant="rectangular" />
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <ImageIcon className="w-8 h-8 text-stone-400" />
          </div>
        </div>
      )}

      {/* Actual image rendered when in proximity or priority */}
      {inViewportRange && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          referrerPolicy="no-referrer"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`${className} transition-opacity duration-300 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}

      {/* Fallback container if image fails to load */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-900 text-stone-400 p-4 text-center">
          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
          <span className="font-mono text-[10px] uppercase tracking-wider">
            ARCLINE // ARCHITECTURE
          </span>
        </div>
      )}
    </div>
  );
};
