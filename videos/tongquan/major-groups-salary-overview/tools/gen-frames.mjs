#!/usr/bin/env node
// Generates compositions/frames/NN-*.html for this video from one shared kit
// (desk background, POV hands + phone, ranked bar chart, group icons) so the
// chart built across frames 2–7 keeps identical geometry from frame to frame.
// Reveal cues come from audio_meta.json word timings (frame-relative seconds).
//
//   node tools/gen-frames.mjs        (run from the HyperFrames project root)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SB = JSON.parse(readFileSync(join(ROOT, "../../../content/tongquan/major-groups-salary-overview/storyboard.json"), "utf8"));
const META = existsSync(join(ROOT, "audio_meta.json")) ? JSON.parse(readFileSync(join(ROOT, "audio_meta.json"), "utf8")) : { voices: [] };
const W = 1080, H = 1920, TOTAL = SB.durationSeconds;
const C = { bg: "#0F1E33", navySoft: "#1B2E4A", teal: "#14B8A6", text: "#F5EFE4", muted: "#B8C4D3", light: "#8796A9", screen: "#13243B", neutral: "#7F8FA3", below: "#BDB6A9" };

// ── cue helper: start time of the n-th occurrence of a word in frame N ────────
const norm = (s) => String(s).normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
function cue(frame, word, nth = 1, fallback = 0) {
  const v = META.voices.find((x) => x.frame === frame);
  if (!v) return fallback;
  let seen = 0;
  for (const w of v.words) if (norm(w.text) === norm(word) && ++seen === nth) return Math.max(0, w.start);
  return fallback;
}
const r2 = (n) => Math.round(n * 100) / 100;

// ── camera: one continuous push-in + parallax across the whole video ──────────
const camScale = (t) => 1 + 0.035 * (t / TOTAL);
const bgShift = (t) => -36 * (t / TOTAL);

// ── shared geometry (canvas px) ───────────────────────────────────────────────
const PHONE = { x: 170, y: 150, w: 740, h: 1440, r: 96 };
const SCREEN = { x: 196, y: 176, w: 688, h: 1388, r: 74 };
const CH = { x0: 96, k: 3.2, top: 330, row: 92, barY: 42, barH: 30 }; // chart inside screen
const ROWS = [
  { id: "ict", v: 124, name: "Công nghệ thông tin", tone: "up", icon: "ict", label: `124 <span style="font-size:22px;font-weight:700;">(+24%)</span>` },
  { id: "eng", v: 108, name: "Kỹ thuật – Xây dựng", tone: "up", icon: "eng" },
  { id: "bus", v: 102, name: "Kinh doanh – Luật", tone: "up", icon: "bus" },
  { id: "nat", v: 101, name: "Khoa học tự nhiên – Toán", tone: "near", icon: "nat" },
  { id: "hea", v: 100, name: "Sức khỏe & phúc lợi", tone: "near", icon: "hea" },
  { id: "soc", v: 97, name: "Khoa học xã hội – Báo chí", tone: "down", icon: "soc" },
  { id: "art", v: 86, name: "Nghệ thuật – Nhân văn", tone: "down", icon: "art" },
  { id: "ser", v: 85, name: "Dịch vụ", sub: "(du lịch, khách sạn…)", tone: "down", icon: "ser" },
  { id: "edu", v: 82, name: "Giáo dục", tone: "down", icon: "edu" },
  { id: "agr", v: 81, name: "Nông – Lâm – Thủy sản, Thú y", tone: "down", icon: "agr" },
];
const toneColor = { up: C.teal, near: C.neutral, down: C.below };
const GRID = [ // frame 1 / 10 icon grid order (ISCED broad-field order)
  ["edu", "Giáo dục"], ["art", "Nghệ thuật – Nhân văn"], ["soc", "Khoa học xã hội – Báo chí"], ["bus", "Kinh doanh – Luật"],
  ["nat", "Khoa học tự nhiên – Toán"], ["ict", "Công nghệ thông tin"], ["eng", "Kỹ thuật – Xây dựng"],
  ["agr", "Nông – Lâm – Thủy sản, Thú y"], ["hea", "Sức khỏe & phúc lợi"], ["ser", "Dịch vụ"],
];

