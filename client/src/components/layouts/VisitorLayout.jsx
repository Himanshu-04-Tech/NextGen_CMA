import React from 'react';
import Navbar from '../home/Navbar.jsx';
import Footer from '../home/Footer.jsx';
import { Eye, ArrowLeft, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * VisitorLayout wrapper for unauthenticated visitor demo pages.
 * Shows top Navbar, demo banner, page content, and Footer.
 */
const VisitorLayout = ({ children, activeFeature = 'Study Planner' }) => {
  return (
    <div className="bg-brand-dark text-white min-h-screen flex flex-col relative">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Visitor Demo Mode Top Banner */}
      <div className="bg-gradient-to-r from-brand-gold/15 via-brand-purple/20 to-brand-gold/15 border-b border-brand-gold/30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping shrink-0" />
            <Eye size={14} className="text-brand-gold shrink-0" />
            <span className="text-zinc-200">
              <strong className="text-white">Visitor Demo Mode:</strong> You are exploring the {activeFeature} interface.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/#home"
              className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={12} /> Back to Landing Page
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 rounded-lg bg-brand-gold text-black text-[11px] font-bold hover:bg-brand-gold-light transition-all flex items-center gap-1 shadow-gold-glow"
            >
              <LogIn size={12} /> Create Free Account
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default VisitorLayout;
