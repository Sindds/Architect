import { expect, test } from './fixtures'
import { PRICING, STYLE_ORDER } from '@/content/pricing'
import { FAQ } from '@/content/texts'
import { SITE } from '@/content/site'
import { groupDigits } from '@/lib/format'
import { minCalc, projectPrice } from '@/lib/pricing'

// content/projects не импортируем: он тянет картинки .webp, которые Playwright не загружает. Проекты берём со страницы.
const PROJECT_COUNT = 4
const PROJECT_NAMES = ['NORDIC', 'VISTA', 'CHALET', 'TITAN']

// SEO для поисковиков (Яндекс, Google), роботов и ИИ-ассистентов (решение заказчика 19.10.2026: индексация открыта).

const meta = (html: string, attr: 'name' | 'property', key: string) =>
  html.match(new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`))?.[1] ?? html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${key}"`))?.[1]

test('главная открыта для индексации: robots, canonical, title и description в норме, OG и Twitter', async ({ request }) => {
  const html = await (await request.get('/')).text()
  expect(html).not.toMatch(/noindex/)
  expect(meta(html, 'name', 'robots')).toMatch(/^index, follow/)
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
  expect(title).toMatch(/^Дома из клееного бруса под ключ в Подмосковье/)
  expect(title.length).toBeLessThanOrEqual(70)
  const description = meta(html, 'name', 'description') ?? ''
  expect(description.length).toBeGreaterThan(70)
  expect(description.length).toBeLessThanOrEqual(160)
  expect(html).toMatch(/<link rel="canonical" href="https?:\/\/[^"/]+\/?"/)
  expect(meta(html, 'property', 'og:image')).toMatch(/\/opengraph-image\.jpg$/)
  expect(meta(html, 'property', 'og:locale')).toBe('ru_RU')
  expect(meta(html, 'name', 'twitter:card')).toBe('summary_large_image')
  expect(html).toMatch(/<html lang="ru"/)
  expect((html.match(/<h1[\s>]/g) ?? []).length).toBe(1)
})

test('robots.txt: всё открыто, кроме личных смет; Clean-param для Яндекса; карта сайта', async ({ request }) => {
  const res = await request.get('/robots.txt')
  expect(res.status()).toBe(200)
  const txt = await res.text()
  expect(txt).toContain('User-agent: *\nAllow: /\nDisallow: /smeta/')
  expect(txt).not.toMatch(/Disallow: \/\s*$/m)
  expect(txt).toMatch(/^Clean-param: utm_source&.*yclid&gclid&v&project&calc \/$/m)
  expect(txt).toMatch(/^Sitemap: https?:\/\/\S+\/sitemap\.xml$/m)
})

test('sitemap.xml: главная с картинками проектов и юридические страницы', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  expect(xml).toMatch(/<loc>https?:\/\/[^<]+\/<\/loc>/)
  expect(xml).toContain('/privacy</loc>')
  expect((xml.match(/<image:loc>/g) ?? []).length).toBeGreaterThanOrEqual(PROJECT_COUNT)
  expect(xml).toMatch(/<lastmod>/)
})

test('llms.txt для ИИ-ассистентов: компания, цены, проекты, вопросы, контакты — те же, что на странице', async ({ request }) => {
  const res = await request.get('/llms.txt')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('text/markdown')
  const md = (await res.text()).replace(/ /g, ' ')
  expect(md).toMatch(new RegExp(`^# ${SITE.brandFull}`))
  expect(md).toContain('тёплый контур от 8,36 млн ₽')
  for (const name of PROJECT_NAMES) expect(md).toContain(`### ${name}`)
  for (const f of FAQ) expect(md).toContain(`### ${f.question}`)
  expect(md).toContain(SITE.address)
})

