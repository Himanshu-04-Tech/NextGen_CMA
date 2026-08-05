import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Plus,
  BookOpen,
  CheckCircle,
  FolderPlus,
  Target,
  Sparkles,
  Layers,
  AlertCircle,
  Trash2,
  RefreshCw,
  Edit2,
  Filter
} from 'lucide-react';
import { StudyPlanService } from '../../services/studyPlan.service.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import LoadingSkeleton from '../../components/study-planner/LoadingSkeleton.jsx';
import StatisticsCards from '../../components/study-planner/StatisticsCards.jsx';
import DailyTargets from '../../components/study-planner/DailyTargets.jsx';
import WeeklyTargets from '../../components/study-planner/WeeklyTargets.jsx';
import TargetCard from '../../components/study-planner/TargetCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { parseSubjectDisplay } from '../../utils/subjectUtils.js';

const StudyPlanDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubjectId = searchParams.get('subjectId') || '';

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('SCHEDULED'); // 'SCHEDULED', 'UNSCHEDULED', 'ALL'

  // Modal States
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjTopics, setNewSubjTopics] = useState(10);

  // Add Topic Modal State
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [topicSubject, setTopicSubject] = useState('');
  const [topicName, setTopicName] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [topicPriority, setTopicPriority] = useState('MEDIUM');
  const [topicDate, setTopicDate] = useState('');
  const [topicHours, setTopicHours] = useState(2.0);
  const [topicStartTime, setTopicStartTime] = useState('');
  const [topicEndTime, setTopicEndTime] = useState('');

  // Single Subject Regeneration Confirmation Modal
  const [regenSubject, setRegenSubject] = useState(null);
  
  // All Subjects Generation Confirmation Modal
  const [showGenAllConfirm, setShowGenAllConfirm] = useState(false);

  // Suggest Schedule Preview Modal
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const fetchPlanDetails = async () => {
    try {
      const result = await StudyPlanService.getPlanDetails(id);
      setPlan(result?.data?.plan);
      setStats(result?.data?.stats);
    } catch (err) {
      toast.error('Failed to load study plan details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanDetails();
  }, [id]);

  const handleUpdateDailyStatus = async (targetId, updateData) => {
    try {
      await StudyPlanService.updateDailyTarget(targetId, updateData);
      toast.success('Topic updated.');
      await fetchPlanDetails();
    } catch (err) {
      toast.error('Failed to update topic.');
    }
  };

  const handleDeleteDailyTarget = async (targetId) => {
    if (!window.confirm('Are you sure you want to delete this topic?')) return;
    try {
      await StudyPlanService.deleteDailyTarget(targetId);
      toast.success('Topic deleted.');
      await fetchPlanDetails();
    } catch (err) {
      toast.error('Failed to delete topic.');
    }
  };

  const handleUpdateWeeklyStatus = async (targetId, updateData) => {
    try {
      await StudyPlanService.updateWeeklyTarget(targetId, updateData);
      toast.success('Weekly goal status updated.');
      await fetchPlanDetails();
    } catch (err) {
      toast.error('Failed to update weekly goal.');
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjName.trim()) return;

    try {
      await StudyPlanService.addSubject(id, {
        subjectName: newSubjName,
        totalTopics: parseInt(newSubjTopics || 0),
        completedTopics: 0
      });
      toast.success('Subject added to plan.');
      setShowAddSubject(false);
      setNewSubjName('');
      await fetchPlanDetails();
    } catch (err) {
      toast.error('Failed to add subject.');
    }
  };

  const openAddTopicModal = (subjectName = '') => {
    const defaultSubject = subjectName || (activeSubject ? activeSubject.subjectName : (plan?.subjects[0]?.subjectName || ''));
    setTopicSubject(defaultSubject);
    setTopicName('');
    setTopicDescription('');
    setTopicPriority('MEDIUM');
    setTopicDate('');
    setTopicHours(2.0);
    setTopicStartTime(plan?.preferredStartTime || '19:00');
    setTopicEndTime(plan?.preferredEndTime || '21:00');
    setShowAddTopic(true);
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!topicName.trim()) {
      toast.error('Please enter topic name.');
      return;
    }

    try {
      const fullTopicName = topicSubject ? `${topicSubject}: ${topicName}` : topicName;
      await StudyPlanService.createDailyTarget({
        planId: id,
        subjectName: topicSubject || null,
        topic: fullTopicName,
        description: topicDescription || null,
        priority: topicPriority,
        date: topicDate || null,
        startTime: topicStartTime || null,
        endTime: topicEndTime || null,
        studyHours: parseFloat(topicHours),
        isManual: true,
        status: 'PENDING'
      });
      toast.success('Topic added to study plan.');
      setShowAddTopic(false);
      await fetchPlanDetails();
    } catch (err) {
      toast.error('Failed to add topic.');
    }
  };

  // Subject Topic Generation (Single Subject)
  const triggerGenerateSubjectTopics = (subj) => {
    const existingCount = (plan?.dailyTargets || []).filter(
      (t) => t.subjectName === subj.subjectName || t.topic.startsWith(`${subj.subjectName}:`)
    ).length;

    if (existingCount > 0) {
      setRegenSubject(subj);
    } else {
      executeGenerateSubjectTopics(subj.id, 'APPEND');
    }
  };

  const executeGenerateSubjectTopics = async (subjectId, mode) => {
    setActionLoading(true);
    try {
      const res = await StudyPlanService.generateSubjectTopics(id, subjectId, { mode });
      toast.success(`Generated ${res.data.generatedCount} topics for subject.`);
      setRegenSubject(null);
      await fetchPlanDetails();
    } catch (err) {
      toast.error('Failed to generate topics for subject.');
    } finally {
      setActionLoading(false);
    }
  };

  // Generate All Subjects Topics
  const executeGenerateAllTopics = async () => {
    setActionLoading(true);
    try {
      const res = await StudyPlanService.generateAllSubjectsTopics(id, { mode: 'APPEND' });
      toast.success(`Generated ${res.data.totalGenerated} topics across all subjects.`);
      setShowGenAllConfirm(false);
      await fetchPlanDetails();
    } catch (err) {
      toast.error('Failed to generate topics for subjects.');
    } finally {
      setActionLoading(false);
    }
  };

  // Request AI Schedule Suggestions Preview Modal
  const handleRequestSuggestSchedule = async () => {
    setActionLoading(true);
    try {
      const res = await StudyPlanService.suggestSchedule(id);
      if (!res.data?.suggestions || res.data.suggestions.length === 0) {
        toast.info(res.data?.message || 'All topics are already scheduled or completed.');
      } else {
        setSuggestions(res.data.suggestions);
        setShowSuggestModal(true);
      }
    } catch (err) {
      toast.error('Failed to compute schedule suggestions.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplySuggestions = async () => {
    setActionLoading(true);
    try {
      await StudyPlanService.applySuggestedSchedule(id, { suggestions });
      toast.success('Applied suggested schedule!');
      setShowSuggestModal(false);
      await fetchPlanDetails();
    } catch (err) {
      toast.error('Failed to apply suggested schedule.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateSuggestionDate = (targetId, newD, newStart, newEnd) => {
    setSuggestions((prev) =>
      prev.map((item) =>
        item.targetId === targetId
          ? {
              ...item,
              suggestedDate: newD !== undefined ? newD : item.suggestedDate,
              suggestedStartTime: newStart !== undefined ? newStart : item.suggestedStartTime,
              suggestedEndTime: newEnd !== undefined ? newEnd : item.suggestedEndTime
            }
          : item
      )
    );
  };

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold">Study Plan not found.</h3>
        <Link to="/study-planner" className="text-brand-gold hover:underline mt-2 inline-block font-semibold">
          ← Back to Study Planner
        </Link>
      </div>
    );
  }

  const isScheduledDate = (d) => {
    if (!d) return false;
    const yr = new Date(d).getFullYear();
    return !isNaN(yr) && yr > 1970;
  };

  // Find active selected subject if any
  const activeSubject = plan.subjects?.find((s) => s.id === activeSubjectId);
  const activeSubjectParsed = activeSubject ? parseSubjectDisplay(activeSubject.subjectName) : null;

  // Filter topics strictly based on active selected subject (if selected)
  const displayTargets = (plan.dailyTargets || []).filter((t) => {
    if (!activeSubject) return true;
    return t.subjectName === activeSubject.subjectName || t.topic.startsWith(`${activeSubject.subjectName}:`);
  });

  const scheduledTargets = displayTargets.filter((t) => isScheduledDate(t.date));
  const unscheduledTargets = displayTargets.filter((t) => !isScheduledDate(t.date));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border/40 pb-4">
        <Link
          to="/study-planner"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-all font-semibold uppercase tracking-wider group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Planner
        </Link>

        {/* Action Buttons Header */}
        {user?.role !== 'MENTOR' && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestSuggestSchedule}
              isLoading={actionLoading}
              leftIcon={<Sparkles size={14} className="text-brand-gold" />}
            >
              ✨ Suggest Schedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGenAllConfirm(true)}
              leftIcon={<Layers size={14} />}
            >
              Generate Topics for All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddSubject(true)}
              leftIcon={<FolderPlus size={14} />}
            >
              Add Custom Subject
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={() => openAddTopicModal()}
              leftIcon={<Plus size={14} />}
            >
              + Add Topic
            </Button>
          </div>
        )}
      </div>

      {/* Subject Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-brand-card border border-brand-border p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-brand-gold" />
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Subject View:</span>
          {activeSubjectParsed ? (
            <span className="px-3 py-1 rounded-lg bg-brand-gold/10 border border-brand-gold/20 text-xs font-bold text-brand-gold font-display">
              {activeSubjectParsed.primaryName} {activeSubjectParsed.paperInfo && `(${activeSubjectParsed.paperInfo})`}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-lg bg-zinc-800 border border-brand-border text-xs font-bold text-white font-display">
              All Subjects ({plan.subjects.length})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeSubjectId}
            onChange={(e) => {
              if (e.target.value) {
                setSearchParams({ subjectId: e.target.value });
              } else {
                setSearchParams({});
              }
            }}
            className="form-input text-xs text-white bg-black/40 py-1.5 px-3 rounded-xl border-brand-border"
          >
            <option value="">-- All Subjects --</option>
            {plan.subjects.map((s) => {
              const parsed = parseSubjectDisplay(s.subjectName);
              return (
                <option key={s.id} value={s.id}>
                  {parsed.primaryName} {parsed.paperInfo ? `(${parsed.paperInfo})` : ''}
                </option>
              );
            })}
          </select>

          {activeSubjectId && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="text-xs text-zinc-400 hover:text-white underline font-semibold px-1"
            >
              Show All
            </button>
          )}
        </div>
      </div>

      {/* Stats Widgets */}
      <StatisticsCards stats={stats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column — Targets Manager & Unscheduled Section */}
        <div className="lg:col-span-2 space-y-8">
          <Card accentColor="purple" padding="default">
            {/* Tabs Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border/40 pb-4 mb-6">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Target size={18} className="text-brand-gold" />
                {activeSubjectParsed ? `${activeSubjectParsed.primaryName} Roadmap` : 'Study Roadmap & Topics'}
              </h3>

              <div className="flex items-center gap-1 bg-black/40 border border-brand-border p-1 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('SCHEDULED')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === 'SCHEDULED'
                      ? 'bg-brand-purple text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Scheduled ({scheduledTargets.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('UNSCHEDULED')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'UNSCHEDULED'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Unscheduled ({unscheduledTargets.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === 'ALL'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  All ({displayTargets.length})
                </button>
              </div>
            </div>

            {/* Tab 1: Scheduled Daily Targets */}
            {activeTab === 'SCHEDULED' && (
              <DailyTargets
                targets={scheduledTargets}
                onUpdateStatus={handleUpdateDailyStatus}
                onDeleteTarget={handleDeleteDailyTarget}
                userRole={user?.role}
              />
            )}

            {/* Tab 2: Unscheduled Topics Section */}
            {activeTab === 'UNSCHEDULED' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-left space-y-1">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertCircle size={14} /> Unscheduled Topics
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    These topics are in your curriculum but do not have an assigned study date or time slot yet.
                    Click <strong className="text-white">[Schedule Now]</strong> or use <strong className="text-brand-gold">✨ Suggest Schedule</strong> to auto-fill.
                  </p>
                </div>

                {unscheduledTargets.length > 0 ? (
                  <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                    {unscheduledTargets.map((target) => (
                      <TargetCard
                        key={target.id}
                        target={target}
                        onUpdateStatus={handleUpdateDailyStatus}
                        onDeleteTarget={handleDeleteDailyTarget}
                        userRole={user?.role}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-brand-border rounded-xl">
                    <p className="text-xs text-zinc-500 font-medium">All topics have assigned study dates!</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: All Topics */}
            {activeTab === 'ALL' && (
              <DailyTargets
                targets={displayTargets}
                onUpdateStatus={handleUpdateDailyStatus}
                onDeleteTarget={handleDeleteDailyTarget}
                userRole={user?.role}
              />
            )}
          </Card>

          {/* Weekly Targets Section */}
          <Card accentColor="none" padding="default">
            <h3 className="text-lg font-bold font-display text-white mb-6 border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-brand-purple-light" /> Weekly Target Milestones
            </h3>
            <WeeklyTargets
              targets={plan.weeklyTargets}
              onUpdateStatus={handleUpdateWeeklyStatus}
            />
          </Card>
        </div>

        {/* Right column — Subject Breakdown */}
        <div className="space-y-6">
          <Card accentColor="gold" padding="default">
            <div className="flex justify-between items-center mb-4 border-b border-brand-border/40 pb-3">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <BookOpen size={18} className="text-brand-gold" /> Subjects breakdown
              </h3>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                {plan.subjects.length} Subjects
              </span>
            </div>

            <div className="space-y-4">
              {plan.subjects.map((subject) => {
                const { primaryName, paperInfo } = parseSubjectDisplay(subject.subjectName);
                const isSelected = activeSubjectId === subject.id;

                const actualSubjectTopics = (plan.dailyTargets || []).filter(
                  (t) => t.subjectName === subject.subjectName || t.topic.startsWith(`${subject.subjectName}:`)
                );

                const actualTotal = actualSubjectTopics.length;
                const actualCompleted = actualSubjectTopics.filter((t) => t.status === 'COMPLETED').length;
                const actualProgress = actualTotal > 0 ? Math.round((actualCompleted / actualTotal) * 100) : 0;
                const syllabusExpectation = subject.totalTopics || 0;

                return (
                  <div
                    key={subject.id}
                    className={`p-4 rounded-xl space-y-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-gold/10 border-2 border-brand-gold shadow-gold-glow'
                        : 'bg-black/20 border border-brand-border hover:border-zinc-700'
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setSearchParams({});
                      } else {
                        setSearchParams({ subjectId: subject.id });
                      }
                    }}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        {paperInfo && (
                          <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest block">
                            {paperInfo}
                          </span>
                        )}
                        <h4 className="text-xs font-bold text-white leading-snug">
                          {primaryName}
                        </h4>
                      </div>
                      <span className="text-[10px] font-semibold text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded border border-brand-border/60 shrink-0">
                        {actualTotal} {actualTotal === 1 ? 'Topic' : 'Topics'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-zinc-400 font-semibold uppercase">
                      <span>Progress</span>
                      <span className="text-brand-gold">
                        {actualCompleted} / {actualTotal} Completed ({actualProgress}%)
                      </span>
                    </div>

                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-gold h-full rounded-full transition-all duration-300"
                        style={{ width: `${actualProgress}%` }}
                      />
                    </div>

                    {syllabusExpectation > 0 && (
                      <div className="flex justify-between items-center text-[10px] text-zinc-500 font-medium">
                        <span>Syllabus Topics Generated:</span>
                        <span className="text-zinc-400 font-semibold">{actualTotal} / {syllabusExpectation}</span>
                      </div>
                    )}

                    {/* Subject Controls: Generate Topics & Add Topic */}
                    {user?.role !== 'MENTOR' && (
                      <div
                        className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-brand-border/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => triggerGenerateSubjectTopics(subject)}
                          className="px-2.5 py-1 rounded-lg border border-brand-purple/30 bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple-light text-[11px] font-semibold flex items-center gap-1 transition-all"
                        >
                          <RefreshCw size={11} /> Generate Topics
                        </button>

                        <button
                          type="button"
                          onClick={() => openAddTopicModal(subject.subjectName)}
                          className="px-2.5 py-1 rounded-lg border border-brand-border bg-black/40 hover:bg-white/5 text-zinc-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
                        >
                          <Plus size={11} /> + Add Topic
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODALS */}
      {/* ───────────────────────────────────────────────────────────── */}

      {/* 1. Add Custom Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-2xl p-6 relative animate-fade-in shadow-2xl">
            <h3 className="text-lg font-bold font-display text-white mb-4">Add Custom Subject</h3>
            <form onSubmit={handleAddSubject} className="space-y-4 text-left">
              <div>
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  required
                  value={newSubjName}
                  onChange={(e) => setNewSubjName(e.target.value)}
                  placeholder="e.g. Paper 21: Financial Valuation"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Total Topics Count</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={newSubjTopics}
                  onChange={(e) => setNewSubjTopics(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddSubject(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gold">
                  Add Subject
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Manual Topic Creation Modal (+ Add Topic) (Section 3) */}
      {showAddTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-brand-card border border-brand-border rounded-2xl p-6 relative animate-fade-in shadow-2xl space-y-4 text-left">
            <h3 className="text-lg font-bold font-display text-white border-b border-brand-border/60 pb-3 flex items-center gap-2">
              <Plus className="text-brand-gold" size={18} /> Add Topic Manually
            </h3>
            <form onSubmit={handleAddTopic} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs">Subject</label>
                  <select
                    value={topicSubject}
                    onChange={(e) => setTopicSubject(e.target.value)}
                    className="form-input text-xs text-white bg-black/40"
                  >
                    <option value="">-- Custom / No Subject --</option>
                    {plan.subjects.map((s) => (
                      <option key={s.id} value={s.subjectName} className="bg-brand-dark">
                        {s.subjectName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label text-xs">Priority</label>
                  <select
                    value={topicPriority}
                    onChange={(e) => setTopicPriority(e.target.value)}
                    className="form-input text-xs text-white bg-black/40"
                  >
                    <option value="HIGH" className="bg-brand-dark">High Priority</option>
                    <option value="MEDIUM" className="bg-brand-dark">Medium Priority</option>
                    <option value="LOW" className="bg-brand-dark">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Topic Name *</label>
                <input
                  type="text"
                  required
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="e.g. Activity Based Costing vs Traditional"
                  className="form-input text-xs text-white"
                />
              </div>

              <div>
                <label className="form-label text-xs">Description / Notes (Optional)</label>
                <textarea
                  value={topicDescription}
                  onChange={(e) => setTopicDescription(e.target.value)}
                  placeholder="e.g. Focus on practical formula problems and past exam questions..."
                  className="form-input text-xs text-white h-16 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs">Target Date (Optional)</label>
                  <input
                    type="date"
                    value={topicDate}
                    onChange={(e) => setTopicDate(e.target.value)}
                    className="form-input text-xs text-white"
                    style={{ colorScheme: 'dark' }}
                  />
                  <span className="text-[10px] text-zinc-500 mt-0.5 block">Default: Unscheduled</span>
                </div>
                <div>
                  <label className="form-label text-xs">Estimated Duration (Hours)</label>
                  <input
                    type="number"
                    min="0.5"
                    max="24"
                    step="0.5"
                    value={topicHours}
                    onChange={(e) => setTopicHours(e.target.value)}
                    className="form-input text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs">Preferred Start Time</label>
                  <input
                    type="time"
                    value={topicStartTime}
                    onChange={(e) => setTopicStartTime(e.target.value)}
                    className="form-input text-xs text-white"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Preferred End Time</label>
                  <input
                    type="time"
                    value={topicEndTime}
                    onChange={(e) => setTopicEndTime(e.target.value)}
                    className="form-input text-xs text-white"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddTopic(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gold">
                  Add Topic
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Subject Regeneration Protection Modal (Section 7) */}
      {regenSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-2xl p-6 relative animate-fade-in shadow-2xl text-left space-y-4">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2 border-b border-brand-border/60 pb-2">
              <AlertCircle size={18} className="text-brand-gold" /> Existing Topics Detected
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Subject <strong className="text-white">{regenSubject.subjectName}</strong> already has topics in your plan.
              How would you like to proceed?
            </p>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => executeGenerateSubjectTopics(regenSubject.id, 'APPEND')}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-purple/20 border border-brand-purple/40 hover:bg-brand-purple/30 text-white text-xs font-bold text-left flex justify-between items-center transition-all"
              >
                <span>➕ Add More Topics</span>
                <span className="text-[10px] text-brand-purple-light uppercase">Keep Existing</span>
              </button>

              <button
                type="button"
                onClick={() => executeGenerateSubjectTopics(regenSubject.id, 'REPLACE')}
                className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-300 text-xs font-bold text-left flex justify-between items-center transition-all"
              >
                <span>🔄 Replace Existing Topics</span>
                <span className="text-[10px] text-red-400 uppercase">Overwrite All</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setRegenSubject(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Generate All Subjects Confirmation Modal */}
      {showGenAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-2xl p-6 relative animate-fade-in shadow-2xl text-left space-y-4">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2 border-b border-brand-border/60 pb-2">
              <Layers size={18} className="text-brand-gold" /> Generate Topics for All Subjects?
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              This will load standard CMA curriculum topics for all subjects in your plan. Existing manual topics will be preserved.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowGenAllConfirm(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={executeGenerateAllTopics}
                isLoading={actionLoading}
              >
                Confirm & Generate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. AI Schedule Suggestion Preview Modal (Section 6) */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-brand-card border border-brand-border rounded-2xl p-6 relative animate-fade-in shadow-2xl text-left space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-brand-border/60 pb-3">
              <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                <Sparkles size={18} className="text-brand-gold" /> Suggested Schedule Preview
              </h3>
              <span className="text-xs text-zinc-400">
                {suggestions.length} topics auto-scheduled
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              Below are suggested target dates & times calculated from your study preferences ({plan.dailyStudyHours} hrs/day).
              You can edit dates before accepting. Manual entries are strictly protected.
            </p>

            {/* Suggestions Table Stack */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 border border-brand-border/40 rounded-xl p-3 bg-black/30">
              {suggestions.map((item) => (
                <div
                  key={item.targetId}
                  className="p-3 bg-black/40 border border-brand-border/60 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] text-brand-purple-light font-bold uppercase">
                      {item.subjectName || 'General'}
                    </span>
                    <h5 className="font-semibold text-white">{item.topic}</h5>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Suggested Date</span>
                      <input
                        type="date"
                        value={item.suggestedDate}
                        onChange={(e) => handleUpdateSuggestionDate(item.targetId, e.target.value)}
                        className="bg-zinc-900 border border-brand-border rounded px-2 py-1 text-xs text-white"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-brand-border/60">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowSuggestModal(false)}>
                Reject / Cancel
              </Button>

              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={handleApplySuggestions}
                isLoading={actionLoading}
                leftIcon={<CheckCircle size={14} />}
              >
                Accept Suggestions
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanDetails;
