import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

const PORT = 3100
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
  },
})
