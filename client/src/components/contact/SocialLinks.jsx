import React from 'react';
import {
  MessageCircle,
  Compass,
  Instagram,
  Video,
  Facebook,
  Linkedin,
  Twitter,
  Mail,
  Globe,
} from 'lucide-react';

const iconMap = {
  WHATSAPP: MessageCircle,
  TELEGRAM: Compass,
  INSTAGRAM: Instagram,
  YOUTUBE: Video,
  FACEBOOK: Facebook,
  LINKEDIN: Linkedin,
  TWITTER: Twitter,
  EMAIL: Mail,
  WEBSITE: Globe,
};

const colorMap = {
  WHATSAPP: 'hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30',
  TELEGRAM: 'hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30',
  INSTAGRAM: 'hover:bg-pink-500/10 hover:text-pink-400 hover:border-pink-500/30',
  YOUTUBE: 'hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30',
  FACEBOOK: 'hover:bg-blue-600/10 hover:text-blue-500 hover:border-blue-600/30',
  LINKEDIN: 'hover:bg-sky-700/10 hover:text-sky-500 hover:border-sky-700/30',
  TWITTER: 'hover:bg-zinc-800/20 hover:text-white hover:border-zinc-700/30',
  EMAIL: 'hover:bg-brand-gold/10 hover:text-brand-gold hover:border-brand-gold/30',
  WEBSITE: 'hover:bg-brand-purple/10 hover:text-brand-purple hover:border-brand-purple/30',
};

const SocialLinks = ({ links }) => {
  if (!links || links.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-zinc-800/10 border border-brand-border/40 text-left">
      <h3 className="text-sm font-bold font-display text-white mb-4">
        Follow Our Handles
      </h3>
      <div className="grid grid-cols-2 gap-3.5">
        {links.map((link) => {
          const IconComponent = iconMap[link.platform.toUpperCase()] || Globe;
          const styling = colorMap[link.platform.toUpperCase()] || 'hover:bg-white/5';
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-xl bg-black/40 border border-brand-border/40 flex items-center gap-3 transition-all duration-300 ${styling}`}
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                <IconComponent size={16} />
              </div>
              <span className="text-xs font-semibold text-white truncate">
                {link.displayName}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinks;
