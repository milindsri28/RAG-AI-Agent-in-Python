'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface QueryFormProps {
  onQuerySuccess: (question: string, answer: string, sources: string[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  selectedQuestion?: string;
  onQuestionSelected?: () => void;
}

export default function QueryForm({ onQuerySuccess, isLoading, setIsLoading, selectedQuestion, onQuestionSelected }: QueryFormProps) {
  const [question, setQuestion] = useState('');
  const [topK, setTopK] = useState(5);

  // Handle selected question from history
  React.useEffect(() => {
    if (selectedQuestion && selectedQuestion !== question) {
      setQuestion(selectedQuestion);
      toast.success('Question loaded from history!', {
        icon: '📝',
        duration: 2000,
      });
      if (onQuestionSelected) {
        onQuestionSelected();
      }
      // Focus the input field
      setTimeout(() => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }, 100);
    }
  }, [selectedQuestion, question, onQuestionSelected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/query', {
        question: question.trim(),
        top_k: topK,
      });

      const { answer, sources } = response.data;
      onQuerySuccess(question.trim(), answer, sources);
      toast.success('Answer generated!');
    } catch (error: any) {
      toast.error(`Query failed: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass glass-hover rounded-2xl p-8 shine-effect group"
    >
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Query Engine</h2>
          <p className="text-gray-500 text-sm font-mono">
            Semantic search • RAG • GPT-4
          </p>
        </div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          className="text-4xl opacity-20 group-hover:opacity-40 transition-opacity"
        >
          🧠
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-36">
        <div className="relative group/input">
          <label className="block text-xs font-mono text-gray-500 mb-2">
            <span className="text-blue-400"></span>
            <span className="text-cyan-400">Enter Your Question :</span>
            <span className="text-blue-400"></span>
            {selectedQuestion && (
              <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-mono rounded border border-purple-500/30">
                From History
              </span>
            )}
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What are the main insights from this document?"
            disabled={isLoading}
            className="w-full px-5 py-4 bg-black/60 border border-zinc-800 rounded-xl
                     text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500/60
                     focus:ring-2 focus:ring-blue-500/20 transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     font-light text-base shadow-inner"
          />
          {/* Focus indicator */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: question ? '100%' : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* Context chunks selector with visual feedback */}
          <div className="col-span-1">
            <label className="block text-xs font-mono text-gray-500 mb-2">
              Chunk Size
            </label>
            <div className="relative">
              <input
                type="number"
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
                min={1}
                max={20}
                disabled={isLoading}
                className="w-full px-3 py-3.5 bg-black/60 border border-zinc-800 rounded-lg
                         text-gray-100 text-center focus:outline-none focus:border-blue-500/60
                         focus:ring-2 focus:ring-blue-500/20 transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed font-mono"
              />
              <div className="absolute -bottom-5 left-0 right-0 flex gap-0.5">
                {[...Array(Math.min(topK, 10))].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex-1 h-1 bg-blue-500/40 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Advanced submit button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="col-span-3 relative px-8 py-3.5 rounded-lg font-semibold text-white
                     bg-gradient-to-r from-blue-600 to-cyan-600 
                     hover:from-blue-500 hover:to-cyan-500
                     transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-3 overflow-hidden
                     shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40
                     border border-blue-400/20"
          >
            {/* Animated background on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            <span className="relative flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-mono">Executing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Execute Query</span>
                </>
              )}
            </span>
          </motion.button>
        </div>
      </form>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-black/40 border border-zinc-800 rounded-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                  className="w-2 h-2 bg-cyan-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                />
              </div>
              <span className="text-sm font-mono text-gray-400">Processing query</span>
            </div>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-xs font-mono text-blue-400"
            >
              ▊
            </motion.span>
          </div>

          {/* Processing steps */}
          <div className="space-y-2 text-xs font-mono text-gray-500">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="text-green-500">✓</span>
              <span>Embedding query vector</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
              <span>Searching vector database</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2 text-gray-600"
            >
              <span>○</span>
              <span>Generating AI response</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

