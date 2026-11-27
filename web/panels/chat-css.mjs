const ROOT = 'html:is([data-cx-ext-hdd-fairy-theme-dark],[data-cx-ext-hdd-fairy-theme-light])[data-hf-panel-chat="1"]'

export const CHAT_PANEL_CSS = `
${ROOT} {
& [data-conversation-content] { background-color: var(--hf-chat-bg-canvas); }
& [data-content-phase="active"] [class*="_viewArea"]:has([data-chat-flow]) { background: #0c0e12; border-color: var(--hf-chat-border-subtle); }
& [data-content-phase="hero"] [class*="_heroWorkspaceRow"] button[class*="_workspace"] { background: var(--hf-chat-bg-surface); color: var(--hf-chat-text-primary); border: 1px solid var(--hf-chat-accent); border-radius: var(--hf-chat-radius-card); }
& [data-content-phase="hero"][data-hf-usage="expanded"] .hf-usage-mount { margin-bottom: clamp(86px, calc(var(--hf-hdd-w, 760px) * .238), 220px); }
& [data-content-phase="hero"] .hf-hdd-greeting::before { background: var(--hf-chat-accent); box-shadow: 0 0 8px var(--hf-chat-accent); }
& [data-turn-navigation] button[aria-current="true"] { background: transparent !important; }
& [data-turn-navigation] button::before { border-radius: 999px; }
& [data-turn-navigation] button[aria-current="true"]::before { background: var(--hf-chat-accent) !important; opacity: 1 !important; height: 2.5px; border-radius: 999px; box-shadow: 0 0 8px color-mix(in srgb, var(--hf-chat-accent) 55%, transparent); }
& [data-turn-navigation] button[data-neighbor-distance="0"]::before { background: var(--hf-chat-accent) !important; opacity: 1 !important; height: 2.5px; border-radius: 999px; box-shadow: 0 0 9px color-mix(in srgb, var(--hf-chat-accent) 62%, transparent); }
& [data-turn-navigation] button[data-neighbor-distance="1"]::before { background: color-mix(in srgb, var(--hf-chat-accent) 76%, var(--hf-chat-text-muted)) !important; opacity: 0.88 !important; border-radius: 999px; }
& [data-turn-navigation] button[data-neighbor-distance="2"]::before { background: color-mix(in srgb, var(--hf-chat-accent) 44%, var(--hf-chat-text-muted)) !important; opacity: 0.66 !important; border-radius: 999px; }
& [data-turn-navigation] [role="tooltip"][class*="_preview"] { background: var(--hf-chat-bg-surface); color: var(--hf-chat-text-primary); border: 1px solid var(--hf-chat-border-strong); border-left: 3px solid var(--hf-chat-accent); border-radius: 10px 3px 10px 10px; box-shadow: var(--hf-chat-shadow-card); font-family: var(--hf-font-ui); }
& [class*="_widthHandle"][data-dragging] { background: var(--hf-chat-accent); }
& [data-conversation-content] :is([data-chat-flow-kind="user"], [data-chat-flow-kind="steering"]) [class*="_userStack"] > [class*="_bubble"] { background: linear-gradient(135deg, #2b59ec, #2146c7); color: #fff; border-radius: 18px 4px 18px 18px; }
& [data-conversation-content] :is([data-chat-flow-kind="user"], [data-chat-flow-kind="steering"]) [class*="_userStack"] > [class*="_bubble"]::after { background: #2146c7; }
& :is([data-chat-flow-kind="user"], [data-chat-flow-kind="steering"]) :is([class*="_fileCard"], [data-ref-chip]) { background: #173ca8; color: #fff; border: 1px solid #ffffff55; border-radius: 7px 2px 7px 7px; }
& [data-chat-flow-kind^="assistant"]:not([data-chat-group-part="reasoning"]) :is([data-slot="conversation.chat.node"], [data-selection-answer]) > [class*="_root"]::after { content: "FAIRY · III"; display: block; width: max-content; margin: 5px 0 0; color: var(--hf-chat-accent); font: 700 10px var(--hf-font-mono); letter-spacing: .06em; user-select: none; pointer-events: none; }
& [data-chat-flow-kind^="assistant"]:not([data-chat-group-part="reasoning"]) :is([data-slot="conversation.chat.node"], [data-selection-answer]) > [class*="_root"][data-hf-avatar-grouped="1"]::before,
& [data-chat-flow-kind^="assistant"]:not([data-chat-group-part="reasoning"]) :is([data-slot="conversation.chat.node"], [data-selection-answer]) > [class*="_root"][data-hf-avatar-grouped="1"]::after,
& [data-chat-flow-kind^="assistant"]:not([data-chat-group-part="reasoning"]) :is([data-slot="conversation.chat.node"], [data-selection-answer]) > [class*="_root"][data-hf-avatar-grouped="1"] > [class*="_body"]::before,
& [data-chat-flow-kind^="assistant"]:not([data-chat-group-part="reasoning"]) :is([data-slot="conversation.chat.node"], [data-selection-answer]) > [class*="_root"][data-hf-avatar-grouped="1"] > .hf-chat-eye-mount { content: none !important; display: none !important; }
& [data-chat-flow-kind^="assistant"]:not([data-chat-group-part="reasoning"]) :is([data-slot="conversation.chat.node"], [data-selection-answer]) > [class*="_root"][data-hf-live-eye="1"]::before { content: none !important; display: none !important; }
& .hf-chat-eye-mount { position: absolute; left: 0; top: 0; width: 34px; height: 34px; border-radius: 50%; pointer-events: none; z-index: 2; display: grid; place-items: center; }
& .hf-chat-eye { position: relative; width: 34px; height: 34px; filter: drop-shadow(0 0 6px rgba(72, 134, 255, 0.48)); }
& .hf-chat-eye-halo { position: absolute; inset: 4%; border-radius: 50%; z-index: 1; pointer-events: none; background: radial-gradient(closest-side, rgba(84, 152, 255, 0.34), rgba(45, 86, 230, 0.12) 60%, transparent 82%); animation: hf-halo-pulse 4.8s ease-in-out infinite; }
& .hf-chat-eye-scan { position: absolute; inset: 6%; border-radius: 50%; overflow: hidden; z-index: 3; pointer-events: none; opacity: 0.22; transition: opacity 220ms ease; }
& .hf-chat-eye-scan::before { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 42%, rgba(214, 236, 255, 0.52) 50%, transparent 58%); mix-blend-mode: screen; animation: hf-scan-move 2.4s linear infinite; }
& .hf-chat-eye[data-mood="working"] .hf-chat-eye-scan { opacity: 0.92; }
& .hf-chat-eye[data-mood="working"] .hf-chat-eye-scan::before { animation-duration: 1.3s; }
& [data-chat-flow]:not([data-step-process-content]) > :is([data-chat-flow-kind="user"], [data-chat-flow-kind="steering"]) { padding-inline-end: 6px; box-sizing: border-box; }
& [data-chat-flow-kind^="assistant"]:not([data-chat-group-part="reasoning"]) :is([data-slot="conversation.chat.node"], [data-selection-answer]) > [class*="_root"] > [class*="_body"] { --dsw-alias-label-primary: #1e2026; background: #f4f3ef; color: #1e2026; border-radius: 14px 4px 14px 14px; }
& [data-chat-flow-kind^="assistant"]:not([data-chat-group-part="reasoning"]) :is([data-slot="conversation.chat.node"], [data-selection-answer]) > [class*="_root"] > [class*="_body"]::before { background: #f4f3ef; }
& [data-chat-flow-kind^="assistant"] :is(.md-code-block, [data-diff]) {
  --dsl-code-block-background: #111318; --dsl-code-block-banner-background-color: #181b22;
  --dsw-alias-label-primary: #e6edf3; --dsw-alias-label-secondary: #a6afbd; --dsw-alias-label-tertiary: #858e9f;
  --dsw-alias-bg-base: #111318; --dsw-alias-bg-layer-1: #181b22; --dsw-alias-border-l1: #2b313e;
  --dsw-alias-interactive-bg-hover: #1c202a;
  --dsw-alias-markdown-code-block: #111318; --dsw-alias-markdown-code-block-banner: #181b22;
  --shiki-foreground: #e6edf3; --shiki-background: #111318; --shiki-token-constant: #79c0ff;
  --shiki-token-string: #a5d6a7; --shiki-token-comment: #8b949e; --shiki-token-keyword: #ff7b9c;
  --shiki-token-parameter: #ffa657; --shiki-token-function: #d2a8ff; --shiki-token-string-expression: #a5d6a7;
  --shiki-token-punctuation: #c9d1d9; --shiki-token-link: #79c0ff;
  background: #111318; color: #e6edf3; color-scheme: dark; border: 1px solid #333a48; border-radius: 10px 3px 10px 10px;
}
& [data-chat-flow-kind^="assistant"] .md-code-block [class*="_bannerWrap"] { background: #181b22; border-top-left-radius: 9px; border-top-right-radius: 2px; }
& [data-chat-flow-kind^="assistant"] [data-code-block-banner] { background: #181b22; color: #b8c2d0; border-top-left-radius: 9px; border-top-right-radius: 2px; }
& [data-chat-flow-kind^="assistant"] :is([data-code-block-content], pre.shiki) { background: #111318; color: #e6edf3; }
& [data-chat-flow-kind^="assistant"] .md-code-block[class*="_foldable"] pre { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
& [data-chat-flow-kind^="assistant"] .md-code-block :is([class*="_foldBar"], [data-code-block-controls]) { background: #111318; border-top: 1px solid #2b313e; border-bottom-left-radius: 9px; border-bottom-right-radius: 9px; }
& [data-chat-flow-kind^="assistant"] .md-code-block [class*="_foldFade"]::before { background: linear-gradient(to bottom, rgba(17, 19, 24, 0), #111318 92%); }
& [data-chat-flow-kind^="assistant"] .md-code-block :is([class*="_foldButton"], [data-code-fold-toggle]) { background: transparent; color: #b8c2d0; font-family: var(--hf-font-ui); font-weight: 700; }
& [data-chat-flow-kind^="assistant"] .md-code-block :is([class*="_foldButton"], [data-code-fold-toggle]):is(:hover, :focus-visible) { background: #1c202a; color: var(--hf-chat-accent); }
& [data-chat-flow-kind^="assistant"] .md-code-block [class*="_foldIcon"] { color: currentColor; }
& [data-diff-row="add"] { background: rgba(62,240,176,.11); box-shadow: inset 3px 0 #3ef0b0; color: #7bf7c8; }
& [data-diff-row="del"] { background: rgba(255,93,122,.12); box-shadow: inset 3px 0 #ff5d7a; color: #ff94a6; }
& :is(button[data-turn-process], [data-process-activity]) { color: var(--hf-chat-text-muted); border-bottom: 1px solid var(--hf-chat-border-subtle); }
& [data-step-process-body], & [data-subcalls] { border-left: 1px solid var(--hf-chat-accent); }
& [data-variant="think"] { color: #c3c8d2; border-left: 2px solid var(--hf-chat-accent); }
& [data-variant="think"] [data-disclosure-row] { background: #171920; border-radius: 8px 3px 8px 8px; }
& [data-variant="think"] [class*="_thinkBody"] { background: #111319; border-left: 1px dashed var(--hf-chat-accent); color: #b5bdca; }
& [data-tool][data-state], & [data-sample="bash"][data-state] { --hf-tool-state: #8992a2; color: #d5d8e0; }
& :is([data-tool][data-state], [data-sample="bash"][data-state]) [data-disclosure-row] { min-height: 30px; background: #171920; border: 1px solid #30323a; border-radius: 10px 3px 10px 10px; box-shadow: inset 3px 0 var(--hf-tool-state); }
& [data-sample="bash"][data-state] { min-height: 30px; background: #171920; border: 1px solid #30323a; border-radius: 10px 3px 10px 10px; box-shadow: inset 3px 0 var(--hf-tool-state); }
& :is([data-tool][data-state="running"], [data-sample="bash"][data-state="running"]) { --hf-tool-state: var(--hf-chat-accent); }
& :is([data-tool][data-state="ok"], [data-sample="bash"][data-state="ok"]) { --hf-tool-state: #3ef0b0; }
& :is([data-tool][data-state="error"], [data-sample="bash"][data-state="error"]) { --hf-tool-state: #ff5d7a; }
& :is([data-tool][data-state="stopped"], [data-sample="bash"][data-state="stopped"]) { --hf-tool-state: #8992a2; }
& :is([data-terminal], [data-read], [data-search], [data-inspect], [data-tool] [data-diff], [class*="_ioCard"]) { background: #0e1015; color: #d5d8e0; border: 1px solid #303540; border-radius: 8px 3px 8px 8px; }
& [data-terminal] [data-body] { max-height: 224px; overflow: auto; }
& [class*="_ioCard"] [class*="_ioSection"] { max-height: 150px; overflow: auto; }
& [data-tool="todo_write"] [data-disclosure-row], & section[data-testid="todo-panel"] { border-color: var(--hf-chat-accent); box-shadow: inset 3px 0 var(--hf-chat-accent); }
& section[data-testid="todo-panel"] { background: #15171e; color: #f4f1e8; border: 1px solid #33312b; border-radius: var(--hf-chat-radius-card); }
& section[data-testid="todo-panel"] ul[class*="_list"] { max-height: 180px; overflow-y: auto; }
& section[data-testid="todo-panel"] [data-status="completed"] { color: #858b99; }
& section[data-testid="todo-panel"] [data-status="in_progress"] { color: #fff; background: #f8cb2917; box-shadow: inset 3px 0 var(--hf-chat-accent); font-weight: 700; }
& section[data-testid="todo-panel"] [data-status="pending"] { color: #9ea4b3; }
& [data-plan-artifacts] > button[data-plan-card] { min-height: 64px; background: linear-gradient(135deg,#1b1c22,#131419); color: #f5f2e9; border: 1px solid var(--hf-chat-accent); border-left: 4px solid var(--hf-chat-accent); border-radius: var(--hf-chat-radius-card); }
& :is([data-tool="subagent"], [data-tool="spawn_teammate"], [data-tool="wait_agent"], [data-tool="send_message"], [data-tool="list_agents"], [data-tool="interrupt_agent"]) { --hf-subagent: #7c9bff; }
& :is([data-tool="subagent"], [data-tool="spawn_teammate"], [data-tool="wait_agent"], [data-tool="send_message"], [data-tool="list_agents"], [data-tool="interrupt_agent"]) [data-disclosure-row] { min-height: 34px; border-color: var(--hf-subagent); box-shadow: inset 3px 0 var(--hf-subagent); }
& :is([data-chat-running], [class*="_toBottomSlot"] > button[class*="_toBottom"]) { color: var(--hf-chat-accent); }
& section[data-turn-changes] { background: #15171e; border: 1px solid var(--hf-chat-border-subtle); border-radius: var(--hf-chat-radius-card); }
/* DropOverlay */
& body > div[role="status"][class*="_mask"]:has(> div[class*="_wrap"] > div[class*="_illustration"]) { background: rgba(8, 10, 14, .82); backdrop-filter: blur(10px); }
& body > div[role="status"][class*="_mask"]:has(> div[class*="_wrap"] > div[class*="_illustration"]) > div[class*="_wrap"] { box-sizing: border-box; width: min(460px, calc(100vw - 32px)); padding: 34px 28px; background: var(--hf-chat-hazard-stripe) top / 100% 4px no-repeat, var(--hf-chat-bg-surface); border: 2px dashed var(--hf-chat-accent); border-radius: var(--hf-chat-radius-panel); box-shadow: var(--hf-chat-shadow-card), 0 0 30px color-mix(in srgb, var(--hf-chat-accent) 22%, transparent); color: var(--hf-chat-text-primary); font-family: var(--hf-font-ui); }
& body > div[role="status"][class*="_mask"] > div[class*="_wrap"] div[class*="_title"] { color: var(--hf-chat-text-primary); font-weight: 800; }
& body > div[role="status"][class*="_mask"] > div[class*="_wrap"] div[class*="_desc"] { color: var(--hf-chat-text-muted); }
/* HandoffModal */
& [class*="_root"]:has(> [role="dialog"] [data-handoff-modal]) > [class*="_mask"]::after { background: #040508b8; }
& [role="dialog"]:has([data-handoff-modal]) { position: relative; overflow: hidden; background: var(--hf-chat-bg-shell); color: var(--hf-chat-text-primary); border: 2px solid var(--hf-chat-border-strong); border-radius: var(--hf-chat-radius-panel); box-shadow: var(--hf-chat-shadow-card); font-family: var(--hf-font-ui); }
& [role="dialog"]:has([data-handoff-modal])::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; z-index: 2; pointer-events: none; background: var(--hf-chat-hazard-stripe); }
& [role="dialog"]:has([data-handoff-modal]) div[class*="_header"] { border-bottom: 1px solid var(--hf-chat-border-subtle); }
& [role="dialog"]:has([data-handoff-modal]) h2[class*="_title"] { color: var(--hf-chat-text-primary); font-weight: 800; }
& [role="dialog"]:has([data-handoff-modal]) p[class*="_description"] { color: var(--hf-chat-text-muted); }
& [role="dialog"]:has([data-handoff-modal]) button[class*="_close"] { border: 1.5px solid var(--hf-chat-border-strong); border-radius: 8px 3px 8px 8px; background: var(--hf-chat-bg-elevated); color: var(--hf-chat-text-primary); }
& [role="dialog"]:has([data-handoff-modal]) button[class*="_close"]:hover { border-color: var(--hf-chat-danger); color: var(--hf-chat-danger); }
& [data-handoff-modal] span[class*="_sectionLabel"] { color: var(--hf-chat-text-muted); font-weight: 700; }
& [data-handoff-modal] button[class*="_harnessOption"] { background: var(--hf-chat-bg-recessed); border: 1.5px solid var(--hf-chat-border-subtle); border-radius: 10px 3px 10px 10px; color: var(--hf-chat-text-primary); }
& [data-handoff-modal] button[class*="_harnessOption"]:hover:not(:disabled) { background: var(--hf-chat-bg-elevated); border-color: var(--hf-chat-border-strong); }
& [data-handoff-modal] button[class*="_harnessOption"][data-selected] { border-color: var(--hf-chat-accent); background: color-mix(in srgb, var(--hf-chat-accent) 14%, var(--hf-chat-bg-elevated)); box-shadow: inset 3px 0 var(--hf-chat-accent); }
& [data-handoff-modal] span[class*="_searchInput"] { background: var(--hf-chat-bg-recessed); border: 1.5px solid var(--hf-chat-border-strong); border-radius: 8px 3px 8px 8px; }
& [data-handoff-modal] span[class*="_searchInput"]:focus-within { border-color: var(--hf-chat-accent); }
& [data-handoff-modal] span[class*="_searchInput"] input { color: var(--hf-chat-text-primary); }
& [data-handoff-modal] div[class*="_modelList"] { background: var(--hf-chat-bg-recessed); border: 1.5px solid var(--hf-chat-border-subtle); border-radius: 10px; }
& [data-handoff-modal] button[class*="_modelOption"] { color: var(--hf-chat-text-primary); border-radius: 7px 2px 7px 7px; }
& [data-handoff-modal] button[class*="_modelOption"]:hover:not(:disabled) { background: var(--hf-chat-bg-elevated); }
& [data-handoff-modal] button[class*="_modelOption"][data-selected] { background: var(--hf-chat-bg-elevated); box-shadow: inset 3px 0 var(--hf-chat-accent), inset 0 0 0 1px var(--hf-chat-accent); }
& [data-handoff-modal] span[class*="_defaultBadge"] { background: var(--hf-chat-accent-fill); color: var(--hf-chat-accent-contrast); font-weight: 700; }
& [data-handoff-modal] [class*="_checkIcon"] { color: var(--hf-chat-accent); }
& [data-handoff-modal] div[class*="_errorBox"] { border: 1.5px solid var(--hf-chat-danger); background: color-mix(in srgb, var(--hf-chat-danger) 10%, var(--hf-chat-bg-recessed)); color: var(--hf-chat-danger); }
& [role="dialog"]:has([data-handoff-modal]) div[class*="_footer"] button[class*="_outline"] { border: 1.5px solid var(--hf-chat-border-strong); border-radius: 8px 3px 8px 8px; background: var(--hf-chat-bg-elevated); color: var(--hf-chat-text-primary); font-weight: 600; }
& [role="dialog"]:has([data-handoff-modal]) div[class*="_footer"] button[class*="_primary"] { border: 1px solid var(--hf-chat-accent); border-radius: 8px 3px 8px 8px; background: var(--hf-chat-accent-fill); color: var(--hf-chat-accent-contrast); font-weight: 700; }
/* CompactionCommandCard (CompactionItem + GenericCommandCard + compact_context tool card) — H.D.D tactical receipt bar */
& div[class*="_compactionRow"] { --dsh-compaction-header-height: 38px; padding: 3px 0; }
& div[class*="_compactionRow"] button[class*="_compactionButton"],
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row] { box-sizing: border-box; height: auto; min-height: 36px; padding: 7px 12px 7px 14px; background: linear-gradient(160deg, var(--hf-chat-bg-elevated), var(--hf-chat-bg-surface)); border: 1.5px solid var(--hf-chat-border-strong); border-left: 3.5px solid var(--hf-chat-accent); border-radius: 10px 3px 10px 10px; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.06); color: var(--hf-chat-text-primary); font-family: var(--hf-font-ui); transition: border-color 140ms ease, background 140ms ease, color 140ms ease; }
& div[class*="_compactionRow"] button[class*="_compactionButton"]:not(:disabled):hover,
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row][data-expandable]:hover { border-color: var(--hf-chat-accent); color: var(--hf-chat-text-primary); background: linear-gradient(160deg, color-mix(in srgb, var(--hf-chat-accent) 10%, var(--hf-chat-bg-elevated)), var(--hf-chat-bg-surface)); }
& div[class*="_compactionRow"]:has(div[class*="_compactionBody"]) button[class*="_compactionButton"] { background: var(--hf-chat-bg-elevated); border-radius: 10px 3px 0 0; border-bottom-color: var(--hf-chat-accent); }
& div[class*="_compactionRow"] span[class*="_compactionLeading"],
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row] [class*="_leading"] { margin-right: 9px; color: var(--hf-chat-accent); filter: drop-shadow(0 0 6px color-mix(in srgb, var(--hf-chat-accent) 44%, transparent)); }
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row] > :not([class*="_leading"]) { flex: 1 1 auto; min-width: 0; }
& div[class*="_compactionRow"] span[class*="_compactionTitle"],
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row] [class*="_title"] { color: var(--hf-chat-text-primary); font-family: var(--hf-font-mono); font-weight: 800; letter-spacing: 0.02em; }
& div[class*="_compactionRow"] span[class*="_compactionSep"],
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row] [class*="_separator"] { width: 4px; height: 4px; margin: 0 9px; border-radius: 1px; background: var(--hf-chat-accent); opacity: 0.85; }
& div[class*="_compactionRow"] span[class*="_compactionSummary"],
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row] [class*="_summary"] { color: color-mix(in srgb, var(--hf-chat-text-primary) 88%, var(--hf-chat-text-muted)); font-weight: 600; }
& div[class*="_compactionRow"] button[class*="_compactionButton"]::after,
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row]::after { flex: none; margin-left: 10px; padding: 1px 7px; border: 1px solid color-mix(in srgb, var(--hf-chat-accent) 44%, transparent); border-radius: 5px 2px 5px 5px; background: color-mix(in srgb, var(--hf-chat-accent) 13%, var(--hf-chat-bg-recessed)); color: var(--hf-chat-accent); font: 700 10px/16px var(--hf-font-mono); letter-spacing: 0.05em; white-space: nowrap; }
& div[class*="_compactionRow"] button[class*="_compactionButton"]::after,
& div[data-tool="compact_context"][data-state="ok"] [data-disclosure-row]::after { content: "CTX · COMPACT"; }
& div[data-command][data-state="ok"] [data-disclosure-row]::after { content: "SYNC · OK"; }
& :is(div[data-command][data-state="running"], div[data-tool="compact_context"][data-state="running"]) [data-disclosure-row]::after { content: "EXEC · LIVE"; }
& :is(div[data-command][data-state="error"], div[data-tool="compact_context"][data-state="error"]) [data-disclosure-row] { border-color: color-mix(in srgb, var(--hf-chat-danger) 48%, var(--hf-chat-border-strong)); border-left-color: var(--hf-chat-danger); }
& :is(div[data-command][data-state="error"], div[data-tool="compact_context"][data-state="error"]) [data-disclosure-row] [class*="_leading"] { color: var(--hf-chat-danger); filter: drop-shadow(0 0 6px color-mix(in srgb, var(--hf-chat-danger) 44%, transparent)); }
& :is(div[data-command][data-state="error"], div[data-tool="compact_context"][data-state="error"]) [data-disclosure-row] [class*="_separator"] { background: var(--hf-chat-danger); }
& :is(div[data-command][data-state="error"], div[data-tool="compact_context"][data-state="error"]) [data-disclosure-row] [class*="_summary"] { color: var(--hf-chat-danger); }
& :is(div[data-command][data-state="error"], div[data-tool="compact_context"][data-state="error"]) [data-disclosure-row]::after { content: "ERR · HALT"; border-color: color-mix(in srgb, var(--hf-chat-danger) 50%, transparent); background: color-mix(in srgb, var(--hf-chat-danger) 14%, var(--hf-chat-bg-recessed)); color: var(--hf-chat-danger); }
& div[class*="_compactionRow"] div[class*="_compactionBody"] { margin-top: 6px; padding: 10px 14px; background: var(--hf-chat-bg-recessed); border: 1px solid var(--hf-chat-border-subtle); border-left: 2.5px dashed var(--hf-chat-accent); border-radius: 8px 3px 8px 8px; color: var(--hf-chat-text-primary); }
& div[data-command][data-state] pre[class*="_body"] { margin-top: 6px; background: #0e1015; border: 1px solid #303540; border-left: 2.5px solid var(--hf-chat-accent); border-radius: 8px 3px 8px 8px; color: #e2e7f0; font-family: var(--hf-font-mono); }
& div[data-command][data-state="error"] pre[class*="_body"] { border-left-color: var(--hf-chat-danger); }
/* SelectionCommentCard */
& div[role="dialog"][data-selection-actions][class*="_card"] { background: var(--hf-chat-bg-surface); color: var(--hf-chat-text-primary); border: 1.5px solid var(--hf-chat-accent); border-radius: var(--hf-chat-radius-card); box-shadow: var(--hf-chat-shadow-card); font-family: var(--hf-font-ui); }
& div[role="dialog"][data-selection-actions][class*="_card"] blockquote[class*="_excerpt"] { border-left: 2.5px solid var(--hf-chat-accent); color: var(--hf-chat-text-muted); }
& div[role="dialog"][data-selection-actions][class*="_card"] button[class*="_close"] { color: var(--hf-chat-text-muted); }
& div[role="dialog"][data-selection-actions][class*="_card"] button[class*="_close"]:hover { background: var(--hf-chat-bg-elevated); color: var(--hf-chat-danger); }
& div[role="dialog"][data-selection-actions][class*="_card"] textarea[class*="_field"] { color: var(--hf-chat-text-primary); caret-color: var(--hf-chat-accent); }
& div[role="dialog"][data-selection-actions][class*="_card"] button[class*="_submit"] { border: 1px solid var(--hf-chat-accent); border-radius: 8px 3px 8px 8px; background: var(--hf-chat-accent-fill); color: var(--hf-chat-accent-contrast); font-weight: 700; }
& [data-selection-actions] button[class*="_submit"] kbd { display: none !important; }
& div[role="dialog"][data-selection-actions][class*="_card"] div[class*="_error"] { color: var(--hf-chat-danger); }
/* ThreadWatchNotice (tactical receipt capsule) */
& [data-thread-watch-notice] { padding: 10px 14px 10px 15px; border: 1.5px solid var(--hf-chat-border-strong); border-left: 3.5px solid var(--hf-chat-accent); border-radius: 13px 4px 13px 13px; background: linear-gradient(160deg, var(--hf-chat-bg-elevated), var(--hf-chat-bg-surface)); color: var(--hf-chat-text-primary); box-shadow: 0 6px 18px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.06); font-family: var(--hf-font-ui); }
& [data-thread-watch-notice] [class*="_bell"] { color: var(--hf-chat-accent); filter: drop-shadow(0 0 6px color-mix(in srgb, var(--hf-chat-accent) 45%, transparent)); }
& [data-thread-watch-notice] [data-thread-watch-entry] + [data-thread-watch-entry] { padding-top: 8px; border-top: 1px solid var(--hf-chat-border-subtle); }
& [data-thread-watch-notice] [class*="_title"] { color: var(--hf-chat-text-primary); font-weight: 700; }
& [data-thread-watch-notice] [data-outcome] { display: inline-flex; align-items: center; padding: 1px 8px; border: 1px solid var(--hf-chat-border-strong); border-radius: 6px 2px 6px 6px; background: var(--hf-chat-bg-recessed); color: var(--hf-chat-text-muted); font-size: 11px; font-weight: 800; line-height: 18px; letter-spacing: 0.02em; }
& [data-thread-watch-notice] [data-outcome="completed"] { background: rgba(62, 240, 176, 0.14); border-color: rgba(62, 240, 176, 0.48); color: #3ef0b0; }
& [data-thread-watch-notice] :is([data-outcome="failed"], [data-outcome="interrupted"], [data-outcome="error"], [data-outcome="cancelled"]) { background: rgba(255, 93, 122, 0.15); border-color: rgba(255, 93, 122, 0.5); color: #ff7a92; }
& [data-thread-watch-notice] :is([data-outcome="timedOut"], [data-outcome="timeout"], [data-outcome="waiting"]) { background: rgba(248, 203, 41, 0.16); border-color: rgba(248, 203, 41, 0.52); color: #f8cb29; }
& [data-thread-watch-notice] [class*="_open"] a { display: inline-flex; align-items: center; padding: 2px 10px; border: 1px solid var(--hf-chat-accent); border-radius: 7px 2px 7px 7px; background: var(--hf-chat-accent-fill); color: var(--hf-chat-accent-contrast); font-size: 11.5px; font-weight: 800; line-height: 18px; text-decoration: none; box-shadow: var(--hf-chat-shadow-key); transition: filter 140ms ease, transform 120ms ease; }
& [data-thread-watch-notice] [class*="_open"] a:hover { text-decoration: none; filter: brightness(1.07); }
& [data-thread-watch-notice] [class*="_open"] a:active { transform: translateY(1px); }
& [data-thread-watch-notice] [class*="_note"] { color: var(--hf-chat-text-muted); }
/* SessionWatchingNotice (v0.28.1 conversation header watching strip; preserves mobile top margin) */
& [data-session-watching-notice] { border-bottom: 1px solid color-mix(in srgb, var(--hf-chat-accent) 34%, var(--hf-chat-border-subtle)); background: linear-gradient(90deg, color-mix(in srgb, var(--hf-chat-accent) 13%, #14151a), #121318 68%); color: var(--hf-chat-text-primary); font-family: var(--hf-font-ui); }
& [data-session-watching-notice] [data-session-watching-badge] { border: 1px solid color-mix(in srgb, var(--hf-chat-accent) 52%, transparent); border-radius: 6px 2px 6px 6px; background: color-mix(in srgb, var(--hf-chat-accent) 16%, #141418); color: var(--hf-chat-accent); font-family: var(--hf-font-mono); font-weight: 800; letter-spacing: 0.03em; }
& [data-session-watching-notice] [data-session-watching-badge] [class*="_dot"] { background: var(--hf-chat-accent); box-shadow: 0 0 7px color-mix(in srgb, var(--hf-chat-accent) 72%, transparent); }
& [data-session-watching-notice] [class*="_detail"] { color: color-mix(in srgb, var(--hf-chat-text-primary) 86%, var(--hf-chat-text-muted)); font-weight: 600; }
/* ApprovalReviewPanel (ApprovalCard) */
& [data-approval-key] > section[class*="_card"] { position: relative; background: #16181f; color: #f4f1e8; border: 2px solid var(--hf-chat-accent); border-radius: var(--hf-chat-radius-panel); box-shadow: var(--hf-chat-shadow-card); font-family: var(--hf-font-ui); }
& [data-approval-key] > section[class*="_card"]::before { content: ""; display: block; height: 4px; background: var(--hf-chat-hazard-stripe); }
& [data-approval-key] div[class*="_eyebrow"] { color: var(--hf-chat-accent); font-family: var(--hf-font-mono); font-weight: 800; letter-spacing: .04em; }
& [data-approval-key] span[class*="_categoryIcon"] { color: var(--hf-chat-accent); }
& [data-approval-key] div[class*="_headline"] { color: #f5f2e9; font-weight: 700; }
& [data-approval-key] :is(div[class*="_codeSurface"], div[class*="_diffSurface"]) { background: #0c0e13; border: 1px solid #2e323d; border-left: 3px solid var(--hf-chat-accent); border-radius: 10px 3px 10px 10px; box-shadow: none; }
& [data-approval-key] div[class*="_diffTopBar"] { background: #14171f; border-bottom-color: #2b2f3a; }
& [data-approval-key] pre[class*="_codeText"] { color: #e4eaf4; font-family: var(--hf-font-mono); }
& [data-approval-key] div[class*="_faded"]::after { background: linear-gradient(to bottom, transparent, #0c0e13 92%); }
& [data-approval-key] div[class*="_diffAdd"] { background: rgba(62, 240, 176, .11); box-shadow: inset 3px 0 #3ef0b0; color: #b7fce1; }
& [data-approval-key] div[class*="_diffDel"] { background: rgba(255, 93, 122, .12); box-shadow: inset 3px 0 #ff5d7a; color: #ffb3c0; }
& [data-approval-key] button[class*="_expandToggle"] { color: var(--hf-chat-accent); font-weight: 700; }
& [data-approval-key] div[class*="_detailText"] { color: #c2c8d4; }
& [data-approval-key] div[class*="_error"] { color: var(--hf-chat-danger); }
& [data-approval-key] div[class*="_footer"] { border-top: 1px solid #282b34; }
& [data-approval-key] :is(button[class*="_pillOutline"], div[class*="_splitOutline"]) { border: 1.5px solid color-mix(in srgb, var(--hf-chat-danger) 62%, transparent); border-radius: 9px 3px 9px 9px; background: #1d1417; color: #ff8c9e; font-weight: 700; }
& [data-approval-key] :is(button[class*="_pillPrimary"], div[class*="_splitGroup"]:not([class*="_splitOutline"])) { border: 1px solid var(--hf-chat-accent); border-radius: 9px 3px 9px 9px; background: var(--hf-chat-accent-fill); color: var(--hf-chat-accent-contrast); font-weight: 800; }
& [data-approval-key] kbd[class*="_kbd"] { font-family: var(--hf-font-mono); font-weight: 700; border-radius: 4px; }
}
${ROOT}[data-hf-preset-chat="street"] {
& [data-conversation-content] :is([data-chat-flow-kind="user"], [data-chat-flow-kind="steering"]) [class*="_userStack"] > [class*="_bubble"] { box-shadow: 3px 3px 0 #c8ff00; }
& :is([data-tool][data-state], [data-sample="bash"][data-state]) [data-disclosure-row] { border: 2px solid #050507; box-shadow: inset 3px 0 var(--hf-tool-state), 3px 3px 0 #c8ff00; }
& :is([data-tool="subagent"], [data-tool="spawn_teammate"], [data-tool="wait_agent"], [data-tool="send_message"], [data-tool="list_agents"], [data-tool="interrupt_agent"]) { --hf-subagent: #3ef0b0; }
& :is([role="dialog"]:has([data-handoff-modal]), div[role="dialog"][data-selection-actions][class*="_card"], [data-approval-key] > section[class*="_card"]) { border: 2px solid #050507; box-shadow: 5px 5px 0 #c8ff00; }
& [data-thread-watch-notice] { border: 2px solid #050507; border-left: 4px solid #c8ff00; border-radius: 13px 4px 13px 4px; background: #181b22; box-shadow: 4px 4px 0 #c8ff00; }
& [data-session-watching-notice] { border-bottom: 2px solid #050507; background: linear-gradient(90deg, rgba(200, 255, 0, 0.14), #111318 62%); box-shadow: inset 4px 0 #c8ff00; }
& [data-session-watching-notice] [data-session-watching-badge] { border: 1.5px solid #c8ff00; border-radius: 6px 2px 6px 2px; background: #14190d; color: #c8ff00; }
& [data-session-watching-notice] [data-session-watching-badge] [class*="_dot"] { background: #c8ff00; box-shadow: 0 0 8px rgba(200, 255, 0, 0.85); }
& div[class*="_compactionRow"] button[class*="_compactionButton"],
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row] { border: 2px solid #050507; border-left: 4px solid #c8ff00; border-radius: 10px 3px 10px 3px; background: #181b22; box-shadow: 3px 3px 0 #c8ff00; }
& :is(div[data-command][data-state="error"], div[data-tool="compact_context"][data-state="error"]) [data-disclosure-row] { border-left-color: #ff4f5e; box-shadow: 3px 3px 0 #ff4f5e; }
& body > div[role="status"][class*="_mask"]:has(> div[class*="_wrap"] > div[class*="_illustration"]) > div[class*="_wrap"] { box-shadow: 6px 6px 0 #c8ff00; }
}
${ROOT}[data-hf-preset-chat="archive"] {
& [data-thread-watch-notice] { background: linear-gradient(160deg, #ffffff, #f5f8ff); border-color: #cfd7e6; border-left: 3.5px solid #2455e7; color: #14171f; box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08); }
& [data-thread-watch-notice] [class*="_title"] { color: #14171f; }
& [data-thread-watch-notice] [data-outcome="completed"] { background: #e6faf2; border-color: rgba(13, 159, 110, 0.45); color: #047857; }
& [data-thread-watch-notice] :is([data-outcome="failed"], [data-outcome="interrupted"], [data-outcome="error"], [data-outcome="cancelled"]) { background: #fef2f2; border-color: rgba(220, 38, 38, 0.42); color: #b91c1c; }
& [data-thread-watch-notice] :is([data-outcome="timedOut"], [data-outcome="timeout"], [data-outcome="waiting"]) { background: #fef3c7; border-color: rgba(180, 83, 9, 0.4); color: #b45309; }
& [data-thread-watch-notice] [class*="_open"] a { color: #ffffff; }
& [data-thread-watch-notice] [class*="_note"] { color: #475166; }
& [data-session-watching-notice] { border-bottom: 1.5px solid #cfd7e6; background: linear-gradient(90deg, #e8f0ff, #f7f9fc 68%); color: #14171f; box-shadow: inset 3.5px 0 #2455e7; }
& [data-session-watching-notice] [data-session-watching-badge] { border: 1px solid rgba(36, 85, 231, 0.45); background: #2455e7; color: #ffffff; }
& [data-session-watching-notice] [data-session-watching-badge] [class*="_dot"] { background: #ffffff; box-shadow: 0 0 6px rgba(255, 255, 255, 0.72); }
& [data-session-watching-notice] [class*="_detail"] { color: #2a3346; }
& [data-chat-flow-kind^="assistant"] .md-code-block :is([class*="_foldButton"], [data-code-fold-toggle]):is(:hover, :focus-visible) { color: #7ca6ff; }
& [data-content-phase="active"] [class*="_viewArea"]:has([data-chat-flow]) { background: #ffffff; border: 1px solid #d5dce8; box-shadow: 0 2px 14px rgba(15, 23, 42, 0.04); }
& [data-chat-flow-kind^="assistant"]:not([data-chat-group-part="reasoning"]) :is([data-slot="conversation.chat.node"], [data-selection-answer]) > [class*="_root"] > [class*="_body"] { background: #f8fafd; color: #14171f; border: 1.5px solid #2455e7; box-shadow: 0 2px 10px rgba(36, 85, 231, 0.08); }
& [data-chat-flow-kind^="assistant"]:not([data-chat-group-part="reasoning"]) :is([data-slot="conversation.chat.node"], [data-selection-answer]) > [class*="_root"] > [class*="_body"]::before { background: #f8fafd; border-left: 1.5px solid #2455e7; border-bottom: 1.5px solid #2455e7; }
& [data-variant="think"] { color: #334155; }
& [data-variant="think"] [data-disclosure-row] { background: #eef2fa; color: #1e293b; border: 1px solid #cfd7e6; }
& [data-variant="think"] [class*="_thinkBody"] { background: #f7f9fc; color: #334155; }
& [data-tool][data-state], & [data-sample="bash"][data-state] { --hf-tool-state: #64748b; color: #14171f; }
& :is([data-tool][data-state], [data-sample="bash"][data-state]) [data-disclosure-row] { background: #f5f7fb; border-color: #cfd7e6; color: #14171f; }
& [data-sample="bash"][data-state] { background: #f5f7fb; border-color: #cfd7e6; color: #14171f; }
& :is([data-read], [data-search], [data-inspect], [class*="_ioCard"]) { background: #f8fafc; color: #1e293b; border-color: #cfd7e6; }
& section[data-testid="todo-panel"] { background: #ffffff; color: #14171f; border-color: #2455e7; }
& section[data-testid="todo-panel"] [data-status="completed"] { color: #64748b; }
& section[data-testid="todo-panel"] [data-status="in_progress"] { color: #1b44c8; background: rgba(36, 85, 231, 0.09); }
& section[data-testid="todo-panel"] [data-status="pending"] { color: #475569; }
& [data-plan-artifacts] > button[data-plan-card] { background: linear-gradient(135deg, #ffffff, #eef3ff); color: #14171f; }
& section[data-turn-changes] { background: #f7f9fc; color: #14171f; border-color: #cfd7e6; }
& .hf-chat-eye { filter: drop-shadow(0 0 5px rgba(36, 85, 231, 0.34)); }
& div[class*="_compactionRow"] button[class*="_compactionButton"],
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row] { background: linear-gradient(160deg, #ffffff, #f5f8ff); border: 1.5px solid #cfd7e6; border-left: 3.5px solid #2455e7; color: #14171f; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.07); }
& div[class*="_compactionRow"] button[class*="_compactionButton"]:not(:disabled):hover,
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row][data-expandable]:hover { background: linear-gradient(160deg, #ffffff, #e9f0ff); border-color: #2455e7; color: #14171f; }
& div[class*="_compactionRow"]:has(div[class*="_compactionBody"]) button[class*="_compactionButton"] { background: #eef3ff; border-bottom-color: #2455e7; }
& div[class*="_compactionRow"] span[class*="_compactionTitle"],
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row] [class*="_title"] { color: #14171f; }
& div[class*="_compactionRow"] span[class*="_compactionSummary"],
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row] [class*="_summary"] { color: #2a3346; }
& div[class*="_compactionRow"] button[class*="_compactionButton"]::after,
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row]::after { border-color: rgba(36, 85, 231, 0.36); background: #edf2ff; color: #1b44c8; }
& :is(div[data-command][data-state="error"], div[data-tool="compact_context"][data-state="error"]) [data-disclosure-row] { border-color: rgba(220, 38, 38, 0.36); border-left-color: #dc2626; }
& :is(div[data-command][data-state="error"], div[data-tool="compact_context"][data-state="error"]) [data-disclosure-row] [class*="_summary"] { color: #b91c1c; }
& :is(div[data-command][data-state="error"], div[data-tool="compact_context"][data-state="error"]) [data-disclosure-row]::after { border-color: rgba(220, 38, 38, 0.42); background: #fef2f2; color: #b91c1c; }
& div[class*="_compactionRow"] div[class*="_compactionBody"] { background: #f7f9fc; border-color: #cfd7e6; color: #1e293b; }
& :is([data-tool="subagent"], [data-tool="spawn_teammate"], [data-tool="wait_agent"], [data-tool="send_message"], [data-tool="list_agents"], [data-tool="interrupt_agent"]) { --hf-subagent: #2455e7; }
& body > div[role="status"][class*="_mask"]:has(> div[class*="_wrap"] > div[class*="_illustration"]) { background: rgba(243, 245, 249, 0.84); }
& [class*="_root"]:has(> [role="dialog"] [data-handoff-modal]) > [class*="_mask"]::after { background: rgba(15, 23, 42, 0.36); }
& [role="dialog"]:has([data-handoff-modal]) { background: var(--hf-chat-bg-surface); border: 2px solid #2455e7; }
& [data-approval-key] > section[class*="_card"] { background: #ffffff; color: #14171f; border: 2px solid #2455e7; box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16); }
& [data-approval-key] div[class*="_headline"] { color: #14171f; }
& [data-approval-key] div[class*="_detailText"] { color: #475166; }
& [data-approval-key] div[class*="_footer"] { border-top-color: #dce2ee; }
& [data-approval-key] :is(button[class*="_pillOutline"], div[class*="_splitOutline"]) { background: #fef2f2; color: #dc2626; border-color: rgba(220, 38, 38, 0.45); }
}
@media (max-width: 767px) { ${ROOT} {
& [data-content-phase="active"] [class*="_viewArea"]:has([data-chat-flow]) { width: 100%; margin: 0; border: 0; border-radius: 0; }
& [data-chat-flow-kind^="assistant"]:not([data-chat-group-part="reasoning"]) :is([data-slot="conversation.chat.node"], [data-selection-answer]) > [class*="_root"] { padding-inline-start: 0; }
& [data-chat-flow-kind^="assistant"]:not([data-chat-group-part="reasoning"]) :is([data-slot="conversation.chat.node"], [data-selection-answer]) > [class*="_root"]::before,
& .hf-chat-eye-mount { display: none !important; }
& div[class*="_compactionRow"] button[class*="_compactionButton"],
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row] { padding: 7px 10px 7px 12px; }
& div[class*="_compactionRow"] button[class*="_compactionButton"]::after,
& :is(div[data-command][data-state], div[data-tool="compact_context"][data-state]) [data-disclosure-row]::after { margin-left: 6px; padding: 1px 5px; font-size: 9.5px; }
& [data-turn-navigation], & [class*="_widthHandle"] { display: none; }
& :is([data-code-block-content], [data-diff], [data-terminal], [data-read], [data-search]) { overflow-x: auto; overscroll-behavior-x: contain; -webkit-text-size-adjust: 100%; }
& .md-code-block pre { overscroll-behavior-x: contain; -webkit-text-size-adjust: 100%; }
& :is([data-turn-tail], [data-code-block-banner]) button { min-width: 44px; min-height: 44px; }
& [role="dialog"]:has([data-handoff-modal]) { width: 100%; max-width: 100%; box-sizing: border-box; }
& div[role="dialog"][data-selection-actions][class*="_card"] { max-width: calc(100vw - 16px); }
& body > div[role="status"][class*="_mask"]:has(> div[class*="_wrap"] > div[class*="_illustration"]) > div[class*="_wrap"] { padding: 24px 18px; }
} }
@media (prefers-reduced-motion: reduce) { ${ROOT} :is([data-variant="think"], [data-tool][data-state], [data-chat-running], .hf-chat-eye-halo, .hf-chat-eye-scan::before, div[role="dialog"][data-selection-actions][class*="_card"], body > div[role="status"][class*="_mask"]) { animation: none !important; } }
`

