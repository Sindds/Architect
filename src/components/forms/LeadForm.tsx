'use client'

import { ArrowUpRight, Check } from 'lucide-react'
import Link from 'next/link'
import { startTransition, useActionState, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { submitLead } from '@/app/actions/lead'
import { SITE } from '@/content/site'
import { CONTACT_METHODS, HONEYPOT_FIELD, type LeadSource, type LeadState, SEND_FAILED } from '@/lib/lead-schema'
import { maskRuPhoneEdit } from '@/lib/phone'

interface LeadFormProps {
  source: LeadSource
  variant: string
  context?: string
  estimate?: string
  quiz?: string
  extended?: boolean
  submitLabel?: string
  contactMethod?: keyof typeof CONTACT_METHODS
  tone?: 'light' | 'dark'
}

const UTM_KEY = 'arcline:utm'

/** Первый визит: запоминаем utm-метки и yclid на время сессии. */
function readUtm(): string | undefined {
  try {
    const params = new URLSearchParams(window.location.search)
    const found = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid']
      .filter((k) => params.get(k))
      .map((k) => [k, params.get(k) as string])
    if (found.length) sessionStorage.setItem(UTM_KEY, JSON.stringify(Object.fromEntries(found)))
    return sessionStorage.getItem(UTM_KEY) ?? undefined
  } catch {
    return undefined
  }
}

/**
 * Обрыв сети, ответ 5xx или новая версия сайта после выкладки: вызов server action бросает исключение.
 * Без перехвата React передаёт его границе ошибок, страница целиком меняется на экран ошибки и ввод пропадает.
 */
async function sendLead(prev: LeadState, form: FormData): Promise<LeadState> {
  try {
    return await submitLead(prev, form)
  } catch (error) {
    console.error('[lead] Заявка не отправлена', error)
    return { status: 'error', message: SEND_FAILED }
  }
}

export function LeadForm({
  source,
  variant,
  context,
  estimate,
  quiz,
  extended = false,
  submitLabel = 'Отправить заявку',
  contactMethod = 'call',
  tone = 'light',
}: LeadFormProps) {
  const [state, action, pending] = useActionState<LeadState, FormData>(sendLead, { status: 'idle' })
  // Поля контролируемые, отправка через onSubmit: после <form action> React сбрасывает форму, в том числе выбранный
  // способ связи, а при ошибке ввод и выбор нужно сохранить.
  const [name, setName] = useState('')
  // Значение вместе с курсором: новый объект на каждую правку, даже если строка не изменилась (стёрли дефис).
  const [phone, setPhone] = useState({ value: '', caret: 0 })
  const [comment, setComment] = useState('')
  const [consent, setConsent] = useState(false)
  const [method, setMethod] = useState<string>(contactMethod)
  const [startedAt, setStartedAt] = useState('')
  const [utm, setUtm] = useState<string | undefined>()
  const uid = useId()
  const statusRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Время начала и utm доступны только в браузере.
    /* eslint-disable react-hooks/set-state-in-effect */
    setStartedAt(String(Date.now()))
    setUtm(readUtm())
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  useEffect(() => {
    if (state.status !== 'idle') statusRef.current?.focus()
  }, [state])

  // React ставит курсор в конец, когда меняет значение поля; возвращаем его туда, где набирал человек.
  useLayoutEffect(() => {
    const el = phoneRef.current
    if (el && document.activeElement === el) el.setSelectionRange(phone.caret, phone.caret)
  }, [phone])

  const dark = tone === 'dark'
  const errors = state.status === 'error' ? (state.fieldErrors ?? {}) : {}
  const muted = dark ? 'text-on-inverse-muted' : 'text-muted'
  const errorText = dark ? 'text-[#ffb59c]' : 'text-danger'

  if (state.status === 'ok') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="outline-none" data-testid="lead-success">
        <div className="flex items-start gap-3">
          <span className={`mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-[#9fc0de] text-[#111315]' : 'bg-ok text-white'}`}>
            <Check aria-hidden className="size-5" />
          </span>
          <div>
            <p className="text-xl font-medium">Заявка №{state.id} принята.</p>
            <p className={`mt-1 ${muted}`}>{SITE.callbackPromise}</p>
            {SITE.contentMode === 'concept' && (
              <p className={`mt-3 text-sm ${muted}`}>Это концепт-проект: данные формы не сохраняются и никуда не передаются.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  const field = (name: 'name' | 'phone' | 'comment') => ({
    id: `${uid}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${uid}-${name}-error` : undefined,
  })

  return (
    <form
      method="post"
      noValidate
      className="grid gap-4"
      data-testid="lead-form"
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(() => action(data))
      }}
    >
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="variant" value={variant} />
      <input type="hidden" name="startedAt" value={startedAt} />
      {context && <input type="hidden" name="context" value={context} />}
      {estimate && <input type="hidden" name="estimate" value={estimate} />}
      {quiz && <input type="hidden" name="quiz" value={quiz} />}
      {utm && <input type="hidden" name="utm" value={utm} />}
      {/* Ловушка для ботов: скрыта от людей и скринридеров */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Компания
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={`grid gap-4 ${extended ? '' : 'sm:grid-cols-2'}`}>
        <div>
          <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm font-medium">
            Имя
          </label>
          <input {...field('name')} type="text" autoComplete="name" required maxLength={60} className="field" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && (
            <p id={`${uid}-name-error`} className={`mt-1.5 text-sm ${errorText}`}>
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className="mb-1.5 block text-sm font-medium">
            Телефон
          </label>
          <input
            {...field('phone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="+7 (___) ___-__-__"
            ref={phoneRef}
            value={phone.value}
            onChange={(e) => setPhone(maskRuPhoneEdit(e.target.value, e.target.selectionStart ?? e.target.value.length))}
            className="field num"
          />
          {errors.phone && (
            <p id={`${uid}-phone-error`} className={`mt-1.5 text-sm ${errorText}`}>
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {extended && (
        <>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Как удобнее связаться</legend>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CONTACT_METHODS).map(([value, label]) => (
                <label
                  key={value}
                  className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 has-[:checked]:border-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                    dark ? 'border-white/30 has-[:checked]:bg-white/10' : 'border-line-strong has-[:checked]:bg-accent-soft'
                  }`}
                >
                  <input
                    type="radio"
                    name="contactMethod"
                    value={value}
                    checked={value === method}
                    onChange={() => setMethod(value)}
                    className="accent-[var(--c-accent-deco)]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor={`${uid}-comment`} className="mb-1.5 block text-sm font-medium">
              Комментарий <span className={muted}>(необязательно)</span>
            </label>
            <textarea
              {...field('comment')}
              rows={3}
              maxLength={1000}
              className="field min-h-24 resize-y"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            {errors.comment && (
              <p id={`${uid}-comment-error`} className={`mt-1.5 text-sm ${errorText}`}>
                {errors.comment}
              </p>
            )}
          </div>
        </>
      )}

      <div>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1 text-sm leading-snug">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--c-accent-deco)]"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${uid}-consent-error` : undefined}
          />
          <span>
            Даю{' '}
            <Link href="/soglasie" className="link" target="_blank">
              согласие на обработку персональных данных
            </Link>{' '}
            по{' '}
            <Link href="/privacy" className="link" target="_blank">
              политике конфиденциальности
            </Link>
          </span>
        </label>
        {errors.consent && (
          <p id={`${uid}-consent-error`} className={`mt-1.5 text-sm ${errorText}`}>
            {errors.consent}
          </p>
        )}
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {state.status === 'error' && (
          <p role="alert" className={`text-sm font-medium ${errorText}`}>
            {state.message}
            {!state.fieldErrors && (
              <>
                {state.message.endsWith(':') ? ' ' : ' Или позвоните: '}
                <a href={SITE.phoneHref} className="link num whitespace-nowrap">
                  {SITE.phoneDisplay}
                </a>
              </>
            )}
          </p>
        )}
      </div>

      <button type="submit" className={`btn w-full sm:w-auto sm:justify-self-start ${dark ? 'btn-light' : 'btn-primary'}`} disabled={pending || !startedAt}>
        {pending ? 'Отправляем…' : submitLabel}
        <span className="btn-dot">
          <ArrowUpRight aria-hidden className="size-4" />
        </span>
      </button>
    </form>
  )
}
