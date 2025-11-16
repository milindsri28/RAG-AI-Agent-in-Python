'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/errorHandler';
import { API_ENDPOINTS } from '../utils/apiConfig';

interface FileMetadata {
    name: string;
    size: string;
    size_bytes: number;
    upload_date: string;
    path: string;
}

interface SidebarProps {
    onFileSelect?: (filename: string) => void;
    refreshTrigger?: number;
}

export default function Sidebar({ onFileSelect, refreshTrigger }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<FileMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [renamingFile, setRenamingFile] = useState<string | null>(null);
    const [newFileName, setNewFileName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    // Sidebar closed by default on all devices
    useEffect(() => {
        setIsOpen(false);
    }, []);

    // Fetch uploaded files
    useEffect(() => {
        fetchUploadedFiles();
    }, [refreshTrigger]);

    const fetchUploadedFiles = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.files);
            if (response.ok) {
                const data = await response.json();
                setUploadedFiles(data.files || []);
            } else {
                throw new Error(`Failed to fetch files: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error fetching files:', error);
            toast.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

    const handleDeleteFile = async (filename: string, event: React.MouseEvent) => {
        // Prevent file click when delete is clicked
        event.stopPropagation();

        if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
            return;
        }

        const deletePromise = (async () => {
            try {
                const response = await fetch(API_ENDPOINTS.delete(filename), {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const error: any = new Error(errorData.detail || 'Failed to delete file');
                    error.response = { status: response.status, data: errorData };
                    throw error;
                }

                // Refresh file list after deletion
                await fetchUploadedFiles();
                return filename;
            } catch (error) {
                throw new Error(getErrorMessage(error));
            }
        })();

        toast.promise(deletePromise, {
            loading: `Deleting ${filename}...`,
            success: (name) => `✅ Successfully deleted ${name}`,
            error: (err) => `❌ ${err.message}`,
        });
    };

    const handleRenameClick = (filename: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setRenamingFile(filename);
        // Remove .pdf extension for editing
        setNewFileName(filename.replace(/\.pdf$/i, ''));
    };

    const handleRenameSubmit = async (oldFilename: string) => {
        if (!newFileName.trim()) {
            toast.error('Please enter a valid filename');
            return;
        }

        const renamePromise = (async () => {
            try {
                const response = await fetch(API_ENDPOINTS.rename, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        old_name: oldFilename,
                        new_name: newFileName.trim(),
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const error: any = new Error(errorData.detail || 'Failed to rename file');
                    error.response = { status: response.status, data: errorData };
                    throw error;
                }

                const result = await response.json();
                await fetchUploadedFiles();
                setRenamingFile(null);
                setNewFileName('');
                return result.new_name;
            } catch (error) {
                throw new Error(getErrorMessage(error));
            }
        })();

        toast.promise(renamePromise, {
            loading: 'Renaming file...',
            success: (name) => `✅ Renamed to ${name}`,
            error: (err) => `❌ ${err.message}`,
        });
    };

    const handleRenameCancel = () => {
        setRenamingFile(null);
        setNewFileName('');
    };

    const handleDownloadFile = (filename: string, event: React.MouseEvent) => {
        event.stopPropagation();

        // Open download link in new tab
        const downloadUrl = API_ENDPOINTS.download(filename);
        window.open(downloadUrl, '_blank');

        toast.success(`📥 Downloading ${filename}`);
    };

    const navItems = [
        { icon: '🏠', label: 'Home', path: '/' },
        { icon: '💬', label: 'Chat', path: '/chat' },
    ];

    // Filter files based on search query
    const filteredFiles = uploadedFiles.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* Toggle Button - Always Visible */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`fixed top-4 z-50 p-3 rounded-xl backdrop-blur-xl border shadow-lg transition-all duration-300 ${isOpen
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
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${pathname === item.path
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

                                {/* Search Bar */}
                                {uploadedFiles.length > 3 && (
                                    <div className="mb-3">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search files..."
                                                className="w-full px-3 py-2 pl-9 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                                            />
                                            <svg
                                                className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            {searchQuery && (
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-400"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {isLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : filteredFiles.length > 0 ? (
                                    <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                                        {filteredFiles.map((file, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="relative group/item"
                                            >
                                                {renamingFile === file.name ? (
                                                    /* Rename Mode */
                                                    <div className="p-3 rounded-lg bg-zinc-900/80 border border-blue-500/50">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-lg">📝</span>
                                                            <input
                                                                type="text"
                                                                value={newFileName}
                                                                onChange={(e) => setNewFileName(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleRenameSubmit(file.name);
                                                                    if (e.key === 'Escape') handleRenameCancel();
                                                                }}
                                                                className="flex-1 px-2 py-1 text-sm bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:border-blue-500"
                                                                placeholder="Enter new name"
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleRenameSubmit(file.name)}
                                                                className="flex-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                                            >
                                                                ✓ Save
                                                            </button>
                                                            <button
                                                                onClick={handleRenameCancel}
                                                                className="flex-1 px-3 py-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors"
                                                            >
                                                                ✕ Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* Normal Mode */
                                                    <>
                                                        <button
                                                            onClick={() => handleFileClick(file.name)}
                                                            className="w-full flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 text-left"
                                                        >
                                                            <span className="text-lg mt-0.5">📄</span>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm text-gray-300 group-hover/item:text-white truncate font-medium">
                                                                    {file.name}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <p className="text-xs text-gray-600 font-mono">{file.size}</p>
                                                                    <span className="text-gray-700">•</span>
                                                                    <p className="text-xs text-gray-600 font-mono">{formatDate(file.upload_date)}</p>
                                                                </div>
                                                            </div>
                                                        </button>

                                                        {/* Action Buttons */}
                                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/item:opacity-100 transition-all duration-200">
                                                            {/* Download Button */}
                                                            <button
                                                                onClick={(e) => handleDownloadFile(file.name, e)}
                                                                className="p-1.5 rounded-md bg-green-900/0 hover:bg-green-900/80 text-gray-600 hover:text-white transition-all"
                                                                title={`Download ${file.name}`}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                            </button>

                                                            {/* Rename Button */}
                                                            <button
                                                                onClick={(e) => handleRenameClick(file.name, e)}
                                                                className="p-1.5 rounded-md bg-blue-900/0 hover:bg-blue-900/80 text-gray-600 hover:text-white transition-all"
                                                                title={`Rename ${file.name}`}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>

                                                            {/* Delete Button */}
                                                            <button
                                                                onClick={(e) => handleDeleteFile(file.name, e)}
                                                                className="p-1.5 rounded-md bg-red-900/0 hover:bg-red-900/80 text-gray-600 hover:text-white transition-all"
                                                                title={`Delete ${file.name}`}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : searchQuery ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="text-4xl mb-3 opacity-30">🔍</div>
                                        <p className="text-sm text-gray-500 font-mono">No files found</p>
                                        <p className="text-xs text-gray-600 mt-1">Try a different search term</p>
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="mt-3 text-xs text-blue-400 hover:text-blue-300"
                                        >
                                            Clear search
                                        </button>
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

