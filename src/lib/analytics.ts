import { SITE } from '@/content/site'

/** Цели Яндекс Метрики (PLAN P7.2). Идентификаторы совпадают с целями типа «JavaScript-событие» в счётчике (docs/ADMIN-GUIDE.md). */
export type Goal =
  | 'lead_submit'
  | 'quiz_start'
  | 'quiz_complete'
  | 'calc_interact'
  | 'pdf_download'
  | 'phone_click'
  | 'messenger_click'
  | 'project_open'
  | 'case_open'
  | 'excursion_click'

type Params = Record<string, string | number | boolean>

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void
  }
}

const counter = () => Number(SITE.metrikaId) || 0

/**
 * Достигнута цель. Счётчик появляется только после «Принять все» (src/components/Metrika.tsx);
 * без него вызов ничего не делает. Персональных данных в параметрах нет: источник, вариант, slug.
 */
export function track(goal: Goal, params?: Params): void {
  if (typeof window === 'undefined' || typeof window.ym !== 'function') return
  window.ym(counter(), 'reachGoal', goal, params)
}

/** ClientID Метрики для заявки: по нему CRM загружает офлайн-конверсии. Без счётчика — пусто. */
export function getClientId(): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof window.ym !== 'function' || !counter()) return resolve(undefined)
    const timer = setTimeout(() => resolve(undefined), 1500)
    window.ym(counter(), 'getClientID', (id: unknown) => {
      clearTimeout(timer)
      resolve(typeof id === 'string' || typeof id === 'number' ? String(id).slice(0, 40) : undefined)
    })
  })
}
