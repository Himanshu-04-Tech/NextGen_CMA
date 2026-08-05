/**
 * NextGen CMA — Card Component
 * Glassmorphic surface card with optional gold accent border.
 */

const Card = ({
  children,
  className = '',
  accentColor = 'none', // 'gold' | 'purple' | 'none'
  hover = true,
  padding = 'default',
}) => {
  const paddingMap = {
    none: '',
    sm: 'p-4',
    default: 'p-6 md:p-8',
    lg: 'p-8 md:p-12',
  };

  const accentMap = {
    none: '',
    gold: 'border-brand-gold/30',
    purple: 'border-brand-purple/30',
  };

  return (
    <div
      className={`glass-card ${paddingMap[padding]} ${accentMap[accentColor]} ${
        hover ? 'hover:border-zinc-700/60' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
