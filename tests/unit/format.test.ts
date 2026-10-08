import { describe, expect, it } from 'vitest'
import { formatDaysFrom, formatPriceDelta } from '@/lib/format'
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

  it('подзаголовок первого экрана: «от 254 дней», а не «от 254 дня»', () => {
    expect(heroFor('default').subtitle).toContain(`от 254${NB}дней`)
    expect(heroFor('default').subtitle).not.toMatch(/от \d+\s(дня|день)\b/)
  })
})

describe('Отклонение сметы словами', () => {
  it('без отклонения пишем по-человечески, без «0%»', () => {
    expect(formatPriceDelta(57_100_000, 57_100_000)).toBe('смета не изменилась')
  })
  it('с отклонением — процент со знаком', () => {
    expect(formatPriceDelta(137_200_000, 140_950_000)).toBe('+2,7% к смете')
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
