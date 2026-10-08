'use client'

import { ArrowUpRight, Menu, MessageCircle, Phone, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SITE } from '@/content/site'
import { useLanding } from '../LandingProvider'
import { ThemeToggle } from '../ThemeToggle'
import { Logo } from '../ui/Logo'

/** Плавающая шапка-капсула. Над тёмным первым экраном — стекло, после прокрутки — цвет темы. */
export function Header() {
  const { openLead } = useLanding()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const menuRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const item of SITE.nav) {
      const el = document.getElementById(item.href.slice(1))
      if (el) observer.observe(el)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  const messenger = () => openLead({ title: 'Написать в мессенджер', source: 'messenger', extended: true, contactMethod: 'telegram' })
  const calc = () => openLead({ title: 'Рассчитать стоимость', source: 'header' })

  const glass = !scrolled
  const iconBtn = glass ? 'border border-white/20 text-white hover:bg-white/15' : 'border border-line text-fg hover:bg-subtle'

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-2 pt-2 sm:px-4 sm:pt-4 md:px-6">
      <div
        data-testid="nav-capsule"
        className={`pointer-events-auto mx-auto flex max-w-[94rem] items-center gap-1.5 rounded-full py-1.5 pl-3 pr-1.5 shadow-xl transition-[background-color,border-color,color] duration-300 sm:gap-2 sm:pl-5 ${
          glass ? 'border border-white/15 bg-black/55 text-white backdrop-blur-md' : 'border border-line bg-surface/95 text-fg backdrop-blur-xl'
        }`}
      >
        <a href="#top" className="mr-auto inline-flex min-h-11 min-w-0 items-center" aria-label={`${SITE.brandFull}, в начало страницы`}>
          <Logo />
        </a>

        <nav aria-label="Разделы страницы" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {SITE.nav.map((item) => {
              const current = active === item.href
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={current ? 'true' : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full px-3.5 text-sm font-medium transition-colors ${
                      current ? (glass ? 'bg-white/20' : 'bg-fg text-bg') : glass ? 'hover:bg-white/15' : 'hover:bg-subtle'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <a href={SITE.phoneHref} className="num hidden min-h-11 items-center px-3 text-sm font-semibold whitespace-nowrap xl:inline-flex" data-testid="header-phone">
          {SITE.phoneDisplay}
        </a>
        <a href={SITE.phoneHref} className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors xl:hidden ${iconBtn}`} aria-label={`Позвонить: ${SITE.phoneDisplay}`}>
          <Phone aria-hidden className="size-5" strokeWidth={1.6} />
        </a>
        <button type="button" onClick={messenger} className={`inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors ${iconBtn}`} aria-label="Написать в мессенджер">
          <MessageCircle aria-hidden className="size-5" strokeWidth={1.6} />
        </button>
        <ThemeToggle className={iconBtn} />
        <button type="button" onClick={calc} className={`btn hidden sm:inline-flex ${glass ? 'btn-light' : 'btn-primary'}`}>
          Рассчитать стоимость
          <span className="btn-dot">
            <ArrowUpRight aria-hidden className="size-4" />
          </span>
        </button>
        <button
          type="button"
          onClick={() => menuRef.current?.showModal()}
          className={`inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors lg:hidden ${iconBtn}`}
          aria-label="Открыть меню"
        >
          <Menu aria-hidden className="size-5" strokeWidth={1.6} />
        </button>
      </div>

      <dialog
        ref={menuRef}
        aria-label="Меню"
        className="pointer-events-auto m-0 h-dvh max-h-dvh w-full max-w-full bg-[#0b0c0e]/95 p-0 text-white backdrop-blur-2xl"
        onClick={(e) => {
          if (e.target === e.currentTarget) menuRef.current?.close()
        }}
      >
        <div className="on-dark flex h-full flex-col px-6 pb-8">
          <div className="flex h-20 items-center justify-between border-b border-white/15">
            <Logo />
            <button type="button" onClick={() => menuRef.current?.close()} className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10" aria-label="Закрыть меню">
              <X aria-hidden className="size-6" strokeWidth={1.6} />
            </button>
          </div>
          <nav aria-label="Разделы страницы (мобильное меню)" className="mt-6">
            <ul className="grid gap-1">
              {SITE.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={() => menuRef.current?.close()} className="display flex min-h-14 items-center text-2xl font-bold transition-colors hover:text-[#9fc0de]">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto grid gap-3">
            <a href={SITE.phoneHref} className="num rounded-2xl border border-white/15 bg-white/10 p-4 text-lg font-semibold">
              {SITE.phoneDisplay}
              <span className="mt-1 block text-sm font-normal text-[#b9bec6]">{SITE.hours}</span>
            </a>
            <button
              type="button"
              className="btn btn-light w-full"
              onClick={() => {
                menuRef.current?.close()
                calc()
              }}
            >
              Рассчитать стоимость
              <span className="btn-dot">
                <ArrowUpRight aria-hidden className="size-4" />
              </span>
            </button>
          </div>
        </div>
      </dialog>
    </header>
  )
}
