import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import DoubtCard from '../../components/mentorship/DoubtCard.jsx';
import DoubtForm from '../../components/mentorship/DoubtForm.jsx';
import LoadingSkeleton from '../../components/mentorship/LoadingSkeleton.jsx';
import EmptyState from '../../components/mentorship/EmptyState.jsx';
import { HelpCircle, Plus, X, Search, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

const Doubts = () => {
  const { user } = useAuth();
  const role = user?.role;

  const [doubts, setDoubts] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search state
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal toggle
  const [showRaiseDoubtModal, setShowRaiseDoubtModal] = useState(false);
  const [submittingDoubt, setSubmittingDoubt] = useState(false);

  const fetchDoubts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/doubts');
      setDoubts(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve doubts discussion threads.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      const res = await api.get('/mentors');
      setMentors(res.data.data);
    } catch (err) {
      console.error('Failed to retrieve mentors for select dropdown', err);
    }
  };

  useEffect(() => {
    fetchDoubts();
    if (role === 'STUDENT') {
      fetchMentors();
    }
  }, [role]);

  const handleRaiseDoubtSubmit = async (doubtData) => {
    setSubmittingDoubt(true);
    try {
      await api.post('/doubts', doubtData);
      toast.success('Doubt raised successfully! Your mentor will reply shortly.');
      setShowRaiseDoubtModal(false);
      fetchDoubts();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit doubt request. Please check inputs.');
    } finally {
      setSubmittingDoubt(false);
    }
  };

  // Filter logic
  const filteredDoubts = doubts.filter((d) => {
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && d.priority !== priorityFilter) return false;
    if (searchTerm.trim()) {
      const sLower = searchTerm.toLowerCase();
      return (
        d.questionTitle.toLowerCase().includes(sLower) ||
        d.subject.toLowerCase().includes(sLower) ||
        d.questionText.toLowerCase().includes(sLower)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-display tracking-tight flex items-center gap-2">
            <HelpCircle className="text-brand-gold" />
            Doubt Support
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {role === 'STUDENT'
              ? 'Submit questions on cost equations, corporate compliance, and legal chapters. Get replies from experts.'
              : 'Reply to questions posted by your assigned students and help them resolve concept hurdles.'}
          </p>
        </div>

        {role === 'STUDENT' && (
          <button
            onClick={() => setShowRaiseDoubtModal(true)}
            className="flex items-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-purple-light text-white font-bold text-sm shadow-purple-glow hover:scale-[1.02] active:scale-100 transition-all w-fit"
          >
            <Plus size={16} />
            <span>Raise a Doubt</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-brand-dark/30 border border-brand-border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search doubt titles, subjects..."
            className="w-full bg-black/40 border border-brand-border rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-purple"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-end w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 font-bold">Status:</span>
            <div className="flex bg-white/5 border border-brand-border p-1 rounded-lg gap-1">
              {['ALL', 'OPEN', 'PENDING_REPLY', 'RESOLVED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded font-semibold text-[10px] uppercase tracking-wide transition-all ${
                    statusFilter === status
                      ? 'bg-brand-purple text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {status === 'PENDING_REPLY' ? 'Replied' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 font-bold">Priority:</span>
            <div className="flex bg-white/5 border border-brand-border p-1 rounded-lg gap-1">
              {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => setPriorityFilter(priority)}
                  className={`px-2.5 py-1 rounded font-semibold text-[10px] uppercase tracking-wide transition-all ${
                    priorityFilter === priority
                      ? 'bg-brand-purple text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingSkeleton type="card" count={4} />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
          {error}
        </div>
      ) : filteredDoubts.length === 0 ? (
        <EmptyState
          title="No doubts found"
          message="No doubts match the selected criteria. Feel free to submit a new doubt or edit your search query."
          icon={HelpCircle}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {filteredDoubts.map((doubt) => (
            <DoubtCard key={doubt.id} doubt={doubt} role={role} />
          ))}
        </div>
      )}

      {/* Raise Doubt Drawer Modal */}
      {showRaiseDoubtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-brand-dark border border-brand-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setShowRaiseDoubtModal(false)}
              className="absolute right-4 top-4 p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-display text-white">Raise a Study Doubt</h3>
              <p className="text-xs text-zinc-400">
                Submit your query. It will be assigned to your chosen mentor for review.
              </p>
            </div>

            <DoubtForm
              mentors={mentors}
              onSubmit={handleRaiseDoubtSubmit}
              isSubmitting={submittingDoubt}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Doubts;
