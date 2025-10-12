'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
    onFileSelect?: (filename: string) => void;
    refreshTrigger?: number;
}

export default function Sidebar({ onFileSelect, refreshTrigger }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Open sidebar by default on desktop, closed on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch uploaded files
    useEffect(() => {
        fetchUploadedFiles();
    }, [refreshTrigger]);

    const fetchUploadedFiles = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/files');
            if (response.ok) {
                const data = await response.json();
                setUploadedFiles(data.files || []);
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const handleFileClick = (filename: string) => {
        if (onFileSelect) {
            onFileSelect(filename);
        }
        router.push(`/chat?file=${encodeURIComponent(filename)}`);
    };

    const navItems = [
        { icon: '🏠', label: 'Home', path: '/' },
        { icon: '💬', label: 'Chat', path: '/chat' },
    ];

    return (
        <>
            {/* Toggle Button - Always Visible */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`fixed top-4 z-50 p-3 rounded-xl backdrop-blur-xl border shadow-lg transition-all duration-300 ${
                    isOpen 
                        ? 'left-[260px] lg:left-[260px] bg-zinc-900/90 border-zinc-700 hover:bg-zinc-800' 
                        : 'left-4 bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-400/30 hover:from-blue-500 hover:to-cyan-500'
                }`}
                title={isOpen ? 'Close sidebar' : 'Open sidebar'}
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </motion.button>

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Mobile Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Sidebar Content */}
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 h-screen w-72 bg-zinc-950/98 backdrop-blur-xl border-r border-zinc-800/50 z-40 flex flex-col shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-zinc-800/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-xl">
                                        🤖
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">RAG AI Agent</h2>
                                        <p className="text-xs text-gray-500 font-mono">Document Intelligence</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="p-4 border-b border-zinc-800/50">
                                <div className="space-y-2">
                                    {navItems.map((item) => (
                                        <button
                                            key={item.path}
                                            onClick={() => handleNavigation(item.path)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                                pathname === item.path
                                                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                                    : 'text-gray-400 hover:text-white hover:bg-zinc-900/50'
                                            }`}
                                        >
                                            <span className="text-xl">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </nav>

                            {/* Files Section */}
                            <div className="flex-1 overflow-hidden flex flex-col p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                        <span>📁</span> Your Documents
                                    </h3>
                                    <button
                                        onClick={fetchUploadedFiles}
                                        className="text-gray-500 hover:text-white transition-colors"
                                        title="Refresh files"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>

                                {isLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : uploadedFiles.length > 0 ? (
                                    <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                                        {uploadedFiles.map((file, index) => (
                                            <motion.button
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => handleFileClick(file)}
                                                className="w-full flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 text-left group"
                                            >
                                                <span className="text-lg mt-0.5">📄</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-300 group-hover:text-white truncate font-medium">
                                                        {file}
                                                    </p>
                                                    <p className="text-xs text-gray-600 font-mono mt-0.5">Click to chat</p>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="text-4xl mb-3 opacity-30">📭</div>
                                        <p className="text-sm text-gray-500 font-mono">No documents yet</p>
                                        <p className="text-xs text-gray-600 mt-1">Upload a PDF to start</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-zinc-800/50">
                                <div className="flex items-center gap-2 text-xs text-gray-600 font-mono">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span>System Online</span>
                                </div>
                                <p className="text-xs text-gray-700 mt-2">
                                    Powered by GPT-4 & Qdrant
                                </p>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(63, 63, 70, 0.5);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(63, 63, 70, 0.8);
                }
            `}</style>
        </>
    );
}

