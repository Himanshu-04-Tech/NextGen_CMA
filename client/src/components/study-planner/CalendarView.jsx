import { useState } from 'react';
import { ChevronLeft, ChevronRight, Bookmark, AlertCircle, Sparkles } from 'lucide-react';
import Card from '../ui/Card.jsx';

const CalendarView = ({ calendarEntries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState(null);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedEntry(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedEntry(null);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // Array of blank slots before day 1
  const blanks = Array(firstDayIndex).fill(null);
  // Days of the month
  const days = Array.from({ length: daysInMonth }, (_, idx) => idx + 1);
  const calendarSlots = [...blanks, ...days];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Map calendar entries to dates
  const entriesByDateMap = {};
  calendarEntries.forEach((entry) => {
    const d = new Date(entry.date);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!entriesByDateMap[key]) {
      entriesByDateMap[key] = [];
    }
    entriesByDateMap[key].push(entry);
  });

  return (
    <div className="space-y-6">
      {/* Calendar Shell */}
      <Card accentColor="purple" padding="default">
        {/* Header navigation */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold font-display text-white">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg border border-brand-border hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg border border-brand-border hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider mb-6 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-brand-purple-dark border border-brand-purple" />
            <span className="text-zinc-400">Revision Round 1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-brand-gold/20 border border-brand-gold/60" />
            <span className="text-zinc-400">Revision Round 2</span>
          </div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Day Headers */}
          {dayOfWeekNames.map((day) => (
            <div key={day} className="text-center text-[10px] sm:text-xs font-bold text-zinc-600 uppercase tracking-widest py-1">
              {day}
            </div>
          ))}

          {/* Slots */}
          {calendarSlots.map((day, idx) => {
            if (day === null) {
              return <div key={`blank-${idx}`} className="aspect-square bg-transparent" />;
            }

            const slotKey = `${year}-${month}-${day}`;
            const entries = entriesByDateMap[slotKey] || [];
            
            // Check if this date has any round 1 or round 2 revision
            const hasRound1 = entries.some(e => e.revisionRound === 1);
            const hasRound2 = entries.some(e => e.revisionRound === 2);

            let bgClass = 'bg-black/10 border-brand-border/40 hover:border-zinc-700';
            if (hasRound1) {
              bgClass = 'bg-brand-purple-dark/40 border-brand-purple text-brand-purple-light hover:brightness-110';
            } else if (hasRound2) {
              bgClass = 'bg-brand-gold/10 border-brand-gold/40 text-brand-gold hover:brightness-110 shadow-gold-glow';
            }

            const isSelected = selectedEntry && new Date(selectedEntry.date).getDate() === day && new Date(selectedEntry.date).getMonth() === month;

            return (
              <button
                key={`day-${day}`}
                type="button"
                onClick={() => entries.length > 0 && setSelectedEntry(entries[0])}
                disabled={entries.length === 0}
                className={`aspect-square rounded-lg border text-xs sm:text-sm font-bold flex flex-col items-center justify-between p-1.5 transition-all relative group select-none ${bgClass} ${
                  isSelected ? 'ring-2 ring-brand-gold scale-102 z-10' : ''
                } ${entries.length === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span>{day}</span>
                {entries.length > 0 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Selected Day details banner */}
      {selectedEntry ? (
        <Card accentColor="gold" padding="default" className="animate-slide-up">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl border flex items-center justify-center shrink-0 ${
              selectedEntry.revisionRound === 2 
                ? 'bg-brand-gold/10 border-brand-gold/20 text-brand-gold'
                : 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple-light'
            }`}>
              {selectedEntry.revisionRound === 2 ? <Sparkles size={20} /> : <Bookmark size={20} />}
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block">
                Scheduled Round {selectedEntry.revisionRound} Revision — {new Date(selectedEntry.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </span>
              <h4 className="text-white text-base font-bold leading-snug">
                {selectedEntry.topic}
              </h4>
              <p className="text-xs text-zinc-400">
                Allocate sufficient study time for standard sample mocks or notes for this subject chapter.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="p-5 border border-dashed border-brand-border rounded-xl bg-black/10 text-center text-xs text-zinc-500 font-medium flex items-center justify-center gap-2">
          <AlertCircle size={14} /> Click any highlighted revision date on the calendar to view target tasks.
        </div>
      )}
    </div>
  );
};

export default CalendarView;
