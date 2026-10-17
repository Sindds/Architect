// Форматирование чисел вручную, без Intl: одинаковый результат на сервере и в браузере.
const NBSP = ' '

export function groupDigits(n: number): string {
  const sign = n < 0 ? '−' : ''
  const digits = String(Math.abs(Math.round(n)))
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
}

export const formatRub = (n: number) => `${groupDigits(n)}${NBSP}₽`

const mln = (value: string) => `${value}${NBSP}млн${NBSP}₽`
const mlnRounded = (n: number) => (Math.round(n / 100_000) / 10).toFixed(1).replace('.', ',').replace(/,0$/, '')
/** Без округления вверх, с точностью до 10 000 ₽: 8 360 000 → «8,36», 8 800 000 → «8,8», 21 000 000 → «21». */
const mlnFloor = (n: number) => (Math.floor(n / 10_000) / 100).toFixed(2).replace('.', ',').replace(/,?0+$/, '')

/** 51 610 000 → «51,6 млн ₽»; 63 000 000 → «63 млн ₽». */
export const formatMln = (n: number) => mln(mlnRounded(n))

/**
 * Нижняя цена «от …»: не округляется вверх. Иначе «от 8,4 млн ₽» в заголовке оказалось бы больше
 * цены 8 360 000 ₽, которую показывает калькулятор (CONTENT-SPEC §4: ниже на странице нет цены меньше заголовка).
 */
export const formatMlnFrom = (n: number) => mln(mlnFloor(n))

/** Вилка: «от 8,36 до 52,5 млн ₽». */
export const formatMlnRange = (low: number, high: number) => `от ${mlnFloor(low)} до ${mln(mlnRounded(high))}`

export function plural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}

export const formatDays = (n: number) => `${n}${NBSP}${plural(n, ['день', 'дня', 'дней'])}`

/** Срок после предлога «от»: родительный падеж — «от 254 дней», «от 121 дня». */
export function formatDaysFrom(n: number): string {
  const word = n % 10 === 1 && n % 100 !== 11 ? 'дня' : 'дней'
  return `от ${n}${NBSP}${word}`
}

