'use client';

import { motion } from 'framer-motion';

export default function ParallaxBackground() {
  // Code snippets floating in background
  const codeElements = [
    { text: 'async', top: '8%', left: '5%', delay: 0, duration: 25 },
    { text: 'query()', top: '15%', right: '8%', delay: 3, duration: 22 },
    { text: 'vector[]', top: '35%', left: '10%', delay: 6, duration: 28 },
    { text: 'embed()', top: '55%', right: '12%', delay: 9, duration: 24 },
    { text: 'const ai', top: '75%', left: '8%', delay: 12, duration: 26 },
    { text: 'return', top: '65%', right: '6%', delay: 15, duration: 20 },
    { text: '{...}', top: '25%', left: '85%', delay: 5, duration: 23 },
    { text: 'await', top: '45%', right: '85%', delay: 8, duration: 27 },
  ];

  const binaryStrings = [
    '01001000',
    '01000001',
    '01001001',
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Sophisticated gradient orbs */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" 
        />
      </div>

      {/* Floating code snippets */}
      {codeElements.map((item, index) => (
        <motion.div
          key={index}
          className="absolute font-mono text-sm text-zinc-700 opacity-30"
          style={{ top: item.top, left: item.left, right: item.right }}
          animate={{
            y: [0, -40, 0],
            x: [0, 15, -15, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="text-blue-400/40">{item.text}</span>
        </motion.div>
      ))}

      {/* Binary rain effect */}
      {binaryStrings.map((binary, index) => (
        <motion.div
          key={`binary-${index}`}
          className="absolute font-mono text-xs text-green-500/20 tracking-wider"
          style={{ 
            top: '-10%',
            left: `${20 + index * 30}%`,
          }}
          animate={{
            y: ['0vh', '120vh'],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 15 + index * 5,
            delay: index * 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {binary}
        </motion.div>
      ))}

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Animated geometric shapes */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-32 border border-zinc-800/20"
        animate={{
          rotate: 360,
          borderRadius: ['0%', '50%', '0%'],
        }}
        transition={{
          rotate: { duration: 40, repeat: Infinity, ease: 'linear' },
          borderRadius: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-[8%] w-24 h-24"
        style={{
          background: 'linear-gradient(45deg, transparent 49%, rgba(59, 130, 246, 0.1) 49%, rgba(59, 130, 246, 0.1) 51%, transparent 51%)',
        }}
        animate={{
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Scanning line effect */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
        animate={{
          top: ['0%', '100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

