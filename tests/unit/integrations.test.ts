import { describe, expect, it } from 'vitest'
import { bitrix24Config, sendToBitrix24 } from '@/lib/leads/bitrix24'
import { deliverLead, type Sink } from '@/lib/leads/deliver'
import { oneCConfig, sendToOneC } from '@/lib/leads/onec'
import { leadSummary, toLeadRecord, type LeadRecord } from '@/lib/leads/record'
import type { LeadInput } from '@/lib/lead-schema'
import { leadNotificationText } from '@/lib/notify'

const INPUT: LeadInput = {
  name: 'Анна',
  phone: '+79161234567',
  consent: 'on',
  contactMethod: 'telegram',
  comment: 'Участок 15 соток',
  source: 'quiz',
  variant: 'monolith',
  quiz: 'Площадь: 200–250 м²',
  utm: JSON.stringify({ utm_source: 'yandex', utm_campaign: 'monolith', yclid: '123', evil: 'x' }),
  startedAt: 1,
}

const LEAD: LeadRecord = toLeadRecord(48213, INPUT, new Date('2026-10-10T10:00:00Z'))

interface Call {
  url: string
  init: RequestInit
  body: Record<string, unknown>
}

/** Подменный fetch: отдаёт ответы по очереди и запоминает запросы. */
function fakeFetch(...responses: Array<{ status?: number; json: unknown }>) {
  const calls: Call[] = []
  const impl = async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {}, body: JSON.parse(String(init?.body ?? '{}')) })
    const r = responses[calls.length - 1] ?? { status: 500, json: {} }
    return new Response(JSON.stringify(r.json), { status: r.status ?? 200, headers: { 'content-type': 'application/json' } })
  }
  return { impl: impl as typeof fetch, calls }
}

describe('запись заявки', () => {
  it('без согласия-флажка и времени заполнения; utm — только известные метки', () => {
    expect(LEAD).toMatchObject({ id: 48213, name: 'Анна', phone: '+79161234567', source: 'quiz', variant: 'monolith' })
    expect(LEAD.uid).toMatch(/^[0-9a-f-]{36}$/)
    expect(LEAD.utm).toEqual({ utm_source: 'yandex', utm_campaign: 'monolith', yclid: '123' })
    expect(LEAD).not.toHaveProperty('consent')
    expect(LEAD).not.toHaveProperty('startedAt')
    expect(LEAD.consentVersion).toBeTruthy()
  })

  it('битый utm не ломает заявку', () => {
    expect(toLeadRecord(1, { ...INPUT, utm: '{не json' }).utm).toEqual({})
  })

  it('сводка для менеджера по-русски: источник, способ связи, комментарий, квиз', () => {
    const text = leadSummary(LEAD)
    expect(text).toContain('Заявка №48213 с сайта')
    expect(text).toContain('квиз')
    expect(text).toContain('Telegram')
    expect(text).toContain('Участок 15 соток')
    expect(text).toContain('Площадь: 200–250 м²')
  })
})

describe('Битрикс24', () => {
  const env = { B24_WEBHOOK_URL: 'https://arcline.bitrix24.ru/rest/1/abc123' }

  it('настройки: нет адреса — интеграция выключена; нужен https; слэш в конце', () => {
    expect(bitrix24Config({})).toBeNull()
    expect(() => bitrix24Config({ B24_WEBHOOK_URL: 'http://arcline.bitrix24.ru/rest/1/abc/' })).toThrow('https')
    expect(bitrix24Config(env)).toMatchObject({ webhook: 'https://arcline.bitrix24.ru/rest/1/abc123/', entity: 'lead', sourceId: 'WEB' })
    expect(bitrix24Config({ ...env, B24_ENTITY: 'deal', B24_ASSIGNED_BY_ID: '12' })).toMatchObject({ entity: 'deal', assignedById: 12 })
  })

  it('лид: crm.item.add с entityTypeId 1, телефон в fm, utm и сводка; ссылка на карточку', async () => {
    const f = fakeFetch({ json: { result: { item: { id: 42 } } } })
    const res = await sendToBitrix24(LEAD, bitrix24Config(env)!, f.impl)

    expect(f.calls).toHaveLength(1)
    expect(f.calls[0]!.url).toBe('https://arcline.bitrix24.ru/rest/1/abc123/crm.item.add')
    expect(f.calls[0]!.body).toMatchObject({
      entityTypeId: 1,
      fields: {
        title: 'Заявка №48213 с сайта',
        name: 'Анна',
        fm: [{ typeId: 'PHONE', valueType: 'WORK', value: '+79161234567' }],
        sourceId: 'WEB',
        opened: 'Y',
        utmSource: 'yandex',
        utmCampaign: 'monolith',
      },
    })
    expect(String((f.calls[0]!.body.fields as Record<string, unknown>).comments)).toContain('Участок 15 соток')
    expect(res).toEqual({ ref: '42', url: 'https://arcline.bitrix24.ru/crm/lead/details/42/' })
  })

  it('простой режим CRM: контакт, затем сделка с этим контактом', async () => {
    const f = fakeFetch({ json: { result: { item: { id: 7 } } } }, { json: { result: { item: { id: 99 } } } })
    const res = await sendToBitrix24(LEAD, bitrix24Config({ ...env, B24_ENTITY: 'deal', B24_ASSIGNED_BY_ID: '12' })!, f.impl)

    expect(f.calls.map((c) => c.body.entityTypeId)).toEqual([3, 2])
    expect(f.calls[0]!.body.fields).toMatchObject({ name: 'Анна', fm: [{ typeId: 'PHONE', value: '+79161234567' }], assignedById: 12 })
    expect(f.calls[1]!.body.fields).toMatchObject({ title: 'Заявка №48213 с сайта', contactIds: [7], assignedById: 12 })
    expect(f.calls[1]!.body.fields).not.toHaveProperty('fm')
    expect(res.url).toBe('https://arcline.bitrix24.ru/crm/deal/details/99/')
  })

  it('ошибка портала — исключение с описанием', async () => {
    const f = fakeFetch({ status: 401, json: { error: 'INVALID_CREDENTIALS', error_description: 'Invalid request credentials' } })
    await expect(sendToBitrix24(LEAD, bitrix24Config(env)!, f.impl)).rejects.toThrow('INVALID_CREDENTIALS')
  })
})

