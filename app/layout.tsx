import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polymarket Whales Tracker',
  description:
    'Follow the top Polymarket whales, monitor their stats, and discover the markets they are active in.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
