// Для скриптов вне Next.js: импорт картинок (как в next/image) возвращает заглушку StaticImageData.
// Нужен, когда скрипт читает src/content, где данные проектов подключают .webp.
import { register } from 'node:module'

const hook = `export async function load(url, context, next) {
  if (/\\.(webp|png|jpe?g|avif|svg)$/.test(url)) {
    return { format: 'module', shortCircuit: true, source: 'export default ' + JSON.stringify({ src: url, width: 1, height: 1 }) }
  }
  return next(url, context)
}`
register(`data:text/javascript,${encodeURIComponent(hook)}`)
