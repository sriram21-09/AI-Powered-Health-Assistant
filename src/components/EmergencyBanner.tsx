import React from 'react';
import { Phone, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmergencyBannerProps {
  onAcknowledge: () => void;
}

export function EmergencyBanner({ onAcknowledge }: EmergencyBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(220,38,38,0.15), rgba(220,38,38,0.08))',
        border: '1px solid rgba(220,38,38,0.3)',
        boxShadow: '0 0 30px rgba(220,38,38,0.1)',
      }}
      role="alert"
      aria-live="assertive"
    >
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/20 animate-pulse">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-red-400 font-bold text-lg">Emergency Symptoms Detected</h3>
            <p className="text-red-300/80 text-sm">
              Your symptoms may require immediate medical attention.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10">
          <Phone className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-red-300 font-bold text-xl">Call 112 / 102</p>
            <p className="text-red-300/60 text-xs">or your local emergency number (India Support)</p>
          </div>
        </div>

        <div className="text-xs text-red-300/60 space-y-1">
          <p>• If you are experiencing chest pain, severe difficulty breathing, or signs of a stroke — call emergency services immediately.</p>
          <p>• Do NOT rely on this tool for emergency medical decisions.</p>
        </div>

        <button
          onClick={onAcknowledge}
          className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: 'rgba(220,38,38,0.15)',
            border: '1px solid rgba(220,38,38,0.25)',
            color: '#fca5a5',
          }}
          aria-label="Acknowledge emergency warning"
        >
          I Understand — Show Results
        </button>
      </div>
    </motion.div>
  );
}
