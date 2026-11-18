import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { chromium } from '../../codex-host/node_modules/playwright/index.mjs'
import { startServer } from '../../codex-host/packages/web-server/test/support/server.ts'
import { FakeChChannel, startFakeChChannel } from '../../codex-host/packages/web-server/test/support/ch-channel.ts'
import { decodeHarnessPluginRoute } from '../../codex-host/packages/shared-contracts/src/index.ts'

const repository = resolve(import.meta.dirname, '../../codex-host')
const plugin = resolve(import.meta.dirname, '..')
const evidence = resolve(import.meta.dirname, '../../output/playwright/fairy')
const TOKEN = 'fairy-isolated-test-token'
const questionReplies = [
  { questionItemId: 'async-fixture-1', question: '下一步先优化哪个部分？', answer: '先优化引用样式。\n保留蓝底白字。' },
  { questionItemId: 'async-fixture-2', question: '这是一个较长的问题，用于确认引用默认收起、点击后能展开完整内容。'.repeat(8), answer: '<img src=x onerror="window.__quoteInjected=true">\n多行回答也应按原样显示。' },
]
const questionReplyText = '<send_user_message_question_reply>\n' + JSON.stringify(questionReplies) + '\n</send_user_message_question_reply>'
const malformedReply = '<send_user_message_question_reply>[{"questionItemId":"broken","question":"Invalid answer type","answer":42}]</send_user_message_question_reply>'
const richReply = [
  '### Fairy checking in',
  '',
  'The panel is ready. **Strong text**, `inline code` and a [reference link](https://example.test/docs).',
  '',
  '> A readable light reply inside a dark conversation.',
  '',
  '```javascript',
  '// Light syntax colors',
  'const status = "ready";',
  'console.log(status);',
  '```',
  '',
  '| Item | State | Owner | Notes |',
  '| --- | --- | --- | --- |',
  '| Panel | Ready | Fairy | Light content |',
].join('\n')

