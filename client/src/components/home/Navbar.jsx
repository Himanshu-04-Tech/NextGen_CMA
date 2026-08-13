/**
 * NextGen CMA — Landing Navbar
 *
 * Responsive sticky navigation header with mobile hamburger menus and auth buttons.
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Shield, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

import logoImg from '../../images/logo.jpeg';

const Navbar = ({ data }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleGoToDashboard = () => {
    sessionStorage.removeItem('viewing_website');
    setIsOpen(false);
  };

  // Default menu links
  const defaultLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  // Parse custom links from DB if available and filter out removed sections
  const logoText = data?.title || 'NextGen';
  const rawLinks = data?.body ? JSON.parse(data.body) : defaultLinks;
  const menuLinks = rawLinks.filter(
    (link) =>
      link.label?.toLowerCase() !== 'pricing' &&
      link.href !== '#pricing' &&
      link.label?.toLowerCase() !== 'testimonials' &&
      link.href !== '#testimonials' &&
      link.label?.toLowerCase() !== 'gallery' &&
      link.href !== '#gallery'
  );

  const getNavHref = (href) => {
    if (location.pathname !== '/') {
      return href.startsWith('#') ? `/${href}` : href;
    }
    return href;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logoImg}
            alt="NextGen CMA Logo"
            className="w-10 h-10 rounded-full object-cover shadow-gold-glow group-hover:scale-105 transition-transform duration-300 border border-brand-gold/40"
          />
          <span className="text-white font-bold font-display text-lg tracking-tight">
            {logoText} <span className="text-brand-gold">CMA</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {menuLinks.map((link, idx) => (
            <a
              key={idx}
              href={getNavHref(link.href)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={handleGoToDashboard}
                className="btn-gold !px-4 !py-2 !text-xs flex items-center gap-1.5 shadow-gold-glow"
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <Link
                to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/profile'}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center gap-1.5"
              >
                {user?.role === 'ADMIN' ? (
                  <>
                    <Shield size={14} /> Console
                  </>
                ) : (
                  <>
                    <User size={14} /> Profile
                  </>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors duration-200"
              >
                Login
              </Link>
              <Link to="/register" className="btn-gold !px-4 !py-2 !text-xs">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-b border-brand-border bg-brand-dark/95 backdrop-blur-lg animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {menuLinks.map((link, idx) => (
              <a
                key={idx}
                href={getNavHref(link.href)}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-brand-border/40 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={handleGoToDashboard}
                    className="btn-gold w-full text-center flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard size={16} /> Open Dashboard
                  </Link>
                  <Link
                    to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/profile'}
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center border border-brand-border hover:border-zinc-700 py-2.5 rounded-lg text-sm font-semibold text-zinc-300 transition-colors"
                  >
                    {user?.role === 'ADMIN' ? 'Admin Console' : 'My Profile'}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center border border-brand-border hover:border-zinc-700 py-3 rounded-lg text-sm font-semibold text-zinc-300 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="btn-gold w-full text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
