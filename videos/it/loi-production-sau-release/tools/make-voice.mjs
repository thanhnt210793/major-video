#!/usr/bin/env node
// Builds assets/voice/NN.wav for "loi-production-sau-release" from VieNeu takes:
//   - the meeting, mitigate and discover lines reuse the takes the reviewer picked in the voice audition
//     (content/.../audio/thu-giong/raw/), the others come from tts_vieneu.py (content/.../audio/tts-raw/);
//   - applies the chosen treatments (1A call filter, 3C acted cut, 4B tense tempo + room);
//   - levels every line to one loudness so cuts between voices don't jump.
// Records what was done in assets/voice/voice-build.json.
//
//   node tools/make-voice.mjs <ffmpeg.exe>      (run from the HyperFrames project root)

import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FF = process.argv[2] || "ffmpeg";
const FP = FF.replace(/ffmpeg(\.exe)?$/i, "ffprobe$1");
const CONTENT = "../../../content/it/loi-production-sau-release/audio";
const AUD = `${CONTENT}/thu-giong/raw`, RAW = `${CONTENT}/tts-raw`, OUT = "assets/voice";
const TARGET = -16; // LUFS, narration level (master lands near −14 with music and SFX)
mkdirSync(OUT, { recursive: true });

const ff = (args) => execFileSync(FF, ["-hide_banner", "-loglevel", "error", "-y", ...args]);
const dur = (f) => parseFloat(execFileSync(FP, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
// integrated loudness (ebur128 prints its summary on stderr)
function integrated(f) {
  const { stderr } = spawnSync(FF, ["-hide_banner", "-nostats", "-i", f, "-af", "ebur128", "-f", "null", "-"], { encoding: "utf8" });
  const m = [...stderr.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop();
  return m ? parseFloat(m[1]) : null;
}

// treatments (ffmpeg filter graphs on [0:a] → [v])
const CALL = "highpass=f=300,lowpass=f=3800,aecho=0.6:0.3:20:0.12";
const TENSE = "aecho=0.8:0.45:45:0.18";             // room only: the slowdown made the narrator drag
const LIVELY = "atempo=1.06";                         // narrator 6% faster for energy
// keyed by scene id; NN (frame number) comes from the storyboard order, so inserting a scene needs no renumbering
const SB = JSON.parse(readFileSync("../../../content/it/loi-production-sau-release/storyboard.json", "utf8"));
const nOf = (id) => { const k = SB.scenes.findIndex((x) => x.id === id); if (k < 0) throw new Error("no scene " + id); return k + 1; };
const raw = (id) => `${RAW}/${String(nOf(id)).padStart(2, "0")}.wav`;
const PLAN = [
  { id: "hook", fx: LIVELY, note: "liveliest of 5 takes that passed Whisper, 6% faster" },
  { id: "escalate", fx: LIVELY, note: "liveliest of 5 takes, 6% faster" },
  { id: "meeting", src: `${AUD}/4-take1-trim.wav`, fx: TENSE, note: "audition take 4-take1 (cut from 1.08 s), room reverb" },
  { id: "boss", fx: CALL, note: "take 1 of 5 (Thiền Tâm Đức; the ten-minute deadline line, round 4), call filter" },
  { id: "mitigate", src: `${AUD}/2B.wav`, note: "audition take 2B (Thái Sơn)" },
  { id: "works-locally", fx: LIVELY, gain: -1, note: "liveliest of 5 takes, 6% faster, 1 dB under (nghĩ thầm)" },
  { id: "hunt", fx: LIVELY, note: "take 4 of 5 (the only one heard with \"bản cũ\" and \"gộp\" right), 6% faster" },
  { id: "discover", src: `${AUD}/3-take1.wav`, acted: { from: 1.92, cut: 2.92, gap: 0.81 }, note: "audition take 3-take1 from 1.92 s (\"Dò lại…\" cut, the hunt covers it), 3C acted: 0.81 s gap after \"vậy?\", echo on the punchline" },
  { id: "own-it", from: 2.98, fx: `${LIVELY},${TENSE}`, note: "take 1 of 5 (the liveliest garbled \"báo\") from 2.98 s (the \"Tim đập thình thịch… Không!\" self-talk cut, round 5), 6% faster + room" },
  { id: "fix-check", fx: LIVELY, note: "liveliest of 5 takes that passed Whisper, 6% faster" },
  { id: "qc-ok", note: "Trúc Ly (chị Mai)" },
  { id: "release", fx: LIVELY, note: "liveliest of 5 takes, 6% faster" },
  { id: "postmortem", fx: LIVELY, note: "liveliest of 5 takes, 6% faster" },
  { id: "question", fx: LIVELY, note: "liveliest of 5 takes, 6% faster" },
].map((p) => ({ ...p, n: nOf(p.id), src: p.src ?? raw(p.id) }));
if (PLAN.length !== SB.scenes.length) throw new Error(`PLAN has ${PLAN.length} lines, storyboard has ${SB.scenes.length} scenes`);

const log = [];
for (const p of PLAN) {
  const nn = String(p.n).padStart(2, "0");
  const tmp = join(OUT, `${nn}.tmp.wav`), out = join(OUT, `${nn}.wav`);
  if (p.acted) {
    const { from = 0, cut, gap } = p.acted;
    ff(["-i", p.src, "-filter_complex",
      `[0:a]atrim=${from}:${cut},asetpts=PTS-STARTPTS[h];` +
      `aevalsrc=0:d=${gap}:s=24000[g];` +
      `[0:a]atrim=start=${cut},asetpts=PTS-STARTPTS,aecho=0.8:0.55:70:0.22[t];` +
      `[h]aresample=24000[h2];[t]aresample=24000[t2];[h2][g][t2]concat=n=3:v=0:a=1[v]`,
      "-map", "[v]", "-ar", "24000", "-ac", "1", tmp]);
  } else {
    ff(["-i", p.src, "-af", [p.from ? `atrim=start=${p.from},asetpts=PTS-STARTPTS` : null, p.fx ?? "anull"].filter(Boolean).join(","), "-ar", "24000", "-ac", "1", tmp]);
  }
  const L = integrated(tmp);
  const gain = L == null ? 0 : (TARGET + (p.gain ?? 0)) - L;
  ff(["-i", tmp, "-af", `volume=${gain.toFixed(2)}dB,alimiter=limit=0.95`, "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le", out]);
  rmSync(tmp);
  const d = dur(out);
  log.push({ frame: p.n, file: `${OUT}/${nn}.wav`, source: p.src.replace("../../../", ""), treatment: p.note ?? "none", loudness_in: L, gain_db: +gain.toFixed(2), duration_s: +d.toFixed(2) });
  console.log(`${nn}.wav  ${d.toFixed(2)}s  ${L?.toFixed(1)} LUFS → ${(TARGET + (p.gain ?? 0))}  ${p.note ?? ""}`);
}
writeFileSync(join(OUT, "voice-build.json"), JSON.stringify({ target_lufs: TARGET, lines: log }, null, 2) + "\n");
