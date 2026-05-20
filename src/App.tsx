import React, { useState, useCallback, useMemo } from 'react';
import { Shield } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { ToastProvider } from './components/ToastProvider';
import { ToastContainer } from './components/Toast';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SymptomInput } from './components/SymptomInput';
import { DiagnosisResult } from './components/DiagnosisResult';
import { DisclaimerModal } from './components/DisclaimerModal';
import { EmergencyBanner } from './components/EmergencyBanner';
import { LoadingAnalysis } from './components/LoadingAnalysis';
import { HistoryPanel } from './components/HistoryPanel';
import type { Diagnosis, HealthRecord } from './types';
import { DiagnosisService } from './services/DiagnosisService';
import { HistoryService } from './services/HistoryService';

const diagnosisService = new DiagnosisService();

function AppContent() {
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyAcknowledged, setEmergencyAcknowledged] = useState(false);
  const [history, setHistory] = useState<HealthRecord[]>(() => HistoryService.getHistory());
  const [historyOpen, setHistoryOpen] = useState(false);

  const isAIAvailable = useMemo(() => diagnosisService.isAIAvailable(), []);

  const handleSymptomSubmit = useCallback(async (inputText: string, severity: string) => {
    setProcessing(true);
    setDiagnosis(null);
    setShowEmergency(false);
    setEmergencyAcknowledged(false);

    try {
      const result = await diagnosisService.getDiagnosis(inputText, severity);
      setDiagnosis(result);

      // Check for emergency
      if (result.urgencyLevel === 'emergency') {
        setShowEmergency(true);
      }
    } catch (error) {
      console.error('Error processing symptoms:', error);
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleFeedback = useCallback((wasHelpful: boolean) => {
    if (!diagnosis) return;
    console.log('Feedback received:', {
      diagnosisId: diagnosis.id,
      wasHelpful,
      timestamp: new Date().toISOString(),
    });
  }, [diagnosis]);

  const handleSave = useCallback(() => {
    if (!diagnosis) return;
    const record: HealthRecord = {
      id: Date.now().toString(),
      diagnosis,
      savedAt: new Date().toISOString(),
    };
    HistoryService.saveDiagnosis(record);
    setHistory(HistoryService.getHistory());
  }, [diagnosis]);

  const handleDeleteHistory = useCallback((id: string) => {
    HistoryService.deleteDiagnosis(id);
    setHistory(HistoryService.getHistory());
  }, []);

  const handleClearHistory = useCallback(() => {
    HistoryService.clearHistory();
    setHistory([]);
  }, []);

  return (
    <div className="min-h-screen bg-mesh">
      <ToastContainer />

      <div className="container mx-auto px-4 py-4 max-w-3xl">
        <div className="space-y-6">
          {/* Header */}
          <Header isAIAvailable={isAIAvailable} />

          {/* Privacy Notice */}
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-xl text-xs"
            style={{
              background: 'rgba(51,141,255,0.04)',
              border: '1px solid rgba(51,141,255,0.08)',
            }}
          >
            <Shield className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-surface-300">Privacy-First: </span>
              <span className="text-surface-500">
                Your symptoms are analyzed securely. No personal data is stored on any server.
                {!isAIAvailable && ' All analysis is performed locally in your browser.'}
              </span>
            </div>
          </div>

          {/* History Panel */}
          <HistoryPanel
            history={history}
            onDelete={handleDeleteHistory}
            onClear={handleClearHistory}
            isOpen={historyOpen}
            onToggle={() => setHistoryOpen(p => !p)}
          />

          {/* Symptom Input */}
          <SymptomInput onSubmit={handleSymptomSubmit} isProcessing={processing} />

          {/* Loading State */}
          <AnimatePresence mode="wait">
            {processing && <LoadingAnalysis />}
          </AnimatePresence>

          {/* Emergency Banner */}
          <AnimatePresence>
            {showEmergency && !emergencyAcknowledged && (
              <EmergencyBanner onAcknowledge={() => setEmergencyAcknowledged(true)} />
            )}
          </AnimatePresence>

          {/* Diagnosis Result */}
          <AnimatePresence mode="wait">
            {diagnosis && !processing && (!showEmergency || emergencyAcknowledged) && (
              <DiagnosisResult
                diagnosis={diagnosis}
                onFeedback={handleFeedback}
                onSave={handleSave}
              />
            )}
          </AnimatePresence>

          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Disclaimer Modal */}
      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
      />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;