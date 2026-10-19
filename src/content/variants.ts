import { MEDIA } from './media'
import { VARIANT_TITLES } from './texts'
import type { Variant, VariantKey } from './types'

// Варианты первого экрана под рекламные кампании — CONTENT-SPEC §9. Заголовки — texts.ts, VARIANT_TITLES.
// Цена в H1 не вводится руками: «от …» (минимальный тёплый контур) считает pricing.ts по проектам стиля варианта.
export const VARIANTS: Record<VariantKey, Variant> = {
  default: {
    key: 'default',
    h1Prefix: VARIANT_TITLES.default,
    heroStyleFilter: null,
    heroImage: MEDIA.heroForest,
    firstProject: 'nordic',
    calcStyle: 'fachwerk',
  },
  fachwerk: {
    key: 'fachwerk',
    h1Prefix: VARIANT_TITLES.fachwerk,
    heroStyleFilter: 'fachwerk',
    heroImage: MEDIA.vistaExterior,
    firstProject: 'vista',
    calcStyle: 'fachwerk',
  },
  monolith: {
    key: 'monolith',
    h1Prefix: VARIANT_TITLES.monolith,
    heroStyleFilter: 'monolith',
    heroImage: MEDIA.titanExterior,
    firstProject: 'titan',
    calcStyle: 'monolith',
  },
  scandi: {
    key: 'scandi',
    h1Prefix: VARIANT_TITLES.scandi,
    heroStyleFilter: 'minimal',
    heroImage: MEDIA.nordicExterior,
    firstProject: 'nordic',
    calcStyle: 'minimal',
  },
}

export const CAMPAIGN_VARIANTS = ['fachwerk', 'monolith', 'scandi'] as const

