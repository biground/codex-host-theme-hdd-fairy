// Shared cross-surface logic for H.D.D + Fairy (CodexHost manifestVersion 2).
// Adapted from AssassinVIX/fairy-zzz-plugin (MIT) and Fairy-DSH (Apache-2.0); visuals only, no audio.

export const EXTENSION_ID = 'hdd-fairy'
export const POS_KEY = 'hdd-fairy.dock-pos.v2'
export const ACTION_EVENT = 'hdd-fairy:action'
export const SCHEME_EVENT = 'hdd-fairy:scheme'
export const MOBILE_MEDIA = '(max-width: 767px), (max-width: 1023px) and (hover: none) and (pointer: coarse)'
export const BLINK_MS = 300
export const BOOT_DURATION_MS = 14530

export const DEFAULT_SETTINGS = Object.freeze({
  showEye: true,
  dragEnabled: true,
  eyeSize: 120,
  playBootOnLaunch: true,
  enableWebTheme: true,
  webHeroWatermark: true,
})

export function normalizeSettings(raw) {
  const src = raw && typeof raw === 'object' ? raw : {}
  const num = Number(src.eyeSize)
  const eyeSize = Number.isFinite(num) ? Math.min(168, Math.max(72, Math.round(num / 4) * 4)) : DEFAULT_SETTINGS.eyeSize
  return {
    showEye: typeof src.showEye === 'boolean' ? src.showEye : DEFAULT_SETTINGS.showEye,
    dragEnabled: typeof src.dragEnabled === 'boolean' ? src.dragEnabled : DEFAULT_SETTINGS.dragEnabled,
    eyeSize,
    playBootOnLaunch: typeof src.playBootOnLaunch === 'boolean' ? src.playBootOnLaunch : DEFAULT_SETTINGS.playBootOnLaunch,
    enableWebTheme: typeof src.enableWebTheme === 'boolean' ? src.enableWebTheme : DEFAULT_SETTINGS.enableWebTheme,
    webHeroWatermark: typeof src.webHeroWatermark === 'boolean' ? src.webHeroWatermark : DEFAULT_SETTINGS.webHeroWatermark,
  }
}

export function isZhLocale(locale) {
  return typeof locale === 'string' && locale.toLowerCase().startsWith('zh')
}

export function greetLine(locale, hour = new Date().getHours()) {
  if (isZhLocale(locale)) {
    if (hour >= 5 && hour < 11) return '主人，早上好。Fairy 已就位，今天的日程也已就位。'
    if (hour >= 11 && hour < 14) return '主人，中午好。饭可以不吃，进度不能停。'
    if (hour >= 14 && hour < 18) return '主人，下午好。H.D.D 在线，摸鱼请自便。'
    if (hour >= 18 && hour < 23) return '主人，晚上好。夜班系统已启动，本系统不困。'
    return '主人，夜深了。这个点还醒着，是需要我陪着，还是放不下手里的事？'
  }
  if (hour >= 5 && hour < 11) return 'Good morning, Master. Fairy is online and today\'s schedule is ready.'
  if (hour >= 11 && hour < 14) return 'Good noon, Master. Lunch is optional; progress is not.'
  if (hour >= 14 && hour < 18) return 'Good afternoon, Master. H.D.D is online—feel free to take a breather.'
  if (hour >= 18 && hour < 23) return 'Good evening, Master. Night-shift systems engaged. Fairy never sleeps.'
  return 'It is late, Master. Still awake—need company, or finishing one last task?'
}

export function hddWelcomeLine(locale, hour = new Date().getHours()) {
  if (isZhLocale(locale)) {
    const slot = hour >= 5 && hour < 12 ? '早上好' : hour >= 12 && hour < 18 ? '中午好' : '晚上好'
    return `${slot}，传奇绳匠【法厄同】`
  }
  const slot = hour >= 5 && hour < 12 ? 'Good morning' : hour >= 12 && hour < 18 ? 'Good afternoon' : 'Good evening'
  return `${slot}, Legendary Proxy [Phaethon]`
}

export function moodLabel(mood, locale) {
  const zh = isZhLocale(locale)
  switch (mood) {
    case 'thinking': return zh ? '思考中' : 'Thinking'
    case 'working': return zh ? '运行中' : 'Working'
    case 'done': return zh ? '已完成' : 'Completed'
    default: return zh ? '待机' : 'Idle'
  }
}

