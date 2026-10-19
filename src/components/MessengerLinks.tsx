import { SITE } from '@/content/site'
import { MESSENGER_LABELS } from '@/content/texts'

const CHANNELS = (['telegram', 'max', 'vk', 'whatsapp'] as const).map((key) => ({ key, label: MESSENGER_LABELS[key], href: SITE.messengers[key] }))

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
