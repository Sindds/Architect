import { createHash } from 'node:crypto'

// Не больше LIMIT заявок за WINDOW_MS с одного IP. IP не хранится — только солёный хэш.
// Память процесса: для одного инстанса на VPS этого достаточно.
const LIMIT = 5
const WINDOW_MS = 10 * 60 * 1000
/** Когда записей больше, устаревшие удаляются (не чаще раза в минуту): подменой IP память не раздуть. */
const SWEEP_AT = 5000
const hits = new Map<string, number[]>()
let lastSweep = 0

export function hashIp(ip: string, salt = process.env.RATE_LIMIT_SALT ?? 'arcline-dev'): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}

function sweep(now: number) {
  lastSweep = now
  for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
}

export function allowRequest(key: string, now = Date.now()): boolean {
  if (hits.size > SWEEP_AT && now - lastSweep > 60_000) sweep(now)
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= LIMIT) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  return true
}

export function rateLimitSize() {
  return hits.size
}

export function resetRateLimit() {
  hits.clear()
  lastSweep = 0
}
