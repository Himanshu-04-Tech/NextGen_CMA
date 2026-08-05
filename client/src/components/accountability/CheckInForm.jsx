import { useState } from 'react';
import { Clock, BookOpen, Star, AlertTriangle, MessageSquare, Send, Calendar } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';

const CheckInForm = ({ onSubmit, isLoading }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [hours, setHours] = useState(2);
  const [minutes, setMinutes] = useState(0);
  const [date, setDate] = useState(todayStr);
  const [topics, setTopics] = useState('');
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [blockers, setBlockers] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const totalHours = parseFloat(hours || 0) + parseFloat(minutes || 0) / 60;
    if (isNaN(totalHours) || totalHours <= 0) {
      setErrorMsg('Please enter a valid study duration greater than 0.');
      return;
    }
    if (totalHours > 24) {
      setErrorMsg('Total study duration cannot exceed 24 hours in a single day.');
      return;
    }

    onSubmit({
      hoursStudied: Math.round(totalHours * 100) / 100,
      topicsCovered: topics.trim() || 'General Study',
      moodRating: mood,
      energyRating: energy,
      blockers: blockers.trim() || null,
      notes: notes.trim() || null,
      date: date || todayStr
    });
  };

  const emojiMoods = ['😢', '😕', '😐', '🙂', '🤩'];
  const energyLevels = ['😴', '🥱', '⚡', '🔥', '💪'];

  return (
    <div className="max-w-xl mx-auto animate-fade-in text-left">
      <Card accentColor="purple" padding="default">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Date & Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Date Selection */}
            <div className="space-y-2">
              <label htmlFor="checkinDate" className="form-label flex items-center gap-1.5">
                <Calendar size={14} className="text-brand-gold" /> Study Date
              </label>
              <input
                id="checkinDate"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input text-white"
              />
            </div>

            {/* Study Duration */}
            <div className="space-y-2">
              <label className="form-label flex items-center gap-1.5">
                <Clock size={14} className="text-brand-gold" /> Duration Studied
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value || '0', 10)))}
                    className="form-input text-center font-bold text-white"
                  />
                  <span className="text-xs text-zinc-400 font-semibold">hrs</span>
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    step="5"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value || '0', 10))))}
                    className="form-input text-center font-bold text-white"
                  />
                  <span className="text-xs text-zinc-400 font-semibold">mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Covered (Optional) */}
          <div className="space-y-2">
            <label htmlFor="topics" className="form-label flex items-center gap-1.5">
              <BookOpen size={14} className="text-brand-gold" /> Topics / Subjects Covered (Optional)
            </label>
            <input
              id="topics"
              type="text"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="e.g., Financial Management & Costing Revision..."
              className="form-input"
            />
          </div>

          {/* Mood & Energy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="form-label flex items-center gap-1.5">
                <Star size={14} className="text-brand-gold" /> Mood Rating
              </label>
              <div className="flex gap-2">
                {emojiMoods.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMood(idx + 1)}
                    className={`flex-1 p-2 rounded-xl border text-xl transition-all ${
                      mood === idx + 1
                        ? 'border-brand-gold bg-brand-gold/10 text-white scale-110 shadow-gold-glow'
                        : 'border-brand-border bg-black/20 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="form-label flex items-center gap-1.5">
                <Star size={14} className="text-brand-gold" /> Energy Level
              </label>
              <div className="flex gap-2">
                {energyLevels.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setEnergy(idx + 1)}
                    className={`flex-1 p-2 rounded-xl border text-xl transition-all ${
                      energy === idx + 1
                        ? 'border-brand-gold bg-brand-gold/10 text-white scale-110 shadow-gold-glow'
                        : 'border-brand-border bg-black/20 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="form-label flex items-center gap-1.5">
              <MessageSquare size={14} className="text-brand-gold" /> Study Notes / Key Takeaways (Optional)
            </label>
            <textarea
              id="notes"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record any notes or takeaways from today's study session..."
              className="form-input resize-none"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="gold"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full shadow-gold-glow"
            leftIcon={<Send size={15} />}
          >
            {isLoading ? 'Saving Study Log...' : 'Save Study Log'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CheckInForm;
