import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  BookOpen,
  CheckCircle2,
  Calendar,
  Layers,
  BarChart3,
  GraduationCap,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';
import { StudyPlanService } from '../../services/studyPlan.service.js';
import { useAuth } from '../../context/AuthContext.jsx';
import AuthModal from '../../components/ui/AuthModal.jsx';
import SubjectCard from '../../components/study-planner/SubjectCard.jsx';
import AddSubjectModal from '../../components/study-planner/AddSubjectModal.jsx';
import LoadingSkeleton from '../../components/study-planner/LoadingSkeleton.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import ProgressBar from '../../components/study-planner/ProgressBar.jsx';

const StudyPlanner = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const isNotStudent = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'MENTOR');
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState(null);
  const [stats, setStats] = useState(null);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const demoPlan = {
    id: 'demo-plan',
    cmaLevel: 'INTER',
    examDate: '2026-12-15',
    subjects: [
      { id: 'd1', name: 'Financial Management & Data Analytics (FMDA)', totalTopics: 12, completedTopics: 8, progress: 67 },
      { id: 'd2', name: 'Corporate & Economic Laws (CEL)', totalTopics: 10, completedTopics: 4, progress: 40 },
      { id: 'd3', name: 'Direct Tax & International Taxation', totalTopics: 14, completedTopics: 9, progress: 64 },
    ],
    dailyTargets: [
      { id: 't1', status: 'COMPLETED' },
      { id: 't2', status: 'COMPLETED' },
      { id: 't3', status: 'PENDING' },
    ],
    stats: { remainingDays: 135 }
  };

  const fetchActivePlan = async () => {
    if (!isAuthenticated) {
      setActivePlan(null);
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await StudyPlanService.getActivePlan();
      const planData = result?.data;
      if (planData?.id) {
        setActivePlan(planData);
        setStats(planData.stats || null);
      } else {
        setActivePlan(null);
        setStats(null);
      }
    } catch (err) {
      toast.error('Failed to load study planner overview.');
      setActivePlan(null);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivePlan();
  }, []);

  const handleProtectedAddSubject = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowAddSubjectModal(true);
  };

  const handleAddSubject = async (subjectPayload) => {
    try {
      const planId = activePlan?.id || 'active';
      await StudyPlanService.addSubject(planId, subjectPayload);
      toast.success('New subject added to your study plan!');
      await fetchActivePlan();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to add subject.';
      toast.error(msg);
      throw err;
    }
  };

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  if (isNotStudent) {
    const dashboardLink = user.role === 'MENTOR' ? '/mentorship/dashboard' : '/admin/dashboard';
    const roleLabel = user.role === 'MENTOR' ? 'Mentor' : 'Administrator';

    return (
      <div className="space-y-8 animate-fade-in text-left">
        <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 relative z-10">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-semibold uppercase tracking-wider font-display">
              {roleLabel} Access
            </span>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-white">
              Study Planner Overview
            </h1>
            <p className="text-zinc-400 text-sm max-w-xl">
              Study Planner generation and tracking are reserved for Student accounts.
            </p>
          </div>
        </div>

        <Card className="py-12 text-center max-w-2xl mx-auto space-y-6 border border-amber-500/30 bg-black/40 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <ShieldAlert size={36} />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold font-display text-white">
              Student Feature Reserved
            </h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
              As a {roleLabel}, you do not have an active personal student study plan. Please use your {roleLabel} Dashboard to monitor and manage student activities.
            </p>
          </div>
          <div>
            <Link to={dashboardLink}>
              <Button variant="gold" size="lg" className="shadow-gold-glow px-8">
                Return to {roleLabel} Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const subjects = activePlan?.subjects || [];
  const dailyTargets = activePlan?.dailyTargets || [];

  // Compute stats dynamically if not provided by backend
  const totalSubjectsCount = subjects.length;

  const totalTopics = dailyTargets.length > 0
    ? dailyTargets.length
    : subjects.reduce((sum, s) => sum + (s.totalTopics || 0), 0);

  const completedTopics = dailyTargets.length > 0
    ? dailyTargets.filter((t) => t.status === 'COMPLETED').length
    : subjects.reduce((sum, s) => sum + (s.completedTopics || 0), 0);

  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const remainingDays = stats?.remainingDays !== undefined
    ? stats.remainingDays
    : (activePlan?.examDate
      ? Math.max(0, Math.ceil((new Date(activePlan.examDate) - new Date()) / (1000 * 60 * 60 * 24)))
      : 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overview Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-brand-gold/[0.03] blur-[80px] pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-xs text-brand-gold font-semibold uppercase tracking-wider flex items-center gap-1 font-display">
              <Sparkles size={12} /> Module 4
            </span>
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              Study Planner Overview
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-white">
            Personalized Study Planner
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Overview of your CMA preparation, active subject roadmaps, milestone tracking, and daily study targets.
          </p>
        </div>

        <div className="relative z-10 shrink-0 flex items-center gap-3">
          {activePlan ? (
            <Button
              variant="gold"
              size="md"
              onClick={handleProtectedAddSubject}
              leftIcon={<Plus size={16} />}
              className="shadow-gold-glow"
            >
              + Add Subject
            </Button>
          ) : (
            <Link to="/study-planner/create">
              <Button variant="gold" size="md" leftIcon={<Sparkles size={16} />}>
                Create Study Plan
              </Button>
            </Link>
          )}
        </div>
      </div>

      {!isAuthenticated || !activePlan ? (
        <Card className="py-16 text-center max-w-2xl mx-auto space-y-6 border border-brand-gold/30 bg-black/40 shadow-gold-glow">
          <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold mx-auto">
            <Sparkles size={32} />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold font-display text-white">
              Generate Your Personalized Study Plan
            </h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
              Create a custom schedule tailored to your CMA level, exam target date, and daily study hours budget.
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
          {/* Summary Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card accentColor="gold" padding="compact" className="relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold">
                <BarChart3 size={20} />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block">
                  Overall Progress
                </span>
                <span className="text-xl font-extrabold text-white font-display">
                  {overallProgress}%
                </span>
              </div>
            </div>
            <div className="mt-3">
              <ProgressBar value={overallProgress} size="sm" showLabel={false} />
            </div>
          </Card>

          <Card accentColor="purple" padding="compact">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple-light">
                <BookOpen size={20} />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block">
                  Total Subjects
                </span>
                <span className="text-xl font-extrabold text-white font-display">
                  {totalSubjectsCount} {totalSubjectsCount === 1 ? 'Subject' : 'Subjects'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">Active CMA syllabus papers</p>
          </Card>

          <Card accentColor="none" padding="compact">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block">
                  Topics Completed
                </span>
                <span className="text-xl font-extrabold text-white font-display">
                  {completedTopics} / {totalTopics}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">Chapter milestones finished</p>
          </Card>

          <Card accentColor="none" padding="compact">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <Calendar size={20} />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block">
                  Target Exam
                </span>
                <span className="text-xl font-extrabold text-white font-display">
                  {remainingDays} Days Left
                </span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">
              {activePlan.examDate ? new Date(activePlan.examDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Exam Date Set'}
            </p>
          </Card>
        </div>

      {/* Main Subjects Section */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 px-1">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Layers size={20} className="text-brand-gold" /> Your Study Plans
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select any subject to view, schedule, or manage its independent study roadmap.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddSubjectModal(true)}
              leftIcon={<Plus size={14} />}
              className="text-xs font-semibold"
            >
              + Add Subject
            </Button>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                planId={activePlan.id}
                dailyTargets={dailyTargets}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card accentColor="none" padding="large" className="text-center space-y-5 my-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mx-auto text-brand-gold shadow-gold-glow">
              <GraduationCap size={32} />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-bold font-display text-white">No study planners yet</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Create your first subject and start building your personalized CMA study plan.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="gold"
                size="md"
                onClick={handleProtectedAddSubject}
                leftIcon={<Plus size={16} />}
              >
                + Add Subject
              </Button>
              <Link to="/study-planner/create">
                <Button variant="outline" size="md" leftIcon={<Sparkles size={16} />}>
                  Run Setup Wizard
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
        </>
      )}

      {/* Add Subject Modal */}
      <AddSubjectModal
        isOpen={showAddSubjectModal}
        onClose={() => setShowAddSubjectModal(false)}
        onAddSubject={handleAddSubject}
        cmaLevel={activePlan?.cmaLevel || 'INTER'}
      />

      {/* Visitor Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Create Free Account"
        message="Create a free account to customize subjects, generate personalized study plans, and track your CMA targets."
        redirectTo="/study-planner"
      />
    </div>
  );
};

export default StudyPlanner;
