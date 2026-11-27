import {
  DEFAULT_SETTINGS,
  EYE_ANIMATION_CSS,
  createFairyEye,
  hddWelcomeLine,
  normalizeSettings,
  PANEL_KEYS,
  resolvePanelPreset,
} from '../shared/fairy-core.mjs'
import { mountUsagePanel } from './usage-panel.mjs'
import { TOKENS_CSS } from './panels/tokens.mjs'
import { SHELL_PANEL_CSS } from './panels/shell-css.mjs'
import { CHAT_PANEL_CSS } from './panels/chat-css.mjs'
import { COMPOSER_PANEL_CSS } from './panels/composer-css.mjs'
import { MODEL_SELECT_PANEL_CSS } from './panels/model-select-css.mjs'
import { RIGHTBAR_PANEL_CSS } from './panels/rightbar-css.mjs'
import { SETTINGS_PANEL_CSS } from './panels/settings-css.mjs'
import { JUICE_PANEL_CSS } from './panels/juice-css.mjs'
import { mountJuiceFx } from './panels/juice-fx.mjs'
import { mountChatAvatarFx } from './panels/chat-avatar-fx.mjs'
import { mountModelSelectEnhancer } from './panels/model-select-fx.mjs'
import { mountRightbarFilesEnhance } from './panels/rightbar-files.mjs'
import { mountSettingsShadowBridge } from './panels/settings-shadow.mjs'

function resolvePresetThemeScheme(settings) {
  if (!settings.enableWebTheme) return 'off'
  return settings.globalPreset === 'archive' ? 'light' : 'dark'
}

function findHeroStack(scope) {
  if (!scope) return null
  const anchor = scope.querySelector('[class*="_fishHitbox"]') ?? scope.querySelector('[class*="_titleGroup"]')
  const headline = anchor?.closest('[class*="_headline"]')
  return headline?.parentElement ?? null
}

