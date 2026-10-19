import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { Locator, Page } from '@playwright/test'
import { E2E_LEADS_DIR } from '../../playwright.config'
import { clickCentered, expect, expectSeen, test } from './fixtures'
import { COPY } from '@/content/texts'
import { PRICING } from '@/content/pricing'
import { SITE } from '@/content/site'
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
  return Number((await success.innerText()).match(/№(\d+)/)?.[1])
}

type SavedLead = { id: number; name: string; phone: string; source: string; context?: string; estimate?: string; quiz?: string }

/** Заявка с этим номером в хранилище тестового сервера (файл test-results/leads): дошла, а не только показала «принята». */
function savedLead(id: number) {
  const file = path.join(E2E_LEADS_DIR, 'leads.ndjson')
  return expect.poll(() =>
    (existsSync(file) ? readFileSync(file, 'utf8') : '')
      .split('\n')
      .filter(Boolean)
      .map((l) => JSON.parse(l) as SavedLead)
      .find((l) => l.id === id),
  )
}

const LOWER_PRONOUN = /(?<![А-Яа-яЁё])(вы|вас|вам|вами|ваш|ваша|ваше|ваши|вашего|вашей|вашему|вашим|вашими|ваших|вашу|вашем)(?![А-Яа-яЁё])/

async function openQuiz(page: Page) {
  await page.goto('/')
  await page.getByRole('link', { name: 'Узнать цену за 2 минуты' }).click()
  const quiz = page.getByTestId('quiz')
  await expectSeen(quiz.getByRole('heading', { name: 'Какую площадь дома Вы рассматриваете?' }))
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
    await expectSeen(result.getByRole('heading', { name: /Предварительная стоимость дома — от .+ до .+ млн/ }))
    await expectSeen(result.getByText('Скандинавский'))
    await expectSeen(result.getByRole('button', { name: 'Получить расчёт' }))

    // textContent, а не innerText: innerText отдаёт текст с text-transform заголовка (заглавными).
    const fork = (await result.getByRole('heading', { name: /Предварительная стоимость дома/ }).textContent())?.match(/от\s(.+?)\s*млн/)?.[1]
    await result.getByRole('button', { name: 'Получить расчёт' }).click()
    const modal = page.getByTestId('lead-modal')
    await expectSeen(modal.getByRole('heading', { name: 'Получить расчёт' }))
    expect(fork).toBeTruthy()
    const id = await submitLead(page, modal, /Получить расчёт|Отправить/)
    // Вместе с именем и телефоном уходят ответы квиза и вилка цены, которую человек видел на экране.
    await savedLead(id).toMatchObject({
      name: 'Анна',
      phone: '+79161234567',
      source: 'quiz',
      quiz: expect.stringMatching(/250–350 м².*Скандинавский.*В течение года.*Участок есть/),
      context: expect.stringContaining(`Вилка от ${fork}`),
    })
  })

  test('«Изменить ответы» и переключение вкладок: квиз и калькулятор всегда видны', async ({ page }) => {
    const quiz = await openQuiz(page)
    await answerQuiz(page, ['До 250 м²', 'Пока не знаю', 'Пока изучаю варианты', 'Участка пока нет'])
    await expectSeen(page.getByTestId('quiz-result').getByRole('heading', { name: /Предварительная стоимость дома/ }))

    await page.getByRole('button', { name: 'Изменить ответы' }).click()
    await expectSeen(quiz.getByRole('heading', { name: 'Какую площадь дома Вы рассматриваете?' }))

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

  test('заявка из калькулятора уходит с параметрами и итогом расчёта, после отправки — смета в PDF', async ({ page }) => {
    await page.goto('/')
    const calc = page.getByTestId('calculator')
    await calc.scrollIntoViewIfNeeded()
    const area = page.getByTestId('calc-area-input')
    await area.fill('420')
    await area.press('Enter')
    await calc.getByRole('radio', { name: new RegExp(PRICING.styles.monolith.title) }).check()
    await calc.getByRole('radio', { name: new RegExp(`^${PRICING.tiers.turnkey.title}`) }).check()
    await calc.getByRole('checkbox', { name: new RegExp(PRICING.addons.knx.title) }).uncheck()
    const expected = breakdown({ area: 420, terrace: 50, style: 'monolith', tier: 'turnkey', addons: [] })
    await expect(page.getByTestId('calc-total')).toHaveText(formatRub(expected.total))

    await page.locator('#calculator').getByRole('button', { name: 'Получить смету в PDF' }).first().click()
    const modal = page.getByTestId('lead-modal')
    const id = await submitLead(page, modal, /Отправить|Получить/)
    await savedLead(id).toMatchObject({
      name: 'Анна',
      source: 'calculator',
      estimate: expect.stringContaining(`${PRICING.styles.monolith.title}, 420 м², терраса 50 м²; ${PRICING.tiers.turnkey.title}; Итого ${formatRub(expected.total)}`),
    })
    await expectSeen(modal.getByTestId('smeta-download'))
  })
})

