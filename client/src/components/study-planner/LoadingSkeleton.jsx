const LoadingSkeleton = ({ type = 'dashboard' }) => {
  if (type === 'calendar') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-zinc-800 rounded-lg w-1/3" />
        <div className="glass-card p-6">
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, idx) => (
              <div key={idx} className="h-20 bg-zinc-800/60 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'wizard') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-zinc-800 rounded-lg w-1/4 mx-auto" />
        <div className="glass-card p-8 h-80 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="h-6 bg-zinc-800 rounded-md w-3/4" />
            <div className="h-4 bg-zinc-800 rounded-md w-1/2" />
          </div>
          <div className="h-12 bg-zinc-800 rounded-lg w-full" />
        </div>
      </div>
    );
  }

  // Default: dashboard skeleton
  return (
    <div className="space-y-8 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="h-32 bg-zinc-800/80 rounded-3xl" />

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="h-24 bg-zinc-800/60 rounded-xl" />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-10 bg-zinc-800 rounded-lg w-1/4" />
          <div className="h-48 bg-zinc-800/60 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <div className="h-10 bg-zinc-800 rounded-lg w-1/3" />
          <div className="h-72 bg-zinc-800/60 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
