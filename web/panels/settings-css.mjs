import { renderHddIcon } from '../../shared/hdd-icons.mjs'

const GATE = 'html:is([data-cx-ext-hdd-fairy-theme-dark],[data-cx-ext-hdd-fairy-theme-light])[data-hf-panel-settings="1"]'
const MODAL_NEW = '[role="dialog"][class*="_addModal"], [role="dialog"][class*="_syncMeshModal"], [role="dialog"][class*="_confirm"]:has(button[class*="_dangerConfirm"]), [role="dialog"][class*="_dialog"]:has([class*="_headerLead"]), [role="dialog"]:has(> [data-web-extension-detail]), [role="dialog"][class*="_dialog"]:has(ol[class*="_steps"] + div[class*="_field"] textarea[class*="_textarea"])'
const IMPORT_PAGE = 'div[class*="_page"]:has(> div[class*="_inner"] > header[class*="_header"])'
const SURFACES = `[data-shortcut-modal="settings"], [data-shortcut-modal="shortcuts"], [data-plugin-panel], [data-web-extensions], [class*="_installDialog"], [role="dialog"]:has([data-install-guide]), [role="dialog"]:has([class*="_modeTabs"]), ${IMPORT_PAGE}, [data-connect-devices], [data-remote-peers-panel], ${MODAL_NEW}`
const S = `${GATE} :is(${SURFACES})`
const arrow = `url("data:image/svg+xml,${encodeURIComponent(renderHddIcon('chevron-down').replace('currentColor', '#84877d'))}")`

// Reuse the same mechanical controls inside the open settings ShadowRoot.
export const settingsControls = (scope) => `
${scope} :is(button, input, select, textarea) { font:inherit; font-variant-numeric:tabular-nums; }
${scope} :is(button, input, select, textarea, a):focus-visible { outline:2px solid var(--hf-settings-accent); outline-offset:3px; }
${scope} :is(button, input, select):disabled { opacity:.48; cursor:not-allowed; }
${scope} :is(button[role="switch"], input[role="switch"]) { position:relative; appearance:none; flex:none; box-sizing:border-box; width:44px; height:24px; padding:0; border:1.5px solid var(--hf-settings-border-strong); border-radius:7px; background:var(--hf-settings-bg-recessed); cursor:pointer; }
${scope} :is(button[role="switch"], input[role="switch"])::after { content:""; position:absolute; top:2px; left:2px; width:18px; height:17px; border-radius:4px; background:linear-gradient(90deg, transparent 45%, var(--hf-settings-bg-recessed) 45% 55%, transparent 55%), var(--hf-settings-text-muted); transition:transform .16s; }
${scope} :is([role="switch"][aria-checked="true"], input[role="switch"]:checked) { background:var(--hf-settings-accent-fill); border-color:var(--hf-settings-accent); }
${scope} :is([role="switch"][aria-checked="true"], input[role="switch"]:checked)::after { transform:translateX(19px); background:linear-gradient(90deg, transparent 45%, var(--hf-settings-accent) 45% 55%, transparent 55%), var(--hf-settings-accent-contrast); }
${scope} button[role="switch"] > * { visibility:hidden; }
${scope} input[type="range"] { appearance:none; height:8px; border:1px solid var(--hf-settings-border-strong); border-radius:3px; background:repeating-linear-gradient(90deg, var(--hf-settings-border-strong) 0 1px, transparent 1px 10%), var(--hf-settings-bg-recessed); accent-color:var(--hf-settings-accent); }
${scope} input[type="range"]::-webkit-slider-thumb { appearance:none; width:16px; height:22px; border:2px solid #141416; border-radius:4px; background:var(--hf-settings-accent-fill); cursor:ew-resize; }
${scope} input[type="range"]::-moz-range-thumb { width:12px; height:18px; border:2px solid #141416; border-radius:4px; background:var(--hf-settings-accent-fill); }
${scope} :is(select, button[aria-haspopup="listbox"]) { min-height:36px; padding:0 32px 0 12px; appearance:none; background:${arrow} right 10px center / 14px no-repeat, var(--hf-settings-bg-recessed); color:var(--hf-settings-text-primary); border:1.5px solid var(--hf-settings-border-strong); border-radius:8px 3px 8px 8px; }
${scope} [role="tablist"] { padding:3px; border:1.5px solid var(--hf-settings-border-subtle); border-radius:8px; background:var(--hf-settings-bg-recessed); }
${scope} [role="tablist"] [class*="_indicator"] { background:var(--hf-settings-accent-fill); border-radius:5px; }
${scope} [role="tab"] { color:var(--hf-settings-text-muted); font-weight:700; }
${scope} [role="tab"]:is([aria-selected="true"], [data-active="true"]) { background:var(--hf-settings-accent-fill); color:var(--hf-settings-accent-contrast); font-weight:800; border-radius:5px; }
${scope} :is(input:not([type="range"]):not([role="switch"]):not([type="checkbox"]):not([type="radio"]), textarea) { box-sizing:border-box; min-height:38px; max-width:100%; padding:8px 12px; background:var(--hf-settings-bg-recessed); color:var(--hf-settings-text-primary); border:1.5px solid var(--hf-settings-border-strong); border-radius:8px 3px 8px 8px; box-shadow:inset 0 1px 2px #0003; }
${scope} :is([class*="_searchBox"] input, input[class*="_searchInput"]) { padding-left:34px !important; }
${scope} label[class*="_searchField"] input[class*="_search"] { padding-left:40px !important; }
${scope} [aria-invalid="true"] { border-color:var(--hf-settings-danger) !important; }
${scope} :is([class*="_error"], [class*="_invalid"], [role="alert"]) { color:var(--hf-settings-danger); }
${scope} :is([class*="_badges"], [class*="_statusTag"], .settings-badge) { color:var(--hf-settings-accent); font-variant-numeric:tabular-nums; }
${scope} :is(button[class*="_save"], .settings-command-button) { padding:7px 12px; border:1px solid var(--hf-settings-accent); border-radius:8px 3px 8px 8px; background:var(--hf-settings-accent-fill); color:var(--hf-settings-accent-contrast); font-weight:700; }
${scope} :is([class*="_danger"]:not(button), [class*="_stopRow"], .settings-danger, [data-install-approval]) { padding:12px; border:1.5px solid var(--hf-settings-danger); border-radius:8px; background:var(--hf-settings-hazard-danger) top / 100% 3px no-repeat, color-mix(in srgb, var(--hf-settings-danger) 6%, transparent); }
${scope} :is([class*="_danger"]:not(button), [class*="_stopRow"], .settings-danger) button { color:var(--hf-settings-danger); border-color:var(--hf-settings-danger); }
${scope} kbd:not([class*="_separator"]) { display:inline-flex; align-items:center; justify-content:center; min-width:24px; height:24px; padding:0 7px; font:700 11.5px var(--hf-font-mono); background:var(--hf-settings-bg-elevated); color:var(--hf-settings-text-primary); border:1px solid var(--hf-settings-border-strong); border-bottom-width:3px; border-radius:5px; box-shadow:var(--hf-settings-shadow-key); }
${scope} kbd:not([class*="_separator"]):first-child { color:var(--hf-settings-accent); }
${scope} kbd[class*="_separator"] { background:none; border:0; box-shadow:none; opacity:.55; }
${scope} [class*="_recorder"] { border:1.5px dashed var(--hf-settings-accent); background:var(--hf-settings-bg-recessed); }
`

