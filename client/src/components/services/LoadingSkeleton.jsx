/**
 * NextGen CMA — Services Grid Loading Skeletons
 *
 * Breath animate placeholders simulating cards.
 */

import Card from '../ui/Card.jsx';

const LoadingSkeleton = () => {
  const cards = Array(4).fill(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((_, idx) => (
        <Card key={idx} hover={false} padding="none" className="flex flex-col h-full border border-brand-border/40 rounded-2xl overflow-hidden animate-pulse">
          {/* Simulated Image */}
          <div className="aspect-[16/10] w-full bg-zinc-800/80 relative" />

          {/* Body */}
          <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3.5">
              {/* Title */}
              <div className="h-5 w-2/3 bg-zinc-800 rounded-lg" />
              {/* Descriptions */}
              <div className="space-y-2">
                <div className="h-3 w-full bg-zinc-850 rounded" />
                <div className="h-3 w-5/6 bg-zinc-855 rounded" />
                <div className="h-3 w-4/5 bg-zinc-850 rounded" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4 pt-2">
              <div className="h-9 flex-1 bg-zinc-800 rounded-lg" />
              <div className="h-9 flex-1 bg-zinc-800 rounded-lg" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
