/**
 * NextGen CMA — Full-Screen Loader Component
 */

import Spinner from './Spinner.jsx';
import logoImg from '../../images/logo.jpeg';

const Loader = ({ fullScreen = false, message = 'Loading…' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-dark">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-brand-purple/10 blur-3xl" />
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-brand-gold/5 blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center gap-6">
          {/* Logo mark */}
          <img
            src={logoImg}
            alt="NextGen CMA Logo"
            className="w-16 h-16 rounded-full object-cover shadow-gold-glow border-2 border-brand-gold/40 animate-pulse"
          />

          <Spinner size="lg" />

          <p className="text-zinc-400 text-sm font-medium tracking-wide">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      <Spinner size="lg" />
    </div>
  );
};

export default Loader;
