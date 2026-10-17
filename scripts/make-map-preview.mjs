/**
 * Статичное превью карты для футера: pnpm map:preview
 *
 * Склеивает тайлы OpenStreetMap вокруг SITE.geo в одну картинку src/assets/images/office-map.webp.
 * Картинка лежит на нашем сервере: посетитель видит район сразу, без запросов к сторонним сайтам и без cookie.
 * Интерактивная Яндекс Карта грузится поверх по клику или после согласия (src/components/OfficeMap.tsx).
 *
 * Лицензия: данные © участники OpenStreetMap (ODbL), картография стандартного слоя — CC BY-SA 2.0.
 * Подпись «© участники OpenStreetMap» со ссылкой на openstreetmap.org/copyright обязательна (стоит в OfficeMap).
 * Правила тайлового сервера OSM разрешают разовые запросы с понятным User-Agent; массово качать нельзя.
 * Запускать вручную, только после смены адреса.
 */
import { readFileSync } from 'node:fs'
import sharp from 'sharp'

const site = readFileSync(new URL('../src/content/site.ts', import.meta.url), 'utf8')
const geo = site.match(/geo:\s*\{\s*lat:\s*([\d.]+),\s*lon:\s*([\d.]+)/)
if (!geo) throw new Error('Не нашёл SITE.geo в src/content/site.ts')
const [lat, lon] = [Number(geo[1]), Number(geo[2])]

const Z = 15 // точный адрес офиса: видны улицы и здания
const TILE = 256
const W = 1280
const H = 520
const n = 2 ** Z
const cx = ((lon + 180) / 360) * n * TILE
const rad = (lat * Math.PI) / 180
const cy = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n * TILE
const left = Math.round(cx - W / 2)
const top = Math.round(cy - H / 2)

const tiles = []
for (let x = Math.floor(left / TILE); x <= Math.floor((left + W - 1) / TILE); x++) {
  for (let y = Math.floor(top / TILE); y <= Math.floor((top + H - 1) / TILE); y++) tiles.push({ x, y })
}

const composites = []
for (const { x, y } of tiles) {
  const res = await fetch(`https://tile.openstreetmap.org/${Z}/${x}/${y}.png`, {
    headers: { 'user-agent': 'arcline-landing/1.0 (static footer preview, one-off)' },
  })
  if (!res.ok) throw new Error(`Тайл ${Z}/${x}/${y}: ответ ${res.status}`)
  composites.push({ input: Buffer.from(await res.arrayBuffer()), left: x * TILE - left, top: y * TILE - top })
}

// Тайлы выходят за края холста: собираем на большом холсте и обрезаем.
const pad = TILE
const canvas = sharp({ create: { width: W + 2 * pad, height: H + 2 * pad, channels: 3, background: '#f2efe9' } })
  .composite(composites.map((c) => ({ ...c, left: c.left + pad, top: c.top + pad })))
const full = await canvas.png().toBuffer()
await sharp(full)
  .extract({ left: pad, top: pad, width: W, height: H })
  .webp({ quality: 72 })
  .toFile(new URL('../src/assets/images/office-map.webp', import.meta.url).pathname)

console.log(`Готово: ${tiles.length} тайлов, z=${Z}, центр ${lat}, ${lon} → src/assets/images/office-map.webp`)
