import { beforeEach, describe, expect, it } from 'vitest'
import { HONEYPOT_FIELD, validateLead } from '@/lib/lead-schema'
import { leadNotificationText } from '@/lib/notify'
import { maskRuPhone, maskRuPhoneEdit, normalizeRuPhone, phoneProblem } from '@/lib/phone'
import { allowRequest, resetRateLimit } from '@/lib/rate-limit'

const NOW = 1_800_000_000_000

function form(overrides: Record<string, string | undefined> = {}) {
  const base: Record<string, string | undefined> = {
    name: 'Анна',
    phone: '+7 (916) 123-45-67',
    consent: 'on',
    source: 'hero',
    token: 'метка',
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

  it('ошибка называет настоящую причину: неполный номер или нероссийский код', () => {
    expect(phoneProblem('+7 (916) 123-45')).toBe('Номер неполный: нужно 10 цифр после +7')
    expect(phoneProblem('')).toBe('Укажите телефон')
    // +7 6xx и +7 7xx — коды Казахстана, у российских номеров после +7 идёт 3, 4, 8 или 9.
    expect(phoneProblem('+7 (654) 485-25-55')).toBe('Код 654 не российский. Номера в России начинаются после +7 с цифры 3, 4, 8 или 9')
    expect(phoneProblem('+7 (916) 123-45-67')).toBeNull()
  })

  it('маска', () => {
    expect(maskRuPhone('89161234567')).toBe('+7 (916) 123-45-67')
    expect(maskRuPhone('+79161234567')).toBe('+7 (916) 123-45-67')
    expect(maskRuPhone('9161234567')).toBe('+7 (916) 123-45-67')
    // Разделитель появляется вместе со следующей цифрой: иначе его нельзя стереть.
    expect(maskRuPhone('916')).toBe('+7 (916')
    expect(maskRuPhone('9161')).toBe('+7 (916) 1')
    expect(maskRuPhone('')).toBe('')
  })
})

/** Ввод в поле, как в браузере: строка, курсор (|) и действие. */
function edit(withCaret: string, action: { type: string } | 'backspace') {
  const at = withCaret.indexOf('|')
  const value = withCaret.replace('|', '')
  const next =
    action === 'backspace'
      ? { value: value.slice(0, at - 1) + value.slice(at), caret: at - 1 }
      : { value: value.slice(0, at) + action.type + value.slice(at), caret: at + action.type.length }
  const masked = maskRuPhoneEdit(next.value, next.caret, value)
  return `${masked.value.slice(0, masked.caret)}|${masked.value.slice(masked.caret)}`
}

function typeAll(chars: string) {
  let state = '|'
  for (const ch of chars) state = edit(state, { type: ch })
  return state
}

describe('маска телефона при наборе', () => {
  it('цифра по одной: курсор всегда в конце', () => {
    expect(typeAll('9161234567')).toBe('+7 (916) 123-45-67|')
  })

  it('первая 8 или 7 — код страны, после неё можно набрать код на 8 (Санкт-Петербург 812)', () => {
    expect(typeAll('8')).toBe('+7 (|')
    expect(typeAll('88121234567')).toBe('+7 (812) 123-45-67|')
    expect(typeAll('78121234567')).toBe('+7 (812) 123-45-67|')
    expect(typeAll('+78121234567')).toBe('+7 (812) 123-45-67|')
  })

  it('исправление цифры в середине: курсор остаётся на месте', () => {
    const afterDelete = edit('+7 (916|) 123-45-67', 'backspace')
    expect(afterDelete).toBe('+7 (91|1) 234-56-7')
    expect(edit(afterDelete, { type: '5' })).toBe('+7 (915|) 123-45-67')
  })

  it('стирание с конца проходит через скобку и пробел до пустого поля', () => {
    let state = '+7 (916) 1|'
    const seen: string[] = []
    for (let i = 0; i < 5; i++) {
      state = edit(state, 'backspace')
      seen.push(state)
    }
    expect(seen).toEqual(['+7 (916|', '+7 (91|', '+7 (9|', '+7 (|', '|'])
  })

  it('стирание дефиса сдвигает курсор к цифре перед ним', () => {
    expect(edit('+7 (916) 123-|45-67', 'backspace')).toBe('+7 (916) 123|-45-67')
  })
})

describe('полный номер: лишние цифры не принимаются', () => {
  it('цифра в конце, в начале или в середине полного номера ничего не меняет, курсор на месте', () => {
    expect(edit('+7 (916) 123-45-67|', { type: '8' })).toBe('+7 (916) 123-45-67|')
    expect(edit('+7 (|916) 123-45-67', { type: '5' })).toBe('+7 (|916) 123-45-67')
    expect(edit('+7 (916) 12|3-45-67', { type: '0' })).toBe('+7 (916) 12|3-45-67')
  })

  it('после стирания цифры можно набрать новую', () => {
    const erased = edit('+7 (916) 123-45-67|', 'backspace')
    expect(erased).toBe('+7 (916) 123-45-6|')
    expect(edit(erased, { type: '9' })).toBe('+7 (916) 123-45-69|')
  })

  it('автозаполнение или вставка другого номера целиком заменяет полный номер', () => {
    expect(maskRuPhoneEdit('+79031112233', 12, '+7 (916) 123-45-67').value).toBe('+7 (903) 111-22-33')
    expect(maskRuPhoneEdit('8 903 111-22-33', 15, '+7 (916) 123-45-67').value).toBe('+7 (903) 111-22-33')
  })
})

describe('заявка', () => {
  it('валидная заявка проходит, телефон приводится к E.164', () => {
    const r = validateLead(form())
    expect(r.status).toBe('valid')
    if (r.status === 'valid') expect(r.data.phone).toBe('+79161234567')
  })

  it('без согласия — ошибка у поля consent', () => {
    const r = validateLead(form({ consent: undefined }))
    expect(r.status).toBe('error')
    if (r.status === 'error') expect(r.fieldErrors?.consent).toMatch(/согласия/)
  })

  it('невалидный телефон — ошибка у поля phone', () => {
    const r = validateLead(form({ phone: '12345' }))
    if (r.status !== 'error') throw new Error('ожидалась ошибка')
    expect(r.fieldErrors?.phone).toBeTruthy()
  })

  it('заполненная ловушка — бот', () => {
    expect(validateLead(form({ [HONEYPOT_FIELD]: 'ООО Ромашка' })).status).toBe('bot')
  })

  it('неизвестный источник отклоняется', () => {
    expect(validateLead(form({ source: 'spam' })).status).toBe('error')
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
