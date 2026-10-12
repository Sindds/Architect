import type { NextConfig } from 'next'

// Варианты первого экрана под рекламные кампании (CONTENT-SPEC §9):
// /?v=key и /?utm_content=key показывают статическую страницу /v/key, адрес в браузере не меняется.
const variantKeys = '(?<variant>fachwerk|monolith|scandi)'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // PDF-смета (/smeta/[token]): react-pdf работает в Node как есть, без сборщика; шрифты читаются с диска.
  serverExternalPackages: ['@react-pdf/renderer'],
  outputFileTracingIncludes: { '/smeta/[token]': ['./scripts/pdf-fonts/*.ttf'] },
  images: {
    formats: ['image/avif', 'image/webp'],
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
