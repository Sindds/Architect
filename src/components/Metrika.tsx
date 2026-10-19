'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'
import { SITE } from '@/content/site'
import type { VariantKey } from '@/content/types'
import { track } from '@/lib/analytics'
import { useConsent } from '@/lib/consent'

const id = Number(SITE.metrikaId) || 0

/**
 * Яндекс Метрика: загружается только после «Принять все» и только если задан номер счётчика.
 * Вебвизор выключен: он записывает ввод в формы, то есть персональные данные.
 * Клики по телефону, PDF и мессенджерам ловит один обработчик на документе.
 */
export function Metrika({ variant }: { variant: VariantKey }) {
  const [consent] = useConsent()
  // Счётчик загружался в этом окне: после «Принять все». «Настройки cookie» сначала сбрасывают выбор,
  // поэтому смотрим не на предыдущее значение, а на то, был ли счётчик загружен.
  const loaded = useRef(false)

  // Отозвали согласие («Настройки cookie» → «Только необходимые»): загруженный счётчик сам не выгружается,
  // поэтому удаляем его cookie и данные в браузере и перезагружаем страницу уже без Метрики.
  useEffect(() => {
    if (consent === 'all') loaded.current = true
    if (!id || !loaded.current || consent !== 'necessary') return
    for (const name of document.cookie.split(';').map((c) => c.split('=')[0]?.trim() ?? '')) {
      if (!name.startsWith('_ym')) continue
      for (const domain of ['', `; domain=${location.hostname}`, `; domain=.${location.hostname.replace(/^www\./, '')}`]) {
        document.cookie = `${name}=; Max-Age=0; path=/${domain}`
      }
    }
    try {
      for (const key of Object.keys(localStorage)) if (key.startsWith('_ym')) localStorage.removeItem(key)
    } catch {}
    location.reload()
  }, [consent])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const el = (event.target as Element | null)?.closest?.('a, button')
      if (!el) return
      const href = el.getAttribute('href') ?? ''
      if (href.startsWith('tel:')) track('phone_click')
      else if (el.hasAttribute('data-messenger') || /^https:\/\/(t\.me|max\.ru|vk\.(com|me)|wa\.me)\//.test(href)) {
        track('messenger_click', { channel: el.getAttribute('data-messenger') || 'link' })
      } else if (href.startsWith('/smeta/') || href.endsWith('.pdf')) {
        track('pdf_download', { doc: href.startsWith('/smeta/') ? 'smeta' : (href.split('/').pop() ?? 'pdf') })
      }
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  if (!id || consent !== 'all') return null
  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${id},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false,params:{variant:${JSON.stringify(variant)}}});`}
    </Script>
  )
}
