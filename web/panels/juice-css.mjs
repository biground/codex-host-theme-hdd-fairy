// Independent Zenless Zone Zero H.D.D. interaction juice stylesheet.
// Strictly gated behind dark/light web theme + data-hf-juice="1", zero layout shift,
// zero transform on portaled dialogs/menus or [data-sidebar-right-panel], and full reduced-motion support.

const ROOT = 'html:is([data-cx-ext-hdd-fairy-theme-dark],[data-cx-ext-hdd-fairy-theme-light])[data-hf-juice="1"]'

const PRIMARY_BTNS = [
  '[data-cx-region="sidebar"] button[class*="_newSession"]',
  '[data-conversation-content] [data-toolbar-fixed="end"] button:is(:has(svg > path), :has(svg > rect))',
  '[data-approval-key] :is(button[class*="_pillPrimary"], div[class*="_splitGroup"]:not([class*="_splitOutline"]), [class*="_actionRow"] button:last-child)',
  '[data-plan-review-key] [class*="_actions"] button:last-child',
  '[data-question-key] footer [class*="_footerActions"] button:not([class*="_iconButton"]):last-child',
  'button[class*="_primary"]:not([class*="_dangerConfirm"])',
  'button[class*="_save"]',
  '.settings-command-button',
  'div[role="dialog"][data-selection-actions] button[class*="_submit"]',
  'button[class*="_reconnectBtn"]',
  'a[class*="_downloadLink"]',
  '.hf-btn.is-primary',
  '.hf-pill[aria-pressed="true"]',
].join(', ')

const CURTAIN_SURFACES = [
  'body > [role="dialog"]',
  'body > [id$="-menu"][class*="_menu"] [class*="_panel"]',
  'body > [role="menu"] [class*="_material"]',
  'body > [role="menu"]:has([class*="_optionCopy"])',
  '[data-trigger-menu]',
  '[data-approval-key] > section[class*="_card"]',
  '[data-plan-review-key] [class*="_card"]',
  '[data-question-key] > section',
].join(', ')

const MAGNET_PILLS = [
  '[data-composer-dock] :is([class*="_pill"], [class*="_trigger"])',
  '[data-conversation-navigation-focus] :is([class*="_crumb"], [class*="_crumbCurrent"], button[class*="_workspace"], [data-remote-chip])',
  '[data-content-phase="hero"] [class*="_heroWorkspaceRow"] button[class*="_workspace"]',
  '[data-composer-seat] [class*="_pill"][role="status"]',
].join(', ')

const RETICLE_ICONS = [
  '[data-turn-tail] button',
  '[data-chat-flow] [class*="_actions"] button',
  '[data-chat-flow] [class*="_turnActions"] button',
  '[data-code-block-banner] button',
  '[data-cx-region="sidebar"] :is([class*="_toggle"], [class*="_collapsed"] button, [class*="_rowActions"] button, [class*="_footer"] button)',
  '[data-conversation-navigation-focus] button:not([class*="_crumb"]):not([role="tab"])',
  '[data-shell-leading] button',
  '[data-queue-dock] [class*="_actions"] button',
  '[data-remote-peers-panel] button[class*="_iconButton"]',
].join(', ')

const CLOSE_BTNS = [
  'button[class*="_close"]',
  'button[data-dockkit-tab-close]',
  '.hf-files-clear',
].join(', ')

const PROCESS_HEADERS = [
  ':is([data-tool][data-state], [data-sample="bash"][data-state], div[data-command][data-state]) [data-disclosure-row]',
  '[data-variant="think"] [data-disclosure-row]',
  'div[class*="_compactionRow"] button[class*="_compactionButton"]',
  '[data-plan-artifacts] > button[data-plan-card]',
].join(', ')

const PROCESS_BODIES = [
  '[data-variant="think"] [class*="_thinkBody"]',
  ':is([data-tool], [data-sample="bash"], div[data-command]) :is([data-terminal], [data-read], [data-search], [data-inspect], [data-diff], [class*="_ioCard"], pre[class*="_body"])',
  '[data-step-process-body]',
  '[data-subcalls]',
  'div[class*="_compactionRow"] div[class*="_compactionBody"]',
].join(', ')

