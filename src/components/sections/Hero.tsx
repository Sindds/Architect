import { Eye, FileText, MapPin } from 'lucide-react'
import Image from 'next/image'
import { CASES } from '@/content/cases'
import { COPY } from '@/content/copy'
import { SITE } from '@/content/site'
import type { VariantKey } from '@/content/types'
import { nbsp } from '@/lib/typography'
import { heroFor } from '@/lib/variant'
import { LeadButton } from '../LeadButton'
import { QuizButton } from './QuizButton'

/** Первый экран по образцу: тёмная карточка с фото на всю ширину. Фото и H1 без анимации появления (LCP). */
export function Hero({ variant }: { variant: VariantKey }) {
  const { h1Prefix, h1Price, subtitle, variant: v } = heroFor(variant)
  const proof =
    'flex h-full min-h-11 w-60 shrink-0 snap-start items-center gap-3 rounded-2xl border border-white/15 bg-black/45 p-4 text-left backdrop-blur-xl transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-black/60 motion-reduce:hover:translate-y-0 sm:w-full sm:shrink'

  return (
    <section id="top" aria-labelledby="hero-title" className="mx-auto w-full max-w-[100rem] p-2 pb-0 sm:p-4 sm:pb-0 md:p-6 md:pb-0">
      <div
        data-testid="hero"
        className="on-dark relative flex min-h-[88svh] flex-col justify-end overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0b0d] px-5 pt-24 pb-6 text-white shadow-2xl sm:min-h-[92svh] sm:rounded-[36px] sm:p-8 sm:pt-32 md:p-12 lg:p-14"
      >
        <Image
          src={v.heroImage.src}
          alt={v.heroImage.alt}
          data-hero-image
          fill
          loading="eager"
          fetchPriority="high"
          quality={70}
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/60" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between xl:gap-10">
          <div className="max-w-4xl">
            <p className="label text-[#9fc0de]">{nbsp(COPY.ui.heroLabel)}</p>
            <h1 id="hero-title" className="display mt-4 text-[clamp(1.35rem,6.2vw,1.9rem)] leading-[1.08] font-normal sm:text-5xl lg:text-[3.3rem] xl:text-[3.7rem]">
              {nbsp(h1Prefix)}
              <span className="sr-only"> — </span>
              <span data-testid="hero-price" className="mt-2 block text-[#9fc0de]">
                {nbsp(h1Price)}
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#d4d8dd] sm:text-lg">{nbsp(subtitle)}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <QuizButton />
              <a href="#projects" className="btn btn-glass">
                Смотреть проекты
              </a>
            </div>
          </div>

          <ul className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 xl:w-[19rem] xl:shrink-0 xl:grid-cols-1" aria-label="Доказательства">
            <li className="flex">
              <a href="#delivered" className={proof}>
                <span className="display num text-3xl leading-none font-bold">{CASES.length}</span>{' '}
                <span className="label leading-snug font-medium text-[#d4d8dd]">сданных дома: план и факт по смете</span>
              </a>
            </li>
            <li className="flex">
              <a href={SITE.docs.contract} target="_blank" rel="noopener" className={proof}>
                <FileText aria-hidden className="size-7 shrink-0 text-[#9fc0de]" strokeWidth={1.5} />
                <span className="label leading-snug font-medium text-[#d4d8dd]">Образец договора (PDF)</span>
              </a>
            </li>
            <li className="flex">
              <LeadButton
                source="excursion"
                formTitle="Экскурсия на объект"
                submitLabel="Записаться на экскурсию"
                className={`${proof} cursor-pointer`}
                leading={<Eye aria-hidden className="size-7 shrink-0 text-[#9fc0de]" strokeWidth={1.5} />}
                textClassName="label leading-snug font-medium text-[#d4d8dd]"
              >
                Покажем построенный дом
              </LeadButton>
            </li>
          </ul>
        </div>
        <p className="label relative z-10 mt-6 flex items-center gap-2 font-normal text-[#b9bec6] sm:mt-8">
          <MapPin aria-hidden className="size-3.5 shrink-0" />
          {v.heroImage.caption} · {SITE.address}
        </p>
      </div>
    </section>
  )
}
