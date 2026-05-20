import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, FileSearch, Lightbulb } from 'lucide-react';

const STEPS = [
  { icon: Brain, text: 'Analyzing your symptoms...' },
  { icon: FileSearch, text: 'Cross-referencing conditions...' },
  { icon: Activity, text: 'Evaluating severity levels...' },
  { icon: Lightbulb, text: 'Generating recommendations...' },
];

export function LoadingAnalysis() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 space-y-8"
    >
      {/* Animated Pulse Ring */}
      <div className="flex justify-center">
        <div className="relative w-20 h-20">
          {/* Outer ring */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid rgba(51,141,255,0.3)' }}
          />
          {/* Middle ring */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid rgba(51,141,255,0.4)' }}
          />
          {/* Center icon */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(51,141,255,0.15), rgba(13,148,136,0.15))',
              border: '1px solid rgba(51,141,255,0.2)',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Activity className="w-8 h-8 text-brand-400" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Animated Steps */}
      <div className="space-y-3 max-w-xs mx-auto">
        {STEPS.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.8, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.8,
              }}
            >
              <step.icon className="w-4 h-4 text-brand-400" />
            </motion.div>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.8,
              }}
              className="text-sm text-surface-400"
            >
              {step.text}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Skeleton Placeholders */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="shimmer rounded-lg h-4" style={{ width: `${100 - i * 15}%` }} />
        ))}
      </div>
    </motion.div>
  );
}
