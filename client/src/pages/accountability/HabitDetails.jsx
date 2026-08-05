import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Target, Calendar, CheckSquare, Edit, X, RefreshCw } from 'lucide-react';
import { AccountabilityService } from '../../services/accountability.service.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import HabitForm from '../../components/accountability/HabitForm.jsx';
import LoadingSkeleton from '../../components/accountability/LoadingSkeleton.jsx';

const HabitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [habit, setHabit] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchDetails = async () => {
    try {
      const [habitsRes, logsRes] = await Promise.all([
        AccountabilityService.getHabits(),
        AccountabilityService.getHabitLogs(id)
      ]);

      const found = habitsRes?.data?.find((h) => h.id === id);
      if (!found) {
        toast.error('Habit not found.');
        navigate('/accountability/habits');
        return;
      }

      setHabit(found);
      setLogs(logsRes?.data || []);
    } catch (err) {
      toast.error('Failed to load habit log statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleUpdateHabit = async (updatedData) => {
    try {
      await AccountabilityService.updateHabit(id, updatedData);
      toast.success('Habit configurations saved.');
      setIsEditing(false);
      await fetchDetails();
    } catch (err) {
      toast.error('Failed to update habit.');
    }
  };

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  const successRate = logs.length > 0 ? Math.round((logs.filter((l) => l.completed).length / logs.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Back button */}
      <div className="border-b border-brand-border/40 pb-4 flex justify-between items-center">
        <Link
          to="/accountability/habits"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-all font-semibold uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back to Directory
        </Link>

        <Button
          variant={isEditing ? 'outline' : 'gold'}
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          leftIcon={isEditing ? <X size={14} /> : <Edit size={14} />}
        >
          {isEditing ? 'Cancel Edit' : 'Edit Configuration'}
        </Button>
      </div>

      {isEditing ? (
        <HabitForm initialData={habit} onSubmit={handleUpdateHabit} onCancel={() => setIsEditing(false)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Metadata */}
          <div className="space-y-6">
            <Card accentColor="gold" padding="default">
              <span className="px-2 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20 text-[9px] text-brand-gold font-bold uppercase tracking-wider font-display">
                {habit.frequency}
              </span>
              
              <h2 className="text-xl font-extrabold text-white font-display mt-2">
                {habit.habitName}
              </h2>
              {habit.description && <p className="text-zinc-500 text-xs mt-1">{habit.description}</p>}

              <div className="space-y-4 mt-6 pt-6 border-t border-brand-border/40 text-xs text-zinc-400">
                <div className="flex justify-between items-center">
                  <span>Target Value</span>
                  <span className="text-white font-bold">{habit.targetValue} {habit.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Success Rate</span>
                  <span className="text-brand-gold font-bold">{successRate}% Done</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Logged Days</span>
                  <span className="text-white font-bold">{logs.length} Days</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Historical Logs List */}
          <div className="lg:col-span-2">
            <Card padding="default">
              <h3 className="text-base font-bold font-display text-white mb-6 border-b border-brand-border/40 pb-3 flex items-center gap-2">
                <Calendar size={16} className="text-brand-gold" /> Log Compliance Log Book
              </h3>

              {logs.length > 0 ? (
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 text-xs ${
                        log.completed
                          ? 'border-green-500/20 bg-green-500/5 text-green-300'
                          : 'border-brand-border bg-black/20 text-zinc-400'
                      }`}
                    >
                      <div className="space-y-0.5 text-left">
                        <span className="font-semibold text-white">
                          {new Date(log.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </span>
                        {log.notes && <p className="text-[11px] text-zinc-500">{log.notes}</p>}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold">
                          {log.completedValue} / {habit.targetValue} {habit.unit}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          log.completed ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {log.completed ? 'COMPLETED' : 'PARTIAL'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-brand-border rounded-xl">
                  <p className="text-xs text-zinc-500 font-medium">No check-in entries logged yet.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitDetails;
