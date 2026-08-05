import Card from '../ui/Card.jsx';

const CalendarHeatmap = ({ heatmapData }) => {
  // Generate last 90 days list
  const daysList = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    d.setUTCHours(0, 0, 0, 0);

    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dateNum = String(d.getUTCDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${dateNum}`;

    const match = heatmapData.find((h) => h.date === dateKey);

    daysList.push({
      date: dateKey,
      label: d.toLocaleDateString(undefined, { dateStyle: 'medium' }),
      hours: match ? match.value : 0,
      mood: match ? match.mood : 0,
      energy: match ? match.energy : 0
    });
  }

  // Get color intensity based on hours
  const getColorClass = (hours) => {
    if (hours === 0) return 'bg-zinc-900 border-zinc-800/40 hover:border-zinc-700';
    if (hours < 3) return 'bg-brand-gold/20 border-brand-gold/30 hover:brightness-110';
    if (hours < 6) return 'bg-brand-gold/50 border-brand-gold/60 hover:brightness-110 shadow-gold-glow/10';
    return 'bg-brand-gold border-brand-gold-light text-black hover:scale-105 shadow-gold-glow';
  };

  return (
    <Card padding="default" accentColor="gold" className="text-left">
      <h3 className="text-base font-bold font-display text-white mb-2">
        90-Day Consistency Grid
      </h3>
      <p className="text-zinc-500 text-xs mb-6">
        Intensity reflects check-in hours studied (Gold represents higher hours).
      </p>

      {/* Grid container */}
      <div className="flex flex-wrap gap-1.5 justify-start select-none py-2">
        {daysList.map((day, idx) => {
          const colorClass = getColorClass(day.hours);

          return (
            <div
              key={idx}
              className={`w-4.5 h-4.5 aspect-square rounded border transition-all duration-200 cursor-pointer relative group ${colorClass}`}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-zinc-950 border border-brand-border rounded-lg p-2 text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-2xl leading-relaxed">
                <span className="font-bold text-white block mb-0.5">{day.label}</span>
                <span>Hours Studied: <strong className="text-brand-gold">{day.hours}h</strong></span>
                {day.mood > 0 && <span className="block text-zinc-400">Mood: {day.mood}/5 | Energy: {day.energy}/5</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid labels legend */}
      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-4">
        <span>90 Days Ago</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-3.5 h-3.5 rounded bg-zinc-900 border border-zinc-800" />
          <div className="w-3.5 h-3.5 rounded bg-brand-gold/20 border border-brand-gold/30" />
          <div className="w-3.5 h-3.5 rounded bg-brand-gold/50 border border-brand-gold/60" />
          <div className="w-3.5 h-3.5 rounded bg-brand-gold border border-brand-gold-light" />
          <span>More</span>
        </div>
        <span>Today</span>
      </div>
    </Card>
  );
};

export default CalendarHeatmap;
