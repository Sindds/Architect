import type { StaticImageData } from 'next/image'

export type Tier = 'contour' | 'whitebox' | 'turnkey'
export type Style = 'minimal' | 'fachwerk' | 'chalet' | 'monolith'
export type AddonKey = 'knx' | 'geothermal' | 'spa'
export type ContentMode = 'concept' | 'client'
export type VariantKey = 'default' | 'fachwerk' | 'monolith' | 'scandi'

export interface TierModel {
  title: string
  short: string
  pricePerM2: number
  terracePerM2: number
  daysBase: number
  daysPerM2: number
  includes: string[]
  excludes: string[]
}

export interface StyleModel {
  title: string
  coef: number
  construction: string
}

export interface AddonModel {
  title: string
  price: number
  days: number
  note: string
}

export interface PricingModel {
  tiers: Record<Tier, TierModel>
  styles: Record<Style, StyleModel>
  addons: Record<AddonKey, AddonModel>
}

export interface Picture {
  src: StaticImageData
  alt: string
  caption: 'Визуализация' | 'Схема (иллюстрация)' | 'Сгенерированный портрет'
  /** Лицо сгенерировано: такие портреты допустимы только в режиме concept. */
  generated?: boolean
}

export interface Room {
  name: string
  area: number
}

export interface Project {
  slug: string
  name: string
  style: Style
  area: number
  terrace: number
  floors: number
  bedrooms: number
  bathrooms: number
  tagline: string
  features: string[]
  construction: { foundation: string; walls: string; glazing: string }
  explication: { floor: string; rooms: Room[] }[]
  cover: Picture
  gallery: Picture[]
}

export interface Case {
  slug: string
  title: string
  place: string
  style: Style
  area: number
  terrace: number
  tier: Tier
  addons: AddonKey[]
  factPrice: number
  factDays: number
  deviationNote: string
  task: string
  solution: string
  result: string
  photos: { stage: string; picture: Picture }[]
  reviewId: string
}

export interface Review {
  id: string
  author: string
  initials: string
  object: string
  text: string
  isDemo: boolean
  sourceUrl?: string
}

export interface TeamMember {
  name: string
  initials: string
  photo?: Picture
  role: string
  responsibility: string
  stages: string
}

export interface Step {
  title: string
  days: number
  result: string
  paymentPercent: number
}

export interface FaqItem {
  question: string
  answer: string[]
}

export interface Variant {
  key: VariantKey
  h1Prefix: string
  heroStyleFilter: Style | null
  heroImage: Picture
  firstProject: string
  calcStyle: Style
}

/** Смета-образец: разделы и позиции. Объём позиции = база × k, сумма раздела = доля цены дома. */
export type EstimateUnit = 'м²' | 'м³' | 'м.п.' | 'т' | 'шт.' | 'компл.' | 'рейс' | 'маш.-ч' | 'мес.'
export type EstimateBasis = 'fixed' | 'area' | 'footprint' | 'perimeter' | 'roof' | 'glazing' | 'walls' | 'upper' | 'terrace' | 'months' | 'bathrooms' | 'stairs'

export interface EstimateItem {
  name: string
  unit: EstimateUnit
  basis: EstimateBasis
  k: number
  /** Вес позиции внутри раздела. */
  weight: number
  /** Позиция «за комплект» (объём 1): забирает остаток округления, чтобы раздел сошёлся до рубля. */
  absorb?: true
}

export interface EstimateSection {
  title: string
  /** С какого пакета раздел входит в цену. */
  from: Tier
  /** Доля цены дома в пакете «под ключ», %. Для других пакетов доли нормируются. */
  share: number
  items: EstimateItem[]
}

export interface EstimatePlan {
  geometry: { perimeterK: number; roofK: number; glazingK: number; storeyHeight: number }
  sections: EstimateSection[]
  terrace: { title: string; items: EstimateItem[] }
}
