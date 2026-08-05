import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Flame,
  CheckCircle,
  CalendarRange,
  Clock,
  ArrowRight,
  GraduationCap,
  HelpCircle,
  TrendingUp,
  Plus,
  Calendar,
  AlertCircle
} from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { AccountabilityService } from '../services/accountability.service.js';
import { StudyPlanService } from '../services/studyPlan.service.js';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import LoadingSkeleton from '../components/ui/Loader.jsx';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [planStats, setPlanStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [habits, setHabits] = useState([]);
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [streakRes, planRes, bookingsRes, habitsRes, checkinsRes] = await Promise.all([
          AccountabilityService.getStreak().catch(() => null),
          StudyPlanService.getActivePlan().catch(() => null),
          api.get('/mentorship-bookings').catch(() => ({ data: { data: [] } })),
          AccountabilityService.getHabits().catch(() => null),
          AccountabilityService.getCheckins().catch(() => null),
        ]);

        setStreak(streakRes?.data || { currentStreak: 0, longestStreak: 0 });
        
        const plan = planRes?.data;
        if (plan) {
          setActivePlan(plan);
          const detailsRes = await StudyPlanService.getPlanDetails(plan.id).catch(() => null);
          const mergedStats = {
            ...plan.stats,
            ...detailsRes?.data?.stats
          };
          setPlanStats(mergedStats);
        }

        setBookings(bookingsRes?.data?.data || []);
        setHabits(habitsRes?.data || []);
        setCheckins(checkinsRes?.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogHabitProgress = async (habitId, isCompleted, logDate) => {
    try {
      await AccountabilityService.logHabit(habitId, {
        date: logDate,
        completed: isCompleted,
      });
      toast.success('Habit status updated!');
      // Refresh habits
      const habitsRes = await AccountabilityService.getHabits();
      setHabits(habitsRes?.data || []);
    } catch (err) {
      toast.error('Failed to save habit progress.');
    }
  };

  if (loading) {
    return <LoadingSkeleton fullScreen message="Loading your customized dashboard..." />;
  }

  // Filter next upcoming mentorship session
  const today = new Date();
  const nextSession = bookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING')
    .filter(b => new Date(b.scheduledAt) > today)
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0];

  const todayStr = new Date().toISOString().split('T')[0];
  const checkedInToday = checkins.some(c => c.date.startsWith(todayStr));

  // Compute computed subject and topic progress
  const subjects = activePlan?.subjects || [];
  const dailyTargets = activePlan?.dailyTargets || [];

  const totalSubjectsCount = planStats?.totalSubjects ?? subjects.length;
  const completedSubjectsCount = planStats?.completedSubjects ?? subjects.filter(s => (s.totalTopics || 0) > 0 && (s.completedTopics || 0) >= (s.totalTopics || 0)).length;
  const pendingSubjectsCount = planStats?.pendingSubjects ?? Math.max(0, totalSubjectsCount - completedSubjectsCount);

  const totalTopicsCount = planStats?.totalTopics ?? (dailyTargets.length > 0
    ? dailyTargets.length
    : subjects.reduce((sum, s) => sum + (s.totalTopics || 0), 0));

  const completedTopicsCount = planStats?.completedTopics ?? (dailyTargets.length > 0
    ? dailyTargets.filter((t) => t.status === 'COMPLETED').length
    : subjects.reduce((sum, s) => sum + (s.completedTopics || 0), 0));

  const overallProgressPercentage = planStats?.overallProgress ?? planStats?.progressPercentage ?? (totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0);

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* ── Greeting Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-brand-gold/[0.03] blur-[80px] pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-xs text-brand-gold font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Active Candidate
            </span>
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              Student Workspace
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-white">
            Welcome back, {user?.name || 'Candidate'}!
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Track your CMA preparation targets, connect with your academic mentors, and view your daily study accountability records.
          </p>
        </div>

        {/* Quick Streak Card */}
        <div className="relative z-10 flex items-center gap-4 bg-zinc-950/40 border border-brand-border/60 px-5 py-4 rounded-2xl shrink-0">
          <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shadow-gold-glow">
            <Flame size={24} className="fill-brand-gold/25" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-display">
              Consistency Streak
            </span>
            <span className="text-xl font-bold font-display text-white mt-0.5 block">
              {streak?.currentStreak || 0} Days Active
            </span>
          </div>
        </div>
      </div>

      {/* ── Dashboard Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Stats & Study Progress */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Study Progress Card */}
          <Card padding="default">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-brand-gold" /> Study Plan Progress
              </h2>
              {activePlan && (
                <Link
                  to={`/study-planner/plan/${activePlan.id}`}
                  className="text-xs text-brand-gold hover:text-brand-gold-light transition-colors flex items-center gap-1 font-semibold"
                >
                  Configure <ArrowRight size={12} />
                </Link>
              )}
            </div>

            {activePlan ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-zinc-400">Preparation completeness</span>
                    <span className="text-brand-gold font-bold">{overallProgressPercentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-900 border border-brand-border/60 rounded-full overflow-hidden p-[2px]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-gold-dark to-brand-gold transition-all duration-500 shadow-gold-glow"
                      style={{ width: `${overallProgressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-brand-border/40">
                  <div className="text-center p-3 rounded-xl bg-black/35 border border-brand-border/30">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Level</span>
                    <span className="text-xs font-bold text-white mt-1 block">{activePlan.cmaLevel}</span>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-black/35 border border-brand-border/30">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Completed</span>
                    <span className="text-xs font-bold text-white mt-1 block">{completedSubjectsCount} / {totalSubjectsCount}</span>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-black/35 border border-brand-border/30">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Remaining</span>
                    <span className="text-xs font-bold text-white mt-1 block">{pendingSubjectsCount} Subjects</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle size={32} className="mx-auto text-zinc-600 mb-2" />
                <p className="text-zinc-400 text-sm">No active CMA study plan found.</p>
                <Link to="/study-planner" className="mt-4 inline-block">
                  <Button variant="outline" size="sm" leftIcon={<Plus size={14} />}>
                    Create Study Plan
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link to="/accountability" className="block text-center">
              <div className="p-4 rounded-2xl bg-zinc-950/65 border border-brand-border hover:border-brand-gold/60 transition-all flex flex-col items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                  <CheckCircle size={18} />
                </div>
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Log Checkin</span>
              </div>
            </Link>
            <Link to="/study-planner" className="block text-center">
              <div className="p-4 rounded-2xl bg-zinc-950/65 border border-brand-border hover:border-brand-gold/60 transition-all flex flex-col items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple-light">
                  <CalendarRange size={18} />
                </div>
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Planner</span>
              </div>
            </Link>
            <Link to="/mentorship/mentors" className="block text-center">
              <div className="p-4 rounded-2xl bg-zinc-950/65 border border-brand-border hover:border-brand-gold/60 transition-all flex flex-col items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple-light">
                  <GraduationCap size={18} />
                </div>
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Book Mentor</span>
              </div>
            </Link>
            <Link to="/mentorship/doubts" className="block text-center">
              <div className="p-4 rounded-2xl bg-zinc-950/65 border border-brand-border hover:border-brand-gold/60 transition-all flex flex-col items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400">
                  <HelpCircle size={18} />
                </div>
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Ask Doubt</span>
              </div>
            </Link>
          </div>

          {/* Upcoming Bookings */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
                <CalendarRange size={18} className="text-brand-purple-light" /> Upcoming Session
              </h2>
              <Link
                to="/mentorship/bookings"
                className="text-xs text-brand-gold hover:text-brand-gold-light transition-colors flex items-center gap-1 font-semibold"
              >
                All Bookings <ArrowRight size={12} />
              </Link>
            </div>

            {nextSession ? (
              <div className="p-4 rounded-2xl bg-zinc-950/50 border border-brand-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-purple/15 flex items-center justify-center text-brand-purple-light">
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Mentoring with {nextSession.mentor?.fullName}</h4>
                    <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(nextSession.scheduledAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(nextSession.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                    nextSession.status === 'CONFIRMED'
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                  }`}>
                    {nextSession.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-zinc-500 text-sm">
                No upcoming scheduled mentorship sessions.
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Accountability & Daily Habits */}
        <div className="space-y-8">
          
          {/* Daily Habit Checklist */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
                <CheckCircle size={18} className="text-brand-gold" /> Daily Habits
              </h2>
              <Link
                to="/accountability"
                className="text-xs text-brand-gold hover:text-brand-gold-light transition-colors flex items-center gap-1 font-semibold"
              >
                Manage <ArrowRight size={12} />
              </Link>
            </div>

            {habits.length > 0 ? (
              <div className="space-y-3">
                {habits.filter(h => h.isActive).map((habit) => {
                  const todayLog = habit.logs?.find(l => l.date.startsWith(todayStr));
                  const isCompleted = todayLog ? todayLog.completed : false;

                  return (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-brand-border bg-black/35 hover:bg-white/5 transition-all"
                    >
                      <div>
                        <h4 className="text-xs font-semibold text-white">{habit.title}</h4>
                        <span className="text-[10px] text-zinc-500">Goal: {habit.targetHours} hr(s) / day</span>
                      </div>
                      <button
                        onClick={() => handleLogHabitProgress(habit.id, !isCompleted, todayStr)}
                        className={`w-7 h-7 rounded-lg border transition-all flex items-center justify-center ${
                          isCompleted
                            ? 'bg-brand-gold border-brand-gold text-black'
                            : 'border-brand-border bg-zinc-900 text-transparent hover:border-brand-gold/60'
                        }`}
                      >
                        <CheckCircle size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-zinc-500 text-sm">
                No daily habits tracking configured.
              </div>
            )}
          </Card>

          {/* Accountability check-in prompt */}
          <Card accentColor={checkedInToday ? 'none' : 'gold'}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                checkedInToday ? 'bg-green-500/10 text-green-400' : 'bg-brand-gold/10 text-brand-gold'
              }`}>
                <CheckCircle size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {checkedInToday ? 'Checked in today!' : 'Today\'s Study Hours'}
                </h3>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {checkedInToday
                    ? 'Good job! Daily study hours have been submitted.'
                    : 'Remember to submit your study hours to build consistency.'}
                </p>
              </div>
            </div>
            {!checkedInToday && (
              <Link to="/accountability" className="block mt-4">
                <Button variant="gold" size="sm" className="w-full">
                  Log Study Hours Now
                </Button>
              </Link>
            )}
          </Card>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