const PRESET_SCOPES = {
  shell: '[data-cx-region="sidebar"], [data-cx-region="header"], [data-phone-drawer], [data-hf-token-scope="shell"]',
  chat: '[data-conversation-content], [data-hf-token-scope="chat"]',
  composer: '[data-composer-card], [data-queue-dock], [data-composer-dock], [data-question-key], [data-approval-key], [data-plan-review-key], [data-trigger-menu], [data-hf-token-scope="composer"]',
  rightbar: '[data-sidebar-right-panel], [data-hf-token-scope="rightbar"]',
  settings: '[data-shortcut-modal="settings"], [data-shortcut-modal="shortcuts"], [data-plugin-panel], [data-web-extensions], [data-connect-devices], [data-remote-peers-panel], [data-hf-token-scope="settings"]',
}

const PRESET_VARS = {
  amber: '--hf-juice-accent: #f8cb29; --hf-juice-sheen: rgba(255, 255, 255, 0.42); --hf-juice-hazard-period: 29.3px; --hf-juice-press-x: 0px; --hf-juice-press-y: 1.5px; --hf-juice-press-shadow: 0 0.5px 0 rgba(0, 0, 0, 0.85), inset 0 1px 2px rgba(0, 0, 0, 0.32);',
  street: '--hf-juice-accent: #c8ff00; --hf-juice-sheen: rgba(255, 255, 255, 0.56); --hf-juice-hazard-period: 36.62px; --hf-juice-press-x: 2px; --hf-juice-press-y: 2px; --hf-juice-press-shadow: 1px 1px 0 #050507;',
  archive: '--hf-juice-accent: #2455e7; --hf-juice-sheen: rgba(255, 255, 255, 0.44); --hf-juice-hazard-period: 34.18px; --hf-juice-press-x: 0px; --hf-juice-press-y: 1.5px; --hf-juice-press-shadow: 0 0.5px 0 rgba(10, 20, 60, 0.65), inset 0 1px 2px rgba(0, 0, 0, 0.24);',
}

const LOCAL_PRESET_RULES = Object.entries(PRESET_VARS)
  .flatMap(([preset, decl]) => [
    `${ROOT}[data-cx-ext-hdd-fairy-preset="${preset}"] { ${decl} }`,
    `${ROOT} .hf-page[data-preset="${preset}"] { ${decl} }`,
    ...Object.entries(PRESET_SCOPES).map(
      ([panel, scope]) => `${ROOT}[data-hf-preset-${panel}="${preset}"] :is(${scope}) { ${decl} }`,
    ),
  ])
  .join('\n')

