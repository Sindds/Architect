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
    const box = await b.getByRole('button', { name }).boundingBox()
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
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
  await expect(map.getByRole('link', { name: /Открыть в Яндекс Картах/ })).toHaveAttribute('href', /yandex\.ru\/maps/)
  await map.getByRole('button', { name: 'Показать карту' }).click()
  await expect(map.locator('iframe')).toHaveAttribute('src', /yandex\.ru\/map-widget\/v1\//)
  await expect(map.locator('iframe')).toHaveAttribute('title', /Карта/)
})

test('«Принять все»: карта в футере загружается сразу', async ({ page }) => {
  await page.goto('/')
  await banner(page).getByRole('button', { name: 'Принять все' }).click()
  await expect(banner(page)).toBeHidden()
  const map = page.getByTestId('office-map')
  await map.scrollIntoViewIfNeeded()
  await expect(map.locator('iframe')).toHaveAttribute('src', /ll=37\.31\d*%2C55\.80\d*/)
})

test('без выбора карта не грузится, а баннер не перекрывает кнопки первого экрана на телефоне', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 740 })
  await page.goto('/')
  await expect(page.getByTestId('office-map').locator('iframe')).toHaveCount(0)
  const b = await banner(page).boundingBox()
  const cta = await page.getByTestId('hero').getByRole('link', { name: /Узнать цену/ }).boundingBox()
  expect(b && cta && cta.y + cta.height <= b.y).toBe(true)
})
