import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import JsonLd from '@/components/seo/json-ld'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://vybexai.vercel.app/'),
  title: 'Vybex.ai - Build Your Landing Page in 5 Minutes',
  description: 'AI-powered landing page generator that builds conversion-ready Next.js + Tailwind landing pages in minutes. Transform your ideas into live websites instantly.',
  keywords: ['AI landing page generator', 'Vybex AI', 'automated website builder', 'Next.js landing page', 'Tailwind CSS builder', 'AI SaaS builder', 'Vyana builder'],
  authors: [{ name: 'Vybex Team' }],
  manifest: '/manifest.json',
  // icons metadata is automatically handled by Next.js since icon.png and apple-icon.png exist in the app directory
  /*
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  */
  openGraph: {
    title: 'Vybex.ai - AI Landing Page Builder',
    description: 'Create high-converting landing pages in minutes with Vyana, our AI architect.',
    url: 'https://vybexai.vercel.app/',
    siteName: 'Vybex.ai',
    images: [
      {
        url: '/icon.png',
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
