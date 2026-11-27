import { settingsControls } from './settings-css.mjs'

const HOSTS = 'codexhost-settings, [data-shortcut-modal="settings"] [class*="_host"], [data-codexhost-settings]'
const SCOPE = ':host-context(html:is([data-cx-ext-hdd-fairy-theme-dark],[data-cx-ext-hdd-fairy-theme-light])[data-hf-panel-settings="1"])'
const tokens = {
  bg: 'bg-recessed', sidebar: 'bg-recessed', panel: 'bg-surface', surface: 'bg-elevated',
  'surface-hover': 'bg-elevated', inset: 'bg-recessed', text: 'text-primary', muted: 'text-muted',
  subtle: 'text-muted', border: 'border-subtle', divider: 'border-subtle', hover: 'bg-elevated',
  active: 'bg-elevated', focus: 'accent', primary: 'accent', 'primary-hover': 'accent-strong',
  'primary-text': 'accent-contrast', warning: 'accent', 'warning-bg': 'bg-recessed',
  'warning-border': 'accent', danger: 'danger', 'danger-bg': 'bg-recessed',
  'danger-border': 'danger', success: 'success',
}
const CSS = `
${SCOPE} { ${Object.entries(tokens).map(([key, token]) => `--settings-${key}:var(--hf-settings-${token}) !important;`).join('')} font-family:var(--hf-font-ui) !important; font-synthesis-weight:none; }
${SCOPE} :is(.settings-status-row, .settings-update-panel, .settings-card) { background:var(--hf-settings-bg-surface); color:var(--hf-settings-text-primary); border:1px solid var(--hf-settings-border-subtle); border-radius:var(--hf-settings-radius-card); }
${SCOPE} :is(code, pre, .settings-command, .settings-version) { font-family:var(--hf-font-mono); font-variant-numeric:tabular-nums; }
${settingsControls(SCOPE)}
`

export function mountSettingsShadowBridge(api, getSettings) {
  const styles = new Map()
  let timer = null
  let disposed = false
  const clear = () => {
    clearInterval(timer)
    timer = null
    for (const style of styles.values()) style.remove()
    styles.clear()
  }
  const reconcile = () => {
    const settings = getSettings()
    if (disposed || !settings.enableWebTheme || !settings.panelSettingsEnabled) {
      clear()
      return
    }
    const hosts = [...(document.querySelectorAll?.(HOSTS) ?? [])]
    for (const [host, style] of styles) {
      if (!hosts.includes(host)) {
        style.remove()
        styles.delete(host)
      }
    }
    for (const host of hosts) {
      const shadow = host.shadowRoot
      if (!shadow) continue
      let style = styles.get(host)
      if (!style) {
        style = document.createElement('style')
        style.dataset.hfShadowBridge = 'settings'
        style.textContent = CSS
        styles.set(host, style)
      }
      if (style.parentNode !== shadow) shadow.append(style)
    }
    // attachShadow and replaceChildren do not notify the document observer.
    if (hosts.length && !timer) timer = setInterval(reconcile, 500)
    else if (!hosts.length) {
      clearInterval(timer)
      timer = null
    }
  }
  const dispose = () => { disposed = true; clear() }
  api.track(dispose)
  return { reconcile, dispose }
}
