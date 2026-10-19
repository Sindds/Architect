/**
 * Срок хранения заявок (ст. 21 152-ФЗ и политика конфиденциальности): из файла leads.ndjson удаляются заявки
 * старше days дней. Строки, которые не удалось разобрать, остаются: удалять непонятные данные молча нельзя.
 */
export function pruneLeadLines(text: string, now: Date, days: number): { kept: string; removed: number; total: number } {
  const border = now.getTime() - days * 24 * 60 * 60 * 1000
  const lines = text.split('\n').filter(Boolean)
  const kept = lines.filter((line) => {
    try {
      const created = Date.parse((JSON.parse(line) as { createdAt?: string }).createdAt ?? '')
      return Number.isNaN(created) || created >= border
    } catch {
      return true
    }
  })
  return { kept: kept.length ? `${kept.join('\n')}\n` : '', removed: lines.length - kept.length, total: lines.length }
}
