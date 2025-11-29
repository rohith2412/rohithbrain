import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://rohithbrain.com'),
  title: {
    default: 'Rohith Brain - Your Source for Knowledge & Tips',
    template: '%s | Rohith Brain'
  },
  description: 'Discover articles on recipes, technology, lifestyle, health, finance, and more. Learn something new every day.',
  keywords: ['blog', 'articles', 'tips', 'guides', 'knowledge'],
  authors: [{ name: 'Rohith' }],
  creator: 'Rohith',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rohithbrain.com',
    title: 'Rohith Brain',
    description: 'Your source for knowledge and tips',
    siteName: 'Rohith Brain',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Rohith Brain'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rohith Brain',
    description: 'Your source for knowledge and tips',
    creator: '@rohith',
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