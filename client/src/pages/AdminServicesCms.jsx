/**
 * NextGen CMA — Admin Services CMS page
 *
 * Implements CRUD actions, toggles, custom reordering index configurations,
 * and live cards previews for platform services list.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Settings,
  PlusCircle,
  Save,
  Trash2,
  Sliders,
  Eye,
  Check,
  X,
  Layers,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

import api from '../services/api.js';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Loader from '../components/ui/Loader.jsx';
import ServiceCard from '../components/services/ServiceCard.jsx';

const AdminServicesCms = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states matching schema
  const [category, setCategory] = useState('Study Planning');
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [icon, setIcon] = useState('BookOpen');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [ctaText, setCtaText] = useState('Explore Feature');
  const [ctaLink, setCtaLink] = useState('/study-planner/create');

  // List of easy icons to select from
  const availableIcons = [
    'Calendar',
    'UserCheck',
    'Award',
    'ShieldAlert',
    'BookOpen',
    'Clock',
    'TrendingUp',
    'CheckCircle',
    'FileText',
    'Trophy',
  ];

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/services');
      setServices(res.data?.data || []);
      
      if (res.data?.data?.length > 0 && !selectedService) {
        handleSelectService(res.data.data[0]);
      }
    } catch (err) {
      toast.error('Failed to sync services listing details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSelectService = (srv) => {
    setSelectedService(srv);
    setCategory(srv.category);
    setTitle(srv.title);
    setShortDescription(srv.shortDescription);
    setFullDescription(srv.fullDescription);
    setIcon(srv.icon);
    setImageUrl(srv.imageUrl || '');
    setDisplayOrder(srv.displayOrder || 0);
    setIsActive(srv.isActive !== false);
    setCtaText(srv.ctaText || 'Join Now');
    setCtaLink(srv.ctaLink || '#pricing');
  };

  const handleCreateNewClick = () => {
    setSelectedService(null);
    setCategory('Study Planning');
    setTitle('New CMA Service');
    setShortDescription('This is a short descriptive summary of the service.');
    setFullDescription('This is a complete full description detailing features and benefits lists.');
    setIcon('BookOpen');
    setImageUrl('');
    setDisplayOrder(0);
    setIsActive(true);
    setCtaText('Join Now');
    setCtaLink('#pricing');
  };

  const handleToggleStatus = async (srv) => {
    try {
      const updatedStatus = !srv.isActive;
      const res = await api.patch('/admin/services/status', {
        id: srv.id,
        isActive: updatedStatus,
      });

      setServices((prev) =>
        prev.map((item) => (item.id === srv.id ? { ...item, isActive: updatedStatus } : item))
      );

      if (selectedService?.id === srv.id) {
        setIsActive(updatedStatus);
      }

      toast.success(`Service status ${updatedStatus ? 'enabled' : 'disabled'}`);
    } catch {
      toast.error('Failed to update service status.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !shortDescription || !fullDescription) {
      toast.error('Please fill out all required service fields.');
      return;
    }

    const payload = {
      category,
      title,
      shortDescription,
      fullDescription,
      icon,
      imageUrl: imageUrl || null,
      displayOrder: parseInt(displayOrder, 10) || 0,
      isActive,
      ctaText: ctaText || null,
      ctaLink: ctaLink || null,
    };

    try {
      if (selectedService) {
        // Edit existing
        const res = await api.put(`/admin/services/${selectedService.id}`, payload);
        toast.success('Service details updated successfully');
        setServices((prev) =>
          prev.map((item) => (item.id === selectedService.id ? res.data.data : item))
        );
        setSelectedService(res.data.data);
      } else {
        // Create new
        const res = await api.post('/admin/services', payload);
        toast.success('New service created successfully');
        setServices((prev) => [...prev, res.data.data]);
        setSelectedService(res.data.data);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to persist service details.');
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    if (!window.confirm('Are you sure you want to delete this service record?')) return;

    try {
      await api.delete(`/admin/services/${selectedService.id}`);
      toast.success('Service deleted successfully');
      const updatedList = services.filter((item) => item.id !== selectedService.id);
      setServices(updatedList);
      setSelectedService(null);
      if (updatedList.length > 0) {
        handleSelectService(updatedList[0]);
      }
    } catch {
      toast.error('Failed to delete service.');
    }
  };

  // Preview object structure to send to ServiceCard
  const mockServicePreview = {
    id: selectedService?.id || 'preview',
    category,
    title,
    shortDescription,
    icon,
    imageUrl,
    ctaText,
    ctaLink,
  };

  if (isLoading) {
    return <Loader fullScreen message="Loading services workspace..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in text-left max-w-7xl mx-auto">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />
        <div>
          <div className="flex items-center gap-2">
            <Link to="/admin/dashboard" className="text-zinc-500 hover:text-white transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold font-display text-white flex items-center gap-2">
              <Settings size={22} className="text-brand-gold" /> Services CMS
            </h1>
          </div>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1.5">
            Create, edit, toggle visibility, and sort CMA service offerings.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={handleCreateNewClick} leftIcon={<PlusCircle size={14} />}>
          Create Offering
        </Button>
      </div>

      {/* Main Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column — Services list selection */}
        <div className="lg:col-span-3 space-y-4">
          <Card padding="sm">
            <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 pb-2 border-b border-brand-border">
              <Layers size={14} className="text-brand-gold" /> Services Offerings
            </h3>
            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
              {services.length === 0 ? (
                <span className="text-xs text-zinc-600 block py-4 text-center">No service entries</span>
              ) : (
                services.map((srv) => (
                  <div
                    key={srv.id}
                    className={`group w-full rounded-xl border p-3 flex flex-col gap-2 transition-all ${
                      selectedService?.id === srv.id
                        ? 'bg-brand-gold/5 border-brand-gold/40 text-brand-gold'
                        : 'border-brand-border bg-black/10 text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectService(srv)}
                      className="w-full text-left font-bold text-xs font-display truncate focus:outline-none"
                    >
                      {srv.title}
                    </button>
                    
                    <div className="flex items-center justify-between border-t border-brand-border/40 pt-2 mt-1">
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-500 truncate max-w-[100px]">
                        {srv.category}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(srv)}
                        className="focus:outline-none"
                        title={srv.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {srv.isActive ? (
                          <ToggleRight size={20} className="text-green-500" />
                        ) : (
                          <ToggleLeft size={20} className="text-zinc-600" />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Center Column — Detailed Form fields */}
        <div className="lg:col-span-5">
          <Card padding="default">
            <div className="flex justify-between items-center mb-6 border-b border-brand-border pb-3">
              <h3 className="text-sm font-bold font-display text-white">
                {selectedService ? 'Update Service details' : 'Create new Service'}
              </h3>
              {selectedService && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-white/5 transition-all"
                  title="Delete Record"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Category */}
              <div>
                <label htmlFor="categorySelect" className="form-label">
                  Service Category
                </label>
                <select
                  id="categorySelect"
                  value={category}
                  className="w-full bg-black/40 border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:border-brand-gold outline-none font-sans text-sm"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Study Planning" className="bg-brand-card">Study Planning</option>
                  <option value="Accountability" className="bg-brand-card">Accountability</option>
                  <option value="Mentorship" className="bg-brand-card">Mentorship</option>
                  <option value="Exam Support" className="bg-brand-card">Exam Support</option>
                </select>
              </div>

              {/* Title */}
              <Input
                id="srv_title"
                label="Service Title *"
                value={title}
                placeholder="e.g. 1:1 Live Planning Session"
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Short Description */}
              <div>
                <label htmlFor="srv_short" className="form-label">
                  Short Summary (Max 300 characters) *
                </label>
                <textarea
                  id="srv_short"
                  rows={2}
                  maxLength={300}
                  value={shortDescription}
                  placeholder="Summarize the core value proposition of this offering..."
                  className="w-full bg-black/40 border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:border-brand-gold outline-none font-sans text-xs sm:text-sm resize-none"
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              {/* Full Description */}
              <div>
                <label htmlFor="srv_full" className="form-label">
                  Full Details Description (Academic guides details) *
                </label>
                <textarea
                  id="srv_full"
                  rows={5}
                  value={fullDescription}
                  placeholder="Provide deep descriptions on features, checklists, timeline and details..."
                  className="w-full bg-black/40 border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:border-brand-gold outline-none font-sans text-xs sm:text-sm resize-y"
                  onChange={(e) => setFullDescription(e.target.value)}
                />
              </div>

              {/* Icon selector */}
              <div>
                <label className="form-label mb-2">Display Icon Key</label>
                <div className="grid grid-cols-5 gap-2 border border-brand-border bg-black/20 p-3 rounded-xl">
                  {availableIcons.map((icName) => {
                    const LucideIcon = LucideIcons[icName] || LucideIcons.HelpCircle;
                    return (
                      <button
                        key={icName}
                        type="button"
                        onClick={() => setIcon(icName)}
                        className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                          icon === icName
                            ? 'bg-brand-gold/10 border border-brand-gold/30 text-brand-gold'
                            : 'border border-transparent text-zinc-500 hover:text-white hover:bg-white/5'
                        }`}
                        title={icName}
                      >
                        <LucideIcon size={16} />
                        <span className="text-[8px] truncate max-w-full block">{icName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image URL */}
              <Input
                id="srv_image"
                label="Asset image url"
                value={imageUrl}
                placeholder="https://images.unsplash.com/..."
                onChange={(e) => setImageUrl(e.target.value)}
              />

              {/* CTA text & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  id="srv_cta_text"
                  label="Button Text"
                  value={ctaText}
                  placeholder="Join Now"
                  onChange={(e) => setCtaText(e.target.value)}
                />
                <Input
                  id="srv_cta_link"
                  label="Button Action Link"
                  value={ctaLink}
                  placeholder="#pricing"
                  onChange={(e) => setCtaLink(e.target.value)}
                />
              </div>

              {/* Display Order & Active status */}
              <div className="flex items-center justify-between border-t border-brand-border/40 pt-4 mt-2">
                <div className="w-1/2">
                  <Input
                    id="srv_order"
                    label="Display Order"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                  />
                </div>

                <div className="text-right">
                  <span className="form-label mb-2">Platform Visibility</span>
                  <button
                    type="button"
                    onClick={() => setIsActive((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 focus:outline-none"
                  >
                    {isActive ? (
                      <span className="text-xs text-green-400 flex items-center gap-1 font-bold">
                        <ToggleRight size={24} className="text-green-500" /> Enabled
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-500 flex items-center gap-1 font-bold">
                        <ToggleLeft size={24} className="text-zinc-700" /> Hidden
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="gold" className="w-full mt-4" leftIcon={<Save size={14} />}>
                Save Service Details
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column — Real-time Live Preview */}
        <div className="lg:col-span-4 space-y-4">
          <Card padding="sm">
            <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 pb-2 border-b border-brand-border">
              <Eye size={14} className="text-brand-gold" /> Preview Before Save
            </h3>
            
            <div className="border border-brand-border/60 rounded-2xl bg-black/40 p-4">
              <ServiceCard service={mockServicePreview} />
            </div>
            
            <span className="text-[10px] text-zinc-600 block mt-2 text-center">
              Dynamic card details rendering in real-time.
            </span>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default AdminServicesCms;
