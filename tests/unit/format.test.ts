import { describe, expect, it } from 'vitest'
import { formatDaysFrom } from '@/lib/format'
import { nbsp } from '@/lib/typography'
import { heroFor } from '@/lib/variant'

const NB = ' '

describe('Срок после «от» — родительный падеж', () => {
  it.each([
    [254, `от 254${NB}дней`],
    [122, `от 122${NB}дней`],
    [121, `от 121${NB}дня`],
    [1, `от 1${NB}дня`],
    [11, `от 11${NB}дней`],
    [119, `от 119${NB}дней`],
  ])('%i → %s', (n, out) => expect(formatDaysFrom(n)).toBe(out))

  it('подзаголовок первого экрана: «от 130 дней», а не «от 130 дня»', () => {
    expect(heroFor('default').subtitle).toContain(`от 130${NB}дней`)
    expect(heroFor('default').subtitle).not.toMatch(/от \d+\s(дня|день)\b/)
  })
})

describe('Неразрывные пробелы после коротких слов', () => {
  it('предлоги и союзы не остаются в конце строки', () => {
    expect(nbsp('Дома из клееного бруса с панорамным остеклением в Подмосковье')).toBe(
      `Дома из${NB}клееного бруса с${NB}панорамным остеклением в${NB}Подмосковье`,
    )
  })
  it('цена не отрывается от «от»', () => {
    expect(nbsp('под ключ от 51,6 млн ₽')).toBe(`под${NB}ключ от${NB}51,6 млн ₽`)
  })
  it('не трогает длинные слова и пустую строку', () => {
    expect(nbsp('Проектируем дома')).toBe('Проектируем дома')
    expect(nbsp('')).toBe('')
  })
})
