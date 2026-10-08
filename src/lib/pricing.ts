import { ESTIMATE } from '@/content/estimate'
import { PRICING } from '@/content/pricing'
import type { AddonKey, EstimateBasis, EstimateItem, EstimatePlan, EstimateUnit, PricingModel, Style, Tier } from '@/content/types'

// Единственное место, где считаются цены и сроки (CONTENT-SPEC §5.1).
// price = round10k(area × tierPrice × styleCoef + terrace × terracePrice[tier] + Σaddons)
// days  = round(tierBase + tierK × area) + Σaddon.days

export interface Estimate {
  area: number
  terrace: number
  style: Style
  tier: Tier
  addons: AddonKey[]
}

export interface Breakdown {
  house: number
  terrace: number
  addons: { key: AddonKey; title: string; price: number }[]
  total: number
  perM2: number
  days: number
}

/** Шаг округления итоговой цены. */
export const ROUNDING_STEP = 10_000

export const round10k = (x: number) => Math.round(x / ROUNDING_STEP) * ROUNDING_STEP

export function priceFor(e: Estimate, model: PricingModel = PRICING): number {
  const tier = model.tiers[e.tier]
  const house = e.area * tier.pricePerM2 * model.styles[e.style].coef
  const terrace = e.terrace * tier.terracePerM2
  const addons = e.addons.reduce((sum, key) => sum + model.addons[key].price, 0)
  return round10k(house + terrace + addons)
}

export function daysFor(area: number, tierKey: Tier, addons: AddonKey[] = [], model: PricingModel = PRICING): number {
  const tier = model.tiers[tierKey]
  return Math.round(tier.daysBase + tier.daysPerM2 * area) + addons.reduce((sum, key) => sum + model.addons[key].days, 0)
}

export function breakdown(e: Estimate, model: PricingModel = PRICING): Breakdown {
  const tier = model.tiers[e.tier]
  const total = priceFor(e, model)
  return {
    house: Math.round(e.area * tier.pricePerM2 * model.styles[e.style].coef),
    terrace: e.terrace * tier.terracePerM2,
    addons: e.addons.map((key) => ({ key, title: model.addons[key].title, price: model.addons[key].price })),
    total,
    perM2: Math.round(total / e.area),
    days: daysFor(e.area, e.tier, e.addons, model),
  }
}

/** «От»-цена за м² дома для пакета и стиля. */
export function minPriceFor(tier: Tier, style: Style, model: PricingModel = PRICING): number {
  return Math.round(model.tiers[tier].pricePerM2 * model.styles[style].coef)
}

interface Priced {
  style: Style
  area: number
  terrace: number
}

export function projectPrice(p: Priced, tier: Tier, model: PricingModel = PRICING) {
  return {
    price: priceFor({ area: p.area, terrace: p.terrace, style: p.style, tier, addons: [] }, model),
    days: daysFor(p.area, tier, [], model),
  }
}

function minOf(projects: Priced[], tier: Tier, style: Style | null, pick: 'price' | 'days', model: PricingModel) {
  const pool = style ? projects.filter((p) => p.style === style) : projects
  if (pool.length === 0) throw new Error(`Нет проектов в стиле ${style}`)
  return Math.min(...pool.map((p) => projectPrice(p, tier, model)[pick]))
}

/** Минимальная цена «под ключ» по проектам каталога (по всем или по одному стилю). */
export const minTurnkey = (projects: Priced[], style: Style | null = null, model: PricingModel = PRICING) =>
  minOf(projects, 'turnkey', style, 'price', model)

export const minTurnkeyDays = (projects: Priced[], style: Style | null = null, model: PricingModel = PRICING) =>
  minOf(projects, 'turnkey', style, 'days', model)

export const minContour = (projects: Priced[], style: Style | null = null, model: PricingModel = PRICING) =>
  minOf(projects, 'contour', style, 'price', model)

// ── Смета-образец ─────────────────────────────────────────────────────────────
// Цена дома из breakdown() раскладывается по разделам (доли из content/estimate.ts) и позициям (веса).
// Сумма позиции = объём × цена за единицу. Остаток округления раздела забирает позиция «за комплект»,
// поэтому подытог раздела равен его доле до рубля, а итог сметы равен цене договора.

export interface EstimateInput extends Estimate {
  floors: number
  bathrooms: number
}

