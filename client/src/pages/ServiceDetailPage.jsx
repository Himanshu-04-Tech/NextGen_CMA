/**
 * NextGen CMA — Service Detail Page
 *
 * Fetches specific service details dynamically from the API and displays them.
 * Resolves list of other related services and handles errors.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BookX } from 'lucide-react';

import Navbar from '../components/home/Navbar.jsx';
import Footer from '../components/home/Footer.jsx';
import ServiceDetail from '../components/services/ServiceDetail.jsx';
import Loader from '../components/ui/Loader.jsx';
import Button from '../components/ui/Button.jsx';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceAndRelated = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        // 1. Fetch target service
        const res = await axios.get(`${apiUrl}/services/${id}`);
        const activeService = res.data?.data;
        setService(activeService);

        // Update document title for SEO
        if (activeService) {
          document.title = `${activeService.title} — NextGen CMA`;
          const descMeta = document.querySelector('meta[name="description"]');
          if (descMeta) {
            descMeta.content = activeService.shortDescription;
          }
        }

        // 2. Fetch other services to compute related recommendations
        const relRes = await axios.get(`${apiUrl}/services`);
        const allServices = relRes.data?.data || [];
        
        // Filter out current, suggest same category first
        const others = allServices.filter((item) => item.id !== id);
        const sameCategory = others.filter((item) => item.category === activeService?.category);
        const diffCategory = others.filter((item) => item.category !== activeService?.category);
        
        setRelated([...sameCategory, ...diffCategory]);

      } catch (err) {
        console.error(err);
        setError('Requested service detail page could not be found or connection failed.');
        toast.error('Failed to resolve service record details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceAndRelated();
  }, [id]);

  return (
    <div className="bg-brand-dark text-white min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {isLoading ? (
          <Loader fullScreen={false} message="Loading details..." />
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center py-24 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-6">
              <BookX size={24} />
            </div>
            <h2 className="text-white font-bold text-lg mb-2">Service Not Found</h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              The service detail page you requested does not exist or has been removed.
            </p>
            <Link to="/services">
              <Button variant="gold">View Available Services</Button>
            </Link>
          </div>
        ) : (
          <ServiceDetail service={service} relatedServices={related} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
