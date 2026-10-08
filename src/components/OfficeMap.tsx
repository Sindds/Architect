'use client'

import { MapPin } from 'lucide-react'
import { useState } from 'react'
import { SITE } from '@/content/site'
import { useConsent } from '@/lib/consent'

const { lat, lon, zoom } = SITE.geo
const point = `${lon}%2C${lat}`
const widget = `https://yandex.ru/map-widget/v1/?ll=${point}&z=${zoom}&pt=${point}%2Cpm2rdm`
const external = `https://yandex.ru/maps/?ll=${point}&z=${zoom}&pt=${point}`

/** Яндекс Карта в футере. Сторонний виджет ставит cookie: без согласия показываем заглушку и грузим по клику. */
export function OfficeMap() {
  const [consent] = useConsent()
  const [asked, setAsked] = useState(false)
  const show = consent === 'all' || asked

  return (
    <div data-testid="office-map">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        {show ? (
          <iframe
            src={widget}
            title={`Карта: ${SITE.brandFull}, ${SITE.address}`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="block h-64 w-full border-0 sm:h-72"
          />
        ) : (
          <div className="flex h-64 flex-col items-start justify-end gap-3 bg-[radial-gradient(circle_at_70%_30%,rgb(126_162_196/0.25),transparent_55%)] p-5 sm:h-72">
            <MapPin aria-hidden className="size-7 text-[#9fc0de]" strokeWidth={1.5} />
            <p className="max-w-xs text-sm text-on-inverse-muted">Карта Яндекса ставит свои cookie, поэтому загружается по вашему запросу.</p>
            <button type="button" className="btn btn-light min-h-11" onClick={() => setAsked(true)}>
              Показать карту
            </button>
          </div>
        )}
      </div>
      <a href={external} target="_blank" rel="noopener" className="link mt-2 inline-flex min-h-11 items-center text-sm">
        Открыть в Яндекс Картах
      </a>
    </div>
  )
}
