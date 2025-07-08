import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'سیستم احراز هویت',
    description: 'سیستم احراز هویت با Next.js و TypeScript',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='fa' dir='rtl'>
            <body>{children}</body>
        </html>
    );
}
