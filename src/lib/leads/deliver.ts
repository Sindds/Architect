import { appendFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { bitrix24Config, sendToBitrix24 } from './bitrix24'
import { emailConfig, sendLeadEmail } from './email'
import { oneCConfig, sendToOneC } from './onec'
import type { LeadRecord } from './record'

type Env = Record<string, string | undefined>

export type SinkName = 'file' | 'email' | 'bitrix24' | 'onec'

export const SINK_LABELS: Record<SinkName, string> = { file: 'файл на сервере', email: 'почта', bitrix24: 'Битрикс24', onec: '1С' }

/** Хранилище заявки: ref — номер в нём, url — ссылка на карточку (без персональных данных). */
export interface Sink {
  name: SinkName
  send(lead: LeadRecord): Promise<{ ref?: string; url?: string }>
}

export type SinkResult = { sink: SinkName; ok: true; ref?: string; url?: string } | { sink: SinkName; ok: false; error: string }

/** Файл leads.ndjson в LEADS_DIR (по умолчанию .data): резерв на сервере в РФ (152-ФЗ, ч. 5 ст. 18). */
const fileSink = (dir: string): Sink => ({
  name: 'file',
  async send(lead) {
    // Персональные данные: файл читает только владелец процесса (права задаются при создании файла и папки).
    await mkdir(dir, { recursive: true, mode: 0o700 })
    await appendFile(path.join(dir, 'leads.ndjson'), `${JSON.stringify(lead)}\n`, { encoding: 'utf8', mode: 0o600 })
    return { ref: String(lead.id) }
  },
})

/**
 * Хранилища из серверных переменных: файл, почта, Битрикс24 и 1С — те, что настроены.
 * Файл включён по умолчанию, кроме Vercel (там файловая система только для чтения); LEADS_FILE=on|off — явно.
 */
export function configuredSinks(env: Env = process.env, fetchImpl: typeof fetch = fetch): Sink[] {
  const sinks: Sink[] = []
  // Ошибка в настройке одного канала (например, http:// вместо https:// у Битрикс24) не должна выключать остальные:
  // такой канал остаётся в списке и отказывает на каждой заявке, а уведомление в Telegram называет его.
  const add = <C>(name: SinkName, config: () => C | null, send: (lead: LeadRecord, c: C) => Promise<{ ref?: string; url?: string }>) => {
    try {
      const c = config()
      if (c) sinks.push({ name, send: (lead) => send(lead, c) })
    } catch (error) {
      const message = `ошибка настройки: ${error instanceof Error ? error.message : String(error)}`
      sinks.push({ name, send: () => Promise.reject(new Error(message)) })
    }
  }
  const file = env.LEADS_FILE ?? (env.VERCEL ? 'off' : 'on')
  if (file !== 'off') sinks.push(fileSink(env.LEADS_DIR?.trim() || path.join(process.cwd(), '.data')))
  add('email', () => emailConfig(env), (lead, mail) => sendLeadEmail(lead, mail))
  add('bitrix24', () => bitrix24Config(env), (lead, b24) => sendToBitrix24(lead, b24, fetchImpl))
  add('onec', () => oneCConfig(env), (lead, onec) => sendToOneC(lead, onec, fetchImpl))
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
