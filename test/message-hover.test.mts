import assert from 'node:assert/strict'
import { test } from 'node:test'
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve, sep } from 'node:path'
import { chromium } from '../../codex-host/node_modules/playwright/index.mjs'
import { startServer } from '../../codex-host/packages/web-server/test/support/server.ts'
import { FakeChChannel, startFakeChChannel } from '../../codex-host/packages/web-server/test/support/ch-channel.ts'
import { seedWebExtension } from '../../codex-host/packages/web-server/test/support/web-extension.ts'

const plugin = resolve(import.meta.dirname, '..')
const message = 'A user message whose copy button should stay under the pointer.'
const earlier = 'An earlier user message.'

test('User message copy stays still while its tooltip is open', { timeout: 60000 }, async t => {
  const root = mkdtempSync(join(tmpdir(), 'fairy-copy-hover-'))
  assert.ok(resolve(root).startsWith(resolve(tmpdir()) + sep))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  seedWebExtension(join(root, 'web'), plugin)
  if (process.env.FAIRY_TEST_TABS) {
    const tabsData = join(root, 'tabs')
    seedWebExtension(tabsData, resolve(process.env.FAIRY_TEST_TABS))
    const registry = join(root, 'web/ui-extensions/installed.json')
    const entries = JSON.parse(readFileSync(registry, 'utf8'))
    const tabs = JSON.parse(readFileSync(join(tabsData, 'ui-extensions/installed.json'), 'utf8'))
    cpSync(join(tabsData, 'ui-extensions/packages'), join(root, 'web/ui-extensions/packages'), { recursive: true })
    entries.extensions.push(...tabs.extensions)
    writeFileSync(registry, JSON.stringify(entries))
  }
  const host = new FakeChChannel()
  const request = host.request.bind(host)
  host.request = ((method, params) => method === 'codexhost/thread/tree/read'
    ? Promise.resolve({ parents: {} }) : request(method, params)) as typeof host.request
  const session = host.add('copy-hover', '/computer/fairy', 'Copy hover test')
  host.pinnedIds = [session.id]
  session.turns = [
    { id: 'old-turn', status: 'completed', items: [
      { id: 'old-user', type: 'userMessage', content: [{ type: 'text', text: earlier }] },
      { id: 'old-agent', type: 'agentMessage', text: 'A synthetic earlier reply.' },
    ] },
    { id: 'copy-turn', status: 'completed', items: [
      { id: 'copy-user', type: 'userMessage', content: [{ type: 'text', text: message }] },
      { id: 'copy-agent', type: 'agentMessage', text: 'A synthetic reply.' },
    ] },
  ]
  const channel = await startFakeChChannel(host, join(root, 'client-hosts'), 'service')
  t.after(() => channel.close())
  if (process.env.FAIRY_TEST_WEB_BUNDLE) process.env.CODEXHOST_TEST_WEB_BUNDLE = process.env.FAIRY_TEST_WEB_BUNDLE
  const url = await startServer(t, resolve(plugin, '../codex-host/packages/web-server'), ['--import', 'tsx', 'src/main.ts'], [
    '--token', 'fairy-copy-hover-isolated-token', '--data', join(root, 'web'), '--session-source', 'codexhost', '--ch-data', root,
    ...(process.env.FAIRY_TEST_WEB_BUNDLE ? ['--ch-host-runtime', join(dirname(dirname(process.env.FAIRY_TEST_WEB_BUNDLE)), 'host-runtime.mjs')] : []),
  ], { authenticated: true, environment: { PATH: process.env.PATH, USERPROFILE: root, LOCALAPPDATA: join(root, 'local') } })
  const browser = await chromium.launch()
  t.after(() => browser.close())
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US', colorScheme: 'dark' })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript('Object.defineProperty(navigator, "clipboard", { value: { writeText: async text => { window.__fairyCopiedText = text } } })')
  await page.goto(url)
  await page.locator('html[data-fz3-theme="dark"]').waitFor()
  await page.locator('.fz3-skip').click()
  await page.locator('.fz3-layer[data-phase="dock"]').waitFor()
  const openSidebar = page.getByRole('button', { name: 'Open sidebar', exact: true }).last()
  if (await openSidebar.isVisible()) await openSidebar.click()
  await page.locator('[data-row-key="session:copy-hover"]').first().click()
  for (const text of [earlier, message]) {
    const row = page.locator('[data-chat-flow-kind="user"]').filter({ hasText: text })
    const bubble = row.locator('[class*="_userStack"] > [class*="_bubble"]')
    await bubble.waitFor()
    assert.equal(await bubble.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(56, 83, 219)')
    await bubble.hover()
    const copy = row.getByRole('button', { name: 'Copy', exact: true })
    const before = await copy.boundingBox()
    assert.ok(before)
    await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2)
    const samples = await copy.evaluate(button => new Promise<Array<{ x: number; y: number; hovered: boolean; tooltip: string | null }>>(resolve => {
      const values: Array<{ x: number; y: number; hovered: boolean; tooltip: string | null }> = []
      const timer = setInterval(() => {
        const rect = button.getBoundingClientRect()
        const tooltip = button.parentElement?.querySelector('[role="tooltip"]')
        values.push({ x: rect.x, y: rect.y, hovered: button.matches(':hover'), tooltip: tooltip ? getComputedStyle(tooltip).position : null })
        if (values.length === 30) { clearInterval(timer); resolve(values) }
      }, 20)
    }))
    const xRange = Math.max(...samples.map(sample => sample.x)) - Math.min(...samples.map(sample => sample.x))
    const yRange = Math.max(...samples.map(sample => sample.y)) - Math.min(...samples.map(sample => sample.y))
    console.log(JSON.stringify({ message: text === earlier ? 'earlier' : 'latest', xRange, yRange,
      hoveredFrames: samples.filter(sample => sample.hovered).length, tooltipPositions: [...new Set(samples.map(sample => sample.tooltip))] }))
    assert.ok(xRange < 1 && yRange < 1, 'opening the tooltip must not move the copy button')
    assert.ok(samples.every(sample => sample.hovered && sample.tooltip === 'fixed'), 'the tooltip stays open without moving the pointer off the button')
    assert.equal(await row.locator('[role="tooltip"]').evaluate(element => getComputedStyle(element, '::after').content), 'none')
    await copy.click()
    assert.equal(await page.evaluate(() => window.__fairyCopiedText), text)
  }
  assert.deepEqual(errors, [])

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'en-US', colorScheme: 'dark' })
  const phoneErrors: string[] = []
  phone.on('pageerror', error => phoneErrors.push(error.message))
  await phone.addInitScript('Object.defineProperty(navigator, "clipboard", { value: { writeText: async text => { window.__fairyCopiedText = text } } })')
  await phone.goto(url)
  await phone.locator('html[data-fz3-theme="dark"]').waitFor()
  await phone.getByRole('button', { name: 'Open sidebar', exact: true }).last().click()
  await phone.locator('[data-phone-drawer][data-open]').waitFor()
  await phone.locator('[data-sidebar-pinned] [data-row-key="session:copy-hover"]').click()
  await phone.locator('[data-phone-drawer][data-open]').waitFor({ state: 'hidden' })
  const phoneRow = phone.locator('[data-chat-flow-kind="user"]').filter({ hasText: message })
  const phoneBubble = phoneRow.locator('[class*="_userStack"] > [class*="_bubble"]')
  assert.equal(await phoneBubble.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(56, 83, 219)')
  await phoneRow.getByRole('button', { name: 'Copy', exact: true }).tap()
  assert.equal(await phone.evaluate(() => window.__fairyCopiedText), message)
  assert.equal(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  assert.deepEqual(phoneErrors, [])
})
