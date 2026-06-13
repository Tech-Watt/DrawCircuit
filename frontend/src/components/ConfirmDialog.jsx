import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel, loading = false }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-tw-text/50 backdrop-blur-sm" onClick={onCancel}>
      <div
        className="card-elevated w-full max-w-sm p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-tw-surface-2 text-tw-muted transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-xl bg-tw-danger/10 border border-tw-danger/20 flex items-center justify-center mb-4">
          <AlertTriangle size={22} className="text-tw-danger" />
        </div>

        <h3 className="text-lg font-bold text-tw-text mb-2">{title}</h3>
        <p className="text-tw-muted text-sm leading-relaxed mb-6">{message}</p>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button onClick={onCancel} disabled={loading} className="btn btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="btn flex-1 !text-white bg-tw-danger hover:opacity-90">
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
