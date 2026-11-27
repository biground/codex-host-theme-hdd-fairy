import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildZip, collectExtensionFiles } from '../scripts/pack-zip.mjs'
import * as core from '../shared/fairy-core.mjs'
import {
  DEFAULT_SETTINGS,
  clampDockPos,
  greetLine,
  hddWelcomeLine,
  normalizeSettings,
  renderFairyEyeSvg,
} from '../shared/fairy-core.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ALLOWED_PACKAGE_SUFFIX = /\.(?:js|mjs|cjs|css|json|png|jpe?g|webp|gif|woff2|md|txt|svg|ts|tsx|ya?ml)$/iu
const ALLOWED_PACKAGE_BASENAME = /^(?:licen[cs]e|notice|\.gitignore|\.gitattributes)$/iu

test('panel presets follow the global selection while preserving explicit legacy usage choices', () => {
  assert.equal(typeof core.resolvePanelPreset, 'function')
  assert.deepEqual(core.VALID_PRESETS, ['amber', 'street', 'archive'])
  assert.deepEqual(core.VALID_PANEL_PRESETS, ['follow', ...core.VALID_PRESETS])
  assert.deepEqual(core.PANEL_KEYS, ['shell', 'chat', 'composer', 'rightbar', 'settings', 'usage'])
  for (const globalPreset of core.VALID_PRESETS) {
    const settings = normalizeSettings({ globalPreset })
    for (const panel of core.PANEL_KEYS) {
      assert.equal(core.resolvePanelPreset(settings, panel), globalPreset)
      const prefix = `panel${panel[0].toUpperCase()}${panel.slice(1)}`
      const key = panel === 'usage' ? 'webUsagePreset' : `${prefix}Preset`
      for (const preset of core.VALID_PANEL_PRESETS) {
        assert.equal(core.resolvePanelPreset(normalizeSettings({ globalPreset, [key]: preset }), panel),
          preset === 'follow' ? globalPreset : preset)
      }
      assert.equal(normalizeSettings({ [key]: 'invalid' })[key], 'follow')
      if (panel !== 'usage') assert.equal(normalizeSettings({ [`${prefix}Enabled`]: false })[`${prefix}Enabled`], false)
    }
  }
  assert.equal(normalizeSettings({ globalPreset: 'follow' }).globalPreset, 'amber')
  assert.equal(normalizeSettings({ webRightbarFilesEnhance: false }).webRightbarFilesEnhance, false)
  assert.equal(DEFAULT_SETTINGS.enableMotionJuice, true)
  assert.equal(normalizeSettings({ enableMotionJuice: false }).enableMotionJuice, false)
  assert.equal(normalizeSettings({ enableMotionJuice: 'invalid' }).enableMotionJuice, true)
  assert.equal(DEFAULT_SETTINGS.enableChatAnimatedAvatar, true)
  assert.equal(normalizeSettings({ enableChatAnimatedAvatar: false }).enableChatAnimatedAvatar, false)
  assert.equal(normalizeSettings({ enableChatAnimatedAvatar: 'invalid' }).enableChatAnimatedAvatar, true)
  for (const preset of ['amber', 'street', 'archive']) {
    assert.equal(normalizeSettings({ webUsagePreset: preset }).webUsagePreset, preset)
  }
  const manifest = JSON.parse(readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'))
  assert.equal(manifest.version, '2.2.0')
  assert.equal(JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version, manifest.version)
  assert.equal(manifest.settingsSchema.length, 23)
  assert.deepEqual(Object.fromEntries(manifest.settingsSchema.map(({ key, default: value }) => [key, value])), DEFAULT_SETTINGS)
  for (const field of manifest.settingsSchema.filter(({ type }) => type === 'select')) {
    assert.deepEqual(field.options.map(({ value }) => value), field.key === 'globalPreset' ? core.VALID_PRESETS : core.VALID_PANEL_PRESETS)
  }
})

test('H.D.D icons provide the complete uniform SVG vocabulary with escaped rendering options', async () => {
  const iconFile = path.join(ROOT, 'shared/hdd-icons.mjs')
  assert.ok(existsSync(iconFile), 'Shared H.D.D icon library must exist')
  const { HDD_ICONS, renderHddIcon } = await import('../shared/hdd-icons.mjs')
  const required = 'spark sliders eye eye-off move refresh reset play stop send chevron-up chevron-down chevron-right check x alert shield terminal folder file-code search puzzle keyboard globe layers cpu activity pin clock radio layout-sidebar message-square command preset-amber preset-street preset-archive'.split(' ')
  assert.doesNotMatch(readFileSync(iconFile, 'utf8'), /\p{Extended_Pictographic}|\uFE0F|\u20E3/u)
  for (const name of required) {
    assert.ok(Object.hasOwn(HDD_ICONS, name), name)
    assert.match(HDD_ICONS[name], /^<svg\b[^>]*>[\s\S]+<\/svg>$/)
    const svg = renderHddIcon(name)
    for (const attr of ['viewBox="0 0 24 24"', 'fill="none"', 'stroke="currentColor"', 'stroke-width="1.75"', 'stroke-linecap="square"', 'stroke-linejoin="miter"', 'aria-hidden="true"', 'width="16"', 'height="16"']) assert.ok(svg.includes(attr), `${name}: ${attr}`)
    assert.doesNotMatch(svg, /role="img"|<title>/)
  }
  const labeled = renderHddIcon('spark', { size: 24, className: 'hdd" onclick="bad', title: '<&"' })
  assert.match(labeled, /width="24" height="24"/)
  assert.match(labeled, /role="img"/)
  assert.match(labeled, /<title>&lt;&amp;&quot;<\/title>/)
  assert.doesNotMatch(labeled, /" onclick="bad/)
})

test('manifest.json conforms to CodexHost manifestVersion 2 requirements', () => {
  const manifest = JSON.parse(readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'))
  assert.equal(manifest.manifestVersion, 2)
  assert.match(manifest.id, /^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$/)
  assert.ok(manifest.name?.en && manifest.name?.['zh-CN'])
  assert.ok(manifest.description?.en && manifest.description?.['zh-CN'])
  assert.ok(manifest.details?.en && manifest.details?.['zh-CN'])
  assert.ok(Array.isArray(manifest.categories) && manifest.categories.length > 0)
  assert.ok(manifest.page?.entry === 'page/index.mjs' && manifest.page?.style === 'page/style.css')
  assert.ok(manifest.widget?.entry === 'widget/index.mjs' && manifest.widget?.style === 'widget/style.css')
  assert.ok(manifest.web?.entry === 'web/index.mjs' && manifest.web?.style === 'web/style.css')
  assert.equal(manifest.backend, undefined, 'Pure frontend extension must not declare backend')

  // Icon <= 128 KiB, screenshots <= 4 and <= 512 KiB each (total <= 2 MiB)
  const iconBytes = statSync(path.join(ROOT, manifest.icon)).size
  assert.ok(iconBytes > 0 && iconBytes <= 128 * 1024, `Icon size ${iconBytes} exceeds 128 KiB`)
  assert.ok(Array.isArray(manifest.screenshots) && manifest.screenshots.length <= 4)
  let totalScreenshots = 0
  for (const rel of manifest.screenshots) {
    const size = statSync(path.join(ROOT, rel)).size
    assert.ok(size > 0 && size <= 512 * 1024, `Screenshot ${rel} (${size} B) exceeds 512 KiB`)
    totalScreenshots += size
  }
  assert.ok(totalScreenshots <= 2 * 1024 * 1024, `Total screenshots (${totalScreenshots} B) exceeds 2 MiB`)
})

test('repository contains only v2-allowed file types for direct GitHub zipball installation', () => {
  const skipDirs = new Set(['.git', '.work', '.workorders', 'node_modules'])
  const invalid = []
  function walk(dir, prefix = '') {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (skipDirs.has(entry.name)) continue
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full, rel)
      else if (entry.isFile()) {
        if (!ALLOWED_PACKAGE_SUFFIX.test(rel) && !ALLOWED_PACKAGE_BASENAME.test(entry.name)) {
          invalid.push(rel)
        }
      }
    }
  }
  walk(ROOT)
  assert.deepEqual(invalid, [], `Unsupported files would break GitHub zipball import: ${invalid.join(', ')}`)
})

