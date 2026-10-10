import { SOURCE_LABELS, leadSummary, type LeadRecord } from './record'

type Env = Record<string, string | undefined>

export interface Bitrix24Config {
  /** Входящий вебхук с правом crm: https://портал.bitrix24.ru/rest/{пользователь}/{ключ}/ */
  webhook: string
  /** lead — классический режим CRM; deal — простой режим, без лидов: контакт и сделка. */
  entity: 'lead' | 'deal'
  assignedById?: number
  sourceId: string
}

/** Настройки из серверных переменных. Нет B24_WEBHOOK_URL — интеграция выключена. */
export function bitrix24Config(env: Env = process.env): Bitrix24Config | null {
  const raw = env.B24_WEBHOOK_URL?.trim()
  if (!raw) return null
  const url = new URL(raw)
  if (url.protocol !== 'https:') throw new Error('B24_WEBHOOK_URL: нужен адрес https')
  const assigned = Number(env.B24_ASSIGNED_BY_ID)
  return {
    webhook: raw.endsWith('/') ? raw : `${raw}/`,
    entity: env.B24_ENTITY === 'deal' ? 'deal' : 'lead',
    assignedById: Number.isInteger(assigned) && assigned > 0 ? assigned : undefined,
    sourceId: env.B24_SOURCE_ID?.trim() || 'WEB',
  }
}

// Типы объектов CRM для crm.item.*: лид 1, сделка 2, контакт 3 (apidocs.bitrix24.ru, crm.item.add).
const LEAD = 1
const DEAL = 2
const CONTACT = 3

async function call(config: Bitrix24Config, method: string, params: unknown, fetchImpl: typeof fetch): Promise<unknown> {
  const res = await fetchImpl(`${config.webhook}${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(params),
    signal: AbortSignal.timeout(8000),
  })
  const data = (await res.json().catch(() => null)) as { result?: unknown; error?: string; error_description?: string } | null
  if (!res.ok || !data || data.error) {
    throw new Error(`Битрикс24 ${method}: ${res.status} ${data?.error ?? ''} ${data?.error_description ?? ''}`.trim())
  }
  return data.result
}

async function addItem(config: Bitrix24Config, entityTypeId: number, fields: Record<string, unknown>, fetchImpl: typeof fetch): Promise<number> {
  const result = (await call(config, 'crm.item.add', { entityTypeId, fields }, fetchImpl)) as { item?: { id?: number } } | undefined
  const id = result?.item?.id
  if (typeof id !== 'number') throw new Error('Битрикс24 crm.item.add: в ответе нет item.id')
  return id
}

/**
 * Заявка в Битрикс24 через crm.item.add: crm.lead.add в документации помечен устаревшим.
 * Возвращает номер в CRM и ссылку на карточку: она уходит в Telegram вместо имени и телефона.
 */
export async function sendToBitrix24(lead: LeadRecord, config: Bitrix24Config, fetchImpl: typeof fetch = fetch): Promise<{ ref: string; url: string }> {
  const phone = [{ typeId: 'PHONE', valueType: 'WORK', value: lead.phone }]
  const owner = config.assignedById ? { assignedById: config.assignedById } : {}
  const common = {
    title: `Заявка №${lead.id} с сайта`,
    sourceId: config.sourceId,
    sourceDescription: `Сайт: ${SOURCE_LABELS[lead.source]}`,
    comments: leadSummary(lead),
    opened: 'Y',
    utmSource: lead.utm.utm_source,
    utmMedium: lead.utm.utm_medium,
    utmCampaign: lead.utm.utm_campaign,
    utmContent: lead.utm.utm_content,
    utmTerm: lead.utm.utm_term,
    ...owner,
  }
  const origin = new URL(config.webhook).origin

  if (config.entity === 'lead') {
    const id = await addItem(config, LEAD, { ...common, name: lead.name, fm: phone }, fetchImpl)
    return { ref: String(id), url: `${origin}/crm/lead/details/${id}/` }
  }

  // Простой режим: у сделки нет своих телефонов, они у контакта.
  const contactId = await addItem(config, CONTACT, { name: lead.name, fm: phone, sourceId: config.sourceId, opened: 'Y', ...owner }, fetchImpl)
  const id = await addItem(config, DEAL, { ...common, contactIds: [contactId] }, fetchImpl)
  return { ref: String(id), url: `${origin}/crm/deal/details/${id}/` }
}
