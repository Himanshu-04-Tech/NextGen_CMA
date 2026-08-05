import { Link } from 'react-router-dom';
import { CalendarRange, Sparkles } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';

const EmptyState = () => {
  return (
    <div className="max-w-xl mx-auto text-center py-12 animate-fade-in">
      <Card accentColor="gold" padding="default">
        <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mx-auto mb-6 text-brand-gold shadow-gold-glow">
          <CalendarRange size={32} />
        </div>
        
        <h2 className="text-2xl font-bold font-display text-white mb-3">
          Build Your Personalized Study Plan
        </h2>
        
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          Unlock your custom learning roadmap. Align your CMA Level, select subjects, set your exam date, and allocate daily study hours. We'll automatically schedule your daily goals and mock revision cycles.
        </p>

        <Link to="/study-planner/create">
          <Button variant="gold" size="lg" className="w-full sm:w-auto px-8">
            <Sparkles size={16} /> Get Started Now
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default EmptyState;
