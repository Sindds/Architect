import Image from 'next/image'
import { MEDIA } from '@/content/media'
import { PRICING } from '@/content/pricing'
import { STEPS, STEPS_EXAMPLE } from '@/content/process'
import { formatDays } from '@/lib/format'
import { SectionHead } from '../ui/SectionHead'

export function Process() {
  const total = STEPS.reduce((s, x) => s + x.days, 0)
  // День начала каждого этапа: 0, 30, 75, …
  const starts = STEPS.map((_, i) => STEPS.slice(0, i).reduce((s, x) => s + x.days, 0))
  return (
    <section id="process" aria-labelledby="process-title" className="border-t border-line py-16 lg:py-24">
      <div className="shell">
        <SectionHead
          id="process-title"
          index="06"
          label="Как строим"
          title="Пять этапов. Платите после акта по каждому"
          lead={`Пример для ${STEPS_EXAMPLE.project} ${STEPS_EXAMPLE.area} м², ${PRICING.tiers[STEPS_EXAMPLE.tier].title.toLowerCase()}: ${formatDays(total)} от договора до ключей.`}
        />

        {/* Диаграмма сроков: ширина отрезка пропорциональна длительности этапа */}
        <div className="mt-12 hidden lg:block" aria-hidden>
          <div className="relative flex h-12 border-x border-ink">
            {STEPS.map((s, i) => (
              <div key={s.title} className={`flex items-center justify-center border-r border-sheet last:border-r-0 ${i % 2 ? 'bg-ink-2' : 'bg-ink'}`} style={{ width: `${(s.days / total) * 100}%` }}>
                <span className="label num text-sheet">{s.days} дн.</span>
              </div>
            ))}
          </div>
          <div className="label num relative mt-2 h-5 text-ink-3">
            {STEPS.map((s, i) => (
              <span key={s.title} className="absolute -translate-x-1/2 first:translate-x-0" style={{ left: `${((starts[i] ?? 0) / total) * 100}%` }}>
                {i === 0 ? 'день 0' : starts[i]}
              </span>
            ))}
            <span className="absolute right-0">{total}</span>
          </div>
        </div>

        <ol className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.title} className="reveal flex flex-col bg-paper py-6 sm:px-5 lg:first:pl-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="label num text-accent">Этап {i + 1}</span>
                <span className="label num text-ink-2">{formatDays(s.days)}</span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-medium leading-tight">{s.title}</h3>
              <p className="mt-2 text-[0.9375rem] text-ink-2">{s.result}</p>
              <p className="num mt-auto pt-5">
                <span className="font-display text-4xl font-medium">{s.paymentPercent}%</span>
                <span className="ml-2 text-sm text-ink-2">оплаты после акта</span>
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-center">
          <figure className="lg:col-span-7">
            <Image src={MEDIA.processFrame.src} alt={MEDIA.processFrame.alt} placeholder="blur" sizes="(min-width: 1024px) 760px, 100vw" className="aspect-[16/9] w-full bg-paper-2 object-cover" />
            <figcaption className="label mt-2 text-ink-2">{MEDIA.processFrame.caption}</figcaption>
          </figure>
          <div className="lg:col-span-5">
            <h3 className="font-display text-[2rem] font-medium leading-tight">Как контролировать стройку из города</h3>
            <ul className="mt-4 grid gap-3">
              {[
                'Каждую неделю — фотоотчёт и обновлённый график.',
                'Скрытые работы — фундамент, утепление, разводку — принимаем по актам с фото до того, как их закроют.',
                'Хотите независимую проверку — поможем подключить технадзор с вашей стороны.',
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="mt-[0.75em] h-px w-4 shrink-0 bg-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
