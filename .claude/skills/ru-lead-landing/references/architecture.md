# Архитектура и код

## 1. Стек

Next.js (App Router, статическая генерация, TypeScript strict + `noUncheckedIndexedAccess`) · React 19 · Tailwind CSS 4 · zod (только на сервере) · Vitest · Playwright + @axe-core/playwright · pnpm · Node 22. Перед стартом сверь актуальные версии и совместимость (например, Payload 3 поддерживает не любую версию Next).

Зависимостей в рантайме минимум: каждая библиотека — это килобайты на телефоне и поверхность для уязвимостей. Версии фиксируй точно, lockfile в git, `packageManager` и `.nvmrc` — чтобы сборка была воспроизводимой.

## 2. Структура

```
src/
  app/            layout (скрипты в <head>, шрифты, metadata), page, v/[variant], юр. страницы,
                  actions/lead.ts (server actions), smeta/[token]/route.ts, error.tsx, global-error.tsx,
                  robots.ts, sitemap.ts, fonts.ts, globals.css
  content/        site.ts (контакты, реквизиты, режим, мессенджеры, metrikaId), copy.ts (тексты секций),
                  pricing.ts (ставки), projects.ts, process.ts (этапы, FAQ), people.ts, legal.ts, variants.ts, types.ts
  lib/            pricing.ts (весь расчёт), format.ts, typography.ts (nbsp, plural), lead-schema.ts (zod, сервер),
                  lead-constants.ts (без zod, для клиента), lead-token.ts, client-ip.ts, rate-limit.ts,
                  leads/ (record, bitrix24, onec, deliver), notify.ts, analytics.ts, consent.ts,
                  theme.ts / reveal.ts / lazy-sections.ts (inline-скрипты <head>), smeta-token.ts, smeta-pdf.tsx
  components/     Landing, LandingProvider (окна, заявки), sections/*, modals/*, forms/LeadForm, ui/*
scripts/          lint-content.mjs, leads-check.ts, subset-fonts.py, h2-proxy.mjs, генерация PDF-образцов
tests/unit, tests/e2e
docs/             PLAN, CONTENT-SPEC, INTEGRATIONS, ADMIN-GUIDE, COMPLIANCE, QA, env.example
```

## 3. Слой контента

- Контент — типизированные объекты в `src/content/*.ts`, структура повторяет будущие коллекции CMS (Payload). Так переезд на админку — замена источника, а не переписывание.
- В клиентские компоненты контент лучше передавать пропсами из серверных: прямой импорт `@/content` в `'use client'` кладёт его в JS-бандл в третий раз (HTML + RSC + JS).
- `SITE.contentMode: 'concept' | 'client'` переключает дисклеймер, `noindex`, сохранение заявок, реквизиты.

## 4. Модуль цен

- Одна чистая функция на каждый расчёт (`priceFor`, `daysFor`, `breakdown`, `estimateFor`), модель передаётся параметром (`model = PRICING`) — удобно тестировать и подменять из CMS.
- Округление и формулы описаны комментарием в шапке модуля; эталонные числа из `CONTENT-SPEC` воспроизводит unit-тест.
- Всё, что показывает цену (H1, карточки, пакеты, калькулятор, квиз, PDF), берёт её только отсюда; линт запрещает цифры с ₽ и сроки в JSX.

## 5. Варианты под рекламу

```ts
// next.config.ts
const variantKeys = '(?<variant>fachwerk|monolith|scandi)'
async rewrites() {
  return { beforeFiles: [
    { source: '/', has: [{ type: 'query', key: 'v', value: variantKeys }], destination: '/v/:variant' },
    { source: '/', has: [{ type: 'query', key: 'utm_content', value: variantKeys }], missing: [{ type: 'query', key: 'v' }], destination: '/v/:variant' },
  ], afterFiles: [], fallback: [] }
}
```
`/v/[variant]` — `generateStaticParams` + `dynamicParams = false`, canonical на `/`.

## 6. Окна по ссылке

`LandingProvider` хранит открытое окно; `openProject(slug)` делает `pushState` с `?project=slug`, `popstate` закрывает. Окна грузятся через `next/dynamic` (`ssr: false`): их кода нет в первой волне JS.

## 7. Скрипты в `<head>`

Три маленьких самодостаточных inline-скрипта (без импортов, всё в `try`):
1. **Тема и лоадер** — ставит `data-theme`, решает `data-loader="skip"` (повторный визит, реклама, reduced motion).
2. **Появление блоков** — IntersectionObserver + MutationObserver, `data-in`/`data-from`.
3. **Ленивые блоки** — блоки ниже первого экрана с `content-visibility: auto`; при клике по `a[href^="#"]` (фаза захвата), `hashchange` и заходе с `#…` ставит `data-full-layout`, и страница раскладывается целиком, чтобы прокрутка встала точно. Для `scrollIntoView` из кода — `fullLayout()` перед вызовом.

## 8. Форма заявки на клиенте

- Отправка через `onSubmit` + `startTransition(() => formAction(fd))`, а не `<form action>`: в React 19 форма с `action` сбрасывается после ответа, и пропадают выбранные радиокнопки.
- Вызов server action — в `try/catch`: обрыв сети, 5xx, рассинхрон версий после деплоя («Server Action not found») иначе роняют всю страницу на английский экран Next. При ошибке — сообщение с телефоном. Плюс русские `error.tsx` и `global-error.tsx`.
- Константы и типы, нужные форме (`CONTACT_METHODS`, `HONEYPOT_FIELD`, `LeadState`), — в отдельном файле без zod: импорт из файла со схемой тянет zod со всеми локалями (~90 КБ gzip) в браузер.
- Метка времени запрашивается у сервера при первом фокусе (`issueLeadToken`), а не берётся из `Date.now()` в браузере.

## 9. PDF на сервере

- `@react-pdf/renderer` в `serverExternalPackages`, шрифты — **статические TrueType** (вариативные woff2 Chrome встраивает как Type 3, их ломают просмотрщики iOS, Telegram, Acrobat). Шрифты подключаются в трассировку: `outputFileTracingIncludes: { '/smeta/[token]': ['./scripts/pdf-fonts/*.ttf'] }`.
- Ссылка на персональную смету — HMAC-токен с параметрами и сроком жизни (7 дней), ключ из серверного env; неверный токен → 403.
- Тест: текст PDF извлекается (`pdftotext`), шрифты не Type 3 (`pdffonts`).

## 10. Безопасность по умолчанию

- Секреты только в серверных env (без `NEXT_PUBLIC_`). Номер счётчика Метрики и адрес сайта — не секреты.
- `poweredByHeader: false`; заголовки безопасности (`frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, nosniff, Referrer-Policy, Permissions-Policy, HSTS на прокси) — через `headers()` или прокси. Nonce в CSP ломает статическую генерацию: для статики используй `'unsafe-inline'` для своих inline-скриптов.
- `NEXT_PUBLIC_SITE_URL` обязателен при сборке в `client`, иначе canonical и sitemap укажут на localhost.
