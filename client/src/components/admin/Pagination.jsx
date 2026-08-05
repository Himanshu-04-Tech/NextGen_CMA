import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page = 1, pages = 1, onPageChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-brand-border/40 text-xs text-zinc-400">
      <div>
        Showing page <strong className="text-zinc-200">{page}</strong> of <strong className="text-zinc-200">{pages}</strong>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg border border-brand-border bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-all"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-1.5 rounded-lg border border-brand-border bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
