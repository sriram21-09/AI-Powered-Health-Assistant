import { useState, useRef, useCallback, useEffect } from 'react';
import type { VoiceState } from '../types';

// Extend Window interface for Speech Recognition
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function useSpeechRecognition() {
  const [state, setState] = useState<VoiceState>({
    isListening: false,
    transcript: '',
    isSupported: typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
    error: null,
  });

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Speech recognition is not supported in your browser. Please use Chrome or Edge.' }));
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setState(prev => ({ ...prev, isListening: true, error: null }));
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setState(prev => ({
          ...prev,
          transcript: prev.transcript + finalTranscript + interimTranscript,
        }));
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let errorMessage = 'An error occurred with speech recognition.';
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone permissions.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking again.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone found. Please connect a microphone.';
            break;
        }
        setState(prev => ({ ...prev, error: errorMessage, isListening: false }));
      };

      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false }));
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to start speech recognition.',
        isListening: false,
      }));
    }
  }, [state.isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  const resetTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '', error: null }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  };
}
