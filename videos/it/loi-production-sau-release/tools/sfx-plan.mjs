#!/usr/bin/env node
// Sound effects for "loi-production-sau-release", following each scene's `sound` text.
// 1) Prepares assets/sfx/<cue>.mp3 from the channel's CC0 library (../../../assets/audio/sfx):
//    trims, fades, loops beds to length, and levels them (accents by peak, beds by loudness).
// 2) Writes audio_meta.json sfx[] (frame-relative offsets from the narration word timings,
//    same formulas as tools/gen-frames.mjs).
// 3) Writes ../../../content/it/loi-production-sau-release/audio-manifest.json.
//
//   node tools/sfx-plan.mjs <ffmpeg.exe>      (run from the HyperFrames project root, after audio_meta.json)

import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const FF = process.argv[2] || "ffmpeg";
const LIB = "../../../assets/audio/sfx";
const SB = JSON.parse(readFileSync("../../../content/it/loi-production-sau-release/storyboard.json", "utf8"));
const META = JSON.parse(readFileSync("audio_meta.json", "utf8"));
const RUN = JSON.parse(readFileSync("../../../content/it/loi-production-sau-release/audio/tts-raw/vieneu-run.json", "utf8"));
const r2 = (n) => Math.round(n * 100) / 100;
rmSync("assets/sfx", { recursive: true, force: true });
mkdirSync("assets/sfx", { recursive: true });

// ── word cues (same as gen-frames.mjs) ──
const norm = (s) => String(s).normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
const voice = (f) => META.voices.find((x) => x.frame === f);
const word = (f, w, nth = 1) => { let k = 0; for (const x of voice(f)?.words ?? []) if (norm(x.text) === norm(w) && ++k === nth) return x; return null; };
const cue = (f, w, nth = 1, fb = 0) => word(f, w, nth)?.start ?? fb;
const cueEnd = (f, w, nth = 1, fb = 0) => word(f, w, nth)?.end ?? fb;
const voiceEnd = (f, fb) => { const v = voice(f); return v?.words?.length ? v.words[v.words.length - 1].end : fb; };
const D = (n) => SB.scenes[n - 1].duration;

// ── source files (one candidate per cue, chosen from the library) ──
const SRC = {
  "error-beep": "error-beep--freesound-145287.mp3", notification: "notification--freesound-740423.mp3",
  "clock-tick": "clock-tick--freesound-212181.mp3", heartbeat: "heartbeat--freesound-688735.mp3",
  "comedic-spring": "comedic-spring--freesound-540790.mp3", "scroll-ticks": "scroll-ticks--freesound-256459.mp3",
  "record-scratch": "record-scratch--freesound-647583.mp3", "dramatic-sting": "dramatic-sting--freesound-668130.mp3",
  "chair-swivel": "chair-swivel--freesound-125139.mp3", whoosh: "whoosh--freesound-585257.mp3",
  "success-chime": "success-chime--freesound-538147.mp3", tap: "tap--freesound-332713.mp3",
  "team-cheer": "team-cheer--freesound-353923.mp3", "high-five": "high-five--freesound-467997.mp3",
  "relief-sigh": "relief-sigh--freesound-615223.mp3", "pen-strike": "pen-strike--freesound-667399.mp3",
  "soft-pop": "soft-pop--freesound-447910.mp3",
  // round 2 ("kinh thiên động địa"): CC0, sourced 2026-10-27
  alarm: "alarm--freesound-423929.mp3", braam: "braam--freesound-697057.mp3", riser: "riser--freesound-685256.mp3",
  glitch: "glitch--freesound-458065.mp3", "phone-buzz": "phone-buzz--freesound-173562.mp3", gasp: "gasp--freesound-349692.mp3",
  "typing-fast": "typing-fast--freesound-813214.mp3", "impact-whoosh": "impact-whoosh--freesound-434873.mp3",
  "confetti-pop": "confetti-pop--freesound-26349.mp3", "confetti-sparkle": "confetti-sparkle--freesound-715067.mp3",
};
const MUSIC = ["tension-epic--opengameart-determined-pursuit-epic-orchestra-loop.mp3", "comic-suspense--freesound-381531.mp3", "relief-upbeat--freesound-561190.mp3"];

