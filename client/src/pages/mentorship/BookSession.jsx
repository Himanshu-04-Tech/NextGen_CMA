import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api.js';
import BookingForm from '../../components/mentorship/BookingForm.jsx';
import LoadingSkeleton from '../../components/mentorship/LoadingSkeleton.jsx';
import { ArrowLeft, CalendarCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const BookSession = () => {
  const { id } = useParams(); // mentorId
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentor = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/mentors/${id}`);
        setMentor(res.data.data);
      } catch (err) {
        console.error(err);
        setError('Selected mentor profile not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [id]);

  const handleBookingSubmit = async (bookingData) => {
    setSubmitting(true);
    try {
      await api.post('/mentorship-bookings', bookingData);
      toast.success('Mentorship session booked successfully!');
      navigate('/mentorship/bookings');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Conflict: This slot is no longer available.';
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton type="detail" count={1} />;
  }

  if (error || !mentor) {
    return (
      <div className="space-y-4">
        <Link to="/mentorship/mentors" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Browse</span>
        </Link>
        <div className="p-8 text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
          {error || 'Mentor profile not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        to={`/mentorship/mentor/${mentor.id}`}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors w-fit"
      >
        <ArrowLeft size={14} />
        <span>Back to Profile</span>
      </Link>

      {/* Profile summary row */}
      <div className="flex gap-4 items-center bg-white/5 border border-brand-border rounded-2xl p-5">
        <div className="w-14 h-14 rounded-xl bg-zinc-800 border border-brand-border overflow-hidden flex items-center justify-center text-brand-gold shrink-0">
          {mentor.profileImage ? (
            <img src={mentor.profileImage} alt={mentor.fullName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold font-display">{mentor.fullName.charAt(0)}</span>
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold text-white leading-snug flex items-center gap-2">
            Book 1-on-1 Session
            <CalendarCheck size={16} className="text-brand-gold" />
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Scheduling mentorship with <strong className="text-brand-gold font-semibold">{mentor.fullName}</strong> ({mentor.specialization})
          </p>
        </div>
      </div>

      {/* Main Booking Form */}
      <BookingForm mentor={mentor} onSubmit={handleBookingSubmit} isSubmitting={submitting} />
    </div>
  );
};

export default BookSession;
