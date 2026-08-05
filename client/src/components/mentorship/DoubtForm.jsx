import React, { useState } from 'react';
import { HelpCircle, AlertTriangle, Paperclip } from 'lucide-react';

const DoubtForm = ({ mentors = [], onSubmit, isSubmitting = false }) => {
  const [mentorId, setMentorId] = useState('');
  const [subject, setSubject] = useState('');
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!mentorId) {
      setError('Please select a mentor to send this doubt to.');
      return;
    }
    if (!subject.trim()) {
      setError('Please specify the subject/paper (e.g. Paper 8: Cost Accounting).');
      return;
    }
    if (!questionTitle.trim()) {
      setError('Please enter a summary title of your doubt.');
      return;
    }
    if (questionText.trim().length < 10) {
      setError('Please describe your doubt in detail (minimum 10 characters).');
      return;
    }

    onSubmit({
      mentorId,
      subject: subject.trim(),
      questionTitle: questionTitle.trim(),
      questionText: questionText.trim(),
      attachmentUrl: attachmentUrl.trim() || null,
      priority,
    });

    // Reset some fields
    setQuestionTitle('');
    setQuestionText('');
    setAttachmentUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 1. Mentor Selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Assign to Mentor</label>
        <select
          value={mentorId}
          onChange={(e) => setMentorId(e.target.value)}
          className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
        >
          <option value="" className="bg-brand-dark">-- Select Mentor --</option>
          {mentors.map((m) => (
            <option key={m.id} value={m.id} className="bg-brand-dark">
              {m.fullName} ({m.specialization})
            </option>
          ))}
        </select>
      </div>

      {/* 2. Subject & Priority Row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Subject / Paper</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="E.g., Paper 7: Direct Taxation"
            className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple placeholder-zinc-600"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Set Priority</label>
          <div className="grid grid-cols-3 gap-2">
            {['LOW', 'MEDIUM', 'HIGH'].map((p) => {
              const isSelected = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    isSelected
                      ? p === 'HIGH'
                        ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-red-glow/10'
                        : p === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-glow/10'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-glow/10'
                      : 'bg-white/5 border-brand-border text-zinc-400 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Question Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Question Title</label>
        <input
          type="text"
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
          placeholder="E.g., Over-absorption of factory overhead allocation query"
          className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple placeholder-zinc-600"
        />
      </div>

      {/* 4. Question Text */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Describe your Doubt</label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Please write down your detailed question or formula roadblock..."
          rows={5}
          className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple placeholder-zinc-600 resize-none transition-colors"
        />
      </div>

      {/* 5. Optional Attachment URL */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
          <Paperclip size={12} />
          <span>Attachment Link (Image or PDF URL - Optional)</span>
        </label>
        <input
          type="url"
          value={attachmentUrl}
          onChange={(e) => setAttachmentUrl(e.target.value)}
          placeholder="https://example.com/screenshot.png"
          className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple placeholder-zinc-600"
        />
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
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-brand-purple via-brand-purple-light to-brand-purple text-white font-black font-display tracking-wide uppercase hover:scale-[1.01] hover:shadow-purple-glow active:scale-100 disabled:opacity-50 transition-all duration-200"
      >
        {isSubmitting ? 'Submitting doubt...' : 'Submit Doubt for Review'}
      </button>
    </form>
  );
};

export default DoubtForm;
