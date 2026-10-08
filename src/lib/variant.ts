import { PROJECTS } from '@/content/projects'
import { VARIANTS } from '@/content/variants'
import type { Project, VariantKey } from '@/content/types'
import { formatDays, formatMln } from './format'
import { minTurnkey, minTurnkeyDays } from './pricing'

export function heroFor(key: VariantKey) {
  const v = VARIANTS[key]
  return {
    variant: v,
    h1: `${v.h1Prefix} — под ключ от ${formatMln(minTurnkey(PROJECTS, v.heroStyleFilter))}`,
    subtitle: `Под ключ — от ${formatDays(minTurnkeyDays(PROJECTS, v.heroStyleFilter))}. Цена фиксируется в договоре и меняется только по допсоглашению.`,
  }
}

/** Проекты в порядке для варианта: первым — проект кампании. */
export function projectsFor(key: VariantKey): Project[] {
  const first = VARIANTS[key].firstProject
  return [...PROJECTS].sort((a, b) => Number(b.slug === first) - Number(a.slug === first))
}
