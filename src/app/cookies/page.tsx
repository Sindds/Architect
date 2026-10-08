import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { LEGAL } from '@/content/legal'

const doc = LEGAL['cookies']

export const metadata: Metadata = {
  title: `${doc.title} — ARCLINE`,
  description: doc.description,
  alternates: { canonical: '/cookies' },
}

export default function Page() {
  return <LegalPage doc={doc} />
}
