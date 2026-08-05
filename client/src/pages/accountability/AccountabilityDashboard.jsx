import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Flame,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Settings,
  CalendarRange,
  Clock
} from 'lucide-react';
import { AccountabilityService } from '../../services/accountability.service.js';
import { useAuth } from '../../context/AuthContext.jsx';
import AuthModal from '../../components/ui/AuthModal.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import StreakCard from '../../components/accountability/StreakCard.jsx';
import HabitCard from '../../components/accountability/HabitCard.jsx';
import HabitProgress from '../../components/accountability/HabitProgress.jsx';
import LoadingSkeleton from '../../components/accountability/LoadingSkeleton.jsx';
import EmptyState from '../../components/accountability/EmptyState.jsx';

const AccountabilityDashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(null);
  const [habits, setHabits] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const demoData = {
    streak: { currentStreak: 7, longestStreak: 14, totalCheckins: 24, streakFreezeUsed: false },
    habits: [
      { id: 'h1', title: 'Daily FMDA Practice Problems', category: 'STUDY', streak: 7, isActive: true, logs: [{ date: todayStr, completed: true }] },
      { id: 'h2', title: 'Costing Theory & Formula Revision', category: 'REVISION', streak: 12, isActive: true, logs: [{ date: todayStr, completed: true }] },
      { id: 'h3', title: '3 Hours Deep Focus Study Block', category: 'TIME', streak: 5, isActive: true, logs: [] },
    ],
    checkins: [{ date: todayStr, hoursStudied: 4.5, topicsCovered: 'Capital Budgeting & Standard Costing' }],
    analytics: { weeklyHours: 28, completionRate: 85 }
  };

  const fetchDashboardData = async () => {
    if (!isAuthenticated) {
      setStreak(demoData.streak);
      setHabits(demoData.habits);
      setCheckins(demoData.checkins);
      setAnalytics(demoData.analytics);
      setLoading(false);
      return;
    }

    try {
      const [streakRes, habitsRes, checkinsRes, analyticsRes] = await Promise.all([
        AccountabilityService.getStreak(),
        AccountabilityService.getHabits(),
        AccountabilityService.getCheckins(),
        AccountabilityService.getAnalytics()
      ]);

      setStreak(streakRes?.data);
      setHabits(habitsRes?.data || []);
      setCheckins(checkinsRes?.data || []);
      setAnalytics(analyticsRes?.data);
    } catch (err) {
      toast.error('Failed to load accountability dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleProtectedAction = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  const handleLogHabitProgress = async (habitId, logData) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      await AccountabilityService.logHabit(habitId, logData);
      toast.success('Progress updated.');
      await fetchDashboardData(); // Refresh logs and graphs
    } catch (err) {
      toast.error('Failed to save habit progress.');
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (!window.confirm('Are you sure you want to remove this habit?')) return;
    try {
      await AccountabilityService.deleteHabit(habitId);
      toast.success('Habit removed.');
      await fetchDashboardData();
    } catch (err) {
      toast.error('Failed to delete habit.');
    }
  };

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  // Check today's checkin status
  const checkedInToday = checkins.some((c) => c.date.startsWith(todayStr));
  const todaysCheckin = checkins.find((c) => c.date.startsWith(todayStr)) || null;

  // Active habits completion count
  const activeHabits = habits.filter(h => h.isActive);
  const completedTodayCount = activeHabits.filter((h) => {
    const todayLog = h.logs?.find((l) => l.date.startsWith(todayStr));
    return todayLog ? todayLog.completed : false;
  }).length;

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-brand-gold/[0.03] blur-[80px] pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-xs text-brand-gold font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Module 5
            </span>
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              Consistency Companion
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-white">
            Consistency & Accountability
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Track daily habits, submit check-ins, view streaks, and check planned hours vs actual study hours.
          </p>
        </div>
      </div>

      {!isAuthenticated ? (
        <Card className="py-16 text-center max-w-2xl mx-auto space-y-6 border border-brand-gold/30 bg-black/40 shadow-gold-glow">
          <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold mx-auto">
            <Sparkles size={32} />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold font-display text-white">
              Generate Your Study Planner First
            </h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
              To track your daily habits, streaks, and check-ins with the Accountability Companion, you first need to create your personalized CMA Study Plan.
            </p>
          </div>
          <div>
            <Link to="/study-planner/create">
              <Button variant="gold" size="lg" className="shadow-gold-glow px-8">
                Generate Study Planner
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {/* Grid: Streaks & Today's Checkin Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Streak Details */}
        <StreakCard streak={streak} />

        {/* Check-in Banner Status */}
        <Card accentColor={checkedInToday ? 'gold' : 'purple'} padding="default" className="flex flex-col justify-between h-full relative overflow-hidden">
          <div className="space-y-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">
              Today's Study Log
            </span>

            {checkedInToday && todaysCheckin ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                  <CheckCircle size={18} /> Today's Total: {todaysCheckin.hoursStudied} Hours
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Log additional study sessions to build your daily study record.
                </p>
                <div className="text-[11px] text-zinc-500 font-medium">
                  Covered: {todaysCheckin.topicsCovered}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 font-bold text-sm">
                  <AlertCircle size={18} /> Awaiting Study Logs
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Log your studied hours and targets to protect and build your streak.
                </p>
              </div>
            )}
          </div>

          <div className="pt-6">
            <Button
              variant="gold"
              className="w-full shadow-gold-glow"
              onClick={() => {
                if (!isAuthenticated) {
                  setShowAuthModal(true);
                } else {
                  navigate('/accountability/checkin');
                }
              }}
            >
              {checkedInToday ? '+ Add Study Log' : "Log Today's Study"}
            </Button>
          </div>
        </Card>

        {/* Habits summary card */}
        <Card padding="default" className="flex flex-col justify-between h-full">
          <div className="space-y-2">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">
              Habit Progress Ring
            </span>
            <HabitProgress completed={completedTodayCount} total={activeHabits.length} size={110} />
          </div>
        </Card>
      </div>

      {/* Grid: Habits Panel vs Settings / Analytics Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left list: Habits Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-lg font-bold font-display text-white">
              Today's Habits Checklist
            </h3>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => {
                if (!isAuthenticated) {
                  setShowAuthModal(true);
                } else {
                  navigate('/accountability/habits');
                }
              }}
            >
              Create Habit
            </Button>
          </div>

          {activeHabits.length > 0 ? (
            <div className="space-y-4">
              {activeHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onLogProgress={handleLogHabitProgress}
                  onEdit={() => navigate('/accountability/habits')}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="habits" onAction={() => navigate('/accountability/habits')} />
          )}
        </div>

        {/* Right side navigation utilities panel */}
        <div className="space-y-6">
          <Card padding="default" accentColor="purple">
            <h3 className="text-base font-bold font-display text-white mb-6 border-b border-brand-border/40 pb-3">
              Companion Hub Menu
            </h3>

            <div className="space-y-3">
              <Link to="/accountability/analytics" className="block">
                <div className="p-3.5 bg-black/40 border border-brand-border hover:border-brand-gold rounded-xl flex items-center justify-between text-zinc-300 hover:text-white transition-all">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={16} className="text-brand-gold" />
                    <span className="text-xs font-semibold">Progress Analytics</span>
                  </div>
                  <ArrowRight size={14} className="text-zinc-600" />
                </div>
              </Link>

              <Link to="/accountability/reminders" className="block">
                <div className="p-3.5 bg-black/40 border border-brand-border hover:border-brand-gold rounded-xl flex items-center justify-between text-zinc-300 hover:text-white transition-all">
                  <div className="flex items-center gap-3">
                    <Settings size={16} className="text-brand-purple-light" />
                    <span className="text-xs font-semibold">Reminder Settings</span>
                  </div>
                  <ArrowRight size={14} className="text-zinc-600" />
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
        </>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Save Accountability Progress"
        message="Create a free account or login to log daily hours, track habits, and maintain streaks on your student dashboard."
        redirectTo="/accountability"
      />
    </div>
  );
};

export default AccountabilityDashboard;
