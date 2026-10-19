import { notifyTelegram } from './notify'

/** Одинаковая ошибка уходит в Telegram не чаще раза в 10 минут, чтобы сбой не завалил чат сообщениями. */
const QUIET_MS = 10 * 60 * 1000
const sent = new Map<string, number>()

/** Текст уведомления: страница без параметров адреса и текст ошибки — без персональных данных. */
export function serverErrorText(error: unknown, path: string, kind: string): string {
  const message = error instanceof Error ? error.message : String(error)
  return `Ошибка на сайте (${kind}): ${path.split('?')[0]}\n${message.slice(0, 300)}\nПодробности в журнале сервера.`
}

export async function notifyServerError(error: unknown, path: string, kind: string, now = Date.now()): Promise<boolean> {
  const text = serverErrorText(error, path, kind)
  const key = text.slice(0, 200)
  if (now - (sent.get(key) ?? 0) < QUIET_MS) return false
  sent.set(key, now)
  if (sent.size > 500) sent.clear()
  await notifyTelegram(text)
  return true
}
