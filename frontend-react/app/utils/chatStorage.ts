/**
 * Chat history storage utility using localStorage
 */

export interface StoredMessage {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: string;  // ISO string for serialization
    sources?: string[];
}

export interface ChatHistory {
    [filename: string]: {
        messages: StoredMessage[];
        lastUpdated: string;
    };
}

const STORAGE_KEY = 'rag_chat_history';
const MAX_HISTORY_DAYS = 30; // Keep history for 30 days

/**
 * Get all chat history from localStorage
 */
export function getAllChatHistory(): ChatHistory {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return {};
        
        const history: ChatHistory = JSON.parse(stored);
        
        // Clean up old history
        const now = new Date().getTime();
        const maxAge = MAX_HISTORY_DAYS * 24 * 60 * 60 * 1000;
        
        Object.keys(history).forEach(filename => {
            const lastUpdated = new Date(history[filename].lastUpdated).getTime();
            if (now - lastUpdated > maxAge) {
                delete history[filename];
            }
        });
        
        return history;
    } catch (error) {
        console.error('Error reading chat history:', error);
        return {};
    }
}

/**
 * Get chat history for a specific file
 */
export function getChatHistory(filename: string): StoredMessage[] {
    const allHistory = getAllChatHistory();
    return allHistory[filename]?.messages || [];
}

/**
 * Save chat history for a specific file
 */
export function saveChatHistory(filename: string, messages: StoredMessage[]): void {
    try {
        const allHistory = getAllChatHistory();
        
        allHistory[filename] = {
            messages,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
    } catch (error) {
        console.error('Error saving chat history:', error);
        // If quota exceeded, try to clear old history
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            clearOldestHistory();
            // Try again
            try {
                const allHistory = getAllChatHistory();
                allHistory[filename] = {
                    messages,
                    lastUpdated: new Date().toISOString()
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
            } catch (retryError) {
                console.error('Failed to save after cleanup:', retryError);
            }
        }
    }
}

/**
 * Clear chat history for a specific file
 */
export function clearChatHistory(filename: string): void {
    try {
        const allHistory = getAllChatHistory();
        delete allHistory[filename];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
    } catch (error) {
        console.error('Error clearing chat history:', error);
    }
}

/**
 * Clear all chat history
 */
export function clearAllChatHistory(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing all chat history:', error);
    }
}

/**
 * Clear oldest chat history to free up space
 */
function clearOldestHistory(): void {
    const allHistory = getAllChatHistory();
    
    // Find oldest chat
    let oldestFile = '';
    let oldestDate = new Date().getTime();
    
    Object.keys(allHistory).forEach(filename => {
        const lastUpdated = new Date(allHistory[filename].lastUpdated).getTime();
        if (lastUpdated < oldestDate) {
            oldestDate = lastUpdated;
            oldestFile = filename;
        }
    });
    
    if (oldestFile) {
        delete allHistory[oldestFile];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
    }
}

/**
 * Get list of files with chat history
 */
export function getFilesWithHistory(): string[] {
    const allHistory = getAllChatHistory();
    return Object.keys(allHistory).sort((a, b) => {
        const dateA = new Date(allHistory[a].lastUpdated).getTime();
        const dateB = new Date(allHistory[b].lastUpdated).getTime();
        return dateB - dateA; // Most recent first
    });
}

/**
 * Export chat history as JSON
 */
export function exportChatHistory(filename: string): string {
    const messages = getChatHistory(filename);
    return JSON.stringify({ filename, messages, exportedAt: new Date().toISOString() }, null, 2);
}

/**
 * Get storage usage info
 */
export function getStorageInfo(): { used: number; total: number; percentage: number } {
    try {
        const stored = localStorage.getItem(STORAGE_KEY) || '';
        const used = new Blob([stored]).size;
        const total = 5 * 1024 * 1024; // Approximate 5MB localStorage limit
        const percentage = (used / total) * 100;
        
        return { used, total, percentage };
    } catch (error) {
        return { used: 0, total: 0, percentage: 0 };
    }
}

