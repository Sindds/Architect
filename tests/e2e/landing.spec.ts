import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { formatDays, formatRub } from '@/lib/format'
import { breakdown, projectPrice } from '@/lib/pricing'

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 768

test.describe('Первый экран и варианты', () => {
  test('H1 с ценой есть в исходном HTML', async ({ request }) => {
    const html = await (await request.get('/')).text()
    // Текст H1 без тегов: цена может лежать в отдельном <span>, но заголовок остаётся одним H1.
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '').replace(/<[^>]+>/g, '').replace(/\u00a0/g, ' ')
    expect(h1).toBe('Дома из клееного бруса с панорамным остеклением в Подмосковье — от 26,4 млн ₽')
  })

  test('варианты отдают свой H1 в HTML', async ({ request }) => {
    const text = async (url: string) => (await (await request.get(url)).text()).replace(/\u00a0/g, ' ')
    expect(await text('/?v=monolith')).toContain('от 60,9 млн ₽')
    expect(await text('/?utm_content=fachwerk')).toContain('от 35,4 млн ₽')
    expect(await text('/?v=unknown')).toContain('от 26,4 млн ₽')
  })

  test('цена в заголовке не выше самой низкой цены в карточках проектов', async ({ page }) => {
    await page.goto('/')
    const mln = (s: string) => Number(s.replace(/\s/g, ' ').match(/от ([\d,]+) млн/)?.[1]?.replace(',', '.'))
    const hero = mln((await page.getByTestId('hero-price').textContent()) ?? '')
    const cards = (await page.locator('#projects dd').allTextContents()).map(mln).filter(Number.isFinite)
    expect(cards.length).toBeGreaterThan(0)
    expect(hero).toBeLessThanOrEqual(Math.min(...cards))
  })

  test('в блоке контактов нет схемы проезда: карта одна, в футере', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#contacts svg[role=img]')).toHaveCount(0)
    await expect(page.locator('#contacts').getByText(/Схема/)).toHaveCount(0)
    await expect(page.getByTestId('office-map')).toHaveCount(1)
  })

  test('несуществующий адрес — 404', async ({ request }) => {
    expect((await request.get('/net-takoy-stranicy')).status()).toBe(404)
  })

  test('нет горизонтальной прокрутки, нет запросов к Яндексу при загрузке', async ({ page }) => {
    const external: string[] = []
    page.on('request', (r) => {
      if (/yandex\.|mc\.yandex/.test(r.url())) external.push(r.url())
    })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
    expect(external).toEqual([])
  })
})

test.describe('Шапка', () => {
  test('телефон виден; на мобильном все кнопки шапки ≥ 44×44', async ({ page }) => {
    await page.goto('/')
    if (isMobile(page)) {
      await expect(page.getByRole('link', { name: /Позвонить/ })).toBeVisible()
      const boxes = await page.locator('header a:visible, header button:visible').evaluateAll((els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect()
          return { w: r.width, h: r.height, text: e.textContent?.trim() || e.getAttribute('aria-label') }
        }),
      )
      for (const b of boxes) {
        expect.soft(b.h, `высота «${b.text}»`).toBeGreaterThanOrEqual(44)
        expect.soft(b.w, `ширина «${b.text}»`).toBeGreaterThanOrEqual(44)
      }
    } else {
      await expect(page.getByTestId('header-phone')).toBeVisible()
    }
  })

  test('футер: дисклеймер концепта и юридические ссылки', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('disclaimer')).toContainText('Концепт-проект для портфолио')
    for (const name of ['Политика конфиденциальности', 'Согласие на обработку данных', 'Файлы cookie']) {
      await expect(page.locator('footer').getByRole('link', { name })).toBeVisible()
    }
  })
})

test('у команды портреты с описанием и пометкой о концепте', async ({ page }) => {
  await page.goto('/')
  const team = page.getByTestId('team')
  await team.scrollIntoViewIfNeeded()
  const photos = team.getByRole('img')
  await expect(photos).toHaveCount(4)
  await expect(photos.first()).toHaveAttribute('alt', /Алексей Воронов/)
  await expect(page.locator('#team-title + p, #team-title ~ p').first()).toContainText('сгенерирован')
})

