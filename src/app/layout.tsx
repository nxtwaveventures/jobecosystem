/**
 * Root Layout Component
 * 
 * Main layout wrapper for the entire application.
 * Provides global styling, metadata, and error boundary.
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'AI/ML Freelance Platform',
    template: '%s | AI/ML Freelance Platform'
  },
  description: 'Connect AI/ML freelancers with clients through our comprehensive platform featuring web dashboards and Telegram bot integration.',
  keywords: [
    'AI',
    'Machine Learning',
    'Freelance',
    'Remote Work',
    'Data Science',
    'Deep Learning',
    'Computer Vision',
    'Natural Language Processing'
  ],
  authors: [{ name: 'AI/ML Freelance Platform' }],
  creator: 'AI/ML Freelance Platform',
  publisher: 'AI/ML Freelance Platform',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'AI/ML Freelance Platform',
    description: 'Connect AI/ML freelancers with clients through our comprehensive platform.',
    siteName: 'AI/ML Freelance Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI/ML Freelance Platform',
    description: 'Connect AI/ML freelancers with clients through our comprehensive platform.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

/**
 * Root Layout Component
 * 
 * @param children - Child components to render
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}