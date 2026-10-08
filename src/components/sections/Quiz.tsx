'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { PRICING, STYLE_ORDER } from '@/content/pricing'
import type { Style } from '@/content/types'
import { formatMln } from '@/lib/format'
import { priceFor } from '@/lib/pricing'
import { useLanding } from '../LandingProvider'

// Сроки старта — относительно текущей даты, без зашитых годов (PLAN P5.3).
const AREAS = [
  { label: 'До 250 м²', range: [150, 250] },
  { label: '250–350 м²', range: [250, 350] },
  { label: '350–500 м²', range: [350, 500] },
  { label: 'Больше 500 м²', range: [500, 700] },
] as const

const STYLES = [...STYLE_ORDER.map((s) => ({ label: PRICING.styles[s].title, style: s as Style | null })), { label: 'Пока не знаю', style: null }]

const START = ['В ближайшие 3 месяца', 'В течение года', 'Пока изучаю варианты']
const LAND = ['Участок есть', 'Покупаю участок', 'Участка пока нет']

const QUESTIONS = ['Какой площади дом?', 'Какой стиль ближе?', 'Когда хотите начать?', 'Что с участком?'] as const

export function Quiz() {
  const { openLead } = useLanding()
  const uid = useId()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null, null])
  const headingRef = useRef<HTMLHeadingElement>(null)
  const done = step === QUESTIONS.length

  const options: string[][] = [AREAS.map((a) => a.label), STYLES.map((s) => s.label), START, LAND]

  const go = (next: number) => {
    setStep(next)
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  const range = () => {
    const area = AREAS[answers[0] ?? 0]!.range
    const style = STYLES[answers[1] ?? 4]!.style
    const styles: Style[] = style ? [style] : [...STYLE_ORDER]
    const low = Math.min(...styles.map((s) => priceFor({ area: area[0], terrace: 0, style: s, tier: 'contour', addons: [] })))
    const high = Math.max(...styles.map((s) => priceFor({ area: area[1], terrace: 0, style: s, tier: 'turnkey', addons: [] })))
    return { low, high }
  }

  const summary = () => QUESTIONS.map((q, i) => `${q} — ${options[i]?.[answers[i] ?? -1] ?? '—'}`).join('; ')

  if (done) {
    const { low, high } = range()
    return (
      <div className="grid gap-6 lg:grid-cols-12" data-testid="quiz-result">
        <div className="lg:col-span-7">
          <h3 ref={headingRef} tabIndex={-1} className="font-display text-[2rem] font-medium leading-tight outline-none">
            Ваша вилка: от {formatMln(low)} до {formatMln(high)}
          </h3>
          <p className="mt-3 text-ink-2">
            Нижняя граница — тёплый контур минимальной площади, верхняя — под ключ максимальной. Без террасы и опций. Точная цена — после того как
            уточним проект и участок.
          </p>
          <ul className="mt-5 grid gap-1.5 text-[0.9375rem]">
            {QUESTIONS.map((q, i) => (
              <li key={q} className="flex gap-2">
                <span className="text-ink-2">{q}</span>
                <span className="font-medium">{options[i]?.[answers[i] ?? -1]}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="link mt-4 cursor-pointer text-ink-2" onClick={() => go(0)}>
            Изменить ответы
          </button>
        </div>
        <div className="lg:col-span-5">
          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={() =>
              openLead({
                title: 'Получить расчёт',
                source: 'quiz',
                quiz: summary(),
                context: `Вилка ${formatMln(low)} — ${formatMln(high)}`,
                extended: true,
              })
            }
          >
            Получить расчёт
          </button>
          <p className="mt-3 text-sm text-ink-2">Перезвоним, уточним детали и пришлём смету в PDF.</p>
        </div>
      </div>
    )
  }

  const current = answers[step] ?? null
  return (
    <div data-testid="quiz">
      <div className="flex items-center gap-4">
        <p className="label num text-ink-2">
          Вопрос {step + 1} из {QUESTIONS.length}
        </p>
        <div className="h-1 flex-1 bg-paper-2" role="progressbar" aria-label="Прогресс квиза" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={step}>
          <div className="h-full bg-accent transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>
      <fieldset className="mt-6">
        <legend>
          <h3 ref={headingRef} tabIndex={-1} className="font-display text-[2rem] font-medium leading-tight outline-none">
            {QUESTIONS[step]}
          </h3>
        </legend>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {options[step]?.map((label, i) => (
            <label
              key={label}
              className="flex min-h-14 cursor-pointer items-center gap-3 border border-ink-3/70 bg-sheet px-4 transition-colors hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
            >
              <input
                type="radio"
                name={`${uid}-q${step}`}
                checked={current === i}
                onChange={() => setAnswers((a) => a.map((x, j) => (j === step ? i : x)))}
                className="size-4 accent-[var(--color-accent)]"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}>
            <ArrowLeft aria-hidden className="size-4" />
            Назад
          </button>
        )}
        <button type="button" className="btn btn-primary" disabled={current === null} onClick={() => go(step + 1)}>
          {step === QUESTIONS.length - 1 ? 'Показать вилку цены' : 'Далее'}
          <ArrowRight aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  )
}
