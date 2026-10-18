import { PROJECTS } from '@/content/projects'
import { COPY } from '@/content/copy'
import { VARIANTS } from '@/content/variants'
import type { Project, VariantKey } from '@/content/types'
import { formatDaysFrom, formatMlnFrom } from './format'
import { minCalc } from './pricing'

export function heroFor(key: VariantKey) {
  const v = VARIANTS[key]
  // В H1 — самая низкая цена на сайте: тёплый контур на минимальную площадь калькулятора, чтобы ниже на странице
  // (калькулятор, квиз, карточки) не нашлось цены меньше заголовка (правка заказчика 17.10.2026, CONTENT-SPEC §4).
  // Подзаголовок называет оба уровня: контур и под ключ.
  const contour = formatMlnFrom(minCalc('contour', v.heroStyleFilter).price)
  const turnkey = formatMlnFrom(minCalc('turnkey', v.heroStyleFilter).price)
  const price = `от ${contour}`
  return {
    variant: v,
    h1: `${v.h1Prefix} — ${price}`,
    h1Prefix: v.h1Prefix,
    h1Price: price,
    subtitle: COPY.hero.subtitle(formatDaysFrom(minCalc('turnkey', v.heroStyleFilter).days), contour, turnkey),
  }
}

/** Проекты в порядке для варианта: первым — проект кампании. */
export function projectsFor(key: VariantKey): Project[] {
  const first = VARIANTS[key].firstProject
  return [...PROJECTS].sort((a, b) => Number(b.slug === first) - Number(a.slug === first))
}
