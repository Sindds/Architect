import { PROJECTS } from '@/content/projects'
import { VARIANTS } from '@/content/variants'
import type { Project, VariantKey } from '@/content/types'
import { formatDaysFrom, formatMln } from './format'
import { minTurnkey, minTurnkeyDays } from './pricing'

export function heroFor(key: VariantKey) {
  const v = VARIANTS[key]
  const price = `под ключ от ${formatMln(minTurnkey(PROJECTS, v.heroStyleFilter))}`
  return {
    variant: v,
    /** Полный H1 по формуле CONTENT-SPEC §4: префикс варианта и минимальная цена «под ключ». */
    h1: `${v.h1Prefix} — ${price}`,
    h1Prefix: v.h1Prefix,
    h1Price: price,
    subtitle: `Проектируем, строим и сдаём дом по одному договору. Цена закреплена в нём, а от подписи до ключей проходит ${formatDaysFrom(minTurnkeyDays(PROJECTS, v.heroStyleFilter))}.`,
  }
}

/** Проекты в порядке для варианта: первым — проект кампании. */
export function projectsFor(key: VariantKey): Project[] {
  const first = VARIANTS[key].firstProject
  return [...PROJECTS].sort((a, b) => Number(b.slug === first) - Number(a.slug === first))
}
