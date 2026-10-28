#!/usr/bin/env node
// Generates compositions/frames/NN-*.html for "loi-production-sau-release" from one shared
// world (same desk world as videos/it/dev-local-port-bug): our desk with monitor, keyboard,
// mouse and a milk tea on the left; chị Mai's desk on the right with anh Quân standing beside
// it. The camera pans between the two (x = 0 / 1320), the wall moves slower (parallax), POV
// hands live in a screen-space layer. Screen content (checkout, chat, video call, editor,
// change history, report) is HTML inside the monitor. Frame 13 swaps the desk world for a meeting room
// (ROOM): the same screen markup, scaled onto a wall screen, with the team around a table. A failed-orders counter ("HUD") rides
// in the overlay layer from frame 2 to the start of frame 9.
// Reveal cues come from audio_meta.json word timings (frame-relative seconds).
//
//   node tools/gen-frames.mjs        (run from the HyperFrames project root)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SB = JSON.parse(readFileSync(join(ROOT, "../../../content/it/loi-production-sau-release/storyboard.json"), "utf8"));
const META = existsSync(join(ROOT, "audio_meta.json")) ? JSON.parse(readFileSync(join(ROOT, "audio_meta.json"), "utf8")) : { voices: [] };
const W = 1080, H = 1920;
const C = { bg: "#0F1E33", navySoft: "#1B2E4A", teal: "#14B8A6", text: "#F5EFE4", muted: "#B8C4D3", light: "#8796A9",
  err: "#E5534B", errText: "#FF8A80", ok: "#3FB68B", warn: "#F2A93B", desk: "#22344F", deskEdge: "#2C4262", ink: "#0F1E33" };

const norm = (s) => String(s).normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
const voice = (frame) => META.voices.find((x) => x.frame === frame);
function word(frame, w, nth = 1) {
  const v = voice(frame);
  if (!v) return null;
  let seen = 0;
  for (const x of v.words) if (norm(x.text) === norm(w) && ++seen === nth) return x;
  return null;
}
const cue = (frame, w, nth = 1, fallback = 0) => word(frame, w, nth)?.start ?? fallback;
const cueEnd = (frame, w, nth = 1, fallback = 0) => word(frame, w, nth)?.end ?? fallback;
const voiceEnd = (frame, fallback) => { const v = voice(frame); return v?.words?.length ? v.words[v.words.length - 1].end : fallback; };
const r2 = (n) => Math.round(n * 100) / 100;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ── world geometry (shared with dev-local-port-bug) ───────────────────────────
const CAM = { mon: 0, col: 1320 };
const PARALLAX = 0.55;
const MON = { x: 50, y: 240, w: 980, h: 760 };
const SCR = { x: MON.x + 18, y: MON.y + 18, w: MON.w - 36, h: MON.h - 36 };
const TEA = { x: 800, y: 1010 };              // milk tea cup (world, our desk, right of the monitor stand)
const ZOOM_HOOK = { x: 540, y: 760 };          // checkout field + red banner
const ZOOM_BOSS = { x: 540, y: 600 };          // boss tile in the call
const ZOOM_TEA = { x: 540, y: 1170 };
const CAM_TEA = 360;                          // pan that puts the cup (world x ≈ 900) mid-frame
const ZOOM_ROW = { x: 540, y: 600 };
const ZOOM_NAME = { x: 190, y: 560 };          // the author cell "minh · thứ Ba": the crash zoom grows it in place

// ── SVG pieces ────────────────────────────────────────────────────────────────
const SKIN = "#E8B48F", SKIN_D = "#CF9572";
const MAI_SKIN = "#D9A07A", MAI_SKIN_D = "#BF845F";
const QUAN_SKIN = "#C98F68", QUAN_SKIN_D = "#AE7652";
const BOSS_SKIN = "#E0A986", BOSS_SKIN_D = "#C48C69";

