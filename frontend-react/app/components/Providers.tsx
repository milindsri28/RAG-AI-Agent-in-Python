'use client';

import { ReactNode } from 'react';
import ClientLayout from './ClientLayout';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <>
            <ClientLayout>
                {children}
            </ClientLayout>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#18181b',
                        color: '#e4e4e7',
                        border: '1px solid #27272a',
                    },
                    success: {
                        iconTheme: {
                            primary: '#3b82f6',
                            secondary: '#18181b',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#18181b',
                        },
                    },
                }}
            />
        </>
    );
}

