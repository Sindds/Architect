'use client'

import { ArrowUpRight, MessageCircle, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SITE } from '@/content/site'
import { useConsent } from '@/lib/consent'
import { useLanding } from './LandingProvider'

/** Блоки, где панель мешает: свои кнопки есть на первом экране, у калькулятора — своя панель итога, в контактах — форма. */
const QUIET = ['[data-testid="hero"]', '#calculator', '#contacts']

/**
 * Нижняя панель на телефоне: позвонить, написать, рассчитать — действие под рукой на любом экране.
 * Плотный фон без размытия (производительность на сенсорных экранах), цели 44×44 px, учёт выреза снизу.
 */
export function MobileActionBar() {
  const { openLead } = useLanding()
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

  // Пока виден баннер cookie (выбор не сделан), панель не перекрывает его.
  const shown = !quiet && consent !== null && consent !== undefined

  return (
    <nav
      aria-label="Быстрые действия"
      data-testid="mobile-action-bar"
      data-shown={shown ? '' : undefined}
      inert={!shown}
      className={`on-dark fixed inset-x-2 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-inverse p-1.5 text-on-inverse shadow-2xl transition-[translate,opacity,visibility] duration-300 ease-[var(--ease-out-soft)] motion-reduce:transition-none lg:hidden ${
        shown ? 'visible translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-[150%] opacity-0'
      }`}
      style={{ bottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <a href={SITE.phoneHref} aria-label={`Позвонить: ${SITE.phoneDisplay}`} className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 active:bg-white/15">
        <Phone aria-hidden className="size-5" strokeWidth={1.6} />
      </a>
      <button
        type="button"
        aria-label="Написать в мессенджер"
        data-messenger="form"
        onClick={() => openLead({ title: 'Написать в мессенджер', source: 'messenger', extended: true, contactMethod: 'telegram' })}
        className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 active:bg-white/15"
      >
        <MessageCircle aria-hidden className="size-5" strokeWidth={1.6} />
      </button>
      <a href="#calculator" className="btn btn-light min-h-11 flex-1 justify-between px-4 text-sm whitespace-nowrap">
        Рассчитать стоимость
        <span className="btn-dot">
          <ArrowUpRight aria-hidden className="size-4" />
        </span>
      </a>
    </nav>
  )
}
