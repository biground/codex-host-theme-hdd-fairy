// Workorder 021: Telegram-style consecutive assistant message grouping + viewport-only live Fairy eye badge.
// Zero React conflict: marks _root with data-hf-avatar-* attributes and appends an owned
// [data-cx-ext-owned="hdd-fairy"] eye overlay only while a tail bubble is intersecting the viewport.

import { BLINK_MS, MOBILE_MEDIA, renderFairyEyeSvg } from '../../shared/fairy-core.mjs'

const FLOW_CONTAINER_SELECTOR = '[data-chat-flow]:not([data-step-process-content])'
const BOUNDARY_SELECTOR = '[data-chat-flow-kind="user"], [data-chat-flow-kind="steering"], [data-pending-steering], [data-submission-echo]'
const VIRTUALIZED_ASSISTANT_SELECTOR = '[data-chat-flow-kind^="assistant"]:not([data-chat-group-part="reasoning"])[data-chat-virtualized]'
const ASSISTANT_ROOT_SELECTOR = '[data-chat-flow-kind^="assistant"]:not([data-chat-group-part="reasoning"]) :is([data-slot="conversation.chat.node"], [data-selection-answer]) > [class*="_root"]'
const ITEM_SELECTOR = `${BOUNDARY_SELECTOR}, ${VIRTUALIZED_ASSISTANT_SELECTOR}, ${ASSISTANT_ROOT_SELECTOR}`
const MOUNT_CLASS = 'hf-chat-eye-mount'
const OWNED_ATTR = 'data-cx-ext-owned'
const OWNED_VALUE = 'hdd-fairy'

let eyeSequence = 0

function isHiddenNode(el) {
  if (!el || typeof el.hasAttribute !== 'function') return true
  if (el.hasAttribute('hidden')) return true
  if (typeof el.closest === 'function' && el.closest('[hidden]')) return true
  return false
}

function isEmptySeatNode(el) {
  if (!el || typeof el.hasAttribute !== 'function') return false
  if (el.hasAttribute('data-chat-empty')) return true
  if (typeof el.closest === 'function' && el.closest('[data-chat-empty]')) return true
  return false
}

function isVisibleAssistantBubble(rootEl) {
  if (isHiddenNode(rootEl)) return false
  if (isEmptySeatNode(rootEl)) return false
  if (rootEl.hasAttribute('data-streaming')) return true
  const body = typeof rootEl.querySelector === 'function'
    ? rootEl.querySelector(':scope > [class*="_body"]') ?? rootEl.querySelector('[class*="_body"]')
    : null
  if (!body) return true
  const children = body.children ? [...body.children] : []
  if (children.length === 0) return (body.textContent ?? '').trim().length > 0
  return children.some((child) => typeof child.hasAttribute !== 'function' || !child.hasAttribute('hidden'))
}

function isBoundaryNode(el) {
  if (!el || typeof el.matches !== 'function') return false
  return el.matches(BOUNDARY_SELECTOR)
}

function isVirtualizedAssistantNode(el) {
  if (!el || typeof el.matches !== 'function') return false
  return el.matches(VIRTUALIZED_ASSISTANT_SELECTOR)
}

/**
 * Pure Telegram-style grouping pass over a single chat flow container.
 * Consecutive visible assistant bubbles without an intervening user/steering message
 * form one group: only the newest (last) bubble gets data-hf-avatar-tail="1";
 * earlier bubbles in the same run get data-hf-avatar-grouped="1".
 * Virtualized assistant placeholders participate in the run without receiving marks
 * or live eyes, preventing earlier mounted siblings from flashing duplicate avatars.
 * Returns { tails: Set<Element>, grouped: Set<Element>, hidden: Set<Element> }.
 */
export function computeChatAvatarGroups(flowEl) {
  const tails = new Set()
  const grouped = new Set()
  const hidden = new Set()
  if (!flowEl || typeof flowEl.querySelectorAll !== 'function') {
    return { tails, grouped, hidden }
  }

  let run = []
  const flush = () => {
    if (run.length === 0) return
    for (let i = 0; i < run.length - 1; i += 1) {
      if (!run[i].virtualized) grouped.add(run[i].el)
    }
    const last = run[run.length - 1]
    if (!last.virtualized) tails.add(last.el)
    run = []
  }

  const items = flowEl.querySelectorAll(ITEM_SELECTOR)
  for (const el of items) {
    if (isBoundaryNode(el)) {
      if (!isHiddenNode(el)) flush()
      continue
    }
    if (isVirtualizedAssistantNode(el)) {
      if (!isHiddenNode(el) && !isEmptySeatNode(el)) {
        run.push({ el, virtualized: true })
      }
      continue
    }
    if (!isVisibleAssistantBubble(el)) {
      hidden.add(el)
      continue
    }
    run.push({ el, virtualized: false })
  }
  flush()
  return { tails, grouped, hidden }
}

