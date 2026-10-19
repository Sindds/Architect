import { describe, expect, it } from 'vitest'
import { SITE } from '@/content/site'
import { readiness } from '@/lib/readiness'

const FILLED = {
  ...SITE,
  phoneHref: 'tel:+74951234567',
  email: 'hello@arcline.ru',
  operator: { name: 'ООО «Тест»', inn: '1234567890', kpp: '123456789', ogrn: '1234567890123', address: 'г. Москва, ул. Тестовая, д. 1' },
  processors: [SITE.processors[0], { name: 'ООО «Хостинг»', details: 'ОГРН 1, ИНН 1', address: 'г. Москва', purpose: 'хостинг сайта' }],
  messengers: { telegram: 'https://t.me/arcline', max: 'https://max.ru/u/abc', vk: 'https://vk.me/arcline', whatsapp: 'https://wa.me/79161234567' },
  metrikaId: '98765432',
}
const ENV = {
  LEAD_TOKEN_SECRET: 'a',
  SMETA_SIGNING_SECRET: 'b',
  RATE_LIMIT_SALT: 'c',
  SMTP_HOST: 'smtp.yandex.ru',
  SMTP_USER: 'leads@arcline.ru',
  SMTP_PASS: 'x',
  LEADS_EMAIL_TO: 'sales@arcline.ru',
  B24_WEBHOOK_URL: 'https://arcline.bitrix24.ru/rest/1/key/',
  NEXT_PUBLIC_SITE_URL: 'https://arcline.ru',
}

describe('pnpm ready: готовность к публикации', () => {
  it('шаблон без переменных окружения: заглушки компании, ключ формы и канал заявок — обязательные пункты', () => {
    const items = readiness(SITE, {})
    const critical = items.filter((i) => i.level === 'critical').map((i) => i.where)
    expect(critical).toEqual(
      expect.arrayContaining([
        'src/content/company.ts: phoneDisplay и phoneHref',
        'src/content/company.ts: email',
        'src/content/company.ts: operator.inn',
        'LEAD_TOKEN_SECRET (pnpm env:init)',
        expect.stringContaining('B24_WEBHOOK_URL'),
      ]),
    )
    expect(items.filter((i) => i.where.includes('messengers')).map((i) => i.where)).toHaveLength(4)
  })

  it('заполненная компания, ключи, почта, Битрикс24 и Метрика — замечаний нет', () => {
    expect(readiness(FILLED, ENV)).toEqual([])
  })

  it('один канал заявок — предупреждение о резерве; ни одного — обязательный пункт', () => {
    const onlyB24 = { ...ENV, SMTP_HOST: '' }
    expect(readiness(FILLED, onlyB24).map((i) => [i.level, i.what.slice(0, 25)])).toEqual([['important', 'Один канал заявок (Битрик']])
    expect(readiness(FILLED, { ...onlyB24, B24_WEBHOOK_URL: '' }).map((i) => i.level)).toEqual(['critical'])
  })

  it('ошибка в адресе Битрикс24 — обязательный пункт с причиной', () => {
    const items = readiness(FILLED, { ...ENV, B24_WEBHOOK_URL: 'http://arcline.bitrix24.ru/rest/1/key/' })
    expect(items).toEqual([
      expect.objectContaining({ level: 'critical', where: 'B24_WEBHOOK_URL', what: expect.stringContaining('нужен адрес https') }),
      expect.objectContaining({ level: 'important', what: expect.stringContaining('Один канал заявок (почта)') }),
    ])
  })

  it('Метрика: пусто — предупреждение, не цифры — обязательный пункт', () => {
    expect(readiness({ ...FILLED, metrikaId: '' }, ENV).map((i) => i.where)).toEqual([expect.stringContaining('metrikaId')])
    expect(readiness({ ...FILLED, metrikaId: 'ym-123' }, ENV)).toEqual([expect.objectContaining({ level: 'critical' })])
  })
})
