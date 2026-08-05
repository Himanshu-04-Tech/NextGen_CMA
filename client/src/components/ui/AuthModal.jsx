import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Sparkles, X } from 'lucide-react';
import Button from './Button.jsx';

/**
 * Reusable AuthModal component
 * Prompts visitors to Login or Register when attempting protected actions in demo mode.
 */
const AuthModal = ({
  isOpen,
  onClose,
  title = 'Create a Free Account',
  message = 'Create a free account to generate your personalized study plan and track progress.',
  redirectTo = '/study-planner',
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose?.();
    navigate('/login', { state: { redirectTo } });
  };

  const handleRegister = () => {
    onClose?.();
    navigate('/register', { state: { redirectTo } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-brand-card border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-brand-gold/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-brand-purple/10 blur-[80px] pointer-events-none" />

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={18} />
          </button>
        )}

        {/* Icon Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shadow-gold-glow">
            <Sparkles size={24} />
          </div>
          <div>
            <span className="text-[10px] text-brand-gold uppercase tracking-widest font-bold font-display block">
              Free Access Required
            </span>
            <h3 className="text-xl font-bold font-display text-white">{title}</h3>
          </div>
        </div>

        {/* Description Message */}
        <p className="text-zinc-300 text-sm leading-relaxed">{message}</p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="gold"
            size="md"
            onClick={handleRegister}
            leftIcon={<UserPlus size={16} />}
            className="w-full sm:flex-1 shadow-gold-glow"
          >
            Create Account
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={handleLogin}
            leftIcon={<LogIn size={16} />}
            className="w-full sm:flex-1"
          >
            Sign In
          </Button>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-brand-border/40 text-center">
          <span className="text-[11px] text-zinc-500 font-medium">
            🔒 No credit card required • Instant setup in under 60 seconds
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
