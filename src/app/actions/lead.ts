'use server'

import { randomInt } from 'node:crypto'
import { headers } from 'next/headers'
import { after } from 'next/server'
import { SITE } from '@/content/site'
import { type LeadState, SEND_FAILED, validateLead } from '@/lib/lead-schema'
import { configuredSinks, deliverLead } from '@/lib/leads/deliver'
import { toLeadRecord } from '@/lib/leads/record'
import { leadNotificationText, notifyTelegram } from '@/lib/notify'
import { allowRequest, hashIp } from '@/lib/rate-limit'

export async function submitLead(_prev: LeadState, form: FormData): Promise<LeadState> {
  const checked = validateLead(form)
  // Бот заполнил поле-ловушку: отвечаем успехом и ничего не сохраняем.
  if (checked.status === 'bot') return { status: 'ok', id: randomInt(10_000, 99_999) }
  if (checked.status !== 'valid') return checked

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  if (!allowRequest(hashIp(ip))) {
    return { status: 'error', message: 'Слишком много заявок подряд. Позвоните нам:' }
  }

  const id = randomInt(10_000, 99_999)
  const { source, variant } = checked.data

  // Режим concept: компания вымышлена, персональные данные не сохраняются и никуда не передаются.
  if (SITE.contentMode === 'concept') {
    after(() => notifyTelegram(leadNotificationText(id, source, variant)))
    return { status: 'ok', id }
  }

  // Режим client: файл на сервере, Битрикс24 и 1С — те, что заданы в переменных окружения (docs/INTEGRATIONS.md).
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
  return delivered.ok ? { status: 'ok', id } : { status: 'error', message: SEND_FAILED }
}
