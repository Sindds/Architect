import { Quote } from 'lucide-react'
import { COPY } from '@/content/copy'
import { REVIEWS, TEAM } from '@/content/people'
import { SITE } from '@/content/site'
import { SectionHead } from '../ui/SectionHead'

export function Team() {
  const concept = SITE.contentMode === 'concept'
  return (
    <section aria-labelledby="team-title" className="border-t border-line">
      <div className="shell py-16 sm:py-24">
        <SectionHead id="team-title" index={7} copy={COPY.sections.team} lead={concept ? COPY.sections.team.lead : ''} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {TEAM.map((m) => (
            <li key={m.name} className="reveal card card-hover flex flex-col p-6">
              <span aria-hidden className="display flex size-16 items-center justify-center rounded-2xl bg-accent-soft text-2xl font-bold text-accent">
                {m.initials}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{m.name}</h3>
              <p className="text-accent">{m.role}</p>
              <p className="mt-3 text-[0.9375rem] text-muted">{m.responsibility}</p>
              <p className="label num mt-auto pt-5 font-medium text-muted">{m.stages}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Reviews() {
  return (
    <section aria-labelledby="reviews-title" className="border-t border-line">
      <div className="shell py-16 sm:py-24">
        <SectionHead id="reviews-title" index={8} copy={COPY.sections.reviews} />
        <ul className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <li key={r.id} className="reveal">
              <figure className="card flex h-full flex-col p-6 sm:p-8">
                <Quote aria-hidden className="size-7 text-accent-deco" strokeWidth={1.5} />
                <blockquote className="mt-4 text-lg leading-relaxed">{r.text}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span aria-hidden className="display flex size-11 shrink-0 items-center justify-center rounded-full bg-fg text-sm font-bold text-bg">
                    {r.initials}
                  </span>
                  <span className="text-[0.9375rem] leading-snug">
                    <span className="block font-semibold">{r.author}</span>
                    <span className="text-muted">{r.object}</span>
                  </span>
                </figcaption>
                {r.isDemo ? (
                  <p className="label mt-4 font-normal text-muted">Демо-отзыв концепт-проекта</p>
                ) : (
                  r.sourceUrl && (
                    <a href={r.sourceUrl} className="link mt-4 text-sm" target="_blank" rel="noopener">
                      Отзыв на Яндекс Картах
                    </a>
                  )
                )}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
