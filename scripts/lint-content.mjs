/**
 * Контент-линт (PLAN P2.4, CLAUDE.md правила 2, 4, 5):
 *  1) во всём src/ нет фраз из чёрного списка CONTENT-SPEC §2 и пустых слов из §3;
 *  2) в JSX (.tsx) нет захардкоженных цен, сроков и телефонов — только данные из src/content и src/lib/pricing.ts.
 * Выход с кодом 1 при любом нарушении.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()

const BLACKLIST = [
  [/passiv\s?haus/i, 'Passivhaus без сертификата PHI'],
  [/\bA\+{2,3}/, 'класс A++ / A+++'],
  [/DIN\s?1052/i, 'отозванная норма DIN 1052'],
  [/рихтер|richter/i, 'шкала Рихтера'],
  [/LOD[\s-]?500/i, 'LOD 500 на стадии проекта'],
  [/триплекс/i, '«триплекс» вместо стеклопакета'],
  [/акт\w* ввода/i, 'акт ввода в эксплуатацию для ИЖС'],
  [/ростехнадзор|госкомисси/i, 'акт Ростехнадзора / госкомиссии'],
  [/свидетельств\w* сро/i, 'свидетельство СРО'],
  [/независим\w* технадзор/i, '«независимый технадзор» от подрядчика'],
  [/0\s?₽\s?удорожани|исключено на 100|абсолютн|100\s?% коллизий/i, 'абсолютные обещания'],
  [/\d+\+\s?(дом|проект)|выбор 75/i, 'цифры без источника'],
  [/aggregateRating/, 'самоприсвоенный рейтинг'],
  [/подтверждённ\w* владел|подтвержденн\w* владел|акт ввода подписан/i, '«подтверждённый владелец»'],
  [/инициализация bim|калибровка узлов/i, 'фейковый прелоадер'],
  [/сертификат 150/i, 'сертификат без условий'],
  [/\b(USD|EUR|AED)\b|\$\s?\d|€/, 'валюты кроме ₽'],
  [/\bVIP\b|премиум|эксклюзив/i, 'пустые слова (CONTENT-SPEC §3)'],
  [/OFFICIAL|VERIFIED|\/\/\s?ROADMAP/, 'декоративные английские подписи (168-ФЗ)'],
  [/смотрите сами|четыре характера|не бывает\.|бывает честн|до того, как вы спросите|на чертеже|каждое обещание/i, 'рекламное клише (tests/unit/copy.test.ts)'],
  [/инициализация|калибровка/i, 'фейковый прогресс лоадера'],
]

// Только для JSX-файлов: числа с ₽, сроки в днях, телефоны.
const JSX_RULES = [
  [/\d[\d\s ]*\s?(₽|руб)/, 'цена в JSX — берите из pricing.ts'],
  [/\d+[,.]?\d*\s?млн/, 'цена в млн в JSX — берите из pricing.ts'],
  [/\d{2,}\s?(дн\.|дней|дня|день)(?![а-яё])/i, 'срок в JSX — берите из pricing.ts / content'],  // \b в JS не видит границ кириллических слов
  [/\+7\s?\(?\d{3}|8\s?\(?800/, 'телефон в JSX — берите из SITE'],
]

const IGNORE_DIRS = new Set(['node_modules', '.next', 'fonts', 'assets'])

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) return IGNORE_DIRS.has(name) ? [] : walk(full)
    return /\.(tsx?|css)$/.test(name) ? [full] : []
  })
}

/** Убирает комментарии, сохраняя номера строк. */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:'"`])\/\/.*$/gm, (m, p) => p + ' '.repeat(m.length - p.length))
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, (m) => m.replace(/[^\n]/g, ' '))
}

const problems = []
for (const file of walk(path.join(root, 'src'))) {
  const rel = path.relative(root, file)
  const lines = stripComments(readFileSync(file, 'utf8')).split('\n')
  lines.forEach((line, i) => {
    for (const [re, why] of BLACKLIST) if (re.test(line)) problems.push(`${rel}:${i + 1}  ${why}\n    ${line.trim()}`)
    if (file.endsWith('.tsx')) {
      // Проверяем только текст вне выражений {...} и вне атрибутов className.
      const text = line.replace(/\{[^{}]*\}/g, ' ').replace(/className="[^"]*"/g, ' ')
      for (const [re, why] of JSX_RULES) if (re.test(text)) problems.push(`${rel}:${i + 1}  ${why}\n    ${line.trim()}`)
    }
  })
}

if (problems.length) {
  console.error(`lint:content — найдено нарушений: ${problems.length}\n`)
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log('lint:content — чисто: чёрный список, цены, сроки и телефоны в JSX')
