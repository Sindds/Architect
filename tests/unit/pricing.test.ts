import { describe, expect, it } from 'vitest'
import { CASES } from '@/content/cases'
import { STEPS, STEPS_EXAMPLE, FAQ } from '@/content/process'
import { PROJECTS } from '@/content/projects'
import type { Style, Tier } from '@/content/types'
import { formatDeviation, formatMln, formatRub } from '@/lib/format'
import { breakdown, daysFor, minContour, minPriceFor, minTurnkey, priceFor, projectPrice } from '@/lib/pricing'
import { heroFor, projectsFor } from '@/lib/variant'

const NBSP = ' '
const project = (slug: string) => {
  const p = PROJECTS.find((x) => x.slug === slug)
  if (!p) throw new Error(slug)
  return p
}

describe('CONTENT-SPEC §5.2 — цены и сроки проектов', () => {
  const table: Record<string, Record<Tier, [number, number]>> = {
    vista: { contour: [35_360_000, 128], whitebox: [49_900_000, 196], turnkey: [69_500_000, 267] },
    nordic: { contour: [26_420_000, 119], whitebox: [37_160_000, 185], turnkey: [51_610_000, 254] },
    titan: { contour: [60_860_000, 144], whitebox: [85_800_000, 215], turnkey: [119_400_000, 291] },
    chalet: { contour: [32_010_000, 122], whitebox: [45_200_000, 188], turnkey: [62_980_000, 258] },
  }
  for (const [slug, tiers] of Object.entries(table)) {
    for (const [tier, [price, days]] of Object.entries(tiers) as [Tier, [number, number]][]) {
      it(`${slug} · ${tier}`, () => {
        expect(projectPrice(project(slug), tier)).toEqual({ price, days })
      })
    }
  }

  it('минимумы: под ключ 51 610 000 ₽, контур 26 420 000 ₽ (NORDIC)', () => {
    expect(minTurnkey(PROJECTS)).toBe(51_610_000)
    expect(minContour(PROJECTS)).toBe(26_420_000)
  })

  it('«от»-цены за м² по стилям', () => {
    const order: Style[] = ['minimal', 'fachwerk', 'chalet', 'monolith']
    expect(order.map((s) => minPriceFor('contour', s))).toEqual([83_600, 88_000, 95_040, 105_600])
    expect(order.map((s) => minPriceFor('whitebox', s))).toEqual([118_750, 125_000, 135_000, 150_000])
    expect(order.map((s) => minPriceFor('turnkey', s))).toEqual([166_250, 175_000, 189_000, 210_000])
  })

  it('калькулятор по умолчанию: 350 м², фахверк, под чистовую, терраса 50, KNX → 47 150 000 ₽, 202 дня', () => {
    const e = { area: 350, terrace: 50, style: 'fachwerk', tier: 'whitebox', addons: ['knx'] } as const
    expect(priceFor({ ...e, addons: [...e.addons] })).toBe(47_150_000)
    expect(breakdown({ ...e, addons: [...e.addons] }).days).toBe(202)
  })

  it('калькулятор никогда не ниже «от»-цены пакета', () => {
    for (const tier of ['contour', 'whitebox', 'turnkey'] as Tier[]) {
      for (const style of ['minimal', 'fachwerk', 'chalet', 'monolith'] as Style[]) {
        for (const area of [100, 237, 350, 800]) {
          const b = breakdown({ area, terrace: 0, style, tier, addons: [] })
          expect(b.total).toBeGreaterThanOrEqual(round10kFloor(area * minPriceFor(tier, style)))
        }
      }
    }
  })

  it('срок зависит от пакета', () => {
    expect(daysFor(350, 'contour')).toBeLessThan(daysFor(350, 'whitebox'))
    expect(daysFor(350, 'whitebox')).toBeLessThan(daysFor(350, 'turnkey'))
  })
})

const round10kFloor = (x: number) => Math.floor(x / 10_000) * 10_000

describe('CONTENT-SPEC §5.3 — кейсы', () => {
  const plans: Record<string, [number, number]> = {
    'dom-u-vody': [57_100_000, 210],
    'rezidenciya-na-sklone': [137_200_000, 316],
    'dom-sredi-sosen': [28_160_000, 121],
  }
  for (const c of CASES) {
    it(`план «${c.title}» по модели`, () => {
      const [price, days] = plans[c.slug] ?? [0, 0]
      expect(priceFor(c)).toBe(price)
      expect(daysFor(c.area, c.tier, c.addons)).toBe(days)
    })
  }
  it('отклонение кейса 2 — +2,7%', () => {
    const c = CASES[1]!
    expect(formatDeviation(priceFor(c), c.factPrice)).toBe('+2,7%')
  })
})

describe('CONTENT-SPEC §5.4 — этапы', () => {
  it('сумма дней = daysFor(VISTA, под ключ) = 267, сумма оплат = 100%', () => {
    expect(STEPS.reduce((s, x) => s + x.days, 0)).toBe(daysFor(STEPS_EXAMPLE.area, STEPS_EXAMPLE.tier))
    expect(STEPS.reduce((s, x) => s + x.days, 0)).toBe(267)
    expect(STEPS.reduce((s, x) => s + x.paymentPercent, 0)).toBe(100)
  })
  it('ответ FAQ про этапы совпадает с этапами', () => {
    const text = FAQ.at(-1)!.answer.join(' ')
    for (const s of STEPS) expect(text).toContain(String(s.days))
    expect(text).toContain('267')
  })
})

describe('CONTENT-SPEC §9 — H1 вариантов', () => {
  it.each([
    ['default', '51,6'],
    ['fachwerk', '69,5'],
    ['monolith', '119,4'],
    ['scandi', '51,6'],
  ] as const)('%s → «под ключ от %s млн ₽»', (key, mln) => {
    expect(heroFor(key).h1).toContain(`под ключ от ${mln}${NBSP}млн${NBSP}₽`)
  })
  it('первый проект в сетке — проект кампании', () => {
    expect(projectsFor('monolith')[0]?.slug).toBe('titan')
    expect(projectsFor('fachwerk')[0]?.slug).toBe('vista')
    expect(projectsFor('default')[0]?.slug).toBe('nordic')
  })
})

describe('Проекты — экспликация', () => {
  for (const p of PROJECTS) {
    it(`${p.name}: сумма помещений = ${p.area} м², спален ${p.bedrooms}, санузлов ${p.bathrooms}`, () => {
      const rooms = p.explication.flatMap((f) => f.rooms)
      expect(rooms.reduce((s, r) => s + r.area, 0)).toBe(p.area)
      expect(rooms.filter((r) => /спальн/i.test(r.name) && !/при /.test(r.name)).length).toBe(p.bedrooms)
      expect(rooms.filter((r) => /санузел|ванная/i.test(r.name)).length).toBe(p.bathrooms)
      expect(p.explication.length).toBe(p.floors)
    })
  }
})

describe('Форматирование', () => {
  it('рубли и миллионы', () => {
    expect(formatRub(51_610_000)).toBe(`51${NBSP}610${NBSP}000${NBSP}₽`)
    expect(formatMln(62_980_000)).toBe(`63${NBSP}млн${NBSP}₽`)
    expect(formatMln(119_400_000)).toBe(`119,4${NBSP}млн${NBSP}₽`)
  })
})
