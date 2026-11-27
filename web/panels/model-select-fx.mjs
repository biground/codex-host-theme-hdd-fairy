// Workorder 020: Antigravity Periodic Table Model Selector + Overdrive Thinking Slider FX.
// Zero React Fiber conflict: appends owned decks at the end of _thinkingPanel / _modelPanel,
// keeps native buttons alive (sr-only), and delegates all clicks/drags to native .click().

import { renderHddIcon } from '../../shared/hdd-icons.mjs'

export const ELEMENT_SPECS = Object.freeze([
  Object.freeze({ z: '01', sym: 'H', mass: '1.008', orbital: '1s1', group: 'GRP IA', en: 'Hydrogen', zhPrefix: '氢', zhTag: '极速轻量', enTag: 'VELOCITY', bars: 1, re: /\bhydrogen\b/i }),
  Object.freeze({ z: '06', sym: 'C', mass: '12.01', orbital: '2p2', group: 'GRP IVA', en: 'Carbon', zhPrefix: '碳', zhTag: '均衡主力', enTag: 'BALANCED', bars: 2, re: /\bcarbon\b/i }),
  Object.freeze({ z: '10', sym: 'Ne', mass: '20.18', orbital: '2p6', group: 'GRP VIIIA', en: 'Neon', zhPrefix: '氖', zhTag: '旗舰深度', enTag: 'FLAGSHIP', bars: 4, re: /\bneon\b/i }),
  Object.freeze({ z: '18', sym: 'Ar', mass: '39.95', orbital: '3p6', group: 'GRP VIIIA', en: 'Argon', zhPrefix: '氩', zhTag: '稳定深潜', enTag: 'DEEP DIVE', bars: 3, re: /\bargon\b/i }),
])

const PARTICLES = Object.freeze([
  { x: '6%',  y: '34%', dx: '68px', dy: '-3px', sz: '2.5px', len: '0px',  dur: '1.75s', del: '-0.12s' },
  { x: '10%', y: '56%', dx: '82px', dy: '-5px', sz: '1.5px', len: '22px', dur: '2.05s', del: '-0.48s' },
  { x: '22%', y: '28%', dx: '64px', dy: '2px',  sz: '2.2px', len: '0px',  dur: '1.62s', del: '-0.95s' },
  { x: '28%', y: '68%', dx: '76px', dy: '-4px', sz: '1.4px', len: '18px', dur: '1.92s', del: '-1.34s' },
  { x: '38%', y: '44%', dx: '72px', dy: '3px',  sz: '2.8px', len: '0px',  dur: '1.84s', del: '-0.66s' },
  { x: '44%', y: '74%', dx: '84px', dy: '-3px', sz: '1.5px', len: '24px', dur: '2.18s', del: '-1.72s' },
  { x: '52%', y: '26%', dx: '66px', dy: '4px',  sz: '2.2px', len: '0px',  dur: '1.58s', del: '-0.31s' },
  { x: '58%', y: '60%', dx: '74px', dy: '-2px', sz: '1.4px', len: '20px', dur: '1.98s', del: '-1.15s' },
  { x: '64%', y: '36%', dx: '62px', dy: '2px',  sz: '2.6px', len: '0px',  dur: '1.70s', del: '-1.49s' },
  { x: '70%', y: '50%', dx: '58px', dy: '-4px', sz: '1.5px', len: '16px', dur: '1.65s', del: '-0.82s' },
  { x: '16%', y: '72%', dx: '70px', dy: '-2px', sz: '2.0px', len: '0px',  dur: '1.88s', del: '-1.22s' },
  { x: '48%', y: '32%', dx: '78px', dy: '-3px', sz: '1.4px', len: '22px', dur: '2.12s', del: '-0.25s' },
])

const TIER_META = Object.freeze({
  low: { code: '01 · LOW' },
  medium: { code: '02 · MED' },
  high: { code: '03 · HIGH' },
  overdrive: { code: 'OVERDRIVE' },
})

const STAR_SVG_EMPTY = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="miter" aria-hidden="true"><path d="m10 2.3 2.28 4.62 5.1.74-3.69 3.59.87 5.08L10 13.94l-4.56 2.39.87-5.08-3.69-3.59 5.1-.74L10 2.3Z"/></svg>'
const STAR_SVG_FILLED = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="miter" aria-hidden="true"><path d="m10 2.3 2.28 4.62 5.1.74-3.69 3.59.87 5.08L10 13.94l-4.56 2.39.87-5.08-3.69-3.59 5.1-.74L10 2.3Z"/></svg>'

const OVERDRIVE_RE = /\b(?:xhigh|x-high|extra[\s-]*high|max|maximum|ultra)\b|超高|极高|最大|极限|极致|超频/i
const HIGH_RE = /\bhigh\b|^高$|高强度/i
const MEDIUM_RE = /\b(?:med|medium|normal|standard|balanced|default)\b|中等|^中$|均衡|默认/i
const LOW_RE = /\b(?:none|off|minimal|min|low|fast)\b|^低$|极低|最轻|无|关闭/i

