import { MapPin } from "lucide-react";
import Image from "next/image";
import { COPY } from "@/content/copy";
import { SITE } from "@/content/site";
import type { VariantKey } from "@/content/types";
import { nbsp } from "@/lib/typography";
import { heroFor } from "@/lib/variant";
import { QuizButton } from "./QuizButton";

/** Первый экран по образцу: тёмная карточка с фото на всю ширину. Фото и H1 без анимации появления (LCP). */
export function Hero({ variant }: { variant: VariantKey }) {
  const { h1Prefix, h1Price, subtitle, variant: v } = heroFor(variant);

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="mx-auto w-full max-w-[100rem] p-2 pb-0 sm:p-4 sm:pb-0 md:p-6 md:pb-0"
    >
      <div
        data-testid="hero"
        className="on-dark relative flex min-h-[88svh] flex-col justify-between overflow-hidden sm:justify-end rounded-[24px] border border-white/10 bg-[#0a0b0d] px-5 pt-20 pb-6 text-white shadow-2xl sm:min-h-[92svh] sm:rounded-[36px] sm:p-8 sm:pt-32 md:p-12 lg:p-14"
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
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/60"
        />

        <div className="relative z-10 max-w-4xl">
          <h1
            id="hero-title"
            tabIndex={-1}
            className="display outline-none text-[clamp(1.35rem,6.2vw,1.9rem)] leading-[1.08] font-normal sm:text-5xl lg:text-[3.3rem] xl:text-[3.7rem]"
          >
            {nbsp(h1Prefix)}
            <span className="sr-only"> — </span>
            <span
              data-testid="hero-price"
              className="mt-2 block text-[#9fc0de]"
            >
              {nbsp(h1Price)}
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-[0.9375rem] leading-snug text-[#d4d8dd] sm:mt-5 sm:text-lg sm:leading-relaxed">
            {nbsp(subtitle)}
          </p>
          <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-snug text-[#d4d8dd] sm:mt-3 sm:text-lg sm:leading-relaxed">
            <strong className="font-semibold text-white">{nbsp(COPY.hero.offerLead)}</strong> {nbsp(COPY.hero.offerRest)}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center">
            <QuizButton />
            <a href="#projects" className="btn btn-glass">
              Смотреть проекты
            </a>
          </div>
        </div>
        <p className="label relative z-10 mt-6 flex items-center gap-2 font-normal text-[#b9bec6] sm:mt-8">
          <MapPin aria-hidden className="size-3.5 shrink-0" />
          {SITE.address}
        </p>
      </div>
    </section>
  );
}
