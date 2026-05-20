import React, { useState } from 'react';
import { Mic, MicOff, Send, HelpCircle, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { SymptomSuggestions } from './SymptomSuggestions';
import { useToast } from './ToastProvider';

interface Props {
  onSubmit: (text: string, severity: string) => void;
  isProcessing: boolean;
}

const SEVERITY_OPTIONS = [
  { value: 'mild', label: 'Mild', color: '#34d399', bg: 'rgba(5,150,105,0.1)', border: 'rgba(5,150,105,0.25)' },
  { value: 'moderate', label: 'Moderate', color: '#fbbf24', bg: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.25)' },
  { value: 'severe', label: 'Severe', color: '#f87171', bg: 'rgba(220,38,38,0.1)', border: 'rgba(220,38,38,0.25)' },
] as const;

export function SymptomInput({ onSubmit, isProcessing }: Props) {
  const [input, setInput] = useState('');
  const [severity, setSeverity] = useState<string>('moderate');
  const [showHelp, setShowHelp] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { addToast } = useToast();

  const {
    isListening,
    isSupported: voiceSupported,
    startListening,
    stopListening,
    transcript,
    resetTranscript,
    error: voiceError,
  } = useSpeechRecognition();

  // Sync voice transcript to input
  React.useEffect(() => {
    if (transcript) {
      setInput(prev => {
        // Avoid duplicate text
        if (prev.endsWith(transcript)) return prev;
        return prev ? prev + ' ' + transcript : transcript;
      });
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  // Show voice error as toast
  React.useEffect(() => {
    if (voiceError) {
      addToast('error', 'Voice Input Error', voiceError);
    }
  }, [voiceError, addToast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSubmit(input.trim(), severity);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (input.trim() && !isProcessing) {
        onSubmit(input.trim(), severity);
      }
    }
  };

  const handleSuggestionSelect = (symptom: string) => {
    setInput(prev => {
      if (prev.trim()) {
        return prev.trim() + ', ' + symptom.toLowerCase();
      }
      return symptom;
    });
  };

  const toggleVoice = () => {
    if (!voiceSupported) {
      addToast('warning', 'Voice Not Supported', 'Please use Chrome or Edge browser for voice input.');
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="space-y-4"
    >
      <div className="glass-card p-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Textarea */}
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your symptoms in detail... (e.g., 'I have a persistent headache, mild fever, and feel nauseous')"
              className="input-glass px-4 py-4 resize-none h-32 text-sm leading-relaxed pr-10"
              disabled={isProcessing}
              aria-label="Symptom description input"
              id="symptom-input"
            />

            {/* Character counter */}
            <div className="absolute bottom-3 right-3 text-xs text-surface-600">
              {input.length}
            </div>

            {/* Help toggle */}
            <button
              type="button"
              onClick={() => setShowHelp(prev => !prev)}
              className="absolute top-3 right-3 text-surface-500 hover:text-surface-300 transition-colors"
              aria-label="Show tips for describing symptoms"
              title="Tips for describing symptoms"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Help Tips */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-surface-400 rounded-xl p-4 overflow-hidden"
                style={{
                  background: 'rgba(51,141,255,0.05)',
                  border: '1px solid rgba(51,141,255,0.1)',
                }}
              >
                <p className="font-medium mb-2 text-brand-400 text-xs uppercase tracking-wide">
                  Tips for better results
                </p>
                <ul className="space-y-1.5 text-xs">
                  <li>• Be specific about what you're experiencing</li>
                  <li>• Include when the symptoms started</li>
                  <li>• Mention if anything makes it better or worse</li>
                  <li>• Describe the intensity and location of symptoms</li>
                  <li>• Use the quick-add buttons below for common symptoms</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Severity & Actions Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Severity Pills */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-surface-500 font-medium uppercase tracking-wide">
                Severity
              </span>
              <div className="flex gap-1.5">
                {SEVERITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSeverity(option.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                    style={{
                      background: severity === option.value ? option.bg : 'transparent',
                      border: `1px solid ${severity === option.value ? option.border : 'rgba(148,163,184,0.1)'}`,
                      color: severity === option.value ? option.color : '#64748b',
                    }}
                    aria-label={`Set severity to ${option.label}`}
                    aria-pressed={severity === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-auto">
              {/* Voice Button */}
              <button
                type="button"
                onClick={toggleVoice}
                disabled={isProcessing}
                className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                  isListening
                    ? 'mic-pulse bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:text-surface-200 hover:border-surface-600'
                }`}
                title={isListening ? 'Stop recording' : voiceSupported ? 'Start voice input' : 'Voice not supported'}
                aria-label={isListening ? 'Stop voice recording' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="btn-primary flex items-center gap-2 text-sm"
                aria-label="Analyze symptoms"
              >
                <Send className="w-4 h-4" />
                Analyze
              </button>
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="flex items-center gap-1.5 text-surface-600 text-xs">
            <Keyboard className="w-3 h-3" />
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-surface-800 text-surface-400 text-[10px] font-mono">Ctrl+Enter</kbd> to submit</span>
          </div>
        </form>
      </div>

      {/* Symptom Suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          type="button"
          onClick={() => setShowSuggestions(prev => !prev)}
          className="text-xs text-surface-500 hover:text-surface-300 transition-colors mb-2"
        >
          {showSuggestions ? '▾ Hide suggestions' : '▸ Show symptom suggestions'}
        </button>
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <SymptomSuggestions onSelect={handleSuggestionSelect} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}