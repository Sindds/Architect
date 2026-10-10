/**
 * Проверка интеграций заявок: pnpm leads:check [--send]
 *
 * Без флага ничего не отправляет: показывает, какие каналы настроены, и спрашивает у Битрикс24 режим CRM
 * (crm.settings.mode.get), чтобы подсказать B24_ENTITY. С --send отправляет тестовую заявку
 * в Битрикс24 и 1С и уведомление в Telegram. Переменные берутся из окружения и .env.local.
 */
import { bitrix24Config } from '@/lib/leads/bitrix24'
import { configuredSinks, deliverLead } from '@/lib/leads/deliver'
import { oneCConfig } from '@/lib/leads/onec'
import { leadSummary, toLeadRecord } from '@/lib/leads/record'
import { leadNotificationText, notifyTelegram } from '@/lib/notify'

const send = process.argv.includes('--send')

const lead = toLeadRecord(Math.floor(Date.now() / 1000) % 90_000 + 10_000, {
  name: 'Проверка интеграции',
  phone: '+70000000000',
  consent: 'on',
  contactMethod: 'call',
  comment: 'Тестовая заявка из pnpm leads:check, её можно удалить.',
  source: 'final_cta',
  variant: 'default',
  utm: JSON.stringify({ utm_source: 'leads-check' }),
  startedAt: 1,
})

async function main() {
  const b24 = bitrix24Config()
  const onec = oneCConfig()
  const telegram = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)

  console.log('Каналы заявок:')
  console.log(`  файл .data/leads.ndjson: ${process.env.LEADS_FILE === 'off' ? 'выключен' : 'включён'}`)
  console.log(`  Битрикс24: ${b24 ? `${new URL(b24.webhook).host}, создаём ${b24.entity === 'lead' ? 'лид' : 'контакт и сделку'}` : 'не настроен (B24_WEBHOOK_URL)'}`)
  console.log(`  1С: ${onec ? new URL(onec.url).host : 'не настроена (ONEC_LEADS_URL)'}`)
  console.log(`  Telegram: ${telegram ? 'настроен' : 'не настроен (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)'}`)

  if (b24) {
    try {
      const res = await fetch(`${b24.webhook}crm.settings.mode.get`, { method: 'POST', signal: AbortSignal.timeout(8000) })
      const data = (await res.json()) as { result?: number; error?: string; error_description?: string }
      if (data.error) throw new Error(`${data.error} ${data.error_description ?? ''}`)
      // 1 — классический режим (с лидами), 2 — простой (без лидов): apidocs.bitrix24.com, crm.settings.mode.get.
      const mode = data.result === 2 ? 'deal' : 'lead'
      console.log(`  Режим CRM в портале: ${data.result === 2 ? 'простой, без лидов' : 'классический, с лидами'}`)
      if (mode !== b24.entity) console.log(`  ⚠ Поставьте B24_ENTITY=${mode}`)
    } catch (error) {
      console.log(`  ⚠ Битрикс24 не отвечает на crm.settings.mode.get: ${error instanceof Error ? error.message : error}`)
    }
  }

  if (!send) {
    console.log('\nТестовая заявка (отправка: pnpm leads:check --send):')
    console.log(leadSummary(lead))
    return
  }

  // Файл не трогаем: тестовая заявка нужна только в CRM.
  const sinks = configuredSinks().filter((s) => s.name !== 'file')
  if (!sinks.length) console.log('\nНе задано ни Битрикс24, ни 1С: отправлять некуда.')
  const { results } = await deliverLead(lead, sinks)
  for (const r of results) console.log(r.ok ? `  ✓ ${r.sink}: ${r.url ?? r.ref ?? 'принята'}` : `  ✗ ${r.sink}: ${r.error}`)
  if (telegram) {
    await notifyTelegram(`Проверка интеграции.\n${leadNotificationText(lead.id, lead.source, lead.variant, results)}`)
    console.log('  Уведомление отправлено в Telegram.')
  }
  if (results.some((r) => !r.ok)) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