// ── icons (24×24 stroke paths) ────────────────────────────────────────────────
const ICON = {
  edu: "M2 9l10-5 10 5-10 5z M6 11v5c0 1.6 2.7 3 6 3s6-1.4 6-3v-5 M22 9v5",
  art: "M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.9 1.5-1.6 0-1.3-1.2-1.5-1.2-2.6 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5C21 6.2 17 3 12 3z M7.5 11.5h.01 M10 7.5h.01 M14.5 7.5h.01",
  soc: "M4 5h13v14H6a2 2 0 0 1-2-2z M17 9h3v8a2 2 0 0 1-2 2 M7 9h7 M7 13h7 M7 16h4",
  bus: "M3 8h18v11H3z M8 8V5h8v3 M3 13h18 M11 13v2h2v-2",
  nat: "M9 3h6 M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3 M7.5 15h9",
  ict: "M4 5h16v10H4z M2 19h20 M10 8l-2 2 2 2 M14 8l2 2-2 2",
  eng: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9 7 7 M17 17l2.1 2.1 M4.9 19.1 7 17 M17 7l2.1-2.1",
  agr: "M12 21V11 M12 11c0-4 3-7 8-7 0 5-3 8-8 8 M12 14c0-3-2.5-5.5-7-5.5 0 4 2.5 6.5 7 6.5",
  hea: "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z",
  ser: "M4 18h16 M6 18a6 6 0 0 1 12 0 M12 9V7 M10 7h4",
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 3.6-7 8-7s8 3 8 7",
};
const icon = (k, size, color, extra = "") =>
  `<svg ${extra} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${ICON[k]}"/></svg>`;

const FONT_FACE = [["Regular", 400], ["Medium", 500], ["SemiBold", 600], ["Bold", 700], ["ExtraBold", 800]]
  .map(([f, w]) => `@font-face{font-family:"Be Vietnam Pro";font-weight:${w};font-style:normal;font-display:block;src:url("assets/fonts/BeVietnamPro-${f}.ttf") format("truetype");}`)
  .join("\n");

// ── shared SVG layers ─────────────────────────────────────────────────────────
const deskSvg = (P) => `
<svg class="${P}desk" width="${W}" height="${H + 80}" viewBox="0 0 ${W} ${H + 80}">
  <defs>
    <linearGradient id="${P}g-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#11223A"/><stop offset="1" stop-color="#0B1626"/></linearGradient>
    <radialGradient id="${P}g-lamp" cx="0.16" cy="0.12" r="0.6"><stop offset="0" stop-color="#F5EFE4" stop-opacity="0.10"/><stop offset="1" stop-color="#F5EFE4" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H + 80}" fill="url(#${P}g-wall)"/>
  <rect width="${W}" height="${H + 80}" fill="url(#${P}g-lamp)"/>
  <g stroke="#F5EFE4" stroke-opacity="0.06" stroke-width="3" fill="none">
    <rect x="690" y="70" width="330" height="430" rx="10"/><path d="M855 70v430 M690 285h330"/>
  </g>
  <circle cx="960" cy="150" r="26" fill="#F5EFE4" fill-opacity="0.08"/>
  <rect x="0" y="1470" width="${W}" height="530" fill="#142640"/>
  <rect x="0" y="1470" width="${W}" height="3" fill="#F5EFE4" fill-opacity="0.07"/>
  <g transform="rotate(-8 860 1690)"><rect x="700" y="1600" width="330" height="220" rx="12" fill="#1B2E4A"/><path d="M730 1650h250 M730 1690h250 M730 1730h170" stroke="#F5EFE4" stroke-opacity="0.12" stroke-width="6" stroke-linecap="round"/></g>
  <g transform="rotate(18 120 1560)"><rect x="40" y="1548" width="230" height="20" rx="10" fill="#F2A93B" fill-opacity="0.55"/><path d="M270 1548l26 10-26 10z" fill="#E8D3B5" fill-opacity="0.6"/></g>
</svg>`;

const SKIN = "#E8B48F", SKIN_D = "#CF9572", NAIL = "#F4D3BC";
const handSvg = (P, side) => {
  const flip = side === "r" ? `transform="translate(${W} 0) scale(-1 1)"` : "";
  return `<g ${flip}>
    <path d="M-60 1920 L-60 1640 C 20 1600 120 1560 190 1585 L 330 1760 L 330 1920 Z" fill="${C.navySoft}"/>
    <path d="M-60 1660 C 20 1620 120 1580 190 1605" stroke="${C.teal}" stroke-opacity="0.55" stroke-width="12" fill="none" stroke-linecap="round"/>
    <rect x="132" y="1150" width="74" height="48" rx="24" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3" transform="rotate(-6 169 1174)"/>
    <rect x="128" y="1222" width="78" height="50" rx="25" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3" transform="rotate(-4 167 1247)"/>
    <rect x="130" y="1296" width="76" height="48" rx="24" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3" transform="rotate(-2 168 1320)"/>
    <path d="M40 1700 C 20 1560 70 1420 175 1372 L 215 1380 C 240 1470 245 1560 210 1640 C 170 1700 100 1730 40 1700 Z" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/>
    <g transform="rotate(-38 220 1560)">
      <rect x="196" y="1408" width="62" height="200" rx="31" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/>
      <ellipse cx="227" cy="1438" rx="20" ry="24" fill="${NAIL}"/>
    </g>
  </g>`;
};

