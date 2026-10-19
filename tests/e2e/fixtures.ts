import { test as base, expect, type Locator, type Page } from '@playwright/test'
import { E2E_MIN_FILL_MS } from '../../playwright.config'

/** Ключ сессии, после которого лоадер не показывается (src/lib/theme.ts). */
export const LOADER_KEY = 'arcline-loaded'
/** Выбор по cookie (src/lib/consent.ts): с ним баннер не показывается. */
export const CONSENT_KEY = 'arcline-cookies'

/**
 * Обычные сценарии идут без лоадера и без баннера cookie: лоадер показывается только при первом
 * визите в сессии (design.spec.ts), баннер — пока человек не сделал выбор (consent.spec.ts).
 */
export const test = base.extend({
  page: async ({ page }, provide, testInfo) => {
    // Свой IP у каждого теста: лимит частоты (5 заявок за 10 минут, src/lib/rate-limit.ts) не должен
    // зависеть от порядка тестов. Перед next start нет прокси, поэтому X-Forwarded-For — единственный источник IP.
    const n = [...testInfo.testId].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': `10.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}` })
    await page.addInitScript(
      ({ loader, consent }) => {
        sessionStorage.setItem(loader, '1')
        if (localStorage.getItem(consent) === null) localStorage.setItem(consent, 'necessary')
      },
      { loader: LOADER_KEY, consent: CONSENT_KEY },
    )
    // До гидратации кнопки не работают: под нагрузкой (параллельные прогоны) щелчок сразу после load
    // мог прийти раньше React. На странице лендинга ждём отметку из LandingProvider.
    const goto = page.goto.bind(page)
    page.goto = async (url, options) => {
      const response = await goto(url, options)
      if (!options?.waitUntil || options.waitUntil === 'load') {
        await page.waitForFunction(() => !document.querySelector('[data-testid=hero]') || document.documentElement.hasAttribute('data-hydrated'), null, { timeout: 15_000 })
      }
      return response
    }
    await provide(page)
  },
})

export { expect }

/**
 * Элемент действительно виден человеку: в окне, не скрыт и непрозрачен вместе со всеми предками.
 * toBeVisible в Playwright считает видимым и элемент с opacity: 0 — так пропустили невидимый результат квиза.
 */
export async function expectSeen(locator: Locator) {
  await expect(locator).toBeVisible()
  await locator.scrollIntoViewIfNeeded()
  await expect
    .poll(
      () =>
        locator.evaluate((el) => {
          let opacity = 1
          for (let n: Element | null = el; n; n = n.parentElement) {
            const cs = getComputedStyle(n)
            if (cs.visibility === 'hidden' || cs.display === 'none') return 0
            opacity *= Number(cs.opacity)
          }
          return opacity
        }),
      { message: 'элемент на экране прозрачный: человек его не видит', timeout: 4000 },
    )
    .toBeGreaterThan(0.95)
}


/**
 * Щелчок по элементу в середине экрана. У нижнего края на телефоне выезжает капсула «Рассчитать стоимость»
 * (MobileActionBar): если Playwright прокрутил кнопку к краю, щелчок мог попасть в капсулу, пока она выезжает.
 */
export async function clickCentered(locator: Locator) {
  await locator.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await locator.click()
}

/** Ждём минимальное время заполнения формы (на тестовом сервере — E2E_MIN_FILL_MS): иначе сервер ответит «слишком быстро». */
export const waitFillTime = (page: Page) => page.waitForTimeout(E2E_MIN_FILL_MS + 150)
