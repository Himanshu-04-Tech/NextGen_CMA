import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white/5 border border-brand-border rounded-2xl p-6 space-y-4 animate-pulse">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 rounded-xl bg-white/10" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="h-3 bg-white/10 rounded w-1/4" />
              </div>
            </div>
            <div className="h-16 bg-white/10 rounded-xl w-full" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-4 bg-white/10 rounded w-1/4" />
              <div className="h-9 bg-white/10 rounded-lg w-28" />
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="bg-white/5 border border-brand-border rounded-xl p-4 flex justify-between items-center animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10" />
              <div className="space-y-1">
                <div className="h-3 bg-white/10 rounded w-32" />
                <div className="h-2 bg-white/10 rounded w-20" />
              </div>
            </div>
            <div className="h-6 bg-white/10 rounded-full w-20" />
          </div>
        );
      case 'detail':
        return (
          <div className="space-y-6 animate-pulse">
            <div className="flex gap-6 items-start">
              <div className="w-24 h-24 rounded-2xl bg-white/10" />
              <div className="space-y-3 flex-1">
                <div className="h-6 bg-white/10 rounded w-1/4" />
                <div className="h-4 bg-white/10 rounded w-1/6" />
                <div className="h-4 bg-white/10 rounded w-1/3" />
              </div>
            </div>
            <div className="h-40 bg-white/10 rounded-2xl w-full" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
