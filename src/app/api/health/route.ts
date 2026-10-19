// Проверка, что сайт жив: для мониторинга (UptimeRobot, Яндекс Мониторинг) и HEALTHCHECK контейнера на сервере.
// Ничего не читает и не раскрывает: только ответ 200.
export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json({ status: 'ok' }, { headers: { 'cache-control': 'no-store' } })
}
