import { readFileSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import type { Page, Route } from '@playwright/test'
import { clickCentered, expect, expectSeen, test } from './fixtures'
import { SITE } from '@/content/site'
import { formatDays, formatMlnFrom, formatRub } from '@/lib/format'
import { breakdown, minCalc, projectPrice } from '@/lib/pricing'

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 768

test.describe('Первый экран и варианты', () => {
  test('H1 с ценой есть в исходном HTML', async ({ request }) => {
    const html = await (await request.get('/')).text()
    // Текст H1 без тегов: цена может лежать в отдельном <span>, но заголовок остаётся одним H1.
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '').replace(/<[^>]+>/g, '').replace(/\u00a0/g, ' ')
    // Цена «от» — минимум калькулятора (variant.ts → minCalc); heroFor не импортируем: он тянет картинки.
    expect(h1).toContain(`— от ${formatMlnFrom(minCalc('contour').price).replace(/\u00a0/g, ' ')}`)
    expect(h1).toBe('Дома из клееного бруса с панорамным остеклением в Подмосковье — от 8,36 млн ₽')
  })

  test('варианты отдают свой H1 в HTML', async ({ request }) => {
    const text = async (url: string) => (await (await request.get(url)).text()).replace(/\u00a0/g, ' ')
    expect(await text('/?v=monolith')).toContain('от 10,56 млн ₽')
    expect(await text('/?utm_content=fachwerk')).toContain('от 8,8 млн ₽')
    expect(await text('/?v=unknown')).toContain('от 8,36 млн ₽')
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

  test('тексты не обещают больше договора: срок не от подписания, оплата по этапам после акта', async ({ page }) => {
    await page.goto('/')
    // nbsp() ставит неразрывные пробелы после предлогов: приводим к обычным.
    const text = (await page.locator('body').innerText()).replace(/\u00a0/g, ' ')
    expect(text).not.toMatch(/от подпис\S* (договора )?до ключей/i)
    expect(text).not.toMatch(/готовый результат/i)
    expect(text).not.toMatch(/после геологии/i)
    // Подзаголовок первого экрана — текст заказчика (18.10.2026) со сроком и ценами из pricing.ts.
    expect(text).toMatch(/Ваш загородный дом — от 130 дней, с фиксированной стоимостью/)
    expect(text).toMatch(/Получите персональный расчёт стоимости Вашего дома с учётом площади, архитектуры и комплектации\./)
  })

  test('в контактах реквизиты компании и адрес; пометки о концепте и строки про карту нет', async ({ page }) => {
    await page.goto('/')
    const req = page.getByTestId('requisites')
    for (const term of ['Компания', 'ИНН', 'КПП', 'ОГРН', 'Юридический адрес']) await expect(req.getByText(term, { exact: true })).toBeVisible()
    await expect(req).toContainText(SITE.operator.inn)
    await expect(req).toContainText('Московская обл., Новорижское шоссе, 7-й километр, с1')
    await expect(page.locator('#contacts')).not.toContainText(/концепт|условн|вымышлен|Карта с отметкой/i)
    await expect(page.locator('#contacts')).toContainText(SITE.address)
  })

  test('цена «от» в H1 — минимум калькулятора: 100 м², без террасы, скандинавский, тёплый контур', async ({ page }) => {
    await page.goto('/')
    const calc = page.getByTestId('calculator')
    await calc.scrollIntoViewIfNeeded()
    const area = page.getByTestId('calc-area-input')
    await area.fill('100')
    await area.press('Enter')
    // Ползунок террасы: значение через нативный сеттер и событие input (так его видит React).
    await calc.getByLabel('Терраса, м²').evaluate((el: HTMLInputElement) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(el, '0')
      el.dispatchEvent(new Event('input', { bubbles: true }))
    })
    await calc.getByRole('radio', { name: /Скандинавский/ }).check()
    await calc.getByRole('radio', { name: /^Тёплый контур/ }).check()
    for (const name of ['Умный дом', 'Геотермальный', 'Бассейн']) {
      const box = calc.getByRole('checkbox', { name: new RegExp(name) })
      if (await box.isChecked()) await box.uncheck()
    }
    await expect(page.getByTestId('calc-total')).toHaveText(formatRub(8_360_000))
    await expect(page.getByTestId('hero-price')).toHaveText(/от\s8,36\sмлн\s₽/)
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

  test('футер: знак ©, год и компания, реквизиты, адрес и юридические ссылки; без пометок о концепте', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('copyright')).toHaveText(`© ${new Date().getFullYear()} ${SITE.brandFull}`)
    await expect(page.getByTestId('requisites-line')).toContainText(`${SITE.operator.name}, ИНН ${SITE.operator.inn}`)
    await expect(page.locator('footer')).not.toContainText(/концепт|портфолио|вымышлен/i)
    await expect(page.locator('footer')).toContainText('Архитектурно-строительное бюро полного цикла')
    await expect(page.locator('footer')).toContainText(SITE.address)
    await expect(page.locator('footer')).not.toContainText(/Адрес условный/)
    for (const name of ['Политика конфиденциальности', 'Согласие на обработку данных', 'Файлы cookie']) {
      await expect(page.locator('footer').getByRole('link', { name })).toBeVisible()
    }
  })
})

test('у команды портреты с описанием; в тексте блока нет пометок о концепте', async ({ page }) => {
  await page.goto('/')
  const team = page.getByTestId('team')
  await team.scrollIntoViewIfNeeded()
  const photos = team.getByRole('img')
  await expect(photos).toHaveCount(4)
  await expect(photos.first()).toHaveAttribute('alt', /Алексей Воронов/)
  await expect(page.locator('#team-title + p, #team-title ~ p').first()).toContainText('Познакомьтесь со специалистами')
  await expect(page.locator('section[aria-labelledby=team-title]')).not.toContainText(/сгенерирован|вымышлен|концепт/i)
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

  // Решение заказчика 17.10.2026: списка сданных домов и их окон нет. Старые ссылки /?case=… открывают главную.
  test('нет блока «Кейсы», списка сданных домов и их окон', async ({ page }) => {
    await page.goto('/?case=dom-u-vody')
    await expect(page.locator('#cases, #delivered, [data-testid=delivered], [data-testid=case-modal]')).toHaveCount(0)
    await expect(page.getByRole('dialog')).toHaveCount(0)
    // Названия домов остаются только в подписях отзывов; кнопок-блоков с ними нет.
    await expect(page.getByRole('button', { name: /Дом у воды|Резиденция на склоне|Дом среди сосен/ })).toHaveCount(0)
    // Доказательство в карточке «Показываем реальные результаты» ведёт к отзывам.
    const proof = page.getByRole('link', { name: 'Отзывы владельцев' })
    await expect(proof).toHaveAttribute('href', '#reviews')
    await expect(page.locator('#reviews')).toHaveCount(1)
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
    await expect(result).toContainText('Предварительная стоимость дома')
    await expectSeen(result.getByRole('heading', { name: /Предварительная стоимость дома — от .+ до .+ млн/ }))
    await result.getByRole('button', { name: 'Получить расчёт' }).click()
    await expect(page.getByTestId('lead-modal').getByRole('heading', { name: 'Получить расчёт' })).toBeVisible()
  })
})

test.describe('Заявка', () => {
  test('«Задать вопрос архитектору» → форма; без согласия не отправляется; с согласием — номер заявки', async ({ page }) => {
    await page.goto('/')
    await clickCentered(page.getByRole('button', { name: 'Задать вопрос архитектору' }))
    const modal = page.getByTestId('lead-modal')
    await expect(modal.getByRole('heading', { name: 'Обсудите свой будущий дом с архитектором' })).toBeVisible()
    const consent = modal.getByRole('checkbox')
    await expect(consent).not.toBeChecked()

    await modal.getByLabel('Имя').fill('Анна')
    await modal.getByLabel('Телефон').fill('9161234567')
    await expect(modal.getByLabel('Телефон')).toHaveValue('+7 (916) 123-45-67')
    await page.waitForTimeout(3100)
    await modal.getByRole('button', { name: 'Отправить заявку' }).click()
    await expect(modal.getByText('Без согласия на обработку данных отправить заявку невозможно')).toBeVisible()
    await expect(modal.getByLabel('Имя')).toHaveValue('Анна')

    await consent.check()
    await modal.getByRole('button', { name: 'Отправить заявку' }).click()
    await expect(modal.getByTestId('lead-success')).toContainText(/Заявка №\d+ принята/)
  })

  // Сбой отправки (обрыв сети, ответ 500) не роняет страницу: форма с вводом остаётся, рядом телефон.
  for (const [title, fail] of [
    ['обрыв сети', (route: Route) => route.abort('failed')],
    ['ответ 500', (route: Route) => route.fulfill({ status: 500, body: 'Internal Server Error' })],
  ] as const) {
    test(`сбой отправки (${title}): страница на месте, ввод сохранён, виден телефон`, async ({ page }) => {
      await page.route('**/*', (route) =>
        route.request().method() === 'POST' && route.request().headers()['next-action'] ? fail(route) : route.fallback(),
      )
      await page.goto('/')
      await clickCentered(page.getByRole('button', { name: 'Задать вопрос архитектору' }))
      const modal = page.getByTestId('lead-modal')
      await modal.getByLabel('Имя').fill('Анна')
      await modal.getByLabel('Телефон').fill('9161234567')
      await modal.getByRole('checkbox').check()
      await modal.getByRole('button', { name: 'Отправить заявку' }).click()

      const alert = modal.getByRole('alert')
      await expect(alert).toContainText('Не удалось отправить')
      await expect(alert.getByRole('link', { name: SITE.phoneDisplay })).toHaveAttribute('href', SITE.phoneHref)
      await expect(modal.getByLabel('Имя')).toHaveValue('Анна')
      await expect(modal.getByLabel('Телефон')).toHaveValue('+7 (916) 123-45-67')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('от')
    })
  }

  test('маска телефона: правка в середине, код на 8, стирание через скобку', async ({ page }) => {
    await page.goto('/')
    await clickCentered(page.getByRole('button', { name: 'Задать вопрос архитектору' }))
    const phone = page.getByTestId('lead-modal').getByLabel('Телефон')

    await phone.pressSequentially('9161234567')
    await expect(phone).toHaveValue('+7 (916) 123-45-67')
    // Курсор после «6» в коде: стираем её и набираем «5».
    await phone.press('End')
    for (let i = 0; i < 11; i++) await phone.press('ArrowLeft')
    await phone.press('Backspace')
    await phone.press('5')
    await expect(phone).toHaveValue('+7 (915) 123-45-67')

    await phone.fill('')
    await phone.pressSequentially('88121234567')
    await expect(phone).toHaveValue('+7 (812) 123-45-67')

    await phone.press('End')
    for (let i = 0; i < 11; i++) await phone.press('Backspace')
    await expect(phone).toHaveValue('')
  })

  test('после ошибки отправки выбор способа связи и согласие сохраняются', async ({ page }) => {
    await page.route('**/*', (route) =>
      route.request().method() === 'POST' && route.request().headers()['next-action'] ? route.abort('failed') : route.fallback(),
    )
    await page.goto('/')
    await page.getByRole('button', { name: 'Написать в мессенджер' }).first().click()
    const modal = page.getByTestId('lead-modal')
    await modal.getByLabel('Имя').fill('Анна')
    await modal.getByLabel('Телефон').fill('9161234567')
    await modal.getByRole('radio', { name: 'MAX' }).check()
    await modal.getByRole('checkbox').check()
    await modal.getByRole('button', { name: /Отправить|Написать/ }).click()

    await expect(modal.getByRole('alert')).toContainText('Не удалось отправить')
    await expect(modal.getByRole('radio', { name: 'MAX' })).toBeChecked()
    await expect(modal.getByRole('checkbox')).toBeChecked()
  })

  test('отправка сразу после заполнения: сервер по своей метке времени отвечает «слишком быстро»', async ({ page }) => {
    await page.goto('/')
    await clickCentered(page.getByRole('button', { name: 'Задать вопрос архитектору' }))
    const modal = page.getByTestId('lead-modal')
    await modal.getByLabel('Имя').fill('Анна')
    await modal.getByLabel('Телефон').fill('9161234567')
    await modal.getByRole('checkbox').check()
    const submit = modal.getByRole('button', { name: 'Отправить заявку' })
    await expect(submit).toBeEnabled()
    await submit.click()
    await expect(modal.getByRole('alert')).toContainText('слишком быстро')
  })

  test('«Получить смету в PDF» из калькулятора: после заявки скачивается PDF, испорченная ссылка — 403', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Получить смету в PDF' }).first().click()
    const modal = page.getByTestId('lead-modal')
    await expect(modal).toContainText('откроется сразу после отправки')
    await modal.getByLabel('Имя').fill('Анна')
    await modal.getByLabel('Телефон').fill('9161234567')
    await modal.getByRole('checkbox').check()
    await page.waitForTimeout(3100)
    await modal.getByRole('button', { name: /Отправить|Получить/ }).click()

    const link = modal.getByTestId('smeta-download')
    await expect(link).toBeVisible()
    const href = (await link.getAttribute('href')) as string
    expect(href).toMatch(/^\/smeta\//)
    const res = await page.request.get(href)
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toBe('application/pdf')
    expect((await res.body()).subarray(0, 5).toString()).toBe('%PDF-')
    expect((await page.request.get(`${href.slice(0, -3)}xyz`)).status()).toBe(403)
  })

  test('кнопка «Рассчитать стоимость» в шапке ведёт в калькулятор', async ({ page }) => {
    await page.goto('/')
    const desktop = page.getByRole('banner').getByRole('link', { name: 'Рассчитать стоимость' })
    if (await desktop.isVisible()) await desktop.click()
    else {
      await page.getByRole('button', { name: 'Открыть меню' }).click()
      await page.getByRole('dialog').getByRole('link', { name: 'Рассчитать стоимость' }).click()
    }
    await expect(page).toHaveURL(/#calculator$/)
    await expect(page.locator('#calculator')).toBeInViewport()
    await expect(page.getByTestId('lead-modal')).toBeHidden()
  })

  test('FAQ раскрывается с клавиатуры', async ({ page }) => {
    await page.goto('/')
    const summary = page.locator('summary', { hasText: 'Можно ли оплатить строительство в ипотеку или через эскроу?' })
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByText(/Условия работы с ипотекой и эскроу-счетами пока уточняются/)).toBeVisible()
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

test.describe('Нижняя панель на телефоне и мессенджеры', () => {
  test('кнопка расчёта появляется после первого экрана, прячется у калькулятора и в контактах; компактная, цель ≥ 44 px', async ({ page }) => {
    await page.goto('/')
    const bar = page.getByTestId('mobile-action-bar')
    if (!isMobile(page)) {
      await expect(bar).toBeHidden()
      return
    }
    await expect(bar).not.toHaveAttribute('data-shown', /.*/)
    await page.locator('#projects').scrollIntoViewIfNeeded()
    await page.evaluate(() => window.scrollBy(0, 400))
    await expect(bar).toHaveAttribute('data-shown', '')
    // Позвонить и написать — в шапке; внизу только расчёт, капсула не шире 2/3 экрана и целиком в окне.
    await expect(bar).toHaveAccessibleName('Рассчитать стоимость')
    await expect(bar.locator('a, button')).toHaveCount(0)
    const box = (await bar.boundingBox())!
    const width = page.viewportSize()!.width
    expect(box.height).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeLessThanOrEqual(52)
    expect(box.width).toBeLessThanOrEqual(width * (2 / 3))
    expect(box.x + box.width).toBeLessThanOrEqual(width)
    await bar.click()
    await expect(page).toHaveURL(/#calculator$/)
    await expect(bar).not.toHaveAttribute('data-shown', /.*/)
    await page.locator('#contacts').scrollIntoViewIfNeeded()
    await expect(bar).not.toHaveAttribute('data-shown', /.*/)
  })

  test('в контактах кнопки Telegram, MAX и ВКонтакте; без ссылок в концепте — форма с выбранным мессенджером', async ({ page }) => {
    await page.goto('/')
    const contacts = page.locator('#contacts')
    const modal = page.getByTestId('lead-modal')
    for (const [button, heading] of [['MAX', 'Написать в MAX'], ['ВКонтакте', 'Написать во ВКонтакте']] as const) {
      await contacts.getByRole('button', { name: button }).click()
      await expect(modal.getByRole('heading', { name: heading })).toBeVisible()
      await expect(modal.getByRole('radio', { name: button })).toBeChecked()
      await page.keyboard.press('Escape')
      await expect(modal).toBeHidden()
    }
  })
})

// Шрифты — подмножества (scripts/subset-fonts.py). Символ вне набора браузер покажет запасным шрифтом.
test('весь видимый текст есть в шрифтах сайта', async ({ page }) => {
  const py = readFileSync('scripts/subset-fonts.py', 'utf8')
  const ranges = [...(py.match(/UNICODES = \(([\s\S]*?)\)/)?.[1] ?? '').matchAll(/U\+([0-9A-F]+)(?:-([0-9A-F]+))?/g)].map((m) => [
    parseInt(m[1]!, 16),
    parseInt(m[2] ?? m[1]!, 16),
  ])
  expect(ranges.length).toBeGreaterThan(10)
  const missing = new Set<string>()
  for (const url of ['/', '/privacy', '/soglasie', '/cookies']) {
    await page.goto(url)
    for (const ch of await page.evaluate(() => document.body.innerText)) {
      const code = ch.codePointAt(0)!
      if (code < 0x20 || ranges.some(([a, b]) => code >= a! && code <= b!)) continue
      missing.add(`${ch} U+${code.toString(16).toUpperCase().padStart(4, '0')} на ${url}`)
    }
  }
  expect([...missing]).toEqual([])
})
