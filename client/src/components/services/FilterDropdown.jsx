/**
 * NextGen CMA — Services Sort Filter Dropdown
 */

import { SlidersHorizontal } from 'lucide-react';

const FilterDropdown = ({ sortBy, setSortBy }) => {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold hidden sm:inline flex items-center gap-1">
        <SlidersHorizontal size={12} /> Sort By
      </span>

      <select
        value={sortBy}
        className="bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:border-brand-gold outline-none text-xs font-semibold select-none cursor-pointer"
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="displayOrder" className="bg-brand-card">
          Recommended
        </option>
        <option value="titleAsc" className="bg-brand-card">
          Alphabetical: A-Z
        </option>
        <option value="titleDesc" className="bg-brand-card">
          Alphabetical: Z-A
        </option>
        <option value="newest" className="bg-brand-card">
          Newly Added
        </option>
      </select>
    </div>
  );
};

export default FilterDropdown;
