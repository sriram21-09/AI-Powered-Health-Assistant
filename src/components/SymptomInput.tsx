import React, { useState, useRef } from 'react';
import { Mic, Send, StopCircle, HelpCircle } from 'lucide-react';
import type { Symptom } from '../types';

interface Props {
  onSubmit: (symptoms: Symptom[]) => void;
}

export function SymptomInput({ onSubmit }: Props) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [showHelp, setShowHelp] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const symptom: Symptom = {
      id: Date.now().toString(),
      name: input,
      severity,
      duration: 'recent',
      description: input,
      timestamp: new Date().toISOString()
    };

    onSubmit([symptom]);
    setInput('');
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = async (event) => {
          console.log('Audio data available:', event.data);
        };
        
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Could not access microphone. Please check permissions.');
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms in detail..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
            />
            <button
              type="button"
              onClick={() => setShowHelp(prev => !prev)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          {showHelp && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-2">Tips for describing symptoms:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Be specific about what you're experiencing</li>
                <li>Include when the symptoms started</li>
                <li>Mention if anything makes it better or worse</li>
                <li>Describe the intensity of your symptoms</li>
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Severity:</span>
              {(['mild', 'moderate', 'severe'] as const).map((level) => (
                <label key={level} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="severity"
                    value={level}
                    checked={severity === level}
                    onChange={(e) => setSeverity(e.target.value as typeof severity)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm capitalize">{level}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-lg ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } transition-colors`}
                title={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Analyze
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}