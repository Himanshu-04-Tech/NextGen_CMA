import { Check, Calendar } from 'lucide-react';

const WeeklyTargets = ({ targets, onUpdateStatus }) => {
  const formatWeekDate = (dateString) => {
    const d = new Date(dateString);
    const start = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const endD = new Date(d);
    endD.setDate(d.getDate() + 6);
    const end = endD.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    return `${start} - ${end}`;
  };

  const getWeekNumber = (dateString) => {
    const d = new Date(dateString);
    const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
    const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <div className="space-y-4">
      {targets.length > 0 ? (
        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 animate-fade-in">
          {targets.map((target) => {
            const isCompleted = target.status === 'COMPLETED';
            return (
              <div
                key={target.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all duration-200 ${
                  isCompleted
                    ? 'border-green-500/20 bg-green-500/5 text-green-300'
                    : 'border-brand-border bg-black/20 text-zinc-300'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={12} className="text-brand-gold" />
                    Week {getWeekNumber(target.weekStart)} ({formatWeekDate(target.weekStart)})
                  </span>
                  <p className={`text-sm font-medium leading-relaxed ${isCompleted ? 'line-through text-zinc-500' : 'text-white'}`}>
                    {target.goalDescription}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateStatus(target.id, { status: isCompleted ? 'PENDING' : 'COMPLETED' })
                  }
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'border-green-500 bg-green-500 text-black shadow-lg shadow-green-500/20'
                      : 'border-zinc-700 hover:border-zinc-500 bg-transparent'
                  }`}
                  title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                >
                  <Check size={14} strokeWidth={isCompleted ? 3 : 2} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-brand-border rounded-xl">
          <p className="text-xs text-zinc-500 font-medium">No weekly goals set.</p>
        </div>
      )}
    </div>
  );
};

export default WeeklyTargets;
