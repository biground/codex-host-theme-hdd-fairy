// CodexHost adaptation: visuals only. No Agent runtime, account access or audio.
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export const name = 'fairy-zzz'
export const inject = ['webServer']
const PREFIX = '/fairy-zzz/assets'
const ASSETS = new Map([
  ['boot.mp4', 'video/mp4'], ['poster.jpg', 'image/jpeg'],
  ['hero.png', 'image/png'], ['icon-180.png', 'image/png'], ['agent-avatar.png', 'image/png'],
  ['hdd-logo.png', 'image/png'], ['hdd-mesh.png', 'image/png'], ['running-mark-source.png', 'image/png'],
])

export function apply(ctx) {
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix', path: PREFIX,
    async handler(req, res) {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { allow: 'GET, HEAD' }); res.end(); return
      }
      let asset
      try { asset = decodeURIComponent(new URL(req.url, 'http://localhost').pathname.slice(PREFIX.length + 1)) }
      catch { /* Invalid URL escapes have no corresponding asset. */ }
      const type = ASSETS.get(asset)
      if (!type) { res.writeHead(404); res.end(); return }
      const file = fileURLToPath(new URL(`./assets/${asset}`, import.meta.url))
      let info
      try { info = await stat(file) } catch { res.writeHead(404); res.end(); return }
      const total = info.size
      let start = 0, end = total - 1, status = 200
      const headers = {
        'content-type': type, 'accept-ranges': 'bytes',
        'cache-control': 'no-cache', 'x-content-type-options': 'nosniff',
      }
      if (req.headers.range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range)
        if (match && (match[1] || match[2])) {
          start = match[1] ? Number(match[1]) : Math.max(0, total - Number(match[2]))
          end = match[1] && match[2] ? Math.min(Number(match[2]), end) : end
        }
        if (!match || (!match[1] && !match[2]) || !Number.isSafeInteger(start) ||
            !Number.isSafeInteger(end) || start > end || start >= total) {
          res.writeHead(416, { 'content-range': `bytes */${total}` }); res.end(); return
        }
        status = 206
        headers['content-range'] = `bytes ${start}-${end}/${total}`
      }
      headers['content-length'] = end - start + 1
      res.writeHead(status, headers)
      if (req.method === 'HEAD') { res.end(); return }
      const stream = createReadStream(file, { start, end })
      stream.on('error', error => res.destroy(error))
      res.on('close', () => stream.destroy())
      stream.pipe(res)
    },
  }))
}
