// Workorder 020: Antigravity Periodic Table Model Selector + Overdrive Thinking Slider CSS.
// Strictly gated on both dark/light polarity marks + composer panel enablement, supporting amber/street/archive presets.

const R = 'html:is([data-cx-ext-hdd-fairy-theme-dark],[data-cx-ext-hdd-fairy-theme-light])[data-hf-panel-composer="1"]'
const M = `${R} body > div[id$="-menu"][class*="_menu"]`
const MP = `${M} [class*="_modelPanel"]`
const TP = `${M} [class*="_thinkingPanel"]`

export const MODEL_SELECT_PANEL_CSS = `
/* ── Preset Semantic Tokens (018 DESIGN_SPEC Section 4) ── */
${R} {
  --hm-panel-bg: linear-gradient(180deg, #18191f, #101115);
  --hm-panel-border: 1px solid rgba(248, 203, 41, .42);
  --hm-panel-shadow: 0 18px 40px rgba(0, 0, 0, .82), 0 0 0 1px #070709;
  --hm-panel-radius: var(--hf-composer-radius-card, 14px 4px 14px 14px);
  --hm-ink-primary: #f4f1e8;
  --hm-ink-secondary: #cdc7b8;
  --hm-ink-muted: #9a9486;
  --hm-rule: rgba(248, 203, 41, .2);
  --hm-well-bg: #0b0c10;
  --hm-well-border: #2d2e36;
  --hm-cell-bg: linear-gradient(160deg, #1e2028, #14151b);
  --hm-cell-hover-bg: linear-gradient(160deg, #252833, #191b23);
  --hm-cell-border: 1px solid #32343e;
  --hm-cell-active-bg: linear-gradient(155deg, rgba(248, 203, 41, .18), rgba(248, 203, 41, .04) 68%), #1b1912;
  --hm-cell-active-border: #f8cb29;
  --hm-cell-highlight: rgba(248, 203, 41, .24);
  --hm-cell-grid: rgba(248, 203, 41, .07);
  --hm-row-bg: rgba(255, 255, 255, .02);
  --hm-row-hover: rgba(248, 203, 41, .11);
  --hm-row-active-bg: linear-gradient(90deg, rgba(248, 203, 41, .22), rgba(248, 203, 41, .04));
  --hm-badge-bg: rgba(248, 203, 41, .12);
  --hm-badge-border: rgba(248, 203, 41, .34);
  --hm-badge-ink: #f8cb29;
  --hm-stamp-bg: #f8cb29;
  --hm-stamp-ink: #141106;
  --hm-star-off: #66635a;
  --hm-star-on: #f8cb29;
  --hm-track-well: #08090c;
  --hm-track-border: #2c2d35;
  --hm-tick-dot: #4b4e5a;
  --hm-fill-low: linear-gradient(90deg, #5e4f24, #846d2c);
  --hm-fill-medium: linear-gradient(90deg, #b87b10, #e0ad1e);
  --hm-fill-high: linear-gradient(90deg, #ff9e1a, #f8cb29);
  --hm-overdrive-sweep: linear-gradient(90deg, #ff9e1a 0%, #f8cb29 30%, #fff2a8 50%, #f8cb29 70%, #ff9e1a 100%);
  --hm-overdrive-glow: 0 0 14px rgba(255, 174, 25, .62), 0 0 26px rgba(248, 203, 41, .34);
  --hm-thumb-bg: linear-gradient(180deg, #2d2f39, #181a21);
  --hm-thumb-border: #555866;
  --hm-thumb-ink: #dcd6c8;
  --hm-thumb-overdrive-bg: linear-gradient(135deg, #fff4b8, #f8cb29 52%, #ff9e1a);
  --hm-thumb-overdrive-ink: #1a1204;
  --hm-particle-bg: #fff2a8;
  --hm-particle-alt: #f8cb29;
  --hm-particle-radius: 999px;
  --hm-particle-shadow: 0 0 7px #ff9e1a, 0 0 2px #fff6c9;
  --hm-particle-clip: none;
  --hm-bar-off: rgba(255, 255, 255, .13);
  --hm-bar-on: #f8cb29;
  --hm-match-bg: rgba(248, 203, 41, .26);
  --hm-match-ink: #fff4c2;
  --hm-el-h-tint: rgba(87, 214, 255, .18);
  --hm-el-c-tint: rgba(248, 203, 41, .16);
  --hm-el-ne-tint: rgba(255, 138, 36, .22);
  --hm-el-ar-tint: rgba(146, 130, 255, .18);
  --hm-scroll-thumb: rgba(248, 203, 41, .34);
}

${R}[data-hf-preset-composer="street"] {
  --hm-panel-bg: radial-gradient(rgba(255, 255, 255, .045) 1px, transparent 1px) 0 0 / 7px 7px, #111318;
  --hm-panel-border: 2px solid #050507;
  --hm-panel-shadow: 4px 4px 0 #c8ff00, 0 16px 36px rgba(0, 0, 0, .82), 0 0 0 1px #363a42;
  --hm-panel-radius: var(--hf-composer-radius-card, 14px 4px 14px 4px);
  --hm-ink-primary: #eef1f6;
  --hm-ink-secondary: #c5ccd9;
  --hm-ink-muted: #8c95a6;
  --hm-rule: rgba(200, 255, 0, .24);
  --hm-well-bg: #080a0e;
  --hm-well-border: #2f3440;
  --hm-cell-bg: #181b23;
  --hm-cell-hover-bg: #1f242f;
  --hm-cell-border: 1.5px solid #2f3440;
  --hm-cell-active-bg: linear-gradient(155deg, rgba(200, 255, 0, .18), rgba(200, 255, 0, .03) 70%), #192012;
  --hm-cell-active-border: #c8ff00;
  --hm-cell-highlight: rgba(200, 255, 0, .26);
  --hm-cell-grid: rgba(200, 255, 0, .08);
  --hm-row-bg: rgba(255, 255, 255, .025);
  --hm-row-hover: rgba(200, 255, 0, .12);
  --hm-row-active-bg: linear-gradient(90deg, rgba(200, 255, 0, .22), rgba(200, 255, 0, .04));
  --hm-badge-bg: rgba(200, 255, 0, .13);
  --hm-badge-border: rgba(200, 255, 0, .42);
  --hm-badge-ink: #c8ff00;
  --hm-stamp-bg: #c8ff00;
  --hm-stamp-ink: #090c02;
  --hm-star-off: #5f687a;
  --hm-star-on: #c8ff00;
  --hm-track-well: #07080b;
  --hm-track-border: #2b303c;
  --hm-tick-dot: #4b5263;
  --hm-fill-low: linear-gradient(90deg, #445914, #638219);
  --hm-fill-medium: linear-gradient(90deg, #74b800, #a2e000);
  --hm-fill-high: linear-gradient(90deg, #9be800, #c8ff00);
  --hm-overdrive-sweep: linear-gradient(90deg, #9be800 0%, #c8ff00 32%, #ffffff 50%, #c8ff00 68%, #9be800 100%);
  --hm-overdrive-glow: 0 0 12px rgba(200, 255, 0, .6), 0 0 24px rgba(155, 232, 0, .3);
  --hm-thumb-bg: #1e222c;
  --hm-thumb-border: #4a5161;
  --hm-thumb-ink: #eef1f6;
  --hm-thumb-overdrive-bg: linear-gradient(135deg, #ffffff, #c8ff00 54%, #9be800);
  --hm-thumb-overdrive-ink: #090c02;
  --hm-particle-bg: #c8ff00;
  --hm-particle-alt: #ffffff;
  --hm-particle-radius: 0px;
  --hm-particle-shadow: 0 0 0 1px #050608, 0 0 6px rgba(200, 255, 0, .75);
  --hm-particle-clip: none;
  --hm-bar-off: rgba(255, 255, 255, .14);
  --hm-bar-on: #c8ff00;
  --hm-match-bg: rgba(200, 255, 0, .25);
  --hm-match-ink: #f4ffbf;
  --hm-scroll-thumb: rgba(200, 255, 0, .4);
}

${R}[data-hf-preset-composer="archive"] {
  --hm-panel-bg: #f4f4f2;
  --hm-panel-border: 2px solid #2455e7;
  --hm-panel-shadow: 0 16px 36px rgba(10, 20, 60, .32), 0 0 0 1px #0b0c10;
  --hm-panel-radius: var(--hf-composer-radius-card, 14px);
  --hm-ink-primary: #14171f;
  --hm-ink-secondary: #374151;
  --hm-ink-muted: #5a6372;
  --hm-rule: rgba(36, 85, 231, .2);
  --hm-well-bg: #ffffff;
  --hm-well-border: #c5cfe2;
  --hm-cell-bg: #ffffff;
  --hm-cell-hover-bg: #f3f6ff;
  --hm-cell-border: 1.5px solid #cfd5e2;
  --hm-cell-active-bg: linear-gradient(155deg, rgba(36, 85, 231, .12), rgba(36, 85, 231, .02) 72%), #eef3ff;
  --hm-cell-active-border: #2455e7;
  --hm-cell-highlight: rgba(36, 85, 231, .22);
  --hm-cell-grid: rgba(36, 85, 231, .08);
  --hm-row-bg: #ffffff;
  --hm-row-hover: #e9effd;
  --hm-row-active-bg: linear-gradient(90deg, rgba(36, 85, 231, .16), rgba(36, 85, 231, .04));
  --hm-badge-bg: #e7eefc;
  --hm-badge-border: rgba(36, 85, 231, .34);
  --hm-badge-ink: #1b44c8;
  --hm-stamp-bg: #2455e7;
  --hm-stamp-ink: #ffffff;
  --hm-star-off: #9aa4b8;
  --hm-star-on: #2455e7;
  --hm-track-well: #dce1ec;
  --hm-track-border: #bcc5d9;
  --hm-tick-dot: #8d9ab5;
  --hm-fill-low: linear-gradient(90deg, #8ca0cc, #6f88c2);
  --hm-fill-medium: linear-gradient(90deg, #2d5be3, #4a78ff);
  --hm-fill-high: linear-gradient(90deg, #1b44c8, #2455e7);
  --hm-overdrive-sweep: linear-gradient(90deg, #1b44c8 0%, #2455e7 32%, #7ca6ff 50%, #2455e7 68%, #1b44c8 100%);
  --hm-overdrive-glow: 0 0 10px rgba(36, 85, 231, .45), 0 0 18px rgba(74, 120, 255, .28);
  --hm-thumb-bg: #ffffff;
  --hm-thumb-border: #8e9cb8;
  --hm-thumb-ink: #2455e7;
  --hm-thumb-overdrive-bg: linear-gradient(135deg, #4a78ff, #2455e7 55%, #1b44c8);
  --hm-thumb-overdrive-ink: #ffffff;
  --hm-particle-bg: #1b44c8;
  --hm-particle-alt: #2455e7;
  --hm-particle-radius: 0px;
  --hm-particle-shadow: 0 0 5px rgba(36, 85, 231, .55);
  --hm-particle-clip: polygon(50% 0%, 64% 36%, 100% 50%, 64% 64%, 50% 100%, 36% 64%, 0% 50%, 36% 36%);
  --hm-bar-off: rgba(20, 23, 31, .14);
  --hm-bar-on: #2455e7;
  --hm-match-bg: rgba(36, 85, 231, .16);
  --hm-match-ink: #1b44c8;
  --hm-el-h-tint: rgba(14, 165, 233, .14);
  --hm-el-c-tint: rgba(100, 116, 139, .14);
  --hm-el-ne-tint: rgba(36, 85, 231, .15);
  --hm-el-ar-tint: rgba(99, 102, 241, .15);
  --hm-scroll-thumb: rgba(36, 85, 231, .36);
}

/* ── Portal Shell & Two-Pane Geometry ── */
${M} {
  width: 280px;
  max-width: calc(100vw - 24px);
  color: var(--hm-ink-primary);
  font-family: var(--hf-font-ui);
}

${M} > [class*="_panel"] {
  box-sizing: border-box;
  padding: 15px 10px 10px;
  border: var(--hm-panel-border);
  border-radius: var(--hm-panel-radius);
  background: var(--hf-composer-hazard-stripe) top left / 100% 3.5px no-repeat, var(--hm-panel-bg);
  box-shadow: var(--hm-panel-shadow);
  color: var(--hm-ink-primary);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

${M} > [class*="_panel"] > [class*="_material"] {
  display: none !important;
}

${TP} {
  position: relative;
}

${MP} {
  position: absolute;
  top: auto;
  bottom: 0;
  right: calc(100% + 8px);
  left: auto;
  width: min(334px, calc(100vw - 308px));
  max-height: min(580px, calc(100dvh - 116px));
}

${M}[class*="_modelRight"] > [class*="_modelPanel"] {
  right: auto;
  left: calc(100% + 8px);
}

${M}[class*="_modelReplace"] > [class*="_modelPanel"] {
  position: relative;
  top: auto;
  bottom: auto;
  right: auto;
  left: auto;
  width: 100%;
}

${M}[class*="_modelReplace"] > [class*="_thinkingPanel"] {
  display: none;
}

${M}[class*="_modelReplace"] [class*="_backButton"] {
  display: inline-flex;
}

/* ── Panel Headers, Back & Refresh Buttons ── */
${M} [class*="_panelHeader"] {
  order: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 2px 8px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--hm-rule);
  color: var(--hm-ink-primary);
  font-size: 12.5px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: .04em;
}

${TP} > [class*="_panelHeader"]::before,
${MP} > [class*="_panelHeader"] > span:first-of-type::before {
  content: "";
  display: inline-block;
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  background-color: var(--hm-badge-ink);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}

${TP} > [class*="_panelHeader"]::before {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='square' stroke-linejoin='miter'%3E%3Cpath d='M5 3v4m0 4v10M12 3v10m0 4v4M19 3v2m0 4v12M2 7h6v4H2ZM9 13h6v4H9ZM16 5h6v4h-6Z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='square' stroke-linejoin='miter'%3E%3Cpath d='M5 3v4m0 4v10M12 3v10m0 4v4M19 3v2m0 4v12M2 7h6v4H2ZM9 13h6v4H9ZM16 5h6v4h-6Z'/%3E%3C/svg%3E");
}

${MP} > [class*="_panelHeader"] > span:first-of-type {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

${MP} > [class*="_panelHeader"] > span:first-of-type::before {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='square' stroke-linejoin='miter'%3E%3Cpath d='M5 5h14v14H5ZM9 9h6v6H9ZM9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='square' stroke-linejoin='miter'%3E%3Cpath d='M5 5h14v14H5ZM9 9h6v6H9ZM9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3'/%3E%3C/svg%3E");
}

${M} [class*="_backButton"],
${M} [class*="_refreshModels"] {
  width: 26px;
  height: 26px;
  border: 1px solid var(--hm-well-border);
  border-radius: 7px;
  background: var(--hm-well-bg);
  color: var(--hm-ink-secondary);
}

${M} [class*="_backButton"] {
  margin-left: 0;
  color: var(--hm-badge-ink);
  border-color: var(--hm-badge-border);
  background: var(--hm-badge-bg);
}

${M} [class*="_backButton"]:hover,
${M} [class*="_refreshModels"]:hover:not([aria-disabled="true"]) {
  border-color: var(--hm-cell-active-border);
  color: var(--hm-ink-primary);
  background: var(--hm-row-hover);
}

/* ── Search Row & Status Strips ── */
${MP} [class*="_searchRow"] {
  order: 2;
  margin: 2px 0 6px;
  border: 1px solid var(--hm-well-border);
  border-radius: 9px;
  background: var(--hm-well-bg);
  transition: border-color 140ms ease, box-shadow 140ms ease;
}

${MP} [class*="_searchRow"]:focus-within {
  border-color: var(--hm-cell-active-border);
  box-shadow: 0 0 0 2px var(--hm-cell-highlight);
}

${MP} [class*="_searchRow"] [class*="_search"] {
  padding: 5px 8px 5px 28px;
  position: relative;
}

${MP} [class*="_searchRow"] [class*="_search"]::before {
  content: "";
  position: absolute;
  left: 9px;
  top: 50%;
  width: 13px;
  height: 13px;
  transform: translateY(-50%);
  pointer-events: none;
  background-color: var(--hm-ink-muted);
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='square'%3E%3Ccircle cx='10' cy='10' r='7'/%3E%3Cpath d='m15 15 7 7'/%3E%3C/svg%3E") center / contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='square'%3E%3Ccircle cx='10' cy='10' r='7'/%3E%3Cpath d='m15 15 7 7'/%3E%3C/svg%3E") center / contain no-repeat;
}

${MP} [class*="_searchRow"] [class*="_searchWithQuery"] {
  padding-right: 32px;
}

${MP} [class*="_searchRow"] input {
  color: var(--hm-ink-primary);
  font-size: 12.5px;
  font-family: var(--hf-font-ui);
}

${MP} [class*="_searchRow"] input::placeholder {
  color: var(--hm-ink-muted);
}

${MP} [class*="_searchClear"] {
  color: var(--hm-ink-muted);
}

${MP} [class*="_searchClear"]:hover {
  color: var(--hm-ink-primary);
  background: var(--hm-row-hover);
}

${MP} [class*="_status"],
${MP} [class*="_error"],
${MP} [class*="_warning"] {
  order: 3;
}

${MP} [class*="_empty"] {
  order: 5;
  color: var(--hm-ink-muted);
  text-align: center;
  padding: 16px 10px;
}

/* ── Accessible Keep-Alive Hiding of Native Lists ── */
${TP}[data-hf-slider-ready="1"] > [class*="_thinkingOptions"],
${MP}[data-hf-ptable-ready="1"] > [class*="_groups"] {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip-path: inset(50%) !important;
  white-space: nowrap !important;
  border: 0 !important;
  pointer-events: none !important;
}

${TP} > [class*="_thinkingOptions"] {
  order: 2;
}

${TP} > [class*="_thinkingOptions"] [class*="_option"] {
  color: var(--hm-ink-primary);
}

${TP} > [class*="_thinkingOptions"] [class*="_option"][aria-checked="true"],
${TP} > [class*="_thinkingOptions"] [class*="_check"] {
  color: var(--hm-badge-ink);
}

${MP} > [class*="_groups"] {
  order: 4;
}

/* ── Thinking Panel: Neural Effort Throttle Deck ── */
${TP} .hf-effort-deck {
  order: 2;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 2px 2px 4px;
}

${TP} > [class*="_panelHeader"] > .hf-effort-badge {
  margin-left: auto;
  flex: 0 1 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  max-width: 142px;
  height: 22px;
  padding: 0 7px;
  border: 1px solid var(--hm-badge-border);
  border-radius: 5px;
  background: var(--hm-badge-bg);
  color: var(--hm-badge-ink);
  font: 800 10px / 1 var(--hf-font-mono);
  letter-spacing: .04em;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}

${TP} > [class*="_panelHeader"] > .hf-effort-badge svg {
  width: 11px;
  height: 11px;
  flex: 0 0 auto;
}

${TP} > [class*="_panelHeader"] > .hf-effort-badge[data-tier="overdrive"] {
  border-color: var(--hm-cell-active-border);
  background: var(--hm-stamp-bg);
  color: var(--hm-stamp-ink);
  box-shadow: var(--hm-overdrive-glow);
}

${TP} .hf-slider-stage {
  --hf-cap-h: 28px;
  --hf-knob-d: 30px;
  --hf-knob-r: 14px;
  position: relative;
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0;
  box-sizing: border-box;
  cursor: pointer;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  overflow: visible;
}

${TP} .hf-slider-rail {
  position: relative;
  width: 100%;
  height: var(--hf-cap-h);
  border-radius: 999px;
  border: 1px solid var(--hm-track-border);
  background: var(--hm-track-well);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, .42);
  overflow: hidden;
}

${R}[data-hf-preset-composer="archive"] body > div[id$="-menu"][class*="_menu"] [class*="_thinkingPanel"] .hf-slider-rail {
  box-shadow: inset 0 1px 3px rgba(15, 23, 42, .14);
}

${TP} .hf-slider-fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: calc(var(--hf-cap-h) + (100% - var(--hf-cap-h)) * var(--thumb-ratio, 0));
  border-radius: 999px;
  background: var(--hm-fill-low);
  transition: width 160ms cubic-bezier(.22, .61, .36, 1), box-shadow 180ms ease;
  overflow: hidden;
}

${TP} .hf-slider-stage[data-dragging="1"] .hf-slider-fill,
${TP} .hf-slider-stage[data-dragging="1"] .hf-slider-thumb {
  transition: none;
}

${TP} .hf-slider-stage[data-tier="medium"] .hf-slider-fill {
  background: var(--hm-fill-medium);
}

${TP} .hf-slider-stage[data-tier="high"] .hf-slider-fill {
  background: var(--hm-fill-high);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .28);
}

${TP} .hf-slider-stage[data-tier="overdrive"] .hf-slider-fill {
  background-image: var(--hm-overdrive-sweep);
  background-size: 220% 100%;
  animation: hf-overdrive-flow 2.1s linear infinite;
  box-shadow: var(--hm-overdrive-glow), inset 0 1px 0 rgba(255, 255, 255, .42);
}

${TP} .hf-overdrive-sheen {
  display: none;
  position: absolute;
  inset: -6px 0;
  width: 38%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .36), transparent);
  pointer-events: none;
}

${TP} .hf-slider-stage[data-tier="overdrive"] .hf-overdrive-sheen {
  display: block;
  animation: hf-overdrive-sheen 1.65s cubic-bezier(.22, .61, .36, 1) infinite;
}

${TP} .hf-tick-dot {
  position: absolute;
  top: 50%;
  left: calc(var(--hf-knob-r) + (100% - var(--hf-cap-h)) * var(--tick-r, 0));
  width: 3.5px;
  height: 3.5px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  background: var(--hm-tick-dot);
  opacity: .75;
  pointer-events: none;
  z-index: 2;
  transition: opacity 140ms ease, background-color 140ms ease;
}

${TP} .hf-tick-dot[data-passed="1"] {
  background: rgba(255, 255, 255, .92);
  opacity: .92;
}

${TP} .hf-tick-dot[data-current="1"] {
  opacity: 0;
}

${TP} .hf-slider-thumb {
  position: absolute;
  top: 50%;
  left: calc(var(--hf-knob-r) + (100% - var(--hf-cap-h)) * var(--thumb-ratio, 0));
  width: var(--hf-knob-d);
  height: var(--hf-knob-d);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 0;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .44), 0 0 0 1px rgba(0, 0, 0, .12);
  z-index: 4;
  pointer-events: none;
  transition: left 160ms cubic-bezier(.22, .61, .36, 1), transform 140ms ease, box-shadow 180ms ease;
}

${TP} .hf-slider-stage:hover .hf-slider-thumb {
  transform: translate(-50%, -50%) scale(1.05);
}

${TP} .hf-slider-stage[data-dragging="1"] .hf-slider-thumb {
  transform: translate(-50%, -50%) scale(1.08);
}

${TP} .hf-slider-stage[data-tier="overdrive"] .hf-slider-thumb {
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .46), 0 0 12px rgba(255, 255, 255, .52);
}

${R}[data-hf-preset-composer="street"] body > div[id$="-menu"][class*="_menu"] [class*="_thinkingPanel"] .hf-slider-thumb {
  box-shadow: 0 0 0 1.5px #07080b, 0 2px 8px rgba(0, 0, 0, .52);
}

${R}[data-hf-preset-composer="archive"] body > div[id$="-menu"][class*="_menu"] [class*="_thinkingPanel"] .hf-slider-thumb {
  box-shadow: 0 2px 8px rgba(15, 23, 42, .26), 0 0 0 1px rgba(36, 85, 231, .22);
}

/* Inside-Capsule Overdrive Stardust & Micro-Streak Stream (Codex-style clean pill) */
${TP} .hf-particle-plume {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  transition: opacity 180ms ease;
}

${TP} .hf-slider-stage[data-tier="overdrive"] .hf-particle-plume {
  opacity: 1;
}

${TP} .hf-p {
  position: absolute;
  left: var(--x, 12%);
  top: var(--y, 50%);
  width: var(--sz, 2.5px);
  height: var(--sz, 2.5px);
  border-radius: 999px;
  background: rgba(255, 255, 255, .92);
  box-shadow: 0 0 5px rgba(255, 255, 255, .65);
  opacity: 0;
  will-change: transform, opacity;
}

${TP} .hf-p-streak {
  width: var(--len, 20px);
  height: var(--sz, 1.5px);
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, .82) 100%);
  box-shadow: none;
}

${TP} .hf-slider-stage[data-tier="overdrive"] .hf-p {
  animation: hf-particle-jet var(--dur, 1.8s) linear var(--del, 0s) infinite;
}

/* Segmented Tick Labels Row (strictly decoupled below full-width capsule) */
${TP} .hf-slider-ticks {
  display: grid;
  grid-template-columns: repeat(var(--tick-count, 4), minmax(0, 1fr));
  gap: 2px;
  padding: 0 2px;
  margin-top: -1px;
}

${TP} .hf-tick-label {
  appearance: none;
  border: 0;
  padding: 2px 1px 4px;
  margin: 0;
  background: transparent;
  color: var(--hm-ink-muted);
  font: 600 11px / 1.2 var(--hf-font-ui);
  text-align: center;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 120ms ease;
}

${TP} .hf-tick-label:first-child {
  text-align: left;
}

${TP} .hf-tick-label:last-child {
  text-align: right;
}

${TP} .hf-tick-label:hover:not(:disabled) {
  color: var(--hm-ink-primary);
}

${TP} .hf-tick-label[data-active="1"] {
  color: var(--hm-badge-ink);
  font-weight: 800;
}

${TP} .hf-tick-label[data-active="1"]::after {
  content: "";
  position: absolute;
  left: 16%;
  right: 16%;
  bottom: 0;
  height: 2px;
  border-radius: 999px;
  background: var(--hm-cell-active-border);
}

${TP} .hf-tick-label:first-child[data-active="1"]::after {
  left: 0;
  right: 32%;
}

${TP} .hf-tick-label:last-child[data-active="1"]::after {
  left: 32%;
  right: 0;
}

${TP} .hf-tick-label:disabled {
  opacity: .45;
  cursor: default;
}

/* ── Bottom Current Model Cell + Element Pseudo-Badge ── */
${TP} [class*="_modelCellWrap"] {
  order: 3;
  margin-top: 6px;
  padding-top: 7px;
  border-top: 1px solid var(--hm-rule);
}

${TP} [class*="_modelCellWrap"] button[class*="_cell"] {
  min-height: 36px;
  padding: 0 9px;
  border: 1px solid var(--hm-well-border);
  border-radius: 9px;
  background: var(--hm-well-bg);
  color: var(--hm-ink-primary);
  font-size: 12.5px;
  font-weight: 700;
  transition: border-color 120ms ease, background-color 120ms ease;
}

${TP} [class*="_modelCellWrap"] button[class*="_cell"]:is(:hover, :focus-visible, [aria-expanded="true"]) {
  border-color: var(--hm-cell-active-border);
  background: var(--hm-row-hover);
}

${TP} [class*="_modelCellWrap"] button[class*="_cell"] [class*="_cellValue"] {
  color: var(--hm-ink-primary);
  font-weight: 700;
}

${TP} [class*="_modelCellWrap"] button[class*="_cell"] [class*="_cellChevron"] {
  color: var(--hm-badge-ink);
}

${TP} [class*="_modelCellWrap"] button[class*="_cell"][data-hf-el-badge]::before {
  content: attr(data-hf-el-badge);
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 19px;
  padding: 0 5px;
  border: 1px solid var(--hm-badge-border);
  border-radius: 4px;
  background: var(--hm-badge-bg);
  color: var(--hm-badge-ink);
  font: 800 10px / 1 var(--hf-font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: .03em;
}

/* ── Model Panel: Periodic Table + Extended Compact Roster ── */
${MP} .hf-model-deck {
  order: 4;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 2px;
  scrollbar-width: thin;
  scrollbar-color: var(--hm-scroll-thumb) transparent;
}

${MP} .hf-model-deck::-webkit-scrollbar {
  width: 4px;
}

${MP} .hf-model-deck::-webkit-scrollbar-thumb {
  background: var(--hm-scroll-thumb);
  border-radius: 999px;
}

${MP} .hf-deck-eyebrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 2px;
  color: var(--hm-ink-muted);
  font: 700 9.5px / 1.3 var(--hf-font-mono);
  letter-spacing: .08em;
  text-transform: uppercase;
}

${MP} .hf-deck-eyebrow strong {
  color: var(--hm-badge-ink);
  font-weight: 800;
}

${MP} .hf-ptable-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

${MP} .hf-ptable-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

/* Armor Cell (2x2 Periodic Matrix Card) */
${MP} .hf-el-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 92px;
  padding: 7px 8px 7px 9px;
  border: var(--hm-cell-border);
  border-radius: 8px 4px 2px 8px;
  background: var(--hm-cell-bg);
  color: var(--hm-ink-primary);
  cursor: pointer;
  overflow: hidden;
  box-sizing: border-box;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
  transition: border-color 120ms ease, background 120ms ease, transform 110ms ease;
}

${MP} .hf-el-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 14% 20%, var(--el-tint, transparent), transparent 64%);
}

${MP} .hf-el-card[data-el="H"]  { --el-tint: var(--hm-el-h-tint); }
${MP} .hf-el-card[data-el="C"]  { --el-tint: var(--hm-el-c-tint); }
${MP} .hf-el-card[data-el="Ne"] { --el-tint: var(--hm-el-ne-tint); }
${MP} .hf-el-card[data-el="Ar"] { --el-tint: var(--hm-el-ar-tint); }

${MP} .hf-el-card:hover:not([data-disabled="1"]),
${MP} .hf-el-card[data-highlighted="1"] {
  border-color: var(--hm-cell-active-border);
  background: var(--hm-cell-hover-bg);
}

${MP} .hf-el-card[data-checked="1"] {
  border: 1.5px solid var(--hm-cell-active-border);
  background:
    linear-gradient(135deg, var(--hm-cell-grid) 25%, transparent 25%) 0 0 / 10px 10px,
    var(--hm-cell-active-bg);
  box-shadow: inset 0 2.5px 0 var(--hm-cell-active-border);
}

${MP} .hf-el-card[data-disabled="1"] {
  opacity: .55;
  cursor: default;
}

${MP} .hf-el-top {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}

${MP} .hf-el-meta {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  min-width: 0;
  font: 700 9.5px / 1 var(--hf-font-mono);
  font-variant-numeric: tabular-nums;
}

${MP} .hf-el-z {
  color: var(--hm-badge-ink);
  font-size: 11px;
  font-weight: 900;
}

${MP} .hf-el-orbital {
  color: var(--hm-ink-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

${MP} .hf-el-controls {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  flex: 0 0 auto;
}

${MP} .hf-el-act {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 16px;
  padding: 0 4px;
  border-radius: 3px;
  background: var(--hm-stamp-bg);
  color: var(--hm-stamp-ink);
  font: 900 9px / 1 var(--hf-font-mono);
  letter-spacing: .04em;
}

${MP} .hf-el-act svg {
  width: 9px;
  height: 9px;
}

${MP} .hf-el-mid {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0 5px;
}

${MP} .hf-el-sym {
  flex: 0 0 auto;
  min-width: 30px;
  font: 900 26px / 1 var(--hf-font-ui);
  letter-spacing: -.03em;
  color: var(--hm-ink-primary);
}

${MP} .hf-el-card[data-checked="1"] .hf-el-sym {
  color: var(--hm-badge-ink);
}

${MP} .hf-el-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 2px;
}

${MP} .hf-el-name {
  font-size: 12px;
  font-weight: 800;
  line-height: 1.2;
  color: var(--hm-ink-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

${MP} .hf-el-tag {
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--hm-ink-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

${MP} .hf-el-foot {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

${MP} .hf-el-bars {
  display: inline-flex;
  gap: 3px;
  flex: 1 1 auto;
}

${MP} .hf-el-bars i {
  display: block;
  flex: 1 1 0;
  max-width: 18px;
  height: 3.5px;
  border-radius: 1px;
  background: var(--hm-bar-off);
}

${MP} .hf-el-bars i[data-lit="1"] {
  background: var(--hm-bar-on);
}

${MP} .hf-el-group {
  flex: 0 0 auto;
  color: var(--hm-ink-muted);
  font: 700 8.5px / 1 var(--hf-font-mono);
  letter-spacing: .04em;
}

/* Favorite Star Buttons (Card + Compact Row) */
${MP} .hf-cell-star,
${MP} .hf-row-star {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--hm-star-off);
  cursor: pointer;
  transition: color 120ms ease, background-color 120ms ease;
}

${MP} .hf-cell-star {
  margin: -3px -3px -3px 0;
}

${MP} .hf-cell-star:hover:not(:disabled),
${MP} .hf-row-star:hover:not(:disabled) {
  color: var(--hm-ink-primary);
  background: var(--hm-row-hover);
}

${MP} .hf-cell-star[aria-pressed="true"],
${MP} .hf-row-star[aria-pressed="true"] {
  color: var(--hm-star-on);
}

${MP} .hf-cell-star svg,
${MP} .hf-row-star svg {
  width: 14px;
  height: 14px;
}

${MP} .hf-cell-star:disabled,
${MP} .hf-row-star:disabled {
  opacity: .4;
  cursor: default;
}

/* Secondary Extended Compact Roster */
${MP} .hf-secondary-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

${MP} .hf-ptable-section + .hf-secondary-section {
  padding-top: 6px;
  border-top: 1px solid var(--hm-rule);
}

${MP} .hf-secondary-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

${MP} .hf-sec-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 2px 4px 2px 6px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: var(--hm-row-bg);
  color: var(--hm-ink-primary);
  cursor: pointer;
  box-sizing: border-box;
  transition: background-color 110ms ease, border-color 110ms ease;
}

${MP} .hf-sec-row:hover:not([data-disabled="1"]),
${MP} .hf-sec-row[data-highlighted="1"] {
  background: var(--hm-row-hover);
  border-color: var(--hm-badge-border);
}

${MP} .hf-sec-row[data-checked="1"] {
  background: var(--hm-row-active-bg);
  border-color: var(--hm-cell-active-border);
}

${MP} .hf-sec-row[data-disabled="1"] {
  opacity: .55;
  cursor: default;
}

${MP} .hf-sec-tag {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 17px;
  padding: 0 4px;
  border: 1px solid var(--hm-badge-border);
  border-radius: 4px;
  background: var(--hm-badge-bg);
  color: var(--hm-badge-ink);
  font: 800 9px / 1 var(--hf-font-mono);
  letter-spacing: .04em;
}

${MP} .hf-sec-name {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--hm-ink-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

${MP} .hf-sec-row[data-checked="1"] .hf-sec-name {
  font-weight: 800;
}

${MP} .hf-sec-check {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  color: var(--hm-badge-ink);
}

${MP} .hf-sec-check svg {
  width: 13px;
  height: 13px;
}

${MP} .hf-pending-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--hm-cell-active-border);
  animation: hf-pending-pulse .9s ease-in-out infinite;
}

${MP} mark.hf-match {
  background: var(--hm-match-bg);
  color: var(--hm-match-ink);
  border-radius: 2px;
  padding: 0 1px;
}

/* ── Keyframes (Compositor-Only Transforms & Background Position) ── */
@keyframes hf-overdrive-flow {
  0% { background-position: 200% 0; }
  100% { background-position: 0% 0; }
}

@keyframes hf-overdrive-sheen {
  0% { transform: translateX(-110%) skewX(-24deg); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: .95; }
  100% { transform: translateX(240%) skewX(-24deg); opacity: 0; }
}

@keyframes hf-particle-jet {
  0% {
    transform: translate3d(-12px, 0, 0) scale(.65);
    opacity: 0;
  }
  18% {
    opacity: .92;
  }
  80% {
    opacity: .75;
  }
  100% {
    transform: translate3d(var(--dx, 70px), var(--dy, -2px), 0) scale(.95);
    opacity: 0;
  }
}

@keyframes hf-pending-pulse {
  0%, 100% { opacity: .35; transform: scale(.8); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* ── Mobile 390px Single-Pane Adaptation (018 DESIGN_SPEC Section 5) ── */
@media (max-width: 767px) {
  ${MP} [class*="_searchRow"] input {
    font-size: 16px;
  }
}

@media (max-width: 640px) {
  ${M},
  ${MP},
  ${TP} {
    width: min(340px, calc(100vw - 24px));
    max-width: calc(100vw - 24px);
  }

  ${MP} {
    position: relative;
    top: auto;
    bottom: auto;
    right: auto;
    left: auto;
    width: 100%;
  }

  ${M}[class*="_modelOpen"] [class*="_thinkingPanel"] {
    display: none;
  }

  ${M} [class*="_backButton"] {
    display: inline-flex;
    width: 32px;
    height: 32px;
  }

  ${TP} .hf-slider-stage {
    --hf-cap-h: 32px;
    --hf-knob-d: 34px;
    --hf-knob-r: 16px;
    height: 44px;
  }

  ${TP} [class*="_modelCellWrap"] button[class*="_cell"] {
    min-height: 40px;
  }

  ${MP} .hf-cell-star,
  ${MP} .hf-row-star {
    width: 32px;
    height: 32px;
  }

  ${MP} .hf-sec-row {
    min-height: 36px;
  }
}

/* ── Reduced Motion Accessibility Fallback ── */
@media (prefers-reduced-motion: reduce) {
  ${TP} .hf-slider-fill,
  ${TP} .hf-overdrive-sheen,
  ${TP} .hf-p,
  ${MP} .hf-pending-dot {
    animation: none !important;
    transition: none !important;
  }

  ${TP} .hf-slider-stage[data-tier="overdrive"] .hf-overdrive-sheen {
    display: none;
  }

  ${TP} .hf-slider-stage[data-tier="overdrive"] .hf-p {
    opacity: .65;
    transform: translate3d(calc(var(--dx, 30px) * 0.45), calc(var(--dy, 0px) * 0.45), 0) scale(.75);
  }
}
`
