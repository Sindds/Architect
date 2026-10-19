import type { Instrumentation } from 'next'

/**
 * Ошибки сервера (страница, server action, маршрут) — в Telegram менеджерам, если он настроен:
 * адрес страницы и текст ошибки, без персональных данных. В журнале сервера Next пишет ошибку сам.
 * Только в среде Node.js: в Edge-сборку модуль уведомлений не попадает (он использует Node API).
 */
export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  const { notifyServerError } = await import('./lib/server-errors')
  await notifyServerError(error, request.path, context.routeType)
}
