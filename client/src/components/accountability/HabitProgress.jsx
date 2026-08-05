const HabitProgress = ({ completed = 0, total = 0, size = 120 }) => {
  const percentage = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  
  // SVG parameter properties
  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center space-y-3 p-4 animate-fade-in">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Progress SVG */}
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-zinc-800 fill-transparent"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle with gradients */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-brand-gold fill-transparent transition-all duration-500 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>

        {/* Inner percentage text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold text-white font-display leading-none">
            {completed}/{total}
          </span>
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-1">
            Habits
          </span>
        </div>
      </div>

      <div className="text-center">
        <span className="text-xs font-semibold text-brand-gold font-display uppercase tracking-widest block">
          {percentage}% Complete
        </span>
        <span className="text-[10px] text-zinc-500 font-medium">
          Based on today's logs
        </span>
      </div>
    </div>
  );
};

export default HabitProgress;
