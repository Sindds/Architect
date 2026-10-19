import { SITE_URL } from '@/lib/seo'

// robots.txt текстом, а не через MetadataRoute.Robots: Next не умеет директиву Clean-param для Яндекса.
export const dynamic = 'force-static'

/** Параметры адреса, которые не меняют содержимое страницы: рекламные метки, вариант первого экрана, окна. */
const CLEAN_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid', 'gclid', 'v', 'project', 'calc']

export function GET() {
  const body = [
    // Всем роботам, включая поисковых ассистентов ИИ (YandexGPT, GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
    'User-agent: *',
    'Allow: /',
    // Личные ссылки на сметы после заявки: живут 7 дней, в выдаче им не место.
    'Disallow: /smeta/',
    `Clean-param: ${CLEAN_PARAMS.join('&')} /`,
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
    `# Краткая сводка сайта для ИИ-ассистентов: ${SITE_URL}/llms.txt`,
    '',
  ].join('\n')
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