describe('1С', () => {
  const env = { ONEC_LEADS_URL: 'https://1c.example.ru/base/hs/leads/v1/leads', ONEC_USER: 'site', ONEC_PASSWORD: 'секрет' }

  it('настройки: нет адреса — выключено; нужен https', () => {
    expect(oneCConfig({})).toBeNull()
    expect(() => oneCConfig({ ONEC_LEADS_URL: 'http://1c.example.ru/hs/leads' })).toThrow('https')
  })

  it('POST JSON по контракту: Basic-авторизация, ключ идемпотентности, номер из ответа 1С', async () => {
    const f = fakeFetch({ status: 201, json: { id: 'ЗК-000123' } })
    const res = await sendToOneC(LEAD, oneCConfig(env)!, f.impl)

    const call = f.calls[0]!
    expect(call.url).toBe(env.ONEC_LEADS_URL)
    const headers = new Headers(call.init.headers)
    expect(headers.get('authorization')).toBe(`Basic ${Buffer.from('site:секрет').toString('base64')}`)
    expect(headers.get('idempotency-key')).toBe(LEAD.uid)
    expect(call.body).toMatchObject({ uid: LEAD.uid, number: 48213, name: 'Анна', phone: '+79161234567', source: 'quiz', sourceLabel: 'квиз' })
    expect(res).toEqual({ ref: 'ЗК-000123' })
  })

  it('ответ не 2xx — исключение', async () => {
    const f = fakeFetch({ status: 500, json: {} })
    await expect(sendToOneC(LEAD, oneCConfig(env)!, f.impl)).rejects.toThrow('500')
  })
})

describe('доставка', () => {
  const ok = (name: Sink['name'], ref?: string): Sink => ({ name, send: async () => ({ ref }) })
  const broken = (name: Sink['name']): Sink => ({
    name,
    send: async () => {
      throw new Error('нет связи')
    },
  })

  it('принята, если сохранило хотя бы одно хранилище', async () => {
    const res = await deliverLead(LEAD, [broken('bitrix24'), ok('onec', 'ЗК-1')])
    expect(res.ok).toBe(true)
    expect(res.results).toEqual([
      { sink: 'bitrix24', ok: false, error: 'нет связи' },
      { sink: 'onec', ok: true, ref: 'ЗК-1' },
    ])
  })

  it('не принята, если все хранилища упали или их нет', async () => {
    expect((await deliverLead(LEAD, [broken('file')])).ok).toBe(false)
    expect((await deliverLead(LEAD, [])).ok).toBe(false)
  })
})

describe('уведомление в Telegram со ссылками', () => {
  it('ссылка на карточку в CRM и предупреждение о сбое, без имени и телефона', () => {
    const text = leadNotificationText(48213, 'quiz', 'monolith', [
      { sink: 'bitrix24', ok: true, ref: '42', url: 'https://arcline.bitrix24.ru/crm/lead/details/42/' },
      { sink: 'onec', ok: false, error: 'нет связи' },
    ])
    expect(text).toContain('Битрикс24: https://arcline.bitrix24.ru/crm/lead/details/42/')
    expect(text).toContain('Не принята в 1С')
    expect(text).not.toContain('Анна')
    expect(text).not.toMatch(/\+?7\d{10}/)
    expect(text).not.toContain('нет связи')
  })
})
