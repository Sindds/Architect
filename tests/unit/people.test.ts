import { describe, expect, it } from 'vitest'
import { SITE } from '@/content/site'
import { TEAM, visiblePhoto } from '@/content/people'

// Решение заказчика 08.10.2026: в концепте у команды портреты из прототипа (сгенерированные).
// В рабочем режиме сгенерированные лица показывать нельзя (CONTENT-SPEC §1).
describe('Портреты команды', () => {
  it('у каждого в команде есть портрет с подписью «сгенерирован»', () => {
    for (const m of TEAM) {
      expect(m.photo, m.name).toBeTruthy()
      expect(m.photo?.alt).toContain(m.name)
      expect(m.photo?.generated).toBe(true)
    }
  })

  it('в концепте портрет виден, в рабочем режиме сгенерированный портрет скрыт', () => {
    const m = TEAM[0]!
    expect(visiblePhoto(m, 'concept')).toBe(m.photo)
    expect(visiblePhoto(m, 'client')).toBeUndefined()
  })

  // Пометку о сгенерированных портретах из текста блока убрали (правка заказчика 17.10.2026). Она осталась
  // в alt для экранных дикторов, а в концепте футер говорит, что люди вымышлены.
  it('портреты подписаны в alt, а в концепте футер называет людей вымышленными', () => {
    for (const m of TEAM) expect(m.photo?.alt).toContain('сгенерированный портрет')
    expect(SITE.disclaimer).toMatch(/люди/)
  })
})
