import { describe, expect, it } from 'vitest'
import { COPY } from '@/content/copy'
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

  it('лид блока команды честно говорит, что портреты сгенерированы', () => {
    expect(COPY.sections.team.lead).toMatch(/сгенерирован/)
  })
})
