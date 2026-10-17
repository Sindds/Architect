import type { Locator, Page } from '@playwright/test'
import { expect, expectSeen, test } from './fixtures'
import { PRICING } from '@/content/pricing'
import { formatRub } from '@/lib/format'
import { breakdown } from '@/lib/pricing'

// Сквозные сценарии форм, квиза и калькулятора «глазами человека»: каждый шаг проверяется через expectSeen —
// элемент не только есть в разметке, но и непрозрачен. Каждая отправка заявки — в своём тесте:
// у теста свой IP (fixtures.ts), а сервер принимает не больше 5 заявок за 10 минут с одного IP.

/** Заполнить и отправить форму заявки внутри root; ждём серверную метку времени (не быстрее 3 с). */
async function submitLead(page: Page, root: Locator, submit: RegExp | string) {
  await expectSeen(root.getByLabel('Имя'))
  await root.getByLabel('Имя').fill('Анна')
  await root.getByLabel('Телефон').fill('9161234567')
  await root.getByRole('checkbox').check()
  await page.waitForTimeout(3100)
  await root.getByRole('button', { name: submit }).click()
  const success = root.getByTestId('lead-success')
  await expectSeen(success)
  await expect(success).toContainText(/Заявка №\d+ принята/)
}

async function openQuiz(page: Page) {
  await page.goto('/')
  await page.getByRole('link', { name: 'Узнать цену за 2 минуты' }).click()
  const quiz = page.getByTestId('quiz')
  await expectSeen(quiz.getByRole('heading', { name: 'Какой площади дом?' }))
  return quiz
}

async function answerQuiz(page: Page, answers: string[]) {
  const quiz = page.getByTestId('quiz')
  for (const answer of answers) {
    await expectSeen(quiz.getByText(answer, { exact: true }))
    await quiz.getByText(answer, { exact: true }).click()
    await quiz.getByRole('button', { name: /Далее|Показать вилку/ }).click()
  }
}

test.describe('Квиз', () => {
  test('4 ответа → вилка видна на экране → заявка из квиза отправляется', async ({ page }) => {
    await openQuiz(page)
    await answerQuiz(page, ['250–350 м²', 'Скандинавский', 'В течение года', 'Участок есть'])

    const result = page.getByTestId('quiz-result')
    await expectSeen(result.getByRole('heading', { name: /Ваша вилка: от .+ до .+/ }))
    await expectSeen(result.getByText('Скандинавский'))
    await expectSeen(result.getByRole('button', { name: 'Получить расчёт' }))

    await result.getByRole('button', { name: 'Получить расчёт' }).click()
    const modal = page.getByTestId('lead-modal')
    await expectSeen(modal.getByRole('heading', { name: 'Получить расчёт' }))
    await submitLead(page, modal, /Получить расчёт|Отправить/)
  })

  test('«Изменить ответы» и переключение вкладок: квиз и калькулятор всегда видны', async ({ page }) => {
    const quiz = await openQuiz(page)
    await answerQuiz(page, ['До 250 м²', 'Пока не знаю', 'Пока изучаю варианты', 'Участка пока нет'])
    await expectSeen(page.getByTestId('quiz-result').getByRole('heading', { name: /Ваша вилка/ }))

    await page.getByRole('button', { name: 'Изменить ответы' }).click()
    await expectSeen(quiz.getByRole('heading', { name: 'Какой площади дом?' }))

    const tabs = page.locator('#calculator').getByRole('tablist')
    for (let i = 0; i < 2; i++) {
      await tabs.getByRole('tab', { name: 'Калькулятор' }).click()
      await expectSeen(page.getByTestId('calc-total'))
      await expectSeen(page.getByTestId('calc-area-input'))
      await tabs.getByRole('tab', { name: 'Квиз за 2 минуты' }).click()
      await expectSeen(quiz.getByRole('radio').first())
    }
  })
})