export interface EstimateLine {
  name: string
  unit: EstimateUnit
  qty: number
  price: number
  sum: number
}

export interface EstimateSheet {
  sections: { title: string; lines: EstimateLine[]; subtotal: number }[]
  total: number
  days: number
}

const TIER_ORDER: Tier[] = ['contour', 'whitebox', 'turnkey']

/** Объём с точностью, принятой в сметах: м³ и тонны — до десятых, остальное — целые. */
const roundQty = (x: number, unit: EstimateUnit) => (unit === 'м³' || unit === 'т' ? Math.round(x * 10) / 10 : Math.round(x))

function geometry(e: EstimateInput, days: number, plan: EstimatePlan): Record<EstimateBasis, number> {
  const g = plan.geometry
  const footprint = e.area / e.floors
  const perimeter = 4 * Math.sqrt(footprint) * g.perimeterK
  const glazing = e.area * g.glazingK
  return {
    fixed: 1,
    area: e.area,
    footprint,
    perimeter,
    roof: footprint * g.roofK,
    glazing,
    walls: perimeter * g.storeyHeight * e.floors - glazing,
    upper: e.area - footprint,
    terrace: e.terrace,
    months: Math.ceil(days / 30),
    bathrooms: e.bathrooms,
    stairs: e.floors - 1,
  }
}

function linesFor(items: EstimateItem[], target: number, basis: Record<EstimateBasis, number>): EstimateLine[] {
  const sized = items.map((it) => ({ it, qty: roundQty(basis[it.basis] * it.k, it.unit) })).filter((x) => x.qty > 0)
  const weight = sized.reduce((s, x) => s + x.it.weight, 0)
  const lines = sized.map(({ it, qty }) => {
    const price = Math.max(10, Math.round((target * it.weight) / weight / qty / 10) * 10)
    return { name: it.name, unit: it.unit, qty, price, sum: Math.round(qty * price), absorb: it.absorb === true }
  })
  const absorber = lines.find((l) => l.absorb && l.qty === 1)
  if (!absorber) throw new Error('В разделе сметы нужна позиция «за комплект» с объёмом 1')
  const rest = lines.filter((l) => l !== absorber).reduce((s, l) => s + l.sum, 0)
  absorber.price = target - rest
  absorber.sum = absorber.price
  return lines.map(({ name, unit, qty, price, sum }) => ({ name, unit, qty, price, sum }))
}

/** Подробная смета: разделы, позиции с объёмом и ценой; итог равен breakdown().total. */
export function estimateFor(e: EstimateInput, model: PricingModel = PRICING, plan: EstimatePlan = ESTIMATE): EstimateSheet {
  if (!model.styles[e.style].construction.startsWith('Клееный брус')) throw new Error('Смета-образец рассчитана на каркас из клееного бруса')
  const b = breakdown(e, model)
  const basis = geometry(e, b.days, plan)
  const included = plan.sections.filter((s) => TIER_ORDER.indexOf(s.from) <= TIER_ORDER.indexOf(e.tier))
  const shares = included.reduce((s, x) => s + x.share, 0)

  let allocated = 0
  const sections = included.map((s, i) => {
    const target = i === included.length - 1 ? b.house - allocated : Math.round((b.house * s.share) / shares)
    allocated += target
    return { title: s.title, lines: linesFor(s.items, target, basis) }
  })
  if (e.terrace > 0) sections.push({ title: plan.terrace.title, lines: linesFor(plan.terrace.items, b.terrace, basis) })
  if (b.addons.length > 0) {
    sections.push({ title: 'Дополнительное оборудование', lines: b.addons.map((a) => ({ name: a.title, unit: 'компл.' as const, qty: 1, price: a.price, sum: a.price })) })
  }

  // Итог договора округлён до 10 000 ₽: разницу относим на общеплощадочные расходы.
  const site = sections.flatMap((s) => s.lines).find((l) => l.name.startsWith('Общеплощадочные'))!
  const raw = sections.reduce((sum, s) => sum + s.lines.reduce((x, l) => x + l.sum, 0), 0)
  site.price += b.total - raw
  site.sum = site.price

  return {
    sections: sections.map((s) => ({ ...s, subtotal: s.lines.reduce((x, l) => x + l.sum, 0) })),
    total: b.total,
    days: b.days,
  }
}
