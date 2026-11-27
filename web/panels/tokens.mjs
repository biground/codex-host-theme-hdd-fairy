// Semantic colors follow 005/DESIGN_SPEC and the existing usage panel palette.
const PRESETS = {
  amber: {
    'bg-canvas': '#0b0c0f',
    'bg-shell': 'linear-gradient(180deg, #18181b 0%, #111114 100%)',
    'bg-surface': 'linear-gradient(165deg, #1d1d21, #141417)',
    'bg-recessed': '#0c0c0e',
    'bg-elevated': '#222227',
    'border-subtle': '#2e2d28',
    'border-strong': '#45433b',
    accent: '#f8cb29',
    'accent-strong': '#ff9e1a',
    'accent-contrast': '#161308',
    'accent-fill': 'linear-gradient(100deg, #ff9e1a 0%, #f8cb29 56%, #eeb418 100%)',
    danger: '#ff5d3a',
    success: '#3ef0b0',
    info: '#f2d46b',
    'text-primary': '#f4f1e8',
    'text-muted': '#9a968c',
    'hazard-stripe': 'repeating-linear-gradient(-55deg, #f8cb29 0 6px, #141416 6px 12px)',
    'hazard-danger': 'repeating-linear-gradient(-55deg, #ff5d3a 0 6px, #141416 6px 12px)',
    'radius-panel': '20px 6px 20px 20px',
    'radius-card': '14px 4px 14px 14px',
    'shadow-card': '0 22px 48px rgba(0,0,0,0.72), 0 0 0 1px #070708',
    'shadow-key': '0 2.5px 0 #09090b, inset 0 1px 0 rgba(255,255,255,0.08)',
  },
  street: {
    'bg-canvas': '#0c0e12',
    'bg-shell': '#111317',
    'bg-surface': '#1a1d24',
    'bg-recessed': '#08090c',
    'bg-elevated': '#222630',
    'border-subtle': '#363a42',
    'border-strong': '#050507',
    accent: '#c8ff00',
    'accent-strong': '#d8ff52',
    'accent-contrast': '#090b05',
    'accent-fill': '#c8ff00',
    danger: '#ff4f5e',
    success: '#8df43e',
    info: '#eef1f6',
    'text-primary': '#eef1f6',
    'text-muted': '#9ba2b0',
    'hazard-stripe': 'repeating-linear-gradient(-55deg, #c8ff00 0 8px, #0a0b0e 8px 15px)',
    'hazard-danger': 'repeating-linear-gradient(-55deg, #ff4f5e 0 8px, #0a0b0e 8px 15px)',
    'radius-panel': '22px 6px 22px 6px',
    'radius-card': '14px 4px 14px 4px',
    'shadow-card': '5px 5px 0 #c8ff00, 0 20px 44px rgba(0,0,0,0.72)',
    'shadow-key': '0 2.5px 0 #050507',
  },
  archive: {
    'bg-canvas': '#f3f5f9',
    'bg-shell': '#eceff5',
    'bg-surface': '#ffffff',
    'bg-recessed': '#e5e9f2',
    'bg-elevated': '#f7f9fc',
    'border-subtle': '#cfd7e6',
    'border-strong': '#1b2436',
    accent: '#2455e7',
    'accent-strong': '#1b44c8',
    'accent-contrast': '#ffffff',
    'accent-fill': '#2455e7',
    danger: '#dc2626',
    success: '#0d9f6e',
    info: '#2455e7',
    'text-primary': '#14171f',
    'text-muted': '#556070',
    'hazard-stripe': 'repeating-linear-gradient(-55deg, #2455e7 0 7px, #111827 7px 14px)',
    'hazard-danger': 'repeating-linear-gradient(-55deg, #dc2626 0 7px, #111827 7px 14px)',
    'radius-panel': '22px',
    'radius-card': '14px',
    'shadow-card': '0 14px 32px rgba(15,23,42,0.12), 0 0 0 1.5px rgba(36,85,231,0.22)',
    'shadow-key': '0 2px 0 #b8c2d6',
  },
}

const ROOT = 'html:is([data-cx-ext-hdd-fairy-theme-dark],[data-cx-ext-hdd-fairy-theme-light])'
const SCOPES = {
  shell: '[data-cx-region="sidebar"], [data-cx-region="header"], [data-hf-token-scope="shell"]',
  chat: '[data-conversation-content], [data-hf-token-scope="chat"]',
  composer: '[data-composer-card], [data-queue-dock], [data-hf-token-scope="composer"]',
  rightbar: '[data-sidebar-right-panel], [data-hf-token-scope="rightbar"]',
  settings: '[data-shortcut-modal="settings"], [data-shortcut-modal="shortcuts"], [data-plugin-panel], [data-web-extensions], [data-hf-token-scope="settings"]',
}
const declarations = (tokens, prefix = '--hf-') => Object.entries(tokens).map(([key, value]) => `${prefix}${key}:${value};`).join('')

// Each panel gets namespaced variables on html for portals and shadow bridges.
// Local scopes alias them back to --hf-*; independent presets never compete on html.
// Wave 2 may use data-hf-token-scope on owned mounts or --hf-{panel}-* directly.
export const TOKENS_CSS = `
${ROOT} {
  --hf-font-ui: "Microsoft YaHei UI", "Microsoft YaHei", "微软雅黑", "PingFang SC", "Noto Sans SC", system-ui, sans-serif;
  --hf-font-mono: "Cascadia Code", "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
  ${declarations(PRESETS.amber)}
}
${Object.entries(PRESETS).map(([preset, tokens]) => `
${ROOT}[data-cx-ext-hdd-fairy-preset="${preset}"] {${declarations(tokens)}}
${Object.keys(SCOPES).map((panel) => `${ROOT}[data-hf-panel-${panel}="1"][data-hf-preset-${panel}="${preset}"] {${declarations(tokens, `--hf-${panel}-`)}}`).join('\n')}
`).join('\n')}
${Object.entries(SCOPES).map(([panel, scope]) => `
${ROOT}[data-hf-panel-${panel}="1"] :is(${scope}) {
  ${Object.keys(PRESETS.amber).map((key) => `--hf-${key}:var(--hf-${panel}-${key});`).join('')}
}`).join('\n')}
`
