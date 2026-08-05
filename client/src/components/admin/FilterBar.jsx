import React from 'react';

const FilterBar = ({ label, options = [], selectedValue, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">{label}:</span>
      <select
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        className="bg-black/40 border border-brand-border rounded-xl px-3 py-2 text-[11px] text-zinc-300 focus:outline-none focus:border-brand-purple"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-brand-dark">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
