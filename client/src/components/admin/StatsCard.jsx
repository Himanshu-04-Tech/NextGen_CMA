import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, description, trend }) => {
  const isPositive = trend >= 0;

  return (
    <div className="bg-brand-dark/40 backdrop-blur-md border border-brand-border rounded-2xl p-5 hover:border-brand-purple/20 transition-all duration-300 relative overflow-hidden group">
      {/* Icon decoration */}
      <div className="absolute right-4 top-4 p-2.5 rounded-xl bg-white/5 border border-brand-border text-brand-gold group-hover:text-white group-hover:bg-brand-purple/20 group-hover:border-brand-purple/40 transition-all duration-300">
        <Icon size={18} />
      </div>

      <div className="space-y-2">
        <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
          {title}
        </span>
        <h3 className="text-2xl font-black text-white font-display tracking-tight leading-none">
          {value}
        </h3>
        
        <div className="flex items-center gap-2 pt-1">
          {trend !== undefined && (
            <div className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            }`}>
              {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              <span>{Math.abs(trend)}% MoM</span>
            </div>
          )}
          <span className="text-[10px] text-zinc-400 truncate">
            {description}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
