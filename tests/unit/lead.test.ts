import { beforeEach, describe, expect, it } from 'vitest'
import { HONEYPOT_FIELD, MIN_FILL_MS, validateLead } from '@/lib/lead-schema'
import { leadNotificationText } from '@/lib/notify'
import { maskRuPhone, normalizeRuPhone } from '@/lib/phone'
import { allowRequest, resetRateLimit } from '@/lib/rate-limit'

const NOW = 1_800_000_000_000

function form(overrides: Record<string, string | undefined> = {}) {
  const base: Record<string, string | undefined> = {
    name: 'Анна',
    phone: '+7 (916) 123-45-67',
    consent: 'on',
    source: 'hero',
    startedAt: String(NOW - MIN_FILL_MS - 1),
    ...overrides,
  }
  const f = new FormData()
  for (const [k, v] of Object.entries(base)) if (v !== undefined) f.set(k, v)
  return f
}

describe('телефон', () => {
  it.each([
    ['+7 (916) 123-45-67', '+79161234567'],
    ['8 916 123 45 67', '+79161234567'],
    ['9161234567', '+79161234567'],
    ['+7 (495) 000-11-22', '+74950001122'],
  ])('%s → %s', (input, out) => expect(normalizeRuPhone(input)).toBe(out))

  it.each(['123', '+7 (000) 000-00-00', '+1 202 555 0100', ''])('невалидный: %s', (input) => {
    expect(normalizeRuPhone(input)).toBeNull()
  })

  it('маска', () => {
    expect(maskRuPhone('89161234567')).toBe('+7 (916) 123-45-67')
    expect(maskRuPhone('916')).toBe('+7 (916)')
    expect(maskRuPhone('')).toBe('')
  })
})

describe('заявка', () => {
  it('валидная заявка проходит, телефон приводится к E.164', () => {
    const r = validateLead(form(), NOW)
    expect(r.status).toBe('valid')
    if (r.status === 'valid') expect(r.data.phone).toBe('+79161234567')
  })

  it('без согласия — ошибка у поля consent', () => {
    const r = validateLead(form({ consent: undefined }), NOW)
    expect(r.status).toBe('error')
    if (r.status === 'error') expect(r.fieldErrors?.consent).toMatch(/согласия/)
  })

  it('невалидный телефон — ошибка у поля phone', () => {
    const r = validateLead(form({ phone: '12345' }), NOW)
    if (r.status !== 'error') throw new Error('ожидалась ошибка')
    expect(r.fieldErrors?.phone).toBeTruthy()
  })

  it('заполненная ловушка — бот', () => {
    expect(validateLead(form({ [HONEYPOT_FIELD]: 'ООО Ромашка' }), NOW).status).toBe('bot')
  })

  it('слишком быстрое заполнение — ошибка', () => {
    const r = validateLead(form({ startedAt: String(NOW - 500) }), NOW)
    expect(r.status).toBe('error')
  })

  it('неизвестный источник отклоняется', () => {
    expect(validateLead(form({ source: 'spam' }), NOW).status).toBe('error')
  })
})

describe('лимит частоты', () => {
  beforeEach(() => resetRateLimit())
  it('не больше 5 заявок за 10 минут с одного хэша', () => {
    const results = Array.from({ length: 6 }, (_, i) => allowRequest('ip', NOW + i))
    expect(results).toEqual([true, true, true, true, true, false])
    expect(allowRequest('ip', NOW + 10 * 60 * 1000 + 10)).toBe(true)
  })
})

describe('уведомление', () => {
  it('не содержит имени и телефона', () => {
    const text = leadNotificationText(48213, 'quiz', 'monolith')
    expect(text).toContain('№48213')
    expect(text).not.toMatch(/\+?\d[\d\s()-]{9,}/)
    expect(text).not.toContain('Анна')
  })
})