export function readDockPos() {
  try {
    const raw = localStorage.getItem(POS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && Number.isFinite(parsed.x) && Number.isFinite(parsed.y)) {
      return { x: parsed.x, y: parsed.y }
    }
  } catch { /* Storage unavailable */ }
  return null
}

export function writeDockPos(pos) {
  try {
    if (pos && Number.isFinite(pos.x) && Number.isFinite(pos.y)) {
      localStorage.setItem(POS_KEY, JSON.stringify({ x: Math.round(pos.x), y: Math.round(pos.y) }))
    } else {
      localStorage.removeItem(POS_KEY)
    }
  } catch { /* Storage unavailable */ }
}

export function clampDockPos(pos, viewport, size) {
  const half = Math.max(36, Math.round(size / 2) + 8)
  const fallbackX = viewport.width < 640 ? viewport.width - half - 12 : Math.round(viewport.width * 0.25)
  const fallbackY = Math.round(viewport.height * 0.52)
  const x = pos && Number.isFinite(pos.x) ? pos.x : fallbackX
  const y = pos && Number.isFinite(pos.y) ? pos.y : fallbackY
  return {
    x: Math.round(Math.min(Math.max(x, half), Math.max(half, viewport.width - half))),
    y: Math.round(Math.min(Math.max(y, half), Math.max(half, viewport.height - half))),
  }
}

export function dispatchFairyAction(action) {
  try {
    window.dispatchEvent(new CustomEvent(ACTION_EVENT, { detail: action }))
  } catch { /* Ignore */ }
}

export function subscribeFairyAction(listener, signal) {
  const handler = (event) => {
    if (event?.detail) listener(event.detail)
  }
  window.addEventListener(ACTION_EVENT, handler, { signal })
  return () => window.removeEventListener(ACTION_EVENT, handler)
}

export function broadcastColorScheme(scheme) {
  if (scheme !== 'dark' && scheme !== 'light') return
  try {
    window.dispatchEvent(new CustomEvent(SCHEME_EVENT, { detail: scheme }))
  } catch { /* Ignore */ }
}

export function subscribeColorSchemeBroadcast(listener, signal) {
  const handler = (event) => {
    if (event?.detail === 'dark' || event?.detail === 'light') listener(event.detail)
  }
  window.addEventListener(SCHEME_EVENT, handler, { signal })
  return () => window.removeEventListener(SCHEME_EVENT, handler)
}

