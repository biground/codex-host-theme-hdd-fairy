import { renderHddIcon } from '../shared/hdd-icons.mjs'
import { MOBILE_MEDIA, USAGE_PRESETS, isZhLocale } from '../shared/fairy-core.mjs'
import {
  ALL_FILTER,
  NONE_PROJECT_FILTER,
  buildHeatmapCells,
  createChWebUsageClient,
  formatCompactTokens,
  formatInt,
  formatPercent,
  formatUsd,
} from './usage-data.mjs'
import { USAGE_PANEL_CSS } from './usage-panel-css.mjs'

const DEFAULT_POLL_DELAY_MS = 3500
const COLD_MAX_POLLS = 6
const WARM_MAX_POLLS = 1

function messages(locale) {
  const zh = isZhLocale(locale)
  return {
    tabOverview: zh ? '概览' : 'Overview',
    tabModels: zh ? '模型' : 'Models',
    tabHarness: 'Harness',
    tabQuota: zh ? '模型配额' : 'Quotas',
    presetAmber: zh ? '黑金' : 'Amber',
    presetStreet: zh ? '街头' : 'Street',
    presetArchive: zh ? '绳网' : 'Archive',
    expandPanel: zh ? '展开面板' : 'Expand',
    expandShort: zh ? '展开' : 'Open',
    foldPanel: zh ? '折叠' : 'Collapse',
    foldShort: zh ? '收起' : 'Fold',
    refresh: zh ? '刷新统计' : 'Refresh usage',
    rangeToday: zh ? '今天' : 'Today',
    range7d: zh ? '7 天' : '7d',
    range30d: zh ? '30 天' : '30d',
    range90d: zh ? '90 天' : '90d',
    rangeAll: zh ? '全部' : 'All',
    allHarnesses: zh ? '全部 Harness' : 'All Harnesses',
    allProjects: zh ? '全部项目' : 'All Projects',
    noProject: zh ? '无工作区会话' : 'No Workspace',
    cost: zh ? '费用' : 'Cost',
    requests: zh ? '请求数' : 'Requests',
    requestsShort: zh ? '请求' : 'Reqs',
    totalTokens: zh ? 'Token 总量' : 'Total Tokens',
    activeDays: zh ? '活跃天数' : 'Active Days',
    cacheHitRate: zh ? '缓存命中率' : 'Cache Hit Rate',
    cacheShort: zh ? '缓存' : 'Cache',
    topModel: zh ? '最常用模型' : 'Top Model',
    topShort: zh ? '主力' : 'Top',
    inputShort: zh ? '输入' : 'In',
    outputShort: zh ? '输出' : 'Out',
    unpriced: (n) => (zh ? `${n} 个请求未计价` : `${n} unpriced`),
    pricedAll: zh ? '全部请求均已计价' : 'All requests priced',
    readingSync: (read, total) =>
      total > 0
        ? zh ? `正在建立索引 ${read}/${total}…` : `Indexing ${read}/${total}…`
        : zh ? '正在读取本地会话记录…' : 'Reading local session logs…',
    allSourcesSynced: zh ? '全量本地记录已就绪' : 'All local records synced',
    activeStreak: zh ? '周期内有请求记录天数' : 'Days with recorded usage',
    cacheExcellent: zh ? '高频上下文复用率' : 'Context reuse efficiency',
    primaryEngine: zh ? '周期内主力引擎' : 'Primary model in range',
    heatTitleDesk: zh ? '近 26 周算力深潜热力分布' : '26-week usage heatmap',
    heatTitleMob: zh ? '近 16 周热力' : '16-week heatmap',
    less: zh ? '少' : 'Less',
    more: zh ? '多' : 'More',
    funAmber: (n) =>
      zh
        ? `Fairy 算力审计：Token 累计相当于 ${n} 本《三体》，新艾利都电费账单已记入法厄同账户。`
        : `Fairy Audit: Token volume equals ${n} copies of The Three-Body Problem.`,
    funStreet: (n, rate) =>
      zh
        ? `绳网情报：累计吞吐相当于 ${n} 本《三体》${rate ? ` · 以太缓存适格率 ${rate}` : ''}！`
        : `Inter-Knot: Throughput equals ${n} copies of The Three-Body Problem!`,
    funArchive: (n) =>
      zh
        ? `你的 Token 用量相当于 ${n} 本《三体》（约合 Random Play 特级录像带档案库）。`
        : `Your Token usage equals ${n} copies of The Three-Body Problem.`,
    funShortMob: (n) => (zh ? `≈ ${n} 本《三体》` : `≈ ${n} books`),
    sourceText: zh ? '数据源: codexhost 用量统计' : 'Source: codexhost usage statistics',
    sourceShort: zh ? 'codexhost 统计' : 'codexhost stats',
    colModel: zh ? '模型' : 'Model',
    colHarness: 'Harness',
    colShare: zh ? '占比' : 'Share',
    colTokens: 'Tokens',
    colRequests: zh ? '请求数' : 'Reqs',
    colCache: zh ? '缓存率' : 'Cache',
    colCost: zh ? '费用' : 'Cost',
    unknownModel: zh ? '未标记模型' : 'Unknown model',
    noActivity: zh ? '当前筛选范围内暂无用量记录' : 'No usage recorded in this range',
    noQuotas: zh ? '当前未检测到可读取的账号窗口配额或余额' : 'No account quota windows or balances reported',
    loading: zh ? '正在读取 CodexHost 用量统计…' : 'Loading CodexHost usage statistics…',
    prepaidBalance: zh ? '账户可用余额' : 'Available Balance',
  }
}

