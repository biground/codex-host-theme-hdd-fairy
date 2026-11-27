// Pure frontend data projection & CH Web same-origin RPC client for H.D.D + Fairy usage telemetry.
// Talks directly to CodexHost's native /api/ch/v1/rpc gateway (zero backend subprocess).

export const ALL_FILTER = '__all__'
export const NONE_PROJECT_FILTER = '__none__'
export const USAGE_RANGES = Object.freeze(['today', '7d', '30d', '90d', 'all'])
const TOKENS_PER_THREE_BODY = 202_000
const DAY_MS = 86_400_000
const HEAT_CACHE_TTL_MS = 30_000

const HARNESS_DISPLAY_NAMES = Object.freeze({
  codex: 'Codex',
  'codex-usage': 'Codex',
  antigravity: 'Antigravity CLI',
  'claude-code': 'Claude Code',
  'deepseek-harness': 'DeepSeek',
  'cursor-cli': 'Cursor CLI',
  'kimi-code': 'Kimi Code',
  'qwen-code': 'Qwen Code',
  'kiro-cli': 'Kiro CLI',
  copilot: 'GitHub Copilot',
  opencode: 'OpenCode',
  codebuddy: 'CodeBuddy',
  workbuddy: 'WorkBuddy',
  qoder: 'Qoder',
  'qoder-cn': 'Qoder CN',
  devin: 'Devin',
  grok: 'Grok',
  hermes: 'Hermes',
  pi: 'Pi',
  omp: 'OMP',
  zcode: 'ZCode',
})

export function harnessDisplayName(id) {
  if (!id) return '—'
  if (HARNESS_DISPLAY_NAMES[id]) return HARNESS_DISPLAY_NAMES[id]
  return String(id)
    .replace(/-(?:usage|harness)$/u, '')
    .split(/[-_]+/u)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatCompactTokens(value) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—'
  const abs = Math.abs(value)
  const trimDecimals = (num) => {
    const raw = num >= 100 ? num.toFixed(0) : num >= 10 ? num.toFixed(1) : num.toFixed(2)
    return raw.replace(/\.0+$|(\.\d*?[1-9])0+$/u, '$1')
  }
  if (abs >= 1e9) return `${trimDecimals(value / 1e9)}B`
  if (abs >= 1e6) return `${trimDecimals(value / 1e6)}M`
  if (abs >= 1e4) return `${trimDecimals(value / 1e3)}K`
  return Math.round(value).toLocaleString('en-US')
}

export function formatInt(value) {
  return Number.isFinite(value) ? Math.round(value).toLocaleString('en-US') : '—'
}