export const FAIRY_EYE_SVG = `<!-- SPDX-License-Identifier: Apache-2.0 Adapted from Fairy-DSH, Copyright 2026 Chengzhibense. Source commit d639887a386b0de6fef2e61c97dc268631854591: mascot-geometry.js / mascot-eye-svg.js (see ../NOTICE-fairy-dsh.md). -->
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="-1 -1 162 162">
  <defs>
    <linearGradient id="hf-outer-gradient" x1=".2" y1="0" x2=".8" y2="1">
      <stop stop-color="#3145d6"/>
      <stop offset=".54" stop-color="#2233b2"/>
      <stop offset="1" stop-color="#2b3cbc"/>
    </linearGradient>
    <radialGradient id="hf-sclera-halo" gradientUnits="userSpaceOnUse" cx="80" cy="80" r="56" color-interpolation="linearRGB">
      <stop offset=".82" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset=".864" stop-color="#ffffff" stop-opacity=".22"/>
      <stop offset=".875" stop-color="#ffffff" stop-opacity=".28"/>
      <stop offset=".89" stop-color="#ffffff" stop-opacity=".19"/>
      <stop offset=".91" stop-color="#ffffff" stop-opacity=".11"/>
      <stop offset=".94" stop-color="#ffffff" stop-opacity=".07"/>
      <stop offset=".96" stop-color="#ffffff" stop-opacity=".035"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="hf-outer-halo" gradientUnits="userSpaceOnUse" cx="80" cy="80" r="79" color-interpolation="linearRGB">
      <stop offset=".80" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset=".84" stop-color="#ffffff" stop-opacity=".10"/>
      <stop offset=".868" stop-color="#ffffff" stop-opacity=".28"/>
      <stop offset=".90" stop-color="#ffffff" stop-opacity=".18"/>
      <stop offset=".95" stop-color="#ffffff" stop-opacity=".06"/>
      <stop offset=".99" stop-color="#ffffff" stop-opacity=".02"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="hf-highlight-halo" gradientUnits="userSpaceOnUse" cx="98" cy="100.5" r="18" color-interpolation="linearRGB">
      <stop offset=".53" stop-color="#f5f8fd" stop-opacity="0"/>
      <stop offset=".56" stop-color="#f5f8fd" stop-opacity=".16"/>
      <stop offset=".611" stop-color="#f5f8fd" stop-opacity=".43"/>
      <stop offset=".72" stop-color="#f5f8fd" stop-opacity=".19"/>
      <stop offset=".77" stop-color="#f5f8fd" stop-opacity=".12"/>
      <stop offset=".83" stop-color="#f5f8fd" stop-opacity=".055"/>
      <stop offset=".89" stop-color="#f5f8fd" stop-opacity=".02"/>
      <stop offset=".96" stop-color="#f5f8fd" stop-opacity=".004"/>
      <stop offset="1" stop-color="#f5f8fd" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="hf-lid-cover-clip"><circle cx="80" cy="80" r="56"/></clipPath>
  </defs>
  <g class="hf-fairy-group">
    <circle cx="80" cy="80" r="79" fill="url(#hf-outer-halo)"/>
    <circle cx="80" cy="80" r="68" fill="none" stroke="#dceaff" stroke-width="1.8"/>
    <circle cx="80" cy="80" r="68" fill="url(#hf-outer-gradient)" stroke="#f2fbff" stroke-width="1.2"/>
    <g class="hf-corners" transform="rotate(0 80 80)" fill="#1f2573">
      <circle cx="80" cy="80" r="51.75"/>
      <rect x="37" y="37" width="86" height="86" rx="2" transform="rotate(3 80 80)"/>
    </g>
    <g class="hf-eye-anatomy">
      <g class="hf-sclera" transform="translate(80 80) scale(1) translate(-80 -80)">
        <circle cx="80" cy="80" r="48" fill="#eef0f5"/>
        <circle cx="80" cy="80" r="56" fill="url(#hf-sclera-halo)"/>
        <circle cx="80" cy="80" r="48" fill="none" stroke="#ffffff" stroke-width=".8" stroke-opacity=".16"/>
      </g>
      <g class="hf-iris-outer" transform="translate(80 80) scale(1) translate(-80 -80)">
        <circle cx="80" cy="80" r="33" fill="#9daee0"/>
      </g>
      <g class="hf-iris-blue" transform="translate(80 80) scale(1) translate(-80 -80)">
        <circle cx="80" cy="80" r="24.15" fill="#eef0f5"/>
        <circle cx="80" cy="80" r="23.5" fill="#2f74c9"/>
      </g>
      <g class="hf-pupil" transform="translate(80 80) scale(1) translate(-80 -80)">
        <circle cx="80" cy="80" r="16.6" fill="none" stroke="#f5f8fd" stroke-width=".1"/>
        <circle cx="80" cy="80" r="16" fill="#2e2f78"/>
      </g>
      <g class="hf-highlight" transform="translate(80 80) scale(1) translate(-80 -80)">
        <circle cx="98" cy="100.5" r="18" fill="url(#hf-highlight-halo)"/>
        <circle cx="98" cy="100.5" r="11" fill="#f5f8fd"/>
      </g>
    </g>
    <g class="hf-lid-cover" clip-path="url(#hf-lid-cover-clip)">
      <path class="hf-lid-shape" d="M20 60 Q80 90 140 60 V-40 H20 Z" fill="#1f2573"/>
    </g>
  </g>
</svg>`

/**
 * Create a self-contained animated Fairy eye DOM node and behavior controller.
 * Returns { element, setMood, triggerGlitch, dispose }.
 */
