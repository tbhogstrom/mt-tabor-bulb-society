import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Mt Tabor Bulb Society | Growing Community / Community Grows',
  description: 'The digital heart of the Mt Tabor neighborhood bulb gardening community. Share bulb photos, exchange knowledge, and connect with neighbors.',
  keywords: ['bulb gardening', 'Mt Tabor', 'Portland', 'community garden', 'bulb exchange', 'horticulture'],
  openGraph: {
    title: 'Mt Tabor Bulb Society',
    description: 'Growing Community / Community Grows',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col parchment-bg">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
