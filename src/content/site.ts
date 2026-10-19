import { COMPANY } from './company'
import { NAV } from './texts'

/**
 * Служебный файл: собирает настройки сайта. Данные компании правятся в company.ts, тексты меню — в texts.ts.
 * Номер счётчика Яндекс Метрики: переменная NEXT_PUBLIC_METRIKA_ID (задаётся при сборке), иначе поле metrikaId в company.ts.
 */
export const SITE = {
  ...COMPANY,
  nav: NAV,
  metrikaId: (process.env.NEXT_PUBLIC_METRIKA_ID || COMPANY.metrikaId).trim(),
} as const
