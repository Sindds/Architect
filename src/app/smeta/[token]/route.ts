import { headers } from 'next/headers'
import { SITE } from '@/content/site'
import { SMETA_TEXT } from '@/content/texts'
import { clientIp } from '@/lib/client-ip'
import { hashIp, smetaLimiter } from '@/lib/rate-limit'
import { createPdfCache } from '@/lib/smeta-cache'
import { renderSmetaPdf } from '@/lib/smeta-pdf'
import { smetaSecret, verifySmetaToken } from '@/lib/smeta-token'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const pdfs = createPdfCache()
const text = (body: string, status: number) => new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } })

/** Смета в PDF по ссылке из экрана успеха заявки (PLAN P5.4): токен с подписью живёт 7 дней. */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  // Лимит по IP до проверки и сборки: перебор ссылок и повторные запросы не загружают сервер.
  if (!smetaLimiter.allow(hashIp(clientIp(await headers())))) return text(SMETA_TEXT.tooMany, 429)
  const { token } = await params
  const valid = verifySmetaToken(token, Date.now(), smetaSecret(process.env))
  if (!valid) return text(SMETA_TEXT.invalid, 403)
  const pdf = await pdfs.get(token, async () => new Uint8Array(await renderSmetaPdf(valid.leadId, valid.input)))
  const name = `${SMETA_TEXT.fileName(SITE.brandFull, valid.leadId)}.pdf`
  return new Response(new Uint8Array(pdf), {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="smeta-${valid.leadId}.pdf"; filename*=UTF-8''${encodeURIComponent(name)}`,
      'cache-control': 'private, no-store',
      // Личная смета по ссылке из заявки: не для поисковиков (robots.txt тоже закрывает /smeta/).
      'x-robots-tag': 'noindex, nofollow',
    },
  })
}
