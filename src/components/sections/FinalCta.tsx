import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { SITE } from '@/content/site'
import type { VariantKey } from '@/content/types'
import { LeadForm } from '../forms/LeadForm'

/** Схема проезда вместо виджета карты: без сторонних запросов и чужих карточек организаций. */
function RouteScheme() {
  return (
    <figure>
      <svg viewBox="0 0 400 240" role="img" aria-labelledby="route-title route-desc" className="h-auto w-full border border-on-graphite-2/40">
        <title id="route-title">Схема расположения офиса</title>
        <desc id="route-desc">Офис на Новорижском шоссе, к западу от МКАД, в Московской области.</desc>
        <defs>
          <pattern id="route-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity="0.12" />
          </pattern>
        </defs>
        <rect width="400" height="240" fill="url(#route-grid)" className="text-on-graphite-2" />
        <ellipse cx="300" cy="120" rx="70" ry="78" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-on-graphite-2" />
        <text x="300" y="124" textAnchor="middle" className="fill-on-graphite-2 font-mono text-[14px]">
          МКАД
        </text>
        <path d="M230 112 C 180 104, 120 92, 20 70" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-on-dark" />
        <text x="24" y="56" className="fill-on-graphite font-mono text-[14px]">
          Новорижское ш.
        </text>
        <circle cx="120" cy="92" r="7" className="fill-accent-on-dark" />
        <circle cx="120" cy="92" r="14" fill="none" stroke="currentColor" className="text-accent-on-dark" />
        <text x="120" y="126" textAnchor="middle" className="fill-on-graphite font-mono text-[14px]">
          Офис и шоурум
        </text>
      </svg>
      <figcaption className="label mt-2 text-on-graphite-2">Схема, не в масштабе. Точный адрес пришлём при записи на встречу.</figcaption>
    </figure>
  )
}

export function FinalCta({ variant }: { variant: VariantKey }) {
  return (
    <section id="contacts" aria-labelledby="contacts-title" className="on-dark bg-graphite py-16 text-on-graphite lg:py-24">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label flex items-center gap-3 text-accent-on-dark">
            <span className="num">11</span>
            <span aria-hidden className="h-px w-8 bg-current" />
            <span>Контакты</span>
          </p>
          <h2 id="contacts-title" className="mt-4 font-display text-h2 font-medium">
            Обсудим ваш дом и участок
          </h2>
          <p className="mt-4 max-w-xl text-lg text-on-graphite-2">
            Оставьте телефон — архитектор перезвонит, ответит на вопросы и предложит время встречи в офисе или на объекте.
          </p>
          <div className="mt-8 max-w-2xl">
            <LeadForm source="final_cta" variant={variant} tone="dark" submitLabel="Перезвоните мне" />
          </div>
        </div>
        <div className="grid content-start gap-8 lg:col-span-5">
          <ul className="grid gap-4 text-lg">
            <li className="flex items-center gap-3">
              <Phone aria-hidden className="size-5 text-accent-on-dark" strokeWidth={1.5} />
              <a href={SITE.phoneHref} className="link num inline-flex min-h-11 items-center">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail aria-hidden className="size-5 text-accent-on-dark" strokeWidth={1.5} />
              <a href={`mailto:${SITE.email}`} className="link inline-flex min-h-11 items-center">
                {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin aria-hidden className="size-5 text-accent-on-dark" strokeWidth={1.5} />
              {SITE.address}
            </li>
            <li className="flex items-center gap-3">
              <Clock aria-hidden className="size-5 text-accent-on-dark" strokeWidth={1.5} />
              {SITE.hours}
            </li>
          </ul>
          <RouteScheme />
        </div>
      </div>
    </section>
  )
}
