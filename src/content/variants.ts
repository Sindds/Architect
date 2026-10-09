import { MEDIA } from './media'
import type { Variant, VariantKey } from './types'

// Варианты первого экрана под рекламные кампании — CONTENT-SPEC §9.
// Цена в H1 не вводится руками: «от …» (минимальный тёплый контур) считает pricing.ts по проектам стиля варианта.
export const VARIANTS: Record<VariantKey, Variant> = {
  default: {
    key: 'default',
    h1Prefix: 'Дома из клееного бруса с панорамным остеклением в Подмосковье',
    heroStyleFilter: null,
    heroImage: MEDIA.heroForest,
    firstProject: 'nordic',
    calcStyle: 'fachwerk',
  },
  fachwerk: {
    key: 'fachwerk',
    h1Prefix: 'Фахверковые дома с панорамным остеклением в Подмосковье',
    heroStyleFilter: 'fachwerk',
    heroImage: MEDIA.vistaExterior,
    firstProject: 'vista',
    calcStyle: 'fachwerk',
  },
  monolith: {
    key: 'monolith',
    h1Prefix: 'Монолитные дома с панорамными фасадами в Подмосковье',
    heroStyleFilter: 'monolith',
    heroImage: MEDIA.titanExterior,
    firstProject: 'titan',
    calcStyle: 'monolith',
  },
  scandi: {
    key: 'scandi',
    h1Prefix: 'Одноэтажные дома в скандинавском стиле в Подмосковье',
    heroStyleFilter: 'minimal',
    heroImage: MEDIA.nordicExterior,
    firstProject: 'nordic',
    calcStyle: 'minimal',
  },
}

export const CAMPAIGN_VARIANTS = ['fachwerk', 'monolith', 'scandi'] as const

export const isVariantKey = (v: string): v is VariantKey => v in VARIANTS
