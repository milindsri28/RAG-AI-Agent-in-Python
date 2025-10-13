'use client';

import { ReactNode, useState, useEffect, createContext, useContext } from 'react';
import Sidebar from './Sidebar';
import ErrorBoundary from './ErrorBoundary';

interface ClientLayoutProps {
    children: ReactNode;
}

interface SidebarContextType {
    refreshSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
    refreshSidebar: () => { },
});

export const useSidebarContext = () => useContext(SidebarContext);

export default function ClientLayout({ children }: ClientLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        // Sidebar closed by default
        setIsSidebarOpen(false);
    }, []);

    const refreshSidebar = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <ErrorBoundary>
            <SidebarContext.Provider value={{ refreshSidebar }}>
                <div className="flex min-h-screen">
                    <ErrorBoundary>
                        <Sidebar refreshTrigger={refreshTrigger} />
                    </ErrorBoundary>
                    {/* Content area that shifts based on sidebar state */}
                    <div className="flex-1 transition-all duration-300">
                        <ErrorBoundary>
                            {children}
                        </ErrorBoundary>
                    </div>
                </div>
            </SidebarContext.Provider>
        </ErrorBoundary>
    );
}

