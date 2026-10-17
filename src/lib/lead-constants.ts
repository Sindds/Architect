// Константы и типы заявки без zod: их импортирует форма в браузере (zod остаётся только на сервере).

export const LEAD_SOURCES = [
  'header',
  'hero',
  'excursion',
  'messenger',
  'project_card',
  'project_modal',
  'case_modal',
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
export const SEND_FAILED = 'Не удалось отправить. Позвоните:'

/** Поле-ловушка для ботов: человек его не видит и не заполняет. */
export const HONEYPOT_FIELD = 'company'

