'use client'

import { ErrorScreen } from '@/components/ErrorScreen'
import { COPY } from '@/content/copy'
import { fontVariables } from './fonts'
import './globals.css'

/** Сбой в корневом layout: этот экран заменяет его целиком, поэтому свои html, body, шрифты и стили. */
export default function GlobalError() {
  return (
    <html lang="ru" className={fontVariables}>
      <body>
        <title>{COPY.ui.errorTitle}</title>
        <ErrorScreen />
      </body>
    </html>
  )
}
