import { COMPANY } from './company'
import { NAV } from './texts'

/**
 * Служебный файл: собирает настройки сайта. Данные компании правятся в company.ts, тексты меню — в texts.ts.
 * Номер счётчика Яндекс Метрики — переменная окружения NEXT_PUBLIC_METRIKA_ID (не секрет, задаётся при сборке).
 */
export const SITE = {
  ...COMPANY,
  nav: NAV,
  metrikaId: process.env.NEXT_PUBLIC_METRIKA_ID ?? '',
} as const
