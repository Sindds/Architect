import { readFileSync } from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { describe, expect, it } from 'vitest'
import { LOADER_KEY, THEME_KEY, resolveTheme, themeInitScript } from '@/lib/theme'

describe('Тема: выбор', () => {
  it('сохранённый выбор важнее системной темы', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
  it('без сохранённого выбора — системная тема', () => {
    expect(resolveTheme(null, true)).toBe('dark')
    expect(resolveTheme(null, false)).toBe('light')
    expect(resolveTheme('мусор', true)).toBe('dark')
  })
})

/** Запускает скрипт из <head> в песочнице с подставными браузерными API. */
function runInit({ stored = null as string | null, prefersDark = false, visited = false, reduced = false }) {
  const dataset: Record<string, string> = {}
  const style: Record<string, string> = {}
  const store = (init: Record<string, string>) => ({ getItem: (k: string) => init[k] ?? null, setItem() {} })
  const sandbox = {
    document: { documentElement: { dataset, style } },
    localStorage: store(stored ? { [THEME_KEY]: stored } : {}),
    sessionStorage: store(visited ? { [LOADER_KEY]: '1' } : {}),
    matchMedia: (q: string) => ({ matches: q.includes('dark') ? prefersDark : q.includes('reduce') ? reduced : false }),
  }
  vm.runInNewContext(themeInitScript, sandbox)
  return { dataset, style }
}

describe('Тема: скрипт в <head> до отрисовки', () => {
  it('ставит data-theme и color-scheme', () => {
    expect(runInit({ prefersDark: true }).dataset.theme).toBe('dark')
    expect(runInit({ stored: 'light', prefersDark: true }).dataset.theme).toBe('light')
    expect(runInit({ stored: 'dark' }).style.colorScheme).toBe('dark')
  })
  it('пропускает лоадер при повторном визите и при reduced motion', () => {
    expect(runInit({}).dataset.loader).toBeUndefined()
    expect(runInit({ visited: true }).dataset.loader).toBe('skip')
    expect(runInit({ reduced: true }).dataset.loader).toBe('skip')
  })
  it('не падает, если хранилище недоступно', () => {
    const sandbox = {
      document: { documentElement: { dataset: {}, style: {} } },
      get localStorage(): never {
        throw new Error('blocked')
      },
      matchMedia: () => ({ matches: false }),
    }
    expect(() => vm.runInNewContext(themeInitScript, sandbox)).not.toThrow()
  })
})

// --- Токены цвета: обе темы проходят WCAG AA (контраст текста ≥ 4,5:1) ---
const css = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8')

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`)
  if (start < 0) throw new Error(`Нет блока ${selector}`)
  const body = css.slice(start, css.indexOf('}', start))
  return Object.fromEntries([...body.matchAll(/--c-([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]!.toLowerCase()]))
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi! + 0.05) / (lo! + 0.05)
}

const PAIRS: [string, string][] = [
  ['fg', 'bg'],
  ['fg', 'surface'],
  ['fg', 'subtle'],
  ['muted', 'bg'],
  ['muted', 'surface'],
  ['muted', 'subtle'],
  ['accent', 'bg'],
  ['accent', 'surface'],
  ['accent', 'accent-soft'],
  ['on-inverse', 'inverse'],
  ['on-inverse-muted', 'inverse'],
  ['btn-fg', 'btn-bg'],
  ['danger', 'surface'],
  ['ok', 'surface'],
]

describe('Токены цвета', () => {
  const light = block(':root')
  const dark = block(":root[data-theme='dark']")

  for (const [name, theme] of [
    ['светлая', light],
    ['тёмная', dark],
  ] as const) {
    it(`${name} тема: пары текст/фон ≥ 4,5:1`, () => {
      const low = PAIRS.map(([fg, bg]) => {
        if (!theme[fg] || !theme[bg]) return `${fg}/${bg}: нет токена`
        const c = contrast(theme[fg]!, theme[bg]!)
        return c < 4.5 ? `${fg}/${bg}: ${c.toFixed(2)}` : null
      }).filter(Boolean)
      expect(low).toEqual([])
    })
  }

  it('фон страницы как у образца: светлый #f8f8f6, тёмный #0a0b0d', () => {
    expect(light.bg).toBe('#f8f8f6')
    expect(dark.bg).toBe('#0a0b0d')
  })

  it('без JS тёмная тема берётся из prefers-color-scheme и совпадает с [data-theme=dark]', () => {
    const media = css.slice(css.indexOf('@media (prefers-color-scheme: dark)'))
    const fromMedia = Object.fromEntries([...media.slice(0, media.indexOf('}')).matchAll(/--c-([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]!.toLowerCase()]))
    expect(fromMedia).toEqual(dark)
  })
})
