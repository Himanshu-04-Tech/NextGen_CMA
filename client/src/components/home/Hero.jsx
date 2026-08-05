/**
 * NextGen CMA — Landing Hero Section
 *
 * Displays main taglines, call-to-actions, and premium graphic preview dashboard.
 */

import { GraduationCap, ArrowRight, Star } from 'lucide-react';
import Button from '../ui/Button.jsx';

const Hero = ({ data }) => {
  const title = data?.title || 'Crack CMA with Planning, Not Pressure.';
  const subtitle =
    data?.subtitle ||
    'Accelerate your Cost & Management Accounting preparation with personalized study schedules, professional mentorship, and daily accountability tracking.';

  const button1Text = data?.buttonText || 'Join Community';
  const button1Link = data?.buttonLink || '#community';

  const imageUrl =
    data?.imageUrl ||
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80';

  return (
    <section id="home" className="relative py-12 md:py-16 overflow-hidden">
      {/* ── Ambient Background Glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-purple/10 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-gold/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left copy column */}
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* Trust Badge */}
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-border bg-brand-card/50 text-xs text-brand-gold font-medium">
            <GraduationCap size={14} />
            <span>India's Leading CMA Planning Platform</span>
          </div> */}

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-white leading-tight tracking-tight">
            {title.split(' ').map((word, i) => {
              if (word.toLowerCase().includes('cma') || word.toLowerCase().includes('planning')) {
                return (
                  <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold">
                    {word}{' '}
                  </span>
                );
              }
              return word + ' ';
            })}
          </h1>

          {/* Subheading */}
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl">
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a href={button1Link}>
              <Button variant="gold" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                {button1Text}
              </Button>
            </a>
          </div>

          {/* Features checkmarks */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-brand-border/40 text-xs text-zinc-500 font-semibold tracking-wider uppercase">
            <span className="flex items-center gap-1.5"><Star size={12} className="text-brand-gold" /> Personal Target Calculators</span>
            <span className="flex items-center gap-1.5"><Star size={12} className="text-brand-gold" /> Daily Accountability Check-ins</span>
            {/* <span className="flex items-center gap-1.5"><Star size={12} className="text-brand-gold" /> 1:1 Live Mentor Access</span> */}
          </div>
        </div>

        {/* Right graphic column */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center">
          {/* Ambient card back glow */}
          <div className="absolute inset-0 bg-brand-purple/20 rounded-3xl filter blur-3xl pointer-events-none transform -rotate-6" />

          {/* Illustration Container */}
          <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl border border-brand-border bg-brand-card p-2 shadow-2xl overflow-hidden group">
            {/* Visual background placeholder or screenshot */}
            <img
              src={imageUrl}
              alt="CMA Dashboard Illustration"
              className="w-full h-full object-cover rounded-2xl opacity-75 group-hover:scale-[1.02] transition-transform duration-700"
              loading="lazy"
            />

            {/* Simulated overlay floating widgets */}
            <div className="absolute top-6 left-6 p-3.5 rounded-2xl bg-black/60 border border-brand-border backdrop-blur-md flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-xs">
                87%
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block">Current Syllabus Progress</span>
                <span className="text-xs font-semibold text-white">Intermediate Group-1</span>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 p-3.5 rounded-2xl bg-black/60 border border-brand-border backdrop-blur-md flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                🏆
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block">Streak Count</span>
                <span className="text-xs font-semibold text-white">12 Days Consistent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
