// ===== Core Types =====

export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  description: string;
  timestamp: string;
}

export interface ProcessedSymptom extends Symptom {
  tokens: string[];
  cleanedDescription: string;
  relevantTerms: string[];
  negatedTerms: string[];
}

// ===== Diagnosis Types =====

export interface ConditionResult {
  name: string;
  confidence: number;
  description: string;
}

export interface Diagnosis {
  id: string;
  condition: string;
  confidence: number;
  possibleConditions: ConditionResult[];
  recommendations: string[];
  shouldSeeDoctor: boolean;
  severity: 'low' | 'medium' | 'high';
  urgencyLevel: 'routine' | 'soon' | 'urgent' | 'emergency';
  followUpQuestions: string[];
  lifestyleTips: string[];
  timestamp: string;
  symptoms: Symptom[];
  inputText: string;
  aiModel: string;
}

// ===== History Types =====

export interface HealthRecord {
  id: string;
  diagnosis: Diagnosis;
  savedAt: string;
}

// ===== Feedback Types =====

export interface UserFeedback {
  diagnosisId: string;
  wasHelpful: boolean;
  comments?: string;
  timestamp: string;
}

// ===== Security Types =====

export interface SecurityConfig {
  isEncrypted: boolean;
  privacyCompliant: boolean;
  dataRetentionDays: number;
}

// ===== Voice Types =====

export interface VoiceState {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
}

// ===== Toast Types =====

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

// ===== Service Types =====

export type ModelType = 'Gemini AI' | 'Fallback (Rule-Based)';