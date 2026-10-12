'use client'

import { useCallback, useSyncExternalStore } from 'react'

/** Выбор по cookie хранится в браузере. Сторонние сервисы (Яндекс Карты) грузятся только после «Принять все». */
export const CONSENT_KEY = 'arcline-cookies'
export type Consent = 'all' | 'necessary'
const EVENT = 'arcline:consent'
/** Запасная копия выбора в памяти страницы: если хранилище недоступно (приватный режим), выбор действует до перезагрузки. */
let memory: Consent | null = null

function read(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'all' || v === 'necessary' ? v : memory
  } catch {
    return memory
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

/** `undefined` — ещё не прочитано (сервер и гидратация), `null` — выбора нет. */
export function useConsent(): [Consent | null | undefined, (v: Consent) => void] {
  const consent = useSyncExternalStore<Consent | null | undefined>(subscribe, read, () => undefined)
  const save = useCallback((v: Consent) => {
    memory = v
    try {
      localStorage.setItem(CONSENT_KEY, v)
    } catch {
      // Хранилище недоступно (приватный режим): выбор действует до перезагрузки.
    }
    window.dispatchEvent(new Event(EVENT))
  }, [])
  return [consent, save]
}

/** «Настройки cookie» в футере: стираем выбор, баннер появляется снова. */
export function resetConsent() {
  memory = null
  try {
    localStorage.removeItem(CONSENT_KEY)
  } catch {
    // Хранилище недоступно: баннер и так показывается при каждом входе.
  }
  window.dispatchEvent(new Event(EVENT))
}
