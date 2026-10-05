// Watad admin API — zero dependencies, Node 18+.
// Public:  GET /api/content, POST /api/visits
// Admin:   POST /api/admin/login, GET /api/admin/stats,
//          GET/PUT /api/admin/costs, /api/admin/stations, /api/admin/products
import http from 'node:http'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Minimal .env loader so ADMIN_PASSWORD / PORT work without extra dependencies.
// Real environment variables always win over files. The dashboard path is a transition fallback.
function loadEnvFile(file) {
  try {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)
      if (!m || line.trim().startsWith('#')) continue
      if (!(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2')
    }
  } catch {
    /* no .env file */
  }
}

loadEnvFile(path.join(__dirname, '.env'))
loadEnvFile(path.join(__dirname, '..', 'dashboard', '.env'))

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data')
const CONTENT_FILE = path.join(DATA_DIR, 'content.json')
const VISITS_FILE = path.join(DATA_DIR, 'visits.json')
const SECRET_FILE = path.join(DATA_DIR, '.secret')
const SEED_FILE = path.join(__dirname, 'seed-content.json')
const PORT = Number(process.env.PORT || 4100)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000
const MAX_BODY = 512 * 1024

fs.mkdirSync(DATA_DIR, { recursive: true })

if (!process.env.ADMIN_PASSWORD) {
  console.warn('\n  ⚠  ADMIN_PASSWORD is not set — using the default "admin123". Set it before going live.\n')
}