test.describe('Окна проектов и кейсов', () => {
  test('прямой заход /?project=titan открывает окно, Esc закрывает и чистит адрес', async ({ page }) => {
    await page.goto('/?project=titan')
    const modal = page.getByTestId('project-modal')
    await expect(modal).toBeVisible()
    await expect(modal.getByRole('heading', { level: 2 })).toContainText('TITAN')
    const titan = projectPrice({ style: 'monolith', area: 540, terrace: 120 }, 'turnkey')
    await expect(modal).toContainText(formatRub(titan.price))
    await page.keyboard.press('Escape')
    await expect(modal).toBeHidden()
    // page.url() обновляется асинхронно — проверяем с ожиданием.
    await expect(page).not.toHaveURL(/project=/)
  })

  test('клик по карточке меняет адрес, «Назад» закрывает, фокус возвращается', async ({ page }) => {
    await page.goto('/')
    const card = page.getByTestId('projects-grid').getByRole('button', { name: 'VISTA' })
    await card.scrollIntoViewIfNeeded()
    await card.click()
    await expect(page.getByTestId('project-modal')).toBeVisible()
    await expect(page).toHaveURL(/project=vista/)
    await page.goBack()
    await expect(page.getByTestId('project-modal')).toBeHidden()
    await expect(card).toBeFocused()
  })

  test('отдельного блока «Кейсы» нет: сданные дома — доказательство в «Как мы работаем»', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#cases')).toHaveCount(0)
    await expect(page.getByRole('navigation', { name: 'Разделы страницы' }).getByRole('link', { name: 'Кейсы' })).toHaveCount(0)
    const delivered = page.getByTestId('delivered')
    await expect(delivered.getByRole('listitem')).toHaveCount(3)
    // Доказательство на первом экране ведёт к сданным домам.
    await expect(page.getByTestId('hero').getByRole('link', { name: /сданных дома/ })).toHaveAttribute('href', '#delivered')
    const button = delivered.getByRole('button', { name: /Дом у воды/ })
    await button.scrollIntoViewIfNeeded()
    await button.click()
    await expect(page.getByTestId('case-modal')).toBeVisible()
    await expect(page).toHaveURL(/case=dom-u-vody/)
  })

  test('окно кейса: план и факт, +2,7%', async ({ page }) => {
    await page.goto('/?case=rezidenciya-na-sklone')
    const modal = page.getByTestId('case-modal')
    await expect(modal).toBeVisible()
    await expect(modal).toContainText('+2,7% к смете')
    await expect(modal).toContainText(formatRub(140_950_000))
  })

  test('«Рассчитать этот проект» подставляет параметры в калькулятор', async ({ page }) => {
    await page.goto('/?project=titan')
    await page.getByTestId('project-modal').getByRole('button', { name: 'Рассчитать этот проект' }).click()
    await expect(page.getByTestId('project-modal')).toBeHidden()
    await expect(page.getByTestId('calc-area-input')).toHaveValue('540')
    await expect(page.getByRole('radio', { name: /Монолит/ })).toBeChecked()
    await expect(page).toHaveURL(/calc=titan/)
  })
})

test.describe('Калькулятор и квиз', () => {
  test('значения по умолчанию: 47 150 000 ₽ и 133 дня', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('calc-total')).toHaveText(formatRub(47_150_000))
    await expect(page.getByTestId('calc-days')).toContainText(formatDays(133))
  })

  test('прямая ссылка /?calc=titan#calculator: итог совпадает с pricing.ts', async ({ page }) => {
    await page.goto('/?calc=titan#calculator')
    await expect(page.getByTestId('calc-area-input')).toHaveValue('540')
    const expected = breakdown({ area: 540, terrace: 120, style: 'monolith', tier: 'whitebox', addons: ['knx'] })
    await expect(page.getByTestId('calc-total')).toHaveText(formatRub(expected.total))
  })

  test('квиз: «Далее» неактивна без ответа, после 4 шагов — вилка и форма', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Узнать цену за 2 минуты' }).click()
    const quiz = page.getByTestId('quiz')
    await expect(quiz).toBeVisible()
    for (const answer of ['250–350 м²', 'Скандинавский', 'В течение года', 'Участок есть']) {
      const next = quiz.getByRole('button', { name: /Далее|Показать вилку/ })
      await expect(next).toBeDisabled()
      await quiz.getByText(answer, { exact: true }).click()
      await next.click()
    }
    const result = page.getByTestId('quiz-result')
    await expect(result).toContainText('Ваша вилка')
    await result.getByRole('button', { name: 'Получить расчёт' }).click()
    await expect(page.getByTestId('lead-modal').getByRole('heading', { name: 'Получить расчёт' })).toBeVisible()
  })
})

test.describe('Заявка', () => {
  test('«Покажем построенный дом» → форма «Экскурсия на объект»; без согласия не отправляется; с согласием — номер заявки', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Покажем построенный дом' }).click()
    const modal = page.getByTestId('lead-modal')
    await expect(modal.getByRole('heading', { name: 'Экскурсия на объект' })).toBeVisible()
    const consent = modal.getByRole('checkbox')
    await expect(consent).not.toBeChecked()

    await modal.getByLabel('Имя').fill('Анна')
    await modal.getByLabel('Телефон').fill('9161234567')
    await expect(modal.getByLabel('Телефон')).toHaveValue('+7 (916) 123-45-67')
    await page.waitForTimeout(3100)
    await modal.getByRole('button', { name: 'Записаться на экскурсию' }).click()
    await expect(modal.getByText('Без согласия на обработку данных отправить заявку нельзя')).toBeVisible()
    await expect(modal.getByLabel('Имя')).toHaveValue('Анна')

    await consent.check()
    await modal.getByRole('button', { name: 'Записаться на экскурсию' }).click()
    await expect(modal.getByTestId('lead-success')).toContainText(/Заявка №\d+ принята/)
  })

  test('FAQ раскрывается с клавиатуры', async ({ page }) => {
    await page.goto('/')
    const summary = page.locator('summary', { hasText: 'Можно ли через ипотеку или эскроу?' })
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByText('Условия ипотеки и эскроу мы пока уточняем')).toBeVisible()
  })
})

test.describe('Доступность (axe)', () => {
  for (const url of ['/', '/?project=vista', '/privacy']) {
    test(`нет нарушений serious/critical: ${url}`, async ({ page }) => {
      await page.goto(url)
      if (url.includes('project')) await expect(page.getByTestId('project-modal')).toBeVisible()
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
      const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([])
    })
  }
})
