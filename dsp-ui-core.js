/* ============================================================
   DSP SHARED UI CORE  —  v2.0.1
   ============================================================

   USAGE
   ─────

   HTML page:
<script src="https://cdn.jsdelivr.net/gh/serena-helepr/dsp-shared-ui@main/dsp-ui-core.js"></script>

Tampermonkey:
// @require https://cdn.jsdelivr.net/gh/serena-helepr/dsp-shared-ui@main/dsp-ui-core.js

   DESIGN PHILOSOPHY
   ─────────────────
   The core owns:  tokens, component appearance, animations, JS utilities
   Each script owns: widths, grid columns, breakpoints, padding, layout

   COMPONENTS (CSS classes)
   ────────────────────────
   Page       .dsp-page-bg
   Hero       .dsp-hero  .dsp-hero-badge  .dsp-hero-title  .dsp-hero-title-accent
              .dsp-hero-sub  .dsp-hero-meta
   Section    .dsp-section-header  .dsp-section-icon  .dsp-section-title-wrap
              .dsp-section-eyebrow  .dsp-section-title  .dsp-section-line
              .dsp-section-label  (text+rule variant)
   Cards      .dsp-card  .dsp-card-title  .dsp-card-icon
              .dsp-panel  .dsp-panel-fixed
   Records    .dsp-record-item  .dsp-record-label  .dsp-record-val
              .dsp-record-name  .dsp-record-date
              .dsp-record-podium  .dsp-podium-row  .dsp-podium-rank
              .dsp-podium-name  .dsp-podium-val
   Leaderboard .dsp-leaderboard  .dsp-rank-cell  .dsp-rank-num
               .dsp-rank-num.gold/.silver/.bronze  .dsp-driver-name
               .dsp-stat-tag
   Score Ring  .dsp-ring-wrap  .dsp-ring-track  .dsp-ring-fill
               .dsp-ring-center  .dsp-ring-score  .dsp-ring-label
   Metric List .dsp-metric-list  .dsp-metric-row  .dsp-metric-name
               .dsp-metric-name .sub  .dsp-metric-chip
               .dsp-metric-chip.green/.amber/.red/.neutral
   Status      .dsp-status-dot  .ready/.running/.warning/.error
   Progress    .dsp-progress-wrap  .dsp-progress-track  .dsp-progress-fill
               .dsp-progress-fill.active  (shimmer)
   Log         .dsp-log  .dsp-log-entry  .dsp-log-time  .dsp-log-msg
               .dsp-log-msg.success/.warning/.error
   Typography  .dsp-title  .dsp-subtitle  .dsp-muted
               .dsp-font  .dsp-font-display  .dsp-font-mono
   Badge       .dsp-badge
   Button      .dsp-btn  .dsp-btn.primary/.danger/.success
   Input       .dsp-input  .dsp-select  .dsp-textarea
   Chip        .dsp-chip  .dsp-chip.good/.warn/.bad
   Alert       .dsp-alert  .dsp-alert.good/.warning/.danger
   Table       .dsp-table
   Layout      .dsp-row  .dsp-stack  .dsp-grid-2
   Reveal      .dsp-reveal  → .dsp-reveal.visible
   Footer      .dsp-footer  .dsp-footer-logo
   Toast       (JS only — DSP_UI.toast)

   JS UTILITIES
   ────────────
   DSP_UI.injectTheme()          Inject CSS vars + all component classes
   DSP_UI.syncThemeColor()       Sync <meta name="theme-color"> to --bg
   DSP_UI.toast(msg, type)       Bottom-right toast (type: success/warning/danger)
   DSP_UI.createPanel(opts)      Build a fixed .dsp-panel (draggable optional)
   DSP_UI.makeDraggable(box, h)  Make any element draggable by handle
   DSP_UI.scrollReveal(sel)      IntersectionObserver for .dsp-reveal elements
   DSP_UI.ring(score, size)      Build SVG score ring HTML string
   DSP_UI.esc(str)               HTML-escape a string
   DSP_UI.num(val)               Parse float, fallback 0
   DSP_UI.fmt(val, dec)          Format number, '--' if falsy
   DSP_UI.fmtPct(val)            Format as percentage (handles 0–1 or 0–100)
   DSP_UI.fmtDate(str, opts)     Format date string via toLocaleDateString
   DSP_UI.fmtDuration(sec)       Seconds → "Xh Ym"
   ============================================================ */

