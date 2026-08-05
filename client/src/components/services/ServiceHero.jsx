/**
 * NextGen CMA — Services Hero Banner
 *
 * Provides a premium, dark grid header matching the EdTech branding.
 */

import { BookOpen } from 'lucide-react';

const ServiceHero = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-8 md:p-12 text-left mb-12">
      {/* ── Ambient Background Glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-brand-purple/10 blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-brand-gold/[0.03] blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-3xl relative z-10 space-y-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-border bg-zinc-900/60 text-xs text-brand-gold font-medium">
          <BookOpen size={13} />
          <span>Curated CMA Syllabus Resources</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white leading-tight tracking-tight">
          Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold">CMA Offerings</span>
        </h1>

        {/* Description */}
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl">
          From custom target planners to professional 1:1 doubts mentoring and structured mock exam cycles. 
          Select a category to discover details and join.
        </p>
      </div>
    </div>
  );
};

export default ServiceHero;
