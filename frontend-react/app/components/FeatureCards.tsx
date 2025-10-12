'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Target, Database, Cpu, Network } from 'lucide-react';

export default function FeatureCards() {
  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Lightning Fast',
      description: 'Vector search in milliseconds',
      metric: '<100ms',
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: 'Scalable Storage',
      description: 'Qdrant vector database',
      metric: '∞ docs',
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: 'AI-Powered',
      description: 'GPT-4 semantic understanding',
      metric: '1024 tokens',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Secure',
      description: 'End-to-end encryption',
      metric: 'AES-256',
    },
    {
      icon: <Network className="w-5 h-5" />,
      title: 'Real-time',
      description: 'Async event processing',
      metric: 'Inngest',
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Accurate',
      description: 'Semantic matching',
      metric: '>95%',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mt-24 mb-12"
    >
      {/* Section header */}
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-3xl font-bold text-gray-100 mb-3"
        >
          Built for Performance
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-500 font-mono text-sm"
        >
          Production-grade architecture with enterprise capabilities
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass rounded-xl p-6 backdrop-blur-xl border border-zinc-800 
                     transition-all duration-300 group/card shine-effect
                     hover:border-zinc-700 hover:shadow-lg hover:shadow-blue-500/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20
                           group-hover/card:bg-blue-500/20 transition-all duration-300">
                <div className="text-blue-400">
                  {feature.icon}
                </div>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 
                           rounded border border-cyan-500/20">
                {feature.metric}
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-100 mb-1.5">
              {feature.title}
            </h3>
            <p className="text-xs text-gray-500 font-mono">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-16 text-center space-y-6"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-zinc-900/60 
                     border border-zinc-800 rounded-lg backdrop-blur-xl">
          <span className="text-xs font-mono text-gray-500">Powered by</span>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
              OpenAI
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
              Inngest
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
              Qdrant
            </span>
          </div>
        </div>
        
        <p className="text-gray-700 text-xs font-mono">
          © 2025 RAG AI Agent · Version 1.0.0
        </p>
      </motion.div>
    </motion.div>
  );
}

