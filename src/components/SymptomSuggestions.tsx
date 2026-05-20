import React from 'react';
import { motion } from 'framer-motion';

const SUGGESTIONS = [
  'Headache', 'Fever', 'Cough', 'Nausea', 'Fatigue',
  'Sore throat', 'Runny nose', 'Dizziness', 'Back pain',
  'Chest pain', 'Shortness of breath', 'Stomach pain',
  'Muscle aches', 'Chills', 'Rash', 'Anxiety',
];

interface SymptomSuggestionsProps {
  onSelect: (symptom: string) => void;
}

export function SymptomSuggestions({ onSelect }: SymptomSuggestionsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-surface-500 font-medium uppercase tracking-wide">
        Quick Add Symptoms
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((symptom, index) => (
          <motion.button
            key={symptom}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
            onClick={() => onSelect(symptom)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                       hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(148, 163, 184, 0.06)',
              border: '1px solid rgba(148, 163, 184, 0.12)',
              color: '#94a3b8',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(51, 141, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(51, 141, 255, 0.25)';
              e.currentTarget.style.color = '#60a5fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(148, 163, 184, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.12)';
              e.currentTarget.style.color = '#94a3b8';
            }}
            type="button"
            aria-label={`Add symptom: ${symptom}`}
          >
            + {symptom}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
