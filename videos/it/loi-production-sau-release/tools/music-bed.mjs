#!/usr/bin/env node
// Music bed for "loi-production-sau-release": three CC0 beds from the channel library, placed
// on the story, then ducked under the narration (sidechain compression against the voice
// timeline) and written to assets/bgm/bgm.wav; audio_meta.json bgm points at it.
//   tension (hook → mitigate) → comic-suspense (self-talk + the hunt, cut on "vẫn bí!")
//   → no music (the reveal: riser + scratch; owning up: heartbeat only; the re-test: silence) → relief (qc-ok → end)
//
//   node tools/music-bed.mjs <ffmpeg.exe>      (run from the HyperFrames project root, after audio_meta.json)

import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const FF = process.argv[2] || "ffmpeg";
const LIB = "../../../assets/audio/music";
const SB = JSON.parse(readFileSync("../../../content/it/loi-production-sau-release/storyboard.json", "utf8"));
const META = JSON.parse(readFileSync("audio_meta.json", "utf8"));
const r2 = (n) => Math.round(n * 100) / 100;
const N = (id) => { const k = SB.scenes.findIndex((x) => x.id === id); if (k < 0) throw new Error("no scene " + id); return k + 1; };
const start = (id) => SB.scenes[N(id) - 1].start;
const startN = (n) => SB.scenes[n - 1].start;
const TOTAL = SB.durationSeconds;
const norm = (s) => String(s).normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
const wordEnd = (f, w, fb) => META.voices.find((v) => v.frame === f)?.words.find((x) => norm(x.text) === norm(w))?.end ?? fb;

const tStuck = r2(start("hunt") + wordEnd(N("hunt"), "bí", 5.2) + 0.05);   // "vẫn bí!": the comic music cuts out
const SEG = [
  { name: "tension", file: "tension-epic--opengameart-determined-pursuit-epic-orchestra-loop.mp3", from: 0, to: start("works-locally") + 0.3, fadeIn: 0, fadeOut: 0.5, lufs: -19 },
  { name: "comic", file: "comic-suspense--freesound-381531.mp3", from: start("works-locally"), to: tStuck, fadeIn: 0.25, fadeOut: 0.04, lufs: -21 },
  { name: "relief", file: "relief-upbeat--freesound-561190.mp3", from: start("qc-ok"), to: TOTAL, fadeIn: 0.15, fadeOut: 1.2, lufs: -20 },
];

const ff = (args) => execFileSync(FF, ["-hide_banner", "-loglevel", "error", "-y", ...args]);
const lufs = (f) => { const { stderr } = spawnSync(FF, ["-hide_banner", "-nostats", "-i", f, "-af", "ebur128", "-f", "null", "-"], { encoding: "utf8" }); return parseFloat([...stderr.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop()?.[1] ?? "-30"); };
mkdirSync("assets/bgm", { recursive: true });
const TMP = "assets/bgm/_tmp";
mkdirSync(TMP, { recursive: true });

// 1) each segment: cut to length (looping the source if needed), fades, level
const parts = SEG.map((s) => {
  const len = r2(s.to - s.from), raw = `${TMP}/${s.name}-raw.wav`, out = `${TMP}/${s.name}.wav`;
  ff(["-stream_loop", "-1", "-i", `${LIB}/${s.file}`, "-af",
    [`atrim=0:${len}`, "asetpts=PTS-STARTPTS", s.fadeIn ? `afade=t=in:d=${s.fadeIn}` : null, `afade=t=out:st=${r2(len - s.fadeOut)}:d=${s.fadeOut}`].filter(Boolean).join(","),
    "-ar", "48000", "-ac", "2", raw]);
  ff(["-i", raw, "-af", `volume=${(s.lufs - lufs(raw)).toFixed(2)}dB`, "-ar", "48000", "-ac", "2", out]);
  return { ...s, out, len };
});
// 2) place the segments on the timeline
const inputs = parts.flatMap((p) => ["-i", p.out]);
const place = parts.map((p, i) => `[${i}:a]adelay=${Math.round(p.from * 1000)}|${Math.round(p.from * 1000)}[m${i}]`).join(";");
ff([...inputs, "-filter_complex", `${place};${parts.map((_, i) => `[m${i}]`).join("")}amix=inputs=${parts.length}:duration=longest:normalize=0,apad=whole_dur=${TOTAL},atrim=0:${TOTAL}[a]`,
  "-map", "[a]", "-ar", "48000", "-ac", "2", `${TMP}/music.wav`]);
// 3) the narration timeline (voice clips at their frame starts) as the sidechain key
const vin = META.voices.flatMap((v) => ["-i", v.path]);
const vplace = META.voices.map((v, i) => `[${i}:a]aresample=48000,aformat=channel_layouts=stereo,adelay=${Math.round(startN(v.frame) * 1000)}|${Math.round(startN(v.frame) * 1000)}[v${i}]`).join(";");
ff([...vin, "-filter_complex", `${vplace};${META.voices.map((_, i) => `[v${i}]`).join("")}amix=inputs=${META.voices.length}:duration=longest:normalize=0,apad=whole_dur=${TOTAL},atrim=0:${TOTAL}[a]`,
  "-map", "[a]", "-ar", "48000", "-ac", "2", `${TMP}/voice.wav`]);
// 4) duck the music under the voice
ff(["-i", `${TMP}/music.wav`, "-i", `${TMP}/voice.wav`, "-filter_complex",
  "[0:a][1:a]sidechaincompress=threshold=0.02:ratio=6:attack=15:release=350:makeup=1[a]", "-map", "[a]", "-ar", "48000", "-ac", "2", "assets/bgm/bgm.wav"]);
rmSync(TMP, { recursive: true, force: true });

META.bgm = { path: "assets/bgm/bgm.wav", volume: 1 };
META.bgm_pending = false;
writeFileSync("audio_meta.json", JSON.stringify(META, null, 2) + "\n");
console.log(`bgm: ${parts.map((p) => `${p.name} ${r2(p.from)}–${r2(p.to)}s`).join(" · ")}; ducked under the narration → assets/bgm/bgm.wav`);
