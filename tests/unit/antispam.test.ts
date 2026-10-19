import { describe, expect, it } from 'vitest'
import { clientIp } from '@/lib/client-ip'
import { MIN_FILL_MS, TOKEN_MAX_AGE_MS, checkLeadToken, minFillMs, signLeadToken } from '@/lib/lead-token'
import { allowRequest, rateLimitSize, resetRateLimit } from '@/lib/rate-limit'

const NOW = 1_800_000_000_000
const KEY = 'тестовый-секрет'

describe('метка времени формы, подписанная сервером', () => {
  it('выдана сервером 3+ секунды назад — проходит', () => {
    expect(checkLeadToken(signLeadToken(NOW - MIN_FILL_MS - 1, KEY), NOW, KEY)).toBe('ok')
  })

  it('быстрее 3 секунд — «слишком быстро»', () => {
    expect(checkLeadToken(signLeadToken(NOW - 500, KEY), NOW, KEY)).toBe('too_fast')
  })

  it('старше 12 часов — устарела', () => {
    expect(checkLeadToken(signLeadToken(NOW - TOKEN_MAX_AGE_MS - 1, KEY), NOW, KEY)).toBe('expired')
  })

  it('время из браузера без подписи и подделка подписи не проходят', () => {
    expect(checkLeadToken(String(NOW - 10_000), NOW, KEY)).toBe('invalid')
    expect(checkLeadToken(undefined, NOW, KEY)).toBe('invalid')
    const [, sig] = signLeadToken(NOW - 10_000, KEY).split('.')
    expect(checkLeadToken(`${(NOW - 60_000).toString(36)}.${sig}`, NOW, KEY)).toBe('invalid')
    expect(checkLeadToken(signLeadToken(NOW - 10_000, 'чужой ключ'), NOW, KEY)).toBe('invalid')
  })

  it('метка из будущего не проходит', () => {
    expect(checkLeadToken(signLeadToken(NOW + 120_000, KEY), NOW, KEY)).toBe('invalid')
  })

  it('без секрета метка не выдаётся и не принимается', () => {
    expect(checkLeadToken(signLeadToken(NOW - 10_000, null), NOW, null)).toBe('invalid')
  })
})

describe('IP посетителя: только от доверенного прокси', () => {
  const headers = (h: Record<string, string>) => ({ get: (name: string) => h[name] ?? null })

  it('левые элементы X-Forwarded-For присылает клиент — берём крайний справа', () => {
    expect(clientIp(headers({ 'x-forwarded-for': '6.6.6.6, 203.0.113.7' }), 1)).toBe('203.0.113.7')
    expect(clientIp(headers({ 'x-forwarded-for': '203.0.113.7' }), 1)).toBe('203.0.113.7')
  })

  it('два прокси (CDN и Caddy): второй справа', () => {
    expect(clientIp(headers({ 'x-forwarded-for': '6.6.6.6, 203.0.113.7, 10.0.0.2' }), 2)).toBe('203.0.113.7')
  })

  it('без X-Forwarded-For — X-Real-IP, без него — unknown', () => {
    expect(clientIp(headers({ 'x-real-ip': '198.51.100.4' }), 1)).toBe('198.51.100.4')
    expect(clientIp(headers({}), 1)).toBe('unknown')
  })
})

describe('лимит частоты', () => {
  it('устаревшие записи удаляются: подмена IP не раздувает память', () => {
    resetRateLimit()
    for (let i = 0; i < 6000; i++) allowRequest(`ip-${i}`, NOW)
    allowRequest('свежий', NOW + 11 * 60 * 1000)
    expect(rateLimitSize()).toBeLessThan(10)
  })
})

describe('порог времени заполнения на сервере', () => {
  it('LEAD_MIN_FILL_MS может только уменьшить порог 3 с и не ниже 0,5 с; мусор — обычные 3 с', () => {
    expect(minFillMs({})).toBe(3000)
    expect(minFillMs({ LEAD_MIN_FILL_MS: '1000' })).toBe(1000)
    expect(minFillMs({ LEAD_MIN_FILL_MS: '10' })).toBe(500)
    expect(minFillMs({ LEAD_MIN_FILL_MS: '99999' })).toBe(3000)
    expect(minFillMs({ LEAD_MIN_FILL_MS: '0' })).toBe(3000)
    expect(minFillMs({ LEAD_MIN_FILL_MS: 'abc' })).toBe(3000)
  })
})
