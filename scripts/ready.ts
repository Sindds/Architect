/**
 * Готов ли сайт к публикации под заказчика: pnpm ready
 *
 * Показывает заглушки в данных компании (src/content/company.ts) и чего не хватает в переменных окружения
 * (из окружения и .env.local): ключи защиты формы, канал заявок (почта, Битрикс24, 1С), адрес сайта.
 * Значения ключей не печатает. Код выхода 1, если есть обязательные пункты.
 */
import { SITE } from '@/content/site'
import { readiness } from '@/lib/readiness'

const items = readiness(SITE, process.env)
const critical = items.filter((i) => i.level === 'critical')
const important = items.filter((i) => i.level === 'important')

const print = (title: string, list: typeof items) => {
  if (!list.length) return
  console.log(`\n${title}`)
  for (const i of list) console.log(`  • ${i.what}\n    где: ${i.where}`)
}

if (!items.length) {
  console.log('✓ Готово к публикации: данные компании заполнены, ключи и канал заявок настроены.')
  console.log('  Проверьте доставку тестовой заявкой: pnpm leads:check --send')
} else {
  print(`Обязательно до запуска (${critical.length}):`, critical)
  print(`Желательно (${important.length}):`, important)
  console.log('\nПодробно — src/content/README.md и README.md, раздел «Публикация».')
}
process.exit(critical.length ? 1 : 0)
