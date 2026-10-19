import { SITE } from '@/content/site'

const CHANNELS = [
  { key: 'telegram', label: 'Telegram', href: SITE.messengers.telegram },
  { key: 'max', label: 'MAX', href: SITE.messengers.max },
  { key: 'vk', label: 'ВКонтакте', href: SITE.messengers.vk },
  { key: 'whatsapp', label: 'WhatsApp', href: SITE.messengers.whatsapp },
] as const

/**
 * Прямые ссылки на чаты компании: щелчок открывает мессенджер в новой вкладке, без формы.
 * Канал без ссылки в SITE.messengers не показывается. data-messenger — цель Метрики messenger_click.
 */
export function MessengerLinks({ className = 'btn btn-ghost' }: { className?: string }) {
  return (
    <>
      {CHANNELS.filter((c) => c.href).map((c) => (
        <a key={c.key} href={c.href} target="_blank" rel="noopener noreferrer" className={className} data-messenger={c.key}>
          {c.label}
        </a>
      ))}
    </>
  )
}

/** Есть ли хоть одна прямая ссылка: тогда в форме мессенджера показываем «написать сразу». */
export const hasMessengerLinks = CHANNELS.some((c) => c.href)
