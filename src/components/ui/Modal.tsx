'use client'

import { X } from 'lucide-react'
import { useEffect, useId, useLayoutEffect, useRef } from 'react'

/**
 * Пока открыто хотя бы одно окно, страница зафиксирована на месте: body — position: fixed со сдвигом
 * на текущую прокрутку, прокрутка документа — 0, вид не меняется. Зачем:
 * - iOS 26 рисует курсор в поле фиксированного окна ниже поля, если страница прокручена далеко
 *   (WebKit 300690 → 300952): квиз и формы находятся в тысячах пикселей от верха;
 * - на iOS фон под окном иначе прокручивается, overflow: hidden у body там не помогает.
 * Счётчик — для окна поверх окна (заявка из окна проекта): фиксируем при первом, отпускаем при последнем.
 */
let locks = 0
let saved: { y: number; style: string } | null = null

function lockPage() {
  if (locks++ > 0) return
  const { body } = document
  saved = { y: window.scrollY, style: body.getAttribute('style') ?? '' }
  Object.assign(body.style, { position: 'fixed', top: `-${saved.y}px`, left: '0', right: '0', overflow: 'hidden' })
}

function unlockPage() {
  if (--locks > 0 || !saved) return
  const { y, style } = saved
  saved = null
  if (style) document.body.setAttribute('style', style)
  else document.body.removeAttribute('style')
  window.scrollTo({ top: y, behavior: 'instant' })
}

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  /** Визуально скрыть заголовок (он остаётся для скринридера). */
  hideTitle?: boolean
  size?: 'sm' | 'lg'
  children: React.ReactNode
  testId?: string
}

/**
 * Нативный <dialog>: фокус внутри окна, Esc закрывает, фон инертен.
 * При закрытии браузер возвращает фокус на элемент, который открыл окно.
 */
export function Modal({ open, onClose, title, hideTitle, size = 'lg', children, testId }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  // Окно открыто по props: закрытие из кода (open → false) не должно снова звать onClose.
  const openRef = useRef(open)
  useLayoutEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Синхронно с отрисовкой: прокрутка возвращается до кода, который после закрытия окна прокручивает к калькулятору.
  useLayoutEffect(() => {
    if (!open) return
    lockPage()
    return unlockPage
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      data-testid={testId}
      onClose={(e) => {
        // React передаёт close вложенного окна (увеличенная схема в окне дома) всем окнам-предкам:
        // реагируем только на своё закрытие и только когда его закрыл браузер (Esc), а не код.
        if (e.target === e.currentTarget && openRef.current) onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className={`m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] overflow-y-auto overscroll-contain rounded-[24px] border border-line bg-surface p-0 text-fg shadow-[0_24px_80px_-20px_rgb(0_0_0/0.55)] backdrop:bg-black/70 open:animate-[modal-in_220ms_var(--ease-out-soft)] motion-reduce:open:animate-none sm:max-h-[calc(100dvh-3rem)] ${
        size === 'sm' ? 'max-w-lg' : 'max-w-6xl'
      }`}
    >
      {open && (
        <div className="relative">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-surface px-4 py-3 fine:bg-surface/95 fine:backdrop-blur sm:px-8 sm:py-4">
            <h2 id={titleId} className={hideTitle ? 'sr-only' : 'font-display text-xl leading-tight font-bold sm:text-2xl'}>
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-subtle text-fg transition-colors hover:bg-fg hover:text-bg"
              aria-label="Закрыть окно"
            >
              <X aria-hidden className="size-6" strokeWidth={1.5} />
            </button>
          </div>
          {children}
        </div>
      )}
      <style>{`@keyframes modal-in { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }`}</style>
    </dialog>
  )
}
