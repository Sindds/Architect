'use client'

import { ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useConsent } from '@/lib/consent'

/** Блоки, где кнопка мешает: свои кнопки есть на первом экране, у калькулятора — своя панель итога, в контактах — форма. */
const QUIET = ['[data-testid="hero"]', '#calculator', '#contacts']

/**
 * Кнопка «Рассчитать стоимость» внизу экрана на телефоне: расчёт под рукой на любом экране.
 * Позвонить и написать — в шапке, здесь не повторяются. Компактная капсула справа, чтобы не закрывать текст:
 * высота 44 px (цель касания), плотный фон без размытия (производительность на сенсорных экранах), учёт выреза снизу.
 */
export function MobileActionBar() {
  const [consent] = useConsent()
  const [quiet, setQuiet] = useState(true)

  useEffect(() => {
    const visible = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target)
        else visible.delete(e.target)
      }
      setQuiet(visible.size > 0)
    })
    for (const sel of QUIET) {
      const el = document.querySelector(sel)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [])

  // Пока виден баннер cookie (выбор не сделан), кнопка его не перекрывает.
  const shown = !quiet && consent !== null && consent !== undefined

  return (
    <a
      href="#calculator"
      data-testid="mobile-action-bar"
      data-shown={shown ? '' : undefined}
      inert={!shown}
      className={`on-dark fixed right-3 z-30 inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/20 bg-inverse py-1.5 pr-1.5 pl-4 font-display text-xs font-bold tracking-[0.05em] whitespace-nowrap text-on-inverse uppercase shadow-xl transition-[translate,opacity,visibility] duration-300 ease-[var(--ease-out-soft)] active:scale-[0.98] motion-reduce:transition-none lg:hidden ${
        shown ? 'visible translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-[150%] opacity-0'
      }`}
      style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      Рассчитать стоимость
      <span aria-hidden className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-on-inverse text-inverse">
        <ArrowUpRight className="size-4" />
      </span>
    </a>
  )
}
