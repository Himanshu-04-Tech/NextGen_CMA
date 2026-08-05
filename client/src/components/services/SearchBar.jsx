/**
 * NextGen CMA — Services Search Bar Input
 */

import { Search, X } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full max-w-sm">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
        <Search size={16} />
      </span>

      <input
        type="text"
        value={searchQuery}
        placeholder="Search services by keyword..."
        className="w-full bg-black/40 border border-brand-border rounded-xl pl-10 pr-10 py-3 text-white placeholder:text-zinc-600 outline-none text-xs font-semibold focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all duration-200"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
