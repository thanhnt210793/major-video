#!/usr/bin/env node
// Generates compositions/frames/NN-*.html for the "dev-local-port-bug" video from one
// shared world: two desks side by side (ours with monitor/keyboard/mouse, chị Mai's to
// the right). The camera pans across that world for the chair-swivel beats; the wall
// layer moves slower (parallax); POV hands live in a screen-space foreground layer.
// Terminal content follows the approved storyboard (real macOS / Node.js output).
// Reveal cues come from audio_meta.json word timings (frame-relative seconds).
//
//   node tools/gen-frames.mjs        (run from the HyperFrames project root)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SB = JSON.parse(readFileSync(join(ROOT, "../../../content/it/dev-local-port-bug/storyboard.json"), "utf8"));
const META = existsSync(join(ROOT, "audio_meta.json")) ? JSON.parse(readFileSync(join(ROOT, "audio_meta.json"), "utf8")) : { voices: [] };
const W = 1080, H = 1920;
const C = { bg: "#0F1E33", navySoft: "#1B2E4A", teal: "#14B8A6", text: "#F5EFE4", muted: "#B8C4D3", light: "#8796A9",
  err: "#FF7A70", ok: "#3FB68B", warn: "#F2A93B", desk: "#22344F", deskEdge: "#2C4262" };

const norm = (s) => String(s).normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
function cue(frame, word, nth = 1, fallback = 0) {
  const v = META.voices.find((x) => x.frame === frame);
  if (!v) return fallback;
  let seen = 0;
  for (const w of v.words) if (norm(w.text) === norm(word) && ++seen === nth) return Math.max(0, w.start);
  return fallback;
}
const r2 = (n) => Math.round(n * 100) / 100;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ── world geometry ────────────────────────────────────────────────────────────
const CAM = { mon: 0, col: 1320 };          // pan positions (world x of the view's left edge)
const PARALLAX = 0.55;                      // wall moves at 55% of the desk layer
const MON = { x: 50, y: 240, w: 980, h: 760 };
const SCR = { x: MON.x + 18, y: MON.y + 18, w: MON.w - 36, h: MON.h - 36 };
const TERM = { x: 24, y: 52, w: SCR.w - 48, h: SCR.h - 76, pad: 22, lh: 30, fs: 20, title: 40 }; // inside screen
const ZOOM_ERR = { x: 470, y: 700 };        // canvas point the "read" push-in targets
const ZOOM_ROW = { x: 540, y: 560 };
const DUCK = { x: 838, y: 1162 };
const ZOOM_DUCK = { x: 640, y: 1200 };  // keeps the terminal text and the duck both in frame at 1.2×

// ── terminal transcript (one growing list; each frame shows lines [0, upto)) ──
const PROMPT = "minh@macbook du-an %";
const L = [];
const cmd = (t, tag) => L.push({ kind: "cmd", text: t, tag });
const out = (t, cls = "", tag) => L.push({ kind: "out", text: t, cls, tag });
const ERR = "Error: listen EADDRINUSE: address already in use :::3000";
for (let b = 1; b <= 3; b++) {
  cmd("npm run dev", `run${b}`);
  out("", "", `run${b}`); out("> du-an@1.0.0 dev", "dim", `run${b}h`); out("> node server.js", "dim", `run${b}h`); out("", "", `run${b}h`);
  out(ERR, "err", `err${b}`);
}
cmd("lsof -i :3000 -P", "lsof");
out("COMMAND  PID USER   FD   TYPE     DEVICE SIZE/OFF NODE NAME", "dim", "lsofo");
out("node    4821 minh   23u  IPv6 0x1f3a9c2e      0t0  TCP *:3000 (LISTEN)", "row", "lsofo");
cmd("kill 4821", "kill");
cmd("npm run dev", "run4");
out("", "", "run4"); out("> du-an@1.0.0 dev", "dim", "run4h"); out("> node server.js", "dim", "run4h"); out("", "", "run4h");
out("Server listening on http://localhost:3000", "ok", "ok");
L.push({ kind: "caret", tag: "caret" });
const idx = (tag) => L.findIndex((l) => l.tag === tag);
const lastIdx = (tag) => L.map((l) => l.tag).lastIndexOf(tag);
const VISIBLE = Math.floor((TERM.h - TERM.title - TERM.pad * 2) / TERM.lh); // rows that fit
const scrollFor = (upto) => Math.max(0, upto - VISIBLE) * TERM.lh;           // px to scroll so line `upto-1` is visible

// ── SVG pieces ────────────────────────────────────────────────────────────────
const SKIN = "#E8B48F", SKIN_D = "#CF9572";
const MAI_SKIN = "#D9A07A", MAI_SKIN_D = "#BF845F";

const wallSvg = (P) => `
<svg width="2400" height="${H}" viewBox="0 0 2400 ${H}" style="position:absolute;left:0;top:0;">
  <defs>
    <linearGradient id="${P}wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A2D48"/><stop offset="1" stop-color="#0F1E33"/></linearGradient>
    <radialGradient id="${P}sun" cx="0.38" cy="0.12" r="0.5"><stop offset="0" stop-color="#F5EFE4" stop-opacity="0.13"/><stop offset="1" stop-color="#F5EFE4" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="2400" height="${H}" fill="url(#${P}wall)"/>
  <rect width="2400" height="${H}" fill="url(#${P}sun)"/>
  <g transform="translate(760 110)"><rect width="330" height="430" rx="12" fill="#F5EFE4" fill-opacity="0.07" stroke="#F5EFE4" stroke-opacity="0.12" stroke-width="4"/><path d="M165 0v430 M0 215h330" stroke="#F5EFE4" stroke-opacity="0.12" stroke-width="4"/></g>
  <g transform="translate(1500 380)"><rect x="0" y="80" width="300" height="16" rx="6" fill="#2C4262"/><rect x="40" y="10" width="70" height="70" rx="12" fill="#14B8A6" fill-opacity="0.5"/><path d="M75 10 C 60 -30 90 -40 75 -60 M75 10 C 95 -20 110 -10 120 -40 M75 10 C 50 -10 40 -30 30 -35" stroke="#3FB68B" stroke-width="10" fill="none" stroke-linecap="round"/><rect x="150" y="30" width="110" height="50" rx="6" fill="#F5EFE4" fill-opacity="0.18"/></g>
</svg>`;

