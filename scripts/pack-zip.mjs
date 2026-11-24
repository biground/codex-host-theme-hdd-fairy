// Zero-dependency ZIP packager for CodexHost manifestVersion: 2 extensions.
// Produces a standard UTF-8 ZIP with manifest.json at the archive root.
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { crc32, deflateRawSync } from 'node:zlib'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const INCLUDE_ROOT_FILES = [
  'manifest.json',
  'README.md',
  'CREDITS.md',
  'LICENSE',
  'NOTICE-fairy-dsh.md',
]
const INCLUDE_DIRS = [
  'shared',
  'page',
  'widget',
  'web',
  'assets',
  'licenses',
]
const INCLUDE_SCREENSHOTS_FROM_MANIFEST = true

function walkDir(dir, prefix, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name)
    const rel = `${prefix}/${entry.name}`
    if (entry.isDirectory()) walkDir(full, rel, out)
    else if (entry.isFile()) out.set(rel, readFileSync(full))
  }
}

export function buildZip(entriesMap) {
  const localParts = []
  const centralParts = []
  let offset = 0
  const sorted = [...entriesMap.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))

  for (const [name, data] of sorted) {
    const nameBytes = Buffer.from(name, 'utf8')
    const crc = crc32(data) >>> 0
    const deflated = deflateRawSync(data, { level: 9 })
    const useDeflate = deflated.length < data.length
    const method = useDeflate ? 8 : 0
    const body = useDeflate ? deflated : data
    const flags = 0x0800 // UTF-8 filename

    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(flags, 6)
    local.writeUInt16LE(method, 8)
    local.writeUInt16LE(0, 10)
    local.writeUInt16LE(0x5421, 12) // fixed deterministic DOS date
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(body.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(nameBytes.length, 26)
    local.writeUInt16LE(0, 28)

    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(20, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(flags, 8)
    central.writeUInt16LE(method, 10)
    central.writeUInt16LE(0, 12)
    central.writeUInt16LE(0x5421, 14)
    central.writeUInt32LE(crc, 16)
    central.writeUInt32LE(body.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(nameBytes.length, 28)
    central.writeUInt16LE(0, 30)
    central.writeUInt16LE(0, 32)
    central.writeUInt16LE(0, 34)
    central.writeUInt16LE(0, 36)
    central.writeUInt32LE(0, 38)
    central.writeUInt32LE(offset, 42)

    localParts.push(local, nameBytes, body)
    centralParts.push(central, nameBytes)
    offset += local.length + nameBytes.length + body.length
  }

  const centralBuf = Buffer.concat(centralParts)
  const eocd = Buffer.alloc(22)
  eocd.writeUInt32LE(0x06054b50, 0)
  eocd.writeUInt16LE(0, 4)
  eocd.writeUInt16LE(0, 6)
  eocd.writeUInt16LE(sorted.length, 8)
  eocd.writeUInt16LE(sorted.length, 10)
  eocd.writeUInt32LE(centralBuf.length, 12)
  eocd.writeUInt32LE(offset, 16)
  eocd.writeUInt16LE(0, 20)

  return Buffer.concat([...localParts, centralBuf, eocd])
}

export function collectExtensionFiles(rootDir = ROOT) {
  const manifest = JSON.parse(readFileSync(path.join(rootDir, 'manifest.json'), 'utf8'))
  const files = new Map()
  for (const name of INCLUDE_ROOT_FILES) {
    const full = path.join(rootDir, name)
    if (statSync(full, { throwIfNoEntry: false })?.isFile()) {
      files.set(name, readFileSync(full))
    }
  }
  for (const dir of INCLUDE_DIRS) {
    const full = path.join(rootDir, dir)
    if (statSync(full, { throwIfNoEntry: false })?.isDirectory()) {
      walkDir(full, dir, files)
    }
  }
  if (INCLUDE_SCREENSHOTS_FROM_MANIFEST && Array.isArray(manifest.screenshots)) {
    for (const rel of manifest.screenshots) {
      files.set(rel, readFileSync(path.join(rootDir, rel)))
    }
  }
  return { manifest, files }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { manifest, files } = collectExtensionFiles(ROOT)
  const outArg = process.argv[2]
  const outDir = outArg ? path.resolve(outArg) : path.resolve(ROOT, '../output/fairy')
  mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, `${manifest.id}-${manifest.version}.zip`)
  const zip = buildZip(files)
  writeFileSync(outFile, zip)
  console.log(JSON.stringify({
    id: manifest.id,
    version: manifest.version,
    files: files.size,
    bytes: zip.length,
    output: outFile,
  }, null, 2))
}
