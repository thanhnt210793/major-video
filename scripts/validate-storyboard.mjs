#!/usr/bin/env node
// Validates a Career POV storyboard.json against the schema in
// ai-career-pov-2d-pipeline.md §7 and the content-accuracy rules in CLAUDE.md.
//
// CLI:   node scripts/validate-storyboard.mjs <path/to/storyboard.json> [--strict]
// Hook:  reads Claude Code PostToolUse JSON from stdin when no path is given;
//        ignores files not named storyboard.json.
//
// --strict (use before render/publish): scenes that cite `unverified` research
// become errors instead of warnings.

import { readFileSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const CONTENT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "content");

const RESEARCH_STATUSES = ["verified", "simulation", "unverified"];
// draft → approved (human approved script; build may start) → published
const STORYBOARD_STATUSES = ["draft", "approved", "published"];
const SPEC = { fps: 30, width: 1080, height: 1920, minSeconds: 30, maxSeconds: 70, hookMaxSeconds: 4 };
const EPS = 1e-6;
// Pattern ids from .claude/skills/career-hook/hook-patterns.md (career-log compares retention by pattern).
const HOOK_PATTERNS = [
  "in-medias-res", "oddly-specific", "curiosity-question", "pov-stakes", "countdown",
  "myth-vs-reality", "result-first", "relatable", "wrong-move",
];
// Openers that spend the first second announcing instead of hooking (hook-patterns.md hard rule 1).
const HOOK_GREETING = /^\s*(xin chào|chào (các bạn|cả nhà|mọi người)|hello|hôm nay (mình|chúng ta|tụi mình) sẽ|trong video (này|hôm nay)|cùng (tìm hiểu|khám phá))/i;
// Channel narrator (VieNeu "Hải Đăng") speaks ~4.4–5.0 syllables/s and starts ~0.1 s in.
const SYLLABLES_PER_SECOND = 4.7;
const countSyllables = (text) => text.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;