test('shared helpers normalize settings, clamp coordinates, and localize greetings', () => {
  assert.deepEqual(normalizeSettings({}), DEFAULT_SETTINGS)
  assert.equal(normalizeSettings({ eyeSize: 999 }).eyeSize, 168)
  assert.equal(normalizeSettings({ eyeSize: 10 }).eyeSize, 72)
  assert.equal(normalizeSettings({ showEye: false, enableWebTheme: false }).showEye, false)
  const clamped = clampDockPos({ x: -100, y: 9999 }, { width: 1280, height: 720 }, 120)
  assert.ok(clamped.x >= 68 && clamped.x <= 1280 - 68)
  assert.ok(clamped.y >= 68 && clamped.y <= 720 - 68)
  assert.match(greetLine('zh-CN', 9), /早上好/)
  assert.match(greetLine('en', 9), /Good morning/)
  assert.match(hddWelcomeLine('zh-CN', 14), /中午好/)
  assert.match(hddWelcomeLine('en', 20), /Good evening/)
})

test('CSS uses Microsoft YaHei UI font and widget restricts pointer-events: auto to interactive controls', () => {
  const webCss = readFileSync(path.join(ROOT, 'web/style.css'), 'utf8')
  assert.match(webCss, /Microsoft YaHei/)
  assert.doesNotMatch(webCss, /FZZongYi|方正综艺/)
  const widgetCss = readFileSync(path.join(ROOT, 'widget/style.css'), 'utf8')
  assert.match(widgetCss, /:host\s*\{[^}]*pointer-events:\s*none/s)
  assert.match(widgetCss, /\.hf-layer\s*\{[^}]*pointer-events:\s*none/s)
  assert.match(widgetCss, /\.hf-core\s*\{[^}]*pointer-events:\s*auto/s)
  const pageCss = readFileSync(path.join(ROOT, 'page/style.css'), 'utf8')
  assert.match(pageCss, /--cx-page-bg/)
  assert.match(pageCss, /--cx-page-surface/)
  assert.match(pageCss, /--cx-page-text/)
})

test('built .zip has manifest.json at root and passes CodexHost host-extension validators', async () => {
  const { manifest, files } = collectExtensionFiles(ROOT)
  assert.ok(files.has('manifest.json'))
  assert.ok(files.has('page/index.mjs'))
  assert.ok(files.has('widget/index.mjs'))
  assert.ok(files.has('web/index.mjs'))
  assert.ok(files.has('shared/fairy-core.mjs'))
  assert.ok(files.has('shared/hdd-icons.mjs'))
  for (const module of ['tokens', 'shell-css', 'chat-css', 'chat-avatar-fx', 'composer-css', 'model-select-css', 'model-select-fx', 'rightbar-css', 'rightbar-files', 'settings-css', 'settings-shadow', 'juice-css', 'juice-fx']) {
    assert.ok(files.has(`web/panels/${module}.mjs`))
  }
  assert.ok([...files.keys()].every((name) => !name.split('/').includes('.workorders')))
  assert.ok(files.has('assets/boot.webp'), 'Animated WebP boot asset must be included')
  const bootBytes = files.get('assets/boot.webp')
  assert.equal(bootBytes.toString('ascii', 0, 4), 'RIFF')
  assert.equal(bootBytes.toString('ascii', 8, 12), 'WEBP')
  assert.ok(bootBytes.length <= 16 * 1024 * 1024, `boot.webp (${bootBytes.length} B) exceeds 16 MiB`)

  const zip = buildZip(files)
  assert.ok(zip.length > 0 && zip.length <= 64 * 1024 * 1024)

  // If sibling CodexHost v0.25.1 workspace exists, run CodexHost's official validators directly!
  const pkgFilesDir = path.resolve(ROOT, '../agy-background-wake/packages/harness-plugin-files/dist')
  const contractsDir = path.resolve(ROOT, '../agy-background-wake/packages/shared-contracts/dist')
  if (existsSync(path.join(pkgFilesDir, 'extension-zip.js')) && existsSync(path.join(contractsDir, 'host-extensions.js'))) {
    const { readExtensionZip } = await import(pathToFileURL(path.join(pkgFilesDir, 'extension-zip.js')).href)
    const { indexHostPackage, readHostManifest, validateHostPackageEntries } = await import(
      pathToFileURL(path.join(pkgFilesDir, 'host-extension-package.js')).href
    )
    const { hostExtensionCapabilities, hostExtensionTargets } = await import(
      pathToFileURL(path.join(contractsDir, 'host-extensions.js')).href
    )

    const extracted = await readExtensionZip(zip)
    assert.ok(extracted.has('manifest.json'), 'manifest.json must be at ZIP root')
    const { digest } = indexHostPackage(extracted)
    assert.match(digest, /^[a-f0-9]{64}$/)
    const read = (resource) => {
      const bytes = extracted.get(resource)
      if (!bytes) throw new Error(`Missing resource: ${resource}`)
      return bytes
    }
    const parsed = await readHostManifest(read)
    assert.equal(parsed.id, manifest.id)
    assert.equal(parsed.manifestVersion, 2)
    assert.deepEqual(hostExtensionCapabilities(parsed), {
      hasPage: true,
      hasWidget: true,
      hasDesktop: false,
      hasWeb: true,
      hasBackend: false,
    })
    assert.deepEqual(hostExtensionTargets(parsed), ['desktop', 'web'])
    const artwork = await validateHostPackageEntries(parsed, read)
    assert.equal(artwork.icon?.mime, 'image/png')
    assert.equal(artwork.screenshots.length, manifest.screenshots.length)
  }
})

