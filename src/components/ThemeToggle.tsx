'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { THEME_KEY, type Theme } from '@/lib/theme'

function applyTheme(next: Theme) {
  const root = document.documentElement
  root.dataset.theme = next
  root.style.colorScheme = next
  try {
    localStorage.setItem(THEME_KEY, next)
  } catch {
    // Хранилище может быть недоступно (приватный режим) — тема просто не запомнится.
  }
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    // Тему уже выставил скрипт в <head>; читаем её после монтирования.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    const run = () => {
      applyTheme(next)
      setTheme(next)
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    if (doc.startViewTransition && !reduced) doc.startViewTransition(run)
    else run()
  }

  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors ${className}`}
      aria-label={dark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      title={dark ? 'Светлая тема' : 'Тёмная тема'}
    >
      {dark ? <Sun aria-hidden className="size-5" strokeWidth={1.6} /> : <Moon aria-hidden className="size-5" strokeWidth={1.6} />}
    </button>
  )
}
