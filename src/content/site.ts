import type { ContentMode } from './types'

// Глобальные настройки сайта. Режим concept — CONTENT-SPEC §1.
export const SITE = {
  contentMode: 'concept' as ContentMode,
  brand: 'ARCLINE',
  brandFull: 'ARCLINE ESTATE',
  descriptor: 'Архитектурно-строительное бюро',
  phoneDisplay: '+7 (000) 000-00-00',
  phoneHref: 'tel:+70000000000',
  email: 'hello@example.com',
  address: 'Новорижское ш., Московская обл.',
  /** Точка на Новорижском шоссе (г. о. Красногорск) по OpenStreetMap. В концепте адрес условный: карта показывает район. */
  geo: { lat: 55.80351, lon: 37.31240, zoom: 11 },
  hours: 'Пн–Сб, 9:00–20:00',
  callbackPromise: 'Перезвоним в течение рабочего дня.',
  disclaimer: 'Концепт-проект для портфолио. Компания, объекты, люди и цены вымышлены.',
  nav: [
    { href: '#projects', label: 'Проекты' },
    { href: '#pricing', label: 'Цены' },
    { href: '#process', label: 'Как строим' },
    { href: '#contacts', label: 'Контакты' },
  ],
  docs: {
    contract: '/docs/dogovor-obrazec.pdf',
    estimate: '/docs/smeta-obrazec.pdf',
  },
  legalVersion: { version: '1.0', date: '08.10.2026' },
} as const

export const isConcept = () => SITE.contentMode === 'concept'
