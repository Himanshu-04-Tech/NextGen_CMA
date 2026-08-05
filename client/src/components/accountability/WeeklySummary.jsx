import { Activity, ArrowUpRight, ArrowDownRight, Award } from 'lucide-react';
import Card from '../ui/Card.jsx';

const WeeklySummary = ({ comparisonData }) => {
  // Extract last 7 days from comparisonData
  const last7Days = comparisonData.slice(-7);

  const totalPlanned = last7Days.reduce((sum, d) => sum + d.plannedHours, 0);
  const totalActual = last7Days.reduce((sum, d) => sum + d.actualHours, 0);
  const difference = totalActual - totalPlanned;
  const percentage = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 100;

  return (
    <Card padding="default" className="text-left relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold">
          <Activity size={16} />
        </div>
        <h3 className="text-base font-bold font-display text-white">
          7-Day Study Summary
        </h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">
              Planned Hours
            </span>
            <span className="text-base font-bold text-zinc-300">
              {totalPlanned} Hours
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">
              Actual Studied
            </span>
            <span className="text-base font-bold text-brand-gold">
              {totalActual} Hours
            </span>
          </div>
        </div>

        {/* Progress Comparison */}
        <div className="space-y-1.5 pt-2 border-t border-brand-border/40">
          <div className="flex justify-between text-[10px] uppercase font-semibold text-zinc-400">
            <span>Syllabus Target Achievement</span>
            <span className="text-brand-gold">{percentage}% Achieved</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-gold h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
        </div>

        {/* Diff badge */}
        <div className="flex items-center gap-2 pt-2 text-xs">
          {difference > 0 ? (
            <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/30 text-green-400 font-bold flex items-center gap-1">
              <ArrowUpRight size={12} /> +{difference}h ahead of plan
            </span>
          ) : difference < 0 ? (
            <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-bold flex items-center gap-1">
              <ArrowDownRight size={12} /> {difference}h behind schedule
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-zinc-800 border border-brand-border text-zinc-400 font-medium">
              Met targets exactly
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WeeklySummary;