function keyboardSvg(P) {
  // flat trapezoid keyboard (wider at the bottom = nearer to the viewer)
  const top = { y: 1300, x0: 160, x1: 920 }, bot = { y: 1560, x0: 100, x1: 980 };
  const lerp = (a, b, t) => a + (b - a) * t;
  let keys = "";
  const rows = 5, cols = 14;
  for (let r = 0; r < rows; r++) {
    const t0 = (r + 0.18) / rows, t1 = (r + 0.86) / rows;
    const y0 = lerp(top.y, bot.y, t0), y1 = lerp(top.y, bot.y, t1);
    const xa0 = lerp(top.x0, bot.x0, t0) + 22, xb0 = lerp(top.x1, bot.x1, t0) - 22;
    const xa1 = lerp(top.x0, bot.x0, t1) + 22, xb1 = lerp(top.x1, bot.x1, t1) - 22;
    const n = r === 4 ? 1 : cols;
    for (let c = 0; c < n; c++) {
      const g = 0.12;
      const f0 = r === 4 ? 0.25 : (c + g) / n, f1 = r === 4 ? 0.75 : (c + 1 - g) / n;
      const pts = [[lerp(xa0, xb0, f0), y0], [lerp(xa0, xb0, f1), y0], [lerp(xa1, xb1, f1), y1], [lerp(xa1, xb1, f0), y1]]
        .map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ");
      keys += `<polygon id="${P}key-${r}-${c}" points="${pts}" fill="#2E4566" stroke="#0A1424" stroke-width="2"/>`;
    }
  }
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0;">
    <polygon points="${top.x0},${top.y} ${top.x1},${top.y} ${bot.x1},${bot.y} ${bot.x0},${bot.y}" fill="#16263D" stroke="#0A1424" stroke-width="4" stroke-linejoin="round"/>
    ${keys}
    <g transform="translate(1000 1380)"><ellipse cx="40" cy="70" rx="44" ry="66" fill="#16263D" stroke="#0A1424" stroke-width="4"/><path d="M40 8v46" stroke="#0A1424" stroke-width="4"/></g>
  </svg>`;
}

const monitorSvg = (P) => `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0;">
  <rect x="490" y="${MON.y + MON.h - 4}" width="100" height="120" fill="#0A1424"/>
  <ellipse cx="540" cy="${MON.y + MON.h + 120}" rx="170" ry="26" fill="#0A1424"/>
  <rect x="${MON.x}" y="${MON.y}" width="${MON.w}" height="${MON.h}" rx="22" fill="#070D17" stroke="#F5EFE4" stroke-opacity="0.14" stroke-width="3"/>
</svg>`;

const duckSvg = (P) => `
<svg id="${P}duck" width="140" height="130" viewBox="0 0 140 130" style="position:absolute;left:${DUCK.x}px;top:${DUCK.y}px;opacity:0;">
  <ellipse cx="72" cy="96" rx="58" ry="30" fill="#F2C94C" stroke="#C99A1E" stroke-width="3"/>
  <circle cx="54" cy="52" r="34" fill="#F2C94C" stroke="#C99A1E" stroke-width="3"/>
  <path d="M20 54 L-2 62 L20 68 Z" fill="#F2A93B" stroke="#C97A1E" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="46" cy="44" r="5" fill="#0F1E33"/><path d="M96 90 c 20 -18 30 -10 34 -24" stroke="#C99A1E" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`;

// chị Mai at the neighbouring desk (world x ≈ 1860)
const maiSvg = (P) => `
<svg width="${W + 200}" height="${H}" viewBox="1220 0 ${W + 200} ${H}" style="position:absolute;left:1220px;top:0;">
  <rect x="1700" y="700" width="320" height="520" rx="60" fill="#16263D"/>
  <path d="M1690 1180 C 1700 980 1760 900 1860 890 C 1960 900 2020 980 2030 1180 Z" fill="#F5EFE4"/>
  <path d="M1810 892 L1860 960 L1910 892" stroke="#B8C4D3" stroke-width="6" fill="none" stroke-linejoin="round"/>
  <path d="M1772 880 C 1772 940 1948 940 1948 880" stroke="${C.teal}" stroke-width="16" fill="none" stroke-linecap="round"/>
  <rect x="1752" y="858" width="40" height="56" rx="16" fill="${C.teal}"/><rect x="1928" y="858" width="40" height="56" rx="16" fill="${C.teal}"/>
  <g id="${P}mai-head">
    <rect x="1838" y="790" width="44" height="70" rx="18" fill="${MAI_SKIN}"/>
    <path d="M1738 700 C 1738 560 1982 560 1982 700 L1982 800 C 1960 815 1930 790 1925 760 L1795 760 C 1790 790 1760 815 1738 800 Z" fill="#2A2320"/>
    <ellipse cx="1860" cy="712" rx="104" ry="112" fill="${MAI_SKIN}" stroke="${MAI_SKIN_D}" stroke-width="3"/>
    <path d="M1752 680 C 1760 600 1820 580 1880 590 C 1940 600 1972 640 1968 700 C 1930 650 1860 640 1800 660 C 1780 668 1764 676 1752 680 Z" fill="#2A2320"/>
    <g id="${P}mai-eyes"><ellipse cx="1822" cy="716" rx="11" ry="14" fill="#1A1412"/><ellipse cx="1898" cy="716" rx="11" ry="14" fill="#1A1412"/></g>
    <path d="M1808 690 q14 -10 28 0 M1884 690 q14 -10 28 0" stroke="#1A1412" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="1800" cy="756" rx="16" ry="9" fill="#E5534B" fill-opacity="0.25"/><ellipse cx="1920" cy="756" rx="16" ry="9" fill="#E5534B" fill-opacity="0.25"/>
    <path id="${P}mai-smile" d="M1832 770 q28 22 56 0" stroke="#7A3B2E" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path id="${P}mai-laugh" d="M1826 764 q34 40 68 0 z" fill="#7A3B2E" opacity="0"/>
  </g>
  <path d="M1712 1000 C 1690 1060 1690 1120 1720 1160 L1800 1164" stroke="#F5EFE4" stroke-width="54" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="1812" cy="1160" rx="34" ry="22" fill="${MAI_SKIN}" stroke="${MAI_SKIN_D}" stroke-width="3"/>
  <path d="M2008 1000 C 2034 1060 2040 1110 2030 1150 L2090 1150" stroke="#F5EFE4" stroke-width="54" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="2098" cy="1146" rx="32" ry="22" fill="${MAI_SKIN}" stroke="${MAI_SKIN_D}" stroke-width="3"/>
  <g id="${P}mai-thumb" opacity="0"><path d="M2030 1170 L2074 992" stroke="#F5EFE4" stroke-width="50" stroke-linecap="round"/><rect x="2030" y="930" width="92" height="70" rx="26" fill="${MAI_SKIN}" stroke="${MAI_SKIN_D}" stroke-width="3"/><path d="M2048 948 h58 M2048 966 h58 M2048 984 h58" stroke="${MAI_SKIN_D}" stroke-width="3" stroke-linecap="round"/><rect x="2036" y="858" width="30" height="86" rx="15" fill="${MAI_SKIN}" stroke="${MAI_SKIN_D}" stroke-width="3" transform="rotate(-12 2051 944)"/></g>
  <rect x="1400" y="1150" width="1000" height="40" fill="${C.deskEdge}"/>
  <g transform="translate(2070 880)"><polygon points="0,270 40,0 300,0 260,270" fill="#2C4262" stroke="#0A1424" stroke-width="4"/><circle cx="170" cy="130" r="18" fill="#F5EFE4" fill-opacity="0.12"/></g>
  <g transform="translate(1530 1060)"><rect width="70" height="86" rx="10" fill="#F5EFE4" fill-opacity="0.85"/><path d="M70 22 c 26 0 26 40 0 40" stroke="#F5EFE4" stroke-opacity="0.85" stroke-width="9" fill="none"/></g>
</svg>`;

const handsSvg = (P) => {
  const hand = (x, flip) => `<g transform="${flip ? `translate(${2 * x} 0) scale(-1 1)` : ""}">
    <path d="M${x - 260} 1980 L${x - 120} 1600 L${x + 20} 1650 L${x - 80} 1980 Z" fill="${C.navySoft}"/>
    <path d="M${x - 196} 1792 L${x - 40} 1830" stroke="${C.teal}" stroke-opacity="0.55" stroke-width="14" stroke-linecap="round"/>
    <path d="M${x - 130} 1610 C ${x - 140} 1520 ${x - 60} 1440 ${x + 30} 1440 C ${x + 110} 1440 ${x + 150} 1500 ${x + 120} 1570 C ${x + 90} 1640 ${x - 20} 1680 ${x - 130} 1610 Z" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${x - 40 + i * 42}" y="${1416 - (i === 1 || i === 2 ? 14 : 0)}" width="36" height="64" rx="18" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/>`).join("")}
    <rect x="${x + 100}" y="1500" width="34" height="80" rx="17" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3" transform="rotate(-50 ${x + 117} 1540)"/>
  </g>`;
  return `<svg width="${W}" height="${H + 100}" viewBox="0 0 ${W} ${H + 100}" style="position:absolute;left:0;top:0;">
    <g id="${P}hand-l">${hand(330, false)}</g><g id="${P}hand-r">${hand(750, true)}</g>
  </svg>`;
};

// ── terminal HTML ─────────────────────────────────────────────────────────────
function terminalHtml(P, { upto, showChip = false }) {
  const rows = L.slice(0, upto).map((l, i) => {
    const top = i * TERM.lh;
    if (l.kind === "caret") return `<div id="${P}ln-${i}" class="${P}ln" style="top:${top}px;"><span id="${P}caret" class="${P}caret"></span></div>`;
    if (l.kind === "cmd")
      return `<div id="${P}ln-${i}" class="${P}ln" style="top:${top}px;"><span class="${P}prompt">${PROMPT}</span> <span id="${P}typed-${i}" class="${P}typed">${esc(l.text)}</span></div>`;
    return `<div id="${P}ln-${i}" class="${P}ln ${l.cls ? P + l.cls : ""}" style="top:${top}px;">${l.text ? esc(l.text) : "&nbsp;"}</div>`;
  }).join("");
  return `
<div id="${P}term" class="${P}term">
  <div class="${P}tbar"><span class="${P}dot" style="background:#E5534B"></span><span class="${P}dot" style="background:#F2A93B"></span><span class="${P}dot" style="background:#3FB68B"></span><span class="${P}ttl">minh — zsh</span><span id="${P}chip" class="${P}chip" style="opacity:${showChip ? 1 : 0};">macOS</span></div>
  <div class="${P}tbody"><div id="${P}tflash" class="${P}tflash"></div><div class="${P}tclip"><div id="${P}tscroll" class="${P}tscroll">${rows}</div></div></div>
</div>`;
}

const menubar = (P, time) => `<div class="${P}menubar"><span style="font-weight:700;">Terminal</span><span id="${P}clock">${time}</span></div>`;

// ── CSS ───────────────────────────────────────────────────────────────────────
const FONT_FACE = [["Regular", 400], ["Medium", 500], ["SemiBold", 600], ["Bold", 700], ["ExtraBold", 800]]
  .map(([f, w]) => `@font-face{font-family:"Be Vietnam Pro";font-weight:${w};font-style:normal;font-display:block;src:url("assets/fonts/BeVietnamPro-${f}.ttf") format("truetype");}`)
  .join("\n") + `\n@font-face{font-family:"JetBrains Mono";font-weight:100 800;font-style:normal;font-display:block;src:url("assets/fonts/JetBrainsMono-Variable.ttf") format("truetype");}`;

const css = (P) => `
${FONT_FACE}
#root{position:absolute;inset:0;width:100%;height:100%;overflow:hidden;font-family:"Be Vietnam Pro";color:${C.text};}
.${P}ground{position:absolute;inset:0;background:${C.bg};}
.${P}zoom{position:absolute;inset:0;}
.${P}pan{position:absolute;left:0;top:0;width:2400px;height:${H}px;}
.${P}wall{position:absolute;left:0;top:0;width:2400px;height:${H}px;}
.${P}deskband{position:absolute;left:0;top:1150px;width:2400px;height:${H - 1150}px;background:${C.desk};border-top:6px solid ${C.deskEdge};}
.${P}screen{position:absolute;left:${SCR.x}px;top:${SCR.y}px;width:${SCR.w}px;height:${SCR.h}px;border-radius:8px;overflow:hidden;background:linear-gradient(160deg,#16314F,#0E1D31);}
.${P}menubar{position:absolute;left:0;right:0;top:0;height:34px;padding:0 18px;display:flex;justify-content:space-between;align-items:center;font-size:19px;font-weight:600;color:${C.text};background:rgba(7,13,23,0.55);}
.${P}term{position:absolute;left:${TERM.x}px;top:${TERM.y}px;width:${TERM.w}px;height:${TERM.h}px;border-radius:12px;background:#0B1424;border:2px solid rgba(245,239,228,0.12);overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,0.45);}
.${P}tbar{height:${TERM.title}px;display:flex;align-items:center;gap:10px;padding:0 16px;background:#16263D;font-size:18px;font-weight:600;color:${C.muted};}
.${P}dot{width:14px;height:14px;border-radius:50%;display:inline-block;}
.${P}ttl{margin-left:12px;flex:1;}
.${P}chip{font-size:16px;font-weight:700;color:#0B1424;background:${C.teal};padding:2px 12px;border-radius:100px;}
.${P}tbody{position:absolute;left:0;right:0;top:${TERM.title}px;bottom:0;overflow:hidden;}
.${P}tflash{position:absolute;inset:0;background:rgba(229,83,75,0.22);opacity:0;}
.${P}tclip{position:absolute;left:${TERM.pad}px;right:${TERM.pad}px;top:${TERM.pad}px;bottom:${TERM.pad}px;overflow:hidden;}
.${P}tscroll{position:absolute;left:0;right:0;top:0;}
.${P}ln{position:absolute;left:0;right:0;height:${TERM.lh}px;font-family:"JetBrains Mono";font-size:${TERM.fs}px;line-height:${TERM.lh}px;white-space:pre;color:#D8DEE8;}
.${P}prompt{color:${C.teal};font-weight:700;}
.${P}typed{display:inline-block;white-space:pre;}
.${P}dim{color:#A9B5C5;}
.${P}err{color:${C.err};font-weight:700;}
.${P}ok{color:${C.ok};font-weight:700;}
.${P}row{color:${C.text};}
.${P}caret{display:inline-block;width:12px;height:24px;background:${C.text};vertical-align:middle;}
.${P}hl{position:absolute;height:${TERM.lh + 4}px;border-radius:6px;background:rgba(20,184,166,0.28);border:2px solid rgba(20,184,166,0.7);}
.${P}fg{position:absolute;inset:0;}
.${P}tag{position:absolute;left:0;right:0;margin:0 auto;width:fit-content;top:120px;white-space:nowrap;font-size:40px;font-weight:800;padding:14px 32px;border-radius:100px;background:#1B2E4A;border:3px solid ${C.teal};color:${C.text};}
.${P}card{position:absolute;left:70px;right:70px;top:110px;padding:26px 32px;border-radius:22px;background:#1B2E4A;border:3px solid ${C.teal};text-align:center;}
.${P}card b{display:block;font-size:46px;font-weight:800;line-height:1.2;}
.${P}card small{display:block;margin-top:8px;font-size:30px;font-weight:600;color:${C.muted};}
.${P}bubble{position:absolute;padding:24px 34px;border-radius:30px;background:${C.text};color:#0F1E33;font-size:44px;font-weight:800;white-space:nowrap;box-shadow:0 14px 30px rgba(0,0,0,0.35);}
.${P}sticker{position:absolute;padding:16px 26px;border-radius:16px;background:${C.warn};color:#0F1E33;font-size:38px;font-weight:800;white-space:nowrap;box-shadow:0 12px 26px rgba(0,0,0,0.4);}
`;

// ── frame assembly ────────────────────────────────────────────────────────────
// state at frame start: cam (pan), zoom {s, x, y}, hands (0 = on keyboard, 1 = dropped)
function frameFile(f) {
  const n = f.n, P = `f${String(n).padStart(2, "0")}-`, s = SB.scenes[n - 1], D = s.duration;
  const st = f.start;
  const term = terminalHtml(P, { upto: f.upto, showChip: f.chip });
  const html = `<template>
<style>
${css(P)}
${(f.css ?? "").replaceAll("$P", P)}
</style>
<div id="root" data-composition-id="${f.id}" data-width="${W}" data-height="${H}" data-duration="${D}">
  <div id="${P}ground" class="${P}ground clip" data-start="0" data-duration="${D}" data-track-index="0"></div>
  <div id="${P}zoom" class="${P}zoom clip" data-start="0" data-duration="${D}" data-track-index="1">
    <div id="${P}pan" class="${P}pan">
      <div id="${P}wall" class="${P}wall">${wallSvg(P)}</div>
      <div class="${P}deskband"></div>
      ${monitorSvg(P)}
      <div id="${P}screen" class="${P}screen">${menubar(P, f.clock ?? "Thứ Hai 9:00")}${term}</div>
      ${keyboardSvg(P)}
      ${duckSvg(P)}
      ${maiSvg(P)}
      ${(f.world ?? "").replaceAll("$P", P)}
    </div>
  </div>
  <div id="${P}fg" class="${P}fg clip" data-start="0" data-duration="${D}" data-track-index="2">${handsSvg(P)}</div>
  <div id="${P}ov" class="${P}fg clip" data-layout-allow-overlap data-start="0" data-duration="${D}" data-track-index="3">${(f.overlay ?? "").replaceAll("$P", P)}</div>
</div>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script>
(function () {
  const P = "${P}";
  const $ = (s) => document.getElementById(P + s);
  const tl = gsap.timeline({ paused: true });
  const PAR = ${PARALLAX};
  // camera state at frame start
  gsap.set($("zoom"), { scale: ${st.zoom.s}, transformOrigin: "${st.zoom.x}px ${st.zoom.y}px" });
  gsap.set($("pan"), { x: ${-st.cam} });
  gsap.set($("wall"), { x: ${r2(st.cam * (1 - PARALLAX))} });
  gsap.set($("fg"), { y: ${st.hands * 900} });
  gsap.set($("tscroll"), { y: ${-scrollFor(f.scroll0 ?? f.upto)} });
  // helpers
  const pan = (to, at, dur = 0.9) => {
    tl.to($("pan"), { x: -to, duration: dur, ease: "power2.inOut" }, at);
    tl.to($("wall"), { x: to * (1 - PAR), duration: dur, ease: "power2.inOut" }, at);
    tl.to($("zoom"), { filter: "blur(7px)", duration: dur * 0.45, ease: "power1.in" }, at);
    tl.to($("zoom"), { filter: "blur(0px)", duration: dur * 0.55, ease: "power1.out" }, at + dur * 0.45);
  };
  const hands = (to, at, dur = 0.55) => tl.to($("fg"), { y: to * 900, duration: dur, ease: to ? "power2.in" : "power3.out" }, at);
  const zoom = (sc, at, dur = 1.0) => tl.to($("zoom"), { scale: sc, duration: dur, ease: "power2.inOut" }, at);
  const type = (i, at, dur) => { const el = $("typed-" + i); if (el) tl.fromTo(el, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: dur, ease: "steps(" + Math.max(4, el.textContent.length) + ")" }, at); };
  const show = (i, at) => { const el = $("ln-" + i); if (el) tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.01 }, at); };
  const scrollTo = (px, at) => tl.to($("tscroll"), { y: -px, duration: 0.25, ease: "power2.out" }, at);
  const typingHands = (at, dur) => { for (let k = 0, t = at; t < at + dur; k++, t += 0.12) { tl.to($(k % 2 ? "hand-l" : "hand-r"), { y: -10, duration: 0.05 }, t); tl.to($(k % 2 ? "hand-l" : "hand-r"), { y: 0, duration: 0.06 }, t + 0.06); const key = $("key-" + (1 + (k * 3) % 3) + "-" + ((k * 5 + 3) % 14)); if (key) { tl.to(key, { fill: "${C.teal}", duration: 0.03 }, t); tl.to(key, { fill: "#2E4566", duration: 0.08 }, t + 0.08); } } };
  const pop = (el, at, from = 0.6) => tl.fromTo(el, { opacity: 0, scale: from }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.7)" }, at);
  const fadeIn = (el, at, dur = 0.35) => tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: dur, ease: "power3.out" }, at);
${f.script(P, n, D)}
  window.__timelines["${f.id}"] = tl;
})();
</script>
</template>
`;
  return html;
}

// hidden-until-shown lines: lines with index >= from start invisible (script reveals them)
const hideFrom = (from, upto) => Array.from({ length: Math.max(0, upto - from) }, (_, k) => from + k)
  .map((i) => `  tl.set($("ln-${i}"), { opacity: 0 }, 0);`).join("\n");

// Overlay / world snippets. Each is shown by one frame and carried into the next frame
// (visible at t=0, then faded) so nothing pops off at a cut.
const OV = {
  tagDay: `<div id="$PtagDay" class="$Ptag" style="">Thứ Hai · 9:00</div>`,
  card3: `<div id="$Pcard3" class="$Pcard" style=""><b>EADDRINUSE</b><small style="font-size:44px;color:#F5EFE4;">= cổng đã bị chiếm</small></div>`,
  q3: `<div id="$Pq3" style="position:absolute;right:90px;top:430px;font-size:150px;font-weight:800;color:${C.teal};">?</div>`,
  tagMai: `<div id="$PtagMai" class="$Ptag" style="">Hỏi thử chị Mai…</div>`,
  bubPov: `<div id="$PbubPov" class="$Pbubble" style="left:1380px;top:1210px;">Chị ơi…</div>`,
  bulb: `<svg id="$Pbulb" width="300" height="320" viewBox="-40 -50 300 320" style="position:absolute;left:390px;top:60px;">
        <circle cx="110" cy="100" r="96" fill="${C.warn}" fill-opacity="0.22"/><path d="M110 30 a62 62 0 0 0 -36 112 c 10 8 12 18 12 30 h48 c 0 -12 2 -22 12 -30 A62 62 0 0 0 110 30z" fill="${C.warn}" stroke="#C97A1E" stroke-width="5"/>
        <rect x="84" y="182" width="52" height="16" rx="6" fill="#B8C4D3"/><rect x="88" y="204" width="44" height="14" rx="6" fill="#B8C4D3"/>
        ${[0, 1, 2, 3, 4].map((i) => { const a = (-150 + i * 30) * Math.PI / 180; return `<path d="M${(110 + Math.cos(a) * 112).toFixed(0)} ${(100 + Math.sin(a) * 112).toFixed(0)} L${(110 + Math.cos(a) * 138).toFixed(0)} ${(100 + Math.sin(a) * 138).toFixed(0)}" stroke="${C.warn}" stroke-width="9" stroke-linecap="round"/>`; }).join("")}
      </svg>`,
  khoan: `<div id="$Pkhoan" class="$Ptag" style="top:390px;font-size:60px;">Khoan đã!</div>`,
  stk: `<div id="$Pstk" class="$Psticker" style="left:90px;top:1080px;">Thủ phạm: mình của thứ Sáu!</div>`,
  arrow: `<svg id="$Parrow" width="120" height="160" viewBox="0 0 120 160" style="position:absolute;left:150px;top:930px;"><path d="M60 150 C 40 100 50 50 70 14" stroke="${C.warn}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M50 30 L72 8 L84 40" stroke="${C.warn}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  tagOk: `<div id="$PtagOk" class="$Ptag" style="border-color:${C.ok};">Chạy được rồi!</div>`,
  tick: `<svg id="$Ptick" width="130" height="130" viewBox="0 0 24 24" style="position:absolute;left:880px;top:760px;"><circle cx="12" cy="12" r="11" fill="${C.ok}"/><path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="#0F1E33" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  bubMai: `<div id="$PbubMai" class="$Pbubble" style="left:1600px;top:250px;">Chị chưa nói câu nào!</div>`,
  meo: `<div id="$Pmeo" class="$Pcard" style=""><b>Mẹo: “gỡ lỗi kiểu vịt cao su”</b><small>(rubber duck debugging)</small></div>`,
  ask: `<div id="$Pask" class="$Pcard" style="top:1004px;padding:18px 28px;"><b>Kể mình nghe dưới phần bình&nbsp;luận&nbsp;nhé!</b></div>`,
};
const hide = (html) => html.replace('style="', 'style="opacity:0;');
const fadeOut = (ids, at = 0, dur = 0.3) => ids.map((i) => `  tl.fromTo($("${i}"), { opacity: 1 }, { opacity: 0, duration: ${dur}, ease: "power1.out" }, ${at});`).join("\n");

// geometry shared by the highlight bands
const E3 = idx("err3"), UP3 = E3 + 1;
const LINE3 = SCR.y + TERM.y + TERM.title + TERM.pad + E3 * TERM.lh - scrollFor(UP3);
const HL3 = `<div id="$Phl3" class="$Phl" style="left:${SCR.x + TERM.x + TERM.pad + 26 * 12 - 6}px;top:${LINE3 - 2}px;width:${30 * 12 + 12}px;"></div>`;
const ROW = lastIdx("lsofo"), UP6 = idx("lsofo") + 2;
const ROWTOP = SCR.y + TERM.y + TERM.title + TERM.pad + ROW * TERM.lh - scrollFor(UP6);
const HL6 = `<div id="$Phl6" class="$Phl" style="left:${SCR.x + TERM.x + TERM.pad - 6}px;top:${ROWTOP - 2}px;width:${70 * 12 + 12}px;"></div>`;
const Z3 = { x: ZOOM_ERR.x, y: LINE3 + 15 }, Z6 = { x: ZOOM_ROW.x, y: ROWTOP + 15 };

const S0 = { cam: CAM.mon, zoom: { s: 1, x: ZOOM_ERR.x, y: ZOOM_ERR.y }, hands: 0 };
const FR = [];

// 1 — hook: type npm run dev → red error
{
  const upto = idx("err1") + 1;
  FR.push({ n: 1, id: "01-hook", start: S0, upto, scroll0: upto,
    overlay: hide(OV.tagDay),
    script: () => {
      const tErr = Math.max(1.6, cue(1, "và", 1, 2.1) - 0.15);
      return `${hideFrom(1, upto)}
  fadeIn($("tagDay"), 0.15);
  type(0, 0.35, 0.7); typingHands(0.35, 0.7);
  show(1, 1.15); show(2, 1.2); show(3, 1.25); show(4, 1.3);
  show(5, ${r2(tErr)});
  tl.fromTo($("tflash"), { opacity: 0 }, { opacity: 1, duration: 0.12 }, ${r2(tErr)});
  tl.to($("tflash"), { opacity: 0.55, duration: 0.6, ease: "power2.out" }, ${r2(tErr + 0.12)});
  tl.fromTo($("zoom"), { x: 0 }, { x: 10, duration: 0.05, repeat: 5, yoyo: true, ease: "none" }, ${r2(tErr)});`;
    } });
}

// 2 — retry twice; the time pill and the menu-bar clock jump
{
  const from = idx("err1") + 1, upto = UP3;
  const b2 = idx("run2"), b3 = idx("run3");
  FR.push({ n: 2, id: "02-retry", start: S0, upto, scroll0: from, clock: "Thứ Hai 9:00",
    overlay: OV.tagDay,
    script: () => {
      const t3 = Math.max(1.5, cue(2, "ba", 1, 1.3) + 0.1);
      return `${hideFrom(from, upto)}
  tl.set($("tflash"), { opacity: 0.55 }, 0); tl.to($("tflash"), { opacity: 0, duration: 0.3 }, 0.05);
  tl.set($("tagDay"), { textContent: "9:10…" }, 0.15); tl.set($("clock"), { textContent: "Thứ Hai 9:10" }, 0.15);
  tl.fromTo($("tagDay"), { scale: 1.15 }, { scale: 1, duration: 0.3, ease: "power2.out" }, 0.15);
  show(${b2}, 0.15); type(${b2}, 0.15, 0.45); typingHands(0.15, 0.45);
  show(${b2 + 1}, 0.65); show(${b2 + 2}, 0.7); show(${b2 + 3}, 0.72); show(${b2 + 4}, 0.74); show(${b2 + 5}, 0.95);
  scrollTo(${scrollFor(b2 + 6)}, 0.6);
  tl.fromTo($("tflash"), { opacity: 0.7 }, { opacity: 0, duration: 0.5 }, 0.95);
  tl.set($("tagDay"), { textContent: "9:25…" }, ${r2(t3)}); tl.set($("clock"), { textContent: "Thứ Hai 9:25" }, ${r2(t3)});
  tl.fromTo($("tagDay"), { scale: 1.15 }, { scale: 1, duration: 0.3, ease: "power2.out" }, ${r2(t3)});
  show(${b3}, ${r2(t3)}); type(${b3}, ${r2(t3)}, 0.45); typingHands(${r2(t3)}, 0.45);
  show(${b3 + 1}, ${r2(t3 + 0.5)}); show(${b3 + 2}, ${r2(t3 + 0.55)}); show(${b3 + 3}, ${r2(t3 + 0.57)}); show(${b3 + 4}, ${r2(t3 + 0.59)}); show(${b3 + 5}, ${r2(t3 + 0.8)});
  scrollTo(${scrollFor(b3 + 6)}, ${r2(t3 + 0.45)});
  tl.fromTo($("tflash"), { opacity: 0.7 }, { opacity: 0.5, duration: 0.5 }, ${r2(t3 + 0.8)});`;
    } });
}

// 3 — read: push in on the error line, highlight, label
FR.push({ n: 3, id: "03-read", start: { ...S0, zoom: { s: 1, ...Z3 } }, upto: UP3, clock: "Thứ Hai 9:25",
  world: hide(HL3),
  overlay: OV.tagDay.replace("Thứ Hai · 9:00", "9:25…") + hide(OV.card3) + hide(OV.q3),
  script: () => `${fadeOut(["tagDay"])}
  tl.set($("tflash"), { opacity: 0.5 }, 0); tl.to($("tflash"), { opacity: 0, duration: 0.6 }, 0);
  zoom(1.3, 0.1, 1.4); hands(0.35, 0.1, 0.9);
  tl.fromTo($("hl3"), { opacity: 0, scaleX: 0, transformOrigin: "0% 50%" }, { opacity: 1, scaleX: 1, duration: 0.5, ease: "power3.out" }, ${r2(Math.max(0.6, cue(3, "lỗi", 1, 0.6)))});
  fadeIn($("card3"), ${r2(cue(3, "cổng", 1, 2.0))});
  pop($("q3"), ${r2(cue(3, "nhưng", 1, 4.0))});` });

// 4 — turn: zoom out, hands drop, swivel to chị Mai, she looks over, bubble
FR.push({ n: 4, id: "04-turn", start: { cam: CAM.mon, zoom: { s: 1.3, ...Z3 }, hands: 0.35 }, upto: UP3, clock: "Thứ Hai 9:25",
  world: HL3 + hide(OV.bubPov),
  overlay: OV.card3 + OV.q3 + hide(OV.tagMai),
  script: () => `${fadeOut(["card3", "q3", "hl3"])}
  zoom(1, 0, 0.55); hands(1, 0.2, 0.6);
  pan(${CAM.col}, 0.45, 1.0);
  tl.set($("mai-eyes"), { x: 24 }, 0);
  tl.to($("mai-eyes"), { x: 0, duration: 0.35, ease: "power2.out" }, 1.35);
  tl.fromTo($("mai-head"), { rotation: 4, svgOrigin: "1860 820" }, { rotation: 0, duration: 0.5, ease: "power2.out" }, 1.25);
  fadeIn($("tagMai"), ${r2(Math.max(1.5, cue(4, "mình", 1, 1.0)))});
  pop($("bubPov"), ${r2(Math.max(1.9, cue(4, "chị", 2, 2.3)))}, 0.7);` });

// 5 — realize: chị Mai only nods; lightbulb + "Khoan đã!"
FR.push({ n: 5, id: "05-realize", start: { cam: CAM.col, zoom: { s: 1, x: 540, y: 700 }, hands: 1 }, upto: UP3, clock: "Thứ Hai 9:25",
  world: OV.bubPov,
  overlay: OV.tagMai + hide(OV.bulb) + hide(OV.khoan),
  script: () => {
    const tK = Math.max(0.05, cue(5, "khoan", 1, 0.1));
    return `${fadeOut(["bubPov", "tagMai"], 0, 0.25)}
  pop($("bulb"), ${r2(tK)}, 0.3); pop($("khoan"), ${r2(tK + 0.15)}, 0.7);
  tl.to($("mai-head"), { rotation: -3, y: 8, svgOrigin: "1860 820", duration: 0.18, ease: "power1.inOut" }, 0.7);
  tl.to($("mai-head"), { rotation: 0, y: 0, duration: 0.18, ease: "power1.inOut" }, 0.88);
  tl.to($("mai-head"), { rotation: -3, y: 8, duration: 0.18, ease: "power1.inOut" }, 1.06);
  tl.to($("mai-head"), { rotation: 0, y: 0, duration: 0.18, ease: "power1.inOut" }, 1.24);`;
  } });

// 6 — find: swivel back, lsof, highlight the culprit row, sticker
{
  const from = idx("lsof");
  FR.push({ n: 6, id: "06-find", start: { cam: CAM.col, zoom: { s: 1, ...Z6 }, hands: 1 }, upto: UP6, scroll0: from, clock: "Thứ Hai 9:25",
    world: hide(HL6),
    overlay: OV.bulb + OV.khoan + hide(OV.stk) + hide(OV.arrow),
    script: () => `${hideFrom(from, UP6)}
${fadeOut(["bulb", "khoan"])}
  pan(${CAM.mon}, 0, 0.85); hands(0, 0.45, 0.55);
  fadeIn($("chip"), 0.9, 0.3);
  show(${from}, 1.0); type(${from}, 1.0, 0.75); typingHands(1.0, 0.75);
  scrollTo(${scrollFor(UP6)}, 0.95);
  show(${from + 1}, 1.85); show(${from + 2}, 1.9);
  zoom(1.15, 2.0, 0.8);
  tl.fromTo($("hl6"), { opacity: 0, scaleX: 0, transformOrigin: "0% 50%" }, { opacity: 1, scaleX: 1, duration: 0.5, ease: "power3.out" }, 2.2);
  gsap.set($("stk"), { rotation: -4 });
  pop($("stk"), ${r2(Math.max(2.5, cue(6, "chương", 1, 2.5)))}, 0.7); fadeIn($("arrow"), ${r2(Math.max(2.6, cue(6, "chương", 1, 2.5) + 0.15))});` });
}

// 7 — fix: kill + rerun → green
{
  const from = idx("kill"), upto = idx("ok") + 1, r4 = idx("run4");
  FR.push({ n: 7, id: "07-fix", start: { cam: CAM.mon, zoom: { s: 1.15, ...Z6 }, hands: 0 }, upto, scroll0: from, chip: true, clock: "Thứ Hai 9:25",
    world: HL6,
    overlay: OV.stk + OV.arrow + hide(OV.tagOk) + hide(OV.tick),
    script: () => {
      const tG = Math.max(1.7, cue(7, "xanh", 1, 1.6));
      return `${hideFrom(from, upto)}
  gsap.set($("stk"), { rotation: -4 });
${fadeOut(["stk", "arrow", "hl6"])}
  zoom(1, 0, 0.45);
  show(${from}, 0.3); type(${from}, 0.3, 0.45); typingHands(0.3, 0.45);
  scrollTo(${scrollFor(from + 1)}, 0.3);
  tl.set($("clock"), { textContent: "Thứ Hai 9:30" }, 0.9);
  show(${r4}, 0.9); type(${r4}, 0.9, 0.45); typingHands(0.9, 0.45);
  scrollTo(${scrollFor(upto)}, 1.35);
  show(${r4 + 1}, 1.4); show(${r4 + 2}, 1.45); show(${r4 + 3}, 1.48); show(${r4 + 4}, 1.5);
  show(${upto - 1}, ${r2(tG)});
  fadeIn($("tagOk"), ${r2(tG)}); pop($("tick"), ${r2(tG + 0.1)}, 0.4);`;
    } });
}

// 8 — colleague: swivel to chị Mai, she laughs + thumbs up, bubble
FR.push({ n: 8, id: "08-colleague", start: { cam: CAM.mon, zoom: { s: 1, x: 540, y: 700 }, hands: 0 }, upto: idx("ok") + 1, chip: true, clock: "Thứ Hai 9:30",
  world: hide(OV.bubMai),
  overlay: OV.tagOk + OV.tick,
  script: () => `${fadeOut(["tagOk", "tick"])}
  hands(1, 0, 0.5); pan(${CAM.col}, 0.1, 0.85);
  tl.to($("mai-smile"), { opacity: 0, duration: 0.1 }, 0.85); tl.to($("mai-laugh"), { opacity: 1, duration: 0.1 }, 0.85);
  tl.to($("mai-head"), { y: -6, duration: 0.12, repeat: 5, yoyo: true, ease: "sine.inOut" }, 0.9);
  pop($("mai-thumb"), 1.0, 0.5);
  pop($("bubMai"), ${r2(Math.max(1.0, cue(8, "chị", 1, 1.0)))}, 0.7);` });

// 9 — takeaway: chị Mai's pose carries over, then swivel back and push in on the rubber duck
FR.push({ n: 9, id: "09-takeaway", start: { cam: CAM.col, zoom: { s: 1, x: ZOOM_DUCK.x, y: ZOOM_DUCK.y }, hands: 1 }, upto: idx("ok") + 1, chip: true, clock: "Thứ Hai 9:31",
  world: OV.bubMai,
  overlay: hide(OV.meo),
  script: () => {
    const tD = Math.max(1.2, cue(9, "vịt", 1, 1.0));
    return `  tl.set($("mai-thumb"), { opacity: 1 }, 0); tl.set($("mai-laugh"), { opacity: 1 }, 0); tl.set($("mai-smile"), { opacity: 0 }, 0);
${fadeOut(["bubMai", "mai-thumb"])}
  tl.to($("mai-laugh"), { opacity: 0, duration: 0.1 }, 0.4); tl.to($("mai-smile"), { opacity: 1, duration: 0.1 }, 0.4);
  pan(${CAM.mon}, 0.1, 0.85);
  zoom(1.2, 1.0, 1.1);
  pop($("duck"), ${r2(tD)}, 0.3);
  tl.to($("duck"), { rotation: -8, transformOrigin: "50% 100%", duration: 0.25, yoyo: true, repeat: 3, ease: "sine.inOut" }, ${r2(tD + 0.45)});
  fadeIn($("meo"), ${r2(Math.max(0.9, cue(9, "mẹo", 1, 0.6)))});`;
  } });

// 10 — question: back to the screen, caret blinks
{
  const upto = L.length;
  FR.push({ n: 10, id: "10-question", start: { cam: CAM.mon, zoom: { s: 1.2, x: ZOOM_DUCK.x, y: ZOOM_DUCK.y }, hands: 1 }, upto, scroll0: upto - 1, chip: true, clock: "Thứ Hai 9:31",
    overlay: OV.meo + hide(OV.ask),
    script: (P, n, D) => {
      const blinks = [];
      for (let t = 0.6, k = 0; t < D - 0.2; t += 0.5, k++) blinks.push(`  tl.set($("caret"), { opacity: ${k % 2 ? 1 : 0} }, ${r2(t)});`);
      return `  tl.set($("duck"), { opacity: 1 }, 0);
${fadeOut(["meo"])}
  zoom(1, 0, 0.7); hands(0, 0.2, 0.55);
  tl.set($("ln-" + ${upto - 1}), { opacity: 0 }, 0); show(${upto - 1}, 0.3); scrollTo(${scrollFor(upto)}, 0.3);
  fadeIn($("ask"), ${r2(Math.max(0.5, cue(10, "bạn", 1, 0.4)))});
${blinks.join("\n")}`;
    } });
}

// ── write ─────────────────────────────────────────────────────────────────────
const outDir = join(ROOT, "compositions", "frames");
mkdirSync(outDir, { recursive: true });
for (const f of FR) {
  writeFileSync(join(outDir, `${f.id}.html`), frameFile(f));
  console.log(`wrote ${f.id}.html (${SB.scenes[f.n - 1].duration}s, terminal lines ${f.upto})`);
}
console.log(META.voices.length ? `cues from audio_meta.json (${META.voices.length} voices)` : "WARN no audio_meta.json — fallback cue times used");
