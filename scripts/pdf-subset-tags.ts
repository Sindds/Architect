/**
 * Уникальные метки подмножеств шрифтов в PDF из Chromium.
 *
 * Chrome (Skia/PDF) встраивает один шрифт несколькими подмножествами с разными глифами, но с одной меткой:
 * в договоре три разных «AAAAAA+Onest-Regular». ISO 32000-1, п. 9.6.4: у разных подмножеств в одном файле
 * метки должны различаться. Просмотрщик, который узнаёт шрифт по имени, берёт глифы из чужого подмножества,
 * и текст ломается: буквы пропадают или заменяются другими.
 *
 * Каждый FontDescriptor (одно встроенное подмножество) получает свою метку: AAAAAA, AAAAAB, … Метка той же
 * длины, поэтому смещения объектов в таблице xref не меняются. Skia пишет PDF 1.4 без потоков объектов:
 * словари шрифтов лежат в файле открытым текстом.
 */

const OBJ = /(\d+) 0 obj\b([\s\S]*?)\bendobj\b/g
const TAGGED = /\/(BaseFont|FontName)\s*\/([A-Z]{6})\+/g

/** n → шесть заглавных букв: 0 → AAAAAA, 1 → AAAAAB, 26 → AAAABA. */
export function subsetTag(n: number): string {
  let tag = ''
  for (let i = 0; i < 6; i++, n = Math.floor(n / 26)) tag = String.fromCharCode(65 + (n % 26)) + tag
  return tag
}

export function uniqueSubsetTags(pdf: Buffer): Buffer {
  const text = pdf.toString('latin1')
  const objects = new Map<number, { start: number; body: string }>()
  for (const m of text.matchAll(OBJ)) objects.set(Number(m[1]), { start: m.index! + m[0].indexOf(m[2]!), body: m[2]! })

  const ref = (body: string, key: string) => Number(body.match(new RegExp(`/${key}\\s*\\[?\\s*(\\d+) 0 R`))?.[1])
  // Шрифт Type0 → CIDFont (DescendantFonts) → FontDescriptor. Метку меняем во всех трёх словарях.
  const groups = new Map<number, Set<number>>()
  for (const [id, { body }] of objects) {
    if (!/\/Subtype\s*\/Type0\b/.test(body)) continue
    const cid = ref(body, 'DescendantFonts')
    const descriptor = ref(objects.get(cid)?.body ?? '', 'FontDescriptor')
    if (!descriptor) continue
    const group = groups.get(descriptor) ?? new Set([cid, descriptor])
    group.add(id)
    groups.set(descriptor, group)
  }

  const out = Buffer.from(pdf)
  let n = 0
  for (const ids of groups.values()) {
    const tag = subsetTag(n++)
    for (const id of ids) {
      const { start, body } = objects.get(id)!
      for (const m of body.matchAll(TAGGED)) {
        const at = start + m.index! + m[0].length - 7
        out.write(tag, at, 'latin1')
      }
    }
  }
  return out
}

/** Имена встроенных подмножеств (BaseFont шрифтов Type0) — для проверки, что они не повторяются. */
export function subsetNames(pdf: Buffer): string[] {
  const text = pdf.toString('latin1')
  return [...text.matchAll(OBJ)]
    .map((m) => m[2]!)
    .filter((body) => /\/Subtype\s*\/Type0\b/.test(body))
    .map((body) => body.match(/\/BaseFont\s*\/(\S+)/)?.[1] ?? '')
}
