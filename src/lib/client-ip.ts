/**
 * IP посетителя для лимита частоты.
 * Левые элементы X-Forwarded-For присылает сам клиент, им верить нельзя. Каждый доверенный прокси дописывает
 * справа адрес, от которого получил запрос, поэтому IP клиента — элемент номер TRUSTED_PROXY_HOPS справа.
 * По умолчанию 1: перед сайтом один прокси (Caddy или nginx) либо Vercel, который перезаписывает заголовок целиком
 * (vercel.com/docs/headers/request-headers). Без прокси перед сайтом этот заголовок защиты не даёт.
 */
export function clientIp(headers: { get(name: string): string | null }, hops = trustedHops()): string {
  const chain = (headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (chain.length) return chain[Math.max(0, chain.length - hops)] as string
  return headers.get('x-real-ip')?.trim() || 'unknown'
}

export function trustedHops(env: Record<string, string | undefined> = process.env): number {
  const n = Number(env.TRUSTED_PROXY_HOPS)
  return Number.isInteger(n) && n >= 1 ? n : 1
}
