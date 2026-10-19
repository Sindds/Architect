import { ADDON_ORDER, PRICING, STYLE_ORDER, TIER_ORDER } from '@/content/pricing'
import { FAQ, STEPS, STEPS_EXAMPLE, WHY_US } from '@/content/process'
import { PROJECTS } from '@/content/projects'
import { SITE } from '@/content/site'
import { formatDaysFrom, formatMln, formatMlnFrom, groupDigits } from '@/lib/format'
import { minCalc, minPriceFor, projectPrice } from '@/lib/pricing'
import { SEO, SITE_URL } from '@/lib/seo'

// llms.txt (llmstxt.org): сводка сайта в Markdown для ИИ-ассистентов и поисковых ИИ — Алисы, YandexGPT, ChatGPT,
// Perplexity, Claude. Все цифры — из того же контента и pricing.ts, что и страница, поэтому не расходятся с ней.
export const dynamic = 'force-static'

const plain = (s: string) => s.replace(/ /g, ' ')

export function GET() {
  const contour = minCalc('contour')
  const turnkey = minCalc('turnkey')
  const phone = SITE.phoneHref.replace('tel:', '')
  const lines = [
    `# ${SITE.brandFull}`,
    '',
    `> ${SITE.about} ${plain(SEO.description)}`,
    '',
    `Сайт: ${SITE_URL}/`,
    '',
    '## Кратко',
    `- Что строим: загородные дома из клееного бруса (скандинавский стиль, фахверк, шале) и монолитные дома с панорамным остеклением.`,
    `- Где: ${SITE.areaServed.join(', ')}. Офис: ${SITE.address}.`,
    `- Цена: тёплый контур от ${plain(formatMlnFrom(contour.price))}, под ключ от ${plain(formatMlnFrom(turnkey.price))} (дом 100 м² без террасы). Цена фиксируется в договоре.`,
    `- Срок: ${plain(formatDaysFrom(turnkey.days))} от начала работ до ключей для дома под ключ 100 м².`,
    `- Оплата по этапам после приёмки каждого этапа: ${STEPS.map((s) => `${s.paymentPercent}%`).join(', ')}.`,
    '',
    '## Пакеты и цены за м² дома',
    ...TIER_ORDER.flatMap((tier) => {
      const t = PRICING.tiers[tier]
      return [
        `### ${t.title}`,
        t.short,
        ...STYLE_ORDER.map((style) => `- ${PRICING.styles[style].title} (${PRICING.styles[style].construction.toLowerCase()}): от ${plain(groupDigits(minPriceFor(tier, style)))} ₽/м²`),
        `- Терраса: ${plain(groupDigits(t.terracePerM2))} ₽/м²`,
        `- Входит: ${t.includes.join('; ')}.`,
        `- Не входит: ${t.excludes.join('; ')}.`,
        '',
      ]
    }),
    '## Дополнительные опции',
    ...ADDON_ORDER.map((key) => {
      const a = PRICING.addons[key]
      return `- ${a.title}: ${plain(groupDigits(a.price))} ₽, +${a.days} дней. ${a.note}`
    }),
    '',
    '## Проекты',
    ...PROJECTS.flatMap((p) => {
      const low = projectPrice(p, 'contour')
      const high = projectPrice(p, 'turnkey')
      return [
        `### ${p.name} — ${PRICING.styles[p.style].title.toLowerCase()}, ${p.area} м²`,
        p.tagline,
        `- Этажей: ${p.floors}; терраса: ${p.terrace} м²; конструкция: ${PRICING.styles[p.style].construction.toLowerCase()}.`,
        `- Тёплый контур от ${plain(formatMln(low.price))}, под ключ от ${plain(formatMln(high.price))}; срок под ключ ${plain(formatDaysFrom(high.days))}.`,
        `- Подробнее: ${SITE_URL}/?project=${p.slug}`,
        '',
      ]
    }),
    `## Этапы строительства (пример: ${STEPS_EXAMPLE.project} ${STEPS_EXAMPLE.area} м², под ключ)`,
    ...STEPS.map((s, i) => `${i + 1}. ${s.title} — ${s.days} дней, оплата ${s.paymentPercent}%. ${s.result}`),
    '',
    '## Почему нам доверяют',
    ...WHY_US.map((w) => `- ${w.title}. ${w.fact}`),
    '',
    '## Частые вопросы',
    ...FAQ.flatMap((f) => [`### ${f.question}`, f.answer.join(' '), '']),
    '## Документы',
    `- Образец договора строительного подряда (PDF): ${SITE_URL}${SITE.docs.contract}`,
    `- Образец сметы (PDF): ${SITE_URL}${SITE.docs.estimate}`,
    `- Политика конфиденциальности: ${SITE_URL}/privacy`,
    '',
    '## Контакты',
    `- Адрес: ${SITE.address}`,
    `- Телефон: ${phone}`,
    `- Почта: ${SITE.email}`,
    `- Часы работы: ${SITE.hours}`,
    `- Расчёт стоимости и заявка: ${SITE_URL}/#calculator`,
    '',
  ]
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/markdown; charset=utf-8' } })
}
