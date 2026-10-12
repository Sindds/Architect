'use client'

import { SITE } from '@/content/site'
import { useLanding } from './LandingProvider'

const CHANNELS = [
  { key: 'telegram', label: 'Telegram', href: SITE.messengers.telegram },
  { key: 'max', label: 'MAX', href: SITE.messengers.max },
] as const

/**
 * Написать в мессенджер без формы. Если ссылка не задана (концепт), кнопка открывает форму с этим мессенджером:
 * человек оставляет номер, менеджер пишет первым.
 */
export function MessengerLinks({ className = 'btn btn-ghost', onNavigate }: { className?: string; onNavigate?: () => void }) {
  const { openLead } = useLanding()
  return (
    <>
      {CHANNELS.map((c) =>
        c.href ? (
          <a key={c.key} href={c.href} target="_blank" rel="noopener" className={className} data-messenger={c.key} onClick={onNavigate}>
            {c.label}
          </a>
        ) : (
          <button
            key={c.key}
            type="button"
            className={className}
            data-messenger={c.key}
            onClick={() => {
              onNavigate?.()
              openLead({ title: `Написать в ${c.label}`, source: 'messenger', extended: true, contactMethod: c.key })
            }}
          >
            {c.label}
          </button>
        ),
      )}
    </>
  )
}

/** Есть ли хоть одна прямая ссылка: тогда в форме мессенджера показываем «написать сразу». */
export const hasMessengerLinks = CHANNELS.some((c) => c.href)
