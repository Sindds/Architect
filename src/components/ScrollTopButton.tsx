'use client'

import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useConsent } from '@/lib/consent'

/**
 * Кнопка «Наверх» (правка заказчика 18.10.2026): круглая, высотой как капсула «Рассчитать стоимость» (46 px),
 * в том же тёмном стиле. Видна, когда первый экран ушёл из вида. На телефоне стоит над капсулой, на компьютере
 * капсулы нет — в правом нижнем углу. Пока виден баннер cookie, не показывается: баннер занимает низ экрана.
 */
export function ScrollTopButton() {
  const [consent] = useConsent()
  const [past, setPast] = useState(false)

  useEffect(() => {
    const hero = document.querySelector('[data-testid="hero"]')
    if (!hero) return
    const io = new IntersectionObserver(([e]) => setPast(!e!.isIntersecting && e!.boundingClientRect.top < 0))
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  const shown = past && consent !== null && consent !== undefined

  const toTop = () => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    // Фокус — на заголовок первого экрана, чтобы с клавиатуры продолжить сверху, а не с кнопки внизу.
    document.getElementById('hero-title')?.focus({ preventScroll: true })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Наверх"
      title="Наверх"
      data-testid="scroll-top"
      data-shown={shown ? '' : undefined}
      inert={!shown}
      className={`on-dark fixed right-3 bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+3.375rem)] z-30 inline-flex size-[2.875rem] cursor-pointer items-center justify-center rounded-full border border-white/20 bg-inverse text-on-inverse shadow-xl transition-[translate,opacity,visibility] duration-300 ease-[var(--ease-out-soft)] fine:hover:-translate-y-0.5 active:scale-[0.96] motion-reduce:transition-none lg:right-6 lg:bottom-6 ${
        shown ? 'visible translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-[150%] opacity-0'
      }`}
    >
      <ArrowUp aria-hidden className="size-5" strokeWidth={2} />
    </button>
  )
}
