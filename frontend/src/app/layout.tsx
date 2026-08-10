

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { SettingsProvider } from '@/context/SettingsContext'
import ClientLayout from '@/components/layout/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GLA GLA Business - E-Commerce',
  description: 'Votre boutique en ligne au Cameroun',
  keywords: 'e-commerce, cameroun, boutique en ligne, glagla business',
  authors: [{ name: 'GLA GLA Business' }],
  openGraph: {
    title: 'GLA GLA Business - E-Commerce',
    description: 'Votre boutique en ligne au Cameroun',
    url: 'https://glagla-business.com',
    siteName: 'GLA GLA Business',
    images: [
      {
        url: 'https://glagla-business.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'fr_FR',
    type: 'website',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <SettingsProvider>
            <CartProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </CartProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
