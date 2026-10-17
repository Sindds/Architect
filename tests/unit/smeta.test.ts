import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { formatRub } from '@/lib/format'
import { estimateFor } from '@/lib/pricing'
import { renderSmetaPdf } from '@/lib/smeta-pdf'
import { subsetNames } from '../../scripts/pdf-subset-tags'
import { SMETA_TTL_MS, type SmetaInput, signSmetaToken, smetaLayout, verifySmetaToken } from '@/lib/smeta-token'

const NOW = 1_800_000_000_000
const KEY = 'ключ-сметы'
const INPUT: SmetaInput = { area: 350, terrace: 50, style: 'fachwerk', tier: 'whitebox', addons: ['knx'] }

describe('ссылка на смету', () => {
  it('подписанная ссылка открывается 7 дней', () => {
    const token = signSmetaToken(48213, INPUT, NOW, KEY)
    expect(verifySmetaToken(token, NOW + SMETA_TTL_MS - 1, KEY)).toEqual({ leadId: 48213, input: INPUT })
    expect(verifySmetaToken(token, NOW + SMETA_TTL_MS + 1, KEY)).toBeNull()
  })

  it('испорченная, чужая или пустая ссылка не открывается', () => {
    const token = signSmetaToken(48213, INPUT, NOW, KEY)
    const [data, sig] = token.split('.') as [string, string]
    const forged = Buffer.from(JSON.stringify({ l: 1, e: { ...INPUT, area: 800 }, x: NOW + 1e9 })).toString('base64url')
    expect(verifySmetaToken(`${forged}.${sig}`, NOW, KEY)).toBeNull()
    expect(verifySmetaToken(`${data}.${sig.slice(1)}x`, NOW, KEY)).toBeNull()
    expect(verifySmetaToken(token, NOW, 'другой ключ')).toBeNull()
    expect(verifySmetaToken(token, NOW, null)).toBeNull()
    expect(verifySmetaToken('мусор', NOW, KEY)).toBeNull()
  })

  it('этажность и санузлы по площади: до 250 м² — один этаж, санузел на 90 м² (2–6)', () => {
    expect(smetaLayout(100)).toEqual({ floors: 1, bathrooms: 2 })
    expect(smetaLayout(350)).toEqual({ floors: 2, bathrooms: 4 })
    expect(smetaLayout(800)).toEqual({ floors: 2, bathrooms: 6 })
  })
})

describe('PDF сметы', () => {
  it('текст извлекается: «Смета», итог из pricing.ts, разделы, оплата; шрифты встроены, без Type 3', async () => {
    const pdf = await renderSmetaPdf(48213, INPUT, new Date(NOW))
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
    const dir = mkdtempSync(path.join(tmpdir(), 'smeta-'))
    const file = path.join(dir, 'smeta.pdf')
    writeFileSync(file, pdf)
    const text = execFileSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8' }).replace(/ /g, ' ')
    const total = estimateFor({ ...INPUT, ...smetaLayout(INPUT.area) }).total
    expect(text).toContain('Предварительная смета № 48213')
    expect(text).toContain(formatRub(total).replace(/ /g, ' '))
    expect(text).toContain('Раздел 1.')
    expect(text).toContain('Оплата по этапам')
    expect(text).toContain('приняты по площади')
    const fonts = execFileSync('pdffonts', [file], { encoding: 'utf8' })
    expect(fonts).not.toMatch(/Type 3/)
    expect(fonts).toMatch(/Onest/)
    // Разные подмножества — разные имена (ISO 32000-1, п. 9.6.4), иначе просмотрщик путает глифы.
    const names = subsetNames(pdf)
    expect(names.length).toBeGreaterThan(0)
    expect(new Set(names).size).toBe(names.length)
  }, 30_000)

  it('монолит (TITAN): PDF строится, в нём монолитный каркас', async () => {
    const pdf = await renderSmetaPdf(48214, { area: 540, terrace: 120, style: 'monolith', tier: 'turnkey', addons: [], floors: 2, bathrooms: 5, project: 'TITAN' }, new Date(NOW))
    const dir = mkdtempSync(path.join(tmpdir(), 'smeta-'))
    const file = path.join(dir, 'titan.pdf')
    writeFileSync(file, pdf)
    const text = execFileSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8' })
    expect(text).toContain('Монолитный железобетонный каркас')
  }, 30_000)
})
