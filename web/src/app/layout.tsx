import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PulseOps | Service Monitoring Dashboard',
  description: 'Lightweight real-time infrastructure monitoring dashboard',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-brand-500/10 selection:text-brand-600 min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1 mx-auto w-full max-w-7xl px-4 pt-24 md:pt-32 pb-12 sm:px-6 lg:px-8 transition-all duration-500">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
