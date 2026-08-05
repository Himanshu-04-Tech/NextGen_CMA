const LoadingSkeleton = ({ type = 'dashboard' }) => {
  if (type === 'form') {
    return (
      <div className="max-w-lg mx-auto space-y-6 animate-pulse">
        <div className="h-6 bg-zinc-800 rounded-lg w-1/4" />
        <div className="glass-card p-6 space-y-4">
          <div className="h-10 bg-zinc-800 rounded-lg w-full" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-zinc-800 rounded-lg" />
            <div className="h-10 bg-zinc-800 rounded-lg" />
          </div>
          <div className="h-24 bg-zinc-800 rounded-lg w-full" />
          <div className="h-12 bg-zinc-800 rounded-lg w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Banner */}
      <div className="h-28 bg-zinc-800/80 rounded-3xl" />

      {/* Streak and stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="h-24 bg-zinc-800/60 rounded-xl" />
        ))}
      </div>

      {/* Habits & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-10 bg-zinc-800 rounded-lg w-1/4" />
          <div className="space-y-2">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-16 bg-zinc-800/40 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="h-72 bg-zinc-800/60 rounded-xl" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
