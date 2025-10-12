import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientLayout from "./components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "RAG AI Agent | PDF Intelligence",
    description: "Transform documents into conversations with AI-powered intelligence",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
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
            </body>
        </html>
    );
}

