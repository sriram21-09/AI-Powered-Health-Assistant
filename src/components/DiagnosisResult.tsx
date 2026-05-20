import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, AlertTriangle, ChevronDown, ChevronUp, Save, Copy, Check, Stethoscope, MessageCircle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Diagnosis } from '../types';
import { useToast } from '../hooks/useToast';

interface Props {
  diagnosis: Diagnosis;
  onFeedback: (wasHelpful: boolean) => void;
  onSave: () => void;
}

const getSeverityStyle = (severity: string) => {
  switch (severity) {
    case 'high': return { color: '#f87171', bg: 'rgba(220,38,38,0.1)', border: 'rgba(220,38,38,0.2)' };
    case 'medium': return { color: '#fbbf24', bg: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.2)' };
    case 'low': return { color: '#34d399', bg: 'rgba(5,150,105,0.1)', border: 'rgba(5,150,105,0.2)' };
    default: return { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' };
  }
};

const getUrgencyLabel = (urgency: string) => {
  switch (urgency) {
    case 'emergency': return { text: '🚨 Emergency — Seek Help Now', color: '#f87171' };
    case 'urgent': return { text: '⚠️ Urgent — See a Doctor Today', color: '#fb923c' };
    case 'soon': return { text: '📋 See a Doctor Soon', color: '#fbbf24' };
    default: return { text: '✅ Routine', color: '#34d399' };
  }
};

export function DiagnosisResult({ diagnosis, onFeedback, onSave }: Props) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const { addToast } = useToast();

  const handleFeedback = (wasHelpful: boolean) => {
    onFeedback(wasHelpful);
    setFeedbackGiven(true);
    addToast('success', 'Thank you!', 'Your feedback helps improve our system.');
  };

  const handleSave = () => {
    onSave();
    setSaved(true);
    addToast('success', 'Saved', 'Diagnosis saved to your history.');
  };

  const handleCopy = async () => {
    const summary = `AI Health Assistant Report\n\nCondition: ${diagnosis.condition}\nConfidence: ${Math.round(diagnosis.confidence * 100)}%\nSeverity: ${diagnosis.severity}\n\nRecommendations:\n${diagnosis.recommendations.map(r => `• ${r}`).join('\n')}\n\n⚠️ This is AI-generated general information, not medical advice.`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      addToast('info', 'Copied!', 'Report summary copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('error', 'Copy failed', 'Could not copy to clipboard.');
    }
  };

  const sevStyle = getSeverityStyle(diagnosis.severity);
  const urgency = getUrgencyLabel(diagnosis.urgencyLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card overflow-hidden"
      role="region"
      aria-label="Diagnosis results"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-brand-400" />
              <h3 className="text-xl font-bold text-surface-100">{diagnosis.condition}</h3>
            </div>
            <p className="text-xs text-surface-500">
              Analyzed by {diagnosis.aiModel} • {new Date(diagnosis.timestamp).toLocaleTimeString()}
            </p>
          </div>
          <span className="badge" style={{ background: sevStyle.bg, color: sevStyle.color, border: `1px solid ${sevStyle.border}` }}>
            {diagnosis.severity}
          </span>
        </div>

        {diagnosis.shouldSeeDoctor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-4"
            style={{ background: diagnosis.urgencyLevel === 'emergency' ? 'rgba(220,38,38,0.1)' : 'rgba(217,119,6,0.08)', border: `1px solid ${diagnosis.urgencyLevel === 'emergency' ? 'rgba(220,38,38,0.2)' : 'rgba(217,119,6,0.15)'}` }}>
            <AlertTriangle className="w-4 h-4" style={{ color: urgency.color }} />
            <span className="text-sm font-medium" style={{ color: urgency.color }}>{urgency.text}</span>
          </motion.div>
        )}
      </div>

      {/* Possible Conditions */}
      {diagnosis.possibleConditions.length > 0 && (
        <div className="px-6 pb-4 space-y-3">
          <h4 className="text-xs font-medium text-surface-500 uppercase tracking-wide">Possible Conditions</h4>
          {diagnosis.possibleConditions.map((cond, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-surface-200">{cond.name}</span>
                <span className="text-xs text-surface-400">{Math.round(cond.confidence * 100)}%</span>
              </div>
              <div className="confidence-bar">
                <motion.div className="confidence-fill" initial={{ width: 0 }} animate={{ width: `${cond.confidence * 100}%` }} transition={{ duration: 1, delay: 0.5 + index * 0.15 }} />
              </div>
              {cond.description && <p className="text-xs text-surface-500 leading-relaxed">{cond.description}</p>}
            </motion.div>
          ))}
        </div>
      )}

      <div className="mx-6 h-px" style={{ background: 'var(--glass-border)' }} />

      {/* Recommendations */}
      <div className="p-6 space-y-3">
        <h4 className="text-xs font-medium text-surface-500 uppercase tracking-wide">Recommendations</h4>
        <ul className="space-y-2.5">
          {diagnosis.recommendations.map((rec, index) => (
            <motion.li key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + index * 0.08 }} className="flex items-start gap-3 text-sm text-surface-300">
              <span className="text-brand-400 mt-0.5 text-xs">●</span>
              <span className="leading-relaxed">{rec}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Follow-up Questions */}
      {diagnosis.followUpQuestions.length > 0 && (
        <div className="px-6 pb-2">
          <button onClick={() => setShowFollowUp(p => !p)} className="flex items-center gap-2 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors w-full py-2" aria-expanded={showFollowUp}>
            <MessageCircle className="w-3.5 h-3.5" /><span>Questions to Consider</span>
            {showFollowUp ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
          </button>
          <AnimatePresence>
            {showFollowUp && (
              <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 pb-3 overflow-hidden">
                {diagnosis.followUpQuestions.map((q, i) => (
                  <li key={i} className="text-xs text-surface-400 flex items-start gap-2"><span className="text-brand-500">?</span><span>{q}</span></li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Lifestyle Tips */}
      {diagnosis.lifestyleTips.length > 0 && (
        <div className="px-6 pb-2">
          <button onClick={() => setShowTips(p => !p)} className="flex items-center gap-2 text-xs font-medium text-medical-teal hover:text-emerald-300 transition-colors w-full py-2" aria-expanded={showTips}>
            <Lightbulb className="w-3.5 h-3.5" /><span>Lifestyle Tips</span>
            {showTips ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
          </button>
          <AnimatePresence>
            {showTips && (
              <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 pb-3 overflow-hidden">
                {diagnosis.lifestyleTips.map((tip, i) => (
                  <li key={i} className="text-xs text-surface-400 flex items-start gap-2"><span className="text-medical-teal">💡</span><span>{tip}</span></li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="mx-6 h-px" style={{ background: 'var(--glass-border)' }} />

      {/* Action Bar */}
      <div className="p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          {feedbackGiven ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 text-sm text-medical-emerald">
              <Check className="w-4 h-4" /><span className="font-medium">Thank you for your feedback!</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs text-surface-500">Was this helpful?</span>
              <div className="flex gap-1.5">
                <button onClick={() => handleFeedback(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95" style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.15)', color: '#34d399' }} aria-label="Mark as helpful">
                  <ThumbsUp className="w-3.5 h-3.5" />Yes
                </button>
                <button onClick={() => handleFeedback(false)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)', color: '#f87171' }} aria-label="Mark as not helpful">
                  <ThumbsDown className="w-3.5 h-3.5" />No
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saved} className="btn-secondary flex items-center gap-1.5 text-xs" aria-label="Save to history">
            {saved ? <Check className="w-3.5 h-3.5 text-medical-emerald" /> : <Save className="w-3.5 h-3.5" />}{saved ? 'Saved' : 'Save'}
          </button>
          <button onClick={handleCopy} className="btn-secondary flex items-center gap-1.5 text-xs" aria-label="Copy report">
            {copied ? <Check className="w-3.5 h-3.5 text-brand-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}