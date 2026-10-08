import { test as base, expect } from '@playwright/test'

/** Ключ сессии, после которого лоадер не показывается (src/lib/theme.ts). */
export const LOADER_KEY = 'arcline-loaded'

/**
 * Обычные сценарии идут без лоадера: он показывается только при первом визите в сессии
 * и проверяется отдельно в design.spec.ts.
 */
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript((key) => sessionStorage.setItem(key, '1'), LOADER_KEY)
    await provide(page)
  },
})

export { expect }
