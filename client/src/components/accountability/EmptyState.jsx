import { Sparkles, CalendarDays } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';

const EmptyState = ({ type = 'habits', onAction }) => {
  return (
    <div className="max-w-md mx-auto text-center py-8 animate-fade-in">
      <Card accentColor="gold" padding="default">
        <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mx-auto mb-4 text-brand-gold shadow-gold-glow animate-pulse">
          <CalendarDays size={24} />
        </div>

        <h3 className="text-lg font-bold font-display text-white mb-2">
          {type === 'habits' ? 'No Habits Tracked Yet' : 'No Check-ins Submitted'}
        </h3>
        
        <p className="text-zinc-400 text-xs mb-6 leading-relaxed">
          {type === 'habits'
            ? "Create daily routines like 'Solve 10 MCQs' or 'Exercise' to build consistency."
            : "Submit a daily check-in to track study hours, mood, and maintain your streak."}
        </p>

        {onAction && (
          <Button variant="gold" size="sm" onClick={onAction}>
            <Sparkles size={14} /> {type === 'habits' ? 'Create New Habit' : 'Submit First Check-in'}
          </Button>
        )}
      </Card>
    </div>
  );
};

export default EmptyState;
