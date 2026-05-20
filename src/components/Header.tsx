import React from 'react';
import { Stethoscope, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  isAIAvailable: boolean;
}

export function Header({ isAIAvailable }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center space-y-5 pt-8 pb-4"
    >
      {/* Animated Logo */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-flex items-center justify-center"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(51,141,255,0.2), rgba(13,148,136,0.2))',
              border: '1px solid rgba(51,141,255,0.2)',
              boxShadow: '0 0 30px rgba(51,141,255,0.15)',
            }}
          >
            <Stethoscope className="w-8 h-8 text-brand-400" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="text-gradient">AI Health</span>{' '}
          <span className="text-surface-200">Assistant</span>
        </h1>
        <p className="text-surface-400 text-lg max-w-xl mx-auto leading-relaxed">
          Describe your symptoms for an intelligent AI-powered analysis and
          personalized health recommendations.
        </p>
      </div>

      {/* AI Status Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
        style={{
          background: isAIAvailable
            ? 'rgba(5, 150, 105, 0.1)'
            : 'rgba(217, 119, 6, 0.1)',
          border: `1px solid ${isAIAvailable ? 'rgba(5,150,105,0.2)' : 'rgba(217,119,6,0.2)'}`,
          color: isAIAvailable ? '#34d399' : '#fbbf24',
        }}
      >
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: isAIAvailable ? '#059669' : '#d97706' }}
        />
        {isAIAvailable ? 'Gemini AI Connected' : 'Using Offline Analysis'}
      </motion.div>
    </motion.header>
  );
}
