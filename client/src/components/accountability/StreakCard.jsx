import { Flame, Trophy, Award, Calendar, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card.jsx';

const StreakCard = ({ streak }) => {
  const { currentStreak, longestStreak, totalCheckins, consistencyPercentage, missedDays } = streak;

  return (
    <Card accentColor="gold" padding="default" className="relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-gold/10 blur-2xl pointer-events-none" />

      <div className="flex items-center gap-4">
        {/* Flame Badge */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform hover:scale-105 duration-300 ${
          currentStreak > 0
            ? 'bg-brand-gold/10 border-brand-gold/30 text-brand-gold shadow-gold-glow'
            : 'bg-zinc-900 border-brand-border text-zinc-600'
        }`}>
          <Flame size={32} className={currentStreak > 0 ? 'animate-pulse' : ''} />
        </div>

        <div className="space-y-1 text-left">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">
            Current Streak
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-display text-white">
              {currentStreak}
            </span>
            <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
              {currentStreak === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        </div>
      </div>

      {/* Minor Streaks KPIs */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-brand-border/40 text-left">
        <div className="space-y-0.5">
          <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Trophy size={10} className="text-brand-gold" /> Longest Streak
          </span>
          <span className="text-sm font-bold text-white">
            {longestStreak} Days
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Award size={10} className="text-brand-purple-light" /> Total Check-ins
          </span>
          <span className="text-sm font-bold text-white">
            {totalCheckins} times
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Calendar size={10} className="text-blue-400" /> Consistency
          </span>
          <span className="text-sm font-bold text-brand-gold">
            {consistencyPercentage}%
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle size={10} className="text-red-400" /> Missed Days
          </span>
          <span className="text-sm font-bold text-zinc-400">
            {missedDays} Days
          </span>
        </div>
      </div>
    </Card>
  );
};

export default StreakCard;
