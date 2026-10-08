import { type Page } from '@playwright/test'
import { expect, test } from './fixtures'

// Дефекты из аудита 08.10.2026: каждый тест падал до исправления.

/** Сколько строк занимает текст элемента: считаем только строки текстовых узлов. */
const textLines = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll((els) =>
    els
      .filter((el) => (el as HTMLElement).offsetParent)
      .map((el) => {
        const tops = new Set<number>()
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          // Текст для экранных дикторов (.sr-only) глазу не виден и строк не добавляет.
          if (!node.textContent?.trim() || node.parentElement?.closest('.sr-only')) continue
          const range = document.createRange()
          range.selectNodeContents(node)
          for (const r of range.getClientRects()) if (r.width > 1) tops.add(Math.round(r.top))
        }
        return { text: (el.textContent ?? '').trim().slice(0, 30), lines: tops.size }
      }),
  )

for (const width of [320, 375, 768, 1024, 1280, 1440]) {
  test(`заголовок первого экрана ${width}px: не длиннее 5 строк, цена в одну строку`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')
    const [h1] = await textLines(page, 'h1')
    expect(h1?.lines).toBeLessThanOrEqual(5)
    const [price] = await textLines(page, '[data-testid=hero-price]')
    expect(price?.lines).toBe(1)
    await expect(page.getByTestId('hero-price')).toContainText('51,6')
  })
}

for (const width of [640, 768, 1024, 1280, 1440]) {
  test(`${width}px: карточки доказательств на первом экране не наезжают друг на друга`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const boxes = await page.locator('[aria-label="Доказательства"] li > *').evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect()
        const li = e.parentElement!.getBoundingClientRect()
        return { l: r.left, r: r.right, t: r.top, b: r.bottom, inCell: r.right <= li.right + 1 && r.left >= li.left - 1 }
      }),
    )
    expect(boxes).toHaveLength(3)
    expect(boxes.every((b) => b.inCell)).toBe(true)
    const overlaps = boxes.flatMap((a, i) => boxes.slice(i + 1).filter((b) => a.l < b.r - 1 && b.l < a.r - 1 && a.t < b.b - 1 && b.t < a.b - 1))
    expect(overlaps).toEqual([])
  })
}

for (const width of [320, 360, 640, 1024, 1180]) {
  test(`${width}px: текст и цифры в плитках кейсов, проектов и этапов не вылезают за плитку`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const out = await page.locator('#cases dl > div, #projects dl > div, #process ol > li').evaluateAll((tiles) =>
      tiles.flatMap((tile) => {
        const t = tile.getBoundingClientRect()
        const parent = tile.parentElement!.getBoundingClientRect()
        if (t.right > parent.right + 1) return [`плитка шире ряда: ${tile.textContent?.trim().slice(0, 30)}`]
        return [...tile.querySelectorAll('*')]
          .filter((el) => {
            const r = el.getBoundingClientRect()
            return r.width > 0 && (r.right > t.right + 1 || el.scrollWidth > el.clientWidth + 1)
          })
          .map((el) => el.textContent?.trim())
      }),
    )
    expect(out).toEqual([])
  })
}

for (const width of [360, 375, 414]) {
  test(`${width}px: кнопки первого экрана и метка в одну строку, без висячих предлогов`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')
    const buttons = await textLines(page, '[data-testid=hero] .btn')
    expect(buttons.filter((b) => b.lines > 1)).toEqual([])
    // Метка не заканчивает строку предлогом: «за» привязан к следующему слову неразрывным пробелом.
    const label = await page.getByTestId('hero').locator('p.label').first().textContent()
    expect(label).toMatch(/\sза\u00A0/)
  })
}

for (const width of [768, 1024, 1280]) {
  test(`шапка ${width}px: подписи и кнопки в одну строку`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    // Логотип (первая ссылка) двухстрочный по замыслу: название и подпись; подпись проверяем отдельно как .label.
    const items = await textLines(page, '[data-testid=nav-capsule] > a:not(:first-child), [data-testid=nav-capsule] nav a, [data-testid=nav-capsule] > button, [data-testid=nav-capsule] .label')
    expect(items.filter((i) => i.lines > 1)).toEqual([])
  })
}

test.describe('Телефон', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
  })

  test('метки на карточке проекта не наезжают друг на друга', async ({ page }) => {
    await page.goto('/')
    const card = page.getByTestId('project-card').first()
    await card.scrollIntoViewIfNeeded()
    const boxes = await card.locator('[data-chip]').evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => ({ l: r.left, r: r.right, t: r.top, b: r.bottom })))
    expect(boxes.length).toBeGreaterThanOrEqual(3)
    const overlaps = boxes.flatMap((a, i) => boxes.slice(i + 1).filter((b) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b))
    expect(overlaps).toEqual([])
  })

  test('варианты в калькуляторе помещаются в свои карточки', async ({ page }) => {
    await page.goto('/')
    const over = await page.locator('[data-testid=calculator] label').evaluateAll((els) =>
      els.filter((e) => (e as HTMLElement).offsetParent && e.scrollWidth > e.clientWidth + 1).map((e) => e.textContent?.trim().slice(0, 30)),
    )
    expect(over).toEqual([])
  })

  test('при работе с калькулятором итог виден внизу экрана', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Терраса, м²').scrollIntoViewIfNeeded()
    const bar = page.getByTestId('calc-sticky')
    await expect(bar).toBeVisible()
    await expect(bar).toContainText('₽')
  })

  test('пакеты цен листаются по горизонтали, а не тянутся на три экрана', async ({ page }) => {
    await page.goto('/')
    const tops = await page.locator('#pricing ol > li').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)))
    expect(new Set(tops).size).toBe(1)
  })
})

test('фото первого экрана грузится с высоким приоритетом', async ({ request }) => {
  const html = await (await request.get('/')).text()
  expect(html).toMatch(/<img[^>]*data-hero-image[^>]*fetchpriority="high"|<img[^>]*fetchpriority="high"[^>]*data-hero-image/i)
})

// WCAG 2.5.3: видимая подпись входит в доступное имя. Проверяем на узком и широком экране:
// у логотипа подпись «архитектура и стройка» появляется только на широком.
for (const width of [390, 1600]) {
  test(`${width}px: видимый текст ссылок и кнопок входит в их доступное имя`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const bad = await page.locator('a[aria-label], button[aria-label]').evaluateAll((els) =>
      els
        .filter((e) => (e as HTMLElement).offsetParent)
        .map((e) => ({ label: (e.getAttribute('aria-label') ?? '').toLowerCase(), text: (e as HTMLElement).innerText.replace(/\s+/g, ' ').trim().toLowerCase() }))
        .filter((x) => x.text && !x.label.includes(x.text)),
    )
    expect(bad).toEqual([])
  })
}

test('нет неподтверждённой популярности и «0%» в кейсах', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Выбирают чаще')).toHaveCount(0)
  await expect(page.locator('#cases').getByText('смета не изменилась').first()).toBeVisible()
})
