'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Copy, Check, Code } from 'lucide-react';
import { useState } from 'react';

interface AnswerDisplayProps {
  answer: string;
  sources: string[];
}

export default function AnswerDisplay({ answer, sources }: AnswerDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Split answer into words for typewriter effect
  const words = answer.split(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Answer Section with terminal aesthetic */}
      <div className="glass glass-hover rounded-xl overflow-hidden shine-effect group">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-zinc-900/80 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono text-gray-400">response.txt</span>
            </div>
          </div>
          
          <motion.button
            onClick={copyToClipboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-700/50
                     rounded-md text-xs font-mono text-gray-400 hover:text-gray-200
                     transition-all duration-200 border border-zinc-700/50"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
        
        {/* Content area */}
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-200 leading-relaxed space-y-4"
          >
            {words.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03, duration: 0.1 }}
                className="inline-block mr-1"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
          
          {/* Metadata footer */}
          <div className="mt-6 pt-4 border-t border-zinc-800/50 flex items-center gap-4 text-xs font-mono text-gray-600">
            <span>{words.length} words</span>
            <span>•</span>
            <span>{answer.length} characters</span>
            <span>•</span>
            <span className="text-green-500">✓ AI Generated</span>
          </div>
        </div>
      </div>

      {/* Sources Section - Code-like presentation */}
      {sources && sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass glass-hover rounded-xl overflow-hidden shine-effect"
        >
          {/* Header */}
          <div className="px-6 py-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-mono text-gray-300">Referenced Sources</span>
            </div>
            <span className="text-xs font-mono text-gray-500">
              {sources.length} {sources.length === 1 ? 'file' : 'files'}
            </span>
          </div>
          
          {/* Sources list */}
          <div className="p-6 space-y-2">
            {sources.map((source, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ x: 4 }}
                className="group/source flex items-center gap-3 p-4 bg-black/40 border border-zinc-800 
                         rounded-lg hover:bg-zinc-900/60 hover:border-blue-500/30 
                         transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md
                               bg-blue-500/10 text-blue-400 text-xs font-mono font-bold
                               border border-blue-500/20">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <span className="text-gray-300 font-mono text-sm block">
                      {source}
                    </span>
                    <span className="text-xs text-gray-600 font-mono">
                      Vector match • Embedded context
                    </span>
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="text-blue-400 opacity-0 group-hover/source:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

