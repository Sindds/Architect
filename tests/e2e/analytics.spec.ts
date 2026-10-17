import type { Page } from '@playwright/test'
import { clickCentered, expect, test } from './fixtures'

// PLAN P7.2: цели Метрики проверяем заглушкой window.ym — она записывает вызовы reachGoal.
const goals = (page: Page) =>
  page.evaluate(() => ((window as unknown as { __ym?: unknown[][] }).__ym ?? []).filter((c) => c[1] === 'reachGoal').map((c) => ({ goal: c[2], params: c[3] })))

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const calls: unknown[][] = []
    ;(window as unknown as { __ym: unknown[][] }).__ym = calls
    ;(window as unknown as { ym: (...a: unknown[]) => void }).ym = (...a: unknown[]) => void calls.push(a)
  })
})

const names = async (page: Page) => (await goals(page)).map((g) => g.goal)

test('калькулятор: calc_interact один раз; квиз: quiz_start и quiz_complete', async ({ page }) => {
  await page.goto('/')
  const calc = page.getByTestId('calculator')
  await calc.getByRole('radio').first().check({ force: true })
  await calc.getByRole('radio').nth(1).check({ force: true })
  await expect.poll(() => names(page)).toContain('calc_interact')
  expect((await names(page)).filter((g) => g === 'calc_interact')).toHaveLength(1)

  await page.getByRole('link', { name: 'Узнать цену за 2 минуты' }).click()
  const quiz = page.getByTestId('quiz')
  for (const answer of ['250–350 м²', 'Скандинавский', 'В течение года', 'Участок есть']) {
    await quiz.getByText(answer, { exact: true }).click()
    await quiz.getByRole('button', { name: /Далее|Показать вилку/ }).click()
  }
  await expect.poll(() => names(page)).toEqual(expect.arrayContaining(['quiz_start', 'quiz_complete']))
})

test('образец PDF и телефон', async ({ page }) => {
  await page.goto('/')
  await page.locator('a[href$=".pdf"]:visible').first().click({ modifiers: ['ControlOrMeta'] })
  await expect.poll(() => goals(page)).toEqual(expect.arrayContaining([{ goal: 'pdf_download', params: { doc: 'dogovor-obrazec.pdf' } }]))
  await page.locator('a[href^="tel:"]:visible').first().click()
  await expect.poll(() => names(page)).toContain('phone_click')
})

test('окно проекта и окно сданного дома', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('projects-grid').getByRole('button', { name: 'VISTA' }).click()
  await expect(page.getByTestId('project-modal')).toBeVisible()
  await expect.poll(() => goals(page)).toEqual(expect.arrayContaining([{ goal: 'project_open', params: { slug: 'vista' } }]))
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('project-modal')).toBeHidden()
  const house = page.getByTestId('delivered').getByRole('button', { name: /Дом у воды/ })
  await house.scrollIntoViewIfNeeded()
  await house.click()
  await expect.poll(() => goals(page)).toEqual(expect.arrayContaining([{ goal: 'case_open', params: { slug: 'dom-u-vody' } }]))
})

test('lead_submit — только когда сервер принял заявку, с источником и вариантом; при ошибке — нет', async ({ page }) => {
  await page.route('**/*', (route) =>
    route.request().method() === 'POST' && (route.request().postData() ?? '').includes('consent') ? route.abort('failed') : route.fallback(),
  )
  await page.goto('/')
  const modal = page.getByTestId('lead-modal')
  const fill = async () => {
    await clickCentered(page.getByRole('button', { name: 'Задать вопрос архитектору' }))
    await modal.getByLabel('Имя').fill('Анна')
    await modal.getByLabel('Телефон').fill('9161234567')
    await modal.getByRole('checkbox').check()
    await page.waitForTimeout(3100)
    await modal.getByRole('button', { name: 'Отправить заявку' }).click()
  }
  await fill()
  await expect(modal.getByRole('alert')).toContainText('Не удалось отправить')
  expect(await names(page)).not.toContain('lead_submit')

  await page.unroute('**/*')
  await modal.getByRole('button', { name: 'Отправить заявку' }).click()
  await expect(modal.getByTestId('lead-success')).toBeVisible()
  await expect.poll(() => goals(page)).toEqual(expect.arrayContaining([{ goal: 'lead_submit', params: { source: 'architect', variant: 'default' } }]))
})

test('мессенджер: messenger_click', async ({ page }) => {
  await page.goto('/')
  await page.locator('#contacts').getByRole('button', { name: 'Telegram' }).click()
  await expect.poll(() => names(page)).toContain('messenger_click')
})

test('«Только необходимые»: нет запросов к mc.yandex.ru', async ({ page }) => {
  const metrika: string[] = []
  page.on('request', (r) => r.url().includes('mc.yandex') && metrika.push(r.url()))
  await page.goto('/')
  await page.locator('#contacts').scrollIntoViewIfNeeded()
  expect(metrika).toEqual([])
})
