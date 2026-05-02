import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Autofliper – Car Exchange Marketplace',
    template: '%s | Autofliper',
  },
  description: 'Find your perfect car exchange. List your car, discover matches, and trade with confidence.',
  keywords: ['car exchange', 'car swap', 'auto marketplace', 'vehicle trade', 'car listing'],
  openGraph: {
    title: 'Autofliper – Car Exchange Marketplace',
    description: 'Find your perfect car exchange.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body antialiased bg-surface-50 min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  );
}