function el(doc, tag, props = {}, ...children) {
  const node = doc.createElement(tag)
  for (const [k, v] of Object.entries(props)) {
    if (v === null || v === undefined || v === false) continue
    if (k === 'class') node.className = v
    else if (k === 'dataset') {
      for (const [dk, dv] of Object.entries(v)) {
        if (dv !== undefined && dv !== null) node.dataset[dk] = String(dv)
      }
    } else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v)
    } else if (k === 'style' && typeof v === 'object') {
      for (const [sk, sv] of Object.entries(v)) node.style.setProperty(sk, String(sv))
    } else {
      node.setAttribute(k, String(v))
    }
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue
    node.append(typeof child === 'string' ? doc.createTextNode(child) : child)
  }
  return node
}

function icon(doc, name) {
  const span = el(doc, 'span', { class: 'hf-up-icon', 'aria-hidden': 'true' })
  span.innerHTML = renderHddIcon(name, { size: 14 })
  return span
}

function vmSignature(vm, quotaCards) {
  if (!vm) return 'null'
  return [
    vm.range,
    vm.requests,
    vm.totalTokens,
    vm.costUsd.toFixed(2),
    vm.unpricedRequests,
    vm.activeDays,
    vm.cacheHitRate !== null ? vm.cacheHitRate.toFixed(4) : 'na',
    vm.topModelLabel || '',
    vm.modelRows.length,
    vm.harnessRows.length,
    vm.dailyTokensMap?.size ?? 0,
    quotaCards ? quotaCards.length : -1,
  ].join('|')
}

