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
}

export interface Diagnosis {
  id: string;
  condition: string;
  confidence: number;
  recommendations: string[];
  shouldSeeDoctor: boolean;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  symptoms: Symptom[];
}

export interface UserFeedback {
  diagnosisId: string;
  wasHelpful: boolean;
  comments?: string;
  timestamp: string;
}

export interface SecurityConfig {
  isEncrypted: boolean;
  privacyCompliant: boolean;
  dataRetentionDays: number;
}

export type ModelType = 'NLP' | 'ML/DL' | 'Decision Trees' | 'SVM';