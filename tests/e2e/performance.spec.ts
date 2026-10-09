import { expect, test } from './fixtures'

// Лаги на телефонах (жалоба 09.10.2026, Яндекс Браузер на Android). Замер в Chromium с 4× замедлением:
// backdrop-filter в 4,6 раза удорожал отрисовку кадра при прокрутке, а scroll-driven анимации .reveal
// держали 20 карточек отдельными GPU-слоями всё время жизни страницы.
// На сенсорных экранах этих эффектов нет; на компьютере с мышью дизайн прежний.

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

test('на сенсорном экране карточки не анимируются от прокрутки и не держат GPU-слои', async ({ page }) => {
  await page.goto('/')
  test.skip(await isFinePointer(page), 'проверка для сенсорных экранов')
  const animated = await page.locator('.reveal').evaluateAll((els) => els.filter((el) => el.getAnimations().length > 0).length)
  expect(animated).toBe(0)

  const cdp = await page.context().newCDPSession(page)
  await cdp.send('LayerTree.enable')
  const layers = await new Promise<{ drawsContent: boolean }[]>((resolve) => {
    cdp.on('LayerTree.layerTreeDidChange', (e) => e.layers && resolve(e.layers))
    void page.evaluate(() => window.scrollBy(0, 400))
  })
  expect(layers.filter((l) => l.drawsContent).length).toBeLessThanOrEqual(15)
})

test('на компьютере с мышью стеклянная шапка и появление карточек остаются', async ({ page }) => {
  await page.goto('/')
  test.skip(!(await isFinePointer(page)), 'проверка для мыши')
  const header = await page.getByTestId('nav-capsule').evaluate((el) => getComputedStyle(el).backdropFilter)
  expect(header).toMatch(/blur/)
  const animated = await page.locator('.reveal').evaluateAll((els) => els.filter((el) => el.getAnimations().length > 0).length)
  expect(animated).toBeGreaterThan(0)
})
