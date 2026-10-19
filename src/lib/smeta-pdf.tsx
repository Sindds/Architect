import path from 'node:path'
import { Document, Font, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer'
import { PRICING } from '@/content/pricing'
import { STEPS } from '@/content/texts'
import { SITE } from '@/content/site'
import { formatDays, formatRub, groupDigits } from '@/lib/format'
import { estimateFor } from '@/lib/pricing'
import { smetaLayout, type SmetaInput } from '@/lib/smeta-token'

// Шрифты — статические TrueType с кириллицей из scripts/pdf-fonts (OFL), как у образцов документов.
// В сборку Vercel они попадают через outputFileTracingIncludes в next.config.ts.
const FONTS = path.join(process.cwd(), 'scripts/pdf-fonts')
Font.register({
  family: 'Onest',
  fonts: [
    { src: path.join(FONTS, 'onest-400.ttf'), fontWeight: 400 },
    { src: path.join(FONTS, 'onest-600.ttf'), fontWeight: 600 },
  ],
})
Font.register({ family: 'Manrope', src: path.join(FONTS, 'manrope-700.ttf'), fontWeight: 700 })
// Без переносов по слогам: react-pdf не знает русских правил переноса.
Font.registerHyphenationCallback((word) => [word])

const C = { ink: '#111315', muted: '#5b6168', line: '#d9dcdf', accent: '#3d6a93', soft: '#eef3f8' }

const s = StyleSheet.create({
  page: { fontFamily: 'Onest', fontSize: 9, color: C.ink, paddingTop: 40, paddingBottom: 48, paddingHorizontal: 40, lineHeight: 1.35 },
  brand: { fontFamily: 'Manrope', fontWeight: 700, fontSize: 11, letterSpacing: 1.5 },
  h1: { fontFamily: 'Manrope', fontWeight: 700, fontSize: 20, marginTop: 14 },
  h2: { fontFamily: 'Manrope', fontWeight: 700, fontSize: 12, marginTop: 18, marginBottom: 6 },
  muted: { color: C.muted },
  stamp: { marginTop: 8, padding: 6, backgroundColor: C.soft, color: C.accent, fontWeight: 600 },
  facts: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, borderTop: `1 solid ${C.line}` },
  fact: { width: '33.33%', paddingVertical: 6, paddingRight: 8, borderBottom: `1 solid ${C.line}` },
  factLabel: { color: C.muted, fontSize: 8 },
  factValue: { fontWeight: 600, fontSize: 10, marginTop: 2 },
  total: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12, padding: 10, backgroundColor: C.ink, color: '#ffffff' },
  totalSum: { fontFamily: 'Manrope', fontWeight: 700, fontSize: 18 },
  row: { flexDirection: 'row', borderBottom: `0.5 solid ${C.line}`, paddingVertical: 3 },
  head: { flexDirection: 'row', borderBottom: `1 solid ${C.ink}`, paddingBottom: 3, fontWeight: 600, fontSize: 8 },
  sec: { flexDirection: 'row', backgroundColor: C.soft, paddingVertical: 4, paddingHorizontal: 3, marginTop: 6, fontWeight: 600 },
  sub: { flexDirection: 'row', paddingVertical: 3, fontWeight: 600 },
  n: { width: 22 },
  name: { flex: 1, paddingRight: 6 },
  unit: { width: 38 },
  qty: { width: 46, textAlign: 'right' },
  price: { width: 66, textAlign: 'right' },
  sum: { width: 78, textAlign: 'right' },
  list: { flexDirection: 'row', marginBottom: 2 },
  bullet: { width: 10 },
  footer: { position: 'absolute', bottom: 22, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7.5, color: C.muted },
})

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.fact}>
      <Text style={s.factLabel}>{label}</Text>
      <Text style={s.factValue}>{value}</Text>
    </View>
  )
}

