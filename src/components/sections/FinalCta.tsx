import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { COPY } from '@/content/copy'
import { SITE } from '@/content/site'
import type { VariantKey } from '@/content/types'
import { LeadForm } from '../forms/LeadForm'

/** Схема проезда вместо виджета карты: без сторонних запросов и чужих карточек организаций. */
function RouteScheme() {
  return (
    <figure className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <svg viewBox="0 0 400 240" role="img" aria-labelledby="route-title route-desc" className="h-auto w-full">
        <title id="route-title">Схема расположения офиса</title>
        <desc id="route-desc">Офис на Новорижском шоссе, к западу от МКАД, в Московской области.</desc>
        <defs>
          <pattern id="route-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#ffffff" fillOpacity="0.12" />
          </pattern>
        </defs>
        <rect width="400" height="240" fill="url(#route-grid)" />
        <ellipse cx="300" cy="120" rx="70" ry="78" fill="none" stroke="#a3a8b1" strokeWidth="1.5" />
        <text x="300" y="124" textAnchor="middle" fill="#a3a8b1" className="font-mono text-[14px]">
          МКАД
        </text>
        <path d="M230 112 C 180 104, 120 92, 20 70" fill="none" stroke="#7ea2c4" strokeWidth="3" strokeLinecap="round" />
        <text x="24" y="56" fill="#f3f4f6" className="font-mono text-[14px]">
          Новорижское ш.
        </text>
        <circle cx="120" cy="92" r="7" fill="#7ea2c4" />
        <circle cx="120" cy="92" r="14" fill="none" stroke="#7ea2c4" />
        <text x="120" y="126" textAnchor="middle" fill="#f3f4f6" className="font-mono text-[14px]">
          Офис и шоурум
        </text>
      </svg>
      <figcaption className="label border-t border-white/10 px-4 py-3 font-normal text-on-inverse-muted">Схема без масштаба. Точный адрес пришлём, когда договоримся о встрече.</figcaption>
    </figure>
  )
}

export function FinalCta({ variant }: { variant: VariantKey }) {
  const copy = COPY.sections.contacts
  const contacts = [
    { icon: Phone, node: <a href={SITE.phoneHref} className="link num inline-flex min-h-11 items-center">{SITE.phoneDisplay}</a> },
    { icon: Mail, node: <a href={`mailto:${SITE.email}`} className="link inline-flex min-h-11 items-center">{SITE.email}</a> },
    { icon: MapPin, node: <span>{SITE.address}</span> },
    { icon: Clock, node: <span>{SITE.hours}</span> },
  ]
  return (
    <section id="contacts" aria-labelledby="contacts-title" className="mx-auto w-full max-w-[100rem] px-2 pt-8 sm:px-4 md:px-6">
      <div className="on-dark grid gap-12 rounded-[24px] border border-white/10 bg-inverse p-6 text-on-inverse shadow-2xl sm:rounded-[36px] sm:p-10 lg:grid-cols-12 lg:p-14">
        <div className="lg:col-span-7">
          <p data-testid="section-label" className="label text-[#9fc0de]">
            {copy.label}
          </p>
          <h2 id="contacts-title" className="display mt-4 text-[1.75rem] leading-[1.1] font-normal sm:text-4xl lg:text-[2.9rem]">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-on-inverse-muted sm:text-lg">{copy.lead}</p>
          <div className="mt-8 max-w-2xl">
            <LeadForm source="final_cta" variant={variant} tone="dark" submitLabel="Перезвоните мне" />
          </div>
        </div>
        <div className="grid content-start gap-6 lg:col-span-5">
          <ul className="grid gap-2 text-lg">
            {contacts.map(({ icon: Icon, node }, i) => (
              <li key={i} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-2">
                <Icon aria-hidden className="size-5 shrink-0 text-[#9fc0de]" strokeWidth={1.6} />
                {node}
              </li>
            ))}
          </ul>
          <RouteScheme />
        </div>
      </div>
    </section>
  )
}
