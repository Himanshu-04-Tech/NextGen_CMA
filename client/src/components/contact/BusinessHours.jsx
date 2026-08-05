import React from 'react';
import { Clock } from 'lucide-react';

const BusinessHours = ({ hours }) => {
  if (!hours || !Array.isArray(hours)) return null;

  return (
    <div className="p-6 rounded-2xl bg-zinc-800/10 border border-brand-border/40 text-left">
      <h3 className="text-sm font-bold font-display text-white mb-4 flex items-center gap-2">
        <Clock size={16} className="text-brand-gold" /> Business Hours
      </h3>
      <div className="space-y-3">
        {hours.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-xs pb-2 border-b border-brand-border/20 last:border-0 last:pb-0"
          >
            <span className="font-semibold text-zinc-400">{item.dayRange}</span>
            <span className="text-white font-medium">{item.timeRange}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessHours;
