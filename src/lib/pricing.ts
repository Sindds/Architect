import { PRICING } from '@/content/pricing'
import type { AddonKey, PricingModel, Style, Tier } from '@/content/types'

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
