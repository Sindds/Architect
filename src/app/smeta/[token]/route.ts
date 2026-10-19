import { SITE } from '@/content/site'
import { renderSmetaPdf } from '@/lib/smeta-pdf'
import { smetaSecret, verifySmetaToken } from '@/lib/smeta-token'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Смета в PDF по ссылке из экрана успеха заявки (PLAN P5.4): токен с подписью живёт 7 дней. */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const valid = verifySmetaToken(token, Date.now(), smetaSecret(process.env))
  if (!valid) {
    return new Response('Ссылка на смету недействительна или устарела. Оставьте заявку на сайте ещё раз.', {
      status: 403,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }
  const pdf = await renderSmetaPdf(valid.leadId, valid.input)
  const name = `Смета ${SITE.brandFull} № ${valid.leadId}.pdf`
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
