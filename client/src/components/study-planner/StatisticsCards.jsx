import { Award, BookOpen, Clock, Calendar } from 'lucide-react';
import Card from '../ui/Card.jsx';

const StatisticsCards = ({ stats }) => {
  const { progressPercentage, completedTopics, totalTopics, remainingDays, todaysTargets } = stats;

  const cardsData = [
    {
      title: 'Overall Progress',
      value: `${progressPercentage}%`,
      subtitle: 'Based on daily targets',
      icon: <Award size={20} className="text-brand-gold" />,
      accent: 'gold'
    },
    {
      title: 'Topics Covered',
      value: `${completedTopics} / ${totalTopics}`,
      subtitle: 'Syllabus chapter progress',
      icon: <BookOpen size={20} className="text-brand-purple-light" />,
      accent: 'purple'
    },
    {
      title: "Today's Targets",
      value: todaysTargets?.length || 0,
      subtitle: 'Scheduled goals for today',
      icon: <Clock size={20} className="text-blue-400" />,
      accent: 'none'
    },
    {
      title: 'Days Remaining',
      value: remainingDays,
      subtitle: 'Days left until exam date',
      icon: <Calendar size={20} className="text-red-400" />,
      accent: 'none'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {cardsData.map((card, idx) => (
        <Card key={idx} accentColor={card.accent} padding="default" className="relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                {card.title}
              </span>
              <h3 className="text-2xl font-extrabold text-white font-display">
                {card.value}
              </h3>
              <p className="text-[10px] text-zinc-400 font-medium">
                {card.subtitle}
              </p>
            </div>
            
            <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-brand-border flex items-center justify-center shrink-0">
              {card.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatisticsCards;
