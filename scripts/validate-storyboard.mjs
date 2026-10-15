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
import { basename } from "node:path";

const RESEARCH_STATUSES = ["verified", "simulation", "unverified"];
// draft → approved (human approved script; build may start) → published
const STORYBOARD_STATUSES = ["draft", "approved", "published"];
const SPEC = { fps: 30, width: 1080, height: 1920, minSeconds: 30, maxSeconds: 60, hookMaxSeconds: 4 };
const EPS = 1e-6;

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

  return { errors, warnings };
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

process.exitCode = main();
