'use client'

import { ArrowUpRight } from 'lucide-react'

/** Основная кнопка первого экрана: ведёт к квизу в блоке расчёта. */
export function QuizButton() {
  return (
    <a href="#calculator" className="btn btn-light" onClick={() => window.dispatchEvent(new CustomEvent('arcline:open-quiz'))}>
      Узнать цену за 2&nbsp;минуты
      <span className="btn-dot">
        <ArrowUpRight aria-hidden className="size-4" />
      </span>
    </a>
  )
}