test('web/index.mjs guards textContent, style vars, and self-mutations against MutationObserver loops', () => {
  const webSource = readFileSync(path.join(ROOT, 'web/index.mjs'), 'utf8')
  assert.match(webSource, /greetingEl\.textContent !== nextGreeting/)
  assert.match(webSource, /heroContent\.style\.getPropertyValue\(prop\) !== value/)
  assert.match(webSource, /mount\.container\.contains\(record\.target\)/)
  assert.match(webSource, /isOwnedMountMutation\(record, heroMount, heroContent\)/)
  assert.match(webSource, /isOwnedMountMutation\(record, usageMount, usageTarget\)/)
  assert.match(webSource, /syncObservedHeroTargets\(\)/)
  assert.match(webSource, /initialSettings: \{ \.\.\.settings, webUsagePreset: resolvePanelPreset\(settings, 'usage'\) \}/)
  assert.match(webSource, /usagePanel\.syncSettings\(\{ \.\.\.settings, webUsagePreset: resolvePanelPreset\(settings, 'usage'\) \}\)/)
  assert.match(webSource, /usageMount\.container/)
  assert.match(webSource, /isOwnedMountMutation\(record, brandMount, brandTarget\)/)
  assert.match(webSource, /isOwnedMountMutation\(record, railMount, railTarget\)/)
  assert.match(webSource, /H\.D\.D System/)
  assert.match(webSource, /Fairy Ⅲ型人工智能/)
  assert.match(webSource, /createFairyEye\(doc,\s*\{\s*signal,\s*interactiveGlitch:\s*false,\s*idSuffix:\s*'sb'\s*\}\)/)
})

