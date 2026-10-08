import type { MetadataRoute } from 'next'
import { SITE } from '@/content/site'

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  // Режим concept: индексация закрыта целиком (CONTENT-SPEC §1).
  if (SITE.contentMode === 'concept') return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/v/'] }, sitemap: `${site}/sitemap.xml` }
}
