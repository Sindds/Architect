import { appendFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { bitrix24Config, sendToBitrix24 } from './bitrix24'
import { oneCConfig, sendToOneC } from './onec'
import type { LeadRecord } from './record'

type Env = Record<string, string | undefined>

export type SinkName = 'file' | 'bitrix24' | 'onec'

export const SINK_LABELS: Record<SinkName, string> = { file: 'файл на сервере', bitrix24: 'Битрикс24', onec: '1С' }

/** Хранилище заявки: ref — номер в нём, url — ссылка на карточку (без персональных данных). */
export interface Sink {
  name: SinkName
  send(lead: LeadRecord): Promise<{ ref?: string; url?: string }>
}

export type SinkResult = { sink: SinkName; ok: true; ref?: string; url?: string } | { sink: SinkName; ok: false; error: string }

/** Файл .data/leads.ndjson: резерв на сервере в РФ (152-ФЗ, ч. 5 ст. 18). На Vercel файловая система только для чтения. */
const fileSink: Sink = {
  name: 'file',
  async send(lead) {
    const dir = path.join(process.cwd(), '.data')
    await mkdir(dir, { recursive: true })
    await appendFile(path.join(dir, 'leads.ndjson'), `${JSON.stringify(lead)}\n`, 'utf8')
    return { ref: String(lead.id) }
  },
}

/** Хранилища из серверных переменных: файл (LEADS_FILE=off выключает), Битрикс24 и 1С — если заданы адреса. */
export function configuredSinks(env: Env = process.env, fetchImpl: typeof fetch = fetch): Sink[] {
  const sinks: Sink[] = []
  if (env.LEADS_FILE !== 'off') sinks.push(fileSink)
  const b24 = bitrix24Config(env)
  if (b24) sinks.push({ name: 'bitrix24', send: (lead) => sendToBitrix24(lead, b24, fetchImpl) })
  const onec = oneCConfig(env)
  if (onec) sinks.push({ name: 'onec', send: (lead) => sendToOneC(lead, onec, fetchImpl) })
  return sinks
}

/** Отправка во все хранилища параллельно. Заявка принята, если её сохранило хотя бы одно. */
export async function deliverLead(lead: LeadRecord, sinks: Sink[]): Promise<{ ok: boolean; results: SinkResult[] }> {
  const settled = await Promise.allSettled(sinks.map((s) => s.send(lead)))
  const results = settled.map((r, i): SinkResult => {
    const sink = (sinks[i] as Sink).name
    if (r.status === 'fulfilled') return { sink, ok: true, ...r.value }
    return { sink, ok: false, error: r.reason instanceof Error ? r.reason.message : String(r.reason) }
  })
  return { ok: results.some((r) => r.ok), results }
}
