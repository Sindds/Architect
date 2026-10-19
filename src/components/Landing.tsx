import type { VariantKey } from '@/content/types'
import { VARIANTS } from '@/content/variants'
import { structuredData } from '@/lib/seo'
import { projectsFor } from '@/lib/variant'
import { LandingProvider } from './LandingProvider'
import { MobileActionBar } from './MobileActionBar'
import { ScrollTopButton } from './ScrollTopButton'
import { PageLoader } from './PageLoader'
import { CalculatorSection } from './sections/CalculatorSection'
import { Documents } from './sections/Documents'
import { Faq } from './sections/Faq'
import { FinalCta } from './sections/FinalCta'
import { Footer } from './sections/Footer'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Pricing } from './sections/Pricing'
import { Process } from './sections/Process'
import { Projects } from './sections/Projects'
import { Reviews, Team } from './sections/People'
import { WhyUs } from './sections/WhyUs'
import { Metrika } from './Metrika'

/** Одна страница, порядок блоков фиксирован (CONTENT-SPEC §4). */
// Внутри <script> закрывающий тег из данных разорвал бы разметку: экранируем «<».
const jsonLd = JSON.stringify(structuredData()).replace(/</g, '\\u003c')

export function Landing({ variant }: { variant: VariantKey }) {
  return (
    <LandingProvider variant={variant}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-fg focus:px-5 focus:py-3 focus:text-bg">
        Перейти к содержанию
      </a>
      <PageLoader />
      <Header />
      {/* Разметка schema.org: организация, услуги с ценами, проекты (src/lib/seo.ts). FAQPage — в блоке вопросов. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <main id="main">
        <Hero variant={variant} />
        <WhyUs />
        <Projects projects={projectsFor(variant)} />
        <Pricing defaultStyle={VARIANTS[variant].calcStyle} />
        <CalculatorSection defaultStyle={VARIANTS[variant].calcStyle} />
        <Process />
        <Team />
        <Reviews />
        <Documents />
        <Faq />
        <FinalCta variant={variant} />
      </main>
      <Footer />
      <MobileActionBar />
      <ScrollTopButton />
      <Metrika variant={variant} />
    </LandingProvider>
  )
}
