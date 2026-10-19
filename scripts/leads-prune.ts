/**
 * Удаление заявок старше срока хранения из файла на сервере: pnpm leads:prune
 *
 * Срок — COMPANY.leadRetentionDays (src/content/company.ts), файл — LEADS_DIR/leads.ndjson (по умолчанию .data).
 * Запускать по расписанию на своём сервере, например раз в сутки (cron):
 *   15 3 * * * cd /srv/arcline && pnpm leads:prune >> /var/log/arcline-prune.log 2>&1
 * Файл перезаписывается целиком через временный, с правами только для владельца.
 */
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { COMPANY } from '@/content/company'
import { pruneLeadLines } from '@/lib/leads/prune'

const file = path.join(process.env.LEADS_DIR?.trim() || path.join(process.cwd(), '.data'), 'leads.ndjson')
if (!existsSync(file)) {
  console.log(`Файла заявок нет (${file}) — удалять нечего.`)
  process.exit(0)
}
const { kept, removed, total } = pruneLeadLines(readFileSync(file, 'utf8'), new Date(), COMPANY.leadRetentionDays)
if (removed) {
  writeFileSync(`${file}.tmp`, kept, { encoding: 'utf8', mode: 0o600 })
  renameSync(`${file}.tmp`, file)
}
console.log(`Заявок в файле: ${total}, удалено старше ${COMPANY.leadRetentionDays} дней: ${removed}.`)
