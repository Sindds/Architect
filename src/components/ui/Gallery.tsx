'use client'

import { Maximize2 } from 'lucide-react'
import Image from 'next/image'
import { GALLERY_SIZES, warmPicture } from '@/lib/preload-image'
import { useEffect, useState } from 'react'
import { COMMON_TEXT } from '@/content/texts'
import type { Picture } from '@/content/types'
import { Modal } from './Modal'

export function Gallery({ pictures, label }: { pictures: Picture[]; label: string }) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(false)
  const current = pictures[index] ?? pictures[0]
  // Окно открылось: остальные картинки галереи — в фоне, чтобы переключение было мгновенным.
  useEffect(() => {
    pictures.slice(1).forEach((p) => warmPicture(p, GALLERY_SIZES, 'low'))
  }, [pictures])
  if (!current) return null
  const drawing = current.caption === 'Чертёж'
  // Подписей под картинками нет (решения заказчика 17 и 18.10.2026): что на картинке, говорит alt.

  return (
    <div>
      <figure>
        <button
          type="button"
          onClick={() => setZoom(true)}
          className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-subtle"
          aria-label={COMMON_TEXT.zoom(current.alt)}
        >
          <Image
            src={current.src}
            alt={current.alt}
            sizes={GALLERY_SIZES}
            // Окно уже открыто: картинка видна сразу, ленивая загрузка только задержала бы её.
            loading="eager"
            fetchPriority={index === 0 ? 'high' : 'auto'}
            // Чертёж показываем целиком на белом: обрезка по краям срезала бы штамп и подписи.
            className={`aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none ${drawing ? 'bg-white object-contain' : 'object-cover'}`}
            placeholder="blur"
          />
          <span className="absolute top-3 right-3 inline-flex size-10 items-center justify-center rounded-full bg-black/70 text-white fine:bg-black/60 fine:backdrop-blur">
            <Maximize2 aria-hidden className="size-5" strokeWidth={1.5} />
          </span>
        </button>
      </figure>
      <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label={COMMON_TEXT.images(label)}>
        {pictures.map((p, i) => (
          <button
            key={p.alt}
            type="button"
            onClick={() => setIndex(i)}
            aria-pressed={i === index}
            aria-label={COMMON_TEXT.show(p.alt)}
            className="relative cursor-pointer overflow-hidden rounded-xl bg-subtle outline-offset-2 aria-pressed:ring-2 aria-pressed:ring-accent-deco"
          >
            <Image src={p.src} alt="" sizes="200px" className="aspect-[16/10] w-full object-cover opacity-90 transition-opacity hover:opacity-100" />
          </button>
        ))}
      </div>
      <Modal open={zoom} onClose={() => setZoom(false)} title={label}>
        <figure className="p-2 sm:p-4">
          <Image src={current.src} alt={current.alt} sizes="(min-width: 1152px) 1120px, 100vw" className="h-auto w-full rounded-2xl" />
        </figure>
      </Modal>
    </div>
  )
}
