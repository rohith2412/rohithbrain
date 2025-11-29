// FILE: app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: {
    default: 'Your App Name | Tagline',
    template: '%s | Your App Name'
  },
  description: 'Your app description for SEO - keep it under 160 characters',
  keywords: ['nextjs', 'react', 'seo', 'app router'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    title: 'Your App Name',
    description: 'Your app description',
    siteName: 'Your App Name',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Your App Name'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your App Name',
    description: 'Your app description',
    creator: '@yourusername',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}