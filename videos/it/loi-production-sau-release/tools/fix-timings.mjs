#!/usr/bin/env node
// Re-times the words of frames whose Whisper transcript was unusable (frame 5: Whisper
// hallucinated a different sentence on the Thái Sơn take). Splits the script into clauses at
// , . ! ? … and spreads each clause over one speech segment found by ffmpeg silencedetect.
// Run after scripts/build-audio-meta.mjs, which would otherwise leave a proportional spread.
//
//   node tools/fix-timings.mjs <ffmpeg.exe> [frame ...]      (default: 5)

import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const FF = process.argv[2] || "ffmpeg";
const frames = process.argv.slice(3).map(Number).filter(Boolean);
const META = JSON.parse(readFileSync("audio_meta.json", "utf8"));
const r3 = (n) => Math.round(n * 1000) / 1000;

function speech(file, dur) {
  const { stderr } = spawnSync(FF, ["-hide_banner", "-nostats", "-i", file, "-af", "silencedetect=noise=-35dB:d=0.15", "-f", "null", "-"], { encoding: "utf8" });
  const sil = [];
  for (const m of stderr.matchAll(/silence_(start|end): ([\d.]+)/g)) {
    if (m[1] === "start") sil.push([+m[2], dur]); else sil[sil.length - 1][1] = +m[2];
  }
  const seg = []; let t = 0;
  for (const [a, b] of sil) { if (a - t > 0.1) seg.push([t, a]); t = b; }
  if (dur - t > 0.1) seg.push([t, dur]);
  return seg;
}

for (const n of frames.length ? frames : [5]) {
  const v = META.voices.find((x) => x.frame === n);
  const seg = speech(v.path, v.duration_s);
  // clauses: split after tokens ending in punctuation
  const clauses = [[]];
  for (const w of v.words) { clauses[clauses.length - 1].push(w); if (/[,.!?…]["”]?$/.test(w.text)) clauses.push([]); }
  if (!clauses[clauses.length - 1].length) clauses.pop();
  if (clauses.length !== seg.length) {
    console.log(`frame ${n}: ${clauses.length} clauses vs ${seg.length} speech segments — left as is`);
    continue;
  }
  clauses.forEach((cl, i) => {
    const [a, b] = seg[i], total = cl.reduce((s, w) => s + w.text.length, 0);
    let t = a;
    for (const w of cl) { const d = (b - a) * w.text.length / total; w.start = r3(t); w.end = r3(t + d); t += d; }
  });
  console.log(`frame ${n}: re-timed ${v.words.length} words over ${seg.length} speech segments ${JSON.stringify(seg.map((s) => s.map(r3)))}`);
}
writeFileSync("audio_meta.json", JSON.stringify(META, null, 2) + "\n");
