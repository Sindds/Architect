import AxeBuilder from '@axe-core/playwright'
import { test as plain, type Page } from '@playwright/test'
import { expect, test } from './fixtures'

const radius = (page: Page, testId: string) =>
  page.getByTestId(testId).first().evaluate((el) => {
    const s = getComputedStyle(el)
    return { radius: parseFloat(s.borderTopLeftRadius), height: el.getBoundingClientRect().height }
  })

const bodyBg = (page: Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor)

test.describe('Дизайн в стиле образца (bento)', () => {
  test('первый экран — скруглённая карточка с фото, заголовок прописными', async ({ page }) => {
    await page.goto('/')
    const hero = await radius(page, 'hero')
    expect(hero.radius).toBeGreaterThanOrEqual(24)
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toHaveCSS('text-transform', 'uppercase')
    await expect(page.getByTestId('hero').locator('img').first()).toBeVisible()
  })

  test('шапка — плавающая капсула', async ({ page }) => {
    await page.goto('/')
    const capsule = await radius(page, 'nav-capsule')
    expect(capsule.radius).toBeGreaterThanOrEqual(capsule.height / 2)
  })

  test('кнопки — капсулы, карточки проектов скруглены', async ({ page }) => {
    await page.goto('/')
    const cta = page.getByTestId('hero').getByRole('link', { name: /Рассчитать стоимость/ })
    const box = await cta.evaluate((el) => ({ r: parseFloat(getComputedStyle(el).borderTopLeftRadius), h: el.getBoundingClientRect().height }))
    expect(box.r).toBeGreaterThanOrEqual(box.h / 2)
    const card = await radius(page, 'project-card')
    expect(card.radius).toBeGreaterThanOrEqual(20)
  })

  test('заголовки секций прописными, метки моноширинным шрифтом', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#projects-title')).toHaveCSS('text-transform', 'uppercase')
    const family = await page.getByTestId('section-label').first().evaluate((el) => getComputedStyle(el).fontFamily.toLowerCase())
    expect(family).toContain('jetbrains')
  })

  test('шрифт заголовков — гротеск с кириллицей (Manrope)', async ({ page }) => {
    await page.goto('/')
    const family = await page.getByRole('heading', { level: 1 }).evaluate((el) => getComputedStyle(el).fontFamily.toLowerCase())
    expect(family).toContain('manrope')
  })
})

test.describe('Светлая и тёмная тема', () => {
  test('по умолчанию следует системной теме', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    expect(await bodyBg(page)).toBe('rgb(10, 11, 13)')
  })

  test('переключатель меняет тему и запоминает выбор', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'light')
    expect(await bodyBg(page)).toBe('rgb(248, 248, 246)')

    await page.getByRole('button', { name: 'Включить тёмную тему' }).click()
    await expect(html).toHaveAttribute('data-theme', 'dark')
    await expect.poll(() => bodyBg(page)).toBe('rgb(10, 11, 13)')

    await page.reload()
    await expect(html).toHaveAttribute('data-theme', 'dark')
    await expect(page.getByRole('button', { name: 'Включить светлую тему' })).toBeVisible()
  })

  test('тема ставится скриптом в <head> до отрисовки', async ({ request }) => {
    const html = await (await request.get('/')).text()
    const head = html.slice(0, html.indexOf('</head>'))
    expect(head).toContain('arcline-theme')
  })

  for (const url of ['/', '/?project=vista', '/privacy']) {
    test(`тёмная тема: нет нарушений axe serious/critical — ${url}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' })
      await page.goto(url)
      if (url.includes('project')) await expect(page.getByTestId('project-modal')).toBeVisible()
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
      const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([])
    })
  }
})

// Лоадер проверяем без фикстуры: нужен «первый визит» без отметки в sessionStorage.
plain.describe('Лоадер', () => {
  plain('при первом визите показывается и сам исчезает, контент уже в HTML', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' })
    const loader = page.getByTestId('page-loader')
    await expect(loader).toBeVisible()
    await expect(loader).not.toContainText(/BIM|Калибровка|Инициализация/)
    await expect(loader).toBeHidden({ timeout: 3000 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  })

  plain('при повторном заходе в той же сессии не показывается', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('page-loader')).toBeHidden({ timeout: 3000 })
    await page.reload({ waitUntil: 'commit' })
    await expect(page.locator('html')).toHaveAttribute('data-loader', 'skip')
    await expect(page.getByTestId('page-loader')).toBeHidden({ timeout: 200 })
  })

  plain('при reduced motion не показывается', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/', { waitUntil: 'commit' })
    await expect(page.locator('html')).toHaveAttribute('data-loader', 'skip')
    await expect(page.getByTestId('page-loader')).toBeHidden({ timeout: 200 })
  })
})
