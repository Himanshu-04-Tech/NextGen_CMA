/**
 * NextGen CMA — Landing Page Footer Component
 *
 * Displays logo, description, social media links, and quick links.
 */

import { Link } from 'react-router-dom';
import {
  Compass,
  MessageCircle,
  Instagram,
  Video,
  Mail,
} from 'lucide-react';

const Footer = ({ data }) => {
  const logoText = data?.title || 'NextGen';
  const defaultDesc = data?.subtitle || 'Helping CMA students stay consistent through study planning, accountability, mentorship, and performance tracking.';

  // Default link arrays
  const defaultQuickLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="border-t border-brand-border bg-black/80 py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-brand-purple/[0.02] blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-start text-left">
        {/* Brand & Social Column */}
        <div className="md:col-span-8 space-y-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-gold-dark via-brand-gold to-brand-gold-dark flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
              <span className="text-black font-black text-lg font-display">N</span>
            </div>
            <span className="text-white font-bold font-display text-lg tracking-tight">
              {logoText} <span className="text-brand-gold">CMA</span>
            </span>
          </Link>
          
          <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-md">
            {defaultDesc}
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-5 text-zinc-400 pt-1">
            <a
              href="https://chat.whatsapp.com/EG1Xfx2JylM0SISodwhLh2?s=cl&p=a&ilr=0"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
              title="WhatsApp Community"
            >
              <MessageCircle size={20} />
            </a>
            <a
              href="https://t.me/nextgencma18"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
              title="Telegram Channel"
            >
              <Compass size={20} />
            </a>
            <a
              href="https://www.instagram.com/cma_nextgen_?utm_source=qr&igsh=MWg0cDBnZGhzZ3l2MQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition-colors"
              title="Instagram Page"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://youtube.com/@nextgencma?si=W8caW7Va1D328W3z"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-400 transition-colors"
              title="YouTube Channel"
            >
              <Video size={20} />
            </a>
            <a
              href="mailto:nextgencma18@gmail.com"
              className="hover:text-brand-gold transition-colors"
              title="Email Helpdesk"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            {defaultQuickLinks.map((link, idx) => (
              <li key={idx}>
                <a href={link.href} className="text-zinc-500 hover:text-white transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright border */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-12 border-t border-brand-border/40 text-center text-xs text-zinc-600">
        <p>© {new Date().getFullYear()} NextGen CMA. All rights reserved. Made for professional cost accounting candidates.</p>
      </div>
    </footer>
  );
};

export default Footer;
