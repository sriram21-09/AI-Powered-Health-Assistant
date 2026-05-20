import React from 'react';
import { Heart, Shield, AlertTriangle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="text-center space-y-6 mt-16 pb-8">
      {/* Disclaimer Section */}
      <div className="glass-card p-6 max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-amber-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-semibold text-sm uppercase tracking-wide">Medical Disclaimer</h3>
        </div>
        <div className="text-sm text-surface-400 space-y-2 leading-relaxed">
          <p>
            This AI assistant provides general health information only. It is{' '}
            <span className="text-surface-300 font-medium">not a substitute</span>{' '}
            for professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            Always seek the advice of your physician or other qualified health
            provider with questions about your medical condition.
          </p>
          <p className="text-amber-400/80 font-medium">
            If you're experiencing a medical emergency, call your local emergency
            services (911) immediately.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-center gap-6 text-surface-500 text-xs">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy-First</span>
        </div>
        <span className="text-surface-700">•</span>
        <div className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5" />
          <span>Built with Care</span>
        </div>
        <span className="text-surface-700">•</span>
        <span>v2.0</span>
      </div>
    </footer>
  );
}
