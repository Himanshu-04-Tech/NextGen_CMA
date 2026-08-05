import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Mail,
  Search,
  CheckCircle,
  MessageSquare,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Calendar,
  Eye,
  XCircle,
  Inbox,
  CornerUpRight,
} from 'lucide-react';
import api from '../../services/api.js';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Empty = All (except DELETED)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: 8,
        search: search || undefined,
        status: statusFilter || undefined,
      };
      const res = await api.get('/admin/contact-messages', { params });
      const payload = res.data?.data;
      setMessages(payload?.messages || []);
      setTotalPages(payload?.totalPages || 1);
      setTotalMessages(payload?.total || 0);

      // Auto-select first message on list load if none selected
      if (payload?.messages?.length > 0) {
        // Find if current selectedMessage still exists in fresh list
        const stillExists = payload.messages.find((m) => m.id === selectedMessage?.id);
        if (!stillExists) {
          setSelectedMessage(payload.messages[0]);
        } else {
          setSelectedMessage(stillExists);
        }
      } else {
        setSelectedMessage(null);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch contact inquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, statusFilter]);

  // Debounced/Triggered search execution
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMessages();
  };

  const handleUpdateStatus = async (msgId, newStatus) => {
    setIsActionLoading(true);
    try {
      await api.patch(`/admin/contact-messages/${msgId}/status`, { status: newStatus });
      toast.success(`Message marked as ${newStatus.toLowerCase()}`);
      
      // Update local state
      setMessages((prev) =>
        prev.map((msg) => (msg.id === msgId ? { ...msg, status: newStatus } : msg))
      );
      if (selectedMessage?.id === msgId) {
        setSelectedMessage((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    const isDeletedFilter = statusFilter === 'DELETED';
    const confirmMsg = isDeletedFilter
      ? 'Are you sure you want to permanently delete this contact inquiry from database?'
      : 'Move this inquiry to trash (soft-delete)?';
    
    if (!window.confirm(confirmMsg)) return;
    
    setIsActionLoading(true);
    try {
      await api.delete(`/admin/contact-messages/${msgId}`);
      toast.success(isDeletedFilter ? 'Message permanently deleted' : 'Message moved to trash');
      
      // Refresh list
      fetchMessages();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete message');
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      UNREAD: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
      READ: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      REPLIED: 'bg-green-500/10 text-green-400 border border-green-500/20',
      DELETED: 'bg-red-500/10 text-red-400 border border-red-500/20',
    };
    return badges[status] || 'bg-zinc-800 text-zinc-400';
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border/60 pb-5">
          <div>
            <h1 className="text-xl font-bold font-display text-white">Contact Messages</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Manage student queries and platform advisor support inquiries.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 bg-zinc-950 px-2.5 py-1 rounded border border-brand-border/40 font-mono">
              Total: {totalMessages}
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Status Tabs */}
          <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-brand-border/40 w-full md:w-auto overflow-x-auto gap-1">
            <button
              onClick={() => { setStatusFilter(''); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                statusFilter === '' ? 'bg-brand-purple/20 text-white border border-brand-purple/20' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => { setStatusFilter('UNREAD'); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                statusFilter === 'UNREAD' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20' : 'text-zinc-500 hover:text-yellow-500'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => { setStatusFilter('READ'); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                statusFilter === 'READ' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'text-zinc-500 hover:text-blue-400'
              }`}
            >
              Read
            </button>
            <button
              onClick={() => { setStatusFilter('REPLIED'); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                statusFilter === 'REPLIED' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'text-zinc-500 hover:text-green-400'
              }`}
            >
              Replied
            </button>
            <button
              onClick={() => { setStatusFilter('DELETED'); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                statusFilter === 'DELETED' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'text-zinc-500 hover:text-red-400'
              }`}
            >
              Trash
            </button>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-80">
            <Input
              id="search"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="!py-2 !text-xs !bg-zinc-950"
              leftIcon={<Search size={14} />}
            />
            <Button type="submit" variant="outline" className="!py-2 !px-3 shrink-0">
              Go
            </Button>
          </form>
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Messages Column */}
          <div className="lg:col-span-5 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 bg-[#0d0d0d] border border-brand-border/40 rounded-2xl">
                <Loader message="Fetching messages..." />
              </div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center bg-zinc-950 border border-brand-border/40 rounded-2xl flex flex-col items-center justify-center space-y-3">
                <Inbox size={32} className="text-zinc-600 animate-pulse" />
                <p className="text-xs text-zinc-500">No contact inquiries found matching criteria.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${
                      selectedMessage?.id === msg.id
                        ? 'bg-brand-purple/10 border-brand-purple/40 shadow-purple-glow/5'
                        : 'bg-zinc-950 hover:bg-zinc-900 border-brand-border/40'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <h3 className="text-xs font-bold text-white truncate max-w-[150px]">
                        {msg.name}
                      </h3>
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusBadge(msg.status)}`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-zinc-400 truncate mb-2">
                      {msg.subject}
                    </p>
                    <div className="flex justify-between items-center text-[9px] text-zinc-600 font-mono">
                      <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                      {msg.phone && <span className="truncate max-w-[100px]">{msg.phone}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-brand-border bg-zinc-950 hover:bg-zinc-900 text-zinc-500 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[10px] font-semibold text-zinc-500 font-mono">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-brand-border bg-zinc-950 hover:bg-zinc-900 text-zinc-500 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-7">
            {selectedMessage ? (
              <Card className="!p-6 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-purple/[0.01] blur-2xl" />

                {/* Sender Details Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border/40 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0">
                      <User size={18} />
                    </div>
                    <div className="text-left">
                      <h2 className="text-sm font-bold text-white leading-tight">{selectedMessage.name}</h2>
                      <a href={`mailto:${selectedMessage.email}`} className="text-xs text-brand-gold hover:underline block mt-0.5">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg self-start sm:self-center ${getStatusBadge(selectedMessage.status)}`}>
                    {selectedMessage.status}
                  </span>
                </div>

                {/* Sub Metadata */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Phone size={14} className="text-zinc-600 shrink-0" />
                    <span className="font-semibold truncate">
                      {selectedMessage.phone || 'Not provided'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 justify-end">
                    <Calendar size={14} className="text-zinc-600 shrink-0" />
                    <span className="font-semibold font-mono text-[10px]">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Subject and Message Block */}
                <div className="space-y-3.5 text-left bg-black/40 border border-brand-border/40 p-5 rounded-2xl">
                  <div className="border-b border-brand-border/20 pb-2">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Subject</span>
                    <h3 className="text-xs font-bold text-white">{selectedMessage.subject}</h3>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold mb-1">Message</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans white-space-pre-wrap break-words">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-border/40">
                  <div className="flex items-center gap-2">
                    {selectedMessage.status !== 'READ' && selectedMessage.status !== 'REPLIED' && (
                      <Button
                        variant="purple"
                        size="sm"
                        disabled={isActionLoading}
                        onClick={() => handleUpdateStatus(selectedMessage.id, 'READ')}
                        leftIcon={<Eye size={12} />}
                        className="!text-[10px] !py-2 !px-3"
                      >
                        Read
                      </Button>
                    )}

                    {selectedMessage.status !== 'REPLIED' && (
                      <Button
                        variant="gold"
                        size="sm"
                        disabled={isActionLoading}
                        onClick={() => handleUpdateStatus(selectedMessage.id, 'REPLIED')}
                        leftIcon={<CheckCircle size={12} />}
                        className="!text-[10px] !py-2 !px-3"
                      >
                        Replied
                      </Button>
                    )}

                    {/* Email Reply Client shortcut */}
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                      className="flex items-center gap-1.5 py-2 px-3 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition-all hover:border-zinc-700"
                    >
                      <CornerUpRight size={12} /> Reply Email
                    </a>
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    disabled={isActionLoading}
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    leftIcon={<Trash2 size={12} />}
                    className="!text-[10px] !py-2 !px-3"
                  >
                    {statusFilter === 'DELETED' ? 'Permanently Delete' : 'Trash'}
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-zinc-950 border border-brand-border/40 rounded-3xl text-zinc-500">
                <Mail size={36} className="text-zinc-700 animate-pulse mb-3" />
                <span className="text-xs">Select an inquiry from list to examine details.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContactMessages;
