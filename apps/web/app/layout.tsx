import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'UpSite',
  description: 'Monitor your websites blazing-fast uptime checks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-(family-name:--font-geist-sans) antialiased`}
      >
        <div className="grid-bg fixed inset-0 pointer-events-none opacity-60" />
        <div className="scanlines" />
        <Navbar />
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