export function formatUsd(value) {
  if (!Number.isFinite(value)) return '—'
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatPercent(rate, digits = 1) {
  if (rate === null || rate === undefined || !Number.isFinite(rate)) return '—'
  return `${(rate * 100).toFixed(digits)}%`
}

export function localDateKey(ms) {
  const d = new Date(ms)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function buildProjectOptions(projectPaths = []) {
  const basenameOf = (p) => String(p).split(/[\\/]+/u).filter(Boolean).at(-1) ?? String(p)
  const parentOf = (p) => String(p).split(/[\\/]+/u).filter(Boolean).at(-2) ?? ''
  const counts = new Map()
  for (const p of projectPaths) {
    if (p !== null && p !== undefined) {
      const base = basenameOf(p)
      counts.set(base, (counts.get(base) ?? 0) + 1)
    }
  }
  return projectPaths.map((p) => {
    if (p === null || p === undefined) {
      return { value: NONE_PROJECT_FILTER, label: null, title: '' }
    }
    const base = basenameOf(p)
    const parent = parentOf(p)
    const label = (counts.get(base) ?? 0) > 1 && parent ? `${parent}/${base}` : base
    return { value: p, label, title: p }
  })
}

export function buildDailyTokensMap(dailyEntries = []) {
  const map = new Map()
  for (const row of dailyEntries) {
    if (!row || typeof row.date !== 'string') continue
    const tokens = (Number(row.inputTokens) || 0) + (Number(row.outputTokens) || 0)
    if (tokens > 0) {
      map.set(row.date, (map.get(row.date) ?? 0) + tokens)
    }
  }
  return map
}

export function buildHeatmapCells(dailyTokensMap, { weeks = 26, nowMs = Date.now() } = {}) {
  const today = new Date(nowMs)
  today.setHours(12, 0, 0, 0)
  // Monday-based weekday index: Mon = 0 .. Sun = 6
  const todayMonIdx = (today.getDay() + 6) % 7
  const currentWeekMondayMs = today.getTime() - todayMonIdx * DAY_MS
  const firstMondayMs = currentWeekMondayMs - (weeks - 1) * 7 * DAY_MS

  const rawCells = []
  const positiveValues = []
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const cellMs = firstMondayMs + (w * 7 + d) * DAY_MS
      const isFuture = w === weeks - 1 && d > todayMonIdx
      if (isFuture) {
        rawCells.push({ pad: true, date: '', tokens: 0, level: 0 })
        continue
      }
      const date = localDateKey(cellMs)
      const tokens = dailyTokensMap?.get(date) ?? 0
      if (tokens > 0) positiveValues.push(tokens)
      rawCells.push({ pad: false, date, tokens, level: 0 })
    }
  }

  positiveValues.sort((a, b) => a - b)
  const quantile = (q) => {
    if (!positiveValues.length) return 0
    const idx = Math.min(positiveValues.length - 1, Math.max(0, Math.floor(q * (positiveValues.length - 1))))
    return positiveValues[idx]
  }
  const q1 = quantile(0.25)
  const q2 = quantile(0.5)
  const q3 = quantile(0.75)

  const levelOf = (tokens) => {
    if (!tokens || tokens <= 0) return 0
    if (positiveValues.length === 1) return 4
    if (tokens <= q1) return 1
    if (tokens <= q2) return 2
    if (tokens <= q3) return 3
    return 4
  }

  for (const cell of rawCells) {
    if (!cell.pad) cell.level = levelOf(cell.tokens)
  }

  return {
    cols: weeks,
    hasActivity: positiveValues.length > 0,
    cells: rawCells,
  }
}

function buildModelLabelMap(modelLabels = []) {
  const byModel = new Map()
  const ambiguous = new Set()
  for (const entry of modelLabels) {
    if (!entry?.model || !entry?.label) continue
    const prev = byModel.get(entry.model)
    if (prev && prev !== entry.label) {
      ambiguous.add(entry.model)
    } else {
      byModel.set(entry.model, entry.label)
    }
  }
  for (const key of ambiguous) byModel.delete(key)
  return byModel
}