test.describe('Каждая кнопка заявки открывает видимую форму с заголовком кнопки', () => {
  const cases: { name: string; open: (page: Page) => Promise<void>; heading: string | RegExp }[] = [
    { name: 'шапка: мессенджер', open: (p) => p.getByRole('button', { name: 'Написать в мессенджер' }).first().click(), heading: COPY.messengerTitle },
    {
      name: 'пакеты: смета в PDF',
      open: async (p) => {
        const btn = p.locator('#pricing').getByRole('button', { name: 'Получить смету в PDF' }).nth(1)
        await btn.scrollIntoViewIfNeeded()
        await btn.click()
      },
      heading: COPY.smetaTitle,
    },
    {
      name: 'калькулятор: смета в PDF',
      open: async (p) => {
        const btn = p.locator('#calculator').getByRole('button', { name: 'Получить смету в PDF' }).first()
        await btn.scrollIntoViewIfNeeded()
        await btn.click()
      },
      heading: COPY.smetaTitle,
    },
    { name: 'команда: вопрос архитектору', open: (p) => clickCentered(p.getByRole('button', { name: 'Задать вопрос архитектору' })), heading: 'Обсудите свой будущий дом с архитектором' },
    {
      name: 'окно проекта: смета в PDF',
      open: async (p) => {
        await p.getByTestId('projects-grid').getByRole('button', { name: 'VISTA' }).click()
        await expectSeen(p.getByTestId('project-modal'))
        await p.getByTestId('project-modal').getByRole('button', { name: 'Получить смету в PDF' }).click()
      },
      heading: COPY.smetaTitle,
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
      // «Вы», «Ваш» — с заглавной и во вступлении окна (правка заказчика 17.10.2026).
      expect(await modal.innerText()).not.toMatch(LOWER_PRONOUN)
      await page.keyboard.press('Escape')
      await expect(modal).toBeHidden()
    })
  }
})

