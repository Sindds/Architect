// Форматирование чисел вручную, без Intl: одинаковый результат на сервере и в браузере.
const NBSP = ' '

export function groupDigits(n: number): string {
  const sign = n < 0 ? '−' : ''
  const digits = String(Math.abs(Math.round(n)))
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
}

export const formatRub = (n: number) => `${groupDigits(n)}${NBSP}₽`

/** 51 610 000 → «51,6 млн ₽»; 63 000 000 → «63 млн ₽». */
export function formatMln(n: number): string {
  const value = (Math.round(n / 100_000) / 10).toFixed(1).replace('.', ',').replace(/,0$/, '')
  return `${value}${NBSP}млн${NBSP}₽`
}

export function plural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}

export const formatDays = (n: number) => `${n}${NBSP}${plural(n, ['день', 'дня', 'дней'])}`

/** Отклонение факта от плана в процентах со знаком: «+2,7%», «0%». */
export function formatDeviation(plan: number, fact: number): string {
  const pct = Math.round(((fact - plan) / plan) * 1000) / 10
  if (pct === 0) return '0%'
  return `${pct > 0 ? '+' : '−'}${String(Math.abs(pct)).replace('.', ',')}%`
}

export function formatDayDelta(plan: number, fact: number): string {
  const d = fact - plan
  if (d === 0) return 'в срок'
  return d < 0 ? `на ${formatDays(-d)} раньше` : `+${formatDays(d)}`
}
