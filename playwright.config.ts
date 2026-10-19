import { existsSync } from 'node:fs'
import path from 'node:path'
import { defineConfig, devices } from '@playwright/test'

const PORT = 3100
/** Папка, куда тестовый сервер пишет заявки: e2e проверяет, что заявка дошла с именем и телефоном. */
export const E2E_LEADS_DIR = path.join(process.cwd(), 'test-results', 'leads')
const PRESET_CHROMIUM = '/opt/pw-browsers/chromium'

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  timeout: 45_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'ru-RU',
    // В облачном контейнере Chromium предустановлен в /opt/pw-browsers; иначе — CHROMIUM_PATH или браузер Playwright.
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || (existsSync(PRESET_CHROMIUM) ? PRESET_CHROMIUM : undefined) },
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 }, browserName: 'chromium' } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 60_000,
    // Ключи только для тестового сервера (в продакшене — свои, pnpm env:init). Заявки — в файл test-results/leads.
    env: {
      LEAD_TOKEN_SECRET: 'e2e-lead-token-secret-not-for-production',
      SMETA_SIGNING_SECRET: 'e2e-smeta-secret-not-for-production',
      RATE_LIMIT_SALT: 'e2e-salt',
      LEADS_FILE: 'on',
      LEADS_DIR: E2E_LEADS_DIR,
    },
  },
})
