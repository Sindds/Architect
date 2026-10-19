/**
 * Первичная настройка окружения: pnpm env:init
 *
 * Создаёт .env.local из docs/env.example (если его нет) и ставит случайные значения ключам защиты:
 * LEAD_TOKEN_SECRET, SMETA_SIGNING_SECRET, RATE_LIMIT_SALT — там, где пусто или стоит заглушка.
 * Уже заданные значения не трогает. Сами ключи не печатает: для Vercel скопируйте их из .env.local
 * в Project → Settings → Environment Variables.
 */
import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const KEYS = ['LEAD_TOKEN_SECRET', 'SMETA_SIGNING_SECRET', 'RATE_LIMIT_SALT'] as const
const file = path.join(process.cwd(), '.env.local')
const template = path.join(process.cwd(), 'docs/env.example')

let text = existsSync(file) ? readFileSync(file, 'utf8') : readFileSync(template, 'utf8')
const filled: string[] = []
for (const key of KEYS) {
  const line = new RegExp(`^${key}=(.*)$`, 'm')
  const current = text.match(line)?.[1]?.trim() ?? ''
  if (current && !/замените/i.test(current)) continue
  const value = randomBytes(32).toString('base64url')
  text = line.test(text) ? text.replace(line, `${key}=${value}`) : `${text.trimEnd()}\n${key}=${value}\n`
  filled.push(key)
}
writeFileSync(file, text, { mode: 0o600 })
console.log(filled.length ? `Сгенерированы ключи: ${filled.join(', ')} → .env.local` : 'Ключи уже заданы, .env.local не изменён.')
console.log('Дальше: впишите почту или Битрикс24 в .env.local и проверьте каналы — pnpm leads:check')
