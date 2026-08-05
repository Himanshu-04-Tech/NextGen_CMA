import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, ArrowRight, Calendar, PlusCircle, Sparkles } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import ProgressBar from './ProgressBar.jsx';
import { parseSubjectDisplay } from '../../utils/subjectUtils.js';

const SubjectCard = ({ subject, planId, dailyTargets = [], onGenerateTopics }) => {
  const navigate = useNavigate();

  const { primaryName, paperInfo } = parseSubjectDisplay(subject.subjectName);

  // Compute actual targets for this subject from dailyTargets
  const subjectTargets = dailyTargets.filter(
    (t) => t.subjectName === subject.subjectName || t.topic.startsWith(`${subject.subjectName}:`)
  );

  const totalTopics = subjectTargets.length > 0 ? subjectTargets.length : (subject.totalTopics || 0);
  const completedTopics = subjectTargets.length > 0
    ? subjectTargets.filter((t) => t.status === 'COMPLETED').length
    : (subject.completedTopics || 0);

  const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Find next upcoming scheduled target
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingTarget = subjectTargets.find(t => {
    if (!t.date) return false;
    const d = new Date(t.date);
    return d.getFullYear() > 1970 && d >= today;
  });

  const handleOpenPlanner = () => {
    navigate(`/study-planner/plan/${planId}?subjectId=${subject.id}`);
  };

  const hasTopics = totalTopics > 0;

  return (
    <Card accentColor={hasTopics ? 'gold' : 'none'} padding="default" className="relative group overflow-hidden flex flex-col justify-between h-full transition-all duration-300 hover:border-brand-gold/40">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-gold/10 transition-all" />

      <div className="space-y-4 relative z-10">
        {/* Header: Secondary Paper Badge + Primary Subject Name */}
        <div className="space-y-1">
          {paperInfo ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-[10px] font-bold text-brand-gold uppercase tracking-wider font-display">
              {paperInfo}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 border border-brand-border text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-display">
              CMA Subject
            </span>
          )}

          <h3 className="text-xl font-bold font-display text-white group-hover:text-brand-gold transition-colors leading-snug">
            {primaryName}
          </h3>
        </div>

        {/* Dynamic Topic Metrics */}
        {hasTopics ? (
          <div className="grid grid-cols-2 gap-3 py-2 border-y border-brand-border/40 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Total Topics</span>
              <span className="font-bold text-white flex items-center gap-1">
                <BookOpen size={13} className="text-brand-gold" />
                {totalTopics} {totalTopics === 1 ? 'Topic' : 'Topics'}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Completed</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle size={13} />
                {completedTopics} Completed
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-black/30 border border-brand-border/50 text-left space-y-1 my-2">
            <p className="text-xs text-amber-300/90 font-semibold flex items-center gap-1.5">
              <Sparkles size={13} /> No study plan created yet
            </p>
            <p className="text-[11px] text-zinc-400">
              0 topics assigned. Open planner to add topics or generate syllabus roadmap.
            </p>
          </div>
        )}

        {/* Progress Bar Section */}
        {hasTopics && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-zinc-400 text-[11px] uppercase tracking-wider">Progress</span>
              <span className="text-brand-gold font-bold">{progressPercentage}%</span>
            </div>
            <ProgressBar value={progressPercentage} size="sm" showLabel={false} />
          </div>
        )}

        {/* Upcoming Target Date if available */}
        {upcomingTarget && (
          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 pt-1">
            <Calendar size={12} className="text-brand-purple-light" />
            <span>Next Target: <strong className="text-white font-medium">{new Date(upcomingTarget.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</strong></span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-5 mt-4 border-t border-brand-border/40 flex items-center gap-2">
        <Button
          variant={hasTopics ? 'gold' : 'outline'}
          size="sm"
          onClick={handleOpenPlanner}
          className="w-full flex justify-center items-center gap-2 text-xs font-bold"
        >
          {hasTopics ? (
            <>
              Open Planner <ArrowRight size={14} />
            </>
          ) : (
            <>
              <PlusCircle size={14} /> Create Planner
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default SubjectCard;
