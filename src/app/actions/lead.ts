'use server'

import { randomInt } from 'node:crypto'
import { appendFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { headers } from 'next/headers'
import { SITE } from '@/content/site'
import { type LeadInput, type LeadState, SEND_FAILED, validateLead } from '@/lib/lead-schema'
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
  try {
    await persistLead(id, checked.data)
  } catch (error) {
    console.error('[lead] Не удалось сохранить заявку', error)
    return { status: 'error', message: SEND_FAILED }
  }
  await notifyTelegram(leadNotificationText(id, checked.data.source, checked.data.variant))
  return { status: 'ok', id }
}

/**
 * Режим concept: компания вымышлена, персональные данные не сохраняются.
 * Режим client: заявка пишется на сервер (.data/leads.ndjson); сервер и БД — в РФ (152-ФЗ, ч. 5 ст. 18).
 */
async function persistLead(id: number, lead: LeadInput) {
  if (SITE.contentMode === 'concept') return
  const dir = path.join(process.cwd(), '.data')
  await mkdir(dir, { recursive: true })
  const record = { id, createdAt: new Date().toISOString(), consentVersion: SITE.legalVersion.version, ...lead }
  await appendFile(path.join(dir, 'leads.ndjson'), `${JSON.stringify(record)}\n`, 'utf8')
}
