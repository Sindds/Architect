'use client'

import { ArrowUpRight } from 'lucide-react'
import { COPY } from '@/content/texts'

/** Основная кнопка первого экрана: ведёт к квизу в блоке расчёта. */
export function QuizButton() {
  return (
    <a href="#calculator" className="btn btn-light" onClick={() => window.dispatchEvent(new CustomEvent('arcline:open-quiz'))}>
      {COPY.hero.quizButton}
      <span className="btn-dot">
        <ArrowUpRight aria-hidden className="size-4" />
      </span>
    </a>
  )
}
