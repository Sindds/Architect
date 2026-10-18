import AxeBuilder from '@axe-core/playwright'
import { test as base, expect } from '@playwright/test'
import { CONSENT_KEY, LOADER_KEY } from './fixtures'

// Первый визит: лоадер пропускаем, выбор по cookie не сделан.
const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript((key) => sessionStorage.setItem(key, '1'), LOADER_KEY)
    await provide(page)
  },
})

const banner = (page: import('@playwright/test').Page) => page.getByRole('region', { name: 'Файлы cookie' })

test('при первом входе показывается баннер cookie с выбором и ссылкой на правила', async ({ page }) => {
  await page.goto('/')
  const b = banner(page)
  await expect(b).toBeVisible()
  await expect(b.getByRole('link', { name: /Подробнее/ })).toHaveAttribute('href', '/cookies')
  for (const name of ['Принять все', 'Только необходимые']) {
    const button = b.getByRole('button', { name })
    const box = await button.boundingBox()
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
    // Подпись в одну строку даже на узком телефоне
    const lines = await button.evaluate((el) => {
      const r = document.createRange()
      r.selectNodeContents(el)
      return new Set([...r.getClientRects()].filter((x) => x.width > 1).map((x) => Math.round(x.top))).size
    })
    expect(lines).toBe(1)
  }
  const axe = await new AxeBuilder({ page }).include('[data-testid=cookie-banner]').analyze()
  expect(axe.violations).toEqual([])
})

test('«Только необходимые»: баннер исчезает и не возвращается, карта грузится только по клику', async ({ page }) => {
  await page.goto('/')
  await banner(page).getByRole('button', { name: 'Только необходимые' }).click()
  await expect(banner(page)).toBeHidden()
  expect(await page.evaluate((k) => localStorage.getItem(k), CONSENT_KEY)).toBe('necessary')
  await page.reload()
  await expect(banner(page)).toHaveCount(0)

  const map = page.getByTestId('office-map')
  await map.scrollIntoViewIfNeeded()
  await expect(map.locator('iframe')).toHaveCount(0)
  // Карта района видна и без согласия: картинка с нашего сервера, подпись OpenStreetMap по лицензии.
  await expect(map.getByRole('img', { name: /Карта района/ })).toBeVisible()
  await expect(map.getByRole('link', { name: /OpenStreetMap/ })).toHaveAttribute('href', 'https://www.openstreetmap.org/copyright')
  await expect(map.getByRole('link', { name: /Открыть в Яндекс Картах/ })).toHaveAttribute('href', /yandex\.ru\/maps/)
  await map.getByRole('button', { name: 'Интерактивная карта' }).click()
  await expect(map.locator('iframe')).toHaveAttribute('src', /yandex\.ru\/map-widget\/v1\//)
  await expect(map.locator('iframe')).toHaveAttribute('title', /Карта/)
})

test('«Принять все»: карта в футере загружается сразу', async ({ page }) => {
  await page.goto('/')
  await banner(page).getByRole('button', { name: 'Принять все' }).click()
  await expect(banner(page)).toBeHidden()
  const map = page.getByTestId('office-map')
  await map.scrollIntoViewIfNeeded()
  // Точка адреса «Новорижское шоссе, 7-й километр, с1» (SITE.geo, геокодер Яндекс Карт).
  await expect(map.locator('iframe')).toHaveAttribute('src', /ll=37\.279968%2C55\.799917/)
})

test('без выбора карта не грузится, а баннер не перекрывает кнопки первого экрана на телефоне', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 740 })
  await page.goto('/')
  await expect(page.getByTestId('office-map').locator('iframe')).toHaveCount(0)
  const b = await banner(page).boundingBox()
  const cta = await page.getByTestId('hero').getByRole('link', { name: /Узнать цену/ }).boundingBox()
  expect(b && cta && cta.y + cta.height <= b.y).toBe(true)
})

test('«Настройки cookie» в футере возвращают баннер: выбор можно изменить', async ({ page }) => {
  await page.goto('/')
  await banner(page).getByRole('button', { name: 'Только необходимые' }).click()
  await expect(banner(page)).toBeHidden()
  await page.getByRole('button', { name: 'Настройки cookie' }).click()
  await expect(banner(page)).toBeVisible()
  await banner(page).getByRole('button', { name: 'Принять все' }).click()
  await expect(page.getByTestId('office-map').locator('iframe')).toHaveAttribute('src', /yandex\.ru\/map-widget/)
})

test('пока виден баннер cookie, нижняя панель на телефоне не появляется', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(banner(page)).toBeVisible()
  await page.locator('#projects').scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollBy(0, 400))
  await expect(page.getByTestId('mobile-action-bar')).not.toHaveAttribute('data-shown', /.*/)
  await expect(page.getByTestId('scroll-top')).not.toHaveAttribute('data-shown', /.*/)
  await banner(page).getByRole('button', { name: 'Только необходимые' }).click()
  await expect(page.getByTestId('mobile-action-bar')).toHaveAttribute('data-shown', '')
  await expect(page.getByTestId('scroll-top')).toHaveAttribute('data-shown', '')
  // Кнопка «Наверх» стоит над капсулой и не перекрывает её (после того как обе выехали: переход 300 мс).
  await expect
    .poll(async () => {
      const [up, bar] = [await page.getByTestId('scroll-top').boundingBox(), await page.getByTestId('mobile-action-bar').boundingBox()]
      return { gap: Math.round(bar!.y - (up!.y + up!.height)), sameHeight: Math.round(up!.height) === Math.round(bar!.height) }
    })
    .toEqual({ gap: 8, sameHeight: true })
})
