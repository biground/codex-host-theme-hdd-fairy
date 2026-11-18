import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve, sep } from 'node:path'
import { chromium } from '../../codex-host/node_modules/playwright/index.mjs'
import { startServer } from '../../codex-host/packages/web-server/test/support/server.ts'
import { FakeChChannel, startFakeChChannel } from '../../codex-host/packages/web-server/test/support/ch-channel.ts'
import { seedWebExtension } from '../../codex-host/packages/web-server/test/support/web-extension.ts'

const plugin = resolve(import.meta.dirname, '..')
const version = JSON.parse(readFileSync(join(plugin, 'package.json'), 'utf8')).version
const evidence = resolve(plugin, '../output/playwright/fairy/questions', version)
const questions = [
  { id: 'direction', type: 'choice' as const, prompt: '接下来按哪种方式实现？', multiple: false, allowOther: true,
    options: [{ value: 'continue', label: '按推荐方案继续', description: '保留当前交互，只调整外观。' },
      { value: 'revise', label: '我想调整一下' }] },
  { id: 'details', type: 'choice' as const, prompt: '哪些细节需要保留？可多选。', multiple: true, allowOther: false,
    options: [{ value: 'native', label: '保留原生选择逻辑' }, { value: 'mobile', label: '保留手机端布局' }] },
  { id: 'notes', type: 'text' as const, prompt: '还有哪些细节需要补充？' },
]

