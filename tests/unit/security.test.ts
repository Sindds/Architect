import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { VARIANT_TITLES } from '@/content/texts'
import { validateLead } from '@/lib/lead-schema'
import { pruneLeadLines } from '@/lib/leads/prune'
import { createRateLimiter } from '@/lib/rate-limit'
import { serverErrorText } from '@/lib/server-errors'
import { createPdfCache } from '@/lib/smeta-cache'

describe('кеш PDF-смет', () => {
  it('одновременные запросы одной сметы ждут одну сборку; повторный — из кеша', async () => {
    const cache = createPdfCache(2)
    let renders = 0
    const render = async () => (renders++, new Uint8Array([1, 2, 3]))
    const [a, b] = await Promise.all([cache.get('t1', render), cache.get('t1', render)])
    expect(a).toEqual(b)
    await cache.get('t1', render)
    expect(renders).toBe(1)
  })

  it('хранит не больше max смет, вытесняет давно запрошенную; неудачная сборка не кешируется', async () => {
    const cache = createPdfCache(2)
    const ok = async () => new Uint8Array([1])
    await cache.get('a', ok)
    await cache.get('b', ok)
    await cache.get('a', ok)
    await cache.get('c', ok)
    expect(cache.size()).toBe(2)
    let renders = 0
    await cache.get('b', async () => (renders++, new Uint8Array([2])))
    expect(renders).toBe(1)
    await expect(cache.get('bad', async () => Promise.reject(new Error('сбой')))).rejects.toThrow('сбой')
    let again = 0
    await cache.get('bad', async () => (again++, new Uint8Array([3])))
    expect(again).toBe(1)
    expect(cache.size()).toBeLessThanOrEqual(2)
  })
})

describe('лимит частоты', () => {
  it('у каждого лимита свой счёт и своё окно', () => {
    const limiter = createRateLimiter(3, 1000)
    expect([1, 2, 3, 4].map((i) => limiter.allow('ip', i))).toEqual([true, true, true, false])
    expect(limiter.allow('другой', 5)).toBe(true)
    expect(limiter.allow('ip', 1005)).toBe(true)
  })
})

describe('уведомление об ошибке сервера', () => {
  it('страница без параметров адреса, текст ошибки обрезан', () => {
    const text = serverErrorText(new Error('x'.repeat(500)), '/?utm_source=yandex&project=vista', 'render')
    expect(text).toContain('Ошибка на сайте (render): /\n')
    expect(text).not.toContain('utm_source')
    expect(text.split('\n')[1]).toHaveLength(300)
  })
})

describe('срок хранения заявок', () => {
  const line = (createdAt: string, id: number) => JSON.stringify({ id, createdAt, name: 'Анна' })
  it('удаляет заявки старше срока, оставляет свежие и строки, которые не разобрать', () => {
    const text = [line('2025-09-01T10:00:00Z', 1), line('2026-09-01T10:00:00Z', 2), 'не json', ''].join('\n')
    const res = pruneLeadLines(text, new Date('2026-10-19T00:00:00Z'), 365)
    expect(res).toMatchObject({ removed: 1, total: 3 })
    expect(res.kept).toBe(`${line('2026-09-01T10:00:00Z', 2)}\nне json\n`)
  })
})

describe('вариант страницы в заявке', () => {
  const form = (variant: string) => {
    const f = new FormData()
    for (const [k, v] of Object.entries({ name: 'Анна', phone: '+79161234567', consent: 'on', source: 'final_cta', token: 'm', variant })) f.set(k, v)
    return f
  }
  it('только известные варианты: ссылка вместо варианта не уйдёт менеджерам', () => {
    expect(validateLead(form('monolith')).status).toBe('valid')
    expect(validateLead(form('t.me/fake')).status).toBe('error')
  })

  it('варианты в next.config.ts (переадресация ?v=) совпадают с вариантами в texts.ts', () => {
    const config = readFileSync(path.join(process.cwd(), 'next.config.ts'), 'utf8')
    const keys = config.match(/\(\?<variant>([a-z|]+)\)/)?.[1]?.split('|') ?? []
    expect(keys.sort()).toEqual(Object.keys(VARIANT_TITLES).filter((k) => k !== 'default').sort())
  })
})
