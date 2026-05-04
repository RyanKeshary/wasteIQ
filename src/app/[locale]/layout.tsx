/**
 * WasteIQ — Root Layout
 * Loads fonts, providers, metadata, and global styles.
 */
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Work_Sans, Fira_Code, Noto_Sans_Devanagari, Noto_Sans_Gujarati } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import PWARegistration from '@/components/PWARegistration';
import { LoadingProvider } from '@/components/providers/LoadingProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';

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

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-devanagari',
  display: 'swap',
});

const notoGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-gujarati',
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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WasteIQ',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#006D39',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${plusJakarta.variable} ${workSans.variable} ${firaCode.variable} ${notoDevanagari.variable} ${notoGujarati.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <PWARegistration />
            <LoadingProvider>
              {children}
            </LoadingProvider>
            <Toaster
            position="bottom-right"
            expand={false}
            richColors
            closeButton
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                color: 'var(--on-surface)',
                fontFamily: 'var(--font-body)',
                padding: '16px',
              },
              className: 'premium-toast',
            }}
          />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
