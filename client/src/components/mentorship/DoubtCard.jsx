import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, AlertCircle, Clock } from 'lucide-react';

const DoubtCard = ({ doubt, role }) => {
  const { id, subject, questionTitle, questionText, priority, status, updatedAt, student, mentor } = doubt;

  const dateObj = new Date(updatedAt);
  const timeFormatted = dateObj.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getPriorityStyle = () => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const getStatusStyle = () => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'PENDING_REPLY':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'OPEN':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30';
    }
  };

  return (
    <div className="bg-brand-dark/40 backdrop-blur-md border border-brand-border rounded-2xl p-5 space-y-4 hover:border-brand-purple/20 transition-all duration-300">
      {/* Subject and Badges row */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <span className="text-xs font-black text-brand-purple tracking-wide uppercase">
          {subject}
        </span>
        <div className="flex gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${getPriorityStyle()} uppercase tracking-wider`}>
            {priority}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${getStatusStyle()} uppercase tracking-wider`}>
            {status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Title & snippet */}
      <div className="space-y-1.5">
        <h4 className="text-base font-bold text-white tracking-tight leading-snug truncate" title={questionTitle}>
          {questionTitle}
        </h4>
        <p className="text-xs text-zinc-400 line-clamp-2">
          {questionText}
        </p>
      </div>

      {/* Meta info footer */}
      <div className="flex items-center justify-between pt-2 border-t border-brand-border/40 text-[11px] text-zinc-500">
        <div className="flex items-center gap-1.5">
          <Clock size={12} />
          <span>Updated {timeFormatted}</span>
        </div>

        {role === 'STUDENT' ? (
          <span>Mentor: <strong className="text-zinc-300">{mentor?.fullName}</strong></span>
        ) : (
          <span>Student: <strong className="text-zinc-300">{student?.name}</strong></span>
        )}
      </div>

      {/* View Thread button */}
      <Link
        to={`/mentorship/doubts/${id}`}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-white/5 border border-brand-border hover:bg-white/10 hover:border-zinc-700 text-xs font-semibold rounded-xl text-zinc-300 hover:text-white transition-all duration-200"
      >
        <MessageSquare size={13} />
        <span>View Discussion Thread</span>
      </Link>
    </div>
  );
};

export default DoubtCard;
