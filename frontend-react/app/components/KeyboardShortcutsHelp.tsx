'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getModifierKey } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
    const modKey = getModifierKey();

    const shortcuts = [
        {
            category: 'Navigation',
            items: [
                { keys: [`${modKey}`, 'B'], description: 'Toggle sidebar' },
                { keys: [`${modKey}`, 'H'], description: 'Go to home' },
            ]
        },
        {
            category: 'Chat Actions',
            items: [
                { keys: [`${modKey}`, 'N'], description: 'New chat' },
                { keys: [`${modKey}`, 'K'], description: 'Clear chat' },
                { keys: ['Enter'], description: 'Send message' },
                { keys: ['Shift', 'Enter'], description: 'New line in message' },
            ]
        },
        {
            category: 'File Actions',
            items: [
                { keys: [`${modKey}`, 'U'], description: 'Upload file (from home)' },
                { keys: [`${modKey}`, 'E'], description: 'Export chat' },
            ]
        },
        {
            category: 'General',
            items: [
                { keys: [`${modKey}`, '/'], description: 'Show this help' },
                { keys: ['Escape'], description: 'Close modals/menus' },
            ]
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-2xl mx-4"
                    >
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-cyan-600/10">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        ⌨️ Keyboard Shortcuts
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Speed up your workflow
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                                <div className="grid gap-6">
                                    {shortcuts.map((section, idx) => (
                                        <div key={idx}>
                                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                                {section.category}
                                            </h3>
                                            <div className="space-y-2">
                                                {section.items.map((item, itemIdx) => (
                                                    <div
                                                        key={itemIdx}
                                                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-800 transition-colors"
                                                    >
                                                        <span className="text-gray-300">
                                                            {item.description}
                                                        </span>
                                                        <div className="flex gap-1">
                                                            {item.keys.map((key, keyIdx) => (
                                                                <kbd
                                                                    key={keyIdx}
                                                                    className="px-2 py-1 text-xs font-semibold bg-zinc-800 border border-zinc-700 rounded text-gray-300 shadow-sm"
                                                                >
                                                                    {key}
                                                                </kbd>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950">
                                <p className="text-xs text-gray-500 text-center">
                                    Press <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-gray-300 text-xs">Escape</kbd> or click outside to close
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

