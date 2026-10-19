'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { CALC_LIMITS, PRICING, STYLE_ORDER } from '@/content/pricing'
import { QUIZ_TEXT as T } from '@/content/texts'
import type { Style } from '@/content/types'
import { formatMlnRange } from '@/lib/format'
import { priceFor } from '@/lib/pricing'
import { useLanding } from '../LandingProvider'
import { revealOrder } from '@/lib/reveal'
import { track } from '@/lib/analytics'

// Сроки старта — относительно текущей даты, без зашитых годов (PLAN P5.3).
const AREAS = [
  // Нижняя граница — минимальная площадь калькулятора, 100 м² (решение 12.10.2026).
  { label: T.areas[0], range: [CALC_LIMITS.area.min, 250] },
  { label: T.areas[1], range: [250, 350] },
  { label: T.areas[2], range: [350, 500] },
  { label: T.areas[3], range: [500, 700] },
] as const

const STYLES = [...STYLE_ORDER.map((s) => ({ label: PRICING.styles[s].title, style: s as Style | null })), { label: T.styleUnknown, style: null }]

const START = T.start
const LAND = T.land
const QUESTIONS = T.questions

export function Quiz() {
  const { openLead } = useLanding()
  const uid = useId()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null, null])
  const headingRef = useRef<HTMLHeadingElement>(null)
  const done = step === QUESTIONS.length
  const started = useRef(false)

  useEffect(() => {
    if (done) track('quiz_complete')
  }, [done])

  const options: (readonly string[])[] = [AREAS.map((a) => a.label), STYLES.map((s) => s.label), START, LAND]

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
      // Карточка результата и под ней кнопка заявки — одной колонкой на любой ширине (правка заказчика 17.10.2026).
      <div className="grid gap-6" data-testid="quiz-result">
        <div className="reveal card p-6 sm:p-8">
          <h3 ref={headingRef} tabIndex={-1} className="display text-2xl leading-tight font-bold outline-none sm:text-3xl">
            {T.result(formatMlnRange(low, high))}
          </h3>
          <p className="mt-3 text-muted">
            {T.resultNote}
          </p>
          <ul className="mt-5 grid gap-1.5 text-[0.9375rem]">
            {QUESTIONS.map((q, i) => (
              <li key={q} className="flex gap-2">
                <span className="text-muted">{q}</span>
                <span className="font-medium">{options[i]?.[answers[i] ?? -1]}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="link mt-4 inline-flex min-h-11 cursor-pointer items-center text-muted" onClick={() => go(0)}>
            {T.change}
          </button>
        </div>
        <div className="reveal flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <button
            type="button"
            className="btn btn-primary w-full sm:w-auto"
            onClick={() =>
              openLead({
                title: T.submit,
                source: 'quiz',
                quiz: summary(),
                context: T.leadContext(formatMlnRange(low, high)),
                extended: true,
              })
            }
          >
            {T.submit}
            <span className="btn-dot">
              <ArrowRight aria-hidden className="size-4" />
            </span>
          </button>
          <p className="text-sm text-muted">{T.submitNote}</p>
        </div>
      </div>
    )
  }

  const current = answers[step] ?? null
  return (
    <div className="reveal card p-6 sm:p-8" style={revealOrder(1)} data-testid="quiz">
      <div className="flex items-center gap-4">
        <p className="label num font-medium text-muted">
          {T.counter(step + 1, QUESTIONS.length)}
        </p>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-subtle" role="progressbar" aria-label={T.progress} aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={step}>
          <div className="h-full rounded-full bg-accent-deco transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>
      <fieldset className="mt-6">
        <legend>
          <h3 ref={headingRef} tabIndex={-1} className="display text-2xl leading-tight font-bold outline-none sm:text-3xl">
            {QUESTIONS[step]}
          </h3>
        </legend>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {options[step]?.map((label, i) => (
            <label
              key={label}
              className="flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border border-line bg-surface px-4 transition-colors hover:border-line-strong has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
            >
              <input
                type="radio"
                name={`${uid}-q${step}`}
                checked={current === i}
                onChange={() => {
                  if (!started.current) {
                    started.current = true
                    track('quiz_start')
                  }
                  setAnswers((a) => a.map((x, j) => (j === step ? i : x)))
                }}
                className="size-4 accent-[var(--c-accent-deco)]"
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
            {T.back}
          </button>
        )}
        <button type="button" className="btn btn-primary" disabled={current === null} onClick={() => go(step + 1)}>
          {step === QUESTIONS.length - 1 ? T.finish : T.next}
          <span className="btn-dot">
            <ArrowRight aria-hidden className="size-4" />
          </span>
        </button>
      </div>
    </div>
  )
}
