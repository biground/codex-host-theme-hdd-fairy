// H.D.D geometric line icons, shared by all extension surfaces.
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${body}</svg>`

export const HDD_ICONS = Object.freeze({
  spark: svg('<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/>'),
  sliders: svg('<path d="M5 3v4m0 4v10M12 3v10m0 4v4M19 3v2m0 4v12M2 7h6v4H2ZM9 13h6v4H9ZM16 5h6v4h-6Z"/>'),
  eye: svg('<path d="m2 12 5-6h10l5 6-5 6H7Z"/><circle cx="12" cy="12" r="3"/>'),
  'eye-off': svg('<path d="m3 3 18 18M7 6H17l5 6-3 4M15 18H7l-5-6 3-4M10 10a3 3 0 0 0 4 4"/>'),
  move: svg('<path d="M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4"/>'),
  refresh: svg('<path d="M20 4v6h-6M4 20v-6h6M20 10a8 8 0 0 0-14-4M4 14a8 8 0 0 0 14 4"/>'),
  reset: svg('<path d="M3 3v6h6M3 9a9 9 0 1 1 0 6M12 7v5l3 3"/>'),
  play: svg('<path d="m7 3 14 9-14 9Z"/>'),
  stop: svg('<path d="M5 5h14v14H5Z"/>'),
  send: svg('<path d="m3 3 19 9-19 9 3-9ZM6 12h16"/>'),
  'chevron-up': svg('<path d="m5 16 7-8 7 8"/>'),
  'chevron-down': svg('<path d="m5 8 7 8 7-8"/>'),
  'chevron-right': svg('<path d="m8 5 8 7-8 7"/>'),
  check: svg('<path d="m4 12 5 6L20 6"/>'),
  x: svg('<path d="m5 5 14 14M19 5 5 19"/>'),
  alert: svg('<path d="m12 3 10 18H2ZM12 9v5m0 3v1"/>'),
  shield: svg('<path d="m12 2 9 4v8l-4 5-5 3-5-3-4-5V6ZM8 12l3 3 5-6"/>'),
  terminal: svg('<path d="M3 4h18v16H3Zm4 5 3 3-3 3m6 0h4"/>'),
  folder: svg('<path d="M2 6h8l2-3h8l2 3v14H2ZM2 8h20"/>'),
  'file-code': svg('<path d="M5 2h10l4 4v16H5ZM15 2v5h4m-9 4-3 3 3 3m4-6 3 3-3 3"/>'),
  search: svg('<circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/>'),
  puzzle: svg('<path d="M3 3h6a3 3 0 1 1 6 0h6v6a3 3 0 1 0 0 6v6h-6a3 3 0 1 0-6 0H3v-6a3 3 0 1 0 0-6Z"/>'),
  keyboard: svg('<path d="M2 5h20v14H2ZM6 9h1m4 0h1m4 0h2M6 12h1m4 0h1m4 0h2M7 16h10"/>'),
  globe: svg('<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2l4 5v10l-4 5-4-5V7Z"/>'),
  layers: svg('<path d="m2 7 10-5 10 5-10 5ZM2 12l10 5 10-5M2 17l10 5 10-5"/>'),
  cpu: svg('<path d="M5 5h14v14H5ZM9 9h6v6H9ZM9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3"/>'),
  activity: svg('<path d="M2 12h5l3-9 4 18 3-9h5"/>'),
  pin: svg('<path d="m8 2 8 0-1 6 4 5v2H5v-2l4-5ZM12 15v7"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>'),
  radio: svg('<circle cx="12" cy="12" r="2"/><path d="M7 7a7 7 0 0 0 0 10M17 7a7 7 0 0 1 0 10M4 4a11 11 0 0 0 0 16M20 4a11 11 0 0 1 0 16"/>'),
  'layout-sidebar': svg('<path d="M3 3h18v18H3ZM9 3v18M5 7h2m-2 4h2m-2 4h2"/>'),
  'message-square': svg('<path d="M3 3h18v14H9l-6 5ZM7 8h10M7 12h7"/>'),
  command: svg('<path d="M8 8H5a3 3 0 1 1 3-3v14a3 3 0 1 1-3-3h14a3 3 0 1 1-3 3V5a3 3 0 1 1 3 3Z"/>'),
  'preset-amber': svg('<path d="M3 4h15l3 3v13H6l-3-3ZM3 9h18M7 9l4-5m2 5 4-5M7 14h4v3H7Zm8 0h2"/>'),
  'preset-street': svg('<path d="m5 3 17 2-3 16-17-2ZM6 9l4-3m-5 8 9-8m-3 12 7-7"/>'),
  'preset-archive': svg('<path d="M4 3h16v18H4ZM4 8h16M8 12h8M8 16h5M8 3v5"/>'),
})

const escape = (value) => String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch])

export function renderHddIcon(name, { size = 16, className = '', title = '' } = {}) {
  return HDD_ICONS[name].replace('>', ` width="${escape(size)}" height="${escape(size)}" class="${escape(className)}"${title ? ' role="img"' : ''}>${title ? `<title>${escape(title)}</title>` : ''}`)
}
