'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Send, ArrowLeft, FileText, Copy, Check, Trash2, History, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/errorHandler';
import { API_ENDPOINTS } from '../utils/apiConfig';
import { getChatHistory, saveChatHistory, clearChatHistory, StoredMessage } from '../utils/chatStorage';
import { exportAsMarkdown, exportAsText, exportAsJSON, exportAsHTML } from '../utils/chatExport';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import KeyboardShortcutsHelp from '../components/KeyboardShortcutsHelp';

interface Message {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    sources?: string[];
}

export default function ChatContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialFile = searchParams?.get('file') || null;

    const [selectedFile, setSelectedFile] = useState<string | null>(initialFile);
    const [availableFiles, setAvailableFiles] = useState<string[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [topK, setTopK] = useState(10);  // Increased default for better context
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const exportMenuRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = (smooth = true) => {
        // Use setTimeout to ensure DOM has updated
        setTimeout(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({
                    behavior: smooth ? 'smooth' : 'auto',
                    block: 'end'
                });
            }
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-scroll on new loading state
    useEffect(() => {
        if (isLoading) {
            scrollToBottom();
        }
    }, [isLoading]);

    // Close export menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
                setShowExportMenu(false);
            }
        };

        if (showExportMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showExportMenu]);

    // Fetch available files
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.files);
                // Extract just the names from the file objects
                const fileNames = (response.data.files || []).map((file: any) =>
                    typeof file === 'string' ? file : file.name
                );
                setAvailableFiles(fileNames);
            } catch (error) {
                console.error('Error fetching files:', error);
                toast.error(getErrorMessage(error));
            }
        };
        fetchFiles();
    }, []);

    // Load chat history when file changes
    useEffect(() => {
        if (selectedFile) {
            // Don't load history for "All Documents" mode
            if (selectedFile === '__ALL__') {
                const welcomeMessage: Message = {
                    id: Date.now().toString(),
                    type: 'assistant',
                    content: `🌐 **All Documents Mode Activated**

I'll search across **all ${availableFiles.length} documents** in your library to answer your questions!

This mode is perfect for:
- Finding information across multiple PDFs
- Comparing content between documents
- Getting comprehensive answers from your entire collection

💡 Tip: Increase "Chunks" to 15-20 for better cross-document results.`,
                    timestamp: new Date()
                };
                setMessages([welcomeMessage]);
                return;
            }

            // Try to load existing chat history
            const history = getChatHistory(selectedFile);
            
            if (history.length > 0) {
                // Convert stored messages back to Message format
                const loadedMessages: Message[] = history.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
                setMessages(loadedMessages);
                toast.success('Chat history loaded', { duration: 2000 });
            } else {
                // No history, show welcome message
                const welcomeMessage: Message = {
                    id: Date.now().toString(),
                    type: 'assistant',
                    content: `Hello! I'm your AI assistant. I'm ready to help you explore and understand "${selectedFile}". 

I'll provide detailed answers based on the document content. Ask me anything about this PDF!

💡 Tip: If you need more detailed answers, try increasing the "Chunks" setting in the top-right corner.`,
                    timestamp: new Date()
                };
                setMessages([welcomeMessage]);
            }
        }
    }, [selectedFile, availableFiles.length]);

    // Save chat history whenever messages change (skip for All Documents mode)
    useEffect(() => {
        if (selectedFile && selectedFile !== '__ALL__' && messages.length > 0) {
            // Convert messages to storable format
            const storableMessages: StoredMessage[] = messages.map(msg => ({
                ...msg,
                timestamp: msg.timestamp.toISOString()
            }));
            saveChatHistory(selectedFile, storableMessages);
        }
    }, [messages, selectedFile]);

    const handleFileChange = (newFile: string) => {
        setSelectedFile(newFile);
        router.push(`/chat?file=${encodeURIComponent(newFile)}`);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputMessage.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post(API_ENDPOINTS.query, {
                question: inputMessage.trim(),
                top_k: topK,
                source_file: selectedFile,  // Send the selected file to filter results
            });

            const { answer, sources } = response.data;

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: answer,
                timestamp: new Date(),
                sources: sources
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            const userFriendlyError = getErrorMessage(error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: `I'm sorry, but I encountered an issue: ${userFriendlyError}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            toast.error(userFriendlyError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Keyboard shortcuts
    useKeyboardShortcuts([
        {
            key: 'n',
            ctrlOrCmd: true,
            description: 'New chat',
            action: () => startNewChat()
        },
        {
            key: 'k',
            ctrlOrCmd: true,
            description: 'Clear chat',
            action: () => clearChat()
        },
        {
            key: 'e',
            ctrlOrCmd: true,
            description: 'Export chat',
            action: () => setShowExportMenu(prev => !prev)
        },
        {
            key: 'h',
            ctrlOrCmd: true,
            description: 'Go to home',
            action: () => router.push('/')
        },
        {
            key: '/',
            ctrlOrCmd: true,
            description: 'Show shortcuts',
            action: () => setShowShortcutsHelp(true)
        },
        {
            key: 'Escape',
            description: 'Close menus',
            action: () => {
                setShowExportMenu(false);
                setShowShortcutsHelp(false);
            }
        }
    ], !showShortcutsHelp); // Disable when help is open

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const clearChat = () => {
        if (confirm('Are you sure you want to clear the chat history? This will also delete the saved history for this document.')) {
            if (selectedFile) {
                clearChatHistory(selectedFile);
            }
            setMessages([]);
            toast.success('Chat history cleared');
        }
    };

    const startNewChat = () => {
        if (messages.length > 1 && confirm('Start a new chat? Current conversation will be saved in history.')) {
            if (selectedFile) {
                const welcomeMessage: Message = {
                    id: Date.now().toString(),
                    type: 'assistant',
                    content: `New chat started for "${selectedFile}". What would you like to know?`,
                    timestamp: new Date()
                };
                setMessages([welcomeMessage]);
                toast.success('New chat started');
            }
        }
    };

    const handleExport = (format: 'markdown' | 'text' | 'json' | 'html') => {
        if (!selectedFile || messages.length === 0) {
            toast.error('No messages to export');
            return;
        }

        try {
            switch (format) {
                case 'markdown':
                    exportAsMarkdown(selectedFile, messages);
                    toast.success('Exported as Markdown');
                    break;
                case 'text':
                    exportAsText(selectedFile, messages);
                    toast.success('Exported as Text');
                    break;
                case 'json':
                    exportAsJSON(selectedFile, messages);
                    toast.success('Exported as JSON');
                    break;
                case 'html':
                    exportAsHTML(selectedFile, messages);
                    toast.success('Opened in new window for printing');
                    break;
            }
            setShowExportMenu(false);
        } catch (error) {
            toast.error('Failed to export chat');
            console.error('Export error:', error);
        }
    };

    if (!selectedFile) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-100 mb-4">No Document Selected</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                    >
                        Go Back to Upload
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <KeyboardShortcutsHelp isOpen={showShortcutsHelp} onClose={() => setShowShortcutsHelp(false)} />
            
            <div className="min-h-screen bg-black flex flex-col">
            {/* Header */}
            <div className="glass border-b border-zinc-800 p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between lg:pl-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/')}
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-300" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                {availableFiles.length > 1 ? (
                                    <select
                                        value={selectedFile || ''}
                                        onChange={(e) => handleFileChange(e.target.value)}
                                        className="text-lg font-semibold text-gray-100 bg-zinc-900 border border-zinc-700 rounded px-3 py-1 hover:border-blue-500 transition-colors cursor-pointer"
                                    >
                                        <option value="__ALL__">🌐 All Documents ({availableFiles.length})</option>
                                        <option disabled>──────────</option>
                                        {availableFiles.map((file) => (
                                            <option key={file} value={file}>📄 {file}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <h1 className="text-lg font-semibold text-gray-100">{selectedFile}</h1>
                                )}
                                <p className="text-sm text-gray-500 font-mono">
                                    {availableFiles.length > 1 ? 
                                        (selectedFile === '__ALL__' ? 'Querying across all documents' : 'Single document mode') 
                                        : 'AI Chat Session'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                            <span>Chunks:</span>
                            <select
                                value={topK}
                                onChange={(e) => setTopK(parseInt(e.target.value))}
                                className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-gray-300"
                                title="Number of context chunks to retrieve (more = better context)"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10 (Recommended)</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                        </div>
                        
                        {/* Export Menu */}
                        <div className="relative" ref={exportMenuRef}>
                            <button
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="p-2 rounded-lg bg-green-800 hover:bg-green-700 transition-colors"
                                title="Export Chat"
                            >
                                <Download className="w-5 h-5 text-gray-300" />
                            </button>
                            
                            {showExportMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute right-0 top-12 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl py-2 min-w-[180px] z-50"
                                >
                                    <button
                                        onClick={() => handleExport('html')}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-zinc-800 transition-colors"
                                    >
                                        📄 Export as PDF
                                    </button>
                                    <button
                                        onClick={() => handleExport('markdown')}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-zinc-800 transition-colors"
                                    >
                                        📝 Export as Markdown
                                    </button>
                                    <button
                                        onClick={() => handleExport('text')}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-zinc-800 transition-colors"
                                    >
                                        📋 Export as Text
                                    </button>
                                    <button
                                        onClick={() => handleExport('json')}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-zinc-800 transition-colors"
                                    >
                                        🔧 Export as JSON
                                    </button>
                                </motion.div>
                            )}
                        </div>
                        
                        <button
                            onClick={startNewChat}
                            className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 transition-colors"
                            title="New Chat"
                        >
                            <History className="w-5 h-5 text-gray-300" />
                        </button>
                        <button
                            onClick={clearChat}
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                            title="Clear Chat History"
                        >
                            <Trash2 className="w-5 h-5 text-gray-300" />
                        </button>
                        <button
                            onClick={() => setShowShortcutsHelp(true)}
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                            title="Keyboard Shortcuts (Ctrl+/)"
                        >
                            <span className="text-gray-300 text-sm font-bold">?</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto scroll-smooth">
                <div className="max-w-4xl mx-auto p-4 space-y-6 lg:pl-8 pb-6">
                    <AnimatePresence>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.type === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-blue-400 text-sm">🤖</span>
                                    </div>
                                )}

                                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                                    <div className={`p-4 rounded-2xl ${message.type === 'user'
                                        ? 'bg-blue-600 text-white ml-auto'
                                        : 'bg-zinc-800 text-gray-100 border border-zinc-700'
                                        }`}>
                                        <div className="whitespace-pre-wrap break-words">{message.content}</div>

                                        {/* Sources for assistant messages */}
                                        {message.type === 'assistant' && message.sources && message.sources.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-zinc-700">
                                                <p className="text-xs text-gray-500 mb-2 font-mono">Sources:</p>
                                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                                    {message.sources.map((source, index) => (
                                                        <div key={index} className="text-xs text-gray-400 font-mono bg-zinc-900 p-2 rounded break-words">
                                                            {source}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-2 group">
                                        <span className="text-xs text-gray-500 font-mono">
                                            {message.timestamp.toLocaleTimeString()}
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard(message.content)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-zinc-800"
                                            title="Copy message"
                                        >
                                            <Copy className="w-3 h-3 text-gray-500" />
                                        </button>
                                    </div>
                                </div>

                                {message.type === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-400 text-sm">👤</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Loading indicator */}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 justify-start"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <span className="text-blue-400 text-sm">🤖</span>
                            </div>
                            <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span className="text-gray-400 text-sm font-mono">Thinking...</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="glass border-t border-zinc-800 p-4">
                <div className="max-w-4xl mx-auto lg:pl-8">
                    <div className="flex gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything about this document..."
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl
                                     text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500
                                     focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <motion.button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700
                                     text-white rounded-xl transition-all duration-200
                                     disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            <Send className="w-5 h-5" />
                        </motion.button>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-2">
                        Press Enter to send • Shift+Enter for new line
                    </p>
                </div>
            </div>
            </div>
        </>
    );
}