const phoneSvg = (P) => `
<svg class="${P}phone-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect x="${PHONE.x - 6}" y="${PHONE.y + 14}" width="${PHONE.w + 12}" height="${PHONE.h}" rx="${PHONE.r + 6}" fill="#050A12" fill-opacity="0.55"/>
  <rect x="${PHONE.x}" y="${PHONE.y}" width="${PHONE.w}" height="${PHONE.h}" rx="${PHONE.r}" fill="#070D17" stroke="#F5EFE4" stroke-opacity="0.16" stroke-width="3"/>
  <rect x="${PHONE.x + PHONE.w / 2 - 70}" y="${PHONE.y + 40}" width="140" height="34" rx="17" fill="#000"/>
</svg>`;

const handsSvg = (P) => `<svg class="${P}hands" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${handSvg(P, "l")}${handSvg(P, "r")}</svg>`;

// ── screen content builders ───────────────────────────────────────────────────
const statusBar = (P) => `<div class="${P}status"><span>21:30</span><span class="${P}batt"></span></div>`;
const appHeader = (P, activeTab) => `
<div class="${P}appbar">
  <div class="${P}apptitle">So sánh nhóm ngành</div>
  <div class="${P}tabs"><span id="${P}tab-a" class="${P}tab ${activeTab === "groups" ? P + "on" : ""}">Nhóm ngành</span><span id="${P}tab-b" class="${P}tab ${activeTab === "income" ? P + "on" : ""}">Thu nhập</span></div>
</div>`;
const footnote = (P, lines) => `<div id="${P}foot" class="${P}foot">${lines.map((l) => `<div>${l}</div>`).join("")}</div>`;
const FOOT_OECD = ["25–34 tuổi · làm toàn thời gian", "các nước OECD, năm 2023 · không gồm Việt Nam"];

function chartHtml(P, { shown = 10, scaffold = true } = {}) {
  const lineX = CH.x0 + 100 * CH.k;
  let rows = "";
  ROWS.forEach((r, i) => {
    const y = CH.top + i * CH.row;
    const vis = i < shown ? "" : "opacity:0;";
    rows += `
  <div id="${P}row-${r.id}" class="${P}row" style="top:${y}px;${vis}">
    <div class="${P}rname">${icon(r.icon, 34, C.muted, `class="${P}ricon"`)}<span>${r.name}</span>${r.sub ? `<span class="${P}rsub">${r.sub}</span>` : ""}</div>
    <div id="${P}bar-${r.id}" class="${P}bar" style="top:${CH.barY}px;width:${r.v * CH.k}px;background:${toneColor[r.tone]};"></div>
    <div id="${P}val-${r.id}" class="${P}val" style="top:${CH.barY - 6}px;left:${CH.x0 + r.v * CH.k + 8}px;color:${r.tone === "up" ? C.teal : C.text};">${r.label ?? r.v}</div>
  </div>`;
  });
  return `
<div id="${P}chart" class="${P}chart" style="${scaffold ? "" : "opacity:0;"}">
  <div id="${P}line" class="${P}line" style="left:${lineX}px;"></div>
  <div id="${P}line-label" class="${P}line-label" style="left:${lineX}px;">100 = mức chung</div>
  ${rows}
</div>`;
}

function iconGridHtml(P) {
  return `<div id="${P}grid" class="${P}grid">${GRID.map(([k, n], i) => `<div id="${P}cell-${i}" class="${P}cell">${icon(k, 46, C.teal)}<span>${n}</span></div>`).join("")}</div>`;
}

