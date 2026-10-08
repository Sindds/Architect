import { REVIEWS, TEAM } from '@/content/people'
import { SITE } from '@/content/site'
import { SectionHead } from '../ui/SectionHead'

function Initials({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span aria-hidden className={`inline-flex shrink-0 items-center justify-center border border-ink font-display font-medium ${className}`}>
      {text}
    </span>
  )
}

export function Team() {
  return (
    <section aria-labelledby="team-title" className="border-t border-line bg-sheet py-16 lg:py-24">
      <div className="shell">
        <SectionHead
          id="team-title"
          index="07"
          label="Команда"
          title="С вами работают четыре человека — от проекта до ключей"
          lead={SITE.contentMode === 'concept' ? 'В концепт-проекте люди вымышлены, поэтому вместо фото — инициалы.' : undefined}
        />
        <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <li key={m.name} className="reveal flex flex-col bg-sheet p-6">
              <Initials text={m.initials} className="size-16 text-2xl" />
              <h3 className="mt-5 text-lg font-semibold">{m.name}</h3>
              <p className="text-accent">{m.role}</p>
              <p className="mt-3 text-[0.9375rem] text-ink-2">{m.responsibility}</p>
              <p className="label num mt-auto pt-4 text-ink-3">{m.stages}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Reviews() {
  return (
    <section aria-labelledby="reviews-title" className="border-t border-line py-16 lg:py-24">
      <div className="shell">
        <SectionHead id="reviews-title" index="08" label="Отзывы" title="Что говорят владельцы сданных домов" />
        <ul className="mt-12 grid gap-8 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <li key={r.id} className="reveal">
              <figure className="flex h-full flex-col border-t border-ink pt-6">
                <blockquote className="font-display text-[1.5rem] italic leading-snug">«{r.text}»</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 pt-2">
                  <Initials text={r.initials} className="size-11 text-base" />
                  <span className="text-[0.9375rem] leading-snug">
                    <span className="block font-medium">{r.author}</span>
                    <span className="text-ink-2">{r.object}</span>
                  </span>
                </figcaption>
                {r.isDemo ? (
                  <p className="label mt-3 text-ink-3">Демо-отзыв концепт-проекта</p>
                ) : (
                  r.sourceUrl && (
                    <a href={r.sourceUrl} className="link mt-3 text-sm" target="_blank" rel="noopener">
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
