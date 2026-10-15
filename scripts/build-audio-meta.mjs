#!/usr/bin/env node
// Bridges VieNeu-TTS narration into the HyperFrames faceless-explainer audio
// contract. Writes <hyperframes>/audio_meta.json in the shape that
// audio.mjs sync-durations, captions.mjs and assemble-index.mjs consume:
//   { bgm, bgm_pending, voices: [{ frame, path, duration_s, words: [{id,text,start,end}] }], sfx }
// (frame-relative word times; `path` relative to the HyperFrames project).
//
// Word timings come from `npx hyperframes transcribe` (Whisper, Vietnamese);
// caption TEXT always comes from storyboard.json `narration`, so captions keep
// correct diacritics even when Whisper mishears. A transcript that doesn't
// match the script is flagged — VieNeu can occasionally add words
// (github.com/pnnbao97/VieNeu-TTS/issues/213) — and must be listened to.
//
// Usage:
//   node scripts/build-audio-meta.mjs --storyboard content/<slug>/storyboard.json --hyperframes videos/<slug>
//     [--voice-dir assets/voice] [--model large-v3-turbo|small] [--no-transcribe]
//     [--bgm assets/music/<file> --bgm-volume 0.2]
// Existing `sfx` (and `bgm` unless --bgm is given) in audio_meta.json are preserved.

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const argv = process.argv.slice(2);
const flag = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : def;
};
const die = (m) => {
  console.error(`✗ build-audio-meta: ${m}`);
  process.exit(1);
};

const storyboardPath = flag("storyboard");
const hfDir = flag("hyperframes");
if (!storyboardPath || !hfDir) die("--storyboard and --hyperframes are required");
const voiceDir = flag("voice-dir", "assets/voice");
const model = flag("model", "large-v3-turbo");
const transcribe = !argv.includes("--no-transcribe");
const bgmPath = flag("bgm");
const bgmVolume = Number(flag("bgm-volume", "0.2"));

const r3 = (n) => Math.round(n * 1000) / 1000;
const isWin = process.platform === "win32";
const q = (s) => (isWin ? `"${s}"` : s);

function run(cmd, args) {
  // npx is a .cmd shim on Windows and needs a shell; quote args ourselves.
  const res = isWin
    ? spawnSync([cmd, ...args.map(q)].join(" "), { shell: true, encoding: "utf8" })
    : spawnSync(cmd, args, { encoding: "utf8" });
  if (res.status !== 0) die(`${cmd} ${args.join(" ")} failed:\n${res.stderr || res.stdout}`);
  return res.stdout;
}

function probeDuration(file) {
  const out = run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]);
  const d = Number(out.trim());
  if (!Number.isFinite(d) || d <= 0) die(`could not read duration of ${file}`);
  return d;
}

function whisperWords(file) {
  const dir = mkdtempSync(join(tmpdir(), "hf-transcribe-"));
  try {
    const out = run("npx", ["hyperframes", "transcribe", file, "--model", model, "--language", "vi", "--dir", dir]);
    // transcribe exits 0 and only prints "Captions skipped" when whisper-cpp is missing.
    const tPath = join(dir, "transcript.json");
    if (!existsSync(tPath))
      die(`no transcript for ${file} — is HYPERFRAMES_WHISPER_PATH set (see CLAUDE.md)? Output:\n${out}`);
    const t = JSON.parse(readFileSync(tPath, "utf8"));
    return (Array.isArray(t) ? t : t.words ?? []).filter((w) => String(w.text ?? "").trim());
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const norm = (s) =>
  String(s)
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");

// LCS diff on normalized tokens → words only in the transcript / only in the script.
function diff(script, heard) {
  const a = script.map(norm);
  const b = heard.map(norm);
  const L = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const missing = [];
  const extra = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) missing.push(script[i++]);
    else extra.push(heard[j++]);
  }
  while (i < a.length) missing.push(script[i++]);
  while (j < b.length) extra.push(heard[j++]);
  return { missing, extra };
}

// Spread script tokens over [t0, t1] proportionally to their length.
function spread(tokens, t0, t1) {
  const weights = tokens.map((t) => Math.max(1, norm(t).length));
  const total = weights.reduce((x, y) => x + y, 0);
  let t = t0;
  return tokens.map((text, k) => {
    const d = ((t1 - t0) * weights[k]) / total;
    const w = { text, start: r3(t), end: r3(t + d) };
    t += d;
    return w;
  });
}

const doc = JSON.parse(readFileSync(storyboardPath, "utf8"));
const metaPath = join(hfDir, "audio_meta.json");
const prev = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : {};

const voices = [];
const report = [];
const missingFiles = [];

doc.scenes.forEach((scene, idx) => {
  const frame = idx + 1;
  const tokens = String(scene.narration ?? "").trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return;
  const rel = `${voiceDir}/${String(frame).padStart(2, "0")}.wav`.replace(/\\/g, "/");
  const abs = resolve(hfDir, rel);
  if (!existsSync(abs)) { missingFiles.push(rel); return; }

  const duration = probeDuration(abs);
  let words;
  let status = "estimated (no transcription)";
  if (transcribe) {
    const heard = whisperWords(abs);
    const { missing, extra } = diff(tokens, heard.map((w) => w.text));
    if (heard.length === tokens.length) {
      words = tokens.map((text, k) => ({ text, start: r3(heard[k].start), end: r3(heard[k].end) }));
    } else {
      const t0 = heard.length ? heard[0].start : 0;
      const t1 = heard.length ? heard[heard.length - 1].end : duration;
      words = spread(tokens, t0, t1);
    }
    status = missing.length || extra.length
      ? `MISMATCH — listen. missing: [${missing.join(" ")}] extra: [${extra.join(" ")}]`
      : heard.length === tokens.length ? "ok" : "ok (timings estimated: token count differs)";
  } else {
    words = spread(tokens, 0, duration);
  }

  voices.push({
    frame,
    path: rel,
    duration_s: r3(duration),
    words: words.map((w, k) => ({ id: `w${k}`, ...w })),
  });
  const over = duration > scene.duration + 1e-3 ? ` (voice ${r3(duration)}s > storyboard ${scene.duration}s)` : "";
  report.push(`[${String(frame).padStart(2, "0")}] ${scene.id}: ${r3(duration)}s · ${status}${over}`);
});

if (missingFiles.length) die(`missing narration WAVs (run scripts/tts_vieneu.py first): ${missingFiles.join(", ")}`);

const meta = {
  bgm: bgmPath ? { path: bgmPath.replace(/\\/g, "/"), volume: bgmVolume } : prev.bgm ?? null,
  bgm_pending: false,
  voices,
  sfx: prev.sfx ?? [],
};
if (meta.bgm && !existsSync(resolve(hfDir, meta.bgm.path))) die(`bgm ${meta.bgm.path} not found under ${hfDir}`);
writeFileSync(metaPath, JSON.stringify(meta, null, 2));

console.log(report.join("\n"));
console.log(`✓ wrote ${metaPath}: ${voices.length} voice(s), ${meta.bgm ? "bgm" : "no bgm"}, ${meta.sfx.length} sfx`);
if (report.some((l) => l.includes("MISMATCH")))
  console.log("⚠ Some narration does not match the script. Listen to those frames; regenerate with tts_vieneu.py --scene <id> if words were added or dropped.");