// ── CSS (prefixed per frame) ──────────────────────────────────────────────────
const css = (P) => `
${FONT_FACE}
#root{position:absolute;inset:0;width:100%;height:100%;overflow:hidden;font-family:"Be Vietnam Pro";color:${C.text};}
.${P}ground{position:absolute;inset:0;background:${C.bg};}
.${P}world{position:absolute;inset:0;transform-origin:50% 42%;}
.${P}desk{position:absolute;left:0;top:-40px;}
.${P}device{position:absolute;inset:0;}
.${P}phone-svg,.${P}hands{position:absolute;left:0;top:0;}
.${P}screen{position:absolute;left:${SCREEN.x}px;top:${SCREEN.y}px;width:${SCREEN.w}px;height:${SCREEN.h}px;border-radius:${SCREEN.r}px;background:${C.screen};overflow:hidden;}
.${P}status{position:absolute;left:58px;right:58px;top:26px;display:flex;justify-content:space-between;font-size:22px;font-weight:600;color:${C.muted};}
.${P}batt{width:44px;height:20px;border:2px solid ${C.muted};border-radius:6px;position:relative;top:4px;}
.${P}appbar{position:absolute;left:0;right:0;top:92px;padding:0 48px;}
.${P}apptitle{font-size:42px;font-weight:800;letter-spacing:-0.01em;}
.${P}tabs{display:flex;gap:16px;margin-top:22px;}
.${P}tab{font-size:24px;font-weight:600;padding:10px 26px;border-radius:100px;border:2px solid rgba(20,184,166,0.35);color:${C.muted};}
.${P}tab.${P}on{background:${C.teal};border-color:${C.teal};color:#0B1626;}
.${P}chart{position:absolute;inset:0;}
.${P}line{position:absolute;top:${CH.top - 26}px;height:${10 * CH.row + 14}px;width:0;border-left:3px dashed rgba(245,239,228,0.45);}
.${P}line-label{position:absolute;top:${CH.top - 70}px;transform:translateX(-50%);font-size:22px;font-weight:600;color:${C.text};white-space:nowrap;background:${C.navySoft};padding:4px 14px;border-radius:100px;}
.${P}row{position:absolute;left:0;right:0;height:${CH.row}px;}
.${P}rname{position:absolute;left:${CH.x0 - 52}px;top:0;display:flex;align-items:center;gap:12px;font-size:25px;font-weight:600;white-space:nowrap;}
.${P}ricon{flex:none;}
.${P}rsub{font-size:20px;font-weight:500;color:${C.muted};}
.${P}bar{position:absolute;left:${CH.x0}px;height:${CH.barH}px;border-radius:6px;transform-origin:0 50%;}
.${P}val{position:absolute;font-size:30px;font-weight:800;white-space:nowrap;font-variant-numeric:tabular-nums;padding:0 6px;background:${C.screen};border-radius:6px;}
.${P}foot{position:absolute;left:40px;right:40px;top:1262px;text-align:center;font-size:21px;line-height:1.45;font-weight:500;color:${C.muted};}
.${P}home{position:absolute;left:50%;bottom:22px;width:220px;height:8px;margin-left:-110px;border-radius:4px;background:rgba(245,239,228,0.35);}
.${P}grid{position:absolute;left:40px;right:40px;top:640px;display:grid;grid-template-columns:1fr 1fr;gap:18px;}
.${P}cell{display:flex;align-items:center;gap:16px;padding:16px 18px;border-radius:14px;background:rgba(20,184,166,0.06);border:2px solid rgba(20,184,166,0.2);font-size:22px;font-weight:600;line-height:1.25;min-height:104px;}
.${P}cell svg{flex:none;}
.${P}tap{position:absolute;width:90px;height:90px;margin:-45px 0 0 -45px;border-radius:50%;border:4px solid ${C.text};opacity:0;}
`;

// ── frame assembly ────────────────────────────────────────────────────────────
function frameFile({ n, id, inner, screen, extraCss = "", script }) {
  const P = `f${String(n).padStart(2, "0")}-`;
  const s = SB.scenes[n - 1];
  const D = s.duration, g0 = s.start, g1 = s.start + s.duration;
  const html = `<template>
<style>
${css(P)}
${extraCss.replaceAll("$P", P)}
</style>
<div id="root" data-composition-id="${id}" data-width="${W}" data-height="${H}" data-duration="${D}">
  <div id="${P}ground" class="${P}ground clip" data-start="0" data-duration="${D}" data-track-index="0"></div>
  <div id="${P}world" class="${P}world clip" data-start="0" data-duration="${D}" data-track-index="1">
    <div id="${P}bgwrap" style="position:absolute;inset:0;">${deskSvg(P)}</div>
    ${(inner ?? "").replaceAll("$P", P)}
    <div id="${P}device" class="${P}device">
      ${phoneSvg(P)}
      <div id="${P}screen" class="${P}screen">
        ${statusBar(P)}
        ${screen(P)}
        <div class="${P}home"></div>
      </div>
      ${handsSvg(P)}
    </div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script>
(function () {
  const P = "${P}";
  const $ = (s) => document.getElementById(P + s);
  const tl = gsap.timeline({ paused: true });
  tl.fromTo($("world"), { scale: ${r2(camScale(g0) * 1000) / 1000} }, { scale: ${r2(camScale(g1) * 1000) / 1000}, duration: ${D}, ease: "none" }, 0);
  tl.fromTo($("bgwrap"), { y: ${r2(bgShift(g0))} }, { y: ${r2(bgShift(g1))}, duration: ${D}, ease: "none" }, 0);
${script(P, n, D)}
  window.__timelines["${id}"] = tl;
})();
</script>
</template>
`;
  return html;
}

// common motion snippets (strings of JS using tl / $)
const growBar = (rowId, at, dur = 0.7) =>
  `  tl.fromTo($("row-${rowId}"), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" }, ${r2(at)});
  tl.fromTo($("bar-${rowId}"), { scaleX: 0 }, { scaleX: 1, duration: ${dur}, ease: "power3.out" }, ${r2(at + 0.1)});
  tl.fromTo($("val-${rowId}"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, ${r2(at + dur * 0.75)});`;

const FRAMES = [];

