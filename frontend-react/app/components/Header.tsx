'use client';

import { motion } from 'framer-motion';
import { Terminal, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <div className="relative">
      {/* Animated grid background */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
               backgroundSize: '50px 50px',
               animation: 'grid-move 20s linear infinite'
             }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20 relative"
      >
        {/* Terminal-style badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-zinc-900/90 
                     rounded-lg border border-zinc-800/80 backdrop-blur-xl
                     shadow-lg shadow-blue-500/5"
        >
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-mono text-blue-400 tracking-wide">
            $ rag-agent --mode=intelligence
          </span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-blue-400"
          >
            |
          </motion.span>
        </motion.div>

        {/* Main title with typing effect feel */}
        <motion.div className="relative inline-block">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 text-white
                       tracking-tight leading-none"
            style={{ 
              textShadow: '0 0 80px rgba(59, 130, 246, 0.2)' 
            }}
          >
            RAG AI Agent
          </motion.h1>
          
          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
            className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"
          />
        </motion.div>

        {/* Subtitle with specs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8 max-w-4xl mx-auto"
        >
          <p className="text-xl md:text-2xl text-gray-300 font-light mb-4">
            Transform documents into intelligent conversations
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 font-mono">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Vector Embeddings
            </span>
            <span>•</span>
            <span>Semantic Search</span>
            <span>•</span>
            <span>GPT-4 Powered</span>
            <span>•</span>
            <span>Real-time Processing</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

