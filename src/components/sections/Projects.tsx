'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { PRICING, STYLE_ORDER } from '@/content/pricing'
import type { Project, Style } from '@/content/types'
import { formatDays, formatMln } from '@/lib/format'
import { projectPrice } from '@/lib/pricing'
import { useLanding } from '../LandingProvider'
import { SectionHead } from '../ui/SectionHead'

export function Projects({ projects }: { projects: Project[] }) {
  const { openProject } = useLanding()
  const [filter, setFilter] = useState<Style | 'all'>('all')
  const visible = filter === 'all' ? projects : projects.filter((p) => p.style === filter)
  const filters: { key: Style | 'all'; label: string }[] = [
    { key: 'all', label: 'Все' },
    ...STYLE_ORDER.map((s) => ({ key: s, label: PRICING.styles[s].title })),
  ]

  return (
    <section id="projects" aria-labelledby="projects-title" className="border-t border-line bg-sheet py-16 lg:py-24">
      <div className="shell">
        <SectionHead
          id="projects-title"
          index="02"
          label="Проекты"
          title="Четыре проекта — четыре характера"
          lead="Каждый проект адаптируем под участок. Цены — с террасой, без опций; точная смета — после изысканий."
        />

        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Фильтр по стилю">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className="min-h-11 cursor-pointer border border-ink-3 px-4 text-[0.9375rem] transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-sheet"
            >
              {f.label}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid gap-x-6 gap-y-12 md:grid-cols-2" data-testid="projects-grid">
          {visible.map((p) => {
            const contour = projectPrice(p, 'contour')
            const turnkey = projectPrice(p, 'turnkey')
            return (
              <li key={p.slug} className="reveal">
                <article className="group relative">
                  <div className="relative overflow-hidden bg-paper-2">
                    <Image
                      src={p.cover.src}
                      alt={p.cover.alt}
                      placeholder="blur"
                      sizes="(min-width: 1408px) 680px, (min-width: 768px) 50vw, 100vw"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                    <span className="label absolute bottom-0 left-0 bg-sheet/90 px-2 py-1 text-ink-2">{p.cover.caption}</span>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-[2rem] font-medium leading-none">
                      <button
                        type="button"
                        onClick={() => openProject(p.slug)}
                        className="cursor-pointer text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-has-[:focus-visible]:underline"
                        aria-haspopup="dialog"
                      >
                        {p.name}
                      </button>
                    </h3>
                    <p className="label text-ink-2">{PRICING.styles[p.style].title}</p>
                  </div>
                  <p className="dim label num mt-3">
                    <span>
                      {p.area} м² · терраса {p.terrace} м² · {p.floors === 1 ? '1 этаж' : `${p.floors} этажа`}
                    </span>
                  </p>
                  <dl className="num mt-4 grid grid-cols-3 gap-4 border-t border-line pt-4">
                    <div>
                      <dt className="text-sm text-ink-2">Тёплый контур</dt>
                      <dd className="mt-0.5 font-medium">от {formatMln(contour.price)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-ink-2">Под ключ</dt>
                      <dd className="mt-0.5 font-medium">от {formatMln(turnkey.price)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-ink-2">Срок</dt>
                      <dd className="mt-0.5 font-medium">от {formatDays(contour.days)}</dd>
                    </div>
                  </dl>
                  <span aria-hidden className="mt-5 inline-flex items-center gap-1.5 font-medium text-accent">
                    Планировка, состав и цены
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
