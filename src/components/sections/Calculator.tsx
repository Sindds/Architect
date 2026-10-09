'use client'

import { ArrowUpRight } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { ADDON_ORDER, PRICING, STYLE_ORDER, TIER_ORDER } from '@/content/pricing'
import { getProject } from '@/content/projects'
import type { AddonKey, Style, Tier } from '@/content/types'
import { formatDays, formatRub, groupDigits } from '@/lib/format'
import { breakdown, minPriceFor, ROUNDING_STEP } from '@/lib/pricing'
import { useLanding } from '../LandingProvider'

const AREA = { min: 100, max: 800, step: 10 }
const TERRACE = { min: 0, max: 200, step: 5 }
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function Calculator({ defaultStyle }: { defaultStyle: Style }) {
  const { calcPreset, openLead } = useLanding()
  const uid = useId()
  // Значения по умолчанию — CONTENT-SPEC §5.2: 350 м², «под чистовую», терраса 50 м², KNX.
  const [area, setArea] = useState(350)
  const [areaText, setAreaText] = useState('350')
  const [terrace, setTerrace] = useState(50)
  const [style, setStyle] = useState<Style>(defaultStyle)
  const [tier, setTier] = useState<Tier>('whitebox')
  const [addons, setAddons] = useState<AddonKey[]>(['knx'])
  const [presetName, setPresetName] = useState<string | null>(null)
  // Мобильная панель итога: видна, пока человек двигает параметры, а карточка результата за экраном.
  const controlsRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLElement>(null)
  const [controlsInView, setControlsInView] = useState(false)
  const [resultInView, setResultInView] = useState(false)

  useEffect(() => {
    const controls = controlsRef.current
    const result = resultRef.current
    if (!controls || !result) return
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === controls) setControlsInView(e.isIntersecting)
        if (e.target === result) setResultInView(e.isIntersecting)
      }
    })
    observer.observe(controls)
    observer.observe(result)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Префилл из окна проекта или ссылки /?calc=slug.
    const p = getProject(calcPreset)
    if (!p) return
    /* eslint-disable react-hooks/set-state-in-effect */
    setArea(p.area)
    setAreaText(String(p.area))
    setTerrace(p.terrace)
    setStyle(p.style)
    setPresetName(p.name)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [calcPreset])

  const b = breakdown({ area, terrace, style, tier, addons })

  const commitArea = (raw: string) => {
    const n = Number(raw.replace(/\D/g, ''))
    const v = Number.isFinite(n) && n > 0 ? clamp(Math.round(n / AREA.step) * AREA.step, AREA.min, AREA.max) : area
    setArea(v)
    setAreaText(String(v))
  }

  const estimate = [
    presetName ? `Проект ${presetName}` : null,
    `${PRICING.styles[style].title}, ${area} м², терраса ${terrace} м²`,
    PRICING.tiers[tier].title,
    ...addons.map((a) => PRICING.addons[a].title),
    `Итого ${formatRub(b.total)}, ${formatDays(b.days)}`,
  ]
    .filter(Boolean)
    .join('; ')

  return (
    <div className="grid gap-6 lg:grid-cols-12" data-testid="calculator">
      <div ref={controlsRef} className="card grid gap-7 p-5 sm:p-8 lg:col-span-7">
        {presetName && (
          <p className="label text-accent" role="status">
            Подставили параметры проекта {presetName}. Меняйте их как хотите.
          </p>
        )}
        <div>
          <div className="flex items-end justify-between gap-4">
            <label htmlFor={`${uid}-area`} className="font-medium">
              Площадь дома, м²
            </label>
            <input
              id={`${uid}-area-num`}
              aria-label="Площадь дома, м², числом"
              inputMode="numeric"
              className="field num w-28 text-right"
              value={areaText}
              onChange={(e) => setAreaText(e.target.value)}
              onBlur={(e) => commitArea(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && commitArea(e.currentTarget.value)}
              data-testid="calc-area-input"
            />
          </div>
          <input
            id={`${uid}-area`}
            type="range"
            min={AREA.min}
            max={AREA.max}
            step={AREA.step}
            value={area}
            onChange={(e) => {
              setArea(Number(e.target.value))
              setAreaText(e.target.value)
            }}
            className="mt-3 h-11 w-full cursor-pointer accent-[var(--c-accent-deco)]"
          />
          <div className="label num flex justify-between font-normal text-muted" aria-hidden>
            <span>{AREA.min}</span>
            <span>{AREA.max}</span>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <label htmlFor={`${uid}-terrace`} className="font-medium">
              Терраса, м²
            </label>
            <output htmlFor={`${uid}-terrace`} className="num font-medium">
              {terrace}
            </output>
          </div>
          <input
            id={`${uid}-terrace`}
            type="range"
            min={TERRACE.min}
            max={TERRACE.max}
            step={TERRACE.step}
            value={terrace}
            onChange={(e) => setTerrace(Number(e.target.value))}
            className="mt-3 h-11 w-full cursor-pointer accent-[var(--c-accent-deco)]"
          />
        </div>

        <fieldset>
          <legend className="mb-3 font-medium">Стиль</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {STYLE_ORDER.map((s) => (
              <Choice key={s} type="radio" name={`${uid}-style`} checked={style === s} onChange={() => setStyle(s)} label={PRICING.styles[s].title} hint={`от ${groupDigits(minPriceFor(tier, s))} ₽/м²`} />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 font-medium">Пакет</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {TIER_ORDER.map((t) => (
              <Choice key={t} type="radio" name={`${uid}-tier`} checked={tier === t} onChange={() => setTier(t)} label={PRICING.tiers[t].title} />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 font-medium">Опции</legend>
          <div className="grid gap-2">
            {ADDON_ORDER.map((a) => (
              <Choice
                key={a}
                type="checkbox"
                name={`${uid}-addon-${a}`}
                checked={addons.includes(a)}
                onChange={() => setAddons((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]))}
                label={PRICING.addons[a].title}
                hint={`${formatRub(PRICING.addons[a].price)}, +${formatDays(PRICING.addons[a].days)}`}
                description={PRICING.addons[a].note}
              />
            ))}
          </div>
        </fieldset>
      </div>

      <aside ref={resultRef} aria-label="Результат расчёта" className="lg:col-span-5">
        <div className="on-dark sticky top-28 rounded-3xl border border-white/10 bg-inverse p-6 text-on-inverse shadow-2xl sm:p-8">
          <p className="label text-[#9fc0de]">Предварительная смета</p>
          <dl className="num mt-4 grid gap-0 text-[0.9375rem]">
            <Row label={`Дом · ${area} м² × ${PRICING.styles[style].title.toLowerCase()}`} value={formatRub(b.house)} />
            <Row label={`Терраса · ${terrace} м²`} value={formatRub(b.terrace)} />
            {b.addons.map((a) => (
              <Row key={a.key} label={a.title} value={formatRub(a.price)} />
            ))}
          </dl>
          <div className="mt-5 border-t border-white/15 pt-4" aria-live="polite">
            <p className="text-sm text-on-inverse-muted">Итого, {PRICING.tiers[tier].title.toLowerCase()}</p>
            <p className="display num mt-1 text-[2.4rem] leading-none font-bold sm:text-[2.75rem]" data-testid="calc-total">
              {formatRub(b.total)}
            </p>
            <p className="num mt-3 flex flex-wrap gap-x-5 gap-y-1 text-on-inverse-muted">
              <span>{formatRub(b.perM2)} за м²</span>
              <span data-testid="calc-days">Срок — {formatDays(b.days)}</span>
            </p>
          </div>
          <p className="mt-4 text-sm text-on-inverse-muted">
            Это предварительный расчёт, итог округлён до {formatRub(ROUNDING_STEP)}. Точную смету мы закрепим в договоре после геологии и топосъёмки.
          </p>
          <button
            type="button"
            className="btn btn-light mt-5 w-full"
            onClick={() => openLead({ title: 'Получить смету в PDF', source: 'calculator', estimate, context: estimate })}
          >
            Получить смету в PDF
            <span className="btn-dot">
              <ArrowUpRight aria-hidden className="size-4" />
            </span>
          </button>
        </div>
      </aside>

      {controlsInView && !resultInView && (
        <div
          data-testid="calc-sticky"
          className="on-dark fixed inset-x-2 bottom-2 z-30 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-inverse py-2 pr-2 pl-4 text-on-inverse shadow-2xl lg:hidden"
        >
          <div className="min-w-0">
            <p className="text-xs text-on-inverse-muted">Итого, {PRICING.tiers[tier].title.toLowerCase()}</p>
            <p className="display num truncate text-xl font-bold">{formatRub(b.total)}</p>
          </div>
          <button
            type="button"
            className="btn btn-light shrink-0"
            onClick={() => resultRef.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })}
          >
            Смета
            <span className="btn-dot">
              <ArrowUpRight aria-hidden className="size-4" />
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 py-1.5">
      <dt className="text-on-inverse-muted">{label}</dt>
      <span aria-hidden className="flex-1 border-b border-dotted border-white/25" />
      <dd className="font-medium whitespace-nowrap">{value}</dd>
    </div>
  )
}

interface ChoiceProps {
  type: 'radio' | 'checkbox'
  name: string
  checked: boolean
  onChange: () => void
  label: string
  hint?: string
  description?: string
}

function Choice({ type, name, checked, onChange, label, hint, description }: ChoiceProps) {
  return (
    <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors hover:border-line-strong has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent">
      <input type={type} name={name} checked={checked} onChange={onChange} className="mt-1 size-4 shrink-0 accent-[var(--c-accent-deco)]" />
      <span className="grid flex-1 gap-0.5">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
          <span className="font-medium">{label}</span>
          {hint && <span className="num text-sm text-muted">{hint}</span>}
        </span>
        {description && <span className="text-sm text-muted">{description}</span>}
      </span>
    </label>
  )
}
