import { Suspense } from 'react';
import ChatContent from './ChatContent';

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-300 font-mono">Loading chat...</p>
                </div>
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}