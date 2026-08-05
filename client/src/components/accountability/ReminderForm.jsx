import { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Clock } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';

const ReminderForm = ({ initialSettings, onSave, isLoading }) => {
  const [time, setTime] = useState(initialSettings?.dailyCheckinTime || '20:00');
  const [emailEnabled, setEmailEnabled] = useState(initialSettings?.emailEnabled ?? true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(initialSettings?.whatsappEnabled ?? false);
  const [pushEnabled, setPushEnabled] = useState(initialSettings?.pushEnabled ?? false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      dailyCheckinTime: time,
      emailEnabled,
      whatsappEnabled,
      pushEnabled
    });
  };

  return (
    <Card accentColor="gold" padding="default" className="text-left max-w-lg mx-auto">
      <h3 className="text-lg font-bold font-display text-white mb-6 flex items-center gap-2">
        <Bell size={18} className="text-brand-gold" /> Reminder Configurations
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Checkin Time Picker */}
        <div className="space-y-2">
          <label htmlFor="dailyCheckinTime" className="form-label flex items-center gap-1.5">
            <Clock size={14} className="text-brand-gold" /> Target Daily Check-in Time
          </label>
          <input
            id="dailyCheckinTime"
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="form-input text-white"
            style={{ colorScheme: 'dark' }}
          />
          <span className="text-[10px] text-zinc-500 mt-1 block">
            Select the time you wish to receive a study log checkout alert.
          </span>
        </div>

        {/* Reminder channels */}
        <div className="space-y-4">
          <label className="form-label">Notification Channels</label>
          
          <div className="space-y-3">
            {/* Email Channel */}
            <label className="flex items-start gap-3 p-3 rounded-xl border border-brand-border bg-black/20 hover:border-zinc-800 transition-all cursor-pointer">
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="mt-1 w-4 h-4 rounded accent-brand-gold bg-zinc-900 border-zinc-700"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Mail size={14} className="text-brand-purple-light" /> Email Notifications
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  Receive a reminder email with your custom planner summary link.
                </span>
              </div>
            </label>

            {/* WhatsApp Channel */}
            <label className="flex items-start gap-3 p-3 rounded-xl border border-brand-border bg-black/10 opacity-70 cursor-not-allowed">
              <input
                type="checkbox"
                disabled
                checked={whatsappEnabled}
                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                className="mt-1 w-4 h-4 rounded accent-brand-gold bg-zinc-900 border-zinc-700"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-zinc-400 flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-green-500" /> WhatsApp Integration (Soon)
                </span>
                <span className="text-[10px] text-zinc-600 block">
                  WhatsApp alert triggers will be available in subsequent iterations (Module 14).
                </span>
              </div>
            </label>

            {/* Push Notifications */}
            <label className="flex items-start gap-3 p-3 rounded-xl border border-brand-border bg-black/10 opacity-70 cursor-not-allowed">
              <input
                type="checkbox"
                disabled
                checked={pushEnabled}
                onChange={(e) => setPushEnabled(e.target.checked)}
                className="mt-1 w-4 h-4 rounded accent-brand-gold bg-zinc-900 border-zinc-700"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-zinc-400 flex items-center gap-1.5">
                  <Smartphone size={14} className="text-blue-400" /> Web Push Alerts (Soon)
                </span>
                <span className="text-[10px] text-zinc-600 block">
                  Enables real-time desktop or mobile browser alerts.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Action button */}
        <Button
          type="submit"
          variant="gold"
          isLoading={isLoading}
          className="w-full shadow-gold-glow"
        >
          Save Preferences
        </Button>
      </form>
    </Card>
  );
};

export default ReminderForm;
