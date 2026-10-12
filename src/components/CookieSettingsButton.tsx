'use client'

import { resetConsent } from '@/lib/consent'

/** Изменить выбор по cookie в любой момент: баннер появляется снова. */
export function CookieSettingsButton() {
  return (
    <button type="button" className="link inline-flex min-h-11 cursor-pointer items-center" onClick={resetConsent}>
      Настройки cookie
    </button>
  )
}