export function validate(doc, { strict = false } = {}) {
  const errors = [];
  const warnings = [];
  const isStr = (v) => typeof v === "string" && v.trim() !== "";
  const isNum = (v) => typeof v === "number" && Number.isFinite(v);

  if (!isStr(doc.title)) errors.push("`title` must be a non-empty string.");
  if (!STORYBOARD_STATUSES.includes(doc.status))
    errors.push(`\`status\` must be one of ${STORYBOARD_STATUSES.join(", ")}.`);
  if (doc.language !== "vi-VN") warnings.push(`\`language\` is ${JSON.stringify(doc.language)}; expected "vi-VN".`);
  if (doc.fps !== SPEC.fps) errors.push(`\`fps\` must be ${SPEC.fps}.`);
  if (doc.width !== SPEC.width || doc.height !== SPEC.height)
    errors.push(`Canvas must be ${SPEC.width}x${SPEC.height}; got ${doc.width}x${doc.height}.`);
  if (!isNum(doc.durationSeconds) || doc.durationSeconds < SPEC.minSeconds || doc.durationSeconds > SPEC.maxSeconds)
    errors.push(`\`durationSeconds\` must be between ${SPEC.minSeconds} and ${SPEC.maxSeconds}.`);

  const research = Array.isArray(doc.research) ? doc.research : [];
  if (!Array.isArray(doc.research)) errors.push("`research` must be an array (may be empty).");
  const researchById = new Map();
  for (const [i, r] of research.entries()) {
    const at = `research[${i}]${r?.id ? ` (${r.id})` : ""}`;
    if (!isStr(r?.id)) { errors.push(`${at}: missing \`id\`.`); continue; }
    if (researchById.has(r.id)) errors.push(`${at}: duplicate id.`);
    researchById.set(r.id, r);
    if (!isStr(r.claim)) errors.push(`${at}: missing \`claim\`.`);
    if (!RESEARCH_STATUSES.includes(r.status))
      errors.push(`${at}: \`status\` must be one of ${RESEARCH_STATUSES.join(", ")}.`);
    if (r.status === "verified") {
      if (!isStr(r.sourceUrl) || !/^https?:\/\//.test(r.sourceUrl))
        errors.push(`${at}: verified claims need an http(s) \`sourceUrl\`.`);
      if (!isStr(r.accessedAt)) warnings.push(`${at}: verified claim has no \`accessedAt\` date.`);
    }
  }

  const scenes = Array.isArray(doc.scenes) ? doc.scenes : [];
  if (scenes.length === 0) errors.push("`scenes` must be a non-empty array.");
  const sceneIds = new Set();
  let expectedStart = 0;
  for (const [i, s] of scenes.entries()) {
    const at = `scenes[${i}]${s?.id ? ` (${s.id})` : ""}`;
    if (!isStr(s?.id)) errors.push(`${at}: missing \`id\`.`);
    else if (sceneIds.has(s.id)) errors.push(`${at}: duplicate id.`);
    else sceneIds.add(s.id);

    for (const f of ["visual", "narration", "onScreenText"])
      if (typeof s?.[f] !== "string") errors.push(`${at}: \`${f}\` must be a string.`);
    for (const f of ["assets", "sfx", "factIds"])
      if (!Array.isArray(s?.[f])) errors.push(`${at}: \`${f}\` must be an array.`);
    if (s?.ttsNarration !== undefined && typeof s.ttsNarration !== "string")
      errors.push(`${at}: \`ttsNarration\` (TTS-only spelling of the narration) must be a string.`);
    if (s?.voice !== undefined && (typeof s.voice !== "string" || !s.voice.trim()))
      errors.push(`${at}: \`voice\` (per-scene VieNeu preset override) must be a non-empty string.`);
    if (s?.sound !== undefined && typeof s.sound !== "string")
      errors.push(`${at}: \`sound\` (plain-Vietnamese sound description for the reviewer) must be a string.`);

    if (!isNum(s?.start) || !isNum(s?.duration) || s.duration <= 0) {
      errors.push(`${at}: \`start\` and positive \`duration\` (seconds) are required.`);
      continue;
    }
    if (Math.abs(s.start - expectedStart) > EPS)
      errors.push(`${at}: starts at ${s.start}s but previous scene ends at ${expectedStart}s (gap or overlap).`);
    expectedStart = s.start + s.duration;

    for (const id of Array.isArray(s.factIds) ? s.factIds : []) {
      const r = researchById.get(id);
      if (!r) errors.push(`${at}: factId "${id}" not found in \`research\`.`);
      else if (r.status === "unverified")
        (strict ? errors : warnings).push(`${at}: cites unverified claim "${id}" — verify or remove before publishing.`);
    }
  }
  if (scenes.length && isNum(doc.durationSeconds) && Math.abs(expectedStart - doc.durationSeconds) > EPS)
    errors.push(`Scenes end at ${expectedStart}s but \`durationSeconds\` is ${doc.durationSeconds}.`);
  if (isNum(scenes[0]?.duration) && scenes[0].duration > SPEC.hookMaxSeconds)
    warnings.push(`First scene is ${scenes[0].duration}s; the hook should land within ${SPEC.hookMaxSeconds}s.`);

  const first = scenes[0];
  if (first && typeof first.narration === "string") {
    if (HOOK_GREETING.test(first.narration))
      warnings.push("Scene 1 opens with a greeting or announcement; start inside the moment (career-hook hard rule 1).");
    const spoken = typeof first.ttsNarration === "string" ? first.ttsNarration : first.narration;
    const syllables = countSyllables(spoken);
    const fits = isNum(first.duration) ? Math.floor((first.duration - 0.3) * SYLLABLES_PER_SECOND) : Infinity;
    if (syllables > fits)
      warnings.push(`Scene 1 narration has ${syllables} syllables; at ~${SYLLABLES_PER_SECOND}/s it overruns the ${first.duration}s hook (fits ~${fits}).`);
  }

  if (doc.hook !== undefined) {
    const h = doc.hook;
    if (typeof h !== "object" || h === null || Array.isArray(h)) errors.push("`hook` must be an object.");
    else {
      if (!HOOK_PATTERNS.includes(h.pattern))
        errors.push(`\`hook.pattern\` must be one of ${HOOK_PATTERNS.join(", ")} (see .claude/skills/career-hook/hook-patterns.md).`);
      if (!isStr(h.promise)) errors.push("`hook.promise` must be a non-empty string.");
      if (!sceneIds.has(h.payoffSceneId))
        errors.push(`\`hook.payoffSceneId\` ${JSON.stringify(h.payoffSceneId)} is not a scene id.`);
      else if (h.payoffSceneId === first?.id)
        errors.push("`hook.payoffSceneId` must be a later scene; the hook can't pay off its own promise.");
      if (h.alternatives !== undefined && !(Array.isArray(h.alternatives) && h.alternatives.every(isStr)))
        errors.push("`hook.alternatives` must be an array of strings.");
    }
  }

  return { errors, warnings };
}

// Videos live in content/<group>/<name>/, with <group> listed in content/nhom-nganh.json.
// Files outside content/ (e.g. test copies) are not checked.
export function checkLocation(file) {
  const rel = relative(CONTENT, resolve(file));
  if (rel.startsWith("..") || isAbsolute(rel)) return [];
  const parts = rel.split(sep);
  if (parts.length !== 3)
    return [`Storyboard should be at content/<group>/<name>/storyboard.json (groups in content/nhom-nganh.json); got content/${parts.join("/")}.`];
  const [group, name] = parts;
  const warnings = [];
  let groups = [];
  try { groups = JSON.parse(readFileSync(join(CONTENT, "nhom-nganh.json"), "utf8")).groups.map((g) => g.id); } catch {}
  if (!groups.includes(group))
    warnings.push(`Group folder "${group}" is not in content/nhom-nganh.json (${groups.join(", ")}). Add it there or move the video.`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name))
    warnings.push(`Video folder "${name}" should be short ASCII kebab-case (Vietnamese without diacritics is fine).`);
  return warnings;
}

function readStdin() {
  try { return readFileSync(0, "utf8"); } catch { return ""; }
}

function main() {
  const args = process.argv.slice(2);
  const strict = args.includes("--strict");
  let file = args.find((a) => !a.startsWith("--"));
  const hookMode = !file;

  if (hookMode) {
    try { file = JSON.parse(readStdin())?.tool_input?.file_path; } catch { return 0; }
    if (!file || basename(file) !== "storyboard.json") return 0;
  }

  let doc;
  try {
    doc = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    console.error(`storyboard validation failed for ${file}:\n  - invalid JSON: ${e.message}`);
    return 2;
  }

  const { errors, warnings } = validate(doc, { strict });
  warnings.push(...checkLocation(file));
  const lines = [
    ...errors.map((m) => `  ERROR ${m}`),
    ...warnings.map((m) => `  WARN  ${m}`),
  ];

  if (errors.length) {
    console.error(`storyboard validation failed for ${file}:\n${lines.join("\n")}`);
    return 2;
  }
  if (warnings.length) {
    const msg = `storyboard warnings for ${file}:\n${lines.join("\n")}`;
    if (hookMode)
      console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: msg } }));
    else console.log(msg);
    return 0;
  }
  if (!hookMode) console.log(`OK ${file}`);
  return 0;
}

// Run only as a CLI or hook; scripts/kichban.mjs imports validate().
const isMain = process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (isMain) process.exitCode = main();