export function projectUsageViewModel(stats, allRangeDailyStats = null, { nowMs = Date.now() } = {}) {
  const totals = stats?.totals ?? {}
  const inputTokens = Number(totals.inputTokens) || 0
  const outputTokens = Number(totals.outputTokens) || 0
  const cachedTokens = Number(totals.cachedInputTokens) || 0
  const cacheWriteTokens = Number(totals.cacheWriteInputTokens) || 0
  const totalTokens = inputTokens + outputTokens
  const uncachedInputTokens = Math.max(0, inputTokens - cachedTokens - cacheWriteTokens)
  const cacheHitInput = Number(totals.cacheHitInputTokens) || 0
  const cacheHitCached = Number(totals.cacheHitCachedInputTokens) || 0
  const cacheHitRate = cacheHitInput > 0 ? cacheHitCached / cacheHitInput : null

  const activeDaySet = new Set()
  for (const row of stats?.daily ?? []) {
    if (!row?.date) continue
    const hasWork = (Number(row.requests) || 0) > 0 || (Number(row.inputTokens) || 0) + (Number(row.outputTokens) || 0) > 0
    if (hasWork) activeDaySet.add(row.date)
  }

  const labelMap = buildModelLabelMap(stats?.modelLabels)
  const modelRows = [...(stats?.byModel ?? [])]
    .map((m) => {
      const mTotal = (Number(m.inputTokens) || 0) + (Number(m.outputTokens) || 0)
      const mHitIn = Number(m.cacheHitInputTokens) || 0
      const mHitCached = Number(m.cacheHitCachedInputTokens) || 0
      const id = m.model ?? null
      return {
        id,
        label: id ? labelMap.get(id) ?? id : null,
        tokens: mTotal,
        requests: Number(m.requests) || 0,
        costUsd: Number(m.costUsd) || 0,
        unpricedRequests: Number(m.unpricedRequests) || 0,
        share: totalTokens > 0 ? mTotal / totalTokens : 0,
        cacheHitRate: mHitIn > 0 ? mHitCached / mHitIn : null,
      }
    })
    .sort((a, b) => b.tokens - a.tokens || b.requests - a.requests)

  const harnessRows = [...(stats?.byHarness ?? [])]
    .map((h) => {
      const hTotal = (Number(h.inputTokens) || 0) + (Number(h.outputTokens) || 0)
      const hHitIn = Number(h.cacheHitInputTokens) || 0
      const hHitCached = Number(h.cacheHitCachedInputTokens) || 0
      return {
        id: h.harness,
        label: harnessDisplayName(h.harness),
        tokens: hTotal,
        requests: Number(h.requests) || 0,
        costUsd: Number(h.costUsd) || 0,
        unpricedRequests: Number(h.unpricedRequests) || 0,
        share: totalTokens > 0 ? hTotal / totalTokens : 0,
        cacheHitRate: hHitIn > 0 ? hHitCached / hHitIn : null,
      }
    })
    .sort((a, b) => b.tokens - a.tokens || b.requests - a.requests)

  const heatSourceDaily = allRangeDailyStats?.daily ?? stats?.daily ?? []
  const dailyTokensMap = buildDailyTokensMap(heatSourceDaily)

  const harnessOptions = (stats?.options?.harnesses ?? []).map((id) => ({
    value: id,
    label: harnessDisplayName(id),
    title: id,
  }))
  const projectOptions = buildProjectOptions(stats?.options?.projects ?? [])

  return {
    range: stats?.range ?? '30d',
    reading: stats?.reading ?? { complete: true, sources: 0, read: 0 },
    costUsd: Number(totals.costUsd) || 0,
    unpricedRequests: Number(totals.unpricedRequests) || 0,
    requests: Number(totals.requests) || 0,
    totalTokens,
    uncachedInputTokens,
    outputTokens,
    cachedTokens,
    cacheWriteTokens,
    activeDays: activeDaySet.size,
    cacheHitRate,
    topModelLabel: modelRows[0]?.label ?? null,
    threeBodyBooks: totalTokens > 0 ? Math.max(1, Math.round(totalTokens / TOKENS_PER_THREE_BODY)) : 0,
    modelRows,
    harnessRows,
    harnessOptions,
    projectOptions,
    dailyTokensMap,
    nowMs,
  }
}

function periodLabel(periodType, zh) {
  switch (periodType) {
    case 'five_hour':
      return zh ? '5 小时窗口' : '5h Window'
    case 'seven_day':
    case 'weekly':
      return zh ? '7 天窗口' : '7d Window'
    case 'monthly':
      return zh ? '月度配额' : 'Monthly Quota'
    default:
      return zh ? '配额窗口' : 'Quota Window'
  }
}