export function createFairyEye(doc, { signal, interactiveGlitch = true } = {}) {
  const eye = doc.createElement('div')
  eye.className = 'hf-eye'
  eye.innerHTML = [
    '<span class="hf-eye-halo" aria-hidden="true"></span>',
    '<span class="hf-eye-ring" aria-hidden="true"></span>',
    `<div class="hf-eye-svg" aria-hidden="true">${FAIRY_EYE_SVG}</div>`,
    '<span class="hf-glitch" aria-hidden="true"></span>',
    '<span class="hf-eye-scan" aria-hidden="true"></span>',
    '<span class="hf-eye-flash" aria-hidden="true"></span>',
  ].join('')

  const glitchLayer = eye.querySelector('.hf-glitch')
  let mood = 'idle'
  let blinkState = false
  let alive = true
  let lastGlitchAt = 0
  const timers = new Set()

  const after = (fn, ms) => {
    const id = setTimeout(() => {
      timers.delete(id)
      if (alive) fn()
    }, ms)
    timers.add(id)
    return id
  }

  const syncLid = () => {
    const lid = mood === 'thinking' || mood === 'working'
      ? 'think'
      : blinkState
        ? 'blink'
        : mood === 'done'
          ? 'soft'
          : ''
    if (lid) eye.dataset.lid = lid
    else delete eye.dataset.lid
  }

  const fireGlitch = () => {
    if (!alive || !interactiveGlitch) return
    const now = Date.now()
    if (now - lastGlitchAt < 1800) return
    lastGlitchAt = now
    const count = 2 + Math.floor(Math.random() * 3)
    let y = 2 + Math.random() * 10
    const bands = []
    for (let i = 0; i < count && y < 92; i += 1) {
      const h = Math.min(4 + Math.random() * 15, 96 - y)
      const dx = (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 14)
      const opacity = (0.5 + Math.random() * 0.5).toFixed(2)
      const bottom = Math.max(0, 100 - y - h).toFixed(1)
      bands.push(
        `<span class="hf-gband" style="clip-path:inset(${y.toFixed(1)}% 0 ${bottom}% 0);transform:translateX(${dx.toFixed(1)}px);opacity:${opacity}">${FAIRY_EYE_SVG}</span>`,
      )
      y += h + 5 + Math.random() * 20
    }
    if (!bands.length) return
    glitchLayer.innerHTML = bands.join('') + '<span class="hf-gline"></span>'
    eye.dataset.glitch = '1'
    after(() => {
      delete eye.dataset.glitch
      glitchLayer.replaceChildren()
    }, 150 + Math.random() * 190)
  }

  const scheduleBlink = () => {
    const wait = 3400 + Math.random() * 5200
    after(() => {
      if (mood !== 'working' && mood !== 'thinking') {
        blinkState = true
        eye.dataset.blink = '1'
        syncLid()
        after(() => {
          blinkState = false
          delete eye.dataset.blink
          syncLid()
        }, BLINK_MS)
        if (Math.random() < 0.24) {
          after(() => {
            if (mood === 'working' || mood === 'thinking') return
            blinkState = true
            eye.dataset.blink = '1'
            syncLid()
            after(() => {
              blinkState = false
              delete eye.dataset.blink
              syncLid()
            }, BLINK_MS - 40)
          }, 470)
        }
        if (Math.random() < 0.45) {
          const dir = Math.random() < 0.5 ? 'l' : 'r'
          after(() => {
            if (mood !== 'working' && mood !== 'thinking') eye.dataset.glance = dir
          }, 520)
          after(() => { delete eye.dataset.glance }, 1240)
        }
      }
      scheduleBlink()
    }, wait)
  }

  const scheduleGlitch = () => {
    const hot = mood === 'working' || mood === 'thinking'
    const wait = hot ? 4200 + Math.random() * 5200 : 7600 + Math.random() * 9400
    after(() => {
      fireGlitch()
      scheduleGlitch()
    }, wait)
  }

  scheduleBlink()
  scheduleGlitch()

  const setMood = (nextMood) => {
    const normalized = nextMood === 'thinking' || nextMood === 'working' || nextMood === 'done' ? nextMood : 'idle'
    if (normalized === mood) return
    mood = normalized
    eye.dataset.mood = mood
    if (mood === 'thinking' || mood === 'working') {
      blinkState = false
      delete eye.dataset.blink
      delete eye.dataset.glance
    }
    syncLid()
    after(fireGlitch, 180)
  }

  const dispose = () => {
    if (!alive) return
    alive = false
    for (const id of timers) clearTimeout(id)
    timers.clear()
  }

  signal?.addEventListener('abort', dispose, { once: true })
  eye.dataset.mood = mood
  return { element: eye, setMood, triggerGlitch: fireGlitch, dispose }
}

