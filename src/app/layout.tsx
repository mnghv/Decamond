import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Authentication System',
    description: 'Authentication system with Next.js and TypeScript',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' dir='ltr'>
            <body>{children}</body>
        </html>
    );
}
