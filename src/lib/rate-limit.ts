import { createHash } from 'node:crypto'

// Лимит частоты по IP. IP не хранится — только солёный хэш. Память процесса: для одного инстанса на VPS
// этого достаточно, на Vercel у каждого инстанса свой счёт (для антиспама допустимо).
/** Когда записей больше, устаревшие удаляются (не чаще раза в минуту): подменой IP память не раздуть. */
const SWEEP_AT = 5000

export function hashIp(ip: string, salt = process.env.RATE_LIMIT_SALT ?? 'arcline-dev'): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}

/** Не больше limit запросов за windowMs с одного ключа. */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>()
  let lastSweep = 0
  const sweep = (now: number) => {
    lastSweep = now
    for (const [key, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(key)
  }
  return {
    allow(key: string, now = Date.now()): boolean {
      if (hits.size > SWEEP_AT && now - lastSweep > 60_000) sweep(now)
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
      if (recent.length >= limit) {
        hits.set(key, recent)
        return false
      }
      recent.push(now)
      hits.set(key, recent)
      return true
    },
    size: () => hits.size,
    reset() {
      hits.clear()
      lastSweep = 0
    },
  }
}

/** Заявки: 5 за 10 минут с одного IP. */
const leads = createRateLimiter(5, 10 * 60 * 1000)
/** Ссылки на PDF-смету: 20 за 10 минут с одного IP — человеку хватит с запасом, перебором сервер не положить. */
export const smetaLimiter = createRateLimiter(20, 10 * 60 * 1000)

export const allowRequest = (key: string, now = Date.now()) => leads.allow(key, now)
export const rateLimitSize = () => leads.size()
export const resetRateLimit = () => leads.reset()
