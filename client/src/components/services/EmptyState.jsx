/**
 * NextGen CMA — Services Empty State View
 */

import { SearchX } from 'lucide-react';
import Button from '../ui/Button.jsx';

const EmptyState = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-brand-border bg-brand-card/50 rounded-2xl max-w-md mx-auto">
      <div className="w-14 h-14 rounded-full bg-zinc-900 border border-brand-border flex items-center justify-center text-zinc-500 mb-5">
        <SearchX size={24} />
      </div>
      
      <h3 className="text-white font-bold text-base mb-1.5">No Services Found</h3>
      
      <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed mb-6">
        No active service offerings matched your query parameters. Adjust your keyword search term or categories filters.
      </p>

      {onReset && (
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset Query Filters
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
