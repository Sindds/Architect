import { PRICING, STYLE_ORDER, TIER_ORDER } from '@/content/pricing'
import { PROJECTS } from '@/content/projects'
import { SITE } from '@/content/site'
import { SEO_TEXT } from '@/content/texts'
import type { Picture, Style } from '@/content/types'
import { formatDaysFrom, formatMlnFrom, groupDigits } from './format'
import { isPlaceholderLink, realEmail, realNumber } from './placeholders'
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
  return plain(SEO_TEXT.description(lead, formatMlnFrom(c.price), formatMlnFrom(t.price), formatDaysFrom(t.days)))
}

/** Заголовок и описание главной: ключевая фраза в начале, цена и срок — из pricing.ts. */
export const SEO = {
  title: SEO_TEXT.title(SITE.brandFull),
  description: seoDescription(SEO_TEXT.descriptionLead),
  ogTitle: SEO_TEXT.ogTitle(plain(formatMlnFrom(contour.price))),
}

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
    knowsAbout: SEO_TEXT.knowsAbout,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: SEO_TEXT.catalogName,
      itemListElement: TIER_ORDER.map((tier) => {
        const t = PRICING.tiers[tier]
        return {
          '@type': 'Offer',
          name: t.title,
          description: t.short,
          itemOffered: { '@type': 'Service', name: SEO_TEXT.serviceName(t.title.toLowerCase()), provider: { '@id': org } },
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
    name: SEO_TEXT.projectsName,
    itemListElement: PROJECTS.map((p, i) => {
      const low = projectPrice(p, 'contour')
      const high = projectPrice(p, 'turnkey')
      return {
        '@type': 'ListItem',
        position: i + 1,
        url: absolute(`/?project=${p.slug}`),
        item: {
          '@type': 'Product',
          name: SEO_TEXT.projectName(p.name),
          description: p.tagline,
          image: [p.cover, ...p.gallery].map(image),
          category: SEO_TEXT.projectCategory(PRICING.styles[p.style].title.toLowerCase()),
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
