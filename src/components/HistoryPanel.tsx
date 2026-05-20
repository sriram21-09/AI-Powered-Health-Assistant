import React from 'react';
import { Clock, Trash2, ChevronRight, History, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HealthRecord } from '../types';

interface Props {
  history: HealthRecord[];
  onDelete: (id: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return '#f87171';
    case 'medium': return '#fbbf24';
    case 'low': return '#34d399';
    default: return '#94a3b8';
  }
};

export function HistoryPanel({ history, onDelete, onClear, isOpen, onToggle }: Props) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [confirmClear, setConfirmClear] = React.useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all"
        style={{
          background: 'rgba(148,163,184,0.06)',
          border: '1px solid rgba(148,163,184,0.12)',
          color: '#94a3b8',
        }}
        aria-label={isOpen ? 'Close history panel' : 'Open history panel'}
        aria-expanded={isOpen}
      >
        <History className="w-3.5 h-3.5" />
        History
        {history.length > 0 && (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-brand-500/20 text-brand-400">
            {history.length}
          </span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card mt-3 p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-surface-200">Diagnosis History</h3>
                {history.length > 0 && (
                  <div>
                    {confirmClear ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-surface-400">Clear all?</span>
                        <button
                          onClick={() => { onClear(); setConfirmClear(false); }}
                          className="text-xs text-red-400 hover:text-red-300 font-medium"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmClear(false)}
                          className="text-xs text-surface-400 hover:text-surface-300"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmClear(true)}
                        className="text-xs text-surface-500 hover:text-red-400 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Empty State */}
              {history.length === 0 && (
                <div className="text-center py-8 space-y-2">
                  <AlertCircle className="w-8 h-8 text-surface-600 mx-auto" />
                  <p className="text-sm text-surface-500">No saved diagnoses yet</p>
                  <p className="text-xs text-surface-600">
                    Your saved diagnosis results will appear here
                  </p>
                </div>
              )}

              {/* History Items */}
              <div className="space-y-2">
                {history.map((record) => {
                  const isExpanded = expandedId === record.id;
                  const sevColor = getSeverityColor(record.diagnosis.severity);

                  return (
                    <motion.div
                      key={record.id}
                      layout
                      className="rounded-xl overflow-hidden transition-all"
                      style={{
                        background: 'rgba(15,23,42,0.5)',
                        border: '1px solid rgba(148,163,184,0.08)',
                      }}
                    >
                      {/* Summary Row */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : record.id)}
                        className="w-full p-3 flex items-center gap-3 text-left hover:bg-white/[0.02] transition-colors"
                        aria-expanded={isExpanded}
                      >
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sevColor }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-200 truncate">
                            {record.diagnosis.condition}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Clock className="w-3 h-3 text-surface-600" />
                            <span className="text-[10px] text-surface-500">
                              {new Date(record.savedAt).toLocaleDateString()} • {new Date(record.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-surface-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </button>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-3 pb-3 space-y-2 overflow-hidden"
                          >
                            <p className="text-xs text-surface-400 italic">
                              "{record.diagnosis.inputText}"
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-surface-500">Confidence:</span>
                              <span className="text-surface-300">{Math.round(record.diagnosis.confidence * 100)}%</span>
                              <span className="text-surface-700">|</span>
                              <span className="text-surface-500">Model:</span>
                              <span className="text-surface-300">{record.diagnosis.aiModel}</span>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); onDelete(record.id); }}
                              className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors mt-1"
                              aria-label={`Delete diagnosis for ${record.diagnosis.condition}`}
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
