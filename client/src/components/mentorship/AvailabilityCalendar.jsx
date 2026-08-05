import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const DAYS_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AvailabilityCalendar = ({ availabilities = [], onSelectSlot }) => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [generatedSlots, setGeneratedSlots] = useState([]);

  // Generate next 10 days
  useEffect(() => {
    const list = [];
    const today = new Date();
    for (let i = 1; i <= 10; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      list.push(d);
    }
    setDates(list);
    setSelectedDate(list[0]);
  }, []);

  // Generate time slots when selected date changes
  useEffect(() => {
    if (!selectedDate || availabilities.length === 0) {
      setGeneratedSlots([]);
      return;
    }

    const dayOfWeek = selectedDate.getDay();
    const dayAvailabilities = availabilities.filter((a) => a.dayOfWeek === dayOfWeek && a.isAvailable);

    const slots = [];
    dayAvailabilities.forEach((avail) => {
      const [startH, startM] = avail.startTime.split(':').map(Number);
      const [endH, endM] = avail.endTime.split(':').map(Number);
      const slotDuration = avail.slotDuration || 30;

      let currentVal = startH * 60 + startM;
      const endVal = endH * 60 + endM;

      while (currentVal + slotDuration <= endVal) {
        const hh = String(Math.floor(currentVal / 60)).padStart(2, '0');
        const mm = String(currentVal % 60).padStart(2, '0');
        slots.push(`${hh}:${mm}`);
        currentVal += slotDuration;
      }
    });

    setGeneratedSlots(slots);
    setSelectedSlot(null);
  }, [selectedDate, availabilities]);

  const handleSelectSlot = (timeString) => {
    setSelectedSlot(timeString);
    if (selectedDate) {
      const [h, m] = timeString.split(':').map(Number);
      const finalDate = new Date(selectedDate);
      finalDate.setHours(h, m, 0, 0);
      onSelectSlot(finalDate.toISOString());
    }
  };

  const formatDateLabel = (d) => {
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
          <Clock size={16} className="text-brand-purple" />
          Select a Date
        </h4>

        {/* Horizontal Dates list */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800">
          {dates.map((d, i) => {
            const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
            const isAvailableDay = availabilities.some(
              (a) => a.dayOfWeek === d.getDay() && a.isAvailable
            );

            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedDate(d)}
                className={`flex-shrink-0 w-20 py-3 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-brand-purple text-white border-brand-purple shadow-purple-glow'
                    : 'bg-white/5 border-brand-border text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider mb-1">
                  {DAYS_NAME[d.getDay()].substring(0, 3)}
                </span>
                <span className="text-base font-black leading-none">{d.getDate()}</span>
                <span className="text-[9px] mt-1.5 opacity-80">{formatDateLabel(d).split(' ')[0]}</span>
                {isAvailableDay && (
                  <div
                    className={`w-1 h-1 rounded-full mt-1.5 ${
                      isSelected ? 'bg-brand-gold' : 'bg-brand-purple'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Available Time Slots
        </h4>

        {generatedSlots.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500 bg-white/5 border border-brand-border/45 rounded-xl border-dashed">
            No availability schedule set by mentor for this day.
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {generatedSlots.map((slot, idx) => {
              const isSelected = selectedSlot === slot;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSlot(slot)}
                  className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand-gold-dark to-brand-gold text-black border-brand-gold shadow-gold-glow font-bold'
                      : 'bg-white/5 border-brand-border text-zinc-300 hover:text-white hover:bg-white/10 hover:border-zinc-700'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
