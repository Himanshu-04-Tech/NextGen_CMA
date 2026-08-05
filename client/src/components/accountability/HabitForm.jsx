import { useState } from 'react';
import { Target, BookOpen, Layers } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';

const HabitForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [habitName, setHabitName] = useState(initialData?.habitName || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [frequency, setFrequency] = useState(initialData?.frequency || 'DAILY');
  const [targetValue, setTargetValue] = useState(initialData?.targetValue || 1);
  const [unit, setUnit] = useState(initialData?.unit || 'Session');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!habitName.trim() || !unit.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        habitName: habitName.trim(),
        description: description.trim() || null,
        frequency,
        targetValue: parseFloat(targetValue),
        unit: unit.trim()
      });
    } finally {
      setLoading(false);
    }
  };

  const habitSuggestions = [
    { name: 'Solve 10 MCQs', unit: 'MCQs', value: 10 },
    { name: 'Read Costing Theory', unit: 'Pages', value: 5 },
    { name: 'Watch video lecture', unit: 'Lectures', value: 1 },
    { name: 'Revise BLE guidelines', unit: 'Chapters', value: 1 },
    { name: 'Daily exercise / stretch', unit: 'Minutes', value: 20 },
    { name: 'Silent Meditation', unit: 'Minutes', value: 10 }
  ];

  return (
    <Card accentColor="purple" padding="default" className="text-left max-w-lg mx-auto">
      <h3 className="text-lg font-bold font-display text-white mb-6">
        {initialData ? 'Edit Habit' : 'Track New Habit'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Habit Name */}
        <Input
          id="habitName"
          label="Habit Name"
          required
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="e.g., Solve 10 MCQs"
          leftIcon={<BookOpen size={15} />}
        />

        {/* Suggestion tags (only when creating) */}
        {!initialData && (
          <div className="space-y-1.5">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              Suggestions
            </span>
            <div className="flex flex-wrap gap-2">
              {habitSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setHabitName(sug.name);
                    setUnit(sug.unit);
                    setTargetValue(sug.value);
                  }}
                  className="px-2 py-1 rounded bg-zinc-800/80 border border-brand-border hover:border-brand-gold text-[10px] text-zinc-300 font-medium transition-all"
                >
                  {sug.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Target solving direct tax problems (optional)"
            className="form-input"
          />
        </div>

        {/* Frequency & Unit Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="frequency" className="form-label">
              Frequency
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="form-input text-white"
            >
              <option value="DAILY" className="bg-brand-card">Daily</option>
              <option value="WEEKLY" className="bg-brand-card">Weekly</option>
              <option value="CUSTOM" className="bg-brand-card">Custom</option>
            </select>
          </div>
          <div>
            <label htmlFor="unit" className="form-label">
              Measurement Unit
            </label>
            <input
              id="unit"
              type="text"
              required
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., MCQs, Pages, Minutes"
              className="form-input"
            />
          </div>
        </div>

        {/* Target value */}
        <div>
          <label htmlFor="targetValue" className="form-label flex items-center gap-1">
            <Target size={12} className="text-brand-gold" /> Daily Target Value
          </label>
          <input
            id="targetValue"
            type="number"
            required
            min="0.1"
            step="any"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-brand-border/40">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="gold" isLoading={loading}>
            {initialData ? 'Save Changes' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default HabitForm;
