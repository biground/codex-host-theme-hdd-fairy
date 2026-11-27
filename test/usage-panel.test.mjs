import assert from 'node:assert/strict'
import { test } from 'node:test'
import { DEFAULT_SETTINGS, normalizeSettings } from '../shared/fairy-core.mjs'
import {
  ALL_FILTER,
  NONE_PROJECT_FILTER,
  buildHeatmapCells,
  formatCompactTokens,
  projectQuotaCards,
  projectUsageViewModel,
} from '../web/usage-data.mjs'
import { USAGE_PANEL_CSS } from '../web/usage-panel-css.mjs'
import { mountUsagePanel } from '../web/usage-panel.mjs'
import { TOKENS_CSS } from '../web/panels/tokens.mjs'
import { activate } from '../web/index.mjs'

test('normalizeSettings includes usage panel defaults (enabled, following global preset, collapsed by default)', () => {
  const defaults = normalizeSettings({})
  assert.equal(defaults.webUsagePanel, true)
  assert.equal(defaults.webUsagePreset, 'follow')
  assert.equal(defaults.webUsageDefaultExpanded, false)
  assert.equal(defaults.enableChatAnimatedAvatar, true)
  assert.deepEqual(defaults, DEFAULT_SETTINGS)

  assert.equal(normalizeSettings({ webUsagePreset: 'street' }).webUsagePreset, 'street')
  assert.equal(normalizeSettings({ webUsagePreset: 'archive' }).webUsagePreset, 'archive')
  assert.equal(normalizeSettings({ webUsagePreset: 'invalid-style' }).webUsagePreset, 'follow')
  assert.equal(normalizeSettings({ webUsageDefaultExpanded: true }).webUsageDefaultExpanded, true)
  assert.equal(normalizeSettings({ webUsagePanel: false }).webUsagePanel, false)
})

