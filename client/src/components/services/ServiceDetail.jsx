/**
 * NextGen CMA — Service Detail Template Layout
 *
 * Renders the detail sections for a single service offering,
 * including parsed features, benefits lists, call-to-actions, and related services suggestions.
 */

import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, HelpCircle, ShieldCheck, UserCheck } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import { resolveIcon, resolveCtaLink } from './ServiceCard.jsx';

const ServiceDetail = ({ service, relatedServices = [] }) => {
  const navigate = useNavigate();
  const {
    id,
    category,
    title,
    fullDescription,
    icon,
    imageUrl,
    ctaText,
    ctaLink,
  } = service;

  const resolvedIcon = resolveIcon(icon, 'BookOpen');
  const defaultImage = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80';

  // Dynamic values depending on category type to supply rich layout content
  const getCategoryDefaults = (catName) => {
    switch (catName) {
      case 'Study Planning':
        return {
          features: [
            'Dynamic study target calculators based on syllabus size',
            'Customizable daily study hour budgets',
            'Syllabus topic mapping checklist (Foundation/Inter/Final)',
            'Auto-carry targets forward for missed target dates'
          ],
          benefits: [
            'Reduces exam prep anxiety through structured milestones',
            'Guarantees full syllabus coverage before revision weeks start',
            'Enables clear progress reporting to mentors'
          ],
          whoFor: 'CMA candidates struggling to plan their day-to-day study sessions or managing double groups.'
        };
      case 'Accountability':
        return {
          features: [
            'Daily check-in logs tracking studied hours and subject focus',
            'Streak counts and badges gamification dashboard',
            'WhatsApp & email push notification reminders',
            'Weekly automated accountability scorecards report'
          ],
          benefits: [
            'Keeps study momentum consistent over months',
            'Highlights distraction patterns early',
            'Leverages habit loop systems to sustain motivation'
          ],
          whoFor: 'Self-studying students who find it difficult to maintain consistent daily study streaks.'
        };
      case 'Mentorship':
        return {
          features: [
            '1:1 chat doubts verification dashboard',
            'Personal coach assignments (CMA qualified professionals)',
            'Bi-weekly live video planning updates sessions',
            'Custom preparation strategy blueprints feedback'
          ],
          benefits: [
            'Direct access to experts who cleared the exam',
            'Immediate query resolution to prevent study blocks',
            'Personalized strategic advice on attempt selectors'
          ],
          whoFor: 'Students seeking direct professional guidance and swift doubts support.'
        };
      case 'Exam Support':
        return {
          features: [
            'Custom mock exams schedule manager',
            'Detailed analytics charts on subject mock score trends',
            'Target scorecard indicators',
            'Previous years papers question review banks access'
          ],
          benefits: [
            'Simulates actual exam conditions under time pressure',
            'Highlights weak syllabus areas needing revision',
            'Improves score consistency before final test day'
          ],
          whoFor: 'Candidates preparing for their target attempt who want to validate their scores through mock tests.'
        };
      default:
        return {
          features: ['Custom target planning details', 'Syllabus coverage trackers', 'Live community forums support'],
          benefits: ['Provides complete exam readiness assurances', 'Ensures study plan consistency', 'Prevents revision phase bottlenecks'],
          whoFor: 'All Cost and Management Accounting aspirants aiming to clear their exams with structure.'
        };
    }
  };

  const defaults = getCategoryDefaults(category);

  return (
    <div className="space-y-12 animate-fade-in text-left max-w-5xl mx-auto">
      {/* Back navigation */}
      <button
        onClick={() => navigate('/services')}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-white transition-colors duration-200"
      >
        <ArrowLeft size={14} /> Back to Services catalog
      </button>

      {/* Hero Banner Header */}
      <div className="relative rounded-3xl border border-brand-border bg-brand-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[300px]">
        {/* Cover image Column */}
        <div className="lg:col-span-5 relative min-h-[250px] lg:min-h-full">
          <img
            src={imageUrl || defaultImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-brand-card via-brand-card/30 to-transparent" />
        </div>

        {/* Title details Column */}
        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between gap-6 relative z-10">
          <div className="space-y-4">
            <span className="px-2.5 py-1 rounded bg-brand-purple/10 border border-brand-purple/50 text-[10px] text-brand-purple-light font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              {resolvedIcon} {category}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-white leading-tight">
              {title}
            </h1>
          </div>

          <div className="pt-4 border-t border-brand-border/40">
            <Link to={resolveCtaLink(service)}>
              <Button variant="gold" className="w-full sm:w-auto px-8">
                {ctaText || 'Get Started Now'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid columns details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column — Detailed Description & Features list */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed description */}
          <Card>
            <h2 className="text-base font-bold font-display text-white mb-4 border-b border-brand-border pb-3">
              About the Service
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
              {fullDescription}
            </p>
          </Card>

          {/* Features checkmarks */}
          <Card>
            <h2 className="text-base font-bold font-display text-white mb-4 border-b border-brand-border pb-3">
              Key Features & Deliverables
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {defaults.features.map((feat, i) => (
                <li key={i} className="flex gap-2.5 text-xs sm:text-sm text-zinc-300 items-start">
                  <CheckCircle2 size={16} className="text-brand-gold shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Benefits */}
          <Card>
            <h2 className="text-base font-bold font-display text-white mb-4 border-b border-brand-border pb-3">
              Benefits of Joining
            </h2>
            <ul className="space-y-3">
              {defaults.benefits.map((benefit, i) => (
                <li key={i} className="flex gap-2 text-xs sm:text-sm text-zinc-300 items-start">
                  <span className="text-brand-gold font-bold">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right Column — Info widgets & related products */}
        <div className="space-y-8">
          {/* Who is it for Card */}
          <Card>
            <h3 className="text-sm font-bold font-display text-white mb-4 border-b border-brand-border pb-3 flex items-center gap-1.5">
              <HelpCircle size={15} className="text-brand-gold" /> Who is this for?
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {defaults.whoFor}
            </p>
          </Card>

          {/* Related Services */}
          {relatedServices.length > 0 && (
            <Card>
              <h3 className="text-sm font-bold font-display text-white mb-5 border-b border-brand-border pb-3">
                Related Offerings
              </h3>
              <div className="space-y-4">
                {relatedServices.slice(0, 3).map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/services/${rel.id}`}
                    className="flex gap-3 items-center group border border-brand-border/40 p-2.5 rounded-xl bg-black/20 hover:bg-black/40 hover:border-brand-border transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                      <img src={rel.imageUrl || defaultImage} alt={rel.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white group-hover:text-brand-gold transition-colors truncate">
                        {rel.title}
                      </h4>
                      <span className="text-[9px] text-zinc-500 uppercase font-semibold">
                        {rel.category}
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-zinc-500 group-hover:text-white transition-all" />
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
