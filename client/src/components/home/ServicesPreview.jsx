import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, UserCheck, Award, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Card from '../ui/Card.jsx';

// Icon resolver helper
const resolvePreviewIcon = (iconName, fallbackIdx) => {
  const IconComponent = LucideIcons[iconName];
  if (IconComponent) {
    return <IconComponent className="w-6 h-6" />;
  }

  // Choose index fallbacks
  switch (fallbackIdx) {
    case 0: return <Calendar className="w-6 h-6 text-brand-gold" />;
    case 1: return <UserCheck className="w-6 h-6 text-brand-purple-light" />;
    case 2: return <Award className="w-6 h-6 text-brand-gold" />;
    default: return <Award className="w-6 h-6 text-brand-gold" />;
  }
};

const ServicesPreview = ({ data }) => {
  const [servicesList, setServicesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const defaultServices = [
    {
      title: 'Study Planning',
      shortDescription: 'Create custom schedules adjusted to your CMA level, exam target date, and daily study budget.',
      icon: 'Calendar',
    },
    {
      title: 'Accountability',
      shortDescription: 'Submit daily self-reports, log actual hours, and maintain habits with streak rewards.',
      icon: 'UserCheck',
    },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${apiUrl}/services`);
        const activeServices = res.data?.data || [];

        // Filter to keep Study Planning and Accountability (mentorship removed for now)
        const filtered = activeServices.filter(s =>
          (s.title?.toLowerCase().includes('study planning') ||
          s.title?.toLowerCase().includes('accountability')) &&
          !s.title?.toLowerCase().includes('mentor') &&
          !s.category?.toLowerCase().includes('mentor')
        );

        if (filtered.length > 0) {
          setServicesList(filtered);
        } else {
          setServicesList(defaultServices);
        }
      } catch (err) {
        console.warn('Unable to query dynamic services database. Loading static layouts.', err);
        setServicesList(defaultServices);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const sectionTitle = data?.title || 'Designed for Consistency';
  const sectionSub = data?.subtitle || 'Our features work together to keep you focused on your target attempt.';

  if (isLoading) {
    return (
      <section id="services" className="py-24 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-zinc-500 text-xs animate-pulse font-semibold uppercase tracking-widest">
            Synchronizing batch offerings...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-12 md:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
            {sectionTitle}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {sectionSub}
          </p>
        </div>

        {/* Grid - Re-centered 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6 text-left">
          {servicesList.map((service, idx) => (
            <Card key={service.id || idx} hover={true} className="flex flex-col h-full justify-between gap-6 border border-brand-border/40">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-brand-border flex items-center justify-center text-brand-gold">
                  {resolvePreviewIcon(service.icon, idx)}
                </div>
                <h3 className="text-lg font-bold font-display text-white">
                  {service.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>

              <Link to="/services">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-gold hover:text-brand-gold-light group cursor-pointer">
                  Learn More
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
