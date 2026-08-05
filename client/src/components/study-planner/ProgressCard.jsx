import { Link } from 'react-router-dom';
import { Calendar, Trash2, ShieldAlert, GraduationCap, LayoutDashboard, Clock, ExternalLink } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import ProgressBar from './ProgressBar.jsx';

const ProgressCard = ({ plan, stats, onDelete }) => {
  const { id, cmaLevel, examDate, dailyStudyHours } = plan;
  const { progressPercentage, remainingDays } = stats;

  const formattedExamDate = new Date(examDate).toLocaleDateString(undefined, {
    dateStyle: 'long'
  });

  return (
    <div className="animate-fade-in">
      <Card accentColor="gold" padding="default" className="relative overflow-hidden">
        {/* Ambient background blur */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-brand-gold/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20 text-[10px] text-brand-gold font-bold uppercase tracking-widest font-display">
                  CMA Level
                </span>
                <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                  Target Exam
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1 uppercase">
                {cmaLevel} Syllabus Plan
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2">
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">
                  Exam Date
                </span>
                <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Calendar size={14} className="text-brand-gold" />
                  {formattedExamDate}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">
                  Daily Committment
                </span>
                <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Clock size={14} className="text-brand-gold" />
                  {dailyStudyHours} Hours
                </span>
              </div>

              <div className="space-y-0.5 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">
                  Remaining Study Days
                </span>
                <span className="text-sm font-bold text-brand-purple-light">
                  {remainingDays} Days Left
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex sm:flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={() => onDelete(id)}
              className="flex-1 sm:flex-initial p-3 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center gap-1.5 text-xs font-semibold"
              title="Delete Study Plan"
            >
              <Trash2 size={14} /> Delete Plan
            </button>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="mt-8 pt-6 border-t border-brand-border/40 space-y-6">
          <ProgressBar value={progressPercentage} showLabel={true} size="md" />

          {/* Quick Dashboard Action Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Link to={`/study-planner/plan/${id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full flex justify-center gap-1.5 text-xs font-semibold">
                <LayoutDashboard size={14} /> Open Core Planner
              </Button>
            </Link>

            <Link to={`/study-planner/calendar/${id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full flex justify-center gap-1.5 text-xs font-semibold">
                <Calendar size={14} /> Revision Calendar
              </Button>
            </Link>

            <Link to={`/study-planner/dashboard/${id}`} className="w-full">
              <Button variant="gold" size="sm" className="w-full flex justify-center gap-1.5 text-xs font-semibold">
                <ExternalLink size={14} /> Progress Analytics
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProgressCard;
