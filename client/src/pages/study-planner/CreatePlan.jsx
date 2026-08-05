import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldAlert, ArrowLeft } from 'lucide-react';
import StudyWizard from '../../components/study-planner/StudyWizard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';

const CreatePlan = () => {
  const { user } = useAuth();
  const isNotStudent = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'MENTOR');

  if (isNotStudent) {
    const dashboardLink = user.role === 'MENTOR' ? '/mentorship/dashboard' : '/admin/dashboard';
    const roleLabel = user.role === 'MENTOR' ? 'Mentor' : 'Administrator';

    return (
      <div className="max-w-2xl mx-auto py-12 animate-fade-in text-center space-y-6">
        <Card className="py-12 px-6 border border-amber-500/30 bg-black/50 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <ShieldAlert size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-display text-white">
              Student Feature Only
            </h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
              Study Planner generation is reserved for Student accounts. As a {roleLabel}, you can monitor and manage student activities from your control panel.
            </p>
          </div>
          <div>
            <Link to={dashboardLink}>
              <Button variant="gold" size="lg" leftIcon={<ArrowLeft size={16} />} className="shadow-gold-glow px-8">
                Return to {roleLabel} Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-xs text-brand-gold font-semibold uppercase tracking-widest font-display">
          <Sparkles size={12} /> Plan Generator
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight">
          Create Study Roadmap
        </h1>
        <p className="text-zinc-500 text-sm max-w-md mx-auto">
          Complete the steps below to configure your syllabus timeline and launch your targets.
        </p>
      </div>

      <StudyWizard />
    </div>
  );
};

export default CreatePlan;
