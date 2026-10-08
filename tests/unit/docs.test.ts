import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { formatRub } from '@/lib/format'
import { breakdown, estimateFor } from '@/lib/pricing'
import { contractHtml, estimateHtml, SAMPLE } from '../../scripts/sample-docs'

const pdf = (name: string) => readFileSync(path.join(process.cwd(), 'public/docs', name)).toString('latin1')

describe('PDF-образцы открываются в любом просмотрщике', () => {
  // Chrome сохраняет вариативные шрифты как Type 3. Такие глифы ломаются в iOS, Telegram,
  // macOS Preview и Acrobat при перерисовке страницы: «сначала нормально, потом всё ломается».
  for (const name of ['dogovor-obrazec.pdf', 'smeta-obrazec.pdf']) {
    it(`${name}: шрифты встроены как TrueType, без Type 3`, () => {
      const bytes = pdf(name)
      expect(bytes.startsWith('%PDF-')).toBe(true)
      expect(bytes).not.toMatch(/\/Subtype\s*\/Type3/)
      expect(bytes).toMatch(/\/Subtype\s*\/CIDFontType2/)
      expect(bytes).toMatch(/\/ToUnicode/)
    })
  }
})

const estimate = estimateFor(SAMPLE)
const lines = estimate.sections.flatMap((s) => s.lines)

describe('Смета: подробная и сходится с ценой договора', () => {
  it('итог сметы равен цене из pricing.ts до рубля', () => {
    expect(estimate.total).toBe(breakdown(SAMPLE).total)
    expect(estimate.sections.reduce((sum, s) => sum + s.subtotal, 0)).toBe(estimate.total)
  })

  it('не меньше 10 разделов и 50 позиций с объёмом, единицей и ценой', () => {
    expect(estimate.sections.length).toBeGreaterThanOrEqual(10)
    expect(lines.length).toBeGreaterThanOrEqual(50)
    for (const l of lines) {
      expect(l.qty, l.name).toBeGreaterThan(0)
      expect(l.price, l.name).toBeGreaterThan(0)
      expect(l.unit, l.name).toMatch(/^(м²|м³|м\.п\.|т|шт\.|компл\.|рейс|маш\.-ч|мес\.)$/)
      expect(l.sum, l.name).toBe(Math.round(l.qty * l.price))
    }
  })

  it('терраса посчитана отдельным разделом по ставке террасы', () => {
    const terrace = estimate.sections.find((s) => /Терраса/.test(s.title))
    expect(terrace?.subtotal).toBe(breakdown(SAMPLE).terrace)
  })

  it('общеплощадочные расходы разумные: 2–6% сметы', () => {
    const site = lines.find((l) => /Общеплощадочные/.test(l.name))!
    expect(site.sum / estimate.total).toBeGreaterThan(0.02)
    expect(site.sum / estimate.total).toBeLessThan(0.06)
  })

  it('в документе есть каждая позиция, итог и что не входит', () => {
    const html = estimateHtml()
    for (const l of lines) expect(html).toContain(l.name)
    expect(html).toContain(formatRub(estimate.total))
    expect(html).toMatch(/Не входит/)
  })
})

describe('Договор: полноценный договор строительного подряда', () => {
  const html = contractHtml()
  const sections = [...html.matchAll(/<h2>(\d+)\. ([^<]+)<\/h2>/g)].map((m) => [Number(m[1]), m[2]] as const)

  it('не меньше 14 разделов по порядку', () => {
    expect(sections.length).toBeGreaterThanOrEqual(14)
    sections.forEach(([n], i) => expect(n).toBe(i + 1))
  })

  it('есть ключевые разделы договора подряда', () => {
    const titles = sections.map(([, t]) => t).join(' | ')
    for (const t of ['Предмет', 'Цена', 'Сроки', 'Права и обязанности Подрядчика', 'Права и обязанности Заказчика', 'Приёмка', 'Гарантия', 'Ответственность', 'Обстоятельства непреодолимой силы', 'Расторжение', 'Споры']) {
      expect(titles).toContain(t)
    }
  })

  it('раздел «Гарантия» с конкретными сроками по элементам дома', () => {
    const n = sections.find(([, t]) => t === 'Гарантия')?.[0]
    expect(n).toBeTruthy()
    const part = html.slice(html.indexOf(`<h2>${n}. `), html.indexOf(`<h2>${n! + 1}. `))
    expect(part).toMatch(/10 лет/)
    expect(part).toMatch(/Кровля/)
    expect(part).toMatch(/Инженерные системы/)
  })

  it('п. 2.1 — твёрдая цена, сумма совпадает со сметой', () => {
    expect(html).toMatch(/<p>2\.1\.[^<]*твёрдая/)
    expect(html).toContain(formatRub(estimate.total))
  })

  it('ссылается на закон и приложения, без выдуманных реквизитов', () => {
    expect(html).toMatch(/Гражданск\S+ кодекс/)
    expect(html).toMatch(/О защите прав потребителей/)
    expect((html.match(/Приложение № \d/g) ?? []).length).toBeGreaterThanOrEqual(4)
    expect(html).not.toMatch(/ИНН\s*\d|ОГРН\s*\d/)
  })
})