// ---------- storage ----------
function writeJson(file, data) {
  const tmp = `${file}.${process.pid}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2))
  fs.renameSync(tmp, file)
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

function readSeedContent() {
  return JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'))
}

function hydrateContent(value) {
  const seed = readSeedContent()
  const next = structuredClone(value)
  let changed = false

  for (const lang of ['ar', 'en']) {
    next[lang] ||= {}
    for (const key of ['stations', 'stationsPage', 'costs', 'products']) {
      if (!next[lang][key] && seed[lang]?.[key]) {
        next[lang][key] = seed[lang][key]
        changed = true
      }
    }
  }

  return { content: next, changed }
}

let content = readJson(CONTENT_FILE, null)
if (!content) {
  content = readSeedContent()
  writeJson(CONTENT_FILE, content)
} else {
  const hydrated = hydrateContent(content)
  content = hydrated.content
  if (hydrated.changed) writeJson(CONTENT_FILE, content)
}

// visits: { days: { 'YYYY-MM-DD': { views, visitors: [ids], lang: {ar,en}, paths: {}, referrers: {} } }, allVisitors: [ids] }
const visits = readJson(VISITS_FILE, { days: {}, allVisitors: [] })
const allVisitors = new Set(visits.allVisitors)
let saveTimer = null

function scheduleVisitsSave() {
  if (saveTimer) return
  saveTimer = setTimeout(() => {
    saveTimer = null
    visits.allVisitors = [...allVisitors]
    writeJson(VISITS_FILE, visits)
  }, 1500)
}

function flushVisits() {
  if (saveTimer) clearTimeout(saveTimer)
  visits.allVisitors = [...allVisitors]
  writeJson(VISITS_FILE, visits)
}

const dayKey = (d = new Date()) => d.toISOString().slice(0, 10)

// ---------- auth ----------
let secret
try {
  secret = fs.readFileSync(SECRET_FILE, 'utf8')
} catch {
  secret = crypto.randomBytes(32).toString('hex')
  fs.writeFileSync(SECRET_FILE, secret, { mode: 0o600 })
}

const sign = (payload) => crypto.createHmac('sha256', secret).update(payload).digest('base64url')

function issueToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

function verifyToken(token) {
  if (!token) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  const a = Buffer.from(sig)
  const b = Buffer.from(sign(payload))
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now()
  } catch {
    return false
  }
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest()
  const hb = crypto.createHash('sha256').update(String(b)).digest()
  return crypto.timingSafeEqual(ha, hb)
}

// simple in-memory rate limiting
const buckets = new Map()
function limited(key, max, windowMs) {
  const now = Date.now()
  const b = buckets.get(key) || { n: 0, reset: now + windowMs }
  if (now > b.reset) {
    b.n = 0
    b.reset = now + windowMs
  }
  b.n += 1
  buckets.set(key, b)
  return b.n > max
}
setInterval(() => {
  const now = Date.now()
  for (const [k, b] of buckets) if (now > b.reset) buckets.delete(k)
}, 60_000).unref()

// ---------- validation ----------
const KINDS = ['pump', 'barrel', 'gas']
const TONES = ['dark', 'gold', 'blue']
const LANGS = ['ar', 'en']
const str = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

function cleanCards(cards) {
  if (!Array.isArray(cards) || cards.length > 30) throw new Error('Invalid cards')
  return cards.map((c) => {
    const value = str(String(c.value ?? ''), 20)
    if (!/^\d+([.,]\d+)?$/.test(value)) throw new Error(`Invalid price value: ${value}`)
    return {
      kind: KINDS.includes(c.kind) ? c.kind : 'pump',
      label: str(c.label, 120),
      product: str(c.product, 120),
      value,
      unit: str(c.unit, 20),
      tone: TONES.includes(c.tone) ? c.tone : 'dark',
    }
  })
}

function cleanPoints(points) {
  if (!Array.isArray(points) || points.length > 36) throw new Error('Invalid chart points')
  return points.map((p) => {
    const v = Number(p.v)
    if (!Number.isFinite(v) || v < 0) throw new Error('Invalid chart value')
    return { m: str(p.m, 12), v }
  })
}

function cleanLocations(list) {
  if (!Array.isArray(list) || list.length > 100) throw new Error('Invalid stations')
  return list.map((l) => ({
    name: str(l.name, 120),
    area: str(l.area, 160),
    status: str(l.status, 80),
    d: str(l.d, 800),
    points: (Array.isArray(l.points) ? l.points : []).map((p) => str(p, 160)).filter(Boolean).slice(0, 12),
  }))
}

function cleanProducts(section) {
  if (!section || typeof section !== 'object') throw new Error('Invalid products')
  if (!Array.isArray(section.items) || section.items.length > 50) throw new Error('Invalid product items')
  return {
    eyebrow: str(section.eyebrow, 80),
    title: str(section.title, 160),
    sub: str(section.sub, 300),
    items: section.items.map((item) => ({
      t: str(item.t, 120),
      d: str(item.d, 300),
      tag: str(item.tag, 80),
    })),
  }
}

// ---------- http helpers ----------
function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(status === 204 ? undefined : JSON.stringify(body))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('Payload too large'), { status: 413 }))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {})
      } catch {
        reject(Object.assign(new Error('Invalid JSON'), { status: 400 }))
      }
    })
    req.on('error', reject)
  })
}

const bump = (obj, key) => {
  if (!key) return
  if (!(key in obj) && Object.keys(obj).length >= 200) return
  obj[key] = (obj[key] || 0) + 1
}

function hostOf(referrer) {
  try {
    return new URL(referrer).host
  } catch {
    return ''
  }
}

// ---------- stats ----------
function buildStats(rangeDays) {
  const days = []
  const today = new Date()
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setUTCDate(d.getUTCDate() - i)
    const key = dayKey(d)
    const rec = visits.days[key]
    days.push({ date: key, views: rec?.views || 0, visitors: rec?.visitors?.length || 0 })
  }

  const langs = { ar: 0, en: 0 }
  const paths = {}
  const referrers = {}
  const rangeVisitors = new Set()
  let rangeViews = 0
  for (const day of days) {
    const rec = visits.days[day.date]
    if (!rec) continue
    rangeViews += rec.views
    rec.visitors.forEach((v) => rangeVisitors.add(v))
    for (const l of LANGS) langs[l] += rec.lang?.[l] || 0
    for (const [k, n] of Object.entries(rec.paths || {})) paths[k] = (paths[k] || 0) + n
    for (const [k, n] of Object.entries(rec.referrers || {})) referrers[k] = (referrers[k] || 0) + n
  }

  const top = (obj, n = 6) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([name, count]) => ({ name, count }))

  const todayRec = visits.days[dayKey()]
  const last7 = new Set()
  let last7Views = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setUTCDate(d.getUTCDate() - i)
    const rec = visits.days[dayKey(d)]
    if (rec) {
      last7Views += rec.views
      rec.visitors.forEach((v) => last7.add(v))
    }
  }

  const totalViews = Object.values(visits.days).reduce((sum, d) => sum + d.views, 0)

  return {
    totals: {
      totalViews,
      uniqueVisitors: allVisitors.size,
      todayViews: todayRec?.views || 0,
      todayVisitors: todayRec?.visitors?.length || 0,
      last7Views,
      last7Visitors: last7.size,
    },
    range: { days: rangeDays, views: rangeViews, visitors: rangeVisitors.size },
    series: days,
    langs,
    paths: top(paths),
    referrers: top(referrers),
  }
}

// ---------- static dashboard (production) ----------
const DIST = process.env.DASHBOARD_DIST || path.join(__dirname, '..', 'dashboard', 'dist')
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
}

/** Serves the built dashboard (npm run build) with an SPA fallback. Returns false if there is no build. */
function serveStatic(res, pathname) {
  const index = path.join(DIST, 'index.html')
  if (!fs.existsSync(index)) return false
  let file = path.normalize(path.join(DIST, decodeURIComponent(pathname)))
  if (!file.startsWith(DIST + path.sep)) file = index
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = index
  const ext = path.extname(file)
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  fs.createReadStream(file).pipe(res)
  return true
}

// ---------- routes ----------
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('X-Content-Type-Options', 'nosniff')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url, 'http://localhost')
  const ip = req.socket.remoteAddress || 'unknown'

  try {
    // --- public ---
    if (req.method === 'GET' && url.pathname === '/api/content') {
      return send(res, 200, content)
    }

    if (req.method === 'POST' && url.pathname === '/api/visits') {
      if (limited(`visit:${ip}`, 120, 60_000)) return send(res, 429, { error: 'Too many requests' })
      const body = await readBody(req)
      const visitorId = str(body.visitorId, 80)
      if (!visitorId) return send(res, 400, { error: 'visitorId required' })
      const key = dayKey()
      const rec = (visits.days[key] ||= { views: 0, visitors: [], lang: { ar: 0, en: 0 }, paths: {}, referrers: {} })
      rec.views += 1
      if (!rec.visitors.includes(visitorId)) rec.visitors.push(visitorId)
      allVisitors.add(visitorId)
      if (LANGS.includes(body.lang)) rec.lang[body.lang] += 1
      bump(rec.paths, str(body.path, 120) || '/')
      const ref = hostOf(str(body.referrer, 300))
      bump(rec.referrers, ref && ref !== req.headers.host ? ref : 'direct')
      scheduleVisitsSave()
      return send(res, 204)
    }

    // --- admin ---
    if (req.method === 'POST' && url.pathname === '/api/admin/login') {
      if (limited(`login:${ip}`, 8, 5 * 60_000)) return send(res, 429, { error: 'Too many attempts' })
      const body = await readBody(req)
      if (!safeEqual(body.password ?? '', ADMIN_PASSWORD)) return send(res, 401, { error: 'Wrong password' })
      return send(res, 200, { token: issueToken() })
    }

    if (url.pathname.startsWith('/api/admin/')) {
      const auth = req.headers.authorization || ''
      if (!verifyToken(auth.startsWith('Bearer ') ? auth.slice(7) : '')) return send(res, 401, { error: 'Unauthorized' })

      if (req.method === 'GET' && url.pathname === '/api/admin/stats') {
        const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '30', 10) || 30, 1), 365)
        return send(res, 200, buildStats(days))
      }

      if (req.method === 'GET' && url.pathname === '/api/admin/costs') {
        const pick = (l) => ({
          date: content[l].costs.date,
          cards: content[l].costs.cards,
          points: content[l].costs.chart.points,
        })
        return send(res, 200, { ar: pick('ar'), en: pick('en') })
      }

      if (req.method === 'PUT' && url.pathname === '/api/admin/costs') {
        const body = await readBody(req)
        const next = structuredClone(content)
        for (const lang of LANGS) {
          const src = body[lang]
          if (!src) throw Object.assign(new Error(`Missing ${lang}`), { status: 400 })
          next[lang].costs.date = str(src.date, 60)
          next[lang].costs.cards = cleanCards(src.cards)
          next[lang].costs.chart.points = cleanPoints(src.points)
        }
        content = next
        writeJson(CONTENT_FILE, content)
        return send(res, 200, { ok: true })
      }

      if (req.method === 'GET' && url.pathname === '/api/admin/stations') {
        return send(res, 200, {
          ar: { locations: content.ar.stationsPage.locations },
          en: { locations: content.en.stationsPage.locations },
        })
      }

      if (req.method === 'PUT' && url.pathname === '/api/admin/stations') {
        const body = await readBody(req)
        const next = structuredClone(content)
        for (const lang of LANGS) {
          if (!body[lang]) throw Object.assign(new Error(`Missing ${lang}`), { status: 400 })
          next[lang].stationsPage.locations = cleanLocations(body[lang].locations)
        }
        content = next
        writeJson(CONTENT_FILE, content)
        return send(res, 200, { ok: true })
      }

      if (req.method === 'GET' && url.pathname === '/api/admin/products') {
        return send(res, 200, {
          ar: content.ar.products,
          en: content.en.products,
        })
      }

      if (req.method === 'PUT' && url.pathname === '/api/admin/products') {
        const body = await readBody(req)
        const next = structuredClone(content)
        for (const lang of LANGS) {
          if (!body[lang]) throw Object.assign(new Error(`Missing ${lang}`), { status: 400 })
          next[lang].products = cleanProducts(body[lang])
        }
        content = next
        writeJson(CONTENT_FILE, content)
        return send(res, 200, { ok: true })
      }
    }

    if (req.method === 'GET' && !url.pathname.startsWith('/api/') && serveStatic(res, url.pathname)) return

    send(res, 404, { error: 'Not found' })
  } catch (err) {
    send(res, err.status || 400, { error: err.message || 'Bad request' })
  }
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use.`)
    console.error('Stop the other Node process, or set a different PORT in dashboard/.env and restart.')
    process.exit(1)
  }

  throw err
})

server.listen(PORT, () => console.log(`Watad API listening on http://localhost:${PORT}`))

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    flushVisits()
    process.exit(0)
  })
}