test.describe('Калькулятор', () => {
  test('площадь, стиль, пакет и опции меняют итог; итог совпадает с pricing.ts', async ({ page }) => {
    await page.goto('/')
    const calc = page.getByTestId('calculator')
    await calc.scrollIntoViewIfNeeded()
    const total = page.getByTestId('calc-total')
    await expectSeen(total)

    const area = page.getByTestId('calc-area-input')
    await area.fill('420')
    await area.press('Enter')
    await calc.getByRole('radio', { name: new RegExp(PRICING.styles.monolith.title) }).check()
    await calc.getByRole('radio', { name: new RegExp(`^${PRICING.tiers.turnkey.title}`) }).check()
    await calc.getByRole('checkbox', { name: new RegExp(PRICING.addons.knx.title) }).uncheck()

    const expected = breakdown({ area: 420, terrace: 50, style: 'monolith', tier: 'turnkey', addons: [] })
    await expect(total).toHaveText(formatRub(expected.total))
    await expectSeen(total)
  })
})

test.describe('Каждая кнопка заявки открывает видимую форму с заголовком кнопки', () => {
  const cases: { name: string; open: (page: Page) => Promise<void>; heading: string | RegExp }[] = [
    { name: 'первый экран: экскурсия', open: (p) => p.getByRole('button', { name: 'Покажем построенный дом' }).click(), heading: 'Экскурсия на объект' },
    { name: 'шапка: мессенджер', open: (p) => p.getByRole('button', { name: 'Написать в мессенджер' }).first().click(), heading: 'Написать в мессенджер' },
    {
      name: 'пакеты: смета в PDF',
      open: async (p) => {
        const btn = p.locator('#pricing').getByRole('button', { name: 'Получить смету в PDF' }).nth(1)
        await btn.scrollIntoViewIfNeeded()
        await btn.click()
      },
      heading: 'Получить смету в PDF',
    },
    {
      name: 'калькулятор: смета в PDF',
      open: async (p) => {
        const btn = p.locator('#calculator').getByRole('button', { name: 'Получить смету в PDF' }).first()
        await btn.scrollIntoViewIfNeeded()
        await btn.click()
      },
      heading: 'Получить смету в PDF',
    },
    { name: 'команда: вопрос архитектору', open: (p) => p.getByRole('button', { name: 'Задать вопрос архитектору' }).click(), heading: 'Задать вопрос архитектору' },
    { name: 'контакты: MAX', open: (p) => p.locator('#contacts').getByRole('button', { name: 'MAX' }).click(), heading: 'Написать в MAX' },
    {
      name: 'окно проекта: смета в PDF',
      open: async (p) => {
        await p.getByTestId('projects-grid').getByRole('button', { name: 'VISTA' }).click()
        await expectSeen(p.getByTestId('project-modal'))
        await p.getByTestId('project-modal').getByRole('button', { name: 'Получить смету в PDF' }).click()
      },
      heading: 'Получить смету в PDF',
    },
  ]

  for (const c of cases) {
    test(c.name, async ({ page }) => {
      await page.goto('/')
      await c.open(page)
      const modal = page.getByTestId('lead-modal')
      await expectSeen(modal.getByRole('heading', { name: c.heading }))
      await expectSeen(modal.getByLabel('Имя'))
      await expectSeen(modal.getByLabel('Телефон'))
      await page.keyboard.press('Escape')
      await expect(modal).toBeHidden()
    })
  }
})

test.describe('Отправка заявок', () => {
  test('финальная форма «Перезвоните мне»', async ({ page }) => {
    await page.goto('/')
    await submitLead(page, page.locator('#contacts'), 'Перезвоните мне')
  })

  test('окно проекта: смета в PDF → заявка и ссылка на PDF', async ({ page }) => {
    await page.goto('/?project=vista')
    await expectSeen(page.getByTestId('project-modal'))
    await page.getByTestId('project-modal').getByRole('button', { name: 'Получить смету в PDF' }).click()
    const modal = page.getByTestId('lead-modal')
    await submitLead(page, modal, /Отправить|Получить/)
    await expectSeen(modal.getByTestId('smeta-download'))
  })

  test('окно сданного дома: запись на экскурсию', async ({ page }) => {
    await page.goto('/')
    const button = page.getByTestId('delivered').getByRole('button', { name: /Дом у воды/ })
    await button.scrollIntoViewIfNeeded()
    await button.click()
    const modal = page.getByTestId('case-modal')
    await expectSeen(modal)
    await submitLead(page, modal, 'Записаться на экскурсию')
  })
})

