import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'rounded' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rounded',
}) => {
  const variantClasses = {
    rectangular: 'rounded-none',
    rounded: 'rounded-2xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4',
  }[variant];

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-stone-200/80 dark:bg-stone-800/80 ${variantClasses} ${className}`}
    >
      {/* Animated luxury architectural shimmer bar */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent pointer-events-none" />
    </div>
  );
};
