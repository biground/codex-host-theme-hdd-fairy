import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve, sep } from 'node:path'
import { chromium, type Locator } from '../../codex-host/node_modules/playwright/index.mjs'
import { startServer } from '../../codex-host/packages/web-server/test/support/server.ts'
import { FakeChChannel, startFakeChChannel } from '../../codex-host/packages/web-server/test/support/ch-channel.ts'
import { seedWebExtension } from '../../codex-host/packages/web-server/test/support/web-extension.ts'

const plugin = resolve(import.meta.dirname, '..')
const version = JSON.parse(readFileSync(join(plugin, 'package.json'), 'utf8')).version
const evidence = resolve(plugin, '../output/playwright/fairy/sidebar-position', version)
const title = 'Highlight position check with a long title that reaches the action buttons'
const reply = 'The restored white Agent bubble stays readable.'
const richReply = `${reply}\n\n**Bold text**, \`inline code\` and a [reference](https://example.test/).\n\n> A readable quote.\n\n\`\`\`javascript\nconst ready = true;\n\`\`\`\n\n| Item | State |\n| --- | --- |\n| Bubble | Restored |`
const actions = (row: Locator) => row.locator('[class*="_rowActions"] button').evaluateAll(buttons => buttons
  .filter(button => getComputedStyle(button).display !== 'none' && button.getBoundingClientRect().width > 0)
  .map(button => ({
    label: button.getAttribute('aria-label'),
    right: button.closest('[data-row-key]')!.getBoundingClientRect().right - button.getBoundingClientRect().right,
  })))