test('Question panels use black questions and white answers without changing native interactions', { timeout: 90000 }, async t => {
  const root = mkdtempSync(join(tmpdir(), 'fairy-questions-'))
  assert.ok(resolve(root).startsWith(resolve(tmpdir()) + sep))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  mkdirSync(evidence, { recursive: true })
  seedWebExtension(join(root, 'web'), plugin)
  const host = new FakeChChannel()
  const request = host.request.bind(host)
  host.request = ((method, params) => method === 'codexhost/thread/tree/read'
    ? Promise.resolve({ parents: {} }) : request(method, params)) as typeof host.request
  const target = host.add('question-session', '/computer/fairy', 'Question panel preview')
  host.pinnedIds = [target.id]
  const channel = await startFakeChChannel(host, join(root, 'client-hosts'), 'service')
  t.after(() => channel.close())
  if (process.env.FAIRY_TEST_WEB_BUNDLE) process.env.CODEXHOST_TEST_WEB_BUNDLE = process.env.FAIRY_TEST_WEB_BUNDLE
  const url = await startServer(t, resolve(plugin, '../codex-host/packages/web-server'), ['--import', 'tsx', 'src/main.ts'], [
    '--token', 'fairy-questions-isolated-token', '--data', join(root, 'web'), '--session-source', 'codexhost', '--ch-data', root,
    ...(process.env.FAIRY_TEST_WEB_BUNDLE ? ['--ch-host-runtime', join(dirname(dirname(process.env.FAIRY_TEST_WEB_BUNDLE)), 'host-runtime.mjs')] : []),
  ], { authenticated: true, environment: { PATH: process.env.PATH, USERPROFILE: root, LOCALAPPDATA: join(root, 'local') } })
  const browser = await chromium.launch()
  t.after(() => browser.close())
  const results = []
  for (const [index, width] of [1440, 390, 320].entries()) {
    const touch = width < 768
    const page = await browser.newPage({ viewport: { width, height: touch ? 844 : 1000 },
      isMobile: touch, hasTouch: touch, locale: 'en-US', colorScheme: 'dark' })
    page.setDefaultTimeout(10000)
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(url)
    await page.locator('html[data-fz3-theme="dark"]').waitFor()
    if (!touch) {
      await page.locator('.fz3-skip').click()
      await page.locator('.fz3-layer[data-phase="dock"]').waitFor()
    } else {
      await page.getByRole('button', { name: 'Open sidebar', exact: true }).last().click()
      await page.locator('[data-phone-drawer][data-open]').waitFor()
    }
    await page.locator('[data-sidebar-pinned] [data-row-key="session:question-session"]').click()
    if (touch) await page.locator('[data-phone-drawer][data-open]').waitFor({ state: 'hidden' })
    host.pending = [{ requestId: -100 - index, threadId: target.id, kind: 'question',
      interaction: { type: 'question', questions }, request: { method: 'item/tool/requestUserInput', params: {} } }]
    host.changed(target.id, 'item/tool/requestUserInput')
    const panel = page.locator('[data-question-key]')
    await panel.getByRole('heading', { name: questions[0].prompt, exact: true }).waitFor()
    const appearance = await panel.evaluate(element => {
      const card = element.querySelector('section')!, header = element.querySelector('header')!
      const option = element.querySelector('button[role="radio"]')!
      return { card: getComputedStyle(card).backgroundColor, question: getComputedStyle(header).backgroundColor,
        questionText: getComputedStyle(header.querySelector('h2')!).color,
        answer: getComputedStyle(option).backgroundColor, answerText: getComputedStyle(option).color,
        minHeight: parseFloat(getComputedStyle(option).minHeight) }
    })
    await page.screenshot({ path: join(evidence, `question-panel-${width}.png`) })
    assert.deepEqual(appearance, { card: 'rgb(36, 85, 231)', question: 'rgb(0, 0, 0)', questionText: 'rgb(255, 255, 255)',
      answer: 'rgb(255, 255, 255)', answerText: 'rgb(17, 17, 17)', minHeight: 44 })
    const next = panel.getByRole('button', { name: 'Next', exact: true })
    assert.equal(await next.isEnabled(), false)
    const option = panel.getByRole('radio', { name: '按推荐方案继续', exact: true })
    await option.focus()
    await option.press('Space')
    await panel.getByRole('heading', { name: questions[1].prompt, exact: true }).waitFor()
    await panel.getByRole('button', { name: 'Previous question', exact: true }).click()
    assert.equal(await option.getAttribute('aria-checked'), 'true')
    assert.equal(await option.evaluate(element => getComputedStyle(element).borderTopColor), 'rgb(17, 17, 17)')
    assert.equal(await next.isEnabled(), true)
    await panel.getByRole('button', { name: 'Collapse the question card', exact: true }).click()
    await option.waitFor({ state: 'hidden' })
    await panel.getByRole('button', { name: 'Expand the question card', exact: true }).click()
    assert.equal(await option.getAttribute('aria-checked'), 'true')
    await next.click()
    await panel.getByRole('heading', { name: questions[1].prompt, exact: true }).waitFor()
    for (const label of ['保留原生选择逻辑', '保留手机端布局']) {
      const checkbox = panel.getByRole('checkbox', { name: label, exact: true })
      await checkbox.click()
      assert.equal(await checkbox.getAttribute('aria-checked'), 'true')
    }
    await next.click()
    const input = panel.getByPlaceholder('Type your answer', { exact: true })
    await input.fill('问题黑底白字，回复白底黑字。')
    assert.equal(await input.evaluate(element => getComputedStyle(element).color), 'rgb(17, 17, 17)')
    assert.equal(await input.evaluate(element => getComputedStyle(element).boxShadow), 'none')
    assert.equal(await input.evaluate(element => getComputedStyle(element.closest('[class*="_customBlock"]')!).borderTopColor), 'rgb(17, 17, 17)')
    if (touch) assert.ok(await input.evaluate(element => parseFloat(getComputedStyle(element).fontSize)) >= 16)
    await page.screenshot({ path: join(evidence, `question-answer-${width}.png`) })
    await panel.getByRole('button', { name: 'Submit', exact: true }).click()
    await panel.waitFor({ state: 'hidden' })
    assert.equal(host.answers.length, index + 1)
    assert.deepEqual(host.answers[index].result, { answers: {
      direction: { answers: ['按推荐方案继续'] }, details: { answers: ['保留原生选择逻辑', '保留手机端布局'] },
      notes: { answers: ['问题黑底白字，回复白底黑字。'] },
    } })
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    assert.deepEqual(errors, [])
    results.push({ width, appearance, pageErrors: errors.length, nativeReplyDelivered: true })
    await page.close()
  }
  console.log(JSON.stringify({ version, evidence, results }))
})
