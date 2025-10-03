import React from 'react';
import { cn } from '@/lib/utils';

// ============================================
// SPINNER COMPONENT
// ============================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={cn(
        'inline-block border-blue-500 border-t-transparent rounded-full animate-spin',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ============================================
// SKELETON LOADERS
// ============================================

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700 animate-pulse',
        variantClasses[variant],
        className
      )}
      aria-hidden="true"
    />
  );
}

// ============================================
// CARD SKELETON
// ============================================

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 border rounded-lg bg-white shadow-sm', className)}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" className="w-10 h-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// TABLE SKELETON
// ============================================

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full space-y-3">
      <Skeleton className="h-10 w-full" /> {/* Header */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-12 w-24" />
        </div>
      ))}
    </div>
  );
}

// ============================================
// LIST SKELETON
// ============================================

export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 border rounded-lg">
          <Skeleton variant="circular" className="w-12 h-12" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

// ============================================
// LOADING OVERLAY
// ============================================

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ isLoading, message, className }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
        'flex flex-col items-center justify-center z-50',
        'transition-opacity duration-200',
        className
      )}
    >
      <Spinner size="lg" />
      {message && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

// ============================================
// FULL PAGE LOADER
// ============================================

interface FullPageLoaderProps {
  message?: string;
}

export function FullPageLoader({ message = 'Loading...' }: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-50">
      <Spinner size="xl" />
      <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
        {message}
      </h2>
      <div className="mt-2 flex gap-1">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

// ============================================
// INLINE LOADER
// ============================================

interface InlineLoaderProps {
  text?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function InlineLoader({ text, size = 'sm', className }: InlineLoaderProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Spinner size={size} />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
      )}
    </div>
  );
}
