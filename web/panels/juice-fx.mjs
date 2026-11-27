// Lightweight interaction juice FX controller for H.D.D + Fairy.
// Handles tactical pointerdown bursts (auto-removed after 220ms) and code-block copy stamp pulse.

const PRESET_COLORS = Object.freeze({
  amber: '#f8cb29',
  street: '#c8ff00',
  archive: '#2455e7',
})

const PANEL_REGION_TESTS = [
  ['shell', '[data-cx-region="sidebar"], [data-cx-region="header"], [data-phone-drawer], [data-hf-token-scope="shell"]'],
  ['composer', '[data-composer-card], [data-queue-dock], [data-composer-dock], [data-question-key], [data-approval-key], [data-plan-review-key], [data-trigger-menu], [data-hf-token-scope="composer"]'],
  ['rightbar', '[data-sidebar-right-panel], [data-hf-token-scope="rightbar"]'],
  ['settings', '[data-shortcut-modal], [data-plugin-panel], [data-web-extensions], [data-connect-devices], [data-remote-peers-panel], [data-hf-token-scope="settings"]'],
  ['chat', '[data-conversation-content], [data-hf-token-scope="chat"]'],
]

const BURST_TARGET_SELECTOR = [
  'button[class*="_newSession"]',
  '[data-toolbar-fixed="end"] button',
  '[data-approval-key] button',
  '[data-plan-review-key] button',
  '[data-question-key] button[role="radio"]',
  '[data-question-key] button[role="checkbox"]',
  '[data-question-key] footer button',
  'button[class*="_primary"]:not([class*="_dangerConfirm"])',
  'button[class*="_save"]',
  '.settings-command-button',
  'button[class*="_submit"]',
  'button[class*="_reconnectBtn"]',
  'a[class*="_downloadLink"]',
  '.hf-btn',
  '.hf-pill',
  '.hf-preset-card',
  '[data-composer-dock] [class*="_pill"]',
  '[data-composer-dock] [class*="_trigger"]',
  '[data-cx-region="sidebar"] [class*="_panelRow"]',
  '[data-cx-region="sidebar"] [class*="_toggle"]',
  '[data-cx-region="sidebar"] [class*="_collapsed"] button',
  '[data-conversation-tabs] [role="tab"]',
  '[data-dockkit-tab]',
].join(', ')

const CODE_CONTAINER_SELECTOR = '.md-code-block, [data-code-block-banner], [data-diff], [data-terminal], [data-code-preview]'
const COPY_KEYWORD_RE = /\bcopy\b|copied|复制|已复制/i

const BURST_CLEANUP_MS = 230
const COPY_PULSE_MS = 420
const MAX_ACTIVE_BURSTS = 6

function normalizePreset(value) {
  return value === 'street' || value === 'archive' ? value : value === 'amber' ? 'amber' : null
}

function isDisabledControl(el) {
  return Boolean(
    el.disabled ||
    el.getAttribute('aria-disabled') === 'true' ||
    (typeof el.matches === 'function' && el.matches(':disabled')),
  )
}

function findCopyButton(target) {
  if (!(target instanceof Element)) return null
  const btn = target.closest('button')
  if (!btn || isDisabledControl(btn)) return null
  const label = [
    btn.getAttribute('aria-label') || '',
    btn.getAttribute('title') || '',
    btn.getAttribute('data-action') || '',
    btn.getAttribute('data-testid') || '',
    btn.className && typeof btn.className === 'string' ? btn.className : '',
  ].join(' ')
  if (COPY_KEYWORD_RE.test(label)) return btn
  const text = (btn.textContent || '').trim()
  if (text && text.length <= 24 && COPY_KEYWORD_RE.test(text)) return btn
  if (btn.closest(CODE_CONTAINER_SELECTOR) && btn.closest('[data-code-block-banner]')) {
    return btn
  }
  return null
}

function findBurstTarget(target) {
  if (!(target instanceof Element)) return null
  const matched = target.closest(BURST_TARGET_SELECTOR)
  if (matched && !isDisabledControl(matched)) return matched
  return findCopyButton(target)
}

function resolvePresetAt(target, settings) {
  const localCard = target.closest('.hf-preset-card[data-preset], .hf-page[data-preset]')
  const localPreset = normalizePreset(localCard?.getAttribute('data-preset'))
  if (localPreset) return localPreset

  const root = document.documentElement
  for (const [panel, selector] of PANEL_REGION_TESTS) {
    if (!target.closest(selector)) continue
    const domPreset = normalizePreset(root?.getAttribute(`data-hf-preset-${panel}`))
    if (domPreset) return domPreset
    const key = `panel${panel[0].toUpperCase()}${panel.slice(1)}Preset`
    const settingPreset = normalizePreset(settings?.[key])
    if (settingPreset) return settingPreset
    break
  }

  return (
    normalizePreset(root?.getAttribute('data-cx-ext-hdd-fairy-preset')) ||
    normalizePreset(settings?.globalPreset) ||
    'amber'
  )
}

