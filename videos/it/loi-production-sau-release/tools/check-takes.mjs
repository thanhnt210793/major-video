#!/usr/bin/env node
// Transcribes every take of the given scenes (from tools/expressive_takes.py) with Whisper and
// prints which ones say the script, so a lively take that changed a word is never used.
//
//   node tools/check-takes.mjs <scene number> [...]     (run from the HyperFrames project root)

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const RAW = "../../../content/it/loi-production-sau-release/audio/tts-raw";
const LOG = JSON.parse(readFileSync(`${RAW}/takes-log.json`, "utf8"));
const norm = (s) => String(s).normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, " ").replace(/\s+/g, " ").trim();
const TMP = join(RAW, "_whisper");

for (const n of process.argv.slice(2).map((x) => String(x).padStart(2, "0"))) {
  const entry = LOG[n];
  if (!entry) { console.log(`${n}: no takes logged`); continue; }
  const want = norm(entry.ttsText);
  for (const c of entry.candidates) {
    const f = join(RAW, "_takes", c.file);
    rmSync(TMP, { recursive: true, force: true }); mkdirSync(TMP, { recursive: true });
    try { execFileSync("npx", ["hyperframes", "transcribe", f, "--model", "large-v3-turbo", "--language", "vi", "--dir", TMP], { stdio: "ignore", shell: true }); } catch {}
    const tj = readdirSync(TMP).find((x) => x.endsWith(".json"));
    const got = tj ? norm(JSON.parse(readFileSync(join(TMP, tj), "utf8")).map?.((w) => w.text).join(" ") ?? "") : "";
    const gw = got.split(" "), ww = want.split(" ");
    const hit = ww.filter((w) => gw.includes(w)).length / ww.length;
    console.log(`${n} take ${c.take}${entry.chosen === c.take ? " (chosen)" : ""}  pitch ${c.pitch_std_st}  match ${(hit * 100).toFixed(0)}%  heard: ${got}`);
  }
}
rmSync(TMP, { recursive: true, force: true });
