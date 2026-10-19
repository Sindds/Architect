import nodemailer, { type Transporter } from 'nodemailer'
import { SITE } from '@/content/site'
import { type LeadRecord, leadSummary } from './record'

type Env = Record<string, string | undefined>

export interface EmailConfig {
  host: string
  port: number
  /** TLS сразу (порт 465) или STARTTLS (порт 587). */
  secure: boolean
  user: string
  pass: string
  from: string
  to: string[]
}

/**
 * Почта менеджеров: SMTP_HOST, SMTP_USER, SMTP_PASS и LEADS_EMAIL_TO (через запятую). Пусто — канал выключен.
 * Для 152-ФЗ (ч. 5 ст. 18) берите почтовый сервис с серверами в России: Яндекс 360, VK WorkSpace, Mail.ru.
 */
export function emailConfig(env: Env = process.env): EmailConfig | null {
  const host = env.SMTP_HOST?.trim()
  const user = env.SMTP_USER?.trim()
  const pass = env.SMTP_PASS
  const to = (env.LEADS_EMAIL_TO ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (!host || !user || !pass || !to.length) return null
  const port = Number(env.SMTP_PORT || 465)
  return { host, port, secure: env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465, user, pass, from: env.SMTP_FROM?.trim() || user, to }
}

export function emailTransport(config: EmailConfig): Transporter {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10_000,
  })
}

/** Письмо менеджеру: в теме номер, имя и телефон, в тексте — всё, что человек выбрал на сайте. */
export function leadEmail(lead: LeadRecord, config: Pick<EmailConfig, 'from' | 'to'>) {
  const utm = Object.entries(lead.utm)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ')
  const details = [leadSummary(lead), utm && `Рекламные метки: ${utm}`, `Получена: ${lead.createdAt}`].filter(Boolean).join('\n')
  const text = `Имя: ${lead.name}\nТелефон: ${lead.phone}\n\n${details}`
  return {
    from: `${SITE.brandFull} <${config.from}>`,
    to: config.to,
    // Перевод строки в имени не должен попасть в заголовок письма.
    subject: `Заявка №${lead.id} с сайта: ${lead.name.replace(/\s+/g, ' ')}, ${lead.phone}`,
    text,
  }
}

export async function sendLeadEmail(lead: LeadRecord, config: EmailConfig, transport: Transporter = emailTransport(config)): Promise<{ ref: string }> {
  const info = await transport.sendMail(leadEmail(lead, config))
  return { ref: String(info.messageId ?? lead.id) }
}
