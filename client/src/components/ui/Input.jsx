/**
 * NextGen CMA — Input Component
 * Reusable form input with label, error, and icon support.
 */

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  leftIcon,
  rightIcon,
  className = '',
  hint,
  ...rest
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          type={inputType}
          placeholder={placeholder}
          autoComplete={isPassword ? 'current-password' : undefined}
          className={`form-input ${leftIcon ? 'pl-10' : ''} ${(rightIcon || isPassword) ? 'pr-10' : ''} ${
            error ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : ''
          } ${className}`}
          {...rest}
        />

        {/* Right icon or password toggle */}
        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-brand-gold transition-colors duration-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : rightIcon ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
            {rightIcon}
          </span>
        ) : null}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}

      {/* Hint text */}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
