'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Send, ArrowLeft, FileText, Copy, Check, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
    const [topK, setTopK] = useState(5);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch available files
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('http://localhost:8000/files');
                setAvailableFiles(response.data.files || []);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };
        fetchFiles();
    }, []);

    // Update welcome message when file changes
    useEffect(() => {
        if (selectedFile) {
            const welcomeMessage: Message = {
                id: Date.now().toString(),
                type: 'assistant',
                content: `Hello! I'm your AI assistant. I'm ready to help you explore and understand "${selectedFile}". What would you like to know about this document?`,
                timestamp: new Date()
            };
            setMessages([welcomeMessage]);
        }
    }, [selectedFile]);

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
            const response = await axios.post('http://localhost:8000/api/query', {
                question: inputMessage.trim(),
                top_k: topK,
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
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: `Sorry, I encountered an error: ${error.response?.data?.detail || error.message}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            toast.error('Failed to get response');
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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const clearChat = () => {
        if (confirm('Are you sure you want to clear the chat history?')) {
            setMessages([]);
            toast.success('Chat cleared');
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
                                        {availableFiles.map((file) => (
                                            <option key={file} value={file}>{file}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <h1 className="text-lg font-semibold text-gray-100">{selectedFile}</h1>
                                )}
                                <p className="text-sm text-gray-500 font-mono">
                                    {availableFiles.length > 1 ? `${availableFiles.length} documents available` : 'AI Chat Session'}
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
                            >
                                <option value={3}>3</option>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </select>
                        </div>
                        <button
                            onClick={clearChat}
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                            title="Clear Chat"
                        >
                            <Trash2 className="w-5 h-5 text-gray-300" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-4 space-y-6 lg:pl-8">
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
                                        <div className="whitespace-pre-wrap">{message.content}</div>

                                        {/* Sources for assistant messages */}
                                        {message.type === 'assistant' && message.sources && message.sources.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-zinc-700">
                                                <p className="text-xs text-gray-500 mb-2 font-mono">Sources:</p>
                                                <div className="space-y-1">
                                                    {message.sources.map((source, index) => (
                                                        <div key={index} className="text-xs text-gray-400 font-mono bg-zinc-900 p-2 rounded">
                                                            {source}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-gray-500 font-mono">
                                            {message.timestamp.toLocaleTimeString()}
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard(message.content)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-zinc-800"
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
    );
}
