const ProgressBar = ({ value = 0, size = 'md', showLabel = true, animate = true }) => {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  const heightMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5 text-xs text-zinc-400 font-semibold tracking-wider uppercase font-display">
        {showLabel && <span>Completion Rate</span>}
        {showLabel && <span className="text-brand-gold">{clampedValue}%</span>}
      </div>

      <div className={`w-full bg-zinc-800 border border-brand-border rounded-full overflow-hidden ${heightMap[size]}`}>
        <div
          className={`h-full bg-gradient-to-r from-brand-purple via-brand-gold to-brand-gold rounded-full transition-all duration-700 ease-out ${
            animate ? 'animate-pulse' : ''
          }`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