// 1 — hook
FRAMES.push({
  n: 1, id: "01-hook",
  screen: (P) => `${appHeader(P, "groups")}
    <div id="${P}ten" style="position:absolute;left:48px;top:300px;font-size:230px;font-weight:800;line-height:0.9;color:${C.teal};letter-spacing:-0.04em;">10</div>
    <div id="${P}tenlbl" style="position:absolute;left:300px;top:330px;width:340px;font-size:38px;font-weight:700;line-height:1.2;">nhóm ngành chuyên môn</div>
    <div id="${P}tensrc" style="position:absolute;left:48px;top:560px;font-size:23px;font-weight:500;color:${C.muted};">theo phân loại quốc tế của UNESCO</div>
    ${iconGridHtml(P)}`,
  script: (P, n, D) => {
    const t2 = cue(1, "cùng", 1, 1.7);
    return `  tl.fromTo($("device"), { y: 760, rotation: -5 }, { y: 0, rotation: 0, duration: 1.0, ease: "power3.out" }, 0);
  tl.fromTo($("screen"), { opacity: 0.15 }, { opacity: 1, duration: 0.45, ease: "power2.out" }, 0.55);
  tl.fromTo($("ten"), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.6)" }, ${r2(t2)});
  tl.fromTo([$("tenlbl"), $("tensrc")], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.15 }, ${r2(t2 + 0.25)});
  tl.fromTo(Array.from({ length: 10 }, (_, i) => $("cell-" + i)), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)", stagger: 0.05 }, ${r2(t2 + 0.55)});`;
  },
});

// 2 — baseline: tap Thu nhập, grid → empty chart with the 100 line + footnote
FRAMES.push({
  n: 2, id: "02-baseline",
  screen: (P) => `${appHeader(P, "groups")}
    ${iconGridHtml(P)}
    ${chartHtml(P, { shown: 0 })}
    ${footnote(P, FOOT_OECD)}
    <div id="${P}tap" class="${P}tap" style="left:${48 + 230 + 16 + 85}px;top:${92 + 42 + 22 + 30}px;"></div>`,
  script: (P) => {
    const tLine = cue(2, "mốc", 1, 1.8), tFoot = cue(2, "người", 1, 3.6);
    return `  tl.fromTo($("tap"), { opacity: 0.9, scale: 0.4 }, { opacity: 0, scale: 1.4, duration: 0.5, ease: "power2.out" }, 0.25);
  tl.set($("tab-b"), { className: P + "tab " + P + "on" }, 0.32);
  tl.set($("tab-a"), { className: P + "tab" }, 0.32);
  tl.fromTo($("grid"), { opacity: 1, y: 0 }, { opacity: 0, y: 40, duration: 0.35, ease: "power2.in" }, 0.4);
  tl.fromTo($("chart"), { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0.75);
  tl.fromTo($("line"), { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, duration: 0.8, ease: "power3.out" }, ${r2(tLine)});
  tl.fromTo($("line-label"), { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.6)" }, ${r2(tLine + 0.35)});
  tl.fromTo($("foot"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, ${r2(tFoot)});`;
  },
});

// 3 — ICT bar
FRAMES.push({
  n: 3, id: "03-top-ict",
  extraCss: `.$Pglow{position:absolute;width:520px;height:120px;border-radius:60px;background:radial-gradient(closest-side, rgba(20,184,166,0.35), rgba(20,184,166,0));}`,
  screen: (P) => `${appHeader(P, "income")}${chartHtml(P, { shown: 0 })}${footnote(P, FOOT_OECD)}
    <div id="${P}glow" class="${P}glow" style="left:${CH.x0 - 40}px;top:${CH.top + CH.barY - 45}px;opacity:0;"></div>`,
  script: () => {
    const t = cue(3, "công", 1, 0.05), tPct = cue(3, "khoảng", 1, 2.4);
    return `${growBar("ict", t, 1.0)}
  tl.fromTo($("glow"), { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, ${r2(tPct)});
  tl.fromTo($("val-ict"), { scale: 1 }, { scale: 1.12, duration: 0.25, ease: "power2.out", transformOrigin: "0% 50%" }, ${r2(tPct + 0.2)});
  tl.to($("val-ict"), { scale: 1, duration: 0.35, ease: "power2.inOut" }, ${r2(tPct + 0.45)});`;
  },
});

// 4 — three bars around/above 100
FRAMES.push({
  n: 4, id: "04-above-average",
  screen: (P) => `${appHeader(P, "income")}${chartHtml(P, { shown: 1 })}${footnote(P, FOOT_OECD)}`,
  script: () => `${growBar("eng", cue(4, "kỹ", 1, 0.05))}
${growBar("bus", cue(4, "kinh", 1, 1.4))}
${growBar("nat", cue(4, "khoa", 1, 2.9))}`,
});

