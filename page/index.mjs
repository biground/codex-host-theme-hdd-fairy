import {
  DEFAULT_SETTINGS,
  EYE_ANIMATION_CSS,
  MOBILE_MEDIA,
  createFairyEye,
  dispatchFairyAction,
  greetLine,
  hddWelcomeLine,
  isZhLocale,
  moodLabel,
  normalizeSettings,
  writeDockPos,
} from '../shared/fairy-core.mjs'

function copy(locale) {
  const zh = isZhLocale(locale)
  return {
    title: zh ? 'H.D.D + Fairy 控制台' : 'H.D.D + Fairy Control',
    targetDesktop: zh ? '运行端：Codex Desktop' : 'Target: Codex Desktop',
    targetWeb: zh ? '运行端：CH Web' : 'Target: CH Web',
    schemeDark: zh ? '深色外观' : 'Dark Mode',
    schemeLight: zh ? '浅色外观' : 'Light Mode',
    pureFrontend: zh ? '纯前端 · 零后端 · 无音频' : 'Pure Frontend · No Audio',
    eyeSection: zh ? 'Fairy 悬浮眼徽（Desktop & Web）' : 'Fairy Floating Eye (Desktop & Web)',
    eyeSectionDesc: zh
      ? '眼徽通过跨端挂件（widget）在 Desktop 与 Web 主窗口自动运行，手机窄屏自动停用。'
      : 'Runs across Desktop and Web via the cross-platform widget surface; auto-disabled on phones.',
    showEye: zh ? '显示悬浮眼徽' : 'Show Floating Eye',
    showEyeDesc: zh ? '开启后主窗口显示动态 Fairy 眼徽，点击可展开状态卡。' : 'Show the animated Fairy eye overlay; click it to toggle the status card.',
    dragEnabled: zh ? '允许拖动眼徽' : 'Allow Dragging Eye',
    dragEnabledDesc: zh ? '按住眼徽可拖动停靠，坐标保存在当前客户端。' : 'Drag the eye to dock anywhere; coordinates persist locally.',
    eyeSize: zh ? '眼徽直径' : 'Eye Diameter',
    eyeSizeDesc: zh ? '调整停靠状态下眼徽的像素尺寸（72–168px）。' : 'Adjust the docked eye size in pixels (72–168px).',
    greetingLaunch: zh ? '启动时播放开机动画' : 'Play Boot Animation on Launch',
    greetingLaunchDesc: zh ? '打开 Desktop 或 Web 时播放一次静音 H.D.D 开机动画与全息问候。' : 'Play the silent H.D.D boot animation and greeting once on launch.',
    webSection: zh ? 'CH Web H.D.D 主题皮肤' : 'CH Web H.D.D Theme',
    webSectionDesc: zh
      ? '以下选项作用于 CH Web 宿主界面（碳纤维暗色面板、聊天气泡、侧栏高亮与微软雅黑界面字体）。'
      : 'Applies to CH Web host UI (carbon-fiber dark panels, chat bubbles, sidebar highlights, and Microsoft YaHei UI font).',
    enableWebTheme: zh ? '启用 Web H.D.D 皮肤' : 'Enable Web H.D.D Theme',
    enableWebThemeDesc: zh ? '开启后在 CH Web 注入碳纤维主题与微软雅黑字体；关闭即即时恢复宿主外观。' : 'Inject carbon-fiber dark theme & Microsoft YaHei font into CH Web.',
    webHeroWatermark: zh ? '显示新会话 H.D.D 欢迎背景' : 'Show H.D.D Welcome Backdrop',
    webHeroWatermarkDesc: zh ? '在 CH Web 新会话页展示 H.D.D 标志、网状球体与时段问候语。' : 'Show the H.D.D logo, wireframe sphere, and greeting on CH Web new sessions.',
    actionsSection: zh ? '快捷操作' : 'Quick Actions',
    replayBoot: zh ? '重播开机动画' : 'Replay Boot Animation',
    replayGreeting: zh ? '重播全息问候' : 'Replay Greeting',
    resetPos: zh ? '复位眼徽位置' : 'Reset Eye Position',
    restoreDefaults: zh ? '恢复默认设置' : 'Restore Defaults',
    mobileHint: zh ? '当前处于手机窄屏视图，开机动画与悬浮眼徽已自动停用。' : 'Mobile viewport detected; boot animation and floating eye are auto-disabled.',
    desktopThemeNote: zh ? '当前在 Desktop 中查看；Web 主题开关已同步保存至共享 Host，在 CH Web 中自动生效。' : 'Viewing in Desktop; Web theme preferences sync via shared Host and apply automatically in CH Web.',
    saved: zh ? '设置已同步至共享 Host' : 'Settings synced to shared Host',
    replayedBoot: zh ? '已向主窗口挂件发送开机动画重播指令' : 'Triggered boot animation replay on active widget',
    replayed: zh ? '已向主窗口挂件发送问候演出指令' : 'Sent greeting replay trigger to active widget',
    resetDone: zh ? '眼徽位置已复位' : 'Eye dock position reset',
    defaultsDone: zh ? '已恢复全部默认设置' : 'Restored all default settings',
    credits: zh ? '视觉致谢：AssassinVIX/fairy-zzz-plugin (MIT) · Chengzhibense/Fairy-DSH (Apache-2.0) · AbiTssE6/dsh-theme-zzz (MIT)' : 'Credits: AssassinVIX/fairy-zzz-plugin (MIT) · Chengzhibense/Fairy-DSH (Apache-2.0) · AbiTssE6/dsh-theme-zzz (MIT)',
  }
}

