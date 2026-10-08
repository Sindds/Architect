/** Российский номер → E.164 (+7XXXXXXXXXX) или null. Принимает 8…, +7…, 7… и 10 цифр. */
export function normalizeRuPhone(input: string): string | null {
  let digits = input.replace(/\D/g, '')
  if (digits.length === 11 && (digits.startsWith('8') || digits.startsWith('7'))) digits = digits.slice(1)
  if (digits.length !== 10) return null
  // Коды российских номеров начинаются с 3, 4, 8 или 9.
  if (!/^[3489]/.test(digits)) return null
  return `+7${digits}`
}

/** Маска ввода: «+7 (999) 123-45-67». */
export function maskRuPhone(input: string): string {
  let digits = input.replace(/\D/g, '')
  if (digits.startsWith('8') || digits.startsWith('7')) digits = digits.slice(1)
  digits = digits.slice(0, 10)
  if (digits.length === 0) return ''
  const p = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)]
  let out = `+7 (${p[0]}`
  if (digits.length >= 3) out += ')'
  if (p[1]) out += ` ${p[1]}`
  if (p[2]) out += `-${p[2]}`
  if (p[3]) out += `-${p[3]}`
  return out
}
