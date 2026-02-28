import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import JsonLd from '@/components/seo/json-ld'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://vybex.ai'),
  title: 'Vybex.ai - Build Your Landing Page in 5 Minutes',
  description: 'AI-powered landing page generator that builds conversion-ready Next.js + Tailwind landing pages in minutes. Transform your ideas into live websites instantly.',
  keywords: ['AI landing page generator', 'Vybex AI', 'automated website builder', 'Next.js landing page', 'Tailwind CSS builder', 'AI SaaS builder', 'Vyana builder'],
  authors: [{ name: 'Vybex Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Vybex.ai - AI Landing Page Builder',
    description: 'Create high-converting landing pages in minutes with Vyana, our AI architect.',
    url: 'https://vybex.ai',
    siteName: 'Vybex.ai',
    images: [
      {
        url: '/og-image.png', // Assuming user might add this, or I should suggest it
        width: 1200,
        height: 630,
        alt: 'Vybex.ai - Build Your Landing Page in 5 Minutes',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vybex.ai - AI Landing Page Builder',
    description: 'Transform your thoughts into a professional landing page with Vyana AI.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'VrEmnNqA7SezugBRvYNegJyz__fvvrpT83slChVPMRo',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <JsonLd />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