export const EYE_ANIMATION_CSS = `
.hf-eye{position:relative;width:100%;height:100%;display:grid;place-items:center;filter:drop-shadow(0 0 24px rgba(52,96,240,.42))}
.hf-eye-svg{position:relative;z-index:2;width:100%;height:100%;transition:transform .3s ease}
.hf-eye-svg svg{width:100%;height:100%;display:block;overflow:visible}
.hf-eye-svg .hf-sclera,.hf-eye-svg .hf-iris-outer,.hf-eye-svg .hf-iris-blue,.hf-eye-svg .hf-pupil,.hf-eye-svg .hf-highlight{transform-box:view-box;transform-origin:80px 80px}
.hf-eye-svg .hf-corners{transform-box:view-box;transform-origin:80px 80px;animation:hf-corners 12s linear infinite}
.hf-eye-svg .hf-sclera{animation:hf-breath-a 1.5s cubic-bezier(.72,0,.28,1) infinite alternate}
.hf-eye-svg .hf-iris-outer{animation:hf-breath-b 1.5s cubic-bezier(.72,0,.28,1) 47ms infinite alternate}
.hf-eye-svg .hf-iris-blue{animation:hf-breath-c 1.5s cubic-bezier(.72,0,.28,1) 94ms infinite alternate}
.hf-eye-svg .hf-pupil{animation:hf-breath-d 1.5s cubic-bezier(.72,0,.28,1) 187ms infinite alternate}
.hf-eye-svg .hf-highlight{animation:hf-catchlight 3.6s ease-in-out infinite}
.hf-eye-halo{position:absolute;inset:10%;border-radius:50%;z-index:1;pointer-events:none;background:radial-gradient(closest-side,rgba(64,112,255,.26),rgba(38,64,200,.10) 58%,transparent 78%);filter:blur(18px);animation:hf-halo-pulse 4.6s ease-in-out infinite}
.hf-eye-ring{position:absolute;inset:7%;border-radius:50%;border:2px solid rgba(201,248,255,.86);box-shadow:0 0 14px rgba(120,200,255,.45),inset 0 0 10px rgba(150,220,255,.3);z-index:1;pointer-events:none;opacity:0;transform:scale(.98);animation:hf-ring 4s cubic-bezier(.42,0,.22,1) infinite;will-change:transform,opacity}
.hf-glitch{position:absolute;inset:0;z-index:3;pointer-events:none;mix-blend-mode:screen;filter:saturate(1.18) contrast(1.06)}
.hf-gband{position:absolute;inset:0;display:block;will-change:transform,opacity}
.hf-gband svg{width:100%;height:100%;display:block}
.hf-gline{position:absolute;left:-8%;right:-8%;height:1px;background:rgba(205,248,255,.9);mix-blend-mode:screen;opacity:.75;animation:hf-gline .26s steps(3) infinite}
.hf-eye[data-glitch="1"] .hf-eye-svg{opacity:.42;filter:contrast(1.14) saturate(.9)}
.hf-eye[data-glitch="1"] .hf-eye-halo{opacity:.5}
.hf-eye-svg .hf-lid-cover{pointer-events:none}
.hf-eye-svg .hf-lid-shape{transform-box:view-box;transform-origin:80px 60px;transform:translateY(-60px) scaleY(1)}
.hf-eye[data-lid="think"] .hf-eye-svg .hf-lid-shape{animation:hf-lid-think .72s cubic-bezier(.72,0,.28,1) infinite alternate}
.hf-eye[data-lid="soft"] .hf-eye-svg .hf-lid-shape{animation:hf-lid-soft 1.9s cubic-bezier(.72,0,.28,1) infinite alternate}
.hf-eye[data-lid="blink"] .hf-eye-svg .hf-lid-shape{animation:hf-lid-blink 300ms cubic-bezier(.4,0,.2,1) both}
.hf-eye[data-blink="1"] .hf-eye-halo{animation:hf-eyelid-halo 300ms ease both}
.hf-eye[data-glance="l"] .hf-eye-svg .hf-iris-outer,.hf-eye[data-glance="l"] .hf-eye-svg .hf-iris-blue,.hf-eye[data-glance="l"] .hf-eye-svg .hf-pupil{animation:hf-glance-l .72s cubic-bezier(.4,0,.3,1) both!important}
.hf-eye[data-glance="r"] .hf-eye-svg .hf-iris-outer,.hf-eye[data-glance="r"] .hf-eye-svg .hf-iris-blue,.hf-eye[data-glance="r"] .hf-eye-svg .hf-pupil{animation:hf-glance-r .72s cubic-bezier(.4,0,.3,1) both!important}
.hf-eye[data-mood="thinking"] .hf-eye-halo{animation-duration:1.6s}
.hf-eye[data-mood="thinking"] .hf-eye-svg .hf-corners{animation-duration:4s}
.hf-eye[data-mood="working"] .hf-eye-svg .hf-pupil{animation:hf-focus 1.1s ease-in-out infinite}
.hf-eye[data-mood="working"] .hf-eye-halo{animation-duration:1.1s}
.hf-eye[data-mood="working"] .hf-eye-svg .hf-corners{animation:hf-corners 1.9s linear infinite}
.hf-eye-scan{position:absolute;inset:5%;z-index:4;border-radius:50%;overflow:hidden;pointer-events:none;opacity:0}
.hf-eye-scan::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 44%,rgba(214,232,255,.5) 50%,transparent 56%);mix-blend-mode:screen;animation:hf-scan-move 1.3s linear infinite}
.hf-eye[data-mood="working"] .hf-eye-scan{opacity:1}
.hf-eye[data-mood="done"]{animation:hf-celebrate 1s cubic-bezier(.3,1.5,.5,1) 1}
.hf-eye-flash{position:absolute;inset:-4%;z-index:0;border-radius:50%;pointer-events:none;opacity:0;border:2px solid rgba(190,220,255,.85)}
.hf-eye[data-mood="done"] .hf-eye-flash{animation:hf-burst .95s ease-out 1}
@keyframes hf-corners{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes hf-breath-a{from{transform:scale(.985)}to{transform:scale(.91)}}
@keyframes hf-breath-b{from{transform:scale(1)}to{transform:scale(.90)}}
@keyframes hf-breath-c{from{transform:scale(1)}to{transform:scale(.87)}}
@keyframes hf-breath-d{from{transform:scale(1)}to{transform:scale(.85)}}
@keyframes hf-catchlight{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.82;transform:scale(.94)}}
@keyframes hf-focus{0%,100%{transform:scale(1)}50%{transform:scale(.82)}}
@keyframes hf-celebrate{0%{transform:scale(1)}30%{transform:scale(1.14)}62%{transform:scale(.97)}100%{transform:scale(1)}}
@keyframes hf-burst{0%{transform:scale(.6);opacity:.9}100%{transform:scale(1.5);opacity:0}}
@keyframes hf-halo-pulse{0%,100%{opacity:.55;transform:scale(.97)}50%{opacity:.95;transform:scale(1.05)}}
@keyframes hf-ring{0%{opacity:0;transform:scale(.98)}5%{opacity:.78}12%{opacity:.56}20%{opacity:.2}27%{opacity:0}36%,100%{opacity:0;transform:scale(2.78)}}
@keyframes hf-scan-move{0%{transform:translateY(-46%)}100%{transform:translateY(46%)}}
@keyframes hf-gline{0%{top:21%}33%{top:57%}66%{top:36%}100%{top:71%}}
@keyframes hf-lid-think{from{transform:translateY(14.5px) scaleY(.55)}to{transform:translateY(15.5px) scaleY(1)}}
@keyframes hf-lid-soft{from{transform:translateY(-7px)}to{transform:translateY(1px)}}
@keyframes hf-lid-blink{0%{transform:translateY(-60px) scaleY(1)}40%{transform:translateY(16px) scaleY(1)}56%{transform:translateY(16px) scaleY(1)}100%{transform:translateY(-60px) scaleY(1)}}
@keyframes hf-eyelid-halo{0%{opacity:1;transform:scale(1)}42%{opacity:.45;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}
@keyframes hf-glance-l{0%,100%{transform:translateX(0)}34%,62%{transform:translateX(-6%)}}
@keyframes hf-glance-r{0%,100%{transform:translateX(0)}34%,62%{transform:translateX(6%)}}
@media(prefers-reduced-motion:reduce){
  .hf-eye-svg .hf-corners,.hf-eye-svg .hf-sclera,.hf-eye-svg .hf-iris-outer,.hf-eye-svg .hf-iris-blue,.hf-eye-svg .hf-pupil,.hf-eye-svg .hf-highlight,.hf-eye-ring,.hf-eye-halo,.hf-eye-scan::before{animation:none!important}
}
`
