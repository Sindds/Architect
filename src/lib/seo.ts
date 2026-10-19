import { PRICING, STYLE_ORDER, TIER_ORDER } from '@/content/pricing'
import { PROJECTS } from '@/content/projects'
import { SITE } from '@/content/site'
import type { Picture, Style } from '@/content/types'
import { formatDaysFrom, formatMlnFrom, groupDigits } from './format'
import { minCalc, minPriceFor, projectPrice } from './pricing'

/**
 * Боевой адрес сайта без слэша в конце: canonical, sitemap, robots.txt, разметка, llms.txt.
 * NEXT_PUBLIC_SITE_URL → домен продакшена Vercel → localhost (разработка).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
).replace(/\/+$/, '')

const plain = (s: string) => s.replace(/ /g, ' ')
export const absolute = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

const contour = minCalc('contour')
const turnkey = minCalc('turnkey')

/** Описание до 160 символов: о чём страница, цены «от» и срок из pricing.ts (для варианта — по его стилю). */
export function seoDescription(lead: string, style: Style | null = null) {
  const c = minCalc('contour', style)
  const t = minCalc('turnkey', style)
  return plain(`${lead}: тёплый контур от ${formatMlnFrom(c.price)}, под ключ от ${formatMlnFrom(t.price)}, ${formatDaysFrom(t.days)}. Цена в договоре.`)
}

/** Заголовок и описание главной: ключевая фраза в начале, цена и срок — из pricing.ts. */
export const SEO = {
  title: `Дома из клееного бруса под ключ в Подмосковье — ${SITE.brandFull}`,
  description: seoDescription('Строительство загородных домов из клееного бруса и монолита'),
  ogTitle: `Дома из клееного бруса с панорамным остеклением — от ${plain(formatMlnFrom(contour.price))}`,
}

/** Номер не заглушка шаблона: после кода страны есть цифры кроме нулей (+7 000 000-00-00, ИНН 0000000000 — заглушки). */
const realNumber = (value: string) => /[1-9]/.test(value.replace(/^\+?7/, ''))
const realEmail = (value: string) => Boolean(value.trim()) && !value.endsWith('example.com')
/** Ссылка-заглушка шаблона: после домена пусто или одни нули (t.me/+70000000000, vk.com/club0, max.ru/). */
const isPlaceholderLink = (url: string) => !/[1-9a-z]/i.test(url.replace(/^https?:\/\/[^/]+\/?/, '').replace(/^(\+?7|club|u\/)/, ''))

const image = (p: Picture) => absolute(p.src.src)

/** Разметка schema.org одним графом: организация-подрядчик, сайт, страница, каталог услуг с ценами, проекты. */
export function structuredData() {
  const org = `${SITE_URL}/#organization`
  const phone = SITE.phoneHref.replace('tel:', '')
  // Профили компании (sameAs): сообщество ВКонтакте, Telegram, MAX. WhatsApp — чат по номеру, не профиль.
  const sameAs = Object.entries(SITE.messengers)
    .filter(([channel, url]) => channel !== 'whatsapp' && url && !isPlaceholderLink(url))
    .map(([, url]) => url)
  const lowest = Math.min(contour.price, turnkey.price)

  const organization = {
    '@type': ['GeneralContractor', 'Organization'],
    '@id': org,
    name: SITE.brandFull,
    ...(realNumber(SITE.operator.inn) ? { legalName: SITE.operator.name, taxID: SITE.operator.inn } : {}),
    description: SITE.about,
    url: `${SITE_URL}/`,
    logo: absolute('/icon.png'),
    image: absolute('/opengraph-image.jpg'),
    ...(realNumber(phone) ? { telephone: phone } : {}),
    ...(realEmail(SITE.email) ? { email: SITE.email } : {}),
    address: {
      '@type': 'PostalAddress',
      addressCountry: SITE.postalAddress.country,
      addressRegion: SITE.postalAddress.region,
      addressLocality: SITE.postalAddress.locality,
      streetAddress: SITE.postalAddress.street,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lon },
    hasMap: `https://yandex.ru/maps/?pt=${SITE.geo.lon},${SITE.geo.lat}&z=${SITE.geo.zoom}`,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: SITE.openingHours.days,
      opens: SITE.openingHours.opens,
      closes: SITE.openingHours.closes,
    },
    areaServed: SITE.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
    priceRange: `от ${groupDigits(lowest)} ₽`,
    currenciesAccepted: 'RUB',
    ...(sameAs.length ? { sameAs } : {}),
    knowsAbout: ['дома из клееного бруса', 'монолитные дома', 'фахверк', 'панорамное остекление', 'строительство домов под ключ'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Строительство дома: пакеты готовности',
      itemListElement: TIER_ORDER.map((tier) => {
        const t = PRICING.tiers[tier]
        return {
          '@type': 'Offer',
          name: t.title,
          description: t.short,
          itemOffered: { '@type': 'Service', name: `Строительство дома: ${t.title.toLowerCase()}`, provider: { '@id': org } },
          priceSpecification: STYLE_ORDER.map((style) => ({
            '@type': 'UnitPriceSpecification',
            name: PRICING.styles[style].title,
            minPrice: minPriceFor(tier, style),
            priceCurrency: 'RUB',
            unitText: 'м²',
          })),
          availability: 'https://schema.org/InStock',
        }
      }),
    },
  }

  const projects = {
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#projects`,
    name: 'Проекты домов',
    itemListElement: PROJECTS.map((p, i) => {
      const low = projectPrice(p, 'contour')
      const high = projectPrice(p, 'turnkey')
      return {
        '@type': 'ListItem',
        position: i + 1,
        url: absolute(`/?project=${p.slug}`),
        item: {
          '@type': 'Product',
          name: `Проект дома ${p.name}`,
          description: p.tagline,
          image: [p.cover, ...p.gallery].map(image),
          category: `Дом: ${PRICING.styles[p.style].title.toLowerCase()}`,
          brand: { '@id': org },
          additionalProperty: [
            { '@type': 'PropertyValue', name: 'Площадь дома', value: p.area, unitText: 'м²' },
            { '@type': 'PropertyValue', name: 'Терраса', value: p.terrace, unitText: 'м²' },
            { '@type': 'PropertyValue', name: 'Этажей', value: p.floors },
            { '@type': 'PropertyValue', name: 'Конструкция', value: PRICING.styles[p.style].construction },
            { '@type': 'PropertyValue', name: 'Срок под ключ', value: high.days, unitText: 'дней' },
          ],
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'RUB',
            lowPrice: low.price,
            highPrice: high.price,
            offerCount: TIER_ORDER.length,
            availability: 'https://schema.org/InStock',
            seller: { '@id': org },
          },
        },
      }
    }),
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE.brandFull,
        inLanguage: 'ru-RU',
        publisher: { '@id': org },
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: SEO.title,
        description: SEO.description,
        inLanguage: 'ru-RU',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': org },
        primaryImageOfPage: absolute('/opengraph-image.jpg'),
        mainEntity: { '@id': `${SITE_URL}/#projects` },
      },
      projects,
    ],
  }
}
