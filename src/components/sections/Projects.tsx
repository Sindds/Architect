'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { COPY } from '@/content/copy'
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
  const filters: { key: Style | 'all'; label: string }[] = [{ key: 'all', label: 'Все' }, ...STYLE_ORDER.map((s) => ({ key: s, label: PRICING.styles[s].title }))]

  return (
    <section id="projects" aria-labelledby="projects-title" className="border-t border-line">
      <div className="shell py-16 sm:py-24">
        <SectionHead id="projects-title" index={2} copy={COPY.sections.projects} />

        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Фильтр по стилю">
          {filters.map((f) => (
            <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)} className="chip">
              {f.label}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-2" data-testid="projects-grid">
          {visible.map((p) => {
            const contour = projectPrice(p, 'contour')
            const turnkey = projectPrice(p, 'turnkey')
            return (
              <li key={p.slug} className="reveal">
                <article className="group relative">
                  <div data-testid="project-card" className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-[#0a0b0d] shadow-lg sm:aspect-[16/11]">
                    <Image
                      src={p.cover.src}
                      alt={p.cover.alt}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1280px) 620px, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04] motion-reduce:transition-none"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="label rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-white backdrop-blur-md">{PRICING.styles[p.style].title}</span>
                      <span className="label num rounded-full border border-white/20 bg-white/20 px-3 py-1.5 font-medium text-white backdrop-blur-md">
                        {p.area} м²
                      </span>
                    </div>
                    <span className="label absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1.5 font-medium text-[#d4d8dd]">{p.cover.caption}</span>
                    <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-white sm:inset-x-6 sm:bottom-6">
                      <div>
                        <h3 className="display text-3xl font-bold sm:text-4xl">
                          <button
                            type="button"
                            onClick={() => openProject(p.slug)}
                            aria-haspopup="dialog"
                            className="cursor-pointer text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                          >
                            {p.name}
                          </button>
                        </h3>
                        <p className="label num mt-1 font-medium text-[#d4d8dd]">
                          терраса {p.terrace} м² · {p.floors === 1 ? '1 этаж' : `${p.floors} этажа`} · от {formatDays(contour.days)}
                        </p>
                      </div>
                      <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#111315] transition-transform group-hover:rotate-45 motion-reduce:transition-none">
                        <ArrowUpRight className="size-5" />
                      </span>
                    </div>
                    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-accent-deco ring-offset-2 group-has-[:focus-visible]:ring-2" />
                  </div>
                  <dl className="num mt-3 grid grid-cols-2 gap-3">
                    <div className="card px-4 py-3">
                      <dt className="text-sm text-muted">Тёплый контур</dt>
                      <dd className="text-lg font-semibold">от {formatMln(contour.price)}</dd>
                    </div>
                    <div className="card px-4 py-3">
                      <dt className="text-sm text-muted">Под ключ</dt>
                      <dd className="text-lg font-semibold">от {formatMln(turnkey.price)}</dd>
                    </div>
                  </dl>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
