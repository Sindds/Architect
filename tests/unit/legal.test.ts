import { describe, expect, it } from 'vitest'
import { LEGAL, type LegalSite, legalDocs, legalReadiness } from '@/content/legal'
import { SITE } from '@/content/site'

const CLIENT: LegalSite = {
  ...SITE,
  contentMode: 'client',
  email: 'pd@arcline.test',
  operator: { name: 'ООО «Тест»', inn: '1234567890', kpp: '123456789', ogrn: '1234567890123', address: '000000, г. Москва, ул. Тестовая, д. 1' },
  processors: [
    SITE.processors[0],
    { name: 'ООО «Хостинг»', details: 'ОГРН 0, ИНН 0', address: 'г. Москва', purpose: 'хостинг сайта и хранение заявок на сервере' },
  ],
}

const text = (docs: ReturnType<typeof legalDocs>, slug: keyof typeof docs) =>
  docs[slug].sections.flatMap((s) => [s.heading, ...s.paragraphs]).join('\n')

describe('согласие: состав по ч. 4 ст. 9 152-ФЗ', () => {
  const consent = text(legalDocs(CLIENT), 'soglasie')

  it.each([
    ['оператор с адресом', 'ООО «Тест», ИНН 1234567890, КПП 123456789, ОГРН 1234567890123, адрес: 000000, г. Москва'],
    ['цель', 'Цель обработки: связаться со мной по заявке'],
    ['перечень данных', 'Перечень данных: имя, номер телефона'],
    ['обработчик с адресом', 'ООО «1С-Битрикс», ОГРН 5077746476209, ИНН 7717586110, адрес: 109544'],
    ['действия и способы', 'Действия с данными: сбор, запись'],
    ['срок', 'Согласие действует до достижения цели обработки'],
    ['способ отзыва', 'Я могу отозвать согласие письмом на pd@arcline.test'],
    ['отдельно от других документов', 'оформлено отдельно от политики конфиденциальности'],
  ])('%s', (_what, fragment) => expect(consent).toContain(fragment))

  it('нет устаревшего «без передачи третьим лицам»: обработчики перечислены', () => {
    expect(consent).not.toMatch(/без передачи третьим лицам/i)
  })
})

describe('политика в режиме client', () => {
  const policy = text(legalDocs(CLIENT), 'privacy')

  it('обработчики, локализация в РФ, сроки ответа и уничтожения, Роскомнадзор', () => {
    expect(policy).toContain('ООО «Хостинг»')
    expect(policy).toContain('на серверах в России (часть 5 статьи 18')
    expect(policy).toContain('в течение 10 рабочих дней')
    expect(policy).toContain('в течение 30 дней')
    expect(policy).toContain('Роскомнадзор')
    expect(policy).toContain('Имя и телефон в Telegram не передаются')
  })
})

describe('режим concept', () => {
  it('без реквизитов и обработчиков: данные никуда не передаются', () => {
    const all = Object.keys(LEGAL).map((k) => text(LEGAL, k as keyof typeof LEGAL)).join('\n')
    expect(all).toContain('вымышленная компания')
    expect(all).toContain('данные форм не сохраняются и никуда не передаются')
    expect(all).not.toContain('1С-Битрикс')
  })
})

describe('готовность к режиму client', () => {
  it('пустые реквизиты оператора и хостинга не пропускаются', () => {
    expect(legalReadiness({ ...SITE, contentMode: 'client' })).toEqual(
      expect.arrayContaining(['operator.inn', 'operator.kpp', 'operator.ogrn', 'processors[1].name', 'email']),
    )
    expect(legalReadiness(CLIENT)).toEqual([])
  })

  it('сайт в режиме client публикуется только с заполненными реквизитами', () => {
    if (SITE.contentMode === 'client') expect(legalReadiness(SITE)).toEqual([])
  })
})
