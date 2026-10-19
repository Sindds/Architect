import type { MetadataRoute } from 'next'
import { MEDIA } from '@/content/media'
import { PROJECTS } from '@/content/projects'
import { absolute, SITE_URL } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  // Дата сборки: сайт статический, страница меняется только с новой сборкой.
  const lastModified = new Date()
  // Картинки главной — для поиска по картинкам: первый экран и все фото проектов.
  const images = [MEDIA.heroForest, ...PROJECTS.flatMap((p) => [p.cover, ...p.gallery])]
    .map((p) => absolute(p.src.src))
    .filter((src, i, all) => all.indexOf(src) === i)
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'weekly', priority: 1, images },
    ...['/privacy', '/soglasie', '/cookies'].map((path) => ({ url: `${SITE_URL}${path}`, lastModified, changeFrequency: 'yearly' as const, priority: 0.2 })),
  ]
}
