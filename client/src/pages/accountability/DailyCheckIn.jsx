import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { AccountabilityService } from '../../services/accountability.service.js';
import CheckInForm from '../../components/accountability/CheckInForm.jsx';

const DailyCheckIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmitCheckin = async (checkinData) => {
    setLoading(true);
    try {
      await AccountabilityService.createCheckin(checkinData);
      toast.success('Daily study check-in submitted successfully!');
      navigate('/accountability');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to submit check-in.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Back navigation */}
      <div className="border-b border-brand-border/40 pb-4 flex justify-between items-center">
        <Link
          to="/accountability"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-all font-semibold uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-xs text-brand-gold font-semibold uppercase tracking-widest font-display">
          <Sparkles size={12} /> Study Logging
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
          Daily Study Check-in
        </h1>
        <p className="text-zinc-500 text-xs max-w-sm mx-auto">
          Log studied duration, check off syllabus targets, and log emotional metrics.
        </p>
      </div>

      <CheckInForm onSubmit={handleSubmitCheckin} isLoading={loading} />
    </div>
  );
};

export default DailyCheckIn;
