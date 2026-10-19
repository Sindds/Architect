import { describe, expect, it } from 'vitest'
import { TEAM } from '@/content/people'

// Портреты команды видны всегда (решение заказчика 19.10.2026: защита сгенерированных портретов снята).
// Под нового заказчика их заменяют фотографиями его сотрудников (с их согласия, ст. 152.1 ГК РФ).
describe('Портреты команды', () => {
  it('у каждого в команде есть портрет, alt — имя и роль, без пометок', () => {
    for (const m of TEAM) {
      expect(m.photo, m.name).toBeTruthy()
      expect(m.photo?.alt).toMatch(new RegExp(`^${m.name}, `))
      expect(m.photo?.alt).not.toMatch(/сгенерирован/)
    }
  })
})