test.describe('Отправка заявок', () => {
  test('финальная форма «Перезвоните мне»: заявка сохраняется с именем и телефоном', async ({ page }) => {
    await page.goto('/')
    const contacts = page.locator('#contacts')
    const id = await submitLead(page, contacts, 'Перезвоните мне')
    await savedLead(id).toMatchObject({ id, name: 'Анна', phone: '+79161234567', source: 'final_cta' })
  })

  test('окно проекта: смета в PDF → заявка и ссылка на PDF', async ({ page }) => {
    await page.goto('/?project=vista')
    await expectSeen(page.getByTestId('project-modal'))
    await page.getByTestId('project-modal').getByRole('button', { name: 'Получить смету в PDF' }).click()
    const modal = page.getByTestId('lead-modal')
    await submitLead(page, modal, /Отправить|Получить/)
    await expectSeen(modal.getByTestId('smeta-download'))
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
  await clickCentered(page.getByRole('button', { name: 'Задать вопрос архитектору' }))
  const modal = page.getByTestId('lead-modal')
  const phone = modal.getByLabel('Телефон')
  await modal.getByLabel('Имя').fill('Анна')
  await phone.pressSequentially('6544852555')
  await expect(phone).toHaveValue('+7 (654) 485-25-55')
  await expect(phone).not.toHaveAttribute('aria-invalid', 'true')
  await modal.getByRole('checkbox').check()
  await page.waitForTimeout(3100)
  await modal.getByRole('button', { name: 'Отправить заявку' }).click()
  await expectSeen(modal.getByTestId('lead-success'))
})

test('квиз: кнопка «Получить расчёт» под карточкой результата, одной колонкой и на компьютере', async ({ page }) => {
  await openQuiz(page)
  await answerQuiz(page, ['250–350 м²', 'Скандинавский', 'В течение года', 'Участок есть'])
  const result = page.getByTestId('quiz-result')
  const card = result.getByRole('heading', { level: 3 }).locator('xpath=ancestor::div[contains(@class,"card")][1]')
  const button = result.getByRole('button', { name: 'Получить расчёт' })
  await expectSeen(button)
  const [c, b] = [await card.boundingBox(), await button.boundingBox()]
  expect(b!.y).toBeGreaterThanOrEqual(c!.y + c!.height - 1)
  expect(b!.x).toBeLessThan(c!.x + c!.width / 2)
  await expectSeen(result.getByText('Свяжемся с Вами, уточним параметры участка и подготовим смету для Вашего проекта.'))
})

// Карточки проектов: окно открывает щелчок по фото, по стрелке и по описанию; над фото курсор-указатель.
test('карточка проекта: щелчок по фото, по стрелке и по описанию открывает окно', async ({ page }) => {
  await page.goto('/')
  const card = page.getByTestId('projects-grid').getByRole('listitem').first()
  await card.scrollIntoViewIfNeeded()
  const photo = card.getByTestId('project-card')
  await expectSeen(photo)
  const modal = page.getByTestId('project-modal')
  const targets = [
    { name: 'фото', at: (b: { x: number; y: number; width: number; height: number }) => [b.x + b.width / 2, b.y + b.height * 0.35] as const },
    { name: 'стрелка', at: (b: { x: number; y: number; width: number; height: number }) => [b.x + b.width - 40, b.y + b.height - 40] as const },
  ]
  for (const t of targets) {
    // Координаты — каждый раз заново: после закрытия окна страница возвращается на место, но могла сдвинуться.
    await photo.scrollIntoViewIfNeeded()
    const [x, y] = t.at((await photo.boundingBox())!)
    const cursor = await page.evaluate(([px, py]) => getComputedStyle(document.elementFromPoint(px!, py!)!).cursor, [x, y])
    expect(cursor, t.name).toBe('pointer')
    await page.mouse.click(x, y)
    await expectSeen(modal)
    await page.keyboard.press('Escape')
    await expect(modal).toBeHidden()
  }
  await card.locator('p').first().click()
  await expectSeen(modal)
})

test('нет плашек «Визуализация» и пометок «демо» в тексте страницы; «Вы» с заглавной', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.documentElement.setAttribute('data-full-layout', ''))
  // Правка заказчика 18.10.2026: никаких упоминаний демо и концепта, в том числе в футере.
  const text = await page.locator('body').innerText()
  expect(text).not.toMatch(/Визуализация|Схема \(иллюстрация\)/i)
  expect(text).not.toMatch(/демо-|демонстрац|концепт|портфолио|вымышлен|сгенерирован|условн(ый|ые)/i)
  expect(text).not.toMatch(LOWER_PRONOUN)
  // Галерея в окне проекта тоже без подписи «Визуализация».
  await page.goto('/?project=vista')
  await expectSeen(page.getByTestId('project-modal'))
  expect(await page.getByTestId('project-modal').innerText()).not.toMatch(/Визуализация|иллюстрация|Экспликация/i)
  // Юридические страницы тоже без пометок.
  for (const url of ['/privacy', '/soglasie', '/cookies']) {
    await page.goto(url)
    expect(await page.locator('body').innerText(), url).not.toMatch(/концепт|портфолио|вымышлен|шаблон/i)
  }
})

// Правка заказчика 18.10.2026: увеличенный чертёж закрывался вместе с окном дома.
// Причина — React передаёт событие close вложенного <dialog> окнам-предкам (ui/Modal.tsx).
test('окно проекта: увеличенный чертёж закрывается крестиком и Esc, окно дома остаётся открытым', async ({ page }) => {
  await page.goto('/?project=nordic')
  const modal = page.getByTestId('project-modal')
  await expectSeen(modal)
  await expect(modal.getByRole('heading', { name: 'Распределение площадей' })).toBeVisible()
  await modal.getByRole('button', { name: /^Показать: Архитектурные чертежи/ }).click()
  const zoomButton = modal.getByRole('button', { name: /^Увеличить: Архитектурные чертежи одноэтажного дома NORDIC/ })
  for (const close of ['крестик', 'Esc'] as const) {
    await zoomButton.click()
    const zoom = page.getByRole('dialog', { name: 'NORDIC', exact: true })
    await expectSeen(zoom)
    // Под увеличенной картинкой нет подписи «Схема (иллюстрация) · …», заголовок — только название проекта.
    await expect(zoom).not.toContainText(/Схема|иллюстрация/)
    if (close === 'крестик') await zoom.getByRole('button', { name: 'Закрыть окно' }).click()
    else await page.keyboard.press('Escape')
    await expect(zoom).toBeHidden()
    await expect(modal, close).toBeVisible()
    await expect(page).toHaveURL(/project=nordic/)
  }
})