export function mountJuiceFx(api, getSettings) {
  let disposed = false
  let bound = false
  const activeBursts = new Set()
  const copyTimers = new Map()

  const reducedMotionQuery =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null

  const removeBurst = (entry) => {
    if (!activeBursts.has(entry)) return
    activeBursts.delete(entry)
    clearTimeout(entry.timer)
    entry.el.remove()
  }

  const cleanupEffects = () => {
    for (const entry of [...activeBursts]) removeBurst(entry)
    for (const [btn, timer] of copyTimers) {
      clearTimeout(timer)
      btn.removeAttribute('data-hf-copied-pulse')
    }
    copyTimers.clear()
  }

  const spawnBurst = (x, y, preset) => {
    const host = document.body || document.documentElement
    if (!host || !Number.isFinite(x) || !Number.isFinite(y)) return

    if (activeBursts.size >= MAX_ACTIVE_BURSTS) {
      const oldest = activeBursts.values().next().value
      if (oldest) removeBurst(oldest)
    }

    const burst = document.createElement('span')
    burst.setAttribute('data-cx-ext-owned', 'hdd-fairy')
    burst.setAttribute('data-hf-burst-preset', preset)
    burst.setAttribute('aria-hidden', 'true')
    burst.className = 'hf-juice-burst'
    burst.style.left = `${Math.round(x)}px`
    burst.style.top = `${Math.round(y)}px`
    burst.style.setProperty('--hf-burst-color', PRESET_COLORS[preset] || PRESET_COLORS.amber)

    const frame = document.createElement('i')
    frame.className = 'hf-juice-burst-frame'
    const cross = document.createElement('i')
    cross.className = 'hf-juice-burst-cross'
    burst.append(frame, cross)
    host.append(burst)

    const entry = { el: burst, timer: 0 }
    entry.timer = setTimeout(() => removeBurst(entry), BURST_CLEANUP_MS)
    frame.addEventListener('animationend', () => removeBurst(entry), { once: true })
    activeBursts.add(entry)
  }

  const triggerCopyPulse = (btn) => {
    const prevTimer = copyTimers.get(btn)
    if (prevTimer) clearTimeout(prevTimer)
    btn.removeAttribute('data-hf-copied-pulse')
    // Force animation restart cleanly on consecutive clicks without touching layout geometry.
    void btn.offsetWidth
    btn.setAttribute('data-hf-copied-pulse', '1')
    const timer = setTimeout(() => {
      copyTimers.delete(btn)
      btn.removeAttribute('data-hf-copied-pulse')
    }, COPY_PULSE_MS)
    copyTimers.set(btn, timer)
  }

  const shouldEnable = () => {
    if (disposed || api?.signal?.aborted) return false
    if (reducedMotionQuery?.matches) return false
    const settings = typeof getSettings === 'function' ? getSettings() : null
    if (!settings) return false
    return Boolean(settings.enableWebTheme && settings.enableMotionJuice !== false)
  }

  const onPointerDown = (event) => {
    if (!bound || disposed || event.button !== 0) return
    if (reducedMotionQuery?.matches) return
    const target = findBurstTarget(event.target)
    if (!target) return
    const settings = typeof getSettings === 'function' ? getSettings() : null
    const preset = resolvePresetAt(target, settings)
    spawnBurst(event.clientX, event.clientY, preset)
  }

  const onClick = (event) => {
    if (!bound || disposed) return
    if (reducedMotionQuery?.matches) return
    const copyBtn = findCopyButton(event.target)
    if (copyBtn) triggerCopyPulse(copyBtn)
  }

  const bind = () => {
    if (bound || disposed) return
    document.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true })
    document.addEventListener('click', onClick, { capture: true, passive: true })
    bound = true
  }

  const unbind = () => {
    if (!bound) return
    document.removeEventListener('pointerdown', onPointerDown, true)
    document.removeEventListener('click', onClick, true)
    bound = false
  }

  const reconcile = () => {
    if (shouldEnable()) {
      bind()
    } else {
      unbind()
      cleanupEffects()
    }
  }

  const onReducedMotionChange = () => reconcile()
  if (reducedMotionQuery) {
    if (typeof reducedMotionQuery.addEventListener === 'function') {
      reducedMotionQuery.addEventListener('change', onReducedMotionChange)
    } else if (typeof reducedMotionQuery.addListener === 'function') {
      reducedMotionQuery.addListener(onReducedMotionChange)
    }
  }

  const dispose = () => {
    if (disposed) return
    disposed = true
    unbind()
    cleanupEffects()
    if (reducedMotionQuery) {
      if (typeof reducedMotionQuery.removeEventListener === 'function') {
        reducedMotionQuery.removeEventListener('change', onReducedMotionChange)
      } else if (typeof reducedMotionQuery.removeListener === 'function') {
        reducedMotionQuery.removeListener(onReducedMotionChange)
      }
    }
  }

  api?.signal?.addEventListener?.('abort', dispose, { once: true })

  return { reconcile, dispose }
}