const ff = (args) => execFileSync(FF, ["-hide_banner", "-loglevel", "error", "-y", ...args]);
const peak = (f) => { const { stderr } = spawnSync(FF, ["-hide_banner", "-nostats", "-i", f, "-af", "volumedetect", "-f", "null", "-"], { encoding: "utf8" }); return parseFloat(/max_volume: (-?[\d.]+) dB/.exec(stderr)?.[1] ?? "0"); };
const lufs = (f) => { const { stderr } = spawnSync(FF, ["-hide_banner", "-nostats", "-i", f, "-af", "ebur128", "-f", "null", "-"], { encoding: "utf8" }); return parseFloat([...stderr.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop()?.[1] ?? "-30"); };

// accent: trim/fade, then peak-normalize to -3 dBFS. bed: loop to `len`, fades, loudness-normalize to `lufs`.
const made = {};
function make(name, cueName, { trim, fadeOut, loopTo, fadeIn = 0, target } = {}) {
  const src = `${LIB}/${SRC[cueName]}`, out = `assets/sfx/${name}.mp3`, tmp = `assets/sfx/${name}.tmp.wav`;
  const af = [];
  const len = loopTo ?? trim;
  if (len) af.push(`atrim=0:${len}`, "asetpts=PTS-STARTPTS");
  if (fadeIn) af.push(`afade=t=in:d=${fadeIn}`);
  if (fadeOut && len) af.push(`afade=t=out:st=${r2(len - fadeOut)}:d=${fadeOut}`);
  ff([...(loopTo ? ["-stream_loop", "-1"] : []), "-i", src, "-af", af.join(",") || "anull", "-ar", "48000", "-ac", "2", tmp]);
  const gain = target != null ? target - lufs(tmp) : -3 - peak(tmp);
  ff(["-i", tmp, "-af", `volume=${gain.toFixed(2)}dB,alimiter=limit=0.95`, "-ar", "48000", "-ac", "2", "-b:a", "192k", out]);
  spawnSync(process.platform === "win32" ? "cmd" : "rm", process.platform === "win32" ? ["/c", "del", "/q", tmp.replaceAll("/", "\\")] : ["-f", tmp]);
  made[name] = { file: out, source: SRC[cueName], processing: [len ? `trim ${len}s${loopTo ? " (looped)" : ""}` : null, fadeIn ? `fade in ${fadeIn}s` : null, fadeOut ? `fade out ${fadeOut}s` : null, target != null ? `${target} LUFS` : "peak −3 dBFS"].filter(Boolean).join(", ") };
  return out;
}

// scene ids → frame numbers (frames follow the storyboard order)
const N = (id) => { const k = SB.scenes.findIndex((x) => x.id === id); if (k < 0) throw new Error("no scene " + id); return k + 1; };
const DI = (id) => D(N(id));
const startOf = (id) => SB.scenes[N(id) - 1].start;

// ── beds spanning several frames ──
const tensionLen = r2(DI("meeting") + DI("boss") + DI("mitigate"));      // meeting → end of mitigate
const alarmLen = r2(DI("hook") + DI("escalate"));                         // hook → end of escalate
const hbSoftStart = 1.0, hbSoftLen = r2(DI("meeting") - hbSoftStart + DI("boss"));
const hbDisc = voiceEnd(N("discover"), DI("discover") - 0.8) + 0.3, nodOwn = voiceEnd(N("own-it"), DI("own-it") - 0.6) + 0.1;
const hbStrongLen = r2(DI("discover") - hbDisc + nodOwn);
make("alarm-bed", "alarm", { loopTo: alarmLen, fadeOut: 1.2, target: -24 });
make("clock-tick-bed", "clock-tick", { loopTo: tensionLen, fadeIn: 0.2, fadeOut: DI("mitigate"), target: -28 });
make("heartbeat-soft", "heartbeat", { loopTo: hbSoftLen, fadeIn: 1.0, fadeOut: 0.4, target: -26 });
make("heartbeat-strong", "heartbeat", { loopTo: hbStrongLen, fadeIn: 0.15, fadeOut: 0.06, target: -20 });
make("clock-fast", "clock-tick", { trim: 1.8, fadeOut: 0.3, target: -26 });
// ── accents ──
for (const c of ["error-beep", "notification", "comedic-spring", "record-scratch", "chair-swivel", "whoosh", "success-chime", "tap", "high-five", "pen-strike", "soft-pop", "glitch", "phone-buzz", "gasp", "impact-whoosh", "confetti-pop", "confetti-sparkle"]) make(c, c);
make("braam", "braam", { trim: 2.6, fadeOut: 0.8 });
make("riser", "riser", { trim: 2.9, fadeOut: 0.05 });
make("scroll-ticks", "scroll-ticks", { trim: 1.6, fadeOut: 0.3 });
make("typing-fast", "typing-fast", { trim: 1.8, fadeOut: 0.3 });
make("dramatic-sting", "dramatic-sting", { trim: 2.0, fadeOut: 0.6 });
make("team-cheer", "team-cheer", { trim: 2.2, fadeOut: 0.6 });
make("relief-sigh", "relief-sigh", { trim: 1.1, fadeOut: 0.3 });

// ── cue sheet ──
const S = [];
const at = (frame, name, offset, volume, duration) => S.push({ frame, file: made[name].file, offset_s: r2(Math.max(0, offset)), duration_s: r2(duration ?? 3), volume });
const dur = (f) => { const { stderr } = spawnSync(FF, ["-hide_banner", "-i", f], { encoding: "utf8" }); const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(stderr); return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 1; };
const A = (id, name, offset, volume) => at(N(id), name, offset, volume, dur(made[name].file));
const B = (id, name, offset, volume, duration) => at(N(id), name, offset, volume, duration);
const c = (id, w, nth, fb) => cue(N(id), w, nth, fb), ce = (id, w, nth, fb) => cueEnd(N(id), w, nth, fb), ve = (id, fb) => voiceEnd(N(id), fb);
// hook: alarm from frame 0, the big boom, glitches, a beep per new error toast
B("hook", "alarm-bed", 0, 1, alarmLen);
A("hook", "braam", 0.03, 0.8);
A("hook", "glitch", 0.32, 0.55); A("hook", "glitch", DI("hook") * 0.55, 0.45);
[0, 1, 2, 3].forEach((k) => A("hook", "error-beep", 0.25 + k * 0.3, 0.22));
// escalate
A("escalate", "error-beep", 0.35, 0.35);
A("escalate", "phone-buzz", 1.5, 0.55);
[1.6, 1.88, 2.16].forEach((t) => A("escalate", "notification", t, 0.3));
const tBoss2 = Math.max(2.35, c("escalate", "sếp", 1, 2.6) - 0.25);
A("escalate", "notification", tBoss2, 0.4); A("escalate", "glitch", tBoss2, 0.4); A("escalate", "gasp", tBoss2 + 0.05, 0.5);
// meeting → mitigate: tension beds under the music
B("meeting", "clock-tick-bed", 0, 1, tensionLen); B("meeting", "heartbeat-soft", hbSoftStart, 1, hbSoftLen);
// boss: crash zoom on "mười phút" (the deadline), the boom after it
A("boss", "impact-whoosh", c("boss", "mười", 1, 1.6) - 0.12, 0.6);
A("boss", "braam", ve("boss", 3.9) + 0.15, 0.75);
// mitigate
A("mitigate", "whoosh", c("mitigate", "sửa", 1, 3.6), 0.45);
// self-talk
A("works-locally", "comedic-spring", c("works-locally", "ơ", 1, 0.1) - 0.15, 0.5);
A("works-locally", "scroll-ticks", c("works-locally", "đoạn", 1, 2.2), 0.35);
A("works-locally", "whoosh", c("works-locally", "hay", 1, 4.1), 0.35);
// hunt: the rollback lands, then pull requests → diff → search ("mười phút"), the deadline struck and the clock racing
// ("nửa tiếng"), "vẫn bí", the riser into the reveal
const tL = c("hunt", "lục", 1, 2.0), tDo = c("hunt", "dò", 1, 3.2), tM = c("hunt", "mười", 1, 3.9), tN = c("hunt", "nửa", 1, 4.6), tB = c("hunt", "bí", 1, 5.4);
A("hunt", "success-chime", 0.7, 0.45);
A("hunt", "whoosh", tL, 0.35); A("hunt", "typing-fast", tL + 0.1, 0.35);
A("hunt", "whoosh", tDo, 0.3); A("hunt", "scroll-ticks", tDo, 0.35);
A("hunt", "whoosh", tM, 0.3); A("hunt", "clock-fast", tM, 0.9);
A("hunt", "pen-strike", tN, 0.5);
A("hunt", "relief-sigh", tB + 0.15, 0.55);
const tV = ce("discover", "vậy", 1, 1.0);
const riserAt = startOf("discover") + tV - 2.85;                           // ends on "vậy?" — starts inside the hunt
at(riserAt < startOf("discover") ? N("hunt") : N("discover"), "riser", r2(riserAt - (riserAt < startOf("discover") ? startOf("hunt") : startOf("discover"))), 0.55, dur(made.riser.file));
// discover: the record scratch, the comic sting, then the heartbeat
A("discover", "record-scratch", tV + 0.02, 0.75);
A("discover", "dramatic-sting", ve("discover", 3.4) + 0.05, 0.6);
B("discover", "heartbeat-strong", hbDisc, 1, hbStrongLen);
// own-it: the swivel straight away (the heartbeat from discover runs on to the nod)
A("own-it", "chair-swivel", 0.1, 0.5);
// fix-check
A("fix-check", "typing-fast", Math.max(0.05, c("fix-check", "sửa", 1, 0.3) - 0.2), 0.35);
A("fix-check", "tap", c("fix-check", "mai", 1, 1.1) + 0.65, 0.55);
// qc-ok
A("qc-ok", "success-chime", 0.05, 0.5); A("qc-ok", "confetti-pop", 0.1, 0.55); A("qc-ok", "confetti-sparkle", 0.18, 0.45);
// release
const tX = ce("release", "xong", 1, 1.0), tClap = Math.max(1.75, tX + 0.85);
A("release", "whoosh", 0.1, 0.4);
A("release", "team-cheer", tClap - 0.05, 0.35); A("release", "high-five", tClap, 0.6);
A("release", "confetti-pop", tClap, 0.45); A("release", "confetti-sparkle", tClap + 0.08, 0.4);
A("release", "relief-sigh", ve("release", 3.76) + 0.05, 0.5);
// postmortem
const tPn = c("postmortem", "người", 1, 4.0);
A("postmortem", "pen-strike", tPn - 0.2, 0.55); A("postmortem", "soft-pop", Math.min(DI("postmortem") - 1.2, tPn + 0.35), 0.4);
// question
A("question", "soft-pop", Math.max(0.3, c("question", "bạn", 1, 0.3)), 0.4);

META.sfx = S;
writeFileSync("audio_meta.json", JSON.stringify(META, null, 2) + "\n");

// ── audio manifest ──
const LICENSES = readFileSync("../../../assets/LICENSES.md", "utf8");
const rowFor = (src) => LICENSES.split("\n").find((l) => l.includes(`audio/sfx/${src}`) || l.includes(`audio/sfx/kenney/${src}`) || l.includes(`audio/music/${src}`));
const cells = (row) => row.split("|").slice(1, -1).map((c) => c.trim());
const vb = JSON.parse(readFileSync("assets/voice/voice-build.json", "utf8"));
const items = [{
  type: "narration", files: "videos/it/loi-production-sau-release/assets/voice/*.wav",
  source: `VieNeu-TTS v3 Turbo, SDK ${RUN.sdkVersion}, preset voices Hải Đăng (narrator), Thiền Tâm Đức (sếp), Thái Sơn (anh Quân), Trúc Ly (chị Mai)`,
  sourceUrl: "https://github.com/pnnbao97/VieNeu-TTS",
  license: "Apache-2.0 (code and weights); preset-voice output allowed for commercial use per model card",
  attribution: "not required in the audio; credit the project if redistributing the model",
  notes: `The meeting, mitigate and discover lines reuse the audition takes the reviewer picked (content/it/loi-production-sau-release/audio/thu-giong/raw/). Treatments and loudness: videos/it/loi-production-sau-release/assets/voice/voice-build.json (${vb.lines.length} lines at ${vb.target_lufs} LUFS).`,
}];
for (const [name, m] of Object.entries(made)) {
  const row = rowFor(m.source), c = row ? cells(row) : [];
  items.push({ type: "sfx", file: `videos/it/loi-production-sau-release/${m.file}`, source: c[2] ?? m.source, sourceUrl: c[3] ?? "", license: c[4] ?? "see assets/LICENSES.md",
    attribution: c[5] ?? "", notes: `from assets/audio/sfx/${m.source}; ${m.processing}${row ? "" : "; WARN no ledger row found"}` });
}
for (const m of MUSIC) { const row = rowFor(m), c = row ? cells(row) : []; items.push({ type: "music", file: `assets/audio/music/${m}`, source: c[2] ?? m, sourceUrl: c[3] ?? "", license: c[4] ?? "see assets/LICENSES.md", attribution: c[5] ?? "", notes: `placed, levelled and ducked under the narration by tools/music-bed.mjs into videos/it/loi-production-sau-release/assets/bgm/bgm.wav${row ? "" : "; WARN no ledger row found"}` }); }
writeFileSync("../../../content/it/loi-production-sau-release/audio-manifest.json", JSON.stringify({ items }, null, 2) + "\n");
console.log(`prepared ${Object.keys(made).length} sfx files, ${S.length} cues; manifest ${items.length} items`);
for (const i of items) if (i.notes.includes("WARN")) console.log("WARN", i.file);
