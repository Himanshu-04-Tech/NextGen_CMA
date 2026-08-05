import React from 'react';
import { HelpCircle } from 'lucide-react';

const EmptyState = ({ message = 'No data available at the moment.' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-800/10 border border-brand-border/40 rounded-2xl">
      <div className="w-12 h-12 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple/60 mb-4 animate-pulse">
        <HelpCircle size={24} />
      </div>
      <p className="text-zinc-400 font-sans text-sm tracking-wide max-w-xs leading-relaxed">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