test('весь контент становится видимым при прокрутке страницы сверху вниз', async ({ page }) => {
  test.setTimeout(120_000)
  await page.goto('/')
  const hidden = await page.evaluate(async () => {
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
    const found = new Set<string>()
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.round(innerHeight * 0.7)) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await wait(1100) // переход появления 650 мс + шаг в группе
      for (const el of document.querySelectorAll('.reveal')) {
        const r = el.getBoundingClientRect()
        const inView = r.bottom > innerHeight * 0.15 && r.top < innerHeight * 0.85 && r.height > 0
        if (inView && Number(getComputedStyle(el).opacity) < 0.95) found.add(`${el.tagName}.${String(el.className).slice(0, 40)} «${(el.textContent ?? '').trim().slice(0, 40)}»`)
      }
    }
    return [...found]
  })
  expect(hidden).toEqual([])
})

// iOS 26 рисует курсор в поле фиксированного окна ниже поля, если страница под окном прокручена далеко
// (WebKit 300690 → 300952). Пока окно открыто, страница зафиксирована на месте: её прокрутка — 0, вид не меняется.
test('окно над прокрученной страницей: страница под окном зафиксирована, после закрытия прокрутка та же', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Узнать цену за 2 минуты' }).click()
  await answerQuiz(page, ['250–350 м²', 'Скандинавский', 'В течение года', 'Участок есть'])
  const result = page.getByTestId('quiz-result')
  const button = result.getByRole('button', { name: 'Получить расчёт' })
  await expectSeen(button)
  await page.waitForTimeout(800) // плавная прокрутка закончилась
  const before = await page.evaluate(() => ({ y: Math.round(scrollY), top: Math.round(document.querySelector('[data-testid=quiz-result]')!.getBoundingClientRect().top) }))
  expect(before.y).toBeGreaterThan(2000)

  await button.click()
  const modal = page.getByTestId('lead-modal')
  await expectSeen(modal.getByLabel('Имя'))
  const open = await page.evaluate(() => ({ y: Math.round(scrollY), top: Math.round(document.querySelector('[data-testid=quiz-result]')!.getBoundingClientRect().top) }))
  expect(open.y).toBe(0)
  expect(open.top).toBe(before.top)

  // Полный номер: лишняя цифра в начале ничего не меняет.
  const phone = modal.getByLabel('Телефон')
  await phone.pressSequentially('9161234567')
  await phone.press('Home')
  for (let i = 0; i < 4; i++) await phone.press('ArrowRight')
  await phone.press('5')
  await expect(phone).toHaveValue('+7 (916) 123-45-67')

  await page.keyboard.press('Escape')
  await expect(modal).toBeHidden()
  await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(before.y)
})

test('номер +7 с любым кодом принимается: заявка с +7 (654) … отправляется', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Покажем построенный дом' }).click()
  const modal = page.getByTestId('lead-modal')
  const phone = modal.getByLabel('Телефон')
  await modal.getByLabel('Имя').fill('Анна')
  await phone.pressSequentially('6544852555')
  await expect(phone).toHaveValue('+7 (654) 485-25-55')
  await expect(phone).not.toHaveAttribute('aria-invalid', 'true')
  await modal.getByRole('checkbox').check()
  await page.waitForTimeout(3100)
  await modal.getByRole('button', { name: 'Записаться на экскурсию' }).click()
  await expectSeen(modal.getByTestId('lead-success'))
})
