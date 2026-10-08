import type { Picture } from './types'

import casePinesBuild from '@/assets/images/case-pines-build.webp'
import casePinesDone from '@/assets/images/case-pines-done.webp'
import caseSlopeBuild from '@/assets/images/case-slope-build.webp'
import caseSlopeDone from '@/assets/images/case-slope-done.webp'
import caseWaterBuild from '@/assets/images/case-water-build.webp'
import caseWaterDone from '@/assets/images/case-water-done.webp'
import chaletExterior from '@/assets/images/chalet-exterior.webp'
import chaletInterior from '@/assets/images/chalet-interior.webp'
import chaletScheme from '@/assets/images/chalet-scheme.webp'
import heroForest from '@/assets/images/hero-forest.webp'
import nordicExterior from '@/assets/images/nordic-exterior.webp'
import nordicInterior from '@/assets/images/nordic-interior.webp'
import nordicScheme from '@/assets/images/nordic-scheme.webp'
import processFrame from '@/assets/images/process-frame.webp'
import titanExterior from '@/assets/images/titan-exterior.webp'
import titanInterior from '@/assets/images/titan-interior.webp'
import titanScheme from '@/assets/images/titan-scheme.webp'
import vistaExterior from '@/assets/images/vista-exterior.webp'
import vistaInterior from '@/assets/images/vista-interior.webp'
import vistaScheme from '@/assets/images/vista-scheme.webp'

// Все фото домов — ИИ-визуализации из прототипа (CONTENT-SPEC §1, §7).
// Фото людей не используются: это сгенерированные лица.
const viz = (src: Picture['src'], alt: string): Picture => ({ src, alt, caption: 'Визуализация' })
const scheme = (src: Picture['src'], alt: string): Picture => ({ src, alt, caption: 'Схема (иллюстрация)' })

export const MEDIA = {
  heroForest: viz(heroForest, 'Загородный дом с панорамным остеклением в лесу, визуализация'),
  processFrame: viz(processFrame, 'Монтаж каркаса дома из клееного бруса, визуализация'),

  vistaExterior: viz(vistaExterior, 'Двухэтажный дом с фахверковым каркасом и панорамными окнами, визуализация'),
  vistaInterior: viz(vistaInterior, 'Гостиная с панорамным остеклением в фахверковом доме, визуализация'),
  vistaScheme: scheme(vistaScheme, 'Схема информационной модели фахверкового дома, иллюстрация'),

  nordicExterior: viz(nordicExterior, 'Одноэтажный дом в скандинавском стиле с панорамными окнами, визуализация'),
  nordicInterior: viz(nordicInterior, 'Гостиная одноэтажного дома в скандинавском стиле, визуализация'),
  nordicScheme: scheme(nordicScheme, 'Схема информационной модели одноэтажного дома, иллюстрация'),

  titanExterior: viz(titanExterior, 'Двухэтажный монолитный дом с панорамными фасадами, визуализация'),
  titanInterior: viz(titanInterior, 'Интерьер монолитного дома с панорамным остеклением, визуализация'),
  titanScheme: scheme(titanScheme, 'Схема информационной модели монолитного дома, иллюстрация'),

  chaletExterior: viz(chaletExterior, 'Дом в стиле шале с каменным цоколем, визуализация'),
  chaletInterior: viz(chaletInterior, 'Каминный зал в доме в стиле шале, визуализация'),
  chaletScheme: scheme(chaletScheme, 'Схема информационной модели дома в стиле шале, иллюстрация'),

  caseWaterBuild: viz(caseWaterBuild, 'Стройплощадка фахверкового дома на этапе монтажа каркаса, визуализация'),
  caseWaterDone: viz(caseWaterDone, 'Готовый фахверковый дом, визуализация'),
  caseSlopeBuild: viz(caseSlopeBuild, 'Стройплощадка монолитного дома, визуализация'),
  caseSlopeDone: viz(caseSlopeDone, 'Готовый монолитный дом, визуализация'),
  casePinesBuild: viz(casePinesBuild, 'Стройплощадка дома из клееного бруса, визуализация'),
  casePinesDone: viz(casePinesDone, 'Готовый дом в скандинавском стиле, визуализация'),
} satisfies Record<string, Picture>
