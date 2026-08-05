import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Trash2, Calendar, Target, Plus, Minus, ArrowRight, Edit3 } from 'lucide-react';
import Card from '../ui/Card.jsx';

const HabitCard = ({ habit, onLogProgress, onEdit, onDelete }) => {
  const { id, habitName, description, frequency, targetValue, unit, logs } = habit;

  // Find if today has already been logged
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs?.find((l) => l.date.startsWith(todayStr)) || null;

  const isCompleted = todayLog ? todayLog.completed : false;
  const currentProgress = todayLog ? todayLog.completedValue : 0;

  const [inputVal, setInputVal] = useState(currentProgress);

  const handleToggleCompleted = () => {
    const nextCompleted = !isCompleted;
    const nextVal = nextCompleted ? targetValue : 0;
    setInputVal(nextVal);
    onLogProgress(id, {
      completed: nextCompleted,
      completedValue: nextVal,
      date: new Date().toISOString()
    });
  };

  const handleIncrement = () => {
    const nextVal = Math.min(targetValue, inputVal + 1);
    setInputVal(nextVal);
    onLogProgress(id, {
      completed: nextVal >= targetValue,
      completedValue: nextVal,
      date: new Date().toISOString()
    });
  };

  const handleDecrement = () => {
    const nextVal = Math.max(0, inputVal - 1);
    setInputVal(nextVal);
    onLogProgress(id, {
      completed: nextVal >= targetValue,
      completedValue: nextVal,
      date: new Date().toISOString()
    });
  };

  return (
    <Card
      accentColor={isCompleted ? 'gold' : 'none'}
      padding="default"
      className="transition-all hover:scale-101 border border-brand-border bg-brand-card relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Habit Meta */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-brand-purple/10 border border-brand-purple/20 text-[9px] text-brand-purple-light font-bold uppercase tracking-wider font-display">
              {frequency}
            </span>
            <span className="text-zinc-500 text-[10px] font-semibold flex items-center gap-1">
              <Target size={11} className="text-brand-gold" /> Target: {targetValue} {unit}
            </span>
          </div>
          
          <h4 className={`text-base font-bold tracking-wide leading-tight ${isCompleted ? 'line-through text-zinc-500' : 'text-white'}`}>
            {habitName}
          </h4>
          {description && <p className="text-zinc-500 text-xs">{description}</p>}
        </div>

        {/* Action Triggers */}
        <div className="shrink-0 flex items-center gap-3 justify-between sm:justify-end">
          {/* Quick Counter (Only for non-boolean metrics) */}
          {targetValue > 1 && (
            <div className="flex items-center bg-black/40 border border-brand-border rounded-lg p-0.5 shrink-0">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={isCompleted}
                className="p-1 rounded text-zinc-500 hover:text-white transition-all disabled:opacity-30"
              >
                <Minus size={12} />
              </button>
              <span className="text-xs font-bold text-white px-2 w-8 text-center select-none">
                {inputVal}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={isCompleted}
                className="p-1 rounded text-zinc-500 hover:text-white transition-all disabled:opacity-30"
              >
                <Plus size={12} />
              </button>
            </div>
          )}

          {/* Completion Checkmark Toggle */}
          <button
            type="button"
            onClick={handleToggleCompleted}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
              isCompleted
                ? 'border-green-500 bg-green-500 text-black shadow-lg shadow-green-500/20'
                : 'border-zinc-700 hover:border-zinc-500 bg-transparent text-zinc-500 hover:text-zinc-200'
            }`}
            title={isCompleted ? 'Mark Stale' : 'Mark Completed'}
          >
            <Check size={18} strokeWidth={isCompleted ? 3 : 2} />
          </button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-4 pt-3 border-t border-brand-border/40 flex justify-between items-center text-xs">
        <Link
          to={`/accountability/habits/${id}`}
          className="text-brand-gold hover:underline inline-flex items-center gap-1 font-medium"
        >
          View Log History <ArrowRight size={12} />
        </Link>
        
        <div className="flex items-center gap-3">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(habit)}
              className="text-zinc-400 hover:text-white transition-all flex items-center gap-1 text-[11px]"
              title="Edit Habit"
            >
              <Edit3 size={12} /> Edit
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="text-red-400 hover:text-red-500 transition-all flex items-center gap-1 text-[11px]"
            title="Delete Habit"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </Card>
  );
};

export default HabitCard;