test('projectUsageViewModel computes exact CodexHost token splits, cache hit rate, active days, and model/harness breakdowns', () => {
  const rawStats = {
    range: '30d',
    from: '2026-10-28',
    to: '2026-11-26',
    filters: {
      harness: null,
      model: null,
      unknownModel: false,
      project: null,
      unknownProject: false,
      date: null,
    },
    reading: { complete: true, sources: 4, read: 4 },
    failures: [],
    options: {
      harnesses: ['codex', 'antigravity'],
      models: ['gpt-6.1-sol', 'gemini-4-carbon'],
      projects: ['C:\\Work\\codex-host', 'C:\\Work\\other\\codex-host', null],
    },
    modelLabels: [
      { harness: 'codex', model: 'gpt-6.1-sol', label: 'gpt-6.1-sol' },
      { harness: 'antigravity', model: 'gemini-4-carbon', label: 'Gemini 4 Carbon' },
    ],
    totals: {
      requests: 25946,
      inputTokens: 5194000000,
      cachedInputTokens: 5010000000,
      cacheWriteInputTokens: 0,
      cacheKnownInputTokens: 5194000000,
      cacheHitCachedInputTokens: 5017404000,
      cacheHitInputTokens: 5194000000,
      outputTokens: 16500000,
      reasoningOutputTokens: 4000000,
      costUsd: 890.43,
      unpricedRequests: 7213,
      unmeteredRequests: 0,
    },
    daily: [
      {
        date: '2026-11-25',
        harness: 'codex',
        requests: 1200,
        inputTokens: 200000000,
        cachedInputTokens: 190000000,
        cacheWriteInputTokens: 0,
        cacheKnownInputTokens: 200000000,
        cacheHitCachedInputTokens: 190000000,
        cacheHitInputTokens: 200000000,
        outputTokens: 2000000,
        reasoningOutputTokens: 500000,
        costUsd: 42.5,
        unpricedRequests: 0,
        unmeteredRequests: 0,
      },
      {
        date: '2026-11-26',
        harness: 'antigravity',
        requests: 800,
        inputTokens: 100000000,
        cachedInputTokens: 95000000,
        cacheWriteInputTokens: 0,
        cacheKnownInputTokens: 100000000,
        cacheHitCachedInputTokens: 95000000,
        cacheHitInputTokens: 100000000,
        outputTokens: 1500000,
        reasoningOutputTokens: 200000,
        costUsd: 18.2,
        unpricedRequests: 100,
        unmeteredRequests: 0,
      },
    ],
    hourly: [],
    byHarness: [
      {
        harness: 'codex',
        requests: 20000,
        inputTokens: 4194000000,
        cachedInputTokens: 4050000000,
        cacheWriteInputTokens: 0,
        cacheKnownInputTokens: 4194000000,
        cacheHitCachedInputTokens: 4050000000,
        cacheHitInputTokens: 4194000000,
        outputTokens: 12500000,
        reasoningOutputTokens: 3000000,
        costUsd: 780.43,
        unpricedRequests: 1213,
        unmeteredRequests: 0,
      },
      {
        harness: 'antigravity',
        requests: 5946,
        inputTokens: 1000000000,
        cachedInputTokens: 960000000,
        cacheWriteInputTokens: 0,
        cacheKnownInputTokens: 1000000000,
        cacheHitCachedInputTokens: 960000000,
        cacheHitInputTokens: 1000000000,
        outputTokens: 4000000,
        reasoningOutputTokens: 1000000,
        costUsd: 110.0,
        unpricedRequests: 6000,
        unmeteredRequests: 0,
      },
    ],
    byModel: [
      {
        model: 'gpt-6.1-sol',
        requests: 20000,
        inputTokens: 4194000000,
        cachedInputTokens: 4050000000,
        cacheWriteInputTokens: 0,
        cacheKnownInputTokens: 4194000000,
        cacheHitCachedInputTokens: 4050000000,
        cacheHitInputTokens: 4194000000,
        outputTokens: 12500000,
        reasoningOutputTokens: 3000000,
        costUsd: 780.43,
        unpricedRequests: 1213,
        unmeteredRequests: 0,
        harnessPricedRequests: 0,
      },
      {
        model: 'gemini-4-carbon',
        requests: 5946,
        inputTokens: 1000000000,
        cachedInputTokens: 960000000,
        cacheWriteInputTokens: 0,
        cacheKnownInputTokens: 1000000000,
        cacheHitCachedInputTokens: 960000000,
        cacheHitInputTokens: 1000000000,
        outputTokens: 4000000,
        reasoningOutputTokens: 1000000,
        costUsd: 110.0,
        unpricedRequests: 6000,
        unmeteredRequests: 0,
        harnessPricedRequests: 0,
      },
    ],
    byProject: [],
    sessions: [],
  }

  const vm = projectUsageViewModel(rawStats, null, { nowMs: Date.parse('2026-11-26T12:00:00Z') })
  assert.equal(vm.costUsd, 890.43)
  assert.equal(vm.unpricedRequests, 7213)
  assert.equal(vm.requests, 25946)
  assert.equal(vm.totalTokens, 5210500000)
  assert.equal(formatCompactTokens(vm.totalTokens), '5.21B')
  assert.equal(vm.uncachedInputTokens, 184000000)
  assert.equal(formatCompactTokens(vm.uncachedInputTokens), '184M')
  assert.equal(vm.outputTokens, 16500000)
  assert.equal(formatCompactTokens(vm.outputTokens), '16.5M')
  assert.equal(vm.cachedTokens, 5010000000)
  assert.equal(formatCompactTokens(vm.cachedTokens), '5.01B')
  assert.equal(vm.activeDays, 2)
  assert.ok(Math.abs(vm.cacheHitRate - 0.966) < 0.0005)
  assert.equal(vm.topModelLabel, 'gpt-6.1-sol')
  assert.equal(vm.threeBodyBooks, Math.round(5210500000 / 202000))

  // Disambiguates duplicate folder basenames and preserves null project option
  assert.deepEqual(
    vm.projectOptions.map((o) => ({ value: o.value, label: o.label })),
    [
      { value: 'C:\\Work\\codex-host', label: 'Work/codex-host' },
      { value: 'C:\\Work\\other\\codex-host', label: 'other/codex-host' },
      { value: NONE_PROJECT_FILTER, label: null },
    ],
  )
  assert.equal(ALL_FILTER, '__all__')
  assert.equal(vm.modelRows[0].label, 'gpt-6.1-sol')
  assert.equal(vm.modelRows[1].label, 'Gemini 4 Carbon')
  assert.equal(vm.harnessRows.length, 2)
})

