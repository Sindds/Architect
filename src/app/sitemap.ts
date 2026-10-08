import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return ['', '/privacy', '/soglasie', '/cookies'].map((path) => ({ url: `${site}${path}`, changeFrequency: 'monthly' }))
}
