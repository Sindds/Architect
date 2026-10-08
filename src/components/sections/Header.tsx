'use client'

import { Menu, MessageCircle, Phone, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SITE } from '@/content/site'
import { useLanding } from '../LandingProvider'
import { Logo } from '../ui/Logo'

export function Header() {
  const { openLead } = useLanding()
  const [compact, setCompact] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const menuRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Подсветка пункта меню текущей секции.
    const ids = SITE.nav.map((n) => n.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  const messenger = () => openLead({ title: 'Написать в мессенджер', source: 'messenger', extended: true, contactMethod: 'telegram' })
  const calc = () => openLead({ title: 'Рассчитать стоимость', source: 'header' })

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300 ${
        compact ? 'border-line bg-paper/92 backdrop-blur-md' : 'border-transparent bg-paper'
      }`}
    >
      <div className={`shell flex items-center gap-2 transition-[height] sm:gap-4 duration-300 motion-reduce:transition-none ${compact ? 'h-16' : 'h-20'}`}>
        <a href="#top" className="mr-auto inline-flex min-h-11 min-w-0 items-center" aria-label={`${SITE.brandFull} — в начало страницы`}>
          <Logo />
        </a>

        <nav aria-label="Разделы страницы" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {SITE.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={active === item.href ? 'true' : undefined}
                  className="relative inline-flex min-h-11 items-center px-3 text-[0.9375rem] text-ink-2 transition-colors hover:text-ink aria-[current=true]:text-ink"
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-3 bottom-2 h-px origin-left bg-accent transition-transform duration-300 ${active === item.href ? 'scale-x-100' : 'scale-x-0'}`}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href={SITE.phoneHref} className="num hidden min-h-11 items-center font-medium whitespace-nowrap md:inline-flex" data-testid="header-phone">
          {SITE.phoneDisplay}
        </a>
        <a href={SITE.phoneHref} className="inline-flex size-11 shrink-0 items-center justify-center border border-ink-3 md:hidden" aria-label={`Позвонить: ${SITE.phoneDisplay}`}>
          <Phone aria-hidden className="size-5" strokeWidth={1.5} />
        </a>
        <button type="button" onClick={messenger} className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center border border-ink-3 transition-colors hover:border-ink" aria-label="Написать в мессенджер">
          <MessageCircle aria-hidden className="size-5" strokeWidth={1.5} />
        </button>
        <button type="button" onClick={calc} className="btn btn-primary hidden sm:inline-flex">
          Рассчитать стоимость
        </button>
        <button
          type="button"
          onClick={() => menuRef.current?.showModal()}
          className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center border border-ink-3 lg:hidden"
          aria-label="Открыть меню"
        >
          <Menu aria-hidden className="size-5" strokeWidth={1.5} />
        </button>
      </div>

      <dialog
        ref={menuRef}
        aria-label="Меню"
        className="ml-auto mr-0 h-dvh max-h-dvh w-[min(22rem,100%)] bg-sheet p-0 text-ink"
        onClick={(e) => {
          if (e.target === e.currentTarget) menuRef.current?.close()
        }}
      >
        <div className="flex h-full flex-col px-5 pb-6">
          <div className="flex h-20 items-center justify-between">
            <Logo />
            <button type="button" onClick={() => menuRef.current?.close()} className="inline-flex size-11 cursor-pointer items-center justify-center" aria-label="Закрыть меню">
              <X aria-hidden className="size-6" strokeWidth={1.5} />
            </button>
          </div>
          <nav aria-label="Разделы страницы (мобильное меню)">
            <ul className="border-t border-line">
              {SITE.nav.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <a href={item.href} onClick={() => menuRef.current?.close()} className="flex min-h-14 items-center font-display text-2xl">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto grid gap-3">
            <a href={SITE.phoneHref} className="num text-xl font-medium">
              {SITE.phoneDisplay}
            </a>
            <p className="text-sm text-ink-2">{SITE.hours}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                menuRef.current?.close()
                calc()
              }}
            >
              Рассчитать стоимость
            </button>
          </div>
        </div>
      </dialog>
    </header>
  )
}
