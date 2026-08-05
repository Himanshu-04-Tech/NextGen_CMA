/**
 * NextGen CMA — Button Component
 * Premium animated button with variant support.
 */

import Spinner from './Spinner.jsx';

/**
 * @param {'gold'|'purple'|'outline'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 */
const Button = ({
  children,
  variant = 'gold',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  leftIcon,
  rightIcon,
  onClick,
  ...rest
}) => {
  const base =
    'relative overflow-hidden font-semibold rounded-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const variants = {
    gold: 'bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-dark text-black shadow-gold-glow hover:shadow-lg hover:shadow-brand-gold/20 hover:brightness-110 focus-visible:ring-brand-gold',
    purple: 'bg-gradient-to-r from-brand-purple-dark via-brand-purple to-brand-purple-dark text-white shadow-purple-glow hover:shadow-lg hover:shadow-brand-purple/20 hover:brightness-110 focus-visible:ring-brand-purple',
    outline: 'border border-brand-border hover:border-brand-gold hover:text-brand-gold bg-brand-card/50 text-white focus-visible:ring-brand-gold',
    ghost: 'text-zinc-400 hover:text-white hover:bg-white/5 focus-visible:ring-zinc-500',
    danger: 'bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white hover:brightness-110 focus-visible:ring-red-500',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {/* Shimmer overlay on gold */}
      {variant === 'gold' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      )}

      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
