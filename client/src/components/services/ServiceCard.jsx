/**
 * NextGen CMA — Service Card Component
 *
 * Displays overview stats of an individual service offering.
 * Supports category tagging, icon resolutions, hover zooms, and quick actions.
 */

import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';

// Helper to resolve string icon name to Lucide Component
export const resolveIcon = (iconName, fallback = 'Award') => {
  const IconComponent = LucideIcons[iconName];
  if (IconComponent) {
    return <IconComponent className="w-5 h-5" />;
  }
  // Try mapping lowercase/custom keywords to standard ones
  const standardFallback = LucideIcons[fallback] || LucideIcons.Award;
  return <standardFallback className="w-5 h-5" />;
};

// Helper to resolve destination route for services CTA
export const resolveCtaLink = (service) => {
  if (service?.ctaLink && service.ctaLink !== '#pricing' && service.ctaLink !== '#') {
    return service.ctaLink;
  }
  const title = (service?.title || '').toLowerCase();
  const category = (service?.category || '').toLowerCase();

  if (title.includes('study') || category.includes('study')) {
    return '/study-planner/create';
  }
  if (title.includes('accountability') || category.includes('accountability')) {
    return '/accountability';
  }
  if (title.includes('mentor') || category.includes('mentor')) {
    return '/contact#community';
  }
  return '/register';
};

const ServiceCard = ({ service }) => {
  const {
    id,
    category,
    title,
    shortDescription,
    icon,
    imageUrl,
    ctaText,
  } = service;

  const resolvedIcon = resolveIcon(icon, 'BookOpen');
  const defaultImage = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80';

  return (
    <Card hover={true} padding="none" className="flex flex-col h-full border border-brand-border/40 rounded-2xl overflow-hidden group">
      {/* Cover Image Wrapper */}
      <div className="aspect-[16/10] w-full overflow-hidden border-b border-brand-border/45 relative bg-zinc-900">
        <img
          src={imageUrl || defaultImage}
          alt={title}
          className="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-85 transition-all duration-500"
          loading="lazy"
        />
        
        {/* Category Tag overlay */}
        <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/85 backdrop-blur-sm border border-brand-border text-[9px] font-bold text-brand-gold uppercase tracking-wider">
          {category}
        </span>

        {/* Floating Icon bubble */}
        <div className="absolute -bottom-5 right-6 w-11 h-11 rounded-2xl bg-zinc-950 border border-brand-border flex items-center justify-center text-brand-gold shadow-gold-glow">
          {resolvedIcon}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-6 pt-8">
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-display text-white group-hover:text-brand-gold transition-colors duration-200 line-clamp-1">
            {title}
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
            {shortDescription}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link to={resolveCtaLink(service)} className="w-full block">
            <Button variant="gold" className="w-full !py-2.5 !text-xs font-bold">
              {ctaText || 'Join Now'}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
