import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useToast } from './ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';

const ICON_MAP = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLOR_MAP = {
  success: {
    bg: 'rgba(5, 150, 105, 0.12)',
    border: 'rgba(5, 150, 105, 0.25)',
    text: '#34d399',
    progress: '#059669',
  },
  error: {
    bg: 'rgba(220, 38, 38, 0.12)',
    border: 'rgba(220, 38, 38, 0.25)',
    text: '#f87171',
    progress: '#dc2626',
  },
  warning: {
    bg: 'rgba(217, 119, 6, 0.12)',
    border: 'rgba(217, 119, 6, 0.25)',
    text: '#fbbf24',
    progress: '#d97706',
  },
  info: {
    bg: 'rgba(37, 99, 235, 0.12)',
    border: 'rgba(37, 99, 235, 0.25)',
    text: '#60a5fa',
    progress: '#2563eb',
  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = ICON_MAP[toast.type];
          const colors = COLOR_MAP[toast.type];

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="pointer-events-auto rounded-xl overflow-hidden backdrop-blur-xl"
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
              role="alert"
            >
              <div className="p-4 flex items-start gap-3">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.text }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: colors.text }}>
                    {toast.title}
                  </p>
                  {toast.message && (
                    <p className="text-xs mt-1 text-surface-400">{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-surface-500 hover:text-surface-300 transition-colors flex-shrink-0"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Progress bar */}
              <div className="h-0.5 w-full" style={{ background: 'rgba(148,163,184,0.1)' }}>
                <div
                  className="h-full animate-progress"
                  style={{
                    background: colors.progress,
                    animationDuration: `${toast.duration || 4000}ms`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
