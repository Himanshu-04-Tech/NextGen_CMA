import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import BookingCard from '../../components/mentorship/BookingCard.jsx';
import DoubtCard from '../../components/mentorship/DoubtCard.jsx';
import ReviewForm from '../../components/mentorship/ReviewForm.jsx';
import LoadingSkeleton from '../../components/ui/Loader.jsx';
import EmptyState from '../../components/mentorship/EmptyState.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import {
  LayoutDashboard,
  Clock,
  HelpCircle,
  Award,
  Calendar,
  CheckCircle,
  Plus,
  Trash2,
  Users,
  GraduationCap,
  CalendarCheck,
  Star,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MentorDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [mentorProfile, setMentorProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Availability state
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [newDay, setNewDay] = useState(1); // Monday default
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('12:00');
  const [newDuration, setNewDuration] = useState(60);

  // Tab state
  const [activeTab, setActiveTab] = useState('sessions'); // sessions, doubts, reviews, availability, calendar

  const fetchMentorWorkspace = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile
      const profileRes = await api.get('/mentors/my-profile');
      setMentorProfile(profileRes.data.data);
      if (profileRes.data.data?.availabilities) {
        setAvailabilitySlots(profileRes.data.data.availabilities);
      }

      // 2. Fetch bookings
      const bookingsRes = await api.get('/mentorship-bookings');
      setBookings(bookingsRes.data.data);

      // 3. Fetch doubts
      const doubtsRes = await api.get('/doubts');
      setDoubts(doubtsRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load mentor dashboard workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorWorkspace();
  }, []);

  // Listen to tab query changes in Sidebar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['sessions', 'doubts', 'reviews', 'availability', 'calendar'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Update Booking Status
  const handleBookingStatus = async (bookingId, newStatus) => {
    setActionLoading(true);
    try {
      await api.patch(`/mentorship-bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Booking status updated to ${newStatus.toLowerCase()}`);
      
      // Refresh bookings
      const bookingsRes = await api.get('/mentorship-bookings');
      setBookings(bookingsRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to change booking status');
    } finally {
      setActionLoading(false);
    }
  };

  // Add availability slot locally
  const addAvailabilitySlot = () => {
    const [startH, startM] = newStart.split(':').map(Number);
    const [endH, endM] = newEnd.split(':').map(Number);
    if (startH * 60 + startM >= endH * 60 + endM) {
      toast.error('Start time must be strictly before end time');
      return;
    }

    const isDuplicate = availabilitySlots.some(
      (s) => s.dayOfWeek === Number(newDay) && s.startTime === newStart && s.endTime === newEnd
    );
    if (isDuplicate) {
      toast.error('This exact availability slot already exists.');
      return;
    }

    const newSlot = {
      dayOfWeek: Number(newDay),
      startTime: newStart,
      endTime: newEnd,
      slotDuration: Number(newDuration),
      isAvailable: true,
    };

    setAvailabilitySlots([...availabilitySlots, newSlot]);
    toast.success('Slot added to profile schedule list. Click Save Changes to publish.');
  };

  // Delete availability slot locally
  const removeAvailabilitySlot = (index) => {
    const list = [...availabilitySlots];
    list.splice(index, 1);
    setAvailabilitySlots(list);
  };

  // Save Availability slots in DB
  const saveAvailability = async () => {
    setActionLoading(true);
    try {
      await api.put('/mentors/availability', {
        availabilities: availabilitySlots.map((s) => ({
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          slotDuration: s.slotDuration,
        })),
      });
      toast.success('Availability schedule published successfully!');
      
      // Refresh profile
      const profileRes = await api.get('/mentors/my-profile');
      setMentorProfile(profileRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update availability calendar.');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Performance Review
  const handlePublishReview = async (reviewData) => {
    setActionLoading(true);
    try {
      await api.post('/performance-reviews', reviewData);
      toast.success('Performance review evaluation published successfully!');
      setActiveTab('sessions');
      fetchMentorWorkspace();
    } catch (err) {
      console.error(err);
      toast.error('Failed to publish performance evaluation.');
    } finally {
      setActionLoading(false);
    }
  };

  // Extract unique students from bookings list
  const getUniqueStudents = () => {
    const studentsMap = {};
    bookings.forEach((b) => {
      if (b.student) {
        studentsMap[b.student.id] = b.student;
      }
    });
    return Object.values(studentsMap);
  };

  if (loading) {
    return <LoadingSkeleton fullScreen message="Loading mentor workspace..." />;
  }

  if (!mentorProfile) {
    return (
      <div className="text-center p-12 bg-white/5 border border-brand-border rounded-2xl max-w-lg mx-auto space-y-4">
        <h3 className="text-lg font-bold text-white font-display">No Mentor Profile Activated</h3>
        <p className="text-sm text-zinc-400">
          Your account does not have an active mentor profile configured. Please contact the administrator to register your profile.
        </p>
      </div>
    );
  }

  // Filter lists
  const activeBookings = bookings.filter((b) => b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'RESCHEDULED');
  const openDoubts = doubts.filter((d) => d.status === 'OPEN');

  return (
    <div className="space-y-8 text-left animate-fade-in">
      
      {/* ── Greeting Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-brand-gold/[0.03] blur-[80px] pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-brand-purple/15 border border-brand-purple/30 text-xs text-brand-purple-light font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Mentor Workspace
            </span>
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              Faculty Dashboard
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-white">
            Welcome back, {mentorProfile.fullName}!
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Manage your student schedules, reply to doubts, submit academic evaluations, and update your calendar slots.
          </p>
        </div>

        {/* Quick Summary Stats */}
        <div className="relative z-10 flex gap-4 shrink-0">
          <div className="bg-zinc-950/40 border border-brand-border/60 px-5 py-3 rounded-2xl text-center min-w-[100px]">
            <span className="text-2xl font-bold font-display text-brand-gold leading-none">{activeBookings.length}</span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-500 block mt-1">Sessions</span>
          </div>
          <div className="bg-zinc-950/40 border border-brand-border/60 px-5 py-3 rounded-2xl text-center min-w-[100px]">
            <span className="text-2xl font-bold font-display text-brand-purple-light leading-none">{openDoubts.length}</span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-500 block mt-1">Open Doubts</span>
          </div>
        </div>
      </div>

      {/* ── Sub Tabs Navigation ── */}
      <div className="flex border-b border-brand-border/60 gap-8">
        {[
          { id: 'sessions', label: 'Sessions', icon: Clock },
          { id: 'doubts', label: 'Doubt Queue', icon: HelpCircle },
          { id: 'reviews', label: 'Student Reviews', icon: Star },
          { id: 'availability', label: 'Availability', icon: Calendar },
          { id: 'calendar', label: 'Calendar Schedule', icon: CalendarCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-xs uppercase tracking-wider font-bold border-b-2 flex items-center gap-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-brand-gold text-brand-gold font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Workspace Vewport ── */}
      <div className="animate-fade-in">
        
        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
              Active Booking Schedules
            </h3>

            {activeBookings.length === 0 ? (
              <EmptyState
                title="No active sessions scheduled"
                message="You have no pending or confirmed student reservations at this time."
                icon={Clock}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    role="MENTOR"
                    onStatusUpdate={handleBookingStatus}
                    onReschedule={() => toast.error('Mentors should notify students for manual reschedule requests.')}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Doubts Queue Tab */}
        {activeTab === 'doubts' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
              Pending Student Doubts Queue
            </h3>

            {openDoubts.length === 0 ? (
              <EmptyState
                title="No unresolved doubts"
                message="Great job! All student doubts are replied or closed."
                icon={CheckCircle}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {openDoubts.map((doubt) => (
                  <DoubtCard key={doubt.id} doubt={doubt} role="MENTOR" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Write Performance Review Tab */}
        {activeTab === 'reviews' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6 md:p-8 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                  Evaluate Student Performance
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Create detailed study reports and assessments for students who booked sessions.
                </p>
              </div>

              {getUniqueStudents().length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 bg-white/5 border border-brand-border/40 rounded-xl border-dashed">
                  No students have booked or completed a mentorship session with you yet. A session must be scheduled to write evaluations.
                </div>
              ) : (
                <ReviewForm
                  students={getUniqueStudents()}
                  onSubmit={handlePublishReview}
                  isSubmitting={actionLoading}
                />
              )}
            </div>
          </div>
        )}

        {/* Availability Scheduler Tab */}
        {activeTab === 'availability' && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-brand-card border border-brand-border rounded-2xl p-5 md:p-6 space-y-4 md:col-span-1 h-fit">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-1.5 mb-2">
                <Plus size={16} className="text-brand-purple-light" /> Add Slot
              </h3>

              <div className="space-y-4 text-xs text-zinc-300">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-400 uppercase tracking-widest block text-[9px]">Day of Week</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="w-full bg-black/40 border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple"
                  >
                    {DAYS_NAME.map((day, index) => (
                      <option key={index} value={index} className="bg-brand-dark">{day}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-zinc-400 uppercase tracking-widest block text-[9px]">Start Time</label>
                    <input
                      type="time"
                      value={newStart}
                      onChange={(e) => setNewStart(e.target.value)}
                      className="w-full bg-black/40 border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-zinc-400 uppercase tracking-widest block text-[9px]">End Time</label>
                    <input
                      type="time"
                      value={newEnd}
                      onChange={(e) => setNewEnd(e.target.value)}
                      className="w-full bg-black/40 border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-400 uppercase tracking-widest block text-[9px]">Slot Duration</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-black/40 border border-brand-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple"
                  >
                    <option value="30" className="bg-brand-dark">30 Minutes</option>
                    <option value="45" className="bg-brand-dark">45 Minutes</option>
                    <option value="60" className="bg-brand-dark">60 Minutes</option>
                  </select>
                </div>

                <Button
                  type="button"
                  variant="gold"
                  onClick={addAvailabilitySlot}
                  className="w-full"
                >
                  Add Slot
                </Button>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-2xl p-6 md:col-span-2 space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-brand-border/40">
                <div>
                  <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">Active Availability slots</h3>
                  <p className="text-xs text-zinc-500">Define the hours when candidates can schedule sessions.</p>
                </div>
                <Button
                  variant="gold"
                  onClick={saveAvailability}
                  isLoading={actionLoading}
                  className="!py-2 !px-4 !text-xs"
                >
                  Save Changes
                </Button>
              </div>

              {availabilitySlots.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 bg-white/5 border border-brand-border/40 rounded-xl border-dashed">
                  No availability slots defined. Students won't be able to book sessions with you. Use the panel on the left to schedule slots.
                </div>
              ) : (
                <div className="space-y-3">
                  {availabilitySlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-zinc-950/40 border border-brand-border rounded-xl text-xs text-zinc-300"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-brand-gold uppercase tracking-wider text-[10px] w-16 bg-brand-gold/10 py-1 px-2 border border-brand-gold/20 rounded text-center">
                          {DAYS_NAME[slot.dayOfWeek].substring(0, 3)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-brand-gold" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                          <span className="text-[10px] text-zinc-500 font-semibold">({slot.slotDuration} min slots)</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAvailabilitySlot(index)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete slot"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Calendar Schedule View Tab */}
        {activeTab === 'calendar' && (
          <Card>
            <div className="pb-4 border-b border-brand-border/60 mb-6">
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                Calendar Schedule Overview
              </h3>
              <p className="text-xs text-zinc-500">Calendar visualization of your active and upcoming sessions.</p>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {DAYS_NAME.map((day, idx) => (
                <div key={idx} className="p-3 text-center border border-brand-border/40 rounded-xl bg-black/40">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-400 block font-bold">{day.substring(0, 3)}</span>
                  <div className="mt-3 space-y-1">
                    {availabilitySlots
                      .filter(s => s.dayOfWeek === idx)
                      .map((s, slotIdx) => (
                        <span key={slotIdx} className="block text-[8px] bg-brand-purple/10 border border-brand-purple/20 text-brand-purple-light py-0.5 rounded font-mono">
                          {s.startTime}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};

export default MentorDashboard;