test('buildHeatmapCells aligns Monday-start weeks and buckets usage into levels 0..4', () => {
  const dailyMap = new Map([
    ['2026-11-23', 100],
    ['2026-11-24', 500],
    ['2026-11-25', 1500],
    ['2026-11-26', 5000],
  ])
  const desktopHeat = buildHeatmapCells(dailyMap, { weeks: 26, nowMs: Date.parse('2026-11-26T12:00:00') })
  assert.equal(desktopHeat.cols, 26)
  assert.equal(desktopHeat.cells.length, 26 * 7)
  const activeLevels = desktopHeat.cells.filter((c) => !c.pad && c.tokens > 0).map((c) => c.level)
  assert.deepEqual(activeLevels, [1, 2, 3, 4])

  const mobileHeat = buildHeatmapCells(dailyMap, { weeks: 16, nowMs: Date.parse('2026-11-26T12:00:00') })
  assert.equal(mobileHeat.cols, 16)
  assert.equal(mobileHeat.cells.length, 16 * 7)
})

test('projectQuotaCards merges Codex 5h/7d windows and external Harness credits/balances', () => {
  const cards = projectQuotaCards({
    codexAccounts: [
      {
        summary: { accountId: 'acc-1', label: 'Phaethon Pro', planType: 'pro' },
        inspection: {
          accountId: 'acc-1',
          freshness: 'live',
          observedAt: '2026-11-26T08:00:00.000Z',
          usage: {
            planFiveHourUsedPercent: 34,
            planFiveHourResetsAtUnix: 1795690000,
            planSevenDayUsedPercent: 68,
            planSevenDayResetsAtUnix: 1796000000,
          },
        },
      },
    ],
    harnessAccounts: [
      {
        harnessId: 'antigravity',
        harnessName: 'Antigravity CLI',
        label: 'Google One AI Ultra',
        plan: 'ultra',
        credits: {
          usedPercent: 22,
          periodType: 'five_hour',
          resetsAt: '2026-11-26T12:00:00.000Z',
        },
      },
      {
        harnessId: 'deepseek-harness',
        harnessName: 'DeepSeek',
        balance: { amount: 128.5, currency: 'CNY' },
      },
    ],
  })

  assert.equal(cards.length, 3)
  assert.equal(cards[0].title, 'Codex · Phaethon Pro')
  assert.equal(cards[0].windows.length, 2)
  assert.equal(cards[1].title, 'Antigravity CLI · Google One AI Ultra')
  assert.equal(cards[1].windows[0].usedPercent, 22)
  assert.equal(cards[2].balanceText, 'CNY 128.50')
})

