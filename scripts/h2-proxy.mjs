// HTTP/2 (TLS) прокси перед `pnpm start` для замеров Lighthouse в условиях, близких к Vercel (сайт там отдаётся по HTTP/2).
// По HTTP/1.1 локального `next start` Lighthouse моделирует несколько соединений с отдельным «медленным стартом» и завышает время.
// Сертификат на 2 дня:  openssl req -x509 -newkey rsa:2048 -nodes -keyout .h2/key.pem -out .h2/cert.pem -days 2 -subj "/CN=localhost"
// Запуск:              node scripts/h2-proxy.mjs   → https://localhost:3443 (Chrome с флагом --ignore-certificate-errors)
// Порядок замера — docs/QA.md.
import http from 'node:http'
import http2 from 'node:http2'
import { readFileSync } from 'node:fs'

const TARGET = Number(process.env.TARGET_PORT ?? 3100)
const PORT = Number(process.env.PORT ?? 3443)
const HOP = new Set(['connection', 'keep-alive', 'transfer-encoding', 'upgrade', 'proxy-connection'])

const server = http2.createSecureServer({ key: readFileSync('.h2/key.pem'), cert: readFileSync('.h2/cert.pem'), allowHTTP1: true })
server.on('request', (req, res) => {
  const headers = {}
  for (const [k, v] of Object.entries(req.headers)) if (!k.startsWith(':') && !HOP.has(k)) headers[k] = v
  headers.host = `localhost:${TARGET}`
  headers['x-forwarded-proto'] = 'https'
  const upstream = http.request({ host: '127.0.0.1', port: TARGET, method: req.method, path: req.url, headers }, (r) => {
    const out = {}
    for (const [k, v] of Object.entries(r.headers)) if (!HOP.has(k)) out[k] = v
    res.writeHead(r.statusCode ?? 502, out)
    r.pipe(res)
  })
  upstream.on('error', () => {
    res.writeHead(502)
    res.end()
  })
  req.pipe(upstream)
})
server.listen(PORT, () => console.log(`HTTP/2: https://localhost:${PORT} → http://localhost:${TARGET}`))
