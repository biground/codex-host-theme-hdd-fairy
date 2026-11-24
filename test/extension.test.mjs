import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildZip, collectExtensionFiles } from '../scripts/pack-zip.mjs'
import {
  DEFAULT_SETTINGS,
  clampDockPos,
  greetLine,
  hddWelcomeLine,
  normalizeSettings,
} from '../shared/fairy-core.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ALLOWED_PACKAGE_SUFFIX = /\.(?:js|mjs|cjs|css|json|png|jpe?g|webp|gif|woff2|md|txt|svg|ts|tsx|ya?ml)$/iu
const ALLOWED_PACKAGE_BASENAME = /^(?:licen[cs]e|notice|\.gitignore|\.gitattributes)$/iu

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
  const skipDirs = new Set(['.git', '.work', 'node_modules'])
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
  assert.match(webSource, /heroMount\.container\.contains\(record\.target\)/)
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
