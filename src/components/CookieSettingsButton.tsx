'use client'

import { FOOTER_TEXT } from '@/content/texts'
import { resetConsent } from '@/lib/consent'

/** Изменить выбор по cookie в любой момент: баннер появляется снова. */
export function CookieSettingsButton() {
  return (
    <button type="button" className="link inline-flex min-h-11 cursor-pointer items-center" onClick={resetConsent}>
      {FOOTER_TEXT.cookieSettings}
    </button>
  )
}
