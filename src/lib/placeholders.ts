// Заглушки шаблона: нули вместо номеров, example.com, ссылки без адресата. Они не попадают в разметку
// для поисковиков (seo.ts) и попадают в список «не заполнено» (pnpm ready).

/** Номер не заглушка: после кода страны есть цифры кроме нулей (+7 000 000-00-00, ИНН 0000000000 — заглушки). */
export const realNumber = (value: string) => /[1-9]/.test(value.replace(/^\+?7/, ''))

export const realEmail = (value: string) => Boolean(value.trim()) && !value.trim().endsWith('example.com')

/** Ссылка-заглушка: после домена пусто или одни нули (t.me/+70000000000, vk.com/club0, max.ru/, wa.me/70000000000). */
export const isPlaceholderLink = (url: string) => !/[1-9a-z]/i.test(url.replace(/^https?:\/\/[^/]+\/?/, '').replace(/^(\+?7|club|u\/)/, ''))
