import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, BarChart3, HelpCircle, CheckSquare, Clock, CalendarDays, Award } from 'lucide-react';
import { StudyPlanService } from '../../services/studyPlan.service.js';
import Card from '../../components/ui/Card.jsx';
import ProgressBar from '../../components/study-planner/ProgressBar.jsx';
import LoadingSkeleton from '../../components/study-planner/LoadingSkeleton.jsx';

const ProgressDashboard = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await StudyPlanService.getPlanDetails(id);
        setPlan(result?.data?.plan);
        setStats(result?.data?.stats);
      } catch (err) {
        toast.error('Failed to load analytical metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  if (!plan || !stats) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold">Study Plan not found.</h3>
        <Link to="/study-planner" className="text-brand-gold hover:underline mt-2 inline-block">
          Go back to Planner
        </Link>
      </div>
    );
  }

  const { progressPercentage, completedTopics, totalTopics, remainingDays, todaysTargets } = stats;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back link */}
      <div className="flex items-center justify-between border-b border-brand-border/40 pb-4">
        <Link
          to={`/study-planner/plan/${id}`}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-all font-semibold uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back to Plan Details
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-white flex items-center gap-2">
          <BarChart3 className="text-brand-gold" /> Study Progress & Analytics
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl">
          Complete breakdown of your study schedule progress, subject completion rates, and learning velocities.
        </p>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card accentColor="gold" padding="default">
          <div className="space-y-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              Targets Progress Rate
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white font-display">
                {progressPercentage}%
              </span>
              <span className="text-xs text-zinc-400 font-medium">Completed</span>
            </div>
            <ProgressBar value={progressPercentage} showLabel={false} size="sm" />
            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed pt-2">
              Percentage of daily study goals successfully achieved out of all scheduled days.
            </p>
          </div>
        </Card>

        <Card accentColor="purple" padding="default">
          <div className="space-y-2">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              Syllabus Topics Covered
            </span>
            <h3 className="text-3xl font-extrabold text-white font-display">
              {completedTopics} / {totalTopics}
            </h3>
            <span className="text-xs text-zinc-400 font-medium block">
              Topics Remaining: {totalTopics - completedTopics}
            </span>
            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed pt-4">
              Individual chapter topics completed within your active study subjects.
            </p>
          </div>
        </Card>

        <Card accentColor="none" padding="default">
          <div className="space-y-2">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              Time to Exam
            </span>
            <h3 className="text-3xl font-extrabold text-white font-display">
              {remainingDays} Days
            </h3>
            <span className="text-xs text-zinc-400 font-medium block">
              Exam Date: {new Date(plan.examDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </span>
            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed pt-4">
              Number of calendar days remaining until your targeted CMA exam attempt starting date.
            </p>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject wise stats */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="default">
            <h3 className="text-base font-bold font-display text-white mb-6 border-b border-brand-border/40 pb-3">
              Subject Mastery Breakdown
            </h3>

            <div className="space-y-6">
              {plan.subjects.map((subject) => {
                const subPct = subject.totalTopics > 0 ? Math.round((subject.completedTopics / subject.totalTopics) * 100) : 0;
                return (
                  <div key={subject.id} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-zinc-300">
                      <span>{subject.subjectName}</span>
                      <span className="text-brand-gold">{subPct}% Completed</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brand-purple to-brand-gold h-full rounded-full transition-all duration-300"
                        style={{ width: `${subPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500 font-medium">
                      <span>{subject.completedTopics} topics done</span>
                      <span>{subject.totalTopics - subject.completedTopics} topics remaining</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Action Widgets / Summaries */}
        <div className="space-y-6">
          <Card padding="default" accentColor="purple">
            <h3 className="text-base font-bold font-display text-white mb-4 border-b border-brand-border/40 pb-3 flex items-center gap-2">
              <CheckSquare size={16} className="text-brand-gold" /> Today's Focus
            </h3>

            {todaysTargets.length > 0 ? (
              <div className="space-y-3">
                {todaysTargets.map((dt) => (
                  <div key={dt.id} className="p-3 bg-black/30 border border-brand-border rounded-xl">
                    <h4 className="text-xs font-bold text-white">{dt.topic}</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        dt.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {dt.status}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                        <Clock size={10} /> {dt.studyHours}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-zinc-500 font-medium">
                No targets scheduled for today.
              </div>
            )}
          </Card>

          <Card padding="default" className="relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold">
                <Award size={20} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                CMA Qualification Goal
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Stay consistent! Studying <span className="text-brand-gold font-bold">{plan.dailyStudyHours} hours daily</span> keeps you on path to complete the curriculum and score well on your targeted attempt.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