export async function mount(root, api) {
  const doc = root.ownerDocument
  const signal = api.signal
  const mobileMedia = window.matchMedia(MOBILE_MEDIA)

  const eyeStyle = doc.createElement('style')
  eyeStyle.textContent = EYE_ANIMATION_CSS
  root.append(eyeStyle)

  const page = doc.createElement('div')
  page.className = 'hf-page'
  root.append(page)

  let settings = normalizeSettings(await api.storage.get().catch(() => DEFAULT_SETTINGS))
  if (signal.aborted) return
  let locale = api.locale
  let scheme = api.colorScheme
  let previewMood = 'idle'
  let logoUrl = ''
  try {
    logoUrl = await api.assets.url('assets/hdd-logo.png')
  } catch { /* Optional */ }
  if (signal.aborted) return

  const fairyEye = createFairyEye(doc, { signal })
  let toastTimer = null
  let toastMessage = ''

  const showToast = (msg) => {
    toastMessage = msg
    const el = page.querySelector('.hf-toast')
    if (el) el.textContent = msg
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toastMessage = ''
      const target = page.querySelector('.hf-toast')
      if (target) target.textContent = ''
    }, 2600)
  }

  const updateSettings = async (patch, message) => {
    const next = normalizeSettings({ ...settings, ...patch })
    settings = next
    render()
    try {
      const saved = await api.storage.set(next)
      if (!signal.aborted) {
        settings = normalizeSettings(saved)
        render()
        if (message) showToast(message)
      }
    } catch (error) {
      if (!signal.aborted) showToast(String(error?.message || error))
    }
  }

  const makeSwitch = (checked, disabled, label, onToggle) => {
    const btn = doc.createElement('button')
    btn.type = 'button'
    btn.className = 'hf-switch'
    btn.setAttribute('role', 'switch')
    btn.setAttribute('aria-label', label)
    btn.setAttribute('aria-checked', String(checked))
    btn.disabled = disabled
    btn.addEventListener('click', onToggle)
    return btn
  }

  const makeRow = (label, desc, control) => {
    const row = doc.createElement('div')
    row.className = 'hf-row'
    const text = doc.createElement('div')
    text.className = 'hf-row-text'
    const lbl = doc.createElement('div')
    lbl.className = 'hf-row-label'
    lbl.textContent = label
    const sub = doc.createElement('div')
    sub.className = 'hf-row-sub'
    sub.textContent = desc
    text.append(lbl, sub)
    row.append(text, control)
    return row
  }

  const render = () => {
    const t = copy(locale)
    const mobile = mobileMedia.matches
    page.dataset.scheme = scheme
    page.replaceChildren()

    const shell = doc.createElement('div')
    shell.className = 'hf-shell'

    // Hero preview card
    const hero = doc.createElement('section')
    hero.className = 'hf-hero'

    const stage = doc.createElement('div')
    stage.className = 'hf-stage'
    stage.title = isZhLocale(locale) ? '点击触发故障花屏效果' : 'Click to trigger glitch effect'
    stage.append(fairyEye.element)
    stage.addEventListener('click', () => fairyEye.triggerGlitch())

    const heroBody = doc.createElement('div')
    heroBody.className = 'hf-hero-body'

    const heroTop = doc.createElement('div')
    heroTop.className = 'hf-hero-top'
    if (logoUrl) {
      const img = doc.createElement('img')
      img.className = 'hf-hdd-mark'
      img.src = logoUrl
      img.alt = 'H.D.D.'
      heroTop.append(img)
    }
    const h1 = doc.createElement('h1')
    h1.className = 'hf-title'
    h1.textContent = t.title
    heroTop.append(h1)

    const badges = doc.createElement('div')
    badges.className = 'hf-badges'
    for (const [text, tone] of [
      [api.hostTarget === 'desktop' ? t.targetDesktop : t.targetWeb, 'accent'],
      [scheme === 'dark' ? t.schemeDark : t.schemeLight, ''],
      [t.pureFrontend, ''],
    ]) {
      const badge = doc.createElement('span')
      badge.className = 'hf-badge'
      if (tone) badge.dataset.tone = tone
      badge.textContent = text
      badges.append(badge)
    }

    const greet = doc.createElement('p')
    greet.className = 'hf-greet'
    greet.textContent = greetLine(locale)

    const welcomeSub = doc.createElement('p')
    welcomeSub.className = 'hf-welcome-sub'
    welcomeSub.textContent = hddWelcomeLine(locale)

    const moodBar = doc.createElement('div')
    moodBar.className = 'hf-mood-bar'
    for (const mood of ['idle', 'thinking', 'working', 'done']) {
      const pill = doc.createElement('button')
      pill.type = 'button'
      pill.className = 'hf-pill'
      pill.setAttribute('aria-pressed', String(previewMood === mood))
      pill.textContent = moodLabel(mood, locale)
      pill.addEventListener('click', () => {
        previewMood = mood
        fairyEye.setMood(mood)
        render()
      })
      moodBar.append(pill)
    }

    heroBody.append(heroTop, badges, greet, welcomeSub, moodBar)
    hero.append(stage, heroBody)
    shell.append(hero)

    // Settings grid
    const grid = doc.createElement('div')
    grid.className = 'hf-grid'

    // Eye Widget Card
    const eyeCard = doc.createElement('section')
    eyeCard.className = 'hf-card'
    const eyeTitle = doc.createElement('h2')
    eyeTitle.className = 'hf-card-title'
    eyeTitle.textContent = t.eyeSection
    const eyeDesc = doc.createElement('p')
    eyeDesc.className = 'hf-card-desc'
    eyeDesc.textContent = mobile ? t.mobileHint : t.eyeSectionDesc

    const sizeWrap = doc.createElement('div')
    sizeWrap.className = 'hf-range-wrap'
    const range = doc.createElement('input')
    range.type = 'range'
    range.className = 'hf-range'
    range.min = '72'
    range.max = '168'
    range.step = '4'
    range.value = String(settings.eyeSize)
    range.disabled = mobile || !settings.showEye
    const sizeVal = doc.createElement('span')
    sizeVal.className = 'hf-range-val'
    sizeVal.textContent = `${settings.eyeSize}px`
    range.addEventListener('input', () => {
      sizeVal.textContent = `${range.value}px`
    })
    range.addEventListener('change', () => {
      void updateSettings({ eyeSize: Number(range.value) }, t.saved)
    })
    sizeWrap.append(range, sizeVal)

    eyeCard.append(
      eyeTitle,
      eyeDesc,
      makeRow(t.showEye, t.showEyeDesc, makeSwitch(settings.showEye, mobile, t.showEye, () => {
        void updateSettings({ showEye: !settings.showEye }, t.saved)
      })),
      makeRow(t.dragEnabled, t.dragEnabledDesc, makeSwitch(settings.dragEnabled, mobile || !settings.showEye, t.dragEnabled, () => {
        void updateSettings({ dragEnabled: !settings.dragEnabled }, t.saved)
      })),
      makeRow(t.eyeSize, t.eyeSizeDesc, sizeWrap),
      makeRow(t.greetingLaunch, t.greetingLaunchDesc, makeSwitch(settings.playBootOnLaunch, mobile, t.greetingLaunch, () => {
        void updateSettings({ playBootOnLaunch: !settings.playBootOnLaunch }, t.saved)
      })),
    )

    // Web Theme Card
    const webCard = doc.createElement('section')
    webCard.className = 'hf-card'
    const webTitle = doc.createElement('h2')
    webTitle.className = 'hf-card-title'
    webTitle.textContent = t.webSection
    const webDesc = doc.createElement('p')
    webDesc.className = 'hf-card-desc'
    webDesc.textContent = api.hostTarget === 'desktop' ? t.desktopThemeNote : t.webSectionDesc

    webCard.append(
      webTitle,
      webDesc,
      makeRow(t.enableWebTheme, t.enableWebThemeDesc, makeSwitch(settings.enableWebTheme, false, t.enableWebTheme, () => {
        void updateSettings({ enableWebTheme: !settings.enableWebTheme }, t.saved)
      })),
      makeRow(t.webHeroWatermark, t.webHeroWatermarkDesc, makeSwitch(settings.webHeroWatermark, !settings.enableWebTheme, t.webHeroWatermark, () => {
        void updateSettings({ webHeroWatermark: !settings.webHeroWatermark }, t.saved)
      })),
    )

    // Quick Actions Card
    const actCard = doc.createElement('section')
    actCard.className = 'hf-card is-full'
    const actTitle = doc.createElement('h2')
    actTitle.className = 'hf-card-title'
    actTitle.textContent = t.actionsSection

    const actions = doc.createElement('div')
    actions.className = 'hf-actions'

    const replayBootBtn = doc.createElement('button')
    replayBootBtn.type = 'button'
    replayBootBtn.className = 'hf-btn is-primary'
    replayBootBtn.disabled = mobile
    replayBootBtn.textContent = t.replayBoot
    replayBootBtn.addEventListener('click', () => {
      dispatchFairyAction({ type: 'replay-boot' })
      showToast(t.replayedBoot)
    })

    const replayBtn = doc.createElement('button')
    replayBtn.type = 'button'
    replayBtn.className = 'hf-btn'
    replayBtn.disabled = mobile
    replayBtn.textContent = t.replayGreeting
    replayBtn.addEventListener('click', () => {
      dispatchFairyAction({ type: 'replay-greeting' })
      showToast(t.replayed)
    })

    const resetBtn = doc.createElement('button')
    resetBtn.type = 'button'
    resetBtn.className = 'hf-btn'
    resetBtn.disabled = mobile
    resetBtn.textContent = t.resetPos
    resetBtn.addEventListener('click', () => {
      writeDockPos(null)
      dispatchFairyAction({ type: 'reset-pos' })
      showToast(t.resetDone)
    })

    const defaultsBtn = doc.createElement('button')
    defaultsBtn.type = 'button'
    defaultsBtn.className = 'hf-btn is-danger'
    defaultsBtn.textContent = t.restoreDefaults
    defaultsBtn.addEventListener('click', () => {
      writeDockPos(null)
      dispatchFairyAction({ type: 'reset-pos' })
      void updateSettings({ ...DEFAULT_SETTINGS }, t.defaultsDone)
    })

    const toast = doc.createElement('div')
    toast.className = 'hf-toast'
    toast.setAttribute('role', 'status')
    toast.textContent = toastMessage

    const meta = doc.createElement('div')
    meta.className = 'hf-meta'
    meta.textContent = t.credits

    actions.append(replayBootBtn, replayBtn, resetBtn, defaultsBtn)
    actCard.append(actTitle, actions, toast, meta)

    grid.append(eyeCard, webCard, actCard)
    shell.append(grid)
    page.append(shell)
  }

  render()

  const offStorage = api.storage.onChange((next) => {
    settings = normalizeSettings(next)
    render()
  })
  const offLocale = api.onLocaleChange((next) => {
    locale = next
    render()
  })
  const offScheme = api.onColorSchemeChange((next) => {
    scheme = next
    render()
  })
  const onMobileChange = () => render()
  mobileMedia.addEventListener('change', onMobileChange, { signal })

  return () => {
    clearTimeout(toastTimer)
    offStorage()
    offLocale()
    offScheme()
    fairyEye.dispose()
    page.remove()
    eyeStyle.remove()
  }
}
