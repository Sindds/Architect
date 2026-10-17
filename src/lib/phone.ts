/** Российский номер → E.164 (+7XXXXXXXXXX) или null. Принимает 8…, +7…, 7… и 10 цифр. */
export function normalizeRuPhone(input: string): string | null {
  let digits = input.replace(/\D/g, '')
  if (digits.length === 11 && (digits.startsWith('8') || digits.startsWith('7'))) digits = digits.slice(1)
  if (digits.length !== 10) return null
  // Коды российских номеров начинаются с 3, 4, 8 или 9.
  if (!/^[3489]/.test(digits)) return null
  return `+7${digits}`
}

/**
 * Почему номер не подходит — текст под полем формы; null — номер верный.
 * Код после +7 с цифры 6 или 7 — Казахстан (соглашение России и Казахстана 2024 года), 0, 1, 2 и 5 сейчас не выдаются.
 */
export function phoneProblem(input: string): string | null {
  if (normalizeRuPhone(input)) return null
  let digits = input.replace(/\D/g, '')
  if (!digits) return 'Укажите телефон'
  if (digits.length === 11 && /^[78]/.test(digits)) digits = digits.slice(1)
  if (digits.length < 10) return 'Номер неполный: нужно 10 цифр после +7'
  if (digits.length > 10) return 'Лишние цифры: после +7 нужно ровно 10'
  return `Код ${digits.slice(0, 3)} не российский. Номера в России начинаются после +7 с цифры 3, 4, 8 или 9`
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