test('USAGE_PANEL_CSS defines all three ZZZ presets and keeps amber preset free of cyan/blue accents', () => {
  assert.match(USAGE_PANEL_CSS, /data-preset="amber"/)
  assert.match(USAGE_PANEL_CSS, /data-preset="street"/)
  assert.match(USAGE_PANEL_CSS, /data-preset="archive"/)

  const amberBlock = USAGE_PANEL_CSS.match(/\/\* PRESET_AMBER_START \*\/([\s\S]*?)\/\* PRESET_AMBER_END \*\//)
  assert.ok(amberBlock, 'Expected delimited amber preset block')
  assert.doesNotMatch(amberBlock[1], /#57e8ff|#9ce8f4|#48c2f0|#2678b8/i, 'Amber preset must not contain AI-style cyan/blue')
  assert.doesNotMatch(USAGE_PANEL_CSS, /\.hf-up-panel\s*\{[^}]*animation:/s, 'Base .hf-up-panel must not replay entrance animation on re-render')
})

class FakeNode {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName
    this.ownerDocument = ownerDocument
    this.children = []
    this.attributes = new Map()
    this.dataset = {}
    this.listeners = new Map()
    this.className = ''
    this._text = ''
    this.value = ''
    this.style = { setProperty(k, v) { this[k] = v } }
    this.classList = {
      toggle: (cls, force) => {
        const set = new Set(this.className.split(/\s+/u).filter(Boolean))
        const on = force === undefined ? !set.has(cls) : Boolean(force)
        if (on) set.add(cls)
        else set.delete(cls)
        this.className = [...set].join(' ')
      },
      remove: (cls) => {
        const set = new Set(this.className.split(/\s+/u).filter(Boolean))
        set.delete(cls)
        this.className = [...set].join(' ')
      },
      contains: (cls) => this.className.split(/\s+/u).includes(cls),
    }
  }
  get textContent() {
    if (this.children.length === 0) return this._text
    return this.children.map((c) => (typeof c === 'string' ? c : c.textContent)).join('')
  }
  set textContent(v) {
    this.children = []
    this._text = String(v ?? '')
  }
  setAttribute(k, v) { this.attributes.set(k, String(v)) }
  getAttribute(k) { return this.attributes.get(k) ?? null }
  removeAttribute(k) { this.attributes.delete(k) }
  remove() {
    if (this.parentNode) this.parentNode.children = this.parentNode.children.filter((node) => node !== this)
  }
  addEventListener(type, fn) {
    const arr = this.listeners.get(type) ?? []
    arr.push(fn)
    this.listeners.set(type, arr)
  }
  click() {
    for (const fn of this.listeners.get('click') ?? []) {
      fn({ stopPropagation() {}, preventDefault() {} })
    }
  }
  append(...nodes) {
    for (const node of nodes) if (node instanceof FakeNode) node.parentNode = this
    this.children.push(...nodes)
  }
  replaceChildren(...nodes) {
    this.children = []
    this._text = ''
    this.append(...nodes)
  }
  querySelector(cls) {
    const target = cls.startsWith('.') ? cls.slice(1) : cls
    const visit = (node) => {
      if (node instanceof FakeNode && node.className.split(/\s+/u).includes(target)) return node
      for (const ch of node.children ?? []) {
        if (ch instanceof FakeNode) {
          const hit = visit(ch)
          if (hit) return hit
        }
      }
      return null
    }
    return visit(this)
  }
}

function makeFakeDoc() {
  const listeners = new Map()
  const doc = {
    activeElement: null,
    listeners,
    createElement: (tag) => new FakeNode(tag, doc),
    createTextNode: (txt) => String(txt),
    addEventListener: (type, fn) => {
      const set = listeners.get(type) ?? new Set()
      set.add(fn)
      listeners.set(type, set)
    },
    removeEventListener: (type, fn) => {
      listeners.get(type)?.delete(fn)
    },
  }
  return doc
}

test('Web preset bus updates independent panels, supports DOM reconciliation, and cleans up on deactivation', async () => {
  const doc = makeFakeDoc()
  doc.documentElement = new FakeNode('html', doc)
  doc.head = new FakeNode('head', doc)
  doc.body = new FakeNode('body', doc)
  doc.querySelector = () => null
  const root = doc.documentElement
  root.setAttribute('data-theme', 'dark')
  const win = new EventTarget()
  win.matchMedia = () => ({ matches: true, addEventListener() {} })
  const observers = []
  const globals = { document: doc, window: win, cancelAnimationFrame() {}, MutationObserver: class {
    constructor(callback) { this.callback = callback; observers.push(this) }
    observe() {}
    disconnect() { this.disconnected = true }
  } }
  const saved = Object.fromEntries(Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]))
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { value, configurable: true })
  const tracked = []
  const controller = new AbortController()
  let onSettings
  let offStorage = false
  let dispose
  try {
    dispose = await activate({
      id: 'hdd-fairy', signal: controller.signal,
      storage: { get: async () => ({}), onChange: (callback) => { onSettings = callback; return () => { offStorage = true } } },
      assets: { url: (name) => `/assets/${name}` },
      track: (cleanup) => tracked.push(cleanup),
      dom: {
        mark: (el, name) => {
          el.setAttribute(`data-cx-ext-hdd-fairy-${name}`, '')
          tracked.push(() => el.removeAttribute(`data-cx-ext-hdd-fairy-${name}`))
        },
        unmark: (el, name) => el.removeAttribute(`data-cx-ext-hdd-fairy-${name}`),
      },
    })
    const panels = ['shell', 'chat', 'composer', 'rightbar', 'settings']
    assert.deepEqual(doc.head.children.filter((node) => node.dataset.cxWebExtPanel).map((node) => node.dataset.cxWebExtPanel), ['tokens', 'shell', 'chat', 'composer', 'model-select', 'rightbar', 'settings', 'juice'])
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-preset'), 'amber')
    assert.equal(root.getAttribute('data-hf-juice'), '1')
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-dark'), '')
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-light'), null)
    for (const panel of panels) {
      assert.equal(root.getAttribute(`data-hf-panel-${panel}`), '1')
      assert.equal(root.getAttribute(`data-hf-preset-${panel}`), 'amber')
    }
    onSettings({ enableMotionJuice: false })
    assert.equal(root.getAttribute('data-hf-juice'), null)
    onSettings({ enableMotionJuice: true })
    assert.equal(root.getAttribute('data-hf-juice'), '1')
    onSettings({ globalPreset: 'street', panelChatPreset: 'archive', panelShellEnabled: false })
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-preset'), 'street')
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-dark'), '')
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-light'), null)
    assert.equal(root.getAttribute('data-hf-preset-chat'), 'archive')
    assert.equal(root.getAttribute('data-hf-preset-composer'), 'street')
    assert.equal(root.getAttribute('data-hf-panel-shell'), null)
    assert.equal(root.getAttribute('data-hf-preset-shell'), null)
    observers[0].callback([{ type: 'childList', target: doc.body }])
    await Promise.resolve()
    assert.equal(root.getAttribute('data-hf-preset-chat'), 'archive')
    onSettings({ enableWebTheme: false })
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-preset'), null)
    assert.equal(root.getAttribute('data-hf-juice'), null)
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-dark'), null)
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-light'), null)
    for (const panel of panels) {
      assert.equal(root.getAttribute(`data-hf-panel-${panel}`), null)
      assert.equal(root.getAttribute(`data-hf-preset-${panel}`), null)
    }
    onSettings({ globalPreset: 'archive' })
    assert.equal(root.getAttribute('data-hf-preset-shell'), 'archive')
    assert.equal(root.getAttribute('data-hf-juice'), '1')
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-light'), '')
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-dark'), null)
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-hero'), '')
  } finally {
    controller.abort()
    dispose?.()
    for (const cleanup of tracked.reverse()) cleanup()
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else delete globalThis[key]
    }
  }
  assert.equal(doc.head.children.length, 0)
  assert.equal(doc.listeners.get('pointerdown')?.size ?? 0, 0)
  assert.equal(doc.listeners.get('click')?.size ?? 0, 0)
  assert.ok(offStorage)
  assert.ok(observers.every((observer) => observer.disconnected))
  assert.deepEqual([...root.attributes.keys()], ['data-theme'])
})

