import type { Metadata } from 'next';
import { Manrope, Outfit } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { getSiteConfig } from '@/lib/content';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

const config = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(config.url),
  title: config.title,
  description: config.description,
  keywords: config.keywords,
  authors: [{ name: config.name }],
  robots: 'index, follow',
  alternates: {
    canonical: config.url + '/',
  },
  openGraph: {
    type: 'website',
    title: config.og.title,
    description: config.og.description,
    url: config.og.url,
    siteName: config.og.siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: config.twitter.title,
    description: config.twitter.description,
    images: [config.url + '/opengraph-image'],
  },
  ...(config.verification?.google || config.verification?.bing
    ? {
        verification: {
          ...(config.verification.google ? { google: config.verification.google } : {}),
          ...(config.verification.bing
            ? { other: { 'msvalidate.01': config.verification.bing } }
            : {}),
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${outfit.variable}`}>
      <head>
        {Object.values(config.social).map((url) => (
          <link key={url} rel="me" href={url} />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(config.jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
