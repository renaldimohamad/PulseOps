import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'PulseOps | Service Monitoring Dashboard',
  description: 'Lightweight real-time infrastructure monitoring dashboard',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 0,
  viewportFit: 'cover',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-background text-foreground antialiased selection:bg-brand-500/10 selection:text-brand-600 min-h-screen flex flex-col overflow-x-hidden`}>
        <Providers>
          <Navbar />
          <main className="flex-1 mx-auto w-full max-w-7xl px-6 pt-32 md:pt-40 pb-12 sm:px-2 lg:px-10 transition-all duration-500">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
