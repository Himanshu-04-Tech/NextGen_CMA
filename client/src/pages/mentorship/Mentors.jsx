import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import MentorCard from '../../components/mentorship/MentorCard.jsx';
import LoadingSkeleton from '../../components/mentorship/LoadingSkeleton.jsx';
import EmptyState from '../../components/mentorship/EmptyState.jsx';
import { Search, SlidersHorizontal, BookOpen, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [minRating, setMinRating] = useState('');

  // Dropdown options
  const specializations = [
    'Business Laws & Ethics',
    'Taxation & Cost Accounting',
    'Financial Accounting',
    'Direct and Indirect Taxation',
    'Management Accounting',
    'Corporate Laws and Compliance',
  ];

  const fetchMentors = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (specialization) params.specialization = specialization;
      if (minRating) params.minRating = minRating;

      const res = await api.get('/mentors', { params });
      setMentors(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve the list of active mentors. Please try again.');
      toast.error('Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounced search or fetch on changes
    const handler = setTimeout(() => {
      fetchMentors();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, specialization, minRating]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight font-display flex items-center gap-2">
            <Users className="text-brand-gold" />
            Browse Mentors
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Connect with certified CMA professionals, schedule 1-on-1 sessions, and accelerate your study strategy.
          </p>
        </div>
      </div>

      {/* Search and Filters panel */}
      <div className="bg-brand-dark/30 border border-brand-border rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
          <SlidersHorizontal size={14} className="text-brand-purple" />
          <span>Filter & Search options</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search box */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, expertise, bio..."
              className="w-full bg-black/40 border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>

          {/* Specialization Filter */}
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
          >
            <option value="" className="bg-brand-dark">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec} className="bg-brand-dark">{spec}</option>
            ))}
          </select>

          {/* Rating filter */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
          >
            <option value="" className="bg-brand-dark">Any Rating</option>
            <option value="4.5" className="bg-brand-dark">4.5★ & Above</option>
            <option value="4.7" className="bg-brand-dark">4.7★ & Above</option>
            <option value="4.9" className="bg-brand-dark">4.9★ & Above</option>
          </select>
        </div>
      </div>

      {/* Mentors Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton type="card" count={6} />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
          {error}
        </div>
      ) : mentors.length === 0 ? (
        <EmptyState
          title="No mentors match your query"
          message="Try adjusting your filters, clearing the search string, or viewing other papers."
          icon={BookOpen}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Mentors;