test('кнопка «Наверх»: появляется ниже первого экрана, ведёт наверх и ставит фокус на заголовок', async ({ page }) => {
  await page.goto('/')
  const up = page.locator('[data-testid=scroll-top]')
  await expect(up).not.toHaveAttribute('data-shown', /.*/)
  await page.locator('#pricing').scrollIntoViewIfNeeded()
  await expect(up).toHaveAttribute('data-shown', '')
  const box = (await up.boundingBox())!
  // Высота как у капсулы «Рассчитать стоимость» (46 px с рамкой), цель нажатия не меньше 44 px.
  expect(Math.round(box.height)).toBe(46)
  await up.click()
  await expect.poll(() => page.evaluate(() => Math.round(scrollY)), { timeout: 5000 }).toBe(0)
  await expect(page.locator('#hero-title')).toBeFocused()
  await expect(up).not.toHaveAttribute('data-shown', /.*/)
})

test('первый экран: без метки над заголовком и блоков-доказательств, под фото — адрес', async ({ page }) => {
  await page.goto('/')
  const hero = page.getByTestId('hero')
  await expect(hero).not.toContainText('Для тех, кто переезжает')
  await expect(hero.getByRole('list')).toHaveCount(0)
  await expect(hero).not.toContainText(/сданных дома|Образец договора|Покажем построенный дом/)
  await expect(hero.getByText(SITE.address, { exact: true })).toBeVisible()
})

test('карта в футере показывает адрес офиса по координатам из SITE.geo', async ({ page }) => {
  await page.goto('/')
  const map = page.getByTestId('office-map')
  await map.scrollIntoViewIfNeeded()
  await expect(page.getByTestId('office-map-preview')).toHaveAttribute('alt', new RegExp(SITE.address))
  await map.getByRole('button', { name: 'Интерактивная карта' }).click()
  const src = await map.locator('iframe').getAttribute('src')
  expect(src).toContain(`pt=${SITE.geo.lon}%2C${SITE.geo.lat}`)
  expect(SITE.geo).toMatchObject({ lat: 55.799917, lon: 37.279968 })
})

test('меню: пункт «Этапы» ведёт к этапам строительства', async ({ page }) => {
  await page.goto('/')
  const wide = (page.viewportSize()?.width ?? 0) >= 1280
  if (!wide) await page.getByRole('button', { name: 'Открыть меню' }).click()
  const nav = page.getByRole('navigation', { name: wide ? 'Разделы страницы' : 'Разделы страницы (мобильное меню)', exact: true })
  await expect(nav.getByRole('link', { name: 'Этапы' })).toHaveAttribute('href', '#process')
  await expect(nav.getByRole('link', { name: 'Как строим' })).toHaveCount(0)
})

// closeOverlay вызывает history.back(), а он асинхронный: запоздавший popstate закрывал окно, открытое сразу после.
test('окно проекта: закрыть и сразу открыть другое — новое окно остаётся открытым', async ({ page }) => {
  await page.goto('/')
  const grid = page.getByTestId('projects-grid')
  const modal = page.getByTestId('project-modal')
  await grid.getByRole('button', { name: 'VISTA' }).click()
  await expectSeen(modal)
  // Закрыть и открыть в одной задаче: history.back() ещё не дошёл, когда открывается новое окно.
  await page.evaluate(() => {
    document.querySelector<HTMLButtonElement>('[data-testid=project-modal] button[aria-label="Закрыть окно"]')!.click()
    const nordic = [...document.querySelectorAll<HTMLButtonElement>('[data-testid=projects-grid] h3 button')].find((b) => b.textContent === 'NORDIC')!
    nordic.click()
  })
  await expect(modal.getByRole('heading', { level: 2 })).toContainText('NORDIC')
  await page.waitForTimeout(600)
  await expect(modal).toBeVisible()
  await expect(page).toHaveURL(/project=nordic/)
  await page.goBack()
  await expect(modal).toBeHidden()
  await expect(page).not.toHaveURL(/project=/)
})
