'use client'

import { Phone, RotateCw } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { COPY } from '@/content/copy'
import { SITE } from '@/content/site'

/** Экран сбоя для error.tsx и global-error.tsx: по-русски, с телефоном и полной перезагрузкой (она же лечит рассинхрон версий после выкладки). */
export function ErrorScreen() {
  return (
    <main className="grid min-h-dvh place-items-center p-2 sm:p-4 md:p-6">
      <div className="on-dark flex w-full max-w-[100rem] flex-1 flex-col items-center justify-center self-stretch rounded-[24px] border border-white/10 bg-inverse px-6 py-16 text-center text-on-inverse sm:rounded-[36px]">
        <Logo />
        <p className="label mt-12 text-[#9fc0de]">Ошибка</p>
        <h1 className="display mt-4 max-w-2xl text-3xl leading-tight font-normal sm:text-5xl">{COPY.ui.errorTitle}</h1>
        <p className="mt-4 max-w-md text-lg text-on-inverse-muted">{COPY.ui.errorLead}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-light" onClick={() => window.location.reload()}>
            Обновить страницу
            <span className="btn-dot">
              <RotateCw aria-hidden className="size-4" />
            </span>
          </button>
          <a href={SITE.phoneHref} className="btn btn-glass num">
            {SITE.phoneDisplay}
            <span className="btn-dot">
              <Phone aria-hidden className="size-4" />
            </span>
          </a>
        </div>
      </div>
    </main>
  )
}
