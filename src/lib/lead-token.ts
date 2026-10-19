import { createHmac, timingSafeEqual } from 'node:crypto'

/** Минимальное время заполнения формы: быстрее заполняют только боты. */
export const MIN_FILL_MS = 3000

/** Порог для этого сервера: LEAD_MIN_FILL_MS может только уменьшить его (не меньше 0,5 с) — для автотестов. */
export function minFillMs(env: Record<string, string | undefined> = process.env): number {
  const n = Number(env.LEAD_MIN_FILL_MS)
  return Number.isFinite(n) && n > 0 ? Math.min(MIN_FILL_MS, Math.max(500, n)) : MIN_FILL_MS
}
/** Метка действует 12 часов: форма в забытой вкладке потребует обновить страницу. */
export const TOKEN_MAX_AGE_MS = 12 * 60 * 60 * 1000
/** Допуск на расхождение часов между инстансами сервера. */
const CLOCK_SKEW_MS = 60_000

export type TokenCheck = 'ok' | 'too_fast' | 'expired' | 'invalid'

/** Секрет подписи — только из LEAD_TOKEN_SECRET: без него заявки не принимаются (сгенерировать — pnpm env:init). */
export function leadTokenSecret(env: Record<string, string | undefined> = process.env): string | null {
  return env.LEAD_TOKEN_SECRET?.trim() || null
}

function sign(issued: string, key: string): string {
  return createHmac('sha256', key).update(`lead:${issued}`).digest('base64url').slice(0, 32)
}

/** Метка «форму начали заполнять в момент now», подписанная сервером: «время.подпись». */
export function signLeadToken(now: number, key: string | null): string {
  if (!key) return 'none'
  const issued = now.toString(36)
  return `${issued}.${sign(issued, key)}`
}

/** Проверка метки при отправке: подпись, не быстрее MIN_FILL_MS и не старше TOKEN_MAX_AGE_MS. */
export function checkLeadToken(token: string | undefined, now: number, key: string | null, minFill = minFillMs()): TokenCheck {
  if (!key || !token) return 'invalid'
  const [issued, sig] = token.split('.')
  if (!issued || !sig || !/^[0-9a-z]{1,12}$/.test(issued)) return 'invalid'
  const expected = Buffer.from(sign(issued, key))
  const given = Buffer.from(sig)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return 'invalid'
  const age = now - parseInt(issued, 36)
  if (age < -CLOCK_SKEW_MS) return 'invalid'
  if (age < minFill) return 'too_fast'
  if (age > TOKEN_MAX_AGE_MS) return 'expired'
  return 'ok'
}