/**
 * Create a lightweight animated Fairy eye for a chat tail bubble.
 * Uses unique SVG defs IDs via renderFairyEyeSvg(idSuffix), smooth blinking and
 * CSS micro-breathing only (no random glitch slice DOM rebuilding), and respects
 * prefers-reduced-motion.
 */
export function createLiteChatFairyEye(doc, { idSuffix, reducedMotion = false, streaming = false } = {}) {
  const uid = idSuffix || `chat-${++eyeSequence}`
  const mount = doc.createElement('div')
  mount.className = MOUNT_CLASS
  mount.setAttribute(OWNED_ATTR, OWNED_VALUE)
  mount.setAttribute('aria-hidden', 'true')
  mount.dataset.eyeId = uid

  const eye = doc.createElement('div')
  eye.className = 'hf-chat-eye hf-eye'
  eye.dataset.mood = streaming ? 'working' : 'idle'
  eye.innerHTML = [
    '<span class="hf-chat-eye-halo" aria-hidden="true"></span>',
    `<div class="hf-eye-svg" aria-hidden="true">${renderFairyEyeSvg(uid)}</div>`,
    '<span class="hf-chat-eye-scan" aria-hidden="true"></span>',
  ].join('')
  mount.append(eye)

  let alive = true
  let mood = streaming ? 'working' : 'idle'
  const timers = new Set()

  const after = (fn, ms) => {
    const id = setTimeout(() => {
      timers.delete(id)
      if (alive) fn()
    }, ms)
    timers.add(id)
    return id
  }

  const isWindowHidden = () => Boolean(
    doc?.hidden || doc?.documentElement?.hasAttribute?.('data-codexhost-window-hidden'),
  )

  const scheduleBlink = () => {
    if (!alive || reducedMotion) return
    const wait = 3600 + Math.random() * 4600
    after(() => {
      if (mood !== 'working' && !isWindowHidden()) {
        eye.dataset.blink = '1'
        eye.dataset.lid = 'blink'
        after(() => {
          delete eye.dataset.blink
          if (mood !== 'working') delete eye.dataset.lid
        }, BLINK_MS)
        if (Math.random() < 0.2) {
          after(() => {
            if (mood === 'working' || isWindowHidden()) return
            eye.dataset.blink = '1'
            eye.dataset.lid = 'blink'
            after(() => {
              delete eye.dataset.blink
              if (mood !== 'working') delete eye.dataset.lid
            }, BLINK_MS - 40)
          }, 460)
        }
      }
      scheduleBlink()
    }, wait)
  }

  scheduleBlink()

  const setStreaming = (nextStreaming) => {
    const nextMood = nextStreaming ? 'working' : 'idle'
    if (nextMood === mood) return
    mood = nextMood
    eye.dataset.mood = mood
    if (mood === 'working') {
      delete eye.dataset.blink
      delete eye.dataset.lid
    }
  }

  const dispose = () => {
    if (!alive) return
    alive = false
    for (const id of timers) clearTimeout(id)
    timers.clear()
    mount.remove()
  }

  return { element: mount, eye, uid, setStreaming, dispose }
}

