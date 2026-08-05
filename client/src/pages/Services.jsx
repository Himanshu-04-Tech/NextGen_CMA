/**
 * NextGen CMA — Services Catalog Page
 *
 * Displays services dynamically fetched from API.
 * Includes category tabs, search input, sorting filters, skeleton loader, and empty state.
 * Implements document title metadata update for SEO.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import Navbar from '../components/home/Navbar.jsx';
import Footer from '../components/home/Footer.jsx';
import ServiceHero from '../components/services/ServiceHero.jsx';
import CategoryTabs from '../components/services/CategoryTabs.jsx';
import SearchBar from '../components/services/SearchBar.jsx';
import FilterDropdown from '../components/services/FilterDropdown.jsx';
import ServiceGrid from '../components/services/ServiceGrid.jsx';
import LoadingSkeleton from '../components/services/LoadingSkeleton.jsx';
import EmptyState from '../components/services/EmptyState.jsx';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('displayOrder');

  const defaultServices = [
    {
      id: 's1',
      title: 'Study Planning Wizard',
      shortDescription: 'Create custom schedules adjusted to your CMA level, exam target date, and daily study budget.',
      category: 'Study Planning',
      icon: 'Calendar',
      displayOrder: 1,
      isActive: true,
      features: ['Level-specific syllabus breakdown', 'Exam attempt target calculation', 'Customizable daily study hours']
    },
    {
      id: 's2',
      title: 'Daily Accountability Tracker',
      shortDescription: 'Submit daily self-reports, log actual study hours, and maintain habits with streak rewards.',
      category: 'Accountability',
      icon: 'UserCheck',
      displayOrder: 2,
      isActive: true,
      features: ['Visual streak counter', 'Daily check-in logs', 'Habit progress rings']
    }
  ];

  // Page dynamic content header for metadata
  useEffect(() => {
    document.title = 'Services & Prep Catalog — NextGen CMA';
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.content = 'Explore study planning calculators and daily accountability check-ins for CMA candidates.';
    }
  }, []);

  // Fetch live services from backend with static fallback
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.get(`${apiUrl}/services`);
      const data = res.data?.data || [];
      const nonMentorship = data.filter(
        (s) =>
          !s.title?.toLowerCase().includes('mentor') &&
          !s.category?.toLowerCase().includes('mentor')
      );
      if (nonMentorship.length > 0) {
        setServices(nonMentorship);
        setFilteredServices(nonMentorship);
      } else {
        setServices(defaultServices);
        setFilteredServices(defaultServices);
      }
    } catch (err) {
      console.warn('Backend services API offline/failed. Loading default static services catalog.', err);
      setServices(defaultServices);
      setFilteredServices(defaultServices);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle client-side search, category filter, and sorting
  useEffect(() => {
    let result = [...services];

    // 1. Filter by Category
    if (activeCategory !== 'ALL') {
      result = result.filter((srv) => srv.category === activeCategory);
    }

    // 2. Search query matching title, category or description
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (srv) =>
          srv.title.toLowerCase().includes(query) ||
          srv.category.toLowerCase().includes(query) ||
          srv.shortDescription.toLowerCase().includes(query)
      );
    }

    // 3. Sorting
    if (sortBy === 'displayOrder') {
      result.sort((a, b) => a.displayOrder - b.displayOrder);
    } else if (sortBy === 'titleAsc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'titleDesc') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredServices(result);
  }, [services, activeCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setActiveCategory('ALL');
    setSearchQuery('');
    setSortBy('displayOrder');
  };

  return (
    <div className="bg-brand-dark text-white min-h-screen flex flex-col">
      {/* Dynamic navbar (defaults parsed from Home page context / metadata) */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative z-10">

        {/* Hero banner */}
        <ServiceHero />

        {/* Filters control bar */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-brand-border/40 pb-4">
          <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <FilterDropdown sortBy={sortBy} setSortBy={setSortBy} />
          </div>
        </div>

        {/* Content catalog */}
        <div className="pt-2">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-center py-16 border border-brand-border bg-brand-card/40 rounded-2xl">
              <p className="text-red-400 font-bold mb-4">{error}</p>
              <button
                onClick={fetchServices}
                className="px-4 py-2 rounded bg-brand-gold text-black text-xs font-bold"
              >
                Retry Request
              </button>
            </div>
          ) : filteredServices.length === 0 ? (
            <EmptyState onReset={handleResetFilters} />
          ) : (
            <ServiceGrid services={filteredServices} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
