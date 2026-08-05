import { TrendingUp } from 'lucide-react';
import Card from '../ui/Card.jsx';

const ProgressChart = ({ comparisonData }) => {
  // Find max hours to scale chart
  const maxHours = Math.max(
    10,
    ...comparisonData.map((d) => Math.max(d.plannedHours, d.actualHours))
  );

  return (
    <Card accentColor="purple" padding="default" className="text-left overflow-visible">
      <div className="flex justify-between items-start gap-4 mb-6 flex-wrap">
        <div>
          <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-gold" /> Study Velocity Trend
          </h3>
          <p className="text-zinc-500 text-xs mt-0.5">
            Planned study vs actual check-in hours over the last 30 days
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-zinc-700" />
            <span className="text-zinc-400">Planned Hours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-brand-gold" />
            <span className="text-brand-gold">Actual Hours</span>
          </div>
        </div>
      </div>

      {/* Chart visualization */}
      <div className="w-full overflow-x-auto pb-4 pt-4 scroll-smooth select-none">
        <div className="min-w-[700px] h-72 flex items-end justify-between gap-3 px-4 relative border-b border-brand-border">
          {comparisonData.map((day, idx) => {
            // Scale bar height to max 75% so there is always top headroom for tooltips without clipping
            const plannedHeight = (day.plannedHours / maxHours) * 75;
            const actualHeight = (day.actualHours / maxHours) * 75;

            const isLastItems = idx >= comparisonData.length - 4;
            const isFirstItems = idx <= 3;

            let tooltipAlignClass = 'left-1/2 -translate-x-1/2';
            if (isLastItems) tooltipAlignClass = 'right-0 translate-x-0';
            if (isFirstItems) tooltipAlignClass = 'left-0 translate-x-0';

            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* Tooltip on hover - Anchored at top-0 inside chart container */}
                <div
                  className={`absolute top-0 bg-zinc-950/95 border border-brand-gold/50 backdrop-blur-md rounded-xl p-3 text-xs text-zinc-300 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-30 whitespace-nowrap shadow-2xl leading-relaxed ${tooltipAlignClass}`}
                >
                  <span className="font-bold text-white block mb-1.5 border-b border-zinc-800 pb-1 font-display">{day.date}</span>
                  <div className="space-y-1 text-[11px] min-w-[110px]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-zinc-400">Planned:</span>
                      <strong className="text-zinc-200 font-semibold">{day.plannedHours}h</strong>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-zinc-400">Actual:</span>
                      <strong className="text-brand-gold font-bold">{day.actualHours}h</strong>
                    </div>
                    {day.difference !== 0 && (
                      <div className={`flex items-center justify-between gap-3 font-bold mt-1.5 pt-1 border-t border-zinc-800/80 ${day.difference > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <span>Diff:</span>
                        <span>{day.difference > 0 ? `+${day.difference}` : day.difference}h</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bars stack container */}
                <div className="flex items-end gap-1.5 w-full h-full justify-center pb-1">
                  {/* Planned Hours Bar */}
                  <div
                    className="w-2.5 sm:w-3.5 bg-zinc-800/90 rounded-t transition-all duration-300 ease-out group-hover:bg-zinc-700"
                    style={{ height: `${Math.max(3, plannedHeight)}%` }}
                  />

                  {/* Actual Hours Bar */}
                  <div
                    className="w-2.5 sm:w-3.5 bg-gradient-to-t from-brand-gold-dark to-brand-gold rounded-t transition-all duration-300 ease-out shadow-gold-glow group-hover:brightness-125"
                    style={{ height: `${Math.max(3, actualHeight)}%` }}
                  />
                </div>

                {/* X Axis Label */}
                <span className="text-[10px] text-zinc-500 font-bold tracking-wider mt-3 block truncate max-w-[50px]">
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default ProgressChart;
