import type { LeadSource } from './lead-schema'

const SOURCE_LABELS: Record<LeadSource, string> = {
  header: 'шапка',
  hero: 'первый экран',
  excursion: 'экскурсия на объект',
  messenger: 'мессенджер',
  project_card: 'карточка проекта',
  project_modal: 'окно проекта',
  case_modal: 'окно кейса',
  pricing_pdf: 'смета из блока цен',
  calculator: 'калькулятор',
  quiz: 'квиз',
  final_cta: 'финальная форма',
  architect: 'вопрос архитектору',
}

/** Текст уведомления. Только номер заявки, источник и вариант — без имени и телефона (152-ФЗ). */
export function leadNotificationText(id: number, source: LeadSource, variant?: string): string {
  return `Новая заявка №${id}. Источник: ${SOURCE_LABELS[source]}. Вариант: ${variant ?? 'default'}.`
}

export async function notifyTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) console.error('[lead] Telegram ответил', res.status)
  } catch (error) {
    // Ошибка уведомления не отменяет приём заявки.
    console.error('[lead] Не удалось отправить уведомление', error)
  }
}
