import React from 'react';
import { Calendar, Video, Clock, ExternalLink, RefreshCw, XCircle, CheckCircle2 } from 'lucide-react';

const BookingCard = ({ booking, role, onStatusUpdate, onReschedule }) => {
  const { id, scheduledAt, meetingPlatform, meetingLink, status, notes, student, mentor } = booking;

  const dateObj = new Date(scheduledAt);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusStyle = () => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'RESCHEDULED':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'COMPLETED':
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      case 'CANCELLED':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const isUpcoming = dateObj > new Date();

  return (
    <div className="bg-brand-dark/40 backdrop-blur-md border border-brand-border rounded-2xl p-5 space-y-4 hover:border-brand-purple/20 transition-all duration-300">
      {/* Top row: Status and Scheduled Date */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusStyle()} uppercase tracking-wider`}>
          {status}
        </span>
        <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
          <Calendar size={14} className="text-brand-purple" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Main Details: Student / Mentor name & profile */}
      <div className="flex gap-3.5 items-center bg-white/5 border border-brand-border/40 p-3 rounded-xl">
        {role === 'STUDENT' ? (
          <>
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-brand-border overflow-hidden flex items-center justify-center text-brand-gold shrink-0">
              {mentor?.profileImage ? (
                <img src={mentor.profileImage} alt={mentor.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold font-display">{mentor?.fullName?.charAt(0)}</span>
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">{mentor?.fullName}</h4>
              <p className="text-[11px] text-zinc-400">{mentor?.specialization}</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-brand-border overflow-hidden flex items-center justify-center text-brand-gold shrink-0">
              {student?.profileImage ? (
                <img src={student.profileImage} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold font-display">{student?.name?.charAt(0)}</span>
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">{student?.name}</h4>
              <p className="text-[11px] text-zinc-400">Level: {student?.cmaLevel}</p>
            </div>
          </>
        )}
      </div>

      {/* Platform & Meeting time info */}
      <div className="grid grid-cols-2 gap-3 text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-brand-gold shrink-0" />
          <span>{formattedTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Video size={14} className="text-brand-gold shrink-0" />
          <span className="capitalize">{meetingPlatform.toLowerCase().replace('_', ' ')}</span>
        </div>
      </div>

      {/* Meeting Link row */}
      {status !== 'CANCELLED' && meetingLink && (
        <a
          href={meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2 bg-brand-purple/10 border border-brand-purple/20 hover:bg-brand-purple/20 hover:border-brand-purple/40 text-brand-purple text-xs font-semibold rounded-xl transition-all duration-200"
        >
          <span>Join Meeting ({meetingPlatform === 'GOOGLE_MEET' ? 'Google Meet' : 'Zoom'})</span>
          <ExternalLink size={12} />
        </a>
      )}

      {/* Notes text */}
      {notes && (
        <div className="bg-black/25 rounded-xl p-3 border border-brand-border/20 text-xs">
          <p className="text-zinc-500 font-bold uppercase tracking-wider text-[10px] mb-1">Session notes</p>
          <p className="text-zinc-300 leading-normal italic">"{notes}"</p>
        </div>
      )}

      {/* Control Actions */}
      {isUpcoming && status !== 'CANCELLED' && status !== 'COMPLETED' && (
        <div className="flex gap-2.5 pt-1">
          {/* Cancel button */}
          <button
            onClick={() => onStatusUpdate(id, 'CANCELLED')}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 text-red-400 text-xs font-semibold rounded-xl transition-all"
          >
            <XCircle size={14} />
            <span>Cancel</span>
          </button>

          {/* Reschedule button */}
          <button
            onClick={() => onReschedule(booking)}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 border border-brand-border hover:bg-white/5 text-zinc-300 hover:text-white text-xs font-semibold rounded-xl transition-all"
          >
            <RefreshCw size={13} />
            <span>Reschedule</span>
          </button>

          {/* Mentor confirm button */}
          {role === 'MENTOR' && status === 'PENDING' && (
            <button
              onClick={() => onStatusUpdate(id, 'CONFIRMED')}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-brand-gold text-black hover:scale-[1.02] active:scale-100 text-xs font-bold rounded-xl transition-all shadow-gold-glow"
            >
              <CheckCircle2 size={14} />
              <span>Confirm</span>
            </button>
          )}
        </div>
      )}

      {/* Mentor Complete action if past & confirmed */}
      {!isUpcoming && role === 'MENTOR' && (status === 'CONFIRMED' || status === 'RESCHEDULED') && (
        <button
          onClick={() => onStatusUpdate(id, 'COMPLETED')}
          className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
        >
          <CheckCircle2 size={14} />
          <span>Mark Session Completed</span>
        </button>
      )}
    </div>
  );
};

export default BookingCard;
