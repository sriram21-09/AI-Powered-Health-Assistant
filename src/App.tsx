import React, { useState, useCallback } from 'react';
import { Stethoscope, Shield, Info } from 'lucide-react';
import { SymptomInput } from './components/SymptomInput';
import { DiagnosisResult } from './components/DiagnosisResult';
import { DisclaimerModal } from './components/DisclaimerModal';
import type { Symptom, Diagnosis, ProcessedSymptom } from './types';
import { cleanText, tokenize, removeStopWords, extractRelevantTerms } from './utils/textProcessing';
import { DiagnosisService } from './services/DiagnosisService';

const diagnosisService = new DiagnosisService();

function App() {
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const processSymptoms = (symptoms: Symptom[]): ProcessedSymptom[] => {
    return symptoms.map(symptom => {
      const cleanedText = cleanText(symptom.description);
      const tokens = tokenize(cleanedText);
      const relevantTokens = removeStopWords(tokens);
      const relevantTerms = extractRelevantTerms(relevantTokens);

      return {
        ...symptom,
        tokens: relevantTokens,
        cleanedDescription: cleanedText,
        relevantTerms
      };
    });
  };

  const handleSymptomSubmit = useCallback(async (symptoms: Symptom[]) => {
    setProcessing(true);
    try {
      const processedSymptoms = processSymptoms(symptoms);
      const result = diagnosisService.getDiagnosis(processedSymptoms);
      setDiagnosis(result);
    } catch (error) {
      console.error('Error processing symptoms:', error);
      alert('An error occurred while processing your symptoms. Please try again.');
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleFeedback = useCallback((wasHelpful: boolean) => {
    if (!diagnosis) return;
    console.log('Feedback received:', {
      diagnosisId: diagnosis.id,
      wasHelpful,
      timestamp: new Date().toISOString()
    });
    alert('Thank you for your feedback! This helps improve our system.');
  }, [diagnosis]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <header className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-full">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">AI Health Assistant</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Describe your symptoms for an initial assessment and recommendations.
              Always consult healthcare professionals for medical advice.
            </p>
          </header>

          {/* Safety Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Your Privacy & Safety</h3>
              <p className="text-blue-700 text-sm mt-1">
                Your data is encrypted and handled securely. This tool provides general guidance only and 
                should not replace professional medical advice.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <SymptomInput onSubmit={handleSymptomSubmit} />
            
            {processing && (
              <div className="flex items-center justify-center gap-2 text-blue-500">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
                <span>Analyzing your symptoms...</span>
              </div>
            )}
            
            {diagnosis && (
              <DiagnosisResult 
                diagnosis={diagnosis} 
                onFeedback={handleFeedback}
              />
            )}
          </div>

          {/* Footer */}
          <footer className="text-center space-y-4 mt-12">
            <div className="flex items-center justify-center gap-2 text-yellow-600">
              <Info className="w-5 h-5" />
              <p className="font-medium">Important Medical Disclaimer</p>
            </div>
            <div className="text-sm text-gray-500 max-w-2xl mx-auto space-y-2">
              <p>
                This AI assistant provides general information only and should not be used for 
                diagnosis, treatment, or as a substitute for professional medical advice.
              </p>
              <p>
                Always seek the advice of your physician or other qualified health provider 
                with questions about your medical condition.
              </p>
              <p className="font-medium">
                If you're experiencing a medical emergency, call your local emergency services immediately.
              </p>
            </div>
          </footer>
        </div>
      </div>

      <DisclaimerModal 
        isOpen={showDisclaimer} 
        onClose={() => setShowDisclaimer(false)} 
      />
    </div>
  );
}

export default App;