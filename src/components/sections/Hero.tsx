import { ArrowDown, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { CASES } from '@/content/cases'
import { SITE } from '@/content/site'
import type { VariantKey } from '@/content/types'
import { heroFor } from '@/lib/variant'
import { LeadButton } from '../LeadButton'
import { QuizButton } from './QuizButton'

export function Hero({ variant }: { variant: VariantKey }) {
  const { h1, subtitle, variant: v } = heroFor(variant)

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="sheet-grid pointer-events-none absolute inset-0 hidden lg:block" aria-hidden />
      <div className="shell relative grid gap-8 pb-14 pt-8 lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pt-14">
        <div className="lg:col-span-6 lg:pt-6">
          <p className="label text-accent">{SITE.descriptor} · Новорижское направление</p>
          <h1 id="hero-title" className="mt-5 font-display text-display font-medium tracking-[-0.01em]">
            {h1}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-2">{subtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <QuizButton />
            <a href="#projects" className="btn btn-ghost">
              Смотреть проекты
              <ArrowDown aria-hidden className="size-4" />
            </a>
          </div>

          <ol className="mt-10 grid gap-px border-y border-line bg-line sm:grid-cols-3">
            <li className="bg-paper py-4 pr-4">
              <span className="label text-ink-3">01</span>
              <a href="#cases" className="link mt-1 flex min-h-11 items-center leading-snug">
                {CASES.length} сданных дома — план и факт по смете
              </a>
            </li>
            <li className="bg-paper py-4 pr-4 sm:pl-4">
              <span className="label text-ink-3">02</span>
              <a href={SITE.docs.contract} className="link mt-1 flex min-h-11 items-center leading-snug" target="_blank" rel="noopener">
                Образец договора (PDF)
              </a>
            </li>
            <li className="bg-paper py-4 sm:pl-4">
              <span className="label text-ink-3">03</span>
              <LeadButton
                source="excursion"
                formTitle="Экскурсия на объект"
                className="link mt-1 flex min-h-11 cursor-pointer items-center text-left leading-snug"
                submitLabel="Записаться на экскурсию"
              >
                Покажем построенный дом
              </LeadButton>
            </li>
          </ol>
        </div>

        <figure className="relative lg:col-span-6 lg:-mr-8 xl:-mr-[max(2rem,calc((100vw-88rem)/2+2rem))]">
          <div className="dim label mb-3 hidden sm:flex" aria-hidden>
            <span className="num">фасад · панорамное остекление</span>
          </div>
          <Image
            src={v.heroImage.src}
            alt={v.heroImage.alt}
            preload
            placeholder="blur"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-[4/3] w-full bg-paper-2 object-cover sm:aspect-[16/10] lg:aspect-auto lg:h-[min(44rem,calc(100dvh-9rem))]"
          />
          <figcaption className="label mt-2 flex items-center justify-between gap-4 text-ink-2">
            <span>{v.heroImage.caption}</span>
            <a href="#projects" className="link inline-flex min-h-11 items-center gap-1.5">
              Все проекты <ArrowRight aria-hidden className="size-3.5" />
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
