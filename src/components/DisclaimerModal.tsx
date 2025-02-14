import React from 'react';
import { AlertTriangle, ShieldCheck, HeartPulse } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DisclaimerModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <HeartPulse className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Important Health Notice</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Not a Substitute for Medical Care</h3>
              <p className="text-gray-600 text-sm mt-1">
                This AI assistant provides general guidance only and should never replace 
                professional medical advice, diagnosis, or treatment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Emergency Situations</h3>
              <p className="text-gray-600 text-sm mt-1">
                If you're experiencing severe symptoms or believe you have a medical 
                emergency, please call emergency services (911) immediately.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
            By continuing to use this service, you acknowledge that:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>This is an AI-powered tool providing general information only</li>
              <li>You should always consult healthcare professionals for medical advice</li>
              <li>Your data is handled securely and privately</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 
                     transition-colors font-medium focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}