export function matchElementSpec(modelName = '', modelId = '') {
  const raw = `${modelName} ${modelId}`.trim()
  if (!raw || /\borchestrator\b/i.test(raw)) return null
  return ELEMENT_SPECS.find((spec) => spec.re.test(raw)) ?? null
}

export function resolveEffortTier(labelOrId = '', index = -1, total = 0) {
  const raw = String(labelOrId ?? '').trim()
  if (OVERDRIVE_RE.test(raw)) return 'overdrive'
  if (LOW_RE.test(raw)) return 'low'
  if (MEDIUM_RE.test(raw)) return 'medium'
  if (HIGH_RE.test(raw)) {
    if (total >= 3 && index === total - 1) return 'overdrive'
    return 'high'
  }
  if (total >= 2 && index >= 0) {
    if (total >= 3 && index === total - 1) return 'overdrive'
    if (index === 0) return 'low'
    if (total === 2) return 'high'
    if (total >= 4 && index === total - 2) return 'high'
    return 'medium'
  }
  return 'medium'
}

function classifySecondaryTag(name) {
  if (/\borchestrator\b/i.test(name)) return 'ORC'
  if (/\bflash\b/i.test(name)) return 'FLS'
  if (/\bclaude\b/i.test(name)) return 'CLD'
  if (/\bgpt-oss\b|\boss\b/i.test(name)) return 'OSS'
  if (/\bgpt\b|\bcodex\b/i.test(name)) return 'GPT'
  if (/\bdeepseek\b/i.test(name)) return 'DSK'
  if (/\bgemini\b/i.test(name)) return 'GEM'
  return 'MDL'
}

function isZhLocale(doc) {
  const lang = (doc?.documentElement?.lang || globalThis.navigator?.language || 'zh-CN').toLowerCase()
  return lang.startsWith('zh')
}

function tickRatio(index, total) {
  if (total <= 1) return 1
  return index / (total - 1)
}

function appendHighlightedText(doc, parent, text, query) {
  const clean = String(text ?? '')
  const needle = String(query ?? '').trim().toLowerCase()
  if (!needle) {
    parent.textContent = clean
    return
  }
  const lower = clean.toLowerCase()
  const idx = lower.indexOf(needle)
  if (idx !== -1) {
    if (idx > 0) parent.append(doc.createTextNode(clean.slice(0, idx)))
    const mark = doc.createElement('mark')
    mark.className = 'hf-match'
    mark.textContent = clean.slice(idx, idx + needle.length)
    parent.append(mark)
    if (idx + needle.length < clean.length) {
      parent.append(doc.createTextNode(clean.slice(idx + needle.length)))
    }
    return
  }
  // Ordered subsequence highlight matching ModelSelect's rankByName behavior.
  let qi = 0
  let buf = ''
  const flushBuf = () => {
    if (buf) {
      parent.append(doc.createTextNode(buf))
      buf = ''
    }
  }
  for (let i = 0; i < clean.length; i++) {
    if (qi < needle.length && lower[i] === needle[qi]) {
      flushBuf()
      const mark = doc.createElement('mark')
      mark.className = 'hf-match'
      mark.textContent = clean[i]
      parent.append(mark)
      qi += 1
    } else {
      buf += clean[i]
    }
  }
  flushBuf()
}

function formatBadgeText(tier, label) {
  const shortLabel = String(label ?? '').trim()
  if (tier === 'overdrive') {
    return shortLabel ? `OVERDRIVE · ${shortLabel}` : 'OVERDRIVE'
  }
  const meta = TIER_META[tier] ?? TIER_META.medium
  return shortLabel ? `${meta.code} / ${shortLabel}` : meta.code
}

