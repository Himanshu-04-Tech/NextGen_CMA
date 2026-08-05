import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, CheckSquare, Sparkles } from 'lucide-react';
import { AccountabilityService } from '../../services/accountability.service.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import HabitCard from '../../components/accountability/HabitCard.jsx';
import HabitForm from '../../components/accountability/HabitForm.jsx';
import LoadingSkeleton from '../../components/accountability/LoadingSkeleton.jsx';
import EmptyState from '../../components/accountability/EmptyState.jsx';

const Habits = () => {
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const fetchHabits = async () => {
    try {
      const result = await AccountabilityService.getHabits();
      setHabits(result?.data || []);
    } catch (err) {
      toast.error('Failed to retrieve habits list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleCreateHabit = async (habitData) => {
    try {
      await AccountabilityService.createHabit(habitData);
      toast.success('Habit created successfully!');
      setShowCreateForm(false);
      await fetchHabits();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to create habit.';
      toast.error(msg);
    }
  };

  const handleUpdateHabit = async (habitData) => {
    if (!editingHabit) return;
    try {
      await AccountabilityService.updateHabit(editingHabit.id, habitData);
      toast.success('Habit updated successfully!');
      setEditingHabit(null);
      await fetchHabits();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update habit.';
      toast.error(msg);
    }
  };

  const handleLogHabitProgress = async (habitId, logData) => {
    try {
      await AccountabilityService.logHabit(habitId, logData);
      await fetchHabits();
    } catch (err) {
      toast.error('Failed to update habit progress.');
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm('Are you sure you want to remove this habit?')) return;
    try {
      await AccountabilityService.deleteHabit(habitId);
      toast.success('Habit removed.');
      await fetchHabits();
    } catch (err) {
      toast.error('Failed to delete habit.');
    }
  };

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Back Navigation */}
      <div className="border-b border-brand-border/40 pb-4 flex justify-between items-center flex-wrap gap-4">
        <Link
          to="/accountability"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-all font-semibold uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back to Companion Dashboard
        </Link>

        {!showCreateForm && !editingHabit && (
          <Button
            variant="gold"
            size="sm"
            onClick={() => {
              setEditingHabit(null);
              setShowCreateForm(true);
            }}
            leftIcon={<Plus size={14} />}
          >
            Create New Habit
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-white flex items-center gap-2">
          <CheckSquare className="text-brand-gold" /> Habit Tracker Directory
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl">
          Construct structured habits, record daily check-offs, and monitor historical compliance rates.
        </p>
      </div>

      {editingHabit ? (
        <HabitForm
          initialData={editingHabit}
          onSubmit={handleUpdateHabit}
          onCancel={() => setEditingHabit(null)}
        />
      ) : showCreateForm ? (
        <HabitForm onSubmit={handleCreateHabit} onCancel={() => setShowCreateForm(false)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.length > 0 ? (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onLogProgress={handleLogHabitProgress}
                onEdit={(h) => {
                  setShowCreateForm(false);
                  setEditingHabit(h);
                }}
                onDelete={handleDeleteHabit}
              />
            ))
          ) : (
            <div className="col-span-2">
              <EmptyState type="habits" onAction={() => setShowCreateForm(true)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Habits;