test('renderFairyEyeSvg scopes gradient and clipPath IDs when idSuffix is provided', () => {
  const scoped = renderFairyEyeSvg('sb')
  assert.match(scoped, /id="hf-outer-gradient-sb"/)
  assert.match(scoped, /url\(#hf-outer-gradient-sb\)/)
  assert.match(scoped, /id="hf-lid-cover-clip-sb"/)
  assert.match(scoped, /url\(#hf-lid-cover-clip-sb\)/)
  assert.doesNotMatch(scoped, /id="hf-lid-cover-clip"/)
})

test('web/style.css hides hero native headline during H.D.D backdrop and styles sidebar H.D.D brand lockup', () => {
  const webCss = readFileSync(path.join(ROOT, 'web/style.css'), 'utf8')
  const heroHideMatch = webCss.match(/\[data-content-phase="hero"\]\s+\[class\*="_headline"\]:has\(\[class\*="_titleGroup"\]\)\s*\{([^}]*)\}/)
  assert.ok(heroHideMatch, 'Expected hero headline hide rule')
  assert.match(heroHideMatch[1], /visibility:\s*hidden/)
  assert.match(heroHideMatch[1], /pointer-events:\s*none/)

  assert.match(webCss, /\[data-cx-region="sidebar"\]\s+\[class\*="_brandIdentity"\]:has\(\.hf-sb-brand\)\s*>\s*:is\(\[class\*="_brandMark"\],\s*\[class\*="_brandName"\]\)\s*\{[^}]*display:\s*none\s*!important/s)
  assert.match(webCss, /\.hf-sb-brand-title\s*\{/)
  assert.match(webCss, /\.hf-sb-brand-badge\s*\{/)

  // Expanded usage mode must keep the exact same welcome composer width, H.D.D. backdrop opacity, and bottom heading text
  assert.doesNotMatch(webCss, /\[data-hf-usage="expanded"\]\s+\[class\*="_composerHero"\]\s*\{[^}]*max-width:/s)
  assert.doesNotMatch(webCss, /\[data-hf-usage="expanded"\]::after/)
  assert.doesNotMatch(webCss, /\.hf-hdd-copy-logo/)
})

test('web/style.css keeps sidebar ongoing/done indicators in their native 16px flex slots with vector rings and selected-row contrast', () => {
  const webCss = readFileSync(path.join(ROOT, 'web/style.css'), 'utf8')
  const ongoingSvgMatch = webCss.match(/\[data-session-status="ongoing"\]\s+svg\[data-state="ongoing"\]\s*\{([^}]*)\}/)
  assert.ok(ongoingSvgMatch, 'Expected ongoing svg rule')
  assert.match(ongoingSvgMatch[1], /position:\s*relative/)
  assert.doesNotMatch(ongoingSvgMatch[1], /position:\s*absolute/)
  assert.match(ongoingSvgMatch[1], /width:\s*16px/)
  assert.match(ongoingSvgMatch[1], /height:\s*20px/)
  assert.match(ongoingSvgMatch[1], /margin:\s*0/)
  assert.match(ongoingSvgMatch[1], /data:image\/svg\+xml/)

  const ringsMatch = webCss.match(/\[data-session-status="ongoing"\]:has\(svg\[data-state="ongoing"\]\)::after\s*\{([^}]*)\}/)
  assert.ok(ringsMatch, 'Expected ongoing rings rule')
  assert.match(ringsMatch[1], /left:\s*8px/)
  assert.match(ringsMatch[1], /var\(--hf-running-ring-svg\)/)
  assert.match(webCss, /@keyframes\s+hf-running-wave\s*\{[\s\S]*?scale\(0\.54\)[\s\S]*?scale\(0\.94\)/)
  assert.match(webCss, /\[aria-selected="true"\]\s+\[data-session-status="ongoing"\]:has\(svg\[data-state="ongoing"\]\)\s*\{[^}]*--hf-running-ring-svg:/s)
  assert.match(webCss, /\[aria-selected="true"\]\s+\[data-session-watching="true"\]\s*\{[^}]*background:\s*#181710/s)

  const doneDotMatch = webCss.match(/\[data-session-status="done"\]\s+\[data-state="done"\]\s*\{([^}]*)\}/)
  assert.ok(doneDotMatch, 'Expected done dot slot rule')
  assert.match(doneDotMatch[1], /margin-inline:\s*3px/)
})

test('all five panels and settings shadow bridge support both theme-dark and theme-light polarity', () => {
  const gate = 'html:is([data-cx-ext-hdd-fairy-theme-dark],[data-cx-ext-hdd-fairy-theme-light])'
  for (const rel of [
    'web/panels/tokens.mjs',
    'web/panels/shell-css.mjs',
    'web/panels/chat-css.mjs',
    'web/panels/composer-css.mjs',
    'web/panels/model-select-css.mjs',
    'web/panels/rightbar-css.mjs',
    'web/panels/settings-css.mjs',
    'web/panels/settings-shadow.mjs',
    'web/panels/juice-css.mjs',
  ]) {
    const content = readFileSync(path.join(ROOT, rel), 'utf8')
    assert.ok(content.includes(gate), `${rel} must gate on both theme-dark and theme-light`)
  }
  const webCss = readFileSync(path.join(ROOT, 'web/style.css'), 'utf8')
  assert.match(webCss, /html\[data-cx-ext-hdd-fairy-theme-dark\]\s*\{[\s\S]*?color-scheme:\s*dark(?:\s*!important)?;/)
  assert.match(webCss, /html\[data-cx-ext-hdd-fairy-theme-light\]\s*\{[\s\S]*?color-scheme:\s*light(?:\s*!important)?;/)
  assert.match(webCss, /html\[data-cx-ext-hdd-fairy-theme-light\]\s+body\[data-ds-dark-theme\]/)
  assert.match(webCss, /--ch-sidebar-text-primary:\s*#14171f;/)
  assert.match(webCss, /html\[data-cx-ext-hdd-fairy-theme-light\]\[data-hf-panel-chat="1"\]\[data-cx-ext-hdd-fairy-hero\][\s\S]*?::after\s*\{[\s\S]*?filter:\s*brightness\(0\)/)
})

test('workorder 019 sidebar, turn rail, selection submit kbd, watch notice, and zero-emoji invariants hold', () => {
  const shellCss = readFileSync(path.join(ROOT, 'web/panels/shell-css.mjs'), 'utf8')
  assert.doesNotMatch(shellCss, /(?<!button)\[class\*="_newSession"\]/, 'Must never match inner _newSession* spans')
  assert.match(shellCss, /button\[class\*="_newSession"\]/)
  assert.match(shellCss, /\[data-sidebar-pinned\]\s+\[data-row-key\^="section:"\]\s*\{[^}]*background:\s*transparent/)
  assert.match(shellCss, /::-webkit-scrollbar-thumb/)

  const chatCss = readFileSync(path.join(ROOT, 'web/panels/chat-css.mjs'), 'utf8')
  assert.match(chatCss, /\[data-turn-navigation\]\s+button\[aria-current="true"\]\s*\{\s*background:\s*transparent\s*!important;\s*\}/)
  assert.match(chatCss, /\[data-turn-navigation\]\s+button\[aria-current="true"\]::before/)
  assert.match(chatCss, /\[data-turn-navigation\]\s+button\[data-neighbor-distance="0"\]::before/)
  assert.match(chatCss, /\[data-selection-actions\]\s+button\[class\*="_submit"\]\s+kbd\s*\{\s*display:\s*none\s*!important;\s*\}/)
  assert.match(chatCss, /\[data-thread-watch-notice\]/)
  assert.match(chatCss, /\[data-outcome="completed"\]/)
  assert.match(chatCss, /\[class\*="_open"\]\s+a/)

  for (const rel of [
    'manifest.json',
    'shared/fairy-core.mjs',
    'web/index.mjs',
    'page/index.mjs',
    'web/panels/shell-css.mjs',
    'web/panels/chat-css.mjs',
    'web/panels/chat-avatar-fx.mjs',
    'web/panels/composer-css.mjs',
    'web/panels/model-select-css.mjs',
    'web/panels/model-select-fx.mjs',
    'web/panels/juice-css.mjs',
    'web/panels/juice-fx.mjs',
  ]) {
    assert.doesNotMatch(
      readFileSync(path.join(ROOT, rel), 'utf8'),
      /\p{Extended_Pictographic}|\uFE0F|\u20E3/u,
      `${rel} must remain zero-emoji`,
    )
  }
})

test('workorder 020 periodic table matcher, effort tier resolver, and model-select CSS presets hold', async () => {
  const { matchElementSpec, resolveEffortTier, mountModelSelectEnhancer } = await import('../web/panels/model-select-fx.mjs')
  const { MODEL_SELECT_PANEL_CSS } = await import('../web/panels/model-select-css.mjs')

  assert.equal(typeof mountModelSelectEnhancer, 'function')

  // Matches the 4 Antigravity element cores in periodic order
  assert.equal(matchElementSpec('Gemini 4 Hydrogen')?.sym, 'H')
  assert.equal(matchElementSpec('Gemini 4 Hydrogen')?.z, '01')
  assert.equal(matchElementSpec('Gemini 4 Carbon')?.sym, 'C')
  assert.equal(matchElementSpec('Gemini 4 Carbon')?.z, '06')
  assert.equal(matchElementSpec('Gemini 4 Neon')?.sym, 'Ne')
  assert.equal(matchElementSpec('Gemini 4 Neon')?.z, '10')
  assert.equal(matchElementSpec('Gemini 4 Argon')?.sym, 'Ar')
  assert.equal(matchElementSpec('Gemini 4 Argon')?.z, '18')

  // Strictly excludes Orchestrator variants and non-element models
  assert.equal(matchElementSpec('Orchestrator (Neon)'), null)
  assert.equal(matchElementSpec('Orchestrator (Carbon)'), null)
  assert.equal(matchElementSpec('Orchestrator (Argon)'), null)
  assert.equal(matchElementSpec('Gemini 3.8 Flash'), null)
  assert.equal(matchElementSpec('Claude Opus 5.5'), null)
  assert.equal(matchElementSpec('Claude Sonnet 5.5'), null)
  assert.equal(matchElementSpec('GPT-OSS 120B'), null)

  // Effort tier four-stage mapping (including xhigh / max / ultra -> overdrive)
  assert.equal(resolveEffortTier('none'), 'low')
  assert.equal(resolveEffortTier('minimal'), 'low')
  assert.equal(resolveEffortTier('Low'), 'low')
  assert.equal(resolveEffortTier('低'), 'low')
  assert.equal(resolveEffortTier('Medium'), 'medium')
  assert.equal(resolveEffortTier('中'), 'medium')
  assert.equal(resolveEffortTier('High'), 'high')
  assert.equal(resolveEffortTier('高'), 'high')
  assert.equal(resolveEffortTier('xhigh'), 'overdrive')
  assert.equal(resolveEffortTier('XHigh'), 'overdrive')
  assert.equal(resolveEffortTier('max'), 'overdrive')
  assert.equal(resolveEffortTier('ultra'), 'overdrive')
  assert.equal(resolveEffortTier('超高'), 'overdrive')
  assert.equal(resolveEffortTier('High', 2, 3), 'overdrive')
  assert.equal(resolveEffortTier('High', 2, 4), 'high')

  // Model-select CSS gating, three presets, overdrive keyframes, reduced motion & mobile rules
  assert.ok(MODEL_SELECT_PANEL_CSS.includes('html:is([data-cx-ext-hdd-fairy-theme-dark],[data-cx-ext-hdd-fairy-theme-light])[data-hf-panel-composer="1"]'))
  assert.ok(MODEL_SELECT_PANEL_CSS.includes('[data-hf-preset-composer="street"]'))
  assert.ok(MODEL_SELECT_PANEL_CSS.includes('[data-hf-preset-composer="archive"]'))
  assert.match(MODEL_SELECT_PANEL_CSS, /@keyframes\s+hf-overdrive-flow/)
  assert.match(MODEL_SELECT_PANEL_CSS, /@keyframes\s+hf-overdrive-sheen/)
  assert.match(MODEL_SELECT_PANEL_CSS, /@keyframes\s+hf-particle-jet/)
  assert.match(MODEL_SELECT_PANEL_CSS, /@media\s*\(prefers-reduced-motion:\s*reduce\)/)
  assert.match(MODEL_SELECT_PANEL_CSS, /width:\s*min\(340px,\s*calc\(100vw - 24px\)\)/)
  assert.match(MODEL_SELECT_PANEL_CSS, /font-size:\s*16px/)
})

test('workorder 021 chat CSS covers Telegram grouping, live eye overlay, v0.28.1 native virtualization compatibility, and redesigned compaction/command bars', async () => {
  const { CHAT_PANEL_CSS } = await import('../web/panels/chat-css.mjs')

  // Telegram grouping & live eye overlay
  assert.match(CHAT_PANEL_CSS, /\[data-hf-avatar-grouped="1"\]::before/)
  assert.match(CHAT_PANEL_CSS, /\[data-hf-avatar-grouped="1"\]::after/)
  assert.match(CHAT_PANEL_CSS, /\[data-hf-avatar-grouped="1"\]\s*>\s*\[class\*="_body"\]::before/)
  assert.match(CHAT_PANEL_CSS, /\[data-hf-live-eye="1"\]::before/)
  assert.match(CHAT_PANEL_CSS, /\.hf-chat-eye-mount\s*\{[^}]*position:\s*absolute;[^}]*left:\s*0;[^}]*top:\s*0;[^}]*width:\s*34px;[^}]*height:\s*34px;/)

  // v0.28.1 native transcript virtualization owns offscreen pruning: must not apply content-visibility: auto
  assert.doesNotMatch(CHAT_PANEL_CSS, /content-visibility:\s*auto/)
  assert.doesNotMatch(CHAT_PANEL_CSS, /contain-intrinsic-size:\s*auto 160px/)

  // Compaction & command bar redesign: no cyan-green crescent, crisp left pillar & padding
  assert.doesNotMatch(CHAT_PANEL_CSS, /div\[data-command\]\[data-state="ok"\]\s*\[data-disclosure-row\]\s*\{[^}]*inset 3px 0 #3ef0b0/)
  assert.match(CHAT_PANEL_CSS, /padding:\s*7px 12px 7px 14px;/)
  assert.match(CHAT_PANEL_CSS, /border-left:\s*3\.5px solid var\(--hf-chat-accent\);/)
  assert.match(CHAT_PANEL_CSS, /border-radius:\s*10px 3px 10px 10px;/)
  assert.match(CHAT_PANEL_CSS, /div\[data-tool="compact_context"\]\[data-state\]/)
  assert.match(CHAT_PANEL_CSS, /border-left-color:\s*var\(--hf-chat-danger\);/)
  assert.match(CHAT_PANEL_CSS, /\[data-hf-preset-chat="street"\][\s\S]*?div\[class\*="_compactionRow"\]\s+button\[class\*="_compactionButton"\]/)
  assert.match(CHAT_PANEL_CSS, /\[data-hf-preset-chat="archive"\][\s\S]*?div\[class\*="_compactionRow"\]\s+button\[class\*="_compactionButton"\]/)

  // Page control console includes enableChatAnimatedAvatar mechanical switch with zero-emoji SVG icon
  const pageSrc = readFileSync(path.join(ROOT, 'page/index.mjs'), 'utf8')
  assert.match(pageSrc, /enableChatAnimatedAvatar/)
  assert.match(pageSrc, /对话气泡动态 Fairy 眼徽/)
  assert.match(pageSrc, /Animated Chat Fairy Avatar/)
})

test('workorder 021 chat-avatar-fx groups consecutive assistant messages, mounts viewport-only unique live eyes, and cleans up completely', async () => {
  const { computeChatAvatarGroups, mountChatAvatarFx } = await import('../web/panels/chat-avatar-fx.mjs')

  // Minimal DOM node supporting matches/closest/querySelectorAll for unit testing
  class TestEl {
    constructor(tag, attrs = {}, className = '') {
      this.tagName = tag
      this.attributes = new Map(Object.entries(attrs).map(([k, v]) => [k, String(v)]))
      this.className = className
      this.dataset = {}
      this.children = []
      this.parentNode = null
      this.isConnected = true
      this.innerHTML = ''
      this.textContent = ''
    }
    setAttribute(k, v) { this.attributes.set(k, String(v)) }
    getAttribute(k) { return this.attributes.get(k) ?? null }
    hasAttribute(k) { return this.attributes.has(k) }
    removeAttribute(k) { this.attributes.delete(k) }
    append(...nodes) {
      for (const n of nodes) {
        n.parentNode = this
        n.isConnected = true
        this.children.push(n)
      }
    }
    remove() {
      if (this.parentNode) {
        this.parentNode.children = this.parentNode.children.filter((c) => c !== this)
        this.parentNode = null
      }
      this.isConnected = false
    }
    matches(sel) {
      if (sel.includes('[data-chat-flow-kind="user"]') && (this.getAttribute('data-chat-flow-kind') === 'user' || this.getAttribute('data-chat-flow-kind') === 'steering')) return true
      if (sel === '[hidden]') return this.hasAttribute('hidden')
      if (sel === '[data-conversation-scroll]') return this.hasAttribute('data-conversation-scroll')
      return false
    }
    closest(sel) {
      let cur = this
      while (cur) {
        if (cur.matches(sel)) return cur
        cur = cur.parentNode
      }
      return null
    }
    querySelector(sel) {
      if (sel.includes('_body')) return this.children.find((c) => c.className.includes('_body')) ?? null
      return null
    }
    querySelectorAll(sel) {
      const out = []
      const walk = (node) => {
        for (const ch of node.children) {
          if (sel.includes('[data-chat-flow]:not') && ch.hasAttribute('data-chat-flow') && !ch.hasAttribute('data-step-process-content')) out.push(ch)
          else if (sel.includes('[data-chat-flow-kind="user"]')) {
            if (ch.getAttribute('data-chat-flow-kind') === 'user' || ch.getAttribute('data-chat-flow-kind') === 'steering' || (ch.className.includes('_root') && ch.parentNode?.hasAttribute('data-selection-answer'))) {
              out.push(ch)
            }
          } else if (sel.includes('hf-chat-eye-mount') && ch.className.includes('hf-chat-eye-mount')) {
            out.push(ch)
          } else if (sel.includes('data-hf-live-eye') && ch.hasAttribute('data-hf-live-eye')) {
            out.push(ch)
          } else if (sel.includes('data-hf-avatar-tail') && (ch.hasAttribute('data-hf-avatar-tail') || ch.hasAttribute('data-hf-avatar-grouped'))) {
            out.push(ch)
          }
          walk(ch)
        }
      }
      walk(this)
      return out
    }
  }

  const makeAssistantBubble = (text, { streaming = false, hidden = false } = {}) => {
    const flowItem = new TestEl('div', { 'data-chat-flow-kind': 'assistant-step', ...(hidden ? { hidden: '' } : {}) })
    const answer = new TestEl('div', { 'data-selection-answer': 'k' })
    const root = new TestEl('div', streaming ? { 'data-streaming': '' } : {}, '_root_abc')
    const body = new TestEl('div', {}, '_body_abc')
    body.textContent = text
    root.append(body)
    answer.append(root)
    flowItem.append(answer)
    return { flowItem, root }
  }

  const scroller = new TestEl('div', { 'data-conversation-scroll': '' })
  const flow = new TestEl('div', { 'data-chat-flow': '' })
  scroller.append(flow)

  // Group 1: two assistant bubbles separated by tool & compaction (same agent turn!)
  const a1 = makeAssistantBubble('First thought summary')
  const tool = new TestEl('div', { 'data-chat-flow-kind': 'tool-call' })
  const compact = new TestEl('div', { 'data-chat-flow-kind': 'command' })
  const a2 = makeAssistantBubble('Second final answer')
  // User boundary splits into Group 2
  const u1 = new TestEl('div', { 'data-chat-flow-kind': 'user' })
  const a3 = makeAssistantBubble('Reply after user')
  flow.append(a1.flowItem, tool, compact, a2.flowItem, u1, a3.flowItem)

  const groups = computeChatAvatarGroups(flow)
  assert.equal(groups.grouped.has(a1.root), true)
  assert.equal(groups.tails.has(a2.root), true)
  assert.equal(groups.tails.has(a3.root), true)
  assert.equal(groups.tails.size, 2)

  // Test mountChatAvatarFx with controlled IntersectionObserver
  const ioInstances = []
  const fakeDoc = {
    body: scroller,
    createElement: (tag) => new TestEl(tag),
    querySelectorAll: (sel) => scroller.querySelectorAll(sel),
  }
  const fakeWin = { matchMedia: () => ({ matches: false, addEventListener() {} }) }
  const globals = {
    document: fakeDoc,
    window: fakeWin,
    IntersectionObserver: class {
      constructor(cb, opts) {
        this.cb = cb
        this.opts = opts
        this.targets = new Set()
        this.disconnected = false
        ioInstances.push(this)
      }
      observe(el) { this.targets.add(el) }
      unobserve(el) { this.targets.delete(el) }
      disconnect() { this.targets.clear(); this.disconnected = true }
      emit(el, isIntersecting) { this.cb([{ target: el, isIntersecting }]) }
    },
    MutationObserver: class {
      observe() {}
      disconnect() {}
    },
  }
  const saved = Object.fromEntries(Object.keys(globals).map((k) => [k, Object.getOwnPropertyDescriptor(globalThis, k)]))
  for (const [k, v] of Object.entries(globals)) Object.defineProperty(globalThis, k, { value: v, configurable: true })

  let currentSettings = normalizeSettings({})
  const controller = new AbortController()
  let fx
  try {
    fx = mountChatAvatarFx({ signal: controller.signal }, () => currentSettings)
    fx.reconcile()

    // Grouping marks applied accurately
    assert.equal(a1.root.getAttribute('data-hf-avatar-grouped'), '1')
    assert.equal(a1.root.getAttribute('data-hf-avatar-tail'), null)
    assert.equal(a2.root.getAttribute('data-hf-avatar-tail'), '1')
    assert.equal(a3.root.getAttribute('data-hf-avatar-tail'), '1')
    assert.equal(fx.getActiveEyeCount(), 0, 'Offscreen tails must mount 0 live eyes')

    // IO observes only tails with 120px rootMargin
    assert.equal(ioInstances.length, 1)
    assert.equal(ioInstances[0].opts.rootMargin, '120px 0px')
    assert.equal(ioInstances[0].targets.has(a1.root), false)
    assert.equal(ioInstances[0].targets.has(a2.root), true)
    assert.equal(ioInstances[0].targets.has(a3.root), true)

    // Both tails enter viewport -> unique SVG defs IDs, no glitch slices
    ioInstances[0].emit(a2.root, true)
    ioInstances[0].emit(a3.root, true)
    assert.equal(fx.getActiveEyeCount(), 2)
    assert.equal(a2.root.getAttribute('data-hf-live-eye'), '1')
    assert.equal(a3.root.getAttribute('data-hf-live-eye'), '1')
    const eyeMount2 = a2.root.children.find((c) => c.className === 'hf-chat-eye-mount')
    const eyeMount3 = a3.root.children.find((c) => c.className === 'hf-chat-eye-mount')
    assert.equal(eyeMount2.getAttribute('data-cx-ext-owned'), 'hdd-fairy')
    assert.equal(eyeMount3.getAttribute('data-cx-ext-owned'), 'hdd-fairy')
    assert.notEqual(eyeMount2.dataset.eyeId, eyeMount3.dataset.eyeId)
    assert.doesNotMatch(eyeMount2.children[0].innerHTML, /hf-glitch/)
    assert.match(eyeMount2.children[0].innerHTML, new RegExp(`id="hf-outer-gradient-${eyeMount2.dataset.eyeId}"`))
    assert.match(eyeMount3.children[0].innerHTML, new RegExp(`id="hf-outer-gradient-${eyeMount3.dataset.eyeId}"`))

    // a2 leaves viewport -> immediately unmounted
    ioInstances[0].emit(a2.root, false)
    assert.equal(fx.getActiveEyeCount(), 1)
    assert.equal(a2.root.getAttribute('data-hf-live-eye'), null)

    // New streaming bubble a4 appends after a3 -> tail hands over from a3 to a4 immediately
    const a4 = makeAssistantBubble('Streaming follow-up', { streaming: true })
    flow.append(a4.flowItem)
    fx.reconcile()
    assert.equal(a3.root.getAttribute('data-hf-avatar-grouped'), '1')
    assert.equal(a3.root.getAttribute('data-hf-avatar-tail'), null)
    assert.equal(a3.root.getAttribute('data-hf-live-eye'), null)
    assert.equal(a4.root.getAttribute('data-hf-avatar-tail'), '1')
    assert.equal(fx.getActiveEyeCount(), 0)
    ioInstances[0].emit(a4.root, true)
    assert.equal(fx.getActiveEyeCount(), 1)
    assert.equal(a4.root.children.find((c) => c.className === 'hf-chat-eye-mount')?.children[0]?.dataset?.mood, 'working')

    // Toggling enableChatAnimatedAvatar off unmounts live eyes while keeping Telegram grouping
    currentSettings = normalizeSettings({ enableChatAnimatedAvatar: false })
    fx.reconcile()
    assert.equal(fx.getActiveEyeCount(), 0)
    assert.equal(a4.root.getAttribute('data-hf-live-eye'), null)
    assert.equal(a4.root.getAttribute('data-hf-avatar-tail'), '1')
    assert.equal(a3.root.getAttribute('data-hf-avatar-grouped'), '1')

    // Dispose cleans up 100% of markers and owned nodes
    fx.dispose()
    assert.equal(a1.root.getAttribute('data-hf-avatar-grouped'), null)
    assert.equal(a2.root.getAttribute('data-hf-avatar-tail'), null)
    assert.equal(a3.root.getAttribute('data-hf-avatar-grouped'), null)
    assert.equal(a4.root.getAttribute('data-hf-avatar-tail'), null)
    assert.equal(scroller.querySelectorAll('.hf-chat-eye-mount').length, 0)
  } finally {
    controller.abort()
    fx?.dispose()
    for (const [k, desc] of Object.entries(saved)) {
      if (desc) Object.defineProperty(globalThis, k, desc)
      else delete globalThis[k]
    }
  }
})

test('workorder 022 v0.28.1 CSS covers code block fold bar, HarnessSelect menu, mobile flex shrink, watching notice/badge, and remote topology/pairing', async () => {
  const { CHAT_PANEL_CSS } = await import('../web/panels/chat-css.mjs')
  const { COMPOSER_PANEL_CSS } = await import('../web/panels/composer-css.mjs')
  const { SHELL_PANEL_CSS } = await import('../web/panels/shell-css.mjs')
  const { SETTINGS_PANEL_CSS } = await import('../web/panels/settings-css.mjs')

  // 1 & 3: No content-visibility: auto + obsidian code block fold bar
  assert.doesNotMatch(CHAT_PANEL_CSS, /content-visibility:\s*auto/)
  assert.match(CHAT_PANEL_CSS, /\[class\*="_foldBar"\]/)
  assert.match(CHAT_PANEL_CSS, /\[class\*="_foldFade"\]::before/)
  assert.match(CHAT_PANEL_CSS, /\[class\*="_foldButton"\]/)
  assert.match(CHAT_PANEL_CSS, /\[class\*="_foldIcon"\]/)
  assert.match(CHAT_PANEL_CSS, /border-top:\s*1px solid #2b313e;/)
  assert.match(CHAT_PANEL_CSS, /color:\s*#b8c2d0;/)
  assert.match(CHAT_PANEL_CSS, /background:\s*#1c202a;\s*color:\s*var\(--hf-chat-accent\);/)

  // 4: Unified HarnessSelect portal menu & phone toolbar flex shrink
  assert.match(COMPOSER_PANEL_CSS, /\[role="menu"\]\[class\*="_menu"\]:has\(\[class\*="_rowButton"\]/)
  assert.match(COMPOSER_PANEL_CSS, /> \[class\*="_material"\]\s*\{\s*display:none !important;\s*\}/)
  assert.match(COMPOSER_PANEL_CSS, /\[class\*="_rowButton"\]\[data-current\]/)
  assert.match(COMPOSER_PANEL_CSS, /\[class\*="_harnessName"\]/)
  assert.match(COMPOSER_PANEL_CSS, /\[class\*="_actionSlot"\]/)
  assert.match(COMPOSER_PANEL_CSS, /\[class\*="_handoffIcon"\]/)
  assert.match(COMPOSER_PANEL_CSS, /\[class\*="_rowActionButton"\]/)
  assert.match(COMPOSER_PANEL_CSS, /\[class\*="_installButton"\]/)
  assert.match(COMPOSER_PANEL_CSS, /\[class\*="_errorButton"\]/)
  assert.match(COMPOSER_PANEL_CSS, /\[class\*="_moreToggle"\]/)
  assert.match(COMPOSER_PANEL_CSS, /\[class\*="_sectionLabel"\]/)
  assert.match(COMPOSER_PANEL_CSS, /\[class\*="_separator"\]/)
  assert.match(COMPOSER_PANEL_CSS, /\[data-phone-toolbar\] :is\(\[class\*="_standardControls"\], \[class\*="_controls"\]\)\s*\{[^}]*flex:0 1 auto;\s*min-width:0;/)
  assert.doesNotMatch(COMPOSER_PANEL_CSS, /\[data-phone-toolbar\] :is\(\[class\*="_icon"\], \[class\*="_toggle"\]\)/)

  // 5: Conversation header SessionWatchingNotice (no margin-top override) & sidebar _watchingBadge
  assert.match(CHAT_PANEL_CSS, /\[data-session-watching-notice\]/)
  assert.match(CHAT_PANEL_CSS, /\[data-session-watching-badge\]/)
  assert.doesNotMatch(CHAT_PANEL_CSS, /\[data-session-watching-notice\]\s*\{[^}]*margin(?:-top)?:/s)
  assert.match(SHELL_PANEL_CSS, /\[class\*="_watchingBadge"\]/)
  assert.match(SHELL_PANEL_CSS, /\[data-row-key\]\[aria-selected="true"\] \[class\*="_watchingBadge"\]/)

  // 6: Remote peers topology, pairing sections, badges, color menu, syncMeshModal
  assert.match(SETTINGS_PANEL_CSS, /\[class\*="_topologyCard"\]/)
  assert.match(SETTINGS_PANEL_CSS, /\[class\*="_topologyStage"\]/)
  assert.match(SETTINGS_PANEL_CSS, /\[class\*="_topologyLegend"\]/)
  assert.match(SETTINGS_PANEL_CSS, /\[class\*="_topologyResetButton"\]/)
  assert.match(SETTINGS_PANEL_CSS, /\[class\*="_topologyPillNode"\]/)
  assert.match(SETTINGS_PANEL_CSS, /\[class\*="_pairingSection"\]/)
  assert.match(SETTINGS_PANEL_CSS, /\[class\*="_pairedBadge"\]/)
  assert.match(SETTINGS_PANEL_CSS, /\[class\*="_menuColorSection"\]/)
  assert.match(SETTINGS_PANEL_CSS, /\[class\*="_syncMeshModal"\]/)
})

test('workorder 022 chat-avatar-fx keeps grouped state when tail is virtualized, skips data-chat-empty seats, and pauses blink while window hidden', async () => {
  const { computeChatAvatarGroups, createLiteChatFairyEye } = await import('../web/panels/chat-avatar-fx.mjs')

  class MockNode {
    constructor(tag, attrs = {}, className = '') {
      this.tagName = tag
      this.attributes = new Map(Object.entries(attrs).map(([k, v]) => [k, String(v)]))
      this.className = className
      this.dataset = {}
      this.children = []
      this.parentNode = null
      this.isConnected = true
      this.innerHTML = ''
      this.textContent = ''
    }
    setAttribute(k, v) { this.attributes.set(k, String(v)) }
    getAttribute(k) { return this.attributes.get(k) ?? null }
    hasAttribute(k) { return this.attributes.has(k) }
    removeAttribute(k) { this.attributes.delete(k) }
    append(...nodes) {
      for (const n of nodes) {
        n.parentNode = this
        n.isConnected = true
        this.children.push(n)
      }
    }
    remove() {
      if (this.parentNode) {
        this.parentNode.children = this.parentNode.children.filter((c) => c !== this)
        this.parentNode = null
      }
      this.isConnected = false
    }
    matches(sel) {
      if (sel.includes('[data-chat-flow-kind="user"]') && (this.getAttribute('data-chat-flow-kind') === 'user' || this.getAttribute('data-chat-flow-kind') === 'steering')) return true
      if (sel.includes('[data-chat-virtualized]')) {
        const kind = this.getAttribute('data-chat-flow-kind') ?? ''
        const part = this.getAttribute('data-chat-group-part') ?? ''
        return kind.startsWith('assistant') && part !== 'reasoning' && this.hasAttribute('data-chat-virtualized')
      }
      if (sel === '[hidden]') return this.hasAttribute('hidden')
      if (sel === '[data-chat-empty]') return this.hasAttribute('data-chat-empty')
      return false
    }
    closest(sel) {
      let cur = this
      while (cur) {
        if (cur.matches(sel)) return cur
        cur = cur.parentNode
      }
      return null
    }
    querySelector(sel) {
      if (sel.includes('_body')) return this.children.find((c) => c.className.includes('_body')) ?? null
      return null
    }
    querySelectorAll() {
      const out = []
      const walk = (node) => {
        for (const ch of node.children) {
          const kind = ch.getAttribute('data-chat-flow-kind') ?? ''
          const part = ch.getAttribute('data-chat-group-part') ?? ''
          if (kind === 'user' || kind === 'steering') {
            out.push(ch)
          } else if (kind.startsWith('assistant') && part !== 'reasoning' && ch.hasAttribute('data-chat-virtualized')) {
            out.push(ch)
          } else if (ch.className.includes('_root') && (ch.parentNode?.hasAttribute('data-selection-answer') || ch.parentNode?.getAttribute('data-slot') === 'conversation.chat.node')) {
            out.push(ch)
          }
          walk(ch)
        }
      }
      walk(this)
      return out
    }
  }

  const makeMountedAssistant = (text, { emptySeat = false } = {}) => {
    const flowItem = new MockNode('div', {
      'data-chat-flow-kind': 'assistant-step',
      ...(emptySeat ? { 'data-chat-empty': '' } : {}),
    })
    const slot = new MockNode('div', { 'data-slot': 'conversation.chat.node' })
    const root = new MockNode('div', {}, '_root_v28')
    const body = new MockNode('div', {}, '_body_v28')
    body.textContent = text
    root.append(body)
    slot.append(root)
    flowItem.append(slot)
    return { flowItem, root }
  }

  const flow = new MockNode('div', { 'data-chat-flow': '' })

  // Group 1: mounted a1 + mounted a2 + virtualized tail vTail -> a1 and a2 MUST stay grouped; vTail gets no marks
  const a1 = makeMountedAssistant('Mounted step 1')
  const a2 = makeMountedAssistant('Mounted step 2')
  const vTail = new MockNode('div', { 'data-chat-flow-kind': 'assistant-step', 'data-chat-virtualized': '' })

  // User boundary splits into Group 2
  const userBoundary = new MockNode('div', { 'data-chat-flow-kind': 'user', 'data-chat-virtualized': '' })

  // Group 2: mounted b1 followed by an empty seat bEmpty -> bEmpty must NOT steal tail from b1
  const b1 = makeMountedAssistant('Visible reply before empty seat')
  const bEmpty = makeMountedAssistant('', { emptySeat: true })

  flow.append(a1.flowItem, a2.flowItem, vTail, userBoundary, b1.flowItem, bEmpty.flowItem)

  const result = computeChatAvatarGroups(flow)
  assert.equal(result.grouped.has(a1.root), true, 'a1 must remain grouped')
  assert.equal(result.grouped.has(a2.root), true, 'a2 must remain grouped when newer sibling is virtualized')
  assert.equal(result.tails.has(a2.root), false, 'a2 must not flash as tail when newer sibling is virtualized')
  assert.equal(result.tails.has(vTail), false, 'virtualized placeholder must not enter tails')
  assert.equal(result.grouped.has(vTail), false, 'virtualized placeholder must not enter grouped')

  assert.equal(result.tails.has(b1.root), true, 'b1 must remain group tail when followed by data-chat-empty seat')
  assert.equal(result.grouped.has(b1.root), false, 'b1 must not be grouped by data-chat-empty seat')
  assert.equal(result.tails.has(bEmpty.root), false, 'data-chat-empty seat must not become tail')
  assert.equal(result.hidden.has(bEmpty.root), true, 'data-chat-empty seat must be classified as hidden')

  // Background window power-saving: createLiteChatFairyEye skips blink mutations while hidden
  const scheduled = []
  const origSetTimeout = globalThis.setTimeout
  const origClearTimeout = globalThis.clearTimeout
  let nextTimerId = 1
  globalThis.setTimeout = (fn) => {
    const id = nextTimerId++
    scheduled.push({ id, fn })
    return id
  }
  globalThis.clearTimeout = () => {}

  try {
    const htmlEl = new MockNode('html', { 'data-codexhost-window-hidden': '' })
    const hiddenDoc = {
      hidden: false,
      documentElement: htmlEl,
      createElement: (tag) => new MockNode(tag),
    }
    const ctrl = createLiteChatFairyEye(hiddenDoc, { idSuffix: 'bg-test' })
    assert.equal(scheduled.length, 1)
    scheduled.shift().fn()
    assert.equal(ctrl.eye.dataset.blink, undefined, 'blink must be skipped while data-codexhost-window-hidden is set')
    assert.equal(ctrl.eye.dataset.lid, undefined, 'lid must not mutate while window is hidden')

    // Removing hidden marker allows normal blinking on next tick
    htmlEl.removeAttribute('data-codexhost-window-hidden')
    assert.ok(scheduled.length >= 1)
    scheduled.shift().fn()
    assert.equal(ctrl.eye.dataset.blink, '1', 'blink resumes once window is visible again')
    ctrl.dispose()
  } finally {
    globalThis.setTimeout = origSetTimeout
    globalThis.clearTimeout = origClearTimeout
  }
})
