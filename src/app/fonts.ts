import localFont from 'next/font/local'

// Шрифты лежат локально (src/fonts, лицензия OFL), сборка не ходит в сеть.
// Onest — текст, Manrope — заголовки (гротеск с кириллицей вместо Space Grotesk у образца),
// JetBrains Mono — метки. Один файл на семейство: кириллица, латиница, знаки ₽ и №, толщины 400–700.
// Три файла ≈ 74 КБ вместо девяти срезов ≈ 200 КБ: телефон быстрее показывает первый экран.
// Как собраны файлы — scripts/subset-fonts.py. Кириллица проверена (правило 10 CLAUDE.md).

export const onest = localFont({
  src: '../fonts/onest-wght.woff2',
  weight: '400 700',
  variable: '--font-onest',
  preload: false,
  adjustFontFallback: 'Arial',
  display: 'swap',
})

export const manrope = localFont({
  src: '../fonts/manrope-wght.woff2',
  weight: '400 700',
  variable: '--font-manrope',
  preload: false,
  adjustFontFallback: 'Arial',
  display: 'swap',
})

export const jetbrainsMono = localFont({
  src: '../fonts/jetbrains-mono-wght.woff2',
  weight: '400 700',
  variable: '--font-jetbrains',
  // Метки мелкие и второстепенные: файл грузится, когда браузер встретит текст, а не в первую волну.
  preload: false,
  adjustFontFallback: false,
  display: 'swap',
})

export const fontVariables = [onest, manrope, jetbrainsMono].map((f) => f.variable).join(' ')
