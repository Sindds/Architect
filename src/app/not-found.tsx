import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { COPY } from '@/content/copy'

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center p-2 sm:p-4 md:p-6">
      <div className="on-dark flex w-full max-w-[100rem] flex-1 flex-col items-center justify-center self-stretch rounded-[24px] border border-white/10 bg-inverse px-6 py-16 text-center text-on-inverse sm:rounded-[36px]">
        <Logo />
        <p className="label mt-12 text-[#9fc0de]">Ошибка 404</p>
        <h1 className="display mt-4 max-w-2xl text-3xl leading-tight font-normal sm:text-5xl">{COPY.ui.notFoundTitle}</h1>
        <p className="mt-4 max-w-md text-lg text-on-inverse-muted">{COPY.ui.notFoundLead}</p>
        <Link href="/" className="btn btn-light mt-8">
          На главную
          <span className="btn-dot">
            <ArrowUpRight aria-hidden className="size-4" />
          </span>
        </Link>
      </div>
    </main>
  )
}
