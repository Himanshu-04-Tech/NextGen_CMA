import React from 'react';
import { Calendar, Award, CheckSquare, BrainCircuit, MessageSquareText } from 'lucide-react';

const PerformanceCard = ({ review, role }) => {
  const { reviewDate, overallScore, strengths, weaknesses, actionItems, mentorNotes, nextReviewDate, mentor, student } = review;

  const dateObj = new Date(reviewDate);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 50) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-red-400 border-red-500/20 bg-red-500/5';
  };

  return (
    <div className="bg-brand-dark/40 backdrop-blur-md border border-brand-border rounded-2xl p-6 space-y-6 hover:border-brand-purple/20 transition-all duration-300">
      {/* Top section: Date, Evaluator name & Overall Score */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border/40 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
            <Calendar size={14} className="text-brand-purple" />
            <span>Reviewed on {formattedDate}</span>
          </div>
          <h4 className="text-base font-black text-white font-display tracking-wide">
            {role === 'STUDENT' ? `Evaluator: ${mentor?.fullName}` : `Student: ${student?.name}`}
          </h4>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
            {role === 'STUDENT' ? mentor?.specialization : `Level: ${student?.cmaLevel}`}
          </span>
        </div>

        {/* Big visual score */}
        <div className={`flex flex-col items-center justify-center p-3 rounded-xl border w-24 shrink-0 ${getScoreColor(overallScore)}`}>
          <span className="text-2xl font-black font-display leading-none">{overallScore}</span>
          <span className="text-[9px] uppercase tracking-wider font-bold mt-1 text-zinc-400">Score / 100</span>
        </div>
      </div>

      {/* Grid: Strengths and Weaknesses */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
          <h5 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Award size={14} />
            <span>Key Strengths</span>
          </h5>
          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
            {strengths}
          </p>
        </div>

        {/* Weaknesses */}
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-2">
          <h5 className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
            <AlertSquareIcon size={14} />
            <span>Areas of Improvement</span>
          </h5>
          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
            {weaknesses}
          </p>
        </div>
      </div>

      {/* Action Items / Strategy Plan */}
      <div className="p-4 rounded-xl bg-brand-purple/5 border border-brand-purple/15 space-y-2.5">
        <h5 className="text-xs font-black uppercase tracking-wider text-brand-purple flex items-center gap-1.5">
          <BrainCircuit size={14} className="text-brand-gold" />
          <span>Recommended Study Plan & Action Items</span>
        </h5>
        <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
          {actionItems}
        </p>
      </div>

      {/* Mentor notes */}
      {mentorNotes && (
        <div className="space-y-1.5">
          <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <MessageSquareText size={14} />
            <span>Additional Notes</span>
          </h5>
          <p className="text-xs text-zinc-300 leading-relaxed italic whitespace-pre-line bg-black/20 p-3.5 rounded-xl border border-brand-border/40">
            "{mentorNotes}"
          </p>
        </div>
      )}

      {/* Next review date if set */}
      {nextReviewDate && (
        <div className="pt-2 flex justify-end text-xs">
          <span className="bg-brand-gold/10 border border-brand-gold/20 text-brand-gold px-3.5 py-1.5 rounded-lg font-bold">
            Next Scheduled Evaluation: {new Date(nextReviewDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      )}
    </div>
  );
};

// Simple alert fallback icon
const AlertSquareIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

export default PerformanceCard;
