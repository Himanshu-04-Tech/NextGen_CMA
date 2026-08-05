import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Share2,
  PlusCircle,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
  Eye,
  Save,
  Globe,
  MessageCircle,
  Compass,
  Instagram,
  Video,
  Facebook,
  Linkedin,
  Twitter,
  Mail,
  ChevronLeft,
} from 'lucide-react';
import api from '../../services/api.js';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

const allowedPlatforms = [
  'WHATSAPP',
  'TELEGRAM',
  'INSTAGRAM',
  'YOUTUBE',
  'FACEBOOK',
  'LINKEDIN',
  'TWITTER',
  'EMAIL',
  'WEBSITE',
];

const iconOptions = {
  WHATSAPP: 'MessageCircle',
  TELEGRAM: 'Compass',
  INSTAGRAM: 'Instagram',
  YOUTUBE: 'Video',
  FACEBOOK: 'Facebook',
  LINKEDIN: 'Linkedin',
  TWITTER: 'Twitter',
  EMAIL: 'Mail',
  WEBSITE: 'Globe',
};

const lucideMap = {
  MessageCircle,
  Compass,
  Instagram,
  Video,
  Facebook,
  Linkedin,
  Twitter,
  Mail,
  Globe,
};

const SocialLinksManagement = () => {
  const [links, setLinks] = useState([]);
  const [selectedLink, setSelectedLink] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Form states
  const [platform, setPlatform] = useState('WHATSAPP');
  const [displayName, setDisplayName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('MessageCircle');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/social-links');
      const data = res.data?.data || [];
      setLinks(data);
      if (data.length > 0) {
        handleSelectLink(data[0]);
      } else {
        handleCreateNewLink();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch social links');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSelectLink = (link) => {
    setSelectedLink(link);
    setPlatform(link.platform);
    setDisplayName(link.displayName);
    setUrl(link.url);
    setIcon(link.icon);
    setDisplayOrder(link.displayOrder);
    setIsActive(link.isActive);
  };

  const handleCreateNewLink = () => {
    setSelectedLink(null);
    setPlatform('WHATSAPP');
    setDisplayName('WhatsApp Join Link');
    setUrl('https://chat.whatsapp.com/EG1Xfx2JylM0SISodwhLh2?s=cl&p=a&ilr=0');
    setIcon('MessageCircle');
    setDisplayOrder(links.length > 0 ? Math.max(...links.map((l) => l.displayOrder)) + 1 : 0);
    setIsActive(true);
  };

  const handlePlatformChange = (p) => {
    setPlatform(p);
    // Set matching default icon
    const defaultIcon = iconOptions[p] || 'Globe';
    setIcon(defaultIcon);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!displayName || !url || !icon) {
      toast.error('All details are required');
      return;
    }

    setIsSubmitLoading(true);
    const payload = {
      platform,
      displayName,
      url,
      icon,
      displayOrder: parseInt(displayOrder, 10) || 0,
      isActive,
    };

    try {
      if (selectedLink) {
        // Edit existing link
        const res = await api.put(`/admin/social-links/${selectedLink.id}`, payload);
        toast.success('Social link updated successfully');
        setLinks((prev) =>
          prev
            .map((item) => (item.id === selectedLink.id ? res.data.data : item))
            .sort((a, b) => a.displayOrder - b.displayOrder)
        );
        setSelectedLink(res.data.data);
      } else {
        // Create new link
        const res = await api.post('/admin/social-links', payload);
        toast.success('New social link registered');
        const newList = [...links, res.data.data].sort((a, b) => a.displayOrder - b.displayOrder);
        setLinks(newList);
        setSelectedLink(res.data.data);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save social link');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleToggleActive = async (linkId, currentActive) => {
    try {
      const res = await api.patch(`/admin/social-links/${linkId}/status`, {
        isActive: !currentActive,
      });
      toast.success('Visibility status updated');
      setLinks((prev) => prev.map((item) => (item.id === linkId ? res.data.data : item)));
      if (selectedLink?.id === linkId) {
        setIsActive(!currentActive);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (linkId) => {
    if (!window.confirm('Delete this social link integration permanently?')) return;
    try {
      await api.delete(`/admin/social-links/${linkId}`);
      toast.success('Social link deleted');
      const newList = links.filter((item) => item.id !== linkId);
      setLinks(newList);
      if (newList.length > 0) {
        handleSelectLink(newList[0]);
      } else {
        handleCreateNewLink();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete social link');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    if (index === 0 && direction === 'up') return;
    if (index === links.length - 1 && direction === 'down') return;

    const newList = [...links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap orders locally
    const tempOrder = newList[index].displayOrder;
    newList[index].displayOrder = newList[targetIndex].displayOrder;
    newList[targetIndex].displayOrder = tempOrder;

    // Sort list
    newList.sort((a, b) => a.displayOrder - b.displayOrder);
    setLinks(newList);

    try {
      const orders = newList.map((item, idx) => ({ id: item.id, displayOrder: idx }));
      const res = await api.patch('/admin/social-links/reorder', { orders });
      setLinks(res.data.data);
    } catch (err) {
      toast.error('Failed to save display ordering');
      fetchLinks(); // revert on fail
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border/60 pb-5">
          <div>
            <h1 className="text-xl font-bold font-display text-white">Social & Community Management</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Configure active integration channels like WhatsApp Community, Telegram Channels, and social handles.
            </p>
          </div>
          <Button
            variant="gold"
            size="sm"
            onClick={handleCreateNewLink}
            leftIcon={<PlusCircle size={14} />}
            className="!text-xs !py-2.5 self-start sm:self-center"
          >
            Add New Connection
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-zinc-950 border border-brand-border/40 rounded-3xl">
            <Loader message="Loading social accounts configurations..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left list column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-950 border border-brand-border/40 rounded-2xl overflow-hidden">
                <div className="p-3 bg-zinc-900/60 border-b border-brand-border/40 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Active Connections ({links.length})
                </div>
                
                {links.length === 0 ? (
                  <div className="p-8 text-center text-xs text-zinc-500">
                    No active connections. Click 'Add New Connection' to start.
                  </div>
                ) : (
                  <div className="divide-y divide-brand-border/20">
                    {links.map((link, idx) => {
                      const LucideIcon = lucideMap[link.icon] || Globe;
                      return (
                        <div
                          key={link.id}
                          className={`p-3.5 flex items-center justify-between transition-colors cursor-pointer ${
                            selectedLink?.id === link.id
                              ? 'bg-brand-purple/10'
                              : 'hover:bg-zinc-900/40'
                          }`}
                          onClick={() => handleSelectLink(link)}
                        >
                          <div className="flex items-center gap-3 truncate pr-4">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 shrink-0">
                              <LucideIcon size={14} />
                            </div>
                            <div className="truncate text-left">
                              <h4 className="text-xs font-bold text-white leading-tight truncate">
                                {link.displayName}
                              </h4>
                              <span className="text-[9px] font-semibold text-zinc-500 uppercase font-mono mt-0.5 block">
                                {link.platform}
                              </span>
                            </div>
                          </div>

                          {/* Control actions */}
                          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            {/* Up down order */}
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMoveOrder(idx, 'up')}
                              className="p-1 rounded text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-colors"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              disabled={idx === links.length - 1}
                              onClick={() => handleMoveOrder(idx, 'down')}
                              className="p-1 rounded text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-colors"
                            >
                              <ArrowDown size={12} />
                            </button>

                            {/* Active toggle */}
                            <button
                              onClick={() => handleToggleActive(link.id, link.isActive)}
                              className={`p-1 rounded transition-colors ${
                                link.isActive ? 'text-green-400 hover:text-green-500' : 'text-zinc-600 hover:text-zinc-500'
                              }`}
                              title={link.isActive ? 'Active - Click to Disable' : 'Disabled - Click to Enable'}
                            >
                              {link.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(link.id)}
                              className="p-1 rounded text-zinc-600 hover:text-red-400 transition-colors"
                              title="Delete Link"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Real-time Widget Preview Panel */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-brand-border/40 space-y-4">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block text-left">
                  Widget Preview (Contact Screen)
                </span>
                <div className="p-4 rounded-xl border bg-black/40 border-brand-border/40 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-brand-gold shrink-0">
                    {React.createElement(lucideMap[icon] || Globe, { size: 18 })}
                  </div>
                  <div className="space-y-0.5 text-left truncate">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
                      {platform}
                    </span>
                    <span className="text-sm font-semibold text-white truncate block">
                      {displayName || 'Preview Label'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right edit form column */}
            <form onSubmit={handleSave} className="lg:col-span-7 bg-zinc-950 border border-brand-border/40 p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-display text-white">
                  {selectedLink ? `Modify: ${selectedLink.displayName}` : 'Add New Connection'}
                </h3>
                <p className="text-zinc-500 text-xs">
                  Fill in the details to register or update the dynamic community integration coordinates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Platform select */}
                <div className="w-full">
                  <label htmlFor="platform" className="form-label block text-xs font-semibold text-zinc-400 mb-1.5">
                    Platform Platform
                  </label>
                  <select
                    id="platform"
                    value={platform}
                    onChange={(e) => handlePlatformChange(e.target.value)}
                    className="form-input w-full !bg-brand-dark"
                  >
                    {allowedPlatforms.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Icon Selection */}
                <div className="w-full">
                  <label htmlFor="icon" className="form-label block text-xs font-semibold text-zinc-400 mb-1.5">
                    Lucide Icon
                  </label>
                  <select
                    id="icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="form-input w-full !bg-brand-dark"
                  >
                    {Object.keys(iconOptions).map((k) => (
                      <option key={iconOptions[k]} value={iconOptions[k]}>
                        {iconOptions[k]} (mapping {k})
                      </option>
                    ))}
                    <option value="Globe">Globe (Default)</option>
                  </select>
                </div>
              </div>

              <Input
                id="displayName"
                label="Display Label Text"
                placeholder="e.g. Join Official Channel"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />

              <Input
                id="url"
                label="Redirect URL / Link"
                placeholder="e.g. https://wa.me/... or https://t.me/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                <Input
                  id="displayOrder"
                  label="Sort Display Weight"
                  type="number"
                  placeholder="0"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                  hint="Lower weights display first."
                />

                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`text-2xl transition-colors ${
                      isActive ? 'text-green-400' : 'text-zinc-600'
                    }`}
                  >
                    {isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                  <span className="text-xs font-bold text-zinc-400">
                    {isActive ? 'Connection Enabled' : 'Connection Disabled'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border/20 flex gap-3">
                <Button
                  type="submit"
                  variant="gold"
                  isLoading={isSubmitLoading}
                  leftIcon={<Save size={14} />}
                  className="!text-xs !py-2.5"
                >
                  Save Connection Details
                </Button>
                {selectedLink && (
                  <Button
                    variant="outline"
                    onClick={handleCreateNewLink}
                    className="!text-xs !py-2.5"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SocialLinksManagement;
