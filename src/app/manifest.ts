import type { MetadataRoute } from 'next'
import { SITE } from '@/content/site'
import { SEO } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.brandFull,
    short_name: SITE.brand,
    description: SEO.description,
    lang: 'ru',
    start_url: '/',
    display: 'browser',
    background_color: '#f8f8f6',
    theme_color: '#0a0b0d',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
