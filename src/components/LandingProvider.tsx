'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getCase } from '@/content/cases'
import { getProject } from '@/content/projects'
import type { VariantKey } from '@/content/types'
import type { LeadSource } from '@/lib/lead-schema'
import { CaseModal } from './modals/CaseModal'
import { LeadModal } from './modals/LeadModal'
import { ProjectModal } from './modals/ProjectModal'

export interface LeadRequest {
  /** Заголовок формы = текст нажатой кнопки (правило CTA, CONTENT-SPEC §4). */
  title: string
  source: LeadSource
  context?: string
  estimate?: string
  quiz?: string
  extended?: boolean
  submitLabel?: string
  contactMethod?: 'call' | 'telegram' | 'whatsapp' | 'max'
}

type Overlay = { kind: 'project'; slug: string } | { kind: 'case'; slug: string } | null

interface LandingContextValue {
  variant: VariantKey
  openLead: (req: LeadRequest) => void
  openProject: (slug: string) => void
  openCase: (slug: string) => void
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
  const kase = params.get('case')
  if (getCase(kase)) return { kind: 'case', slug: kase as string }
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

  useEffect(() => {
    // Прямой заход по ссылке /?project=slug или /?case=slug открывает окно сразу.
    const initial = readOverlay()
    const preset = new URLSearchParams(window.location.search).get('calc')
    // Состояние из URL доступно только в браузере, поэтому читаем его после монтирования.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (initial) setOverlay(initial)
    if (getProject(preset)) setCalcPreset(preset)
    /* eslint-enable react-hooks/set-state-in-effect */
    const onPop = () => {
      pushed.current = false
      setOverlay(readOverlay())
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const openOverlay = useCallback((next: NonNullable<Overlay>) => {
    const key = next.kind
    const other = key === 'project' ? 'case' : 'project'
    window.history.pushState(null, '', urlWith({ [key]: next.slug, [other]: null, calc: null }))
    pushed.current = true
    setOverlay(next)
  }, [])

  const closeOverlay = useCallback(() => {
    if (pushed.current) {
      // «Назад» убирает параметр из адреса; состояние обновит обработчик popstate.
      pushed.current = false
      window.history.back()
      setOverlay(null)
    } else {
      window.history.replaceState(null, '', urlWith({ project: null, case: null }))
      setOverlay(null)
    }
  }, [])

  const calculateProject = useCallback((slug: string) => {
    pushed.current = false
    setOverlay(null)
    window.history.replaceState(null, '', urlWith({ project: null, case: null, calc: slug }, '#calculator'))
    setCalcPreset(slug)
    requestAnimationFrame(() => {
      const target = document.getElementById('calculator')
      target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      target?.focus({ preventScroll: true })
    })
  }, [])

  const value = useMemo<LandingContextValue>(
    () => ({
      variant,
      openLead: setLead,
      openProject: (slug) => openOverlay({ kind: 'project', slug }),
      openCase: (slug) => openOverlay({ kind: 'case', slug }),
      calcPreset,
      calculateProject,
    }),
    [variant, openOverlay, calcPreset, calculateProject],
  )

  const project = overlay?.kind === 'project' ? getProject(overlay.slug) : undefined
  const kase = overlay?.kind === 'case' ? getCase(overlay.slug) : undefined

  return (
    <LandingContext.Provider value={value}>
      {children}
      <ProjectModal project={project} onClose={closeOverlay} />
      <CaseModal kase={kase} onClose={closeOverlay} />
      <LeadModal request={lead} onClose={() => setLead(null)} />
    </LandingContext.Provider>
  )
}