test('Sidebar actions keep their position, fade titles, and preserve white Agent bubbles', { timeout: 60000 }, async t => {
  const root = mkdtempSync(join(tmpdir(), 'fairy-sidebar-'))
  assert.ok(resolve(root).startsWith(resolve(tmpdir()) + sep))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  mkdirSync(evidence, { recursive: true })
  seedWebExtension(join(root, 'web'), plugin)
  const host = new FakeChChannel()
  // Web 0.20 reads thread ancestry; the older checkout fixture models flat sessions.
  const request = host.request.bind(host)
  host.request = ((method, params) => method === 'codexhost/thread/tree/read'
    ? Promise.resolve({ parents: {} }) : request(method, params)) as typeof host.request
  host.add('sidebar-first', '/computer/fairy', 'First test session')
  const target = host.add('sidebar-target', '/computer/fairy', title)
  target.turns = [{ id: 'style-turn', status: 'completed', items: [
    { id: 'style-user', type: 'userMessage', content: [{ type: 'text', text: 'Check the message appearance.' }] },
    { id: 'style-agent', type: 'agentMessage', text: richReply },
  ] }]
  host.pinnedIds = ['sidebar-first', 'sidebar-target']
  const channel = await startFakeChChannel(host, join(root, 'client-hosts'), 'service')
  t.after(() => channel.close())
  if (process.env.FAIRY_TEST_WEB_BUNDLE) process.env.CODEXHOST_TEST_WEB_BUNDLE = process.env.FAIRY_TEST_WEB_BUNDLE
  const url = await startServer(t, resolve(plugin, '../codex-host/packages/web-server'), ['--import', 'tsx', 'src/main.ts'], [
    '--token', 'fairy-sidebar-isolated-token', '--data', join(root, 'web'), '--session-source', 'codexhost', '--ch-data', root,
    ...(process.env.FAIRY_TEST_WEB_BUNDLE ? ['--ch-host-runtime', join(dirname(dirname(process.env.FAIRY_TEST_WEB_BUNDLE)), 'host-runtime.mjs')] : []),
  ], { authenticated: true, environment: { PATH: process.env.PATH, USERPROFILE: root, LOCALAPPDATA: join(root, 'local') } })
  const browser = await chromium.launch()
  t.after(() => browser.close())
  const results = []
  for (const touch of [false, true]) {
    const kind = touch ? 'phone' : 'desktop'
    const page = await browser.newPage({ viewport: { width: touch ? 390 : 1440, height: 900 },
      isMobile: touch, hasTouch: touch, locale: 'en-US', colorScheme: 'dark' })
    page.setDefaultTimeout(10000)
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(url)
    await page.locator('html[data-fz3-theme="dark"]').waitFor()
    if (!touch) {
      await page.locator('.fz3-skip').click()
      await page.locator('.fz3-layer[data-phase="dock"]').waitFor()
    }
    const openSidebar = async () => {
      const button = page.getByRole('button', { name: 'Open sidebar', exact: true }).last()
      if (await button.isVisible()) await button.click()
      if (touch) await page.waitForFunction(() => {
        const drawer = document.querySelector('[data-phone-drawer][data-open]')
        return drawer && drawer.getBoundingClientRect().left >= 0
      })
      await page.waitForFunction(() => [...document.querySelectorAll('[role="tree"],[data-phone-drawer]')]
        .every(tree => tree.getAnimations({ subtree: true }).every(animation =>
          animation.effect?.getTiming().iterations === Infinity || !['running', 'pending'].includes(animation.playState))))
    }
    await openSidebar()
    const row = page.locator('[data-sidebar-pinned] [data-row-key="session:sidebar-target"]')
    await row.waitFor().catch(async error => {
      await page.screenshot({ path: join(evidence, `${kind}-navigation-failure.png`) })
      console.log(JSON.stringify({ kind, rows: await page.locator('[data-row-key]').allTextContents(),
        body: (await page.locator('body').innerText()).slice(0, 1800), requests: host.requests.map(request => request.method), errors }))
      throw error
    })
    const before = await actions(row)
    assert.ok(before.length > 0, `${kind} must expose a measurable action button`)
    await row.click()
    if (touch) {
      await page.locator('[data-phone-drawer][data-open]').waitFor({ state: 'hidden' })
      await openSidebar()
    }
    await page.locator('[data-sidebar-pinned] [data-row-key="session:sidebar-target"][aria-selected="true"]').waitFor()
    if (!touch) await row.hover()
    const after = await actions(row)
    const assistantBody = page.locator('[data-chat-flow-kind^="assistant"] [class*="_body"]').filter({ hasText: reply }).first()
    await assistantBody.waitFor({ state: 'attached' })
    const appearance = {
      sidebar: await row.evaluate(element => {
        const action = element.querySelector('[class*="_rowActions"]')!
        const fade = getComputedStyle(action, '::before')
        const buttons = [...action.querySelectorAll('button')].filter(button => button.getBoundingClientRect().width > 0)
        return { background: getComputedStyle(action).backgroundColor,
          fade: fade.backgroundImage.includes('linear-gradient') && parseFloat(fade.width) >= 10,
          black: buttons.every(button => getComputedStyle(button).color === 'rgb(0, 0, 0)'),
          bold: buttons.every(button => parseFloat(getComputedStyle(button.querySelector('svg')!).strokeWidth) >= 1.5) }
      }),
      bubble: await assistantBody.evaluate(element => ({ background: getComputedStyle(element).backgroundColor,
        color: getComputedStyle(element).color, scheme: getComputedStyle(element).colorScheme })),
    }
    const marker = await row.evaluate(element => {
      const style = getComputedStyle(element, '::after')
      return { content: style.content, image: style.backgroundImage }
    })
    await page.screenshot({ path: join(evidence, `${kind}-selected.png`) })
    console.log(JSON.stringify({ kind, before, after, marker }))
    assert.deepEqual(after, before, `${kind}: highlighting must keep every action button in its original position`)
    assert.deepEqual(marker, { content: 'none', image: 'none' }, `${kind}: selected sessions must not show the map-pin corner marker`)
    assert.deepEqual(appearance, { sidebar: { background: touch ? 'rgba(0, 0, 0, 0)' : 'rgb(212, 235, 66)', fade: !touch, black: true, bold: true },
      bubble: { background: 'rgb(244, 244, 242)', color: 'rgb(36, 38, 43)', scheme: 'light' } }, `${kind}: titles must fade before black, bold actions and Agent output must use the white bubble`)
    const menu = row.getByRole('button', { name: 'Session actions for ' + title, exact: true })
    await menu.click()
    await page.getByRole('menuitem', { name: 'Unpin session', exact: true }).waitFor()
    await page.keyboard.press('Escape')
    if (!touch) {
      await row.hover()
      await row.getByRole('button', { name: 'Unpin session', exact: true }).click()
      await row.waitFor({ state: 'detached' })
      assert.deepEqual(host.pinnedIds, ['sidebar-first'])
      host.pinnedIds.push('sidebar-target')
      host.changed('sidebar-target')
    }
    if (touch) {
      await page.keyboard.press('Escape')
      await page.locator('[data-phone-drawer][data-open]').waitFor({ state: 'hidden' })
    }
    assert.equal(await assistantBody.locator('p').first().evaluate(element => getComputedStyle(element).color), 'rgb(36, 38, 43)')
    assert.equal(await assistantBody.locator('pre').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(233, 234, 230)')
    assert.equal(await assistantBody.locator('table').count(), 1)
    assert.equal(await page.locator('[data-chat-flow-kind="user"] [class*="_bubble"]').first().evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(56, 83, 219)')
    if (!touch) {
      target.turns[0].items[1].text += '\n\nStreaming keeps the white bubble.'
      host.changed(target.id)
    }
    await assistantBody.getByText('Streaming keeps the white bubble.', { exact: true }).waitFor()
    assert.equal(await assistantBody.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(244, 244, 242)')
    await page.screenshot({ path: join(evidence, `${kind}-agent-bubble.png`) })
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    assert.deepEqual(errors, [])
    results.push({ kind, before, after, appearance, marker, pageErrors: errors.length })
    await page.close()
  }
  console.log(JSON.stringify({ version, evidence, results }))
})
