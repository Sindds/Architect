'use client'

import { MapPin, MousePointerClick } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import preview from '@/content/images/office-map.webp'
import { SITE } from '@/content/site'
import { MAP_TEXT as T } from '@/content/texts'
import { useConsent } from '@/lib/consent'

const { lat, lon, zoom } = SITE.geo
const point = `${lon}%2C${lat}`
const widget = `https://yandex.ru/map-widget/v1/?ll=${point}&z=${zoom}&pt=${point}%2Cpm2rdm`
const external = `https://yandex.ru/maps/?ll=${point}&z=${zoom}&pt=${point}`

/**
 * Карта в футере. Сразу видна картинка района из OpenStreetMap: она лежит на нашем сервере (pnpm map:preview),
 * без cookie и запросов к сторонним сайтам. Интерактивная Яндекс Карта ставит свои cookie, поэтому грузится
 * после «Принять все» или по кнопке на картинке.
 */
export function OfficeMap() {
  const [consent] = useConsent()
  const [asked, setAsked] = useState(false)
  const show = consent === 'all' || asked

  return (
    <div data-testid="office-map">
      <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-[#1b1e22] sm:h-72">
        {show ? (
          <iframe
            src={widget}
            title={T.frameTitle(SITE.brandFull, SITE.address)}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="block size-full border-0"
          />
        ) : (
          <>
            {/* Светлая карта OSM перекрашена под тёмный футер: инверсия с возвратом оттенков. */}
            <Image
              src={preview}
              alt={T.previewAlt(SITE.address)}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.55)_brightness(0.95)]"
              data-testid="office-map-preview"
            />
            <span aria-hidden className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-[#9fc0de] text-[#111315] shadow-lg ring-4 ring-[#9fc0de]/30">
                <MapPin className="size-5" strokeWidth={2} />
              </span>
              <span className="h-3 w-0.5 bg-[#9fc0de]" />
            </span>
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent p-4 pt-12">
              <button type="button" className="btn btn-light min-h-11" onClick={() => setAsked(true)}>
                {T.interactive}
                <span className="btn-dot">
                  <MousePointerClick aria-hidden className="size-4" />
                </span>
              </button>
              <p className="max-w-[16rem] text-xs text-white/80">{T.interactiveNote}</p>
            </div>
          </>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 text-sm">
        <a href={external} target="_blank" rel="noopener" className="link inline-flex min-h-11 items-center">
          {T.openInYandex}
        </a>
        {!show && (
          // Лицензия OpenStreetMap: подпись со ссылкой на условия обязательна.
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" className="link inline-flex min-h-11 items-center text-on-inverse-muted">
            {T.attribution}
          </a>
        )}
      </div>
    </div>
  )
}
