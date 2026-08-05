import React from 'react';
import { Sparkles } from 'lucide-react';

const EmptyState = ({ title = 'No items found', message = 'Create a new record or try checking other tabs.', icon: Icon = Sparkles }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white/5 border border-brand-border rounded-2xl max-w-lg mx-auto">
      <div className="p-4 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-gold mb-4 shadow-purple-glow">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-bold text-white mb-1 font-display">
        {title}
      </h3>
      <p className="text-sm text-zinc-400">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
