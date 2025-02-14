import React from 'react';
import { ThumbsUp, ThumbsDown, AlertTriangle, AlertCircle } from 'lucide-react';
import type { Diagnosis } from '../types';

interface Props {
  diagnosis: Diagnosis;
  onFeedback: (wasHelpful: boolean) => void;
}

export function DiagnosisResult({ diagnosis, onFeedback }: Props) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500 bg-red-50';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50';
      case 'low':
        return 'text-green-500 bg-green-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{diagnosis.condition}</h3>
        <span className="text-sm text-gray-500">
          {Math.round(diagnosis.confidence * 100)}% confidence
        </span>
      </div>

      <div className="space-y-4">
        {diagnosis.shouldSeeDoctor && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-medium">Please consult a healthcare professional</p>
          </div>
        )}

        <div className={`flex items-center gap-2 p-3 rounded-lg ${getSeverityColor(diagnosis.severity)}`}>
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium capitalize">
            {diagnosis.severity} Severity Level
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-lg">Recommendations:</h4>
          <ul className="space-y-2">
            {diagnosis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-blue-500 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <p className="text-sm text-gray-600 mb-2">Was this diagnosis helpful?</p>
        <div className="flex gap-2">
          <button
            onClick={() => onFeedback(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            Yes
          </button>
          <button
            onClick={() => onFeedback(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <ThumbsDown className="w-4 h-4" />
            No
          </button>
        </div>
      </div>
    </div>
  );
}