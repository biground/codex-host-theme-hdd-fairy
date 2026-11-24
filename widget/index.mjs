import {
  BOOT_DURATION_MS,
  DEFAULT_SETTINGS,
  EYE_ANIMATION_CSS,
  MOBILE_MEDIA,
  broadcastColorScheme,
  clampDockPos,
  createFairyEye,
  greetLine,
  isZhLocale,
  moodLabel,
  normalizeSettings,
  readDockPos,
  subscribeFairyAction,
  writeDockPos,
} from '../shared/fairy-core.mjs'

let bootPlayed = false
let replaySeq = 0

function detectHostMood(doc) {
  try {
    if (doc.querySelector('[data-session-status="ongoing"], [data-state="ongoing"]')) return 'working'
  } catch { /* Ignore */ }
  return 'idle'
}

export async function mount(root, api) {
  const doc = root.ownerDocument
  const signal = api.signal
  const mobileMedia = window.matchMedia(MOBILE_MEDIA)

  const eyeStyle = doc.createElement('style')
  eyeStyle.textContent = EYE_ANIMATION_CSS
  root.append(eyeStyle)

  let settings = normalizeSettings(await api.storage.get().catch(() => DEFAULT_SETTINGS))
  if (signal.aborted) return

  let locale = api.locale
  let scheme = api.colorScheme
  broadcastColorScheme(scheme)

  let heroUrl = ''
  let posterUrl = ''
  let bootUrl = ''
  let bootAssetsLoaded = false

  const ensureVisualAssets = async () => {
    if (bootAssetsLoaded || mobileMedia.matches || signal.aborted) return
    bootAssetsLoaded = true
    const [heroRes, posterRes, bootRes] = await Promise.allSettled([
      api.assets.url('assets/hero.png'),
      api.assets.url('assets/poster.jpg'),
      api.assets.url('assets/boot.webp'),
    ])
    if (signal.aborted) return
    if (heroRes.status === 'fulfilled') heroUrl = heroRes.value
    if (posterRes.status === 'fulfilled') posterUrl = posterRes.value
    if (bootRes.status === 'fulfilled') bootUrl = bootRes.value
    if (heroUrl) hero.style.backgroundImage = `url("${heroUrl.replace(/"/g, '\\"')}")`
    if (posterUrl) bootFill.style.backgroundImage = `url("${posterUrl.replace(/"/g, '\\"')}")`
  }

  const layer = doc.createElement('div')
  layer.className = 'hf-layer'
  layer.dataset.scheme = scheme
  root.append(layer)

  // Fullscreen boot + greeting screen (pointer-events: auto ONLY while boot/greet)
  const screen = doc.createElement('div')
  screen.className = 'hf-screen'
  const bg = doc.createElement('div')
  bg.className = 'hf-bg'
  const hero = doc.createElement('div')
  hero.className = 'hf-hero'

  const bootEl = doc.createElement('div')
  bootEl.className = 'hf-boot'
  const bootFill = doc.createElement('div')
  bootFill.className = 'hf-boot-fill'
  const bootStage = doc.createElement('div')
  bootStage.className = 'hf-boot-stage'
  const bootBarWrap = doc.createElement('div')
  bootBarWrap.className = 'hf-boot-bar-wrap'
  const bootBar = doc.createElement('div')
  bootBar.className = 'hf-boot-bar'
  const bootBarFill = doc.createElement('span')
  bootBarFill.className = 'hf-boot-bar-fill'
  bootBar.append(bootBarFill)
  const bootPct = doc.createElement('span')
  bootPct.className = 'hf-boot-pct'
  bootPct.textContent = '0%'
  bootBarWrap.append(bootBar, bootPct)
  const bootSkipBtn = doc.createElement('button')
  bootSkipBtn.type = 'button'
  bootSkipBtn.className = 'hf-boot-skip'
  bootSkipBtn.textContent = '跳过 / SKIP ▸'
  bootEl.append(bootFill, bootStage, bootBarWrap, bootSkipBtn)

  const skipBtn = doc.createElement('button')
  skipBtn.type = 'button'
  skipBtn.className = 'hf-skip'
  skipBtn.textContent = 'SKIP ▸'
  screen.append(bg, hero, bootEl, skipBtn)

  const copyEl = doc.createElement('div')
  copyEl.className = 'hf-copy'
  const copyKicker = doc.createElement('div')
  copyKicker.className = 'hf-copy-kicker'
  copyKicker.textContent = 'H.D.D CORE // ONLINE'
  const copyZh = doc.createElement('div')
  copyZh.className = 'hf-copy-zh'
  copyZh.textContent = '空 洞 深 潜 系 统'
  const copyTitle = doc.createElement('div')
  copyTitle.className = 'hf-copy-title'
  copyTitle.textContent = 'HOLLOW DEEP DIVE SYSTEM'
  const copyLine = doc.createElement('div')
  copyLine.className = 'hf-copy-line'
  copyEl.append(copyKicker, copyZh, copyTitle, copyLine)

  // Interactive Fairy eye core
  const core = doc.createElement('div')
  core.className = 'hf-core'
  core.setAttribute('role', 'button')
  core.tabIndex = 0
  const fairyEye = createFairyEye(doc, { signal })
  core.append(fairyEye.element)

  // Interactive status popover
  const bubble = doc.createElement('div')
  bubble.className = 'hf-bubble'
  bubble.setAttribute('role', 'status')
  bubble.hidden = true

  layer.append(screen, copyEl, core, bubble)

  let phase = 'dock'
  let mood = detectHostMood(doc)
  let bubbleOpen = false
  let savedPos = readDockPos()
  let dragPoint = null
  let dragState = null
  let greetTimer = null
  let bootTimer = null
  let bootOutTimer = null
  let bootFrame = 0
  let moodTimer = null

  fairyEye.setMood(mood)

  const viewport = () => ({ width: window.innerWidth || 1280, height: window.innerHeight || 800 })
  const currentPos = () => clampDockPos(dragPoint || savedPos, viewport(), settings.eyeSize)

  const clearBootTimers = () => {
    clearTimeout(bootTimer)
    clearTimeout(bootOutTimer)
    cancelAnimationFrame(bootFrame)
    bootTimer = null
    bootOutTimer = null
    bootFrame = 0
  }

  const updateBubbleContent = () => {
    const zh = isZhLocale(locale)
    const hostName = api.hostTarget === 'desktop' ? 'Codex Desktop' : 'CH Web'
    bubble.replaceChildren()

    const head = doc.createElement('div')
    head.className = 'hf-bubble-head'
    head.textContent = zh ? 'Fairy · Ⅲ型 状态' : 'Fairy · Unit III'

    const row1 = doc.createElement('div')
    row1.className = 'hf-bubble-row'
    const k1 = doc.createElement('span')
    k1.className = 'hf-bubble-k'
    k1.textContent = zh ? '状态' : 'Mood'
    const v1 = doc.createElement('b')
    v1.textContent = moodLabel(mood, locale)
    row1.append(k1, v1)

    const row2 = doc.createElement('div')
    row2.className = 'hf-bubble-row'
    const k2 = doc.createElement('span')
    k2.className = 'hf-bubble-k'
    k2.textContent = zh ? '宿主' : 'Host'
    const v2 = doc.createElement('b')
    v2.textContent = hostName
    row2.append(k2, v2)

    const sub = doc.createElement('div')
    sub.className = 'hf-bubble-sub'
    sub.textContent = greetLine(locale)

    const actions = doc.createElement('div')
    actions.className = 'hf-bubble-actions'

    const replayBtn = doc.createElement('button')
    replayBtn.type = 'button'
    replayBtn.className = 'hf-mini-btn'
    replayBtn.textContent = zh ? '重播开机' : 'Replay Boot'
    replayBtn.addEventListener('click', (event) => {
      event.stopPropagation()
      void startBoot()
    })

    const resetBtn = doc.createElement('button')
    resetBtn.type = 'button'
    resetBtn.className = 'hf-mini-btn'
    resetBtn.textContent = zh ? '位置复位' : 'Reset'
    resetBtn.addEventListener('click', (event) => {
      event.stopPropagation()
      savedPos = null
      dragPoint = null
      writeDockPos(null)
      bubbleOpen = false
      syncLayout()
    })

    actions.append(replayBtn, resetBtn)
    bubble.append(head, row1, row2, sub, actions)
  }

  const syncLayout = () => {
    const mobile = mobileMedia.matches
    const hidden = mobile || (!settings.showEye && phase === 'dock')
    layer.dataset.hidden = hidden ? '1' : '0'
    layer.dataset.phase = phase
    layer.dataset.scheme = scheme
    layer.dataset.drag = settings.dragEnabled ? '1' : '0'
    layer.dataset.dragging = dragState?.moved ? '1' : '0'
    core.setAttribute('aria-label', isZhLocale(locale) ? 'Fairy · 状态挂件' : 'Fairy · Status Widget')
    core.setAttribute('aria-expanded', String(bubbleOpen))
    const skipText = isZhLocale(locale) ? '跳过 / SKIP ▸' : 'SKIP ▸'
    skipBtn.textContent = skipText
    bootSkipBtn.textContent = skipText
    copyLine.textContent = greetLine(locale)

    const vp = viewport()
    const pos = currentPos()
    layer.style.setProperty('--hf-dock-x', `${pos.x}px`)
    layer.style.setProperty('--hf-dock-y', `${pos.y}px`)
    layer.style.setProperty('--hf-dock-size', `${settings.eyeSize}px`)

    if (hidden || phase !== 'dock' || !bubbleOpen) {
      bubble.hidden = true
      return
    }
    bubble.hidden = false
    updateBubbleContent()
    const half = settings.eyeSize / 2
    const flip = pos.x + half + 268 > vp.width
    const left = Math.max(12, Math.min(vp.width - 260, flip ? pos.x - half - 260 : pos.x + half + 14))
    const top = Math.max(96, Math.min(vp.height - 96, pos.y))
    bubble.style.left = `${Math.round(left)}px`
    bubble.style.top = `${Math.round(top)}px`
  }

  const stopGreeting = () => {
    clearTimeout(greetTimer)
    greetTimer = null
    clearBootTimers()
    bootStage.replaceChildren()
    bootEl.classList.remove('is-out')
    phase = 'dock'
    syncLayout()
  }

  const startGreeting = () => {
    if (mobileMedia.matches || signal.aborted) return
    clearBootTimers()
    clearTimeout(greetTimer)
    bootStage.replaceChildren()
    bootEl.classList.remove('is-out')
    bubbleOpen = false
    phase = 'greet'
    syncLayout()
    greetTimer = setTimeout(stopGreeting, 3200)
  }

  const finishBoot = () => {
    if (phase !== 'boot' || bootOutTimer) return
    clearBootTimers()
    bootPlayed = true
    bootBarFill.style.width = '100%'
    bootPct.textContent = '100%'
    bootEl.classList.add('is-out')
    bootOutTimer = setTimeout(() => {
      bootOutTimer = null
      startGreeting()
    }, 560)
  }

  const startBoot = async () => {
    if (mobileMedia.matches || signal.aborted) return
    clearBootTimers()
    clearTimeout(greetTimer)
    greetTimer = null
    bubbleOpen = false
    bootEl.classList.remove('is-out')
    bootBarFill.style.width = '0%'
    bootPct.textContent = '0%'

    await ensureVisualAssets()
    if (signal.aborted || mobileMedia.matches) return
    if (!bootUrl) {
      startGreeting()
      return
    }

    phase = 'boot'
    bootStage.replaceChildren()
    syncLayout()

    const img = doc.createElement('img')
    img.alt = 'H.D.D System Boot'
    img.decoding = 'async'
    const seq = ++replaySeq
    const src = bootUrl.startsWith('data:')
      ? bootUrl
      : `${bootUrl}${bootUrl.includes('?') ? '&' : '?'}r=${seq}`

    let started = false
    const beginPlayback = () => {
      if (started || phase !== 'boot' || signal.aborted) return
      started = true
      const t0 = performance.now()
      const tick = (now) => {
        if (phase !== 'boot' || signal.aborted) return
        const pct = Math.min(100, ((now - t0) / BOOT_DURATION_MS) * 100)
        bootBarFill.style.width = `${pct.toFixed(1)}%`
        bootPct.textContent = `${Math.round(pct)}%`
        if (pct < 100) bootFrame = requestAnimationFrame(tick)
      }
      bootFrame = requestAnimationFrame(tick)
      bootTimer = setTimeout(finishBoot, BOOT_DURATION_MS)
    }

    img.addEventListener('load', beginPlayback, { once: true })
    img.addEventListener('error', finishBoot, { once: true })
    img.src = src
    bootStage.append(img)
    if (img.complete && img.naturalWidth > 0) beginPlayback()
    else bootTimer = setTimeout(finishBoot, BOOT_DURATION_MS + 3500)
  }

  bootSkipBtn.addEventListener('click', (event) => {
    event.stopPropagation()
    finishBoot()
  }, { signal })
  skipBtn.addEventListener('click', (event) => {
    event.stopPropagation()
    stopGreeting()
  }, { signal })
  screen.addEventListener('click', () => {
    if (phase === 'greet') stopGreeting()
  }, { signal })

  core.addEventListener('pointerdown', (event) => {
    if (phase !== 'dock' || (event.button !== undefined && event.button !== 0)) return
    dragState = { id: event.pointerId, x: event.clientX, y: event.clientY, origin: currentPos(), moved: false }
    try { core.setPointerCapture(event.pointerId) } catch { /* Ignore */ }
    event.preventDefault()
  }, { signal })

  core.addEventListener('pointermove', (event) => {
    if (!settings.dragEnabled || !dragState || dragState.id !== event.pointerId) return
    const dx = event.clientX - dragState.x
    const dy = event.clientY - dragState.y
    if (!dragState.moved && Math.hypot(dx, dy) < 4) return
    dragState.moved = true
    dragPoint = clampDockPos({ x: dragState.origin.x + dx, y: dragState.origin.y + dy }, viewport(), settings.eyeSize)
    syncLayout()
  }, { signal })

  const endDrag = (event, cancelled = false) => {
    if (!dragState || dragState.id !== event.pointerId) return
    const moved = dragState.moved
    dragState = null
    if (cancelled) {
      dragPoint = null
    } else if (!moved) {
      bubbleOpen = !bubbleOpen
    } else if (dragPoint) {
      savedPos = dragPoint
      dragPoint = null
      writeDockPos(savedPos)
    }
    syncLayout()
  }

  core.addEventListener('pointerup', (e) => endDrag(e, false), { signal })
  core.addEventListener('pointercancel', (e) => endDrag(e, true), { signal })
  core.addEventListener('keydown', (event) => {
    if (phase === 'dock' && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      bubbleOpen = !bubbleOpen
      syncLayout()
    }
  }, { signal })

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (phase === 'boot') finishBoot()
      else if (phase === 'greet') stopGreeting()
      else if (bubbleOpen) {
        bubbleOpen = false
        syncLayout()
      }
    }
  }, { signal })

  window.addEventListener('resize', () => syncLayout(), { signal })
  mobileMedia.addEventListener('change', () => {
    if (mobileMedia.matches && phase !== 'dock') stopGreeting()
    else syncLayout()
  }, { signal })

  moodTimer = setInterval(() => {
    if (signal.aborted) return
    const nextMood = detectHostMood(doc)
    if (nextMood !== mood) {
      const finished = mood === 'working' && nextMood === 'idle'
      mood = finished ? 'done' : nextMood
      fairyEye.setMood(mood)
      if (bubbleOpen) updateBubbleContent()
      if (finished) {
        setTimeout(() => {
          if (signal.aborted || mood !== 'done') return
          mood = detectHostMood(doc)
          fairyEye.setMood(mood)
          if (bubbleOpen) updateBubbleContent()
        }, 2200)
      }
    }
  }, 1600)

  const offStorage = api.storage.onChange((next) => {
    settings = normalizeSettings(next)
    if (!settings.showEye) bubbleOpen = false
    syncLayout()
  })
  const offLocale = api.onLocaleChange((next) => {
    locale = next
    syncLayout()
  })
  const offScheme = api.onColorSchemeChange((next) => {
    scheme = next
    broadcastColorScheme(scheme)
    syncLayout()
  })
  const offAction = subscribeFairyAction((action) => {
    if (action?.type === 'replay-boot') void startBoot()
    else if (action?.type === 'replay-greeting') {
      void ensureVisualAssets().then(() => startGreeting())
    } else if (action?.type === 'reset-pos') {
      savedPos = null
      dragPoint = null
      syncLayout()
    }
  }, signal)

  if (settings.playBootOnLaunch && !bootPlayed && !mobileMedia.matches) {
    bootPlayed = true
    void startBoot()
  } else {
    syncLayout()
  }

  return () => {
    clearBootTimers()
    clearTimeout(greetTimer)
    clearInterval(moodTimer)
    offStorage()
    offLocale()
    offScheme()
    offAction()
    fairyEye.dispose()
    layer.remove()
    eyeStyle.remove()
  }
}
