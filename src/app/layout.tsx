import type { Metadata, Viewport } from 'next'
import { SITE } from '@/content/site'
import { fontVariables } from './fonts'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const concept = SITE.contentMode === 'concept'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'ARCLINE — дома из клееного бруса под ключ в Подмосковье',
  description:
    'Проектируем и строим дома из клееного бруса и монолита с панорамным остеклением. Цена фиксируется в договоре, оплата по этапам, план и факт по сданным домам.',
  alternates: { canonical: '/' },
  // Режим concept: компания вымышлена, страница не индексируется (CONTENT-SPEC §1).
  robots: concept ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: SITE.brandFull,
    title: 'ARCLINE — дома из клееного бруса под ключ',
    description: 'Фиксированная цена в договоре, оплата по этапам, план и факт по сданным домам.',
  },
  icons: { icon: '/favicon.svg' },
}

export const viewport: Viewport = {
  themeColor: '#f3efe6',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVariables}>
      <body>{children}</body>
    </html>
  )
}
