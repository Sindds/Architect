import { createHash } from 'node:crypto'

// Не больше LIMIT заявок за WINDOW_MS с одного IP. IP не хранится — только солёный хэш.
// Память процесса: для одного инстанса на VPS этого достаточно.
const LIMIT = 5
const WINDOW_MS = 10 * 60 * 1000
const hits = new Map<string, number[]>()

export function hashIp(ip: string, salt = process.env.RATE_LIMIT_SALT ?? 'arcline-dev'): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}

export function allowRequest(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= LIMIT) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  return true
}

export function resetRateLimit() {
  hits.clear()
}
