/**
 * NextGen CMA — Homepage Landing
 *
 * Fetches site CMS content from database API dynamically.
 * Mounts public sub-sections: Navbar, Hero, Stats, Services, Testimonials, Gallery, Blog, Pricing, Contact, Footer.
 * Configures document meta attributes for search engine optimizations.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';

// Section components
import Navbar from '../components/home/Navbar.jsx';
import Hero from '../components/home/Hero.jsx';
import ServicesPreview from '../components/home/ServicesPreview.jsx';
import BlogPreview from '../components/home/BlogPreview.jsx';
import ContactPreview from '../components/home/ContactPreview.jsx';
import Footer from '../components/home/Footer.jsx';

import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

import Loader from '../components/ui/Loader.jsx';
import ErrorComponent from '../components/ui/ErrorComponent.jsx';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-redirect authenticated users on startup
  useEffect(() => {
    if (isAuthenticated && sessionStorage.getItem('viewing_website') !== 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fetch all site content configurations
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${apiUrl}/site-content`);
        setContent(res.data?.data || []);
      } catch (err) {
        console.warn('CMS API offline, falling back to local landing layouts.', err);
        // Do not throw a hard error; fallback gracefully to allow default static render
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Configure SEO metadata tags programmatically
  useEffect(() => {
    document.title = 'NextGen CMA — Crack CMA with Planning, Not Pressure';
    
    // Select or generate description meta tag
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.name = 'description';
      document.head.appendChild(descMeta);
    }
    descMeta.content = 'India\'s leading planning platform for Cost & Management Accounting (CMA) aspirants. Personal study targets, accountability trackers, and verified 1:1 professional mentors.';

    // Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: 'NextGen CMA — Crack CMA with Planning' },
      { property: 'og:description', content: 'Accelerate your CMA study scheduling, track actual progress, and work directly with qualified coaches.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80' },
    ];

    ogTags.forEach((tag) => {
      let meta = document.querySelector(`meta[property="${tag.property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', tag.property);
        document.head.appendChild(meta);
      }
      meta.content = tag.content;
    });

  }, []);

  // Find section-specific settings from dynamically fetched DB records
  const findSectionData = (key) => {
    return content.find((item) => item.sectionKey === key);
  };

  if (isLoading) {
    return <Loader fullScreen message="Loading NextGen CMA platform..." />;
  }

  return (
    <div className="bg-brand-dark text-white relative flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar data={findSectionData('navbar')} />

      {/* Hero */}
      <Hero data={findSectionData('hero')} />

      {/* Services Preview */}
      <ServicesPreview data={findSectionData('services')} />

      {/* Blog Preview */}
      <BlogPreview data={findSectionData('blog')} />

      {/* Contact Preview */}
      <ContactPreview data={findSectionData('contact')} />

      {/* Footer */}
      <Footer data={findSectionData('footer')} />
    </div>
  );
};

export default Home;
