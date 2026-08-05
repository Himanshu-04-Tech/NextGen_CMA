import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-brand-dark border border-brand-border rounded-2xl w-full max-w-sm p-6 relative shadow-2xl space-y-4">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-all"
        >
          <X size={16} />
        </button>

        {/* Warning Icon and Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/25 shrink-0">
            <AlertCircle size={20} />
          </div>
          <h4 className="text-sm font-bold text-white font-display tracking-wide">{title}</h4>
        </div>

        {/* Message body */}
        <p className="text-[11px] text-zinc-400 leading-normal">
          {message}
        </p>

        {/* Actions button row */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl border border-brand-border text-[11px] font-semibold text-zinc-300 hover:bg-white/5 transition-all"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[11px] font-bold shadow-lg transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
