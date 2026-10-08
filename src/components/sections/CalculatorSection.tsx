'use client'

import { useEffect, useRef, useState } from 'react'
import type { Style } from '@/content/types'
import { useLanding } from '../LandingProvider'
import { SectionHead } from '../ui/SectionHead'
import { Calculator } from './Calculator'
import { Quiz } from './Quiz'

const TABS = [
  { key: 'calc', label: 'Калькулятор' },
  { key: 'quiz', label: 'Квиз за 2 минуты' },
] as const

export function CalculatorSection({ defaultStyle }: { defaultStyle: Style }) {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('calc')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { calcPreset } = useLanding()

  useEffect(() => {
    // «Рассчитать этот проект» всегда показывает калькулятор.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (calcPreset) setTab('calc')
  }, [calcPreset])

  useEffect(() => {
    const open = () => setTab('quiz')
    window.addEventListener('arcline:open-quiz', open)
    return () => window.removeEventListener('arcline:open-quiz', open)
  }, [])

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length
    setTab(TABS[next]!.key)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="calculator" tabIndex={-1} aria-labelledby="calc-title" className="border-t border-line bg-sheet py-16 outline-none lg:py-24">
      <div className="shell">
        <SectionHead
          id="calc-title"
          index="05"
          label="Расчёт"
          title="Посчитайте дом сами — по тем же ставкам, что в договоре"
          lead="Калькулятор — если знаете параметры. Квиз — если пока выбираете: четыре вопроса и вилка цены."
        />
        <div role="tablist" aria-label="Способ расчёта" className="mt-10 inline-flex border border-ink">
          {TABS.map((t, i) => (
            <button
              key={t.key}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              id={`tab-${t.key}`}
              role="tab"
              type="button"
              aria-selected={tab === t.key}
              aria-controls={`panel-${t.key}`}
              tabIndex={tab === t.key ? 0 : -1}
              onClick={() => setTab(t.key)}
              onKeyDown={(e) => onKey(e, i)}
              className="min-h-12 cursor-pointer px-5 font-medium transition-colors aria-selected:bg-ink aria-selected:text-sheet"
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-10">
          <div id="panel-calc" role="tabpanel" aria-labelledby="tab-calc" hidden={tab !== 'calc'}>
            <Calculator defaultStyle={defaultStyle} />
          </div>
          <div id="panel-quiz" role="tabpanel" aria-labelledby="tab-quiz" hidden={tab !== 'quiz'}>
            <Quiz />
          </div>
        </div>
      </div>
    </section>
  )
}