// 5 — health on the line + example popover (6-country sub-fields)
const POP = { x: 28, y: CH.top + 5 * CH.row + 4, w: SCREEN.w - 56, h: 300 };
FRAMES.push({
  n: 5, id: "05-health-split",
  extraCss: `.$Ppop{position:absolute;left:${POP.x}px;top:${POP.y}px;width:${POP.w}px;height:${POP.h}px;border-radius:14px;background:${C.navySoft};border:2px solid rgba(20,184,166,0.45);box-shadow:0 18px 40px rgba(0,0,0,0.35);}
.$Ppop-h{position:absolute;left:24px;top:18px;font-size:21px;font-weight:600;letter-spacing:0.04em;color:${C.teal};text-transform:uppercase;}
.$Psrow{position:absolute;left:0;right:0;height:100px;}
.$Psname{position:absolute;left:24px;top:0;font-size:24px;font-weight:600;}
.$Psbar{position:absolute;left:${CH.x0 - POP.x}px;top:40px;height:30px;border-radius:6px;transform-origin:0 50%;}
.$Psval{position:absolute;top:34px;font-size:30px;font-weight:800;padding:0 6px;background:${C.navySoft};border-radius:6px;}
.$Psline{position:absolute;left:${CH.x0 + 100 * CH.k - POP.x}px;top:60px;height:${POP.h - 76}px;border-left:3px dashed rgba(245,239,228,0.45);}`,
  screen: (P) => `${appHeader(P, "income")}${chartHtml(P, { shown: 4 })}${footnote(P, FOOT_OECD)}
    <div id="${P}pop" class="${P}pop" style="opacity:0;">
      <div class="${P}pop-h">Ví dụ trong nhóm · số liệu 6 nước</div>
      <div class="${P}sline"></div>
      <div id="${P}s1" class="${P}srow" style="top:70px;"><div class="${P}sname">Y khoa, Nha khoa</div><div id="${P}s1bar" class="${P}sbar" style="width:${116 * CH.k}px;background:${C.teal};"></div><div id="${P}s1val" class="${P}sval" style="left:${CH.x0 - POP.x + 116 * CH.k + 14}px;color:${C.teal};">116</div></div>
      <div id="${P}s2" class="${P}srow" style="top:180px;"><div class="${P}sname">Điều dưỡng &amp; ngành liên quan</div><div id="${P}s2bar" class="${P}sbar" style="width:${93 * CH.k}px;background:${C.below};"></div><div id="${P}s2val" class="${P}sval" style="left:${CH.x0 - POP.x + 93 * CH.k + 14}px;">93</div></div>
    </div>`,
  script: () => {
    const tPop = cue(5, "nhưng", 1, 2.4), tS1 = cue(5, "y", 1, 2.8), tS2 = cue(5, "điều", 1, 5.2);
    return `${growBar("hea", cue(5, "sức", 1, 0.05))}
  tl.fromTo($("pop"), { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" }, ${r2(tPop)});
  tl.fromTo($("s1"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${r2(tS1)});
  tl.fromTo($("s1bar"), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.out" }, ${r2(tS1 + 0.05)});
  tl.fromTo($("s1val"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${r2(tS1 + 0.65)});
  tl.fromTo($("s2"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${r2(tS2)});
  tl.fromTo($("s2bar"), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.out" }, ${r2(tS2 + 0.05)});
  tl.fromTo($("s2val"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${r2(tS2 + 0.65)});`;
  },
});

// 6 — social sciences, arts (popover from frame 5 dismisses first)
FRAMES.push({
  n: 6, id: "06-below-average-1",
  extraCss: `.$Ppop{position:absolute;left:${POP.x}px;top:${POP.y}px;width:${POP.w}px;height:${POP.h}px;border-radius:14px;background:${C.navySoft};border:2px solid rgba(20,184,166,0.45);}`,
  screen: (P) => `${appHeader(P, "income")}${chartHtml(P, { shown: 5 })}${footnote(P, FOOT_OECD)}<div id="${P}pop" class="${P}pop"></div>`,
  script: () => `  tl.fromTo($("pop"), { opacity: 1, y: 0 }, { opacity: 0, y: 30, duration: 0.3, ease: "power2.in" }, 0);
${growBar("soc", Math.max(0.3, cue(6, "khoa", 1, 0.3)))}
${growBar("art", cue(6, "nghệ", 1, 2.1))}`,
});

// 7 — last three + slight push-out to show the full chart
FRAMES.push({
  n: 7, id: "07-below-average-2",
  screen: (P) => `${appHeader(P, "income")}${chartHtml(P, { shown: 7 })}${footnote(P, FOOT_OECD)}`,
  script: (P, n, D) => `${growBar("ser", cue(7, "dịch", 1, 0.05))}
${growBar("edu", cue(7, "giáo", 1, 0.7))}
${growBar("agr", cue(7, "nông", 1, 1.4))}
  tl.fromTo($("device"), { scale: 1 }, { scale: 0.97, duration: ${r2(Math.max(1, D - 3.2))}, ease: "power2.inOut", transformOrigin: "50% 45%" }, 3.0);`,
});

