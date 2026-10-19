/**
 * Картинки для поисковиков и соцсетей: pnpm seo:images
 *
 * - public/icon.png (512×512) и public/apple-icon.png (180×180) — из логотипа public/favicon.svg (sharp);
 * - public/favicon.ico — 16, 32 и 48 px, PNG внутри ICO (Яндекс берёт значок для выдачи из /favicon.ico);
 * - public/opengraph-image.jpg (1200×630) — превью ссылки в мессенджерах и соцсетях: фото первого экрана,
 *   заголовок и цена «от» из pricing.ts. Рисует Chromium: кириллица — шрифтами сайта (TTF из scripts/pdf-fonts).
 *
 * Запускать после смены цен, логотипа или фото первого экрана.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { SITE } from '@/content/site'
import { formatMlnFrom } from '@/lib/format'
import { minCalc } from '@/lib/pricing'

const root = process.cwd()
const pub = (file: string) => path.join(root, 'public', file)

async function icons() {
  const svg = readFileSync(pub('favicon.svg'))
  const png = (size: number) => sharp(svg, { density: 72 * (size / 32) }).resize(size, size).png().toBuffer()
  writeFileSync(pub('icon.png'), await png(512))
  writeFileSync(pub('apple-icon.png'), await png(180))
  // ICO с PNG внутри (поддерживают все браузеры с Windows Vista): заголовок, каталог, затем сами PNG.
  const sizes = [16, 32, 48]
  const images = await Promise.all(sizes.map(png))
  const header = Buffer.alloc(6 + 16 * sizes.length)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(sizes.length, 4)
  let offset = header.length
  sizes.forEach((size, i) => {
    const at = 6 + 16 * i
    header.writeUInt8(size, at)
    header.writeUInt8(size, at + 1)
    header.writeUInt16LE(1, at + 4)
    header.writeUInt16LE(32, at + 6)
    header.writeUInt32LE(images[i]!.length, at + 8)
    header.writeUInt32LE(offset, at + 12)
    offset += images[i]!.length
  })
  writeFileSync(pub('favicon.ico'), Buffer.concat([header, ...images]))
}

async function ogImage() {
  const font = (file: string) => `data:font/ttf;base64,${readFileSync(path.join(root, 'scripts/pdf-fonts', file)).toString('base64')}`
  const photo = await sharp(path.join(root, 'src/content/images/hero-forest.webp')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 85 }).toBuffer()
  const price = formatMlnFrom(minCalc('contour').price)
  const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>
@font-face { font-family: Manrope; src: url(${font('manrope-700.ttf')}); font-weight: 700; }
@font-face { font-family: Onest; src: url(${font('onest-400.ttf')}); font-weight: 400; }
@font-face { font-family: Onest; src: url(${font('onest-600.ttf')}); font-weight: 600; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; position: relative; overflow: hidden; color: #fff; font-family: Onest, sans-serif;
  background: #0a0b0d url(data:image/jpeg;base64,${photo.toString('base64')}) center / cover; }
.shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,.86) 0%, rgba(0,0,0,.62) 55%, rgba(0,0,0,.25) 100%); }
.box { position: absolute; inset: 64px 72px; display: flex; flex-direction: column; justify-content: space-between; }
.brand { font-family: Manrope; font-weight: 700; letter-spacing: .16em; font-size: 26px; }
h1 { font-family: Manrope; font-weight: 700; font-size: 58px; line-height: 1.08; max-width: 880px; text-transform: uppercase; letter-spacing: -.01em; }
.price { margin-top: 22px; font-family: Manrope; font-weight: 700; font-size: 52px; color: #9fc0de; }
.foot { font-size: 24px; color: #d4d8dd; font-weight: 600; }
</style></head><body><div class="shade"></div><div class="box">
<div class="brand">${SITE.brandFull}</div>
<div><h1>Дома из клееного бруса с панорамным остеклением в Подмосковье</h1><div class="price">от ${price}</div></div>
<div class="foot">${SITE.address}</div></div></body></html>`
  const preset = '/opt/pw-browsers/chromium'
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (existsSync(preset) ? preset : undefined) })
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  const shot = await page.screenshot({ type: 'jpeg', quality: 86 })
  await browser.close()
  writeFileSync(pub('opengraph-image.jpg'), shot)
}

async function main() {
  await icons()
  await ogImage()
  console.log('✓ public/icon.png, apple-icon.png, favicon.ico, opengraph-image.jpg')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