export function mountChatAvatarFx(api, getSettings) {
  const doc = typeof document !== 'undefined' ? document : null
  const win = typeof window !== 'undefined' ? window : null
  const mobileMedia = typeof win?.matchMedia === 'function' ? win.matchMedia(MOBILE_MEDIA) : null
  const reducedMedia = typeof win?.matchMedia === 'function' ? win.matchMedia('(prefers-reduced-motion: reduce)') : null

  let disposed = false
  let scheduled = false
  let domObserver = null

  // Track mounted live eyes: Map<Element (_root), { eyeCtrl }>
  const mountedEyes = new Map()
  // Track IntersectionObserver per scroll container (keyed by Element | 'viewport')
  const ioByRoot = new Map()
  // Track currently observed tail bubbles: Map<Element (_root), Element | 'viewport'>
  const observedTails = new Map()
  // Track all elements we have placed grouping attributes on
  const markedRoots = new Set()

  const isReducedMotion = () => Boolean(reducedMedia?.matches)
  const isMobileViewport = () => Boolean(mobileMedia?.matches)

  const readFlags = () => {
    if (disposed || api?.signal?.aborted || !doc) {
      return { grouping: false, animatedEye: false }
    }
    const settings = typeof getSettings === 'function' ? getSettings() : null
    if (!settings) return { grouping: false, animatedEye: false }
    const grouping = Boolean(settings.enableWebTheme && settings.panelChatEnabled !== false)
    const animatedEye = Boolean(grouping && settings.enableChatAnimatedAvatar !== false && !isMobileViewport())
    return { grouping, animatedEye }
  }

  const unmountEye = (rootEl) => {
    const entry = mountedEyes.get(rootEl)
    if (entry) {
      entry.dispose()
      mountedEyes.delete(rootEl)
    }
    if (rootEl && typeof rootEl.removeAttribute === 'function') {
      rootEl.removeAttribute('data-hf-live-eye')
      if (typeof rootEl.querySelectorAll === 'function') {
        for (const stray of rootEl.querySelectorAll(`:scope > .${MOUNT_CLASS}[${OWNED_ATTR}="${OWNED_VALUE}"]`)) {
          stray.remove()
        }
      }
    }
  }

  const mountEye = (rootEl) => {
    if (!rootEl || !rootEl.isConnected) return
    const { animatedEye } = readFlags()
    if (!animatedEye || rootEl.getAttribute('data-hf-avatar-tail') !== '1') {
      unmountEye(rootEl)
      return
    }
    const streaming = rootEl.hasAttribute('data-streaming')
    const existing = mountedEyes.get(rootEl)
    if (existing && existing.element.isConnected && existing.element.parentNode === rootEl) {
      existing.setStreaming(streaming)
      if (rootEl.getAttribute('data-hf-live-eye') !== '1') {
        rootEl.setAttribute('data-hf-live-eye', '1')
      }
      return
    }
    unmountEye(rootEl)
    const ctrl = createLiteChatFairyEye(doc, {
      reducedMotion: isReducedMotion(),
      streaming,
    })
    rootEl.append(ctrl.element)
    rootEl.setAttribute('data-hf-live-eye', '1')
    mountedEyes.set(rootEl, ctrl)
  }

  const unobserveTail = (rootEl) => {
    const key = observedTails.get(rootEl)
    if (key !== undefined) {
      const io = ioByRoot.get(key)
      io?.unobserve(rootEl)
      observedTails.delete(rootEl)
    }
  }

  const getObserverFor = (scrollRoot) => {
    const key = scrollRoot || 'viewport'
    let io = ioByRoot.get(key)
    if (!io && typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver(
        (entries) => {
          if (disposed || api?.signal?.aborted) return
          for (const entry of entries) {
            const target = entry.target
            if (!observedTails.has(target)) {
              unmountEye(target)
              continue
            }
            if (entry.isIntersecting) {
              mountEye(target)
            } else {
              unmountEye(target)
            }
          }
        },
        {
          root: scrollRoot || null,
          rootMargin: '120px 0px',
          threshold: 0,
        },
      )
      ioByRoot.set(key, io)
    }
    return { key, io }
  }

  const teardownAllEyes = () => {
    for (const rootEl of [...mountedEyes.keys()]) {
      unmountEye(rootEl)
    }
    for (const rootEl of [...observedTails.keys()]) {
      unobserveTail(rootEl)
    }
    for (const io of ioByRoot.values()) {
      io.disconnect()
    }
    ioByRoot.clear()
    if (typeof doc?.querySelectorAll === 'function') {
      for (const el of doc.querySelectorAll(`[data-hf-live-eye]`)) {
        el.removeAttribute('data-hf-live-eye')
      }
      for (const mount of doc.querySelectorAll(`.${MOUNT_CLASS}[${OWNED_ATTR}="${OWNED_VALUE}"]`)) {
        mount.remove()
      }
    }
  }

  const teardownAllMarks = () => {
    teardownAllEyes()
    for (const rootEl of [...markedRoots]) {
      rootEl.removeAttribute('data-hf-avatar-tail')
      rootEl.removeAttribute('data-hf-avatar-grouped')
    }
    markedRoots.clear()
    if (typeof doc?.querySelectorAll === 'function') {
      for (const el of doc.querySelectorAll('[data-hf-avatar-tail], [data-hf-avatar-grouped]')) {
        el.removeAttribute('data-hf-avatar-tail')
        el.removeAttribute('data-hf-avatar-grouped')
      }
    }
  }

  const reconcile = () => {
    const { grouping, animatedEye } = readFlags()
    if (!grouping) {
      teardownAllMarks()
      return
    }
    if (typeof doc?.querySelectorAll !== 'function') return

    const nextTails = new Set()
    const nextGrouped = new Set()
    const flows = doc.querySelectorAll(FLOW_CONTAINER_SELECTOR)
    for (const flow of flows) {
      const { tails, grouped } = computeChatAvatarGroups(flow)
      for (const el of tails) nextTails.add(el)
      for (const el of grouped) nextGrouped.add(el)
    }

    // Clear stale marks on elements no longer in either set
    for (const prev of [...markedRoots]) {
      if (!nextTails.has(prev) && !nextGrouped.has(prev)) {
        prev.removeAttribute('data-hf-avatar-tail')
        prev.removeAttribute('data-hf-avatar-grouped')
        unobserveTail(prev)
        unmountEye(prev)
        markedRoots.delete(prev)
      }
    }

    for (const el of nextGrouped) {
      if (el.getAttribute('data-hf-avatar-grouped') !== '1') {
        el.setAttribute('data-hf-avatar-grouped', '1')
      }
      if (el.hasAttribute('data-hf-avatar-tail')) {
        el.removeAttribute('data-hf-avatar-tail')
      }
      unobserveTail(el)
      unmountEye(el)
      markedRoots.add(el)
    }

    for (const el of nextTails) {
      if (el.getAttribute('data-hf-avatar-tail') !== '1') {
        el.setAttribute('data-hf-avatar-tail', '1')
      }
      if (el.hasAttribute('data-hf-avatar-grouped')) {
        el.removeAttribute('data-hf-avatar-grouped')
      }
      markedRoots.add(el)
    }

    if (!animatedEye) {
      teardownAllEyes()
      return
    }

    // Unobserve & unmount anything that is no longer a connected tail
    for (const prev of [...observedTails.keys()]) {
      if (!nextTails.has(prev) || !prev.isConnected) {
        unobserveTail(prev)
        unmountEye(prev)
      }
    }
    for (const prev of [...mountedEyes.keys()]) {
      if (!nextTails.has(prev) || !prev.isConnected) {
        unmountEye(prev)
      }
    }

    // Observe every active tail bubble in its scroll container
    for (const tailEl of nextTails) {
      const scrollRoot = typeof tailEl.closest === 'function' ? tailEl.closest('[data-conversation-scroll]') : null
      const desiredKey = scrollRoot || 'viewport'
      const currentKey = observedTails.get(tailEl)
      if (currentKey !== desiredKey) {
        if (currentKey !== undefined) unobserveTail(tailEl)
        const { key, io } = getObserverFor(scrollRoot)
        if (io) {
          observedTails.set(tailEl, key)
          io.observe(tailEl)
        } else {
          // Fallback when IntersectionObserver is unavailable in minimal test environments
          mountEye(tailEl)
        }
      } else {
        // Sync streaming mood on already-mounted visible eyes
        const ctrl = mountedEyes.get(tailEl)
        if (ctrl) ctrl.setStreaming(tailEl.hasAttribute('data-streaming'))
      }
    }
  }

  const scheduleReconcile = () => {
    if (scheduled || disposed || api?.signal?.aborted) return
    scheduled = true
    queueMicrotask(() => {
      scheduled = false
      if (!disposed && !api?.signal?.aborted) reconcile()
    })
  }

  const isRelevantRecord = (record) => {
    if (typeof record.target?.closest === 'function' && record.target.closest(`[${OWNED_ATTR}="${OWNED_VALUE}"]`)) return false
    if (record.type === 'childList') {
      const touched = [...(record.addedNodes ?? []), ...(record.removedNodes ?? [])]
      if (
        touched.length > 0 &&
        touched.every((node) => typeof node?.getAttribute === 'function' && node.getAttribute(OWNED_ATTR) === OWNED_VALUE)
      ) {
        return false
      }
      return true
    }
    return record.type === 'attributes' && (
      record.attributeName === 'hidden' ||
      record.attributeName === 'data-streaming' ||
      record.attributeName === 'data-chat-virtualized' ||
      record.attributeName === 'data-chat-empty'
    )
  }

  if (typeof MutationObserver === 'function' && doc?.body) {
    domObserver = new MutationObserver((records) => {
      if (records.some(isRelevantRecord)) scheduleReconcile()
    })
    domObserver.observe(doc.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['hidden', 'data-streaming', 'data-chat-virtualized', 'data-chat-empty'],
    })
  }

  const onMediaChange = () => {
    if (isReducedMotion()) teardownAllEyes()
    reconcile()
  }
  mobileMedia?.addEventListener?.('change', onMediaChange, { signal: api?.signal })
  reducedMedia?.addEventListener?.('change', onMediaChange, { signal: api?.signal })

  const dispose = () => {
    if (disposed) return
    disposed = true
    domObserver?.disconnect()
    domObserver = null
    teardownAllMarks()
  }

  api?.signal?.addEventListener?.('abort', dispose, { once: true })

  return {
    reconcile,
    dispose,
    getActiveEyeCount: () => mountedEyes.size,
  }
}