test('разметка schema.org: подрядчик с адресом и часами, каталог услуг, проекты с ценами из pricing.ts, FAQPage', async ({ request }) => {
  const html = await (await request.get('/')).text()
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]!) as Record<string, unknown>)
  const graph = (blocks.find((b) => '@graph' in b)?.['@graph'] ?? []) as Record<string, unknown>[]
  const org = graph.find((n) => (n['@type'] as string[]).includes?.('GeneralContractor'))!
  expect(org).toMatchObject({
    name: SITE.brandFull,
    address: { streetAddress: SITE.postalAddress.street, addressRegion: SITE.postalAddress.region, addressCountry: 'RU' },
    geo: { latitude: SITE.geo.lat, longitude: SITE.geo.lon },
    openingHoursSpecification: { opens: '09:00', closes: '20:00' },
  })
  // Заглушки шаблона (+7 000…, ИНН из нулей, example.com) в разметку не попадают.
  expect(org).not.toHaveProperty('telephone')
  expect(org).not.toHaveProperty('taxID')
  expect(org).not.toHaveProperty('email')
  expect(org).not.toHaveProperty('sameAs')
  expect(org.priceRange).toBe(`от ${groupDigits(minCalc('contour').price)} ₽`)
  expect(graph.find((n) => n['@type'] === 'WebSite')).toBeTruthy()
  type Item = { name: string; category: string; additionalProperty: { name: string; value: number | string }[]; offers: { lowPrice: number; highPrice: number } }
  const list = graph.find((n) => n['@type'] === 'ItemList') as { itemListElement: { item: Item }[] }
  expect(list.itemListElement.map((e) => e.item.name)).toEqual(PROJECT_NAMES.map((n) => `Проект дома ${n}`))
  // Цены в разметке совпадают с pricing.ts для площади, террасы и стиля, указанных в той же разметке.
  for (const { item } of list.itemListElement) {
    const prop = (name: string) => Number(item.additionalProperty.find((p) => p.name === name)?.value)
    const style = STYLE_ORDER.find((s) => item.category === `Дом: ${PRICING.styles[s].title.toLowerCase()}`)!
    const p = { area: prop('Площадь дома'), terrace: prop('Терраса'), style }
    expect(item.offers, item.name).toMatchObject({ lowPrice: projectPrice(p, 'contour').price, highPrice: projectPrice(p, 'turnkey').price })
  }
  const faq = blocks.find((b) => b['@type'] === 'FAQPage') as { mainEntity: unknown[] }
  expect(faq.mainEntity).toHaveLength(FAQ.length)
  // Отзывы шаблона в разметку не попадают: без источника это нарушение правил поисковиков.
  expect(html).not.toMatch(/"aggregateRating"|"@type":"Review"/)
})

test('значки, манифест и картинка для соцсетей отдаются', async ({ request }) => {
  for (const [url, type] of [
    ['/favicon.ico', 'image/'],
    ['/favicon.svg', 'image/svg+xml'],
    ['/icon.png', 'image/png'],
    ['/apple-icon.png', 'image/png'],
    ['/opengraph-image.jpg', 'image/jpeg'],
    ['/manifest.webmanifest', 'application/manifest+json'],
  ] as const) {
    const res = await request.get(url)
    expect(res.status(), url).toBe(200)
    expect(res.headers()['content-type'], url).toContain(type)
  }
})

test('рекламные варианты: свой title и описание, canonical — на главную', async ({ request }) => {
  const html = await (await request.get('/v/monolith')).text()
  const description = meta(html, 'name', 'description') ?? ''
  expect(description).toMatch(/^Монолитные дома с панорамными фасадами в Подмосковье: тёплый контур от 10,56/)
  expect(description.length).toBeLessThanOrEqual(160)
  expect(html).toMatch(/<title>Монолитные дома с панорамными фасадами в Подмосковье — ARCLINE ESTATE<\/title>/)
  expect(html).toMatch(/<link rel="canonical" href="https?:\/\/[^"/]+\/?"/)
  expect(html).not.toMatch(/noindex/)
})
