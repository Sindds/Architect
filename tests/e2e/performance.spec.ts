import { expect, test } from './fixtures'

// Лаги на телефонах (жалоба 09.10.2026, Яндекс Браузер на Android). Замер в Chromium с 4× замедлением:
// backdrop-filter в 4,6 раза удорожал отрисовку кадра при прокрутке, а scroll-driven анимации .reveal
// держали 20 карточек отдельными GPU-слоями всё время жизни страницы.
// На сенсорных экранах размытия нет. Появление блоков (решение 12.10.2026) — переходы по IntersectionObserver
// (src/lib/reveal.ts) на всех устройствах: GPU-слой у блока есть только на время перехода.

const isFinePointer = (page: import('@playwright/test').Page) => page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)

test('на сенсорном экране нет размытия фона: ни у элементов, ни у подложки окна', async ({ page }) => {
  await page.goto('/')
  test.skip(await isFinePointer(page), 'проверка для сенсорных экранов')
  const blurred = await page.evaluate(() =>
    [...document.querySelectorAll('*')]
      .filter((el) => {
        const cs = getComputedStyle(el)
        const bf = cs.backdropFilter || cs.getPropertyValue('-webkit-backdrop-filter')
        return bf && bf !== 'none'
      })
      .map((el) => `${el.tagName}.${String(el.className).slice(0, 50)}`),
  )
  expect(blurred).toEqual([])
  // Подложка модального окна (меню)
  await page.getByRole('button', { name: 'Открыть меню' }).click()
  const backdrop = await page.evaluate(() => getComputedStyle(document.querySelector('dialog[open]')!, '::backdrop').backdropFilter)
  expect(backdrop).toBe('none')
})

test('на сенсорном экране нет анимаций, привязанных к прокрутке, и после прокрутки ≤ 15 GPU-слоёв', async ({ page }) => {
  await page.goto('/')
  test.skip(await isFinePointer(page), 'проверка для сенсорных экранов')
  const scrollDriven = await page.evaluate(() =>
    [...document.querySelectorAll('*')].filter((el) => {
      const t = getComputedStyle(el).getPropertyValue('animation-timeline')
      return t && t !== 'auto' && t !== 'none'
    }).length,
  )
  expect(scrollDriven).toBe(0)
  await page.evaluate(() => window.scrollBy(0, 1600))
  await page.waitForTimeout(1200) // переходы появления закончились
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('LayerTree.enable')
  const layers = await new Promise<{ drawsContent: boolean }[]>((resolve) => {
    cdp.on('LayerTree.layerTreeDidChange', (e) => e.layers && resolve(e.layers))
    void page.evaluate(() => window.scrollBy(0, 2))
  })
  expect(layers.filter((l) => l.drawsContent).length).toBeLessThanOrEqual(15)
})

test('на компьютере с мышью стеклянная шапка остаётся', async ({ page }) => {
  await page.goto('/')
  test.skip(!(await isFinePointer(page)), 'проверка для мыши')
  const header = await page.getByTestId('nav-capsule').evaluate((el) => getComputedStyle(el).backdropFilter)
  expect(header).toMatch(/blur/)
})

test('блоки появляются при прокрутке в обе стороны: вниз — снизу, обратно вверх — сверху', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-reveal', '')
  const item = page.locator('#faq .reveal').first()
  const state = () => item.evaluate((el) => ({ in: el.hasAttribute('data-in'), from: el.getAttribute('data-from'), opacity: getComputedStyle(el).opacity }))

  expect(await state()).toMatchObject({ in: false, opacity: '0' })
  await item.scrollIntoViewIfNeeded()
  await expect.poll(state).toMatchObject({ in: true, opacity: '1' })

  // Ушёл вниз за край при прокрутке к футеру — вернётся сверху.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect.poll(state).toMatchObject({ in: false, from: 'top' })
  await item.scrollIntoViewIfNeeded()
  await expect.poll(state).toMatchObject({ in: true, opacity: '1' })

  // Ушёл за нижний край при прокрутке наверх — снова появится снизу.
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect.poll(state).toMatchObject({ in: false, from: 'bottom' })
})

test('при «уменьшить движение» блоки видны сразу, без появления', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('html')).not.toHaveAttribute('data-reveal', /.*/)
  const hidden = await page.locator('.reveal').evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity !== '1').length)
  expect(hidden).toBe(0)
})

// Блоки ниже первого экрана с content-visibility: auto (src/lib/lazy-sections.ts): браузер раскладывает их у окна,
// и первый экран на телефоне готов раньше. Переход по якорю должен вставать точно на блок, хотя высоты были оценкой.
const settledOffset = (page: import('@playwright/test').Page, selector: string) =>
  page.evaluate(async (sel) => {
    let last = -1
    let same = 0
    while (same < 5) {
      await new Promise((r) => setTimeout(r, 100))
      same = scrollY === last ? same + 1 : 0
      last = scrollY
    }
    const el = document.querySelector(sel)!
    const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
    return Math.round(el.getBoundingClientRect().top - pad - margin)
  }, selector)

test('блоки ниже первого экрана раскладываются у окна, переход по меню встаёт точно на блок', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#process')).toHaveCSS('content-visibility', 'auto')
  await expect(page.locator('#calculator')).toHaveCSS('content-visibility', 'visible')
  const wide = (page.viewportSize()?.width ?? 0) >= 1280
  if (!wide) await page.getByRole('button', { name: 'Открыть меню' }).click()
  const nav = page.getByRole('navigation', { name: wide ? 'Разделы страницы' : 'Разделы страницы (мобильное меню)', exact: true })
  await nav.getByRole('link', { name: 'Как строим' }).click()
  expect(Math.abs(await settledOffset(page, '#process'))).toBeLessThanOrEqual(2)
  // Заново, с неразложенными блоками: цель ниже «ленивого» блока «Проекты».
  await page.goto('/')
  await expect(page.locator('html')).not.toHaveAttribute('data-full-layout')
  if (!wide) await page.getByRole('button', { name: 'Открыть меню' }).click()
  await nav.getByRole('link', { name: 'Цены' }).click()
  expect(Math.abs(await settledOffset(page, '#pricing'))).toBeLessThanOrEqual(2)
})
