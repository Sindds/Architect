'use client'

import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'

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

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (!open) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      data-testid={testId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className={`m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] overflow-y-auto overscroll-contain bg-sheet p-0 text-ink shadow-[0_24px_80px_-20px_rgb(0_0_0/0.45)] backdrop:bg-ink/60 open:animate-[modal-in_220ms_var(--ease-out-soft)] motion-reduce:open:animate-none sm:max-h-[calc(100dvh-3rem)] ${
        size === 'sm' ? 'max-w-lg' : 'max-w-6xl'
      }`}
    >
      {open && (
        <div className="relative">
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-sheet/95 px-4 py-3 backdrop-blur sm:px-8 sm:py-4">
            <h2 id={titleId} className={hideTitle ? 'sr-only' : 'font-display text-2xl font-medium leading-tight sm:text-3xl'}>
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center text-ink-2 transition-colors hover:text-accent"
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
