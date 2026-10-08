/**
 * Демо-PDF для блока «Документы»: образец договора и образец сметы с водяным знаком «ОБРАЗЕЦ».
 * Рендер HTML → PDF в Chromium (Playwright), шрифты с кириллицей встраиваются из src/fonts.
 * Цифры сметы считает src/lib/pricing.ts — те же формулы, что на сайте.
 *
 * Запуск: pnpm docs:pdf
 */
import { existsSync, readFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'
import { PRICING } from '@/content/pricing'
import { STEPS } from '@/content/process'
import { SITE } from '@/content/site'
import { formatDays, formatRub, groupDigits } from '@/lib/format'
import { breakdown } from '@/lib/pricing'

const root = process.cwd()
const font = (file: string) => `data:font/woff2;base64,${readFileSync(path.join(root, 'src/fonts', file)).toString('base64')}`

const fontFaces = `
@font-face { font-family: Onest; src: url(${font('onest-cyrillic-wght-normal.woff2')}) format('woff2'); font-weight: 100 900; unicode-range: U+0400-045F, U+2116; }
@font-face { font-family: Onest; src: url(${font('onest-latin-wght-normal.woff2')}) format('woff2'); font-weight: 100 900; unicode-range: U+0000-00FF, U+2000-206F; }
@font-face { font-family: Onest; src: url(${font('onest-latin-ext-wght-normal.woff2')}) format('woff2'); font-weight: 100 900; unicode-range: U+20BD; }
@font-face { font-family: Cormorant; src: url(${font('cormorant-garamond-cyrillic-wght-normal.woff2')}) format('woff2'); font-weight: 300 700; unicode-range: U+0400-045F, U+2116; }
@font-face { font-family: Cormorant; src: url(${font('cormorant-garamond-latin-wght-normal.woff2')}) format('woff2'); font-weight: 300 700; unicode-range: U+0000-00FF, U+2000-206F; }
`

const page = (title: string, body: string) => `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>${title}</title><style>
${fontFaces}
@page { size: A4; margin: 18mm 16mm 20mm; }
* { box-sizing: border-box; }
body { font-family: Onest, sans-serif; font-size: 10.5pt; line-height: 1.5; color: #1b1c19; margin: 0; }
h1 { font-family: Cormorant, serif; font-weight: 600; font-size: 24pt; line-height: 1.1; margin: 0 0 4mm; }
h2 { font-size: 11pt; margin: 6mm 0 2mm; }
p { margin: 0 0 2mm; }
.meta { color: #4e4a42; font-size: 9pt; border-bottom: 1px solid #1b1c19; padding-bottom: 3mm; margin-bottom: 5mm; }
table { width: 100%; border-collapse: collapse; margin: 2mm 0 4mm; font-variant-numeric: tabular-nums; }
th, td { border-bottom: 1px solid #d3cbbb; padding: 1.6mm 2mm 1.6mm 0; text-align: left; vertical-align: top; }
th { font-weight: 500; color: #4e4a42; font-size: 9pt; }
td.r, th.r { text-align: right; padding-right: 0; }
tr.total td { border-top: 1.5px solid #1b1c19; border-bottom: 0; font-weight: 600; }
.mark { position: fixed; top: 42%; left: 0; right: 0; text-align: center; transform: rotate(-30deg); font-family: Cormorant, serif; font-size: 54pt; color: rgba(154, 59, 22, 0.13); letter-spacing: 4pt; pointer-events: none; }
.note { color: #4e4a42; font-size: 9pt; }
</style></head><body><div class="mark">ОБРАЗЕЦ · КОНЦЕПТ-ПРОЕКТ</div>${body}</body></html>`

// Пример: VISTA, 380 м², терраса 60 м², фахверк, под ключ (CONTENT-SPEC §5.2, §5.4).
const example = { name: 'VISTA', area: 380, terrace: 60, style: 'fachwerk' as const, tier: 'turnkey' as const }
const b = breakdown({ ...example, addons: [] })
const tier = PRICING.tiers[example.tier]

const stepsRows = STEPS.map(
  (s, i) =>
    `<tr><td>${i + 1}</td><td>${s.title}</td><td>${s.result}</td><td class="r">${formatDays(s.days)}</td><td class="r">${s.paymentPercent}%</td><td class="r">${formatRub((b.total * s.paymentPercent) / 100)}</td></tr>`,
).join('')

const header = (doc: string) =>
  `<div class="meta">${SITE.brandFull} · ${doc} · ${SITE.disclaimer} Реквизиты, номера и подписи в образце не указываются.</div>`

const contract = page(
  'Образец договора генподряда',
  `${header('Образец договора')}
<h1>Договор строительного подряда на строительство жилого дома</h1>
<p class="note">Образец. Реквизиты сторон, адрес участка и номер договора заполняются при заключении.</p>

<h2>1. Предмет договора</h2>
<p>1.1. Подрядчик обязуется построить жилой дом по проекту ${example.name} (${example.area} м², терраса ${example.terrace} м²) в комплектации «${tier.title}», а Заказчик — принять работы и оплатить их.</p>
<p>1.2. Состав работ — в Приложении 1 «Смета». Работы, не указанные в смете, в цену не входят.</p>

<h2>2. Цена</h2>
<p>2.1. Цена работ — ${formatRub(b.total)}. Цена твёрдая и фиксируется на весь срок договора.</p>
<p>2.2. Цена меняется только по дополнительному соглашению, если Заказчик меняет проект, комплектацию или состав работ. Изменение цены и срока считается до начала таких работ.</p>
<p>2.3. Рост цен на материалы после подписания договора не меняет цену для Заказчика.</p>

<h2>3. Сроки и порядок оплаты</h2>
<p>3.1. Общий срок — ${formatDays(STEPS.reduce((s, x) => s + x.days, 0))} с даты подписания договора. Каждый этап оплачивается после подписания акта по предыдущему.</p>
<table><thead><tr><th>№</th><th>Этап</th><th>Результат</th><th class="r">Срок</th><th class="r">Доля</th><th class="r">Сумма</th></tr></thead><tbody>${stepsRows}
<tr class="total"><td></td><td colspan="2">Итого</td><td class="r">${formatDays(STEPS.reduce((s, x) => s + x.days, 0))}</td><td class="r">100%</td><td class="r">${formatRub(b.total)}</td></tr></tbody></table>

<h2>4. Перенос сроков</h2>
<p>4.1. Срок этапа может быть перенесён из-за погодных условий, при которых работы запрещены технологией. Перенос оформляется актом с указанием причины и нового срока; цена не меняется.</p>

<h2>5. Приёмка и строительный контроль</h2>
<p>5.1. Скрытые работы (фундамент, гидроизоляция, утепление, инженерные разводки) принимаются по актам с фотофиксацией до их закрытия.</p>
<p>5.2. Заказчик вправе привлечь собственный технический надзор и получает доступ на объект в рабочее время.</p>
<p>5.3. Подрядчик еженедельно направляет фотоотчёт и актуальный график работ.</p>

<h2>6. Ответственность сторон</h2>
<p>6.1. За нарушение сроков по вине Подрядчика и за просрочку оплаты по вине Заказчика стороны несут ответственность в размере, указанном в договоре при его заключении.</p>

<h2>7. Гарантия</h2>
<p>7.1. Гарантийные сроки на несущие конструкции, кровлю, окна и инженерные системы указываются в договоре при заключении и исчисляются с даты подписания акта приёмки дома.</p>
<p>7.2. Гарантия на оборудование — по паспортам производителей; паспорта передаются Заказчику при сдаче.</p>

<h2>8. Прочие условия</h2>
<p>8.1. Персональные данные Заказчика обрабатываются в соответствии с 152-ФЗ и хранятся на серверах в России.</p>
<p class="note">Документ демонстрационный и не является офертой.</p>`,
)

const estimate = page(
  'Образец сметы',
  `${header('Образец сметы')}
<h1>Смета: ${example.name}, ${example.area} м², «${tier.title}»</h1>
<p class="note">Стиль: ${PRICING.styles[example.style].title}. Терраса ${example.terrace} м². Без опций. Расчёт по ставкам сайта; точная смета — после геологии и топосъёмки.</p>

<h2>1. Расчёт стоимости</h2>
<table><thead><tr><th>Позиция</th><th class="r">Объём</th><th class="r">Ставка</th><th class="r">Сумма</th></tr></thead><tbody>
<tr><td>Дом, пакет «${tier.title}»</td><td class="r">${example.area} м²</td><td class="r">${groupDigits(tier.pricePerM2 * PRICING.styles[example.style].coef)} ₽/м²</td><td class="r">${formatRub(b.house)}</td></tr>
<tr><td>Терраса</td><td class="r">${example.terrace} м²</td><td class="r">${groupDigits(tier.terracePerM2)} ₽/м²</td><td class="r">${formatRub(b.terrace)}</td></tr>
<tr class="total"><td colspan="3">Итого (округлено до 10 000 ₽)</td><td class="r">${formatRub(b.total)}</td></tr>
</tbody></table>

<h2>2. Оплата по этапам</h2>
<table><thead><tr><th>№</th><th>Этап</th><th>Результат</th><th class="r">Срок</th><th class="r">Доля</th><th class="r">Сумма</th></tr></thead><tbody>${stepsRows}</tbody></table>

<h2>3. Входит</h2>
<p>${tier.includes.join('; ')}.</p>
<h2>4. Не входит</h2>
<p>${tier.excludes.join('; ')}.</p>
<p class="note">Образец сметы концепт-проекта. Цены и компания вымышлены.</p>`,
)

async function main() {
  const out = path.join(root, 'public/docs')
  await mkdir(out, { recursive: true })
  const preset = '/opt/pw-browsers/chromium'
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (existsSync(preset) ? preset : undefined) })
  const tab = await browser.newPage()
  for (const [file, html] of [
    ['dogovor-obrazec.pdf', contract],
    ['smeta-obrazec.pdf', estimate],
  ] as const) {
    await tab.setContent(html, { waitUntil: 'load' })
    await tab.evaluate(() => document.fonts.ready)
    await tab.pdf({ path: path.join(out, file), format: 'A4', printBackground: true })
    console.log('✓', file)
  }
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
