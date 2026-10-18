import { getImageProps } from 'next/image'
import type { Picture } from '@/content/types'

/** sizes главной картинки галереи в окне проекта: прогрев и <Image> должны совпадать, иначе браузер скачает второй раз. */
export const GALLERY_SIZES = '(min-width: 1024px) 620px, 100vw'

const warmed = new Set<string>()

/**
 * Скачать картинку в кэш браузера в том варианте, который выберет <Image> с этими sizes (тот же srcSet и качество).
 * Без <link rel="preload"> в <head>: правило 9 (CLAUDE.md) запрещает предзагрузку всех картинок, а прогрев идёт
 * только после загрузки страницы или по наведению на карточку. Повторный вызов для той же картинки ничего не делает.
 */
export function warmPicture(picture: Picture, sizes: string, fetchPriority: 'high' | 'low' | 'auto' = 'auto') {
  const { props } = getImageProps({ src: picture.src, alt: '', sizes })
  const key = `${props.src}|${sizes}`
  if (warmed.has(key)) return
  warmed.add(key)
  const img = new Image()
  img.fetchPriority = fetchPriority
  img.decoding = 'async'
  img.sizes = sizes
  if (props.srcSet) img.srcset = props.srcSet
  img.src = props.src
}
