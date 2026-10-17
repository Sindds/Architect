'use client'

import dynamic from 'next/dynamic'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getProject } from '@/content/projects'
import type { VariantKey } from '@/content/types'
import type { CONTACT_METHODS, LeadSource } from '@/lib/lead-constants'

import type { SmetaInput } from '@/lib/smeta-token'
import { track } from '@/lib/analytics'
import { fullLayout } from '@/lib/lazy-sections'

// Окна грузятся отдельно, после гидратации: их кода нет в первой волне JS, первый экран рисуется быстрее.
// Окна закрыты, пока человек их не откроет, поэтому серверная разметка им не нужна.
const ProjectModal = dynamic(() => import('./modals/ProjectModal').then((m) => m.ProjectModal), { ssr: false })
const LeadModal = dynamic(() => import('./modals/LeadModal').then((m) => m.LeadModal), { ssr: false })

export interface LeadRequest {
  /** Заголовок формы = текст нажатой кнопки (правило CTA, CONTENT-SPEC §4). */
  title: string
  source: LeadSource
  context?: string
  estimate?: string
  /** Параметры дома для PDF-сметы: после заявки появится ссылка «Скачать смету (PDF)». */
  smeta?: SmetaInput
  quiz?: string
  /** Абзацы вступления над формой, если текст зависит от данных страницы (иначе — по source в LeadModal). */
  intro?: string[]
  extended?: boolean
  submitLabel?: string
  contactMethod?: keyof typeof CONTACT_METHODS
}

type Overlay = { kind: 'project'; slug: string } | null

interface LandingContextValue {
  variant: VariantKey
  openLead: (req: LeadRequest) => void
  openProject: (slug: string) => void
  calcPreset: string | null
  calculateProject: (slug: string) => void
}

const LandingContext = createContext<LandingContextValue | null>(null)

export function useLanding() {
  const ctx = useContext(LandingContext)
  if (!ctx) throw new Error('useLanding вне LandingProvider')
  return ctx
}

function readOverlay(): Overlay {
  const params = new URLSearchParams(window.location.search)
  const project = params.get('project')
  if (getProject(project)) return { kind: 'project', slug: project as string }
  return null
}

function urlWith(updates: Record<string, string | null>, hash = '') {
  const params = new URLSearchParams(window.location.search)
  for (const [k, v] of Object.entries(updates)) {
    if (v === null) params.delete(k)
    else params.set(k, v)
  }
  const query = params.toString()
  return `${window.location.pathname}${query ? `?${query}` : ''}${hash}`
}

export function LandingProvider({ variant, children }: { variant: VariantKey; children: React.ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [lead, setLead] = useState<LeadRequest | null>(null)
  const [calcPreset, setCalcPreset] = useState<string | null>(null)
  // Окно открыто кликом (есть запись в истории) или прямой ссылкой (записи нет).
  const pushed = useRef(false)
  // history.back() асинхронный: пока он не дошёл (popstate), новое окно не пишем в историю, иначе
  // запоздавший popstate закроет его. Окно показываем сразу, запись делаем после popstate.
  const backPending = useRef(false)
  const queued = useRef<Overlay>(null)

  const push = useCallback((next: NonNullable<Overlay>) => {
    window.history.pushState(null, '', urlWith({ project: next.slug, calc: null }))
    pushed.current = true
    setOverlay(next)
  }, [])

  useEffect(() => {
    // Прямой заход по ссылке /?project=slug открывает окно сразу.
    const initial = readOverlay()
    const preset = new URLSearchParams(window.location.search).get('calc')
    // Состояние из URL доступно только в браузере, поэтому читаем его после монтирования.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (initial) setOverlay(initial)
    if (getProject(preset)) setCalcPreset(preset)
    /* eslint-enable react-hooks/set-state-in-effect */
    const onPop = () => {
      pushed.current = false
      if (backPending.current) {
        backPending.current = false
        const next = queued.current
        queued.current = null
        if (next) push(next)
        return
      }
      setOverlay(readOverlay())
    }
    window.addEventListener('popstate', onPop)
    // Отметка «страница ожила»: кнопки до гидратации не работают. По ней тесты ждут готовности (tests/e2e/fixtures.ts).
    document.documentElement.dataset.hydrated = ''
    return () => window.removeEventListener('popstate', onPop)
  }, [push])

  // Цель «открыл проект» — и по клику, и по прямой ссылке, и по «Вперёд» в браузере.
  useEffect(() => {
    if (overlay) track('project_open', { slug: overlay.slug })
  }, [overlay])

  const openOverlay = useCallback((next: NonNullable<Overlay>) => {
    if (backPending.current) {
      queued.current = next
      setOverlay(next)
      return
    }
    push(next)
  }, [push])

  const closeOverlay = useCallback(() => {
    if (queued.current) {
      // Окно ещё не записано в историю: «Назад» в пути и вернёт адрес без параметра.
      queued.current = null
      setOverlay(null)
    } else if (pushed.current) {
      // «Назад» убирает параметр из адреса; состояние обновит обработчик popstate.
      pushed.current = false
      backPending.current = true
      window.history.back()
      setOverlay(null)
    } else {
      window.history.replaceState(null, '', urlWith({ project: null }))
      setOverlay(null)
    }
  }, [])

  const calculateProject = useCallback((slug: string) => {
    pushed.current = false
    setOverlay(null)
    window.history.replaceState(null, '', urlWith({ project: null, calc: slug }, '#calculator'))
    setCalcPreset(slug)
    requestAnimationFrame(() => {
      fullLayout()
      const target = document.getElementById('calculator')
      target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      target?.focus({ preventScroll: true })
    })
  }, [])

  const value = useMemo<LandingContextValue>(
    () => ({
      variant,
      openLead: (req) => {
        setLead(req)
      },
      openProject: (slug) => openOverlay({ kind: 'project', slug }),
      calcPreset,
      calculateProject,
    }),
    [variant, openOverlay, calcPreset, calculateProject],
  )

  const project = overlay ? getProject(overlay.slug) : undefined

  return (
    <LandingContext.Provider value={value}>
      {children}
      <ProjectModal project={project} onClose={closeOverlay} />
      <LeadModal request={lead} onClose={() => setLead(null)} />
    </LandingContext.Provider>
  )
}
