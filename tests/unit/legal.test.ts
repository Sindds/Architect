import { describe, expect, it } from 'vitest'
import { LEGAL, type LegalSite, legalDocs, legalReadiness } from '@/content/legal'
import { SITE } from '@/content/site'

const CLIENT: LegalSite = {
  ...SITE,
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
    ['оператор с адресом', 'даю согласие ООО «Тест» (ИНН 1234567890, КПП 123456789, ОГРН 1234567890123, адрес: 000000, г. Москва, ул. Тестовая, д. 1)'],
    ['цель', 'Цели обработки: рассмотрение заявки'],
    ['перечень данных', 'Обрабатываемые данные: имя, номер телефона'],
    ['обработчик с адресом', 'ООО «1С-Битрикс», ОГРН 5077746476209, ИНН 7717586110, адрес: 109544'],
    ['действия и способы', 'Способы обработки: сбор, запись'],
    ['срок', 'Согласие действует до достижения целей обработки или его отзыва'],
    ['способ отзыва', 'Я могу отозвать согласие письмом на pd@arcline.test'],
    ['отдельно от других документов', 'оформлено отдельно от политики конфиденциальности'],
  ])('%s', (_what, fragment) => expect(consent).toContain(fragment))

  it('текст согласия в шаблоне — дословно текст заказчика от 19.10.2026, реквизиты из SITE.operator', () => {
    expect(LEGAL.soglasie.sections[0]!.paragraphs).toEqual([
      'Я, действуя свободно, по своей воле и в своих интересах, даю согласие ООО «Арклайн Эстейт» (ИНН 0000000000, КПП 000000000, ОГРН 0000000000000, адрес: Московская область, Новорижское шоссе, 7-й километр, с1) на обработку моих персональных данных.',
      'Обрабатываемые данные: имя, номер телефона, предпочтительный способ связи, комментарий к заявке, сведения о заполненной форме, параметры расчёта, ответы на вопросы анкеты и рекламные метки (UTM).',
      'Цели обработки: рассмотрение заявки, обратная связь, подготовка расчёта стоимости, организация консультации, встречи или экскурсии.',
      'Способы обработки: сбор, запись, систематизация, накопление, хранение, уточнение, извлечение, использование, передача лицам, обрабатывающим данные по поручению оператора, блокирование, удаление и уничтожение. Обработка осуществляется с использованием средств автоматизации и без них.',
      'Согласие действует до достижения целей обработки или его отзыва, если иное не предусмотрено законодательством.',
    ])
    // Срок назван один раз: второй, другой формулировкой, противоречил бы первому.
    expect(text(LEGAL, 'soglasie').match(/Согласие действует/g)).toHaveLength(1)
  })

  it('перечень данных в политике тот же, что в согласии', () => {
    const list = (doc: string, prefix: string) => doc.match(new RegExp(`${prefix}([^\n]*)`))?.[1]
    expect(list(text(LEGAL, 'privacy'), 'Из формы заявки: ')).toBe(list(text(LEGAL, 'soglasie'), 'Обрабатываемые данные: '))
  })

  it('нет устаревшего «без передачи третьим лицам»: обработчики перечислены', () => {
    expect(consent).not.toMatch(/без передачи третьим лицам/i)
  })
})

describe('политика с данными заказчика', () => {
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

describe('тексты сайта (шаблон)', () => {
  it('без пометок о концепте; незаполненный обработчик (хостинг) не печатается пустой строкой', () => {
    const all = Object.keys(LEGAL).map((k) => text(LEGAL, k as keyof typeof LEGAL)).join('\n')
    expect(all).not.toMatch(/концепт|вымышлен|не сохраняются/i)
    expect(all).toContain('ООО «1С-Битрикс»')
    expect(all).toContain('на серверах в России')
    expect(all).not.toMatch(/(^|\n), , адрес/)
  })
})

describe('готовность под заказчика', () => {
  it('нули шаблона в реквизитах, пустой хостинг и example.com — в списке «не заполнено»', () => {
    expect(legalReadiness(SITE)).toEqual(expect.arrayContaining(['operator.inn', 'operator.kpp', 'operator.ogrn', 'processors[1].name', 'email']))
    expect(legalReadiness(CLIENT)).toEqual([])
  })
})

describe('Яндекс Метрика в текстах', () => {
  it('без счётчика — «счётчиков нет»; со счётчиком — Метрика после согласия, Вебвизор выключен, ClientID в перечне данных', () => {
    const without = text(legalDocs({ ...CLIENT, metrikaId: '' }), 'cookies')
    expect(without).toContain('аналитических счётчиков на сайте нет')
    const docs = legalDocs({ ...CLIENT, metrikaId: '12345678' })
    expect(text(docs, 'cookies')).toContain('Яндекс Метрика (ООО «Яндекс») загружается только после «Принять все»')
    expect(text(docs, 'cookies')).toContain('Вебвизор, который записывает ввод в формы, выключен')
    expect(text(docs, 'soglasie')).toContain('номер посещения в Яндекс Метрике (ClientID)')
    expect(text(docs, 'privacy')).toContain('передаём вместе с заявкой в систему учёта клиентов')
  })
})
