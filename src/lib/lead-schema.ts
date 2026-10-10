import { z } from 'zod'
import { normalizeRuPhone } from './phone'

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

export const CONTACT_METHODS = { call: 'Звонок', telegram: 'Telegram', whatsapp: 'WhatsApp', max: 'MAX' } as const

/** Минимальное время заполнения формы: быстрее заполняют только боты. */
export const MIN_FILL_MS = 3000

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Укажите имя — не короче 2 символов').max(60, 'Имя — не длиннее 60 символов'),
  phone: z
    .string()
    .refine((v) => normalizeRuPhone(v) !== null, 'Проверьте номер: нужен российский, 10 цифр после +7')
    .transform((v) => normalizeRuPhone(v) as string),
  consent: z.literal('on', { message: 'Без согласия на обработку данных отправить заявку нельзя' }),
  contactMethod: z.enum(Object.keys(CONTACT_METHODS) as [keyof typeof CONTACT_METHODS]).default('call'),
  comment: z.string().trim().max(1000, 'Комментарий — не длиннее 1000 символов').optional(),
  source: z.enum(LEAD_SOURCES),
  context: z.string().max(200).optional(),
  variant: z.string().max(20).optional(),
  estimate: z.string().max(600).optional(),
  quiz: z.string().max(1000).optional(),
  utm: z.string().max(600).optional(),
  startedAt: z.coerce.number().int().positive(),
})

export type LeadInput = z.infer<typeof leadSchema>

export type LeadState =
  | { status: 'idle' }
  | { status: 'ok'; id: number }
  | { status: 'error'; message: string; fieldErrors?: Partial<Record<'name' | 'phone' | 'consent' | 'comment', string>> }

/** Заявка не дошла до сервера или сервер не смог её сохранить. Форма добавляет ссылку на телефон после двоеточия. */
export const SEND_FAILED = 'Не удалось отправить. Позвоните:'

/** Поле-ловушка для ботов: человек его не видит и не заполняет. */
export const HONEYPOT_FIELD = 'company'

export function readLeadForm(form: FormData) {
  const get = (k: string) => {
    const v = form.get(k)
    return typeof v === 'string' && v !== '' ? v : undefined
  }
  return {
    name: get('name') ?? '',
    phone: get('phone') ?? '',
    consent: get('consent'),
    contactMethod: get('contactMethod'),
    comment: get('comment'),
    source: get('source'),
    context: get('context'),
    variant: get('variant'),
    estimate: get('estimate'),
    quiz: get('quiz'),
    utm: get('utm'),
    startedAt: get('startedAt'),
  }
}

export function validateLead(form: FormData, now = Date.now()): LeadState | { status: 'valid'; data: LeadInput } | { status: 'bot' } {
  if (get(form, HONEYPOT_FIELD)) return { status: 'bot' }
  const parsed = leadSchema.safeParse(readLeadForm(form))
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? '')
      if (['name', 'phone', 'consent', 'comment'].includes(key) && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { status: 'error', message: 'Проверьте поля формы.', fieldErrors }
  }
  if (now - parsed.data.startedAt < MIN_FILL_MS) {
    return { status: 'error', message: 'Форма отправлена слишком быстро. Подождите пару секунд и отправьте ещё раз.' }
  }
  return { status: 'valid', data: parsed.data }
}

function get(form: FormData, key: string) {
  const v = form.get(key)
  return typeof v === 'string' && v.trim() !== '' ? v : undefined
}
