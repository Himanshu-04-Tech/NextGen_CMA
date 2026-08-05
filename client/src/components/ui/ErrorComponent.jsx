/**
 * NextGen CMA — Error Component
 * Displays an inline or full-page error message with optional retry action.
 */

import { AlertCircle } from 'lucide-react';
import Button from './Button.jsx';

const ErrorComponent = ({
  message = 'Something went wrong.',
  onRetry,
  fullPage = false,
}) => {
  const content = (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertCircle size={28} className="text-red-400" />
      </div>
      <div>
        <h3 className="text-white font-semibold mb-1">Error</h3>
        <p className="text-zinc-400 text-sm max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};

export default ErrorComponent;