// 8 — Vietnam card (by qualification)
const VN = { top: 300, base: 1150 };
FRAMES.push({
  n: 8, id: "08-vietnam",
  extraCss: `.$Pvn{position:absolute;inset:0;}
.$Pvn-title{position:absolute;left:48px;top:${VN.top}px;font-size:46px;font-weight:800;}
.$Pvn-tag{position:absolute;left:48px;top:${VN.top + 72}px;font-size:22px;font-weight:600;color:#0B1626;background:${C.teal};padding:6px 18px;border-radius:100px;}
.$Pvcol{position:absolute;bottom:${SCREEN.h - VN.base}px;width:240px;display:flex;flex-direction:column;align-items:center;}
.$Pvbar{width:150px;border-radius:12px 12px 4px 4px;transform-origin:50% 100%;}
.$Pvval{font-size:40px;font-weight:800;margin-bottom:14px;white-space:nowrap;}
.$Pvlbl{position:absolute;top:${VN.base + 20}px;width:280px;text-align:center;font-size:23px;font-weight:600;line-height:1.3;}
.$Pvsrc{position:absolute;left:0;right:0;top:1262px;text-align:center;font-size:21px;font-weight:500;color:${C.muted};}`,
  screen: (P) => `${appHeader(P, "income")}
    <div id="${P}oldchart">${chartHtml(P, { shown: 10 })}${footnote(P, FOOT_OECD)}</div>
    <div id="${P}vn" class="${P}vn">
      <div id="${P}vtitle" class="${P}vn-title">Việt Nam 2024</div>
      <div id="${P}vtag" class="${P}vn-tag">theo bằng cấp</div>
      <div id="${P}c1" class="${P}vcol" style="left:84px;"><div id="${P}c1v" class="${P}vval">1</div>${icon("person", 70, C.muted)}<div id="${P}c1b" class="${P}vbar" style="height:280px;margin-top:12px;background:${C.below};"></div></div>
      <div id="${P}c2" class="${P}vcol" style="left:364px;"><div id="${P}c2v" class="${P}vval" style="color:${C.teal};">≈ gấp 1,6 lần</div>${icon("person", 70, C.teal)}<div id="${P}c2b" class="${P}vbar" style="height:448px;margin-top:12px;background:${C.teal};"></div></div>
      <div id="${P}l1" class="${P}vlbl" style="left:64px;">Chưa có bằng, chứng&nbsp;chỉ nghề</div>
      <div id="${P}l2" class="${P}vlbl" style="left:344px;">Đại học trở lên</div>
      <div id="${P}vsrc" class="${P}vsrc">Nguồn: Cục Thống kê · Điều tra lao động việc làm 2024</div>
    </div>`,
  script: () => {
    const tTitle = cue(8, "việt", 1, 0.4), tUni = cue(8, "đại", 1, 2.4), tX = cue(8, "gấp", 1, 4.0), tBase = cue(8, "chưa", 1, 5.4);
    return `  tl.fromTo($("oldchart"), { x: 0, opacity: 1 }, { x: -${SCREEN.w + 240}, opacity: 0, duration: 0.5, ease: "power3.inOut" }, 0.05);
  tl.fromTo($("vn"), { x: ${SCREEN.w} }, { x: 0, duration: 0.5, ease: "power3.inOut" }, 0.05);
  tl.fromTo([$("vtitle"), $("vtag")], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.15 }, ${r2(Math.max(0.6, tTitle))});
  tl.fromTo([$("c2"), $("l2")], { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${r2(tUni)});
  tl.fromTo($("c2b"), { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: "power3.out" }, ${r2(tUni)});
  tl.fromTo($("c2v"), { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, ${r2(tX)});
  tl.fromTo([$("c1"), $("l1")], { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${r2(tBase)});
  tl.fromTo($("c1b"), { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: "power3.out" }, ${r2(tBase)});
  tl.fromTo($("vsrc"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, ${r2(tBase + 0.6)});`;
  },
});

