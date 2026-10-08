import { Camera, ClipboardCheck, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { COPY } from '@/content/copy'
import { MEDIA } from '@/content/media'
import { PRICING } from '@/content/pricing'
import { STEPS, STEPS_EXAMPLE } from '@/content/process'
import { formatDays } from '@/lib/format'
import { SectionHead } from '../ui/SectionHead'

const CONTROL = [
  { icon: Camera, text: 'Раз в неделю мы присылаем фотоотчёт и обновлённый график.' },
  { icon: ClipboardCheck, text: 'Фундамент, утепление и разводку принимаем по актам с фотографиями, пока их не закрыли.' },
  { icon: ShieldCheck, text: 'Если вам нужна независимая проверка, поможем пригласить технадзор с вашей стороны.' },
]

export function Process() {
  const total = STEPS.reduce((s, x) => s + x.days, 0)
  // День начала каждого этапа: 0, 30, 75, …
  const starts = STEPS.map((_, i) => STEPS.slice(0, i).reduce((s, x) => s + x.days, 0))
  const lead = `На примере ${STEPS_EXAMPLE.project} ${STEPS_EXAMPLE.area} м², ${PRICING.tiers[STEPS_EXAMPLE.tier].title.toLowerCase()}: от подписания договора до ключей проходит ${formatDays(total)}.`

  return (
    <section id="process" aria-labelledby="process-title" className="border-t border-line">
      <div className="shell py-16 sm:py-24">
        <SectionHead id="process-title" index={6} copy={COPY.sections.process} lead={lead} />

        {/* Диаграмма сроков: ширина отрезка пропорциональна длительности этапа */}
        <div className="mt-12 hidden lg:block" aria-hidden>
          <div className="flex h-11 gap-1">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className={`flex items-center justify-center rounded-full ${i % 2 ? 'bg-accent-soft text-accent' : 'bg-fg text-bg'}`}
                style={{ width: `${(s.days / total) * 100}%` }}
              >
                <span className="label num">{s.days} дн.</span>
              </div>
            ))}
          </div>
          <div className="label num relative mt-2 h-5 font-normal text-muted">
            {STEPS.map((s, i) => (
              <span key={s.title} className="absolute -translate-x-1/2 first:translate-x-0" style={{ left: `${((starts[i] ?? 0) / total) * 100}%` }}>
                {i === 0 ? 'день 0' : starts[i]}
              </span>
            ))}
            <span className="absolute right-0">{total}</span>
          </div>
        </div>

        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.title} className="reveal card flex flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="label num text-accent">Этап {i + 1}</span>
                <span className="label num rounded-full bg-subtle px-2.5 py-1 font-medium text-muted">{formatDays(s.days)}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-snug">{s.title}</h3>
              <p className="mt-2 text-[0.9375rem] text-muted">{s.result}</p>
              <p className="num mt-auto pt-5">
                <span className="display text-4xl font-bold">{s.paymentPercent}%</span>
                <span className="mt-1 block text-sm text-muted">оплаты после акта</span>
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <figure className="relative overflow-hidden rounded-3xl border border-line lg:col-span-7">
            <Image src={MEDIA.processFrame.src} alt={MEDIA.processFrame.alt} placeholder="blur" sizes="(min-width: 1024px) 720px, 100vw" className="aspect-[16/9] w-full object-cover" />
            <figcaption className="label absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1.5 font-medium text-[#d4d8dd]">{MEDIA.processFrame.caption}</figcaption>
          </figure>
          <div className="card p-6 sm:p-8 lg:col-span-5">
            <h3 className="display text-2xl font-bold">Как следить за стройкой из города</h3>
            <ul className="mt-5 grid gap-4">
              {CONTROL.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon aria-hidden className="size-4" strokeWidth={1.8} />
                  </span>
                  <span className="pt-1.5">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