export function mountModelSelectEnhancer(api, getSettings) {
  const doc = typeof document !== 'undefined' ? document : null
  let disposed = false
  let bodyObserver = null
  let syncFrame = 0
  const menuStates = new Map()
  let escapeMenu = null
  let escapeHandler = null

  const clearEscapeGuard = () => {
    if (escapeHandler && doc) doc.removeEventListener('keydown', escapeHandler, true)
    escapeHandler = null
    escapeMenu = null
  }

  // Silently detach focus right after native effort .click() so ModelSelect's
  // settleSelection() sees activeElement outside root/menu and skips closeAfterSelection(),
  // keeping the menu mounted with zero close/reopen flicker.
  const suppressAutoCloseOnEffort = (menu) => {
    const win = typeof window !== 'undefined' ? window : null
    if (!doc || !win) return
    const active = doc.activeElement
    if (active && typeof active.blur === 'function' && active !== doc.body) {
      const swallow = (event) => {
        event.stopImmediatePropagation()
      }
      win.addEventListener('focusout', swallow, true)
      win.addEventListener('blur', swallow, true)
      try {
        active.blur()
      } finally {
        win.removeEventListener('focusout', swallow, true)
        win.removeEventListener('blur', swallow, true)
      }
    }
    clearEscapeGuard()
    escapeMenu = menu
    escapeHandler = (event) => {
      if (event.key !== 'Escape') return
      if (!escapeMenu?.isConnected) {
        clearEscapeGuard()
        return
      }
      const trigger = escapeMenu.id ? doc.querySelector(`button[aria-controls="${escapeMenu.id}"]`) : null
      if (trigger && (doc.activeElement === trigger || escapeMenu.contains(doc.activeElement))) {
        clearEscapeGuard()
        return
      }
      event.preventDefault()
      event.stopPropagation()
      if (escapeMenu.className.includes('_modelOpen')) {
        const backBtn = escapeMenu.querySelector('[class*="_backButton"]')
        if (backBtn && backBtn.offsetParent !== null) {
          backBtn.click()
          return
        }
      }
      clearEscapeGuard()
      trigger?.click()
    }
    doc.addEventListener('keydown', escapeHandler, true)
  }

  const shouldEnable = () => {
    if (disposed || api?.signal?.aborted || !doc) return false
    const settings = typeof getSettings === 'function' ? getSettings() : null
    if (!settings) return false
    return Boolean(settings.enableWebTheme && settings.panelComposerEnabled !== false)
  }

  const cleanupMenu = (menu) => {
    const state = menuStates.get(menu)
    if (state) {
      state.observer?.disconnect()
      menuStates.delete(menu)
    }
    for (const owned of menu.querySelectorAll('[data-cx-ext-owned="hdd-fairy"]')) {
      owned.remove()
    }
    for (const panel of menu.querySelectorAll('[data-hf-slider-ready], [data-hf-ptable-ready]')) {
      panel.removeAttribute('data-hf-slider-ready')
      panel.removeAttribute('data-hf-ptable-ready')
    }
    for (const cell of menu.querySelectorAll('[data-hf-el-badge], [data-hf-el-sym]')) {
      cell.removeAttribute('data-hf-el-badge')
      cell.removeAttribute('data-hf-el-sym')
    }
  }

  const cleanupAll = () => {
    if (syncFrame && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(syncFrame)
    syncFrame = 0
    for (const menu of [...menuStates.keys()]) {
      cleanupMenu(menu)
    }
    if (typeof doc?.querySelectorAll === 'function') {
      for (const menu of doc.querySelectorAll('body > div[id$="-menu"][class*="_menu"]')) {
        cleanupMenu(menu)
      }
    }
  }

  const updateCurrentModelCellBadge = (thinkingPanel) => {
    const cellBtn = thinkingPanel?.querySelector('[class*="_modelCellWrap"] button[class*="_cell"]')
    if (!cellBtn) return
    const labelEl = cellBtn.querySelector('[class*="_cellValue"]')
    const label = (labelEl?.textContent || cellBtn.textContent || '').trim()
    const spec = matchElementSpec(label)
    if (spec) {
      const badge = `${spec.z} ${spec.sym}`
      if (cellBtn.getAttribute('data-hf-el-badge') !== badge) cellBtn.setAttribute('data-hf-el-badge', badge)
      if (cellBtn.getAttribute('data-hf-el-sym') !== spec.sym) cellBtn.setAttribute('data-hf-el-sym', spec.sym)
    } else {
      cellBtn.removeAttribute('data-hf-el-badge')
      cellBtn.removeAttribute('data-hf-el-sym')
    }
  }

  const applySliderVisuals = (panel, deck, items, activeIdx) => {
    const total = items.length
    const clampedIdx = Math.max(0, Math.min(total - 1, activeIdx))
    const activeItem = items[clampedIdx]
    const tier = resolveEffortTier(activeItem?.label ?? '', clampedIdx, total)
    const ratio = tickRatio(clampedIdx, total)

    deck.setAttribute('data-tier', tier)
    const stage = deck.querySelector('.hf-slider-stage')
    if (stage) {
      stage.setAttribute('data-tier', tier)
      stage.style.setProperty('--thumb-ratio', String(ratio))
      const dots = stage.querySelectorAll('.hf-tick-dot')
      dots.forEach((dot, idx) => {
        dot.setAttribute('data-passed', idx <= clampedIdx ? '1' : '0')
        dot.setAttribute('data-current', idx === clampedIdx ? '1' : '0')
      })
    }

    const badge = panel?.querySelector(':scope > [class*="_panelHeader"] > .hf-effort-badge[data-cx-ext-owned="hdd-fairy"]')
    if (badge) {
      badge.setAttribute('data-tier', tier)
      const badgeText = formatBadgeText(tier, activeItem?.label ?? '')
      badge.innerHTML = tier === 'overdrive'
        ? `${renderHddIcon('spark', { size: 11 })}<span></span>`
        : '<span></span>'
      badge.querySelector('span').textContent = badgeText
    }

    const tickBtns = deck.querySelectorAll('.hf-tick-label')
    tickBtns.forEach((btn, idx) => {
      btn.setAttribute('data-active', idx === clampedIdx ? '1' : '0')
    })
  }

  const commitEffortSelection = (menu, panel, deck, state, idx) => {
    const freshBtns = [...panel.querySelectorAll('[class*="_thinkingOptions"] button[role="menuitemradio"]')]
    const target = freshBtns[idx]
    if (!target || target.disabled) return
    const liveItems = freshBtns.map((btn) => ({
      btn,
      label: (btn.querySelector('[class*="_modelName"]')?.textContent || btn.textContent || '').trim(),
    }))
    applySliderVisuals(panel, deck, liveItems, idx)
    if (target.getAttribute('aria-checked') === 'true') {
      state.pendingEffortIdx = null
      return
    }
    state.pendingEffortIdx = idx
    target.click()
    suppressAutoCloseOnEffort(menu)
  }

  const syncThinkingPanel = (menu, state) => {
    const panel = menu.querySelector('[class*="_thinkingPanel"]')
    if (!panel) return
    updateCurrentModelCellBadge(panel)

    const optionsWrap = panel.querySelector('[class*="_thinkingOptions"]')
    const hasError = Boolean(optionsWrap?.querySelector('[class*="_error"]'))
    const nativeBtns = optionsWrap
      ? [...optionsWrap.querySelectorAll('button[role="menuitemradio"]')]
      : []

    const header = panel.querySelector(':scope > [class*="_panelHeader"]')
    let deck = panel.querySelector(':scope > .hf-effort-deck[data-cx-ext-owned="hdd-fairy"]')

    if (hasError || nativeBtns.length < 2) {
      panel.removeAttribute('data-hf-slider-ready')
      deck?.remove()
      header?.querySelector(':scope > .hf-effort-badge[data-cx-ext-owned="hdd-fairy"]')?.remove()
      state.effortSignature = ''
      state.pendingEffortIdx = null
      return
    }

    panel.setAttribute('data-hf-slider-ready', '1')

    const items = nativeBtns.map((btn) => ({
      btn,
      label: (btn.querySelector('[class*="_modelName"]')?.textContent || btn.textContent || '').trim(),
      checked: btn.getAttribute('aria-checked') === 'true',
      disabled: Boolean(btn.disabled),
    }))
    const checkedIdx = Math.max(0, items.findIndex((item) => item.checked))
    const anyDisabled = items.some((item) => item.disabled)
    if (!anyDisabled || state.pendingEffortIdx === checkedIdx) {
      state.pendingEffortIdx = null
    }
    const displayIdx = state.pendingEffortIdx !== null && state.pendingEffortIdx < items.length
      ? state.pendingEffortIdx
      : checkedIdx
    const signature = items.map((item) => item.label).join('|')

    if (header && !header.querySelector(':scope > .hf-effort-badge[data-cx-ext-owned="hdd-fairy"]')) {
      const badge = doc.createElement('span')
      badge.className = 'hf-effort-badge'
      badge.setAttribute('data-cx-ext-owned', 'hdd-fairy')
      header.append(badge)
    }

    if (!deck || state.effortSignature !== signature) {
      deck?.remove()
      deck = doc.createElement('div')
      deck.className = 'hf-effort-deck'
      deck.setAttribute('data-cx-ext-owned', 'hdd-fairy')

      const stage = doc.createElement('div')
      stage.className = 'hf-slider-stage'
      stage.setAttribute('role', 'slider')
      stage.setAttribute('aria-valuemin', '0')
      stage.setAttribute('aria-valuemax', String(items.length - 1))
      stage.setAttribute('aria-valuenow', String(checkedIdx))

      const rail = doc.createElement('div')
      rail.className = 'hf-slider-rail'

      const fill = doc.createElement('div')
      fill.className = 'hf-slider-fill'
      const sheen = doc.createElement('span')
      sheen.className = 'hf-overdrive-sheen'
      sheen.setAttribute('aria-hidden', 'true')

      const plume = doc.createElement('div')
      plume.className = 'hf-particle-plume'
      plume.setAttribute('aria-hidden', 'true')
      for (const p of PARTICLES) {
        const node = doc.createElement('i')
        node.className = p.len !== '0px' ? 'hf-p hf-p-streak' : 'hf-p'
        node.style.setProperty('--x', p.x)
        node.style.setProperty('--y', p.y)
        node.style.setProperty('--dx', p.dx)
        node.style.setProperty('--dy', p.dy)
        node.style.setProperty('--sz', p.sz)
        if (p.len !== '0px') node.style.setProperty('--len', p.len)
        node.style.setProperty('--dur', p.dur)
        node.style.setProperty('--del', p.del)
        plume.append(node)
      }

      fill.append(sheen, plume)
      rail.append(fill)

      items.forEach((_, idx) => {
        const dot = doc.createElement('span')
        dot.className = 'hf-tick-dot'
        dot.style.setProperty('--tick-r', String(tickRatio(idx, items.length)))
        rail.append(dot)
      })

      const thumb = doc.createElement('div')
      thumb.className = 'hf-slider-thumb'
      thumb.setAttribute('aria-hidden', 'true')

      stage.append(rail, thumb)

      const ticks = doc.createElement('div')
      ticks.className = 'hf-slider-ticks'
      ticks.style.setProperty('--tick-count', String(items.length))
      items.forEach((item, idx) => {
        const tickBtn = doc.createElement('button')
        tickBtn.type = 'button'
        tickBtn.className = 'hf-tick-label'
        tickBtn.textContent = item.label
        tickBtn.disabled = item.disabled
        tickBtn.addEventListener('click', (event) => {
          event.preventDefault()
          event.stopPropagation()
          commitEffortSelection(menu, panel, deck, state, idx)
        })
        ticks.append(tickBtn)
      })

      // Drag & click on capsule slider rail
      const resolveIndexFromPointer = (clientX) => {
        const rect = rail.getBoundingClientRect()
        if (!rect.width) return checkedIdx
        const pad = Math.min(14, rect.width * 0.2)
        const span = Math.max(1, rect.width - pad * 2)
        const ratio = Math.max(0, Math.min(1, (clientX - (rect.left + pad)) / span))
        return Math.round(ratio * (items.length - 1))
      }

      let activePointerId = null
      let previewIdx = checkedIdx

      stage.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return
        const freshBtns = [...panel.querySelectorAll('[class*="_thinkingOptions"] button[role="menuitemradio"]')]
        if (freshBtns.length < 2 || freshBtns.every((b) => b.disabled)) return
        event.preventDefault()
        event.stopPropagation()
        activePointerId = event.pointerId
        state.draggingSlider = true
        stage.setAttribute('data-dragging', '1')
        try {
          stage.setPointerCapture(event.pointerId)
        } catch {
          /* ignore synthetic pointer events */
        }
        previewIdx = resolveIndexFromPointer(event.clientX)
        const liveItems = freshBtns.map((btn) => ({
          btn,
          label: (btn.querySelector('[class*="_modelName"]')?.textContent || btn.textContent || '').trim(),
        }))
        applySliderVisuals(panel, deck, liveItems, previewIdx)
      })

      stage.addEventListener('pointermove', (event) => {
        if (activePointerId !== event.pointerId) return
        const freshBtns = [...panel.querySelectorAll('[class*="_thinkingOptions"] button[role="menuitemradio"]')]
        if (freshBtns.length < 2) return
        const nextIdx = resolveIndexFromPointer(event.clientX)
        if (nextIdx !== previewIdx) {
          previewIdx = nextIdx
          const liveItems = freshBtns.map((btn) => ({
            btn,
            label: (btn.querySelector('[class*="_modelName"]')?.textContent || btn.textContent || '').trim(),
          }))
          applySliderVisuals(panel, deck, liveItems, previewIdx)
        }
      })

      const finishDrag = (event, commit) => {
        if (activePointerId !== event.pointerId) return
        activePointerId = null
        state.draggingSlider = false
        stage.removeAttribute('data-dragging')
        try {
          stage.releasePointerCapture(event.pointerId)
        } catch {
          /* ignore */
        }
        if (commit) {
          commitEffortSelection(menu, panel, deck, state, previewIdx)
        } else {
          syncThinkingPanel(menu, state)
        }
      }

      stage.addEventListener('pointerup', (event) => finishDrag(event, true))
      stage.addEventListener('pointercancel', (event) => finishDrag(event, false))

      deck.append(stage, ticks)
      panel.append(deck)
      state.effortSignature = signature
    }

    const tickBtns = deck.querySelectorAll('.hf-tick-label')
    tickBtns.forEach((btn, idx) => {
      btn.disabled = Boolean(items[idx]?.disabled)
    })

    if (!state.draggingSlider) {
      applySliderVisuals(panel, deck, items, displayIdx)
      const stage = deck.querySelector('.hf-slider-stage')
      if (stage) {
        stage.setAttribute('aria-valuenow', String(displayIdx))
        stage.setAttribute('aria-valuetext', items[displayIdx]?.label ?? '')
      }
    }
  }

  const syncModelPanel = (menu, state) => {
    const panel = menu.querySelector('[class*="_modelPanel"]')
    if (!panel) {
      state.modelSignature = ''
      return
    }

    const groups = panel.querySelector('[class*="_groups"]')
    const rows = groups && !groups.hidden
      ? [...groups.querySelectorAll('[class*="_modelRow"]')]
      : []
    const searchInput = panel.querySelector('input[role="searchbox"]')
    const query = searchInput ? searchInput.value.trim() : ''

    let deck = panel.querySelector(':scope > .hf-model-deck[data-cx-ext-owned="hdd-fairy"]')

    if (rows.length === 0) {
      panel.removeAttribute('data-hf-ptable-ready')
      if (deck) deck.hidden = true
      state.modelSignature = ''
      return
    }

    panel.setAttribute('data-hf-ptable-ready', '1')

    const parsedRows = rows.map((row, rowIndex) => {
      const optBtn = row.querySelector('button[class*="_modelOption"]')
      const favBtn = row.querySelector('button[class*="_favorite"]')
      const name = (optBtn?.querySelector('[class*="_modelName"]')?.textContent || optBtn?.getAttribute('title') || optBtn?.textContent || '').trim()
      const checked = optBtn?.getAttribute('aria-checked') === 'true'
      const highlighted = optBtn?.hasAttribute('data-highlighted') || false
      const disabled = Boolean(optBtn?.disabled)
      const pending = Boolean(optBtn?.querySelector('[data-state="ongoing"]'))
      const favorite = favBtn?.getAttribute('aria-pressed') === 'true'
      const favDisabled = Boolean(favBtn?.disabled)
      const spec = matchElementSpec(name)
      return { rowIndex, name, checked, highlighted, disabled, pending, favorite, favDisabled, hasFav: Boolean(favBtn), spec }
    })

    const zh = isZhLocale(doc)
    const signature = [
      query,
      zh ? 'zh' : 'en',
      ...parsedRows.map((r) => `${r.name}#${r.checked ? 1 : 0}${r.highlighted ? 1 : 0}${r.favorite ? 1 : 0}${r.pending ? 1 : 0}${r.disabled ? 1 : 0}${r.favDisabled ? 1 : 0}`),
    ].join('\n')

    if (deck && state.modelSignature === signature) {
      deck.hidden = false
      return
    }

    const prevScrollTop = deck ? deck.scrollTop : 0
    if (!deck) {
      deck = doc.createElement('div')
      deck.className = 'hf-model-deck'
      deck.setAttribute('data-cx-ext-owned', 'hdd-fairy')
      panel.append(deck)
    }
    deck.hidden = false
    deck.textContent = ''

    const elementRows = parsedRows
      .filter((r) => r.spec !== null)
      .sort((a, b) => Number(a.spec.z) - Number(b.spec.z))
    const secondaryRows = parsedRows.filter((r) => r.spec === null)

    const triggerNativeOption = (rowIndex) => {
      const liveRows = panel.querySelectorAll('[class*="_groups"] [class*="_modelRow"]')
      const target = liveRows[rowIndex]?.querySelector('button[class*="_modelOption"]')
      if (target && !target.disabled) target.click()
    }

    const triggerNativeFavorite = (rowIndex) => {
      const liveRows = panel.querySelectorAll('[class*="_groups"] [class*="_modelRow"]')
      const target = liveRows[rowIndex]?.querySelector('button[class*="_favorite"]')
      if (target && !target.disabled) target.click()
    }

    if (elementRows.length > 0) {
      const ptableSection = doc.createElement('section')
      ptableSection.className = 'hf-ptable-section'

      const eyebrow = doc.createElement('div')
      eyebrow.className = 'hf-deck-eyebrow'
      const leftLabel = doc.createElement('span')
      leftLabel.textContent = zh ? 'PERIODIC CORE // 元素周期矩阵' : 'PERIODIC CORE · AGY-04'
      const rightLabel = doc.createElement('strong')
      rightLabel.textContent = query ? `MATCH ${elementRows.length}/4` : 'Z:01-18'
      eyebrow.append(leftLabel, rightLabel)

      const grid = doc.createElement('div')
      grid.className = 'hf-ptable-grid'

      for (const item of elementRows) {
        const { spec } = item
        const card = doc.createElement('div')
        card.className = 'hf-el-card'
        card.setAttribute('role', 'button')
        card.setAttribute('tabindex', '-1')
        card.setAttribute('data-el', spec.sym)
        card.setAttribute('data-z', spec.z)
        card.setAttribute('data-checked', item.checked ? '1' : '0')
        card.setAttribute('data-highlighted', item.highlighted ? '1' : '0')
        card.setAttribute('data-disabled', item.disabled ? '1' : '0')
        card.setAttribute('aria-checked', item.checked ? 'true' : 'false')
        card.title = item.name

        card.addEventListener('click', (event) => {
          event.preventDefault()
          event.stopPropagation()
          triggerNativeOption(item.rowIndex)
        })

        // Top meta row
        const top = doc.createElement('div')
        top.className = 'hf-el-top'

        const meta = doc.createElement('span')
        meta.className = 'hf-el-meta'
        const zEl = doc.createElement('span')
        zEl.className = 'hf-el-z'
        zEl.textContent = spec.z
        const orbEl = doc.createElement('span')
        orbEl.className = 'hf-el-orbital'
        orbEl.textContent = spec.orbital
        meta.append(zEl, orbEl)

        const controls = doc.createElement('span')
        controls.className = 'hf-el-controls'

        if (item.pending) {
          const dot = doc.createElement('span')
          dot.className = 'hf-pending-dot'
          controls.append(dot)
        } else if (item.checked) {
          const act = doc.createElement('span')
          act.className = 'hf-el-act'
          act.innerHTML = `${renderHddIcon('check', { size: 9 })}<span>ACT</span>`
          controls.append(act)
        }

        if (item.hasFav) {
          const star = doc.createElement('button')
          star.type = 'button'
          star.className = 'hf-cell-star'
          star.setAttribute('aria-pressed', item.favorite ? 'true' : 'false')
          star.setAttribute('aria-label', item.favorite ? `Unfavorite ${item.name}` : `Favorite ${item.name}`)
          star.disabled = item.favDisabled
          star.innerHTML = item.favorite ? STAR_SVG_FILLED : STAR_SVG_EMPTY
          star.addEventListener('click', (event) => {
            event.preventDefault()
            event.stopPropagation()
            triggerNativeFavorite(item.rowIndex)
          })
          controls.append(star)
        }

        top.append(meta, controls)

        // Middle symbol + copy
        const mid = doc.createElement('div')
        mid.className = 'hf-el-mid'
        const symEl = doc.createElement('span')
        symEl.className = 'hf-el-sym'
        symEl.textContent = spec.sym
        const copy = doc.createElement('span')
        copy.className = 'hf-el-copy'
        const nameEl = doc.createElement('span')
        nameEl.className = 'hf-el-name'
        appendHighlightedText(doc, nameEl, spec.en, query)
        const tagEl = doc.createElement('span')
        tagEl.className = 'hf-el-tag'
        tagEl.textContent = zh ? `${spec.zhPrefix} · ${spec.zhTag}` : spec.enTag
        copy.append(nameEl, tagEl)
        mid.append(symEl, copy)

        // Bottom 4-bar capacity + group code
        const foot = doc.createElement('div')
        foot.className = 'hf-el-foot'
        const bars = doc.createElement('span')
        bars.className = 'hf-el-bars'
        bars.setAttribute('aria-hidden', 'true')
        for (let b = 0; b < 4; b++) {
          const seg = doc.createElement('i')
          seg.setAttribute('data-lit', b < spec.bars ? '1' : '0')
          bars.append(seg)
        }
        const grp = doc.createElement('span')
        grp.className = 'hf-el-group'
        grp.textContent = spec.group
        foot.append(bars, grp)

        card.append(top, mid, foot)
        grid.append(card)
      }

      ptableSection.append(eyebrow, grid)
      deck.append(ptableSection)
    }

    if (secondaryRows.length > 0) {
      const secSection = doc.createElement('section')
      secSection.className = 'hf-secondary-section'

      const eyebrow = doc.createElement('div')
      eyebrow.className = 'hf-deck-eyebrow'
      const titleSpan = doc.createElement('span')
      titleSpan.textContent = elementRows.length > 0
        ? (zh ? 'EXTENDED CATALOG // 次级紧凑模型' : 'EXTENDED CATALOG')
        : (zh ? 'MODEL CATALOG // 可用模型列表' : 'MODEL CATALOG')
      const countEl = doc.createElement('strong')
      countEl.textContent = String(secondaryRows.length).padStart(2, '0')
      eyebrow.append(titleSpan, countEl)

      const list = doc.createElement('div')
      list.className = 'hf-secondary-list'

      for (const item of secondaryRows) {
        const rowEl = doc.createElement('div')
        rowEl.className = 'hf-sec-row'
        rowEl.setAttribute('role', 'button')
        rowEl.setAttribute('tabindex', '-1')
        rowEl.setAttribute('data-checked', item.checked ? '1' : '0')
        rowEl.setAttribute('data-highlighted', item.highlighted ? '1' : '0')
        rowEl.setAttribute('data-disabled', item.disabled ? '1' : '0')
        rowEl.setAttribute('aria-checked', item.checked ? 'true' : 'false')
        rowEl.title = item.name

        rowEl.addEventListener('click', (event) => {
          event.preventDefault()
          event.stopPropagation()
          triggerNativeOption(item.rowIndex)
        })

        const tag = doc.createElement('span')
        tag.className = 'hf-sec-tag'
        tag.textContent = classifySecondaryTag(item.name)

        const nameEl = doc.createElement('span')
        nameEl.className = 'hf-sec-name'
        appendHighlightedText(doc, nameEl, item.name, query)

        rowEl.append(tag, nameEl)

        if (item.pending || item.checked) {
          const checkSlot = doc.createElement('span')
          checkSlot.className = 'hf-sec-check'
          if (item.pending) {
            checkSlot.innerHTML = '<span class="hf-pending-dot"></span>'
          } else {
            checkSlot.innerHTML = renderHddIcon('check', { size: 13 })
          }
          rowEl.append(checkSlot)
        }

        if (item.hasFav) {
          const star = doc.createElement('button')
          star.type = 'button'
          star.className = 'hf-row-star'
          star.setAttribute('aria-pressed', item.favorite ? 'true' : 'false')
          star.setAttribute('aria-label', item.favorite ? `Unfavorite ${item.name}` : `Favorite ${item.name}`)
          star.disabled = item.favDisabled
          star.innerHTML = item.favorite ? STAR_SVG_FILLED : STAR_SVG_EMPTY
          star.addEventListener('click', (event) => {
            event.preventDefault()
            event.stopPropagation()
            triggerNativeFavorite(item.rowIndex)
          })
          rowEl.append(star)
        }

        list.append(rowEl)
      }

      secSection.append(eyebrow, list)
      deck.append(secSection)
    }

    deck.scrollTop = prevScrollTop
    state.modelSignature = signature

    const highlightedEl = deck.querySelector('[data-highlighted="1"]')
    if (highlightedEl && typeof highlightedEl.scrollIntoView === 'function') {
      highlightedEl.scrollIntoView({ block: 'nearest' })
    }
  }

  const syncMenu = (menu) => {
    if (!menu?.isConnected || !shouldEnable()) return
    let state = menuStates.get(menu)
    if (!state) {
      state = {
        effortSignature: '',
        modelSignature: '',
        draggingSlider: false,
        pendingEffortIdx: null,
        observer: null,
      }
      if (typeof MutationObserver === 'function') {
        const obs = new MutationObserver((records) => {
          const relevant = records.some((r) => {
            if (r.target instanceof Element && r.target.closest('[data-cx-ext-owned="hdd-fairy"]')) return false
            if (r.type === 'childList') {
              const touched = [...(r.addedNodes ?? []), ...(r.removedNodes ?? [])]
              if (touched.length > 0 && touched.every((n) => typeof n?.getAttribute === 'function' && n.getAttribute('data-cx-ext-owned') === 'hdd-fairy')) {
                return false
              }
            }
            return true
          })
          if (relevant) scheduleSync()
        })
        obs.observe(menu, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['aria-checked', 'aria-pressed', 'data-highlighted', 'disabled', 'hidden', 'class', 'aria-busy'],
        })
        state.observer = obs
      }
      menuStates.set(menu, state)
    }
    syncThinkingPanel(menu, state)
    syncModelPanel(menu, state)
  }

  const syncAllMenus = () => {
    if (!shouldEnable()) {
      cleanupAll()
      return
    }
    if (typeof doc?.querySelectorAll !== 'function') return
    const liveMenus = new Set(doc.querySelectorAll('body > div[id$="-menu"][class*="_menu"]'))
    for (const prev of [...menuStates.keys()]) {
      if (!liveMenus.has(prev) || !prev.isConnected) {
        cleanupMenu(prev)
      }
    }
    for (const menu of liveMenus) {
      syncMenu(menu)
    }
  }

  const scheduleSync = () => {
    if (syncFrame || disposed) return
    syncFrame = requestAnimationFrame(() => {
      syncFrame = 0
      syncAllMenus()
    })
  }

  const ensureBodyObserver = () => {
    if (bodyObserver || !doc?.body || typeof MutationObserver !== 'function') return
    bodyObserver = new MutationObserver((records) => {
      let sawMenuChange = false
      for (const r of records) {
        if (r.type !== 'childList') continue
        for (const removed of r.removedNodes ?? []) {
          if (removed instanceof Element && removed.matches?.('div[id$="-menu"][class*="_menu"]')) {
            sawMenuChange = true
            if (escapeMenu === removed) clearEscapeGuard()
          }
        }
        for (const added of r.addedNodes ?? []) {
          if (added instanceof Element && added.matches?.('div[id$="-menu"][class*="_menu"]')) {
            sawMenuChange = true
            syncMenu(added)
          }
        }
      }
      if (sawMenuChange) scheduleSync()
    })
    bodyObserver.observe(doc.body, { childList: true })
  }

  const reconcile = () => {
    if (!shouldEnable()) {
      clearEscapeGuard()
      bodyObserver?.disconnect()
      bodyObserver = null
      cleanupAll()
      return
    }
    ensureBodyObserver()
    syncAllMenus()
  }

  const dispose = () => {
    if (disposed) return
    disposed = true
    clearEscapeGuard()
    bodyObserver?.disconnect()
    bodyObserver = null
    cleanupAll()
  }

  api?.signal?.addEventListener?.('abort', dispose, { once: true })

  return { reconcile, dispose }
}
