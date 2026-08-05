import React, { useState } from 'react';
import { Award, BrainCircuit, AlertTriangle, Calendar } from 'lucide-react';

const ReviewForm = ({ students = [], onSubmit, isSubmitting = false }) => {
  const [studentId, setStudentId] = useState('');
  const [overallScore, setOverallScore] = useState(80);
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [actionItems, setActionItems] = useState('');
  const [mentorNotes, setMentorNotes] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!studentId) {
      setError('Please select a student to write the performance review for.');
      return;
    }
    if (!strengths.trim()) {
      setError('Please highlight at least one key strength.');
      return;
    }
    if (!weaknesses.trim()) {
      setError('Please specify at least one area of improvement.');
      return;
    }
    if (!actionItems.trim()) {
      setError('Please provide action items or study strategy recommendation.');
      return;
    }

    onSubmit({
      studentId,
      overallScore: Number(overallScore),
      strengths: strengths.trim(),
      weaknesses: weaknesses.trim(),
      actionItems: actionItems.trim(),
      mentorNotes: mentorNotes.trim() || null,
      nextReviewDate: nextReviewDate || null,
    });

    // Reset fields
    setStrengths('');
    setWeaknesses('');
    setActionItems('');
    setMentorNotes('');
    setNextReviewDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 1. Student Selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Select Student</label>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
        >
          <option value="" className="bg-brand-dark">-- Choose Assigned Student --</option>
          {students.map((s) => (
            <option key={s.id} value={s.id} className="bg-brand-dark">
              {s.name} ({s.email})
            </option>
          ))}
        </select>
      </div>

      {/* 2. Score Slider */}
      <div className="space-y-2 bg-white/5 border border-brand-border rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Overall Score Evaluation</label>
          <span className="text-lg font-black text-brand-gold font-display">{overallScore} / 100</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={overallScore}
          onChange={(e) => setOverallScore(e.target.value)}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-gold"
        />
      </div>

      {/* 3. Strengths & Weaknesses Textareas */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Award size={12} className="text-emerald-400" />
            <span>Key Strengths</span>
          </label>
          <textarea
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            placeholder="What concepts does the student grasp well? E.g., strong understanding of contract acts and legal communications..."
            rows={4}
            className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple placeholder-zinc-600 resize-none transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle size={12} className="text-red-400" />
            <span>Areas of Improvement</span>
          </label>
          <textarea
            value={weaknesses}
            onChange={(e) => setWeaknesses(e.target.value)}
            placeholder="What topics require more focus? E.g., struggles with overhead calculations and material costing variances..."
            rows={4}
            className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple placeholder-zinc-600 resize-none transition-colors"
          />
        </div>
      </div>

      {/* 4. Action Plan / Study Strategy */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
          <BrainCircuit size={12} className="text-brand-purple" />
          <span>Recommended Action Plan & Study Strategy</span>
        </label>
        <textarea
          value={actionItems}
          onChange={(e) => setActionItems(e.target.value)}
          placeholder="Step-by-step topics to cover: E.g., 1. Practice 10 cost sheet numericals daily. 2. Read chapters 3 and 4 of indirect taxes..."
          rows={4}
          className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple placeholder-zinc-600 resize-none transition-colors"
        />
      </div>

      {/* 5. Next Review Date & Mentor Notes */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar size={12} />
            <span>Next Recommended Review (Optional)</span>
          </label>
          <input
            type="date"
            value={nextReviewDate}
            onChange={(e) => setNextReviewDate(e.target.value)}
            className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Additional Private Notes</label>
          <input
            type="text"
            value={mentorNotes}
            onChange={(e) => setMentorNotes(e.target.value)}
            placeholder="E.g., Student is hardworking but lacks calculation speed."
            className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple placeholder-zinc-600"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-dark text-black font-black font-display tracking-wide uppercase hover:scale-[1.01] hover:shadow-gold-glow-lg active:scale-100 disabled:opacity-50 transition-all duration-200"
      >
        {isSubmitting ? 'Submitting evaluation...' : 'Publish Performance Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