const tick = (size, color = C.ok, ink = C.ink) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="${color}"/><path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const cross = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="${C.err}"/><path d="M8 8l8 8M16 8l-8 8" stroke="#FFF6F0" stroke-width="2.6" stroke-linecap="round"/></svg>`;

const wallSvg = (P) => `
<svg width="2400" height="${H}" viewBox="0 0 2400 ${H}" style="position:absolute;left:0;top:0;">
  <defs>
    <linearGradient id="${P}wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A2D48"/><stop offset="1" stop-color="#0F1E33"/></linearGradient>
    <radialGradient id="${P}sun" cx="0.38" cy="0.12" r="0.5"><stop offset="0" stop-color="#F5EFE4" stop-opacity="0.13"/><stop offset="1" stop-color="#F5EFE4" stop-opacity="0"/></radialGradient>
    <linearGradient id="${P}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2A93B" stop-opacity="0.35"/><stop offset="1" stop-color="#14B8A6" stop-opacity="0.12"/></linearGradient>
    <linearGradient id="${P}nightsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050A14"/><stop offset="1" stop-color="#0E1A33"/></linearGradient>
  </defs>
  <rect width="2400" height="${H}" fill="url(#${P}wall)"/>
  <rect width="2400" height="${H}" fill="url(#${P}sun)"/>
  <g transform="translate(760 110)">
    <rect width="330" height="430" rx="12" fill="url(#${P}sky)"/>
    <g id="${P}night" opacity="0"><rect width="330" height="430" rx="12" fill="url(#${P}nightsky)"/>
      ${[[40, 60], [120, 40], [220, 90], [280, 30], [70, 170], [250, 200], [160, 140]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#F5EFE4" fill-opacity="0.8"/>`).join("")}
      <circle cx="250" cy="110" r="26" fill="#F5EFE4" fill-opacity="0.85"/><circle cx="262" cy="102" r="24" fill="#0B1528"/></g>
    <rect width="330" height="430" rx="12" fill="none" stroke="#F5EFE4" stroke-opacity="0.14" stroke-width="4"/>
    <path d="M165 0v430 M0 215h330" stroke="#F5EFE4" stroke-opacity="0.14" stroke-width="4"/></g>
  <g transform="translate(1500 380)"><rect x="0" y="80" width="300" height="16" rx="6" fill="#2C4262"/><rect x="40" y="10" width="70" height="70" rx="12" fill="#14B8A6" fill-opacity="0.5"/><path d="M75 10 C 60 -30 90 -40 75 -60 M75 10 C 95 -20 110 -10 120 -40 M75 10 C 50 -10 40 -30 30 -35" stroke="#3FB68B" stroke-width="10" fill="none" stroke-linecap="round"/><rect x="150" y="30" width="110" height="50" rx="6" fill="#F5EFE4" fill-opacity="0.18"/></g>
</svg>`;

function keyboardSvg(P) {
  const top = { y: 1300, x0: 160, x1: 920 }, bot = { y: 1560, x0: 100, x1: 980 };
  const lerp = (a, b, t) => a + (b - a) * t;
  let keys = "";
  for (let r = 0; r < 5; r++) {
    const t0 = (r + 0.18) / 5, t1 = (r + 0.86) / 5;
    const y0 = lerp(top.y, bot.y, t0), y1 = lerp(top.y, bot.y, t1);
    const xa0 = lerp(top.x0, bot.x0, t0) + 22, xb0 = lerp(top.x1, bot.x1, t0) - 22;
    const xa1 = lerp(top.x0, bot.x0, t1) + 22, xb1 = lerp(top.x1, bot.x1, t1) - 22;
    const n = r === 4 ? 1 : 14;
    for (let c = 0; c < n; c++) {
      const f0 = r === 4 ? 0.25 : (c + 0.12) / n, f1 = r === 4 ? 0.75 : (c + 0.88) / n;
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

const monitorSvg = () => `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0;">
  <rect x="490" y="${MON.y + MON.h - 4}" width="100" height="120" fill="#0A1424"/>
  <ellipse cx="540" cy="${MON.y + MON.h + 120}" rx="170" ry="26" fill="#0A1424"/>
  <rect x="${MON.x}" y="${MON.y}" width="${MON.w}" height="${MON.h}" rx="22" fill="#070D17" stroke="#F5EFE4" stroke-opacity="0.14" stroke-width="3"/>
</svg>`;

// milk tea: brown tea + ice (fresh) → pale tea, no ice (melted). Straw still in its wrapper on the lid.
const teaSvg = (P) => `
<svg id="${P}tea" width="200" height="300" viewBox="0 0 200 300" style="position:absolute;left:${TEA.x}px;top:${TEA.y}px;overflow:visible;">
  <ellipse cx="100" cy="282" rx="70" ry="12" fill="#0A1424" fill-opacity="0.5"/>
  <path d="M34 40 L166 40 L150 280 L50 280 Z" fill="#F5EFE4" fill-opacity="0.16" stroke="#F5EFE4" stroke-opacity="0.55" stroke-width="4" stroke-linejoin="round"/>
  <path id="${P}tea-fill" d="M40 90 L160 90 L150 276 L50 276 Z" fill="#B07A4F"/>
  <path id="${P}tea-pale" d="M40 90 L160 90 L150 276 L50 276 Z" fill="#D9C2A5" opacity="0"/>
  <g id="${P}tea-ice" fill="#F5EFE4" fill-opacity="0.75" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="2">
    <rect x="52" y="78" width="38" height="34" rx="8" transform="rotate(-12 71 95)"/><rect x="102" y="74" width="40" height="36" rx="8" transform="rotate(10 122 92)"/>
    <rect x="76" y="118" width="36" height="32" rx="8" transform="rotate(6 94 134)"/><rect x="118" y="124" width="30" height="28" rx="8" transform="rotate(-8 133 138)"/></g>
  <g fill="#2A1A12">${[[66, 258], [86, 262], [106, 258], [126, 262], [76, 244], [98, 246], [120, 244], [140, 252], [58, 248]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9"/>`).join("")}</g>
  <rect x="26" y="28" width="148" height="18" rx="8" fill="#F5EFE4" fill-opacity="0.9"/>
  <g transform="rotate(-24 100 20)"><rect x="40" y="10" width="150" height="16" rx="8" fill="#F5EFE4"/><path d="M60 10 v16 M80 10 v16 M100 10 v16 M120 10 v16 M140 10 v16 M160 10 v16" stroke="${C.teal}" stroke-width="5"/></g>
</svg>`;

// chị Mai at the neighbouring desk (world x ≈ 1860); optional test phone in her right hand
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
    <g id="${P}mai-talk" opacity="0"><ellipse cx="1860" cy="776" rx="16" ry="12" fill="#7A3B2E"/></g>
  </g>
  <path d="M1712 1000 C 1690 1060 1690 1120 1720 1160 L1800 1164" stroke="#F5EFE4" stroke-width="54" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="1812" cy="1160" rx="34" ry="22" fill="${MAI_SKIN}" stroke="${MAI_SKIN_D}" stroke-width="3"/>
  <g id="${P}mai-armr">
    <path d="M2008 1000 C 2034 1060 2040 1110 2030 1150 L2090 1150" stroke="#F5EFE4" stroke-width="54" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="2098" cy="1146" rx="32" ry="22" fill="${MAI_SKIN}" stroke="${MAI_SKIN_D}" stroke-width="3"/>
  </g>
  <g id="${P}mai-phone" opacity="0"><rect x="2066" y="990" width="70" height="128" rx="12" fill="#0B1424" stroke="#F5EFE4" stroke-opacity="0.6" stroke-width="4"/><rect x="2074" y="1002" width="54" height="100" rx="6" fill="${C.teal}" fill-opacity="0.45"/></g>
  <g id="${P}mai-thumb" opacity="0"><path d="M2030 1170 L2074 992" stroke="#F5EFE4" stroke-width="50" stroke-linecap="round"/><rect x="2030" y="930" width="92" height="70" rx="26" fill="${MAI_SKIN}" stroke="${MAI_SKIN_D}" stroke-width="3"/><path d="M2048 948 h58 M2048 966 h58 M2048 984 h58" stroke="${MAI_SKIN_D}" stroke-width="3" stroke-linecap="round"/><rect x="2036" y="858" width="30" height="86" rx="15" fill="${MAI_SKIN}" stroke="${MAI_SKIN_D}" stroke-width="3" transform="rotate(-12 2051 944)"/></g>
  <g id="${P}mai-palm" opacity="0"><path d="M2010 1080 L2040 860" stroke="#F5EFE4" stroke-width="50" stroke-linecap="round"/><rect x="2002" y="760" width="86" height="100" rx="30" fill="${MAI_SKIN}" stroke="${MAI_SKIN_D}" stroke-width="3"/>${[0, 1, 2, 3].map((i) => `<rect x="${2006 + i * 21}" y="${712 - (i === 1 || i === 2 ? 8 : 0)}" width="18" height="60" rx="9" fill="${MAI_SKIN}" stroke="${MAI_SKIN_D}" stroke-width="3"/>`).join("")}</g>
  <rect x="1400" y="1150" width="1000" height="40" fill="${C.deskEdge}"/>
  <g transform="translate(1530 1060)"><rect width="70" height="86" rx="10" fill="#F5EFE4" fill-opacity="0.85"/><path d="M70 22 c 26 0 26 40 0 40" stroke="#F5EFE4" stroke-opacity="0.85" stroke-width="9" fill="none"/></g>
</svg>`;

// anh Quân standing to the right of chị Mai (world x ≈ 2250)
const quanSvg = (P) => `
<svg width="420" height="${H}" viewBox="2040 0 420 ${H}" style="position:absolute;left:2040px;top:0;">
  <path d="M2120 1150 C 2120 900 2160 820 2250 812 C 2340 820 2380 900 2380 1150 Z" fill="#1E4E5C"/>
  <path d="M2216 816 L2250 870 L2284 816" stroke="#F5EFE4" stroke-opacity="0.85" stroke-width="7" fill="none" stroke-linejoin="round"/>
  <path d="M2226 830 L2250 1010 L2274 830" stroke="${C.warn}" stroke-width="6" fill="none"/><rect x="2232" y="1004" width="36" height="46" rx="6" fill="#F5EFE4"/>
  <g id="${P}quan-head">
    <rect x="2228" y="740" width="44" height="80" rx="16" fill="${QUAN_SKIN}"/>
    <ellipse cx="2250" cy="660" rx="88" ry="98" fill="${QUAN_SKIN}" stroke="${QUAN_SKIN_D}" stroke-width="3"/>
    <path d="M2162 640 C 2160 560 2212 536 2256 540 C 2312 544 2344 578 2340 640 C 2320 604 2290 590 2250 592 C 2210 594 2180 610 2162 640 Z" fill="#1A1412"/>
    <g id="${P}quan-eyes"><ellipse cx="2218" cy="664" rx="9" ry="12" fill="#1A1412"/><ellipse cx="2282" cy="664" rx="9" ry="12" fill="#1A1412"/></g>
    <rect x="2190" y="644" width="56" height="40" rx="12" fill="none" stroke="#0A1424" stroke-width="5"/><rect x="2254" y="644" width="56" height="40" rx="12" fill="none" stroke="#0A1424" stroke-width="5"/><path d="M2246 660 h8" stroke="#0A1424" stroke-width="5"/>
    <path id="${P}quan-mouth" d="M2228 716 q22 10 44 0" stroke="#5A2E22" stroke-width="6" fill="none" stroke-linecap="round"/>
    <g id="${P}quan-talk" opacity="0"><ellipse cx="2250" cy="720" rx="15" ry="11" fill="#5A2E22"/></g>
  </g>
  <g id="${P}quan-armdown"><path d="M2140 900 C 2112 980 2110 1060 2124 1130" stroke="#1E4E5C" stroke-width="56" fill="none" stroke-linecap="round"/><ellipse cx="2126" cy="1140" rx="30" ry="24" fill="${QUAN_SKIN}" stroke="${QUAN_SKIN_D}" stroke-width="3"/></g>
  <g id="${P}quan-armup" opacity="0"><path d="M2140 900 C 2090 840 2084 760 2096 700" stroke="#1E4E5C" stroke-width="56" fill="none" stroke-linecap="round"/><rect x="2056" y="600" width="80" height="96" rx="28" fill="${QUAN_SKIN}" stroke="${QUAN_SKIN_D}" stroke-width="3"/>${[0, 1, 2, 3].map((i) => `<rect x="${2058 + i * 19}" y="${556 - (i === 1 || i === 2 ? 8 : 0)}" width="17" height="58" rx="8" fill="${QUAN_SKIN}" stroke="${QUAN_SKIN_D}" stroke-width="3"/>`).join("")}</g>
  <path d="M2360 900 C 2388 980 2390 1060 2376 1130" stroke="#1E4E5C" stroke-width="56" fill="none" stroke-linecap="round"/><ellipse cx="2374" cy="1140" rx="30" ry="24" fill="${QUAN_SKIN}" stroke="${QUAN_SKIN_D}" stroke-width="3"/>
</svg>`;

const handsSvg = (P) => {
  const hand = (x, flip) => `<g transform="${flip ? `translate(${2 * x} 0) scale(-1 1)` : ""}">
    <path d="M${x - 260} 1980 L${x - 120} 1600 L${x + 20} 1650 L${x - 80} 1980 Z" fill="${C.navySoft}"/>
    <path d="M${x - 196} 1792 L${x - 40} 1830" stroke="${C.teal}" stroke-opacity="0.55" stroke-width="14" stroke-linecap="round"/>
    <path d="M${x - 130} 1610 C ${x - 140} 1520 ${x - 60} 1440 ${x + 30} 1440 C ${x + 110} 1440 ${x + 150} 1500 ${x + 120} 1570 C ${x + 90} 1640 ${x - 20} 1680 ${x - 130} 1610 Z" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${x - 40 + i * 42}" y="${1416 - (i === 1 || i === 2 ? 14 : 0)}" width="36" height="64" rx="18" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/>`).join("")}
    <rect x="${x + 100}" y="1500" width="34" height="80" rx="17" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3" transform="rotate(-50 ${x + 117} 1540)"/>
  </g>`;
  // raised open palm for the high-five (frame 11), screen space
  const palm = `<g id="${P}palm" opacity="0">
    <path d="M760 1980 L700 1320" stroke="${C.navySoft}" stroke-width="120" stroke-linecap="round"/>
    <rect x="610" y="1150" width="180" height="200" rx="60" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="4"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${614 + i * 44}" y="${1050 - (i === 1 || i === 2 ? 18 : 0)}" width="40" height="124" rx="20" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="4"/>`).join("")}
    <rect x="770" y="1200" width="40" height="110" rx="20" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="4" transform="rotate(35 790 1255)"/></g>`;
  return `<svg width="${W}" height="${H + 100}" viewBox="0 0 ${W} ${H + 100}" style="position:absolute;left:0;top:0;">
    <g id="${P}hand-l">${hand(330, false)}</g><g id="${P}hand-r">${hand(750, true)}</g>${palm}
  </svg>`;
};

// ── screen apps (HTML inside the monitor; one is visible at a time) ──────────
const BOSS_FACE = (P, big) => `
<svg viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" style="position:absolute;inset:0;">
  <rect x="20" y="20" width="110" height="200" rx="8" fill="#22344F"/><rect x="30" y="40" width="90" height="10" fill="#3A5374"/><rect x="30" y="90" width="90" height="10" fill="#3A5374"/><rect x="30" y="140" width="90" height="10" fill="#3A5374"/>
  <rect x="40" y="56" width="14" height="34" fill="${C.warn}" fill-opacity="0.6"/><rect x="58" y="60" width="12" height="30" fill="${C.teal}" fill-opacity="0.6"/><rect x="74" y="106" width="16" height="34" fill="#B8C4D3" fill-opacity="0.5"/>
  <path d="M110 300 C 120 230 160 205 200 202 C 240 205 280 230 290 300 Z" fill="#3A4A63"/>
  <path d="M180 206 L200 250 L220 206" fill="#F5EFE4"/><path d="M196 214 L204 214 L208 268 L200 280 L192 268 Z" fill="#1E4E5C"/>
  <g id="${P}${big}-head">
    <rect x="184" y="172" width="32" height="40" rx="12" fill="${BOSS_SKIN}"/>
    <ellipse cx="200" cy="130" rx="58" ry="66" fill="${BOSS_SKIN}" stroke="${BOSS_SKIN_D}" stroke-width="2"/>
    <path d="M142 120 C 140 70 174 56 202 58 C 236 60 260 78 258 120 C 252 98 240 90 228 88 C 210 84 186 86 170 92 C 156 98 148 108 142 120 Z" fill="#4A4A52"/>
    <rect x="160" y="118" width="34" height="24" rx="7" fill="none" stroke="#1A1412" stroke-width="3.5"/><rect x="206" y="118" width="34" height="24" rx="7" fill="none" stroke="#1A1412" stroke-width="3.5"/><path d="M194 128 h12" stroke="#1A1412" stroke-width="3.5"/>
    <ellipse cx="177" cy="130" rx="5" ry="6" fill="#1A1412"/><ellipse cx="223" cy="130" rx="5" ry="6" fill="#1A1412"/>
    <path d="M164 108 l24 -4 M212 104 l24 4" stroke="#2A2A30" stroke-width="5" stroke-linecap="round"/>
    <path id="${P}${big}-mouth" d="M186 170 h28" stroke="#6A3328" stroke-width="5" stroke-linecap="round"/>
    <ellipse id="${P}${big}-talk" cx="200" cy="170" rx="11" ry="8" fill="#6A3328" opacity="0"/>
  </g>
</svg>`;
const TEAM_FACES = `
<svg viewBox="0 0 300 120" width="100%" height="100%" style="position:absolute;inset:0;">
  ${[[60, "#2A2320", MAI_SKIN], [150, "#1A1412", SKIN], [240, "#1A1412", QUAN_SKIN]].map(([x, hair, skin]) => `<path d="M${x - 40} 120 C ${x - 36} 92 ${x - 20} 84 ${x} 84 C ${x + 20} 84 ${x + 36} 92 ${x + 40} 120 Z" fill="#3A5374"/><circle cx="${x}" cy="60" r="26" fill="${skin}"/><path d="M${x - 26} 56 C ${x - 26} 30 ${x + 26} 30 ${x + 26} 56 C ${x + 14} 44 ${x - 14} 44 ${x - 26} 56 Z" fill="${hair}"/>`).join("")}
</svg>`;
const MIC_OFF = `<svg width="26" height="26" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="#F5EFE4"/><path d="M6 11a6 6 0 0 0 12 0 M12 17v4" stroke="#F5EFE4" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M4 3l16 18" stroke="${C.err}" stroke-width="2.6" stroke-linecap="round"/></svg>`;
const MIC_ON = `<svg width="26" height="26" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="#0F1E33"/><path d="M6 11a6 6 0 0 0 12 0 M12 17v4" stroke="#0F1E33" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;

// "Giỏ Hời": the fictional shop (no real brand, name, colours or layout)
const CART = (size, color = "#0B1424") => `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M2.5 4h2.6l2.2 10.2h10.4l2-7.2H6.4" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="18.8" r="1.7" fill="${color}"/><circle cx="16.8" cy="18.8" r="1.7" fill="${color}"/><path d="M11 9.5l1.6 1.6 3.2-3.2" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const HEADPHONES = `<svg width="84" height="84" viewBox="0 0 84 84"><rect width="84" height="84" rx="16" fill="#F5EFE4" fill-opacity="0.92"/><path d="M20 50 V40 a22 22 0 0 1 44 0 V50" fill="none" stroke="#1B2E4A" stroke-width="7" stroke-linecap="round"/><rect x="14" y="46" width="16" height="24" rx="7" fill="#14B8A6"/><rect x="54" y="46" width="16" height="24" rx="7" fill="#14B8A6"/></svg>`;

// code shared by the editor and the change-history view
const CODE = [
  ["", "function thanhToan(donHang, maGiamGia) {"],
  ["", "  const tong = tinhTong(donHang);"],
  ["bad", "  const ma = maGiamGia.trim();"],
  ["", "  const giam = ma ? layMucGiam(ma) : 0;"],
  ["", "  return taoThanhToan(tong - giam);"],
  ["", "}"],
];
const BLAME = [
  ["lan", "thứ Hai", "import { tinhTong } from \"./gio-hang\";"],
  ["tuan", "thứ Hai", "import { layMucGiam } from \"./khuyen-mai\";"],
  ["hoa", "thứ Hai", ""],
  ["lan", "thứ Hai", "export function hienThiDon(donHang) {"],
  ["tuan", "thứ Hai", "  return veDon(donHang);"],
  ["lan", "thứ Hai", "}"],
  ["hoa", "thứ Ba", ""],
  ["tuan", "thứ Ba", "export function thanhToan(donHang, maGiamGia) {"],
  ["hoa", "thứ Ba", "  const tong = tinhTong(donHang);"],
  ["minh", "thứ Ba", "  const ma = maGiamGia.trim();"],
  ["lan", "thứ Ba", "  const giam = ma ? layMucGiam(ma) : 0;"],
  ["tuan", "thứ Tư", "  return taoThanhToan(tong - giam);"],
  ["tuan", "thứ Tư", "}"],
];
const BLAME_ROW = 9, BLAME_LH = 44, BLAME_TOP = 96;

const APPS = {
  checkout: (P, { ok = false } = {}) => `
<div id="${P}app-checkout" class="${P}app" style="background:#0E1C2E;">
  <div class="${P}ghtop">${CART(42)}<b>Giỏ Hời</b><span class="${P}ghsearch">Tìm deal hời…</span></div>
  <div class="${P}ghsale"><b>SIÊU SALE THỨ SÁU</b><span>GIẢM ĐẾN 50% · Kết thúc sau <i id="${P}cd">00:59:12</i></span></div>
  <div class="${P}ghitem">${HEADPHONES}<div><b>Tai nghe không dây</b><span><em>199.000 đ</em><s>399.000 đ</s></span></div><i class="${P}ghbadge">-50%</i></div>
  <div class="${P}lbl" style="top:340px;">Mã giảm giá</div>
  <div id="${P}codebox" class="${P}input" style="top:380px;height:76px;${ok ? "" : `border-color:${C.err};box-shadow:0 0 0 6px rgba(229,83,75,0.25);`}"><span style="color:#7C8AA0;">Nhập mã (không bắt buộc)</span></div>
  <div class="${P}btn" style="top:470px;height:72px;">THANH TOÁN</div>
  ${ok
    ? `<div class="${P}banner" style="top:560px;background:rgba(63,182,139,0.18);border-color:${C.ok};color:${C.ok};">${tick(56)}<span>Thanh toán thành công</span></div>`
    : `<div id="${P}banner" class="${P}banner" style="top:560px;">${cross(56)}<span>Thanh toán thất bại</span></div>`}
</div>`,
  chat: (P) => `
<div id="${P}app-chat" class="${P}app">
  <div class="${P}apptitle" style="font-size:34px;"># nhóm-thanh-toán</div>
  <div class="${P}msg" style="top:110px;"><i style="background:#1E4E5C;">Q</i><div><b>Anh Quân <small>16:35</small></b><p>Đã phát hành 5 tính năng mới cho Siêu Sale Thứ Sáu</p></div>
    <svg width="120" height="70" viewBox="0 0 120 70" style="position:absolute;right:30px;top:10px;">${[[10, 20, C.warn], [36, 50, C.teal], [62, 14, C.err], [88, 44, C.ok], [108, 22, C.warn], [50, 32, "#F5EFE4"]].map(([x, y, c], i) => `<rect x="${x}" y="${y}" width="12" height="7" rx="2" fill="${c}" transform="rotate(${i * 37} ${x + 6} ${y + 3})"/>`).join("")}</svg></div>
  ${[0, 1, 2].map((i) => `<div id="${P}pile-${i}" class="${P}msg ${P}pile" style="top:${250 + i * 92}px;opacity:0;"><i style="background:#3A5374;">${["L", "T", "H"][i]}</i><div><b>${["Lan", "Tuấn", "Hoa"][i]} <small>16:4${4 + i}</small></b><p style="color:#B8C4D3;">${["Khách báo lỗi thanh toán…", "Mình cũng thấy, đang xem…", "Ai đang xem lỗi này?"][i]}</p></div></div>`).join("")}
  <div id="${P}bossmsg" class="${P}msg" style="top:530px;opacity:0;border:3px solid ${C.err};"><i style="background:#3A4A63;">S</i><div><b>Sếp <small>16:45</small></b><p style="color:${C.text};font-weight:700;">Khách hàng lớn báo không thanh toán được!</p></div></div>
</div>`,
  call: (P) => `
<div id="${P}app-call" class="${P}app" style="background:#0B1424;">
  <div class="${P}calltop" data-layout-ignore><span style="width:14px;height:14px;border-radius:50%;background:${C.err};display:inline-block;"></span> Họp gấp · 00:01</div>
  <div id="${P}bosstile" class="${P}tile" style="left:20px;top:80px;width:904px;height:490px;">
    ${BOSS_FACE(P, "boss")}
    <div id="${P}ring" class="${P}ring"></div>
    <div class="${P}name" style="left:50%;transform:translateX(-50%);"><span id="${P}bossmic">${MIC_OFF}</span>Sếp</div>
  </div>
  <div id="${P}teamtile" class="${P}tile" style="left:584px;top:584px;width:340px;height:130px;">${TEAM_FACES}<div class="${P}name" style="font-size:20px;padding:4px 12px;">${MIC_OFF.replace('width="26" height="26"', 'width="18" height="18"')}Nhóm mình</div></div>
  <div class="${P}tile" style="left:20px;top:584px;width:540px;height:130px;background:#16263D;display:flex;align-items:center;padding:0 22px;gap:14px;font-size:24px;font-weight:600;color:${C.muted};">${MIC_OFF}${MIC_OFF}${MIC_OFF}<span>Mọi người đang tắt micro</span></div>
</div>`,
  split: (P) => `
<div id="${P}app-split" class="${P}app" style="background:#0B1424;">
  ${[["Máy của mình", tick(170), "rgba(63,182,139,0.12)", C.ok], ["Hệ thống thật", cross(170), "rgba(229,83,75,0.12)", C.err]].map(([lbl, icon, bg, bd], i) => `
  <div class="${P}half" style="left:${i ? 482 : 20}px;background:${bg};border-color:${bd};">
    <div class="${P}halflbl">${lbl}</div>
    <div class="${P}minibrand">${CART(28)}Giỏ Hời · Siêu Sale</div>
    <div class="${P}mini" style="top:150px;"><div class="${P}minifield">Mã giảm giá: <i>(để trống)</i></div><div class="${P}minibtn">Thanh toán</div></div>
    <div class="${P}halficon">${icon}</div>
  </div>`).join("")}
</div>`,
  editor: (P, { fixed = false } = {}) => `
<div id="${P}app-editor" class="${P}app" style="background:#0B1424;">
  <div class="${P}tabs" data-layout-ignore><span class="${P}tabon">thanh-toan.js</span><span>gio-hang.js</span></div>
  <div id="${P}code" class="${P}code" style="top:96px;">
    ${CODE.map(([cls, line], i) => {
      const text = fixed && cls === "bad" ? "  const ma = (maGiamGia ?? \"\").trim();" : line;
      const style = fixed && cls === "bad" ? `background:rgba(63,182,139,0.22);` : "";
      return `<div id="${P}cl-${i}" class="${P}cl" style="${style}"><span class="${P}ln">${12 + i}</span>${esc(text)}</div>`;
    }).join("")}
  </div>
  <div id="${P}qmark" data-layout-allow-overlap style="position:absolute;left:640px;top:200px;font-size:110px;font-weight:800;color:${C.warn};opacity:0;">?</div>
</div>`,
  blame: (P) => `
<div id="${P}app-blame" class="${P}app" style="background:#0B1424;">
  <div class="${P}tabs" data-layout-ignore><span class="${P}tabon">Lịch sử thay đổi · thanh-toan.js</span></div>
  <div class="${P}bclip" data-layout-ignore><div id="${P}bscroll" class="${P}bscroll">
    ${BLAME.map(([who, day, line], i) => `<div id="${P}br-${i}" class="${P}brow${i === BLAME_ROW ? ` ${P}bbad` : ""}" style="top:${i * BLAME_LH}px;"><span class="${P}who" id="${P}who-${i}">${who} · ${day}</span><span class="${P}bcode">${esc(line) || "&nbsp;"}</span></div>`).join("")}
  </div></div>
  <div class="${P}log" data-layout-ignore>TypeError: Cannot read properties of undefined (reading 'trim')</div>
</div>`,
  prlist: (P) => `
<div id="${P}app-prlist" class="${P}app" style="background:#0B1424;">
  <div class="${P}tabs" data-layout-ignore><span class="${P}tabon">Yêu cầu gộp code (Pull request)</span></div>
  <div style="position:absolute;left:24px;top:78px;font-size:30px;font-weight:800;">5 tính năng · Siêu Sale Thứ Sáu</div>
  ${[["#231", "Mã giảm giá cho Siêu Sale", "+128 −46"], ["#232", "Flash sale đếm ngược", "+96 −12"], ["#233", "Giỏ hàng nhanh", "+210 −88"], ["#234", "Thanh toán một chạm", "+64 −20"], ["#235", "Gợi ý deal hời", "+152 −31"]].map(([id, t, d], i) => `
  <div id="${P}pr-${i}" style="position:absolute;left:24px;right:24px;top:${136 + i * 104}px;height:90px;border-radius:14px;background:rgba(245,239,228,0.05);border:2px solid rgba(245,239,228,0.1);display:flex;align-items:center;gap:16px;padding:0 20px;">
    <b style="font-family:'JetBrains Mono';font-size:26px;color:${C.light};">${id}</b><span style="font-size:28px;font-weight:700;">${t}</span>
    <i style="margin-left:auto;font-style:normal;font-size:22px;font-weight:800;color:#0B1424;background:${C.teal};padding:4px 12px;border-radius:100px;">Đã gộp</i>
    <span style="font-family:'JetBrains Mono';font-size:22px;color:${C.ok};">${d}</span></div>`).join("")}
</div>`,
  diff: (P) => `
<div id="${P}app-diff" class="${P}app" style="background:#0B1424;">
  <div class="${P}tabs" data-layout-ignore><span class="${P}tabon">#231 · Các tệp thay đổi · +128 −46</span></div>
  <div data-layout-ignore style="position:absolute;left:0;right:0;top:70px;bottom:0;overflow:hidden;"><div id="${P}diffscroll" style="position:absolute;left:0;right:0;top:0;">
  ${Array.from({ length: 30 }, (_, i) => { const plus = i % 3 !== 1; const txt = ["const tong = tinhTong(donHang);", "if (!donHang.items.length) return;", "const giam = ma ? layMucGiam(ma) : 0;", "renderBanner(\"SIÊU SALE\");", "await capNhatKho(donHang);", "return taoThanhToan(tong - giam);"][i % 6]; return `<div style="height:44px;line-height:44px;font-family:'JetBrains Mono';font-size:22px;white-space:pre;padding-left:14px;background:${plus ? "rgba(63,182,139,0.14)" : "rgba(229,83,75,0.16)"};color:${plus ? "#9BE3C3" : "#FFB3AD"};">${plus ? "+" : "−"}  ${esc(txt)}</div>`; }).join("")}
  </div></div>
</div>`,
  search: (P) => `
<div id="${P}app-search" class="${P}app" style="background:#0B1424;">
  <div style="position:absolute;left:24px;right:24px;top:24px;height:70px;border-radius:14px;border:3px solid ${C.teal};display:flex;align-items:center;gap:14px;padding:0 20px;font-size:30px;">
    <svg width="30" height="30" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" fill="none" stroke="${C.teal}" stroke-width="2.6"/><path d="M15.5 15.5L21 21" stroke="${C.teal}" stroke-width="2.6" stroke-linecap="round"/></svg>
    <span id="${P}q" style="font-family:'JetBrains Mono';display:inline-block;white-space:pre;">maGiamGia</span><b id="${P}qn" style="margin-left:auto;font-size:28px;color:${C.warn};opacity:0;">37 kết quả</b></div>
  <div data-layout-ignore style="position:absolute;left:0;right:0;top:112px;bottom:0;overflow:hidden;"><div id="${P}sscroll" style="position:absolute;left:0;right:0;top:0;">
  ${Array.from({ length: 16 }, (_, i) => { const hit = i === 13; const file = ["gio-hang.js:42", "khuyen-mai.js:17", "thanh-toan.js:9", "flash-sale.js:58", "goi-y.js:23", "khuyen-mai.js:31", "gio-hang.js:77", "thanh-toan.js:21", "don-hang.js:12", "khuyen-mai.js:64", "giao-dien.js:140", "kiem-thu.js:33", "flash-sale.js:91", "thanh-toan.js:14", "gio-hang.js:105", "don-hang.js:48"][i]; return `<div ${hit ? `id="${P}hit"` : ""} style="height:50px;line-height:50px;font-family:'JetBrains Mono';font-size:22px;white-space:pre;padding-left:16px;border-bottom:1px solid rgba(245,239,228,0.06);color:#C9D2DE;"><span style="color:${C.teal};">${file}</span>   ${hit ? "const ma = maGiamGia.trim();" : "… maGiamGia …"}</div>`; }).join("")}
  </div></div>
</div>`,
  release: (P) => `
<div id="${P}app-release" class="${P}app" style="background:#0B1424;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;">
  <div id="${P}reltick">${tick(190)}</div>
  <div style="font-size:58px;font-weight:800;">Phát hành bản sửa</div>
  <div style="font-size:32px;font-weight:600;color:${C.muted};">Thanh toán: 0 lỗi</div>
</div>`,
  doc: (P) => `
<div id="${P}app-doc" class="${P}app" style="background:#F5EFE4;color:#0F1E33;">
  <div style="position:absolute;left:44px;top:60px;font-size:44px;font-weight:800;">Báo cáo rút kinh nghiệm</div>
  ${["Chuyện gì đã xảy ra", "Vì sao", "Làm gì để không lặp lại"].map((h, i) => `<div style="position:absolute;left:44px;top:${150 + i * 150}px;font-size:32px;font-weight:800;color:#1E4E5C;">${i + 1}. ${h}</div><div style="position:absolute;left:44px;right:44px;top:${196 + i * 150}px;height:14px;border-radius:7px;background:#0F1E33;opacity:0.12;"></div><div style="position:absolute;left:44px;width:420px;top:${222 + i * 150}px;height:14px;border-radius:7px;background:#0F1E33;opacity:0.12;"></div>`).join("")}
  <div id="${P}blameline" style="position:absolute;left:44px;top:560px;font-size:36px;font-weight:700;color:#6B4E2E;">Ai viết dòng này?<div id="${P}strike" style="position:absolute;left:-6px;right:-6px;top:24px;height:6px;border-radius:3px;background:${C.err};transform-origin:0 50%;transform:scaleX(0);"></div></div>
  <div id="${P}actionline" style="position:absolute;left:44px;top:620px;font-size:36px;font-weight:800;color:#1E7A5E;opacity:0;">→ Thêm bước tự động thử: ô mã để trống</div>
</div>`,
};

// ── the meeting room (frame 13): the report on a wall screen, anh Quân beside it, the team around the table ──
const TV = { x: 120, y: 175, s: 0.85 };   // the monitor's screen markup, scaled onto the wall (screen top-left, scale)
// a colleague at the table seen from behind, looking towards the wall screen (face = 1 → right, -1 → left);
// the chair back hides the lower body
const seatSvg = (P, id, x, y, sc, { hair, skin, skinD, shirt, face, long = false, phones = false }) => `
<g transform="translate(${x} ${y}) scale(${sc})">
  <rect x="-12" y="300" width="24" height="120" fill="#0B1424"/>
  <path d="M-118 330 C -118 140 -80 66 0 62 C 80 66 118 140 118 330 Z" fill="${shirt}"/>
  ${phones ? `<path d="M-62 70 C -62 116 62 116 62 70" stroke="${C.teal}" stroke-width="16" fill="none" stroke-linecap="round"/>` : ""}
  <g id="${P}seat-${id}-head">
    <rect x="-22" y="0" width="44" height="70" rx="16" fill="${skin}"/>
    ${long ? `<rect x="-78" y="-60" width="156" height="150" rx="60" fill="${hair}"/>` : ""}
    <circle cx="0" cy="-40" r="76" fill="${skin}" stroke="${skinD}" stroke-width="3"/>
    <circle cx="${-face * 20}" cy="-50" r="76" fill="${hair}"/>
    <ellipse cx="${face * 40}" cy="-24" rx="11" ry="16" fill="${skin}" stroke="${skinD}" stroke-width="3"/>
  </g>
  <rect x="-104" y="150" width="208" height="190" rx="40" fill="#0B1424" stroke="#22344F" stroke-width="4"/>
</g>`;
const ROOM = (P, screen) => `
<div id="${P}wall" class="${P}wall">
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0;">
  <defs><linearGradient id="${P}rwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A2D48"/><stop offset="1" stop-color="#132540"/></linearGradient>
    <radialGradient id="${P}glow" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#F5EFE4" stop-opacity="0.12"/><stop offset="1" stop-color="#F5EFE4" stop-opacity="0"/></radialGradient></defs>
  <rect width="${W}" height="880" fill="url(#${P}rwall)"/>
  <rect y="880" width="${W}" height="${H - 880}" fill="#16263D"/>
  <rect y="872" width="${W}" height="10" fill="${C.deskEdge}"/>
  <ellipse cx="${TV.x + 400}" cy="${TV.y + 310}" rx="620" ry="460" fill="url(#${P}glow)"/>
  <rect x="${TV.x - 16}" y="${TV.y - 16}" width="${Math.round(SCR.w * TV.s) + 32}" height="${Math.round(SCR.h * TV.s) + 32}" rx="18" fill="#070D17" stroke="#F5EFE4" stroke-opacity="0.14" stroke-width="3"/>
</svg></div>
<div style="position:absolute;left:0;top:0;transform:translate(${r2(TV.x - SCR.x * TV.s)}px,${r2(TV.y - SCR.y * TV.s)}px) scale(${TV.s});transform-origin:0 0;">${screen}</div>
<div style="position:absolute;left:0;top:0;transform:translate(-856px,-58px) scale(0.8);transform-origin:0 0;">
  <svg width="420" height="${H}" viewBox="2040 0 420 ${H}" style="position:absolute;left:2040px;top:0;"><rect x="2172" y="1120" width="68" height="180" rx="16" fill="#0E1A2C"/><rect x="2260" y="1120" width="68" height="180" rx="16" fill="#0E1A2C"/><ellipse cx="2200" cy="1302" rx="46" ry="18" fill="#0A1424"/><ellipse cx="2300" cy="1302" rx="46" ry="18" fill="#0A1424"/></svg>
  ${quanSvg(P)}
</div>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0;">
  ${seatSvg(P, "tuan", 205, 950, 0.58, { hair: "#1A1412", skin: SKIN, skinD: SKIN_D, shirt: "#3A5374", face: 1 })}
  <polygon points="330,880 750,880 1200,1920 -120,1920" fill="#2C4262" stroke="#3A5374" stroke-width="4" stroke-linejoin="round"/>
  <g transform="translate(250 1010) scale(0.55)"><rect width="70" height="86" rx="10" fill="#F5EFE4" fill-opacity="0.85"/><path d="M70 22 c 26 0 26 40 0 40" stroke="#F5EFE4" stroke-opacity="0.85" stroke-width="9" fill="none"/></g>
  <g transform="translate(560 960) scale(0.7)"><rect x="0" y="40" width="260" height="20" rx="6" fill="#0B1424"/><path d="M20 40 L40 -110 L240 -110 L260 40 Z" fill="#16263D" stroke="#0B1424" stroke-width="5"/></g>
  <polygon points="290,1360 790,1360 850,1720 230,1720" fill="#F5EFE4" fill-opacity="0.92"/>
  ${[0, 1, 2, 3, 4].map((i) => `<path d="M${300 - i * 10} ${1420 + i * 60} H${780 + i * 10}" stroke="#8796A9" stroke-opacity="0.5" stroke-width="4"/>`).join("")}
  ${seatSvg(P, "mai", 70, 1150, 1.15, { hair: "#2A2320", skin: MAI_SKIN, skinD: MAI_SKIN_D, shirt: "#F5EFE4", face: 1, long: true, phones: true })}
  ${seatSvg(P, "lan", 1010, 1170, 1.1, { hair: "#2A2320", skin: QUAN_SKIN, skinD: QUAN_SKIN_D, shirt: "#2E6A6A", face: -1 })}
</svg>
<div style="position:absolute;left:0;top:0;transform:translate(330px,640px) scale(0.6);transform-origin:0 0;">${teaSvg(P)}</div>`;

// ── overlays (screen space) ───────────────────────────────────────────────────
const HUD = (P) => `
<div id="${P}hud" class="${P}hud" style="opacity:0;">
  <div class="${P}hudtop"><span>Đơn thanh toán lỗi</span><b id="${P}hudnum">12</b><span id="${P}hudtick" style="display:inline-block;opacity:0;margin-left:6px;">${tick(40)}</span></div>
  <div id="${P}hudbarwrap" class="${P}hudbarwrap" style="opacity:0;"><div id="${P}hudbar" class="${P}hudbar"></div></div>
</div>`;
const TAG = (P, id, text, extra = "") => `<div id="${P}${id}" class="${P}tag" style="opacity:0;${extra}">${text}</div>`;
// the boss's deadline, under "Tích tắc…" (frame 4), called back in the hunt; #…dlx is the strike line
const DEADLINE = (P, extra = "") => `<div id="${P}deadline" style="position:absolute;left:40px;top:330px;display:flex;align-items:center;gap:10px;padding:10px 20px;border-radius:100px;background:rgba(15,30,51,0.9);border:3px solid ${C.warn};font-size:34px;font-weight:800;color:${C.warn};opacity:0;${extra}"><svg width="32" height="32" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 6v6l4 3" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>Hạn: 10 phút<div id="${P}dlx" style="position:absolute;left:14px;right:14px;top:50%;height:5px;margin-top:-2px;border-radius:3px;background:${C.err};transform:scaleX(0);transform-origin:0 50%;"></div></div>`;

// confetti: 28 pieces with fixed pseudo-random end points (seek-safe, no Math.random at runtime)
const CF = Array.from({ length: 28 }, (_, i) => { const a = (i * 137.5) % 360, r = 260 + ((i * 97) % 300); return { x: Math.round(Math.cos(a * Math.PI / 180) * r), y: Math.round(Math.sin(a * Math.PI / 180) * r * 0.8 - 160), rot: (i * 53) % 360, c: [C.warn, C.teal, C.ok, C.err, C.text][i % 5] }; });
const CONFETTI = (P) => CF.map((p, i) => `<div id="${P}cf-${i}" class="${P}cf" style="background:${p.c};"></div>`).join("");

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
.${P}menubar{position:absolute;left:0;right:0;top:0;height:34px;padding:0 18px;display:flex;justify-content:space-between;align-items:center;font-size:19px;font-weight:600;color:${C.text};background:rgba(7,13,23,0.55);z-index:5;}
.${P}app{position:absolute;left:0;top:34px;width:${SCR.w}px;height:${SCR.h - 34}px;overflow:hidden;background:#12233A;}
.${P}apptitle{position:absolute;left:44px;top:34px;font-size:44px;font-weight:800;}
.${P}cardx{position:absolute;left:44px;right:44px;padding:18px 26px;border-radius:16px;background:rgba(245,239,228,0.06);border:2px solid rgba(245,239,228,0.12);display:flex;flex-direction:column;gap:10px;}
.${P}ghtop{position:absolute;left:0;right:0;top:0;height:72px;background:${C.teal};display:flex;align-items:center;gap:12px;padding:0 24px;color:#0B1424;}
.${P}ghtop b{font-size:36px;font-weight:800;}
.${P}ghsearch{margin-left:auto;width:340px;height:44px;border-radius:22px;background:rgba(255,255,255,0.88);color:#5C6B82;font-size:22px;font-weight:600;display:flex;align-items:center;padding:0 18px;}
.${P}ghsale{position:absolute;left:24px;right:24px;top:86px;height:112px;border-radius:16px;background:linear-gradient(90deg,#F2A93B,#FFD166);color:#3A1400;display:flex;flex-direction:column;justify-content:center;padding:0 26px;}
.${P}ghsale b{font-size:46px;font-weight:800;letter-spacing:0.02em;line-height:1.1;}
.${P}ghsale span{font-size:26px;font-weight:700;}
.${P}ghsale i{font-style:normal;font-variant-numeric:tabular-nums;background:#3A1400;color:#FFD166;padding:0 8px;border-radius:6px;}
.${P}ghitem{position:absolute;left:24px;right:24px;top:212px;height:112px;border-radius:16px;background:rgba(245,239,228,0.06);border:2px solid rgba(245,239,228,0.12);display:flex;align-items:center;gap:20px;padding:0 20px;}
.${P}ghitem b{display:block;font-size:30px;font-weight:700;}
.${P}ghitem span{display:block;font-size:28px;margin-top:4px;}
.${P}ghitem em{font-style:normal;color:${C.errText};font-weight:800;}
.${P}ghitem s{color:${C.light};margin-left:12px;}
.${P}ghbadge{margin-left:auto;font-style:normal;background:${C.err};color:#FFFFFF;font-size:30px;font-weight:800;padding:6px 14px;border-radius:10px;}
.${P}minibrand{position:absolute;left:30px;right:30px;top:92px;height:44px;border-radius:10px;background:${C.teal};color:#0B1424;font-size:24px;font-weight:800;display:flex;align-items:center;gap:8px;padding:0 12px;}
.${P}pg{position:absolute;left:30px;right:30px;top:92px;height:40px;border-radius:10px;background:${C.teal};color:#0B1424;font-size:24px;font-weight:800;display:flex;align-items:center;gap:8px;padding:0 12px;}
.${P}row{display:flex;justify-content:space-between;font-size:28px;color:${C.muted};}
.${P}row b{color:${C.text};}
.${P}lbl{position:absolute;left:44px;font-size:30px;font-weight:700;}
.${P}input{position:absolute;left:44px;right:44px;height:84px;border-radius:14px;border:3px solid rgba(245,239,228,0.25);background:#0B1424;display:flex;align-items:center;padding:0 24px;font-size:28px;}
.${P}btn{position:absolute;left:44px;right:44px;height:80px;border-radius:14px;background:${C.teal};color:#0B1424;font-size:32px;font-weight:800;display:flex;align-items:center;justify-content:center;}
.${P}banner{position:absolute;left:44px;right:44px;height:100px;border-radius:16px;background:rgba(229,83,75,0.18);border:3px solid ${C.err};color:${C.errText};font-size:44px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:18px;}
.${P}msg{position:absolute;left:30px;right:30px;min-height:76px;padding:14px 18px;border-radius:16px;background:rgba(245,239,228,0.05);display:flex;gap:16px;align-items:flex-start;}
.${P}msg i{flex:0 0 52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-style:normal;font-weight:800;font-size:24px;color:${C.text};}
.${P}msg b{font-size:24px;font-weight:800;}
.${P}msg small{font-size:18px;font-weight:500;color:${C.light};margin-left:8px;}
.${P}msg p{margin:4px 0 0;font-size:27px;font-weight:500;}
.${P}calltop{position:absolute;left:20px;top:22px;font-size:24px;font-weight:700;color:${C.muted};display:flex;align-items:center;gap:10px;}
.${P}tile{position:absolute;border-radius:16px;overflow:hidden;background:#1B2E4A;}
.${P}ring{position:absolute;inset:0;border-radius:16px;border:6px solid ${C.teal};opacity:0;}
.${P}name{position:absolute;left:14px;bottom:12px;display:flex;align-items:center;gap:8px;padding:6px 16px;border-radius:100px;background:rgba(7,13,23,0.75);font-size:28px;font-weight:800;}
.${P}half{position:absolute;top:20px;width:442px;height:650px;border-radius:18px;border:4px solid;}
.${P}halflbl{position:absolute;left:0;right:0;top:26px;text-align:center;font-size:38px;font-weight:800;}
.${P}mini{position:absolute;left:30px;right:30px;top:110px;display:flex;flex-direction:column;gap:14px;}
.${P}minifield{height:64px;border-radius:12px;border:2px solid rgba(245,239,228,0.25);display:flex;align-items:center;padding:0 16px;font-size:22px;color:${C.muted};}
.${P}minifield i{margin-left:6px;}
.${P}minibtn{height:60px;border-radius:12px;background:${C.teal};color:#0B1424;font-size:24px;font-weight:800;display:flex;align-items:center;justify-content:center;}
.${P}halficon{position:absolute;left:0;right:0;top:340px;display:flex;justify-content:center;}
.${P}tabs{position:absolute;left:0;right:0;top:0;height:58px;display:flex;gap:4px;padding:10px 14px 0;background:#16263D;font-size:22px;font-weight:600;color:${C.light};}
.${P}tabs span{padding:10px 18px;border-radius:10px 10px 0 0;}
.${P}tabon{background:#0B1424;color:${C.text};}
.${P}code{position:absolute;left:0;right:0;font-family:"JetBrains Mono";font-size:27px;}
.${P}cl{height:56px;line-height:56px;white-space:pre;padding-left:14px;color:#D8DEE8;}
.${P}ln{display:inline-block;width:56px;color:#5C6B82;}
.${P}bclip{position:absolute;left:0;right:0;top:${BLAME_TOP - 34}px;height:470px;overflow:hidden;}
.${P}bscroll{position:absolute;left:0;right:0;top:0;}
.${P}brow{position:absolute;left:0;right:0;height:${BLAME_LH}px;line-height:${BLAME_LH}px;white-space:pre;font-family:"JetBrains Mono";font-size:22px;color:#D8DEE8;display:flex;}
.${P}who{flex:0 0 210px;padding-left:14px;color:${C.light};background:rgba(245,239,228,0.04);border-right:2px solid rgba(245,239,228,0.1);}
.${P}bcode{padding-left:14px;}
.${P}bbad{background:rgba(229,83,75,0.22);}
.${P}log{position:absolute;left:20px;right:20px;bottom:20px;padding:12px 16px;border-radius:10px;background:rgba(229,83,75,0.1);font-family:"JetBrains Mono";font-size:19px;color:${C.errText};opacity:0.75;}
.${P}fg{position:absolute;inset:0;}
.${P}alarm{position:absolute;inset:0;background:radial-gradient(ellipse at center, rgba(229,83,75,0) 42%, rgba(229,83,75,0.65) 100%);opacity:0;}
.${P}flash{position:absolute;inset:0;background:#FFFFFF;opacity:0;}
.${P}cf{position:absolute;left:530px;top:700px;width:22px;height:12px;border-radius:3px;opacity:0;}
.${P}bigc{position:absolute;left:0;right:0;margin:0 auto;width:fit-content;top:1020px;padding:18px 44px 22px;border-radius:26px;background:rgba(36,10,12,0.92);border:5px solid ${C.err};text-align:center;box-shadow:0 0 60px rgba(229,83,75,0.45);}
.${P}bigc span{display:block;font-size:34px;font-weight:800;letter-spacing:0.06em;color:${C.text};}
.${P}bigc b{display:block;font-size:150px;line-height:1;font-weight:800;color:${C.errText};font-variant-numeric:tabular-nums;}
.${P}tz{position:absolute;right:24px;width:520px;height:64px;border-radius:14px;background:#3A1014;border:3px solid ${C.err};display:flex;align-items:center;gap:12px;padding:0 16px;font-size:26px;font-weight:800;color:${C.errText};box-shadow:0 8px 20px rgba(0,0,0,0.45);}
.${P}tag{position:absolute;left:0;right:0;margin:0 auto;width:fit-content;top:100px;white-space:nowrap;font-size:40px;font-weight:800;padding:14px 32px;border-radius:100px;background:#1B2E4A;border:3px solid ${C.teal};color:${C.text};}
.${P}hud{position:absolute;right:30px;top:188px;white-space:nowrap;padding:8px 18px 10px;border-radius:18px;background:rgba(36,10,12,0.88);border:3px solid ${C.err};}
.${P}hudtop{display:flex;align-items:center;gap:14px;font-size:24px;font-weight:700;color:${C.text};}
.${P}hudtop b{margin-left:auto;min-width:76px;text-align:right;font-size:40px;font-weight:800;color:${C.errText};font-variant-numeric:tabular-nums;}
.${P}hudbarwrap{margin-top:6px;height:12px;border-radius:7px;background:rgba(245,239,228,0.15);overflow:hidden;}
.${P}hudbar{height:100%;width:100%;border-radius:7px;background:${C.teal};transform-origin:0 50%;transform:scaleX(0);}
.${P}card{position:absolute;left:70px;right:70px;padding:26px 32px;border-radius:22px;background:#1B2E4A;border:3px solid ${C.teal};text-align:center;}
.${P}card b{display:block;font-size:46px;font-weight:800;line-height:1.25;}
.${P}card small{display:block;margin-top:8px;font-size:32px;font-weight:600;color:${C.muted};}
.${P}bubble{position:absolute;padding:24px 34px;border-radius:30px;background:${C.text};color:#0F1E33;font-size:42px;font-weight:800;white-space:nowrap;box-shadow:0 14px 30px rgba(0,0,0,0.35);}
.${P}sticker{position:absolute;padding:16px 26px;border-radius:16px;background:${C.warn};color:#0F1E33;font-size:36px;font-weight:800;white-space:nowrap;box-shadow:0 12px 26px rgba(0,0,0,0.4);}
.${P}toast{position:absolute;left:90px;right:90px;padding:18px 24px;border-radius:18px;background:rgba(245,239,228,0.96);color:#0F1E33;display:flex;gap:16px;align-items:center;box-shadow:0 12px 26px rgba(0,0,0,0.4);}
.${P}toast i{flex:0 0 56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-style:normal;font-weight:800;font-size:26px;color:${C.text};}
.${P}toast b{display:block;font-size:24px;font-weight:800;}
.${P}toast span{display:block;font-size:30px;font-weight:700;}
.${P}phone{position:absolute;left:40px;top:480px;width:380px;height:760px;border-radius:50px;background:#0B1424;border:8px solid #2C4262;box-shadow:0 20px 40px rgba(0,0,0,0.5);overflow:hidden;}
.${P}phone .${P}pt{position:absolute;left:10px;right:10px;top:16px;text-align:center;font-size:28px;line-height:1.2;font-weight:800;color:${C.warn};}
.${P}phone .${P}pl{position:absolute;left:30px;top:146px;font-size:28px;font-weight:700;}
.${P}phone .${P}pf{position:absolute;left:30px;right:30px;top:186px;height:68px;border-radius:12px;border:3px solid rgba(245,239,228,0.25);font-size:26px;color:#7C8AA0;display:flex;align-items:center;padding:0 14px;}
.${P}phone .${P}pb{position:absolute;left:30px;right:30px;top:280px;height:72px;border-radius:12px;background:${C.teal};color:#0B1424;font-size:28px;font-weight:800;display:flex;align-items:center;justify-content:center;}
`;

// ── frame assembly ────────────────────────────────────────────────────────────
// st: camera state at frame start — cam (pan x), zoom {s,x,y}, hands (0 on keyboard … 1 out of view)
function frameFile(f) {
  const n = f.n, P = `f${String(n).padStart(2, "0")}-`, s = SB.scenes[n - 1], D = s.duration, st = f.start;
  const screen = (f.screen ?? []).map((a) => a(P)).join("");
  return `<template>
<style>
${css(P)}
${(f.css ?? "").replaceAll("$P", P)}
</style>
<div id="root" data-composition-id="${f.id}" data-width="${W}" data-height="${H}" data-duration="${D}">
  <div id="${P}ground" class="${P}ground clip" data-start="0" data-duration="${D}" data-track-index="0"></div>
  <div id="${P}zoom" class="${P}zoom clip" data-start="0" data-duration="${D}" data-track-index="1">
    <div id="${P}beat" style="position:absolute;inset:0;transform-origin:540px 960px;">
    <div id="${P}pan" class="${P}pan">${f.room ? f.room(P, `<div id="${P}screen" class="${P}screen"><div class="${P}menubar" data-layout-ignore><span style="font-weight:700;">${f.appName ?? "Thanh toán"}</span><span id="${P}clock">${f.clock}</span></div>${screen}</div>`) : `
      <div id="${P}wall" class="${P}wall">${wallSvg(P)}</div>
      <div class="${P}deskband"></div>
      ${monitorSvg()}
      <div id="${P}screen" class="${P}screen"><div class="${P}menubar" data-layout-ignore><span style="font-weight:700;">${f.appName ?? "Thanh toán"}</span><span id="${P}clock">${f.clock}</span></div>${screen}</div>
      ${keyboardSvg(P)}
      ${f.tea === false ? "" : teaSvg(P)}
      ${maiSvg(P)}
      ${quanSvg(P)}
      ${(f.world ?? "").replaceAll("$P", P)}`}
    </div>
    </div>
  </div>
  <div id="${P}fg" class="${P}fg clip" data-start="0" data-duration="${D}" data-track-index="2">${handsSvg(P)}</div>
  <div id="${P}ov" class="${P}fg clip" data-layout-allow-overlap data-start="0" data-duration="${D}" data-track-index="3"><div id="${P}alarm" class="${P}alarm"></div>${HUD(P)}${(f.overlay ?? "").replaceAll("$P", P)}${f.confetti ? CONFETTI(P) : ""}<div id="${P}flash" class="${P}flash"></div></div>
</div>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script>
(function () {
  const P = "${P}";
  const $ = (s) => document.getElementById(P + s);
  const tl = gsap.timeline({ paused: true });
  const PAR = ${PARALLAX};
  gsap.set($("zoom"), { scale: ${st.zoom.s}, transformOrigin: "${st.zoom.x}px ${st.zoom.y}px" });
  gsap.set($("pan"), { x: ${-st.cam} });
  gsap.set($("wall"), { x: ${r2(st.cam * (1 - PARALLAX))} });
  gsap.set($("fg"), { y: ${st.hands * 900} });
  const pan = (to, at, dur = 0.8) => {
    tl.to($("pan"), { x: -to, duration: dur, ease: "power2.inOut" }, at);
    tl.to($("wall"), { x: to * (1 - PAR), duration: dur, ease: "power2.inOut" }, at);
    tl.to($("zoom"), { filter: "blur(6px)", duration: dur * 0.45, ease: "power1.in" }, at);
    tl.to($("zoom"), { filter: "blur(0px)", duration: dur * 0.55, ease: "power1.out" }, at + dur * 0.45);
  };
  const hands = (to, at, dur = 0.5) => tl.to($("fg"), { y: to * 900, duration: dur, ease: to ? "power2.in" : "power3.out" }, at);
  const zoom = (sc, at, dur = 1.0, ease = "power2.inOut") => tl.to($("zoom"), { scale: sc, duration: dur, ease: ease }, at);
  const origin = (x, y, at) => tl.set($("zoom"), { transformOrigin: x + "px " + y + "px" }, at);
  const pop = (el, at, from = 0.6) => tl.fromTo(el, { opacity: 0, scale: from }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" }, at);
  const fadeIn = (el, at, dur = 0.35) => tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: dur, ease: "power3.out" }, at);
  const fadeOut = (el, at, dur = 0.3) => tl.to(el, { opacity: 0, duration: dur, ease: "power1.out" }, at);
  const show = (el, at) => tl.set(el, { opacity: 1 }, at);
  const hide = (el, at) => tl.set(el, { opacity: 0 }, at);
  // shake / flash / alarm / heartbeat pulse / confetti (all seek-safe timeline tweens)
  const shake = (at, amp, n) => { amp = amp || 16; n = n || 3; tl.fromTo($("beat"), { x: 0, y: 0 }, { x: amp, y: -amp * 0.6, duration: 0.035, repeat: 2 * n - 1, yoyo: true, ease: "none", immediateRender: false }, at); tl.set($("beat"), { x: 0, y: 0 }, at + 0.035 * 2 * n + 0.01); };
  const flash = (color, at, peak, dur) => { tl.set($("flash"), { backgroundColor: color }, at); tl.fromTo($("flash"), { opacity: peak || 0.55 }, { opacity: 0, duration: dur || 0.35, ease: "power2.out", immediateRender: false }, at); };
  const alarm = (t0, t1, lo, hi, period) => { lo = lo == null ? 0.15 : lo; hi = hi || 0.55; period = period || 0.5; for (let t = t0; t < t1 - 0.05; t += period) { tl.to($("alarm"), { opacity: hi, duration: period * 0.4, ease: "sine.out" }, t); tl.to($("alarm"), { opacity: lo, duration: period * 0.6, ease: "sine.in" }, t + period * 0.4); } };
  const heart = (t0, t1, period, amp) => { period = period || 0.62; amp = amp || 0.014; for (let t = t0; t < t1 - 0.05; t += period) { tl.to($("beat"), { scale: 1 + amp, duration: 0.08, ease: "power2.out" }, t); tl.to($("beat"), { scale: 1, duration: 0.24, ease: "power2.in" }, t + 0.08); } };
  const confetti = (at, ox, oy) => { ${JSON.stringify(CF.map((p) => [p.x, p.y, p.rot]))}.forEach(function (p, i) { const el = $("cf-" + i); if (!el) return; tl.fromTo(el, { opacity: 1, x: ox || 0, y: oy || 0, rotation: 0 }, { x: (ox || 0) + p[0], y: (oy || 0) + p[1], rotation: p[2] + 360, duration: 0.9, ease: "power3.out", immediateRender: false }, at); tl.to(el, { y: "+=" + 260, opacity: 0, duration: 0.8, ease: "power1.in" }, at + 0.85); }); };
  gsap.set($("alarm"), { opacity: ${f.alarm0 ?? 0} });
  // counter: whole numbers in even steps (seek-safe, no easing on the number)
  const count = (from, to, t0, t1, id) => { const steps = Math.max(1, Math.round((t1 - t0) / 0.2)); for (let k = 0; k <= steps; k++) tl.set($(id || "hudnum"), { textContent: String(Math.round(from + (to - from) * k / steps)) }, t0 + (t1 - t0) * k / steps); };
  const bar = (to, at, dur) => tl.to($("hudbar"), { scaleX: to, duration: dur, ease: "none" }, at);
  // mouth flaps on each spoken word: [start, end] pairs
  const talk = (openId, closedId, words) => { words.forEach(function (w) { tl.set($(openId), { opacity: 1 }, w[0]); if (closedId) tl.set($(closedId), { opacity: 0 }, w[0]); tl.set($(openId), { opacity: 0 }, Math.min(w[1], w[0] + 0.16)); if (closedId) tl.set($(closedId), { opacity: 1 }, Math.min(w[1], w[0] + 0.16)); }); };
  gsap.set($("hud"), { opacity: ${f.hud?.opacity ?? 0} });
  gsap.set($("hudnum"), { textContent: "${f.hud?.num ?? 12}" });
  gsap.set($("hudbarwrap"), { opacity: ${f.hud?.bar != null ? 1 : 0} });
  gsap.set($("hudbar"), { scaleX: ${f.hud?.bar ?? 0} });
${f.script(P, n, D)}
  window.__timelines["${f.id}"] = tl;
})();
</script>
</template>
`;
}

const words = (frame) => JSON.stringify((voice(frame)?.words ?? []).map((w) => [r2(w.start), r2(w.end)]));
const idOf = (n) => `${String(n).padStart(2, "0")}-${SB.scenes[n - 1].id}`;
const FR = [];
const MON0 = { cam: CAM.mon, zoom: { s: 1, x: 540, y: 760 }, hands: 0 };

// 1 — hook: the failed checkout is on screen at 0.0 s; push in on the empty code field + red banner
const TOASTS = (P) => `<div id="${P}toasts" data-layout-allow-overlap style="position:absolute;inset:0;z-index:6;">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<div id="${P}tz-${i}" class="${P}tz" style="top:${206 + i * 50}px;right:${24 + (i % 2) * 40}px;opacity:${i < 3 ? 1 : 0};">${cross(36)}<span>Thanh toán thất bại · #${48213 + i * 7}</span></div>`).join("")}</div>`;
FR.push({ n: 1, start: { ...MON0, zoom: { s: 1, x: 540, y: 760 } }, clock: "Thứ Sáu 16:45", appName: "Giỏ Hời", screen: [(P) => APPS.checkout(P), TOASTS], alarm0: 0.5,
  overlay: TAG("$P", "tag", "Thứ Sáu · 16:45", "opacity:1;") + `<div id="$Pbigc" class="$Pbigc"><span>ĐƠN THANH TOÁN LỖI</span><b id="$Pbignum">47</b></div>`,
  script: (P, n, D) => `
  alarm(0, ${r2(D)}, 0.25, 0.6, 0.45);
  [11, 10, 9].forEach(function (sec, k) { tl.set($("cd"), { textContent: "00:59:" + String(sec).padStart(2, "0") }, k + 1); });
  shake(0.04, 20, 4); flash("#E5534B", 0.04, 0.45, 0.4);
  zoom(1.06, 0.1, ${r2(D - 0.1)}, "power1.out");
  ${[3, 4, 5, 6].map((i, k) => `tl.fromTo($("tz-${i}"), { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.18, ease: "power3.out" }, ${r2(0.25 + k * 0.3)});`).join(" ")}
  tl.to($("screen"), { x: 10, duration: 0.03, repeat: 5, yoyo: true, ease: "none" }, 0.32);
  tl.to($("screen"), { opacity: 0.75, duration: 0.03, repeat: 3, yoyo: true, ease: "none" }, 0.32);
  tl.to($("screen"), { x: -12, duration: 0.03, repeat: 5, yoyo: true, ease: "none" }, ${r2(D * 0.55)});
  count(47, 212, 0, ${r2(D - 0.6)}, "bignum");
  tl.fromTo($("bigc"), { scale: 1 }, { scale: 1.06, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.out" }, ${r2(D * 0.5)});
  tl.to($("bigc"), { x: 300, y: -840, scale: 0.3, opacity: 0, duration: 0.45, ease: "power2.in" }, ${r2(D - 0.5)});
  tl.set($("hudnum"), { textContent: "212" }, 0);
  tl.to($("hud"), { opacity: 1, duration: 0.2 }, ${r2(D - 0.2)});` });

// 2 — escalate: chat; the automatic alert docks into the counter; messages pile up; the boss's message
FR.push({ n: 2, start: { ...MON0, zoom: { s: 1.06, x: 540, y: 760 } }, clock: "Thứ Sáu 16:45", appName: "Chat nhóm", screen: [(P) => APPS.chat(P)], alarm0: 0.35, hud: { opacity: 1, num: 212 },
  overlay: TAG("$P", "tagOld", "Thứ Sáu · 16:45", "opacity:1;") + TAG("$P", "tag", "10 phút sau khi phát hành")
    + `<div id="$Palert" class="$Pcard" style="top:560px;border-color:${C.err};background:#2A0E12;opacity:0;"><b style="color:${C.errText};">Cảnh báo tự động</b><small style="color:#F5EFE4;font-size:36px;">Thanh toán lỗi tăng vọt</small></div>`,
  script: (P, n, D) => {
    const tS = cue(2, "sếp", 1, 2.6);
    return `
  zoom(1, 0, 0.4);
  fadeOut($("tagOld"), 0, 0.25); fadeIn($("tag"), 0.2);
  pop($("alert"), 0.35, 0.7);
  alarm(0, ${r2(D)}, 0.15, 0.45, 0.5);
  tl.to($("alert"), { x: 270, y: -330, scale: 0.4, opacity: 0, duration: 0.45, ease: "power2.in" }, 1.25);
  tl.fromTo($("hud"), { scale: 1.15 }, { scale: 1, duration: 0.3, ease: "power2.out" }, 1.7);
  count(212, 240, 0, ${r2(D)});
  shake(${r2(Math.max(2.35, tS - 0.25))}, 12, 3);
  ${[0, 1, 2].map((i) => `fadeIn($("pile-" + ${i}), ${r2(1.6 + i * 0.28)}, 0.25);`).join(" ")}
  fadeIn($("bossmsg"), ${r2(Math.max(2.35, tS - 0.25))}, 0.3);`;
  } });

// 3 — meeting: video call, push in slowly on the boss; the hand reaches for the milk tea and pulls back
FR.push({ n: 3, start: { ...MON0, zoom: { s: 1, ...ZOOM_BOSS } }, clock: "Thứ Sáu 17:00", appName: "Họp online", screen: [(P) => APPS.call(P)],
  hud: { opacity: 1, num: 240 }, alarm0: 0.2,
  overlay: TAG("$P", "tagOld", "10 phút sau khi phát hành", "opacity:1;") + TAG("$P", "tag", "17:00 · Họp gấp"),
  script: (P, n, D) => {
    const tLy = cue(3, "ly", 1, 1.4);
    return `
  fadeOut($("tagOld"), 0, 0.25); fadeIn($("tag"), 0.15);
  zoom(1.1, 0.3, ${r2(D - 0.3)}, "power1.inOut");
  count(240, 300, 0, ${r2(D)}); alarm(0, ${r2(D)}, 0.1, 0.32, 0.6);
  tl.to($("hand-r"), { x: 70, y: -230, rotation: -8, svgOrigin: "750 1600", duration: 0.45, ease: "power2.out" }, ${r2(tLy)});
  tl.to($("hand-r"), { x: 0, y: 0, rotation: 0, duration: 0.5, ease: "power2.inOut" }, ${r2(tLy + 0.85)});`;
  } });

// 4 — boss: his tile fills the screen; mouth flaps; "Tích tắc…" small, opposite the counter; "mười phút" → deadline chip
FR.push({ n: 4, start: { ...MON0, zoom: { s: 1.1, ...ZOOM_BOSS } }, clock: "Thứ Sáu 17:01", appName: "Họp online", screen: [(P) => APPS.call(P)],
  hud: { opacity: 1, num: 300 }, alarm0: 0.2,
  overlay: TAG("$P", "tagOld", "17:00 · Họp gấp", "opacity:1;")
    + `<div id="$Ptictac" style="position:absolute;left:40px;top:250px;display:flex;align-items:center;gap:10px;padding:10px 18px;border-radius:100px;background:rgba(15,30,51,0.85);border:2px solid rgba(245,239,228,0.3);font-size:30px;font-weight:700;color:${C.muted};opacity:0;"><svg width="30" height="30" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="#B8C4D3" stroke-width="2.4"/><path d="M12 6v6l4 3" stroke="#B8C4D3" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>Tích tắc… tích tắc…</div>`
    + DEADLINE("$P"),
  script: (P, n, D) => {
    const end = voiceEnd(4, 3.9), tM = cue(4, "mười", 1, 1.6);
    return `
  fadeOut($("tagOld"), 0, 0.25);
  zoom(1.16, 0, ${r2(tM)}, "power1.out");
  tl.to($("zoom"), { scale: 1.36, duration: 0.22, ease: "power4.out" }, ${r2(tM)});
  fadeIn($("deadline"), ${r2(tM + 0.15)});
  alarm(0, ${r2(D)}, 0.15, 0.6, 0.45);
  shake(${r2(end + 0.15)}, 22, 5); flash("#E5534B", ${r2(end + 0.15)}, 0.5, 0.5);
  tl.set($("bossmic"), { innerHTML: ${JSON.stringify(MIC_ON)} }, 0.1);
  tl.to($("ring"), { opacity: 1, duration: 0.2 }, 0.1);
  tl.to($("ring"), { opacity: 0.45, duration: 0.35, yoyo: true, repeat: ${Math.max(5, Math.floor((end - 0.3) / 0.35) - 1)}, ease: "sine.inOut" }, 0.3);
  tl.to($("ring"), { opacity: 0, duration: 0.3 }, ${r2(end + 0.05)});
  talk("boss-talk", "boss-mouth", ${words(4)});
  fadeIn($("tictac"), 0.4);
  tl.to($("fg"), { y: 70, duration: 0.35, ease: "power2.out" }, 0.5);
  tl.to($("hand-l"), { x: 18, duration: 0.3 }, 0.5); tl.to($("hand-r"), { x: -18, duration: 0.3 }, 0.5);
  count(300, 340, 0, ${r2(D)});`;
  } });

// 5 — mitigate: swivel to anh Quân, who speaks; "Đang quay về bản cũ…" pops big, then docks under the counter
FR.push({ n: 5, start: { cam: CAM.mon, zoom: { s: 1.36, ...ZOOM_BOSS }, hands: 0.08 }, alarm0: 0.3, clock: "Thứ Sáu 17:02", appName: "Họp online", screen: [(P) => APPS.call(P)],
  hud: { opacity: 1, num: 340 },
  overlay: `<div id="$Ptictac" style="position:absolute;left:40px;top:250px;display:flex;align-items:center;gap:10px;padding:10px 18px;border-radius:100px;background:rgba(15,30,51,0.85);border:2px solid rgba(245,239,228,0.3);font-size:30px;font-weight:700;color:${C.muted};">Tích tắc… tích tắc…</div>`
    + DEADLINE("$P", "opacity:1;")
    + `<div id="$Pqname" class="$Ptag" style="top:420px;left:auto;right:60px;margin:0;opacity:0;font-size:34px;">Anh Quân · trưởng nhóm</div>`
    + `<div id="$Prb" class="$Pcard" style="top:820px;opacity:0;"><b>Đang quay về bản cũ…</b><div style="margin-top:18px;height:22px;border-radius:11px;background:rgba(245,239,228,0.15);overflow:hidden;"><div id="$Prbfill" style="height:100%;width:100%;background:${C.teal};transform-origin:0 50%;transform:scaleX(0.04);"></div></div></div>`
    + TAG("$P", "prio", "Ưu tiên 1: khách dùng lại được"),
  script: (P, n, D) => {
    const tFix = cue(5, "sửa", 1, 3.6);
    return `
  fadeOut($("tictac"), 0, 0.3); fadeOut($("deadline"), 0, 0.3);
  zoom(1, 0, 0.5); origin(540, 760, 0.5); hands(1, 0.1, 0.45);
  pan(${CAM.col}, 0.1, 0.75);
  tl.set($("quan-eyes"), { x: -10 }, 0);
  fadeIn($("qname"), 0.75);
  tl.set($("quan-armdown"), { opacity: 0 }, 0.7); tl.set($("quan-armup"), { opacity: 1 }, 0.7);
  tl.fromTo($("quan-armup"), { y: 60 }, { y: 0, duration: 0.3, ease: "power2.out" }, 0.7);
  tl.to($("quan-armup"), { y: 80, opacity: 0, duration: 0.25, ease: "power2.in" }, ${r2(cue(5, "để", 1, 1.7) + 0.6)}); tl.set($("quan-armdown"), { opacity: 1 }, ${r2(cue(5, "để", 1, 1.7) + 0.75)});
  talk("quan-talk", "quan-mouth", ${words(5)});
  pop($("rb"), ${r2(tFix)}, 0.85); fadeIn($("prio"), ${r2(tFix + 0.1)});
  tl.to($("rbfill"), { scaleX: 0.12, duration: 1.2, ease: "none" }, ${r2(tFix)});
  tl.to($("rb"), { x: 230, y: -560, scale: 0.35, opacity: 0, duration: 0.5, ease: "power2.in" }, ${r2(D - 0.75)});
  tl.set($("hudbarwrap"), { opacity: 1 }, ${r2(D - 0.3)}); tl.set($("hudbar"), { scaleX: 0.12 }, ${r2(D - 0.3)});
  fadeOut($("prio"), ${r2(D - 0.6)}, 0.3);
  count(340, 380, 0, ${r2(D)}); alarm(0, ${r2(tFix)}, 0.12, 0.4, 0.5); tl.to($("alarm"), { opacity: 0, duration: 0.6 }, ${r2(tFix + 0.3)});`;
  } });

// 6 — self-talk: back to the screen — split screen tick/X, then the code, then a sideways glance at the colleagues
FR.push({ n: 6, start: { cam: CAM.col, zoom: { s: 1, x: 540, y: 760 }, hands: 1 }, clock: "Thứ Sáu 17:04", appName: "Kiểm tra", screen: [(P) => APPS.split(P), (P) => APPS.editor(P)],
  hud: { opacity: 1, num: 380, bar: 0.12 },
  overlay: `<div id="$Pqname" class="$Ptag" style="top:420px;left:auto;right:60px;margin:0;font-size:34px;">Anh Quân · trưởng nhóm</div>`
    + TAG("$P", "tag", "Cùng thao tác, khác kết quả", "font-size:34px;"),
  script: (P, n, D) => {
    const tO = cue(6, "ơ", 1, 0.1), tD = cue(6, "đoạn", 1, 2.2), tN = cue(6, "nhỉ", 1, 3.6), tH = cue(6, "hay", 1, 4.1);
    return `
  fadeOut($("qname"), 0, 0.25);
  tl.set($("quan-armdown"), { opacity: 1 }, 0); tl.set($("quan-armup"), { opacity: 0 }, 0);
  pan(${CAM.mon}, 0, 0.55);
  tl.set($("app-editor"), { autoAlpha: 0 }, 0);
  tl.to($("hud"), { opacity: 0.7, duration: 0.4 }, 0.2);
  hands(0, 0.35, 0.35);
  tl.to($("hand-l"), { x: -70, y: -240, rotation: -18, svgOrigin: "330 1600", duration: 0.3, ease: "back.out(1.6)" }, ${r2(Math.max(0.55, tO + 0.1))});
  tl.to($("hand-r"), { x: 70, y: -240, rotation: 18, svgOrigin: "750 1600", duration: 0.3, ease: "back.out(1.6)" }, ${r2(Math.max(0.55, tO + 0.1))});
  fadeIn($("tag"), 0.5);
  tl.to($("hand-l"), { x: 0, y: 0, rotation: 0, duration: 0.35, ease: "power2.inOut" }, ${r2(tD - 0.25)});
  tl.to($("hand-r"), { x: 0, y: 0, rotation: 0, duration: 0.35, ease: "power2.inOut" }, ${r2(tD - 0.25)});
  tl.set($("app-editor"), { autoAlpha: 1 }, ${r2(tD)}); tl.set($("app-split"), { autoAlpha: 0 }, ${r2(tD)});
  tl.fromTo($("code"), { y: 120 }, { y: 0, duration: ${r2(Math.max(0.6, tN - tD))}, ease: "power1.out" }, ${r2(tD)});
  pop($("qmark"), ${r2(tN)}, 0.5);
  fadeOut($("tag"), ${r2(tH - 0.1)}, 0.25);
  pan(${CAM.col}, ${r2(tH)}, 0.45); hands(0.4, ${r2(tH)}, 0.3);
  tl.set($("mai-phone"), { opacity: 1 }, 0); tl.set($("mai-eyes"), { y: 10 }, 0);
  tl.set($("quan-eyes"), { x: -10, y: 6 }, 0);
  pan(${CAM.mon}, ${r2(Math.min(D - 0.5, tH + 1.05))}, 0.45); hands(0, ${r2(Math.min(D - 0.4, tH + 1.15))}, 0.3);
  count(380, 410, 0, ${r2(D)}); bar(0.45, 0, ${r2(D)});`;
  } });

// 7 — hunt: the rollback lands (counter stops); pull requests → diff → search; "mười phút thành nửa tiếng"; stuck
FR.push({ n: 7, start: { cam: CAM.mon, zoom: { s: 1, x: 540, y: 760 }, hands: 0 }, clock: "Thứ Sáu 17:05", appName: "Kho code", screen: [(P) => APPS.editor(P), (P) => APPS.prlist(P), (P) => APPS.diff(P), (P) => APPS.search(P)],
  hud: { opacity: 0.7, num: 410, bar: 0.45 },
  overlay: `<div id="$Pdone" class="$Ptoast" style="top:300px;opacity:0;border:3px solid ${C.ok};"><i style="background:${C.ok};">${tick(40)}</i><div><b>17:05 · Đã quay về bản cũ</b><span>Khách thanh toán lại được</span></div></div>`
    + TAG("$P", "tag", "17:05 → 17:35 · vẫn chưa ra")
    + DEADLINE("$P", "left:0;right:0;margin:0 auto;width:fit-content;top:195px;")   // between the tag and the monitor, clear of the search box
    + `<svg id="$Pcur" width="56" height="66" viewBox="0 0 24 28" style="position:absolute;left:620px;top:520px;opacity:0;"><path d="M2 2 L2 22 L8 16 L12 26 L16 24 L12 14 L20 14 Z" fill="#F5EFE4" stroke="#0F1E33" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  script: (P, n, D) => {
    const tL = cue(7, "lục", 1, 2.0), tDo = cue(7, "dò", 1, 3.2), tM = cue(7, "mười", 1, 3.9), tN = cue(7, "nửa", 1, 4.6), tB = cue(7, "bí", 1, 5.4);
    const prStep = Math.max(0.18, (tDo - tL - 0.2) / 5);
    return `
  ["app-prlist", "app-diff", "app-search"].forEach(function (id) { tl.set($(id), { autoAlpha: 0 }, 0); });
  // 1. the rollback lands: the counter finishes, stops, greys out, and goes away
  tl.to($("hud"), { opacity: 1, duration: 0.2 }, 0);
  count(410, 463, 0, 0.6); bar(1, 0, 0.7);
  tl.to($("hudnum"), { color: "#8796A9", duration: 0.2 }, 0.7); tl.to($("hud"), { borderColor: "#8796A9", duration: 0.2 }, 0.7);
  pop($("hudtick"), 0.72, 0.5); flash("#3FB68B", 0.7, 0.3, 0.45);
  fadeIn($("done"), 0.8); fadeOut($("hud"), 1.5, 0.3); fadeOut($("done"), ${r2(tL - 0.2)}, 0.25);
  tl.set($("clock"), { textContent: "Thứ Sáu 17:06" }, 1.0);
  // 2. pull requests, clicked one by one
  tl.set($("app-prlist"), { autoAlpha: 1 }, ${r2(tL)}); tl.set($("app-editor"), { autoAlpha: 0 }, ${r2(tL)});
  tl.set($("clock"), { textContent: "Thứ Sáu 17:08" }, ${r2(tL)});
  tl.set($("cur"), { opacity: 1 }, ${r2(tL)});
  ${[0, 1, 2, 3, 4].map((i) => `tl.to($("cur"), { x: 0, y: ${i * 104}, duration: 0.12, ease: "power2.out" }, ${r2(tL + i * prStep)}); tl.to($("pr-${i}"), { backgroundColor: "rgba(20,184,166,0.22)", duration: 0.05 }, ${r2(tL + i * prStep + 0.1)});`).join(" ")}
  // 3. the diff scrolls by fast
  tl.set($("app-diff"), { autoAlpha: 1 }, ${r2(tDo)}); tl.set($("app-prlist"), { autoAlpha: 0 }, ${r2(tDo)}); tl.set($("cur"), { opacity: 0 }, ${r2(tDo)});
  tl.set($("clock"), { textContent: "Thứ Sáu 17:10" }, ${r2(tDo)});
  tl.fromTo($("diffscroll"), { y: 0 }, { y: -880, duration: ${r2(Math.max(0.5, tM - tDo))}, ease: "none" }, ${r2(tDo)});
  // 4. "mười phút": the search (37 results), the boss's deadline comes back as the clock hits 17:11
  tl.set($("app-search"), { autoAlpha: 1 }, ${r2(tM)}); tl.set($("app-diff"), { autoAlpha: 0 }, ${r2(tM)});
  tl.fromTo($("q"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.35, ease: "steps(9)" }, ${r2(tM)});
  tl.set($("qn"), { opacity: 1 }, ${r2(tM + 0.4)});
  tl.fromTo($("sscroll"), { y: 0 }, { y: -320, duration: ${r2(Math.max(0.6, tB - tM))}, ease: "power1.inOut" }, ${r2(tM + 0.4)});
  tl.set($("clock"), { textContent: "Thứ Sáu 17:11" }, ${r2(tM)});
  fadeIn($("deadline"), ${r2(tM)}, 0.25);
  // 5. "nửa tiếng": the deadline is struck and turns red, the clock races to 17:35
  tl.to($("dlx"), { scaleX: 1, duration: 0.25, ease: "power2.out" }, ${r2(tN)});
  tl.to($("deadline"), { color: "${C.errText}", borderColor: "${C.err}", duration: 0.2 }, ${r2(tN + 0.1)});
  tl.set($("clock"), { textContent: "Thứ Sáu 17:20" }, ${r2(tN)}); tl.set($("clock"), { textContent: "Thứ Sáu 17:28" }, ${r2(tN + 0.3)}); tl.set($("clock"), { textContent: "Thứ Sáu 17:35" }, ${r2(tN + 0.6)});
  fadeIn($("tag"), ${r2(tN)});
  tl.to($("tea-ice"), { opacity: 0.25, duration: ${r2(D)}, ease: "none" }, 0);
  // 6. "vẫn bí!": face in hands, the view goes dark; then a result lights up
  tl.to($("fg"), { y: -820, duration: 0.3, ease: "power2.out" }, ${r2(tB - 0.1)});
  tl.to($("zoom"), { filter: "brightness(0.45)", duration: 0.25 }, ${r2(tB)});
  tl.to($("fg"), { y: 0, duration: 0.3, ease: "power2.in" }, ${r2(D - 0.75)});
  tl.to($("zoom"), { filter: "brightness(1)", duration: 0.25 }, ${r2(D - 0.7)});
  tl.to($("hit"), { backgroundColor: "rgba(242,169,59,0.35)", color: "#FFFFFF", duration: 0.15 }, ${r2(D - 0.45)});
  fadeOut($("tag"), ${r2(D - 0.4)}, 0.3); fadeOut($("deadline"), ${r2(D - 0.4)}, 0.3);`;
  } });

// 8 — discover: the change-history view lands on the red line; "Ai viết dòng này vậy?" → "minh · thứ Ba" zooms; "Trời ơi"
FR.push({ n: 8, start: { cam: CAM.mon, zoom: { s: 1, ...ZOOM_NAME }, hands: 0 }, clock: "Thứ Sáu 17:36", appName: "Lịch sử thay đổi", screen: [(P) => APPS.blame(P)],
  overlay: TAG("$P", "tag", "Ô mã để trống → dòng này báo lỗi", "font-size:36px;")
    + `<div id="$Pwho" class="$Psticker" style="left:150px;top:1010px;background:${C.text};font-family:'JetBrains Mono';font-size:48px;opacity:0;">minh · thứ Ba</div>`
    + `<svg id="$Pdrop" width="70" height="100" viewBox="0 0 70 100" style="position:absolute;left:560px;top:950px;opacity:0;"><path d="M35 4 C 50 34 64 52 64 68 a29 29 0 0 1 -58 0 C 6 52 20 34 35 4z" fill="#7FD6F2" stroke="#3AA8D0" stroke-width="4"/><ellipse cx="25" cy="66" rx="7" ry="10" fill="#FFFFFF" fill-opacity="0.7"/></svg>`
    + `<svg id="$Pcursor" width="60" height="70" viewBox="0 0 24 28" style="position:absolute;left:780px;top:700px;opacity:0;"><path d="M2 2 L2 22 L8 16 L12 26 L16 24 L12 14 L20 14 Z" fill="#F5EFE4" stroke="#0F1E33" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  script: (P, n, D) => {
    const tV = cueEnd(8, "vậy", 1, 1.0), tT = cue(8, "trời", 1, 2.0);
    const stopY = (BLAME_ROW - 4) * BLAME_LH;
    return `
  tl.fromTo($("bscroll"), { y: -${stopY - 2 * BLAME_LH} }, { y: -${stopY}, duration: 0.5, ease: "power2.out" }, 0);
  fadeIn($("tag"), 0.15);
  zoom(1.15, ${r2(Math.max(0, tV - 0.6))}, 0.5);
  tl.fromTo($("cursor"), { opacity: 0, x: 120, y: 120 }, { opacity: 1, x: 0, y: 0, duration: 0.3, ease: "power2.out" }, ${r2(Math.max(0.2, tV - 0.3))});
  tl.to($("who-${BLAME_ROW}"), { color: "${C.text}", backgroundColor: "rgba(150,32,30,0.95)", duration: 0.15 }, ${r2(tV + 0.05)});
  pop($("who"), ${r2(tV + 0.1)}, 0.4);
  tl.to($("zoom"), { scale: 1.32, duration: 0.2, ease: "power4.out" }, ${r2(tV + 0.05)}); flash("#E5534B", ${r2(tV + 0.05)}, 0.45, 0.4);
  shake(${r2(tT)}, 24, 5);
  tl.fromTo($("drop"), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.2 }, ${r2(tT + 0.1)});
  tl.to($("drop"), { y: 70, duration: 1.0, ease: "power1.in" }, ${r2(tT + 0.35)});`;
  } });

// 9 — own-it: straight from the name, swivel to the colleagues and say it; the calm nod
FR.push({ n: 9, start: { cam: CAM.mon, zoom: { s: 1.32, ...ZOOM_NAME }, hands: 0 }, clock: "Thứ Sáu 17:37", appName: "Lịch sử thay đổi", screen: [(P) => APPS.blame(P)],
  css: `#$Pbscroll{transform:translateY(-${(BLAME_ROW - 4) * BLAME_LH}px);} #$Pwho-${BLAME_ROW}{color:${C.text};background:rgba(150,32,30,0.95);}`,
  overlay: `<div id="$Pwho" class="$Psticker" style="left:150px;top:1010px;background:${C.text};font-family:'JetBrains Mono';font-size:48px;">minh · thứ Ba</div>`
    + TAG("$P", "tag", "Báo ngay, không giấu"),
  script: (P, n, D) => {
    const end = voiceEnd(9, D - 1.2);
    return `
  fadeOut($("who"), 0, 0.3);
  zoom(1, 0, 0.5);
  hands(0.35, 0.05, 0.4);
  pan(${CAM.col}, 0.1, 0.7);
  tl.set($("mai-phone"), { opacity: 1 }, 0); tl.set($("mai-eyes"), { y: 10 }, 0);
  tl.set($("mai-eyes"), { y: 0, x: -16 }, 0.7); tl.set($("quan-eyes"), { x: -14, y: 0 }, 0.7);
  tl.fromTo($("fg"), { x: 0 }, { x: 5, duration: 0.06, repeat: 13, yoyo: true, ease: "none" }, 0.8);
  tl.to($("quan-head"), { rotation: -4, y: 12, svgOrigin: "2250 760", duration: 0.2, ease: "power1.inOut" }, ${r2(end + 0.1)});
  tl.to($("quan-head"), { rotation: 0, y: 0, duration: 0.25, ease: "power1.inOut" }, ${r2(end + 0.3)});
  tl.to($("mai-phone"), { y: -60, duration: 0.3, ease: "power2.out" }, ${r2(end + 0.2)});
  fadeIn($("tag"), ${r2(Math.max(end + 0.1, D - 1.2))});`;
  } });

// 10 — fix-check: the fixed line; chị Mai's test phone; the spinner
const PHONE = (P, { result = "" } = {}) => `<div id="${P}phone" class="${P}phone" style="opacity:0;">
  <div class="${P}pt">Bản thử<br>giống hệ thống thật</div>
  <div class="${P}pg">${CART(26)}Giỏ Hời</div>
  <div class="${P}pl">Mã giảm giá</div><div class="${P}pf">(để trống)</div><div class="${P}pb">Thanh toán</div>
  <svg id="${P}spin" width="110" height="110" viewBox="0 0 50 50" style="position:absolute;left:135px;top:420px;opacity:0;"><circle cx="25" cy="25" r="20" fill="none" stroke="rgba(245,239,228,0.2)" stroke-width="6"/><path d="M25 5 a20 20 0 0 1 20 20" fill="none" stroke="${C.teal}" stroke-width="6" stroke-linecap="round"/></svg>
  <div id="${P}pok" style="position:absolute;left:0;right:0;top:390px;display:flex;flex-direction:column;align-items:center;gap:16px;opacity:${result === "ok" ? 1 : 0};">${tick(130)}<div style="font-size:30px;font-weight:800;color:${C.ok};">Thanh toán thành công</div></div>
  <div id="${P}finger" style="position:absolute;left:190px;top:330px;width:70px;height:70px;border-radius:50%;background:rgba(245,239,228,0.35);opacity:0;"></div>
</div>`;
FR.push({ n: 10, start: { cam: CAM.col, zoom: { s: 1, x: 540, y: 760 }, hands: 0.35 }, clock: "Thứ Sáu 17:50", appName: "Lịch sử thay đổi", screen: [(P) => APPS.blame(P)],
  overlay: TAG("$P", "tagOld", "Báo ngay, không giấu", "opacity:1;")
    + `<div id="$Pfixcard" class="$Pcard" style="top:330px;opacity:0;padding:20px 24px;"><small style="margin:0 0 10px;color:${C.ok};font-weight:800;">Đã sửa</small><div style="font-family:'JetBrains Mono';font-size:30px;white-space:nowrap;background:rgba(63,182,139,0.18);border-radius:10px;padding:10px;">const ma = (maGiamGia ?? "").trim();</div></div>`
    + PHONE("$P") + TAG("$P", "tag", "Thử lại với ô mã để trống", "top:1300px;font-size:36px;"),
  script: (P, n, D) => {
    const tS = cue(10, "sửa", 1, 0.3), tM = cue(10, "mai", 1, 1.1);
    return `
  fadeOut($("tagOld"), 0.5, 0.3);
  tl.set($("mai-phone"), { opacity: 1, y: -60 }, 0);
  fadeIn($("fixcard"), ${r2(Math.max(0.15, tS - 0.1))});
  fadeOut($("fixcard"), ${r2(tM + 0.55)}, 0.25);
  tl.fromTo($("phone"), { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, ${r2(tM)});
  fadeIn($("tag"), ${r2(tM + 0.15)});
  tl.fromTo($("finger"), { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.15 }, ${r2(tM + 0.65)});
  tl.to($("finger"), { opacity: 0, duration: 0.2 }, ${r2(tM + 0.85)});
  tl.set($("spin"), { opacity: 1 }, ${r2(tM + 0.85)});
  tl.fromTo($("spin"), { rotation: 0, transformOrigin: "50% 50%" }, { rotation: 900, duration: ${r2(D)}, ease: "none" }, ${r2(tM + 0.85)});`;
  } });

// 11 — qc-ok: the phone flips to success; chị Mai turns, thumbs up, laughs
FR.push({ n: 11, start: { cam: CAM.col, zoom: { s: 1, x: 540, y: 760 }, hands: 0.35 }, confetti: true, clock: "Thứ Sáu 17:53", appName: "Lịch sử thay đổi", screen: [(P) => APPS.blame(P)],
  overlay: PHONE("$P").replace('style="opacity:0;"', 'style="opacity:1;"') + TAG("$P", "tagOld", "Thử lại với ô mã để trống", "top:1300px;font-size:36px;opacity:1;") + TAG("$P", "tag", "Kiểm thử: Đạt", `border-color:${C.ok};`),
  script: (P, n, D) => `
  tl.set($("spin"), { opacity: 1 }, 0); tl.set($("spin"), { opacity: 0 }, 0.08);
  confetti(0.1, -300, -100); flash("#3FB68B", 0.08, 0.3, 0.4);
  tl.fromTo($("pok"), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, 0.08);
  fadeOut($("tagOld"), 0.6, 0.25); fadeIn($("tag"), 0.2);
  tl.set($("mai-phone"), { opacity: 0 }, 0.3);
  tl.set($("mai-armr"), { opacity: 0 }, 0.3); pop($("mai-thumb"), 0.3, 0.5);
  tl.set($("mai-smile"), { opacity: 0 }, 0.25); tl.set($("mai-laugh"), { opacity: 1 }, 0.25);
  tl.fromTo($("mai-head"), { rotation: 3, svgOrigin: "1860 820" }, { rotation: 0, duration: 0.35, ease: "power2.out" }, 0.2);
  tl.to($("mai-head"), { y: -6, duration: 0.12, repeat: 5, yoyo: true, ease: "sine.inOut" }, 0.4);
  tl.to($("phone"), { opacity: 0, y: 40, duration: 0.3 }, ${r2(D - 0.4)});` });

// 12 — release: "Phát hành bản sửa"; night outside; high-five; the boss's thanks; push in on the melted tea
FR.push({ n: 12, start: { cam: CAM.col, zoom: { s: 1, x: 540, y: 760 }, hands: 0.35 }, confetti: true, clock: "Thứ Sáu 18:45", appName: "Phát hành", screen: [(P) => APPS.release(P)],
  css: `#$Ptea-ice{opacity:0;} #$Ptea-fill{opacity:0;} #$Ptea-pale{opacity:1 !important;} #$Pnight{opacity:1 !important;}`,
  overlay: TAG("$P", "tagOld", "Kiểm thử: Đạt", `border-color:${C.ok};opacity:1;`) + TAG("$P", "tag", "Xong! Cả nhóm cùng xử lý")
    + `<div id="$Pt1" class="$Ptoast" style="top:300px;opacity:0;"><i style="background:#1E4E5C;">Q</i><div><b>Anh Quân · 18:45</b><span>Đã báo tình hình cho khách</span></div></div>`
    + `<div id="$Pt2" class="$Ptoast" style="top:430px;opacity:0;"><i style="background:#3A4A63;">S</i><div><b>Sếp · 18:46</b><span>Cảm ơn cả nhóm nhé!</span></div></div>`
    + `<svg id="$Pclap" width="260" height="200" viewBox="0 0 260 200" style="position:absolute;left:520px;top:780px;opacity:0;">${[[-70, 40], [-35, 10], [0, 0], [35, 10], [70, 40]].map(([dx, dy]) => `<path d="M${130 + dx * 0.6} ${110 - dy * 0.6} L${130 + dx * 1.4} ${110 - dy * 1.6 - 40}" stroke="${C.warn}" stroke-width="10" stroke-linecap="round"/>`).join("")}</svg>`,
  script: (P, n, D) => {
    const tX = cueEnd(12, "xong", 1, 1.0);
    return `
  fadeOut($("tagOld"), 0, 0.25);
  tl.set($("mai-armr"), { opacity: 0 }, 0); tl.set($("mai-thumb"), { opacity: 1 }, 0); tl.set($("mai-laugh"), { opacity: 1 }, 0); tl.set($("mai-smile"), { opacity: 0 }, 0);
  pan(${CAM.mon}, 0, 0.5); hands(0, 0.1, 0.4);
  pop($("reltick"), 0.35, 0.6);
  pan(${CAM.col}, ${r2(Math.max(0.9, tX))}, 0.55); hands(1, ${r2(Math.max(0.9, tX))}, 0.3);
  tl.set($("mai-thumb"), { opacity: 0 }, ${r2(Math.max(0.9, tX))}); tl.set($("mai-palm"), { opacity: 1 }, ${r2(Math.max(0.9, tX))});
  tl.set($("quan-armdown"), { opacity: 0 }, ${r2(Math.max(0.9, tX))}); tl.set($("quan-armup"), { opacity: 1 }, ${r2(Math.max(0.9, tX))});
  tl.set($("fg"), { y: 0 }, ${r2(Math.max(1.45, tX + 0.55))});
  tl.set($("hand-l"), { opacity: 0 }, ${r2(Math.max(1.45, tX + 0.55))}); tl.set($("hand-r"), { opacity: 0 }, ${r2(Math.max(1.45, tX + 0.55))});
  tl.set($("palm"), { opacity: 0, y: 500 }, 0); tl.set($("palm"), { opacity: 1 }, ${r2(Math.max(1.45, tX + 0.55))});
  tl.to($("palm"), { y: 0, duration: 0.3, ease: "power3.out" }, ${r2(Math.max(1.45, tX + 0.55))});
  tl.fromTo($("clap"), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1.1, duration: 0.2, ease: "power2.out" }, ${r2(Math.max(1.75, tX + 0.85))});
  fadeOut($("clap"), ${r2(Math.max(2.1, tX + 1.2))}, 0.3);
  confetti(${r2(Math.max(1.75, tX + 0.85))}, 120, 0);
  fadeIn($("tag"), ${r2(Math.max(1.8, tX + 0.9))});
  fadeIn($("t1"), ${r2(Math.max(1.9, tX + 0.95))}); fadeIn($("t2"), ${r2(Math.max(2.2, tX + 1.25))});
  tl.to($("palm"), { y: 500, duration: 0.3, ease: "power2.in" }, ${r2(D - 1.3)}); tl.set($("palm"), { opacity: 0 }, ${r2(D - 1.0)});
  fadeOut($("t1"), ${r2(D - 1.0)}, 0.25); fadeOut($("t2"), ${r2(D - 1.0)}, 0.25); fadeOut($("tag"), ${r2(D - 1.0)}, 0.25);
  pan(${CAM_TEA}, ${r2(D - 0.95)}, 0.45);
  origin(${ZOOM_TEA.x}, ${ZOOM_TEA.y}, ${r2(D - 0.95)}); zoom(1.45, ${r2(D - 0.75)}, 0.7, "power2.out");`;
  } });

// 13 — postmortem: Monday morning, the team meeting; the report on the wall screen; anh Quân points; "Ai viết dòng này?"
// struck through and replaced; nods round the table; sticker
FR.push({ n: 13, start: { cam: CAM.mon, zoom: { s: 1, x: 540, y: 480 }, hands: 0 }, clock: "Thứ Hai 9:00", appName: "Họp nhóm · rút kinh nghiệm", screen: [(P) => APPS.doc(P)], room: ROOM,
  overlay: TAG("$P", "day", "Sáng thứ Hai", "opacity:1;font-size:34px;") + TAG("$P", "tag", "Tìm cách, không tìm người", "top:1290px;")
    + `<div id="$Pstk" class="$Psticker" style="left:300px;top:800px;opacity:0;">Không phải bản kiểm điểm đâu!</div>`,
  script: (P, n, D) => {
    const tT = cue(13, "tìm", 1, 2.2), tN = cue(13, "người", 1, 4.0);
    return `
  fadeOut($("day"), 1.6, 0.3);
  zoom(1.06, 0, ${r2(D)}, "power1.inOut");
  fadeIn($("tag"), ${r2(tT)});
  tl.set($("quan-armdown"), { opacity: 0 }, ${r2(tT)}); tl.set($("quan-armup"), { opacity: 1 }, ${r2(tT)});
  tl.fromTo($("quan-armup"), { y: 60 }, { y: 0, duration: 0.3, ease: "power2.out" }, ${r2(tT)});
  fadeIn($("actionline"), ${r2(tT + 0.3)});
  tl.to($("strike"), { scaleX: 1, duration: 0.35, ease: "power2.inOut" }, ${r2(tN - 0.2)});
  tl.to($("blameline"), { opacity: 0.45, duration: 0.2 }, ${r2(tN + 0.15)});
  ["mai", "lan", "tuan"].forEach(function (id, i) { tl.to($("seat-" + id + "-head"), { y: 10, duration: 0.18, repeat: 3, yoyo: true, ease: "sine.inOut" }, ${r2(tN + 0.1)} + i * 0.12); });
  gsap.set($("stk"), { rotation: -4 });
  pop($("stk"), ${r2(Math.min(D - 1.2, tN + 0.35))}, 0.7);`;
  } });

// 14 — question: calm desk, the checkout works; the question card
FR.push({ n: 14, start: { cam: CAM.mon, zoom: { s: 1, x: 540, y: 760 }, hands: 0 }, clock: "Thứ Hai 9:30", appName: "Giỏ Hời", screen: [(P) => APPS.checkout(P, { ok: true })], tea: false,
  overlay: TAG("$P", "tagOld", "Tìm cách, không tìm người", "top:1290px;opacity:1;")
    + `<div id="$Pask" class="$Pcard" style="top:1000px;opacity:0;"><b>Bạn sẽ làm gì?</b><small style="color:#F5EFE4;font-size:40px;font-weight:800;">Bình luận nhé!</small></div>`,
  script: (P, n, D) => `
  fadeOut($("tagOld"), 0, 0.3);
  pop($("ask"), ${r2(Math.max(0.3, cue(14, "bạn", 1, 0.3)))}, 0.8);` });

// ── write ─────────────────────────────────────────────────────────────────────
const outDir = join(ROOT, "compositions", "frames");
mkdirSync(outDir, { recursive: true });
for (const f of FR) {
  f.id = idOf(f.n);
  writeFileSync(join(outDir, `${f.id}.html`), frameFile(f));
  console.log(`wrote ${f.id}.html (${SB.scenes[f.n - 1].duration}s)`);
}
console.log(META.voices.length ? `cues from audio_meta.json (${META.voices.length} voices)` : "WARN no audio_meta.json — fallback cue times used");
