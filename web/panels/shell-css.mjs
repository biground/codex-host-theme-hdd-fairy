import { renderHddIcon } from '../../shared/hdd-icons.mjs'

const ROOT = 'html:is([data-cx-ext-hdd-fairy-theme-dark],[data-cx-ext-hdd-fairy-theme-light])[data-hf-panel-shell="1"]'
const arrow = `url("data:image/svg+xml,${encodeURIComponent(renderHddIcon('chevron-down').replace('currentColor', '#84877d'))}")`

export const SHELL_PANEL_CSS = `
${ROOT} {
& [data-cx-region="sidebar"], & [data-phone-drawer] { background: var(--hf-shell-bg-shell); color: var(--hf-shell-text-primary); font-family: var(--hf-font-ui); border-color: var(--hf-shell-border-subtle); }
/* 1. Top Brand Bay: 3px preset-synced hazard eyebrow + armored plate & bottom groove */
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) { position: relative; }
& [data-cx-region="sidebar"]:not([class*="_collapsed"])::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--hf-shell-hazard-stripe); pointer-events: none; z-index: 2; }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_logoRow"] { min-height: 54px; height: auto; margin: 5px 0 8px; padding: 6px 8px 7px 10px; border: 1px solid var(--hf-shell-border-subtle); border-bottom: 2px solid color-mix(in srgb, var(--hf-shell-accent) 44%, var(--hf-shell-border-subtle)); border-radius: 12px 3px 12px 12px; background: linear-gradient(165deg, var(--hf-shell-bg-elevated), var(--hf-shell-bg-recessed)); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 3px 0 rgba(0, 0, 0, 0.28); overflow: visible; }
& [data-cx-region="sidebar"] :is([class*="_toggle"], [class*="_collapsed"] button) { border: 1px solid var(--hf-shell-border-subtle); border-radius: 7px 2px 7px 7px; background: var(--hf-shell-bg-elevated); color: var(--hf-shell-text-primary); box-shadow: var(--hf-shell-shadow-key); }
& [data-cx-region="sidebar"] :is([class*="_toggle"], [class*="_collapsed"] button):hover { border-color: var(--hf-shell-accent); color: var(--hf-shell-accent); }
/* 2. New Session Primary Tactical Button (strictly button[class*="_newSession"] — never touch inner spans) */
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) button[class*="_newSession"] { min-height: 40px; height: auto; margin: 0 0 8px; padding: 7px 12px; border: 1.5px solid var(--hf-shell-accent); border-radius: 14px 4px 14px 14px; background: linear-gradient(108deg, color-mix(in srgb, var(--hf-shell-accent) 22%, #1a1915) 0%, #202026 54%, #151519 100%); color: var(--hf-shell-text-primary); box-shadow: inset 4px 0 var(--hf-shell-accent), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 3px 0 #070709, 0 6px 14px rgba(0, 0, 0, 0.32); }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) button[class*="_newSession"]:hover { border-color: var(--hf-shell-accent-strong); background: linear-gradient(108deg, color-mix(in srgb, var(--hf-shell-accent) 32%, #201e17) 0%, #26262e 54%, #19191f 100%); box-shadow: inset 5px 0 var(--hf-shell-accent), inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 3px 0 #070709, 0 8px 18px rgba(0, 0, 0, 0.38); }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) button[class*="_newSession"] svg { color: var(--hf-shell-accent); }
/* 3. Panel Navigation Bay (Import / Remote / Extensions recessed tactical tray) */
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_panelList"] { padding: 5px; margin-bottom: 10px; gap: 3px; border: 1px solid var(--hf-shell-border-subtle); border-radius: 12px 4px 12px 12px; background: var(--hf-shell-bg-recessed); box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.34); }
& [data-cx-region="sidebar"] [class*="_panelRow"] { min-height: 34px; padding: 6px 10px; border: 1px solid transparent; border-radius: 9px 3px 9px 9px; color: var(--hf-shell-text-muted); transition: background-color 140ms ease, color 140ms ease, border-color 140ms ease, box-shadow 140ms ease; }
& [data-cx-region="sidebar"] :is([class*="_panelRow"]:hover, [class*="_panelActive"], [class*="_panelRow"][aria-current="page"]) { background: linear-gradient(96deg, color-mix(in srgb, var(--hf-shell-accent) 16%, var(--hf-shell-bg-elevated)), var(--hf-shell-bg-elevated)); border-color: color-mix(in srgb, var(--hf-shell-accent) 42%, transparent); color: var(--hf-shell-accent); box-shadow: inset 3px 0 var(--hf-shell-accent); }
/* 4. Pinned & Workspaces Armored Cards, Section Keycaps & Recessed Workspace Badge Slot */
& [data-cx-region="sidebar"] [class*="_sectionHeader"] { overflow: visible; padding-inline: 4px; }
& [data-cx-region="sidebar"] [class*="_headerActions"]:not([class*="_headerActionsHidden"]) { max-width: 72px; overflow: visible; gap: 5px; }
& [data-cx-region="sidebar"] [class*="_sectionLabel"] { color: var(--hf-shell-text-muted); font-weight: 800; letter-spacing: 0.03em; }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_sectionHeader"] :is(button[class*="_searchButton"], [class*="_headerActions"] button[class*="_iconButton"]) { width: 26px; height: 26px; border: 1px solid var(--hf-shell-border-subtle); border-radius: 7px 2px 7px 7px; background: var(--hf-shell-bg-elevated); color: var(--hf-shell-text-primary); box-shadow: 0 2px 0 rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.07); }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_sectionHeader"] :is(button[class*="_searchButton"], [class*="_headerActions"] button[class*="_iconButton"]):hover { border-color: var(--hf-shell-accent); color: var(--hf-shell-accent); }
& [data-cx-region="sidebar"] [class*="_searchExpanded"] { background: var(--hf-shell-bg-recessed); border: 1.5px solid var(--hf-shell-accent); border-radius: 9px 3px 9px 9px; box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.35); }
& [data-cx-region="sidebar"] [class*="_searchExpanded"] button[class*="_searchButton"] { border: 0; background: transparent; box-shadow: none; }
& :is([data-sidebar-group], [data-sidebar-pinned]) { background: linear-gradient(180deg, color-mix(in srgb, var(--hf-shell-accent) 9%, transparent) 0, transparent 22px), var(--hf-shell-bg-surface); border: 1.5px solid var(--hf-shell-border-subtle); border-radius: 14px 4px 14px 14px; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 4px 12px rgba(0, 0, 0, 0.26); }
& [data-sidebar-pinned] [data-row-key^="section:"] { background: transparent; border: 0; box-shadow: none; }
& [data-cx-region="sidebar"] [data-row-key^="workspace:"] > [class*="_slot"] { border: 1.5px solid var(--hf-shell-border-strong); border-radius: 8px 2px 8px 8px; background: var(--hf-shell-bg-recessed); color: var(--hf-shell-text-muted); box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.46); }
& [data-cx-region="sidebar"] [data-row-key^="workspace:"][aria-expanded="true"] > [class*="_slot"] { border-color: var(--hf-shell-accent); color: var(--hf-shell-accent); background: color-mix(in srgb, var(--hf-shell-accent) 16%, var(--hf-shell-bg-recessed)); box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.32), 0 0 8px color-mix(in srgb, var(--hf-shell-accent) 30%, transparent); }
/* 5. Sidebar Tactical Scrollbar Rail (replaces mismatched cyan-purple thumb) */
& [data-cx-region="sidebar"], & [data-phone-drawer] { --hf-shell-scroll-thumb: rgba(148, 144, 134, 0.34); --hf-shell-scroll-thumb-hover: color-mix(in srgb, var(--hf-shell-accent) 72%, transparent); }
& [data-cx-region="sidebar"] *, & [data-phone-drawer] * { scrollbar-color: var(--hf-shell-scroll-thumb) transparent; }
& [data-cx-region="sidebar"] *::-webkit-scrollbar, & [data-phone-drawer] *::-webkit-scrollbar { width: 6px; height: 6px; }
& [data-cx-region="sidebar"] *::-webkit-scrollbar-track, & [data-phone-drawer] *::-webkit-scrollbar-track { background: transparent; }
& [data-cx-region="sidebar"] *::-webkit-scrollbar-thumb, & [data-phone-drawer] *::-webkit-scrollbar-thumb { background: var(--hf-shell-scroll-thumb) !important; border-radius: 999px; border: 1px solid transparent; background-clip: padding-box; }
& [data-cx-region="sidebar"] *::-webkit-scrollbar-thumb:hover, & [data-phone-drawer] *::-webkit-scrollbar-thumb:hover { background: var(--hf-shell-scroll-thumb-hover) !important; }
& [data-cx-region="sidebar"][class*="_quietBars"] * { scrollbar-color: transparent transparent; }
& [data-cx-region="sidebar"][class*="_quietBars"] *::-webkit-scrollbar-thumb { background: transparent !important; }
& [data-row-key][role="treeitem"]:not([data-row-key^="section:"]) { border-radius: 9px 3px 9px 9px; font-variant-numeric: tabular-nums; }
& [data-row-key][role="treeitem"]:not([data-row-key^="section:"]):not([aria-selected="true"]):is(:hover, :focus-visible, [class*="_menuOpen"]) { --dsh-row-surface: var(--hf-shell-bg-elevated); background: var(--hf-shell-bg-elevated); box-shadow: inset 2px 0 var(--hf-shell-accent); }
& [data-row-key][role="treeitem"]:not([data-row-key^="section:"])[aria-selected="true"] { --dsh-row-surface: #eeb418; --dsw-alias-label-primary: var(--hf-shell-accent-contrast); --dsw-alias-state-business-primary: var(--hf-shell-accent-contrast); background: var(--hf-shell-accent-fill); color: var(--hf-shell-accent-contrast); border-radius: 9px 3px 9px 9px; }
& [data-row-key][aria-selected="true"] [data-thread-summary] { color: var(--hf-shell-accent-contrast); font-weight: 700; }
& [data-row-key][aria-selected="true"] [data-session-title] { color: var(--hf-shell-accent-contrast); }
& [data-row-key][aria-selected="true"] [class*="_rowActions"] { background: var(--dsh-row-surface); color: var(--hf-shell-accent-contrast); }
& [data-row-key][aria-selected="true"] [class*="_rowActions"]::before { background: linear-gradient(90deg, transparent, var(--dsh-row-surface)); }
& [data-row-key][aria-selected="true"] [class*="_rowActions"] button { color: var(--hf-shell-accent-contrast); }
& [data-session-status="warning"] [class*="_timeStatus"] { color: #ffb43b; font-weight: 800; }
& [data-session-status="error"] [class*="_timeStatus"] { color: var(--hf-shell-danger); }
& :is([data-session-watching="true"], .cx-aag-row-badge) { border: 1px solid #57e8ff73; border-radius: 4px; background: #11222b; color: #7ce7ff; font-size: 10px; font-weight: 800; }
& [data-row-key][aria-selected="true"] :is([data-session-watching="true"], .cx-aag-row-badge) { background: #161308; color: #f9db4d; border-color: #161308; }
& :is([data-cx-region="sidebar"], [data-phone-drawer]) [class*="_watchingBadge"] { border: 1px solid color-mix(in srgb, var(--hf-shell-accent) 48%, transparent); border-radius: 5px 2px 5px 5px; background: color-mix(in srgb, var(--hf-shell-accent) 14%, #141418); color: var(--hf-shell-accent); font-weight: 800; }
& [data-row-key][aria-selected="true"] [class*="_watchingBadge"] { border: 1px solid #161308; background: #161308; color: #f8cb29; font-weight: 800; }
& [data-cx-region="sidebar"] [class*="_archived"] { opacity: .55; }
/* 6. Bottom Settings Independent Mechanical Dock (top notch + tactile capsule) */
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_footArea"] { position: relative; margin-top: 6px; padding: 10px 0 2px; border-top: 1px solid var(--hf-shell-border-subtle); gap: 6px; }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_footArea"]::before { content: ""; position: absolute; top: -1px; left: 10px; width: 34px; height: 2px; background: var(--hf-shell-accent); border-radius: 2px; pointer-events: none; }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_footArea"] :is([class*="_settingsArea"], [class*="_footerActions"]) button { width: 100%; min-height: 36px; padding: 6px 12px; border: 1px solid var(--hf-shell-border-subtle); border-radius: 10px 3px 10px 10px; background: linear-gradient(180deg, var(--hf-shell-bg-elevated), var(--hf-shell-bg-surface)); color: var(--hf-shell-text-primary); box-shadow: var(--hf-shell-shadow-key); transition: border-color 140ms ease, color 140ms ease, box-shadow 140ms ease, background-color 140ms ease; }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_footArea"] :is([class*="_settingsArea"], [class*="_footerActions"]) button:hover { border-color: var(--hf-shell-accent); color: var(--hf-shell-accent); box-shadow: inset 3px 0 var(--hf-shell-accent), var(--hf-shell-shadow-key); }
& [data-conversation-navigation-focus], & [data-shell-leading] { background: var(--hf-shell-bg-shell); border-color: var(--hf-shell-border-subtle); color: var(--hf-shell-text-primary); }
& [data-conversation-navigation-focus] [class*="_crumbCurrent"], & [data-conversation-navigation-focus][class*="_headerBlank"] [data-conversation-header-leading]::after { max-width: clamp(140px, 42vw, 480px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; background: var(--hf-chrome-compass) 11px center/14px 14px no-repeat, var(--hf-shell-accent-fill); color: var(--hf-shell-accent-contrast); border-radius: 9px 3px 9px 9px; }
& :is([data-conversation-tabs], [data-dockkit-strip]) { background: var(--hf-shell-bg-recessed); border: 1px solid var(--hf-shell-border-subtle); }
& :is([data-conversation-tabs], [data-dockkit-strip]) [role="tab"] { color: var(--hf-shell-text-muted); border-radius: 7px 2px 7px 7px; }
& :is([data-conversation-tabs], [data-dockkit-strip]) [role="tab"][aria-selected="true"] { background: var(--hf-shell-accent-fill); color: var(--hf-shell-accent-contrast); }
& :is([data-conversation-tabs], [data-dockkit-strip]) [class*="_indicator"] { background: transparent; box-shadow: none; }
& [class*="_indicator"]:is([data-phase="disconnected"], [data-phase="connecting"]) { border: 1px solid var(--hf-shell-accent); border-top: 3px solid transparent; background: linear-gradient(var(--hf-shell-bg-recessed), var(--hf-shell-bg-recessed)) padding-box, var(--hf-shell-hazard-stripe) border-box; color: var(--hf-shell-accent); }
& [class*="_indicator"][class*="_success"] { background: #10261e; border: 1px solid #3ef0b07a; color: #3ef0b0; }
& body > div[role="alert"][class*="_toast"], & body > div[class*="_card"]:has([class*="_hoverContent"]) { background: var(--hf-shell-bg-surface); color: var(--hf-shell-text-primary); border: 1px solid var(--hf-shell-border-strong); border-radius: var(--hf-shell-radius-card); box-shadow: var(--hf-shell-shadow-card); }
& body > div[role="alert"][class*="_toast"] { box-shadow: inset 4px 0 var(--hf-shell-accent), var(--hf-shell-shadow-card); }
& body > div[role="alert"][class*="_toast"] [class*="_action"] { color: var(--hf-shell-accent); text-decoration: underline; }
& body > div[class*="_card"] [class*="_hoverPath"] { background: var(--hf-shell-bg-recessed); color: var(--hf-shell-text-muted); font-family: var(--hf-font-mono); }
& :is([class*="_card"]:has([role="listbox"]), [role="dialog"][data-shortcut-modal="shortcuts"], [role="dialog"][class*="_dialog"]:has([class*="_millerRow"])) { background: var(--hf-shell-bg-surface); color: var(--hf-shell-text-primary); border: 1.5px solid var(--hf-shell-border-strong); border-radius: var(--hf-shell-radius-panel); box-shadow: var(--hf-shell-shadow-card); }
& [class*="_card"]:has([role="listbox"]) { border-top: 3px solid var(--hf-shell-accent); }
& :is([role="listbox"], [data-shortcut-modal="shortcuts"]) [role="option"][aria-selected="true"] { background: var(--hf-shell-bg-elevated); color: var(--hf-shell-text-primary); box-shadow: inset 3px 0 var(--hf-shell-accent); }
& :is([role="listbox"], [data-shortcut-modal="shortcuts"]) [class*="_heading"][data-stuck] { background: var(--hf-shell-bg-surface); }
& :is([role="dialog"], [role="menu"], [class*="_card"]:has([role="listbox"])) kbd { background: var(--hf-shell-bg-elevated); color: var(--hf-shell-text-primary); border: 1px solid var(--hf-shell-border-strong); border-radius: 4px; box-shadow: var(--hf-shell-shadow-key); font-family: var(--hf-font-mono); }
& [role="dialog"][class*="_dialog"]:has([class*="_millerRow"]) { width: min(680px, calc(100vw - 32px)); height: min(500px, calc(100dvh - 32px)); }
& [role="dialog"] [class*="_crumbBar"] { min-height: 32px; background: var(--hf-shell-bg-recessed); border: 1px solid var(--hf-shell-border-subtle); border-radius: 9px 3px 9px 9px; }
& [role="dialog"] [class*="_pathInput"] { font-family: var(--hf-font-mono); }
& [role="dialog"] [class*="_millerRow"] { overflow-x: auto; }
& [role="dialog"] [class*="_millerRow"] [class*="_column"] { min-width: 256px; }
& [role="dialog"] [class*="_millerRow"] [class*="_row"][aria-current="true"] { background: var(--hf-shell-accent-fill); color: var(--hf-shell-accent-contrast); }
& [role="dialog"] [class*="_footerBar"] { background: var(--hf-shell-bg-recessed); border-color: var(--hf-shell-border-subtle); }
& [role="menu"] [class*="_material"] { background: var(--hf-shell-bg-surface); backdrop-filter: blur(14px); border: 1px solid var(--hf-shell-border-strong); border-radius: var(--hf-shell-radius-card); box-shadow: var(--hf-shell-shadow-card); }
& [role="menu"] [role="menuitem"] { color: var(--hf-shell-text-primary); border-radius: 8px 2px 8px 8px; }
& [role="menu"] [role="menuitem"]:is(:hover, :focus-visible, [data-highlighted]) { background: var(--hf-shell-bg-elevated); box-shadow: inset 3px 0 var(--hf-shell-accent); }
& [role="menu"] [role="menuitem"][class*="_danger"] { color: var(--hf-shell-danger); }
& :is([role="dialog"][class*="_confirmation"], [role="dialog"]:has([class*="_deleteAction"])) { border: 1.5px solid var(--hf-shell-border-strong); border-top: 4px solid transparent; border-radius: var(--hf-shell-radius-panel); background: linear-gradient(var(--hf-shell-bg-recessed), var(--hf-shell-bg-recessed)) padding-box, var(--hf-shell-hazard-danger) border-box; color: var(--hf-shell-text-primary); box-shadow: var(--hf-shell-shadow-card); }
& [role="dialog"][class*="_confirmation"] [class*="_confirmAction"] { background: var(--hf-shell-danger); color: #fff; }
& [role="dialog"] [class*="_warning"] { background: #211317; color: #ffb4b8; border: 1px solid #ff5d7a5c; border-radius: 10px; padding: 11px 13px; }
& [role="dialog"] [class*="_acknowledgement"] { background: var(--hf-shell-bg-recessed); border: 1px solid var(--hf-shell-border-subtle); border-radius: 10px; padding: 10px 12px; }
& [role="dialog"] [class*="_acknowledgement"]:has(input:checked) { border-color: var(--hf-shell-accent); }
/* ArchiveChildrenDialog & MoveThreadSection */
& [role="dialog"]:has(select[class*="_renameInput"]) { border: 1.5px solid var(--hf-shell-border-strong); border-top: 4px solid transparent; border-radius: var(--hf-shell-radius-panel); background: linear-gradient(var(--hf-shell-bg-surface), var(--hf-shell-bg-surface)) padding-box, var(--hf-shell-hazard-stripe) border-box; color: var(--hf-shell-text-primary); box-shadow: var(--hf-shell-shadow-card); }
& :is([role="dialog"], [data-phone-sidebar-view]):is(:has(ul[class*="_archiveActivity"]), :has(select[class*="_renameInput"])) div[class*="_header"] { border-bottom: 1px solid var(--hf-shell-border-subtle); }
& :is([role="dialog"], [data-phone-sidebar-view]):is(:has(ul[class*="_archiveActivity"]), :has(select[class*="_renameInput"])) h2[class*="_title"] { color: var(--hf-shell-text-primary); font-weight: 800; }
& :is([role="dialog"], [data-phone-sidebar-view]):is(:has(ul[class*="_archiveActivity"]), :has(select[class*="_renameInput"])) p[class*="_description"] { color: var(--hf-shell-text-muted); }
& :is([role="dialog"], [data-phone-sidebar-view]):is(:has(ul[class*="_archiveActivity"]), :has(select[class*="_renameInput"])) button[class*="_close"] { border: 1px solid var(--hf-shell-border-strong); border-radius: 7px 2px 7px 7px; background: var(--hf-shell-bg-elevated); color: var(--hf-shell-text-primary); }
& :is([role="dialog"], [data-phone-sidebar-view]):is(:has(ul[class*="_archiveActivity"]), :has(select[class*="_renameInput"])) button[class*="_close"]:hover { border-color: var(--hf-shell-danger); color: var(--hf-shell-danger); }
& :is([role="dialog"], [data-phone-sidebar-view]) ul[class*="_archiveActivity"] { list-style: none; margin: 0 0 8px; padding: 8px 10px; max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; background: var(--hf-shell-bg-surface); border: 1px solid var(--hf-shell-border-subtle); border-left: 3px solid var(--hf-shell-danger); border-radius: 10px 3px 10px 10px; color: var(--hf-shell-text-primary); }
& :is([role="dialog"], [data-phone-sidebar-view]) ul[class*="_archiveActivity"] li { position: relative; padding: 6px 8px 6px 16px; border-radius: 6px; background: var(--hf-shell-bg-recessed); color: var(--hf-shell-text-primary); }
& :is([role="dialog"], [data-phone-sidebar-view]) ul[class*="_archiveActivity"] li::before { content: ""; position: absolute; left: 6px; top: 13px; width: 4px; height: 4px; background: var(--hf-shell-danger); }
& :is([role="dialog"], [data-phone-sidebar-view]) button[class*="_deleteAction"] { border: 1.5px solid var(--hf-shell-danger); border-radius: 8px 3px 8px 8px; background: color-mix(in srgb, var(--hf-shell-danger) 14%, var(--hf-shell-bg-recessed)); color: var(--hf-shell-danger); font-weight: 700; }
& :is([role="dialog"], [data-phone-sidebar-view]) button[class*="_deleteAction"]:hover:not(:disabled) { background: var(--hf-shell-danger); color: #fff; }
& :is([role="dialog"], [data-phone-sidebar-view]) select[class*="_renameInput"] { box-sizing: border-box; width: 100%; min-height: 40px; padding: 0 34px 0 12px; appearance: none; background: ${arrow} right 10px center / 14px no-repeat, var(--hf-shell-bg-recessed); color: var(--hf-shell-text-primary); border: 1.5px solid var(--hf-shell-border-strong); border-radius: 9px 3px 9px 9px; font-weight: 600; }
& :is([role="dialog"], [data-phone-sidebar-view]) select[class*="_renameInput"]:focus-visible { border-color: var(--hf-shell-accent); outline: 2px solid var(--hf-shell-accent); outline-offset: 2px; }
& :is([role="dialog"], [data-phone-sidebar-view]) select[class*="_renameInput"] option { background: var(--hf-shell-bg-elevated); color: var(--hf-shell-text-primary); }
& :is([role="dialog"], [data-phone-sidebar-view]) div[class*="_renameError"] { padding: 8px 10px; border: 1px solid var(--hf-shell-danger); border-left: 3px solid var(--hf-shell-danger); border-radius: 7px; background: color-mix(in srgb, var(--hf-shell-danger) 10%, var(--hf-shell-bg-recessed)); color: var(--hf-shell-danger); }
& :is([role="dialog"], [data-phone-sidebar-view]):is(:has(ul[class*="_archiveActivity"]), :has(select[class*="_renameInput"])) div[class*="_footer"] button[class*="_outline"]:not([class*="_deleteAction"]) { border: 1.5px solid var(--hf-shell-border-strong); border-radius: 8px 3px 8px 8px; background: var(--hf-shell-bg-elevated); color: var(--hf-shell-text-primary); font-weight: 600; }
& :is([role="dialog"], [data-phone-sidebar-view]):has(select[class*="_renameInput"]) div[class*="_footer"] button[class*="_primary"] { border: 1px solid var(--hf-shell-accent); border-radius: 8px 3px 8px 8px; background: var(--hf-shell-accent-fill); color: var(--hf-shell-accent-contrast); font-weight: 700; }
& [role="tooltip"][class*="_bubble"][data-side] { background: var(--hf-shell-bg-recessed); color: var(--hf-shell-text-primary); border: 1px solid var(--hf-shell-border-strong); border-radius: 7px 2px 7px 7px; box-shadow: var(--hf-shell-shadow-card); }
& [class*="_phoneBackdrop"] { background: rgba(4,5,8,.72); backdrop-filter: blur(8px); }
& [data-phone-drawer] { border-right: 2px solid var(--hf-shell-accent); border-radius: 0 24px 8px 0; box-shadow: 14px 0 38px #000b; overflow: hidden; }
& [data-phone-drawer] [data-row-key][role="treeitem"]:not([data-row-key^="section:"]) { min-height: 48px; }
& [data-phone-drawer] :is([class*="_sessionOverflowButton"], [data-phone-sidebar-view] button) { min-width: 44px; min-height: 44px; }
& [data-phone-drawer] [class*="_sectionHeader"] :is(button[class*="_searchButton"], [class*="_headerActions"] button[class*="_iconButton"]) { width: 36px; height: 36px; min-width: 36px; min-height: 36px; }
& [data-phone-drawer] [class*="_searchSlot"]:not([class*="_searchSlotExpanded"]) { max-width: 36px; }
& [data-phone-drawer] [class*="_headerActions"]:not([class*="_headerActionsHidden"]) { max-width: 84px; }
}
${ROOT}[data-hf-preset-shell="street"] {
& :is([data-sidebar-group], [data-sidebar-pinned], [role="dialog"][class*="_dialog"]:has([class*="_millerRow"]), [role="dialog"]:has(ul[class*="_archiveActivity"]), [role="dialog"]:has(select[class*="_renameInput"]), [role="menu"] [class*="_material"]) { border: 2px solid #050507; border-radius: 14px 4px 14px 4px; box-shadow: 4px 4px 0 var(--hf-shell-accent); }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_logoRow"] { border: 2px solid #050507; border-radius: 12px 3px 12px 3px; background: #181b22; box-shadow: 3px 3px 0 var(--hf-shell-accent); }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) button[class*="_newSession"] { border: 2px solid #050507; border-radius: 14px 4px 14px 4px; background: linear-gradient(108deg, rgba(200, 255, 0, 0.22) 0%, #1a1e26 55%, #12141a 100%); box-shadow: inset 5px 0 #c8ff00, 3px 3px 0 #c8ff00; }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) button[class*="_newSession"]:hover { background: linear-gradient(108deg, rgba(200, 255, 0, 0.34) 0%, #202530 55%, #161920 100%); }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_panelList"] { border: 2px solid #050507; border-radius: 12px 4px 12px 4px; background: #0a0b0f; }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_footArea"] :is([class*="_settingsArea"], [class*="_footerActions"]) button { border: 2px solid #050507; border-radius: 10px 3px 10px 3px; background: #1a1d24; box-shadow: 2.5px 2.5px 0 #c8ff00; }
& [data-cx-region="sidebar"], & [data-phone-drawer] { --hf-shell-scroll-thumb: rgba(164, 174, 190, 0.36); --hf-shell-scroll-thumb-hover: #c8ff00; }
& [data-row-key][aria-selected="true"] { --dsh-row-surface: #c8ff00; }
& :is([data-cx-region="sidebar"], [data-phone-drawer]) [class*="_watchingBadge"] { border: 1px solid #c8ff00; border-radius: 5px 2px 5px 2px; background: #141a0c; color: #c8ff00; }
& [data-row-key][aria-selected="true"] [class*="_watchingBadge"] { border: 1px solid #050507; background: #090b05; color: #c8ff00; }
}
${ROOT}[data-hf-preset-shell="archive"] {
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_logoRow"] { border: 1.5px solid #cfd7e6; border-bottom: 2px solid #2455e7; background: linear-gradient(165deg, #ffffff, #f3f6fc); box-shadow: 0 3px 10px rgba(15, 23, 42, 0.06); }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) button[class*="_newSession"] { border: 1.5px solid #2455e7; border-radius: 14px 4px 14px 14px; background: linear-gradient(108deg, rgba(36, 85, 231, 0.14) 0%, #ffffff 56%, #f4f7ff 100%); color: #0f1730; box-shadow: inset 4px 0 #2455e7, 0 2.5px 0 #b8c6e6, 0 4px 12px rgba(36, 85, 231, 0.10); }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) button[class*="_newSession"]:hover { background: linear-gradient(108deg, rgba(36, 85, 231, 0.22) 0%, #ffffff 56%, #edf3ff 100%); color: #1b44c8; }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_panelList"] { border: 1px solid #cfd7e6; background: #e3e8f3; box-shadow: inset 0 1px 3px rgba(15, 23, 42, 0.08); }
& [data-cx-region="sidebar"] :is([class*="_panelRow"]:hover, [class*="_panelActive"], [class*="_panelRow"][aria-current="page"]) { background: #ffffff; border-color: rgba(36, 85, 231, 0.32); color: #1b44c8; box-shadow: inset 3px 0 #2455e7, 0 1px 4px rgba(15, 23, 42, 0.06); }
& :is([data-sidebar-group], [data-sidebar-pinned]) { background: linear-gradient(180deg, rgba(36, 85, 231, 0.06) 0, transparent 20px), #ffffff; border: 1.5px solid #cfd7e6; box-shadow: inset 0 1.5px 0 rgba(36, 85, 231, 0.24), 0 3px 10px rgba(15, 23, 42, 0.05); }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_sectionHeader"] :is(button[class*="_searchButton"], [class*="_headerActions"] button[class*="_iconButton"]) { border-color: #cfd7e6; background: #ffffff; color: #334155; box-shadow: 0 2px 0 #c5cfe4; }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_sectionHeader"] :is(button[class*="_searchButton"], [class*="_headerActions"] button[class*="_iconButton"]):hover { border-color: #2455e7; color: #2455e7; }
& [data-cx-region="sidebar"] [data-row-key^="workspace:"] > [class*="_slot"] { border-color: #c5cfe4; background: #e5ebf7; color: #475569; box-shadow: inset 0 1.5px 3px rgba(15, 23, 42, 0.12); }
& [data-cx-region="sidebar"] [data-row-key^="workspace:"][aria-expanded="true"] > [class*="_slot"] { border-color: #2455e7; background: #e6eeff; color: #2455e7; box-shadow: inset 0 1px 2px rgba(36, 85, 231, 0.16), 0 0 0 2px rgba(36, 85, 231, 0.12); }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_footArea"] :is([class*="_settingsArea"], [class*="_footerActions"]) button { border: 1.5px solid #cfd7e6; background: linear-gradient(180deg, #ffffff, #f5f7fc); color: #14171f; box-shadow: 0 2px 0 #c5cfe4; }
& [data-cx-region="sidebar"]:not([class*="_collapsed"]) [class*="_footArea"] :is([class*="_settingsArea"], [class*="_footerActions"]) button:hover { border-color: #2455e7; color: #1b44c8; box-shadow: inset 3px 0 #2455e7, 0 2px 0 #b8c6e6; }
& [data-cx-region="sidebar"], & [data-phone-drawer] { --hf-shell-scroll-thumb: rgba(100, 116, 139, 0.34); --hf-shell-scroll-thumb-hover: rgba(36, 85, 231, 0.72); }
& [data-row-key][aria-selected="true"] { --dsh-row-surface: #2455e7; --dsw-alias-label-primary: #ffffff; --dsw-alias-label-secondary: #dbe6ff; --dsw-alias-label-tertiary: #c2d4ff; box-shadow: 0 2px 10px rgba(36, 85, 231, 0.24); }
& [data-row-key][aria-selected="true"] [data-harness-id] { filter: brightness(0) invert(1); }
& :is([data-session-watching="true"], .cx-aag-row-badge) { border-color: rgba(36, 85, 231, 0.35); background: #e8eefc; color: #1b44c8; }
& [data-row-key][aria-selected="true"] :is([data-session-watching="true"], .cx-aag-row-badge) { background: #ffffff; color: #1b44c8; border-color: #ffffff; }
& :is([data-cx-region="sidebar"], [data-phone-drawer]) [class*="_watchingBadge"] { border-color: rgba(36, 85, 231, 0.42); background: #e8eefc; color: #1b44c8; }
& [data-row-key][aria-selected="true"] [class*="_watchingBadge"] { border-color: #ffffff; background: #ffffff; color: #1b44c8; }
& [role="dialog"]:has(select[class*="_renameInput"]) { border-color: #2455e7; }
& [role="dialog"]:has(ul[class*="_archiveActivity"]) { border-color: #dc2626; }
& [role="dialog"] [class*="_warning"] { background: #fef2f2; color: #b91c1c; border-color: rgba(220, 38, 38, 0.35); }
& [class*="_indicator"][class*="_success"] { background: #e6faf2; border-color: rgba(13, 159, 110, 0.45); color: #047857; }
& [data-cx-region="sidebar"], & [data-phone-drawer] { background: #eceff5; color: #14171f; }
& [data-phone-drawer] { box-shadow: 10px 0 32px rgba(15, 23, 42, 0.18); }
& [class*="_phoneBackdrop"] { background: rgba(15, 23, 42, 0.38); }
& [data-slot="sidebar"] :is([class*="_panelRow"], button[class*="_newSession"], [class*="_footer"] button) { color: #14171f; }
& [data-cx-region="sidebar"] [class*="_panelRow"] { color: #475166; }
& [data-cx-region="sidebar"] .hf-sb-brand-title { color: #0f1730; text-shadow: none; }
& [data-cx-region="sidebar"] .hf-sb-brand-badge { border-color: rgba(36, 85, 231, 0.32); background: rgba(36, 85, 231, 0.12); color: #2455e7; }
& [data-session-status="warning"] [class*="_timeStatus"] { color: #b45309; }
& [data-conversation-navigation-focus], & [data-shell-leading] { background: #f7f9fc; color: #14171f; border-color: #d5dce8; }
& [data-conversation-navigation-focus] [class*="_crumbCurrent"], & [data-conversation-navigation-focus][class*="_headerBlank"] [data-conversation-header-leading]::after { background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='6' fill='none' stroke='%23ffffff' stroke-width='1.6'/%3E%3Cpath d='m10.8 5.2-1.6 4-4 1.6 1.6-4Z' fill='%23ffffff'/%3E%3C/svg%3E") 11px center/14px 14px no-repeat, var(--hf-shell-accent-fill); color: #ffffff; }
& [data-conversation-tabs] { background: #e5e9f2; border-color: #cfd7e6; }
& [data-conversation-tabs] [role="tab"] { color: #475166; }
& [data-conversation-tabs] [role="tab"][aria-selected="true"] { color: #ffffff; }
}
@media (prefers-reduced-motion: reduce) { ${ROOT} [data-session-status="ongoing"] :is([data-state="ongoing"], [data-state="ongoing"]::before, [data-state="ongoing"]::after) { animation: none; } }
`

