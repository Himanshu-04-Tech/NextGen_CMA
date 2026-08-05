/**
 * NextGen CMA — 404 Not Found Page
 */

import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from './Button.jsx';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-brand-purple/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-brand-gold/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* 404 Display */}
        <div className="relative">
          <span className="text-[9rem] md:text-[12rem] font-black font-display leading-none text-transparent bg-clip-text bg-gradient-to-b from-zinc-600 to-zinc-900 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-gold-dark via-brand-gold to-brand-gold-dark flex items-center justify-center shadow-gold-glow">
              <span className="text-black font-black text-3xl font-display">N</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold font-display text-white">
            Page Not Found
          </h1>
          <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link to="/">
            <Button variant="gold" leftIcon={<Home size={16} />}>
              Go Home
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
