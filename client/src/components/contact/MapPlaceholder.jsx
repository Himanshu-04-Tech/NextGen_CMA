import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const MapPlaceholder = ({ embedUrl, address }) => {
  return (
    <div className="w-full rounded-2xl border border-brand-border/40 overflow-hidden relative group bg-zinc-800/10">
      {embedUrl ? (
        <div className="aspect-[16/10] sm:aspect-[16/8] lg:aspect-video w-full h-full relative">
          {/* Cover map overlay for aesthetic */}
          <div className="absolute inset-0 bg-brand-purple/[0.03] pointer-events-none" />
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(80%)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="NextGen Office Location Map"
          />
        </div>
      ) : (
        <div className="p-8 aspect-[16/10] flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent pointer-events-none" />
          <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-3.5 shadow-gold-glow/5">
            <MapPin size={22} />
          </div>
          <span className="text-xs font-bold text-white mb-1.5 font-display uppercase tracking-widest">
            Office Location
          </span>
          <p className="text-zinc-500 text-xs max-w-xs mb-4 leading-relaxed font-sans">
            {address || '4th Floor, Premium Plaza, Sector 62, Noida, UP, India'}
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              address || 'Sector 62 Noida'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-2 px-4 rounded-lg bg-white/5 border border-brand-border hover:border-brand-gold hover:text-brand-gold text-xs font-semibold uppercase tracking-wider text-zinc-300 transition-all duration-300"
          >
            <Navigation size={12} /> Get Directions
          </a>
        </div>
      )}
    </div>
  );
};

export default MapPlaceholder;