// 9 — back to the chart with an OECD stamp, then the phone lowers to a checklist note
const NOTE_ITEMS = ["Sở thích", "Năng lực", "Nhu cầu xã hội", "Thu nhập"];
FRAMES.push({
  n: 9, id: "09-takeaway",
  extraCss: `.$Pstamp{position:absolute;left:84px;top:560px;width:520px;padding:22px 26px;text-align:center;border:5px solid ${C.text};border-radius:18px;font-size:34px;font-weight:800;line-height:1.25;color:${C.text};background:rgba(15,30,51,0.82);transform:rotate(-6deg);}
.$Pnote{position:absolute;left:190px;top:170px;width:700px;height:640px;background:#F5EFE4;border-radius:10px;box-shadow:0 24px 50px rgba(0,0,0,0.45);transform-origin:50% 0%;}
.$Ppin{position:absolute;left:50%;top:-18px;width:150px;height:40px;margin-left:-75px;background:rgba(20,184,166,0.55);border-radius:4px;}
.$Pitem{position:absolute;left:70px;display:flex;align-items:center;gap:30px;font-size:46px;font-weight:700;color:#0F1E33;}
.$Pbox{width:58px;height:58px;border:5px solid #0F1E33;border-radius:12px;position:relative;flex:none;}
.$Ptick{position:absolute;left:4px;top:-14px;}`,
  inner: `<div id="$Pnote" class="$Pnote" data-layout-allow-overlap style="opacity:0;"><div class="$Ppin"></div>${NOTE_ITEMS.map((t, i) => `<div class="$Pitem" style="top:${90 + i * 132}px;"><div class="$Pbox"><svg id="$Ptick-${i}" class="$Ptick" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="${C.teal}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg></div><span>${t}</span></div>`).join("")}</div>`,
  screen: (P) => `${appHeader(P, "income")}
    <div id="${P}vnstub" style="position:absolute;inset:0;"></div>
    <div id="${P}chartwrap">${chartHtml(P, { shown: 10 })}${footnote(P, FOOT_OECD)}</div>
    <div id="${P}stamp" class="${P}stamp" data-layout-allow-overlap style="opacity:0;">Số liệu OECD<br/>không gồm Việt Nam</div>`,
  script: (P, n, D) => {
    const tStamp = cue(9, "nước", 1, 1.2), tLow = cue(9, "lương", 1, 3.0);
    const ticks = NOTE_ITEMS.map((_, i) => r2(tLow + 0.7 + i * 0.55));
    return `  tl.fromTo($("chartwrap"), { x: -${SCREEN.w + 240}, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.inOut" }, 0.05);
  tl.fromTo($("stamp"), { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power4.out" }, ${r2(tStamp)});
  tl.fromTo($("device"), { y: 0 }, { y: 1080, duration: 0.8, ease: "power3.inOut" }, ${r2(tLow)});
  tl.fromTo($("note"), { opacity: 0, y: -60, rotation: -6 }, { opacity: 1, y: 0, rotation: -2, duration: 0.6, ease: "power3.out" }, ${r2(tLow + 0.25)});
${ticks.map((t, i) => `  tl.fromTo(document.querySelector("#" + P + "tick-${i} path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, ${t});`).join("\n")}`;
  },
});

// 10 — question: phone comes back up with the icon grid and a comment box
FRAMES.push({
  n: 10, id: "10-question",
  extraCss: `.$Pgrid{top:470px;}
.$Pq{position:absolute;left:48px;right:48px;top:320px;font-size:48px;font-weight:800;line-height:1.2;}
.$Pcbox{position:absolute;left:40px;right:40px;top:1150px;height:92px;border-radius:46px;background:${C.navySoft};border:2px solid rgba(20,184,166,0.5);display:flex;align-items:center;padding:0 34px;font-size:28px;font-weight:600;color:${C.muted};}
.$Pcaret{display:inline-block;width:3px;height:38px;background:${C.teal};margin-left:8px;}`,
  screen: (P) => `${appHeader(P, "groups")}
    <div id="${P}q" class="${P}q">Bạn nghiêng về nhóm&nbsp;nào?</div>
    ${iconGridHtml(P)}
    <div id="${P}cbox" class="${P}cbox">Bình luận nhé!<span id="${P}caret" class="${P}caret"></span></div>`,
  script: (P, n, D) => {
    const tQ = cue(10, "nghiêng", 1, 0.6), tC = cue(10, "bình", 1, 1.6);
    const blinks = [];
    for (let t = tC + 0.5; t < D - 0.2; t += 0.5) blinks.push(`  tl.set($("caret"), { opacity: ${blinks.length % 2 ? 1 : 0} }, ${r2(t)});`);
    return `  tl.fromTo($("device"), { y: 1080 }, { y: 0, duration: 0.7, ease: "power3.out" }, 0);
  tl.fromTo($("q"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, ${r2(Math.max(0.5, tQ))});
  tl.fromTo(Array.from({ length: 10 }, (_, i) => $("cell-" + i)), { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)", stagger: 0.04 }, 0.35);
  tl.fromTo($("cbox"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, ${r2(tC)});
${blinks.join("\n")}`;
  },
});

// ── write ─────────────────────────────────────────────────────────────────────
const outDir = join(ROOT, "compositions", "frames");
mkdirSync(outDir, { recursive: true });
for (const f of FRAMES) {
  const file = join(outDir, `${f.id}.html`);
  writeFileSync(file, frameFile(f));
  console.log(`wrote ${file} (${SB.scenes[f.n - 1].duration}s)`);
}
console.log(META.voices.length ? `cues from audio_meta.json (${META.voices.length} voices)` : "WARN no audio_meta.json — fallback cue times used");
