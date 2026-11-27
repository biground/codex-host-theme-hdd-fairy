import { renderHddIcon } from '../shared/hdd-icons.mjs'
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
  readDockPos,
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
    enableMotionJuice: zh ? '启用绝区零交互动效（Juice）' : 'Enable ZZZ Interaction Juice',
    enableMotionJuiceDesc: zh ? '开启 12 项机械键帽按压、45° 金属扫光、聚焦警戒条推进与战术点击瞬闪（遵循减弱动态设置）。' : 'Enable 12 ZZZ tactile animations: keycap press, metallic sheen, focus hazard march, and click bursts.',
    webHeroWatermark: zh ? '显示新会话 H.D.D 欢迎背景' : 'Show H.D.D Welcome Backdrop',
    webHeroWatermarkDesc: zh ? '在 CH Web 新会话页展示 H.D.D 标志、网状球体与时段问候语。' : 'Show the H.D.D logo, wireframe sphere, and greeting on CH Web new sessions.',
    enableChatAnimatedAvatar: zh ? '对话气泡动态 Fairy 眼徽' : 'Animated Chat Fairy Avatar',
    enableChatAnimatedAvatarDesc: zh ? '仅对视口内连续回复的组尾气泡按需挂载轻量动态眼徽，滚出视口即释放。' : 'Mount a lightweight animated Fairy eye on visible tail assistant bubbles; unmounts offscreen.',
    webUsagePanel: zh ? '显示新会话算力用量终端' : 'Show New-Session Usage Telemetry',
    webUsagePanelDesc: zh ? '在欢迎页上方显示绝区零风格 CodexHost 原生用量统计（概览 / 模型 / Harness / 配额）。' : 'Show the ZZZ-styled CodexHost usage telemetry bar & dashboard on new sessions.',
    webUsagePreset: zh ? '用量面板视觉预设' : 'Usage Panel ZZZ Style',
    webUsagePresetDesc: zh ? '支持黑金重工、新艾利都街头 HUD、绳网亮白档案卡三套绝区零风格。' : 'Switch between H.D.D Amber, Street Acid-Lime HUD, and Random Play Archive.',
    presetAmber: zh ? '黑金重工' : 'Amber',
    presetStreet: zh ? '街头 HUD' : 'Street',
    presetArchive: zh ? '绳网白卡' : 'Archive',
    webUsageDefaultExpanded: zh ? '默认展开完整用量面板' : 'Expand Usage Panel by Default',
    webUsageDefaultExpandedDesc: zh ? '默认关闭：新会话以顶部迷你胶囊条展示，不挤压欢迎页，点击即可展开。' : 'Default off: starts as a compact top capsule bar so the welcome page stays spacious.',
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
    page.dataset.preset = settings.globalPreset
    page.replaceChildren()

    const shell = doc.createElement('div')
    shell.className = 'hf-shell'

    // Hero preview card
    const hero = doc.createElement('section')
    hero.className = 'hf-hero'

    const stage = doc.createElement('button')
    stage.type = 'button'
    stage.className = 'hf-stage'
    stage.title = isZhLocale(locale) ? '点击触发故障花屏效果' : 'Click to trigger glitch effect'
    stage.setAttribute('aria-label', stage.title)
    fairyEye.element.style.width = `${settings.eyeSize}px`
    fairyEye.element.style.height = `${settings.eyeSize}px`
    const coords = doc.createElement('span')
    coords.className = 'hf-coords'
    const dock = readDockPos()
    coords.textContent = dock ? `DOCK X:${dock.x} Y:${dock.y}` : 'DOCK X:25% Y:52%'
    stage.append(fairyEye.element, coords)
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
      pill.innerHTML = renderHddIcon({ idle: 'radio', thinking: 'cpu', working: 'activity', done: 'check' }[mood])
      pill.append(doc.createTextNode(moodLabel(mood, locale)))
      pill.addEventListener('click', () => {
        previewMood = mood
        fairyEye.setMood(mood)
        render()
      })
      moodBar.append(pill)
    }

    heroBody.append(heroTop, badges, greet, welcomeSub, moodBar)
    if (mobile) {
      const notice = doc.createElement('p')
      notice.className = 'hf-mobile-notice'
      notice.innerHTML = renderHddIcon('alert')
      notice.append(doc.createTextNode(t.mobileHint))
      heroBody.append(notice)
    }
    hero.append(stage, heroBody)
    shell.append(hero)

    const zh = isZhLocale(locale)
    const presets = [
      ['amber', zh ? '黑金重工' : 'H.D.D Amber', zh ? '经典法厄同重工终端 · 暗光沉浸' : 'Industrial armor for low-light focus'],
      ['street', zh ? '新艾利都街头 HUD' : 'New Eridu Street HUD', zh ? '漫画描边 · 酸橙撞色硬投影' : 'Bold ink outlines and acid-lime HUD'],
      ['archive', zh ? '绳网高反差档案' : 'Inter-Knot Archive', zh ? '电光蓝外壳 · 暖白阅读内胆' : 'Cobalt frame and warm-white reading cards'],
    ]
    const master = doc.createElement('section')
    master.className = 'hf-master'
    const masterTitle = doc.createElement('h2')
    masterTitle.className = 'hf-card-title'
    masterTitle.textContent = zh ? '全站视觉预设 // GLOBAL PRESET' : 'Global Visual Preset'
    const presetCards = doc.createElement('div')
    presetCards.className = 'hf-preset-cards'
    for (const [id, label, desc] of presets) {
      const btn = doc.createElement('button')
      btn.type = 'button'
      btn.className = 'hf-preset-card'
      btn.dataset.preset = id
      btn.setAttribute('aria-pressed', String(settings.globalPreset === id))
      btn.innerHTML = `<span class="hf-preset-preview" aria-hidden="true"><i></i><i></i><i></i></span><span class="hf-preset-name">${renderHddIcon(`preset-${id}`, { size: 22 })}${String.fromCharCode(65 + presets.findIndex(([key]) => key === id))} · ${label}</span><span class="hf-preset-desc">${desc}</span><span class="hf-preset-active">${renderHddIcon(settings.globalPreset === id ? 'check' : 'chevron-right')}</span>`
      btn.addEventListener('click', () => {
        void updateSettings({ globalPreset: id }, zh ? `全站预设已切换至【${label}】，独立面板预设保持自选` : `Global preset: ${label}; panel overrides retained`)
      })
      presetCards.append(btn)
    }
    master.append(masterTitle, presetCards)
    shell.append(master)

    // Settings grid
    const grid = doc.createElement('div')
    grid.className = 'hf-grid'

    // Eye Widget Card
    const eyeCard = doc.createElement('section')
    eyeCard.className = 'hf-card'
    const eyeTitle = doc.createElement('h2')
    eyeTitle.className = 'hf-card-title'
    eyeTitle.innerHTML = renderHddIcon('eye', { size: 20 })
    eyeTitle.append(doc.createTextNode(t.eyeSection))
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
    range.setAttribute('aria-label', t.eyeSize)
    range.disabled = mobile || !settings.showEye
    const sizeVal = doc.createElement('span')
    sizeVal.className = 'hf-range-val'
    sizeVal.textContent = `${settings.eyeSize}px`
    range.addEventListener('input', () => {
      sizeVal.textContent = `${range.value}px`
      fairyEye.element.style.width = `${range.value}px`
      fairyEye.element.style.height = `${range.value}px`
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
    const webDesc = doc.createElement('p')
    webDesc.className = 'hf-card-desc'
    webDesc.textContent = api.hostTarget === 'desktop' ? t.desktopThemeNote : (zh ? '六项面板可独立启停和选色，也可跟随全站预设。' : 'Enable and style each of the six panels independently, or follow the global preset.')

    webTitle.innerHTML = renderHddIcon('sliders', { size: 20 })
    webTitle.append(doc.createTextNode(zh ? '分面板独立定制矩阵' : 'Independent Panel Presets'))
    const juiceRow = makeRow(
      t.enableMotionJuice,
      t.enableMotionJuiceDesc,
      makeSwitch(settings.enableMotionJuice, !settings.enableWebTheme, t.enableMotionJuice, () => {
        void updateSettings({ enableMotionJuice: !settings.enableMotionJuice }, t.saved)
      }),
    )
    juiceRow.dataset.setting = 'enableMotionJuice'
    juiceRow.querySelector('.hf-row-label')?.insertAdjacentHTML('afterbegin', renderHddIcon('spark'))

    webCard.append(
      webTitle,
      webDesc,
      makeRow(t.enableWebTheme, t.enableWebThemeDesc, makeSwitch(settings.enableWebTheme, false, t.enableWebTheme, () => {
        void updateSettings({ enableWebTheme: !settings.enableWebTheme }, t.saved)
      })),
      juiceRow,
    )
    const panels = [
      ['panelShellEnabled', 'panelShellPreset', 'layout-sidebar', zh ? '侧栏、顶栏与全局浮层' : 'Sidebar, header & overlays'],
      ['panelChatEnabled', 'panelChatPreset', 'message-square', zh ? '欢迎页、对话流与工具卡' : 'Welcome, conversation & tool cards', ['webHeroWatermark', 'enableChatAnimatedAvatar']],
      ['panelComposerEnabled', 'panelComposerPreset', 'terminal', zh ? '输入舱、排队与审批问答' : 'Composer, queue & approvals'],
      ['panelRightbarEnabled', 'panelRightbarPreset', 'folder', zh ? '右侧边栏工作台' : 'Right sidebar workbench', ['webRightbarFilesEnhance']],
      ['panelSettingsEnabled', 'panelSettingsPreset', 'puzzle', zh ? '设置中心与插件管理' : 'Settings & plugin manager'],
      ['webUsagePanel', 'webUsagePreset', 'cpu', zh ? '新会话算力用量面板' : 'New-session usage panel', ['webUsageDefaultExpanded']],
    ]
    const subMeta = {
      webHeroWatermark: { label: t.webHeroWatermark, desc: '', icon: '' },
      enableChatAnimatedAvatar: { label: t.enableChatAnimatedAvatar, desc: t.enableChatAnimatedAvatarDesc, icon: 'eye' },
      webRightbarFilesEnhance: { label: zh ? '增强文件树与文件详情' : 'Enhance file tree & details', desc: '', icon: '' },
      webUsageDefaultExpanded: { label: t.webUsageDefaultExpanded, desc: '', icon: '' },
    }
    panels.forEach(([enabledKey, presetKey, icon, label, subKeys], index) => {
      const controls = doc.createElement('div')
      controls.className = 'hf-panel-controls'
      const select = doc.createElement('select')
      select.className = 'hf-select'
      select.setAttribute('aria-label', `${label} · ${zh ? '预设' : 'Preset'}`)
      select.dataset.setting = presetKey
      select.disabled = !settings.enableWebTheme || !settings[enabledKey]
      for (const [value, text] of [['follow', zh ? '跟随全站' : 'Follow global'], ...presets.map(([id, name]) => [id, name])]) {
        const option = doc.createElement('option')
        option.value = value
        option.textContent = text
        select.append(option)
      }
      select.value = settings[presetKey]
      select.addEventListener('change', () => { void updateSettings({ [presetKey]: select.value }, t.saved) })
      controls.append(select, makeSwitch(settings[enabledKey], !settings.enableWebTheme, label, () => {
        void updateSettings({ [enabledKey]: !settings[enabledKey] }, t.saved)
      }))
      const row = makeRow(label, `SYS-0${index + 1}`, controls)
      row.dataset.panel = presetKey
      const rowLabel = row.querySelector('.hf-row-label')
      rowLabel.insertAdjacentHTML('afterbegin', renderHddIcon(icon))
      const group = doc.createElement('div')
      group.className = 'hf-panel-group'
      group.append(row)
      for (const subKey of subKeys ?? []) {
        const meta = subMeta[subKey]
        const subRow = makeRow(meta.label, meta.desc, makeSwitch(settings[subKey], !settings.enableWebTheme || !settings[enabledKey], meta.label, () => {
          void updateSettings({ [subKey]: !settings[subKey] }, t.saved)
        }))
        subRow.dataset.setting = subKey
        if (meta.icon) subRow.querySelector('.hf-row-label')?.insertAdjacentHTML('afterbegin', renderHddIcon(meta.icon, { size: 15 }))
        group.append(subRow)
      }
      webCard.append(group)
    })

    // Quick Actions Card
    const actCard = doc.createElement('section')
    actCard.className = 'hf-card is-full'

    const actions = doc.createElement('div')
    actions.className = 'hf-actions'

    const replayBootBtn = doc.createElement('button')
    replayBootBtn.type = 'button'
    replayBootBtn.className = 'hf-btn is-primary'
    replayBootBtn.disabled = mobile
    replayBootBtn.innerHTML = renderHddIcon('play')
    replayBootBtn.append(doc.createTextNode(t.replayBoot))
    replayBootBtn.addEventListener('click', () => {
      dispatchFairyAction({ type: 'replay-boot' })
      showToast(t.replayedBoot)
    })

    const replayBtn = doc.createElement('button')
    replayBtn.type = 'button'
    replayBtn.className = 'hf-btn'
    replayBtn.disabled = mobile
    replayBtn.innerHTML = renderHddIcon('spark')
    replayBtn.append(doc.createTextNode(t.replayGreeting))
    replayBtn.addEventListener('click', () => {
      dispatchFairyAction({ type: 'replay-greeting' })
      showToast(t.replayed)
    })

    const resetBtn = doc.createElement('button')
    resetBtn.type = 'button'
    resetBtn.className = 'hf-btn'
    resetBtn.disabled = mobile
    resetBtn.innerHTML = renderHddIcon('pin')
    resetBtn.append(doc.createTextNode(t.resetPos))
    resetBtn.addEventListener('click', () => {
      writeDockPos(null)
      dispatchFairyAction({ type: 'reset-pos' })
      render()
      showToast(t.resetDone)
    })

    const defaultsBtn = doc.createElement('button')
    defaultsBtn.type = 'button'
    defaultsBtn.className = 'hf-btn is-danger'
    defaultsBtn.innerHTML = renderHddIcon('reset')
    defaultsBtn.append(doc.createTextNode(t.restoreDefaults))
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
    heroBody.append(actions)
    actCard.append(toast, meta)

    grid.append(webCard, eyeCard, actCard)
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
