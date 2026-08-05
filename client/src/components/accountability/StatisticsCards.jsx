import { Clock, Smile, Zap, Award } from 'lucide-react';
import Card from '../ui/Card.jsx';

const StatisticsCards = ({ overallStats }) => {
  const { totalStudiedHours, averageMood, averageEnergy } = overallStats;

  const moodEmojis = ['😢', '😕', '😐', '🙂', '🤩'];
  const energyEmojis = ['😴', '🥱', '⚡', '🔥', '💪'];

  const getEmoji = (rating, array) => {
    const idx = Math.max(0, Math.min(array.length - 1, Math.round(rating) - 1));
    return array[idx] || '';
  };

  const statCards = [
    {
      title: 'Total Study Time',
      value: `${totalStudiedHours} Hours`,
      subtitle: 'Recorded studied duration',
      icon: <Clock size={18} className="text-brand-gold" />,
      accent: 'gold'
    },
    {
      title: 'Average Mood Rate',
      value: `${averageMood} / 5`,
      subtitle: `Primarily: ${getEmoji(averageMood, moodEmojis)}`,
      icon: <Smile size={18} className="text-brand-purple-light" />,
      accent: 'purple'
    },
    {
      title: 'Average Energy Level',
      value: `${averageEnergy} / 5`,
      subtitle: `Feelings: ${getEmoji(averageEnergy, energyEmojis)}`,
      icon: <Zap size={18} className="text-blue-400" />,
      accent: 'none'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in">
      {statCards.map((card, idx) => (
        <Card key={idx} accentColor={card.accent} padding="default" className="relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-2 text-left">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                {card.title}
              </span>
              <h3 className="text-2xl font-black text-white font-display">
                {card.value}
              </h3>
              <p className="text-[10px] text-zinc-400 font-medium">
                {card.subtitle}
              </p>
            </div>

            <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-brand-border flex items-center justify-center shrink-0">
              {card.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatisticsCards;
