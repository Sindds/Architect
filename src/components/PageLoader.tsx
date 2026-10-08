'use client'

import { Compass } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SITE } from '@/content/site'
import { LOADER_KEY } from '@/lib/theme'

// Лоадер по образцу: тёмный экран, компас, название и полоса загрузки.
// Полоса показывает настоящие шаги: страница, шрифты, фото первого экрана. Без выдуманных «калибровок».
const MIN_MS = 450
const MAX_MS = 1400

function markVisited() {
  try {
    sessionStorage.setItem(LOADER_KEY, '1')
  } catch {
    // без хранилища лоадер просто покажется ещё раз
  }
}

export function PageLoader() {
  const [progress, setProgress] = useState(20)
  const [state, setState] = useState<'loading' | 'done' | 'gone'>('loading')

  useEffect(() => {
    if (document.documentElement.dataset.loader === 'skip') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState('gone')
      return
    }
    let cancelled = false
    const started = performance.now()
    const step = (value: number) => !cancelled && setProgress((p) => Math.max(p, value))

    const fonts = document.fonts.ready.then(() => step(65))
    const hero = document.querySelector<HTMLImageElement>('[data-hero-image]')
    const image = hero && !hero.complete ? hero.decode().catch(() => undefined) : Promise.resolve()
    const ready = Promise.all([fonts, image]).then(() => step(100))
    const cap = new Promise((resolve) => setTimeout(resolve, MAX_MS))

    Promise.race([ready, cap]).then(() => {
      const wait = Math.max(0, MIN_MS - (performance.now() - started))
      setTimeout(() => {
        if (cancelled) return
        setProgress(100)
        setState('done')
        markVisited()
      }, wait)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (state !== 'done') return
    const t = setTimeout(() => setState('gone'), 460)
    return () => clearTimeout(t)
  }, [state])

  if (state === 'gone') return null

  return (
    <div className="page-loader" data-state={state} data-testid="page-loader" role="status" aria-live="polite" aria-label="Загружаем страницу">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />
      <div className="relative flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <span className="loader-spin flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#7ea2c4]">
          <Compass aria-hidden className="size-7" strokeWidth={1.5} />
        </span>
        <div>
          <p className="display text-2xl font-bold tracking-[0.2em] sm:text-3xl">{SITE.brandFull}</p>
          <p className="label mt-2 text-[#9fc0de]">{SITE.descriptor}</p>
        </div>
        <div className="w-full">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-[#5b7e9f] to-[#8eb7dc] transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="label num mt-2 flex justify-between text-[#b9bec6]">
            <span>{progress < 100 ? 'Загружаем' : 'Готово'}</span>
            <span>{progress}%</span>
          </p>
        </div>
      </div>
    </div>
  )
}
