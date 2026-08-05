import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

const ReplyBox = ({ onSubmit, isSubmitting = false }) => {
  const [message, setMessage] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [showAttachment, setShowAttachment] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError('Please type a reply message first.');
      return;
    }

    onSubmit({
      message: message.trim(),
      attachmentUrl: attachmentUrl.trim() || null,
    });

    setMessage('');
    setAttachmentUrl('');
    setShowAttachment(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white/5 border border-brand-border rounded-2xl p-4">
      {/* Textarea message box */}
      <div className="flex gap-3 items-end">
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setError(null);
          }}
          placeholder="Type your reply message here..."
          rows={2}
          className="flex-1 bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple resize-none min-h-[44px] max-h-[120px] transition-colors"
        />

        <div className="flex gap-2 shrink-0">
          {/* Attachment Toggle */}
          <button
            type="button"
            onClick={() => setShowAttachment(!showAttachment)}
            className={`p-2.5 rounded-xl border transition-all ${
              showAttachment || attachmentUrl
                ? 'bg-brand-purple/20 text-brand-purple border-brand-purple/40'
                : 'bg-white/5 border-brand-border text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
            title="Attach a file link"
          >
            <Paperclip size={18} />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="p-2.5 rounded-xl bg-gradient-to-r from-brand-gold-dark to-brand-gold text-black hover:scale-105 active:scale-100 transition-all shadow-gold-glow flex items-center justify-center disabled:opacity-50"
          >
            <Send size={18} className="fill-current" />
          </button>
        </div>
      </div>

      {/* Optional Attachment Link field */}
      {showAttachment && (
        <div className="space-y-1.5 animate-fadeIn">
          <input
            type="url"
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            placeholder="Paste attachment URL (e.g. screenshot link, PDF link)"
            className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-purple placeholder-zinc-600"
          />
        </div>
      )}

      {error && (
        <div className="text-[11px] font-semibold text-red-400 mt-1">
          {error}
        </div>
      )}
    </form>
  );
};

export default ReplyBox;
