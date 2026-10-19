import type { NextConfig } from 'next'

// Варианты первого экрана под рекламные кампании (CONTENT-SPEC §9):
// /?v=key и /?utm_content=key показывают статическую страницу /v/key, адрес в браузере не меняется.
const variantKeys = '(?<variant>fachwerk|monolith|scandi)'

// Журнал сборки Vercel (Deployments → Build Logs): без ключа формы и канала заявок посетитель увидит
// «Не удалось отправить». Полный список того, что не заполнено, — pnpm ready.
if (process.env.VERCEL) {
  const env = process.env
  const problems = [
    !env.LEAD_TOKEN_SECRET && 'не задан LEAD_TOKEN_SECRET — форма не принимает заявки',
    !(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.LEADS_EMAIL_TO) && !env.B24_WEBHOOK_URL && !env.ONEC_LEADS_URL &&
      'не подключены почта (SMTP_*, LEADS_EMAIL_TO), Битрикс24 (B24_WEBHOOK_URL) и 1С — заявкам некуда уйти',
    !env.SMETA_SIGNING_SECRET && 'не задан SMETA_SIGNING_SECRET — после заявки не будет ссылки на PDF-смету',
    env.B24_WEBHOOK_URL && !env.B24_WEBHOOK_URL.trim().startsWith('https://') && 'B24_WEBHOOK_URL должен начинаться с https:// — Битрикс24 не получит заявки',
    env.ONEC_LEADS_URL && !env.ONEC_LEADS_URL.trim().startsWith('https://') && 'ONEC_LEADS_URL должен начинаться с https:// — 1С не получит заявки',
  ].filter(Boolean)
  for (const p of problems) console.warn(`⚠ Заявки: ${p}. Settings → Environment Variables, затем Redeploy.`)
}

/**
 * Заголовки безопасности для всех ответов. CSP ограничивает только встраивание и формы: скрипты не трогаем
 * (тема и появление блоков — встроенные скрипты в <head>, Метрика и карта Яндекса подключаются после согласия).
 * HSTS браузер учитывает только по HTTPS; Vercel ставит его сам, на своём сервере его отдаёт этот заголовок.
 */
const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }]
  },
  // PDF-смета (/smeta/[token]): react-pdf работает в Node как есть, без сборщика; шрифты читаются с диска.
  serverExternalPackages: ['@react-pdf/renderer'],
  outputFileTracingIncludes: { '/smeta/[token]': ['./scripts/pdf-fonts/*.ttf'] },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Next 16 принимает только качество из этого списка. 70 — фото первого экрана: под тёмным градиентом
    // разницы не видно, а файл на телефоне легче (LCP).
    qualities: [70, 75],
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', has: [{ type: 'query', key: 'v', value: variantKeys }], destination: '/v/:variant' },
        {
          source: '/',
          has: [{ type: 'query', key: 'utm_content', value: variantKeys }],
          missing: [{ type: 'query', key: 'v' }],
          destination: '/v/:variant',
        },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
}

export default nextConfig
