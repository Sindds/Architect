import { randomUUID } from 'node:crypto'
import { SITE } from '@/content/site'
import { CONTACT_METHODS, type LeadInput, type LeadSource } from '@/lib/lead-schema'

export const SOURCE_LABELS: Record<LeadSource, string> = {
  header: 'шапка',
  hero: 'первый экран',
  excursion: 'экскурсия на объект',
  messenger: 'мессенджер',
  project_card: 'карточка проекта',
  project_modal: 'окно проекта',
  case_modal: 'окно кейса',
  pricing_pdf: 'смета из блока цен',
  calculator: 'калькулятор',
  quiz: 'квиз',
  final_cta: 'финальная форма',
  architect: 'вопрос архитектору',
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid'] as const
export type UtmKey = (typeof UTM_KEYS)[number]

/** Заявка в том виде, в каком её получают хранилища: файл, Битрикс24, 1С. Только на сервере. */
export interface LeadRecord {
  /** Номер, который видят клиент и менеджер. */
  id: number
  /** Уникальный ключ: по нему 1С отличает повтор от новой заявки. */
  uid: string
  createdAt: string
  consentVersion: string
  name: string
  /** E.164: +7XXXXXXXXXX. */
  phone: string
  contactMethod: keyof typeof CONTACT_METHODS
  comment?: string
  source: LeadSource
  variant?: string
  context?: string
  estimate?: string
  quiz?: string
  utm: Partial<Record<UtmKey, string>>
}

function parseUtm(raw?: string): LeadRecord['utm'] {
  if (!raw) return {}
  try {
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object') return {}
    const out: LeadRecord['utm'] = {}
    for (const key of UTM_KEYS) {
      const value = (data as Record<string, unknown>)[key]
      if (typeof value === 'string' && value) out[key] = value.slice(0, 200)
    }
    return out
  } catch {
    return {}
  }
}

export function toLeadRecord(id: number, input: LeadInput, now = new Date()): LeadRecord {
  return {
    id,
    uid: randomUUID(),
    createdAt: now.toISOString(),
    consentVersion: SITE.legalVersion.version,
    name: input.name,
    phone: input.phone,
    contactMethod: input.contactMethod,
    comment: input.comment,
    source: input.source,
    variant: input.variant,
    context: input.context,
    estimate: input.estimate,
    quiz: input.quiz,
    utm: parseUtm(input.utm),
  }
}

/** Текст для менеджера в карточке CRM: всё, что человек выбрал на сайте, по строкам. */
export function leadSummary(lead: LeadRecord): string {
  const lines = [
    `Заявка №${lead.id} с сайта`,
    `Источник: ${SOURCE_LABELS[lead.source]}${lead.variant ? `, вариант страницы: ${lead.variant}` : ''}`,
    `Как связаться: ${CONTACT_METHODS[lead.contactMethod]}`,
    lead.comment && `Комментарий: ${lead.comment}`,
    lead.context && `Откуда заявка: ${lead.context}`,
    lead.estimate && `Расчёт: ${lead.estimate}`,
    lead.quiz && `Ответы квиза: ${lead.quiz}`,
    `Согласие на обработку данных: версия ${lead.consentVersion}`,
  ]
  return lines.filter(Boolean).join('\n')
}
