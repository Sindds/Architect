import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Landing } from '@/components/Landing'
import { CAMPAIGN_VARIANTS } from '@/content/variants'
import { seoDescription } from '@/lib/seo'
import { heroFor } from '@/lib/variant'

// Статические версии страницы под рекламные кампании (CONTENT-SPEC §9).
// Открываются по /?v=key или /?utm_content=key через rewrite в next.config.ts.
export const dynamicParams = false

export function generateStaticParams() {
  return CAMPAIGN_VARIANTS.map((variant) => ({ variant }))
}

// Свой заголовок под запрос кампании; canonical — на главную: содержимое то же, дублей в выдаче нет.
export async function generateMetadata({ params }: { params: Promise<{ variant: string }> }): Promise<Metadata> {
  const { variant } = await params
  const key = CAMPAIGN_VARIANTS.find((v) => v === variant)
  if (!key) return {}
  const hero = heroFor(key)
  return {
    title: hero.variant.h1Prefix,
    description: seoDescription(`${hero.variant.h1Prefix}`, hero.variant.heroStyleFilter),
    alternates: { canonical: '/' },
  }
}

export default async function VariantPage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params
  const key = CAMPAIGN_VARIANTS.find((v) => v === variant)
  if (!key) notFound()
  return <Landing variant={key} />
}
