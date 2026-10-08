import { ArrowUpRight, FileText, MapPin } from 'lucide-react'
import Image from 'next/image'
import { CASES } from '@/content/cases'
import { COPY } from '@/content/copy'
import { SITE } from '@/content/site'
import type { VariantKey } from '@/content/types'
import { heroFor } from '@/lib/variant'
import { LeadButton } from '../LeadButton'
import { QuizButton } from './QuizButton'

/** Первый экран по образцу: тёмная карточка с фото на всю ширину. Фото и H1 без анимации появления (LCP). */
export function Hero({ variant }: { variant: VariantKey }) {
  const { h1, subtitle, variant: v } = heroFor(variant)
  const glass = 'flex min-h-11 items-start gap-3 rounded-2xl border border-white/15 bg-black/45 p-4 text-left backdrop-blur-xl transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-black/60 motion-reduce:hover:translate-y-0'

  return (
    <section id="top" aria-labelledby="hero-title" className="mx-auto w-full max-w-[100rem] p-2 pb-0 sm:p-4 sm:pb-0 md:p-6 md:pb-0">
      <div
        data-testid="hero"
        className="on-dark relative flex min-h-[92svh] flex-col justify-end overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0b0d] p-5 pt-28 text-white shadow-2xl sm:rounded-[36px] sm:p-8 sm:pt-32 md:p-12 lg:p-14"
      >
        <Image
          src={v.heroImage.src}
          alt={v.heroImage.alt}
          data-hero-image
          preload
          fill
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/60" />
        <p
          aria-hidden
          className="display pointer-events-none absolute bottom-[42%] left-5 max-w-[60%] text-[clamp(1.6rem,5vw,4.5rem)] leading-[0.9] font-bold tracking-[-0.04em] text-white/10 select-none sm:left-8 md:left-12"
        >
          {SITE.brandFull}
        </p>

        <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <p className="label text-[#9fc0de]">{COPY.ui.heroLabel}</p>
            <h1 id="hero-title" className="display mt-4 text-[1.9rem] leading-[1.06] font-normal sm:text-5xl lg:text-[3.4rem] xl:text-[3.9rem]">
              {h1}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#d4d8dd] sm:text-lg">{subtitle}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <QuizButton />
              <a href="#projects" className="btn btn-glass">
                Смотреть проекты
              </a>
            </div>
          </div>

          <ul className="grid shrink-0 gap-3 sm:grid-cols-3 lg:w-[19rem] lg:grid-cols-1">
            <li>
              <a href="#cases" className={glass} aria-label={`${CASES.length} сданных дома: план и факт по смете`}>
                <span className="display num text-3xl leading-none font-bold">{CASES.length}</span>
                <span className="label mt-0.5 leading-snug font-medium text-[#d4d8dd]">сданных дома: план и факт по смете</span>
              </a>
            </li>
            <li>
              <a href={SITE.docs.contract} target="_blank" rel="noopener" className={glass}>
                <FileText aria-hidden className="mt-0.5 size-6 shrink-0 text-[#9fc0de]" strokeWidth={1.5} />
                <span className="label leading-snug font-medium text-[#d4d8dd]">Образец договора (PDF)</span>
              </a>
            </li>
            <li>
              <LeadButton
                source="excursion"
                formTitle="Экскурсия на объект"
                submitLabel="Записаться на экскурсию"
                className={`${glass} w-full cursor-pointer`}
                icon={<ArrowUpRight aria-hidden className="ml-auto size-4 shrink-0" />}
              >
                Покажем построенный дом
              </LeadButton>
            </li>
          </ul>
        </div>
        <p className="label relative z-10 mt-8 flex items-center gap-2 font-normal text-[#b9bec6]">
          <MapPin aria-hidden className="size-3.5" />
          {v.heroImage.caption} · {SITE.address}
        </p>
      </div>
    </section>
  )
}
