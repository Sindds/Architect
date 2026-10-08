import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Landing } from '@/components/Landing'
import { CAMPAIGN_VARIANTS } from '@/content/variants'

// Статические версии страницы под рекламные кампании (CONTENT-SPEC §9).
// Открываются по /?v=key или /?utm_content=key через rewrite в next.config.ts.
export const dynamicParams = false

export function generateStaticParams() {
  return CAMPAIGN_VARIANTS.map((variant) => ({ variant }))
}

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default async function VariantPage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params
  const key = CAMPAIGN_VARIANTS.find((v) => v === variant)
  if (!key) notFound()
  return <Landing variant={key} />
}
