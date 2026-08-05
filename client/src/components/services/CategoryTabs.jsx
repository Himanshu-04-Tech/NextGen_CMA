/**
 * NextGen CMA — Services Category Tabs Selector
 *
 * Filter tabs supporting: All, Study Planning, Accountability, Mentorship, Exam Support.
 */

const CategoryTabs = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { label: 'All Services', value: 'ALL' },
    { label: 'Study Planning', value: 'Study Planning' },
    { label: 'Accountability', value: 'Accountability' },
  ];

  return (
    <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-none border-b border-brand-border/40">
      {categories.map((cat, idx) => {
        const isActive = activeCategory === cat.value;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveCategory(cat.value)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              isActive
                ? 'bg-brand-gold/10 border border-brand-gold/40 text-brand-gold shadow-gold-glow'
                : 'border border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
