import { CONTACT_METHODS } from '@/lib/lead-schema'
import { SOURCE_LABELS, leadSummary, type LeadRecord } from './record'

type Env = Record<string, string | undefined>

export interface OneCConfig {
  /** HTTP-сервис 1С, принимающий заявки: https://сервер/база/hs/leads/v1/leads (контракт — docs/INTEGRATIONS.md). */
  url: string
  user?: string
  password?: string
}

/** Настройки из серверных переменных. Нет ONEC_LEADS_URL — интеграция выключена. */
export function oneCConfig(env: Env = process.env): OneCConfig | null {
  const url = env.ONEC_LEADS_URL?.trim()
  if (!url) return null
  if (new URL(url).protocol !== 'https:') throw new Error('ONEC_LEADS_URL: нужен адрес https')
  return { url, user: env.ONEC_USER || undefined, password: env.ONEC_PASSWORD || undefined }
}

/**
 * Заявка в 1С: POST JSON в HTTP-сервис базы. Универсального API заявок у 1С нет,
 * поэтому обработчик на стороне 1С пишет программист по контракту из docs/INTEGRATIONS.md.
 * Повтор с тем же Idempotency-Key (uid) не должен создавать вторую заявку.
 */
export async function sendToOneC(lead: LeadRecord, config: OneCConfig, fetchImpl: typeof fetch = fetch): Promise<{ ref: string }> {
  const headers: Record<string, string> = { 'content-type': 'application/json; charset=utf-8', 'idempotency-key': lead.uid }
  if (config.user) headers.authorization = `Basic ${Buffer.from(`${config.user}:${config.password ?? ''}`).toString('base64')}`

  const res = await fetchImpl(config.url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      uid: lead.uid,
      number: lead.id,
      createdAt: lead.createdAt,
      name: lead.name,
      phone: lead.phone,
      contactMethod: lead.contactMethod,
      contactMethodLabel: CONTACT_METHODS[lead.contactMethod],
      comment: lead.comment ?? null,
      source: lead.source,
      sourceLabel: SOURCE_LABELS[lead.source],
      variant: lead.variant ?? null,
      context: lead.context ?? null,
      estimate: lead.estimate ?? null,
      quiz: lead.quiz ?? null,
      utm: lead.utm,
      consentVersion: lead.consentVersion,
      summary: leadSummary(lead),
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`1С: ответ ${res.status}`)
  const data = (await res.json().catch(() => null)) as { id?: unknown } | null
  const ref = typeof data?.id === 'string' || typeof data?.id === 'number' ? String(data.id).slice(0, 40) : String(lead.id)
  return { ref }
}
