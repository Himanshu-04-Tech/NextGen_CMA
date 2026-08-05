import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import SearchBar from '../../components/admin/SearchBar.jsx';
import MentorTable from '../../components/admin/MentorTable.jsx';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import ConfirmationModal from '../../components/admin/ConfirmationModal.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { GraduationCap, Plus, KeyRound, Copy, Check } from 'lucide-react';

const Mentors = () => {
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState(null);

  // Temporary password success state
  const [tempPassword, setTempPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/mentor-management', {
        params: { search: search.trim() || undefined },
      });
      setMentors(res.data.data);
    } catch (err) {
      toast.error('Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [search]);

  const handleDeleteClick = (id) => {
    setSelectedMentorId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteModalOpen(false);
    try {
      await api.delete(`/admin/mentor-management/${selectedMentorId}`);
      toast.success('Mentor profile deleted successfully');
      fetchMentors();
    } catch (err) {
      toast.error('Failed to delete mentor profile');
    }
  };

  const handleResetPassword = async (id) => {
    try {
      const res = await api.post(`/admin/mentor-management/${id}/reset-password`);
      setTempPassword(res.data.data.tempPassword);
    } catch (err) {
      toast.error('Failed to reset mentor password');
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    toast.success('Password copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-xs">
        {/* Header banner */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-white font-display uppercase tracking-wider">
              Mentor Directory
            </h1>
            <p className="text-xs text-zinc-400">
              Manage active CMA experts, credentials, and students assignments.
            </p>
          </div>
          <Link
            to="/admin/mentors/create"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold-dark to-brand-gold text-black text-xs font-black font-display uppercase hover:scale-[1.02] shadow-gold-glow transition-all"
          >
            <Plus size={14} />
            Onboard Mentor
          </Link>
        </div>

        {/* Temporary password alert banner */}
        {tempPassword && (
          <div className="p-4 bg-brand-purple/10 border border-brand-purple/35 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slideDown">
            <div className="flex items-start gap-3">
              <KeyRound size={20} className="text-brand-gold mt-0.5 shrink-0 animate-pulse" />
              <div>
                <h4 className="font-bold text-white text-sm">Temporary Password Generated</h4>
                <p className="text-zinc-400 text-[10px]">
                  Provide this password to the mentor for initial authentication. They can change it in settings.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black bg-zinc-900 border border-brand-border text-brand-gold px-3.5 py-1.5 rounded-xl font-display text-sm tracking-widest select-all">
                {tempPassword}
              </span>
              <button
                onClick={handleCopyPassword}
                className="p-2 rounded-xl bg-white/5 border border-brand-border text-zinc-300 hover:text-white transition-all hover:bg-white/10"
                title="Copy temporary password"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
              <button
                onClick={() => setTempPassword('')}
                className="px-3 py-1.5 bg-brand-purple text-white font-bold rounded-xl hover:bg-brand-purple/80"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex bg-brand-dark/20 border border-brand-border/40 p-4 rounded-2xl">
          <SearchBar value={search} onChange={setSearch} placeholder="Search mentors by name or specialization..." />
        </div>

        {/* Table list */}
        {loading ? (
          <LoadingSkeleton type="table" count={5} />
        ) : mentors.length === 0 ? (
          <EmptyState title="No mentors onboarded yet" icon={GraduationCap} />
        ) : (
          <MentorTable
            mentors={mentors}
            onResetPassword={handleResetPassword}
            onDelete={handleDeleteClick}
          />
        )}

        {/* Confirmation modals */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          title="Delete Mentor Account?"
          message="Are you sure you want to permanently delete this mentor account? This action cascades and removes all availability and associated session links."
          confirmText="Delete Account"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      </div>
    </AdminLayout>
  );
};

export default Mentors;
