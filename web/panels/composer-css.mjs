const R = 'html:is([data-cx-ext-hdd-fairy-theme-dark],[data-cx-ext-hdd-fairy-theme-light])[data-hf-panel-composer="1"]'
const CTX_POP = `${R} body > [role="dialog"][class*="_panel"]:has(> [class*="_header"] > [class*="_figures"])`
const USE_POP = `${R} body > [role="dialog"][class*="_panel"]:has(> header):has(> [class*="_context"], > [class*="_group"])`
const QUO_POP = `${R} body > [role="dialog"][class*="_quotaPanel"]`
const HARNESS_MENU = `${R} body > [role="menu"][class*="_menu"]:has([class*="_rowButton"], [class*="_harnessName"], [class*="_moreToggle"])`

export const COMPOSER_PANEL_CSS = `
${R} {
  --hc-shell:linear-gradient(180deg,#19191e,#121216); --hc-border:#33312a; --hc-outline:#070709;
  --hc-well:#0c0d10; --hc-key:linear-gradient(180deg,#23242a,#191a1f); --hc-key-border:#35363f;
  --hc-key-ink:#f4f1e8; --hc-queue:linear-gradient(180deg,#211c10,#151411);
  --hc-shadow:0 14px 32px #0009,inset 0 1px 0 #fff1; --hc-focus:0 16px 36px #000a,0 0 0 1px #f8cb2973,0 0 22px #f8cb2924;
  --hc-run:0 16px 36px #000a,0 0 0 1px #ff5d3a6b; --hc-question:#17181d;
  --hc-menu:#121317; --hc-active:linear-gradient(90deg,#f8cb292e,#f8cb2908);
  --hc-pop-bg:linear-gradient(180deg,#18191f,#101115) #14151a; --hc-pop-border:1px solid rgba(248,203,41,.38);
  --hc-pop-radius:var(--hf-composer-radius-card); --hc-pop-shadow:0 18px 40px rgba(0,0,0,.78),0 0 0 1px #070709,inset 0 1px 0 rgba(255,244,204,.06);
  --hc-pop-ink:#f4f1e8; --hc-pop-label:#b8b3a6; --hc-pop-muted:#8f8a7e; --hc-pop-accent:var(--hf-composer-accent);
  --hc-pop-rule:rgba(248,203,41,.18); --hc-pop-track:#090a0d; --hc-pop-track-shadow:inset 0 1px 2px rgba(0,0,0,.55); --hc-pop-fill:var(--hf-composer-accent-fill);
  --hc-quota-filter:brightness(1.26) saturate(1.32); --hc-seg-sys:#68b5ff; --hc-seg-tools:#b68cff; --hc-seg-msg:var(--hf-composer-accent);
  --hc-dock-bg:rgba(17,18,22,.9); --hc-dock-border:rgba(248,203,41,.24); --hc-dock-ink:#cfc9bb;
  --hc-dock-active-bg:#231f12; --hc-dock-active-border:var(--hf-composer-accent); --hc-dock-active-ink:#ffd026; --hc-dock-active-shadow:0 0 12px rgba(248,203,41,.2);
}
${R}[data-hf-preset-composer="street"] {
  --hc-shell:radial-gradient(#ffffff0b 1px,transparent 1px) 0 0/8px 8px,#111318; --hc-border:#050507; --hc-outline:#383d47;
  --hc-well:#0b0d11; --hc-key:#1b1e26; --hc-key-border:#2f3440; --hc-queue:#161922; --hc-question:#12151c;
  --hc-shadow:3px 3px 0 #2d323e,0 14px 30px #0009; --hc-focus:4px 4px 0 #c8ff00,0 16px 34px #000b;
  --hc-run:4px 4px 0 #ff3b30,0 16px 34px #000b; --hc-menu:rgba(14,16,20,.99); --hc-active:#1f2418;
  --hc-pop-bg:radial-gradient(rgba(255,255,255,.045) 1px,transparent 1px) 0 0/7px 7px,#111318; --hc-pop-border:2px solid #050507;
  --hc-pop-shadow:4px 4px 0 #c8ff00,0 16px 36px rgba(0,0,0,.8),0 0 0 1px #363a42;
  --hc-pop-ink:#eef1f6; --hc-pop-label:#b4bccb; --hc-pop-muted:#8c95a6; --hc-pop-rule:rgba(200,255,0,.22);
  --hc-pop-track:#07080b; --hc-pop-fill:linear-gradient(90deg,#9be800,#c8ff00); --hc-quota-filter:brightness(1.3) saturate(1.38);
  --hc-dock-bg:#111318; --hc-dock-border:#2f3440; --hc-dock-ink:#ccd2de;
  --hc-dock-active-bg:#1a2010; --hc-dock-active-border:#c8ff00; --hc-dock-active-ink:#c8ff00; --hc-dock-active-shadow:2px 2px 0 #c8ff00;
}
${R}[data-hf-preset-composer="archive"] {
  --hc-shell:#ffffff; --hc-border:#2455e7; --hc-outline:rgba(36,85,231,.16);
  --hc-well:#f4f6fb; --hc-key:#f7f9fc; --hc-key-border:#cfd7e6; --hc-key-ink:#14171f;
  --hc-queue:#eef3ff; --hc-question:#f4f6fb; --hc-shadow:0 12px 28px rgba(15,23,42,.10),0 0 0 1px rgba(36,85,231,.14);
  --hc-focus:0 14px 32px rgba(36,85,231,.16),0 0 0 2px #2455e7; --hc-run:0 14px 32px rgba(220,38,38,.16),0 0 0 2px #dc2626;
  --hc-menu:#ffffff; --hc-active:#e8eefc;
  --hc-pop-bg:#ffffff; --hc-pop-border:2px solid #2455e7;
  --hc-pop-shadow:0 16px 36px rgba(15,23,42,.16),0 0 0 1px rgba(36,85,231,.14);
  --hc-pop-ink:#14171f; --hc-pop-label:#475166; --hc-pop-muted:#667085; --hc-pop-rule:rgba(36,85,231,.16);
  --hc-pop-track:#dce2ee; --hc-pop-track-shadow:inset 0 1px 2px rgba(15,24,60,.12); --hc-pop-fill:linear-gradient(90deg,#1b44c8,#2455e7,#4a78ff); --hc-quota-filter:brightness(.84) saturate(1.28);
  --hc-seg-sys:#2455e7; --hc-seg-tools:#7c3aed; --hc-seg-msg:#0d9f6e;
  --hc-dock-bg:#ffffff; --hc-dock-border:#cfd7e6; --hc-dock-ink:#273043;
  --hc-dock-active-bg:#2455e7; --hc-dock-active-border:#2455e7; --hc-dock-active-ink:#ffffff; --hc-dock-active-shadow:0 4px 12px rgba(36,85,231,.28);
}
/* The card stays open for its non-portal trigger menu. */
${R} [data-conversation-content] [data-composer-card] {
  position:relative; z-index:2; overflow:visible !important; border:2px solid var(--hc-border);
  outline:1px solid var(--hc-outline); border-radius:var(--hf-composer-radius-panel);
  background:var(--hc-shell); box-shadow:var(--hc-shadow);
}
${R}[data-hf-preset-composer="street"] [data-composer-card], ${R}[data-hf-preset-composer="archive"] [data-composer-card] { border-width:3px; }
${R} [data-composer-card]::before { content:""; position:absolute; inset:0; z-index:0; pointer-events:none; border-radius:inherit; background:var(--hf-composer-hazard-stripe) top/100% 3.5px no-repeat; backdrop-filter:none; -webkit-backdrop-filter:none; box-shadow:none; }
${R} [data-composer-card]:focus-within { box-shadow:var(--hc-focus); }
${R} [data-composer-card]:has([data-toolbar-fixed="end"] button:has(svg > rect)) { box-shadow:var(--hc-run); }
${R} [data-composer-card]:has([data-trigger-menu]) { z-index:25; }
${R} [data-composer-card][class*="_cardWorkspaceTrigger"] { outline:1.5px dashed var(--hf-composer-accent); outline-offset:-7px; }
${R} [data-composer-card] [class*="_scroll"]:has([contenteditable]) { background:var(--hc-well); border-radius:12px; box-shadow:inset 0 2px 5px #000a; }
${R} [data-composer-card] [contenteditable] { color:#f4f1e8; caret-color:var(--hf-composer-accent); }
${R} [data-composer-card] [class*="_inputDisabled"] { opacity:.6; cursor:not-allowed; }
${R} [data-composer-toolbar] button { border:1px solid var(--hc-key-border); border-radius:9px; background:var(--hc-key); color:var(--hc-key-ink); box-shadow:0 2.5px 0 #08080a,inset 0 1px 0 #ffffff14; }
${R} [data-composer-toolbar] button:active:not(:disabled) { translate:0 1.5px; box-shadow:0 1px 0 #08080a; }
${R} [data-conversation-content] [data-composer-tools] [data-toolbar-fixed="start"] button,
${R} [data-conversation-content] [data-composer-tools] button[aria-haspopup="menu"]:has(svg) { border:1px solid var(--hc-key-border); border-radius:9px; background:var(--hc-key); color:var(--hc-key-ink); }
${R} [data-composer-toolbar] [class*="_triggerDangerous"] { background:repeating-linear-gradient(-45deg,#ff7a3024 0 6px,#20140e 6px 12px) !important; border-color:#ff88408c !important; color:#ff9852 !important; }
${R} [data-composer-toolbar] [class*="_modes"] [class*="_chip"] { background:#172336; color:#57b8ff; border-color:#57b8ff; }
${R} [data-composer-toolbar] [class*="_triggerEffort"] { background:var(--hf-composer-accent); color:var(--hf-composer-accent-contrast); border-radius:5px; padding:1px 5px; }
${R} [data-conversation-content] [data-toolbar-fixed="end"] button:has(svg > path):not(:disabled) { border:1px solid #d5a512; border-radius:10px; background:linear-gradient(135deg,#ffae19,#f8cb29 55%,#e5ad12); color:#151206; box-shadow:0 2.5px 0 #7a5c00; }
${R}[data-hf-preset-composer="street"] [data-toolbar-fixed="end"] button:has(svg > path):not(:disabled) { background:#c8ff00; }
${R} [data-conversation-content] [data-toolbar-fixed="end"] button:has(svg > path):disabled { border:1px solid #35363f; border-radius:10px; background:#222329; color:#777b85; box-shadow:inset 0 2px 4px #0008; }
${R} [data-conversation-content] [data-toolbar-fixed="end"] button:has(svg > rect) { border:1px solid #ff6858; border-radius:10px; background:linear-gradient(#ff4b3a,#d9261c); color:white; box-shadow:0 2.5px 0 #7a110b; }
${R} [data-composer-card] [contenteditable] [class*="_reference"][class*="_chip"] { padding:1px 7px; margin:0 2px; border:1px solid var(--hf-composer-accent); border-radius:6px; background:#ffffff12; color:var(--hf-composer-accent); font:700 .92em var(--hf-font-mono); }
${R} [data-composer-card] [contenteditable] [class*="_reference"][class*="_chip"]:hover { background:#ffffff28; }
${R} [data-composer-card] [class*="_reference"][class*="_invalid"] { color:#ff7777; border:1px dashed #ff5d52; text-decoration:line-through; }
${R} [data-composer-card] [class*="_rail"] [class*="_imageItem"] { border:1px solid #353740; border-radius:12px; }
${R} [data-composer-card] [class*="_rail"] [class*="_card"] { background:#14151a; border:1px solid #2e3038; border-radius:12px; }
${R} [data-composer-card] [class*="_rail"] [class*="_failed"] { border-color:#ff4d4f; color:#ff7777; }
/* Changes and queue retain the host's sizing and interaction. */
${R} [data-composer-seat] [class*="_anchor"]:has(> [class*="_pill"][role="status"]) { position:relative; z-index:3; }
${R} [data-composer-seat] [class*="_anchor"]:has(> [class*="_pill"][role="status"]):is(:hover,:focus-within,:focus-visible) { z-index:15; }
${R} [data-composer-seat] [class*="_pill"][role="status"] { min-height:32px; padding:0 14px; border:1px solid var(--hf-composer-accent); border-radius:999px; background:#0b0e17; color:#f2efe6; font-weight:800; }
${R} [data-composer-seat] [class*="_anchor"]:has(> [class*="_pill"]) [class*="_list"] { min-width:240px; max-width:380px; max-height:240px; overflow-y:auto; background:var(--hc-menu); border:1px solid var(--hf-composer-accent); border-radius:12px; box-shadow:0 12px 30px #000a; }
${R} [data-composer-seat] [class*="_anchor"]:has(> [class*="_pill"]) [class*="_file"] { font-family:var(--hf-font-mono); border-bottom:1px solid #ffffff12; }
${R} [data-composer-seat] [class*="_anchor"] :is([class*="_added"],[class*="_additions"]) { color:#3ef0b0; }
${R} [data-composer-seat] [class*="_anchor"] :is([class*="_removed"],[class*="_deletions"]) { color:#ff5d52; }
${R} [data-queue-dock] { position:relative; z-index:1; margin-bottom:calc(0px - var(--dsh-composer-stack-gap, 6px) - 3px); }
${R} [data-queue-dock] > [class*="_panel"] { background:var(--hc-queue); color:#f4f1e8; border:1.5px solid var(--hf-composer-accent); border-radius:14px 14px 0 0; }
${R} [data-queue-dock] [class*="_header"] { min-height:36px; color:inherit; font-weight:800; }
${R} [data-queue-dock] [class*="_list"] { max-height:180px; overflow-y:auto; }
${R} [data-queue-dock] [class*="_preview"] { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
${R} [data-queue-dock] [data-submission-echo] { opacity:.72; }
${R} [data-queue-dock] [class*="_actions"] button { min-width:26px; min-height:26px; border:1px solid #ffffff30; border-radius:7px; background:#14151a; color:#f4f1e8; }
${R} [data-queue-dock] [class*="_actions"] button:last-child { color:var(--hf-composer-accent); border-color:var(--hf-composer-accent); }
${R} [data-queue-dock] [class*="_paused"] { background:#3a2414; color:#ffd026; }
/* Non-portal command and reference menu. */
${R} [data-trigger-menu] { z-index:120; max-height:400px; background:var(--hc-menu); color:#f4f1e8; border:1px solid var(--hf-composer-accent); border-top:3px solid var(--hf-composer-accent); border-radius:14px; box-shadow:0 -12px 32px #000a; }
${R} [data-trigger-menu] :is([class*="_search"], [class*="_searchRow"]) { background:#0b0c0f; border:1px solid #2d2e36; border-radius:9px; }
${R} [data-trigger-menu] input { font-size:14px; color:#f4f1e8; }
${R} [data-trigger-menu] :is([class*="_crumbs"],[class*="_groupLabel"]) { border-bottom:1px solid #ffffff18; color:#a9a69d; }
${R} [data-trigger-menu] [role="option"] { min-height:36px; color:#f4f1e8; border-left:3px solid transparent; }
${R} [data-trigger-menu] [role="option"]:is(:hover,[aria-selected="true"],[class*="_active"]) { background:var(--hc-active); border-left-color:var(--hf-composer-accent); color:#fff; }
${R} [data-trigger-menu] :is([class*="_itemName"],[class*="_drillHint"]) { font-family:var(--hf-font-mono); font-weight:700; }
${R} [data-trigger-menu] [class*="_drillHint"] { background:#0d0e12; border:1px solid #454652; border-radius:4px; box-shadow:0 1.5px 0 #050507; }
/* Body portals (non-model menus) use composer tokens; model-select portal is owned by model-select-css.mjs. */
${R} body > [role="menu"]:has([class*="_optionCopy"]) { background:var(--hc-menu); color:#f4f1e8; border:1px solid var(--hf-composer-accent); border-radius:12px; box-shadow:0 14px 32px #000b; }
${R} body > [role="menu"]:has([class*="_optionCopy"]) [class*="_description"] { color:#a9adb8; font-size:11.5px; }
${R} body > [role="menu"]:has([class*="_optionCopy"]) [class*="_dangerous"] { color:#ff9852; }
/* Unified v0.28.1 HarnessSelect portal menu (100% opaque surface, hazard top bar, zero bleed). */
${HARNESS_MENU} {
  padding:11px 6px 6px; border:var(--hc-pop-border); border-radius:var(--hc-pop-radius);
  background:var(--hf-composer-hazard-stripe) top left/100% 3.5px no-repeat,var(--hc-pop-bg);
  box-shadow:var(--hc-pop-shadow); color:var(--hc-pop-ink); backdrop-filter:none; -webkit-backdrop-filter:none; overflow:hidden;
}
${HARNESS_MENU} > [class*="_material"] { display:none !important; }
${HARNESS_MENU} [class*="_rowButton"] { border-radius:8px 3px 8px 8px; background:transparent; color:var(--hc-pop-ink); font-family:var(--hf-font-ui); font-weight:600; box-shadow:none; transition:background-color 120ms ease,color 120ms ease,box-shadow 120ms ease; }
${HARNESS_MENU} [class*="_rowButton"]:is(:hover,:focus-visible):not(:disabled) { background:var(--hc-active); color:var(--hc-pop-ink); box-shadow:inset 3px 0 var(--hf-composer-accent); }
${HARNESS_MENU} [class*="_rowButton"][data-current],
${HARNESS_MENU} [class*="_rowButton"][data-current]:is(:hover,:focus-visible) { background:var(--hc-active); color:var(--hc-pop-ink); font-weight:800; box-shadow:inset 3.5px 0 var(--hf-composer-accent); }
${HARNESS_MENU} [class*="_harnessName"] { color:inherit; }
${HARNESS_MENU} [class*="_actionSlot"] { color:var(--hc-pop-muted); }
${HARNESS_MENU} [class*="_checkIcon"] { color:var(--hf-composer-accent); }
${HARNESS_MENU} [class*="_handoffIcon"] { color:var(--hc-pop-muted); }
${HARNESS_MENU} [class*="_row"]:is(:hover,:focus-within) [class*="_handoffIcon"] { color:var(--hf-composer-accent); }
${HARNESS_MENU} [class*="_rowActionButton"] { border:1px solid transparent; border-radius:6px 2px 6px 6px; background:transparent; color:var(--hc-pop-label); }
${HARNESS_MENU} [class*="_rowActionButton"]:is(:hover,:focus-visible) { border-color:var(--hf-composer-accent); background:var(--hc-active); color:var(--hf-composer-accent); }
${HARNESS_MENU} [class*="_installButton"] { color:var(--hf-composer-accent); opacity:.86; }
${HARNESS_MENU} [class*="_installButton"]:is(:hover,:focus-visible) { opacity:1; }
${HARNESS_MENU} [class*="_errorButton"] { color:var(--hf-composer-danger); }
${HARNESS_MENU} [class*="_errorButton"]:is(:hover,:focus-visible) { border-color:var(--hf-composer-danger); background:color-mix(in srgb,var(--hf-composer-danger) 14%,transparent); color:var(--hf-composer-danger); }
${HARNESS_MENU} [class*="_separator"] { height:1px; margin:5px 4px; background:var(--hc-pop-rule); }
${HARNESS_MENU} [class*="_sectionLabel"] { color:var(--hf-composer-accent); font:800 10.5px/15px var(--hf-font-mono); letter-spacing:.06em; text-transform:uppercase; }
${HARNESS_MENU} :is([class*="_moreToggle"],[class*="_hideUnusedCta"]) { color:var(--hc-pop-label); opacity:1; border-radius:7px 2px 7px 7px; font-weight:700; }
${HARNESS_MENU} [class*="_hideUnusedCta"] { border-top:1px solid var(--hc-pop-rule); border-radius:0 0 7px 7px; }
${HARNESS_MENU} :is([class*="_moreToggle"],[class*="_hideUnusedCta"]):is(:hover,:focus-visible) { background:var(--hc-active); color:var(--hf-composer-accent); opacity:1; }
${HARNESS_MENU} [class*="_manageLink"] { color:var(--hf-composer-accent); font-weight:700; border-radius:7px 2px 7px 7px; }
${HARNESS_MENU} [class*="_manageLink"]:is(:hover,:focus-visible) { background:var(--hc-active); }
${HARNESS_MENU} [class*="_footer"] { border-top:1px solid var(--hc-pop-rule); }
${HARNESS_MENU} [class*="_footer"] [class*="_label"] { color:var(--hc-pop-muted); font-size:11px; }
/* Security gate: first and last work with both two and three actions. */
${R} :is([data-approval-key],[data-plan-review-key]) [class*="_card"] { background:#17181d; border:2px solid #f8aa29a6; border-radius:var(--hf-composer-radius-panel); box-shadow:0 18px 42px #000b,0 0 24px #f8a52424; }
${R} :is([data-approval-key],[data-plan-review-key]) [class*="_strip"] { min-height:38px; background:linear-gradient(90deg,#261a0af5,#1c140ae0 68%,transparent),repeating-linear-gradient(-55deg,#f8cb2938 0 8px,#100f0cf2 8px 16px); border-bottom:1px solid #f8cb2952; color:#ffd026; font-weight:900; }
${R} [data-approval-key] [class*="_headline"] { color:#f5f2e9; font-size:15px; font-weight:800; }
${R} [data-approval-key] [class*="_command"] { margin-top:8px; padding:10px 14px; max-height:220px; overflow:auto; overflow-wrap:anywhere; background:#08090c; border:1px solid #2a2c34; border-left:3.5px solid #f8cb29; border-radius:10px; color:#e2e8f4; font:12.5px/1.55 var(--hf-font-mono); }
${R} :is([data-approval-key] [class*="_actionRow"],[data-plan-review-key] [class*="_actions"]) button { border:1px solid #f8cb298c; border-radius:9px; background:#231f14; color:#ffd026; font-weight:800; box-shadow:0 2px 0 #08080a; }
${R} [data-approval-key] [class*="_actionRow"] button:first-child { border-color:#ff5d5d85; background:#1b1416; color:#ff7b7b; }
${R} [data-approval-key] [class*="_actionRow"] button:first-child:hover { background:#3a1418; }
${R} :is([data-approval-key] [class*="_actionRow"],[data-plan-review-key] [class*="_actions"]) button:last-child { border-color:#d5a512; background:linear-gradient(135deg,#ffae19,#f8cb29 56%,#e5ad12); color:#141106; box-shadow:0 2.5px 0 #7a5c00; }
/* Knock-Knock: readable left aligned options with a visible selected stamp. */
${R} [data-question-key] > section { background:var(--hc-question); border:2px solid var(--hf-composer-accent); border-radius:var(--hf-composer-radius-panel); box-shadow:var(--hc-shadow); padding:9px; }
${R} [data-question-key] header { background:#07080b; border-radius:15px; padding:12px 16px; }
${R} [data-question-key] [class*="_eyebrow"] { background:var(--hf-composer-accent); color:var(--hf-composer-accent-contrast); border-radius:5px; padding:2px 6px; font-weight:900; white-space:nowrap; flex:none; }
${R} [data-question-key] [data-question-scroll] { overflow-x:hidden !important; overflow-y:auto; }
${R} [data-question-key] [data-question-scroll]::-webkit-scrollbar:horizontal { display:none; height:0; }
${R} [data-question-key] [data-question-scroll] > [class*="_detail"] { background:#0d0f14; border-left:3px solid var(--hf-composer-accent); color:#f4f1e8; }
${R} [data-question-key] :is(button[role="radio"],button[role="checkbox"],[class*="_customRow"],[class*="_customBlock"]) { background:#f4f4f2; color:#111318; border:2px solid #0f121c1a; border-radius:14px; text-align:left; box-shadow:0 2px 0 #0002; }
${R} [data-question-key] [class*="_optionLine"] { justify-content:flex-start; text-align:left; flex-wrap:wrap; }
${R} [data-question-key] [class*="_optionCopy"] { text-align:left; }
${R} [data-question-key] [class*="_optionLabel"] { font-size:15px; font-weight:700; }
${R} [data-question-key] [class*="_description"] { color:#525866; font-size:13.5px; }
${R} [data-question-key] :is(button[role="radio"],button[role="checkbox"])[aria-checked="true"] { background:#fffdf4; border-color:#111318; box-shadow:inset 4px 0 var(--hf-composer-accent),0 2px 0 #0002; }
${R}[data-hf-preset-composer="archive"] [data-question-key] [aria-checked="true"] { background:#f5f8ff; }
${R} [data-question-key] [aria-checked="true"] :is([class*="_number"],[class*="_checkbox"]) { background:#111318; color:#fff; border-color:#111318; }
${R} [data-question-key] [class*="_badge"] { padding:1px 7px; border-radius:999px; background:#f8cb29; color:#141106; font-weight:900; }
${R} [data-question-key] :is([class*="_customRow"],[class*="_customBlock"]) { border:2px dashed #b8c0cc; }
${R} [data-question-key] :is([class*="_customRow"]:focus-within,[class*="_customBlock"]:focus-within,[class*="_customRowActive"]) { border-style:solid; border-color:#111318; background:#fff; }
${R} [data-question-key] :is([class*="_fieldInput"],[class*="_fieldMirror"]) { font-family:var(--hf-font-ui); font-size:15px; line-height:24px; font-weight:500; padding:0; }
${R} [data-question-key] [class*="_pager"] { background:#07080cbf; border-radius:999px; padding:3px 8px; color:#fff; white-space:nowrap; flex:none; }
${R} [data-question-key] footer [class*="_footerActions"] button:not([class*="_iconButton"]) { background:#07080c8c; border:1.5px solid #ffffff73; color:white; border-radius:999px; }
${R} [data-question-key] footer [class*="_footerActions"] button:not([class*="_iconButton"]):last-child { background:linear-gradient(135deg,#ffae19,#f8cb29); color:#111; border:2px solid #090b10; box-shadow:0 2.5px 0 #090b10; font-weight:900; }
${R} [data-question-key] footer [class*="_footerActions"] button:disabled { opacity:.42; }
/* Bottom telemetry dock and its three body-portaled popovers (context, usage, quota). */
${R} [data-composer-dock] { gap:8px; padding-top:6px; }
${R} [data-composer-dock] :is([class*="_pill"],[class*="_trigger"]) { min-height:24px; padding:2px 9px; border:1px solid var(--hc-dock-border); border-radius:999px; background:var(--hc-dock-bg); color:var(--hc-dock-ink); font-size:12px; font-weight:700; font-variant-numeric:tabular-nums; line-height:18px; }
${R} [data-composer-dock] :is([class*="_pill"],[class*="_trigger"]):is(:hover,:focus-visible,[aria-expanded="true"]) { border-color:var(--hc-dock-active-border); background:var(--hc-dock-active-bg); color:var(--hc-dock-active-ink); box-shadow:var(--hc-dock-active-shadow); }
${R} [data-composer-dock] :is([class*="_ringTrack"],[class*="_track"]) { stroke:rgba(255,255,255,.18); }
${R} [data-composer-dock] [class*="_trigger"] [class*="_fill"] { stroke:var(--hf-composer-accent); }
${R}[data-hf-preset-composer="archive"] [data-composer-dock] [class*="_trigger"]:is(:hover,:focus-visible,[aria-expanded="true"]) [class*="_fill"] { stroke:#ffffff; }
${R} [data-composer-dock] [class*="_quotaRing"] { stroke:var(--hf-composer-accent) !important; filter:none; }
${R}[data-hf-preset-composer="archive"] [data-composer-dock] [class*="_pill"]:is(:hover,:focus-visible,[aria-expanded="true"]) [class*="_quotaRing"] { stroke:#ffffff !important; }
${CTX_POP},
${USE_POP},
${QUO_POP} {
  padding:15px 13px 12px; border:var(--hc-pop-border); border-radius:var(--hc-pop-radius);
  background:var(--hf-composer-hazard-stripe) top left/100% 3px no-repeat,var(--hc-pop-bg);
  backdrop-filter:none; -webkit-backdrop-filter:none; box-shadow:var(--hc-pop-shadow); color:var(--hc-pop-ink);
}
${CTX_POP} [class*="_header"] { gap:5px; align-items:baseline; }
${CTX_POP} [class*="_headline"] { color:var(--hc-pop-label); font-size:12px; font-weight:600; white-space:nowrap; }
${CTX_POP} [class*="_percent"] { color:var(--hc-pop-accent); font-size:14px; font-weight:800; font-variant-numeric:tabular-nums; white-space:nowrap; }
${CTX_POP} [class*="_figures"] { margin-left:auto; color:var(--hc-pop-ink); font:700 12px/1.3 var(--hf-font-mono); font-variant-numeric:tabular-nums; white-space:nowrap; }
${CTX_POP} [class*="_bar"] { height:6px; margin:10px 0 4px; border-radius:999px; background:var(--hc-pop-track); box-shadow:var(--hc-pop-track-shadow); }
${CTX_POP} [class*="_segment"]:not([class*="_color"]) { background:var(--hc-pop-fill); border-radius:999px; }
${CTX_POP} [class*="_colorSystem"] { --meter-tint:var(--hc-seg-sys); }
${CTX_POP} [class*="_colorTools"] { --meter-tint:var(--hc-seg-tools); }
${CTX_POP} [class*="_colorMessages"] { --meter-tint:var(--hc-seg-msg); }
${CTX_POP} [class*="_rows"] { margin:10px 0 0; padding-top:8px; border-top:1px solid var(--hc-pop-rule); }
${CTX_POP} [class*="_row"] dt { color:var(--hc-pop-label); font-weight:600; }
${CTX_POP} [class*="_row"] dd { color:var(--hc-pop-ink); font-weight:700; font-variant-numeric:tabular-nums; }
${USE_POP} > header { margin:0 0 8px; padding-bottom:7px; border-bottom:1px solid var(--hc-pop-rule); color:var(--hc-pop-ink); font-size:13.5px; font-weight:800; letter-spacing:.03em; }
${USE_POP} [class*="_context"] { margin-top:0; padding-bottom:10px; border-bottom:1px solid var(--hc-pop-rule); }
${USE_POP} [class*="_contextRow"] { gap:10px; color:var(--hc-pop-label); font-weight:600; }
${USE_POP} [class*="_contextRow"] strong { color:var(--hc-pop-accent); font-weight:800; font-variant-numeric:tabular-nums; white-space:nowrap; }
${USE_POP} [class*="_progressTrack"] { height:6px; margin-top:7px; border-radius:999px; background:var(--hc-pop-track); box-shadow:var(--hc-pop-track-shadow); }
${USE_POP} [class*="_progressFill"] { background:var(--hc-pop-fill); border-radius:999px; }
${USE_POP} [class*="_group"] { margin-top:9px; padding-top:8px; border-top:1px solid var(--hc-pop-rule); }
${USE_POP} :is(header,[class*="_context"]) + [class*="_group"] { margin-top:8px; padding-top:0; border-top:0; }
${USE_POP} [class*="_group"] h3 { margin:0 0 5px; color:var(--hc-pop-accent); font:800 10.5px/1.3 var(--hf-font-mono); letter-spacing:.08em; text-transform:uppercase; }
${USE_POP} [class*="_detail"] { align-items:baseline; grid-template-columns:minmax(76px,auto) minmax(0,1fr); gap:2px 10px; }
${USE_POP} [class*="_detail"] dt { color:var(--hc-pop-label); font-weight:600; white-space:nowrap; }
${USE_POP} [class*="_detail"] dd { color:var(--hc-pop-ink); font-weight:700; font-variant-numeric:tabular-nums; white-space:nowrap; }
${USE_POP} [class*="_detail"] p { color:var(--hc-pop-muted); font-size:11px; }
${QUO_POP} [class*="_quotaGroup"] + [class*="_quotaGroup"] { border-top-color:var(--hc-pop-rule); }
${QUO_POP} [class*="_quotaGroupTitle"] { margin:0 0 8px; color:var(--hc-pop-accent); font:800 11px/1.3 var(--hf-font-mono); letter-spacing:.06em; text-transform:uppercase; }
${QUO_POP} [class*="_quotaDescription"] { color:var(--hc-pop-label); font-weight:600; }
${QUO_POP} :is([class*="_quotaInlineNote"],[class*="_quotaRow"] p) { color:var(--hc-pop-muted); font-size:11px; }
${QUO_POP} [class*="_quotaHeading"] strong { color:var(--hc-pop-accent) !important; filter:none; font-weight:800; font-variant-numeric:tabular-nums; }
${QUO_POP} [class*="_quotaGroup"][data-scoped-group] [class*="_quotaRow"][data-hero-row] [class*="_quotaHeading"] strong { margin-top:-2px; font-size:20px; font-weight:900; }
${QUO_POP} [class*="_progressTrack"] { height:6px; border-radius:999px; background:var(--hc-pop-track); box-shadow:var(--hc-pop-track-shadow); }
${QUO_POP} [class*="_quotaGroup"][data-scoped-group] [class*="_progressTrack"] { height:6px; }
${QUO_POP} [class*="_quotaFill"] { background:var(--hc-pop-fill) !important; border-radius:999px; filter:none; }
${QUO_POP} [class*="_resetCreditsFooter"] { border-top-color:var(--hc-pop-rule); color:var(--hc-pop-label); }
${QUO_POP} [class*="_resetCreditsCopy"] { color:var(--hc-pop-ink); font-weight:600; }
${QUO_POP} [class*="_resetCreditsExpiry"] { color:var(--hc-pop-muted); }
${QUO_POP} [class*="_resetCreditsPill"] { filter:var(--hc-quota-filter); font-weight:800; }
${R}[data-hf-preset-composer="archive"] [data-composer-card] [class*="_scroll"]:has([contenteditable]) { box-shadow:inset 0 1px 3px rgba(15,23,42,.08); border:1px solid #d5dce8; }
${R}[data-hf-preset-composer="archive"] [data-composer-card] [contenteditable] { color:#14171f; }
${R}[data-hf-preset-composer="archive"] [data-composer-toolbar] button { box-shadow:0 2px 0 #cfd7e6; }
${R}[data-hf-preset-composer="archive"] [data-composer-toolbar] button:active:not(:disabled) { box-shadow:0 1px 0 #cfd7e6; }
${R}[data-hf-preset-composer="archive"] [data-composer-toolbar] [class*="_triggerDangerous"] { background:repeating-linear-gradient(-45deg,rgba(220,38,38,.08) 0 6px,#fff5f5 6px 12px) !important; border-color:#ef4444 !important; color:#b91c1c !important; }
${R}[data-hf-preset-composer="archive"] [data-composer-toolbar] [class*="_modes"] [class*="_chip"] { background:#e8eefc; color:#1b44c8; border-color:#93b4ff; }
${R}[data-hf-preset-composer="archive"] [data-conversation-content] [data-toolbar-fixed="end"] button:has(svg > path):not(:disabled) { border-color:#1b44c8; background:#2455e7; color:#ffffff; box-shadow:0 2px 0 #153499; }
${R}[data-hf-preset-composer="archive"] [data-conversation-content] [data-toolbar-fixed="end"] button:has(svg > path):disabled { border-color:#cfd7e6; background:#e5e9f2; color:#7c8599; box-shadow:none; }
${R}[data-hf-preset-composer="archive"] [data-composer-card] [contenteditable] [class*="_reference"][class*="_chip"] { background:rgba(36,85,231,.08); }
${R}[data-hf-preset-composer="archive"] [data-composer-card] [class*="_rail"] [class*="_imageItem"],
${R}[data-hf-preset-composer="archive"] [data-composer-card] [class*="_rail"] [class*="_card"] { background:#f7f9fc; border-color:#cfd7e6; color:#14171f; }
${R}[data-hf-preset-composer="archive"] [data-composer-seat] [class*="_pill"][role="status"] { background:#ffffff; color:#14171f; }
${R}[data-hf-preset-composer="archive"] [data-composer-seat] [class*="_anchor"]:has(> [class*="_pill"]) [class*="_list"] { color:#14171f; box-shadow:0 12px 28px rgba(15,23,42,.16); }
${R}[data-hf-preset-composer="archive"] [data-composer-seat] [class*="_anchor"]:has(> [class*="_pill"]) [class*="_file"] { border-bottom-color:#e5e9f2; }
${R}[data-hf-preset-composer="archive"] [data-queue-dock] > [class*="_panel"] { color:#14171f; }
${R}[data-hf-preset-composer="archive"] [data-queue-dock] [class*="_actions"] button { border-color:#cfd7e6; background:#ffffff; color:#14171f; }
${R}[data-hf-preset-composer="archive"] [data-queue-dock] [class*="_paused"] { background:#fef3c7; color:#92400e; }
${R}[data-hf-preset-composer="archive"] [data-trigger-menu] { color:#14171f; box-shadow:0 -12px 28px rgba(15,23,42,.14); }
${R}[data-hf-preset-composer="archive"] [data-trigger-menu] :is([class*="_search"], [class*="_searchRow"]) { background:#f3f5f9; border-color:#cfd7e6; }
${R}[data-hf-preset-composer="archive"] [data-trigger-menu] input { color:#14171f; }
${R}[data-hf-preset-composer="archive"] [data-trigger-menu] :is([class*="_crumbs"],[class*="_groupLabel"]) { border-bottom-color:#e5e9f2; color:#556070; }
${R}[data-hf-preset-composer="archive"] [data-trigger-menu] [role="option"] { color:#14171f; }
${R}[data-hf-preset-composer="archive"] [data-trigger-menu] [role="option"]:is(:hover,[aria-selected="true"],[class*="_active"]) { color:#1b44c8; }
${R}[data-hf-preset-composer="archive"] [data-trigger-menu] [class*="_drillHint"] { background:#e5e9f2; border-color:#cfd7e6; color:#334155; box-shadow:0 1.5px 0 #b8c2d6; }
${R}[data-hf-preset-composer="archive"] body > [role="menu"]:has([class*="_optionCopy"]) { color:#14171f; box-shadow:0 14px 32px rgba(15,23,42,.16); }
${R}[data-hf-preset-composer="archive"] body > [role="menu"]:has([class*="_optionCopy"]) [class*="_description"] { color:#556070; }
${R}[data-hf-preset-composer="archive"] body > [role="menu"]:has([class*="_optionCopy"]) [class*="_dangerous"] { color:#dc2626; }
${R}[data-hf-preset-composer="archive"] body > [role="menu"][class*="_menu"]:has([class*="_rowButton"], [class*="_harnessName"], [class*="_moreToggle"]) [class*="_rowButton"][data-current] { color:#1b44c8; }
${R}[data-hf-preset-composer="archive"] :is([data-approval-key],[data-plan-review-key]) [class*="_card"] { background:#ffffff; border-color:#2455e7; box-shadow:0 16px 36px rgba(15,23,42,.16); }
${R}[data-hf-preset-composer="archive"] :is([data-approval-key],[data-plan-review-key]) [class*="_strip"] { background:linear-gradient(90deg,#eef3ff,#ffffff 68%),repeating-linear-gradient(-55deg,rgba(36,85,231,.12) 0 8px,#f7f9fc 8px 16px); border-bottom-color:#cfd7e6; color:#1b44c8; }
${R}[data-hf-preset-composer="archive"] [data-approval-key] [class*="_headline"] { color:#14171f; }
${R}[data-hf-preset-composer="archive"] [data-approval-key] [class*="_command"] { border-left-color:#2455e7; }
${R}[data-hf-preset-composer="archive"] :is([data-approval-key] [class*="_actionRow"],[data-plan-review-key] [class*="_actions"]) button { border-color:#2455e7; background:#eef3ff; color:#1b44c8; box-shadow:0 2px 0 #cfd7e6; }
${R}[data-hf-preset-composer="archive"] [data-approval-key] [class*="_actionRow"] button:first-child { border-color:#fca5a5; background:#fef2f2; color:#dc2626; }
${R}[data-hf-preset-composer="archive"] [data-approval-key] [class*="_actionRow"] button:first-child:hover { background:#fee2e2; }
${R}[data-hf-preset-composer="archive"] :is([data-approval-key] [class*="_actionRow"],[data-plan-review-key] [class*="_actions"]) button:last-child { border-color:#1b44c8; background:#2455e7; color:#ffffff; box-shadow:0 2px 0 #153499; }
${R}[data-hf-preset-composer="archive"] [data-question-key] header { background:#2455e7; color:#ffffff; }
${R}[data-hf-preset-composer="archive"] [data-question-key] [class*="_eyebrow"] { background:#ffffff; color:#1b44c8; }
${R}[data-hf-preset-composer="archive"] [data-question-key] [data-question-scroll] > [class*="_detail"] { background:#ffffff; color:#14171f; border:1px solid #cfd7e6; border-left:3px solid #2455e7; }
${R}[data-hf-preset-composer="archive"] [data-question-key] footer [class*="_footerActions"] button:not([class*="_iconButton"]) { background:#ffffff; border-color:#cfd7e6; color:#14171f; }
${R}[data-hf-preset-composer="archive"] [data-question-key] footer [class*="_footerActions"] button:not([class*="_iconButton"]):last-child { background:#2455e7; color:#ffffff; border-color:#1b44c8; box-shadow:0 2px 0 #153499; }
${R}[data-hf-preset-composer="archive"] [data-composer-dock] :is([class*="_ringTrack"],[class*="_track"]) { stroke:rgba(20,28,48,.16); }
@media (max-width:767px) {
  ${R} [data-trigger-menu] input { font-size:16px; }
  ${R} [data-queue-dock] [class*="_actions"] button { min-width:34px; min-height:34px; }
  ${R} [data-queue-dock] [class*="_attachments"] { max-width:42%; }
  ${R} [data-approval-key] [class*="_command"] { font-size:12px; max-height:160px; }
  ${R} :is([data-approval-key] [class*="_actionRow"],[data-plan-review-key] [class*="_actions"]) button { flex:1; min-height:42px; }
  ${R} [data-question-key] :is(button[role="radio"],button[role="checkbox"]) { min-height:46px; }
  ${R} [data-question-key] [class*="_optionLabel"] { font-size:14.5px; font-synthesis:none; }
  ${R} [data-question-key] [class*="_description"] { flex-basis:100%; font-size:12.5px; }
  ${R} [data-question-key] footer { flex-wrap:nowrap; }
  ${R} [data-conversation-content] [data-phone-toolbar] button { box-sizing:border-box; height:34px; min-height:34px; box-shadow:none; }
  ${R} [data-conversation-content] [data-phone-toolbar] [data-toolbar-fixed] button { width:34px !important; height:34px !important; border-width:1px !important; box-shadow:none; }
  ${R} [data-conversation-content] [data-phone-toolbar] button:is([class*="_icon"], [class*="_toggle"]) { width:34px; }
  ${R} [data-conversation-content] [data-phone-toolbar] [data-composer-tray] { display:inline-flex; align-items:center; }
  ${R} [data-conversation-content] [data-phone-toolbar] :is([class*="_standardControls"], [class*="_controls"]) { display:inline-flex; align-items:center; flex:0 1 auto; min-width:0; max-width:100%; gap:4px; }
  ${R} [data-conversation-content] [data-phone-toolbar] [class*="_controls"] > div[class*="_root"] { flex:0 1 auto; min-width:0; }
  ${R} [data-conversation-content] [data-phone-toolbar] [class*="_controls"] > span[class*="_root"] { flex:0 0 auto; }
  ${R} [data-conversation-content] [data-phone-toolbar] [class*="_controls"] button[class*="_trigger"] { min-width:0; max-width:100%; }
  ${R} [data-conversation-content] [data-phone-toolbar] [class*="_controls"] > span[class*="_root"] > button[class*="_trigger"] { flex:0 0 auto; width:34px; height:34px; padding:0; }
  ${R} [data-conversation-content] [data-phone-toolbar] [class*="_controls"] [class*="_triggerLabel"] { flex:0 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  ${R} [data-composer-dock] { gap:5px; padding-inline:2px; }
  ${R} [data-composer-dock] [data-composer-stat] { max-width:min(220px,54vw); }
  ${R} [data-composer-dock] :is([class*="_pill"],[class*="_trigger"]) { padding:2px 7px; gap:4px; font-size:11.5px; }
  ${CTX_POP},
  ${USE_POP},
  ${QUO_POP} { max-width:calc(100vw - 16px); padding:14px 11px 11px; }
}
@media (prefers-reduced-motion:reduce) {
  ${R} :is([data-composer-card],[data-queue-dock],[data-question-key],[data-approval-key],[data-plan-review-key],[data-trigger-menu]) *,
  ${R} body > [id$="-menu"][class*="_menu"] * { animation:none !important; transition:none !important; }
}
`


