import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-48 bg-zinc-800/40 border border-brand-border/40 rounded-2xl w-full flex flex-col justify-end p-6 space-y-3">
        <div className="h-6 bg-zinc-700/60 rounded w-1/4" />
        <div className="h-10 bg-zinc-700/60 rounded w-1/2" />
        <div className="h-4 bg-zinc-700/60 rounded w-3/4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Info Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-zinc-800/20 border border-brand-border/40 rounded-2xl space-y-4">
            <div className="h-5 bg-zinc-700/60 rounded w-1/3" />
            <div className="space-y-2.5">
              <div className="h-12 bg-zinc-700/40 rounded-xl" />
              <div className="h-12 bg-zinc-700/40 rounded-xl" />
              <div className="h-12 bg-zinc-700/40 rounded-xl" />
            </div>
          </div>
          <div className="p-6 bg-zinc-800/20 border border-brand-border/40 rounded-2xl space-y-3">
            <div className="h-5 bg-zinc-700/60 rounded w-1/3" />
            <div className="h-4 bg-zinc-700/40 rounded w-3/4" />
            <div className="h-4 bg-zinc-700/40 rounded w-2/3" />
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="lg:col-span-7 p-6 bg-zinc-800/20 border border-brand-border/40 rounded-2xl space-y-6">
          <div className="h-6 bg-zinc-700/60 rounded w-1/4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-12 bg-zinc-700/40 rounded-lg" />
            <div className="h-12 bg-zinc-700/40 rounded-lg" />
          </div>
          <div className="h-12 bg-zinc-700/40 rounded-lg" />
          <div className="h-12 bg-zinc-700/40 rounded-lg" />
          <div className="h-32 bg-zinc-700/40 rounded-lg" />
          <div className="h-12 bg-zinc-700/60 rounded-lg w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
