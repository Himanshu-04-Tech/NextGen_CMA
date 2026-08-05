import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Bell } from 'lucide-react';
import { AccountabilityService } from '../../services/accountability.service.js';
import ReminderForm from '../../components/accountability/ReminderForm.jsx';
import LoadingSkeleton from '../../components/accountability/LoadingSkeleton.jsx';

const ReminderSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);

  const fetchSettings = async () => {
    try {
      const result = await AccountabilityService.getReminderSettings();
      setSettings(result?.data);
    } catch (err) {
      toast.error('Failed to load notification settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (settingsData) => {
    setSaving(true);
    try {
      await AccountabilityService.updateReminderSettings(settingsData);
      toast.success('Notification preferences saved successfully!');
      await fetchSettings();
    } catch (err) {
      toast.error('Failed to save reminder configurations.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Breadcrumb back */}
      <div className="border-b border-brand-border/40 pb-4">
        <Link
          to="/accountability"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-all font-semibold uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-white flex items-center gap-2">
          <Bell className="text-brand-gold" /> Notification Settings
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl">
          Toggle daily study check-in triggers and notification timing. Keep tracking consistent and active.
        </p>
      </div>

      {settings && (
        <ReminderForm
          initialSettings={settings}
          onSave={handleSaveSettings}
          isLoading={saving}
        />
      )}
    </div>
  );
};

export default ReminderSettingsPage;
