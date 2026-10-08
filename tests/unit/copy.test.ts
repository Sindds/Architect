import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { CASES } from '@/content/cases'
import { COPY } from '@/content/copy'
import { LEGAL } from '@/content/legal'
import { REVIEWS, TEAM } from '@/content/people'
import { PRICING } from '@/content/pricing'
import { FAQ, STEPS, WHY_US } from '@/content/process'
import { PROJECTS } from '@/content/projects'
import { SITE } from '@/content/site'
import { VARIANTS } from '@/content/variants'

// Стиль текстов: спокойная литературная речь без рекламных клише и шаблонов ИИ-текстов
// (правила stop-slop, адаптированные к русскому: тире разрешено грамматикой, но не как приём).

/** Все видимые тексты лендинга из контента, с адресом для понятной ошибки. */
function collect(): { where: string; text: string }[] {
  const out: { where: string; text: string }[] = []
  const add = (where: string, text: string | undefined) => text && out.push({ where, text })
  for (const [key, s] of Object.entries(COPY.sections)) {
    add(`COPY.sections.${key}.title`, s.title)
    add(`COPY.sections.${key}.lead`, s.lead)
  }
  for (const [key, v] of Object.entries(COPY.ui)) add(`COPY.ui.${key}`, v)
  add('SITE.descriptor', SITE.descriptor)
  add('SITE.callbackPromise', SITE.callbackPromise)
  WHY_US.forEach((w, i) => (add(`WHY_US[${i}].title`, w.title), add(`WHY_US[${i}].fact`, w.fact)))
  FAQ.forEach((f, i) => (add(`FAQ[${i}].q`, f.question), f.answer.forEach((a, j) => add(`FAQ[${i}].a${j}`, a))))
  STEPS.forEach((s, i) => (add(`STEPS[${i}].title`, s.title), add(`STEPS[${i}].result`, s.result)))
  CASES.forEach((c) => ['task', 'solution', 'result', 'deviationNote'].forEach((k) => add(`CASES.${c.slug}.${k}`, c[k as 'task'])))
  REVIEWS.forEach((r) => add(`REVIEWS.${r.id}`, r.text))
  TEAM.forEach((m) => add(`TEAM.${m.initials}`, m.responsibility))
  PROJECTS.forEach((p) => (add(`PROJECTS.${p.slug}.tagline`, p.tagline), p.features.forEach((f, i) => add(`PROJECTS.${p.slug}.features[${i}]`, f))))
  Object.entries(PRICING.tiers).forEach(([k, t]) => add(`PRICING.${k}.short`, t.short))
  Object.entries(PRICING.addons).forEach(([k, a]) => add(`PRICING.addons.${k}.note`, a.note))
  Object.values(VARIANTS).forEach((v) => add(`VARIANTS.${v.key}.h1Prefix`, v.h1Prefix))
  Object.values(LEGAL).forEach((d) => d.sections.forEach((s, i) => s.paragraphs.forEach((p, j) => add(`LEGAL.${d.slug}[${i}][${j}]`, p))))
  return out
}

const sentences = (t: string) => t.split(/(?<=[.!?…])\s+(?=[А-ЯЁA-Z«])/).filter(Boolean)
const fail = (items: { where: string; text: string }[]) => items.map((i) => `${i.where}: «${i.text}»`)

const ALL = collect()

describe('Тексты: шаблоны, которые звучат как реклама или ИИ', () => {
  it('нет рекламных клише и вычурных формул', () => {
    const banned = [
      /смотрите сами/i,
      /не пишем/i,
      /не бывает\.|бывает чест/i,
      /четыре характера/i,
      /каждое обещание/i,
      /до того, как вы спросите/i,
      /на чертеже/i,
      /честн/i,
      /идеальн/i,
      /мечт/i,
      /уникальн/i,
      /индивидуальн\w* подход/i,
      /профессионал/i,
      /качественн/i,
      /надёжн/i,
      /максимальн/i,
      /по-настоящему/i,
      /действительно/i,
      /в разы/i,
      /без лишних слов/i,
    ]
    expect(fail(ALL.filter((i) => banned.some((re) => re.test(i.text))))).toEqual([])
  })

  it('нет противопоставлений «не X, а Y» и «не только…, но и»', () => {
    const contrast = [/(^|[.?]\s+)Не\s[^.?]*[.?]\s+[А-ЯЁ]/, /\bне\s+[а-яё]+(\s+[а-яё]+)?,\s+а\s+/i, /не только[^.]*,\s+но и/i]
    expect(fail(ALL.filter((i) => contrast.some((re) => re.test(i.text))))).toEqual([])
  })

  it('заголовки — одна фраза, без рубленых фрагментов «X. Y.»', () => {
    const titles = Object.entries(COPY.sections).map(([k, s]) => ({ where: k, text: s.title }))
    expect(fail(titles.filter((t) => /[.!?]\s+\S/.test(t.text) || /[.]$/.test(t.text)))).toEqual([])
  })

  it('не больше одного тире в предложении', () => {
    const bad = ALL.filter((i) => sentences(i.text).some((s) => (s.match(/\s—\s/g) ?? []).length > 1))
    expect(fail(bad)).toEqual([])
  })

  it('нет восклицаний и капслока в тексте (регистр меняет вёрстка)', () => {
    const shouty = ALL.filter((i) => /!/.test(i.text) || /\b[А-ЯЁ]{4,}\b/.test(i.text.replace(/МКАД/g, '')))
    expect(fail(shouty)).toEqual([])
  })

  it('предложения не длиннее 32 слов', () => {
    const long = ALL.filter((i) => sentences(i.text).some((s) => s.split(/\s+/).length > 32))
    expect(fail(long)).toEqual([])
  })

  it('кавычки-ёлочки, без двойных пробелов', () => {
    const typo = ALL.filter((i) => /"/.test(i.text) || / {2,}/.test(i.text) || /\s[,.;:]/.test(i.text))
    expect(fail(typo)).toEqual([])
  })
})

describe('Тексты: структура', () => {
  it('у каждой секции лендинга есть заголовок и метка', () => {
    const required = ['why', 'projects', 'cases', 'pricing', 'calculator', 'process', 'team', 'reviews', 'documents', 'faq', 'contacts']
    for (const key of required) {
      const s = COPY.sections[key as keyof typeof COPY.sections]
      expect(s?.title, key).toBeTruthy()
      expect(s?.label, key).toBeTruthy()
    }
  })

  it('FAQ про гарантию ссылается на существующий раздел образца договора', () => {
    const script = readFileSync(path.join(process.cwd(), 'scripts/make-sample-pdfs.ts'), 'utf8')
    const section = script.match(/<h2>(\d+)\. Гарантия<\/h2>/)?.[1]
    const answer = FAQ.find((f) => /гаранти/i.test(f.question))?.answer.join(' ') ?? ''
    expect(section).toBeTruthy()
    expect(answer).toContain(`разделе ${section}`)
  })
})
