import { z } from 'zod'
import { CONTACT_METHODS, HONEYPOT_FIELD, LEAD_SOURCES, type LeadState } from './lead-constants'
import { normalizePhone, phoneProblem } from './phone'

export { CONTACT_METHODS, HONEYPOT_FIELD, LEAD_SOURCES, SEND_FAILED, type LeadSource, type LeadState } from './lead-constants'

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Укажите имя — не короче 2 символов').max(60, 'Имя — не длиннее 60 символов'),
  phone: z
    .string()
    .superRefine((v, ctx) => {
      const problem = phoneProblem(v)
      if (problem) ctx.addIssue({ code: 'custom', message: problem })
    })
    .transform((v) => normalizePhone(v) as string),
  consent: z.literal('on', { message: 'Без согласия на обработку данных отправить заявку невозможно' }),
  contactMethod: z.enum(Object.keys(CONTACT_METHODS) as [keyof typeof CONTACT_METHODS]).default('call'),
  comment: z.string().trim().max(1000, 'Комментарий — не длиннее 1000 символов').optional(),
  source: z.enum(LEAD_SOURCES),
  context: z.string().max(200).optional(),
  variant: z.string().max(20).optional(),
  estimate: z.string().max(600).optional(),
  quiz: z.string().max(1000).optional(),
  utm: z.string().max(600).optional(),
  /** Параметры дома для PDF-сметы (JSON), проверяет smetaInputSchema на сервере. */
  estimateInput: z.string().max(400).optional(),
  /** ClientID Яндекс Метрики (для офлайн-конверсий), если счётчик загружен. */
  clientId: z.string().regex(/^\d{1,40}$/).optional(),
  /** Метка времени, подписанная сервером (src/lib/lead-token.ts): её проверяет server action. */
  token: z.string().max(100).optional(),
})

export type LeadInput = z.infer<typeof leadSchema>

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
    estimateInput: get('estimateInput'),
    clientId: get('clientId'),
    token: get('token'),
  }
}

export function validateLead(form: FormData): LeadState | { status: 'valid'; data: LeadInput } | { status: 'bot' } {
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
  return { status: 'valid', data: parsed.data }
}

function get(form: FormData, key: string) {
  const v = form.get(key)
  return typeof v === 'string' && v.trim() !== '' ? v : undefined
}
