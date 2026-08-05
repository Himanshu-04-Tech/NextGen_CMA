/**
 * NextGen CMA — Spinner Component
 * Lightweight inline loading indicator with brand gold color.
 */

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
    xl: 'w-12 h-12 border-4',
  };

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full border-zinc-700 spinner-gold ${sizeMap[size]} ${className}`}
    />
  );
};

export default Spinner;
