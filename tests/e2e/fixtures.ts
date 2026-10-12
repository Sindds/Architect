import { test as base, expect } from '@playwright/test'

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
    await provide(page)
  },
})

export { expect }
