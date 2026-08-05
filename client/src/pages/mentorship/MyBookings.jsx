import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import BookingCard from '../../components/mentorship/BookingCard.jsx';
import LoadingSkeleton from '../../components/mentorship/LoadingSkeleton.jsx';
import EmptyState from '../../components/mentorship/EmptyState.jsx';
import AvailabilityCalendar from '../../components/mentorship/AvailabilityCalendar.jsx';
import { CalendarRange, X, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Reschedule state
  const [activeReschedule, setActiveReschedule] = useState(null); // booking model
  const [mentorAvailabilities, setMentorAvailabilities] = useState([]);
  const [selectedNewSlot, setSelectedNewSlot] = useState(null);
  const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/mentorship-bookings');
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve your booked mentorship sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const confirmMsg = newStatus === 'CANCELLED' ? 'Are you sure you want to cancel this session?' : `Confirm changing status to ${newStatus}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await api.patch(`/mentorship-bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Booking successfully marked as ${newStatus.toLowerCase()}`);
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update booking status.');
    }
  };

  // Open reschedule wizard
  const triggerReschedule = async (booking) => {
    setActiveReschedule(booking);
    setSelectedNewSlot(null);
    try {
      // Fetch mentor's profile to get fresh availabilities
      const res = await api.get(`/mentors/${booking.mentorId}`);
      setMentorAvailabilities(res.data.data.availabilities);
    } catch (err) {
      console.error(err);
      toast.error('Could not fetch mentor availability calendar.');
      setActiveReschedule(null);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!selectedNewSlot) {
      toast.error('Please choose a new time slot first.');
      return;
    }

    setRescheduleSubmitting(true);
    try {
      await api.put(`/mentorship-bookings/${activeReschedule.id}`, {
        scheduledAt: selectedNewSlot,
        meetingPlatform: activeReschedule.meetingPlatform,
      });
      toast.success('Mentorship booking rescheduled successfully!');
      setActiveReschedule(null);
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error('Rescheduling conflict. Please select another slot.');
    } finally {
      setRescheduleSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'ALL') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-display tracking-tight flex items-center gap-2">
            <CalendarRange className="text-brand-gold" />
            My Bookings
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track and manage your upcoming 1-on-1 calls, reschedule slots, or check completed history.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-white/5 border border-brand-border p-1 rounded-xl text-xs gap-1">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all uppercase tracking-wide ${
                statusFilter === tab
                  ? 'bg-brand-purple text-white shadow-purple-glow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.replace('COMPLETED', 'Done').replace('CANCELLED', 'Cancelled')}
            </button>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingSkeleton type="card" count={4} />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
          {error}
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No mentorship bookings found"
          message="You don't have any sessions matching your filter criteria. Go ahead and find a mentor!"
          icon={CalendarRange}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              role="STUDENT"
              onStatusUpdate={handleStatusUpdate}
              onReschedule={triggerReschedule}
            />
          ))}
        </div>
      )}

      {/* Reschedule Overlay Modal */}
      {activeReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-brand-dark border border-brand-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setActiveReschedule(null)}
              className="absolute right-4 top-4 p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              <X size={20} />
            </button>

            <div className="space-y-1.5 pr-8">
              <h3 className="text-xl font-bold font-display text-white">Reschedule Booking</h3>
              <p className="text-xs text-zinc-400">
                Choose a new slot with <strong className="text-brand-gold">{activeReschedule.mentor?.fullName}</strong>.
              </p>
            </div>

            {/* Calendar */}
            <div className="bg-white/5 border border-brand-border rounded-xl p-4">
              <AvailabilityCalendar
                availabilities={mentorAvailabilities}
                onSelectSlot={(isoString) => setSelectedNewSlot(isoString)}
              />
            </div>

            {/* Confirmation actions */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setActiveReschedule(null)}
                className="flex-1 py-3 border border-brand-border rounded-xl text-sm font-semibold hover:bg-white/5 text-zinc-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                disabled={!selectedNewSlot || rescheduleSubmitting}
                className="flex-1 py-3 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-black rounded-xl text-sm font-bold shadow-gold-glow uppercase tracking-wide hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:scale-100 transition-all"
              >
                {rescheduleSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