test('Fairy works without audio in CodexHost beta.5 and cleans up on disable', { timeout: 120000 }, async t => {
  const root = mkdtempSync(join(tmpdir(), 'fairy-codexhost-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  mkdirSync(evidence, { recursive: true })
  const host = new FakeChChannel()
  Object.assign(host.inspection.catalog.models[0], { fastModel: { id: 'native-fast' } })
  const idle = host.add('fairy-idle', '/computer/fairy', 'Fairy idle session')
  const busy = host.add('fairy-busy', '/computer/fairy', 'Fairy running session')
  const replies = host.add('fairy-replies', '/computer/fairy', 'Fairy quoted replies')
  const replyPreview = host.add('fairy-reply-preview', '/computer/fairy', 'Fairy reply preview')
  replyPreview.turns = [{ id: 'reply-preview-turn', status: 'completed', items: [
    { id: 'reply-preview-user', type: 'userMessage', content: [{ type: 'text', text: '<send_user_message_question_reply>\n' + JSON.stringify([questionReplies[0]]) + '\n</send_user_message_question_reply>' }] },
    { id: 'reply-preview-agent', type: 'agentMessage', text: '收到。原问题显示在引用条中，你的回答显示在下方。' },
  ] }]
  replies.turns = [{ id: 'reply-turn', status: 'completed', items: [
    { id: 'reply-normal', type: 'userMessage', content: [{ type: 'text', text: '普通用户消息仍然保留。' }] },
    { id: 'reply-structured', type: 'userMessage', content: [{ type: 'text', text: questionReplyText }] },
    { id: 'reply-invalid', type: 'userMessage', content: [{ type: 'text', text: malformedReply }] },
    { id: 'reply-json', type: 'userMessage', content: [{ type: 'text', text: JSON.stringify(questionReplies) }] },
    { id: 'reply-assistant', type: 'agentMessage', text: '引用原问题，下面显示你的回答。' },
  ] }]
  host.add('fairy-essay', '/computer/essay', 'Essay notes')
  host.pinnedIds.push(idle.id)
  busy.status = { type: 'active' }
  busy.turns = [{ id: 'fairy-turn', status: 'inProgress', items: [
    { id: 'fairy-running-message', type: 'userMessage', content: [{ type: 'text', text: 'Checking the carbon panel' }] },
    { id: 'fairy-running-reply', type: 'agentMessage', text: richReply },
  ] }]
  const channel = await startFakeChChannel(host, join(root, 'client-hosts'), 'service')
  t.after(() => channel.close())
  if (process.env.FAIRY_TEST_WEB_BUNDLE) process.env.CODEXHOST_TEST_WEB_BUNDLE = process.env.FAIRY_TEST_WEB_BUNDLE
  const url = await startServer(t, join(repository, 'packages/web-server'), ['--import', 'tsx', 'src/main.ts'], [
    '--token', TOKEN, '--session-source', 'codexhost', '--ch-data', root,
    ...(process.env.FAIRY_TEST_WEB_BUNDLE ? ['--ch-host-runtime', join(dirname(dirname(process.env.FAIRY_TEST_WEB_BUNDLE)), 'host-runtime.mjs')] : []),
  ], { authenticated: true, environment: { PATH: process.env.PATH, USERPROFILE: root, LOCALAPPDATA: join(root, 'local') } })
  const rpc = async (action, args = {}) => {
    const method = 'codexhost/uiExtensions/' + action
    const response = await fetch(new URL('/api/' + method, url), { method: 'POST',
      headers: { authorization: 'Bearer ' + TOKEN, 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'client-request', rpcId: 'fairy-test-' + action, method, payload: { args } }) })
    const reply = await response.json()
    assert.equal(reply.result?.ok, true, JSON.stringify(reply))
    return reply.result.value
  }
  const browser = await chromium.launch()
  t.after(() => browser.close())
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, locale: 'en-US', timezoneId: 'Asia/Singapore', colorScheme: 'dark' })
  await page.clock.setFixedTime(new Date('2026-11-13T08:00:00+08:00'))
  page.setDefaultTimeout(10000)
  const errors = [], forbidden = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'warning' && /fairy-zzz/.test(message.text())) errors.push(message.text()) })
  page.on('request', request => { if (/\/fairy-zzz\/(tts|engine|voice|audio|usage|mood|health)/.test(request.url())) forbidden.push(request.url()) })
  await page.addInitScript(() => {
    window.__fairyAudioCalls = 0
    window.Audio = function () { window.__fairyAudioCalls++; throw new Error('Fairy must not create Audio') }
  })
  await page.addInitScript('Object.defineProperty(navigator, "clipboard", { value: { writeText: async text => { window.__fairyCopiedText = text } } })')
  await page.goto(url)
  await page.getByRole('button', { name: 'Settings', exact: true }).waitFor()
  const baseline = await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--dsw-alias-brand-primary').trim())
  await page.getByRole('button', { name: 'Settings', exact: true }).click()
  await page.getByText('Interface extensions', { exact: true }).first().click()
  await page.getByRole('button', { name: 'Add extension', exact: true }).click()
  const installDialog = page.getByRole('dialog', { name: 'Add extension', exact: true })
  await installDialog.getByRole('textbox', { name: 'Package name or address', exact: true }).fill(process.env.FAIRY_TEST_INSTALL_SPEC || plugin)
  await page.screenshot({ path: join(evidence, 'repository-install-dialog.png') })
  await installDialog.getByRole('button', { name: 'Install', exact: true }).click()
  await installDialog.waitFor({ state: 'hidden', timeout: 120000 })
  await page.locator('[data-web-extension="dsh-fairy-zzz"]').waitFor()
  await page.screenshot({ path: join(evidence, 'repository-extension-installed.png') })
  await page.keyboard.press('Escape')
  const installed = await rpc('list')
  const entry = installed.extensions.find(item => item.name === 'dsh-fairy-zzz')
  assert.ok(entry)
  assert.equal(entry.projectUrl, 'https://github.com/biground/codex-host-theme-hdd-fairy')
  assert.equal(entry.meta.title.en, 'H.D.D + Fairy')
  assert.deepEqual(entry.enabledTargets, [])
  await rpc('setEnabled', { id: entry.id, enabled: true })
  await page.locator('.fz3-boot').waitFor()
  await page.locator('.fz3-boot video').first().waitFor()
  assert.equal(await page.locator('.fz3-boot video').evaluateAll(videos => videos.every(video => video.muted)), true)
  await page.waitForFunction(() => [...document.querySelectorAll('.fz3-boot video')].some(video => video.currentTime > 2)).catch(async error => {
    console.log(JSON.stringify({ videos: await page.locator('video').evaluateAll(videos => videos.map(v => ({ src: v.currentSrc, error: v.error?.message, code: v.error?.code, ready: v.readyState, network: v.networkState, paused: v.paused, time: v.currentTime }))),
      assetStatus: (await page.request.get(new URL('/fairy-zzz/assets/boot.mp4', url).href, { headers: { range: 'bytes=0-15' } })).status(), errors }))
    throw error
  })
  await page.screenshot({ path: join(evidence, 'boot.png') })
  await page.locator('.fz3-skip').click()
  await page.locator('.fz3-layer[data-phase="greet"]').waitFor()
  await page.screenshot({ path: join(evidence, 'greeting.png') })
  await page.locator('.fz3-layer[data-phase="dock"]').waitFor({ timeout: 6000 })
  // A fresh touch browser must never mount or download the desktop welcome effects.
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'en-US', colorScheme: 'dark' })
  const phonePage = await phone.newPage()
  await phonePage.addInitScript(() => {
    localStorage.setItem('fairy.zzz.eye-hidden', 'false')
    localStorage.setItem('fairy.zzz.dock-pos', '{"x":900,"y":400}')
  })
  const phoneMedia = []
  phonePage.on('pageerror', error => errors.push(error.message))
  phonePage.on('request', request => { if (/\/fairy-zzz\/assets\/(boot\.mp4|poster\.jpg|hero\.png)/.test(request.url())) phoneMedia.push(new URL(request.url()).pathname) })
  await phonePage.goto(url)
  await phonePage.locator('style[data-plugin="dsh-fairy-zzz"]').waitFor({ state: 'attached' })
  await phonePage.locator('[data-composer-card]').waitFor()
  await phonePage.getByRole('button', { name: 'Fast', exact: true }).waitFor()
  await phonePage.screenshot({ path: join(evidence, 'mobile-first-open.png') })
  assert.equal(await phonePage.locator('.fz3-layer,.fz3-core,.fz3-boot,.fz3-atmos').count(), 0, 'Phone must not mount the desktop Fairy overlay')
  assert.deepEqual(phoneMedia, [], 'Phone must not download desktop boot media')
  await phonePage.getByRole('button', { name: 'Open sidebar', exact: true }).last().click()
  await phonePage.getByRole('button', { name: 'Settings', exact: true }).click()
  await phonePage.getByText('Fairy', { exact: true }).last().click()
  assert.equal(await phonePage.getByRole('switch', { name: '显示眼徽', exact: true }).isDisabled(), true)
  assert.equal(await phonePage.getByRole('button', { name: '重播开机动画', exact: true }).isDisabled(), true)
  assert.equal(await phonePage.evaluate(() => localStorage.getItem('fairy.zzz.eye-hidden')), 'false')
  assert.equal(await phonePage.evaluate(() => localStorage.getItem('fairy.zzz.dock-pos')), '{"x":900,"y":400}')
  await phonePage.keyboard.press('Escape')
  await phonePage.setViewportSize({ width: 844, height: 390 })
  await phonePage.reload()
  await phonePage.locator('style[data-plugin="dsh-fairy-zzz"]').waitFor({ state: 'attached' })
  await phonePage.locator('[data-composer-card]').waitFor()
  assert.equal(await phonePage.locator('.fz3-layer,.fz3-core,.fz3-boot,.fz3-atmos').count(), 0, 'Landscape phones must also skip Fairy effects')
  assert.deepEqual(phoneMedia, [])
  await phone.close()
  assert.equal(await page.locator('.fz3-brandname').count(), 1)
  assert.equal(await page.locator('[data-codexhost-mark="otter"]').count(), 0)
  assert.equal(await page.locator('.fz3-core').count(), 1)
  const hero = page.locator('[data-conversation-content][data-content-phase="hero"]')
  await hero.waitFor()
  const pinnedSection = page.locator('[data-sidebar-pinned]')
  await pinnedSection.waitFor()
  assert.equal(await pinnedSection.evaluate(element => getComputedStyle(element).borderTopWidth), '2px')
  const sidebarGroups = page.locator('[data-sidebar-group]')
  assert.ok(await sidebarGroups.count() >= 3)
  assert.equal(await sidebarGroups.evaluateAll(groups => groups.every(element => getComputedStyle(element).borderTopWidth === '2px')), true)
  const essayWorkspace = page.locator('[data-row-key^="workspace:"]').filter({ hasText: /^essay/ })
  await essayWorkspace.waitFor()
  if (await essayWorkspace.getAttribute('aria-expanded') === 'true') await essayWorkspace.click()
  assert.equal(await essayWorkspace.locator(':scope > [class*="_slot"]').evaluate(element => getComputedStyle(element).color), 'rgb(132, 133, 139)')
  await essayWorkspace.click()
  await page.locator('[data-row-key^="workspace:"][aria-expanded="true"]').filter({ hasText: /^essay/ }).waitFor()
  assert.equal(await essayWorkspace.locator(':scope > [class*="_slot"]').evaluate(element => getComputedStyle(element).color), 'rgb(133, 130, 223)')
  await essayWorkspace.click()
  assert.match(await hero.evaluate(element => getComputedStyle(element).backgroundImage), /repeating-linear-gradient/)
  assert.equal(await page.evaluate(() => getComputedStyle(document.body, '::after').content), 'none')
  assert.equal(await hero.locator('[data-composer-card]').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(23, 23, 27)')
  const add = hero.locator('[data-composer-tools] [data-toolbar-fixed="start"] button')
  const permission = hero.getByRole('button', { name: 'Access mode, current: Ask', exact: true })
  await add.waitFor()
  assert.equal(await add.evaluate(button => getComputedStyle(button).color), 'rgb(182, 213, 104)')
  assert.equal(await add.evaluate(button => getComputedStyle(button).borderTopWidth), '2px')
  await permission.waitFor()
  assert.equal(await permission.evaluate(button => getComputedStyle(button).borderTopColor), 'rgb(121, 104, 174)')
  await add.click()
  await page.waitForFunction(() => document.querySelector('[data-composer-tools] [data-toolbar-fixed="start"] button')?.getAttribute('aria-expanded') === 'true')
  await page.keyboard.press('Escape')
  await page.waitForFunction(() => document.querySelector('[data-composer-tools] [data-toolbar-fixed="start"] button')?.getAttribute('aria-expanded') === 'false')
  await permission.click()
  await page.getByRole('menuitem', { name: 'Native Auto', exact: true }).click()
  await hero.getByRole('button', { name: 'Access mode, current: Native Auto', exact: true }).click()
  await page.getByRole('menuitem', { name: 'Ask', exact: true }).click()
  await permission.waitFor()
  const send = page.getByRole('button', { name: 'Send message', exact: true })
  const fast = page.getByRole('button', { name: 'Fast', exact: true })
  await send.waitFor()
  assert.equal(await send.isDisabled(), true)
  assert.equal(await send.evaluate(button => getComputedStyle(button).borderTopColor), 'rgb(239, 106, 112)')
  await fast.waitFor()
  assert.equal(await fast.getAttribute('aria-pressed'), 'false')
  assert.equal(await fast.evaluate(button => getComputedStyle(button, '::before').content), '"H.D.D"')
  assert.equal(await fast.evaluate(button => getComputedStyle(button, '::after').content), '"OFF"')
  const selections = []
  page.on('request', request => {
    if (new URL(request.url()).pathname === '/api/session/selectModel') selections.push(request.postDataJSON().payload.args.request)
  })
  await fast.click()
  await page.locator('[aria-label="Fast"][aria-pressed="true"]').waitFor()
  assert.equal(await fast.evaluate(button => getComputedStyle(button, '::after').content), '"ON"')
  assert.equal(selections.at(-1)?.model, 'native-fast')
  await fast.press('Space')
  await page.locator('[aria-label="Fast"][aria-pressed="false"]').waitFor()
  assert.equal(selections.at(-1)?.model, 'native')
  await fast.screenshot({ path: join(evidence, 'hdd-fast-off.png') })
  await fast.click()
  await page.locator('[aria-label="Fast"][aria-pressed="true"]').waitFor()
  await fast.screenshot({ path: join(evidence, 'hdd-fast-on.png') })
  const assertFastPosition = async () => {
    if (page.viewportSize().width < 768) {
      const card = await page.locator('[data-composer-card]').boundingBox()
      const box = await fast.boundingBox()
      assert.ok(box && card && box.x >= card.x && box.y >= card.y && box.x + box.width <= card.x + card.width && box.y + box.height <= card.y + card.height, JSON.stringify({ box, card }))
      assert.ok(box.height >= 44, 'Fast mode needs a full touch target')
      return
    }
    await page.waitForFunction(() => {
      const body = document.querySelector('[data-conversation-content]').getBoundingClientRect()
      const button = document.querySelector('button[aria-label="Fast"]').getBoundingClientRect()
      return Math.abs(button.top - body.top - 16) < 2
    })
    const box = await fast.boundingBox()
    const viewport = page.viewportSize()
    const content = await page.locator('[data-conversation-content]').boundingBox()
    assert.ok(box && content && Math.abs(box.y - content.y - 16) < 2 && box.x > viewport.width - 210 && box.x + box.width <= viewport.width - 8, JSON.stringify({ box, content }))
  }
  await assertFastPosition()
  await hero.getByRole('heading', { name: '空洞深潜系统', exact: true }).waitFor()
  assert.equal(await hero.locator('.fz3-hdd-english').textContent(), 'HOLLOW DEEP DIVE SYSTEM')
  assert.equal(await hero.locator('.fz3-hdd-english').getAttribute('aria-hidden'), 'true')
  const greeting = hero.locator('.fz3-hdd-greeting')
  assert.equal(await greeting.textContent(), '早上好，传奇绳匠【法厄同】')
  for (const [hour, expected] of [[4, '晚上好'], [5, '早上好'], [12, '中午好'], [18, '晚上好']]) {
    await page.clock.setFixedTime(new Date(`2026-11-13T${String(hour).padStart(2, '0')}:00:00+08:00`))
    await page.evaluate(() => window.dispatchEvent(new Event('focus')))
    await page.waitForFunction(text => document.querySelector('.fz3-hdd-greeting')?.textContent === text, expected + '，传奇绳匠【法厄同】')
  }
  assert.match(await hero.evaluate(element => getComputedStyle(element, '::before').backgroundImage), /hdd-mesh\.png/)
  assert.match(await hero.evaluate(element => getComputedStyle(element, '::after').backgroundImage), /hdd-logo\.png/)
  assert.equal(await hero.evaluate(element => getComputedStyle(element, '::after').pointerEvents), 'none')
  const assertHddAlignment = async () => {
    const geometry = await hero.evaluate(element => {
      const content = element.getBoundingClientRect()
      const card = element.querySelector('[data-composer-card]').getBoundingClientRect()
      const logo = getComputedStyle(element, '::after')
      const mesh = getComputedStyle(element, '::before')
      const caption = element.querySelector('.fz3-hdd-chinese').getBoundingClientRect()
      return {
        logoWidthRatio: parseFloat(logo.width) / card.width,
        meshWidthRatio: parseFloat(mesh.width) / card.width,
        centerDelta: parseFloat(logo.left) + content.left - (card.left + card.width / 2),
        logoYDelta: parseFloat(logo.top) + content.top - (card.top - card.width * .115),
        meshYDelta: parseFloat(mesh.top) + content.top - (card.top + card.width * .08),
        titleBelowCard: (element.querySelector('[data-fz3-hero-title]')?.getBoundingClientRect().top ?? 0) > card.bottom,
        captionCenterDelta: caption.left + caption.width / 2 - (card.left + card.width / 2),
        captionBelowCard: caption.top > card.bottom,
      }
    })
    assert.ok(Math.abs(geometry.logoWidthRatio - .5) < .01, JSON.stringify(geometry))
    assert.ok(Math.abs(geometry.meshWidthRatio - 1) < .01, JSON.stringify(geometry))
    assert.ok(Math.abs(geometry.centerDelta) < 2, JSON.stringify(geometry))
    assert.ok(Math.abs(geometry.logoYDelta) < 2, JSON.stringify(geometry))
    assert.ok(Math.abs(geometry.meshYDelta) < 2, JSON.stringify(geometry))
    assert.equal(geometry.titleBelowCard, true)
    assert.ok(Math.abs(geometry.captionCenterDelta) < 2, JSON.stringify(geometry))
    assert.equal(geometry.captionBelowCard, true)
  }
  await assertHddAlignment()
  const alpha = await page.evaluate(async () => {
    const values = []
    for (const file of ['hdd-logo.png', 'hdd-mesh.png']) {
      const image = new Image()
      image.src = '/fairy-zzz/assets/' + file
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.width; canvas.height = image.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)
      values.push({ file, width: image.width, alpha: ctx.getImageData(0, 0, 1, 1).data[3] })
    }
    return values
  })
  assert.ok(alpha.every(image => image.width >= 1024 && image.alpha === 0))
  await page.waitForFunction(() => document.querySelector('.fz3-core').getBoundingClientRect().width < 135)
  await page.screenshot({ path: join(evidence, 'new-session-hdd-dark.png') })
  await send.screenshot({ path: join(evidence, 'send-unavailable.png') })
  const composer = hero.locator('[data-composer-card]').getByRole('textbox')
  const compactHeight = (await hero.locator('[data-composer-card]').boundingBox()).height
  await composer.fill('Fairy，准备进入空洞吧。')
  await page.getByRole('button', { name: 'Send message', exact: true, disabled: false }).waitFor()
  assert.equal(await send.isEnabled(), true)
  assert.equal(await send.evaluate(button => getComputedStyle(button).borderTopColor), 'rgb(230, 211, 60)')
  await send.screenshot({ path: join(evidence, 'send-ready.png') })
  await page.screenshot({ path: join(evidence, 'new-session-hdd-ready.png') })
  await composer.fill('背景交互检查\n'.repeat(6))
  await page.waitForFunction(height => document.querySelector('[data-composer-card]').getBoundingClientRect().height > height + 60, compactHeight)
  await page.waitForFunction(() => {
    const body = document.querySelector('[data-content-phase="hero"]')
    const card = body.querySelector('[data-composer-card]').getBoundingClientRect()
    return Math.abs(parseFloat(getComputedStyle(body, '::after').top) + body.getBoundingClientRect().top - (card.top - card.width * .115)) < 2
  })
  await assertHddAlignment()
  await composer.press('ControlOrMeta+A')
  await composer.press('Backspace')
  await page.getByRole('button', { name: 'Send message', exact: true, disabled: true }).waitFor().catch(async error => {
    console.log(JSON.stringify({ heroAfterClear: await composer.evaluate(element => ({ text: element.textContent, html: element.innerHTML })),
      buttons: await hero.locator('[data-toolbar-fixed="end"] button').evaluateAll(buttons => buttons.map(button => ({ label: button.getAttribute('aria-label'), disabled: button.disabled }))), errors }))
    throw error
  })
  assert.equal(await send.isDisabled(), true)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForFunction(() => {
    const body = document.querySelector('[data-content-phase="hero"]')
    const card = body.querySelector('[data-composer-card]').getBoundingClientRect()
    return Math.abs(parseFloat(getComputedStyle(body, '::after').width) / card.width - .5) < .01
  })
  await assertHddAlignment()
  await assertFastPosition()
  assert.equal(await add.evaluate(button => getComputedStyle(button).borderTopWidth), '2px')
  assert.equal(await permission.evaluate(button => getComputedStyle(button).borderTopColor), 'rgb(121, 104, 174)')
  await page.screenshot({ path: join(evidence, 'new-session-hdd-phone.png') })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.getByRole('button', { name: 'Settings', exact: true }).click()
  await page.getByText('Fairy', { exact: true }).last().click()
  await page.getByRole('button', { name: '浅色', exact: true }).click()
  await page.waitForFunction(() => document.documentElement.dataset.fz3Theme === 'light')
  assert.equal(await hero.evaluate(element => getComputedStyle(element, '::after').content), 'none')
  assert.equal(await hero.locator('.fz3-hdd-copy').isVisible(), false)
  assert.equal(await hero.locator('[class*="_headline"]').evaluate(element => getComputedStyle(element).visibility), 'visible')
  assert.notEqual(await fast.evaluate(button => getComputedStyle(button).position), 'fixed')
  assert.equal(await fast.evaluate(button => getComputedStyle(button, '::before').content), 'none')
  assert.equal(await add.evaluate(button => getComputedStyle(button).borderTopWidth), '0px')
  assert.equal(await permission.evaluate(button => getComputedStyle(button).borderTopWidth), '0px')
  assert.equal(await pinnedSection.evaluate(element => getComputedStyle(element).borderTopWidth), '0px')
  await page.getByRole('button', { name: '深色', exact: true }).click()
  await page.keyboard.press('Escape')
  await composer.fill('Fairy styled send check')
  await send.click()
  await page.getByText('CH response: Fairy styled send check', { exact: true }).waitFor()
  assert.equal(decodeHarnessPluginRoute(host.requests.find(request => request.method === 'thread/start')?.params.model)?.model?.id, 'native-fast')
  const folder = page.getByRole('treeitem').filter({ hasText: /^fairy/ })
  await folder.waitFor().catch(async error => {
    await page.screenshot({ path: join(evidence, 'navigation-failure.png') })
    console.log(JSON.stringify({ body: (await page.locator('body').innerText()).slice(0, 2200), tree: await page.getByRole('treeitem').allTextContents(), errors }))
    throw error
  })
  if (await folder.getAttribute('aria-expanded') === 'false') await folder.click()
  await page.locator('[data-row-key^="session:"]').filter({ hasText: 'Fairy running session' }).click()
  await page.locator('.fz3-layer[data-mood="thinking"],.fz3-layer[data-mood="working"]').waitFor()
  await page.locator('.fz3-layer[data-mood="working"]').waitFor({ timeout: 4000 })
  const stop = page.getByRole('button', { name: 'Stop generating', exact: true })
  const selectedSession = page.locator('[data-row-key="session:fairy-busy"][aria-selected="true"]').first()
  await selectedSession.waitFor()
  assert.match(await selectedSession.evaluate(element => getComputedStyle(element).backgroundImage), /linear-gradient/)
  assert.equal(await selectedSession.evaluate(element => getComputedStyle(element, '::after').content), 'none')
  assert.equal(await selectedSession.locator('[data-session-title]').evaluate(element => getComputedStyle(element).color), 'rgb(25, 23, 12)')
  await selectedSession.hover()
  await selectedSession.getByRole('button', { name: 'Pin session', exact: true }).click()
  const pinnedBusy = page.locator('[data-sidebar-pinned] [data-row-key="session:fairy-busy"]')
  await pinnedBusy.waitFor()
  assert.match(await pinnedBusy.evaluate(element => getComputedStyle(element).backgroundImage), /linear-gradient/)
  await pinnedBusy.hover()
  await pinnedBusy.getByRole('button', { name: 'Unpin session', exact: true }).click()
  await pinnedBusy.waitFor({ state: 'detached' })
  assert.deepEqual(host.pinnedIds, [idle.id])
  await page.mouse.move(800, 500)
  await page.waitForFunction(() => [...document.querySelectorAll('[role="tree"]')].every(tree => tree.getAnimations({ subtree: true }).every(animation => animation.effect?.getTiming().iterations === Infinity || !['running', 'pending'].includes(animation.playState))))
  assert.equal(await page.evaluate(() => window.scrollX), 0)
  const sidebarGeometry = await pinnedSection.evaluate(element => {
    const chain = []
    for (let node = element; node && chain.length < 12; node = node.parentElement) {
      const box = node.getBoundingClientRect()
      chain.push({ tag: node.tagName, class: node.className, x: box.x, width: box.width, scrollLeft: node.scrollLeft, scrollWidth: node.scrollWidth, clientWidth: node.clientWidth, overflow: getComputedStyle(node).overflowX })
    }
    return chain
  })
  if (sidebarGeometry[0].x < 0) await page.screenshot({ path: join(evidence, 'sidebar-boundary-failure.png') })
  assert.ok(sidebarGeometry[0].x >= 0, JSON.stringify(sidebarGeometry))
  await page.screenshot({ path: join(evidence, 'sidebar-fairy-dark.png') })
  assert.equal(await stop.locator('svg rect').count(), 1)
  assert.equal(await stop.evaluate(button => getComputedStyle(button).borderTopColor), 'rgb(239, 106, 112)')
  assert.equal(await stop.locator('svg rect').evaluate(rect => getComputedStyle(rect).fill), 'rgb(239, 106, 112)')
  await stop.screenshot({ path: join(evidence, 'stop-running.png') })
  const active = page.locator('[data-conversation-content][data-content-phase="active"]')
  const assistantBody = active.locator('[data-chat-flow-kind^="assistant"] [class*="_body"]').first()
  const userBubble = active.locator('[data-chat-flow-kind="user"] [class*="_bubble"]').first()
  const chatPanel = active.locator('[class*="_viewArea"]').filter({ has: page.locator('[data-chat-flow]') })
  await assistantBody.waitFor()
  assert.equal(await assistantBody.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(244, 244, 242)')
  assert.equal(await assistantBody.locator('p').first().evaluate(element => getComputedStyle(element).color), 'rgb(36, 38, 43)')
  assert.equal(await userBubble.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(56, 83, 219)')
  assert.equal(await userBubble.evaluate(element => getComputedStyle(element).color), 'rgb(255, 255, 255)')
  assert.equal(await chatPanel.evaluate(element => getComputedStyle(element).borderTopWidth), '1px')
  assert.equal(await assistantBody.locator('pre').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(233, 234, 230)')
  assert.equal(await assistantBody.locator('pre').evaluate(element => getComputedStyle(element).color), 'rgb(36, 38, 43)')
  assert.equal(await assistantBody.evaluate(element => getComputedStyle(element).getPropertyValue('--shiki-token-keyword').trim()), '#d6336c')
  assert.equal(await assistantBody.locator('table').count(), 1)
  assert.equal(await page.evaluate(() => document.documentElement.dataset.fz3Theme), 'dark')
  assert.equal(await assistantBody.evaluate(element => getComputedStyle(element).colorScheme), 'light')
  await page.screenshot({ path: join(evidence, 'conversation-message-bubbles.png') })
  busy.turns[0].items[1].text += '\n\nStreaming update stays readable.'
  host.changed(busy.id)
  await active.getByText('Streaming update stays readable.', { exact: true }).waitFor()
  assert.equal(await assistantBody.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(244, 244, 242)')
  assert.match(await active.evaluate(element => getComputedStyle(element).backgroundImage), /repeating-linear-gradient/)
  assert.equal(await active.locator('[data-composer-card]').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(23, 23, 27)')
  assert.equal(await active.locator('[data-composer-tools] [data-toolbar-fixed="start"] button').evaluate(button => getComputedStyle(button).color), 'rgb(182, 213, 104)')
  assert.equal(await active.locator('[data-composer-tools] button:has(> [class*="_triggerIcon"])').evaluate(button => getComputedStyle(button).borderTopColor), 'rgb(121, 104, 174)')
  assert.equal(await fast.evaluate(button => getComputedStyle(button).position), 'fixed')
  await assertFastPosition()
  await page.screenshot({ path: join(evidence, 'conversation-carbon-running.png') })
  const activeEditor = active.locator('[data-composer-card]').getByRole('textbox')
  await activeEditor.fill('Checking the running composer style')
  const activeSend = active.locator('[data-toolbar-fixed="end"] button:has(svg > path)')
  await activeSend.waitFor()
  assert.equal(await activeSend.evaluate(button => getComputedStyle(button).borderTopColor), 'rgb(230, 211, 60)')
  await activeEditor.press('ControlOrMeta+A')
  await activeEditor.press('Backspace')
  await stop.waitFor().catch(async error => {
    console.log(JSON.stringify({ composerAfterClear: await activeEditor.evaluate(element => ({ text: element.textContent, html: element.innerHTML })),
      toolbar: await active.locator('[data-toolbar-fixed="end"] button').evaluateAll(buttons => buttons.map(button => ({ label: button.getAttribute('aria-label'), disabled: button.disabled }))),
      sessionStatus: busy.status, turnStatus: busy.turns[0].status, errors }))
    await page.screenshot({ path: join(evidence, 'stop-after-clear-failure.png') })
    throw error
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await assertFastPosition()
  assert.equal(await page.locator('.fz3-core,.fz3-boot').count(), 0)
  assert.equal(await active.evaluate(element => getComputedStyle(element).paddingTop), '0px')
  await page.screenshot({ path: join(evidence, 'conversation-carbon-phone.png') })
  assert.ok((await assistantBody.boundingBox()).width >= 330, JSON.stringify(await assistantBody.evaluate(element => {
    const chain = []
    for (let node = element; node && chain.length < 8; node = node.parentElement) {
      const style = getComputedStyle(node), box = node.getBoundingClientRect()
      chain.push({ class: node.className, x: box.x, width: box.width, padding: style.padding })
    }
    return chain
  })))
  for (const width of [320, 360, 390]) {
    await page.setViewportSize({ width, height: 844 })
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    const beforeFast = await fast.getAttribute('aria-pressed')
    await fast.click()
    await page.waitForFunction(value => document.querySelector('button[aria-label="Fast"]')?.getAttribute('aria-pressed') !== value, beforeFast)
    await fast.click()
    await page.waitForFunction(value => document.querySelector('button[aria-label="Fast"]')?.getAttribute('aria-pressed') === value, beforeFast)
    const mobilePermission = active.getByRole('button', { name: 'Access mode, current: Ask', exact: true })
    await mobilePermission.click()
    await page.getByRole('menuitem', { name: 'Native Auto', exact: true }).waitFor()
    await page.keyboard.press('Escape')
    const mobileModel = active.getByRole('button', { name: 'Select model, current Native Model', exact: true })
    await mobileModel.scrollIntoViewIfNeeded()
    assert.ok((await mobileModel.boundingBox()).height >= 44)
    await mobileModel.click()
    await page.getByRole('menuitem', { name: 'Native Model', exact: true }).waitFor()
    await page.keyboard.press('Escape')
    const fixedButtons = active.locator('[data-toolbar-fixed] button')
    await page.screenshot({ path: join(evidence, `mobile-conversation-${width}.png`) })
    const fixedTargets = await fixedButtons.evaluateAll(buttons => buttons.map(button => {
      const rect = button.getBoundingClientRect()
      const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
      const chain = []
      for (let node = button.parentElement; node && chain.length < 24; node = node.parentElement) {
        const box = node.getBoundingClientRect(), style = getComputedStyle(node)
        chain.push({ class: node.className, x: box.x, width: box.width, position: style.position,
          overflowX: style.overflowX, scrollLeft: node.scrollLeft, clientWidth: node.clientWidth, scrollWidth: node.scrollWidth,
          phone: node.getAttribute('data-phone-toolbar') })
      }
      return { label: button.getAttribute('aria-label'), width: rect.width, height: rect.height,
        x: rect.x, y: rect.y, hit: hit?.outerHTML.slice(0, 300), clickable: button.contains(hit), chain }
    }))
    assert.equal(fixedTargets.every(button => button.width >= 44 && button.height >= 44 && button.clickable), true,
      'Attach and Stop must stay visible and clickable: ' + JSON.stringify({ width, fixedTargets }))
  }
  assert.ok(await assistantBody.evaluate(element => element.scrollWidth <= element.clientWidth + 2))
  const wideTable = assistantBody.locator('.md-table-wide')
  await wideTable.hover()
  assert.equal(await wideTable.evaluate(element => {
    const overflow = element.scrollWidth - element.clientWidth
    element.scrollLeft = overflow
    const scrolled = overflow > 0 && element.scrollLeft > 0
    element.scrollLeft = 0
    return scrolled
  }), true)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  await page.screenshot({ path: join(evidence, 'conversation-message-phone.png') })
  await page.setViewportSize({ width: 1440, height: 1000 })
  assert.equal(await page.locator('[data-conversation-content]').evaluate(element => getComputedStyle(element, '::after').content), 'none')
  assert.equal(await page.locator('[data-conversation-content]').evaluate(element => element.style.getPropertyValue('--fz3-hdd-w')), '')
  assert.equal(await page.locator('.fz3-hdd-copy').count(), 0)
  const cancelled = page.waitForResponse(response => new URL(response.url()).pathname === '/api/session/cancel')
  await stop.click()
  await cancelled
  assert.ok(host.requests.some(request => request.method === 'turn/interrupt' && request.params.threadId === busy.id))
  busy.status = { type: 'idle' }; busy.turns[0].status = 'completed'
  host.changed(busy.id, 'turn/completed')
  await page.locator('.fz3-layer[data-mood="done"]').waitFor({ timeout: 4000 })
  await page.locator('.fz3-layer[data-mood="idle"]').waitFor({ timeout: 4000 })
  await activeSend.waitFor()
  assert.equal(await activeSend.isDisabled(), true)
  assert.equal(await activeSend.evaluate(button => getComputedStyle(button).borderTopColor), 'rgb(239, 106, 112)')
  await page.getByRole('button', { name: 'Fairy · 会话状态', exact: true }).press('Enter')
  assert.match(await page.locator('.fz3-bubble').innerText(), /Fairy running session/)
  assert.doesNotMatch(await page.locator('.fz3-bubble').innerText(), /余额|峰谷|花费/)
  await page.keyboard.press('Escape')
  const eye = page.locator('.fz3-core')
  const box = await eye.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down(); await page.mouse.move(1100, 650, { steps: 8 }); await page.mouse.up()
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('fairy.zzz.dock-pos')))
  assert.ok(stored.x > 900)
  await page.reload()
  await page.locator('.fz3-boot').waitFor()
  await page.locator('.fz3-skip').click()
  await page.locator('.fz3-layer[data-phase="dock"]').waitFor({ timeout: 6000 })
  await page.waitForFunction(x => {
    const rect = document.querySelector('.fz3-core').getBoundingClientRect()
    return Math.abs(rect.x + rect.width / 2 - x) < 3
  }, stored.x, { timeout: 5000 })
  await page.screenshot({ path: join(evidence, 'desktop.png') })
  await page.getByRole('button', { name: 'Settings', exact: true }).click()
  await page.getByText('Fairy', { exact: true }).last().click()
  await page.getByRole('switch', { name: '显示眼徽', exact: true }).waitFor()
  assert.doesNotMatch(await page.locator('.fz3-set').innerText(), /语音|朗读|试听|引擎|余额/)
  await page.getByRole('button', { name: '浅色', exact: true }).click()
  await page.waitForFunction(() => document.documentElement.dataset.fz3Theme === 'light')
  await page.waitForFunction(() => !document.body.hasAttribute('data-ds-dark-theme'), undefined, { timeout: 2000 })
  // Theme colors transition over 200 ms; inspect the settled foreground before visual QA.
  await page.waitForFunction(() => {
    const cell = document.querySelector('[aria-modal="true"] nav button')
    const rgb = cell && getComputedStyle(cell).color.match(/\d+/g)?.map(Number)
    return rgb && rgb[0] < 160 && rgb[1] < 160 && rgb[2] < 160
  })
  await page.screenshot({ path: join(evidence, 'settings-light.png') })
  await page.getByRole('switch', { name: '显示眼徽', exact: true }).click()
  await page.locator('.fz3-core').waitFor({ state: 'hidden' })
  await page.getByRole('switch', { name: '显示眼徽', exact: true }).click()
  await page.locator('.fz3-core').waitFor()
  await page.getByRole('button', { name: '跟随', exact: true }).click()
  await page.keyboard.press('Escape')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.locator('.fz3-core').waitFor({ state: 'detached' })
  await page.screenshot({ path: join(evidence, 'phone.png') })
  await page.getByRole('button', { name: 'Open sidebar', exact: true }).last().click()
  await pinnedSection.waitFor()
  await page.waitForFunction(() => {
    const drawer = document.querySelector('[data-phone-drawer][data-open]')
    return drawer && drawer.getBoundingClientRect().left >= 0 && drawer.getAnimations({ subtree: true }).every(animation => animation.effect?.getTiming().iterations === Infinity || animation.playState !== 'running')
  })
  assert.ok((await pinnedSection.boundingBox()).x >= 0)
  assert.equal(await pinnedSection.evaluate(element => getComputedStyle(element).borderTopWidth), '1px')
  await page.screenshot({ path: join(evidence, 'sidebar-fairy-phone.png') })
  await page.keyboard.press('Escape')
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.locator('[data-row-key="session:fairy-replies"]').first().click()
  const quotedReply = page.locator('[data-fz3-question-reply]')
  await quotedReply.waitFor().catch(async error => {
    console.log(JSON.stringify({ quoteFailure: { version: entry.version,
      styles: await page.locator('style[data-plugin="dsh-fairy-zzz"]').evaluate(tag => tag.textContent.includes('.fz3-reply-bubble')),
      flow: await page.locator('[data-chat-flow-kind]').evaluateAll(nodes => nodes.map(node => ({ kind: node.dataset.chatFlowKind, text: node.textContent.slice(0, 180) }))), errors } }))
    throw error
  })
  assert.equal(await quotedReply.count(), 1)
  assert.equal(await quotedReply.locator('.fz3-reply-pair').count(), 2)
  assert.equal(await quotedReply.locator('.fz3-reply-answer').first().innerText(), questionReplies[0].answer)
  assert.equal(await quotedReply.locator('.fz3-reply-question').first().innerText(), questionReplies[0].question)
  assert.doesNotMatch(await quotedReply.innerText(), /send_user_message_question_reply|questionItemId|async-fixture/)
  assert.equal(await quotedReply.locator('img').count(), 0)
  assert.equal(await page.evaluate(() => window.__quoteInjected), undefined)
  await quotedReply.getByRole('button', { name: '复制问答', exact: true }).click()
  assert.equal(await page.evaluate(() => window.__fairyCopiedText), questionReplies.map(reply => reply.question + '\n' + reply.answer).join('\n\n'))
  const longQuote = quotedReply.locator('details').last()
  assert.equal(await longQuote.getAttribute('open'), null)
  await longQuote.locator('summary').click()
  assert.notEqual(await longQuote.getAttribute('open'), null)
  await longQuote.locator('summary').click()
  await page.getByText('普通用户消息仍然保留。', { exact: true }).waitFor()
  await page.getByText(malformedReply, { exact: true }).waitFor()
  await page.getByText(JSON.stringify(questionReplies), { exact: true }).waitFor()
  assert.equal(replies.turns[0].items[1].content[0].text, questionReplyText)
  await page.locator('[data-row-key="session:fairy-reply-preview"]').first().click()
  await quotedReply.locator('.fz3-reply-answer').getByText(questionReplies[0].answer, { exact: true }).waitFor()
  await quotedReply.scrollIntoViewIfNeeded()
  await page.screenshot({ path: join(evidence, 'question-reply-desktop.png') })
  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  assert.equal(await quotedReply.locator('.fz3-reply-question,.fz3-reply-answer').evaluateAll(elements => elements.every(element => element.scrollWidth <= element.clientWidth + 2)), true)
  await quotedReply.scrollIntoViewIfNeeded()
  await page.screenshot({ path: join(evidence, 'question-reply-phone.png') })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.locator('[data-row-key="session:fairy-replies"]').first().click()
  await quotedReply.waitFor()
  assert.equal(await page.evaluate(() => window.__fairyAudioCalls), 0)
  assert.deepEqual(forbidden, [])
  await rpc('setEnabled', { id: entry.id, enabled: false })
  assert.equal(await page.locator('[data-fz3-question-reply]').count(), 0)
  await page.getByText(questionReplyText, { exact: true }).waitFor()
  await page.locator('.fz3-layer').waitFor({ state: 'hidden' })
  assert.equal(await page.locator('style[data-plugin="dsh-fairy-zzz"]').count(), 0)
  assert.equal(await page.locator('.fz3-brandname').count(), 0)
  assert.equal(await page.locator('.fz3-hdd-copy').count(), 0)
  assert.equal(await page.evaluate(() => document.documentElement.hasAttribute('data-fz3-theme')), false)
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--dsw-alias-brand-primary').trim()), baseline)
  assert.equal((await page.request.get(new URL('/fairy-zzz/assets/poster.jpg', url).href)).status(), 404)
  assert.deepEqual(errors, [])
  console.log(JSON.stringify({ version: '0.18.0-beta.5', screenshots: evidence, audioRequests: forbidden.length, pageErrors: errors.length }))
})
