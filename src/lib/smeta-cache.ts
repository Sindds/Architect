/**
 * Готовые PDF-сметы в памяти процесса. Сборка PDF занимает около половины секунды; без кеша повторные
 * запросы по одной ссылке загружали бы сервер. Одновременные запросы ждут одну и ту же сборку.
 * Хранятся последние MAX смет (около 100 КБ каждая); на Vercel кеш свой у каждого инстанса.
 */
const MAX = 30

export function createPdfCache(max = MAX) {
  const cache = new Map<string, Promise<Uint8Array>>()
  return {
    get(key: string, render: () => Promise<Uint8Array>): Promise<Uint8Array> {
      const hit = cache.get(key)
      if (hit) {
        // Свежая в конец: вытесняется самая давно запрошенная.
        cache.delete(key)
        cache.set(key, hit)
        return hit
      }
      const pdf = render()
      cache.set(key, pdf)
      pdf.catch(() => cache.delete(key))
      if (cache.size > max) cache.delete(cache.keys().next().value as string)
      return pdf
    },
    size: () => cache.size,
  }
}
