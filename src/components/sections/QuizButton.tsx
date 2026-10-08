'use client'

import { ArrowRight } from 'lucide-react'

/** Основная кнопка первого экрана: ведёт к квизу в блоке калькулятора. */
export function QuizButton() {
  return (
    <a
      href="#calculator"
      className="btn btn-primary"
      onClick={() => window.dispatchEvent(new CustomEvent('arcline:open-quiz'))}
    >
      Рассчитать стоимость за 2 минуты
      <ArrowRight aria-hidden className="size-4" />
    </a>
  )
}