export const SETTINGS_PANEL_CSS = `
${GATE} :is([class*="_overlay"], [class*="_mask"]):has(> [data-shortcut-modal]) { background:#040508b8; backdrop-filter:blur(8px); }
${GATE} [class*="_root"]:has(> :is(${MODAL_NEW})) > [class*="_mask"]::after { background:#040508b8; }
${GATE} :is([data-shortcut-modal="settings"], [data-shortcut-modal="shortcuts"], [class*="_installDialog"], [role="dialog"]:has([data-install-guide]), [role="dialog"]:has([class*="_modeTabs"]), ${MODAL_NEW}) { position:relative; overflow:hidden; background:var(--hf-settings-bg-shell); color:var(--hf-settings-text-primary); border:2px solid var(--hf-settings-border-strong); border-radius:var(--hf-settings-radius-panel); box-shadow:var(--hf-settings-shadow-card); }
${GATE} :is([data-shortcut-modal], [data-plugin-panel], ${MODAL_NEW})::before { content:""; position:absolute; top:0; left:0; right:0; height:4px; z-index:2; pointer-events:none; background:var(--hf-settings-hazard-stripe); }
${GATE} [role="dialog"][class*="_confirm"]:has(button[class*="_dangerConfirm"])::before { background:var(--hf-settings-hazard-danger); }
${GATE} [data-shortcut-modal="settings"] { width:min(1040px, calc(100vw - 48px)); max-width:100%; height:min(800px, calc(100dvh - 48px)); max-height:100%; }
${GATE} [data-plugin-panel] { position:relative; max-width:960px; padding:20px; background:var(--hf-settings-bg-shell); border:2px solid var(--hf-settings-border-strong); border-radius:var(--hf-settings-radius-panel); }
${GATE} [data-web-extensions] [class*="_grid"], ${GATE} [data-plugin-panel] ul[class*="_cards"] { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
${S} {
  color:var(--hf-settings-text-primary); font-family:var(--hf-font-ui); font-synthesis-weight:none; font-variant-numeric:tabular-nums;
  & nav[class*="_nav"] { width:204px; flex:none; background:var(--hf-settings-bg-recessed); border-right:1px solid var(--hf-settings-border-subtle); }
  & :is([class*="_navTitle"], [class*="_groupTitle"], h3) { font-weight:700; color:var(--hf-settings-text-muted); }
  & button[class*="_navCell"] { min-height:40px; color:var(--hf-settings-text-muted); border-radius:9px; font-weight:700; }
  & button[class*="_navCell"]:hover { background:var(--hf-settings-bg-elevated); }
  & button[aria-current="true"] { background:var(--hf-settings-accent-fill); color:var(--hf-settings-accent-contrast); box-shadow:inset 3px 0 var(--hf-settings-accent); }
  & :is([class*="_header"], [class*="_pageHead"]) { border-bottom:1px solid var(--hf-settings-border-subtle); }
  & :is(button[class*="_close"], button[class*="_reset"]) { padding:6px; border:1.5px solid var(--hf-settings-border-strong); border-radius:8px 3px 8px 8px; background:var(--hf-settings-bg-elevated); color:var(--hf-settings-text-primary); }
  & button[class*="_close"]:hover { border-color:var(--hf-settings-danger); color:var(--hf-settings-danger); }
  & button[class*="_primary"]:not([class*="_dangerConfirm"]) { border:1px solid var(--hf-settings-accent); border-radius:8px 3px 8px 8px; background:var(--hf-settings-accent-fill); color:var(--hf-settings-accent-contrast); font-weight:700; }
  & button[class*="_outline"]:not([class*="_dangerOutline"]):not([class*="_dangerButton"]) { border:1.5px solid var(--hf-settings-border-strong); border-radius:8px 3px 8px 8px; background:var(--hf-settings-bg-elevated); color:var(--hf-settings-text-primary); font-weight:600; }
  & button[class*="_outline"]:not([class*="_dangerOutline"]):not([class*="_dangerButton"]):hover:not(:disabled) { border-color:var(--hf-settings-accent); color:var(--hf-settings-accent); }
  & :is([class$="_card"], [class*="_card "], [class*="_card_"], [class*="_manage"], [data-connect-route], [data-plugin-config], [data-plugin-source]) { background:var(--hf-settings-bg-surface); color:var(--hf-settings-text-primary); border-color:var(--hf-settings-border-subtle); border-radius:var(--hf-settings-radius-card); }
  & :is([class*="_item"], [class*="_field"]) + :is([class*="_item"], [class*="_field"]) { border-top-color:var(--hf-settings-border-subtle); }
  & :is([data-connect-route]:has(input:checked), [data-connect-route][data-selected="true"], [data-connect-route][data-active="true"]) { border-color:var(--hf-settings-accent); background:var(--hf-settings-bg-elevated); box-shadow:inset 3.5px 0 var(--hf-settings-accent); }
  & :is(span[class*="_qrFrame"], span[class*="_apkQrFrame"]) { background:#fff; border:2px solid var(--hf-settings-accent); border-radius:10px; }
  & div[class*="_scan"] { border-right-color:var(--hf-settings-border-subtle); }
  & div[class*="_qrPlaceholder"] { background:var(--hf-settings-bg-recessed); border:1.5px dashed var(--hf-settings-border-strong); color:var(--hf-settings-text-muted); }
  & :is(li[data-plugin-package], li[data-plugin-item], [data-web-extension]) { padding:16px; background:var(--hf-settings-bg-surface); border:1.5px solid var(--hf-settings-border-subtle); border-radius:var(--hf-settings-radius-card); }
  & :is([data-plugin-status="running"], [data-web-extension]:has([aria-checked="true"])) { box-shadow:inset 3.5px 0 var(--hf-settings-accent); }
  & [data-plugin-status="problem"] { border-color:var(--hf-settings-danger); }
  & :is([class*="_cardIcon"], [class*="_artwork"], [data-icon-kind]) { width:48px; height:48px; border:1px solid var(--hf-settings-border-strong); border-radius:12px 4px 12px 12px; background:var(--hf-settings-bg-recessed); }
  & [class*="_cardDesc"] { color:var(--hf-settings-text-muted); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  & :is(li[data-plugin-package], [data-web-extension]) button[role="switch"] { z-index:2; }
  & :is([class*="_recovery"], [data-web-extensions-notice], [class*="_safeMode"], [class*="_safeNotice"], [class*="_installSafety"], [class*="_trustBanner"], [class*="_banner"][data-tone="warning"]) { padding:14px 16px; background:var(--hf-settings-hazard-stripe) top / 100% 3px no-repeat, var(--hf-settings-bg-recessed); border:1px solid var(--hf-settings-accent); border-left:5px solid var(--hf-settings-accent); border-radius:8px; color:var(--hf-settings-text-primary); }
  & a[href="/?extensions=off"] { color:var(--hf-settings-accent); font-weight:700; }
  & :is([data-install-guide], fieldset[data-install-registry], [class*="_dropzone"]) { padding:16px; background:var(--hf-settings-bg-recessed); border:1.5px dashed var(--hf-settings-border-strong); border-radius:var(--hf-settings-radius-card); }
  & [class*="_dropzone"][data-dragging="true"], & :is([data-install-guide], fieldset[data-install-registry], [class*="_dropzone"]):focus-within { border-color:var(--hf-settings-accent); }
  & :is([data-install-phase], pre, code, [data-plugin-source], input[data-modal-autofocus]) { font-family:var(--hf-font-mono); }
  & [data-install-phase] { padding:14px; border:1px solid var(--hf-settings-border-subtle); background:var(--hf-settings-bg-recessed); border-radius:8px; }
  /* ConnectionCard & MobileGuideCard */
  & section[class*="_connectionCard"] { background:var(--hf-settings-bg-surface); border:1.5px solid var(--hf-settings-border-strong); border-radius:var(--hf-settings-radius-card); }
  & div[class*="_methodBar"] { background:var(--hf-settings-bg-recessed); border-bottom:1px solid var(--hf-settings-border-subtle); }
  & span[class*="_status"]:not([class*="_statusBadge"]):not([class*="_statusTag"]) { background:var(--hf-settings-bg-recessed); border:1px solid var(--hf-settings-border-strong); color:var(--hf-settings-text-primary); font-family:var(--hf-font-mono); font-weight:700; }
  & span[class*="_status"]:not([class*="_statusBadge"]):not([class*="_statusTag"])[data-active="true"] { border-color:var(--hf-settings-success); color:var(--hf-settings-success); }
  & span[class*="_status"]:not([class*="_statusBadge"]):not([class*="_statusTag"])[data-active="true"]::before { background:var(--hf-settings-success); }
  & div[class*="_subRoutes"] { background:var(--hf-settings-bg-recessed); border:1px solid var(--hf-settings-border-subtle); border-radius:8px; }
  & :is(span[class$="_badge"], span[class*="_badge "], span[class*="_badge_"], span[class*="_activeBadge"]) { border-radius:5px 2px 5px 5px; border:1px solid var(--hf-settings-border-strong); background:var(--hf-settings-bg-recessed); color:var(--hf-settings-text-muted); font-weight:700; }
  & span[class*="_activeBadge"] { border-color:var(--hf-settings-success); color:var(--hf-settings-success); background:color-mix(in srgb, var(--hf-settings-success) 12%, transparent); }
  & button[class*="_addressTrigger"] { background:var(--hf-settings-bg-recessed); border:1.5px solid var(--hf-settings-border-strong); border-radius:8px 3px 8px 8px; color:var(--hf-settings-text-primary); font-family:var(--hf-font-mono); }
  & div[class*="_relayPreview"] { background:var(--hf-settings-bg-recessed); border:1px dashed var(--hf-settings-border-strong); border-radius:8px; font-family:var(--hf-font-mono); }
  & p[class*="_ready"] svg { color:var(--hf-settings-success); }
  & :is(div[class*="_moreMethods"], details[class*="_other"]) { background:var(--hf-settings-bg-recessed); border-color:var(--hf-settings-border-subtle); border-radius:var(--hf-settings-radius-card); }
  & details[class*="_other"] summary { color:var(--hf-settings-text-muted); font-weight:700; }
  & details[class*="_other"] summary:hover { color:var(--hf-settings-accent); }
  & div[class*="_manageRow"] + div[class*="_manageRow"] { border-top-color:var(--hf-settings-border-subtle); }
  & :is(button[class*="_dangerOutline"], button[class*="_dangerButton"]) { border:1.5px solid var(--hf-settings-danger); border-radius:8px 3px 8px 8px; color:var(--hf-settings-danger); background:color-mix(in srgb, var(--hf-settings-danger) 10%, var(--hf-settings-bg-recessed)); font-weight:700; }
  & div[class*="_mobileCard"][data-mobile-guide] { background:var(--hf-settings-bg-surface); border:1.5px solid var(--hf-settings-border-subtle); border-top:2.5px solid var(--hf-settings-accent); border-radius:var(--hf-settings-radius-card); }
  & span[class*="_mobileCardTitle"] { color:var(--hf-settings-text-primary); font-weight:800; }
  & a[class*="_downloadLink"] { border:1px solid var(--hf-settings-accent); border-radius:8px 3px 8px 8px; background:var(--hf-settings-accent-fill); color:var(--hf-settings-accent-contrast); font-weight:700; }
  & div[class*="_apkQrPanel"] { border-top-color:var(--hf-settings-border-subtle); }
  & ol[class*="_mobileSteps"] { color:var(--hf-settings-text-muted); }
  & ol[class*="_mobileSteps"] li::marker { color:var(--hf-settings-accent); font-weight:700; }
  ${settingsControls('&')}
}
/* ImportPage */
${GATE} ${IMPORT_PAGE} {
  background:var(--hf-settings-bg-canvas);
  & > div[class*="_inner"] { position:relative; overflow:hidden; padding:24px; background:var(--hf-settings-bg-shell); border:2px solid var(--hf-settings-border-strong); border-radius:var(--hf-settings-radius-panel); box-shadow:var(--hf-settings-shadow-card); }
  & > div[class*="_inner"]::before { content:""; position:absolute; top:0; left:0; right:0; height:4px; pointer-events:none; background:var(--hf-settings-hazard-stripe); }
  & header[class*="_header"] { padding-bottom:14px; }
  & h1[class*="_title"] { color:var(--hf-settings-text-primary); font-weight:800; }
  & p[class*="_subtitle"] { color:var(--hf-settings-text-muted); }
  & div[class*="_tabs"][role="tablist"] { display:inline-flex; flex-wrap:wrap; width:fit-content; max-width:100%; padding:8px; gap:6px; }
  & button[class*="_tab"][role="tab"] { border:1px solid var(--hf-settings-border-subtle); border-radius:7px 2px 7px 7px; background:var(--hf-settings-bg-elevated); color:var(--hf-settings-text-primary); }
  & button[class*="_tab"][role="tab"]:hover { border-color:var(--hf-settings-accent); }
  & button[class*="_tab"][role="tab"][data-active="true"] { border-color:var(--hf-settings-accent); background:var(--hf-settings-accent-fill); color:var(--hf-settings-accent-contrast); font-weight:800; }
  & label[class*="_searchField"] [class*="_searchIcon"] { color:var(--hf-settings-text-muted); }
  & div[class*="_callout"][data-tone="error"] { border:1.5px solid var(--hf-settings-danger); border-left:4px solid var(--hf-settings-danger); background:color-mix(in srgb, var(--hf-settings-danger) 10%, var(--hf-settings-bg-recessed)); color:var(--hf-settings-danger); border-radius:8px; }
  & ul[class*="_list"] { padding:6px; background:var(--hf-settings-bg-surface); border:1.5px solid var(--hf-settings-border-strong); border-radius:var(--hf-settings-radius-card); }
  & li[class*="_row"] { border-radius:9px 3px 9px 9px; }
  & li[class*="_row"] + li[class*="_row"]::before { border-top-color:var(--hf-settings-border-subtle); }
  & li[class*="_row"]:hover { background:var(--hf-settings-bg-elevated); box-shadow:inset 3px 0 var(--hf-settings-accent); }
  & div[class*="_rowTitle"] { color:var(--hf-settings-text-primary); font-weight:700; }
  & div[class*="_rowMeta"] { color:var(--hf-settings-text-muted); font-family:var(--hf-font-mono); }
  & div[class*="_empty"] { background:var(--hf-settings-bg-recessed); border:1.5px dashed var(--hf-settings-border-strong); border-radius:var(--hf-settings-radius-card); color:var(--hf-settings-text-muted); }
  & div[class*="_footer"] { padding-top:8px; border-top:1px solid var(--hf-settings-border-subtle); color:var(--hf-settings-text-muted); }
  & select[class*="_select"] { height:auto; min-height:32px; }
}
/* RemotePeersPanel & RemotePeerModals */
${GATE} [data-remote-peers-panel] {
  & :is(div[class*="_surface"], section[class*="_surface"]) { background:var(--hf-settings-bg-surface); border:1.5px solid var(--hf-settings-border-strong); border-radius:var(--hf-settings-radius-card); }
  & div[class*="_peerRow"] + div[class*="_peerRow"] { border-top-color:var(--hf-settings-border-subtle); }
  & div[class*="_peerRow"]:hover { background:var(--hf-settings-bg-elevated); }
  & div[class*="_peerRow"][data-peer-state="connected"] { box-shadow:inset 3px 0 var(--hf-settings-success); }
  & div[class*="_peerRow"][data-peer-state="connecting"] { box-shadow:inset 3px 0 var(--hf-settings-accent); }
  & div[class*="_peerRow"][data-peer-state="auth-error"] { box-shadow:inset 3px 0 var(--hf-settings-danger); }
  & span[class*="_peerName"] { color:var(--hf-settings-text-primary); font-weight:700; }
  & span[class*="_transportWord"] { padding:1px 6px; border:1px solid var(--hf-settings-border-subtle); border-radius:4px; background:var(--hf-settings-bg-recessed); color:var(--hf-settings-text-muted); font-family:var(--hf-font-mono); }
  & span[class*="_peerMeta"] { color:var(--hf-settings-text-muted); font-family:var(--hf-font-mono); }
  & span[class*="_stateText"][data-state="connecting"] { color:var(--hf-settings-accent); font-weight:700; }
  & span[class*="_stateText"][data-state="auth-error"] { color:var(--hf-settings-danger); font-weight:700; }
  & button[class*="_iconButton"] { border:1px solid var(--hf-settings-border-subtle); border-radius:7px 2px 7px 7px; background:var(--hf-settings-bg-elevated); color:var(--hf-settings-text-primary); }
  & button[class*="_iconButton"]:hover:not(:disabled) { border-color:var(--hf-settings-accent); color:var(--hf-settings-accent); }
  & div[class*="_errorRow"] { border:1.5px solid var(--hf-settings-danger); border-radius:var(--hf-settings-radius-card); background:color-mix(in srgb, var(--hf-settings-danger) 8%, var(--hf-settings-bg-recessed)); }
  & p[class*="_peerErrorNote"] { color:var(--hf-settings-danger); }
  & span[class*="_pairedBadge"] { border:1px solid color-mix(in srgb, var(--hf-settings-accent) 44%, transparent); border-radius:6px 2px 6px 6px; background:color-mix(in srgb, var(--hf-settings-accent) 14%, var(--hf-settings-bg-recessed)); color:var(--hf-settings-accent); font-weight:700; }
  /* v0.28.1 RemotePeersTopology */
  & section[class*="_topologyCard"] { background:radial-gradient(65% 90% at 15% 50%, color-mix(in srgb, var(--hf-settings-accent) 10%, transparent), transparent 72%), var(--hf-settings-bg-surface); border:1.5px solid var(--hf-settings-border-strong); border-radius:var(--hf-settings-radius-card); }
  & [class*="_topologyTitle"] { color:var(--hf-settings-text-primary); font-weight:800; }
  & [class*="_topologyOverflow"] { border:1px solid var(--hf-settings-border-subtle); background:var(--hf-settings-bg-recessed); color:var(--hf-settings-accent); font-family:var(--hf-font-mono); font-weight:700; }
  & [class*="_topologyLegend"] { color:var(--hf-settings-text-muted); }
  & [class*="_topologyLegendGlyph"] { color:var(--hf-settings-accent); font-weight:800; }
  & [class*="_topologyLegendGlyphMuted"] { color:var(--hf-settings-text-muted); }
  & button[class*="_topologyResetButton"] { border:1px solid var(--hf-settings-border-strong); border-radius:7px 2px 7px 7px; background:var(--hf-settings-bg-elevated); color:var(--hf-settings-text-primary); font-weight:700; }
  & button[class*="_topologyResetButton"]:hover { border-color:var(--hf-settings-accent); color:var(--hf-settings-accent); background:var(--hf-settings-bg-recessed); }
  & [class*="_topologyStage"] { background:radial-gradient(color-mix(in srgb, var(--hf-settings-border-strong) 42%, transparent) 1px, transparent 1px) 0 0 / 16px 16px; }
  & [class*="_topologyBeamGroup"] { --beam-rail:color-mix(in srgb, var(--hf-settings-text-muted) 34%, transparent); --beam-glow:var(--hf-settings-accent); --beam-chevron:var(--hf-settings-text-muted); }
  & [class*="_topologyBeamGroup"][data-mutual="true"] { --beam-rail:color-mix(in srgb, var(--hf-settings-accent) 42%, transparent); --beam-chevron:var(--hf-settings-accent); }
  & [class*="_topologyBeamGroup"]:is([data-highlighted="true"], [data-recent="true"]) { --beam-rail:color-mix(in srgb, var(--hf-settings-accent) 65%, transparent); --beam-chevron:var(--hf-settings-accent); }
  & [class*="_topologyPillNode"] { background:var(--hf-settings-bg-elevated); border:1.5px solid var(--hf-settings-border-strong); color:var(--hf-settings-text-primary); box-shadow:0 4px 12px rgba(0,0,0,.28); }
  & [class*="_topologyPillNode"]:is(:hover, [data-active="true"]) { border-color:var(--hf-settings-accent); box-shadow:0 0 0 1px var(--hf-settings-accent), 0 6px 16px rgba(0,0,0,.32); }
  & [class*="_topologyPillNode"][data-local="true"] { background:var(--hf-settings-accent-fill); border-color:var(--hf-settings-accent); color:var(--hf-settings-accent-contrast); font-weight:800; }
  & [class*="_topologyPillNode"][data-connected="false"] { background:var(--hf-settings-bg-recessed); border-style:dashed; border-color:var(--hf-settings-border-subtle); color:var(--hf-settings-text-muted); }
  & [class*="_topologyHint"] { color:var(--hf-settings-text-muted); }
  & [class*="_topologySummary"] { color:var(--hf-settings-text-primary); font-weight:600; }
}
/* v0.28.1 RemotePeerPairing & Peer Color Menu */
${GATE} :is([data-remote-peers-panel], [role="dialog"][class*="_addModal"], [role="dialog"][class*="_syncMeshModal"]) {
  & :is(div[class*="_pairingSection"], div[class*="_meshBox"]) { background:var(--hf-settings-bg-recessed); border:1.5px solid var(--hf-settings-border-strong); border-radius:10px; color:var(--hf-settings-text-primary); }
  & div[class*="_pairingDivider"] { background:var(--hf-settings-border-subtle); }
  & :is(p[class*="_pairingNotice"], span[class*="_pairingNotice"], p[class*="_meshEmptyHint"], span[class*="_selfOriginLabel"], p[class*="_syncMeshSubtitle"]) { color:var(--hf-settings-text-muted); }
  & :is(div[class*="_pairingNoticeRow"], p[class*="_pairingWarning"], div[class*="_selfOriginRow"]) { background:var(--hf-settings-bg-surface); border:1px solid var(--hf-settings-border-subtle); border-radius:8px; color:var(--hf-settings-text-primary); }
  & span[class*="_selfOriginKind"] { background:var(--hf-settings-bg-recessed); border:1px solid var(--hf-settings-border-strong); color:var(--hf-settings-accent); font-family:var(--hf-font-mono); font-weight:700; }
  & :is(span[class*="_selfOriginValue"], span[class*="_selfOriginHost"], span[class*="_meshInlineTitle"], span[class*="_meshHostName"], span[class*="_switchTitle"]) { color:var(--hf-settings-text-primary); }
  & :is(span[class*="_meshHostMeta"], span[class*="_meshHostStatus"]) { color:var(--hf-settings-text-muted); font-family:var(--hf-font-mono); }
  & label[class*="_meshHostRow"]:hover:not([data-disabled="true"]) { background:var(--hf-settings-bg-elevated); }
  & button[class*="_inlineLinkButton"] { color:var(--hf-settings-accent); font-weight:700; }
  & :is(section[class*="_reportBanner"], div[class*="_modalReportBox"]) { background:var(--hf-settings-bg-surface); border:1.5px solid var(--hf-settings-border-strong); border-left:4px solid var(--hf-settings-accent); border-radius:var(--hf-settings-radius-card); color:var(--hf-settings-text-primary); }
  & :is(section[class*="_reportBanner"], div[class*="_modalReportBox"])[data-tone="success"] { border-left-color:var(--hf-settings-success); }
  & :is(section[class*="_reportBanner"], div[class*="_modalReportBox"])[data-tone="error"] { border-color:var(--hf-settings-danger); border-left-color:var(--hf-settings-danger); }
  & [class*="_reportBannerIcon"] { color:var(--hf-settings-success); }
  & [class*="_reportBannerDot"] { background:var(--hf-settings-accent); }
  & [class*="_reportBannerDot"][data-tone="error"] { background:var(--hf-settings-danger); }
  & span[class*="_reportBannerTitle"] { color:var(--hf-settings-text-primary); font-weight:700; }
  & button[class*="_reportDismissButton"] { color:var(--hf-settings-text-muted); border-radius:6px; }
  & button[class*="_reportDismissButton"]:hover { background:var(--hf-settings-bg-elevated); color:var(--hf-settings-text-primary); }
  & ul[class*="_pairingStepList"] { border-top-color:var(--hf-settings-border-subtle); }
  & span[class*="_pairingStepDirection"] { color:var(--hf-settings-text-primary); }
  & p[class*="_pairingStepReason"] { color:var(--hf-settings-text-muted); }
  & span[class*="_pairingStatusBadge"] { border:1px solid var(--hf-settings-border-strong); border-radius:6px 2px 6px 6px; background:var(--hf-settings-bg-recessed); color:var(--hf-settings-text-muted); font-weight:700; }
  & span[class*="_pairingStatusBadge"]:is([data-status="added"], [data-status="updated"]) { border-color:var(--hf-settings-success); background:color-mix(in srgb, var(--hf-settings-success) 14%, transparent); color:var(--hf-settings-success); }
  & span[class*="_pairingStatusBadge"][data-status="failed"] { border-color:var(--hf-settings-danger); background:color-mix(in srgb, var(--hf-settings-danger) 14%, transparent); color:var(--hf-settings-danger); }
  & button[class*="_colorSwatch"][data-selected="true"] { box-shadow:0 0 0 2px var(--hf-settings-bg-surface), 0 0 0 3.5px var(--hf-settings-accent); }
  & p[class*="_emptyTitle"] { color:var(--hf-settings-text-primary); }
  & :is(p[class*="_emptyDescription"], p[class*="_loadingState"]) { color:var(--hf-settings-text-muted); }
}
${GATE} [role="menu"] [class*="_menuColorSection"] { padding:6px 8px 7px; }
${GATE} [role="menu"] [class*="_menuColorLabel"] { color:var(--hf-settings-text-muted); font-weight:700; }
${GATE} [role="menu"] [class*="_menuColorDivider"] { height:1px; background:var(--hf-settings-border-subtle); }
${GATE} [role="menu"] button[class*="_colorSwatch"][data-selected="true"] { box-shadow:0 0 0 2px var(--hf-settings-bg-surface), 0 0 0 3.5px var(--hf-settings-accent); }
${GATE} [role="dialog"][class*="_addModal"] {
  & div[class*="_projectsSection"] { background:var(--hf-settings-bg-recessed); border:1.5px solid var(--hf-settings-border-strong); border-radius:10px; }
  & div[class*="_projectsToolbar"] { background:var(--hf-settings-bg-elevated); border-bottom-color:var(--hf-settings-border-subtle); }
  & label[class*="_projectRow"]:hover { background:var(--hf-settings-bg-elevated); }
  & span[class*="_projectPath"] { font-family:var(--hf-font-mono); color:var(--hf-settings-text-muted); }
  & div[class*="_switchRow"] { background:var(--hf-settings-bg-recessed); border:1px solid var(--hf-settings-border-subtle); border-radius:10px; }
  & div[class*="_credentialsBox"] { border-top-color:var(--hf-settings-border-subtle); }
  & button[class*="_modeToggle"] { color:var(--hf-settings-accent); font-weight:700; }
  & div[class*="_testInline"][data-ok="true"] { color:var(--hf-settings-success); }
  & div[class*="_testInline"][data-ok="false"] { color:var(--hf-settings-danger); }
}
${GATE} [role="dialog"] button[class*="_dangerConfirm"] { border:1px solid var(--hf-settings-danger); border-radius:8px 3px 8px 8px; background:var(--hf-settings-danger); color:#fff; font-weight:700; }
/* RemoteWorkspaceDialog */
${GATE} [role="dialog"][class*="_dialog"]:has([class*="_headerLead"]) {
  & :is(button[class*="_hostPill"], span[class*="_hostPillStatic"]) { border:1px solid var(--hf-settings-accent); border-radius:7px 2px 7px 7px; background:var(--hf-settings-bg-recessed); color:var(--hf-settings-accent); font-family:var(--hf-font-mono); font-weight:700; }
  & div[class*="_pathBar"] { background:var(--hf-settings-bg-recessed); border:1.5px solid var(--hf-settings-border-strong); border-radius:9px 3px 9px 9px; }
  & div[class*="_pathBar"]:focus-within { border-color:var(--hf-settings-accent); }
  & input[class*="_pathInput"] { min-height:0; height:26px; padding:0 6px; border:0; border-radius:0; background:transparent; box-shadow:none; font-family:var(--hf-font-mono); }
  & input[class*="_inlineCreateInput"] { min-height:28px; height:28px; padding:0 8px; }
  & div[class*="_browserBox"] { background:var(--hf-settings-bg-recessed); border:1.5px solid var(--hf-settings-border-subtle); border-radius:10px; }
  & button[class*="_dirRow"] { border-radius:7px 2px 7px 7px; color:var(--hf-settings-text-primary); }
  & button[class*="_dirRow"]:hover:not(:disabled) { background:var(--hf-settings-bg-elevated); }
  & button[class*="_dirRowSelected"] { background:var(--hf-settings-accent-fill); color:var(--hf-settings-accent-contrast); font-weight:700; }
  & button[class*="_dirRowSelected"] [class*="_folderIcon"] { color:var(--hf-settings-accent-contrast); }
  & div[class*="_footer"] { border-top:1px solid var(--hf-settings-border-subtle); background:var(--hf-settings-bg-recessed); }
}
/* RemoteSessionBanner & RemoteSessionChip */
${GATE} span[data-remote-chip][data-remote-state] { padding:0 7px; border:1px solid var(--hf-settings-border-strong); border-radius:6px 2px 6px 6px; background:var(--hf-settings-bg-elevated); color:var(--hf-settings-text-primary); font-family:var(--hf-font-mono); }
${GATE} div[class*="_strip"][data-remote-state][role="alert"] { border:1px solid var(--hf-settings-accent); border-left:4px solid var(--hf-settings-accent); border-radius:8px 3px 8px 8px; background:var(--hf-settings-hazard-stripe) top / 100% 2.5px no-repeat, var(--hf-settings-bg-recessed); color:var(--hf-settings-text-primary); }
${GATE} div[class*="_strip"][data-remote-state="auth-error"][role="alert"] { border-color:var(--hf-settings-danger); border-left-color:var(--hf-settings-danger); background:var(--hf-settings-hazard-danger) top / 100% 2.5px no-repeat, var(--hf-settings-bg-recessed); }
${GATE} div[class*="_strip"][data-remote-state] span[class*="_stripText"] { color:var(--hf-settings-text-primary); font-weight:600; }
${GATE} div[class*="_strip"][data-remote-state] button[class*="_reconnectBtn"] { border:1px solid var(--hf-settings-accent); border-radius:6px 2px 6px 6px; background:var(--hf-settings-accent-fill); color:var(--hf-settings-accent-contrast); font-weight:700; }
/* WebExtensionDetailModal & ScreenshotLightbox */
${GATE} [data-web-extension-detail] {
  background:transparent;
  & header[class*="_header"] { background:var(--hf-settings-bg-recessed); }
  & h2[class*="_title"] { color:var(--hf-settings-text-primary); font-weight:800; }
  & :is(span[class*="_trustBadge"], span[class*="_statusBadge"], span[class*="_updateChip"], span[class*="_categoryChip"], span[class*="_capabilityChip"]) { border:1px solid var(--hf-settings-border-strong); border-radius:6px 2px 6px 6px; background:var(--hf-settings-bg-elevated); color:var(--hf-settings-text-primary); font-weight:700; }
  & :is(span[class*="_trustBadge"][data-trust-tier="official"], span[class*="_statusBadge"][data-tone="success"]) { border-color:var(--hf-settings-success); color:var(--hf-settings-success); background:color-mix(in srgb, var(--hf-settings-success) 12%, transparent); }
  & :is(span[class*="_updateChip"], span[class*="_statusBadge"][data-tone="info"], span[class*="_capabilityChip"][data-capability="page"]) { border-color:var(--hf-settings-accent); color:var(--hf-settings-accent); background:color-mix(in srgb, var(--hf-settings-accent) 12%, transparent); }
  & span[class*="_statusBadge"][data-tone="warning"] { border-color:var(--hf-settings-accent-strong); color:var(--hf-settings-accent-strong); }
  & span[class*="_statusBadge"][data-tone="danger"] { border-color:var(--hf-settings-danger); color:var(--hf-settings-danger); background:color-mix(in srgb, var(--hf-settings-danger) 12%, transparent); }
  & a[class*="_repoLink"] { border:1px solid var(--hf-settings-border-strong); border-radius:7px 2px 7px 7px; background:var(--hf-settings-bg-elevated); color:var(--hf-settings-text-primary); }
  & a[class*="_repoLink"]:hover { border-color:var(--hf-settings-accent); color:var(--hf-settings-accent); }
  & div[class*="_confirmBox"] { border:1.5px solid var(--hf-settings-danger); border-radius:9px; background:color-mix(in srgb, var(--hf-settings-danger) 10%, var(--hf-settings-bg-recessed)); }
  & :is(section[class*="_settingsSection"], section[class*="_trustCard"]) { background:var(--hf-settings-bg-surface); border:1.5px solid var(--hf-settings-border-subtle); border-radius:var(--hf-settings-radius-card); }
  & div[class*="_settingsList"] { background:var(--hf-settings-bg-recessed); border:1px solid var(--hf-settings-border-subtle); border-radius:10px; }
  & div[class*="_settingRow"] + div[class*="_settingRow"] { border-top-color:var(--hf-settings-border-subtle); }
  & :is(input[class*="_settingTextInput"], input[class*="_settingNumberInput"], select[class*="_settingSelect"]) { height:auto; min-height:34px; }
  & :is(div[class*="_inlineNotice"], p[class*="_inlineNotice"], div[class*="_alertBanner"]) { border:1px solid var(--hf-settings-border-strong); border-left:4px solid var(--hf-settings-accent); border-radius:8px; background:var(--hf-settings-bg-recessed); color:var(--hf-settings-text-primary); }
  & :is(div[class*="_inlineNotice"], p[class*="_inlineNotice"])[data-tone="success"] { border-left-color:var(--hf-settings-success); color:var(--hf-settings-success); }
  & :is(div[class*="_inlineNotice"], p[class*="_inlineNotice"], div[class*="_alertBanner"])[data-tone="danger"] { border-color:var(--hf-settings-danger); border-left-color:var(--hf-settings-danger); color:var(--hf-settings-danger); }
  & button[class*="_thumb"] { border:1.5px solid var(--hf-settings-border-strong); border-radius:8px 3px 8px 8px; background:var(--hf-settings-bg-recessed); }
  & button[class*="_thumb"]:is(:hover, [aria-pressed="true"]) { border-color:var(--hf-settings-accent); }
  & :is(code[class*="_mdCode"], pre[class*="_mdPre"]) { background:var(--hf-settings-bg-recessed); border:1px solid var(--hf-settings-border-subtle); color:var(--hf-settings-text-primary); font-family:var(--hf-font-mono); }
  & blockquote[class*="_mdQuote"] { border-left:3px solid var(--hf-settings-accent); color:var(--hf-settings-text-muted); }
  & a[class*="_mdLink"] { color:var(--hf-settings-accent); }
}
${GATE} div[role="dialog"][class*="_lightbox"] {
  background:rgba(4, 5, 8, .86); backdrop-filter:blur(12px);
  & img[class*="_lightboxImage"] { border:2px solid var(--hf-settings-accent); border-radius:var(--hf-settings-radius-card); }
  & button[class*="_lightboxBtn"] { background:var(--hf-settings-bg-elevated); border:1.5px solid var(--hf-settings-border-strong); color:var(--hf-settings-text-primary); }
  & button[class*="_lightboxBtn"]:hover { border-color:var(--hf-settings-accent); color:var(--hf-settings-accent); }
  & span[class*="_lightboxCount"] { background:var(--hf-settings-bg-recessed); border:1.5px solid var(--hf-settings-accent); color:var(--hf-settings-accent); font-family:var(--hf-font-mono); font-weight:700; }
}
/* CreateWebExtensionDialog */
${GATE} [role="dialog"][class*="_dialog"]:has(ol[class*="_steps"] + div[class*="_field"] textarea[class*="_textarea"]) {
  & ol[class*="_steps"] { color:var(--hf-settings-text-muted); }
  & ol[class*="_steps"] li::marker { color:var(--hf-settings-accent); font-weight:700; }
  & textarea[class*="_textarea"] { font-family:var(--hf-font-mono); }
  & textarea[class*="_textarea"]:focus { border-color:var(--hf-settings-accent); box-shadow:inset 3px 0 var(--hf-settings-accent); }
  & p[class*="_status"][data-tone="success"] { color:var(--hf-settings-success); }
  & p[class*="_status"][data-tone="danger"] { color:var(--hf-settings-danger); }
  & a[class*="_link"] { color:var(--hf-settings-accent); font-weight:600; }
}
${GATE}[data-hf-preset-settings="street"] button[aria-current="true"] { transform:skewX(-6deg); }
${GATE}[data-hf-preset-settings="street"] kbd:not([class*="_separator"]) { background:#fff; color:#090b05; border:2px solid #050507; }
${GATE}[data-hf-preset-settings="street"] kbd:not([class*="_separator"]):first-child { background:#c8ff00; }
${GATE}[data-hf-preset-settings="street"] :is(${IMPORT_PAGE} > div[class*="_inner"], ${MODAL_NEW}) { border:2px solid #050507; box-shadow:5px 5px 0 #c8ff00; }
${GATE}[data-hf-preset-settings="street"] [data-remote-peers-panel] section[class*="_topologyCard"] { border:2px solid #050507; box-shadow:4px 4px 0 #c8ff00; }
${GATE}[data-hf-preset-settings="street"] [data-remote-peers-panel] [class*="_topologyPillNode"] { border:2px solid #050507; }
${GATE}[data-hf-preset-settings="archive"] :is([class*="_overlay"], [class*="_mask"]):has(> [data-shortcut-modal]) { background:rgba(15,23,42,.38); }
${GATE}[data-hf-preset-settings="archive"] [class*="_root"]:has(> :is(${MODAL_NEW})) > [class*="_mask"]::after { background:rgba(15,23,42,.38); }
${GATE}[data-hf-preset-settings="archive"] [data-shortcut-modal="settings"] { padding:5px; border-color:#2455e7; }
${GATE}[data-hf-preset-settings="archive"] [data-shortcut-modal="settings"] [class*="_content"] { background:var(--hf-settings-bg-surface); border-radius:16px; }
${GATE}[data-hf-preset-settings="archive"] :is(${IMPORT_PAGE} > div[class*="_inner"], ${MODAL_NEW}) { background:var(--hf-settings-bg-surface); border:2px solid #2455e7; }
${GATE}[data-hf-preset-settings="archive"] [data-remote-peers-panel] [class*="_topologyPillNode"] { background:#ffffff; border-color:#cfd7e6; color:#14171f; box-shadow:0 3px 10px rgba(15,23,42,.08); }
${GATE}[data-hf-preset-settings="archive"] [data-remote-peers-panel] [class*="_topologyPillNode"][data-local="true"] { background:#2455e7; border-color:#1b44c8; color:#ffffff; }
${GATE}[data-hf-preset-settings="archive"] [data-remote-peers-panel] span[class*="_pairedBadge"] { background:#e8eefc; border-color:rgba(36,85,231,.38); color:#1b44c8; }
${GATE} [data-shortcut-modal="settings"] [data-web-extensions] [class*="_grid"] { grid-template-columns:1fr; }
@media(max-width:759px) { ${GATE} [data-web-extensions] [class*="_grid"], ${GATE} [data-plugin-panel] ul[class*="_cards"] { grid-template-columns:1fr; } }
@media(max-width:600px) {
  ${GATE} [data-shortcut-modal="settings"] { width:calc(100vw - 24px); height:calc(100dvh - 24px); flex-direction:column; }
  ${S} {
    & nav[class*="_nav"] { width:auto; border-right:0; border-bottom:1px solid var(--hf-settings-border-subtle); }
    & [class*="_navList"] { display:flex; overflow-x:auto; }
    & button[class*="_navCell"] { flex:none; min-height:44px; }
    & button[class*="_close"] { min-width:44px; min-height:44px; }
  }
  ${GATE} ${IMPORT_PAGE} { padding:52px 12px 20px; }
  ${GATE} ${IMPORT_PAGE} > div[class*="_inner"] { padding:16px 14px; }
  ${GATE} ${IMPORT_PAGE} li[class*="_row"] { gap:10px; padding:10px; }
  ${GATE} ${IMPORT_PAGE} div[class*="_footer"] { gap:8px; }
  ${GATE} [data-web-extension-detail] div[class*="_settingRow"] { flex-wrap:wrap; gap:8px; }
  ${GATE} [data-web-extension-detail] :is(input[class*="_settingTextInput"], select[class*="_settingSelect"]) { width:100%; max-width:100%; }
  ${GATE} [data-connect-devices] div[class*="_addressRow"] > button { flex:1 1 auto; }
  ${GATE} :is(${MODAL_NEW}) { width:100%; max-width:100%; box-sizing:border-box; }
}
@media(prefers-reduced-motion:reduce) { ${S} * { transition:none !important; } }
`
