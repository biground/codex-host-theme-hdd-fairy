import {
  DEFAULT_SETTINGS,
  hddWelcomeLine,
  normalizeSettings,
  subscribeColorSchemeBroadcast,
} from '../shared/fairy-core.mjs'

function detectWebColorScheme(doc, preferred) {
  if (preferred === 'dark' || preferred === 'light') return preferred
  const widgetHost = doc.querySelector('[data-cx-host-widget="hdd-fairy"]')
  const widgetScheme = widgetHost?.style?.colorScheme
  if (widgetScheme === 'dark' || widgetScheme === 'light') return widgetScheme
  const root = doc.documentElement
  const attr = root.getAttribute('data-theme') || root.getAttribute('data-dsw-theme')
  if (attr === 'dark' || attr === 'light') return attr
  if (root.classList.contains('dark')) return 'dark'
  if (root.classList.contains('light')) return 'light'
  const computed = window.getComputedStyle?.(root)?.colorScheme
  if (computed === 'dark' || computed === 'light') return computed
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
}

export async function activate(api) {
  const doc = document
  const root = doc.documentElement
  const signal = api.signal

  let settings = normalizeSettings(await api.storage.get().catch(() => DEFAULT_SETTINGS))
  if (signal.aborted) return

  let broadcastScheme = null
  let currentScheme = detectWebColorScheme(doc, broadcastScheme)

  // Publish authenticated static asset URLs as CSS custom properties for web/style.css.
  const esc = (url) => String(url).replace(/["\\]/g, '\\$&')
  const assetStyle = doc.createElement('style')
  assetStyle.dataset.cxWebExtAssets = api.id
  assetStyle.textContent = [
    'html:is([data-cx-ext-hdd-fairy-theme-dark],[data-cx-ext-hdd-fairy-theme-light]){',
    `--hf-asset-avatar:url("${esc(api.assets.url('assets/agent-avatar.png'))}");`,
    `--hf-asset-hdd-logo:url("${esc(api.assets.url('assets/hdd-logo.png'))}");`,
    `--hf-asset-hdd-mesh:url("${esc(api.assets.url('assets/hdd-mesh.png'))}");`,
    `--hf-asset-running-mark:url("${esc(api.assets.url('assets/running-mark-source.png'))}");`,
    '}',
  ].join('')
  ;(doc.head ?? root).append(assetStyle)
  api.track(() => assetStyle.remove())

  // Track hero welcome mount & geometry
  let heroMount = null
  let heroContent = null
  let heroObserver = null
  let observedCard = null
  let geometryFrame = 0

  const teardownHero = () => {
    cancelAnimationFrame(geometryFrame)
    geometryFrame = 0
    heroObserver?.disconnect()
    heroObserver = null
    observedCard = null
    if (heroContent) {
      for (const prop of ['--hf-hdd-x', '--hf-hdd-y', '--hf-hdd-w', '--hf-hdd-bottom']) {
        heroContent.style.removeProperty(prop)
      }
      heroContent = null
    }
    heroMount?.dispose()
    heroMount = null
  }

  const updateHeroGeometry = () => {
    if (!heroContent || signal.aborted) return
    const card = heroContent.querySelector('[data-composer-card]')
    if (!card) return
    const body = heroContent.getBoundingClientRect()
    const box = card.getBoundingClientRect()
    if (!box.width || !body.width) return
    const nextVars = [
      ['--hf-hdd-x', `${Math.round(box.left + box.width / 2 - body.left)}px`],
      ['--hf-hdd-y', `${Math.round(box.top - body.top)}px`],
      ['--hf-hdd-w', `${Math.round(box.width)}px`],
      ['--hf-hdd-bottom', `${Math.round(box.bottom - body.top)}px`],
    ]
    for (const [prop, value] of nextVars) {
      if (heroContent.style.getPropertyValue(prop) !== value) {
        heroContent.style.setProperty(prop, value)
      }
    }
  }

  const scheduleHeroGeometry = () => {
    if (geometryFrame || !heroContent) return
    geometryFrame = requestAnimationFrame(() => {
      geometryFrame = 0
      updateHeroGeometry()
    })
  }

  const reconcileHero = () => {
    if (signal.aborted) return
    const wantsHero = settings.enableWebTheme && settings.webHeroWatermark && currentScheme === 'dark'
    const candidate = wantsHero ? doc.querySelector('[data-conversation-content][data-content-phase="hero"]') : null

    if (!candidate) {
      teardownHero()
      return
    }
    if (candidate === heroContent && heroMount && heroMount.container.isConnected) {
      const greetingEl = heroMount.container.querySelector('.hf-hdd-greeting')
      const nextGreeting = hddWelcomeLine(doc.documentElement.lang || navigator.language)
      if (greetingEl && greetingEl.textContent !== nextGreeting) {
        greetingEl.textContent = nextGreeting
      }
      if (heroObserver) {
        const card = candidate.querySelector('[data-composer-card]')
        if (card && card !== observedCard) {
          if (observedCard) heroObserver.unobserve(observedCard)
          heroObserver.observe(card)
          observedCard = card
        }
      }
      scheduleHeroGeometry()
      return
    }

    teardownHero()
    const mounted = api.dom.mount(candidate, 'append')
    if (!mounted) return
    heroMount = mounted
    heroContent = candidate

    const copy = doc.createElement('div')
    copy.className = 'hf-hdd-copy'
    copy.lang = 'zh-CN'
    copy.innerHTML = [
      '<div class="hf-hdd-heading">',
      '<span class="hf-hdd-english" lang="en" aria-hidden="true">HOLLOW DEEP DIVE SYSTEM</span>',
      '<h1 class="hf-hdd-chinese">空洞深潜系统</h1>',
      '</div>',
      '<p class="hf-hdd-greeting"></p>',
    ].join('')
    copy.querySelector('.hf-hdd-greeting').textContent = hddWelcomeLine(doc.documentElement.lang || navigator.language)
    mounted.container.append(copy)

    if (typeof ResizeObserver === 'function') {
      heroObserver = new ResizeObserver(scheduleHeroGeometry)
      heroObserver.observe(candidate)
      const card = candidate.querySelector('[data-composer-card]')
      if (card) {
        heroObserver.observe(card)
        observedCard = card
      }
    }
    updateHeroGeometry()
  }

  let appliedTheme = null
  let appliedHero = null

  const syncThemeMarks = () => {
    if (signal.aborted) return
    currentScheme = detectWebColorScheme(doc, broadcastScheme)
    const nextTheme = !settings.enableWebTheme ? 'off' : currentScheme === 'dark' ? 'dark' : 'light'
    if (nextTheme !== appliedTheme) {
      if (nextTheme === 'off') {
        api.dom.unmark(root, 'theme-dark')
        api.dom.unmark(root, 'theme-light')
      } else if (nextTheme === 'dark') {
        api.dom.unmark(root, 'theme-light')
        api.dom.mark(root, 'theme-dark')
      } else {
        api.dom.unmark(root, 'theme-dark')
        api.dom.mark(root, 'theme-light')
      }
      appliedTheme = nextTheme
    }
    const nextHero = settings.enableWebTheme && settings.webHeroWatermark && currentScheme === 'dark'
    if (nextHero !== appliedHero) {
      if (nextHero) {
        api.dom.mark(root, 'hero')
      } else {
        api.dom.unmark(root, 'hero')
      }
      appliedHero = nextHero
    }
    if (!settings.enableWebTheme) {
      teardownHero()
      return
    }
    reconcileHero()
  }

  syncThemeMarks()

  const offScheme = subscribeColorSchemeBroadcast((next) => {
    broadcastScheme = next
    syncThemeMarks()
  }, signal)

  const offStorage = api.storage.onChange((next) => {
    settings = normalizeSettings(next)
    syncThemeMarks()
  })

  const isRelevantMutation = (record) => {
    if (heroMount && heroMount.container.contains(record.target)) return false
    if (record.type === 'childList') {
      if (heroMount && record.target === heroContent) {
        const touched = [...record.addedNodes, ...record.removedNodes]
        if (touched.length > 0 && touched.every((node) => node === heroMount.container)) {
          return false
        }
      }
      return true
    }
    if (record.type === 'attributes' && record.attributeName === 'style') {
      if (record.target === root) return true
      return record.target instanceof Element && record.target.matches('[data-cx-host-widget="hdd-fairy"]')
    }
    return true
  }

  let domObserver = null
  if (typeof MutationObserver === 'function') {
    let scheduled = false
    domObserver = new MutationObserver((records) => {
      if (scheduled || signal.aborted) return
      if (!records.some(isRelevantMutation)) return
      scheduled = true
      queueMicrotask(() => {
        scheduled = false
        syncThemeMarks()
      })
    })
    domObserver.observe(root, { attributes: true, attributeFilter: ['class', 'style', 'data-theme', 'data-dsw-theme', 'lang'] })
    if (doc.body) {
      domObserver.observe(doc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-content-phase', 'style'] })
    }
  }

  const media = window.matchMedia?.('(prefers-color-scheme: dark)')
  media?.addEventListener?.('change', syncThemeMarks, { signal })
  window.addEventListener('resize', scheduleHeroGeometry, { signal })
  const greetingTimer = setInterval(reconcileHero, 60_000)

  return () => {
    clearInterval(greetingTimer)
    domObserver?.disconnect()
    offScheme()
    offStorage()
    teardownHero()
  }
}
