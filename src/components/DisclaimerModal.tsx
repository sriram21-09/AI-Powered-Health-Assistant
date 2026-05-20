import React from 'react';
import { AlertTriangle, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DisclaimerModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(2,6,23,0.8)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="glass-card max-w-lg w-full p-8 space-y-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="disclaimer-title"
          >
            <div className="text-center space-y-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex justify-center"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <HeartPulse className="w-8 h-8 text-red-400" />
                </div>
              </motion.div>
              <h2 id="disclaimer-title" className="text-2xl font-bold text-surface-100">
                Important Health Notice
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg" style={{ background: 'rgba(217,119,6,0.1)' }}>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-surface-200 text-sm">Not a Substitute for Medical Care</h3>
                  <p className="text-surface-400 text-xs mt-1 leading-relaxed">
                    This AI assistant provides general guidance only and should never replace professional medical advice, diagnosis, or treatment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg" style={{ background: 'rgba(5,150,105,0.1)' }}>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-surface-200 text-sm">Emergency Situations</h3>
                  <p className="text-surface-400 text-xs mt-1 leading-relaxed">
                    If you're experiencing severe symptoms or believe you have a medical emergency, call emergency services (911) immediately.
                  </p>
                </div>
              </div>

              <div className="rounded-xl p-4 text-xs leading-relaxed"
                style={{ background: 'rgba(51,141,255,0.06)', border: '1px solid rgba(51,141,255,0.1)', color: '#94a3b8' }}>
                By continuing to use this service, you acknowledge that:
                <ul className="list-disc list-inside mt-2 space-y-1.5">
                  <li>This is an AI-powered tool providing general information only</li>
                  <li>You should always consult healthcare professionals for medical advice</li>
                  <li>Your data is processed locally and handled securely</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={onClose}
                className="btn-primary text-sm px-8"
                autoFocus
                aria-label="Accept disclaimer and continue"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}