'use server'

import { randomInt } from 'node:crypto'
import { headers } from 'next/headers'
import { after } from 'next/server'
import { FORM_ERRORS } from '@/content/texts'
import { clientIp } from '@/lib/client-ip'
import { type LeadState, SEND_FAILED, validateLead } from '@/lib/lead-schema'
import { checkLeadToken, leadTokenSecret, signLeadToken } from '@/lib/lead-token'
import { configuredSinks, deliverLead } from '@/lib/leads/deliver'
import { toLeadRecord } from '@/lib/leads/record'
import { leadNotificationText, notifyTelegram } from '@/lib/notify'
import { allowRequest, hashIp } from '@/lib/rate-limit'
import { signSmetaToken, smetaInputSchema, smetaSecret } from '@/lib/smeta-token'

const secret = () => leadTokenSecret(process.env)

/**
 * Номер заявки для клиента и менеджера: 7 цифр, 9 млн вариантов (совпадение двух номеров вероятно
 * только после нескольких тысяч заявок). Уникальный ключ для 1С и дублей — uid в записи заявки.
 * Ловушка для ботов отвечает номером того же вида, чтобы бот не отличил отказ от приёма.
 */
const newLeadId = () => randomInt(1_000_000, 10_000_000)

/** Ссылка на PDF-смету после заявки с параметрами дома (PLAN P5.4). Без SMETA_SIGNING_SECRET ссылки нет. */
function smetaLink(id: number, raw: string | undefined): string | undefined {
  if (!raw) return undefined
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return undefined
  }
  const input = smetaInputSchema.safeParse(data)
  if (!input.success) return undefined
  const key = smetaSecret(process.env)
  if (!key) {
    console.error('[lead] Не задан SMETA_SIGNING_SECRET: ссылка на PDF-смету не выдаётся')
    return undefined
  }
  return `/smeta/${signSmetaToken(id, input.data, Date.now(), key)}`
}

/** Метка «начали заполнять форму сейчас», подписанная сервером. Форма запрашивает её при первом фокусе. */
export async function issueLeadToken(): Promise<string> {
  return signLeadToken(Date.now(), secret())
}

export async function submitLead(_prev: LeadState, form: FormData): Promise<LeadState> {
  const checked = validateLead(form)
  // Бот заполнил поле-ловушку: отвечаем успехом и ничего не сохраняем.
  if (checked.status === 'bot') {
    // Если сюда попадёт человек (автозаполнение браузера), заявка пропадёт молча — поэтому пишем в журнал.
    console.warn('[lead] Сработала ловушка для ботов: заявка не сохранена')
    return { status: 'ok', id: newLeadId() }
  }
  if (checked.status !== 'valid') return checked

  // Время заполнения считает сервер: время из браузера бот подделает.
  const key = secret()
  const token = checkLeadToken(checked.data.token, Date.now(), key)
  if (token === 'too_fast') return { status: 'error', message: FORM_ERRORS.tooFast }
  if (token === 'expired') return { status: 'error', message: FORM_ERRORS.expired }
  if (token === 'invalid') {
    if (!key) {
      console.error('[lead] Не задан LEAD_TOKEN_SECRET: заявки не принимаются')
      after(() => notifyTelegram('Заявки с сайта не принимаются: не задан LEAD_TOKEN_SECRET. Клиентам показан телефон.'))
    }
    return { status: 'error', message: SEND_FAILED }
  }

  if (!allowRequest(hashIp(clientIp(await headers())))) {
    return { status: 'error', message: FORM_ERRORS.tooMany }
  }

  const id = newLeadId()
  const { source, variant } = checked.data

  // Файл на сервере, почта, Битрикс24 и 1С — те, что заданы в переменных окружения (docs/INTEGRATIONS.md).
  let delivered: Awaited<ReturnType<typeof deliverLead>>
  try {
    delivered = await deliverLead(toLeadRecord(id, checked.data), configuredSinks())
  } catch (error) {
    console.error('[lead] Ошибка настройки хранилищ заявок', error)
    return { status: 'error', message: SEND_FAILED }
  }
  for (const r of delivered.results) if (!r.ok) console.error(`[lead] №${id} не принята: ${r.sink}`, r.error)
  if (!delivered.results.length) console.error('[lead] Не задано ни одного хранилища заявок')

  // Уведомление уходит после ответа посетителю: медленный Telegram не задерживает форму.
  after(() => notifyTelegram(leadNotificationText(id, source, variant, delivered.results)))
  return delivered.ok ? { status: 'ok', id, smeta: smetaLink(id, checked.data.estimateInput) } : { status: 'error', message: SEND_FAILED }
}
