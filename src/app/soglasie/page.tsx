import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { LEGAL } from '@/content/legal'

const doc = LEGAL['soglasie']

export const metadata: Metadata = {
  title: `${doc.title} — ARCLINE`,
  description: doc.description,
  alternates: { canonical: '/soglasie' },
}

export default function Page() {
  return <LegalPage doc={doc} />
}
