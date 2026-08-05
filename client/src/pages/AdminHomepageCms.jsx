/**
 * NextGen CMA — Admin Homepage CMS Page
 *
 * Provides a premium administrative console to manage homepage sections.
 * Features real-time editing inputs, sections list, visibility toggles,
 * reordering configurations, and an interactive real-time live preview panel.
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Settings,
  Eye,
  Save,
  PlusCircle,
  Trash2,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import api from '../services/api.js';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Loader from '../components/ui/Loader.jsx';

// Inline simple preview components inside the live preview pane
const SectionLivePreview = ({ keyId, title, subtitle, body, buttonText, buttonLink, imageUrl }) => {
  // Simple rendering depending on section type
  if (keyId === 'hero') {
    return (
      <div className="p-6 rounded-2xl bg-[#121212] border border-brand-border text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-purple/10 blur-xl" />
        <div className="space-y-4 relative z-10">
          <span className="px-2 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20 text-[10px] text-brand-gold font-bold">HERO</span>
          <h2 className="text-xl font-bold font-display text-white leading-tight">{title || 'Hero Title'}</h2>
          <p className="text-zinc-400 text-xs line-clamp-2">{subtitle || 'Hero Subtitle'}</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded bg-brand-gold text-black text-[10px] font-bold">{buttonText || 'Button 1'}</button>
            <button className="px-3 py-1.5 rounded border border-brand-border text-white text-[10px]">Mentorship</button>
          </div>
          {imageUrl && (
            <div className="mt-4 aspect-video w-full rounded-xl overflow-hidden border border-brand-border">
              <img src={imageUrl} alt="Hero illustration preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (keyId === 'stats') {
    let stats = [];
    try {
      stats = body ? JSON.parse(body) : [];
    } catch {
      stats = [
        { label: 'Enrolled Students', value: 1200, suffix: '+' },
        { label: 'Success Rate', value: 87, suffix: '%' }
      ];
    }
    return (
      <div className="p-6 rounded-2xl bg-[#121212] border border-brand-border text-left">
        <h3 className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-4">{title || 'Milestones'}</h3>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-black/40 border border-brand-border/60 text-center">
              <span className="text-xl font-bold text-brand-gold">{stat.value}{stat.suffix}</span>
              <span className="text-[10px] text-zinc-500 block">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback default box preview
  return (
    <div className="p-6 rounded-2xl bg-[#121212] border border-brand-border text-left relative">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Section: {keyId}</span>
        {imageUrl && <div className="w-6 h-6 rounded overflow-hidden"><img src={imageUrl} className="object-cover w-full h-full" /></div>}
      </div>
      <h3 className="text-sm font-bold text-white mb-1">{title || 'No Title Inputted'}</h3>
      {subtitle && <p className="text-xs text-zinc-400 mb-2 line-clamp-2">{subtitle}</p>}
      {body && <div className="p-2 rounded bg-black/30 border border-brand-border text-[10px] text-zinc-500 font-mono overflow-x-auto truncate">{body}</div>}
      {buttonText && (
        <a href={buttonLink} className="inline-block mt-3 px-3 py-1 rounded bg-zinc-800 border border-brand-border text-[10px] text-brand-gold">
          {buttonText}
        </a>
      )}
    </div>
  );
};

const AdminHomepageCms = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states matching model fields
  const [sectionKey, setSectionKey] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [body, setBody] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const fetchSections = async () => {
    try {
      const res = await api.get('/admin/site-content');
      setSections(res.data?.data || []);
      
      // Select the first section by default if any exists
      if (res.data?.data?.length > 0 && !selectedSection) {
        handleSelectSection(res.data.data[0]);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch CMS sections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSelectSection = (sect) => {
    setSelectedSection(sect);
    setSectionKey(sect.sectionKey);
    setTitle(sect.title || '');
    setSubtitle(sect.subtitle || '');
    setBody(sect.body || '');
    setButtonText(sect.buttonText || '');
    setButtonLink(sect.buttonLink || '');
    setImageUrl(sect.imageUrl || '');
    setDisplayOrder(sect.displayOrder || 0);
    setIsActive(sect.isActive !== false);
  };

  const handleCreateNewSection = () => {
    setSelectedSection(null);
    setSectionKey('new_section');
    setTitle('New Section Title');
    setSubtitle('Enter subtitle description copy here.');
    setBody('');
    setButtonText('');
    setButtonLink('');
    setImageUrl('');
    setDisplayOrder(0);
    setIsActive(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!sectionKey) {
      toast.error('Section Key is required');
      return;
    }

    const payload = {
      sectionKey,
      title: title || null,
      subtitle: subtitle || null,
      body: body || null,
      buttonText: buttonText || null,
      buttonLink: buttonLink || null,
      imageUrl: imageUrl || null,
      displayOrder: parseInt(displayOrder, 10) || 0,
      isActive,
    };

    try {
      if (selectedSection) {
        // Update existing block
        const res = await api.put(`/admin/site-content/${selectedSection.id}`, payload);
        toast.success('Section content block updated successfully');
        // Update section in lists
        setSections((prev) =>
          prev.map((item) => (item.id === selectedSection.id ? res.data.data : item))
        );
        setSelectedSection(res.data.data);
      } else {
        // Create new block
        const res = await api.post('/admin/site-content', payload);
        toast.success('New section content block created');
        setSections((prev) => [...prev, res.data.data]);
        setSelectedSection(res.data.data);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to persist CMS record');
    }
  };

  const handleDelete = async () => {
    if (!selectedSection) return;
    if (!window.confirm('Are you sure you want to delete this content block?')) return;

    try {
      await api.delete(`/admin/site-content/${selectedSection.id}`);
      toast.success('Content block deleted');
      setSections((prev) => prev.filter((item) => item.id !== selectedSection.id));
      setSelectedSection(null);
      if (sections.length > 1) {
        handleSelectSection(sections.filter((item) => item.id !== selectedSection.id)[0]);
      }
    } catch (err) {
      toast.error('Failed to remove content block');
    }
  };

  if (isLoading) {
    return <Loader fullScreen message="Loading brand CMS workspace..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in text-left max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />
        <div>
          <div className="flex items-center gap-2">
            <Link to="/admin/dashboard" className="text-zinc-500 hover:text-white transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold font-display text-white flex items-center gap-2">
              <Settings size={22} className="text-brand-gold" /> Brand CMS
            </h1>
          </div>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1.5">
            Configure texts, buttons, structures, and assets of your landing page dynamically.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={handleCreateNewSection} leftIcon={<PlusCircle size={14} />}>
          Add Content Block
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column — Selection Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <Card padding="sm">
            <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 pb-2 border-b border-brand-border">
              <Layers size={14} className="text-brand-gold" /> Sections List
            </h3>
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
              {sections.length === 0 ? (
                <span className="text-xs text-zinc-600 block py-4 text-center">No blocks configured</span>
              ) : (
                sections.map((sect) => (
                  <button
                    key={sect.id}
                    onClick={() => handleSelectSection(sect)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedSection?.id === sect.id
                        ? 'bg-brand-gold/10 border border-brand-gold/30 text-brand-gold'
                        : 'border border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate">{sect.sectionKey}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${sect.isActive ? 'bg-green-500' : 'bg-zinc-700'}`} />
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Center Column — Editing Pane */}
        <div className="lg:col-span-5">
          <Card padding="default">
            <h3 className="text-sm font-bold font-display text-white mb-6 border-b border-brand-border pb-3 flex items-center justify-between">
              <span>{selectedSection ? 'Edit Block Settings' : 'New Block Settings'}</span>
              {selectedSection && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-white/5 transition-all"
                  title="Delete Block"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </h3>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Key */}
              <Input
                id="sectionKey"
                label="Section Key"
                value={sectionKey}
                placeholder="e.g. hero"
                onChange={(e) => setSectionKey(e.target.value)}
              />

              {/* Title */}
              <Input
                id="title"
                label="Section Title"
                value={title}
                placeholder="Crack CMA with Planning"
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Subtitle */}
              <Input
                id="subtitle"
                label="Section Subheading"
                value={subtitle}
                placeholder="Personal study plans to guarantee success..."
                onChange={(e) => setSubtitle(e.target.value)}
              />

              {/* Body (Allows JSON/Rich configurations) */}
              <div>
                <label htmlFor="body" className="form-label">
                  Body Copy (or JSON array array settings)
                </label>
                <textarea
                  id="body"
                  rows={6}
                  value={body}
                  placeholder="Enter content description text, or JSON settings structures."
                  className="w-full bg-black/40 border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 gold-border-focus outline-none font-mono text-xs resize-y"
                  onChange={(e) => setBody(e.target.value)}
                />
                <span className="text-[10px] text-zinc-600 block mt-1">
                  Supports markdown copy, list texts, or raw configuration arrays.
                </span>
              </div>

              {/* Button text & link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  id="buttonText"
                  label="Button Text"
                  value={buttonText}
                  placeholder="Join Community"
                  onChange={(e) => setButtonText(e.target.value)}
                />
                <Input
                  id="buttonLink"
                  label="Button Action URL/ID"
                  value={buttonLink}
                  placeholder="#community"
                  onChange={(e) => setButtonLink(e.target.value)}
                />
              </div>

              {/* Image url */}
              <Input
                id="imageUrl"
                label="Asset/Image URL"
                value={imageUrl}
                placeholder="https://images.unsplash.com/..."
                onChange={(e) => setImageUrl(e.target.value)}
              />

              {/* Display Order & Active status */}
              <div className="flex items-center justify-between border-t border-brand-border/40 pt-4 mt-2">
                <div className="w-1/2">
                  <Input
                    id="displayOrder"
                    label="Display Order"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                  />
                </div>

                <div className="text-right">
                  <span className="form-label mb-2">Block Status</span>
                  <button
                    type="button"
                    onClick={() => setIsActive((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 focus:outline-none"
                  >
                    {isActive ? (
                      <span className="text-xs text-green-400 flex items-center gap-1 font-bold">
                        <ToggleRight size={24} className="text-green-500" /> Active
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-500 flex items-center gap-1 font-bold">
                        <ToggleLeft size={24} className="text-zinc-700" /> Disabled
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <Button type="submit" variant="gold" className="w-full mt-4" leftIcon={<Save size={14} />}>
                Save Block Configuration
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column — Real-time Live Preview */}
        <div className="lg:col-span-4 space-y-4">
          <Card padding="sm">
            <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 pb-2 border-b border-brand-border">
              <Eye size={14} className="text-brand-gold" /> Real-time Live Preview
            </h3>
            
            <div className="border border-brand-border/60 rounded-2xl bg-black/40 p-4 min-h-[300px] flex flex-col justify-center">
              <SectionLivePreview
                keyId={sectionKey}
                title={title}
                subtitle={subtitle}
                body={body}
                buttonText={buttonText}
                buttonLink={buttonLink}
                imageUrl={imageUrl}
              />
            </div>
            
            <span className="text-[10px] text-zinc-600 block mt-2 text-center">
              Preview updates dynamically as you fill out form fields on the left.
            </span>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminHomepageCms;
