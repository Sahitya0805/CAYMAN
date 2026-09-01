import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import { CartProvider } from '@/context/CartContext';
import { TopAnnouncement } from '@/components/layout/TopAnnouncement';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { FloatingCricketBackground } from '@/components/ui/FloatingCricketBackground';

export const metadata: Metadata = {
  title: 'Cayman Super Kings — Official Cricket Club & Platform',
  description: 'The official digital home of the Cayman Super Kings (CSK) in the Daniel Morris Super League T20. Follow live match scores, buy tickets, explore squad players, latest news, and official merchandise.',
  keywords: ['Cayman Super Kings', 'CSK', 'Cricket', 'Cayman Islands Cricket', 'Daniel Morris Super League', 'Rahul Garg', 'Cricket Tickets', 'T20 Cricket'],
  openGraph: {
    title: 'Cayman Super Kings — One Team. One Dream.',
    description: 'Official digital home of Cayman Super Kings Cricket Club.',
    url: 'https://caymansuperkings.ky',
    siteName: 'Cayman Super Kings',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Cayman Super Kings Cricket Team',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-navy-950 text-slate-100 font-sans antialiased selection:bg-cskgold-500 selection:text-navy-950 relative">
        <StoreProvider>
          <CartProvider>
            <FloatingCricketBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
              <TopAnnouncement />
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <CartDrawer />
            </div>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
