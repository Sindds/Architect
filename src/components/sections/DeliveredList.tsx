'use client'

import { ArrowUpRight } from 'lucide-react'
import { CASES } from '@/content/cases'
import { useLanding } from '../LandingProvider'
import { revealOrder } from '@/lib/reveal'

/** Сданные дома. Клик открывает окно кейса (/?case=slug) с планом и фактом по смете и сроку. */
export function DeliveredList() {
  const { openCase } = useLanding()
  return (
    <ul id="delivered" data-testid="delivered" className="mt-5 grid scroll-mt-28 gap-2">
      {CASES.map((c, i) => (
        <li key={c.slug} className="reveal" style={revealOrder(i)}>
          <button
            type="button"
            onClick={() => openCase(c.slug)}
            className="group flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-2xl border border-line bg-subtle px-4 py-3 text-left transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-fg hover:shadow-lg active:scale-[0.99] motion-reduce:transition-none"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{c.title}</span>
            </span>
            <ArrowUpRight aria-hidden className="size-4 shrink-0 text-accent transition-transform group-hover:rotate-45 motion-reduce:transition-none" />
          </button>
        </li>
      ))}
    </ul>
  )
}
