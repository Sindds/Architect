/**
 * Печать демо-PDF для блока «Документы»: образец договора и образец сметы.
 * Тексты и вёрстка — scripts/sample-docs.ts. Номера страниц — CSS-поля @page, шрифтами документа
 * (колонтитул Playwright рисуется системным шрифтом, который Chrome встраивает как Type 3).
 * Рендер HTML → PDF в Chromium (Playwright).
 *
 * Запуск: pnpm docs:pdf
 */
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'
import { contractHtml, estimateHtml } from './sample-docs'

async function main() {
  const out = path.join(process.cwd(), 'public/docs')
  await mkdir(out, { recursive: true })
  const preset = '/opt/pw-browsers/chromium'
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (existsSync(preset) ? preset : undefined) })
  const tab = await browser.newPage()
  for (const [file, html] of [
    ['dogovor-obrazec.pdf', contractHtml()],
    ['smeta-obrazec.pdf', estimateHtml()],
  ] as const) {
    await tab.setContent(html, { waitUntil: 'load' })
    await tab.evaluate(() => document.fonts.ready)
    await tab.pdf({
      path: path.join(out, file),
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
    })
    console.log('✓', file)
  }
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