export async function activate(api) {
  const doc = document
  const root = doc.documentElement
  const signal = api.signal

  let settings = normalizeSettings(await api.storage.get().catch(() => DEFAULT_SETTINGS))
  if (signal.aborted) return

  const rightbarFiles = mountRightbarFilesEnhance(api, () => settings)
  const settingsShadow = mountSettingsShadowBridge(api, () => settings)
  const juiceFx = mountJuiceFx(api, () => settings)
  const chatAvatarFx = mountChatAvatarFx(api, () => settings)
  const modelSelectFx = mountModelSelectEnhancer(api, () => settings)
  api.track(() => rightbarFiles.dispose())
  api.track(() => settingsShadow.dispose())
  api.track(() => juiceFx.dispose())
  api.track(() => chatAvatarFx.dispose())
  api.track(() => modelSelectFx.dispose())

  for (const [panel, css] of Object.entries({ tokens: TOKENS_CSS, shell: SHELL_PANEL_CSS, chat: CHAT_PANEL_CSS, composer: COMPOSER_PANEL_CSS, 'model-select': MODEL_SELECT_PANEL_CSS, rightbar: RIGHTBAR_PANEL_CSS, settings: SETTINGS_PANEL_CSS, juice: JUICE_PANEL_CSS })) {
    const style = doc.createElement('style')
    style.dataset.cxWebExtPanel = panel
    style.textContent = css
    ;(doc.head ?? root).append(style)
    api.track(() => style.remove())
  }

  const panelKeys = PANEL_KEYS.filter((key) => key !== 'usage')
  const syncPanelMarks = () => {
    if (settings.enableWebTheme) root.setAttribute('data-cx-ext-hdd-fairy-preset', settings.globalPreset)
    else root.removeAttribute('data-cx-ext-hdd-fairy-preset')
    if (settings.enableWebTheme && settings.enableMotionJuice) root.setAttribute('data-hf-juice', '1')
    else root.removeAttribute('data-hf-juice')
    for (const panel of panelKeys) {
      const enabled = settings.enableWebTheme && settings[`panel${panel[0].toUpperCase()}${panel.slice(1)}Enabled`]
      if (enabled) {
        root.setAttribute(`data-hf-panel-${panel}`, '1')
        root.setAttribute(`data-hf-preset-${panel}`, resolvePanelPreset(settings, panel))
      } else {
        root.removeAttribute(`data-hf-panel-${panel}`)
        root.removeAttribute(`data-hf-preset-${panel}`)
      }
    }
  }
  api.track(() => {
    root.removeAttribute('data-cx-ext-hdd-fairy-preset')
    root.removeAttribute('data-hf-juice')
    for (const panel of panelKeys) {
      root.removeAttribute(`data-hf-panel-${panel}`)
      root.removeAttribute(`data-hf-preset-${panel}`)
    }
  })

  const hddLogoUrl = api.assets.url('assets/hdd-logo.png')

  // Publish authenticated static asset URLs as CSS custom properties for web/style.css.
  const esc = (url) => String(url).replace(/["\\]/g, '\\$&')
  const assetStyle = doc.createElement('style')
  assetStyle.dataset.cxWebExtAssets = api.id
  assetStyle.textContent = [
    'html:is([data-cx-ext-hdd-fairy-theme-dark],[data-cx-ext-hdd-fairy-theme-light]){',
    `--hf-asset-avatar:url("${esc(api.assets.url('assets/agent-avatar.png'))}");`,
    `--hf-asset-hdd-logo:url("${esc(hddLogoUrl)}");`,
    `--hf-asset-hdd-mesh:url("${esc(api.assets.url('assets/hdd-mesh.png'))}");`,
    `--hf-asset-running-mark:url("${esc(api.assets.url('assets/running-mark-source.png'))}");`,
    '}',
  ].join('')
  ;(doc.head ?? root).append(assetStyle)
  api.track(() => assetStyle.remove())

  const eyeAnimStyle = doc.createElement('style')
  eyeAnimStyle.dataset.cxWebExtEyeCss = api.id
  eyeAnimStyle.textContent = EYE_ANIMATION_CSS
  ;(doc.head ?? root).append(eyeAnimStyle)
  api.track(() => eyeAnimStyle.remove())

  // Track sidebar brand replacement (expanded lockup & collapsed rail eye)
  let brandMount = null
  let brandTarget = null
  let brandEye = null
  let railMount = null
  let railTarget = null
  let railEye = null

  const teardownBrandExpanded = () => {
    brandEye?.dispose()
    brandEye = null
    brandMount?.dispose()
    brandMount = null
    brandTarget = null
  }

  const teardownBrandRail = () => {
    railEye?.dispose()
    railEye = null
    railMount?.dispose()
    railMount = null
    railTarget = null
  }

  const teardownBrand = () => {
    teardownBrandExpanded()
    teardownBrandRail()
  }

  const reconcileBrand = () => {
    if (signal.aborted) return
    if (!settings.enableWebTheme || !settings.panelShellEnabled) {
      teardownBrand()
      return
    }
    const sidebar = doc.querySelector('[data-cx-region="sidebar"]')
    if (!sidebar) {
      teardownBrand()
      return
    }

    const identity = sidebar.querySelector('[class*="_brandIdentity"]')
    if (!identity) {
      teardownBrandExpanded()
    } else if (identity !== brandTarget || !brandMount || !brandMount.container.isConnected) {
      teardownBrandExpanded()
      const mounted = api.dom.mount(identity, 'append')
      if (mounted) {
        brandMount = mounted
        brandTarget = identity
        mounted.container.className = 'hf-sb-brand-mount'

        const wrap = doc.createElement('span')
        wrap.className = 'hf-sb-brand'
        wrap.setAttribute('aria-hidden', 'true')

        const eyeSlot = doc.createElement('span')
        eyeSlot.className = 'hf-sb-brand-eye'
        brandEye = createFairyEye(doc, { signal, interactiveGlitch: false, idSuffix: 'sb' })
        eyeSlot.append(brandEye.element)

        const textWrap = doc.createElement('span')
        textWrap.className = 'hf-sb-brand-text'

        const title = doc.createElement('b')
        title.className = 'hf-sb-brand-title'
        title.textContent = 'H.D.D System'

        const badge = doc.createElement('span')
        badge.className = 'hf-sb-brand-badge'
        badge.textContent = 'Fairy Ⅲ型人工智能'

        textWrap.append(title, badge)
        wrap.append(eyeSlot, textWrap)
        mounted.container.append(wrap)
      }
    }

    const railMark = sidebar.querySelector('[class*="_railMark"]')
    if (!railMark) {
      teardownBrandRail()
    } else if (railMark !== railTarget || !railMount || !railMount.container.isConnected) {
      teardownBrandRail()
      const mounted = api.dom.mount(railMark, 'append')
      if (mounted) {
        railMount = mounted
        railTarget = railMark
        mounted.container.className = 'hf-sb-rail-mount'

        const eyeSlot = doc.createElement('span')
        eyeSlot.className = 'hf-sb-rail-eye'
        railEye = createFairyEye(doc, { signal, interactiveGlitch: false, idSuffix: 'rail' })
        eyeSlot.append(railEye.element)
        mounted.container.append(eyeSlot)
      }
    }
  }

  // Track hero welcome mount, usage panel mount & geometry
  let heroMount = null
  let heroContent = null
  let heroScrollEl = null
  let heroObserver = null
  let observedNodes = new Set()
  let geometryFrame = 0
  let geometrySettleTimer = 0

  let usageMount = null
  let usageTarget = null
  let usageHostHero = null
  let usagePanel = null

  const syncObservedHeroTargets = () => {
    if (!heroObserver || !heroContent) return
    const nextTargets = new Set([heroContent])
    const card = heroContent.querySelector('[data-composer-card]')
    if (card) {
      nextTargets.add(card)
      const composerHero = card.closest('[class*="_composerHero"]') ?? card.parentElement
      if (composerHero) nextTargets.add(composerHero)
    }
    if (usageMount?.container?.isConnected) {
      nextTargets.add(usageMount.container)
    }
    for (const prev of observedNodes) {
      if (!nextTargets.has(prev)) heroObserver.unobserve(prev)
    }
    for (const next of nextTargets) {
      if (!observedNodes.has(next)) heroObserver.observe(next)
    }
    observedNodes = nextTargets
  }

  const setHeroUsageAttr = (el, val) => {
    if (!el) return
    if (!val) {
      if (el.hasAttribute('data-hf-usage')) el.removeAttribute('data-hf-usage')
    } else if (el.getAttribute('data-hf-usage') !== val) {
      el.setAttribute('data-hf-usage', val)
    }
  }

  const teardownUsage = () => {
    usagePanel?.dispose()
    usagePanel = null
    usageMount?.dispose()
    usageMount = null
    usageTarget = null
    if (usageHostHero) {
      setHeroUsageAttr(usageHostHero, null)
      usageHostHero = null
    }
  }

  const teardownHero = () => {
    cancelAnimationFrame(geometryFrame)
    clearTimeout(geometrySettleTimer)
    geometryFrame = 0
    geometrySettleTimer = 0
    heroObserver?.disconnect()
    heroObserver = null
    observedNodes = new Set()
    if (heroScrollEl) {
      heroScrollEl.removeEventListener('scroll', scheduleHeroGeometry)
      heroScrollEl = null
    }
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

  const reconcileUsage = () => {
    if (signal.aborted) return
    const activeHero = settings.enableWebTheme && settings.webUsagePanel
      ? doc.querySelector('[data-conversation-content][data-content-phase="hero"]')
      : null
    const stack = activeHero ? findHeroStack(activeHero) : null

    if (!activeHero || !stack) {
      if (usageMount) {
        teardownUsage()
        scheduleHeroGeometry()
      }
      return
    }

    if (stack === usageTarget && usageMount && usageMount.container.isConnected && usagePanel) {
      usagePanel.syncSettings({ ...settings, webUsagePreset: resolvePanelPreset(settings, 'usage') })
      setHeroUsageAttr(activeHero, usagePanel.expanded ? 'expanded' : 'collapsed')
      return
    }

    teardownUsage()
    const mounted = api.dom.mount(stack, 'prepend')
    if (!mounted) return
    usageMount = mounted
    usageTarget = stack
    usageHostHero = activeHero
    mounted.container.className = 'hf-usage-mount'

    const shadow = mounted.container.attachShadow({ mode: 'open' })
    usagePanel = mountUsagePanel(shadow, {
      doc,
      win: window,
      initialSettings: { ...settings, webUsagePreset: resolvePanelPreset(settings, 'usage') },
      getLocale: () => doc.documentElement.lang || navigator.language || 'zh-CN',
      hddLogoUrl,
      onPresetSelect: (nextPreset) => {
        const next = normalizeSettings({ ...settings, webUsagePreset: nextPreset })
        settings = next
        api.storage.set(next).catch(() => {})
      },
      onExpandedChange: (isExpanded) => {
        setHeroUsageAttr(activeHero, isExpanded ? 'expanded' : 'collapsed')
        syncObservedHeroTargets()
        scheduleHeroGeometry()
        clearTimeout(geometrySettleTimer)
        geometrySettleTimer = setTimeout(scheduleHeroGeometry, 180)
      },
    })
    syncObservedHeroTargets()
    scheduleHeroGeometry()
  }

  const reconcileHero = () => {
    if (signal.aborted) return
    const wantsHero = settings.enableWebTheme && settings.panelChatEnabled && settings.webHeroWatermark
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
      syncObservedHeroTargets()
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

    const scroller = candidate.querySelector('[data-conversation-scroll]')
    if (scroller) {
      heroScrollEl = scroller
      scroller.addEventListener('scroll', scheduleHeroGeometry, { passive: true })
    }

    if (typeof ResizeObserver === 'function') {
      heroObserver = new ResizeObserver(scheduleHeroGeometry)
      syncObservedHeroTargets()
    }
    updateHeroGeometry()
    clearTimeout(geometrySettleTimer)
    geometrySettleTimer = setTimeout(scheduleHeroGeometry, 160)
  }

  let appliedTheme = null
  let appliedHero = null

  const syncThemeMarks = () => {
    if (signal.aborted) return
    const nextTheme = resolvePresetThemeScheme(settings)
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
    const nextHero = settings.enableWebTheme && settings.panelChatEnabled && settings.webHeroWatermark
    if (nextHero !== appliedHero) {
      if (nextHero) {
        api.dom.mark(root, 'hero')
      } else {
        api.dom.unmark(root, 'hero')
      }
      appliedHero = nextHero
    }
    syncPanelMarks()
    rightbarFiles.reconcile()
    settingsShadow.reconcile()
    juiceFx.reconcile()
    chatAvatarFx.reconcile()
    modelSelectFx.reconcile()
    if (!settings.enableWebTheme) {
      teardownUsage()
      teardownHero()
      teardownBrand()
      return
    }
    reconcileHero()
    reconcileUsage()
    reconcileBrand()
  }

  syncThemeMarks()

  const offStorage = api.storage.onChange((next) => {
    settings = normalizeSettings(next)
    syncThemeMarks()
  })

  const isOwnedMountMutation = (record, mount, parent) => {
    if (!mount) return false
    if (mount.container.contains(record.target)) return true
    if (record.type === 'childList' && record.target === parent) {
      const touched = [...record.addedNodes, ...record.removedNodes]
      if (touched.length > 0 && touched.every((node) => node === mount.container)) {
        return true
      }
    }
    return false
  }

  const isRelevantMutation = (record) => {
    if (isOwnedMountMutation(record, heroMount, heroContent)) return false
    if (isOwnedMountMutation(record, usageMount, usageTarget)) return false
    if (isOwnedMountMutation(record, brandMount, brandTarget)) return false
    if (isOwnedMountMutation(record, railMount, railTarget)) return false
    if (record.target instanceof Element && record.target.closest('[data-cx-ext-owned="hdd-fairy"]')) return false
    if (record.type === 'childList') {
      const touched = [...(record.addedNodes ?? []), ...(record.removedNodes ?? [])]
      if (
        touched.length > 0 &&
        touched.every((node) => typeof node?.getAttribute === 'function' && node.getAttribute('data-cx-ext-owned') === 'hdd-fairy')
      ) {
        return false
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
        if (recordLangChanged) {
          recordLangChanged = false
          usagePanel?.rerender()
        }
        syncThemeMarks()
      })
    })
    domObserver.observe(root, { attributes: true, attributeFilter: ['class', 'style', 'data-theme', 'data-dsw-theme', 'lang'] })
    if (doc.body) {
      domObserver.observe(doc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-content-phase', 'style'] })
    }
  }

  let recordLangChanged = false
  const langObserver =
    typeof MutationObserver === 'function'
      ? new MutationObserver(() => {
          recordLangChanged = true
          usagePanel?.rerender()
        })
      : null
  langObserver?.observe(root, { attributes: true, attributeFilter: ['lang'] })

  window.addEventListener('resize', scheduleHeroGeometry, { signal })
  const greetingTimer = setInterval(reconcileHero, 60_000)

  return () => {
    clearInterval(greetingTimer)
    domObserver?.disconnect()
    langObserver?.disconnect()
    offStorage()
    api.dom.unmark(root, 'theme-dark')
    api.dom.unmark(root, 'theme-light')
    api.dom.unmark(root, 'hero')
    teardownUsage()
    teardownHero()
    teardownBrand()
  }
}
