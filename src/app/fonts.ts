import localFont from 'next/font/local'

// Шрифты лежат локально (src/fonts, лицензия OFL), сборка не ходит в сеть.
// Каждое подмножество — отдельный шрифт со своим unicode-range: браузер грузит только нужное.
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

export const cormorantCyr = localFont({
  src: [
    { path: '../fonts/cormorant-garamond-cyrillic-wght-normal.woff2', style: 'normal' },
    { path: '../fonts/cormorant-garamond-cyrillic-wght-italic.woff2', style: 'italic' },
  ],
  weight: '300 700',
  variable: '--font-cormorant-cyr',
  declarations: [{ prop: 'unicode-range', value: 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116' }],
  adjustFontFallback: false,
  display: 'swap',
})

export const cormorantLat = localFont({
  src: [
    { path: '../fonts/cormorant-garamond-latin-wght-normal.woff2', style: 'normal' },
    { path: '../fonts/cormorant-garamond-latin-wght-italic.woff2', style: 'italic' },
  ],
  weight: '300 700',
  variable: '--font-cormorant-lat',
  declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD' }],
  adjustFontFallback: 'Times New Roman',
  display: 'swap',
})

export const cormorantRub = localFont({
  src: '../fonts/cormorant-garamond-latin-ext-wght-normal.woff2',
  weight: '300 700',
  variable: '--font-cormorant-rub',
  declarations: [{ prop: 'unicode-range', value: 'U+20BD' }],
  adjustFontFallback: false,
  preload: false,
  display: 'swap',
})

export const plexCyr = localFont({
  src: [
    { path: '../fonts/ibm-plex-mono-cyrillic-400-normal.woff2', weight: '400' },
    { path: '../fonts/ibm-plex-mono-cyrillic-500-normal.woff2', weight: '500' },
  ],
  variable: '--font-plex-cyr',
  declarations: [{ prop: 'unicode-range', value: 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116' }],
  adjustFontFallback: false,
  preload: false,
  display: 'swap',
})

export const plexLat = localFont({
  src: [
    { path: '../fonts/ibm-plex-mono-latin-400-normal.woff2', weight: '400' },
    { path: '../fonts/ibm-plex-mono-latin-500-normal.woff2', weight: '500' },
  ],
  variable: '--font-plex-lat',
  declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD' }],
  adjustFontFallback: false,
  preload: false,
  display: 'swap',
})

export const plexRub = localFont({
  src: [
    { path: '../fonts/ibm-plex-mono-latin-ext-400-normal.woff2', weight: '400' },
    { path: '../fonts/ibm-plex-mono-latin-ext-500-normal.woff2', weight: '500' },
  ],
  variable: '--font-plex-rub',
  declarations: [{ prop: 'unicode-range', value: 'U+20BD' }],
  adjustFontFallback: false,
  preload: false,
  display: 'swap',
})

export const fontVariables = [onestCyr, onestLat, onestRub, cormorantCyr, cormorantLat, cormorantRub, plexCyr, plexLat, plexRub]
  .map((f) => f.variable)
  .join(' ')
