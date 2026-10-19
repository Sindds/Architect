'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { COPY, PROJECTS_TEXT as T } from '@/content/texts'
import { PRICING, STYLE_ORDER } from '@/content/pricing'
import type { Project, Style } from '@/content/types'
import { formatDaysFrom, formatMln } from '@/lib/format'
import { nbsp } from '@/lib/typography'
import { projectPrice } from '@/lib/pricing'
import { GALLERY_SIZES, warmPicture } from '@/lib/preload-image'
import { useLanding } from '../LandingProvider'
import { SectionHead } from '../ui/SectionHead'
import { revealOrder } from '@/lib/reveal'

/**
 * Наведение, касание или фокус на карточке: заранее грузим код окна проекта и первую картинку галереи.
 * Между наведением и щелчком проходит 100–300 мс — к открытию окна картинка уже в кэше.
 */
function warmProject(p: Project) {
  void import('../modals/ProjectModal')
  const first = p.gallery[0]
  if (first) warmPicture(first, GALLERY_SIZES, 'high')
}

const CARD_SIZES = '(min-width: 1280px) 620px, (min-width: 768px) 50vw, 100vw'

export function Projects({ projects }: { projects: Project[] }) {
  const { openProject } = useLanding()

  // Блок «Проекты» ленивый (content-visibility: auto), а картинки в нём — loading="lazy": браузер начинал
  // их грузить, только когда блок подходил к экрану, и при прокрутке обложки появлялись с задержкой.
  // После загрузки страницы, в простое, скачиваем обложки заранее с низким приоритетом — первый экран не страдает.
  useEffect(() => {
    const warm = () => projects.forEach((p) => warmPicture(p.cover, CARD_SIZES, 'low'))
    const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(warm, { timeout: 3000 }) : setTimeout(warm, 1500))
    if (document.readyState === 'complete') idle()
    else window.addEventListener('load', idle, { once: true })
    return () => window.removeEventListener('load', idle)
  }, [projects])
  const [filter, setFilter] = useState<Style | 'all'>('all')
  const visible = filter === 'all' ? projects : projects.filter((p) => p.style === filter)
  const filters: { key: Style | 'all'; label: string }[] = [{ key: 'all', label: T.filterAll }, ...STYLE_ORDER.map((s) => ({ key: s, label: PRICING.styles[s].title }))]

  return (
    <section id="projects" aria-labelledby="projects-title" className="lazy-section border-t border-line">
      <div className="shell py-16 sm:py-24">
        <SectionHead id="projects-title" copy={COPY.sections.projects} />

        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label={T.filterLabel}>
          {filters.map((f) => (
            <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)} className="chip">
              {f.label}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-2" data-testid="projects-grid">
          {visible.map((p, i) => {
            const contour = projectPrice(p, 'contour')
            const turnkey = projectPrice(p, 'turnkey')
            return (
              <li key={p.slug} className="reveal" style={revealOrder(i)}>
                {/* Окно открывает щелчок по любому месту карточки: по фото, стрелке, описанию и ценам.
                    С клавиатуры — кнопка с названием: Enter и пробел дают click, он всплывает сюда. */}
                <article
                  className="group relative cursor-pointer"
                  onClick={() => openProject(p.slug)}
                  onPointerEnter={() => warmProject(p)}
                  onFocus={() => warmProject(p)}
                >
                  <div data-testid="project-card" className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-[#0a0b0d] shadow-lg transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-2 group-hover:shadow-2xl group-active:scale-[0.985] motion-reduce:transition-none sm:aspect-[16/11]">
                    <Image
                      src={p.cover.src}
                      alt={p.cover.alt}
                      fill
                      placeholder="blur"
                      sizes={CARD_SIZES}
                      className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.08] motion-reduce:transition-none"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
                    <div className="absolute inset-x-4 top-4 flex flex-wrap gap-2">
                      <span data-chip className="label rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-white fine:bg-black/60 fine:backdrop-blur-md">
                        {PRICING.styles[p.style].title}
                      </span>
                      <span data-chip className="label num rounded-full border border-white/20 bg-black/55 px-3 py-1.5 font-medium text-white fine:bg-white/20 fine:backdrop-blur-md">
                        {p.area} м²
                      </span>
                    </div>
                    <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-white sm:inset-x-6 sm:bottom-6">
                      <div>
                        <h3 className="display text-3xl font-bold sm:text-4xl">
                          <button type="button" aria-haspopup="dialog" className="cursor-pointer text-left focus-visible:outline-none">
                            {p.name}
                          </button>
                        </h3>
                        <p className="label num mt-1 font-medium text-[#d4d8dd]">
                          {T.terrace(p.terrace)} · {T.floors(p.floors)} · {formatDaysFrom(contour.days)}
                        </p>
                      </div>
                      <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#111315] transition-transform group-hover:rotate-45 motion-reduce:transition-none">
                        <ArrowUpRight className="size-5" />
                      </span>
                    </div>
                    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-accent-deco ring-offset-2 group-has-[:focus-visible]:ring-2" />
                  </div>
                  <p className="mt-4 text-muted">{nbsp(p.tagline)}</p>
                  <dl className="num mt-3 grid grid-cols-2 gap-3">
                    <div className="card px-4 py-3">
                      <dt className="text-sm text-muted">{T.contour}</dt>
                      <dd className="text-base font-semibold min-[400px]:text-lg">{T.from(formatMln(contour.price))}</dd>
                    </div>
                    <div className="card px-4 py-3">
                      <dt className="text-sm text-muted">{T.turnkey}</dt>
                      <dd className="text-base font-semibold min-[400px]:text-lg">{T.from(formatMln(turnkey.price))}</dd>
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