export const JUICE_PANEL_CSS = `
/* ===== Juice Tokens & Preset Mapping ===== */
${ROOT} {
  ${PRESET_VARS.amber}
}
html[data-cx-ext-hdd-fairy-theme-light][data-hf-juice="1"]:not([data-cx-ext-hdd-fairy-preset]) {
  --hf-juice-accent: #2f55e8;
}
${LOCAL_PRESET_RULES}

/* ===== 1. Primary Buttons: Mechanical Keycap Press + 45deg Metallic Sheen ===== */
${ROOT} :is(${PRIMARY_BTNS}) {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  transition:
    transform 140ms cubic-bezier(0.22, 1.4, 0.36, 1),
    box-shadow 140ms ease,
    border-color 140ms ease,
    filter 140ms ease;
}
${ROOT} :is(${PRIMARY_BTNS})::after {
  content: "";
  position: absolute;
  inset: -40% -24%;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    transparent 34%,
    var(--hf-juice-sheen) 48%,
    rgba(255, 255, 255, 0.12) 56%,
    transparent 68%
  );
  transform: translateX(-135%) skewX(-18deg);
  opacity: 0;
}
${ROOT} :is(${PRIMARY_BTNS}):hover:not(:disabled) {
  filter: brightness(1.06);
}
${ROOT} :is(${PRIMARY_BTNS}):hover:not(:disabled)::after {
  animation: hf-juice-sheen 440ms cubic-bezier(0.22, 1, 0.36, 1) 1 both;
}
${ROOT} :is(${PRIMARY_BTNS}):active:not(:disabled) {
  translate: none;
  transform: translate(var(--hf-juice-press-x, 0px), var(--hf-juice-press-y, 1.5px));
  box-shadow: var(--hf-juice-press-shadow, 0 0.5px 0 rgba(0, 0, 0, 0.85), inset 0 1px 2px rgba(0, 0, 0, 0.32));
}

/* ===== 2. Composer Ignition Hazard Stripe March (Active on Focus or Running Only) ===== */
${ROOT} [data-composer-card]:focus-within::before {
  background-image: var(--hf-composer-hazard-stripe, var(--hf-hazard-stripe, repeating-linear-gradient(-55deg, #f8cb29 0 6px, #141416 6px 12px)));
  background-size: var(--hf-juice-hazard-period, 29.3px) 3.5px;
  background-repeat: repeat-x;
  background-position: 0 0;
  animation: hf-juice-hazard-march 1.2s linear infinite;
}
${ROOT} [data-composer-card]:has([data-toolbar-fixed="end"] button:has(svg > rect))::before {
  background-image: var(--hf-composer-hazard-danger, var(--hf-hazard-danger, repeating-linear-gradient(-55deg, #ff5d3a 0 6px, #141416 6px 12px)));
  background-size: var(--hf-juice-hazard-period, 29.3px) 3.5px;
  background-repeat: repeat-x;
  background-position: 0 0;
  animation: hf-juice-hazard-march 0.9s linear infinite;
}

/* ===== 3. Dialogs, Telemetry Popovers, Menus & Gate Cards: Curtain Reveal (Zero Transform) ===== */
${ROOT} :is(${CURTAIN_SURFACES}) {
  animation: hf-juice-curtain-in 150ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* ===== 4. Sidebar Session Row Tactical Rail & Selected Metallic Sweep ===== */
${ROOT} [data-row-key][role="treeitem"]:not([data-row-key^="section:"]) {
  position: relative;
  overflow: hidden;
  transition: background-color 140ms ease, box-shadow 140ms ease, color 140ms ease;
}
${ROOT} [data-row-key][role="treeitem"]:not([data-row-key^="section:"])::before {
  content: "";
  position: absolute;
  left: 0;
  top: 5px;
  bottom: 5px;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: var(--hf-shell-accent, var(--hf-juice-accent));
  transform: scaleY(0);
  transform-origin: center;
  opacity: 0;
  pointer-events: none;
  transition: transform 160ms cubic-bezier(0.22, 1.4, 0.36, 1), opacity 140ms ease;
}
${ROOT} [data-row-key][role="treeitem"]:not([data-row-key^="section:"]):not([aria-selected="true"]):is(:hover, :focus-visible, [class*="_menuOpen"])::before {
  transform: scaleY(1);
  opacity: 1;
}
${ROOT} [data-row-key][role="treeitem"]:not([data-row-key^="section:"]) [data-session-title] {
  display: inline-block;
  transition: transform 150ms cubic-bezier(0.22, 1.4, 0.36, 1);
}
${ROOT} [data-row-key][role="treeitem"]:not([data-row-key^="section:"]):not([aria-selected="true"]):is(:hover, :focus-visible) [data-session-title] {
  transform: translateX(2px);
}
${ROOT} [data-row-key][role="treeitem"]:not([data-row-key^="section:"])[aria-selected="true"]::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    115deg,
    transparent 24%,
    rgba(255, 255, 255, 0.44) 50%,
    transparent 74%
  );
  transform: translateX(-130%);
  animation: hf-juice-row-sweep 420ms cubic-bezier(0.16, 1, 0.3, 1) 1 both;
}

/* ===== 5. Mechanical Toggle Switch & Question Option Overshoot Snap ===== */
${ROOT} :is(button[role="switch"], input[role="switch"], .hf-switch) {
  transition: background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}
${ROOT} :is(button[role="switch"], input[role="switch"], .hf-switch)::after {
  transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 150ms ease;
}
${ROOT} :is(button[role="switch"], input[role="switch"], .hf-switch):active:not(:disabled)::after {
  transform: scaleX(1.12);
}
${ROOT} :is(button[role="switch"][aria-checked="true"], input[role="switch"]:checked, .hf-switch[aria-checked="true"]):active:not(:disabled)::after {
  transform: translateX(17px) scaleX(1.12);
}
${ROOT} [data-question-key] :is(button[role="radio"], button[role="checkbox"]) {
  transition:
    transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1),
    border-color 140ms ease,
    box-shadow 140ms ease,
    background-color 140ms ease;
}
${ROOT} [data-question-key] :is(button[role="radio"], button[role="checkbox"]):hover:not(:disabled) {
  transform: translateX(2px);
}
${ROOT} [data-question-key] :is(button[role="radio"], button[role="checkbox"]):active:not(:disabled) {
  transform: scale(0.982);
}
${ROOT} [data-question-key] :is(button[role="radio"], button[role="checkbox"])[aria-checked="true"] {
  animation: hf-juice-option-snap 220ms cubic-bezier(0.34, 1.56, 0.64, 1) 1;
}
${ROOT} [data-question-key] [aria-checked="true"] :is([class*="_number"], [class*="_checkbox"]) {
  animation: hf-juice-badge-pop 220ms cubic-bezier(0.34, 1.56, 0.64, 1) 1;
}

/* ===== 6. Pointerdown Tactical Geometric Burst (Owned by juice-fx.mjs) ===== */
${ROOT} .hf-juice-burst {
  position: fixed;
  width: 0;
  height: 0;
  overflow: visible;
  pointer-events: none;
  z-index: 2147483640;
  contain: layout style;
  --hf-burst-color: #f8cb29;
}
${ROOT} .hf-juice-burst-frame,
${ROOT} .hf-juice-burst-cross {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  pointer-events: none;
  box-sizing: border-box;
}
${ROOT} .hf-juice-burst-frame {
  width: 24px;
  height: 24px;
  margin: -12px 0 0 -12px;
  border: 1.5px solid var(--hf-burst-color);
  box-shadow: 0 0 10px color-mix(in srgb, var(--hf-burst-color) 55%, transparent);
  animation: hf-juice-burst-diamond 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
${ROOT} .hf-juice-burst-cross {
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  animation: hf-juice-burst-cross 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
${ROOT} .hf-juice-burst-cross::before,
${ROOT} .hf-juice-burst-cross::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  background: var(--hf-burst-color);
  transform: translate(-50%, -50%);
}
${ROOT} .hf-juice-burst-cross::before {
  width: 18px;
  height: 1.5px;
}
${ROOT} .hf-juice-burst-cross::after {
  width: 1.5px;
  height: 18px;
}
${ROOT} .hf-juice-burst[data-hf-burst-preset="street"] .hf-juice-burst-frame {
  width: 22px;
  height: 22px;
  margin: -11px 0 0 -11px;
  border: 2px solid var(--hf-burst-color);
  box-shadow: 3px 3px 0 #050507;
  animation: hf-juice-burst-square 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
${ROOT} .hf-juice-burst[data-hf-burst-preset="street"] .hf-juice-burst-cross {
  animation: hf-juice-burst-cross-street 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
${ROOT} .hf-juice-burst[data-hf-burst-preset="archive"] .hf-juice-burst-frame {
  width: 26px;
  height: 26px;
  margin: -13px 0 0 -13px;
  border-radius: 50%;
  border: 1.5px solid var(--hf-burst-color);
  box-shadow: 0 0 12px color-mix(in srgb, var(--hf-burst-color) 62%, transparent);
  animation: hf-juice-burst-ring-outer 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
${ROOT} .hf-juice-burst[data-hf-burst-preset="archive"] .hf-juice-burst-cross {
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border-radius: 50%;
  border: 1.5px solid var(--hf-burst-color);
  animation: hf-juice-burst-ring-inner 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
${ROOT} .hf-juice-burst[data-hf-burst-preset="archive"] .hf-juice-burst-cross::before,
${ROOT} .hf-juice-burst[data-hf-burst-preset="archive"] .hf-juice-burst-cross::after {
  display: none;
}

/* ===== 7. Bottom Telemetry Capsules & Header Breadcrumb / Workspace Magnet Lift ===== */
${ROOT} :is(${MAGNET_PILLS}) {
  transition:
    transform 150ms cubic-bezier(0.22, 1.4, 0.36, 1),
    box-shadow 150ms ease,
    border-color 150ms ease,
    background-color 150ms ease,
    color 150ms ease;
}
${ROOT} :is(${MAGNET_PILLS}):hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.32),
    0 0 0 1px color-mix(in srgb, var(--hf-juice-accent) 46%, transparent);
}
${ROOT} :is(${MAGNET_PILLS}):active:not(:disabled) {
  transform: translateY(0) scale(0.97);
}

/* ===== 8. Code Block COPY Button Mechanical Stamp Pulse ===== */
${ROOT} [data-hf-copied-pulse="1"] {
  animation: hf-juice-copy-stamp 400ms cubic-bezier(0.22, 1.5, 0.36, 1) 1;
  border-color: var(--hf-juice-accent) !important;
  box-shadow:
    0 0 0 2px color-mix(in srgb, var(--hf-juice-accent) 55%, transparent),
    0 0 14px color-mix(in srgb, var(--hf-juice-accent) 42%, transparent) !important;
}

/* ===== 9. Message Footer & Sidebar/Header Icon Reticle Lock + Close Twist ===== */
${ROOT} :is(${RETICLE_ICONS}) {
  transition:
    transform 140ms cubic-bezier(0.22, 1.4, 0.36, 1),
    color 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease,
    background-color 140ms ease;
}
${ROOT} :is(${RETICLE_ICONS}):hover:not(:disabled) {
  transform: scale(1.08);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--hf-juice-accent) 42%, transparent),
    0 0 10px color-mix(in srgb, var(--hf-juice-accent) 26%, transparent);
}
${ROOT} :is(${RETICLE_ICONS}):active:not(:disabled) {
  transform: scale(0.92);
}
${ROOT} :is(${CLOSE_BTNS}) {
  transition: transform 150ms cubic-bezier(0.22, 1.4, 0.36, 1), border-color 140ms ease, color 140ms ease, background-color 140ms ease;
}
${ROOT} :is(${CLOSE_BTNS}) svg {
  transition: transform 180ms cubic-bezier(0.22, 1.4, 0.36, 1);
}
${ROOT} :is(${CLOSE_BTNS}):hover:not(:disabled) svg {
  transform: rotate(90deg);
}
${ROOT} :is(${CLOSE_BTNS}):not(:has(svg)):hover:not(:disabled) {
  transform: rotate(90deg);
}
${ROOT} :is(${CLOSE_BTNS}):active:not(:disabled) {
  transform: scale(0.92);
}

/* ===== 10. Tool Cards, Think Blocks & Compaction Checkpoints Armored Fold ===== */
${ROOT} :is(${PROCESS_HEADERS}) {
  transition: box-shadow 160ms ease, border-color 160ms ease, background-color 160ms ease, filter 160ms ease;
}
${ROOT} :is(${PROCESS_HEADERS}):hover:not(:disabled) {
  box-shadow:
    inset 4px 0 var(--hf-tool-state, var(--hf-chat-accent, var(--hf-juice-accent))),
    0 0 14px color-mix(in srgb, var(--hf-tool-state, var(--hf-chat-accent, var(--hf-juice-accent))) 24%, transparent);
}
${ROOT} :is(${PROCESS_BODIES}) {
  animation: hf-juice-fold-open 160ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* ===== 11. Right Workbench Dock Tabs, File Tree Rows & Split Dividers (No Transform on Panel Root) ===== */
${ROOT} [data-dockkit-tab] {
  position: relative;
  transition: background-color 150ms ease, color 150ms ease, box-shadow 150ms ease;
}
${ROOT} [data-dockkit-tab]::after {
  content: "";
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 2px;
  height: 2px;
  border-radius: 2px;
  background: var(--hf-rightbar-accent, var(--hf-juice-accent));
  transform: scaleX(0);
  transform-origin: center;
  opacity: 0;
  pointer-events: none;
  transition: transform 170ms cubic-bezier(0.22, 1.4, 0.36, 1), opacity 140ms ease;
}
${ROOT} [data-dockkit-tab]:hover::after {
  transform: scaleX(0.68);
  opacity: 0.78;
}
${ROOT} [data-dockkit-tab][aria-selected="true"]::after {
  transform: scaleX(1);
  opacity: 0.95;
  background: currentColor;
}
${ROOT} [data-conversation-tabs] [role="tab"] {
  transition: background-color 150ms ease, color 150ms ease, box-shadow 150ms ease;
}
${ROOT} [data-conversation-tabs] [role="tab"]:hover:not([aria-selected="true"]) {
  box-shadow: inset 0 -2px 0 color-mix(in srgb, var(--hf-shell-accent, var(--hf-juice-accent)) 72%, transparent);
}
${ROOT} [data-files-body] li[data-files-entry] {
  overflow: hidden;
}
${ROOT} [data-files-body] button[class*="_row"] {
  transition:
    transform 150ms cubic-bezier(0.22, 1.4, 0.36, 1),
    background-color 140ms ease,
    box-shadow 140ms ease;
}
${ROOT} [data-files-body] button[class*="_row"]:hover {
  transform: translateX(2px);
  box-shadow: inset 2px 0 var(--hf-rightbar-accent, var(--hf-juice-accent));
}
${ROOT} [data-sidebar-right-guide-entry] {
  transition:
    transform 150ms cubic-bezier(0.22, 1.4, 0.36, 1),
    box-shadow 150ms ease,
    border-color 150ms ease;
}
${ROOT} [data-sidebar-right-guide-entry]:hover {
  transform: translateX(2px);
}
${ROOT} [data-dockkit-divider]::before {
  transition: background-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
}
${ROOT} [data-dockkit-divider]:hover::before,
${ROOT} [data-dockkit-divider][data-dockkit-dragging]::before {
  animation: hf-juice-divider-pulse 1.3s ease-in-out infinite;
}
${ROOT} [class*="_widthHandle"] {
  transition: background-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
}
${ROOT} [class*="_widthHandle"]:hover,
${ROOT} [class*="_widthHandle"][data-dragging] {
  background: var(--hf-chat-accent, var(--hf-juice-accent));
  animation: hf-juice-divider-pulse 1.3s ease-in-out infinite;
}

/* ===== 12. Scroll-to-Bottom Capsule & Toast Slide-In ===== */
${ROOT} [class*="_toBottomSlot"] > button[class*="_toBottom"] {
  transition:
    transform 160ms cubic-bezier(0.22, 1.4, 0.36, 1),
    box-shadow 160ms ease,
    border-color 160ms ease,
    background-color 160ms ease;
}
${ROOT} [class*="_toBottomSlot"] > button[class*="_toBottom"]:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.44),
    0 0 0 1px color-mix(in srgb, var(--hf-chat-accent, var(--hf-juice-accent)) 56%, transparent);
}
${ROOT} [class*="_toBottomSlot"] > button[class*="_toBottom"]:active {
  transform: translateY(0) scale(0.95);
}
${ROOT} [class*="_toBottomSlot"] > button[class*="_toBottom"]:hover svg {
  animation: hf-juice-arrow-bob 680ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
${ROOT} body > div[role="alert"][class*="_toast"],
${ROOT} div[class*="_strip"][data-remote-state][role="alert"] {
  animation: hf-juice-toast-in 210ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* ===== Keyframes ===== */
@keyframes hf-juice-sheen {
  0% { transform: translateX(-135%) skewX(-18deg); opacity: 0; }
  18% { opacity: 0.95; }
  85% { opacity: 0.85; }
  100% { transform: translateX(135%) skewX(-18deg); opacity: 0; }
}
@keyframes hf-juice-hazard-march {
  from { background-position: 0 0; }
  to { background-position: var(--hf-juice-hazard-period, 29.3px) 0; }
}
@keyframes hf-juice-curtain-in {
  from { opacity: 0; clip-path: inset(0 0 8% 0); }
  to { opacity: 1; clip-path: inset(0 0 0 0); }
}
@keyframes hf-juice-row-sweep {
  0% { transform: translateX(-130%); opacity: 0; }
  20% { opacity: 0.92; }
  100% { transform: translateX(130%); opacity: 0; }
}
@keyframes hf-juice-option-snap {
  0% { transform: scale(0.975); }
  55% { transform: scale(1.015); }
  100% { transform: scale(1); }
}
@keyframes hf-juice-badge-pop {
  0% { transform: scale(0.82); }
  58% { transform: scale(1.14); }
  100% { transform: scale(1); }
}
@keyframes hf-juice-burst-diamond {
  0% { transform: rotate(45deg) scale(0.32); opacity: 0.98; }
  55% { opacity: 0.86; }
  100% { transform: rotate(45deg) scale(1.52); opacity: 0; }
}
@keyframes hf-juice-burst-cross {
  0% { transform: scale(0.42); opacity: 0.95; }
  50% { transform: scale(1.12); opacity: 0.82; }
  100% { transform: scale(1.38); opacity: 0; }
}
@keyframes hf-juice-burst-square {
  0% { transform: scale(0.36); opacity: 1; }
  52% { opacity: 0.92; }
  100% { transform: scale(1.56); opacity: 0; }
}
@keyframes hf-juice-burst-cross-street {
  0% { transform: rotate(45deg) scale(0.4); opacity: 1; }
  52% { transform: rotate(45deg) scale(1.16); opacity: 0.88; }
  100% { transform: rotate(45deg) scale(1.42); opacity: 0; }
}
@keyframes hf-juice-burst-ring-outer {
  0% { transform: scale(0.35); opacity: 0.98; }
  60% { opacity: 0.78; }
  100% { transform: scale(1.58); opacity: 0; }
}
@keyframes hf-juice-burst-ring-inner {
  0% { transform: scale(0.25); opacity: 0.92; }
  45% { opacity: 0.85; }
  100% { transform: scale(1.32); opacity: 0; }
}
@keyframes hf-juice-copy-stamp {
  0% { transform: scale(1); }
  22% { transform: scale(0.86); }
  58% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
@keyframes hf-juice-fold-open {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes hf-juice-divider-pulse {
  0%, 100% {
    opacity: 0.72;
    box-shadow: 0 0 6px color-mix(in srgb, var(--hf-juice-accent) 42%, transparent);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 14px color-mix(in srgb, var(--hf-juice-accent) 82%, transparent);
  }
}
@keyframes hf-juice-arrow-bob {
  0%, 100% { transform: translateY(0); }
  45% { transform: translateY(2.5px); }
}
@keyframes hf-juice-toast-in {
  from { opacity: 0; translate: 16px 0; }
  to { opacity: 1; translate: 0 0; }
}

/* ===== Reduced Motion Guard ===== */
@media (prefers-reduced-motion: reduce) {
  ${ROOT} :is(${PRIMARY_BTNS}),
  ${ROOT} :is(${PRIMARY_BTNS})::after,
  ${ROOT} [data-composer-card]::before,
  ${ROOT} :is(${CURTAIN_SURFACES}),
  ${ROOT} [data-row-key][role="treeitem"],
  ${ROOT} [data-row-key][role="treeitem"]::before,
  ${ROOT} [data-row-key][role="treeitem"]::after,
  ${ROOT} [data-row-key][role="treeitem"] [data-session-title],
  ${ROOT} :is(button[role="switch"], input[role="switch"], .hf-switch),
  ${ROOT} :is(button[role="switch"], input[role="switch"], .hf-switch)::after,
  ${ROOT} [data-question-key] :is(button[role="radio"], button[role="checkbox"]),
  ${ROOT} [data-question-key] :is([class*="_number"], [class*="_checkbox"]),
  ${ROOT} :is(${MAGNET_PILLS}),
  ${ROOT} [data-hf-copied-pulse="1"],
  ${ROOT} :is(${RETICLE_ICONS}),
  ${ROOT} :is(${CLOSE_BTNS}),
  ${ROOT} :is(${CLOSE_BTNS}) svg,
  ${ROOT} :is(${PROCESS_HEADERS}),
  ${ROOT} :is(${PROCESS_BODIES}),
  ${ROOT} [data-dockkit-tab],
  ${ROOT} [data-dockkit-tab]::after,
  ${ROOT} [data-conversation-tabs] [role="tab"],
  ${ROOT} [data-files-body] button[class*="_row"],
  ${ROOT} [data-sidebar-right-guide-entry],
  ${ROOT} [data-dockkit-divider]::before,
  ${ROOT} [class*="_widthHandle"],
  ${ROOT} [class*="_toBottomSlot"] > button[class*="_toBottom"],
  ${ROOT} [class*="_toBottomSlot"] > button[class*="_toBottom"] svg,
  ${ROOT} body > div[role="alert"][class*="_toast"],
  ${ROOT} div[class*="_strip"][data-remote-state][role="alert"] {
    animation: none !important;
    transition: none !important;
  }
  ${ROOT} .hf-juice-burst {
    display: none !important;
  }
}
`
