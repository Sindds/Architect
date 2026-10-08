'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { CASES } from '@/content/cases'
import { COPY } from '@/content/copy'
import { PRICING } from '@/content/pricing'
import { formatDayDelta, formatDeviation, formatMln } from '@/lib/format'
import { daysFor, priceFor } from '@/lib/pricing'
import { useLanding } from '../LandingProvider'
import { SectionHead } from '../ui/SectionHead'

/** Кейсы на тёмной карточке во всю ширину, как блок реальных объектов у образца. */
export function Cases() {
  const { openCase } = useLanding()
  return (
    <section id="cases" aria-labelledby="cases-title" className="mx-auto w-full max-w-[100rem] px-2 sm:px-4 md:px-6">
      <div className="on-dark rounded-[24px] border border-white/10 bg-inverse px-4 py-14 text-on-inverse sm:rounded-[36px] sm:px-8 sm:py-20 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <SectionHead id="cases-title" index={3} copy={COPY.sections.cases} tone="dark" />
          <ul className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-3">
            {CASES.map((c) => {
              const planPrice = priceFor(c)
              const planDays = daysFor(c.area, c.tier, c.addons)
              const done = c.photos.at(-1)?.picture
              return (
                <li key={c.slug} className="reveal">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition-colors hover:bg-white/[0.07]">
                    {done && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={done.src}
                          alt={done.alt}
                          fill
                          placeholder="blur"
                          sizes="(min-width: 1024px) 400px, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
                        />
                        <span className="label absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1.5 font-medium text-[#d4d8dd]">{c.place}</span>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <p className="label font-medium text-on-inverse-muted">
                        {PRICING.styles[c.style].title}, {c.area} м²
                      </p>
                      <h3 className="display mt-2 text-2xl font-bold">
                        <button
                          type="button"
                          onClick={() => openCase(c.slug)}
                          aria-haspopup="dialog"
                          className="cursor-pointer text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-has-[:focus-visible]:underline"
                        >
                          «{c.title}»
                        </button>
                      </h3>
                      <dl className="num mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-white/[0.06] p-3">
                          <dt className="label font-medium text-on-inverse-muted">Смета</dt>
                          <dd className="mt-1 font-semibold">
                            {formatMln(planPrice)} → {formatMln(c.factPrice)}
                          </dd>
                          <dd className="text-sm text-[#9fc0de]">{formatDeviation(planPrice, c.factPrice)}</dd>
                        </div>
                        <div className="rounded-2xl bg-white/[0.06] p-3">
                          <dt className="label font-medium text-on-inverse-muted">Срок, дней</dt>
                          <dd className="mt-1 font-semibold">
                            {planDays} → {c.factDays}
                          </dd>
                          <dd className="text-sm text-[#9fc0de]">{formatDayDelta(planDays, c.factDays)}</dd>
                        </div>
                      </dl>
                      <p className="mt-4 text-on-inverse-muted">{c.deviationNote}</p>
                      <span aria-hidden className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[#9fc0de]">
                        Задача, решение и фото этапов
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
