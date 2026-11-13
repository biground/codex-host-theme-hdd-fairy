import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { test } from 'node:test'
import { apply } from '../index.js'

test('the visual plugin exposes only static assets and releases its route', async (t) => {
  const routes = []
  const dispose = []
  apply({
    webServer: { register(route) {
      routes.push(route)
      return () => routes.splice(routes.indexOf(route), 1)
    } },
    effect(effect) { dispose.push(effect()) },
  })
  assert.deepEqual(routes.map(route => route.path), ['/fairy-zzz/assets'])
  const server = createServer((req, res) => {
    const route = routes.find(item => req.url === item.path || req.url.startsWith(item.path + '/'))
    if (route) Promise.resolve(route.handler(req, res)).catch(error => res.destroy(error))
    else { res.writeHead(404); res.end() }
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => { server.closeAllConnections(); server.close() })
  const base = `http://127.0.0.1:${server.address().port}`
  const image = await fetch(base + '/fairy-zzz/assets/poster.jpg', { method: 'HEAD' })
  assert.equal(image.status, 200)
  assert.equal(image.headers.get('content-type'), 'image/jpeg')
  assert.ok(Number(image.headers.get('content-length')) > 0)
  assert.equal((await image.arrayBuffer()).byteLength, 0)
  for (const name of ['hdd-logo.png', 'hdd-mesh.png']) {
    const asset = await fetch(base + '/fairy-zzz/assets/' + name, { method: 'HEAD' })
    assert.equal(asset.status, 200, name)
    assert.equal(asset.headers.get('content-type'), 'image/png')
    assert.ok(Number(asset.headers.get('content-length')) > 0)
  }
  const range = await fetch(base + '/fairy-zzz/assets/boot.mp4', { headers: { range: 'bytes=0-15' } })
  assert.equal(range.status, 206)
  assert.equal((await range.arrayBuffer()).byteLength, 16)
  assert.match(range.headers.get('content-range'), /^bytes 0-15\/\d+$/)
  const suffix = await fetch(base + '/fairy-zzz/assets/boot.mp4', { headers: { range: 'bytes=-8' } })
  assert.equal(suffix.status, 206)
  assert.equal((await suffix.arrayBuffer()).byteLength, 8)
  assert.equal((await fetch(base + '/fairy-zzz/assets/boot.mp4', { headers: { range: 'bytes=999999999999-' } })).status, 416)
  assert.equal((await fetch(base + '/fairy-zzz/assets/poster.jpg', { method: 'POST' })).status, 405)
  for (const path of ['%ZZ', '%2e%2e%2findex.js', 'voice/greet.wav', 'missing.jpg']) {
    assert.equal((await fetch(base + '/fairy-zzz/assets/' + path)).status, 404, path)
  }
  for (const path of ['tts', 'engine', 'usage', 'mood', 'voice-home', 'health']) {
    assert.equal((await fetch(base + '/fairy-zzz/' + path)).status, 404, path)
  }
  dispose.reverse().forEach(fn => fn())
  assert.equal(routes.length, 0)
})
