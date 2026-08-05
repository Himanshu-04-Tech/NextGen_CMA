/**
 * NextGen CMA — Auth Layout
 * Shared centered layout for all authentication pages.
 * Features ambient background glows and the brand logo.
 */

import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle, showLogo = true }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* ── Ambient Background Glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-purple/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-purple/[0.03] blur-3xl" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        {showLogo && (
          <Link
            to="/"
            className="flex flex-col items-center gap-3 mb-8 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-dark via-brand-gold to-brand-gold-dark flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
              <span className="text-black font-black text-2xl font-display">N</span>
            </div>
            <div className="text-center">
              <span className="text-white font-bold font-display text-xl tracking-tight">
                NextGen <span className="text-brand-gold">CMA</span>
              </span>
              <p className="text-zinc-500 text-xs mt-0.5 tracking-widest uppercase">
                Premium EdTech Platform
              </p>
            </div>
          </Link>
        )}

        {/* Card */}
        <div className="glass-card">
          {/* Header */}
          {(title || subtitle) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-2xl font-bold font-display text-white leading-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
