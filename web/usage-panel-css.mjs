// Shadow DOM stylesheet for H.D.D + Fairy New-Session Usage Telemetry Panel.
// Includes Default Collapsed Strip + Expanded 4-Tab Dashboard + 3 ZZZ Presets + Mobile Responsive Layout.

export const USAGE_PANEL_CSS = `
.hf-up-icon { display:inline-flex; flex:none; align-items:center; justify-content:center; }
.hf-up-icon svg { display:block; }
.hf-up-dot-btn[aria-pressed="true"] { outline:1px solid currentColor; outline-offset:1px; }
.hf-up-expand-btn, .hf-up-fold-btn { display:inline-flex; align-items:center; justify-content:center; gap:4px; }

:host {
  all: initial;
  display: block;
  width: 100%;
  font-family: "Microsoft YaHei", "Microsoft YaHei UI", "微软雅黑", "PingFang SC", "Noto Sans SC", system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}

.hf-up-root,
.hf-up-root *,
.hf-up-root *::before,
.hf-up-root *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.hf-up-root {
  --mono-font: "Cascadia Code", "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
  --gold-grad: linear-gradient(135deg, #f4ca25 0%, #e8c01a 46%, #8c7101 100%);
  --row-gold: linear-gradient(100deg, #ff9e1a 0%, #f8cb29 56%, #eeb418 100%);
  width: 100%;
  user-select: none;
}

.hf-up-root button,
.hf-up-root select {
  font-family: inherit;
  cursor: pointer;
}

/* ==================== DEFAULT COLLAPSED TELEMETRY STRIP ==================== */
.hf-up-bar {
  position: relative;
  width: 100%;
  min-height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 10px 6px 14px;
  overflow: hidden;
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}

.hf-up-bar-main {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
  cursor: pointer;
}

.hf-up-logo {
  height: 18px;
  width: auto;
  flex: none;
  object-fit: contain;
}

.hf-up-period-tag {
  flex: none;
  padding: 2px 7px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 900;
  line-height: 1.35;
}

.hf-up-bar-metrics {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 6px 9px;
  min-width: 0;
  overflow: hidden;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.hf-up-bm {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  white-space: nowrap;
  flex: none;
}

.hf-up-bm strong {
  font-weight: 900;
}

.hf-up-bm-mono {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
}

.hf-up-bm-mono strong {
  font-family: var(--mono-font);
  font-size: 11.5px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hf-up-sep {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  flex: none;
  opacity: 0.55;
}

.hf-up-bar-right {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: none;
}

.hf-up-dots {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 7px;
  border-radius: 999px;
}

.hf-up-dot-btn {
  display:inline-flex; align-items:center; justify-content:center;
  width:24px; height:24px; padding:3px; border:1px solid transparent;
  background:transparent; color:inherit; cursor:pointer; border-radius:4px;
}

.hf-up-dot-btn:hover,
.hf-up-dot-btn[aria-pressed="true"] {
  opacity: 1;
  transform: scale(1.14);
}





.hf-up-expand-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 11px;
  border-radius: 8px;
  font-size: 11.5px;
  font-weight: 800;
  white-space: nowrap;
}

/* ==================== EXPANDED PANEL BASE LAYOUT ==================== */
.hf-up-panel {
  position: relative;
  width: 100%;
}

.hf-up-panel.is-entering {
  animation: hf-up-enter 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes hf-up-enter {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.hf-up-inner {
  padding: 14px 17px 12px;
}

.hf-up-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.hf-up-tabs-wrap {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.hf-up-tabs {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px;
}

.hf-up-tab {
  border: 0;
  background: transparent;
  padding: 5px 12px;
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.02em;
  border-radius: 7px;
  white-space: nowrap;
}

.hf-up-header-right {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
}

.hf-up-presets {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2.5px 5px;
  border-radius: 8px;
}

.hf-up-preset-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid transparent;
  background: transparent;
  padding: 2.5px 7px;
  border-radius: 5px;
  font-size: 10.5px;
  font-weight: 800;
  white-space: nowrap;
}

.hf-up-pdot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex: none;
}

.hf-up-icon-btn {
  width: 27px;
  height: 27px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 900;
}

.hf-up-icon-btn.is-spinning span {
  display: inline-block;
  animation: hf-up-spin 0.8s linear infinite;
}

@keyframes hf-up-spin {
  to { transform: rotate(360deg); }
}

.hf-up-fold-btn {
  height: 27px;
  padding: 0 10px;
  border-radius: 7px;
  font-size: 11.5px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

/* Filters row */
.hf-up-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 11px;
}

.hf-up-ranges {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px;
}

.hf-up-range {
  border: 1px solid transparent;
  background: transparent;
  padding: 3px 9.5px;
  font-size: 11.5px;
  font-weight: 700;
  border-radius: 6px;
  white-space: nowrap;
}

.hf-up-selects {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.hf-up-select {
  padding: 4px 10px;
  font-size: 11.5px;
  font-weight: 700;
  border-radius: 7px;
  max-width: 185px;
  outline: none;
}

/* Overview 6 KPI cards */
.hf-up-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  margin-bottom: 11px;
}

.hf-up-card {
  position: relative;
  padding: 9.5px 13px 8.5px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  overflow: hidden;
}

.hf-up-card-lbl {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 700;
}

.hf-up-card-mark {
  width: 6px;
  height: 6px;
  flex: none;
}

.hf-up-card-val {
  font-size: 20px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1.18;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hf-up-card-val.is-model {
  font-family: var(--mono-font);
  font-size: 16.5px;
  font-weight: 800;
}

.hf-up-card-sub {
  font-size: 11px;
  font-weight: 600;
  display: flex;
  flex-wrap: wrap;
  gap: 3px 10px;
  line-height: 1.3;
}

/* Heatmap */
.hf-up-heatbox {
  padding: 10px 12px 8px;
  margin-bottom: 9px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  overflow-x: auto;
}

.hf-up-heatgrid {
  display: grid;
  grid-template-rows: repeat(7, 11px);
  grid-auto-flow: column;
  grid-auto-columns: 11px;
  gap: 3.5px;
}

.hf-up-hm {
  width: 11px;
  height: 11px;
  border-radius: 2.5px;
  display: inline-block;
}

.hf-up-hm.is-pad {
  opacity: 0;
  pointer-events: none;
}

.hf-up-heatfoot {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 10.5px;
  font-weight: 700;
}

.hf-up-legend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.hf-up-legend .hf-up-hm {
  width: 9.5px;
  height: 9.5px;
}

/* Tables (Models & Harnesses) */
.hf-up-table {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 276px;
  overflow-y: auto;
  margin-bottom: 9px;
  padding-right: 2px;
}

.hf-up-trow {
  display: grid;
  grid-template-columns: minmax(120px, 1.8fr) minmax(90px, 1.2fr) 0.9fr 0.85fr 0.75fr 0.85fr;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.hf-up-trow.is-head {
  font-size: 11px;
  font-weight: 800;
  opacity: 0.78;
  padding-block: 4px;
}

.hf-up-tname {
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hf-up-tname.is-mono {
  font-family: var(--mono-font);
  font-size: 11.5px;
}

.hf-up-tnum {
  text-align: right;
  font-weight: 700;
  white-space: nowrap;
}

.hf-up-share {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hf-up-share-track {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  overflow: hidden;
}

.hf-up-share-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
}

.hf-up-share-pct {
  width: 32px;
  text-align: right;
  font-size: 11px;
  font-weight: 800;
}

/* Quota View */
.hf-up-quotas {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  max-height: 280px;
  overflow-y: auto;
  margin-bottom: 9px;
}

.hf-up-qcard {
  padding: 10px 12px;
  border-radius: 11px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hf-up-qhead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.hf-up-qtitle {
  font-size: 12.5px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hf-up-qbadge {
  padding: 1.5px 7px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.hf-up-qwin {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hf-up-qwin-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11.5px;
  font-weight: 700;
}

.hf-up-qtrack {
  width: 100%;
  height: 7px;
  border-radius: 999px;
  overflow: hidden;
}

.hf-up-qfill {
  display: block;
  height: 100%;
  border-radius: 999px;
}

.hf-up-qdetail {
  font-size: 10.5px;
  opacity: 0.78;
}

.hf-up-qbal {
  font-size: 18px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
}

.hf-up-empty {
  padding: 24px 12px;
  text-align: center;
  font-size: 12.5px;
  font-weight: 700;
  opacity: 0.78;
}

/* Footer */
.hf-up-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 11.5px;
  font-weight: 700;
}

.hf-up-fun {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hf-up-src {
  flex: none;
  font-size: 11px;
  opacity: 0.8;
  white-space: nowrap;
}

/* PRESET_AMBER_START */
.hf-up-root[data-preset="amber"] .hf-up-bar {
  background: linear-gradient(180deg, #19191c 0%, #121215 100%);
  border: 2px solid #2f2e29;
  border-radius: 14px 5px 14px 14px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.52), inset 0 1px 0 rgba(255, 248, 220, 0.05);
  color: #a8a49b;
}
.hf-up-root[data-preset="amber"] .hf-up-bar::before {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0; width: 4px;
  background: linear-gradient(180deg, #ff9e1a, #f8cb29);
}
.hf-up-root[data-preset="amber"] .hf-up-logo { filter: brightness(0) invert(1); opacity: 0.92; }
.hf-up-root[data-preset="amber"] .hf-up-period-tag { background: var(--row-gold); color: #161308; }
.hf-up-root[data-preset="amber"] .hf-up-bm strong { color: #f5f2e9; }
.hf-up-root[data-preset="amber"] .hf-up-bm.is-accent strong { color: #ffd026; }
.hf-up-root[data-preset="amber"] .hf-up-sep { background: #524e44; }
.hf-up-root[data-preset="amber"] .hf-up-dots { background: #0c0c0e; border: 1px solid #292824; }
.hf-up-root[data-preset="amber"] .hf-up-expand-btn {
  background: #231f12; border: 1px solid rgba(248, 203, 41, 0.48); color: #f8cb29;
}

.hf-up-root[data-preset="amber"] .hf-up-panel {
  background:
    radial-gradient(65% 85% at 10% 0%, rgba(248, 203, 41, 0.08), transparent 60%),
    linear-gradient(180deg, rgba(22, 22, 25, 0.97) 0%, rgba(14, 14, 16, 0.98) 100%);
  border: 2px solid #33312b;
  border-radius: 18px 5px 18px 18px;
  box-shadow: 0 22px 46px rgba(0, 0, 0, 0.68), inset 0 1px 0 rgba(255, 248, 220, 0.06), 0 0 0 1px #070708;
  color: #f4f1e8;
  overflow: hidden;
}
.hf-up-root[data-preset="amber"] .hf-up-panel::before {
  content: "";
  position: absolute;
  left: 0; right: 0; top: 0; height: 3.5px;
  background:
    linear-gradient(90deg, #ff9e1a 0%, #f8cb29 34%, transparent 34.1%),
    repeating-linear-gradient(-55deg, #f8cb29 0 6px, #141416 6px 12px);
}
.hf-up-root[data-preset="amber"] .hf-up-tabs { background: #0c0c0e; border: 1px solid #282724; border-radius: 10px; }
.hf-up-root[data-preset="amber"] .hf-up-tab { color: #9c988e; }
.hf-up-root[data-preset="amber"] .hf-up-tab[aria-selected="true"] {
  background: var(--row-gold); color: #161308; box-shadow: 0 0 10px rgba(248, 203, 41, 0.24);
}
.hf-up-root[data-preset="amber"] .hf-up-presets { background: #0d0d0f; border: 1px solid #2b2a26; }
.hf-up-root[data-preset="amber"] .hf-up-preset-btn { color: #9e9a90; }
.hf-up-root[data-preset="amber"] .hf-up-preset-btn[aria-pressed="true"] {
  background: #262111; color: #f8cb29; border-color: rgba(248, 203, 41, 0.42);
}
.hf-up-root[data-preset="amber"] .hf-up-icon-btn {
  background: #1a1a1d; border: 1px solid #302f2b; color: #dcd8ce;
}
.hf-up-root[data-preset="amber"] .hf-up-fold-btn {
  background: #221d10; border: 1px solid rgba(248, 203, 41, 0.45); color: #f8cb29;
}
.hf-up-root[data-preset="amber"] .hf-up-ranges { background: #0f0f12; border: 1px solid #262522; border-radius: 8px; }
.hf-up-root[data-preset="amber"] .hf-up-range { color: #8f8b82; }
.hf-up-root[data-preset="amber"] .hf-up-range[aria-pressed="true"] {
  background: #282110; color: #ffd026; border-color: rgba(248, 203, 41, 0.52); font-weight: 800;
}
.hf-up-root[data-preset="amber"] .hf-up-select {
  background: #141417; border: 1px solid #2e2d29; color: #e8e4da;
}
.hf-up-root[data-preset="amber"] .hf-up-card,
.hf-up-root[data-preset="amber"] .hf-up-qcard,
.hf-up-root[data-preset="amber"] .hf-up-trow:not(.is-head) {
  background: linear-gradient(165deg, #1d1d21, #141417);
  border: 1.5px solid #2c2b27;
  border-radius: 12px;
}
.hf-up-root[data-preset="amber"] .hf-up-card.is-hero {
  background: linear-gradient(155deg, #241f11 0%, #161512 100%);
  border-color: rgba(248, 203, 41, 0.62);
  box-shadow: inset 3.5px 0 0 #f8cb29;
}
.hf-up-root[data-preset="amber"] .hf-up-card-lbl { color: #9a968c; }
.hf-up-root[data-preset="amber"] .hf-up-card.is-hero .hf-up-card-lbl { color: #e5c65c; }
.hf-up-root[data-preset="amber"] .hf-up-card-mark { background: #575347; transform: rotate(45deg); }
.hf-up-root[data-preset="amber"] .hf-up-card.is-hero .hf-up-card-mark { background: #f8cb29; box-shadow: 0 0 6px rgba(248, 203, 41, 0.7); }
.hf-up-root[data-preset="amber"] .hf-up-card-val { color: #f5f2e9; }
.hf-up-root[data-preset="amber"] .hf-up-card.is-hero .hf-up-card-val { color: #ffd026; }
.hf-up-root[data-preset="amber"] .hf-up-card-val.is-model { color: #f2da7a; }
.hf-up-root[data-preset="amber"] .hf-up-card-sub { color: #807c73; }
.hf-up-root[data-preset="amber"] .hf-up-heatbox { background: #0d0d10; border: 1px solid #262521; border-radius: 11px; }
.hf-up-root[data-preset="amber"] .hf-up-hm.lv-0 { background: #1c1c20; }
.hf-up-root[data-preset="amber"] .hf-up-hm.lv-1 { background: #453712; }
.hf-up-root[data-preset="amber"] .hf-up-hm.lv-2 { background: #7d6114; }
.hf-up-root[data-preset="amber"] .hf-up-hm.lv-3 { background: #c49616; }
.hf-up-root[data-preset="amber"] .hf-up-hm.lv-4 { background: #ffd026; box-shadow: 0 0 5px rgba(255, 208, 38, 0.45); }
.hf-up-root[data-preset="amber"] .hf-up-share-track,
.hf-up-root[data-preset="amber"] .hf-up-qtrack { background: #090a0d; box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.55); border-radius: 999px; }
.hf-up-root[data-preset="amber"] .hf-up-share-fill,
.hf-up-root[data-preset="amber"] .hf-up-qfill { background: var(--row-gold); border-radius: 999px; }
.hf-up-root[data-preset="amber"] .hf-up-qfill.is-hot { background: #ff5d3a; }
.hf-up-root[data-preset="amber"] .hf-up-qbadge { background: #292210; color: #ffd026; border: 1px solid rgba(248, 203, 41, 0.4); }
.hf-up-root[data-preset="amber"] .hf-up-heatfoot { color: #807c72; }
.hf-up-root[data-preset="amber"] .hf-up-footer { color: #d6d1c4; }
.hf-up-root[data-preset="amber"] .hf-up-src { color: #827e74; }
/* PRESET_AMBER_END */

/* ==================== PRESET STREET: NEW ERIDU ACID LIME HUD ==================== */
.hf-up-root[data-preset="street"] .hf-up-bar {
  background: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px) 0 0 / 7px 7px, #111317;
  border: 2px solid #050507;
  outline: 1.5px solid #363a42;
  border-radius: 15px 4px 15px 4px;
  box-shadow: 3.5px 3.5px 0 #c8ff00, 0 12px 26px rgba(0, 0, 0, 0.6);
  color: #a4aab6;
}
.hf-up-root[data-preset="street"] .hf-up-logo { filter: brightness(0) invert(1); opacity: 0.95; }
.hf-up-root[data-preset="street"] .hf-up-period-tag { background: #c8ff00; color: #090b06; transform: skewX(-10deg); }
.hf-up-root[data-preset="street"] .hf-up-bm strong { color: #ffffff; font-style: italic; }
.hf-up-root[data-preset="street"] .hf-up-bm.is-accent strong { color: #c8ff00; }
.hf-up-root[data-preset="street"] .hf-up-sep { background: #474c57; }
.hf-up-root[data-preset="street"] .hf-up-dots { background: #08090c; border: 1.5px solid #2a2e37; }
.hf-up-root[data-preset="street"] .hf-up-expand-btn {
  background: #090a0d; border: 1.5px solid #c8ff00; color: #c8ff00; border-radius: 999px;
}

.hf-up-root[data-preset="street"] .hf-up-panel {
  background:
    radial-gradient(circle at 92% 16%, rgba(200, 255, 0, 0.11) 0%, transparent 42%),
    radial-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px) 0 0 / 8px 8px,
    #111317;
  border: 3px solid #050507;
  outline: 2px solid #383c45;
  border-radius: 22px 6px 22px 6px;
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.72), 5px 5px 0 #c8ff00;
  color: #eef1f6;
  overflow: hidden;
}
.hf-up-root[data-preset="street"] .hf-up-panel::before {
  content: "";
  position: absolute;
  left: 0; top: 0; width: 180px; height: 4px;
  background: repeating-linear-gradient(-55deg, #c8ff00 0 8px, #0a0b0e 8px 15px);
}
.hf-up-root[data-preset="street"] .hf-up-tabs { background: #060709; border: 2px solid #282b33; border-radius: 999px; padding: 3.5px 6px; }
.hf-up-root[data-preset="street"] .hf-up-tab { color: #9fa5b2; font-style: italic; border-radius: 999px; }
.hf-up-root[data-preset="street"] .hf-up-tab[aria-selected="true"] {
  background: #c8ff00; color: #090b06; font-weight: 900; transform: skewX(-10deg); border-radius: 6px;
}
.hf-up-root[data-preset="street"] .hf-up-presets { background: #08090c; border: 1.5px solid #2a2e37; border-radius: 999px; }
.hf-up-root[data-preset="street"] .hf-up-preset-btn { color: #989fab; border-radius: 999px; }
.hf-up-root[data-preset="street"] .hf-up-preset-btn[aria-pressed="true"] {
  background: #c8ff00; color: #090b05; border-color: #c8ff00;
}
.hf-up-root[data-preset="street"] .hf-up-icon-btn {
  background: #090a0d; border: 2px solid #343842; border-radius: 50%; color: #c8ff00;
}
.hf-up-root[data-preset="street"] .hf-up-fold-btn {
  background: #090a0d; border: 1.5px solid #c8ff00; color: #c8ff00; border-radius: 999px;
}
.hf-up-root[data-preset="street"] .hf-up-range {
  background: #1a1d24; border-color: #2d313b; color: #9ba1ae; border-radius: 999px;
}
.hf-up-root[data-preset="street"] .hf-up-range[aria-pressed="true"] {
  background: #ffffff; border-color: #ffffff; color: #0b0c0f; font-weight: 900;
}
.hf-up-root[data-preset="street"] .hf-up-select {
  background: #090a0d; border: 2px solid #313540; border-radius: 999px; color: #eef1f6;
}
.hf-up-root[data-preset="street"] .hf-up-card,
.hf-up-root[data-preset="street"] .hf-up-qcard,
.hf-up-root[data-preset="street"] .hf-up-trow:not(.is-head) {
  background: #1a1d24;
  border: 2px solid #060709;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
  border-radius: 14px 4px 14px 14px;
}
.hf-up-root[data-preset="street"] .hf-up-card.is-hero {
  background:
    radial-gradient(rgba(0, 0, 0, 0.09) 1px, transparent 1px) 0 0 / 6px 6px,
    linear-gradient(135deg, #c8ff00 0%, #9ef01a 100%);
  color: #090b05;
}
.hf-up-root[data-preset="street"] .hf-up-card-lbl { color: #9ea4b2; }
.hf-up-root[data-preset="street"] .hf-up-card.is-hero .hf-up-card-lbl { color: #1a2106; font-weight: 900; }
.hf-up-root[data-preset="street"] .hf-up-card-mark { width: 8px; height: 8px; transform: skewX(-18deg); background: #c8ff00; }
.hf-up-root[data-preset="street"] .hf-up-card.is-hero .hf-up-card-mark { background: #090b05; }
.hf-up-root[data-preset="street"] .hf-up-card-val { color: #ffffff; font-style: italic; }
.hf-up-root[data-preset="street"] .hf-up-card.is-hero .hf-up-card-val { color: #090b05; }
.hf-up-root[data-preset="street"] .hf-up-card-sub { color: #848b9b; }
.hf-up-root[data-preset="street"] .hf-up-card.is-hero .hf-up-card-sub { color: #242f07; font-weight: 800; }
.hf-up-root[data-preset="street"] .hf-up-heatbox { background: #0a0b0e; border: 2px solid #262a33; border-radius: 14px; }
.hf-up-root[data-preset="street"] .hf-up-hm.lv-0 { background: #1c2028; }
.hf-up-root[data-preset="street"] .hf-up-hm.lv-1 { background: #244b1c; }
.hf-up-root[data-preset="street"] .hf-up-hm.lv-2 { background: #3b8c24; }
.hf-up-root[data-preset="street"] .hf-up-hm.lv-3 { background: #74d628; }
.hf-up-root[data-preset="street"] .hf-up-hm.lv-4 { background: #c8ff00; box-shadow: 0 0 6px rgba(200, 255, 0, 0.55); }
.hf-up-root[data-preset="street"] .hf-up-share-track,
.hf-up-root[data-preset="street"] .hf-up-qtrack { background: #07080b; box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.55); border-radius: 999px; }
.hf-up-root[data-preset="street"] .hf-up-share-fill,
.hf-up-root[data-preset="street"] .hf-up-qfill { background: linear-gradient(90deg, #9be800, #c8ff00); border-radius: 999px; }
.hf-up-root[data-preset="street"] .hf-up-qfill.is-hot { background: #ff4f5e; }
.hf-up-root[data-preset="street"] .hf-up-qbadge { background: #090a0d; color: #c8ff00; border: 1px solid #c8ff00; }
.hf-up-root[data-preset="street"] .hf-up-heatfoot { color: #8c92a0; }
.hf-up-root[data-preset="street"] .hf-up-footer { color: #e8ecf4; }
.hf-up-root[data-preset="street"] .hf-up-src { color: #8f96a6; }

/* ==================== PRESET ARCHIVE: RANDOM PLAY COBALT/WHITE ARCHIVE ==================== */
.hf-up-root[data-preset="archive"] .hf-up-bar {
  background: #f4f4f2;
  border: 2.5px solid #2455e7;
  border-radius: 16px;
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.45), 0 0 0 1.5px #090b10;
  color: #545a65;
}
.hf-up-root[data-preset="archive"] .hf-up-logo { filter: brightness(0); opacity: 0.9; }
.hf-up-root[data-preset="archive"] .hf-up-period-tag { background: #111318; color: #ffffff; border-radius: 999px; }
.hf-up-root[data-preset="archive"] .hf-up-bm strong { color: #111318; }
.hf-up-root[data-preset="archive"] .hf-up-bm.is-accent strong { color: #2455e7; }
.hf-up-root[data-preset="archive"] .hf-up-sep { background: #adb3bc; }
.hf-up-root[data-preset="archive"] .hf-up-dots { background: #e3e5e0; border: 1px solid #cfd4cd; }
.hf-up-root[data-preset="archive"] .hf-up-expand-btn {
  background: #2455e7; border: 0; color: #ffffff; border-radius: 999px;
}

.hf-up-root[data-preset="archive"] .hf-up-panel {
  background: #2455e7;
  padding: 7px;
  border-radius: 22px;
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.58), 0 0 0 2px #090b10;
}
.hf-up-root[data-preset="archive"] .hf-up-inner {
  background: #f4f4f2;
  color: #181a20;
  border-radius: 16px;
  padding: 12px 15px 11px;
  border: 2px solid #0b0c10;
}
.hf-up-root[data-preset="archive"] .hf-up-header {
  background: #08090c;
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 12px;
}
.hf-up-root[data-preset="archive"] .hf-up-header .hf-up-logo { filter: brightness(0) invert(1); opacity: 0.95; }
.hf-up-root[data-preset="archive"] .hf-up-tab { color: #b5bccb; border-radius: 999px; padding: 4px 12px; }
.hf-up-root[data-preset="archive"] .hf-up-tab[aria-selected="true"] {
  background: #ffffff; color: #0b0c10; font-weight: 900;
}
.hf-up-root[data-preset="archive"] .hf-up-presets { background: #161820; border: 1px solid #2e3340; border-radius: 999px; }
.hf-up-root[data-preset="archive"] .hf-up-preset-btn { color: #b0b7c6; border-radius: 999px; }
.hf-up-root[data-preset="archive"] .hf-up-preset-btn[aria-pressed="true"] {
  background: #2455e7; color: #ffffff; border-color: #4873ff;
}
.hf-up-root[data-preset="archive"] .hf-up-icon-btn {
  background: #1b1e26; color: #ffffff; border-radius: 50%; border: 1px solid #353a47;
}
.hf-up-root[data-preset="archive"] .hf-up-fold-btn {
  background: #2455e7; color: #ffffff; border: 0; border-radius: 999px;
}
.hf-up-root[data-preset="archive"] .hf-up-ranges { background: #e4e6e1; border-radius: 999px; }
.hf-up-root[data-preset="archive"] .hf-up-range { color: #545a65; border-radius: 999px; }
.hf-up-root[data-preset="archive"] .hf-up-range[aria-pressed="true"] {
  background: #111318; color: #ffffff;
}
.hf-up-root[data-preset="archive"] .hf-up-select {
  background: #ffffff; border: 1.5px solid #cfd4cd; border-radius: 999px; color: #181a20;
}
.hf-up-root[data-preset="archive"] .hf-up-card,
.hf-up-root[data-preset="archive"] .hf-up-qcard,
.hf-up-root[data-preset="archive"] .hf-up-trow:not(.is-head) {
  background: #ffffff;
  border: 1.5px solid #d7dbd5;
  border-radius: 13px;
}
.hf-up-root[data-preset="archive"] .hf-up-card.is-hero {
  border: 2px solid #111318;
  box-shadow: 3px 3px 0 #2455e7;
}
.hf-up-root[data-preset="archive"] .hf-up-card-lbl { color: #5a606b; }
.hf-up-root[data-preset="archive"] .hf-up-card-mark { width: 7px; height: 7px; border-radius: 50%; background: #2455e7; }
.hf-up-root[data-preset="archive"] .hf-up-card.is-hero .hf-up-card-mark { background: #ff5526; }
.hf-up-root[data-preset="archive"] .hf-up-card-val { color: #111318; }
.hf-up-root[data-preset="archive"] .hf-up-card-sub { color: #6c7380; }
.hf-up-root[data-preset="archive"] .hf-up-heatbox { background: #ffffff; border: 1.5px solid #d7dbd5; border-radius: 12px; }
.hf-up-root[data-preset="archive"] .hf-up-hm.lv-0 { background: #ebedea; }
.hf-up-root[data-preset="archive"] .hf-up-hm.lv-1 { background: #bfd0ff; }
.hf-up-root[data-preset="archive"] .hf-up-hm.lv-2 { background: #7ea2ff; }
.hf-up-root[data-preset="archive"] .hf-up-hm.lv-3 { background: #3b6cf5; }
.hf-up-root[data-preset="archive"] .hf-up-hm.lv-4 { background: #ff5526; }
.hf-up-root[data-preset="archive"] .hf-up-share-track,
.hf-up-root[data-preset="archive"] .hf-up-qtrack { background: #dce1ec; box-shadow: inset 0 1px 2px rgba(15, 24, 60, 0.16); border-radius: 999px; }
.hf-up-root[data-preset="archive"] .hf-up-share-fill,
.hf-up-root[data-preset="archive"] .hf-up-qfill { background: linear-gradient(90deg, #1b44c8, #2455e7, #4a78ff); border-radius: 999px; }
.hf-up-root[data-preset="archive"] .hf-up-qfill.is-hot { background: #ff4726; }
.hf-up-root[data-preset="archive"] .hf-up-qbadge { background: #e6ecff; color: #1b44c8; }
.hf-up-root[data-preset="archive"] .hf-up-heatfoot { color: #68707d; }
.hf-up-root[data-preset="archive"] .hf-up-footer { color: #242830; }
.hf-up-root[data-preset="archive"] .hf-up-src { color: #666e7a; }

/* ==================== MOBILE RESPONSIVE ADAPTATION ==================== */
@media (max-width: 767px) {
  .hf-up-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 5px;
    padding: 7px 9px 7px 11px;
  }
  .hf-up-bar-top-mob {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    min-width: 0;
  }
  .hf-up-bar-main {
    gap: 6px;
    min-width: 0;
    overflow: hidden;
  }
  .hf-up-logo {
    height: 15px;
  }
  .hf-up-period-tag {
    padding: 1.5px 5.5px;
    font-size: 10.5px;
  }
  .hf-up-bar-right {
    gap: 4px;
    flex: none;
  }
  .hf-up-dots {
    gap: 2px;
    padding: 2px 4px;
  }
  .hf-up-dot-btn {
    width: 20px;
    height: 20px;
    padding: 2px;
  }
  .hf-up-dot-btn svg {
    width: 12px;
    height: 12px;
  }
  .hf-up-expand-btn {
    padding: 4px 8px;
    font-size: 11px;
    gap: 3px;
  }
  .hf-up-bar-metrics {
    flex-wrap: nowrap;
    overflow: hidden;
    font-size: 11px;
    gap: 5px;
  }
  .hf-up-inner {
    padding: 10px 11px 9px;
  }
  .hf-up-root[data-preset="archive"] .hf-up-panel {
    padding: 5px;
    border-radius: 18px;
  }
  .hf-up-header {
    gap: 6px;
    margin-bottom: 8px;
  }
  .hf-up-tab {
    padding: 4px 8px;
    font-size: 11px;
  }
  .hf-up-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
  .hf-up-card {
    padding: 7px 9.5px;
  }
  .hf-up-card-val {
    font-size: 16.5px;
  }
  .hf-up-card-val.is-model {
    font-size: 14px;
  }
  .hf-up-select {
    max-width: 130px;
    font-size: 10.5px;
    padding: 3.5px 8px;
  }
  .hf-up-range {
    padding: 2.5px 7px;
    font-size: 10.5px;
  }
  .hf-up-heatgrid {
    grid-template-rows: repeat(7, 10px);
    grid-auto-columns: 10px;
    gap: 3px;
  }
  .hf-up-hm {
    width: 10px;
    height: 10px;
  }
  .hf-up-quotas {
    grid-template-columns: 1fr;
  }
  .hf-up-trow {
    grid-template-columns: minmax(90px, 1.5fr) 0.9fr 0.8fr 0.8fr;
    font-size: 11px;
  }
  .hf-up-trow .is-hide-mob {
    display: none;
  }
  .hf-up-footer {
    font-size: 10.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hf-up-panel.is-entering,
  .hf-up-icon-btn.is-spinning span {
    animation: none;
  }
}
`
