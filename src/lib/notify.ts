import type { LeadSource } from './lead-schema'
import { SINK_LABELS, type SinkResult } from './leads/deliver'
import { SOURCE_LABELS } from './leads/record'

/**
 * Текст уведомления: номер заявки, источник, вариант и где она сохранена — ссылка на карточку в CRM.
 * Имени и телефона нет (152-ФЗ, правило 7 CLAUDE.md); текст ошибок хранилищ — только в журнале сервера.
 */
export function leadNotificationText(id: number, source: LeadSource, variant?: string, results: SinkResult[] = []): string {
  const lines = [`Новая заявка №${id}. Источник: ${SOURCE_LABELS[source]}. Вариант: ${variant ?? 'default'}.`]
  for (const r of results) {
    const label = SINK_LABELS[r.sink]
    if (!r.ok) lines.push(`Не принята в ${label}. Подробности в журнале сервера.`)
    else if (r.url) lines.push(`${label}: ${r.url}`)
    else if (r.sink !== 'file') lines.push(`${label}: принята${r.ref ? `, №${r.ref}` : ''}`)
  }
  if (results.length && !results.some((r) => r.ok)) lines.push('Заявка нигде не сохранена: клиенту показан телефон для звонка.')
  return lines.join('\n')
}

export async function notifyTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, link_preview_options: { is_disabled: true } }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) console.error('[lead] Telegram ответил', res.status)
  } catch (error) {
    // Ошибка уведомления не отменяет приём заявки.
    console.error('[lead] Не удалось отправить уведомление', error)
  }
}
