import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  GraduationCap,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Send
} from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import SubjectSelector from './SubjectSelector.jsx';
import { StudyPlanService } from '../../services/studyPlan.service.js';
import { useAuth } from '../../context/AuthContext.jsx';
import AuthModal from '../ui/AuthModal.jsx';

const StudyWizard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Wizard state values
  const [cmaLevel, setCmaLevel] = useState('FOUNDATION');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [examAttempt, setExamAttempt] = useState('');
  const [examDate, setExamDate] = useState('');
  const [dailyStudyHours, setDailyStudyHours] = useState(4);

  // Optional Study Preferences (Section 6)
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableDays, setAvailableDays] = useState([1, 2, 3, 4, 5, 6, 0]); // Mon to Sun
  const [preferredStartTime, setPreferredStartTime] = useState('19:00');
  const [preferredEndTime, setPreferredEndTime] = useState('21:00');

  const toggleAvailableDay = (dayNum) => {
    if (availableDays.includes(dayNum)) {
      if (availableDays.length === 1) {
        toast.error('Select at least one available study day.');
        return;
      }
      setAvailableDays(availableDays.filter((d) => d !== dayNum));
    } else {
      setAvailableDays([...availableDays, dayNum].sort());
    }
  };

  const nextStep = () => {
    if (step === 1 && !cmaLevel) {
      toast.error('Please select a CMA Level.');
      return;
    }
    if (step === 2 && selectedSubjects.length === 0) {
      toast.error('Please select at least one subject.');
      return;
    }
    if (step === 3 && !examAttempt) {
      toast.error('Please specify your exam attempt target.');
      return;
    }
    if (step === 4 && !examDate) {
      toast.error('Please select your exam date.');
      return;
    }
    if (step === 5 && (!dailyStudyHours || dailyStudyHours < 0.5 || dailyStudyHours > 24)) {
      toast.error('Please enter daily study hours between 0.5 and 24.');
      return;
    }

    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleLevelChange = (level) => {
    setCmaLevel(level);
    setSelectedSubjects([]);
  };

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'MENTOR') {
      toast.error('Study Planner generation is reserved for Student accounts.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        cmaLevel,
        subjects: selectedSubjects,
        examAttempt,
        examDate,
        dailyStudyHours: parseFloat(dailyStudyHours),
        startDate,
        availableDays,
        preferredStartTime,
        preferredEndTime
      };

      const result = await StudyPlanService.createPlan(payload);
      toast.success('Study plan created! Manage topics and schedule manually on your dashboard.');

      if (result?.data?.id) {
        navigate(`/study-planner/plan/${result.data.id}`);
      } else {
        navigate('/study-planner');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to create study plan.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Predefined standard exam attempt targets
  const attemptPresets = [
    'June 2026',
    'December 2026',
    'June 2027',
    'December 2027'
  ];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Progress indicators */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} className="flex items-center flex-1 last:flex-initial">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step >= num
                  ? 'bg-brand-gold text-black shadow-gold-glow'
                  : 'bg-zinc-800 text-zinc-500 border border-brand-border'
              }`}
            >
              {num}
            </div>
            {num < 6 && (
              <div
                className={`h-0.5 flex-1 mx-2 rounded transition-all duration-300 ${
                  step > num ? 'bg-brand-gold' : 'bg-zinc-800'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card padding="default" accentColor="purple">
        {/* Step 1: Select CMA Level */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold font-display text-white flex items-center justify-center gap-2">
                <GraduationCap className="text-brand-gold" /> Step 1: Select CMA Level
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Choose your current course level under CMA curriculum.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {['FOUNDATION', 'INTER', 'FINAL'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleLevelChange(level)}
                  className={`p-6 rounded-2xl border text-center transition-all duration-300 relative group overflow-hidden ${
                    cmaLevel === level
                      ? 'border-brand-gold bg-brand-gold/5 text-white shadow-gold-glow scale-102'
                      : 'border-brand-border bg-black/30 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <GraduationCap
                    size={28}
                    className={`mx-auto mb-3 transition-colors ${
                      cmaLevel === level ? 'text-brand-gold animate-bounce' : 'text-zinc-600 group-hover:text-zinc-400'
                    }`}
                  />
                  <h3 className="font-bold text-sm tracking-wider uppercase font-display">
                    {level}
                  </h3>
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    {level === 'FOUNDATION' && '4 papers'}
                    {level === 'INTER' && '8 papers'}
                    {level === 'FINAL' && '8 papers'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Subjects */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold font-display text-white flex items-center justify-center gap-2">
                <BookOpen className="text-brand-gold" /> Step 2: Select Subjects
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Choose the papers you plan to prepare for in this schedule.
              </p>
            </div>

            <div className="pt-2">
              <SubjectSelector
                level={cmaLevel}
                selectedSubjects={selectedSubjects}
                onChange={setSelectedSubjects}
              />
            </div>
          </div>
        )}

        {/* Step 3: Choose Attempt */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold font-display text-white flex items-center justify-center gap-2">
                <Calendar className="text-brand-gold" /> Step 3: Select Exam Attempt
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                When are you targeting to write these exams?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-4">
              {attemptPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setExamAttempt(preset)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    examAttempt === preset
                      ? 'border-brand-gold bg-brand-gold/5 text-white shadow-gold-glow'
                      : 'border-brand-border bg-black/20 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="max-w-lg mx-auto pt-4">
              <label htmlFor="custom-attempt" className="form-label text-left">
                Or Type Custom Target Attempt
              </label>
              <input
                id="custom-attempt"
                type="text"
                value={examAttempt}
                onChange={(e) => setExamAttempt(e.target.value)}
                placeholder="e.g. December 2026"
                className="form-input"
              />
            </div>
          </div>
        )}

        {/* Step 4: Select Exam Date */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold font-display text-white flex items-center justify-center gap-2">
                <Calendar className="text-brand-gold" /> Step 4: Specific Exam Date
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Enter the starting date of your exam session to schedule targets.
              </p>
            </div>

            <div className="max-w-md mx-auto pt-4 space-y-4 text-left">
              <div>
                <label htmlFor="exam-date" className="form-label">
                  Exam Date
                </label>
                <div className="relative">
                  <input
                    id="exam-date"
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="form-input text-white"
                    style={{ colorScheme: 'dark' }} // Force calendar icon to fit dark theme
                  />
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Must be a future date. Revision rounds will be auto-calculated backing off from this date.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Daily Study Hours & Study Preferences */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold font-display text-white flex items-center justify-center gap-2">
                <Clock className="text-brand-gold" /> Step 5: Study Hours & Preferences
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Configure your daily hours and optional study time preferences.
              </p>
            </div>

            <div className="max-w-md mx-auto pt-2 space-y-6">
              <div className="text-center space-y-2">
                <div className="text-4xl font-black font-display text-brand-gold">
                  {dailyStudyHours} <span className="text-sm text-zinc-400 font-medium">Hours / day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  step="0.5"
                  value={dailyStudyHours}
                  onChange={(e) => setDailyStudyHours(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none"
                />
              </div>

              {/* Optional Preferences (Section 6) */}
              <div className="bg-black/40 border border-brand-border/60 rounded-xl p-4 space-y-4 text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                  Optional Study Schedule Preferences
                </h4>

                <div>
                  <label className="form-label text-[11px]">Study Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input text-xs text-white"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                <div>
                  <label className="form-label text-[11px] mb-2 block">Available Study Days</label>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {[
                      { num: 1, label: 'Mon' },
                      { num: 2, label: 'Tue' },
                      { num: 3, label: 'Wed' },
                      { num: 4, label: 'Thu' },
                      { num: 5, label: 'Fri' },
                      { num: 6, label: 'Sat' },
                      { num: 0, label: 'Sun' }
                    ].map((d) => {
                      const isSel = availableDays.includes(d.num);
                      return (
                        <button
                          key={d.num}
                          type="button"
                          onClick={() => toggleAvailableDay(d.num)}
                          className={`py-1.5 rounded text-xs font-bold transition-all ${
                            isSel
                              ? 'bg-brand-purple text-white border border-brand-purple-light'
                              : 'bg-zinc-900 text-zinc-600 border border-brand-border'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label text-[11px]">Preferred Start Time</label>
                    <input
                      type="time"
                      value={preferredStartTime}
                      onChange={(e) => setPreferredStartTime(e.target.value)}
                      className="form-input text-xs text-white"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <label className="form-label text-[11px]">Preferred End Time</label>
                    <input
                      type="time"
                      value={preferredEndTime}
                      onChange={(e) => setPreferredEndTime(e.target.value)}
                      className="form-input text-xs text-white"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Summary and Plan Creation */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold font-display text-white flex items-center justify-center gap-2">
                <Sparkles className="text-brand-gold" /> Step 6: Create Study Plan
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Review your choices before creating your personalized plan structure.
              </p>
            </div>

            <div className="max-w-lg mx-auto bg-black/40 border border-brand-border rounded-2xl p-6 space-y-4 text-left">
              <div className="flex justify-between items-center border-b border-brand-border/40 pb-2">
                <span className="text-zinc-500 text-xs uppercase font-semibold">CMA Level</span>
                <span className="text-white text-sm font-bold tracking-wider">{cmaLevel}</span>
              </div>
              <div className="flex justify-between items-center border-b border-brand-border/40 pb-2">
                <span className="text-zinc-500 text-xs uppercase font-semibold">Exam Attempt</span>
                <span className="text-white text-sm font-bold">{examAttempt}</span>
              </div>
              <div className="flex justify-between items-center border-b border-brand-border/40 pb-2">
                <span className="text-zinc-500 text-xs uppercase font-semibold">Exam Date</span>
                <span className="text-white text-sm font-bold">
                  {new Date(examDate).toLocaleDateString(undefined, {
                    dateStyle: 'medium'
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-brand-border/40 pb-2">
                <span className="text-zinc-500 text-xs uppercase font-semibold">Daily Commitment</span>
                <span className="text-brand-gold text-sm font-bold">{dailyStudyHours} Hours</span>
              </div>
              <div>
                <span className="text-zinc-500 text-xs uppercase font-semibold block mb-2">
                  Selected Subjects ({selectedSubjects.length})
                </span>
                <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-2">
                  {selectedSubjects.map((subjectName) => (
                    <li key={subjectName} className="text-xs text-zinc-300 font-medium flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-brand-purple rounded-full shrink-0" />
                      {subjectName}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Buttons Controls */}
        <div className="mt-8 pt-6 border-t border-brand-border/40 flex justify-between gap-4">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={loading}
              leftIcon={<ChevronLeft size={16} />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <Button
              type="button"
              variant="gold"
              onClick={nextStep}
              rightIcon={<ChevronRight size={16} />}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              variant="gold"
              onClick={handleGenerate}
              isLoading={loading}
              leftIcon={<Send size={15} />}
              className="flex-1 sm:flex-initial shadow-gold-glow"
            >
              Create Study Plan
            </Button>
          )}
        </div>
      </Card>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Create Account to Generate Plan"
        message="Create a free account to generate your personalized CMA study plan and save it to your student dashboard."
        redirectTo="/study-planner/create"
      />
    </div>
  );
};

export default StudyWizard;
