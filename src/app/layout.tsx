/**
 * WasteIQ — Root Layout
 * Loads fonts, providers, metadata, and global styles.
 */
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Work_Sans, Fira_Code } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'WasteIQ — Smart Waste Management for Mira-Bhayandar',
    template: '%s | WasteIQ',
  },
  description:
    'Next-generation AI-powered municipal waste management. Real-time IoT sensors, route optimization, citizen engagement, and predictive analytics for Mira-Bhayandar.',
  keywords: [
    'WasteIQ',
    'smart waste management',
    'Mira-Bhayandar',
    'IoT sensors',
    'route optimization',
    'municipal corporation',
    'waste collection',
    'AI analytics',
  ],
  authors: [{ name: 'Ryan Keshary', url: 'https://github.com/RyanKesh' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://wasteiq.vercel.app',
    title: 'WasteIQ — Smart Waste Management',
    description: 'AI-powered smart waste management for Mira-Bhayandar Municipal Corporation',
    siteName: 'WasteIQ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WasteIQ — Smart Waste Management',
    description: 'AI-powered smart waste management for Mira-Bhayandar Municipal Corporation',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#006D39',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${workSans.variable} ${firaCode.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-body)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              border: 'none',
            },
          }}
        />
      </body>
    </html>
  );
}
