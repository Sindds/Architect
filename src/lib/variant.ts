import { PROJECTS } from '@/content/projects'
import { VARIANTS } from '@/content/variants'
import type { Project, VariantKey } from '@/content/types'
import { formatDaysFrom, formatMln } from './format'
import { minContour, minTurnkey, minTurnkeyDays } from './pricing'

export function heroFor(key: VariantKey) {
  const v = VARIANTS[key]
  // В H1 — самая низкая цена проекта на сайте (тёплый контур), чтобы ниже на странице не нашлось
  // цены меньше заголовка. Подзаголовок называет оба уровня: контур и под ключ (CONTENT-SPEC §4).
  const contour = formatMln(minContour(PROJECTS, v.heroStyleFilter))
  const turnkey = formatMln(minTurnkey(PROJECTS, v.heroStyleFilter))
  const price = `от ${contour}`
  return {
    variant: v,
    h1: `${v.h1Prefix} — ${price}`,
    h1Prefix: v.h1Prefix,
    h1Price: price,
    subtitle: `Тёплый контур от ${contour}, дом под ключ от ${turnkey}. Цена закреплена в договоре, а от подписи до ключей проходит ${formatDaysFrom(minTurnkeyDays(PROJECTS, v.heroStyleFilter))}.`,
  }
}

/** Проекты в порядке для варианта: первым — проект кампании. */
export function projectsFor(key: VariantKey): Project[] {
  const first = VARIANTS[key].firstProject
  return [...PROJECTS].sort((a, b) => Number(b.slug === first) - Number(a.slug === first))
}
