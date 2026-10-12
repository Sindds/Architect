import { createHmac, timingSafeEqual } from 'node:crypto'
import { z } from 'zod'
import { PRICING } from '@/content/pricing'
import type { AddonKey, Style, Tier } from '@/content/types'

/** Ссылка на смету живёт 7 дней (PLAN P5.4). */
export const SMETA_TTL_MS = 7 * 24 * 60 * 60 * 1000

/** Параметры сметы. Этажность и санузлы известны у проекта; для калькулятора их выводит smetaLayout. */
export const smetaInputSchema = z.object({
  area: z.number().int().min(100).max(800),
  terrace: z.number().int().min(0).max(200),
  style: z.enum(Object.keys(PRICING.styles) as [Style, ...Style[]]),
  tier: z.enum(Object.keys(PRICING.tiers) as [Tier, ...Tier[]]),
  addons: z.array(z.enum(Object.keys(PRICING.addons) as [AddonKey, ...AddonKey[]])).max(3),
  floors: z.number().int().min(1).max(3).optional(),
  bathrooms: z.number().int().min(1).max(8).optional(),
  /** Название проекта, если смета по проекту из каталога. */
  project: z.string().max(40).optional(),
})
export type SmetaInput = z.infer<typeof smetaInputSchema>

const payloadSchema = z.object({ l: z.number().int(), e: smetaInputSchema, x: z.number().int() })

/**
 * Секрет подписи. В режиме client — только из SMETA_SIGNING_SECRET (без него ссылка не выдаётся).
 * В concept допустим общий ключ: в смете нет персональных данных, подпись лишь не даёт подставить чужие параметры.
 */
export function smetaSecret(env: Record<string, string | undefined> = process.env, concept = false): string | null {
  const key = env.SMETA_SIGNING_SECRET?.trim()
  if (key) return key
  return concept ? 'arcline-concept-smeta' : null
}

const sign = (data: string, key: string) => createHmac('sha256', key).update(`smeta:${data}`).digest('base64url').slice(0, 32)

/** Токен «заявка №, параметры, срок» с подписью HMAC: часть ссылки /smeta/<токен>. */
export function signSmetaToken(leadId: number, input: SmetaInput, now: number, key: string): string {
  const data = Buffer.from(JSON.stringify({ l: leadId, e: input, x: now + SMETA_TTL_MS })).toString('base64url')
  return `${data}.${sign(data, key)}`
}

/** Проверка токена: подпись, срок, схема. Любая ошибка — null (маршрут отвечает 403). */
export function verifySmetaToken(token: string, now: number, key: string | null): { leadId: number; input: SmetaInput } | null {
  if (!key) return null
  const [data, sig] = token.split('.')
  if (!data || !sig) return null
  const expected = Buffer.from(sign(data, key))
  const given = Buffer.from(sig)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
  try {
    const parsed = payloadSchema.safeParse(JSON.parse(Buffer.from(data, 'base64url').toString('utf8')))
    if (!parsed.success || parsed.data.x < now) return null
    return { leadId: parsed.data.l, input: parsed.data.e }
  } catch {
    return null
  }
}

/**
 * Этажность и санузлы для расчёта без проекта: до 250 м² — один этаж, больше — два;
 * санузел на каждые 90 м², от 2 до 6. Это допущение сметы, оно написано в PDF.
 */
export function smetaLayout(area: number): { floors: number; bathrooms: number } {
  return { floors: area > 250 ? 2 : 1, bathrooms: Math.min(6, Math.max(2, Math.round(area / 90))) }
}
