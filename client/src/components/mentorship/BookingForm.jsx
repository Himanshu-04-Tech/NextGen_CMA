import React, { useState } from 'react';
import { Video, User, FileText, CheckCircle2 } from 'lucide-react';
import AvailabilityCalendar from './AvailabilityCalendar.jsx';

const BookingForm = ({ mentor, onSubmit, isSubmitting = false }) => {
  const [meetingPlatform, setMeetingPlatform] = useState('GOOGLE_MEET');
  const [scheduledAt, setScheduledAt] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!scheduledAt) {
      setError('Please select a date and an available time slot from the calendar.');
      return;
    }

    onSubmit({
      mentorId: mentor.id,
      scheduledAt,
      meetingPlatform,
      notes: notes.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Availability Calendar Slot Picker */}
      <div className="bg-white/5 border border-brand-border rounded-2xl p-6">
        <AvailabilityCalendar
          availabilities={mentor.availabilities}
          onSelectSlot={(isoString) => {
            setScheduledAt(isoString);
            setError(null);
          }}
        />
      </div>

      {/* 2. Meeting Platform Choice */}
      <div className="bg-white/5 border border-brand-border rounded-2xl p-6 space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Video size={16} className="text-brand-purple" />
          Choose Meeting Platform
        </h4>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'GOOGLE_MEET', label: 'Google Meet', icon: Video },
            { id: 'ZOOM', label: 'Zoom Video', icon: Video },
            { id: 'OFFLINE', label: 'In Person', icon: User },
          ].map((platform) => {
            const isSelected = meetingPlatform === platform.id;
            const Icon = platform.icon;
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => setMeetingPlatform(platform.id)}
                className={`py-3 px-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold ${
                  isSelected
                    ? 'bg-brand-purple/20 text-white border-brand-purple shadow-purple-glow'
                    : 'bg-white/5 border-brand-border text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <Icon size={18} className={isSelected ? 'text-brand-gold' : 'text-zinc-500'} />
                <span>{platform.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Session Notes */}
      <div className="bg-white/5 border border-brand-border rounded-2xl p-6 space-y-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <FileText size={16} className="text-brand-purple" />
          Add Notes for Mentor
        </h4>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="E.g., I want to discuss standard costing formulas and resolve clear doubts from Intermediate Paper 8 study materials..."
          rows={4}
          maxLength={500}
          className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple resize-none transition-colors"
        />
        <div className="text-right text-[10px] text-zinc-500">
          {notes.length}/500 characters
        </div>
      </div>

      {error && (
        <div className="p-3 text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
          {error}
        </div>
      )}

      {/* 4. Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-dark text-black font-black font-display tracking-wide uppercase hover:scale-[1.01] hover:shadow-gold-glow-lg active:scale-100 disabled:opacity-50 transition-all duration-200"
      >
        {isSubmitting ? 'Confirming Booking...' : 'Confirm Mentorship Session Booking'}
      </button>
    </form>
  );
};

export default BookingForm;
