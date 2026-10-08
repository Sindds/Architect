'use client'

import { ArrowUpRight } from 'lucide-react'
import { CASES } from '@/content/cases'
import { formatDayDelta, formatPriceDelta } from '@/lib/format'
import { daysFor, priceFor } from '@/lib/pricing'
import { useLanding } from '../LandingProvider'

/** «+9 дней» без подлежащего непонятно: уточняем, что это к сроку. */
const dayNote = (plan: number, fact: number) => {
  const d = formatDayDelta(plan, fact)
  return d.startsWith('+') ? `${d} к сроку` : d
}

/** Сданные дома: план и факт по смете и сроку. Клик открывает окно кейса (/?case=slug). */
export function DeliveredList() {
  const { openCase } = useLanding()
  return (
    <ul id="delivered" data-testid="delivered" className="mt-5 grid scroll-mt-28 gap-2">
      {CASES.map((c) => (
        <li key={c.slug}>
          <button
            type="button"
            onClick={() => openCase(c.slug)}
            className="group flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-2xl border border-line bg-subtle px-4 py-3 text-left transition-colors hover:border-fg"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{c.title}</span>
              <span className="mt-0.5 block text-sm text-muted">
                {formatPriceDelta(priceFor(c), c.factPrice)}, {dayNote(daysFor(c.area, c.tier, c.addons), c.factDays)}
              </span>
            </span>
            <ArrowUpRight aria-hidden className="size-4 shrink-0 text-accent transition-transform group-hover:rotate-45 motion-reduce:transition-none" />
          </button>
        </li>
      ))}
    </ul>
  )
}
