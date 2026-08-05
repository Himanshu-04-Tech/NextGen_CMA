import React from 'react';
import { Layers } from 'lucide-react';

const EmptyState = ({ title = 'No results found', message = 'Try expanding your filters or search keywords.', icon: Icon = Layers }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-brand-dark/20 border border-brand-border rounded-2xl">
      <div className="p-3.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-gold mb-3.5 shadow-purple-glow">
        <Icon size={28} />
      </div>
      <h4 className="text-sm font-bold text-white mb-1 font-display">
        {title}
      </h4>
      <p className="text-xs text-zinc-400 max-w-sm">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