export function mountUsagePanel(shadowRoot, {
  doc = document,
  win = window,
  client = createChWebUsageClient(),
  initialSettings,
  getLocale = () => 'zh-CN',
  hddLogoUrl = '',
  pollDelayMs = DEFAULT_POLL_DELAY_MS,
  onPresetSelect,
  onExpandedChange,
} = {}) {
  const styleEl = doc.createElement('style')
  styleEl.textContent = USAGE_PANEL_CSS
  const root = doc.createElement('div')
  root.className = 'hf-up-root'
  shadowRoot.append(styleEl, root)

  const abortCtrl = new AbortController()
  const mobileMedia = win?.matchMedia?.(MOBILE_MEDIA) ?? { matches: false }

  let preset = USAGE_PRESETS.includes(initialSettings?.webUsagePreset) ? initialSettings.webUsagePreset : 'amber'
  let expanded = Boolean(initialSettings?.webUsageDefaultExpanded)
  let userToggledExpanded = false
  let justExpanded = false
  let tab = 'overview'
  let range = '30d'
  let harness = ALL_FILTER
  let project = ALL_FILTER

  let vm = null
  let quotaCards = null
  let loadingStats = false
  let loadingQuotas = false
  let errorMsg = ''
  let pollTimer = 0
  let pollCount = 0
  let reqSeq = 0
  let quotaSeq = 0
  let disposed = false

  // Persistent Expanded DOM Shell References (prevents full-panel replacement & animation replay!)
  let mountedMode = null // 'collapsed-desk' | 'collapsed-mob' | 'expanded-desk' | 'expanded-mob'
  let mountedLocale = ''
  let panelShell = null
  let refreshBtn = null
  let filterHost = null
  let bodyHost = null
  let tabBtnMap = new Map()
  let presetBtnMap = new Map()
  let lastFilterOptionsKey = ''
  let lastBodyRenderKey = ''

  const syncSpinState = () => {
    if (refreshBtn) {
      refreshBtn.classList.toggle('is-spinning', Boolean(loadingStats || loadingQuotas))
    }
  }

  const notifyExpanded = () => {
    onExpandedChange?.(expanded)
  }

  const pickPreset = (nextPreset, event) => {
    event?.stopPropagation?.()
    if (!USAGE_PRESETS.includes(nextPreset) || nextPreset === preset) return
    preset = nextPreset
    root.dataset.preset = preset
    updateView({ forceBody: true })
    onPresetSelect?.(nextPreset)
  }

  const setExpanded = (next) => {
    const val = Boolean(next)
    if (val === expanded) return
    expanded = val
    userToggledExpanded = true
    justExpanded = val
    updateView({ forceBody: true })
    notifyExpanded()
    if (expanded && tab === 'quota' && !quotaCards && !loadingQuotas) {
      void fetchQuotas(false)
    }
  }

  const fetchStats = async (refresh = false, isPoll = false) => {
    clearTimeout(pollTimer)
    if (!isPoll) pollCount = 0
    const seq = ++reqSeq
    loadingStats = true
    syncSpinState()
    if (!vm && !isPoll) updateView({ forceBody: true })

    try {
      // Background polls use refresh=false so they never re-trigger new Host scans or bypass heatCache
      const nextVm = await client.loadStatistics(
        { range, harness, project, refresh: isPoll ? false : refresh },
        abortCtrl.signal,
      )
      if (disposed || seq !== reqSeq) return
      vm = nextVm
      errorMsg = ''
    } catch (err) {
      if (disposed || seq !== reqSeq) return
      errorMsg = String(err?.message || err || 'Failed to load usage statistics')
    }
    loadingStats = false
    syncSpinState()
    updateView({ forceBody: !isPoll })

    if (!errorMsg && vm?.reading?.complete === false) {
      const hasWarmData = (vm.requests || 0) > 0 || (vm.totalTokens || 0) > 0
      const maxPolls = hasWarmData ? WARM_MAX_POLLS : COLD_MAX_POLLS
      if (pollCount < maxPolls) {
        pollCount += 1
        pollTimer = setTimeout(() => {
          void fetchStats(false, true)
        }, pollDelayMs)
      }
    }
  }

  const fetchQuotas = async (refresh = false) => {
    const seq = ++quotaSeq
    loadingQuotas = true
    syncSpinState()
    if (!quotaCards) updateView({ forceBody: true })
    try {
      const nextCards = await client.loadQuotas({ refresh, locale: getLocale() }, abortCtrl.signal)
      if (disposed || seq !== quotaSeq) return
      quotaCards = nextCards
    } catch {
      if (disposed || seq !== quotaSeq) return
      quotaCards = []
    }
    loadingQuotas = false
    syncSpinState()
    updateView({ forceBody: true })
  }

  const rangeLabelOf = (r, t) => {
    switch (r) {
      case 'today': return t.rangeToday
      case '7d': return t.range7d
      case '30d': return t.range30d
      case '90d': return t.range90d
      default: return t.rangeAll
    }
  }

  const renderCollapsedBar = (t, isMobile) => {
    const costStr = vm ? formatUsd(vm.costUsd) : '—'
    const reqStr = vm ? formatInt(vm.requests) : '—'
    const tokStr = vm ? formatCompactTokens(vm.totalTokens) : '—'
    const cacheStr = vm ? formatPercent(vm.cacheHitRate) : '—'
    const topStr = vm?.topModelLabel || '—'
    const rLabel = rangeLabelOf(range, t).replace(/\s+/gu, '')

    if (isMobile) {
      return el(
        doc,
        'div',
        { class: 'hf-up-bar', onClick: () => setExpanded(true) },
        el(
          doc,
          'div',
          { class: 'hf-up-bar-top-mob' },
          el(
            doc,
            'div',
            { class: 'hf-up-bar-main' },
            hddLogoUrl ? el(doc, 'img', { class: 'hf-up-logo', src: hddLogoUrl, alt: '' }) : null,
            el(doc, 'span', { class: 'hf-up-period-tag' }, rLabel),
            el(doc, 'span', { class: 'hf-up-bm is-accent' }, el(doc, 'strong', {}, costStr)),
          ),
          el(
            doc,
            'div',
            { class: 'hf-up-bar-right' },
            el(
              doc,
              'button',
              {
                type: 'button',
                class: 'hf-up-expand-btn',
                onClick: (e) => {
                  e.stopPropagation()
                  setExpanded(true)
                },
              },
              icon(doc, 'chevron-down'),
              t.expandShort,
            ),
          ),
        ),
        el(
          doc,
          'div',
          { class: 'hf-up-bar-metrics' },
          el(doc, 'span', { class: 'hf-up-bm' }, el(doc, 'strong', {}, tokStr)),
          el(doc, 'span', {}, '·'),
          el(doc, 'span', { class: 'hf-up-bm' }, `${reqStr} ${t.requestsShort}`),
          el(doc, 'span', {}, '·'),
          el(doc, 'span', { class: 'hf-up-bm' }, `${t.cacheShort} ${cacheStr}`),
          el(doc, 'span', {}, '·'),
          el(doc, 'span', { class: 'hf-up-bm hf-up-bm-mono' }, el(doc, 'strong', {}, topStr)),
        ),
      )
    }

    return el(
      doc,
      'div',
      { class: 'hf-up-bar' },
      el(
        doc,
        'div',
        { class: 'hf-up-bar-main', onClick: () => setExpanded(true) },
        hddLogoUrl ? el(doc, 'img', { class: 'hf-up-logo', src: hddLogoUrl, alt: '' }) : null,
        el(doc, 'span', { class: 'hf-up-period-tag' }, rLabel),
        el(
          doc,
          'div',
          { class: 'hf-up-bar-metrics' },
          el(doc, 'span', { class: 'hf-up-bm is-accent' }, t.cost, el(doc, 'strong', {}, costStr)),
          el(doc, 'span', { class: 'hf-up-sep' }),
          el(doc, 'span', { class: 'hf-up-bm' }, t.requestsShort, el(doc, 'strong', {}, reqStr)),
          el(doc, 'span', { class: 'hf-up-sep' }),
          el(doc, 'span', { class: 'hf-up-bm' }, 'Token', el(doc, 'strong', {}, tokStr)),
          el(doc, 'span', { class: 'hf-up-sep' }),
          el(doc, 'span', { class: 'hf-up-bm' }, t.cacheShort, el(doc, 'strong', {}, cacheStr)),
          el(doc, 'span', { class: 'hf-up-sep' }),
          el(doc, 'span', { class: 'hf-up-bm hf-up-bm-mono' }, t.topShort, el(doc, 'strong', {}, topStr)),
        ),
      ),
      el(
        doc,
        'div',
        { class: 'hf-up-bar-right' },
        el(
          doc,
          'button',
          {
            type: 'button',
            class: 'hf-up-expand-btn',
            onClick: () => setExpanded(true),
          },
          icon(doc, 'chevron-down'),
          t.expandPanel,
        ),
      ),
    )
  }

  const renderOverviewBody = (t, isMobile) => {
    if (!vm) {
      return [el(doc, 'div', { class: 'hf-up-empty' }, errorMsg || t.loading)]
    }

    // Only display cold-sync progress when zero requests have arrived yet; avoids flipping text on warm incremental refreshes
    const isColdSyncing = vm.requests === 0 && vm.totalTokens === 0 && vm.reading && !vm.reading.complete
    const syncNote = isColdSyncing
      ? t.readingSync(vm.reading.read, vm.reading.sources)
      : t.allSourcesSynced

    const cards = [
      {
        hero: true,
        label: t.cost,
        val: formatUsd(vm.costUsd),
        subs: [vm.unpricedRequests > 0 ? t.unpriced(formatInt(vm.unpricedRequests)) : t.pricedAll],
      },
      {
        label: t.requests,
        val: formatInt(vm.requests),
        subs: [syncNote],
      },
      {
        label: t.totalTokens,
        val: formatCompactTokens(vm.totalTokens),
        title: formatInt(vm.totalTokens),
        subs: [
          `${t.inputShort} ${formatCompactTokens(vm.uncachedInputTokens)}`,
          `${t.outputShort} ${formatCompactTokens(vm.outputTokens)}`,
          `${t.cacheShort} ${formatCompactTokens(vm.cachedTokens)}`,
        ],
      },
      {
        label: t.activeDays,
        val: formatInt(vm.activeDays),
        subs: [t.activeStreak],
      },
      {
        label: t.cacheHitRate,
        val: formatPercent(vm.cacheHitRate),
        subs: [t.cacheExcellent],
      },
      {
        label: t.topModel,
        val: vm.topModelLabel || '—',
        isModel: true,
        subs: [t.primaryEngine],
      },
    ]

    const heat = buildHeatmapCells(vm.dailyTokensMap, {
      weeks: isMobile ? 16 : 26,
      nowMs: vm.nowMs,
    })

    const booksStr = formatInt(vm.threeBodyBooks)
    const funLine = isMobile
      ? t.funShortMob(booksStr)
      : preset === 'street'
        ? t.funStreet(booksStr, vm.cacheHitRate !== null ? formatPercent(vm.cacheHitRate) : '')
        : preset === 'archive'
          ? t.funArchive(booksStr)
          : t.funAmber(booksStr)

    return [
      el(
        doc,
        'div',
        { class: 'hf-up-cards' },
        cards.map((c) =>
          el(
            doc,
            'div',
            { class: `hf-up-card${c.hero ? ' is-hero' : ''}` },
            el(
              doc,
              'div',
              { class: 'hf-up-card-lbl' },
              el(doc, 'span', {}, c.label),
              el(doc, 'span', { class: 'hf-up-card-mark' }),
            ),
            el(
              doc,
              'div',
              { class: `hf-up-card-val${c.isModel ? ' is-model' : ''}`, title: c.title || c.val },
              c.val,
            ),
            el(
              doc,
              'div',
              { class: 'hf-up-card-sub' },
              c.subs.map((s) => el(doc, 'span', {}, s)),
            ),
          ),
        ),
      ),
      el(
        doc,
        'div',
        { class: 'hf-up-heatbox' },
        el(
          doc,
          'div',
          { class: 'hf-up-heatgrid' },
          heat.cells.map((cell) =>
            cell.pad
              ? el(doc, 'span', { class: 'hf-up-hm is-pad' })
              : el(doc, 'span', {
                  class: `hf-up-hm lv-${cell.level}`,
                  title: `${cell.date} · ${formatCompactTokens(cell.tokens)} tokens`,
                }),
          ),
        ),
        el(
          doc,
          'div',
          { class: 'hf-up-heatfoot' },
          el(doc, 'span', {}, isMobile ? t.heatTitleMob : t.heatTitleDesk),
          el(
            doc,
            'div',
            { class: 'hf-up-legend', 'aria-hidden': 'true' },
            el(doc, 'span', {}, t.less),
            [0, 1, 2, 3, 4].map((lv) => el(doc, 'span', { class: `hf-up-hm lv-${lv}` })),
            el(doc, 'span', {}, t.more),
          ),
        ),
      ),
      el(
        doc,
        'div',
        { class: 'hf-up-footer' },
        el(doc, 'div', { class: 'hf-up-fun' }, icon(doc, 'activity'), vm.threeBodyBooks > 0 ? funLine : syncNote),
        el(doc, 'div', { class: 'hf-up-src' }, isMobile ? t.sourceShort : t.sourceText),
      ),
    ]
  }

  const renderTableBody = (rows, colTitle, isMonoName, t, isMobile) => {
    if (!vm) return [el(doc, 'div', { class: 'hf-up-empty' }, errorMsg || t.loading)]
    if (!rows.length) return [el(doc, 'div', { class: 'hf-up-empty' }, t.noActivity)]

    return [
      el(
        doc,
        'div',
        { class: 'hf-up-table' },
        el(
          doc,
          'div',
          { class: 'hf-up-trow is-head' },
          el(doc, 'span', {}, colTitle),
          el(doc, 'span', {}, t.colShare),
          el(doc, 'span', { class: 'hf-up-tnum' }, t.colTokens),
          el(doc, 'span', { class: 'hf-up-tnum is-hide-mob' }, t.colRequests),
          el(doc, 'span', { class: 'hf-up-tnum is-hide-mob' }, t.colCache),
          el(doc, 'span', { class: 'hf-up-tnum' }, t.colCost),
        ),
        rows.map((r) =>
          el(
            doc,
            'div',
            { class: 'hf-up-trow' },
            el(
              doc,
              'span',
              { class: `hf-up-tname${isMonoName ? ' is-mono' : ''}`, title: r.id || r.label || t.unknownModel },
              r.label || t.unknownModel,
            ),
            el(
              doc,
              'span',
              { class: 'hf-up-share' },
              el(
                doc,
                'span',
                { class: 'hf-up-share-track' },
                el(doc, 'span', {
                  class: 'hf-up-share-fill',
                  style: { width: `${Math.max(2, r.share * 100).toFixed(1)}%` },
                }),
              ),
              el(doc, 'span', { class: 'hf-up-share-pct' }, formatPercent(r.share, 0)),
            ),
            el(doc, 'span', { class: 'hf-up-tnum', title: formatInt(r.tokens) }, formatCompactTokens(r.tokens)),
            el(doc, 'span', { class: 'hf-up-tnum is-hide-mob' }, formatInt(r.requests)),
            el(doc, 'span', { class: 'hf-up-tnum is-hide-mob' }, formatPercent(r.cacheHitRate, 0)),
            el(doc, 'span', { class: 'hf-up-tnum' }, r.costUsd > 0 ? formatUsd(r.costUsd) : '—'),
          ),
        ),
      ),
      el(
        doc,
        'div',
        { class: 'hf-up-footer' },
        el(doc, 'div', { class: 'hf-up-fun' }, icon(doc, 'activity'), `${t.requests}: ${formatInt(vm.requests)} · Tokens: ${formatCompactTokens(vm.totalTokens)}`),
        el(doc, 'div', { class: 'hf-up-src' }, isMobile ? t.sourceShort : t.sourceText),
      ),
    ]
  }

  const renderQuotaBody = (t, isMobile) => {
    if (loadingQuotas && !quotaCards) {
      return [el(doc, 'div', { class: 'hf-up-empty' }, t.loading)]
    }
    if (!quotaCards || !quotaCards.length) {
      return [el(doc, 'div', { class: 'hf-up-empty' }, t.noQuotas)]
    }
    return [
      el(
        doc,
        'div',
        { class: 'hf-up-quotas' },
        quotaCards.map((card) =>
          el(
            doc,
            'div',
            { class: 'hf-up-qcard' },
            el(
              doc,
              'div',
              { class: 'hf-up-qhead' },
              el(doc, 'span', { class: 'hf-up-qtitle', title: card.title }, card.title),
              card.badge ? el(doc, 'span', { class: 'hf-up-qbadge' }, card.badge) : null,
            ),
            card.windows.map((w) =>
              el(
                doc,
                'div',
                { class: 'hf-up-qwin' },
                el(
                  doc,
                  'div',
                  { class: 'hf-up-qwin-top' },
                  el(doc, 'span', {}, w.label),
                  el(doc, 'strong', {}, `${w.usedPercent.toFixed(0)}%`),
                ),
                el(
                  doc,
                  'span',
                  { class: 'hf-up-qtrack' },
                  el(doc, 'span', {
                    class: `hf-up-qfill${w.usedPercent >= 88 ? ' is-hot' : ''}`,
                    style: { width: `${w.usedPercent.toFixed(1)}%` },
                  }),
                ),
                w.detail ? el(doc, 'div', { class: 'hf-up-qdetail' }, w.detail) : null,
              ),
            ),
            card.balanceText
              ? el(
                  doc,
                  'div',
                  { class: 'hf-up-qwin' },
                  el(doc, 'div', { class: 'hf-up-qdetail' }, t.prepaidBalance),
                  el(doc, 'div', { class: 'hf-up-qbal' }, card.balanceText),
                )
              : null,
          ),
        ),
      ),
      el(
        doc,
        'div',
        { class: 'hf-up-footer' },
        el(doc, 'div', { class: 'hf-up-fun' }, icon(doc, 'activity'), ''),
        el(doc, 'div', { class: 'hf-up-src' }, isMobile ? t.sourceShort : t.sourceText),
      ),
    ]
  }

  const buildSelect = (value, options, allLabel, noProjectLabel, onChange) => {
    const sel = el(
      doc,
      'select',
      { class: 'hf-up-select', onChange: (e) => onChange(e.target.value) },
      el(doc, 'option', { value: ALL_FILTER }, allLabel),
      options.map((opt) =>
        el(
          doc,
          'option',
          { value: opt.value, title: opt.title || opt.label || '' },
          opt.label ?? noProjectLabel,
        ),
      ),
    )
    if (value !== ALL_FILTER && !options.some((o) => o.value === value)) {
      sel.append(el(doc, 'option', { value }, value === NONE_PROJECT_FILTER ? noProjectLabel : value))
    }
    sel.value = value
    return sel
  }

  const buildExpandedShell = (t, isMobile) => {
    tabBtnMap = new Map()
    presetBtnMap = new Map()
    lastFilterOptionsKey = ''
    lastBodyRenderKey = ''

    const tabs = [
      ['overview', t.tabOverview],
      ['models', t.tabModels],
      ['harness', t.tabHarness],
      ['quota', t.tabQuota],
    ]

    refreshBtn = el(
      doc,
      'button',
      {
        type: 'button',
        class: `hf-up-icon-btn${loadingStats || loadingQuotas ? ' is-spinning' : ''}`,
        title: t.refresh,
        'aria-label': t.refresh,
        onClick: () => {
          if (tab === 'quota') void fetchQuotas(true)
          else void fetchStats(true, false)
        },
      },
      icon(doc, 'refresh'),
    )

    filterHost = el(doc, 'div', { class: 'hf-up-filter-slot' })
    bodyHost = el(doc, 'div', { class: 'hf-up-body-slot' })

    panelShell = el(
      doc,
      'div',
      {
        class: `hf-up-panel${justExpanded ? ' is-entering' : ''}`,
        onAnimationend: () => panelShell?.classList.remove('is-entering'),
      },
      el(
        doc,
        'div',
        { class: 'hf-up-inner' },
        el(
          doc,
          'div',
          { class: 'hf-up-header' },
          el(
            doc,
            'div',
            { class: 'hf-up-tabs-wrap' },
            !isMobile && hddLogoUrl ? el(doc, 'img', { class: 'hf-up-logo', src: hddLogoUrl, alt: '' }) : null,
            el(
              doc,
              'div',
              { class: 'hf-up-tabs', role: 'tablist' },
              tabs.map(([id, label]) => {
                const btn = el(
                  doc,
                  'button',
                  {
                    type: 'button',
                    role: 'tab',
                    class: 'hf-up-tab',
                    'aria-selected': String(tab === id),
                    onClick: () => {
                      if (tab === id) return
                      tab = id
                      updateView({ forceBody: true })
                      if (tab === 'quota' && !quotaCards && !loadingQuotas) {
                        void fetchQuotas(false)
                      }
                    },
                  },
                  label,
                )
                tabBtnMap.set(id, btn)
                return btn
              }),
            ),
          ),
          el(
            doc,
            'div',
            { class: 'hf-up-header-right' },
            refreshBtn,
            el(
              doc,
              'button',
              {
                type: 'button',
                class: 'hf-up-fold-btn',
                onClick: () => setExpanded(false),
              },
              icon(doc, 'chevron-up'),
              isMobile ? t.foldShort : t.foldPanel,
            ),
          ),
        ),
        filterHost,
        bodyHost,
      ),
    )

    justExpanded = false
    return panelShell
  }

  const updateExpandedInPlace = (t, isMobile, { forceBody = false } = {}) => {
    for (const [id, btn] of tabBtnMap.entries()) {
      btn.setAttribute('aria-selected', String(tab === id))
    }
    for (const [id, btn] of presetBtnMap.entries()) {
      btn.setAttribute('aria-pressed', String(preset === id))
    }
    syncSpinState()

    if (tab === 'quota') {
      if (lastFilterOptionsKey !== 'hidden') {
        filterHost.replaceChildren()
        lastFilterOptionsKey = 'hidden'
      }
    } else {
      const hOpts = vm?.harnessOptions ?? []
      const pOpts = vm?.projectOptions ?? []
      const nextFilterKey = `${isMobile}|${range}|${harness}|${project}|${hOpts.map((o) => o.value).join(',')}|${pOpts.map((o) => o.value).join(',')}`
      // Never clobber an actively focused <select> dropdown while user is picking an item
      const selectFocused =
        shadowRoot?.activeElement?.tagName?.toLowerCase?.() === 'select' ||
        doc?.activeElement?.tagName?.toLowerCase?.() === 'select'
      if (nextFilterKey !== lastFilterOptionsKey && !selectFocused) {
        lastFilterOptionsKey = nextFilterKey
        const ranges = [
          ['today', t.rangeToday],
          ['7d', t.range7d],
          ['30d', t.range30d],
          ...(isMobile ? [] : [['90d', t.range90d]]),
          ['all', t.rangeAll],
        ]
        filterHost.replaceChildren(
          el(
            doc,
            'div',
            { class: 'hf-up-filters' },
            el(
              doc,
              'div',
              { class: 'hf-up-ranges' },
              ranges.map(([id, label]) =>
                el(
                  doc,
                  'button',
                  {
                    type: 'button',
                    class: 'hf-up-range',
                    'aria-pressed': String(range === id),
                    onClick: () => {
                      if (range === id) return
                      range = id
                      updateExpandedInPlace(t, isMobile, { forceBody: false })
                      void fetchStats(false, false)
                    },
                  },
                  label,
                ),
              ),
            ),
            el(
              doc,
              'div',
              { class: 'hf-up-selects' },
              !isMobile && hOpts.length > 1
                ? buildSelect(harness, hOpts, t.allHarnesses, t.noProject, (v) => {
                    harness = v
                    void fetchStats(false, false)
                  })
                : null,
              buildSelect(project, pOpts, t.allProjects, t.noProject, (v) => {
                project = v
                void fetchStats(false, false)
              }),
            ),
          ),
        )
      }
    }

    const nextBodyKey = `${tab}|${preset}|${isMobile}|${errorMsg}|${vmSignature(vm, quotaCards)}`
    if (forceBody || nextBodyKey !== lastBodyRenderKey) {
      lastBodyRenderKey = nextBodyKey
      const nodes =
        tab === 'overview'
          ? renderOverviewBody(t, isMobile)
          : tab === 'models'
            ? renderTableBody(vm?.modelRows ?? [], t.colModel, true, t, isMobile)
            : tab === 'harness'
              ? renderTableBody(vm?.harnessRows ?? [], t.colHarness, false, t, isMobile)
              : renderQuotaBody(t, isMobile)
      bodyHost.replaceChildren(...nodes)
    }
  }

  function updateView({ forceBody = false } = {}) {
    if (disposed) return
    const loc = String(getLocale() || 'zh-CN')
    const t = messages(loc)
    const isMobile = Boolean(mobileMedia.matches)
    root.dataset.preset = preset
    root.dataset.expanded = expanded ? 'true' : 'false'

    const targetMode = expanded
      ? isMobile ? 'expanded-mob' : 'expanded-desk'
      : isMobile ? 'collapsed-mob' : 'collapsed-desk'

    if (!expanded) {
      panelShell = null
      refreshBtn = null
      filterHost = null
      bodyHost = null
      mountedMode = targetMode
      mountedLocale = loc
      root.replaceChildren(renderCollapsedBar(t, isMobile))
      return
    }

    if (mountedMode !== targetMode || mountedLocale !== loc || !panelShell) {
      mountedMode = targetMode
      mountedLocale = loc
      root.replaceChildren(buildExpandedShell(t, isMobile))
      updateExpandedInPlace(t, isMobile, { forceBody: true })
    } else {
      updateExpandedInPlace(t, isMobile, { forceBody })
    }
  }

  const onMediaChange = () => updateView({ forceBody: true })
  mobileMedia.addEventListener?.('change', onMediaChange)

  updateView({ forceBody: true })
  notifyExpanded()
  void fetchStats(false, false)

  return {
    get expanded() {
      return expanded
    },
    get preset() {
      return preset
    },
    syncSettings(nextSettings) {
      if (disposed || !nextSettings) return
      let changed = false
      if (USAGE_PRESETS.includes(nextSettings.webUsagePreset) && nextSettings.webUsagePreset !== preset) {
        preset = nextSettings.webUsagePreset
        changed = true
      }
      if (!userToggledExpanded && Boolean(nextSettings.webUsageDefaultExpanded) !== expanded) {
        expanded = Boolean(nextSettings.webUsageDefaultExpanded)
        justExpanded = expanded
        changed = true
        notifyExpanded()
      }
      if (changed) updateView({ forceBody: true })
    },
    rerender() {
      updateView({ forceBody: true })
    },
    dispose() {
      if (disposed) return
      disposed = true
      clearTimeout(pollTimer)
      abortCtrl.abort()
      mobileMedia.removeEventListener?.('change', onMediaChange)
      root.replaceChildren()
    },
  }
}