function formatResetAt(isoOrMs, locale) {
  if (!isoOrMs) return ''
  const ms = typeof isoOrMs === 'number' ? isoOrMs : Date.parse(isoOrMs)
  if (!Number.isFinite(ms)) return ''
  try {
    return new Intl.DateTimeFormat(locale || 'zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(ms)
  } catch {
    return new Date(ms).toLocaleString()
  }
}

function extractCreditsWindows(credits, zh, locale) {
  if (!credits || typeof credits !== 'object') return []
  const out = []
  if (Number.isFinite(credits.usedPercent)) {
    const title = credits.label || credits.scope?.label || periodLabel(credits.periodType, zh)
    const resetStr = formatResetAt(credits.resetsAt, locale)
    const capDetail =
      Number.isFinite(credits.used) && Number.isFinite(credits.limit)
        ? `${credits.used} / ${credits.limit}${credits.unit ? ` ${credits.unit}` : ''}`
        : ''
    out.push({
      label: title,
      usedPercent: Math.min(100, Math.max(0, Number(credits.usedPercent))),
      detail: [capDetail, resetStr ? `${zh ? '重置于' : 'Resets'} ${resetStr}` : ''].filter(Boolean).join(' · '),
    })
  }
  if (Array.isArray(credits.productUsage)) {
    for (const prod of credits.productUsage) {
      if (!prod || !Number.isFinite(prod.usagePercent)) continue
      const resetStr = formatResetAt(prod.resetsAt, locale)
      out.push({
        label: prod.scope?.label || prod.product,
        usedPercent: Math.min(100, Math.max(0, Number(prod.usagePercent))),
        detail: resetStr ? `${zh ? '重置于' : 'Resets'} ${resetStr}` : '',
      })
    }
  }
  return out
}

export function projectQuotaCards({ codexAccounts = [], harnessAccounts = [] } = {}, locale = 'zh-CN') {
  const zh = String(locale || 'zh-CN').toLowerCase().startsWith('zh')
  const cards = []

  for (const item of codexAccounts) {
    const summary = item?.summary ?? {}
    const inspection = item?.inspection ?? {}
    const usage = inspection?.usage ?? {}
    const windows = []

    if (Number.isFinite(usage.planFiveHourUsedPercent)) {
      const resetStr = usage.planFiveHourResetsAtUnix
        ? formatResetAt(usage.planFiveHourResetsAtUnix * 1000, locale)
        : ''
      windows.push({
        label: zh ? '5 小时窗口' : '5h Window',
        usedPercent: Math.min(100, Math.max(0, Number(usage.planFiveHourUsedPercent))),
        detail: resetStr ? `${zh ? '重置于' : 'Resets'} ${resetStr}` : '',
      })
    }
    if (Number.isFinite(usage.planSevenDayUsedPercent)) {
      const resetStr = usage.planSevenDayResetsAtUnix
        ? formatResetAt(usage.planSevenDayResetsAtUnix * 1000, locale)
        : ''
      windows.push({
        label: zh ? '7 天窗口' : '7d Window',
        usedPercent: Math.min(100, Math.max(0, Number(usage.planSevenDayUsedPercent))),
        detail: resetStr ? `${zh ? '重置于' : 'Resets'} ${resetStr}` : '',
      })
    }
    if (!windows.length && inspection?.accountCredits) {
      windows.push(...extractCreditsWindows(inspection.accountCredits, zh, locale))
    }

    const titleName = summary.label || summary.email || summary.accountId || 'Account'
    cards.push({
      title: `Codex · ${titleName}`,
      badge: summary.planType && summary.planType !== 'unknown' ? String(summary.planType).toUpperCase() : '',
      windows,
      balanceText: '',
    })
  }

  for (const acc of harnessAccounts) {
    if (!acc) continue
    const hName = acc.harnessName || harnessDisplayName(acc.harnessId)
    const subName = acc.label || acc.email || ''
    const title = subName && subName !== hName ? `${hName} · ${subName}` : hName
    const windows = extractCreditsWindows(acc.credits, zh, locale)
    const balanceText =
      acc.balance && Number.isFinite(acc.balance.amount)
        ? `${acc.balance.currency || ''} ${Number(acc.balance.amount).toFixed(2)}`.trim()
        : ''
    if (windows.length || balanceText) {
      cards.push({
        title,
        badge: acc.plan ? String(acc.plan).toUpperCase() : '',
        windows,
        balanceText,
      })
    }
  }

  return cards
}

export function createChWebUsageClient({ baseUri } = {}) {
  let heatCache = { key: '', at: 0, result: null }

  const resolveRpcUrl = () => {
    const base = baseUri || (typeof document !== 'undefined' ? document.baseURI : 'http://localhost/')
    return new URL('api/ch/v1/rpc', base).href
  }

  const callRpc = async (method, params = {}, signal) => {
    const res = await fetch(resolveRpcUrl(), {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ method, params }),
      signal,
    })
    const payload = await res.json().catch(() => null)
    if (!res.ok || !payload || payload.error) {
      const err = new Error(payload?.error?.message || `HTTP ${res.status}`)
      err.code = payload?.error?.code ?? res.status
      throw err
    }
    return payload.result
  }

  const buildFilterParams = ({ range, harness, project }) => {
    const params = { range }
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (tz) params.timeZone = tz
    } catch { /* Use Host local timezone */ }
    if (harness && harness !== ALL_FILTER) params.harness = harness
    if (project && project !== ALL_FILTER) {
      params.project = project === NONE_PROJECT_FILTER ? null : project
    }
    return params
  }

  const loadStatistics = async ({ range = '30d', harness = ALL_FILTER, project = ALL_FILTER, refresh = false } = {}, signal) => {
    const primaryPromise = callRpc(
      'codexhost/usage/statistics/get',
      buildFilterParams({ range, harness, project }),
      signal,
    )

    let allDailyResult = null
    if (range !== 'all') {
      const cacheKey = `${harness}|${project}`
      const now = Date.now()
      if (!refresh && heatCache.key === cacheKey && now - heatCache.at < HEAT_CACHE_TTL_MS && heatCache.result) {
        allDailyResult = heatCache.result
      } else {
        allDailyResult = await callRpc(
          'codexhost/usage/statistics/get',
          buildFilterParams({ range: 'all', harness, project }),
          signal,
        ).catch(() => null)
        if (allDailyResult) {
          heatCache = { key: cacheKey, at: Date.now(), result: allDailyResult }
        }
      }
    }

    const primary = await primaryPromise
    if (range === 'all' && primary) {
      heatCache = { key: `${harness}|${project}`, at: Date.now(), result: primary }
    }
    return projectUsageViewModel(primary, allDailyResult)
  }

  const loadQuotas = async ({ refresh = false, locale = 'zh-CN' } = {}, signal) => {
    const [codexListRes, harnessListRes] = await Promise.allSettled([
      callRpc('codexhost/account/list', {}, signal),
      callRpc('codexhost/harness/accounts/list', refresh ? { refresh: true } : {}, signal),
    ])

    const codexAccounts = []
    if (codexListRes.status === 'fulfilled' && Array.isArray(codexListRes.value?.accounts)) {
      const inspections = await Promise.allSettled(
        codexListRes.value.accounts.map((acc) =>
          callRpc(
            'codexhost/account/usage/inspect',
            refresh ? { accountId: acc.accountId, refresh: true } : { accountId: acc.accountId },
            signal,
          ).then((inspection) => ({ summary: acc, inspection })),
        ),
      )
      for (const item of inspections) {
        if (item.status === 'fulfilled') codexAccounts.push(item.value)
      }
    }

    const harnessAccounts =
      harnessListRes.status === 'fulfilled' && Array.isArray(harnessListRes.value?.accounts)
        ? harnessListRes.value.accounts
        : []

    return projectQuotaCards({ codexAccounts, harnessAccounts }, locale)
  }

  return {
    loadStatistics,
    loadQuotas,
  }
}