test('Preset selection drives theme polarity automatically regardless of host light/dark mode', async () => {
  const doc = makeFakeDoc()
  doc.documentElement = new FakeNode('html', doc)
  doc.head = new FakeNode('head', doc)
  doc.body = new FakeNode('body', doc)
  doc.querySelector = () => null
  const root = doc.documentElement
  root.setAttribute('data-theme', 'light')
  const win = new EventTarget()
  win.matchMedia = () => ({ matches: false, addEventListener() {} })
  const globals = { document: doc, window: win, cancelAnimationFrame() {}, MutationObserver: class {
    observe() {}
    disconnect() {}
  } }
  const saved = Object.fromEntries(Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]))
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { value, configurable: true })
  const tracked = []
  const controller = new AbortController()
  let onSettings
  let dispose
  try {
    dispose = await activate({
      id: 'hdd-fairy', signal: controller.signal,
      storage: { get: async () => ({ globalPreset: 'amber' }), onChange: (cb) => { onSettings = cb; return () => {} } },
      assets: { url: (name) => `/assets/${name}` },
      track: (cleanup) => tracked.push(cleanup),
      dom: {
        mark: (el, name) => el.setAttribute(`data-cx-ext-hdd-fairy-${name}`, ''),
        unmark: (el, name) => el.removeAttribute(`data-cx-ext-hdd-fairy-${name}`),
      },
    })
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-dark'), '')
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-light'), null)

    onSettings({ globalPreset: 'archive' })
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-light'), '')
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-dark'), null)

    root.setAttribute('data-theme', 'dark')
    onSettings({ globalPreset: 'street' })
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-dark'), '')
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-light'), null)

    onSettings({ globalPreset: 'archive' })
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-light'), '')
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-dark'), null)

    dispose()
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-light'), null)
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-theme-dark'), null)
    assert.equal(root.getAttribute('data-cx-ext-hdd-fairy-hero'), null)
  } finally {
    controller.abort()
    for (const cleanup of tracked.reverse()) cleanup()
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else delete globalThis[key]
    }
  }
})

