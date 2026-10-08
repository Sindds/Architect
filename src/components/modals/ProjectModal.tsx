'use client'

import { ArrowRight } from 'lucide-react'
import { PRICING, TIER_ORDER } from '@/content/pricing'
import type { Project } from '@/content/types'
import { formatDays, formatRub, groupDigits } from '@/lib/format'
import { projectPrice } from '@/lib/pricing'
import { useLanding } from '../LandingProvider'
import { Gallery } from '../ui/Gallery'
import { Modal } from '../ui/Modal'

export function ProjectModal({ project, onClose }: { project: Project | undefined; onClose: () => void }) {
  const { openLead, calculateProject } = useLanding()
  const style = project ? PRICING.styles[project.style] : undefined

  return (
    <Modal open={Boolean(project)} onClose={onClose} title={project ? `${project.name} — ${style?.title.toLowerCase()} стиль, ${project.area} м²` : ''} testId="project-modal">
      {project && style && (
        <div className="grid gap-8 px-4 pb-8 pt-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Gallery pictures={project.gallery} label={project.name} />
          </div>

          <div className="lg:col-span-5">
            <p className="text-xl leading-snug font-semibold">{project.tagline}</p>
            <dl className="mt-5 grid grid-cols-2 border-t border-line sm:grid-cols-3">
              {[
                ['Дом', `${project.area} м²`],
                ['Терраса', `${project.terrace} м²`],
                ['Этажей', project.floors],
                ['Спален', project.bedrooms],
                ['Санузлов', project.bathrooms],
                ['Конструкция', style.construction],
              ].map(([k, v]) => (
                <div key={String(k)} className="border-b border-line py-3 pr-3">
                  <dt className="label text-muted">{k}</dt>
                  <dd className="num mt-0.5 font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            <h3 className="label mt-6 text-muted">Цена и срок по пакетам</h3>
            <table className="num mt-2 w-full text-left">
              <caption className="sr-only">Цена и срок строительства {project.name} по пакетам</caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Пакет</th>
                  <th scope="col">Цена</th>
                  <th scope="col">Срок</th>
                </tr>
              </thead>
              <tbody>
                {TIER_ORDER.map((tier) => {
                  const { price, days } = projectPrice(project, tier)
                  return (
                    <tr key={tier} className="border-b border-line">
                      <th scope="row" className="py-2.5 pr-2 font-normal">
                        {PRICING.tiers[tier].title}
                      </th>
                      <td className="py-2.5 pr-2 font-medium whitespace-nowrap">{formatRub(price)}</td>
                      <td className="py-2.5 text-right whitespace-nowrap text-muted">{formatDays(days)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className="mt-2 text-sm text-muted">С террасой {project.terrace} м², без опций. Цена фиксируется в договоре.</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <button type="button" className="btn btn-primary" onClick={() => calculateProject(project.slug)}>
                Рассчитать этот проект
                <span className="btn-dot">
                  <ArrowRight aria-hidden className="size-4" />
                </span>
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  openLead({ title: 'Получить смету в PDF', source: 'project_modal', context: `Проект ${project.name}, ${project.area} м²` })
                }
              >
                Получить смету в PDF
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h3 className="label text-muted">Что в проекте</h3>
            <ul className="mt-3 grid gap-2">
              {project.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-accent" />
                  {f}
                </li>
              ))}
            </ul>
            <h3 className="label mt-6 text-muted">Конструктив</h3>
            <dl className="mt-2 grid gap-2">
              {[
                ['Фундамент', project.construction.foundation],
                ['Стены', project.construction.walls],
                ['Остекление', project.construction.glazing],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-2">
                  <dt className="text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <h3 className="label text-muted">Экспликация помещений</h3>
            <div className={`mt-3 grid gap-6 ${project.explication.length > 1 ? 'sm:grid-cols-2' : ''}`}>
              {project.explication.map((floor) => (
                <table key={floor.floor} className="num w-full text-left text-[0.9375rem]">
                  <caption className="mb-1 text-left font-medium">
                    {floor.floor} · {groupDigits(floor.rooms.reduce((s, r) => s + r.area, 0))} м²
                  </caption>
                  <thead className="sr-only">
                    <tr>
                      <th scope="col">Помещение</th>
                      <th scope="col">Площадь</th>
                    </tr>
                  </thead>
                  <tbody>
                    {floor.rooms.map((r, i) => (
                      <tr key={`${r.name}-${i}`} className="border-b border-line/70">
                        <td className="py-1.5 pr-2">{r.name}</td>
                        <td className="py-1.5 text-right whitespace-nowrap text-muted">{r.area} м²</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
