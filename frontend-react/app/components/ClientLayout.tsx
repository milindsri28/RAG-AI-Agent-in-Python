'use client';

import { ReactNode, useState, useEffect, createContext, useContext } from 'react';
import Sidebar from './Sidebar';

interface ClientLayoutProps {
    children: ReactNode;
}

interface SidebarContextType {
    refreshSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
    refreshSidebar: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

export default function ClientLayout({ children }: ClientLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        // Check screen size to determine initial sidebar state
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const refreshSidebar = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <SidebarContext.Provider value={{ refreshSidebar }}>
            <div className="flex min-h-screen">
                <Sidebar refreshTrigger={refreshTrigger} />
                {/* Content area that shifts based on sidebar state */}
                <div className="flex-1 transition-all duration-300">
                    {children}
                </div>
            </div>
        </SidebarContext.Provider>
    );
}