function SmetaDocument({ leadId, input, issued }: { leadId: number; input: SmetaInput; issued: Date }) {
  const derived = input.floors === undefined || input.bathrooms === undefined
  const layout = { ...smetaLayout(input.area), ...(input.floors ? { floors: input.floors } : {}), ...(input.bathrooms ? { bathrooms: input.bathrooms } : {}) }
  const sheet = estimateFor({ ...input, ...layout })
  const tier = PRICING.tiers[input.tier]
  const style = PRICING.styles[input.style]
  const addons = input.addons.map((k) => PRICING.addons[k].title)
  const date = issued.toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' })
  // Сквозная нумерация строк: номер первой строки каждого раздела.
  const firstLine = sheet.sections.map((_, i) => sheet.sections.slice(0, i).reduce((n, x) => n + x.lines.length, 0) + 1)

  return (
    <Document title={`Смета ${SITE.brandFull} № ${leadId}`} author={SITE.brandFull} language="ru">
      <Page size="A4" style={s.page}>
        <Text style={s.brand}>{SITE.brandFull}</Text>
        <Text style={s.muted}>{SITE.descriptor}</Text>
        <Text style={s.h1}>Предварительная смета № {leadId}</Text>
        <Text style={s.muted}>
          от {date} · {input.project ? `проект ${input.project}` : 'расчёт по параметрам с сайта'}
        </Text>
        <Text style={s.stamp}>Предварительный расчёт, не является офертой.</Text>

        <View style={s.facts}>
          <Fact label="Стиль и каркас" value={`${style.title}, ${style.construction.toLowerCase()}`} />
          <Fact label="Площадь дома" value={`${input.area} м²`} />
          <Fact label="Терраса" value={input.terrace ? `${input.terrace} м²` : 'без террасы'} />
          <Fact label="Комплектация" value={tier.title} />
          <Fact label="Этажей, санузлов" value={`${layout.floors}, ${layout.bathrooms}${derived ? ' (по площади)' : ''}`} />
          <Fact label="Опции" value={addons.length ? addons.join(', ') : 'без опций'} />
        </View>

        <View style={s.total}>
          <View>
            <Text>Цена по смете</Text>
            <Text style={{ fontSize: 8, color: '#c9d2db' }}>
              {formatRub(Math.round(sheet.total / input.area))} за 1 м² дома · срок {formatDays(sheet.days)} от начала работ
            </Text>
          </View>
          <Text style={s.totalSum}>{formatRub(sheet.total)}</Text>
        </View>

        <Text style={s.h2}>Разбивка по разделам</Text>
        <View style={s.head} fixed>
          <Text style={s.n}>№</Text>
          <Text style={s.name}>Наименование работ и материалов</Text>
          <Text style={s.unit}>Ед.</Text>
          <Text style={s.qty}>Кол-во</Text>
          <Text style={s.price}>Цена, ₽</Text>
          <Text style={s.sum}>Сумма, ₽</Text>
        </View>
        {sheet.sections.map((sec, si) => (
          <View key={sec.title}>
            <View style={s.sec} wrap={false}>
              <Text>
                Раздел {si + 1}. {sec.title}
              </Text>
            </View>
            {sec.lines.map((l, li) => {
              return (
                <View key={l.name} style={s.row} wrap={false}>
                  <Text style={s.n}>{(firstLine[si] ?? 1) + li}</Text>
                  <Text style={s.name}>{l.name}</Text>
                  <Text style={s.unit}>{l.unit}</Text>
                  <Text style={s.qty}>{String(l.qty).replace('.', ',')}</Text>
                  <Text style={s.price}>{groupDigits(l.price)}</Text>
                  <Text style={s.sum}>{groupDigits(l.sum)}</Text>
                </View>
              )
            })}
            <View style={s.sub} wrap={false}>
              <Text style={s.n} />
              <Text style={s.name}>Итого по разделу {si + 1}</Text>
              <Text style={s.sum}>{groupDigits(sec.subtotal)}</Text>
            </View>
          </View>
        ))}

        <View wrap={false}>
          <Text style={s.h2}>Оплата по этапам</Text>
          {STEPS.map((st, i) => (
            <View key={st.title} style={s.row}>
              <Text style={s.n}>{i + 1}</Text>
              <Text style={s.name}>{st.title}</Text>
              <Text style={s.qty}>{st.paymentPercent}%</Text>
              <Text style={s.sum}>{formatRub(Math.round((sheet.total * st.paymentPercent) / 100))}</Text>
            </View>
          ))}
          <Text style={[s.muted, { marginTop: 4 }]}>Первый платёж — после подписания договора, каждый следующий — после акта по предыдущему этапу.</Text>
        </View>

        <View wrap={false}>
          <Text style={s.h2}>Что входит в «{tier.title}»</Text>
          {tier.includes.map((x) => (
            <View key={x} style={s.list}>
              <Text style={s.bullet}>+</Text>
              <Text style={{ flex: 1 }}>{x}</Text>
            </View>
          ))}
          <Text style={s.h2}>Что не входит</Text>
          {tier.excludes.map((x) => (
            <View key={x} style={s.list}>
              <Text style={s.bullet}>−</Text>
              <Text style={{ flex: 1 }}>{x}</Text>
            </View>
          ))}
        </View>

        <View wrap={false}>
          <Text style={s.h2}>Важно</Text>
          <Text>
            Это предварительный расчёт по параметрам, указанным на сайте. Твёрдую цену фиксируем в договоре по смете Вашего проекта: дальше она меняется, только если Вы сами
            меняете проект или комплектацию.
          </Text>
          {derived && <Text style={{ marginTop: 4 }}>Этажность и число санузлов приняты по площади: до 250 м² — один этаж, санузел на каждые 90 м².</Text>}
          <Text style={[s.h2, { marginTop: 14 }]}>Контакты</Text>
          <Text>
            {SITE.phoneDisplay} · {SITE.email} · {SITE.hours}
          </Text>
          <Text style={s.muted}>{`${SITE.operator.name}, ИНН ${SITE.operator.inn}, ОГРН ${SITE.operator.ogrn}`}</Text>
        </View>

        <View style={s.footer} fixed>
          <Text>
            {SITE.brandFull} · смета № {leadId} от {date}
          </Text>
          <Text render={({ pageNumber, totalPages }) => `Страница ${pageNumber} из ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}

/** PDF сметы по параметрам заявки. Персональных данных в нём нет: только номер заявки и параметры дома. */
export function renderSmetaPdf(leadId: number, input: SmetaInput, issued = new Date()): Promise<Buffer> {
  return renderToBuffer(<SmetaDocument leadId={leadId} input={input} issued={issued} />)
}
