import type { Metadata, Viewport } from 'next'
import { CookieBanner } from '@/components/CookieBanner'
import { SITE } from '@/content/site'
import { SEO, SITE_URL } from '@/lib/seo'
import { lazySectionsInitScript } from '@/lib/lazy-sections'
import { revealInitScript } from '@/lib/reveal'
import { themeInitScript } from '@/lib/theme'
import { fontVariables } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SEO.title, template: `%s — ${SITE.brandFull}` },
  description: SEO.description,
  applicationName: SITE.brandFull,
  category: 'Строительство',
  alternates: { canonical: '/' },
  // Индексация открыта: поисковики и ИИ-ассистенты (robots.txt, llms.txt). Крупные превью картинок в выдаче.
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: SITE.brandFull,
    title: SEO.ogTitle,
    description: SEO.description,
    // Картинка для мессенджеров и соцсетей: pnpm seo:images (после смены цен или фото первого экрана).
    images: [{ url: '/opengraph-image.jpg', width: 1200, height: 630, alt: SEO.ogTitle }],
  },
  twitter: { card: 'summary_large_image', title: SEO.ogTitle, description: SEO.description, images: ['/opengraph-image.jpg'] },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-icon.png', sizes: '180x180' },
  },
  // Подтверждение прав в Яндекс Вебмастере и Google Search Console: коды из переменных окружения при сборке.
  verification: {
    ...(process.env.YANDEX_VERIFICATION ? { yandex: process.env.YANDEX_VERIFICATION } : {}),
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f8f6' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0b0d' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme и data-loader выставляет скрипт до отрисовки, поэтому атрибуты расходятся с серверным HTML.
    <html lang="ru" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: revealInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: lazySectionsInitScript }} />
      </head>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