(function () {
  "use strict";

  if (window.DSP_UI_CORE_LOADED) return;
  window.DSP_UI_CORE_LOADED = true;

  window.DSP_UI = window.DSP_UI || {};

  /* ══════════════════════════════════════════════════════════
     THEME TOKENS
     ══════════════════════════════════════════════════════════ */

  DSP_UI.theme = {
    /* Brand / Accent — Forest Green */
    accent:          "#22c55e",
    accent2:         "#4ade80",
    accentDim:       "#166534",
    accentRgb:       "34, 197, 94",

    /* Page / Surfaces */
    bg:              "#070a0f",
    surface:         "#0b1018",
    surface2:        "#0d141f",
    card:            "#101722",

    /* Text */
    text:            "#e8edf5",
    textSoft:        "#c8d2df",
    textMuted:       "#8b98aa",
    textDim:         "#4a5568",
    textSecondary:   "#a5b0c0",

    /* Borders / Shape */
    border:          "#243044",
    borderSoft:      "rgba(112,132,160,.18)",
    rowBorder:       "rgba(42,44,49,.60)",
    rowBorderSoft:   "rgba(255,255,255,.055)",
    radiusSm:        "8px",
    radiusMd:        "12px",
    radiusLg:        "16px",

    /* Shadows */
    shadow:          "0 18px 60px rgba(0,0,0,.35)",
    shadowCard:      "0 10px 32px rgba(0,0,0,.16), inset 0 1px 0 rgba(255,255,255,.035)",
    shadowHover:     "0 16px 42px rgba(0,0,0,.22)",

    /* Status */
    success:         "#22d98a",
    successRgb:      "34, 217, 138",
    warning:         "#ffb020",
    warningRgb:      "255, 176, 32",
    danger:          "#ff4d6a",
    dangerRgb:       "255, 77, 106",

    /* Medal */
    medalGold:       "#22c55e",
    medalSilver:     "#a0aec0",
    medalBronze:     "#c97b4b",

    /* Fonts */
    fontBody:        "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    fontDisplay:     "'Bebas Neue', Impact, sans-serif",
    fontMono:        "'DM Mono', monospace"
  };

  /* ══════════════════════════════════════════════════════════
     INJECT THEME  —  CSS vars + all component classes
     ══════════════════════════════════════════════════════════ */

  DSP_UI.injectTheme = function () {
    if (document.getElementById("dsp-ui-core-theme")) return;

    const t = DSP_UI.theme;
    const style = document.createElement("style");
    style.id = "dsp-ui-core-theme";

    style.textContent = `
/* ── CUSTOM PROPERTIES ──────────────────────────────────────────────── */
:root {
  /* Brand */
  --accent:              ${t.accent};
  --accent-2:            ${t.accent2};
  --accent-dim:          ${t.accentDim};
  --accent-rgb:          ${t.accentRgb};

  /* Surfaces */
  --bg:                  ${t.bg};
  --surface:             ${t.surface};
  --surface-2:           ${t.surface2};
  --card-surface:        ${t.card};
  --card-soft:           rgba(16,23,34,.96);
  --card-shine-top:      rgba(255,255,255,.035);
  --card-shine-bottom:   rgba(255,255,255,.012);

  /* Text */
  --text:                ${t.text};
  --text-soft:           ${t.textSoft};
  --text-muted:          ${t.textMuted};
  --text-dim:            ${t.textDim};
  --text-secondary:      ${t.textSecondary};

  /* Borders */
  --border-main:         ${t.border};
  --border-soft:         ${t.borderSoft};
  --row-border:          ${t.rowBorder};
  --row-border-soft:     ${t.rowBorderSoft};

  /* Shape */
  --radius-sm:           ${t.radiusSm};
  --radius-md:           ${t.radiusMd};
  --radius-lg:           ${t.radiusLg};

  /* Shadows */
  --shadow-lg:           ${t.shadow};
  --shadow-card:         ${t.shadowCard};
  --shadow-hover:        ${t.shadowHover};

  /* Status */
  --success:             ${t.success};
  --success-rgb:         ${t.successRgb};
  --warning:             ${t.warning};
  --warning-rgb:         ${t.warningRgb};
  --danger:              ${t.danger};
  --danger-rgb:          ${t.dangerRgb};

  /* Medals */
  --medal-gold:          ${t.medalGold};
  --medal-silver:        ${t.medalSilver};
  --medal-bronze:        ${t.medalBronze};

  /* Table */
  --table-number:        ${t.textMuted};

  /* Hero effects */
  --hero-glow:           rgba(var(--accent-rgb),.14);
  --hero-glow-soft:      rgba(var(--accent-rgb),.07);
  --grid-line:           rgba(var(--accent-rgb),.026);
  --title-shadow:        0 16px 40px rgba(0,0,0,.35);

  /* Derived accent */
  --accent-bg:           rgba(var(--accent-rgb),.07);
  --accent-bg-strong:    rgba(var(--accent-rgb),.14);
  --accent-bg-hover:     rgba(var(--accent-rgb),.045);
  --accent-bd:           rgba(var(--accent-rgb),.20);
  --accent-bd-strong:    rgba(var(--accent-rgb),.36);
  --accent-glow:         rgba(var(--accent-rgb),.30);
  --accent-glow-soft:    rgba(var(--accent-rgb),.22);
  --accent-glow-strong:  rgba(var(--accent-rgb),.50);
  --accent-ring:         rgba(var(--accent-rgb),.025);

  /* Derived status */
  --success-bg:          rgba(var(--success-rgb),.10);
  --success-bd:          rgba(var(--success-rgb),.28);
  --warning-bg:          rgba(var(--warning-rgb),.10);
  --warning-bd:          rgba(var(--warning-rgb),.28);
  --danger-bg:           rgba(var(--danger-rgb),.10);
  --danger-bd:           rgba(var(--danger-rgb),.28);

  /* Page background */
  --page-bg:
    radial-gradient(circle at 12% -10%, rgba(var(--accent-rgb),.12), transparent 34rem),
    radial-gradient(circle at 90%  8%, rgba(var(--success-rgb),.055), transparent 28rem),
    var(--bg);

  /* ── Backward-compatible aliases ──────────────────────── */
  --black:      var(--bg);
  --dark:       var(--surface);
  --card:       var(--card-surface);
  --card2:      var(--surface-2);
  --border:     var(--border-main);
  --soft-border:var(--border-soft);
  --shadow:     var(--shadow-lg);
  --radius:     var(--radius-md);

  --gold:       var(--accent);
  --gold2:      var(--accent-2);
  --gold-dim:   var(--accent-dim);
  --gold-bg:    var(--accent-bg);
  --gold-bd:    var(--accent-bd);

  --white:      var(--text);
  --muted:      var(--text-muted);

  --green:      var(--success);
  --green-bg:   var(--success-bg);
  --green-bd:   var(--success-bd);
  --amber:      var(--warning);
  --amber-bg:   var(--warning-bg);
  --amber-bd:   var(--warning-bd);
  --red:        var(--danger);
  --red-bg:     var(--danger-bg);
  --red-bd:     var(--danger-bd);
}

/* ── ANIMATIONS ─────────────────────────────────────────────────────── */
@keyframes dsp-fadeUp      { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
@keyframes dsp-nameReveal  { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:none; } }
@keyframes dsp-pulse       { 0%,100% { opacity:1; } 50% { opacity:.45; } }
@keyframes dsp-shimmer     { 0% { transform:translateX(-100%); } 100% { transform:translateX(100%); } }
@keyframes dsp-panelIn     { from { opacity:0; transform:translateY(-10px) scale(.98); } to { opacity:1; transform:translateY(0) scale(1); } }

/* ── GLOBAL RESET (scoped) ──────────────────────────────────────────── */
.dsp-reset, .dsp-reset * { box-sizing: border-box; }

/* ── TYPOGRAPHY ─────────────────────────────────────────────────────── */
.dsp-font         { font-family: ${t.fontBody}; color: var(--text); }
.dsp-font-display { font-family: ${t.fontDisplay}; }
.dsp-font-mono    { font-family: ${t.fontMono}; }

.dsp-title {
  margin: 0; color: var(--text);
  font-family: ${t.fontDisplay};
  font-size: 24px; letter-spacing: .04em; line-height: 1;
}
.dsp-subtitle, .dsp-muted {
  color: var(--text-muted);
  font-family: ${t.fontMono};
  font-size: 11px; letter-spacing: .08em;
}

/* ── PAGE BACKGROUND ────────────────────────────────────────────────── */
.dsp-page-bg {
  background: var(--page-bg);
  color: var(--text);
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
}

/* ── HERO ────────────────────────────────────────────────────────────── */
.dsp-hero {
  position: relative;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center;
  background: linear-gradient(180deg, rgba(13,16,23,.98), rgba(10,13,19,.96)), var(--surface);
  border-bottom: 1px solid var(--border-soft);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}
.dsp-hero::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 80% 55% at 50% 0%, var(--hero-glow) 0%, transparent 68%),
    repeating-linear-gradient(  0deg, transparent, transparent 39px, var(--grid-line) 40px),
    repeating-linear-gradient( 90deg, transparent, transparent 39px, var(--grid-line) 40px);
}
.dsp-hero::after {
  content: ''; position: absolute; left: 50%; bottom: 0;
  width: min(620px, 88vw); height: 2px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, transparent, var(--accent), var(--accent-2), transparent);
  box-shadow: 0 0 24px var(--accent-glow);
}
.dsp-hero-badge {
  position: relative; z-index: 1;
  display: inline-flex; align-items: center; gap: 8px;
  font-family: ${t.fontMono}; font-size: 10px;
  letter-spacing: .20em; text-transform: uppercase;
  color: var(--accent); border: 1px solid var(--accent-bd);
  background: var(--accent-bg-strong);
  padding: 7px 15px; border-radius: 999px;
  box-shadow: 0 0 0 4px var(--accent-ring);
  margin-bottom: 20px;
  animation: dsp-fadeUp .6s ease both;
}
.dsp-hero-title {
  position: relative; z-index: 1;
  font-family: ${t.fontDisplay};
  font-size: clamp(48px, 12vw, 110px);
  line-height: .9; letter-spacing: .025em;
  text-shadow: var(--title-shadow);
  color: var(--text);
  animation: dsp-fadeUp .6s .1s ease both;
}
.dsp-hero-title-accent {
  display: block;
  color: var(--accent);
  text-shadow: 0 0 32px var(--accent-glow-soft);
}
.dsp-hero-name {
  position: relative; z-index: 1;
  font-family: ${t.fontDisplay};
  font-size: clamp(46px, 13vw, 88px);
  line-height: .88; letter-spacing: .02em;
  color: var(--text);
  text-shadow: 0 2px 40px rgba(var(--accent-rgb), .12);
  animation: dsp-nameReveal .7s ease both;
}
.dsp-hero-sub {
  position: relative; z-index: 1;
  margin-top: 16px; font-size: 14px;
  color: var(--text-secondary);
  max-width: 520px; line-height: 1.6;
  animation: dsp-fadeUp .6s .2s ease both;
}
.dsp-hero-meta {
  position: relative; z-index: 1;
  margin-top: 14px; font-family: ${t.fontMono};
  font-size: 10px; letter-spacing: .15em;
  color: var(--text-muted); text-transform: uppercase;
  animation: dsp-fadeUp .6s .25s ease both;
}

/* ── SECTION HEADER (icon + title + rule) ───────────────────────────── */
.dsp-section-header {
  display: flex; align-items: center; gap: 12px;
  margin: 32px 0 12px;
}
.dsp-section-icon {
  width: 32px; height: 32px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: var(--accent);
  background: linear-gradient(180deg, rgba(var(--accent-rgb),.10), rgba(var(--accent-rgb),.04));
  border: 1px solid var(--accent-bd);
  border-radius: var(--radius-md);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.05);
}
.dsp-section-icon svg {
  width: 14px; height: 14px;
  stroke: var(--accent); fill: none;
  stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
}
.dsp-section-title-wrap { flex: 1; min-width: 0; }
.dsp-section-eyebrow {
  font-family: ${t.fontMono}; font-size: 8.5px;
  letter-spacing: .25em; text-transform: uppercase;
  color: var(--accent-dim); margin-bottom: 1px;
}
.dsp-section-title {
  font-family: ${t.fontDisplay};
  font-size: clamp(22px, 5vw, 34px);
  line-height: 1; letter-spacing: .03em; color: var(--text); margin: 0;
}
.dsp-section-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, var(--border-main), transparent);
}
/* Text-only section label (alternate style, no icon) */
.dsp-section-label {
  font-family: ${t.fontMono};
  font-size: 9.5px; letter-spacing: .28em;
  text-transform: uppercase; color: var(--accent-dim);
  margin-bottom: 10px;
  display: flex; align-items: center; gap: 12px;
}
.dsp-section-label::after {
  content: ''; flex: 1; height: 1px;
  background: linear-gradient(90deg, var(--border-main), transparent);
}

/* ── PANELS / CARDS ─────────────────────────────────────────────────── */
.dsp-panel,
.dsp-card {
  background: linear-gradient(180deg, rgba(18,25,38,.96), rgba(12,18,28,.96));
  color: var(--text);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  font-family: ${t.fontBody};
}
.dsp-panel { padding: 14px; }
.dsp-card  { padding: 16px 14px; overflow: hidden; }

.dsp-card-title {
  font-family: ${t.fontDisplay};
  font-size: 17px; letter-spacing: .07em; color: var(--accent);
  margin-bottom: 12px;
  display: flex; align-items: center; gap: 9px;
}
/* Icon button used inside card titles */
.dsp-card-icon {
  width: 24px; height: 24px; flex-shrink: 0;
  background: var(--accent-bg); border: 1px solid var(--accent-bd);
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
}
.dsp-card-icon svg {
  width: 12px; height: 12px;
  stroke: var(--accent); fill: none;
  stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
}

/* Fixed floating panel */
.dsp-panel-fixed {
  position: fixed; right: 16px; bottom: 16px;
  z-index: 999999; width: 340px;
  animation: dsp-panelIn .2s cubic-bezier(.16,1,.3,1);
}

/* ── RECORD CARDS ───────────────────────────────────────────────────── */
.dsp-record-item {
  position: relative;
  background: linear-gradient(180deg, rgba(18,25,38,.96), rgba(12,18,28,.96));
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 16px 14px; min-width: 0;
  transition: box-shadow .15s;
}
.dsp-record-item::before {
  content: ''; position: absolute; inset: 0 0 auto;
  height: 2px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  background: linear-gradient(90deg, var(--accent), transparent);
  opacity: .65;
}
.dsp-record-item:hover { box-shadow: var(--shadow-hover); }
.dsp-record-label {
  font-family: ${t.fontMono}; font-size: 8.5px;
  letter-spacing: .18em; text-transform: uppercase;
  color: var(--text-muted); margin-bottom: 4px; line-height: 1.4;
}
.dsp-record-val {
  font-family: ${t.fontDisplay};
  font-size: clamp(30px, 8vw, 44px);
  color: var(--accent); line-height: 1; margin-bottom: 4px;
  text-shadow: 0 0 24px var(--accent-glow-soft);
}
.dsp-record-name {
  font-size: 13px; font-weight: 700; color: var(--text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.dsp-record-date {
  font-size: 10.5px; color: var(--text-muted);
  font-family: ${t.fontMono}; margin-top: 2px;
}
.dsp-record-podium {
  margin-top: 10px;
  border-top: 1px solid var(--border-soft);
  padding-top: 8px;
  display: flex; flex-direction: column; gap: 5px;
}
.dsp-podium-row   { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.dsp-podium-rank  { font-family: ${t.fontDisplay}; font-size: 14px; color: var(--text-muted); min-width: 14px; text-align: center; }
.dsp-podium-name  { flex: 1; color: var(--text); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dsp-podium-val   { font-family: ${t.fontMono}; font-size: 11px; color: var(--accent); }

/* ── LEADERBOARD TABLE ──────────────────────────────────────────────── */
.dsp-leaderboard { width: 100%; border-collapse: collapse; }
.dsp-leaderboard thead th {
  font-family: ${t.fontMono}; font-size: 9px;
  letter-spacing: .18em; text-transform: uppercase;
  color: var(--text-dim); padding: 8px 10px;
  border-bottom: 1px solid var(--border-main);
  text-align: left; white-space: nowrap; font-weight: 500;
}
.dsp-leaderboard thead th:not(:first-child) { text-align: right; }
.dsp-leaderboard tbody tr {
  border-bottom: 1px solid var(--row-border-soft);
  transition: background .1s;
}
.dsp-leaderboard tbody tr:last-child { border-bottom: none; }
.dsp-leaderboard tbody tr:hover { background: var(--accent-bg-hover); }
.dsp-leaderboard tbody td {
  padding: 10px; font-size: 13px; vertical-align: middle;
}
.dsp-leaderboard tbody td:not(:first-child) {
  text-align: right;
  font-family: ${t.fontMono}; font-size: 12px;
  color: var(--table-number); white-space: nowrap;
}
.dsp-rank-cell   { display: flex; align-items: center; gap: 8px; min-width: 0; }
.dsp-rank-num    {
  font-family: ${t.fontDisplay}; font-size: 22px;
  color: var(--text-muted); min-width: 22px; text-align: center;
  line-height: 1; flex-shrink: 0;
}
.dsp-rank-num.gold   { color: var(--medal-gold); text-shadow: 0 0 16px var(--accent-glow-strong); }
.dsp-rank-num.silver { color: var(--medal-silver); }
.dsp-rank-num.bronze { color: var(--medal-bronze); }
.dsp-driver-name {
  font-weight: 700; font-size: 13px; color: var(--text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  min-width: 0; flex: 1;
}
/* Highlighted stat pill used in leaderboard #1 cell */
.dsp-stat-tag {
  display: inline-block;
  font-family: ${t.fontMono}; font-size: 10px;
  padding: 3px 8px; border-radius: 999px; letter-spacing: .05em;
  background: var(--accent-bg); color: var(--accent); border: 1px solid var(--accent-bd);
}

/* ── SCORE RING ─────────────────────────────────────────────────────── */
/* Wrap an SVG + center label. Usage: see DSP_UI.ring() helper below */
.dsp-ring-wrap   { position: relative; flex-shrink: 0; }
.dsp-ring-wrap svg { transform: rotate(-90deg); filter: drop-shadow(0 0 12px rgba(var(--accent-rgb),.30)); }
.dsp-ring-track  { fill: none; stroke: var(--border-main); }
.dsp-ring-fill   { fill: none; stroke: var(--accent); stroke-linecap: round; transition: stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1); }
.dsp-ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.dsp-ring-score  { font-family: ${t.fontDisplay}; line-height: 1; color: var(--accent); letter-spacing: .02em; }
.dsp-ring-label  { font-family: ${t.fontMono}; font-size: 7px; letter-spacing: .18em; text-transform: uppercase; color: var(--text-muted); }

/* ── METRIC LIST ────────────────────────────────────────────────────── */
.dsp-metric-list {
  background: linear-gradient(180deg, rgba(18,25,38,.96), rgba(12,18,28,.96));
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}
.dsp-metric-row {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 16px;
  border-bottom: 1px solid rgba(112,132,160,.12);
  transition: background .12s;
}
.dsp-metric-row:last-child { border-bottom: none; }
.dsp-metric-row:hover { background: rgba(var(--accent-rgb),.045); }
.dsp-metric-name { flex: 1; font-size: 13px; font-weight: 500; color: var(--text); min-width: 0; letter-spacing: .01em; }
.dsp-metric-name .sub {
  font-family: ${t.fontMono}; font-size: 9px;
  color: var(--text-muted); letter-spacing: .1em;
  text-transform: uppercase; display: block; margin-top: 1px;
}
.dsp-metric-chip {
  font-family: ${t.fontDisplay}; font-size: 17px; line-height: 1;
  padding: 5px 12px; border-radius: var(--radius-md);
  min-width: 72px; text-align: center; letter-spacing: .04em;
  flex-shrink: 0; border-width: 1px; border-style: solid;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
}
.dsp-metric-chip.green   { background: var(--success-bg); color: var(--success); border-color: var(--success-bd); }
.dsp-metric-chip.amber   { background: var(--warning-bg); color: var(--warning); border-color: var(--warning-bd); }
.dsp-metric-chip.red     { background: var(--danger-bg);  color: var(--danger);  border-color: var(--danger-bd); }
.dsp-metric-chip.neutral { background: rgba(255,255,255,.04); color: var(--text); border-color: var(--border-main); }

/* ── ALERT BANNER ───────────────────────────────────────────────────── */
.dsp-alert {
  display: flex; align-items: center; gap: 6px;
  border-radius: var(--radius-md); padding: 10px 14px;
  font-family: ${t.fontMono}; font-size: 10px;
  letter-spacing: .04em; line-height: 1.5; margin-top: 8px;
  border-left-width: 3px; border-left-style: solid;
  border-top: 1px solid; border-right: 1px solid; border-bottom: 1px solid;
}
.dsp-alert         { background: var(--danger-bg);  color: var(--danger);  border-color: var(--danger-bd); }
.dsp-alert.good    { background: var(--success-bg); color: var(--success); border-color: var(--success-bd); }
.dsp-alert.warning { background: var(--warning-bg); color: var(--warning); border-color: var(--warning-bd); }

/* ── STATUS DOT ─────────────────────────────────────────────────────── */
.dsp-status-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--text-muted); flex-shrink: 0;
  transition: background .3s, box-shadow .3s;
}
.dsp-status-dot.ready   { background: var(--success); box-shadow: 0 0 8px var(--success); }
.dsp-status-dot.running { background: var(--accent);  box-shadow: 0 0 10px rgba(var(--accent-rgb),.25); animation: dsp-pulse 1.2s infinite; }
.dsp-status-dot.warning { background: var(--warning); box-shadow: 0 0 8px rgba(var(--warning-rgb),.5); }
.dsp-status-dot.error   { background: var(--danger);  box-shadow: 0 0 8px rgba(var(--danger-rgb),.5); }

/* ── PROGRESS BAR ───────────────────────────────────────────────────── */
.dsp-progress-track {
  height: 4px; background: var(--bg);
  border: 1px solid var(--border-main);
  border-radius: 4px; overflow: hidden;
}
.dsp-progress-fill {
  height: 100%; width: 0%;
  background: var(--accent);
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(var(--accent-rgb),.25);
  transition: width .3s ease;
  position: relative; overflow: hidden;
}
.dsp-progress-fill.active::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
  animation: dsp-shimmer 1.5s infinite;
}

/* ── ACTIVITY LOG ───────────────────────────────────────────────────── */
.dsp-log {
  overflow-y: auto;
  font-family: ${t.fontMono}; font-size: 10px;
  scrollbar-width: thin; scrollbar-color: var(--border-main) transparent;
  border: 1px solid var(--border-main);
  border-radius: var(--radius-md);
  background: var(--bg);
}
.dsp-log::-webkit-scrollbar       { width: 4px; }
.dsp-log::-webkit-scrollbar-track { background: transparent; }
.dsp-log::-webkit-scrollbar-thumb { background: var(--border-main); border-radius: 4px; }
.dsp-log-entry {
  padding: 6px 8px;
  border-bottom: 1px solid var(--border-main);
  display: flex; gap: 8px;
}
.dsp-log-entry:last-child  { border-bottom: none; }
.dsp-log-time { color: var(--text-muted); min-width: 50px; flex-shrink: 0; }
.dsp-log-msg  { color: var(--text); flex: 1; word-break: break-word; line-height: 1.4; }
.dsp-log-msg.success { color: var(--success); }
.dsp-log-msg.warning { color: var(--warning); }
.dsp-log-msg.error   { color: var(--danger); }

/* ── BADGE ──────────────────────────────────────────────────────────── */
.dsp-badge {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--accent); background: var(--accent-bg);
  border: 1px solid var(--accent-bd);
  border-radius: 999px; padding: 5px 10px;
  font-family: ${t.fontMono}; font-size: 10px;
  letter-spacing: .12em; text-transform: uppercase;
}

/* ── BUTTONS ────────────────────────────────────────────────────────── */
.dsp-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  min-height: 34px; padding: 8px 13px;
  border: 1px solid var(--accent-bd);
  border-radius: var(--radius-md);
  background: linear-gradient(180deg, rgba(var(--accent-rgb),.18), rgba(var(--accent-rgb),.08));
  color: var(--accent);
  font-family: ${t.fontMono}; font-size: 11px; font-weight: 700;
  letter-spacing: .08em; text-transform: uppercase;
  cursor: pointer; text-decoration: none;
  transition: transform .15s ease, filter .15s ease, border-color .15s ease;
}
.dsp-btn:hover:not(:disabled)   { transform: translateY(-1px); filter: brightness(1.08); border-color: var(--accent-bd-strong); }
.dsp-btn:active:not(:disabled)  { transform: translateY(0); }
.dsp-btn:disabled               { opacity: .35; cursor: not-allowed; }
.dsp-btn.primary { background: var(--accent); color: #020617; border-color: var(--accent); }
.dsp-btn.danger  { background: var(--danger-bg); color: var(--danger); border-color: var(--danger-bd); }
.dsp-btn.success { background: var(--success-bg); color: var(--success); border-color: var(--success-bd); }

/* ── FORM INPUTS ────────────────────────────────────────────────────── */
.dsp-input,
.dsp-select,
.dsp-textarea {
  width: 100%;
  background: rgba(255,255,255,.06);
  color: var(--text);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  padding: 9px 11px; outline: none;
  font-family: ${t.fontBody};
  font-size: 13px;
  transition: border-color .15s, box-shadow .15s;
}
.dsp-input:focus,
.dsp-select:focus,
.dsp-textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(var(--accent-rgb),.12);
}

/* ── CHIP (status pill) ─────────────────────────────────────────────── */
.dsp-chip {
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 999px; padding: 4px 9px;
  font-family: ${t.fontMono}; font-size: 10px; letter-spacing: .08em;
  border: 1px solid var(--border-soft); color: var(--text);
}
.dsp-chip.good { color: var(--success); background: var(--success-bg); border-color: var(--success-bd); }
.dsp-chip.warn { color: var(--warning); background: var(--warning-bg); border-color: var(--warning-bd); }
.dsp-chip.bad  { color: var(--danger);  background: var(--danger-bg);  border-color: var(--danger-bd); }

/* ── TABLE ──────────────────────────────────────────────────────────── */
.dsp-table {
  width: 100%; border-collapse: collapse;
  background: var(--card-surface);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-family: ${t.fontBody};
}
.dsp-table th,
.dsp-table td {
  padding: 9px 11px;
  border-bottom: 1px solid rgba(112,132,160,.12);
  text-align: left;
}
.dsp-table th {
  color: var(--accent); font-family: ${t.fontMono};
  font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
  font-weight: 500;
}
.dsp-table tr:last-child td { border-bottom: none; }
.dsp-table tbody tr:hover   { background: var(--accent-bg-hover); }

/* ── LAYOUT HELPERS ─────────────────────────────────────────────────── */
.dsp-row    { display: flex; align-items: center; gap: 10px; }
.dsp-stack  { display: flex; flex-direction: column; gap: 10px; }
.dsp-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }

/* ── SCROLL REVEAL ──────────────────────────────────────────────────── */
.dsp-reveal {
  opacity: 0; transform: translateY(12px);
  transition: opacity .4s ease, transform .4s ease;
}
.dsp-reveal.visible { opacity: 1; transform: none; }

/* ── TOAST ──────────────────────────────────────────────────────────── */
.dsp-toast {
  position: fixed; right: 16px; bottom: 16px;
  z-index: 999999; max-width: 360px;
  background: linear-gradient(180deg, rgba(18,25,38,.98), rgba(12,18,28,.98));
  color: var(--text);
  border: 1px solid var(--border-soft);
  border-left: 4px solid var(--accent);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 12px 14px;
  font-family: ${t.fontBody}; font-size: 13px;
  animation: dsp-fadeUp .25s ease both;
}
.dsp-toast.success { border-left-color: var(--success); }
.dsp-toast.warning { border-left-color: var(--warning); }
.dsp-toast.danger  { border-left-color: var(--danger); }

/* ── FOOTER ─────────────────────────────────────────────────────────── */
.dsp-footer {
  border-top: 1px solid var(--border-main);
  padding: 28px 16px; text-align: center;
  color: var(--text-muted); font-size: 12px;
  background: var(--bg);
}
.dsp-footer-logo {
  font-family: ${t.fontDisplay};
  font-size: 22px; letter-spacing: .06em;
  color: var(--text); margin-bottom: 4px;
}
.dsp-footer-logo span { color: var(--accent); }
.dsp-footer-internal {
  margin-top: 10px; font-family: ${t.fontMono};
  font-size: 9px; letter-spacing: .14em; color: var(--text-dim);
}

/* ── DRAGGABLE ──────────────────────────────────────────────────────── */
.dsp-draggable { cursor: move; user-select: none; }

/* ── RESPONSIVE GRID COLLAPSE ───────────────────────────────────────── */
@media (max-width: 560px) {
  .dsp-grid-2 { grid-template-columns: 1fr; }
  .dsp-panel  { padding: 12px; }
  .dsp-title  { font-size: 21px; }
  .dsp-btn    { width: 100%; }
}
`;

    document.head.appendChild(style);
    DSP_UI.syncThemeColor();
  };

  /* ══════════════════════════════════════════════════════════
     JS UTILITIES
     ══════════════════════════════════════════════════════════ */

  /** Sync <meta name="theme-color"> to CSS --bg value */
  DSP_UI.syncThemeColor = function () {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    if (bg) meta.setAttribute("content", bg);
  };

  /** HTML-escape a value */
  DSP_UI.esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  /** Parse float, fallback 0 */
  DSP_UI.num = function (v) {
    const n = parseFloat(String(v == null ? "" : v).replace(/,/g, ""));
    return isNaN(n) ? 0 : n;
  };

  /** Format a number — returns '--' if falsy/zero */
  DSP_UI.fmt = function (v, dec) {
    const n = DSP_UI.num(v);
    if (!n) return "--";
    return dec != null ? n.toFixed(dec) : String(n);
  };

  /** Format as percentage — handles 0–1 and 0–100 inputs */
  DSP_UI.fmtPct = function (v, dec) {
    const n = DSP_UI.num(v);
    if (n == null) return "--";
    const pv = n > 1 ? n : n * 100;
    return pv.toFixed(dec != null ? dec : 2) + "%";
  };

  /** Format seconds → "Xh Ym", returns "N/A" for falsy */
  DSP_UI.fmtDuration = function (sec) {
    if (!sec || sec <= 0) return "N/A";
    return Math.floor(sec / 3600) + "h " + Math.floor((sec % 3600) / 60) + "m";
  };

  /** Format a date string */
  DSP_UI.fmtDate = function (s, opts) {
    if (!s) return "";
    const d = new Date(String(s));
    if (isNaN(d)) return String(s);
    return d.toLocaleDateString("en-US", opts || {
      weekday: "long", month: "long", day: "numeric", year: "numeric"
    }).toUpperCase();
  };

  /** Short date: "Apr 29, 2026" */
  DSP_UI.fmtDateShort = function (s) {
    return DSP_UI.fmtDate(s, { month: "short", day: "numeric", year: "numeric" });
  };

  /** Returns 'gold' | 'silver' | 'bronze' | '' for rank index 0-based */
  DSP_UI.rankClass = function (i) {
    return i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
  };

  /* ── SCORE RING ────────────────────────────────────────────────────── */
  DSP_UI.ring = function (opts) {
    opts = opts || {};
    const size    = opts.size    || 96;
    const sw      = opts.strokeW || 7;
    const r       = (size / 2) - (sw / 2);
    const circ    = +(2 * Math.PI * r).toFixed(2);
    const score   = opts.score != null ? +opts.score : null;
    const pct     = score != null ? Math.min(Math.max(score / 100, 0), 1) : 0;
    const offset  = +(circ - pct * circ).toFixed(2);
    const label   = DSP_UI.esc(opts.label  || "Score");
    const id      = opts.id ? ` id="${DSP_UI.esc(opts.id)}"` : "";
    const dispTxt = score != null ? score.toFixed(2) : "--";
    const fontSize = opts.scoreSize || Math.round(size * 0.27);

    return `<div class="dsp-ring-wrap" style="width:${size}px;height:${size}px;">
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle class="dsp-ring-track" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${sw}"/>
    <circle class="dsp-ring-fill"${id} cx="${size/2}" cy="${size/2}" r="${r}"
      stroke-width="${sw}"
      stroke-dasharray="${circ}"
      stroke-dashoffset="${offset}"/>
  </svg>
  <div class="dsp-ring-center">
    <span class="dsp-ring-score" style="font-size:${fontSize}px;">${dispTxt}</span>
    <span class="dsp-ring-label">${label}</span>
  </div>
</div>`;
  };

  DSP_UI.toast = function (msg, type, ms) {
    const old = document.querySelector(".dsp-toast");
    if (old) old.remove();

    const el = document.createElement("div");
    el.className = "dsp-toast " + (type || "");
    el.textContent = msg;
    document.body.appendChild(el);

    setTimeout(() => el.remove(), ms || 3500);
    return el;
  };

  DSP_UI.makeDraggable = function (box, handle) {
    handle = handle || box;
    let sx = 0, sy = 0, bx = 0, by = 0, dragging = false;

    handle.classList.add("dsp-draggable");

    handle.addEventListener("pointerdown", function (e) {
      if (e.target.closest("button, input, select, textarea, a")) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      const r = box.getBoundingClientRect();
      bx = r.left; by = r.top;
      box.style.position = "fixed";
      box.style.left     = bx + "px";
      box.style.top      = by + "px";
      box.style.right    = "auto";
      box.style.bottom   = "auto";
      handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      const maxX = window.innerWidth  - box.offsetWidth;
      const maxY = window.innerHeight - box.offsetHeight;
      box.style.left = Math.max(0, Math.min(maxX, bx + (e.clientX - sx))) + "px";
      box.style.top  = Math.max(0, Math.min(maxY, by + (e.clientY - sy))) + "px";
    });

    handle.addEventListener("pointerup", () => { dragging = false; });
  };

  DSP_UI.createPanel = function (opts) {
    opts = opts || {};
    DSP_UI.injectTheme();

    const box = document.createElement("div");
    box.className = "dsp-panel dsp-panel-fixed dsp-reset";
    box.style.width   = opts.width   || "340px";
    box.style.right   = opts.right   || "16px";
    box.style.bottom  = opts.bottom  != null ? opts.bottom  : "16px";
    if (opts.top)    box.style.top    = opts.top;
    if (opts.zIndex) box.style.zIndex = opts.zIndex;
    box.innerHTML = opts.html || "";

    document.body.appendChild(box);

    if (opts.draggable) {
      const h = opts.handle ? box.querySelector(opts.handle) : box;
      DSP_UI.makeDraggable(box, h || box);
    }

    return box;
  };

  DSP_UI.scrollReveal = function (sel) {
    if (!window.IntersectionObserver) {
      document.querySelectorAll(sel || ".dsp-reveal")
        .forEach(el => el.classList.add("visible"));
      return;
    }

    if (!DSP_UI._revealObs) {
      DSP_UI._revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      }, { threshold: 0.06 });
    }

    const els = typeof sel === "string"
      ? document.querySelectorAll(sel || ".dsp-reveal")
      : (sel || document.querySelectorAll(".dsp-reveal"));

    els.forEach(function (el) {
      if (!el.classList.contains("visible")) DSP_UI._revealObs.observe(el);
    });
  };

  window.injectDSPTheme = DSP_UI.injectTheme;

})();
