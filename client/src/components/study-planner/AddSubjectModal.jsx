import React, { useState } from 'react';
import { Plus, X, BookOpen, Layers } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { LEVEL_SUBJECTS } from './SubjectSelector.jsx';

const AddSubjectModal = ({ isOpen, onClose, onAddSubject, cmaLevel = 'INTER' }) => {
  const [selectedPreset, setSelectedPreset] = useState('');
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const currentLevelSubjects = LEVEL_SUBJECTS[cmaLevel] || LEVEL_SUBJECTS.INTER;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalSubjectName = customName.trim() || selectedPreset;
    if (!finalSubjectName) return;

    setLoading(true);
    try {
      await onAddSubject({
        subjectName: finalSubjectName,
        totalTopics: 0, // Initially 0 topics, manual topic generation remains manual
        completedTopics: 0
      });
      setSelectedPreset('');
      setCustomName('');
      onClose();
    } catch (err) {
      // Error handled by parent toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-brand-card border border-brand-border rounded-2xl p-6 relative shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">Add New Subject</h3>
              <p className="text-xs text-zinc-400">Expand your study planner with an additional CMA paper.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg border border-brand-border text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Select from Standard Curriculum */}
          <div className="space-y-2">
            <label className="form-label text-xs">Select from CMA Curriculum ({cmaLevel})</label>
            <select
              value={selectedPreset}
              onChange={(e) => {
                setSelectedPreset(e.target.value);
                if (e.target.value) setCustomName('');
              }}
              className="form-input text-xs text-white bg-black/40"
            >
              <option value="">-- Choose a standard CMA paper --</option>
              {currentLevelSubjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-500 font-semibold uppercase tracking-wider my-1">
            <div className="flex-1 h-px bg-brand-border/60" />
            <span>OR</span>
            <div className="flex-1 h-px bg-brand-border/60" />
          </div>

          {/* Type Custom Subject Name */}
          <div className="space-y-2">
            <label className="form-label text-xs">Custom Subject / Paper Title</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => {
                setCustomName(e.target.value);
                if (e.target.value) setSelectedPreset('');
              }}
              placeholder="e.g. Paper 21: Financial Valuation & Risk Management"
              className="form-input text-xs text-white bg-black/40"
            />
          </div>

          <div className="p-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-xs text-brand-purple-light flex items-start gap-2">
            <Layers size={16} className="shrink-0 mt-0.5" />
            <p>
              Note: Creating a planner will <strong>not</strong> automatically generate topics. You can generate syllabus topics or add custom topics manually inside the planner.
            </p>
          </div>

          {/* Footer Controls */}
          <div className="flex justify-end items-center gap-3 pt-3 border-t border-brand-border/40">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gold"
              isLoading={loading}
              disabled={!selectedPreset && !customName.trim()}
              leftIcon={<Plus size={14} />}
            >
              + Add Subject
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;
