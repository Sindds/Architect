import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { formatRub } from '@/lib/format'
import { breakdown, estimateFor } from '@/lib/pricing'
import { subsetNames, subsetTag, uniqueSubsetTags } from '../../scripts/pdf-subset-tags'
import { contractHtml, estimateHtml, SAMPLE } from '../../scripts/sample-docs'

const file = (name: string) => readFileSync(path.join(process.cwd(), 'public/docs', name))
const pdf = (name: string) => file(name).toString('latin1')

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

    // Chrome называет разные подмножества одного шрифта одинаково («AAAAAA+Onest-Regular» трижды).
    // Просмотрщик, который узнаёт шрифт по имени, берёт глифы из чужого подмножества — текст ломается.
    it(`${name}: у каждого подмножества шрифта своё имя (ISO 32000-1, п. 9.6.4)`, () => {
      const names = subsetNames(file(name))
      expect(names.length).toBeGreaterThan(1)
      expect(new Set(names).size).toBe(names.length)
    })
  }

  it('uniqueSubsetTags: дубли переименованы, длина файла и смещения xref те же', () => {
    const dict = (id: number, body: string) => `${id} 0 obj\n<<${body}>>\nendobj\n`
    const font = (base: number, tag: string) =>
      dict(base, `/Type /Font /Subtype /Type0 /BaseFont /${tag}+Onest-Regular /DescendantFonts [${base + 1} 0 R]`) +
      dict(base + 1, `/Type /Font /Subtype /CIDFontType2 /BaseFont /${tag}+Onest-Regular /FontDescriptor ${base + 2} 0 R`) +
      dict(base + 2, `/Type /FontDescriptor /FontName /${tag}+Onest-Regular`)
    const before = Buffer.from(`%PDF-1.4\n${font(1, 'AAAAAA')}${font(4, 'AAAAAA')}%%EOF`, 'latin1')
    const after = uniqueSubsetTags(before)
    expect(after.length).toBe(before.length)
    expect(subsetNames(before)).toEqual(['AAAAAA+Onest-Regular', 'AAAAAA+Onest-Regular'])
    expect(subsetNames(after)).toEqual(['AAAAAA+Onest-Regular', 'AAAAAB+Onest-Regular'])
    // Имя совпадает во всех трёх словарях подмножества.
    expect(after.toString('latin1').match(/AAAAAB\+Onest-Regular/g)).toHaveLength(3)
    expect([subsetTag(0), subsetTag(1), subsetTag(26)]).toEqual(['AAAAAA', 'AAAAAB', 'AAAABA'])
  })
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

describe('Смета для любого дома из калькулятора', () => {
  // Раньше смета падала для монолита («рассчитана на каркас из клееного бруса»): PDF после заявки по TITAN не открывался.
  const styles = ['minimal', 'fachwerk', 'chalet', 'monolith'] as const
  const tiers = ['contour', 'whitebox', 'turnkey'] as const
  for (const style of styles)
    for (const tier of tiers)
      for (const area of [100, 380, 800])
        it(`${style}, ${tier}, ${area} м²: итог равен цене, все позиции с положительной ценой`, () => {
          const e = { area, terrace: 50, style, tier, addons: [], floors: area > 250 ? 2 : 1, bathrooms: 3 }
          const sheet = estimateFor(e)
          expect(sheet.total).toBe(breakdown(e).total)
          for (const l of sheet.sections.flatMap((x) => x.lines)) {
            expect(l.price, `${l.name}`).toBeGreaterThan(0)
            expect(l.sum, `${l.name}`).toBe(Math.round(l.qty * l.price))
          }
        })

  it('у монолита свои разделы каркаса, кровли и фасада, без клееного бруса', () => {
    const sheet = estimateFor({ area: 540, terrace: 120, style: 'monolith', tier: 'turnkey', addons: [], floors: 2, bathrooms: 5 })
    const titles = sheet.sections.map((x) => x.title)
    expect(titles).toContain('Монолитный железобетонный каркас')
    expect(titles).toContain('Плоская кровля')
    expect(titles).not.toContain('Домокомплект из клееного бруса')
    // Терраса — деревянная и у монолитного дома: лаги из клееного бруса там уместны.
    const house = sheet.sections.filter((x) => x.title !== 'Терраса').flatMap((x) => x.lines)
    expect(house.filter((l) => /клееного бруса|фахверк/i.test(l.name)).map((l) => l.name)).toEqual([])
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
