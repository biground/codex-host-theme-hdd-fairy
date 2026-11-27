const ROOT = 'html:is([data-cx-ext-hdd-fairy-theme-dark],[data-cx-ext-hdd-fairy-theme-light])[data-hf-panel-rightbar="1"]'

export const RIGHTBAR_PANEL_CSS = `
${ROOT}[data-hf-preset-rightbar="amber"] { --hf-rb-strip:linear-gradient(180deg,#1a1a1e,#131316); --hf-rb-sub:#141519; --hf-rb-content:#0c0d10; --hf-rb-code:#0b0c0f; --hf-rb-stage:#18191e; --hf-rb-tab-radius:8px 3px 8px 8px; --hf-rb-tab-fg:#161308; --hf-rb-tab-bg:linear-gradient(100deg,#ff9e1a,#f8cb29 56%,#eeb418); }
${ROOT}[data-hf-preset-rightbar="street"] { --hf-rb-strip:#090a0e; --hf-rb-sub:#14171f; --hf-rb-content:#0c0e12; --hf-rb-code:#0a0c10; --hf-rb-stage:#161920; --hf-rb-tab-radius:6px; --hf-rb-tab-fg:#090b05; --hf-rb-tab-bg:#c8ff00; }
${ROOT}[data-hf-preset-rightbar="archive"] { --hf-rb-strip:#eceff5; --hf-rb-sub:#f3f5f9; --hf-rb-content:#ffffff; --hf-rb-code:#f7f9fc; --hf-rb-stage:#e8edf5; --hf-rb-tab-radius:999px; --hf-rb-tab-fg:#ffffff; --hf-rb-tab-bg:#2455e7; }
${ROOT} [data-sidebar-right-panel][data-sidebar-right-open="true"] { background:var(--hf-rb-content); color:var(--hf-text-primary); font-family:var(--hf-font-ui); font-synthesis-weight:none; }
${ROOT} [data-dockkit-strip] { box-sizing:border-box; height:38px; background:var(--hf-rb-strip); }
${ROOT} [data-dockkit-pane][data-dockkit-pane-active] > [data-dockkit-strip] { position:relative; }
${ROOT} [data-dockkit-pane][data-dockkit-pane-active] > [data-dockkit-strip]::before { content:""; position:absolute; top:0; left:0; width:min(96px,100%); height:2.5px; background:var(--hf-hazard-stripe); pointer-events:none; }
${ROOT} [data-dockkit-tab] { height:28px; border-radius:var(--hf-rb-tab-radius); color:#a8a9ad; font-weight:700; }
${ROOT} [data-dockkit-tab]:hover { background:rgba(255,255,255,.08); color:#fff; }
${ROOT} [data-dockkit-tab][aria-selected="true"] { background:var(--hf-rb-tab-bg); color:var(--hf-rb-tab-fg); font-weight:800; }
${ROOT} [data-dockkit-tab][data-dockkit-tab-quiet] { background:transparent; color:#f4f1e8; box-shadow:inset 3px 0 var(--hf-accent); }
${ROOT} [data-dockkit-tab-close] { position:absolute; right:4px; top:4px; width:20px; height:20px; }
${ROOT} :is([data-dockkit-add-tab],[data-dockkit-split-button],[data-sidebar-right-mode],[data-sidebar-right-toggle],[data-sidebar-right-expand]) { border-radius:6px; color:#b8becb; }
${ROOT} :is([data-dockkit-add-tab],[data-dockkit-split-button],[data-sidebar-right-mode],[data-sidebar-right-toggle],[data-sidebar-right-expand]):hover { color:var(--hf-rightbar-accent); }
${ROOT} [data-dockkit-divider]::before { background:#26262b; }
${ROOT} [data-dockkit-divider]:hover::before, ${ROOT} [data-dockkit-divider][data-dockkit-dragging]::before { background:var(--hf-accent); box-shadow:0 0 10px var(--hf-accent); }
${ROOT} [data-dockkit-dock-scrim] { background:rgba(10,11,14,.76); }
${ROOT} [data-dockkit-dock-zone] { border:1.5px dashed var(--hf-border-strong); }
${ROOT} [data-dockkit-drop-active] { border-color:var(--hf-accent); }
${ROOT} [data-dockkit-float] { border:2px solid var(--hf-border-strong); border-radius:14px 4px 14px 14px; box-shadow:0 24px 52px rgba(0,0,0,.72); }
${ROOT} [data-dockkit-float-active] { border-top-color:var(--hf-accent); }
${ROOT} [data-sidebar-right-guide] { background:var(--hf-rb-content); color:var(--hf-text-primary); }
${ROOT} [data-sidebar-right-guide-entry] { box-sizing:border-box; width:100%; max-width:min(380px, 100%); border:1px solid var(--hf-border-subtle); border-radius:12px 4px 12px 12px; background:var(--hf-bg-surface); }
${ROOT} [data-sidebar-right-guide-entry]:hover { box-shadow:inset 3px 0 var(--hf-accent); }
${ROOT} [data-sidebar-right-guide] kbd { background:var(--hf-bg-recessed); color:var(--hf-accent); border:1px solid var(--hf-border-strong); border-radius:4px; }
${ROOT} :is([data-files-state="tree"],[data-textpreview-state]) > [class*="_header"], ${ROOT} [data-sidebar-right-panel] div:has(> [data-sidebar-browser-frame]) ~ form[class*="_toolbar"], ${ROOT} [data-sidebar-right-panel] div:has([data-sidebar-browser-frame]) > form[class*="_toolbar"] { box-sizing:border-box; height:38px; min-height:38px; background:var(--hf-rb-sub); border-bottom:1px solid var(--hf-border-subtle); }
${ROOT} :is([data-files-path],[data-textpreview-path],input[class*="_address"],[data-diff],[data-document-zoom-controls]) { font-family:var(--hf-font-mono); font-variant-numeric:tabular-nums; }
${ROOT} [data-files-body] { background:var(--hf-rb-content); }
${ROOT} [data-files-body] ul[class*="_level"] ul[class*="_level"] { border-left:1px solid color-mix(in srgb,var(--hf-text-muted) 18%,transparent); }
${ROOT} [data-files-body] button[class*="_row"] { border-radius:7px; }
${ROOT} [data-files-body] button[class*="_row"]:hover { background:color-mix(in srgb,var(--hf-accent) 12%,transparent); }
${ROOT} [data-hf-file-match="false"] { display:none; }
${ROOT} [data-hf-file-changed="1"] > button::after { content:""; width:6px; height:6px; flex:none; margin-left:auto; border-radius:50%; background:var(--hf-accent); }
${ROOT} .hf-files-subbar { box-sizing:border-box; display:flex; align-items:center; gap:4px; height:34px; padding:4px 8px; background:var(--hf-rb-sub); }
${ROOT} .hf-files-search-wrap { display:flex; align-items:center; gap:6px; flex:1; min-width:0; height:24px; padding:0 7px; border:1px solid var(--hf-border-subtle); border-radius:6px; background:var(--hf-bg-recessed); color:var(--hf-text-muted); }
${ROOT} .hf-files-search-wrap:focus-within { border-color:var(--hf-accent); }
${ROOT} .hf-files-search { width:100%; min-width:0; border:0; outline:0; background:transparent; color:var(--hf-text-primary); font:12px var(--hf-font-ui); }
${ROOT} .hf-files-search::-webkit-search-cancel-button { display:none; }
${ROOT} .hf-files-clear { display:grid; place-items:center; width:24px; height:24px; border:0; border-radius:5px; background:transparent; color:var(--hf-text-muted); cursor:pointer; }
${ROOT} .hf-files-clear[hidden] { display:none; }
${ROOT} [data-diff-row="path"] { background:var(--hf-rb-sub); color:var(--hf-text-primary); box-shadow:inset 3px 0 var(--hf-accent); }
${ROOT} [data-diff-row="add"] { background:rgba(46,204,138,.11); box-shadow:inset 3px 0 #3ef0b0; }
${ROOT} [data-diff-row="del"] { background:rgba(255,93,122,.11); box-shadow:inset 3px 0 #ff5d7a; }
${ROOT} [data-document-viewer-menu] { border:1px solid var(--hf-accent); border-radius:5px; color:var(--hf-accent); font-weight:800; }
${ROOT} [data-textpreview-changed] { background:var(--hf-rb-sub); border-bottom:1px solid var(--hf-accent); }
${ROOT} [data-code-preview] { background:var(--hf-rb-code); }
${ROOT} [data-code-preview] [class*="_lineTarget"] { background:color-mix(in srgb,var(--hf-accent) 15%,transparent); box-shadow:inset 3px 0 var(--hf-accent); }
${ROOT} [data-code-preview] .line::before { color:#737781; font-variant-numeric:tabular-nums; user-select:none; }
${ROOT} :is([data-document-markdown],[data-plan-preview]) { background:var(--hf-rb-content); color:var(--hf-text-primary); line-height:1.7; }
${ROOT} [data-document-frontmatter] { border:1px solid var(--hf-border-subtle); border-left:3px solid var(--hf-accent); border-radius:8px; background:var(--hf-bg-surface); }
${ROOT} iframe[data-html-preview] { background:#fff; border:0; }
${ROOT} :is([data-pdf-preview],[data-image-preview]) { background:var(--hf-rb-stage); }
${ROOT} [data-pdf-preview] canvas { background:#fff; box-shadow:0 8px 24px rgba(0,0,0,.55); }
${ROOT} [data-pdf-text] ::selection { background:rgba(56,116,255,.28); }
${ROOT} [data-image-preview] img { background:repeating-conic-gradient(#1e2028 0% 25%,#14161b 0% 50%) 0 0 / 16px 16px; border:1px solid rgba(255,255,255,.1); box-shadow:0 12px 32px rgba(0,0,0,.45); }
${ROOT} [data-excel-preview] [class*="_workbook"] { color-scheme:light; color:CanvasText; }
${ROOT} [data-excel-unsupported-notice] { border-left:3px solid var(--hf-accent); }
${ROOT} [data-document-zoom-controls] { border:1px solid var(--hf-border-strong); border-radius:999px; background:var(--hf-bg-surface); color:var(--hf-text-primary); box-shadow:0 10px 28px rgba(0,0,0,.5); }
${ROOT} [data-sidebar-terminal], ${ROOT} [data-sidebar-terminal] [class*="_screen"] { background-color:#0a0b0e; color:#ebeef5; }
${ROOT} [data-sidebar-terminal] [role="status"] { background:#16171c; color:#ebeef5; border-bottom:1px solid #2c2b25; padding:6px 12px; }
${ROOT} [data-sidebar-terminal] .xterm-viewport::-webkit-scrollbar-thumb { background:rgba(248,203,41,.25); }
${ROOT} [data-terminal-composer] { background:#0a0b0e; color:#ebeef5; }
${ROOT} [data-terminal-key-strip] button { min-height:34px; background:#181a20; color:#ebeef5; border:1px solid #2f323c; border-bottom-width:2px; border-radius:7px; font:700 12px var(--hf-font-mono); }
${ROOT} [data-sidebar-right-panel] form[class*="_toolbar"] input[class*="_address"] { font-family:var(--hf-font-mono); border-radius:8px; }
${ROOT} [data-sidebar-right-panel] form[class*="_toolbar"] input[class*="_address"]:focus { outline:1px solid var(--hf-accent); }
${ROOT} [data-sidebar-right-panel] [class*="_sandboxOff"], ${ROOT} [data-sidebar-right-panel] [class*="_failure"] { color:#ff8da1; background:#281217; }
${ROOT} [data-sidebar-chat] [class*="_switcherTrigger"] { border:1px solid var(--hf-border-subtle); border-radius:6px; color:var(--hf-accent); }
${ROOT} [data-sidebar-chat] [data-state="ongoing"] { color:#50ed28; }
${ROOT} [data-sidebar-chat] [data-chat-flow] { font-size:13px; }
${ROOT} [data-sidebar-chat] [role="status"] { margin:0 10px 10px; padding:8px 12px; border:1px dashed var(--hf-border-strong); border-radius:10px; }
${ROOT} [data-sidebar-chat] [data-composer-card] { margin:0 8px 8px; border-radius:16px; }
${ROOT} [class*="_menu"]:has(> [role="tree"]) { border:1px solid var(--hf-rightbar-border-strong); border-radius:14px 4px 14px 14px; background:var(--hf-rightbar-bg-surface); color:var(--hf-rightbar-text-primary); box-shadow:0 20px 44px rgba(0,0,0,.72); }
${ROOT} [class*="_menu"] [role="treeitem"][aria-current="true"] { box-shadow:inset 3px 0 var(--hf-rightbar-accent); }
${ROOT}[data-hf-preset-rightbar="archive"] [data-dockkit-tab] { color:#475166; }
${ROOT}[data-hf-preset-rightbar="archive"] [data-dockkit-tab]:hover { background:rgba(36,85,231,.08); color:#14171f; }
${ROOT}[data-hf-preset-rightbar="archive"] [data-dockkit-tab][data-dockkit-tab-quiet] { color:#14171f; }
${ROOT}[data-hf-preset-rightbar="archive"] :is([data-dockkit-add-tab],[data-dockkit-split-button],[data-sidebar-right-mode],[data-sidebar-right-toggle],[data-sidebar-right-expand]) { color:#475166; }
${ROOT}[data-hf-preset-rightbar="archive"] [data-dockkit-divider]::before { background:#cfd7e6; }
${ROOT}[data-hf-preset-rightbar="archive"] [data-dockkit-dock-scrim] { background:rgba(15,23,42,.36); }
${ROOT}[data-hf-preset-rightbar="archive"] [data-dockkit-float] { box-shadow:0 18px 40px rgba(15,23,42,.18); }
${ROOT}[data-hf-preset-rightbar="archive"] [data-image-preview] img { background:repeating-conic-gradient(#e5e9f2 0% 25%,#ffffff 0% 50%) 0 0 / 16px 16px; border-color:rgba(20,28,48,.14); box-shadow:0 10px 24px rgba(15,23,42,.14); }
${ROOT}[data-hf-preset-rightbar="archive"] [data-document-zoom-controls] { box-shadow:0 8px 20px rgba(15,23,42,.14); }
${ROOT}[data-hf-preset-rightbar="archive"] [data-sidebar-right-panel] :is([class*="_sandboxOff"],[class*="_failure"]) { color:#b91c1c; background:#fef2f2; }
${ROOT}[data-hf-preset-rightbar="archive"] [class*="_menu"]:has(> [role="tree"]) { box-shadow:0 16px 34px rgba(15,23,42,.16); }
@media (max-width:767px) {
  ${ROOT} :is([data-sidebar-right-toggle],[data-sidebar-right-mode],[data-sidebar-right-expand]) { min-width:44px; min-height:44px; }
  ${ROOT} [data-terminal-key-strip] button { min-width:44px; min-height:44px; }
  ${ROOT} [data-dockkit-split-control] { visibility:hidden; }
}
`
