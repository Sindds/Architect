import { FORM_ERRORS } from '@/content/texts'

/**
 * Номер +7 → E.164 (+7XXXXXXXXXX) или null. Принимает 8…, +7…, 7… и 10 цифр.
 * Код после +7 любой: Россия и Казахстан (+7 6xx, +7 7xx) — решение 17.10.2026.
 */
/** Номер с кодом другой страны (+375, +44, +971…): его не переделываем в +7, а показываем ошибку. «+8» считаем опечаткой «8». */
const foreignCode = (input: string) => /^\s*\+\s*[0-69]/.test(input)

export function normalizePhone(input: string): string | null {
  if (foreignCode(input)) return null
  let digits = input.replace(/\D/g, '')
  if (digits.length === 11 && (digits.startsWith('8') || digits.startsWith('7'))) digits = digits.slice(1)
  return digits.length === 10 ? `+7${digits}` : null
}

/** Почему номер не подходит — текст под полем формы; null — номер верный. */
export function phoneProblem(input: string): string | null {
  if (normalizePhone(input)) return null
  if (foreignCode(input)) return FORM_ERRORS.phoneForeign
  let digits = input.replace(/\D/g, '')
  if (!digits) return FORM_ERRORS.phoneEmpty
  if (digits.length === 11 && /^[78]/.test(digits)) digits = digits.slice(1)
  if (digits.length < 10) return FORM_ERRORS.phoneShort
  return FORM_ERRORS.phoneLong
}

/** Маска ввода: «+7 (999) 123-45-67». */
export function maskRuPhone(input: string): string {
  return maskRuPhoneEdit(input, input.length).value
}

/**
 * Маска с курсором. Курсор ставится после того же числа цифр номера, что и до форматирования,
 * поэтому правка в середине не уводит его в конец.
 * Первая 7 или 8 — код страны: так можно набрать «8 812…», а коды на 8 не теряются.
 * Разделитель появляется только вместе со следующей цифрой, иначе стёртая скобка вернулась бы сразу.
 * prev — значение поля до правки: в полный номер новые цифры не принимаются, где бы ни стоял курсор,
 * иначе цифра в начале вытесняла бы последнюю и номер сдвигался.
 */
export function maskRuPhoneEdit(input: string, caret: number, prev = ''): { value: string; caret: number } {
  // Чужой код страны оставляем как ввели: превратить +375 29 … в +7 (752) … значит позвонить не тому человеку.
  if (foreignCode(input)) {
    const value = input.replace(/[^\d+\s()-]/g, '').slice(0, 20)
    return { value, caret: Math.min(caret, value.length) }
  }
  const all = input.replace(/\D/g, '')
  const prevDigits = prev.replace(/\D/g, '')
  if (prevDigits.length === 11 && all.length > prevDigits.length) {
    const inserted = input.length - prev.length
    return { value: prev, caret: Math.max(0, Math.min(prev.length, caret - inserted)) }
  }
  const hasCountry = input.trimStart().startsWith('+') || (all.length > 10 && /^[78]/.test(all)) || /^[78]$/.test(input.trim())
  const national = (hasCountry ? all.slice(1) : all).slice(0, 10)

  if (!national) {
    // Набор: «+» остаётся, «7», «8», «+7» дают префикс; «+7 (» — стёрли последнюю цифру. Всё прочее (например, «+7 ») — стёрли префикс.
    const value = input === '+' ? '+' : /^\+?[78]$/.test(input) || input === '+7 (' ? '+7 (' : ''
    return { value, caret: value.length }
  }

  const p = [national.slice(0, 3), national.slice(3, 6), national.slice(6, 8), national.slice(8, 10)]
  let value = `+7 (${p[0]}`
  if (p[1]) value += `) ${p[1]}`
  if (p[2]) value += `-${p[2]}`
  if (p[3]) value += `-${p[3]}`

  const before = input.slice(0, caret).replace(/\D/g, '').length
  const countryBeforeCaret = hasCountry && input.search(/\d/) < caret
  const n = Math.min(before - (countryBeforeCaret ? 1 : 0), national.length)
  if (n <= 0) return { value, caret: 4 }
  let seen = 0
  for (let i = 4; i < value.length; i++) {
    if (/\d/.test(value[i] as string) && ++seen === n) return { value, caret: i + 1 }
  }
  return { value, caret: value.length }
}
