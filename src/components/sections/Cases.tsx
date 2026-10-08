'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { CASES } from '@/content/cases'
import { PRICING } from '@/content/pricing'
import { formatDayDelta, formatDeviation, formatMln } from '@/lib/format'
import { daysFor, priceFor } from '@/lib/pricing'
import { useLanding } from '../LandingProvider'
import { SectionHead } from '../ui/SectionHead'

export function Cases() {
  const { openCase } = useLanding()
  return (
    <section id="cases" aria-labelledby="cases-title" className="on-dark bg-graphite py-16 text-on-graphite lg:py-24">
      <div className="shell">
        <SectionHead
          id="cases-title"
          tone="dark"
          index="03"
          label="Кейсы"
          title="План и факт по сданным домам — с отклонениями"
          lead="Идеальных строек не бывает. Бывает честный учёт: что поменялось, почему и кто это согласовал."
        />
        <ul className="mt-12 grid gap-8 lg:grid-cols-3">
          {CASES.map((c) => {
            const planPrice = priceFor(c)
            const planDays = daysFor(c.area, c.tier, c.addons)
            const done = c.photos.at(-1)?.picture
            return (
              <li key={c.slug} className="reveal">
                <article className="group relative flex h-full flex-col border border-on-graphite-2/30 bg-graphite-2">
                  {done && (
                    <div className="overflow-hidden">
                      <Image
                        src={done.src}
                        alt={done.alt}
                        placeholder="blur"
                        sizes="(min-width: 1024px) 420px, 100vw"
                        className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5 lg:p-6">
                    <p className="label text-on-graphite-2">
                      {c.place} · {PRICING.styles[c.style].title.toLowerCase()}, {c.area} м²
                    </p>
                    <h3 className="mt-2 font-display text-[2rem] font-medium leading-tight">
                      <button
                        type="button"
                        onClick={() => openCase(c.slug)}
                        aria-haspopup="dialog"
                        className="cursor-pointer text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-has-[:focus-visible]:underline"
                      >
                        «{c.title}»
                      </button>
                    </h3>
                    <dl className="num mt-5 grid grid-cols-2 gap-px bg-on-graphite-2/25">
                      <div className="bg-graphite-2 py-3 pr-3">
                        <dt className="label text-on-graphite-2">Смета: план → факт</dt>
                        <dd className="mt-1 font-medium">
                          {formatMln(planPrice)} → {formatMln(c.factPrice)}
                        </dd>
                        <dd className="text-accent-on-dark">{formatDeviation(planPrice, c.factPrice)}</dd>
                      </div>
                      <div className="bg-graphite-2 py-3 pl-3">
                        <dt className="label text-on-graphite-2">Срок: план → факт</dt>
                        <dd className="mt-1 font-medium">
                          {planDays} → {c.factDays} дн.
                        </dd>
                        <dd className="text-accent-on-dark">{formatDayDelta(planDays, c.factDays)}</dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-on-graphite-2">{c.deviationNote}</p>
                    <span aria-hidden className="mt-auto inline-flex items-center gap-1.5 pt-5 font-medium text-accent-on-dark">
                      Задача, решение, фото этапов
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
