import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
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
  add('SITE.tagline', SITE.tagline)
  add('SITE.about', SITE.about)
  add('COPY.smetaTitle', COPY.smetaTitle)
  add('COPY.messengerTitle', COPY.messengerTitle)
  COPY.smetaIntro('с 83 позициями в 14 разделах').forEach((t, i) => add(`COPY.smetaIntro[${i}]`, t))
  add('SITE.callbackPromise', SITE.callbackPromise)
  WHY_US.forEach((w, i) => (add(`WHY_US[${i}].title`, w.title), add(`WHY_US[${i}].fact`, w.fact)))
  FAQ.forEach((f, i) => (add(`FAQ[${i}].q`, f.question), f.answer.forEach((a, j) => add(`FAQ[${i}].a${j}`, a))))
  STEPS.forEach((s, i) => (add(`STEPS[${i}].title`, s.title), add(`STEPS[${i}].result`, s.result)))
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

/**
 * Тексты, которые заказчик написал дословно (правки от 17.10.2026). Его формулировки важнее правил стиля,
 * поэтому проверки клише, тире, длины предложений и рубленых заголовков к ним не применяются.
 * Остальные проверки (кавычки, капслок, «Вы» с заглавной, обещания не сильнее договора) действуют.
 */
const CLIENT_TEXTS = new Set([
  'COPY.sections.projects.lead',
  'COPY.sections.process.title',
  'process',
  'STEPS[1].title',
  'PROJECTS.chalet.tagline',
  'FAQ[2].a0',
  'FAQ[6].a0',
  'FAQ[9].a0',
])
const STYLED = ALL.filter((i) => !CLIENT_TEXTS.has(i.where))

describe('Тексты: шаблоны, которые звучат как реклама или ИИ', () => {
  it('нет рекламных клише и вычурных формул', () => {
    const banned = [
      // Слоганы конкурентов не пересказываем (gwd.ru: «Строим ваш дом, пока вы строите свою жизнь»).
      /пока (мы|вы) стро/i,
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
      // Популярность без данных — это «цифры без источника» (CONTENT-SPEC §2)
      /выбирают чаще|самый популярн|хит продаж|лучший выбор/i,
    ]
    expect(fail(STYLED.filter((i) => banned.some((re) => re.test(i.text))))).toEqual([])
  })

  it('нет противопоставлений «не X, а Y» и «не только…, но и»', () => {
    const contrast = [/(^|[.?]\s+)Не\s[^.?]*[.?]\s+[А-ЯЁ]/, /\bне\s+[а-яё]+(\s+[а-яё]+)?,\s+а\s+/i, /не только[^.]*,\s+но и/i]
    expect(fail(ALL.filter((i) => contrast.some((re) => re.test(i.text))))).toEqual([])
  })

  it('заголовки — одна фраза, без рубленых фрагментов «X. Y.»', () => {
    const titles = Object.entries(COPY.sections).map(([k, s]) => ({ where: k, text: s.title })).filter((t) => !CLIENT_TEXTS.has(t.where))
    expect(fail(titles.filter((t) => /[.!?]\s+\S/.test(t.text) || /[.]$/.test(t.text)))).toEqual([])
  })

  it('не больше одного тире в предложении', () => {
    const bad = STYLED.filter((i) => sentences(i.text).some((s) => (s.match(/\s—\s/g) ?? []).length > 1))
    expect(fail(bad)).toEqual([])
  })

  it('нет восклицаний и капслока в тексте (регистр меняет вёрстка)', () => {
    const shouty = ALL.filter((i) => /!/.test(i.text) || /\b[А-ЯЁ]{4,}\b/.test(i.text.replace(/МКАД/g, '')))
    expect(fail(shouty)).toEqual([])
  })

  it('предложения не длиннее 32 слов', () => {
    const long = STYLED.filter((i) => sentences(i.text).some((s) => s.split(/\s+/).length > 32))
    expect(fail(long)).toEqual([])
  })

  it('«Вы», «Вас», «Ваш» и другие формы — с заглавной буквы (правка заказчика 17.10.2026)', () => {
    const lower = /(?<![А-Яа-яЁё])(вы|вас|вам|вами|ваш|ваша|ваше|ваши|вашего|вашей|вашему|вашим|вашими|ваших|вашу|вашем)(?![А-Яа-яЁё])/
    expect(fail(ALL.filter((i) => lower.test(i.text)))).toEqual([])
  })

  it('кавычки-ёлочки, без двойных пробелов', () => {
    const typo = ALL.filter((i) => /"/.test(i.text) || / {2,}/.test(i.text) || /\s[,.;:]/.test(i.text))
    expect(fail(typo)).toEqual([])
  })
})

describe('Тексты: структура', () => {
  it('у каждой секции лендинга есть заголовок и метка', () => {
    const required = ['why', 'projects', 'pricing', 'calculator', 'process', 'team', 'reviews', 'documents', 'faq', 'contacts']
    for (const key of required) {
      const s = COPY.sections[key as keyof typeof COPY.sections]
      expect(s?.title, key).toBeTruthy()
      expect(s?.label, key).toBeTruthy()
    }
  })

  it('вводный абзац «Как мы работаем» не пересказывает карточки (нет общих фраз из 4 слов)', () => {
    const words = (t: string) => t.toLowerCase().replace(/[^а-яё0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
    const shingles = (t: string) => {
      const w = words(t)
      return new Set(w.slice(0, -3).map((_, i) => w.slice(i, i + 4).join(' ')))
    }
    const lead = shingles(COPY.sections.why.lead ?? '')
    const repeated = WHY_US.flatMap((c) => [...shingles(c.fact)].filter((x) => lead.has(x)))
    expect(repeated).toEqual([])
  })

  it('обещания о цене не сильнее образца договора (CONTENT-SPEC §2, договор п. 2.1–2.2)', () => {
    // В договоре цена твёрдая (п. 2.1), меняется только допсоглашением (п. 2.3), подорожание — риск подрядчика (п. 2.4).
    // Сайт не обещает больше договора: формулировок про «разницу» и «удорожание» здесь нет.
    const risky = ALL.filter((i) => /подорожа|разниц\S* (оплачива|бер[её]м)|удорожани/i.test(i.text))
    expect(fail(risky)).toEqual([])
    // Сайт обещает неизменную цену: в образце договора есть пункт про твёрдую цену (п. 2.1).
    const script = readFileSync(path.join(process.cwd(), 'scripts/sample-docs.ts'), 'utf8')
    expect(script).toMatch(/<p>2\.1\.[^<]*твёрдая/)
    expect(FAQ.some((f) => /смета прилагается к договору/i.test(f.answer.join(' ')))).toBe(true)
  })

  it('сроки гарантии в FAQ совпадают с разделом «Гарантия» образца договора', () => {
    const script = readFileSync(path.join(process.cwd(), 'scripts/sample-docs.ts'), 'utf8')
    const section = script.match(/<h2>\d+\. Гарантия<\/h2>[\s\S]*?<\/table>/)?.[0] ?? ''
    const answer = FAQ.find((f) => /гаранти/i.test(f.question))?.answer.join(' ') ?? ''
    expect(section).toBeTruthy()
    expect(answer).toContain('указаны в образце договора')
    const terms = (found: Iterable<string>) => [...new Set(found)].sort()
    const contract = terms([...section.matchAll(/<td class="r">(\d+ (?:лет|года|год))<\/td>/g)].map((m) => m[1]!))
    expect(terms(answer.match(/\d+ (?:лет|года|год)/g) ?? [])).toEqual(contract)
  })
})
