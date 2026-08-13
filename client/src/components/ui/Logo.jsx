/**
 * NextGen CMA — Brand Logo Component
 * Renders the official NextGen CMA gold logo badge with optional branding text.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../images/logo.jpeg';

const Logo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showText = true,
  subtext = null,
  textPrefix = 'NextGen',
  textSuffix = 'CMA',
  to = null,
  className = '',
}) => {
  // Dynamic size mappings for logo badge image
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  }[size] || 'w-9 h-9';

  // Dynamic text font sizes
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-base sm:text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
  }[size] || 'text-lg';

  const content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <img
        src={logoImg}
        alt="NextGen CMA Logo"
        className={`${sizeClasses} rounded-full object-cover shadow-gold-glow border border-brand-gold/40 group-hover:scale-105 transition-transform duration-300 shrink-0`}
      />
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`text-white font-bold font-display ${textSizeClasses} tracking-tight`}>
            {textPrefix} <span className="text-brand-gold">{textSuffix}</span>
          </span>
          {subtext && (
            <span className="text-zinc-500 text-[10px] tracking-widest uppercase mt-0.5 font-medium">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
