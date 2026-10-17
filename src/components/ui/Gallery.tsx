'use client'

import { Maximize2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { Picture } from '@/content/types'
import { Modal } from './Modal'

export function Gallery({ pictures, label }: { pictures: Picture[]; label: string }) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(false)
  const current = pictures[index] ?? pictures[0]
  if (!current) return null
  // Подпись «Визуализация» не показываем (решение заказчика 17.10.2026): она осталась в alt. Схемы подписаны.
  const note = current.caption === 'Визуализация' ? null : current.caption

  return (
    <div>
      <figure>
        <button
          type="button"
          onClick={() => setZoom(true)}
          className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-subtle"
          aria-label={`Увеличить: ${current.alt}`}
        >
          <Image
            src={current.src}
            alt={current.alt}
            sizes="(min-width: 1024px) 620px, 100vw"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
            placeholder="blur"
          />
          <span className="absolute top-3 right-3 inline-flex size-10 items-center justify-center rounded-full bg-black/70 text-white fine:bg-black/60 fine:backdrop-blur">
            <Maximize2 aria-hidden className="size-5" strokeWidth={1.5} />
          </span>
        </button>
        {note && <figcaption className="label mt-2 text-muted">{note}</figcaption>}
      </figure>
      <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label={`Изображения: ${label}`}>
        {pictures.map((p, i) => (
          <button
            key={p.alt}
            type="button"
            onClick={() => setIndex(i)}
            aria-pressed={i === index}
            aria-label={`Показать: ${p.alt}`}
            className="relative cursor-pointer overflow-hidden rounded-xl bg-subtle outline-offset-2 aria-pressed:ring-2 aria-pressed:ring-accent-deco"
          >
            <Image src={p.src} alt="" sizes="200px" className="aspect-[16/10] w-full object-cover opacity-90 transition-opacity hover:opacity-100" />
          </button>
        ))}
      </div>
      <Modal open={zoom} onClose={() => setZoom(false)} title={note ? `${label}: ${note.toLowerCase()}` : label}>
        <figure className="p-2 sm:p-4">
          <Image src={current.src} alt={current.alt} sizes="(min-width: 1152px) 1120px, 100vw" className="h-auto w-full rounded-2xl" />
          {note && (
            <figcaption className="label mt-2 px-2 text-muted">
              {note} · {current.alt}
            </figcaption>
          )}
        </figure>
      </Modal>
    </div>
  )
}