test('Token bus keeps preset colors in global and independent panel namespaces', () => {
  const root = 'html:is([data-cx-ext-hdd-fairy-theme-dark],[data-cx-ext-hdd-fairy-theme-light])'
  const accents = { amber: '#f8cb29', street: '#c8ff00', archive: '#2455e7' }
  for (const [preset, accent] of Object.entries(accents)) {
    const globalSelector = `${root}[data-cx-ext-hdd-fairy-preset="${preset}"]`
    assert.ok(TOKENS_CSS.includes(`${globalSelector} {`))
    assert.ok(TOKENS_CSS.split(`${globalSelector} {`)[1].split('}')[0].includes(`--hf-accent:${accent};`))
    for (const panel of ['shell', 'chat', 'composer', 'rightbar', 'settings']) {
      const selector = `${root}[data-hf-panel-${panel}="1"][data-hf-preset-${panel}="${preset}"]`
      const block = TOKENS_CSS.split(`${selector} {`)[1]?.split('}')[0]
      assert.ok(block?.includes(`--hf-${panel}-accent:${accent};`))
      assert.ok(!block.includes('--hf-accent:'), 'Independent panels must not overwrite the global palette')
      assert.ok(TOKENS_CSS.includes(`--hf-accent:var(--hf-${panel}-accent);`))
    }
  }
})

test('mountUsagePanel preserves .hf-up-panel DOM node across refreshes and avoids endless polling on warm incomplete reads', async () => {
  const doc = makeFakeDoc()
  const shadow = new FakeNode('shadow-root', doc)
  let loadCalls = 0
  let refreshTrueCalls = 0

  const fakeClient = {
    async loadStatistics({ refresh }) {
      loadCalls += 1
      if (refresh) refreshTrueCalls += 1
      return {
        range: '30d',
        reading: { complete: false, sources: 4, read: 2 },
        costUsd: 5146.7 + loadCalls,
        unpricedRequests: 100,
        requests: 152019 + loadCalls,
        totalTokens: 34_600_000_000,
        uncachedInputTokens: 1_220_000_000,
        outputTokens: 125_000_000,
        cachedTokens: 33_255_000_000,
        cacheWriteTokens: 0,
        activeDays: 30,
        cacheHitRate: 0.975,
        topModelLabel: 'gpt-6.1-terra',
        threeBodyBooks: 171108,
        modelRows: [],
        harnessRows: [],
        harnessOptions: [],
        projectOptions: [],
        dailyTokensMap: new Map(),
        nowMs: Date.now(),
      }
    },
    async loadQuotas() {
      return []
    },
  }

  const ctrl = mountUsagePanel(shadow, {
    doc,
    win: { matchMedia: () => ({ matches: false }) },
    client: fakeClient,
    initialSettings: { webUsagePreset: 'amber', webUsageDefaultExpanded: true },
    pollDelayMs: 25,
  })

  try {
    await new Promise((r) => setTimeout(r, 15))
    const panelFirst = shadow.querySelector('.hf-up-panel')
    assert.ok(panelFirst, 'Expected expanded .hf-up-panel')

    // Wait enough time for multiple 25ms intervals if unbounded polling existed
    await new Promise((r) => setTimeout(r, 160))
    const panelAfter = shadow.querySelector('.hf-up-panel')
    assert.equal(panelAfter, panelFirst, '.hf-up-panel element must stay in-place without replacement/flicker')
    assert.equal(refreshTrueCalls, 0, 'Background polls must not pass refresh: true')
    assert.ok(loadCalls <= 2, `Warm incomplete stats should settle in <= 2 calls, got ${loadCalls}`)

    // Manual refresh click updates in-place without replacing .hf-up-panel or re-adding .is-entering
    panelFirst.classList.remove('is-entering')
    const refreshBtn = shadow.querySelector('.hf-up-icon-btn')
    assert.ok(refreshBtn, 'Expected manual refresh button')
    refreshBtn.click()
    await new Promise((r) => setTimeout(r, 40))
    const panelAfterManual = shadow.querySelector('.hf-up-panel')
    assert.equal(panelAfterManual, panelFirst, 'Manual refresh must preserve .hf-up-panel node identity')
    assert.equal(panelAfterManual.classList.contains('is-entering'), false, 'Manual refresh must not replay entrance animation')
    assert.equal(refreshTrueCalls, 1, 'Manual refresh should pass refresh: true once')
  } finally {
    ctrl.dispose()
  }
})
