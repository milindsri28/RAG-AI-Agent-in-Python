'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSidebarContext } from './components/ClientLayout';

const FileUpload = dynamic(() => import('./components/FileUpload'), { ssr: false });
const ParallaxBackground = dynamic(() => import('./components/ParallaxBackground'), { ssr: false });

export default function Home() {
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const router = useRouter();
    const { refreshSidebar } = useSidebarContext();

    const handleUploadSuccess = (filename: string) => {
        setUploadedFiles(prev => [...prev, filename]);
        setSelectedFile(filename);
        refreshSidebar(); // Refresh sidebar to show new file
    };

    const handleFileSelect = (filename: string) => {
        setSelectedFile(filename);
    };

    const handleStartChat = () => {
        if (selectedFile) {
            router.push(`/chat?file=${encodeURIComponent(selectedFile)}`);
        }
    };

    return (
        <main className="min-h-screen relative overflow-hidden">
            <ParallaxBackground />

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl lg:pl-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">RAG AI Agent</span>
                    </h1>
                    <p className="text-gray-400 font-mono text-lg">
                        Upload documents and chat with AI-powered intelligence
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto mt-12"
                >
                    {/* Upload Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="glass glass-hover rounded-2xl p-8 shine-effect mb-8"
                    >
                        <FileUpload onUploadSuccess={handleUploadSuccess} />
                    </motion.div>

                    {/* File Selection */}
                    {uploadedFiles.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="glass glass-hover rounded-2xl overflow-hidden mb-8"
                        >
                            {/* Header */}
                            <div className="px-6 py-4 bg-zinc-900/80 border-b border-zinc-800">
                                <h2 className="text-xl font-bold text-gray-100 mb-2">📁 Select Document to Chat</h2>
                                <p className="text-sm text-gray-400 font-mono">
                                    Choose a document to start your AI conversation
                                </p>
                            </div>
                            
                            {/* File List */}
                            <div className="p-6">
                                <div className="grid gap-3">
                                    {uploadedFiles.map((file, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => handleFileSelect(file)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all duration-200
                                                      ${selectedFile === file 
                                                        ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/10' 
                                                        : 'bg-black/40 border-zinc-800 hover:bg-zinc-900/60 hover:border-zinc-700'
                                                      }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${selectedFile === file ? 'bg-blue-500/20' : 'bg-zinc-800'}`}>
                                                    <span className="text-2xl">📄</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-gray-100 font-medium mb-1">{file}</h3>
                                                    <p className="text-xs text-gray-500 font-mono">PDF Document • Ready for AI Chat</p>
                                                </div>
                                                {selectedFile === file && (
                                                    <div className="text-blue-400">
                                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Start Chat Button */}
                    {selectedFile && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-center"
                        >
                            <motion.button
                                onClick={handleStartChat}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 
                                         hover:from-blue-500 hover:to-cyan-500
                                         text-white font-semibold rounded-xl
                                         transition-all duration-300
                                         shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40
                                         border border-blue-400/20
                                         flex items-center gap-3 mx-auto"
                            >
                                <span className="text-2xl">🚀</span>
                                <span>Start AI Chat with &quot;{selectedFile}&quot;</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </motion.button>
                            
                            <p className="text-sm text-gray-500 font-mono mt-4">
                                Powered by GPT-4 • Vector Search • Real-time Processing
                            </p>
                        </motion.div>
                    )}

                    {/* Empty State */}
                    {uploadedFiles.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-center py-12"
                        >
                            <div className="text-6xl mb-4 opacity-30">📚</div>
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">Ready to Chat with AI?</h3>
                            <p className="text-gray-500 font-mono">
                                Upload a PDF document above to start your intelligent conversation
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
