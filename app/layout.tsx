import type { Metadata } from 'next';
import { Bricolage_Grotesque, Outfit } from 'next/font/google';
import { getSiteConfig } from '@/lib/content';
import './globals.css';

const bricolage = Bricolage_Grotesque({
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(config.jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
