// Константы и типы заявки без zod: их импортирует форма в браузере (zod остаётся только на сервере).

import { FORM_ERRORS } from '@/content/texts'

export const LEAD_SOURCES = [
  'messenger',
  'project_modal',
  'pricing_pdf',
  'calculator',
  'quiz',
  'final_cta',
  'architect',
] as const

export type LeadSource = (typeof LEAD_SOURCES)[number]

export const CONTACT_METHODS = { call: 'Звонок', telegram: 'Telegram', whatsapp: 'WhatsApp', max: 'MAX', vk: 'ВКонтакте' } as const

export type LeadState =
  | { status: 'idle' }
  | { status: 'ok'; id: number; smeta?: string }
  | { status: 'error'; message: string; fieldErrors?: Partial<Record<'name' | 'phone' | 'consent' | 'comment', string>> }

/** Заявка не дошла до сервера или сервер не смог её сохранить. Форма добавляет ссылку на телефон после двоеточия. */
export const SEND_FAILED = FORM_ERRORS.sendFailed

/**
 * Поле-ловушка для ботов: человек его не видит и не заполняет. Имя и подпись ни на что не похожи
 * (не «компания», не «адрес»), иначе автозаполнение браузера впишет туда данные и заявка пропадёт.
 */
export const HONEYPOT_FIELD = 'arc_trap_field'

/** Рекламные метки: форма запоминает их на сессию и отправляет с заявкой, robots.txt убирает их через Clean-param. */
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid', 'gclid'] as const
export type UtmKey = (typeof UTM_KEYS)[number]

/** Длины полей — одни и те же в форме (maxLength) и в проверке на сервере. */
export const LEAD_LIMITS = { name: 60, comment: 1000, utmValue: 200 } as const

