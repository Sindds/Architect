import { type LegalSite, legalReadiness } from '@/content/legal'
import { emailConfig } from './leads/email'
import { isPlaceholderLink, realEmail, realNumber } from './placeholders'

type Env = Record<string, string | undefined>

export interface ReadinessItem {
  /** critical — без этого заявки не дойдут или сайт нельзя публиковать; important — желательно до запуска. */
  level: 'critical' | 'important'
  /** Что не так, по-русски. */
  what: string
  /** Где исправить: файл или переменная окружения. */
  where: string
}

interface ReadinessSite extends LegalSite {
  phoneHref: string
  messengers: Readonly<Record<string, string>>
}

const CHANNELS: Record<string, string> = { telegram: 'Telegram', max: 'MAX', vk: 'ВКонтакте', whatsapp: 'WhatsApp' }
const OPERATOR: Record<string, string> = { name: 'название юрлица', inn: 'ИНН', kpp: 'КПП', ogrn: 'ОГРН', address: 'юридический адрес' }
const COMPANY_FILE = 'src/content/company.ts'

/**
 * Готов ли сайт к публикации под заказчика: заглушки в данных компании и переменные окружения
 * (ключи защиты формы, хотя бы один канал заявок, адрес сайта). Пустой список — можно публиковать.
 * Запуск: pnpm ready (читает и .env.local).
 */
export function readiness(site: ReadinessSite, env: Env): ReadinessItem[] {
  const items: ReadinessItem[] = []
  const add = (level: ReadinessItem['level'], what: string, where: string) => items.push({ level, what, where })

  // Данные компании.
  if (!realNumber(site.phoneHref.replace('tel:', ''))) add('critical', 'Телефон — заглушка из нулей', `${COMPANY_FILE}: phoneDisplay и phoneHref`)
  if (!realEmail(site.email)) add('critical', 'Почта — заглушка example.com', `${COMPANY_FILE}: email`)
  const missing = legalReadiness(site)
  for (const field of missing) {
    const operator = field.match(/^operator\.(\w+)$/)?.[1]
    if (operator) add('critical', `Реквизиты: не заполнено поле «${OPERATOR[operator] ?? operator}»`, `${COMPANY_FILE}: operator.${operator}`)
  }
  // Обработчик — одной строкой на запись, а не на каждое пустое поле.
  for (const index of new Set(missing.map((f) => f.match(/^processors\[(\d+)\]/)?.[1]).filter(Boolean))) {
    add('critical', 'Не заполнен обработчик данных по поручению: название, ОГРН и ИНН, адрес (хостинг, почтовый сервис)', `${COMPANY_FILE}: processors[${index}]`)
  }
  for (const [channel, url] of Object.entries(site.messengers)) {
    if (url && isPlaceholderLink(url)) add('important', `Ссылка на ${CHANNELS[channel] ?? channel} — заглушка: кнопка не ведёт в чат компании`, `${COMPANY_FILE}: messengers.${channel}`)
  }

  // Переменные окружения (Vercel → Settings → Environment Variables, локально — .env.local).
  if (!env.LEAD_TOKEN_SECRET?.trim()) add('critical', 'Не задан ключ защиты формы: заявки не принимаются', 'LEAD_TOKEN_SECRET (pnpm env:init)')
  if (!env.SMETA_SIGNING_SECRET?.trim()) add('important', 'Не задан ключ ссылок на PDF-смету: после заявки не будет кнопки «Скачать смету»', 'SMETA_SIGNING_SECRET (pnpm env:init)')
  if (!env.RATE_LIMIT_SALT?.trim()) add('important', 'Не задана соль для лимита заявок с одного IP', 'RATE_LIMIT_SALT (pnpm env:init)')

  // Файл на сервере менеджер не видит, а на Vercel он не работает: нужен канал, который доставит заявку человеку.
  if (!emailConfig(env) && !env.B24_WEBHOOK_URL?.trim() && !env.ONEC_LEADS_URL?.trim()) {
    add(
      'critical',
      'Заявки не доходят до менеджера: не подключены ни почта, ни Битрикс24, ни 1С (на Vercel посетитель увидит «Не удалось отправить»)',
      'почта: SMTP_HOST, SMTP_USER, SMTP_PASS, LEADS_EMAIL_TO; или Битрикс24: B24_WEBHOOK_URL (docs/INTEGRATIONS.md)',
    )
  }
  const siteUrl = env.NEXT_PUBLIC_SITE_URL?.trim() ?? ''
  if (!siteUrl || /example\.|localhost/.test(siteUrl)) {
    add('important', 'Не задан адрес сайта: canonical и карта сайта возьмут домен Vercel (*.vercel.app)', 'NEXT_PUBLIC_SITE_URL, например https://arcline.ru')
  }
  return items
}
