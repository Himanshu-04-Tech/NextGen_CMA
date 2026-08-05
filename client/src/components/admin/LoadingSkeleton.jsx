import React from 'react';

const LoadingSkeleton = ({ type = 'table', count = 5 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'table':
        return (
          <div className="border-b border-brand-border/40 py-3.5 px-4 flex justify-between items-center animate-pulse gap-6">
            <div className="h-4 bg-white/10 rounded w-1/4" />
            <div className="h-4 bg-white/10 rounded w-1/6" />
            <div className="h-4 bg-white/10 rounded w-1/5" />
            <div className="h-4 bg-white/10 rounded w-12" />
          </div>
        );
      case 'stats':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-brand-border rounded-2xl p-6 animate-pulse space-y-3">
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="h-8 bg-white/10 rounded w-1/2" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        );
      case 'logs':
        return (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-brand-border rounded-xl p-4 flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 bg-white/10 rounded w-2/3" />
                  <div className="h-3 bg-white/10 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (type === 'stats') return renderSkeleton();

  return (
    <div className="bg-brand-dark/40 border border-brand-border rounded-2xl overflow-hidden divide-y divide-brand-border/40">
      {type === 'table' && (
        <div className="bg-white/5 py-4 px-4 flex justify-between animate-pulse">
          <div className="h-4 bg-white/15 rounded w-1/4" />
          <div className="h-4 bg-white/15 rounded w-1/6" />
          <div className="h-4 bg-white/15 rounded w-1/5" />
          <div className="h-4 bg-white/15 rounded w-12" />
        </div>
      )}
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
