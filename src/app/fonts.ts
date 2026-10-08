import localFont from 'next/font/local'

// Шрифты лежат локально (src/fonts, лицензия OFL), сборка не ходит в сеть.
// Onest — текст, Manrope — заголовки (гротеск с кириллицей вместо Space Grotesk у образца),
// JetBrains Mono — метки. Каждое подмножество — отдельный шрифт со своим unicode-range.
// Кириллица проверена (правило 10 CLAUDE.md), знак ₽ (U+20BD) — из latin-ext.
// next/font требует литералы в опциях, поэтому диапазоны повторяются.

export const onestCyr = localFont({
  src: '../fonts/onest-cyrillic-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-onest-cyr',
  declarations: [{ prop: 'unicode-range', value: 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116' }],
  adjustFontFallback: false,
  display: 'swap',
})

export const onestLat = localFont({
  src: '../fonts/onest-latin-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-onest-lat',
  declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD' }],
  adjustFontFallback: 'Arial',
  display: 'swap',
})

export const onestRub = localFont({
  src: '../fonts/onest-latin-ext-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-onest-rub',
  declarations: [{ prop: 'unicode-range', value: 'U+20BD' }],
  adjustFontFallback: false,
  preload: false,
  display: 'swap',
})

export const manropeCyr = localFont({
  src: '../fonts/manrope-cyrillic-wght-normal.woff2',
  weight: '200 800',
  variable: '--font-manrope-cyr',
  declarations: [{ prop: 'unicode-range', value: 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116' }],
  adjustFontFallback: false,
  display: 'swap',
})

export const manropeLat = localFont({
  src: '../fonts/manrope-latin-wght-normal.woff2',
  weight: '200 800',
  variable: '--font-manrope-lat',
  declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD' }],
  adjustFontFallback: 'Arial',
  display: 'swap',
})

export const manropeRub = localFont({
  src: '../fonts/manrope-latin-ext-wght-normal.woff2',
  weight: '200 800',
  variable: '--font-manrope-rub',
  declarations: [{ prop: 'unicode-range', value: 'U+20BD' }],
  adjustFontFallback: false,
  preload: false,
  display: 'swap',
})

export const jetbrainsCyr = localFont({
  src: '../fonts/jetbrains-mono-cyrillic-wght-normal.woff2',
  weight: '100 800',
  variable: '--font-jetbrains-cyr',
  declarations: [{ prop: 'unicode-range', value: 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116' }],
  adjustFontFallback: false,
  preload: false,
  display: 'swap',
})

export const jetbrainsLat = localFont({
  src: '../fonts/jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 800',
  variable: '--font-jetbrains-lat',
  declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD' }],
  adjustFontFallback: false,
  preload: false,
  display: 'swap',
})

export const jetbrainsRub = localFont({
  src: '../fonts/jetbrains-mono-latin-ext-wght-normal.woff2',
  weight: '100 800',
  variable: '--font-jetbrains-rub',
  declarations: [{ prop: 'unicode-range', value: 'U+20BD' }],
  adjustFontFallback: false,
  preload: false,
  display: 'swap',
})

export const fontVariables = [onestCyr, onestLat, onestRub, manropeCyr, manropeLat, manropeRub, jetbrainsCyr, jetbrainsLat, jetbrainsRub]
  .map((f) => f.variable)
  .join(' ')
